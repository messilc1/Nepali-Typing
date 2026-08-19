/**
 * Universal Strict Correct-Input Validation Engine
 * Enforces character-by-character validation across all typing modes and tabs.
 * 
 * Rules:
 * 1. An incorrect character is NEVER inserted into visible typed text in strict mode.
 * 2. An incorrect character NEVER advances the cursor or word index in strict mode.
 * 3. Every wrong keypress is recorded for accuracy and analytics.
 * 4. The user MUST correct the current character before proceeding.
 * 5. Full support for Devanagari Romanized Unicode (matras, half-letters, conjuncts, dictionary, numbers, punctuation).
 * 6. Guarantees that typing NEVER locks or freezes on any character, punctuation, quote, or space.
 */

import {
  getRomanizedHintForWord,
  transliterateWordRuleBased,
  COMMON_DICTIONARY
} from './nepaliTransliteration';
import {
  isCharacterEquivalent,
  areDevanagariWordsEquivalent,
  stripInvisibleCharacters
} from './textNormalizer';

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

  const cleanTarget = stripInvisibleCharacters(targetWord);
  const cleanConverted = stripInvisibleCharacters(currentConverted);

  if (language === 'english') {
    if (currentBuffer.length < cleanTarget.length) {
      return cleanTarget[currentBuffer.length];
    }
    return ' '; // Word is complete, expecting Space to commit
  }

  // Nepali Language Mode
  const targetRoman = getRomanizedHintForWord(cleanTarget);
  
  // Check if word is already completely transliterated or matching target
  if (
    cleanConverted === cleanTarget ||
    areDevanagariWordsEquivalent(cleanConverted, cleanTarget) ||
    (targetRoman && currentBuffer.toLowerCase() === targetRoman.toLowerCase())
  ) {
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

  const cleanTarget = stripInvisibleCharacters(targetWord);
  const cleanConverted = stripInvisibleCharacters(currentConverted);

  // Handle Space or Enter key -> Word Completion Check
  if (pressedKey === ' ' || pressedKey === 'Space' || pressedKey === 'Enter') {
    if (language === 'english') {
      const isComplete =
        currentBuffer === cleanTarget ||
        currentBuffer.toLowerCase() === cleanTarget.toLowerCase() ||
        isCharacterEquivalent(currentBuffer, cleanTarget);

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
        expectedKey: cleanTarget[currentBuffer.length] || '',
        isSpaceKey: false,
        errorKey: ' '
      };
    } else {
      // Nepali Space Validation
      const targetRoman = getRomanizedHintForWord(cleanTarget);
      const isComplete =
        cleanConverted === cleanTarget ||
        areDevanagariWordsEquivalent(cleanConverted, cleanTarget) ||
        cleanConverted.replace(/्$/, '') === cleanTarget.replace(/्$/, '') ||
        currentBuffer.toLowerCase() === targetRoman.toLowerCase() ||
        (currentBuffer.length >= targetRoman.length && targetRoman.length > 0) ||
        (cleanConverted.length >= cleanTarget.length && cleanTarget.length > 0);

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
        expectedKey: targetRoman[currentBuffer.length] || cleanTarget[cleanConverted.length] || ' ',
        isSpaceKey: false,
        errorKey: ' '
      };
    }
  }

  // English character validation
  if (language === 'english') {
    if (currentBuffer.length >= cleanTarget.length) {
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

    const expected = cleanTarget[currentBuffer.length];
    const isMatched = isCharacterEquivalent(pressedKey, expected);

    if (isMatched) {
      const newBuf = currentBuffer + expected;
      const isComplete = newBuf.length === cleanTarget.length;
      const nextExp = isComplete ? (isLastWord ? '' : ' ') : cleanTarget[newBuf.length] || '';

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
  const targetRoman = getRomanizedHintForWord(cleanTarget);
  const expectedChar = targetRoman[currentBuffer.length] || '';

  // If current word is already finished and matches exact target, reject non-space
  const isWordAlreadyFinished =
    cleanConverted === cleanTarget ||
    (cleanConverted.replace(/्$/, '') === cleanTarget.replace(/्$/, '') && currentBuffer.length >= targetRoman.length);

  if (isWordAlreadyFinished && !isLastWord) {
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
  // 1. Direct character match with targetRoman hint (including case-insensitivity or character equivalence)
  // 2. Candidate buffer is a prefix of targetRoman
  // 3. Candidate converted is exact match with cleanTarget
  // 4. Candidate converted (or without trailing virama) is a valid prefix of cleanTarget
  // 5. Direct match with expected Devanagari character (for direct Nepali key inputs)
  // 6. Direct match with expected character at target position or end of word
  const isDirectMatch =
    pressedKey === expectedChar ||
    isCharacterEquivalent(pressedKey, expectedChar) ||
    pressedKey.toLowerCase() === expectedChar.toLowerCase();

  const isBufferPrefix =
    targetRoman.toLowerCase().startsWith(candidateBuffer.toLowerCase()) ||
    targetRoman.startsWith(candidateBuffer);

  const isExactWordMatch =
    candidateConverted === cleanTarget ||
    areDevanagariWordsEquivalent(candidateConverted, cleanTarget);

  const isConvertedPrefix =
    cleanTarget.startsWith(candidateConverted) ||
    cleanTarget.startsWith(candidateConverted.replace(/्$/, '')) ||
    candidateConverted.startsWith(cleanTarget.replace(/्$/, ''));

  // Allow punctuation or direct character match at current position or end of word
  const isPunctuationOrSymbolMatch =
    isCharacterEquivalent(pressedKey, cleanTarget[currentBuffer.length] || '') ||
    isCharacterEquivalent(pressedKey, cleanTarget[cleanTarget.length - 1] || '');

  const isValid = isDirectMatch || isBufferPrefix || isExactWordMatch || isConvertedPrefix || isPunctuationOrSymbolMatch;

  if (isValid) {
    const isComplete = isExactWordMatch || candidateBuffer.toLowerCase() === targetRoman.toLowerCase();
    const nextExpected = isComplete
      ? (isLastWord ? '' : ' ')
      : targetRoman[candidateBuffer.length] || ' ';

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
    expectedKey: expectedChar || targetRoman[currentBuffer.length] || cleanTarget[cleanConverted.length] || '',
    isSpaceKey: false,
    errorKey: pressedKey
  };
}
