import React, { useState } from 'react';
import { X, Clock, Zap, Coffee, User, LogOut, LogIn } from 'lucide-react';
import { Settings } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
  user: SupabaseUser | null;
  onSignIn: (e: string, p: string) => Promise<void>;
  onSignUp: (e: string, p: string) => Promise<void>;
  onSignOut: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  authLoading: boolean;
}

type Tab = 'timer' | 'account';

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, settings, onSave,
  user, onSignIn, onSignUp, onSignOut, authError, clearAuthError, authLoading
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  if (!isOpen) return null;

  const handleChange = (key: keyof Settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };
  
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginMode) {
      await onSignIn(email, password);
    } else {
      await onSignUp(email, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('timer')}
              className={`text-lg font-bold transition-colors ${activeTab === 'timer' ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Settings
            </button>
            <button 
              onClick={() => setActiveTab('account')}
              className={`text-lg font-bold transition-colors ${activeTab === 'account' ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Account
            </button>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar grow">
          
          {activeTab === 'timer' ? (
            <div className="space-y-8">
              {/* Timer Section */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} /> Timer (Minutes)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Pomodoro</label>
                    <input
                      type="number"
                      value={localSettings.workDuration}
                      onChange={(e) => handleChange('workDuration', Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Short Break</label>
                    <input
                      type="number"
                      value={localSettings.shortBreakDuration}
                      onChange={(e) => handleChange('shortBreakDuration', Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Long Break</label>
                    <input
                      type="number"
                      value={localSettings.longBreakDuration}
                      onChange={(e) => handleChange('longBreakDuration', Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold"
                    />
                  </div>
                </div>
              </section>

              {/* Automation Section */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} /> Automation
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Auto-start Breaks</span>
                  <button
                    onClick={() => handleChange('autoStartBreaks', !localSettings.autoStartBreaks)}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${localSettings.autoStartBreaks ? 'bg-violet-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${localSettings.autoStartBreaks ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Auto-start Pomodoros</span>
                  <button
                    onClick={() => handleChange('autoStartPomodoros', !localSettings.autoStartPomodoros)}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${localSettings.autoStartPomodoros ? 'bg-violet-500' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${localSettings.autoStartPomodoros ? 'translate-x-6' : ''}`} />
                  </button>
                </div>
              </section>

              {/* Long Break Interval */}
              <section className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Coffee size={14} /> Long Break Interval
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Sessions before long break</span>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
                    <button 
                      onClick={() => handleChange('longBreakInterval', Math.max(1, localSettings.longBreakInterval - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-violet-600"
                    >-</button>
                    <span className="font-bold text-gray-800 w-4 text-center">{localSettings.longBreakInterval}</span>
                    <button 
                      onClick={() => handleChange('longBreakInterval', Math.min(10, localSettings.longBreakInterval + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-violet-600"
                    >+</button>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              {user ? (
                <div className="flex flex-col items-center gap-6 py-6">
                  <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 mb-2">
                    <User size={40} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800">Welcome back!</h3>
                    <p className="text-gray-500 mt-1">{user.email}</p>
                    <p className="text-xs text-green-600 mt-2 font-medium bg-green-50 px-3 py-1 rounded-full inline-block">
                      Settings Synced
                    </p>
                  </div>
                  <button 
                    onClick={onSignOut}
                    disabled={authLoading}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-red-500 transition-colors font-medium w-full justify-center"
                  >
                    <LogOut size={18} />
                    {authLoading ? 'Signing out...' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <div className="mb-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800">
                      {isLoginMode ? 'Sign In to Sync' : 'Create Account'}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Save your settings across all your devices.
                    </p>
                  </div>

                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      />
                    </div>

                    {authError && (
                      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {authError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 flex justify-center items-center gap-2"
                    >
                      {authLoading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      ) : (
                        <>
                           {isLoginMode ? <LogIn size={18}/> : <User size={18}/>}
                           {isLoginMode ? 'Sign In' : 'Create Account'}
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoginMode(!isLoginMode);
                        clearAuthError();
                      }}
                      className="text-sm text-gray-500 hover:text-violet-600 font-medium transition-colors"
                    >
                      {isLoginMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer (Only for Timer Settings) */}
        {activeTab === 'timer' && (
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
             <button
               onClick={handleSave}
               className="px-8 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
             >
               Save Changes
             </button>
          </div>
        )}
      </div>
    </div>
  );
};