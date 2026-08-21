/**
 * Universal WPM & Speed Calculation Engine
 * 
 * Formula:
 * NET SPEED / WPM = Completed Words ÷ Time in Minutes
 * 
 * Rules:
 * 1. Completed Words = only words where user finished the word and moved past its separator (Space),
 *    or reached the end of the test.
 * 2. Incomplete words are NOT counted towards completed words.
 * 3. WPM = Math.max(0, Math.round(completedWords / timeInMinutes))
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
 * 
 * @param typedCharsLength Number of characters typed so far
 * @param targetText The reference target text
 * @param isTestFinishedAtEnd Whether the user reached the end of the text
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
 * Counts completed words from a typed words history array (used in word-by-word typing tests).
 * In word-by-word mode, every entry in history represents a committed word.
 */
export function countCompletedWordsFromHistory(history: string[]): number {
  if (!history || history.length === 0) return 0;
  return history.filter(w => Boolean(w && w.trim().length > 0)).length;
}

/**
 * Counts completed words from a full typed string against target text.
 */
export function countCompletedWordsFromString(
  typedString: string,
  targetText: string,
  isFinished: boolean = false
): number {
  if (!typedString || !targetText) return 0;
  return countCompletedWordsFromCharProgress(
    typedString.length,
    targetText,
    isFinished || typedString.length >= targetText.length
  );
}

/**
 * Calculates Net WPM strictly based on actual completed words.
 * 
 * Formula:
 * NET WPM = Completed Words ÷ Time in Minutes
 * 
 * @param completedWords Number of actually completed words
 * @param elapsedSeconds Elapsed time in seconds
 */
export function calculateNetWpm(completedWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || completedWords <= 0) return 0;
  const timeInMinutes = elapsedSeconds / 60;
  return Math.max(0, Math.round(completedWords / timeInMinutes));
}

/**
 * Calculates live Net WPM with smooth thresholding for the first few seconds.
 */
export function calculateLiveNetWpm(completedWords: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || completedWords <= 0) return 0;
  const timeInMinutes = Math.max(elapsedSeconds / 60, 0.05); // min 3s equivalent to avoid infinite spike on word 1
  return Math.max(0, Math.round(completedWords / timeInMinutes));
}
