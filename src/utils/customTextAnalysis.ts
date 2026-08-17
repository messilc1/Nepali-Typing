import { DifficultyLevel, LanguageMode } from '../types';

export interface CustomTextStats {
  characterCount: number;
  characterCountNoSpaces: number;
  wordCount: number;
  paragraphCount: number;
  sentenceCount: number;
  estimatedDifficulty: DifficultyLevel | 'expert';
  difficultyScore: number; // 0 - 100
  difficultyReasons: string[];
  estimatedTimeSecondsAt30Wpm: number;
  estimatedTimeSecondsAt50Wpm: number;
  uniqueWordsCount: number;
}

export interface CustomPreset {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  language?: LanguageMode;
  durationSeconds: number; // 0 for no limit
  noTimeLimit: boolean;
  mistakeMode: 'strict' | 'allow';
  maxMistakes: number | null; // null for no limit, or 5, 10, 20, custom
  maxMistakesAction: 'end_test' | 'continue';
  backspaceEnabled: boolean;
  showHints: boolean;
  showKeyboard: boolean;
  highlightNextKey: boolean;
  showFingerGuidance: boolean;
  showCurrentCharacter: boolean;
  showNextCharacter: boolean;
  showLiveWpm: boolean;
  showNetWpm: boolean;
  showGrossWpm: boolean;
  showLiveAccuracy: boolean;
  autoStartOnKeyPress: boolean;
  showCountdown: boolean;
  recordAnalytics: boolean;
  recordMistakes: boolean;
  recordCorrectedMistakes: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  fontFamily: string;
  difficulty: DifficultyLevel;
  lineSpacing: 'normal' | 'relaxed' | 'loose';
  textAreaSize: 'compact' | 'standard' | 'spacious';
}

export const DEFAULT_CUSTOM_PRESETS: CustomPreset[] = [
  {
    id: 'preset-legal-practice',
    name: '⚖️ Legal Practice',
    icon: '⚖️',
    description: '3 minutes, Strict Mode, High Precision, Keyboard & Finger Guidance Enabled',
    language: 'nepali',
    durationSeconds: 180,
    noTimeLimit: false,
    mistakeMode: 'strict',
    maxMistakes: null,
    maxMistakesAction: 'continue',
    backspaceEnabled: true,
    showHints: false,
    showKeyboard: true,
    highlightNextKey: true,
    showFingerGuidance: true,
    showCurrentCharacter: true,
    showNextCharacter: true,
    showLiveWpm: true,
    showNetWpm: true,
    showGrossWpm: true,
    showLiveAccuracy: true,
    autoStartOnKeyPress: true,
    showCountdown: false,
    recordAnalytics: true,
    recordMistakes: true,
    recordCorrectedMistakes: true,
    fontSize: 'md',
    fontFamily: 'Kalimati',
    difficulty: 'hard',
    lineSpacing: 'relaxed',
    textAreaSize: 'standard'
  },
  {
    id: 'preset-speed-training',
    name: '⚡ Speed Training',
    icon: '⚡',
    description: '1 minute fast sprint, Mistakes Allowed for maximum flow, Hints OFF',
    language: 'nepali',
    durationSeconds: 60,
    noTimeLimit: false,
    mistakeMode: 'allow',
    maxMistakes: null,
    maxMistakesAction: 'continue',
    backspaceEnabled: true,
    showHints: false,
    showKeyboard: false,
    highlightNextKey: false,
    showFingerGuidance: false,
    showCurrentCharacter: true,
    showNextCharacter: true,
    showLiveWpm: true,
    showNetWpm: true,
    showGrossWpm: true,
    showLiveAccuracy: true,
    autoStartOnKeyPress: true,
    showCountdown: false,
    recordAnalytics: true,
    recordMistakes: true,
    recordCorrectedMistakes: true,
    fontSize: 'lg',
    fontFamily: 'Kalimati',
    difficulty: 'medium',
    lineSpacing: 'normal',
    textAreaSize: 'standard'
  },
  {
    id: 'preset-accuracy-training',
    name: '🎯 Accuracy Training',
    icon: '🎯',
    description: '5 minutes, Strict Mode with Live Hints and on-screen keyboard feedback',
    language: 'nepali',
    durationSeconds: 300,
    noTimeLimit: false,
    mistakeMode: 'strict',
    maxMistakes: 10,
    maxMistakesAction: 'continue',
    backspaceEnabled: true,
    showHints: true,
    showKeyboard: true,
    highlightNextKey: true,
    showFingerGuidance: true,
    showCurrentCharacter: true,
    showNextCharacter: true,
    showLiveWpm: true,
    showNetWpm: true,
    showGrossWpm: false,
    showLiveAccuracy: true,
    autoStartOnKeyPress: true,
    showCountdown: false,
    recordAnalytics: true,
    recordMistakes: true,
    recordCorrectedMistakes: true,
    fontSize: 'md',
    fontFamily: 'Kalimati',
    difficulty: 'hard',
    lineSpacing: 'relaxed',
    textAreaSize: 'standard'
  },
  {
    id: 'preset-untimed-marathon',
    name: '📖 Complete Text (No Time Limit)',
    icon: '📖',
    description: 'Type until the full text is finished. Automatically completes upon last character.',
    language: 'nepali',
    durationSeconds: 0,
    noTimeLimit: true,
    mistakeMode: 'strict',
    maxMistakes: null,
    maxMistakesAction: 'continue',
    backspaceEnabled: true,
    showHints: true,
    showKeyboard: true,
    highlightNextKey: true,
    showFingerGuidance: true,
    showCurrentCharacter: true,
    showNextCharacter: true,
    showLiveWpm: true,
    showNetWpm: true,
    showGrossWpm: true,
    showLiveAccuracy: true,
    autoStartOnKeyPress: true,
    showCountdown: false,
    recordAnalytics: true,
    recordMistakes: true,
    recordCorrectedMistakes: true,
    fontSize: 'md',
    fontFamily: 'Kalimati',
    difficulty: 'medium',
    lineSpacing: 'relaxed',
    textAreaSize: 'spacious'
  }
];

