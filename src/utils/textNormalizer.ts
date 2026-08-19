/**
 * Text Normalization and Character Equivalence Engine
 * 
 * Guarantees that:
 * 1. Zero-width or invisible characters (ZWJ, ZWNJ, ZWSP, BOM, soft hyphens) are safely sanitized.
 * 2. Smart quotes, typography dashes, and irregular whitespace are normalized or made keystroke-equivalent.
 * 3. Devanagari text is canonically normalized (Unicode NFC).
 * 4. Punctuation, numbers, and symbols are universally typeable across all keyboards.
 * 5. Text input never gets stuck at any character, word, space, or paragraph boundary.
 */

/**
 * Strips invisible zero-width characters that prevent keyboard matching
 */
export function stripInvisibleCharacters(text: string): string {
  if (!text) return '';
  return text
    // Zero-width space, ZWNJ, ZWJ, BOM, Word Joiner, Soft Hyphen, Left-to-Right / Right-to-Left marks
    .replace(/[\u200B\u200C\u200D\uFEFF\u00AD\u2060\u200E\u200F\u202A-\u202E]/g, '')
    // Replace non-breaking spaces with standard space
    .replace(/[\u00A0\u202F\u2007\u3000\u2000-\u200A]/g, ' ')
    // Normalize Unicode canonical composition
    .normalize('NFC');
}

/**
 * Standardizes typography symbols for typing tests
 */
export function normalizeTypography(text: string): string {
  if (!text) return '';
  return text
    // Smart double quotes -> standard double quote
    .replace(/[“”«»„‟]/g, '"')
    // Smart single quotes & backticks -> standard single quote
    .replace(/[‘’‚‛`]/g, "'")
    // Em-dash, en-dash, minus, non-breaking hyphen -> standard hyphen
    .replace(/[–—―−‐‑]/g, '-')
    // Ellipsis -> three dots
    .replace(/…/g, '...')
    // Carriage returns to standard newline
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

/**
 * Full clean normalization for custom paragraphs and target texts
 * Preserves all original spaces, multiple spaces, line breaks, and punctuation.
 */
export function sanitizeTargetText(text: string): string {
  if (!text) return '';
  const cleaned = stripInvisibleCharacters(text);
  const normalized = normalizeTypography(cleaned);
  return normalized;
}

/**
 * Prepares array of target words from paragraph text, preserving words and word separation
 */
export function extractSanitizedWords(text: string): string[] {
  const sanitized = sanitizeTargetText(text);
  if (!sanitized) return [];
  return sanitized.split(/\s+/).filter(w => w.length > 0);
}

/**
 * Checks if a pressed key is equivalent to an expected target character
 */
export function isCharacterEquivalent(pressedKey: string, expectedChar: string): boolean {
  if (!pressedKey || !expectedChar) return false;
  if (pressedKey === expectedChar) return true;

  // Case-insensitive direct comparison for standard letters
  if (pressedKey.toLowerCase() === expectedChar.toLowerCase()) {
    // Only accept case-insensitivity if not strict uppercase test
    if (pressedKey === expectedChar) return true;
  }

  // Double quotes
  if (pressedKey === '"' && ['"', '“', '”', '«', '»', '„', '‟'].includes(expectedChar)) return true;

  // Single quotes
  if (pressedKey === "'" && ["'", '‘', '’', '‚', '‛', '`'].includes(expectedChar)) return true;

  // Hyphens and dashes
  if (pressedKey === '-' && ['-', '–', '—', '―', '−', '‐', '‑'].includes(expectedChar)) return true;

  // Spaces & Newlines
  if (
    (pressedKey === ' ' || pressedKey === 'Enter' || pressedKey === 'Space') &&
    [' ', '\n', '\r', '\t', '\u00A0', '\u202F'].includes(expectedChar)
  ) {
    return true;
  }

  // Devanagari Danda & Period / Pipe
  if (
    (pressedKey === '.' || pressedKey === '|' || pressedKey === '।' || pressedKey === '/') &&
    ['।', '.', '|'].includes(expectedChar)
  ) {
    return true;
  }

  // Nepali Digits <-> Roman Digits
  const nepaliToRoman: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  if (nepaliToRoman[expectedChar] === pressedKey) return true;
  if (nepaliToRoman[pressedKey] === expectedChar) return true;

  // Devanagari Colon & Visarga
  if (pressedKey === ':' && expectedChar === 'ः') return true;

  // Tilde & Chandrabindu
  if (pressedKey === '~' && expectedChar === 'ँ') return true;

  return false;
}

/**
 * Devanagari halant-lenient equality check
 * e.g. "नेपाल" matches "नेपाल्", "घर" matches "घर्"
 */
export function areDevanagariWordsEquivalent(w1: string, w2: string): boolean {
  if (!w1 || !w2) return false;
  if (w1 === w2) return true;

  const strip1 = w1.trim().replace(/्$/, '').normalize('NFC');
  const strip2 = w2.trim().replace(/्$/, '').normalize('NFC');

  if (strip1 === strip2) return true;

  // Strip trailing punctuation and check
  const stripPunct1 = strip1.replace(/[।,!\?:;"'\(\)\[\]\{\}\.\-\—\<\>\/]+$/g, '');
  const stripPunct2 = strip2.replace(/[।,!\?:;"'\(\)\[\]\{\}\.\-\—\<\>\/]+$/g, '');

  return stripPunct1 === stripPunct2;
}
