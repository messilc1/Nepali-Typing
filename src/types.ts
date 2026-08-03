export interface LiveStats {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  elapsedSeconds: number;
  remainingSeconds: number | null;
  totalWords: number;
  completedWordsCount: number;
  mistakesCount: number;
  backspacesCount: number;
  totalCharactersTyped: number;
  correctCharacters: number;
  wrongCharacters: number;
  correctWords: number;
  wrongWords: number;
  consistency: number;
}

export type NavigationTab = 'test' | 'practice' | 'legal' | 'analytics' | 'certification' | 'about';

export type LanguageMode = 'nepali' | 'english';

export interface CertificationUser {
  googleId?: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  mobileNumber: string;
  permanentAddress: string;
  district: string;
  province: string;
  country: string;
  idType: 'Citizenship Certificate' | 'National ID Card' | 'Passport' | 'Driving Licence' | 'Other';
  idNumber: string;
  registeredAt: number;
  isRegistered: boolean;
}

export interface CertificationTestScore {
  testIndex: number; // 1, 2, 3
  testName: string;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  consistency: number;
  durationSeconds: number;
  mistakes: number;
  backspaces: number;
  totalWords: number;
  totalCharacters: number;
  completedAt: number;
}

export interface CertificationAttempt {
  id: string; // e.g. CERT-NTP-2026-X8921
  user: CertificationUser;
  startedAt: number;
  completedAt?: number;
  status: 'in_progress' | 'pending_verification' | 'completed' | 'invalidated';
  isVerifiedByCreator?: boolean;
  verifiedAt?: number;
  verifiedBy?: string;
  invalidationReason?: string;
  tabSwitchViolations: number;
  scores: CertificationTestScore[];
  avgNetWpm?: number;
  avgGrossWpm?: number;
  avgAccuracy?: number;
  avgConsistency?: number;
  certificateGrade?: 'Excellent' | 'Good' | 'Participation' | 'Failed';
}

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
  fontFamily: 'Kalimati' | 'Noto Sans Devanagari' | 'Noto Serif Devanagari' | 'Mukta' | 'Kokila' | 'Mangal' | 'Aparajita' | 'Tiro Devanagari' | 'Plus Jakarta Sans' | string;
  theme: 'white-blue' | 'dark' | 'high-contrast-blue';
  sound: 'none' | 'click' | 'mechanical' | 'typewriter';
  soundVolume: number;
  showLiveWpm: boolean;
  showLiveAccuracy: boolean;
  showKeyboard: boolean;
  showMistakes: boolean;
  showTimer: boolean;
  showCursorTrail: boolean;
  showHints: boolean;
}

export interface KeyStats {
  key: string;
  label: string;
  totalHits: number;
  correctHits: number;
  mistakes: number;
  totalTimeMs: number;
}

export type SessionStatus = 'Completed' | 'Timed Out' | 'Abandoned' | 'Interrupted';

export interface TestResult {
  id: string;
  timestamp: number;
  lastActivityTimestamp?: number;
  language: LanguageMode;
  testType: TestType;
  sessionStatus?: SessionStatus;
  progressPercent?: number;
  durationSeconds: number;
  elapsedSeconds: number;
  remainingSeconds?: number | null;
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
  categoryOrTitle?: string;
}

export interface LegalTerm {
  devanagari: string;
  romanized: string;
  englishMeaning: string;
  category: 'Constitution' | 'Court & Judiciary' | 'Government & Admin' | 'Civil & Criminal';
  exampleSentence?: string;
}

export interface LegalPassage {
  id: string;
  title: string;
  nepaliTitle: string;
  category: 'Constitution' | 'Court & Judiciary' | 'Fundamental Rights' | 'Civil & Criminal' | 'Court Procedures' | 'Public Administration' | 'Lok Sewa Model Questions';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  lengthCategory: 'Short' | 'Medium' | 'Long'; // Short: ~100-150 words, Medium: ~250-350 words, Long: 500+ words
  wordCount: number;
  keyTermsIncluded: string[];
  text: string;
  description: string;
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
