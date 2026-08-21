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
  lokSewaCwpm?: number;
  lokSewaMarks?: number;
  isLokSewaMode?: boolean;
}

export type NavigationTab = 'test' | 'english' | 'arena' | 'practice' | 'improvement' | 'legal' | 'analytics' | 'certification' | 'about';

export * from './types/arenaTypes';
export * from './utils/customTextAnalysis';

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
export type ThemeType = 'dark' | 'light' | 'white-blue' | 'system' | 'high-contrast-blue';

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
  theme: ThemeType;
  sound: 'none' | 'click' | 'mechanical' | 'typewriter';
  soundVolume: number;
  showLiveWpm: boolean;
  showNetWpm?: boolean;
  showGrossWpm?: boolean;
  showLiveAccuracy: boolean;
  showKeyboard: boolean;
  highlightNextKey?: boolean;
  showFingerGuidance?: boolean;
  showCurrentCharacter?: boolean;
  showNextCharacter?: boolean;
  showMistakes: boolean;
  showTimer: boolean;
  showCursorTrail: boolean;
  showHints: boolean;
  // Advanced Custom Text & Test Settings
  mistakeMode?: 'strict' | 'allow';
  maxMistakes?: number | null; // null = no limit, 5, 10, 20, or custom
  maxMistakesAction?: 'end_test' | 'continue';
  backspaceEnabled?: boolean;
  noTimeLimit?: boolean;
  customDurationSeconds?: number;
  autoStartOnKeyPress?: boolean;
  showCountdown?: boolean;
  recordAnalytics?: boolean;
  recordMistakes?: boolean;
  recordCorrectedMistakes?: boolean;
  lineSpacing?: 'normal' | 'relaxed' | 'loose';
  textAreaSize?: 'compact' | 'standard' | 'spacious';
  lokSewaMode?: boolean;
}

export interface KeyStats {
  key: string;
  label: string;
  totalHits: number;
  correctHits: number;
  mistakes: number;
  totalTimeMs: number;
}

export interface DetailedWordError {
  targetWord: string;
  typedWord: string;
  mistakes: number;
  corrected: boolean;
  timeSpentMs?: number;
  backspacesUsed?: number;
  correctionMethod?: 'Backspace' | 'None';
  correctionTimeMs?: number;
  errorPosition?: number;
  timestamp?: number;
}

export interface DetailedCharError {
  targetChar: string;
  typedChar: string;
  frequency: number;
  targetWord?: string;
  position?: number;
  corrected?: boolean;
  correctionMethod?: 'Backspace' | 'None';
  correctionTimeMs?: number;
  timestamp?: number;
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
  accuracy: number; // 0 - 100 (Final Submitted Text Accuracy)
  finalAccuracy?: number; // Explicit alias for final submitted accuracy (100% when all words corrected)
  keystrokeAccuracy?: number; // Raw keystroke accuracy factoring in mistakes before correction
  correctedMistakesCount?: number; // Mistakes that were corrected with Backspace
  uncorrectedMistakesCount?: number; // Mistakes left uncorrected
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
  wordErrors?: DetailedWordError[];
  charErrors?: DetailedCharError[];
  sampleText: string;
  categoryOrTitle?: string;
  isLokSewaMode?: boolean;
  lokSewaCwpm?: number;
  lokSewaMarks?: number;
  lokSewaPassed?: boolean;
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

export interface WeakKeyAnalysis {
  key: string; // e.g. 'ny', 'N', 'tr', 'r'
  devanagari: string; // e.g. 'न्य', 'ण', 'त्र', 'र'
  romanizedSequence: string; // e.g. 'ny', 'N', 'tr', 'r'
  mistakesCount: number;
  totalHits: number;
  accuracy: number; // 0 - 100
  avgLatencyMs: number;
  errorWeight: number; // calculated priority score
  sampleWords: string[];
  category: 'conjunct' | 'half-letter' | 'consonant' | 'vowel' | 'matra' | 'legal-specific' | 'general';
}

export interface WeakWordRecord {
  word: string;
  romanized: string;
  timesTyped: number;
  mistakesCount: number;
  accuracy: number;
  avgTimeMs: number;
  correctionsCount: number;
  lastMistakeDate: number;
  improvementPercent: number;
  category?: string;
}

export type PracticeLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface GeneratedExercise {
  level: PracticeLevel;
  levelTitle: string;
  levelDescription: string;
  targetKeys: string[];
  targetSequences: string[];
  targetDevanagari: string[];
  items: string[];
  fullText: string;
  recommendedAccuracy: number;
  isLegalFocus?: boolean;
}

export interface DailyImprovementChallenge {
  date: string;
  focusKey: string;
  focusDevanagari: string;
  focusRomanized: string;
  characterDrills: string[];
  wordDrills: string[];
  difficultWords: string[];
  paragraph: string;
  isCompleted: boolean;
  initialAccuracy?: number;
  finalAccuracy?: number;
  improvementScore?: number;
}

// =========================================================================
// ENGLISH TYPING ACADEMY & LEARNING SYSTEM TYPES
// =========================================================================

export type EnglishMilestoneTier =
  | 'Beginner' // 10 WPM
  | 'Basic' // 20 WPM
  | 'Developing' // 30 WPM
  | 'Intermediate' // 40 WPM
  | 'Good' // 50 WPM
  | 'Advanced' // 60 WPM
  | 'Professional' // 70 WPM
  | 'Expert'; // 80+ WPM

export interface EnglishLevelExercise {
  id: string;
  level: number; // 1 to 7
  lessonNumber: number;
  title: string;
  subtitle: string;
  description: string;
  focusKeys: string[];
  fingerGuidance: string;
  targetText: string;
  minAccuracy: number; // 85% to pass, 95%+ to master and unlock next
  targetWpm: number;
  mode: 'letters' | 'words' | 'sentences' | 'paragraph' | 'mixed';
}

export interface EnglishLevelInfo {
  level: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  focusConcept: string;
  targetWpmRange: string;
  exercises: EnglishLevelExercise[];
}

export interface EnglishUserProgress {
  unlockedLevel: number;
  unlockedExerciseId: string;
  completedExercises: Record<string, {
    wpm: number;
    accuracy: number;
    date: string;
    stars: number; // 1, 2, 3 stars (1: >=80%, 2: >=90%, 3: >=95%)
    passed: boolean;
  }>;
}

export interface EnglishWeakKeyAnalysis {
  key: string;
  finger: string;
  hand: 'Left' | 'Right';
  mistakesCount: number;
  totalHits: number;
  accuracy: number;
  avgLatencyMs: number;
  recommendedWords: string[];
}

export interface EnglishParagraphTest {
  id: string;
  title: string;
  category: 'Business' | 'Technology' | 'Legal' | 'Science & Academic' | 'Literature' | 'General';
  lengthCategory: 'Short' | 'Medium' | 'Long';
  wordCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  text: string;
}

export interface EnglishPracticeModule {
  id: string;
  title: string;
  category: 'home-row' | 'all-rows' | 'common-words' | 'sentences' | 'numbers-symbols' | 'technical' | 'legal' | 'custom' | string;
  description: string;
  items: string[];
}

export interface EnglishImprovementDrill {
  id: string;
  title: string;
  stage: 1 | 2 | 3 | 4 | 5;
  stageName: 'Key Drills' | 'Key Combinations' | 'Target Words' | 'Practice Sentences' | 'Contextual Paragraph';
  targetKeys: string[];
  content: string;
  description: string;
}