const PRESETS_STORAGE_KEY = 'nepali_typing_custom_presets';

export function getStoredCustomPresets(): CustomPreset[] {
  try {
    const saved = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Fallback
  }
  return DEFAULT_CUSTOM_PRESETS;
}

export function saveCustomPresets(presets: CustomPreset[]): void {
  try {
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (e) {
    console.error('Failed to save custom presets', e);
  }
}

/**
 * Analyzes custom text and extracts comprehensive statistics and difficulty evaluation
 */
export function analyzeCustomText(text: string, language: LanguageMode = 'nepali'): CustomTextStats {
  const trimmed = text.trim();
  if (!trimmed) {
    return {
      characterCount: 0,
      characterCountNoSpaces: 0,
      wordCount: 0,
      paragraphCount: 0,
      sentenceCount: 0,
      estimatedDifficulty: 'easy',
      difficultyScore: 10,
      difficultyReasons: ['No text provided'],
      estimatedTimeSecondsAt30Wpm: 0,
      estimatedTimeSecondsAt50Wpm: 0,
      uniqueWordsCount: 0
    };
  }

  const characterCount = trimmed.length;
  const characterCountNoSpaces = trimmed.replace(/\s+/g, '').length;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const uniqueWordsCount = new Set(words.map(w => w.toLowerCase())).size;

  const paragraphs = trimmed.split(/\n+/).filter(p => p.trim().length > 0);
  const paragraphCount = Math.max(1, paragraphs.length);

  const sentences = trimmed.split(/[।\.!\?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  const estimatedTimeSecondsAt30Wpm = Math.max(5, Math.round((wordCount / 30) * 60));
  const estimatedTimeSecondsAt50Wpm = Math.max(5, Math.round((wordCount / 50) * 60));

  let score = 20;
  const reasons: string[] = [];

  if (language === 'nepali') {
    // Check for complex conjuncts (संयुक्ताक्षर)
    const complexConjuncts = trimmed.match(/[क्ष|त्र|ज्ञ|श्र|द्ध|द्व|द्य|ष्ट|ष्ठ|न्त|म्प|क्त|त्त|ङ्क|ङ्ग|ञ्च|म्भ|ल्प|ष्ट्र|न्द्र|ऋ|ॐ]/g) || [];
    const halants = trimmed.match(/्/g) || [];
    const rareLetters = trimmed.match(/[ण|ष|ङ|ञ|ऋ|ट|ठ|ड|ढ]/g) || [];
    const matras = trimmed.match(/[ा|ि|ी|ु|ू|े|ै|ो|ौ|ं|ः|ँ|ृ]/g) || [];

    const conjunctRatio = complexConjuncts.length / Math.max(1, wordCount);
    const halantRatio = halants.length / Math.max(1, wordCount);

    if (complexConjuncts.length > 0) {
      const conjunctScore = Math.min(30, Math.round(conjunctRatio * 20));
      score += conjunctScore;
      reasons.push(`${complexConjuncts.length} complex conjuncts (युक्ताक्षर)`);
    }

    if (halants.length > 0) {
      const halantScore = Math.min(25, Math.round(halantRatio * 15));
      score += halantScore;
      reasons.push(`${halants.length} half-letters (आधा अक्षर)`);
    }

    if (rareLetters.length > 0) {
      score += Math.min(15, rareLetters.length * 2);
      reasons.push(`${rareLetters.length} upper-tier characters`);
    }

    const avgWordLen = characterCountNoSpaces / Math.max(1, wordCount);
    if (avgWordLen > 6) {
      score += 15;
      reasons.push('Long polysyllabic vocabulary');
    } else if (avgWordLen > 4.5) {
      score += 8;
    }
  } else {
    // English language analysis
    const uppercaseChars = trimmed.match(/[A-Z]/g) || [];
    const numbersAndPunct = trimmed.match(/[\d\.,!?:;"'()\[\]{}\-–—/@#$%^&*+=<>]/g) || [];
    const avgWordLen = characterCountNoSpaces / Math.max(1, wordCount);

    if (avgWordLen > 7) {
      score += 25;
      reasons.push('Advanced vocabulary (long words)');
    } else if (avgWordLen > 5.5) {
      score += 15;
      reasons.push('Moderate word length');
    }

    if (numbersAndPunct.length > 0) {
      const punctRatio = numbersAndPunct.length / Math.max(1, characterCount);
      if (punctRatio > 0.08) {
        score += 20;
        reasons.push('High punctuation and symbol density');
      } else if (punctRatio > 0.03) {
        score += 10;
        reasons.push('Standard punctuation');
      }
    }

    if (uppercaseChars.length > wordCount * 0.3) {
      score += 15;
      reasons.push('Frequent capitalization/casing');
    }
  }

  // Length impact
  if (wordCount > 200) {
    score += 15;
    reasons.push('Long passage (200+ words)');
  } else if (wordCount > 100) {
    score += 8;
  }

  let estimatedDifficulty: DifficultyLevel | 'expert' = 'easy';
  if (score >= 75) {
    estimatedDifficulty = 'expert';
  } else if (score >= 50) {
    estimatedDifficulty = 'hard';
  } else if (score >= 30) {
    estimatedDifficulty = 'medium';
  } else {
    estimatedDifficulty = 'easy';
  }

  if (reasons.length === 0) {
    reasons.push('Standard conversational vocabulary');
  }

  return {
    characterCount,
    characterCountNoSpaces,
    wordCount,
    paragraphCount,
    sentenceCount,
    estimatedDifficulty,
    difficultyScore: Math.min(100, Math.max(10, score)),
    difficultyReasons: reasons,
    estimatedTimeSecondsAt30Wpm,
    estimatedTimeSecondsAt50Wpm,
    uniqueWordsCount
  };
}
