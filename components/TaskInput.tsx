import React, { useState, useEffect } from 'react';
import { Pencil, Check } from 'lucide-react';

export const TaskInput: React.FC = () => {
  const [task, setTask] = useState(() => localStorage.getItem('pomodoro-current-task') || '');
  const [isEditing, setIsEditing] = useState(!task);

  useEffect(() => {
    localStorage.setItem('pomodoro-current-task', task);
  }, [task]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

  return (
    <div className="z-20 mb-6 w-full flex justify-center">
      <div className={`
        relative group transition-all duration-300
        ${isEditing ? 'w-full max-w-sm' : 'w-auto max-w-sm'}
      `}>
        {isEditing ? (
          <div className="flex items-center bg-white/20 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/30">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => task && setIsEditing(false)}
              placeholder="What are you working on?"
              className="bg-transparent border-none text-white placeholder-white/70 text-center w-full focus:ring-0 focus:outline-none text-lg font-medium"
              autoFocus
            />
            <button 
              onClick={() => setIsEditing(false)}
              className="ml-2 text-white/80 hover:text-white"
            >
              <Check size={18} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="cursor-pointer flex items-center gap-3 py-2 px-6 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all shadow-lg border border-white/30"
          >
            <span className="text-white/80 text-xs font-bold tracking-wider uppercase">Current Task</span>
            <div className="h-4 w-[1px] bg-white/40"></div>
            <span className="text-lg font-semibold text-white truncate max-w-[200px]">{task}</span>
            <Pencil size={14} className="text-white/60 group-hover:text-white transition-colors ml-1" />
          </div>
        )}
      </div>
    </div>
  );
};