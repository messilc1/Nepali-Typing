/**
 * Universal Speed & WPM Calculation Engine
 * 
 * CORE PRINCIPLE:
 * "One actual completed word = one word."
 * Never convert characters into artificial 5-character words for primary speed measurement.
 * 
 * Formulas:
 * ACTUAL SPEED = Completed Words ÷ Time in Minutes
 * ERROR-FREE SPEED = Correct Words ÷ Time in Minutes
 * 
 * Metrics:
 * 1. Completed Words: Every word the user actually finishes and moves past (or finishes at the end of the test).
 * 2. Correct Words: Words that are ultimately completed with correct spelling.
 * 3. Incorrect Words: Completed Words − Correct Words (words completed with mistakes).
 * 4. Corrected Words: Words where temporary mistakes were made during typing but corrected via Backspace before word completion.
 * 5. Word Accuracy: (Correct Words ÷ Completed Words) * 100
 * 6. Keystroke Accuracy: (Correct Keystrokes ÷ Total Relevant Keystrokes) * 100
 * 
 * Rules:
 * - Incomplete words when the timer expires are NOT counted towards completed words.
 * - Spaces act as word completion separators. Multiple spaces do not create empty/fake words.
 * - If the test finishes on the last word without a space, the last word is counted as completed if typed correctly.
 * - Punctuation attached to words does not create separate words.
 * - Works identically for Nepali Unicode and English texts.
 */

export interface WordToken {
  index: number;
  word: string;
  cleanWord: string; // stripped of edge punctuation if needed
  startIndex: number;
  endIndex: number; // exclusive index (index after last character of word)
}

export interface WordState {
  index: number;
  target: string;
  currentInput: string;
  completed: boolean;
  ultimatelyCorrect: boolean;
  temporarilyMistyped: boolean;
  corrected: boolean;
  mistakeCount: number;
}

export interface WordEvaluationResult {
  completedWords: number;
  correctWords: number;
  incorrectWords: number;
  wrongWords: number; // alias for incorrectWords
  correctedWords: number;
  wordAccuracy: number;
  actualSpeed: number;
  errorFreeSpeed: number;
  errorSpeed: number; // alias for errorFreeSpeed
  grossWpm: number; // alias for actualSpeed
  netWpm: number; // alias for errorFreeSpeed
  wordStates: WordState[];
}

/**
 * Splits target text into whitespace-delimited word tokens with accurate string index boundaries.
 * Multiple consecutive whitespace characters (including newlines and tabs) are treated as single separators.
 */
export function getWordTokens(targetText: string): WordToken[] {
  if (!targetText) return [];
  const tokens: WordToken[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = regex.exec(targetText)) !== null) {
    const rawWord = match[0];
    // Strip leading/trailing punctuation for clean representation if needed, but preserve raw token
    const cleanWord = rawWord.replace(/^[.,/#!$%^&*;:{}=\-_`~()"।]+|[.,/#!$%^&*;:{}=\-_`~()"।]+$/g, '');
    tokens.push({
      index: idx++,
      word: rawWord,
      cleanWord: cleanWord || rawWord,
      startIndex: match.index,
      endIndex: match.index + rawWord.length
    });
  }

  return tokens;
}

/**
 * Counts the number of actually completed words based on character progress in a continuous character stream.
 * Incomplete word at the current position is not counted unless test is finished and user reached the end of the last word.
 */
export function countCompletedWordsFromCharProgress(
  typedCharsLength: number,
  targetText: string,
  isTestFinishedAtEnd: boolean = false
): number {
  if (typedCharsLength <= 0 || !targetText) return 0;

  const tokens = getWordTokens(targetText);
  let completed = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isLastToken = i === tokens.length - 1;

    if (isTestFinishedAtEnd && isLastToken && typedCharsLength >= token.endIndex) {
      completed++;
    } else if (typedCharsLength > token.endIndex) {
      // Typed past the end index of the word (i.e. pressed space or moved on)
      completed++;
    } else {
      // Still on or before this word -> not completed
      break;
    }
  }

  return completed;
}

