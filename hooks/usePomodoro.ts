import { useState, useEffect, useCallback, useRef } from 'react';
import { TimerMode, Settings, DEFAULT_SETTINGS } from '../types';
import { ALARM_AUDIO_URL } from '../constants';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

const STORAGE_KEY = 'pomodoro-settings-v1';

export const usePomodoro = () => {
  // --- State ---
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge saved settings with defaults to ensure all keys exist
        return { ...DEFAULT_SETTINGS, ...(parsed || {}) };
      }
      return DEFAULT_SETTINGS;
    } catch (e) {
      console.warn("Failed to parse settings from local storage, using defaults", e);
      return DEFAULT_SETTINGS;
    }
  });

  const [mode, setMode] = useState<TimerMode>(TimerMode.WORK);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio
  useEffect(() => {
    audioRef.current = new Audio(ALARM_AUDIO_URL);
  }, []);

  // Initialize Supabase Auth & Sync
  useEffect(() => {
    // Check active session safely
    supabase.auth.getSession().then(({ data, error }) => {
      if (!error && data?.session) {
        setUser(data.session.user);
        if (data.session.user.user_metadata?.settings) {
          // Merge cloud settings with defaults to ensure safety
          setSettings(prev => ({ ...prev, ...data.session.user.user_metadata.settings }));
        }
      }
    }).catch(err => console.error("Supabase session check failed", err));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser?.user_metadata?.settings) {
         setSettings(prev => ({ ...prev, ...currentUser.user_metadata.settings }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist Settings to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // --- Logic Helpers ---

  const getDurationForMode = useCallback((m: TimerMode, currentSettings: Settings) => {
    // Safety check for duration values
    const safeSettings = { ...DEFAULT_SETTINGS, ...currentSettings };
    switch (m) {
      case TimerMode.WORK: return (safeSettings.workDuration || 25) * 60;
      case TimerMode.SHORT_BREAK: return (safeSettings.shortBreakDuration || 5) * 60;
      case TimerMode.LONG_BREAK: return (safeSettings.longBreakDuration || 15) * 60;
      default: return 25 * 60;
    }
  }, []);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(getDurationForMode(newMode, settings));
  }, [settings, getDurationForMode]);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    
    // Play Sound
    audioRef.current?.play().catch(e => console.error("Audio play failed", e));

    // Browser Notification
    if (Notification.permission === 'granted') {
      new Notification("FocusFlow", {
        body: mode === TimerMode.WORK ? "Time for a break!" : "Break is over, time to focus!",
        icon: '/favicon.ico'
      });
    }

    let nextMode = TimerMode.WORK;
    let shouldAutoStart = false;

    if (mode === TimerMode.WORK) {
      const newCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newCompleted);
      
      const interval = settings.longBreakInterval || 4; // fallback to 4
      if (newCompleted % interval === 0) {
        nextMode = TimerMode.LONG_BREAK;
      } else {
        nextMode = TimerMode.SHORT_BREAK;
      }
      shouldAutoStart = settings.autoStartBreaks;
    } else {
      nextMode = TimerMode.WORK;
      shouldAutoStart = settings.autoStartPomodoros;
    }

    setMode(nextMode);
    setTimeLeft(getDurationForMode(nextMode, settings));
    
    if (shouldAutoStart) {
      setIsActive(true);
    }
  }, [mode, sessionsCompleted, settings, getDurationForMode]);

  // --- Timer Tick ---
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleTimerComplete]);

  // --- Controls ---

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(getDurationForMode(mode, settings));
  };

  const skipTimer = () => {
    handleTimerComplete();
  };

  const updateSettings = async (newSettings: Settings) => {
    setSettings(newSettings);
    // Update local immediately handled by useEffect
    // Update time if idle
    if (!isActive) {
      const currentDuration = getDurationForMode(mode, settings);
      const newDuration = getDurationForMode(mode, newSettings);
      if (timeLeft === currentDuration) {
          setTimeLeft(newDuration);
      }
    }
    // Sync to Supabase if logged in
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: { settings: newSettings }
        });
      } catch (err) {
        console.error("Failed to sync settings", err);
      }
    }
  };

  // --- Auth Handlers ---
  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (e: any) {
      setAuthError(e.message || "Failed to sign in");
    } finally {
      setAuthLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error, data } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // If sign up successful but no session (email confirmation), warn user
      if (data.user && !data.session) {
         setAuthError("Please check your email to confirm your account.");
      }
    } catch (e: any) {
      setAuthError(e.message || "Failed to sign up");
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    try {
      await supabase.auth.signOut();
      // On sign out, we can choose to keep current settings or reset. 
      // Keeping them is usually better UX unless security is paramount.
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  const clearAuthError = () => setAuthError(null);

  // Check notification permission
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    mode,
    timeLeft,
    isActive,
    sessionsCompleted,
    settings,
    user,
    authError,
    authLoading,
    toggleTimer,
    resetTimer,
    skipTimer,
    updateSettings,
    setMode: switchMode,
    signIn,
    signUp,
    signOut,
    clearAuthError
  };
};