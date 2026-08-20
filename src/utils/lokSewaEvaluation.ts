import { LanguageMode } from '../types';

export interface LokSewaMarkBracket {
  minCwpm: number;
  maxCwpm: number | null;
  marks: number;
  label: string;
}

export const LOK_SEWA_DEVANAGARI_BRACKETS: LokSewaMarkBracket[] = [
  { minCwpm: 0, maxCwpm: 5, marks: 0.0, label: 'Below 5 CWPM' },
  { minCwpm: 5, maxCwpm: 7.5, marks: 0.5, label: '5 – <7.5 CWPM' },
  { minCwpm: 7.5, maxCwpm: 10, marks: 0.75, label: '7.5 – <10 CWPM' },
  { minCwpm: 10, maxCwpm: 12.5, marks: 1.0, label: '10 – <12.5 CWPM' },
  { minCwpm: 12.5, maxCwpm: 15, marks: 1.25, label: '12.5 – <15 CWPM' },
  { minCwpm: 15, maxCwpm: 17.5, marks: 1.5, label: '15 – <17.5 CWPM' },
  { minCwpm: 17.5, maxCwpm: 20, marks: 1.75, label: '17.5 – <20 CWPM' },
  { minCwpm: 20, maxCwpm: 22.5, marks: 2.0, label: '20 – <22.5 CWPM' },
  { minCwpm: 22.5, maxCwpm: 25, marks: 2.25, label: '22.5 – <25 CWPM' },
  { minCwpm: 25, maxCwpm: null, marks: 2.5, label: '25+ CWPM (Full Marks)' },
];

export const LOK_SEWA_ENGLISH_BRACKETS: LokSewaMarkBracket[] = [
  { minCwpm: 0, maxCwpm: 6, marks: 0.0, label: 'Below 6 CWPM' },
  { minCwpm: 6, maxCwpm: 9, marks: 0.5, label: '6 – <9 CWPM' },
  { minCwpm: 9, maxCwpm: 12, marks: 0.75, label: '9 – <12 CWPM' },
  { minCwpm: 12, maxCwpm: 15, marks: 1.0, label: '12 – <15 CWPM' },
  { minCwpm: 15, maxCwpm: 18, marks: 1.25, label: '15 – <18 CWPM' },
  { minCwpm: 18, maxCwpm: 21, marks: 1.5, label: '18 – <21 CWPM' },
  { minCwpm: 21, maxCwpm: 24, marks: 1.75, label: '21 – <24 CWPM' },
  { minCwpm: 24, maxCwpm: 27, marks: 2.0, label: '24 – <27 CWPM' },
  { minCwpm: 27, maxCwpm: 30, marks: 2.25, label: '27 – <30 CWPM' },
  { minCwpm: 30, maxCwpm: null, marks: 2.5, label: '30+ CWPM (Full Marks)' },
];

export interface LokSewaEvaluationResult {
  cwpm: number;
  marks: number;
  maxMarks: number;
  thresholdCwpm: number;
  totalWords: number;
  wrongWords: number;
  correctWords: number;
  isFullMarks: boolean;
  isPassed: boolean;
  gradeDescription: string;
}

/**
 * Calculates Lok Sewa IT Skill Test evaluation.
 * Official PSC Nepal Formula: Correct WPM (CWPM) = (Total Words Typed − Wrong Words) ÷ 5 = Correct Words ÷ 5
 *
 * @param language 'nepali' | 'english'
 * @param totalWords Total words completed in the test (up to 200 max or 5 minutes)
 * @param wrongWords Number of words with errors
 * @param elapsedSeconds Elapsed time in seconds (normally 300s for a 5-min exam)
 */
export function calculateLokSewaEvaluation(
  language: LanguageMode,
  totalWords: number,
  wrongWords: number,
  elapsedSeconds: number = 300
): LokSewaEvaluationResult {
  const correctWords = Math.max(0, totalWords - wrongWords);

  // Official PSC Nepal formula: Correct WPM = Correct Words ÷ 5
  const rawCwpm = correctWords / 5;
  const cwpm = Math.max(0, Number(rawCwpm.toFixed(2)));

  const isNepali = language === 'nepali';
  const thresholdCwpm = isNepali ? 25 : 30;
  const brackets = isNepali ? LOK_SEWA_DEVANAGARI_BRACKETS : LOK_SEWA_ENGLISH_BRACKETS;

  let marks = 0;
  for (const bracket of brackets) {
    if (bracket.maxCwpm === null) {
      if (cwpm >= bracket.minCwpm) {
        marks = bracket.marks;
      }
    } else {
      if (cwpm >= bracket.minCwpm && cwpm < bracket.maxCwpm) {
        marks = bracket.marks;
        break;
      }
    }
  }

  const isFullMarks = marks === 2.5;
  const isPassed = marks >= 1.0; // Standard passing score is 40% (1.0 / 2.5)

  let gradeDescription = 'Below Standard';
  if (isFullMarks) gradeDescription = 'Full Marks (Outstanding)';
  else if (marks >= 2.0) gradeDescription = 'Excellent';
  else if (marks >= 1.5) gradeDescription = 'Good';
  else if (marks >= 1.0) gradeDescription = 'Pass';
  else if (marks > 0) gradeDescription = 'Below Passing';

  return {
    cwpm,
    marks,
    maxMarks: 2.5,
    thresholdCwpm,
    totalWords,
    wrongWords,
    correctWords,
    isFullMarks,
    isPassed,
    gradeDescription,
  };
}

export const LOK_SEWA_TOOLTIP_TEXT =
  'Lok Sewa Exam Mode: 5-minute maximum test (auto-stops at 200 words typed). Score is based on Correct WPM = (Total Words - Wrong Words) ÷ 5. Devanagari requires 25+ CWPM for 2.5 full marks; English requires 30+ CWPM for 2.5 full marks.';

/**
 * Ensures any typing passage for Lok Sewa Mode contains at least 200 words.
 * If the selected or generated passage contains fewer than 200 words, it automatically
 * repeats complete sentences/paragraphs with proper spacing and punctuation until it reaches at least 200 words.
 *
 * @param text The original passage text
 * @param minWords Minimum required word count (default 200)
 */
export function ensureLokSewaMinimumWords(text: string, minWords: number = 200): string {
  if (!text || !text.trim()) {
    return text;
  }

  const cleanText = text.trim();
  const words = cleanText.split(/\s+/).filter(Boolean);

  if (words.length >= minWords) {
    return cleanText;
  }

  // Multiply/repeat complete sentences or paragraphs cleanly with a space separator
  let expanded = cleanText;
  while (expanded.split(/\s+/).filter(Boolean).length < minWords) {
    expanded = `${expanded} ${cleanText}`;
  }

  return expanded;
}