/**
 * Evaluates completed words, correct words, incorrect words, corrected words, and speeds
 * from character-level typing test results (e.g. English typing or character-stream Nepali).
 */
export function evaluateCompletedWordsFromChars(
  targetText: string,
  typedChars: { char: string; isCorrect: boolean }[],
  isFinished: boolean = false,
  elapsedSeconds: number = 0,
  wordMistakeHistory?: Map<number, boolean>
): WordEvaluationResult {
  if (!targetText || !typedChars || typedChars.length === 0) {
    return {
      completedWords: 0,
      correctWords: 0,
      incorrectWords: 0,
      wrongWords: 0,
      correctedWords: 0,
      wordAccuracy: 100,
      actualSpeed: 0,
      errorFreeSpeed: 0,
      errorSpeed: 0,
      grossWpm: 0,
      netWpm: 0,
      wordStates: []
    };
  }

  const tokens = getWordTokens(targetText);
  const typedLen = typedChars.length;
  const wordStates: WordState[] = [];

  let completedWords = 0;
  let correctWords = 0;
  let incorrectWords = 0;
  let correctedWords = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isLastToken = i === tokens.length - 1;
    const isCompleted = (isFinished && isLastToken && typedLen >= token.endIndex) || (typedLen > token.endIndex);

    // Extract current input for this word token
    let currentInput = '';
    const sliceEnd = Math.min(typedLen, token.endIndex);
    if (sliceEnd > token.startIndex) {
      currentInput = typedChars.slice(token.startIndex, sliceEnd).map(c => c.char).join('');
    }

    // Check if the word is ultimately correct in the submitted/completed text
    let isUltimatelyCorrect = isCompleted;
    if (isCompleted) {
      for (let cIdx = token.startIndex; cIdx < token.endIndex; cIdx++) {
        if (cIdx >= typedChars.length || !typedChars[cIdx].isCorrect) {
          isUltimatelyCorrect = false;
          break;
        }
      }
    } else {
      isUltimatelyCorrect = false;
    }

    const hadMistake = wordMistakeHistory ? (wordMistakeHistory.get(i) || false) : false;
    const isCorrected = isCompleted && isUltimatelyCorrect && hadMistake;

    if (isCompleted) {
      completedWords++;
      if (isUltimatelyCorrect) {
        correctWords++;
        if (isCorrected) {
          correctedWords++;
        }
      } else {
        incorrectWords++;
      }
    }

    wordStates.push({
      index: i,
      target: token.word,
      currentInput,
      completed: isCompleted,
      ultimatelyCorrect: isUltimatelyCorrect,
      temporarilyMistyped: hadMistake,
      corrected: isCorrected,
      mistakeCount: hadMistake ? 1 : 0
    });

    if (!isCompleted) {
      // Incomplete word reached -> remaining tokens cannot be completed yet
      break;
    }
  }

  const actualSpeed = calculateActualSpeed(completedWords, elapsedSeconds);
  const errorFreeSpeed = calculateErrorSpeed(correctWords, elapsedSeconds);
  const wordAccuracy = completedWords > 0 ? Math.min(100, Math.max(0, Math.round((correctWords / completedWords) * 100))) : 100;

  return {
    completedWords,
    correctWords,
    incorrectWords,
    wrongWords: incorrectWords,
    correctedWords,
    wordAccuracy,
    actualSpeed,
    errorFreeSpeed,
    errorSpeed: errorFreeSpeed,
    grossWpm: actualSpeed,
    netWpm: errorFreeSpeed,
    wordStates
  };
}

/**
 * Evaluates words from word-by-word array test modes (e.g. Nepali typing test with word history).
 */
