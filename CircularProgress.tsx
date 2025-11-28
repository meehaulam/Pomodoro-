import React from 'react';
import { TimerMode } from '../types';
import { MODE_COLORS } from '../constants';

interface CircularProgressProps {
  size?: number;
  strokeWidth?: number;
  timeLeft: number;
  totalTime: number;
  mode: TimerMode;
  children?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 340,
  strokeWidth = 8,
  timeLeft,
  totalTime,
  mode,
  children
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = timeLeft / totalTime;
  const dashOffset = circumference - progress * circumference;

  const colors = MODE_COLORS[mode];

  return (
    <div className="relative flex items-center justify-center my-6" style={{ width: size, height: size }}>
      {/* Outer Glow Effect */}
      <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-white scale-90" />
      
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="rotate-[-90deg] transition-all duration-500 drop-shadow-xl"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/20"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className={`${colors.progressColor} transition-all duration-1000 ease-linear`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        {children}
      </div>
    </div>
  );
};