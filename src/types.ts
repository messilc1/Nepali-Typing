export type LanguageMode = 'nepali' | 'english';

export type TestType = 'time' | 'words' | 'custom' | 'paragraph' | 'legal' | 'quote';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface TestSettings {
  language: LanguageMode;
  testType: TestType;
  durationSeconds: number; // For time mode
  wordCount: number; // For words mode
  customText: string;
  difficulty: DifficultyLevel;
  legalCategory?: string;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: 'Mukta' | 'Noto Sans Devanagari' | 'Plus Jakarta Sans';
  theme: 'white-blue' | 'dark' | 'high-contrast-blue';
  sound: 'none' | 'click' | 'mechanical' | 'typewriter';
  soundVolume: number;
  showLiveWpm: boolean;
  showLiveAccuracy: boolean;
  showKeyboard: boolean;
  showMistakes: boolean;
  showTimer: boolean;
  showCursorTrail: boolean;
}

export interface KeyStats {
  key: string;
  label: string;
  totalHits: number;
  correctHits: number;
  mistakes: number;
  totalTimeMs: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  language: LanguageMode;
  testType: TestType;
  durationSeconds: number;
  elapsedSeconds: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number; // 0 - 100
  totalCharactersTyped: number;
  correctCharacters: number;
  wrongCharacters: number;
  totalWordsTyped: number;
  correctWords: number;
  wrongWords: number;
  mistakesCount: number;
  backspacesCount: number;
  consistencyPercent: number;
  performanceGrade: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  wpmOverTime: { second: number; wpm: number; rawWpm: number; errors: number }[];
  keyStatsMap: Record<string, KeyStats>;
  mistypedWordsMap: Record<string, number>; // word -> count
  mistypedCharsMap: Record<string, number>; // char -> count
  slowWordsMap: Record<string, number>; // word -> avg ms
  sampleText: string;
}

export interface LegalTerm {
  devanagari: string;
  romanized: string;
  englishMeaning: string;
  category: 'Constitution' | 'Court & Judiciary' | 'Government & Admin' | 'Civil & Criminal';
  exampleSentence?: string;
}

export interface PracticeModule {
  id: string;
  title: string;
  nepaliTitle: string;
  category: 'vowels' | 'consonants' | 'matras' | 'half-letters' | 'conjuncts' | 'legal' | 'government' | 'custom';
  items: string[];
  description: string;
}

export interface UserStats {
  totalTestsCompleted: number;
  totalTimeSpentSeconds: number;
  highestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  currentStreakDays: number;
  lastPracticeDate: string; // YYYY-MM-DD
  history: TestResult[];
  unlockedBadges: string[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
