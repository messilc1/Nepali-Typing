import { EnglishLevelInfo, EnglishMilestoneTier } from '../types';

// =========================================================================
// KEYBOARD FINGER & HAND ASSIGNMENT DATABASE
// =========================================================================

export interface FingerInfo {
  key: string;
  finger: 'Pinky' | 'Ring' | 'Middle' | 'Index' | 'Thumb';
  hand: 'Left' | 'Right';
  color: string; // Tailwind color class
  bgClass: string;
  borderClass: string;
  label: string;
}

export const ENGLISH_KEY_FINGER_MAP: Record<string, FingerInfo> = {
  // Left Hand - Pinky
  '`': { key: '`', finger: 'Pinky', hand: 'Left', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Left Pinky' },
  '~': { key: '~', finger: 'Pinky', hand: 'Left', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Left Pinky' },
  '1': { key: '1', finger: 'Pinky', hand: 'Left', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Left Pinky' },
  '!': { key: '!', finger: 'Pinky', hand: 'Left', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Left Pinky' },
  'q': { key: 'q', finger: 'Pinky', hand: 'Left', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Left Pinky' },
  'a': { key: 'a', finger: 'Pinky', hand: 'Left', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Left Pinky (Home)' },
  'z': { key: 'z', finger: 'Pinky', hand: 'Left', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Left Pinky' },

  // Left Hand - Ring
  '2': { key: '2', finger: 'Ring', hand: 'Left', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Left Ring' },
  '@': { key: '@', finger: 'Ring', hand: 'Left', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Left Ring' },
  'w': { key: 'w', finger: 'Ring', hand: 'Left', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Left Ring' },
  's': { key: 's', finger: 'Ring', hand: 'Left', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Left Ring (Home)' },
  'x': { key: 'x', finger: 'Ring', hand: 'Left', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Left Ring' },

  // Left Hand - Middle
  '3': { key: '3', finger: 'Middle', hand: 'Left', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Left Middle' },
  '#': { key: '#', finger: 'Middle', hand: 'Left', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Left Middle' },
  'e': { key: 'e', finger: 'Middle', hand: 'Left', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Left Middle' },
  'd': { key: 'd', finger: 'Middle', hand: 'Left', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Left Middle (Home)' },
  'c': { key: 'c', finger: 'Middle', hand: 'Left', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Left Middle' },

  // Left Hand - Index
  '4': { key: '4', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index' },
  '$': { key: '$', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index' },
  '5': { key: '5', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index' },
  '%': { key: '%', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index' },
  'r': { key: 'r', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index' },
  't': { key: 't', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index' },
  'f': { key: 'f', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index (Home F-Bump)' },
  'g': { key: 'g', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index' },
  'v': { key: 'v', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index' },
  'b': { key: 'b', finger: 'Index', hand: 'Left', color: 'emerald-500', bgClass: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300', borderClass: 'border-emerald-400', label: 'Left Index' },

  // Thumbs
  ' ': { key: ' ', finger: 'Thumb', hand: 'Right', color: 'blue-500', bgClass: 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300', borderClass: 'border-blue-400', label: 'Right / Left Thumb' },

  // Right Hand - Index
  '6': { key: '6', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index' },
  '^': { key: '^', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index' },
  '7': { key: '7', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index' },
  '&': { key: '&', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index' },
  'y': { key: 'y', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index' },
  'u': { key: 'u', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index' },
  'h': { key: 'h', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index' },
  'j': { key: 'j', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index (Home J-Bump)' },
  'n': { key: 'n', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index' },
  'm': { key: 'm', finger: 'Index', hand: 'Right', color: 'teal-500', bgClass: 'bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300', borderClass: 'border-teal-400', label: 'Right Index' },

  // Right Hand - Middle
  '8': { key: '8', finger: 'Middle', hand: 'Right', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Right Middle' },
  '*': { key: '*', finger: 'Middle', hand: 'Right', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Right Middle' },
  'i': { key: 'i', finger: 'Middle', hand: 'Right', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Right Middle' },
  'k': { key: 'k', finger: 'Middle', hand: 'Right', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Right Middle (Home)' },
  ',': { key: ',', finger: 'Middle', hand: 'Right', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Right Middle' },
  '<': { key: '<', finger: 'Middle', hand: 'Right', color: 'lime-500', bgClass: 'bg-lime-100 dark:bg-lime-950/70 text-lime-700 dark:text-lime-300', borderClass: 'border-lime-400', label: 'Right Middle' },

  // Right Hand - Ring
  '9': { key: '9', finger: 'Ring', hand: 'Right', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Right Ring' },
  '(': { key: '(', finger: 'Ring', hand: 'Right', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Right Ring' },
  'o': { key: 'o', finger: 'Ring', hand: 'Right', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Right Ring' },
  'l': { key: 'l', finger: 'Ring', hand: 'Right', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Right Ring (Home)' },
  '.': { key: '.', finger: 'Ring', hand: 'Right', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Right Ring' },
  '>': { key: '>', finger: 'Ring', hand: 'Right', color: 'amber-500', bgClass: 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300', borderClass: 'border-amber-400', label: 'Right Ring' },

  // Right Hand - Pinky
  '0': { key: '0', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  ')': { key: ')', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '-': { key: '-', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '_': { key: '_', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '=': { key: '=', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '+': { key: '+', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  'p': { key: 'p', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '[': { key: '[', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '{': { key: '{', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  ']': { key: ']', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '}': { key: '}', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  ';': { key: ';', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky (Home)' },
  ':': { key: ':', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  "'": { key: "'", finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '"': { key: '"', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '/': { key: '/', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '?': { key: '?', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '\\': { key: '\\', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' },
  '|': { key: '|', finger: 'Pinky', hand: 'Right', color: 'rose-500', bgClass: 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300', borderClass: 'border-rose-400', label: 'Right Pinky' }
};

export function getFingerInfoForKey(char: string): FingerInfo {
  const lower = char.toLowerCase();
  if (ENGLISH_KEY_FINGER_MAP[lower]) {
    return ENGLISH_KEY_FINGER_MAP[lower];
  }
  if (char >= 'A' && char <= 'Z') {
    const info = ENGLISH_KEY_FINGER_MAP[lower];
    if (info) {
      return {
        ...info,
        label: `${info.label} + Shift`
      };
    }
  }
  return {
    key: char,
    finger: 'Index',
    hand: 'Left',
    color: 'slate-500',
    bgClass: 'bg-slate-100 text-slate-700',
    borderClass: 'border-slate-300',
    label: 'Keypress'
  };
}

// =========================================================================
// WPM MILESTONE TIERS
// =========================================================================

export interface WpmMilestoneInfo {
  tier: EnglishMilestoneTier;
  minWpm: number;
  maxWpm: number;
  badge: string;
  color: string;
  description: string;
  requirement: string;
}

export const WPM_MILESTONES: WpmMilestoneInfo[] = [
  { tier: 'Beginner', minWpm: 0, maxWpm: 19, badge: '🌱', color: 'text-slate-600 bg-slate-100 border-slate-300', description: 'Learning keyboard layout and home row placement', requirement: '10 WPM' },
  { tier: 'Basic', minWpm: 20, maxWpm: 29, badge: '⭐', color: 'text-blue-600 bg-blue-100 border-blue-300', description: 'Can type common words without looking at keys', requirement: '20 WPM' },
  { tier: 'Developing', minWpm: 30, maxWpm: 39, badge: '⚡', color: 'text-cyan-600 bg-cyan-100 border-cyan-300', description: 'Developing muscle memory and consistent cadence', requirement: '30 WPM' },
  { tier: 'Intermediate', minWpm: 40, maxWpm: 49, badge: '🚀', color: 'text-indigo-600 bg-indigo-100 border-indigo-300', description: 'Standard everyday typing speed for office work', requirement: '40 WPM' },
  { tier: 'Good', minWpm: 50, maxWpm: 59, badge: '🔥', color: 'text-emerald-600 bg-emerald-100 border-emerald-300', description: 'Fast and reliable fluid typing with strong accuracy', requirement: '50 WPM' },
  { tier: 'Advanced', minWpm: 60, maxWpm: 69, badge: '💎', color: 'text-violet-600 bg-violet-100 border-violet-300', description: 'Above average speed; handles complex texts effortlessly', requirement: '60 WPM' },
  { tier: 'Professional', minWpm: 70, maxWpm: 79, badge: '🏆', color: 'text-amber-600 bg-amber-100 border-amber-300', description: 'Professional secretarial, transcription, and coding speed', requirement: '70 WPM' },
  { tier: 'Expert', minWpm: 80, maxWpm: 999, badge: '👑', color: 'text-rose-600 bg-rose-100 border-rose-300', description: 'Top 1% elite typing speed with high precision', requirement: '80+ WPM' }
];

export function getMilestoneTier(wpm: number): WpmMilestoneInfo {
  for (let i = WPM_MILESTONES.length - 1; i >= 0; i--) {
    if (wpm >= WPM_MILESTONES[i].minWpm) {
      return WPM_MILESTONES[i];
    }
  }
  return WPM_MILESTONES[0];
}

export function getNextMilestoneGoal(currentWpm: number): { nextTier: WpmMilestoneInfo; diff: number; percent: number } {
  const current = getMilestoneTier(currentWpm);
  const currentIdx = WPM_MILESTONES.findIndex(m => m.tier === current.tier);
  if (currentIdx < WPM_MILESTONES.length - 1) {
    const next = WPM_MILESTONES[currentIdx + 1];
    const diff = Math.max(0, next.minWpm - currentWpm);
    const range = next.minWpm - current.minWpm;
    const progress = range > 0 ? Math.min(100, Math.round(((currentWpm - current.minWpm) / range) * 100)) : 100;
    return { nextTier: next, diff, percent: Math.max(5, progress) };
  }
  return { nextTier: WPM_MILESTONES[WPM_MILESTONES.length - 1], diff: 0, percent: 100 };
}

// =========================================================================
// 7-LEVEL BEGINNER-TO-PRO ENGLISH TYPING CURRICULUM
// =========================================================================

export const ENGLISH_COURSE_LEVELS: EnglishLevelInfo[] = [
  {
    level: 1,
    title: 'Level 1: Absolute Beginner',
    subtitle: 'Home Row & Finger Foundations',
    badge: '🌱 Beginner',
    description: 'Learn primary hand positioning on the home row (ASDF JKL;), index finger tactile bumps (F & J), spacebar rhythm, and initial letter chords.',
    focusConcept: 'Home Row, Index Anchor, Spacebar',
    targetWpmRange: '10–18 WPM',
    exercises: [
      {
        id: 'eng-l1-e1',
        level: 1,
        lessonNumber: 1,
        title: 'Home Row - Left Hand (A S D F)',
        subtitle: 'Pinky on A, Ring on S, Middle on D, Index on F',
        description: 'Rest your left fingers gently on the home keys. Press each key rhythmically using the correct finger.',
        focusKeys: ['a', 's', 'd', 'f'],
        fingerGuidance: 'Left Pinky: A | Left Ring: S | Left Middle: D | Left Index: F',
        targetText: 'asdf asdf fdas sa df asdf fffd dssa asdf asdf fdsa asdf',
        minAccuracy: 95,
        targetWpm: 12,
        mode: 'letters'
      },
      {
        id: 'eng-l1-e2',
        level: 1,
        lessonNumber: 2,
        title: 'Home Row - Right Hand (J K L ;)',
        subtitle: 'Index on J, Middle on K, Ring on L, Pinky on ;',
        description: 'Feel the small tactile bump on the J key with your right index finger. Keep fingers curved and wrists relaxed.',
        focusKeys: ['j', 'k', 'l', ';'],
        fingerGuidance: 'Right Index: J | Right Middle: K | Right Ring: L | Right Pinky: ;',
        targetText: 'jkl; jkl; ;lkj jk l; jkl; jjkk ll;; jkl; ;lkj jkl;',
        minAccuracy: 95,
        targetWpm: 12,
        mode: 'letters'
      },
      {
        id: 'eng-l1-e3',
        level: 1,
        lessonNumber: 3,
        title: 'Home Row Integration - Both Hands',
        subtitle: 'Harmonize Left and Right Hands',
        description: 'Alternate between left and right hands smoothly without looking down at the keyboard.',
        focusKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        fingerGuidance: 'Keep wrists elevated and fingers centered over home row.',
        targetText: 'asdf jkl; asdf jkl; fj dk sl a; fj fj dk dk sl sl a; a;',
        minAccuracy: 95,
        targetWpm: 15,
        mode: 'letters'
      },
      {
        id: 'eng-l1-e4',
        level: 1,
        lessonNumber: 4,
        title: 'Index Finger Reaches (G & H)',
        subtitle: 'Extend Index Fingers sideways',
        description: 'Reach Left Index to G and return to F. Reach Right Index to H and return to J.',
        focusKeys: ['f', 'g', 'h', 'j'],
        fingerGuidance: 'Left Index: F, G | Right Index: J, H',
        targetText: 'fg jh fg jh gf hj fgfg jhjh fghj jhhg glad half flag flash',
        minAccuracy: 95,
        targetWpm: 15,
        mode: 'words'
      },
      {
        id: 'eng-l1-e5',
        level: 1,
        lessonNumber: 5,
        title: 'Home Row Real Words',
        subtitle: 'Form actual English words with Home Row',
        description: 'Type actual words using only home row keys: all, fall, ask, dad, sad, salad, flask.',
        focusKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        fingerGuidance: 'Use right thumb for spacebar after every word.',
        targetText: 'as ask dad fall all flag flask glad half salad fall all dad ask',
        minAccuracy: 95,
        targetWpm: 18,
        mode: 'words'
      },
      {
        id: 'eng-l1-e6',
        level: 1,
        lessonNumber: 6,
        title: 'Basic Capitalization with Shift',
        subtitle: 'Use Opposite Hand for Shift Key',
        description: 'When typing a capital letter with left hand, hold Right Shift with right pinky. When typing right hand capital, hold Left Shift.',
        focusKeys: ['A', 'S', 'D', 'F', 'J', 'K', 'L'],
        fingerGuidance: 'Opposite Shift Rule: Right Shift for A/S/D/F; Left Shift for J/K/L',
        targetText: 'As Ask Dad Fall All Glad Flash Salad As Dad Fall Ask Glad',
        minAccuracy: 95,
        targetWpm: 15,
        mode: 'words'
      }
    ]
  },
  {
    level: 2,
    title: 'Level 2: Basic Letters & All Rows',
    subtitle: 'Top Row (QWERTY) & Bottom Row (ZXCVBNM)',
    badge: '⭐ Basic',
    description: 'Master upward reaches to the top QWERTY row and downward reaches to the bottom ZXCV row. Return fingers to home row after every keystroke.',
    focusConcept: 'Top Row, Bottom Row, Muscle Memory',
    targetWpmRange: '18–26 WPM',
    exercises: [
      {
        id: 'eng-l2-e1',
        level: 2,
        lessonNumber: 1,
        title: 'Top Row - Left Hand (Q W E R T)',
        subtitle: 'Reach Upward with Left Hand',
        description: 'Reach up from A to Q, S to W, D to E, and F to R & T. Return to home position immediately.',
        focusKeys: ['q', 'w', 'e', 'r', 't'],
        fingerGuidance: 'Pinky: Q | Ring: W | Middle: E | Index: R, T',
        targetText: 'qwer rewq q w e r t water tree sweet treat raw war draw wear',
        minAccuracy: 95,
        targetWpm: 20,
        mode: 'words'
      },
      {
        id: 'eng-l2-e2',
        level: 2,
        lessonNumber: 2,
        title: 'Top Row - Right Hand (Y U I O P)',
        subtitle: 'Reach Upward with Right Hand',
        description: 'Reach up from J to U & Y, K to I, L to O, and ; to P. Maintain steady cadence.',
        focusKeys: ['y', 'u', 'i', 'o', 'p'],
        fingerGuidance: 'Index: Y, U | Middle: I | Ring: O | Pinky: P',
        targetText: 'uiop poiu u i o p y pure you your point open output input trip',
        minAccuracy: 95,
        targetWpm: 20,
        mode: 'words'
      },
      {
        id: 'eng-l2-e3',
        level: 2,
        lessonNumber: 3,
        title: 'Bottom Row - Left Hand (Z X C V)',
        subtitle: 'Reach Downward with Left Hand',
        description: 'Reach down from A to Z, S to X, D to C, and F to V. Gentle, light keystrokes.',
        focusKeys: ['z', 'x', 'c', 'v'],
        fingerGuidance: 'Pinky: Z | Ring: X | Middle: C | Index: V',
        targetText: 'zxcv vcxz z x c v voice cave civic exact zone extra civil view',
        minAccuracy: 95,
        targetWpm: 22,
        mode: 'words'
      },
      {
        id: 'eng-l2-e4',
        level: 2,
        lessonNumber: 4,
        title: 'Bottom Row - Right Hand (B N M , .)',
        subtitle: 'Reach Downward with Right Hand',
        description: 'Reach down from J to N & M, F to B, K to comma, and L to period.',
        focusKeys: ['b', 'n', 'm', ',', '.'],
        fingerGuidance: 'Left Index: B | Right Index: N, M | Right Middle: , | Right Ring: .',
        targetText: 'bnm mnb b n m bone name main moon norm born plan beam mean',
        minAccuracy: 95,
        targetWpm: 22,
        mode: 'words'
      },
      {
        id: 'eng-l2-e5',
        level: 2,
        lessonNumber: 5,
        title: 'Alphabet Integration Run',
        subtitle: 'Full Keyboard Character Mastery',
        description: 'Combine all 26 letters smoothly across home, top, and bottom rows.',
        focusKeys: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        fingerGuidance: 'Keep eyes on screen. Trust your finger muscle memory.',
        targetText: 'pack my box with five dozen liquor jugs the quick brown fox jumps over the lazy dog',
        minAccuracy: 95,
        targetWpm: 25,
        mode: 'sentences'
      }
    ]
  },
  {
    level: 3,
    title: 'Level 3: Simple & Frequent Words',
    subtitle: 'Building Core English Vocabulary Speed',
    badge: '⚡ Developing',
    description: 'Learn to type words as single motor chunks rather than letter-by-letter. Master the most frequent words in the English language.',
    focusConcept: 'Word Chunks, High Frequency Vocabulary',
    targetWpmRange: '26–36 WPM',
    exercises: [
      {
        id: 'eng-l3-e1',
        level: 3,
        lessonNumber: 1,
        title: 'Top 20 Most Common English Words',
        subtitle: 'The, Be, To, Of, And, A, In, That...',
        description: 'These 20 words make up over 30% of all written English. Practice smooth rhythm.',
        focusKeys: ['t', 'h', 'e', 'a', 'n', 'd', 'o', 'f', 'i', 's', 'y', 'u'],
        fingerGuidance: 'Type each word as a continuous flowing rhythm.',
        targetText: 'the and you that this have with from they what time make know take good year work people some them',
        minAccuracy: 95,
        targetWpm: 28,
        mode: 'words'
      },
      {
        id: 'eng-l3-e2',
        level: 3,
        lessonNumber: 2,
        title: 'Common 3-Letter Words Flow',
        subtitle: 'Quick Bigrams and Trigrams',
        description: 'Form quick 3-letter combinations without hesitation.',
        focusKeys: ['all', 'letters'],
        fingerGuidance: 'Focus on clean transitions between keystrokes.',
        targetText: 'cat dog sun run map big red hot box pen cup sky fly car see now how why day man way boy end air',
        minAccuracy: 95,
        targetWpm: 30,
        mode: 'words'
      },
      {
        id: 'eng-l3-e3',
        level: 3,
        lessonNumber: 3,
        title: 'Everyday 4-Letter & 5-Letter Words',
        subtitle: 'Work, Life, Study, Growth Words',
        description: 'Expand your muscle memory to intermediate word lengths.',
        focusKeys: ['all', 'letters'],
        fingerGuidance: 'Do not rush; maintain 95%+ precision.',
        targetText: 'about other which their there could would great first water after words place right think sound world hand',
        minAccuracy: 95,
        targetWpm: 32,
        mode: 'words'
      },
      {
        id: 'eng-l3-e4',
        level: 3,
        lessonNumber: 4,
        title: 'Connecting Transition Words',
        subtitle: 'Because, Although, Between, Through...',
        description: 'Master conjunctions and connecting adverbs that appear frequently in professional writing.',
        focusKeys: ['all', 'letters'],
        fingerGuidance: 'Breathe evenly and keep fingers close to the key surface.',
        targetText: 'because although between without against through before another however during whether together instead towards',
        minAccuracy: 95,
        targetWpm: 35,
        mode: 'words'
      }
    ]
  },
  {
    level: 4,
    title: 'Level 4: Common Sentences & Flow',
    subtitle: 'Typing Continuous Thought & Syntax',
    badge: '🚀 Intermediate',
    description: 'Transition from single isolated words to continuous sentence flow with periods, commas, and natural conversational cadence.',
    focusConcept: 'Sentence Rhythm, Capital Letters, Periods',
    targetWpmRange: '36–45 WPM',
    exercises: [
      {
        id: 'eng-l4-e1',
        level: 4,
        lessonNumber: 1,
        title: 'Short Daily Life Sentences',
        subtitle: 'Simple Declarative Statements',
        description: 'Type simple sentences with correct initial capitalization and terminal periods.',
        focusKeys: ['Shift', '.', ',', 'letters'],
        fingerGuidance: 'Hit Shift cleanly before striking the letter key.',
        targetText: 'The cat is on the table. The sun shines brightly. I like to read books. Practice makes typing easier. We will learn every day.',
        minAccuracy: 95,
        targetWpm: 38,
        mode: 'sentences'
      },
      {
        id: 'eng-l4-e2',
        level: 4,
        lessonNumber: 2,
        title: 'Study & Learning Focus Sentences',
        subtitle: 'Education and Skill Mastery',
        description: 'Sentence drills centered around disciplined practice and keyboard mastery.',
        focusKeys: ['Shift', '.', ',', 'letters'],
        fingerGuidance: 'Keep your eyes on the upcoming word while finishing the current one.',
        targetText: 'I am learning to type with speed and accuracy. Consistent daily practice builds strong muscle memory. Focus on precision first, and speed will follow naturally.',
        minAccuracy: 95,
        targetWpm: 40,
        mode: 'sentences'
      },
      {
        id: 'eng-l4-e3',
        level: 4,
        lessonNumber: 3,
        title: 'Descriptive & Action Sentences',
        subtitle: 'Dynamic sentence structures',
        description: 'Longer clauses with commas and descriptive vocabulary.',
        focusKeys: ['Shift', '.', ',', 'letters'],
        fingerGuidance: 'Pause slightly at commas to maintain natural rhythm.',
        targetText: 'The quick brown fox jumps over the lazy dog. Bright morning light illuminated the tall green trees, while a gentle breeze swept through the valley.',
        minAccuracy: 95,
        targetWpm: 42,
        mode: 'sentences'
      },
      {
        id: 'eng-l4-e4',
        level: 4,
        lessonNumber: 4,
        title: 'Professional Communication Sentences',
        subtitle: 'Office, Email & Meeting Statements',
        description: 'Phrases commonly typed in office environments, email exchanges, and project updates.',
        focusKeys: ['Shift', '.', ',', 'letters'],
        fingerGuidance: 'Type smoothly without stopping at word boundaries.',
        targetText: 'Please review the updated document before our afternoon meeting. We have successfully completed the initial phase of the project on schedule.',
        minAccuracy: 95,
        targetWpm: 45,
        mode: 'sentences'
      }
    ]
  },
  {
    level: 5,
    title: 'Level 5: Intermediate Mastery',
    subtitle: 'Numbers, Punctuation & Mixed Structures',
    badge: '🔥 Good',
    description: 'Integrate the top number row (1-0), punctuation marks (: ; " ? ! - ()), currency symbols, email addresses, and mixed alphanumeric data.',
    focusConcept: 'Number Row, Punctuation Marks, Symbols',
    targetWpmRange: '45–55 WPM',
    exercises: [
      {
        id: 'eng-l5-e1',
        level: 5,
        lessonNumber: 1,
        title: 'Punctuation & Quote Marks',
        subtitle: 'Commas, Semicolons, Colons, Quotes & Hyphens',
        description: 'Reach right pinky accurately to semicolon, colon, single quote, and double quote.',
        focusKeys: [';', ':', "'", '"', '-', '?', '!'],
        fingerGuidance: 'Right Pinky handles ;, :, \', ", and ? with Shift.',
        targetText: 'Hello, world! How are you today? It is a sunny day: warm, bright, and cheerful; let us go outside and enjoy the fresh air.',
        minAccuracy: 95,
        targetWpm: 46,
        mode: 'mixed'
      },
      {
        id: 'eng-l5-e2',
        level: 5,
        lessonNumber: 2,
        title: 'Number Row Precision (1 to 0)',
        subtitle: 'Dates, Statistics & Year Milestones',
        description: 'Reach up to the number row with the appropriate fingers without shifting your entire palm.',
        focusKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        fingerGuidance: 'Left: 1(Pinky), 2(Ring), 3(Middle), 4,5(Index) | Right: 6,7(Index), 8(Middle), 9(Ring), 0(Pinky)',
        targetText: 'In 2026, over 85% of professionals achieved 50+ WPM. The project required 12 team members, 360 hours, and 45 distinct milestone reviews.',
        minAccuracy: 95,
        targetWpm: 48,
        mode: 'mixed'
      },
      {
        id: 'eng-l5-e3',
        level: 5,
        lessonNumber: 3,
        title: 'Symbols, Emails & Currency',
        subtitle: '@, #, $, %, &, (, ), / and Underscores',
        description: 'Practice real-world data entry: email addresses, prices, percentages, and parenthetical notes.',
        focusKeys: ['@', '#', '$', '%', '&', '(', ')', '_', '/'],
        fingerGuidance: 'Hold Shift with opposite hand while typing top row symbols.',
        targetText: 'Contact support at help@example.com (Ref: #8921). The total cost was $450.00 with a 15% discount & free delivery on 2026/08/15.',
        minAccuracy: 95,
        targetWpm: 50,
        mode: 'mixed'
      },
      {
        id: 'eng-l5-e4',
        level: 5,
        lessonNumber: 4,
        title: 'Mixed Paragraph Integration',
        subtitle: 'Sentences Combining Words, Numbers & Punctuation',
        description: 'A realistic paragraph requiring rapid switching between words, figures, and punctuation.',
        focusKeys: ['all', 'mixed'],
        fingerGuidance: 'Maintain rhythm even when encountering numbers and symbols.',
        targetText: 'During the Q3 2026 fiscal review, our engineering division reported a 28.4% increase in throughput (from 1,250 to 1,605 units/day), maintaining 99.8% precision across all test suites.',
        minAccuracy: 95,
        targetWpm: 52,
        mode: 'paragraph'
      }
    ]
  },
  {
    level: 6,
    title: 'Level 6: Advanced Typing & Vocabulary',
    subtitle: 'Technical, Academic & Complex Texts',
    badge: '💎 Advanced',
    description: 'Tackle advanced multisyllabic vocabulary, computer science concepts, academic research prose, and complex governance terminology.',
    focusConcept: 'Complex Vocabulary, Academic Prose, Technical Jargon',
    targetWpmRange: '55–65 WPM',
    exercises: [
      {
        id: 'eng-l6-e1',
        level: 6,
        lessonNumber: 1,
        title: 'Difficult Multisyllabic Vocabulary',
        subtitle: 'Sophisticated English Words',
        description: 'Words with unusual letter combinations that challenge standard finger muscle memory.',
        focusKeys: ['all', 'letters'],
        fingerGuidance: 'Read syllables ahead to prepare finger movements smoothly.',
        targetText: 'Ubiquitous, quintessential, idiosyncrasy, conscientious, meticulously, juxtaposition, serendipity, prerequisite, epistemological, synchronization, counterintuitive.',
        minAccuracy: 95,
        targetWpm: 56,
        mode: 'words'
      },
      {
        id: 'eng-l6-e2',
        level: 6,
        lessonNumber: 2,
        title: 'Computer Science & Technology Passage',
        subtitle: 'Algorithms, Architecture & Systems',
        description: 'Modern computing terminology, distributed systems, cryptographic security, and cloud scalability.',
        focusKeys: ['all', 'mixed'],
        fingerGuidance: 'Maintain steady speed across technical jargon.',
        targetText: 'Distributed computing architectures rely on fault-tolerant consensus protocols to maintain state synchronization across heterogeneous server nodes. Asynchronous event loops optimize non-blocking I/O operations, ensuring high throughput under heavy concurrency.',
        minAccuracy: 95,
        targetWpm: 60,
        mode: 'paragraph'
      },
      {
        id: 'eng-l6-e3',
        level: 6,
        lessonNumber: 3,
        title: 'Academic & Scientific Research',
        subtitle: 'Hypothesis, Methodology & Empirical Data',
        description: 'Formal scholarly syntax, statistical evaluation, and peer-reviewed qualitative prose.',
        focusKeys: ['all', 'mixed'],
        fingerGuidance: 'Execute punctuation and capital letters without breaking typing momentum.',
        targetText: 'Empirical scientific methodology requires rigorous qualitative hypothesis testing, peer-reviewed reproducibility, and statistical significance analysis. Researchers must eliminate observational bias through randomized double-blind trial parameters.',
        minAccuracy: 95,
        targetWpm: 62,
        mode: 'paragraph'
      },
      {
        id: 'eng-l6-e4',
        level: 6,
        lessonNumber: 4,
        title: 'Constitutional & Legal Terminology',
        subtitle: 'Jurisprudence, Statutory Compliance & Writs',
        description: 'English legal terminology: jurisprudence, habeas corpus, mandamus, certiorari, appellate jurisdiction.',
        focusKeys: ['all', 'mixed'],
        fingerGuidance: 'Maintain strict accuracy on complex legal phrases.',
        targetText: 'Constitutional jurisprudence mandates that administrative authorities act within their defined statutory jurisdiction. When executive action infringes fundamental rights, appellate courts provide extraordinary remedies through writs of mandamus and certiorari.',
        minAccuracy: 95,
        targetWpm: 64,
        mode: 'paragraph'
      }
    ]
  },
  {
    level: 7,
    title: 'Level 7: Professional & Executive',
    subtitle: 'Real-World Legal, Business & Official Documents',
    badge: '🏆 Professional',
    description: 'Realistic full-length documents from corporate boardrooms, legal briefs, judicial rulings, public policy, and government administration.',
    focusConcept: 'Executive Briefs, Legal Contracts, Official Reports',
    targetWpmRange: '65–80+ WPM',
    exercises: [
      {
        id: 'eng-l7-e1',
        level: 7,
        lessonNumber: 1,
        title: 'Corporate Executive Board Memorandum',
        subtitle: 'Business Strategy & Financial Performance',
        description: 'Comprehensive business report with financial indicators, strategic expansion, and governance compliance.',
        focusKeys: ['all', 'mixed'],
        fingerGuidance: 'Type with unwavering focus; simulate real executive transcription.',
        targetText: 'Quarterly operational performance demonstrated a 24.5% compound revenue increase across international enterprise contracts, resulting in substantial shareholder dividend growth and sustainable expansion. The executive committee resolved to allocate $12.5 million toward cloud infrastructure modernization and cybersecurity compliance protocols.',
        minAccuracy: 95,
        targetWpm: 68,
        mode: 'paragraph'
      },
      {
        id: 'eng-l7-e2',
        level: 7,
        lessonNumber: 2,
        title: 'Judicial Appellate Ruling & Brief',
        subtitle: 'Court Order, Due Process & Evidence',
        description: 'Formal court record establishing legal precedent, evidentiary evaluation, and judicial remedy.',
        focusKeys: ['all', 'mixed'],
        fingerGuidance: 'Execute formal syntax with exact precision.',
        targetText: 'In accordance with established procedural rules, the appellant submitted comprehensive evidentiary documentation demonstrating clear statutory infringement and requesting declaratory relief from the appellate tribunal. The court held that failure to provide adequate hearing violated fundamental principles of natural justice, rendering the initial administrative decree null and void.',
        minAccuracy: 95,
        targetWpm: 70,
        mode: 'paragraph'
      },
      {
        id: 'eng-l7-e3',
        level: 7,
        lessonNumber: 3,
        title: 'Public Administration & Policy Whitepaper',
        subtitle: 'Governance, Transparency & Public Service',
        description: 'Government policy document on civil service modernization, digital public infrastructure, and administrative accountability.',
        focusKeys: ['all', 'mixed'],
        fingerGuidance: 'Maintain rhythm through high-density administrative terminology.',
        targetText: 'Contemporary public administration requires a holistic synthesis of macroeconomic indicators, environmental stewardship, and participatory democratic engagement. The civil service commission has instituted digital governance standards to streamline citizen service delivery, eliminate bureaucratic redundancies, and ensure complete institutional transparency.',
        minAccuracy: 95,
        targetWpm: 72,
        mode: 'paragraph'
      },
      {
        id: 'eng-l7-e4',
        level: 7,
        lessonNumber: 4,
        title: 'Grand Mastery Professional Passage',
        subtitle: 'Ultimate 80+ WPM Speed & Precision Challenge',
        description: 'A rich, diverse passage synthesizing business, technology, law, and philosophy at elite speed.',
        focusKeys: ['all', 'mixed'],
        fingerGuidance: 'Relax shoulders, breathe calmly, and glide across the keyboard.',
        targetText: 'The relentless evolution of digital technology and global jurisprudence demands unprecedented cognitive agility and communicative precision. True keyboard mastery transcends mere keystroke frequency; it embodies an effortless bridge between human thought and digital execution. Through disciplined daily practice, meticulous attention to accuracy, and unwavering persistence, you have unlocked the pinnacle of professional typing excellence.',
        minAccuracy: 95,
        targetWpm: 75,
        mode: 'paragraph'
      }
    ]
  }
];

// =========================================================================
// PRACTICE MODULES (CATEGORIZED DRILLS)
// =========================================================================

export interface EnglishPracticeModule {
  id: string;
  title: string;
  category: 'home-row' | 'all-rows' | 'common-words' | 'sentences' | 'numbers-symbols' | 'technical' | 'legal' | 'custom';
  description: string;
  items: string[];
}

export const ENGLISH_PRACTICE_MODULES: EnglishPracticeModule[] = [
  {
    id: 'drill-home-row',
    title: 'Home Row Mastery (ASDF JKL;)',
    category: 'home-row',
    description: 'Perfect finger placement on the anchor home keys.',
    items: ['asdf', 'jkl;', 'asdf', 'jkl;', 'fj', 'dk', 'sl', 'a;', 'glad', 'half', 'salad', 'flask', 'fall', 'dash', 'flash', 'fall']
  },
  {
    id: 'drill-top-row',
    title: 'Top Row Extensions (QWERTY UIOP)',
    category: 'all-rows',
    description: 'Reach smoothly upward to the top row keys.',
    items: ['qwer', 'uiop', 'ty', 'pure', 'wire', 'quiet', 'power', 'type', 'write', 'report', 'equip', 'output', 'pretty', 'water']
  },
  {
    id: 'drill-bottom-row',
    title: 'Bottom Row Extensions (ZXCV BNM,.)',
    category: 'all-rows',
    description: 'Reach accurately downward to the bottom row keys.',
    items: ['zxcv', 'bnm,', 'cave', 'view', 'zone', 'next', 'exact', 'civil', 'black', 'month', 'climb', 'brave', 'music', 'novel']
  },
  {
    id: 'drill-top-100-words',
    title: 'Top 100 Most Common English Words',
    category: 'common-words',
    description: 'The essential core words that power 50% of English prose.',
    items: [
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
      'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
      'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
      'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look',
      'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
      'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ]
  },
  {
    id: 'drill-numbers-symbols',
    title: 'Numbers & Row Symbols (1-0, @#$%)',
    category: 'numbers-symbols',
    description: 'Master digits, currency marks, parentheses, and punctuation.',
    items: ['12345', '67890', '#2026', '$500.00', '15%', 'user@domain.com', '(Section 12)', 'Ref: #987', '08/15/2026', '99.9%']
  },
  {
    id: 'drill-tech-words',
    title: 'Technology & Computing Jargon',
    category: 'technical',
    description: 'Software development, networking, and cloud terminology.',
    items: [
      'algorithm', 'asynchronous', 'bandwidth', 'compiler', 'database', 'encryption', 'framework',
      'infrastructure', 'interface', 'kubernetes', 'middleware', 'optimization', 'protocol', 'recursion',
      'repository', 'scalability', 'synchronous', 'throughput', 'virtualization', 'websocket'
    ]
  },
  {
    id: 'drill-legal-words',
    title: 'Legal & Constitutional English Vocabulary',
    category: 'legal',
    description: 'Essential terminology used in law, judiciary, and civil governance.',
    items: [
      'constitution', 'jurisdiction', 'appellate', 'affidavit', 'statute', 'mandamus', 'certiorari',
      'injunction', 'prosecution', 'defendant', 'petitioner', 'plaintiff', 'jurisprudence', 'tribunal',
      'sovereignty', 'legislation', 'adjudication', 'arbitration', 'ordinance', 'promulgation'
    ]
  }
];

// =========================================================================
// SPEED TEST & PARAGRAPH TEST PASSAGES
// =========================================================================

export interface EnglishParagraphTest {
  id: string;
  title: string;
  category: 'Business' | 'Technology' | 'Legal' | 'Science & Academic' | 'Literature' | 'General';
  lengthCategory: 'Short' | 'Medium' | 'Long';
  wordCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  text: string;
}

export const ENGLISH_PARAGRAPH_TESTS: EnglishParagraphTest[] = [
  {
    id: 'para-general-fox',
    title: 'The Quick Brown Fox & Daily Focus',
    category: 'General',
    lengthCategory: 'Short',
    wordCount: 85,
    difficulty: 'Beginner',
    text: 'The quick brown fox jumps over the lazy dog every single morning. Learning to type with all ten fingers requires patience, good posture, and steady rhythm. Keep your wrists elevated slightly above the desk and avoid looking down at your keyboard. With continuous daily practice, your fingers will intuitively know exactly where every key resides.'
  },
  {
    id: 'para-tech-cloud',
    title: 'Cloud Computing & Distributed Systems',
    category: 'Technology',
    lengthCategory: 'Medium',
    wordCount: 165,
    difficulty: 'Intermediate',
    text: 'Modern cloud infrastructure relies heavily on microservices architecture and automated container orchestration. By decomposing monolithic software applications into smaller, loosely coupled modular services, engineering organizations can deploy updates continuously with zero downtime. Scalable distributed databases employ consensus algorithms to replicate critical state information across geographic availability zones. As software systems grow in complexity, observability platforms that monitor latency, throughput, and error rates become indispensable for maintaining optimal uptime.'
  },
  {
    id: 'para-business-growth',
    title: 'Strategic Corporate Leadership & Sustainable Growth',
    category: 'Business',
    lengthCategory: 'Medium',
    wordCount: 180,
    difficulty: 'Advanced',
    text: 'Sustainable business expansion in the modern digital economy requires executive teams to harmonize aggressive innovation with disciplined financial stewardship. Successful organizations invest in building customer-centric cultures where product feedback directly informs product roadmaps. Effective leaders foster cross-functional collaboration between research, engineering, and sales departments, ensuring strategic alignment across all corporate divisions. In an era marked by rapid technological disruption, agility and transparent communication represent the ultimate competitive advantages.'
  },
  {
    id: 'para-legal-justice',
    title: 'The Rule of Law & Constitutional Governance',
    category: 'Legal',
    lengthCategory: 'Long',
    wordCount: 260,
    difficulty: 'Expert',
    text: 'The rule of law serves as the foundational bedrock of any democratic society, ensuring that every citizen, institution, and public official remains subject to the law of the land. Constitutional supremacy mandates that no legislative enactment or executive decree may abridge fundamental human rights recognized by the constitution. Independent courts possess the extraordinary authority of judicial review to invalidate unconstitutional statutes and prevent abuses of administrative power. When procedural fairness or natural justice is compromised, affected individuals may petition the appellate judiciary for immediate writ remedies, including habeas corpus, mandamus, prohibition, and certiorari. A robust, accessible, and transparent legal system guarantees equal protection under the law, promotes civic confidence, and sustains social equilibrium across generations.'
  },
  {
    id: 'para-science-discovery',
    title: 'Empirical Science & Planetary Exploration',
    category: 'Science & Academic',
    lengthCategory: 'Medium',
    wordCount: 175,
    difficulty: 'Intermediate',
    text: 'Scientific exploration has expanded our understanding of the cosmos, from subatomic quantum mechanics to distant interstellar galaxies. Modern space telescopes capture infrared light from galaxies formed billions of years ago, illuminating the origins of stars and planetary systems. On Earth, climate scientists analyze polar ice cores to reconstruct historical atmospheric compositions, providing vital empirical data for forecasting environmental shifts. The pursuit of scientific truth demands rigorous peer review, objective skepticism, and collaborative international research.'
  }
];

// =========================================================================
// WEAK KEY TO WORD RECOMMENDATION MAPPING
// =========================================================================

export const ENGLISH_KEY_TO_WORDS: Record<string, string[]> = {
  'a': ['about', 'action', 'always', 'available', 'balance', 'capacity', 'database', 'manage'],
  'b': ['balance', 'behavior', 'between', 'business', 'background', 'bandwidth', 'bracket'],
  'c': ['capacity', 'central', 'circuit', 'complete', 'concept', 'condition', 'contract'],
  'd': ['database', 'decision', 'default', 'define', 'delivery', 'demand', 'develop'],
  'e': ['element', 'energy', 'enterprise', 'environment', 'evaluate', 'example', 'execute'],
  'f': ['factor', 'feature', 'feedback', 'figure', 'financial', 'flexible', 'framework'],
  'g': ['general', 'generate', 'global', 'government', 'gradient', 'graphics', 'growth'],
  'h': ['hardware', 'header', 'health', 'height', 'hierarchy', 'history', 'horizontal'],
  'i': ['identify', 'implement', 'import', 'improve', 'include', 'industry', 'information'],
  'j': ['journal', 'journey', 'judgment', 'judicial', 'junction', 'justice', 'justify'],
  'k': ['keyboard', 'keyword', 'knowledge', 'knapsack', 'kinetic', 'kernel', 'kitchen'],
  'l': ['language', 'launch', 'layout', 'legacy', 'legal', 'library', 'location'],
  'm': ['maintain', 'management', 'manual', 'market', 'matrix', 'maximum', 'measure'],
  'n': ['network', 'neutral', 'nominal', 'normal', 'notation', 'notice', 'number'],
  'o': ['object', 'observe', 'obtain', 'operate', 'opinion', 'option', 'output'],
  'p': ['package', 'parallel', 'pattern', 'performance', 'platform', 'policy', 'property', 'proper', 'prepare', 'part'],
  'q': ['quality', 'quantity', 'quantum', 'quarter', 'query', 'question', 'quick', 'quiet'],
  'r': ['random', 'reaction', 'record', 'reduce', 'reference', 'region', 'relation', 'report', 'transport'],
  's': ['sample', 'scale', 'schedule', 'schema', 'science', 'screen', 'section', 'standard'],
  't': ['target', 'technical', 'template', 'terminal', 'texture', 'theory', 'throughput', 'transport'],
  'u': ['ultimate', 'uniform', 'unique', 'unit', 'universal', 'update', 'upgrade', 'utility'],
  'v': ['validate', 'variable', 'velocity', 'vendor', 'version', 'vertical', 'virtual', 'visual'],
  'w': ['warning', 'warranty', 'water', 'waveform', 'website', 'weight', 'window', 'worker'],
  'x': ['exact', 'example', 'execute', 'exercise', 'expand', 'expert', 'export', 'extra'],
  'y': ['yearly', 'yellow', 'yield', 'young', 'yourself', 'syntax', 'system', 'dynamic'],
  'z': ['zero', 'zone', 'zoom', 'citizen', 'horizon', 'organize', 'realize', 'recognize'],
  ';': ['let;s', 'hello; world', 'item1; item2;', 'here; there;'],
  ',': ['first,', 'however,', 'therefore,', 'well,', 'yes,', 'no,', 'indeed,'],
  '.': ['end.', 'done.', 'finished.', 'next.', 'ready.', 'stop.'],
  '-': ['well-known', 'high-level', 'user-friendly', 'state-of-the-art', 'full-stack']
};
