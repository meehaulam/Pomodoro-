import { TimerMode } from "./types";

// A simple pleasant "ding" sound in base64 to ensure it always works without external fetch
export const NOTIFICATION_SOUND = "data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"; // Placeholder

// Using a reliable CDN for a pleasant bell sound
export const ALARM_AUDIO_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3";

export const MODE_COLORS = {
  [TimerMode.WORK]: {
    bg: "bg-violet-600",
    text: "text-white",
    accent: "text-violet-100",
    border: "border-white/20",
    bgSoft: "bg-white/10",
    buttonBg: "bg-white text-violet-600 hover:bg-violet-50",
    gradient: "from-[#8B5CF6] via-[#9333EA] to-[#A78BFA]",
    progressColor: "text-white"
  },
  [TimerMode.SHORT_BREAK]: {
    bg: "bg-teal-500",
    text: "text-white",
    accent: "text-teal-100",
    border: "border-white/20",
    bgSoft: "bg-white/10",
    buttonBg: "bg-white text-teal-600 hover:bg-teal-50",
    gradient: "from-teal-400 via-teal-500 to-emerald-500",
    progressColor: "text-white"
  },
  [TimerMode.LONG_BREAK]: {
    bg: "bg-blue-500",
    text: "text-white",
    accent: "text-blue-100",
    border: "border-white/20",
    bgSoft: "bg-white/10",
    buttonBg: "bg-white text-blue-600 hover:bg-blue-50",
    gradient: "from-blue-500 via-indigo-500 to-violet-500",
    progressColor: "text-white"
  },
};

export const MODE_LABELS = {
  [TimerMode.WORK]: "Focus",
  [TimerMode.SHORT_BREAK]: "Short Break",
  [TimerMode.LONG_BREAK]: "Long Break",
};

export const MOTIVATIONAL_QUOTES = [
  "Focus on a process!",
  "You can do it! 😊",
  "Stay present.",
  "One step at a time.",
  "Breathe and focus.",
  "Make it happen.",
  "Keep the momentum.",
  "Small steps, big progress.",
  "Trust the process.",
  "Here and now."
];