export function evaluateCompletedWordsFromWordArrays(
  targetWords: string[],
  history: string[],
  currentWordIndex: number,
  activeInput: string,
  isFinished: boolean = false,
  elapsedSeconds: number = 0,
  correctedWordsSet?: Set<number>
): WordEvaluationResult {
  let correctWords = 0;
  let incorrectWords = 0;
  let correctedWords = 0;
  const wordStates: WordState[] = [];

  // Committed words in history
  history.forEach((typed, idx) => {
    if (idx < targetWords.length) {
      const target = targetWords[idx];
      const isCorrect = typed === target;
      const wasCorrected = isCorrect && correctedWordsSet ? correctedWordsSet.has(idx) : false;

      if (isCorrect) {
        correctWords++;
        if (wasCorrected) correctedWords++;
      } else {
        incorrectWords++;
      }

      wordStates.push({
        index: idx,
        target,
        currentInput: typed,
        completed: true,
        ultimatelyCorrect: isCorrect,
        temporarilyMistyped: wasCorrected,
        corrected: wasCorrected,
        mistakeCount: isCorrect ? (wasCorrected ? 1 : 0) : 1
      });
    }
  });

  let completedWords = history.length;

  // If the test finished at the end and the active input completed the final target word
  if (isFinished && currentWordIndex === targetWords.length - 1 && activeInput === targetWords[currentWordIndex]) {
    if (!history[currentWordIndex]) {
      const target = targetWords[currentWordIndex];
      const wasCorrected = correctedWordsSet ? correctedWordsSet.has(currentWordIndex) : false;
      completedWords++;
      correctWords++;
      if (wasCorrected) correctedWords++;

      wordStates.push({
        index: currentWordIndex,
        target,
        currentInput: activeInput,
        completed: true,
        ultimatelyCorrect: true,
        temporarilyMistyped: wasCorrected,
        corrected: wasCorrected,
        mistakeCount: wasCorrected ? 1 : 0
      });
    }
  }

  const actualSpeed = calculateActualSpeed(completedWords, elapsedSeconds);
  const errorFreeSpeed = calculateErrorSpeed(correctWords, elapsedSeconds);
  const wordAccuracy = completedWords > 0 ? Math.min(100, Math.max(0, Math.round((correctWords / completedWords) * 100))) : 100;

  return {
    completedWords,
    correctWords,
    incorrectWords,
    wrongWords: incorrectWords,
    correctedWords,
    wordAccuracy,
    actualSpeed,
    errorFreeSpeed,
    errorSpeed: errorFreeSpeed,
    grossWpm: actualSpeed,
    netWpm: errorFreeSpeed,
    wordStates
  };
}

/**
 * Calculates ACTUAL SPEED (Words Per Minute based on all completed words).
 * 
 * Formula:
 * ACTUAL SPEED = Completed Words ÷ Time in Minutes
 * 
 * Examples:
 * 15 completed words in 1 min  = 15 WPM
 * 30 completed words in 2 min  = 15 WPM
 * 100 completed words in 5 min = 20 WPM
 * 75 completed words in 3 min  = 25 WPM
 */
export function calculateActualSpeed(completedWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || completedWords <= 0) return 0;
  const timeInMinutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(completedWords / timeInMinutes));
}

/**
 * Calculates ERROR-FREE SPEED (Words Per Minute based on correctly completed words).
 * 
 * Formula:
 * ERROR-FREE SPEED = Correctly Completed Words ÷ Time in Minutes
 * 
 * Examples:
 * 20 words completed (18 correct, 2 incorrect) in 1 min:
 * ACTUAL SPEED = 20 WPM
 * ERROR-FREE SPEED = 18 WPM
 */
export function calculateErrorSpeed(correctWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctWords <= 0) return 0;
  const timeInMinutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(correctWords / timeInMinutes));
}

export const calculateErrorFreeSpeed = calculateErrorSpeed;
export const calculateNetWpm = calculateErrorSpeed;

/**
 * Calculates live speed smoothly based on actual completed words.
 */
export function calculateLiveActualSpeed(completedWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || completedWords <= 0) return 0;
  const timeInMinutes = Math.max(elapsedSeconds / 60, 0.05);
  return Math.max(0, Math.round(completedWords / timeInMinutes));
}

export function calculateLiveErrorSpeed(correctWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctWords <= 0) return 0;
  const timeInMinutes = Math.max(elapsedSeconds / 60, 0.05);
  return Math.max(0, Math.round(correctWords / timeInMinutes));
}
