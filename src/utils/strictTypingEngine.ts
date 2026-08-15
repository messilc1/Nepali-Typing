/**
 * Universal Strict Correct-Input Validation Engine
 * Enforces character-by-character validation across all typing modes and tabs.
 * 
 * Rules:
 * 1. An incorrect character is NEVER inserted into visible typed text.
 * 2. An incorrect character NEVER advances the cursor or word index.
 * 3. Every wrong keypress is recorded for accuracy and analytics.
 * 4. The user MUST correct the current character before proceeding.
 * 5. Full support for Devanagari Romanized Unicode (matras, half-letters, conjuncts, dictionary, numbers, punctuation).
 */

import {
  getRomanizedHintForWord,
  transliterateWordRuleBased,
  COMMON_DICTIONARY
} from './nepaliTransliteration';

export interface StrictValidationResult {
  isValid: boolean;
  newBuffer: string;
  newConverted: string;
  isWordComplete: boolean;
  expectedKey: string;
  isSpaceKey: boolean;
  errorKey?: string;
}

/**
 * Returns the exact next key expected from the user for the current target word/item and buffer.
 */
export function getNextExpectedKey(
  targetWord: string,
  currentBuffer: string,
  language: 'nepali' | 'english',
  currentConverted: string = ''
): string {
  if (!targetWord) return '';

  if (language === 'english') {
    if (currentBuffer.length < targetWord.length) {
      return targetWord[currentBuffer.length];
    }
    return ' '; // Word is complete, expecting Space to commit
  }

  // Nepali Language Mode
  const targetRoman = getRomanizedHintForWord(targetWord);
  
  // Check if word is already completely transliterated or matching target
  if (currentConverted === targetWord || (targetRoman && currentBuffer === targetRoman)) {
    return ' '; // Word complete, expecting Space to commit
  }

  if (currentBuffer.length < targetRoman.length) {
    return targetRoman[currentBuffer.length];
  }

  // Fallback if targetRoman length reached but converted doesn't match yet
  return ' ';
}

/**
 * Validates a single keystroke strictly against the expected Romanized or English sequence.
 */
export function validateStrictKeystroke(params: {
  targetWord: string;
  currentBuffer: string;
  currentConverted: string;
  pressedKey: string;
  language: 'nepali' | 'english';
  isLastWord?: boolean;
}): StrictValidationResult {
  const {
    targetWord,
    currentBuffer,
    currentConverted,
    pressedKey,
    language,
    isLastWord = false
  } = params;

  // Handle Space key
  if (pressedKey === ' ' || pressedKey === 'Space') {
    if (language === 'english') {
      const isComplete = currentBuffer === targetWord;
      if (isComplete) {
        return {
          isValid: true,
          newBuffer: '',
          newConverted: '',
          isWordComplete: true,
          expectedKey: ' ',
          isSpaceKey: true
        };
      }
      return {
        isValid: false,
        newBuffer: currentBuffer,
        newConverted: currentConverted,
        isWordComplete: false,
        expectedKey: targetWord[currentBuffer.length] || '',
        isSpaceKey: false,
        errorKey: ' '
      };
    } else {
      // Nepali Space
      const targetRoman = getRomanizedHintForWord(targetWord);
      const isComplete = currentConverted === targetWord || currentBuffer === targetRoman;
      if (isComplete) {
        return {
          isValid: true,
          newBuffer: '',
          newConverted: '',
          isWordComplete: true,
          expectedKey: ' ',
          isSpaceKey: true
        };
      }
      return {
        isValid: false,
        newBuffer: currentBuffer,
        newConverted: currentConverted,
        isWordComplete: false,
        expectedKey: targetRoman[currentBuffer.length] || '',
        isSpaceKey: false,
        errorKey: ' '
      };
    }
  }

  // English character validation
  if (language === 'english') {
    if (currentBuffer.length >= targetWord.length) {
      // Word is already full, user must press space (unless it's the last word)
      return {
        isValid: false,
        newBuffer: currentBuffer,
        newConverted: currentConverted,
        isWordComplete: true,
        expectedKey: ' ',
        isSpaceKey: false,
        errorKey: pressedKey
      };
    }

    const expected = targetWord[currentBuffer.length];
    if (pressedKey === expected) {
      const newBuf = currentBuffer + pressedKey;
      const isComplete = newBuf === targetWord;
      const nextExp = isComplete ? (isLastWord ? '' : ' ') : targetWord[newBuf.length] || '';

      return {
        isValid: true,
        newBuffer: newBuf,
        newConverted: newBuf,
        isWordComplete: isComplete,
        expectedKey: nextExp,
        isSpaceKey: false
      };
    }

    // Wrong character entered
    return {
      isValid: false,
      newBuffer: currentBuffer,
      newConverted: currentConverted,
      isWordComplete: false,
      expectedKey: expected,
      isSpaceKey: false,
      errorKey: pressedKey
    };
  }

  // Nepali character validation
  const targetRoman = getRomanizedHintForWord(targetWord);
  const expectedChar = targetRoman[currentBuffer.length] || '';

  // If current word is already finished, reject non-space
  if (currentConverted === targetWord && !isLastWord) {
    return {
      isValid: false,
      newBuffer: currentBuffer,
      newConverted: currentConverted,
      isWordComplete: true,
      expectedKey: ' ',
      isSpaceKey: false,
      errorKey: pressedKey
    };
  }

  const candidateBuffer = currentBuffer + pressedKey;
  const candidateConverted = transliterateWordRuleBased(candidateBuffer);

  // Validation conditions:
  // 1. Direct character match with targetRoman hint
  // 2. Candidate buffer is a prefix of targetRoman
  // 3. Candidate converted is exact match with targetWord
  // 4. Candidate converted (or without trailing virama) is a valid prefix of targetWord
  const isDirectMatch = pressedKey === expectedChar;
  const isBufferPrefix = targetRoman.startsWith(candidateBuffer);
  const isExactWordMatch = candidateConverted === targetWord;
  const isConvertedPrefix =
    targetWord.startsWith(candidateConverted) ||
    targetWord.startsWith(candidateConverted.replace(/्$/, ''));

  const isValid = isDirectMatch || isBufferPrefix || isExactWordMatch || isConvertedPrefix;

  if (isValid) {
    const isComplete = isExactWordMatch || candidateBuffer === targetRoman;
    const nextExpected = isComplete
      ? (isLastWord ? '' : ' ')
      : targetRoman[candidateBuffer.length] || '';

    return {
      isValid: true,
      newBuffer: candidateBuffer,
      newConverted: candidateConverted,
      isWordComplete: isComplete,
      expectedKey: nextExpected,
      isSpaceKey: false
    };
  }

  // Rejected keypress
  return {
    isValid: false,
    newBuffer: currentBuffer,
    newConverted: currentConverted,
    isWordComplete: false,
    expectedKey: expectedChar || targetRoman[currentBuffer.length] || '',
    isSpaceKey: false,
    errorKey: pressedKey
  };
}
