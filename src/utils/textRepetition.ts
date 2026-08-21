/**
 * Text Repetition and Word Count Expansion Utilities
 * Ensures custom typing tests cleanly meet target word counts or duration limits
 * without cutting words or sentences in the middle.
 */

/**
 * Splits text into complete sentences or natural grammatical chunks.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  // Split on Nepali purnaviram (।), exclamation (!), question mark (?), periods (.), or double newlines
  const rawSentences = text
    .split(/([।!?.\n]+)/)
    .reduce<string[]>((acc, part, idx, arr) => {
      if (idx % 2 === 0) {
        const punctuation = arr[idx + 1] || '';
        const fullSentence = (part + punctuation).trim();
        if (fullSentence.length > 0) {
          acc.push(fullSentence);
        }
      }
      return acc;
    }, []);

  if (rawSentences.length === 0) {
    const trimmed = text.trim();
    return trimmed ? [trimmed] : [];
  }
  return rawSentences;
}

/**
 * Counts words accurately across Nepali Devanagari and English.
 */
export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Automatically repeats/loops text by full sentence units until the required word count is reached.
 * Never cuts a sentence or word in the middle.
 */
export function expandTextToWordCount(text: string, targetWordCount: number): string {
  const trimmed = text.trim();
  if (!trimmed || targetWordCount <= 0) return trimmed;

  const currentWords = countWords(trimmed);
  if (currentWords >= targetWordCount) {
    return trimmed;
  }

  const sentences = splitIntoSentences(trimmed);
  if (sentences.length === 0) return trimmed;

  const accumulatedSentences: string[] = [];
  let currentAccumulatedWords = 0;
  let sentenceIndex = 0;

  // Repeat complete sentences in sequence until targetWordCount is met or exceeded
  while (currentAccumulatedWords < targetWordCount && sentenceIndex < 5000) {
    const sentence = sentences[sentenceIndex % sentences.length];
    accumulatedSentences.push(sentence);
    currentAccumulatedWords += countWords(sentence);
    sentenceIndex++;
  }

  // Join with space or natural punctuation
  return accumulatedSentences.join(' ');
}

/**
 * Expands a word array to a target word count by repeating the sequence seamlessly.
 */
export function expandWordArray(words: string[], targetCount: number): string[] {
  if (!words || words.length === 0 || targetCount <= words.length) {
    return words;
  }

  const result: string[] = [];
  while (result.length < targetCount) {
    for (let i = 0; i < words.length && result.length < targetCount; i++) {
      result.push(words[i]);
    }
  }
  return result;
}
