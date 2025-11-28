import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { usePomodoro } from './hooks/usePomodoro';
import { CircularProgress } from './components/CircularProgress';
import { Controls } from './components/Controls';
import { SettingsModal } from './components/SettingsModal';
import { TaskInput } from './components/TaskInput';
import { TimerMode } from './types';
import { MODE_COLORS, MODE_LABELS, MOTIVATIONAL_QUOTES } from './constants';

const App: React.FC = () => {
  const {
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
    setMode,
    signIn,
    signUp,
    signOut,
    clearAuthError
  } = usePomodoro();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);

  // Rotate quote occasionally or on session change
  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, [sessionsCompleted, mode]);

  // Helper to format time as mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalTime = mode === TimerMode.WORK 
    ? settings.workDuration * 60 
    : mode === TimerMode.SHORT_BREAK 
      ? settings.shortBreakDuration * 60 
      : settings.longBreakDuration * 60;

  const colors = MODE_COLORS[mode];
  const currentSessionInCycle = sessionsCompleted % settings.longBreakInterval;
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.gradient} transition-all duration-1000 ease-in-out flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans`}>
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white blur-[100px] opacity-60" />
      </div>

      {/* Main Container - Card Style */}
      <main className="w-full max-w-lg z-10 flex flex-col items-center">
        
        {/* Top Bar: Settings */}
        <div className="w-full flex justify-end absolute top-6 right-6 z-30 pointer-events-none">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="pointer-events-auto p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-sm border border-white/10 shadow-lg relative"
          >
            <SettingsIcon size={24} />
            {user && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-400 border border-white rounded-full"></span>
            )}
          </button>
        </div>

        <div className="w-full flex flex-col items-center animate-fade-in-up">
          
          {/* Mode Switcher */}
          <div className="relative z-20 flex bg-black/20 p-1.5 rounded-full backdrop-blur-lg border border-white/10 mb-6 shadow-inner">
            {(Object.values(TimerMode) as TimerMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  mode === m 
                    ? 'bg-white text-gray-900 shadow-lg scale-105' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {MODE_LABELS[m]}
              </button>
            ))}
          </div>

          {/* Task Input */}
          <TaskInput />

          {/* Motivational Quote */}
          <div className="h-8 mb-2 flex items-center justify-center">
            <p className="text-white/90 font-medium text-lg tracking-wide animate-fade-in text-center shadow-sm">
              {isActive ? quote : "Ready to focus?"}
            </p>
          </div>

          {/* Main Timer */}
          <CircularProgress
            mode={mode}
            timeLeft={timeLeft}
            totalTime={totalTime}
          >
            <div className="flex flex-col items-center justify-center">
               <div className="text-[5.5rem] leading-none font-bold tracking-tighter tabular-nums text-white drop-shadow-lg">
                 {formatTime(timeLeft)}
               </div>
               <p className={`mt-2 text-lg font-medium tracking-widest uppercase ${colors.accent} opacity-90`}>
                 {isActive ? 'In Progress' : 'Paused'}
               </p>
            </div>
          </CircularProgress>

          <Controls
            isActive={isActive}
            onToggle={toggleTimer}
            onReset={resetTimer}
            onSkip={skipTimer}
            mode={mode}
          />

          {/* Session Indicators */}
          <div className="mt-10 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/10 flex flex-col items-center gap-3 w-full max-w-xs shadow-lg">
             <div className="flex justify-between w-full text-xs font-bold text-white/60 uppercase tracking-widest">
               <span>Round {currentSessionInCycle + 1}/{settings.longBreakInterval}</span>
               <span>Total: {sessionsCompleted}</span>
             </div>
             <div className="flex gap-2 w-full justify-center">
               {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
                 <div
                   key={i}
                   className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                     i < currentSessionInCycle
                       ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]' 
                       : 'bg-white/20'
                   } ${i === currentSessionInCycle && mode === TimerMode.WORK && isActive ? 'animate-pulse bg-white/80' : ''}`}
                 />
               ))}
             </div>
          </div>

        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={updateSettings}
        user={user}
        onSignIn={signIn}
        onSignUp={signUp}
        onSignOut={signOut}
        authError={authError}
        clearAuthError={clearAuthError}
        authLoading={authLoading}
      />
    </div>
  );
};

export default App;