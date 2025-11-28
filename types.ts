export enum TimerMode {
  WORK = 'work',
  SHORT_BREAK = 'shortBreak',
  LONG_BREAK = 'longBreak',
}

export interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
}

export interface PomodoroState {
  mode: TimerMode;
  timeLeft: number;
  isActive: boolean;
  sessionsCompleted: number;
}

export const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};
