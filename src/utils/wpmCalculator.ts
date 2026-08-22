/**
 * Universal Speed & WPM Calculation Engine
 * 
 * Formula:
 * ACTUAL SPEED = Total Completed Words ÷ Time in Minutes
 * ERROR SPEED / ERROR-FREE SPEED = Correctly Completed Words ÷ Time in Minutes
 * 
 * Rules:
 * 1. Completed Words = only words where the user finished the word and moved past its separator (Space),
 *    or reached the end of the test.
 * 2. Incomplete words are NOT counted towards completed words when the timer expires.
 * 3. Corrected Mistakes: If a user makes a mistake while typing a word but corrects it using Backspace
 *    before completing the word, the final word is treated as a CORRECT completed word.
 * 4. Only words that are ultimately submitted with errors are counted as wrong/incorrect words.
 */

export interface WordToken {
  word: string;
  startIndex: number;
  endIndex: number; // exclusive index (index after last character of word)
}

/**
 * Parses target text into word tokens with exact start and end string offsets.
 */
export function getWordTokens(targetText: string): WordToken[] {
  if (!targetText) return [];
  const tokens: WordToken[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(targetText)) !== null) {
    tokens.push({
      word: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }

  return tokens;
}

/**
 * Counts the number of actually completed words based on character progress.
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
      // User typed past this word (e.g. typed the following space or subsequent characters)
      completed++;
    } else {
      // User is either before this word or in the middle of typing it -> not completed
      break;
    }
  }

  return completed;
}

/**
 * Evaluates completed words, correct words, and wrong words from typed character entries.
 */
export function evaluateCompletedWordsFromChars(
  targetText: string,
  typedChars: { char: string; isCorrect: boolean }[],
  isFinished: boolean = false
): {
  completedWords: number;
  correctWords: number;
  wrongWords: number;
} {
  if (!targetText || !typedChars || typedChars.length === 0) {
    return { completedWords: 0, correctWords: 0, wrongWords: 0 };
  }

  const tokens = getWordTokens(targetText);
  let completedWords = 0;
  let correctWords = 0;
  let wrongWords = 0;

  const typedLen = typedChars.length;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const isLastToken = i === tokens.length - 1;

    const isCompleted = (isFinished && isLastToken && typedLen >= token.endIndex) || (typedLen > token.endIndex);

    if (isCompleted) {
      completedWords++;
      
      // Check if all characters in the word token are correct in the final typed text
      let isWordCorrect = true;
      for (let cIdx = token.startIndex; cIdx < token.endIndex; cIdx++) {
        if (cIdx >= typedChars.length || !typedChars[cIdx].isCorrect) {
          isWordCorrect = false;
          break;
        }
      }

      if (isWordCorrect) {
        correctWords++;
      } else {
        wrongWords++;
      }
    } else {
      // Current word is still in progress -> do not count as completed
      break;
    }
  }

  return {
    completedWords,
    correctWords,
    wrongWords
  };
}

/**
 * Evaluates words from word-by-word test mode (Nepali typing test / word arrays).
 */
export function evaluateCompletedWordsFromWordArrays(
  targetWords: string[],
  history: string[],
  currentWordIndex: number,
  activeInput: string,
  isFinished: boolean = false
): {
  completedWords: number;
  correctWords: number;
  wrongWords: number;
} {
  let correctWords = 0;
  let wrongWords = 0;

  // Words committed before current index
  history.forEach((typed, idx) => {
    if (idx < targetWords.length) {
      if (typed === targetWords[idx]) {
        correctWords++;
      } else {
        wrongWords++;
      }
    }
  });

  let completedWords = history.length;

  // If the test finished at the end and the active input completed the final target word
  if (isFinished && currentWordIndex === targetWords.length - 1 && activeInput === targetWords[currentWordIndex]) {
    if (!history[currentWordIndex]) {
      completedWords++;
      correctWords++;
    }
  }

  return {
    completedWords,
    correctWords,
    wrongWords
  };
}

/**
 * Calculates ACTUAL SPEED (Words Per Minute based on all completed words).
 * 
 * Formula:
 * ACTUAL SPEED = Total Completed Words ÷ Time in Minutes
 */
export function calculateActualSpeed(completedWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || completedWords <= 0) return 0;
  const timeInMinutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(completedWords / timeInMinutes));
}

/**
 * Calculates ERROR SPEED / ERROR-FREE SPEED (Words Per Minute based on correctly completed words).
 * 
 * Formula:
 * ERROR-FREE SPEED = Correctly Completed Words ÷ Time in Minutes
 */
export function calculateErrorSpeed(correctWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctWords <= 0) return 0;
  const timeInMinutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(correctWords / timeInMinutes));
}

export const calculateErrorFreeSpeed = calculateErrorSpeed;

/**
 * Calculates Net WPM (alias for Error-Free Speed).
 */
export function calculateNetWpm(correctWords: number, elapsedSeconds: number): number {
  return calculateErrorSpeed(correctWords, elapsedSeconds);
}

/**
 * Calculates live speed with smooth thresholding for the first few seconds.
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
