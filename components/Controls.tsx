import React from 'react';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { TimerMode } from '../types';
import { MODE_COLORS } from '../constants';

interface ControlsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
  mode: TimerMode;
}

export const Controls: React.FC<ControlsProps> = ({ isActive, onToggle, onReset, onSkip, mode }) => {
  const colors = MODE_COLORS[mode];

  return (
    <div className="flex items-center gap-8 mt-4 z-20">
      <button
        onClick={onReset}
        className="p-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all transform hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg border border-white/10"
        title="Reset Timer"
      >
        <RotateCcw size={22} strokeWidth={2.5} />
      </button>

      <button
        onClick={onToggle}
        className={`p-8 rounded-[2rem] ${colors.buttonBg} shadow-2xl hover:shadow-white/20 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center`}
        title={isActive ? "Pause" : "Start"}
      >
        {isActive ? (
          <Pause size={42} fill="currentColor" className="stroke-none" />
        ) : (
          <Play size={42} fill="currentColor" className="ml-2 stroke-none" />
        )}
      </button>

      <button
        onClick={onSkip}
        className="p-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition-all transform hover:scale-105 active:scale-95 backdrop-blur-sm shadow-lg border border-white/10"
        title="Skip Phase"
      >
        <SkipForward size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
};