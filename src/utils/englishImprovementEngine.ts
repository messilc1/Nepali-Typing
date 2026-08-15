import { TestResult, KeyStats, EnglishWeakKeyAnalysis, EnglishImprovementDrill } from '../types';
import { ENGLISH_KEY_TO_WORDS, ENGLISH_KEY_FINGER_MAP, getFingerInfoForKey } from '../data/englishCourseData';

// =========================================================================
// ENGLISH AI IMPROVEMENT COACH & WEAK KEY ANALYSIS ENGINE
// =========================================================================

export interface EnglishAnalyticsSummary {
  totalEnglishTests: number;
  avgWpm: number;
  bestWpm: number;
  avgAccuracy: number;
  bestAccuracy: number;
  totalWordsTyped: number;
  totalCharsTyped: number;
  totalTimeSpentSeconds: number;
  totalMistakes: number;
  totalBackspaces: number;
  weakestKeys: EnglishWeakKeyAnalysis[];
  topMistypedWords: [string, number][];
  slowestWords: [string, number][];
  fingerErrorDistribution: Record<string, number>;
}

export function analyzeEnglishTypingPerformance(
  history: TestResult[],
  liveKeyStatsMap: Record<string, KeyStats> = {}
): EnglishAnalyticsSummary {
  // Filter for English tests only
  const englishTests = history.filter(t => t.language === 'english');

  if (englishTests.length === 0) {
    // Generate default baseline weak keys if no English tests exist yet
    const defaultWeakKeys: EnglishWeakKeyAnalysis[] = ['q', 'p', 'z', 'x', 'b', ';'].map(key => {
      const finger = getFingerInfoForKey(key);
      return {
        key,
        finger: finger.label,
        hand: finger.hand,
        mistakesCount: 0,
        totalHits: 0,
        accuracy: 100,
        avgLatencyMs: 250,
        recommendedWords: ENGLISH_KEY_TO_WORDS[key] || ['practice', 'sample', 'typing']
      };
    });

    return {
      totalEnglishTests: 0,
      avgWpm: 0,
      bestWpm: 0,
      avgAccuracy: 100,
      bestAccuracy: 100,
      totalWordsTyped: 0,
      totalCharsTyped: 0,
      totalTimeSpentSeconds: 0,
      totalMistakes: 0,
      totalBackspaces: 0,
      weakestKeys: defaultWeakKeys,
      topMistypedWords: [],
      slowestWords: [],
      fingerErrorDistribution: {}
    };
  }

  // Aggregate high-level stats
  const totalEnglishTests = englishTests.length;
  const bestWpm = Math.max(...englishTests.map(t => t.netWpm || 0), 0);
  const avgWpm = Math.round(englishTests.reduce((acc, t) => acc + (t.netWpm || 0), 0) / totalEnglishTests);
  const bestAccuracy = Math.max(...englishTests.map(t => t.accuracy || 0), 0);
  const avgAccuracy = Math.round(englishTests.reduce((acc, t) => acc + (t.accuracy || 0), 0) / totalEnglishTests);
  const totalWordsTyped = englishTests.reduce((acc, t) => acc + (t.totalWordsTyped || 0), 0);
  const totalCharsTyped = englishTests.reduce((acc, t) => acc + (t.totalCharactersTyped || 0), 0);
  const totalTimeSpentSeconds = englishTests.reduce((acc, t) => acc + (t.elapsedSeconds || 0), 0);
  const totalMistakes = englishTests.reduce((acc, t) => acc + (t.mistakesCount || 0), 0);
  const totalBackspaces = englishTests.reduce((acc, t) => acc + (t.backspacesCount || 0), 0);

  // Aggregate Key Statistics
  const aggregatedKeys: Record<string, { hits: number; mistakes: number; correct: number; timeMs: number }> = {};

  // Merge live key stats
  Object.entries(liveKeyStatsMap).forEach(([k, stats]) => {
    const lower = k.toLowerCase();
    if (!aggregatedKeys[lower]) {
      aggregatedKeys[lower] = { hits: 0, mistakes: 0, correct: 0, timeMs: 0 };
    }
    aggregatedKeys[lower].hits += stats.totalHits;
    aggregatedKeys[lower].mistakes += stats.mistakes;
    aggregatedKeys[lower].correct += stats.correctHits;
    aggregatedKeys[lower].timeMs += stats.totalTimeMs;
  });

  // Merge from test history
  englishTests.forEach(test => {
    Object.entries(test.keyStatsMap || {}).forEach(([k, stats]) => {
      const lower = k.toLowerCase();
      if (!aggregatedKeys[lower]) {
        aggregatedKeys[lower] = { hits: 0, mistakes: 0, correct: 0, timeMs: 0 };
      }
      aggregatedKeys[lower].hits += stats.totalHits || 0;
      aggregatedKeys[lower].mistakes += stats.mistakes || 0;
      aggregatedKeys[lower].correct += stats.correctHits || 0;
      aggregatedKeys[lower].timeMs += stats.totalTimeMs || 0;
    });
  });

  // Calculate Weak Keys
  const weakKeys: EnglishWeakKeyAnalysis[] = Object.entries(aggregatedKeys)
    .filter(([k, stats]) => stats.hits >= 2 || stats.mistakes > 0)
    .map(([key, stats]) => {
      const accuracy = stats.hits > 0 ? Math.round((stats.correct / stats.hits) * 100) : 100;
      const avgLatencyMs = stats.hits > 0 ? Math.round(stats.timeMs / stats.hits) : 200;
      const finger = getFingerInfoForKey(key);
      const recommendedWords = ENGLISH_KEY_TO_WORDS[key] || [key.repeat(3), `${key}est`, `re${key}`];

      return {
        key,
        finger: finger.label,
        hand: finger.hand,
        mistakesCount: stats.mistakes,
        totalHits: stats.hits,
        accuracy,
        avgLatencyMs,
        recommendedWords
      };
    })
    .sort((a, b) => {
      // Sort by mistake count and lowest accuracy first
      if (b.mistakesCount !== a.mistakesCount) {
        return b.mistakesCount - a.mistakesCount;
      }
      return a.accuracy - b.accuracy;
    })
    .slice(0, 8);

  // If no keys detected from errors yet, fill with common tricky English keys
  if (weakKeys.length === 0) {
    ['r', 't', 'p', 'b', 'v', 'c'].forEach(k => {
      const finger = getFingerInfoForKey(k);
      weakKeys.push({
        key: k,
        finger: finger.label,
        hand: finger.hand,
        mistakesCount: 0,
        totalHits: 0,
        accuracy: 100,
        avgLatencyMs: 220,
        recommendedWords: ENGLISH_KEY_TO_WORDS[k] || ['sample', 'practice']
      });
    });
  }

  // Aggregate Mistyped Words
  const wordErrorMap: Record<string, number> = {};
  englishTests.forEach(test => {
    Object.entries(test.mistypedWordsMap || {}).forEach(([word, count]) => {
      wordErrorMap[word] = (wordErrorMap[word] || 0) + Number(count);
    });
    // Check detailed word errors if present
    test.wordErrors?.forEach(w => {
      if (w.targetWord) {
        wordErrorMap[w.targetWord] = (wordErrorMap[w.targetWord] || 0) + (w.mistakes || 1);
      }
    });
  });

  const topMistypedWords = Object.entries(wordErrorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Aggregate Slow Words
  const slowWordMap: Record<string, number> = {};
  englishTests.forEach(test => {
    Object.entries(test.slowWordsMap || {}).forEach(([word, ms]) => {
      slowWordMap[word] = Math.max(slowWordMap[word] || 0, Number(ms));
    });
  });

  const slowestWords = Object.entries(slowWordMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Finger Error Distribution
  const fingerErrorDistribution: Record<string, number> = {};
  weakKeys.forEach(wk => {
    if (wk.mistakesCount > 0) {
      fingerErrorDistribution[wk.finger] = (fingerErrorDistribution[wk.finger] || 0) + wk.mistakesCount;
    }
  });

  return {
    totalEnglishTests,
    avgWpm,
    bestWpm,
    avgAccuracy,
    bestAccuracy,
    totalWordsTyped,
    totalCharsTyped,
    totalTimeSpentSeconds,
    totalMistakes,
    totalBackspaces,
    weakestKeys: weakKeys,
    topMistypedWords,
    slowestWords,
    fingerErrorDistribution
  };
}

// =========================================================================
// PROGRESSIVE DRILL GENERATOR: KEYS -> COMBOS -> WORDS -> SENTENCES -> PARA
// =========================================================================

export function generateProgressiveEnglishDrills(
  weakKeys: EnglishWeakKeyAnalysis[],
  mistypedWords: [string, number][] = []
): EnglishImprovementDrill[] {
  const topKeys = weakKeys.slice(0, 4).map(k => k.key);
  if (topKeys.length === 0) {
    topKeys.push('r', 't', 'p', ';');
  }

  const k1 = topKeys[0] || 'r';
  const k2 = topKeys[1] || 't';
  const k3 = topKeys[2] || 'p';
  const k4 = topKeys[3] || ';';

  // 1. Stage 1: Individual Key Repetitions & Alternating Rhythm
  const stage1Content = [
    `${k1} ${k1} ${k1} ${k2} ${k2} ${k2} ${k1}${k2} ${k2}${k1}`,
    `${k3} ${k3} ${k4} ${k4} ${k3}${k4} ${k4}${k3}`,
    `${k1}${k2}${k3} ${k3}${k2}${k1} ${k1}${k3} ${k2}${k4} ${k1} ${k2} ${k3} ${k4}`
  ].join(' ');

  // 2. Stage 2: Key Combinations & Bigrams/Trigrams
  const stage2Content = [
    `${k1}a ${k1}e ${k1}i ${k1}o ${k1}u ${k2}a ${k2}e ${k2}i ${k2}o ${k2}u`,
    `a${k1} e${k1} i${k1} o${k1} u${k1} a${k2} e${k2} i${k2} o${k2} u${k2}`,
    `${k1}${k2}a ${k2}${k1}e ${k3}o ${k4} ${k1}${k3}i ${k3}${k1}e ${k2}${k3}o`
  ].join(' ');

  // 3. Stage 3: Targeted Weak Words
  const recommendedWords = new Set<string>();
  topKeys.forEach(k => {
    const list = ENGLISH_KEY_TO_WORDS[k] || [];
    list.slice(0, 4).forEach(w => recommendedWords.add(w));
  });
  mistypedWords.slice(0, 4).forEach(([w]) => recommendedWords.add(w));
  
  if (recommendedWords.size < 6) {
    ['property', 'proper', 'report', 'transport', 'part', 'prepare', 'standard', 'practice'].forEach(w => recommendedWords.add(w));
  }
  const stage3Content = Array.from(recommendedWords).slice(0, 12).join(' ');

  // 4. Stage 4: Targeted Sentences using Weak Keys & Words
  const sampleSentences = [
    `Please prepare the proper report before the transport departs.`,
    `Consistent practice with precision and accuracy transforms standard typing into effortless mastery.`,
    `The dedicated professional reviewed every parameter meticulously to ensure zero errors.`
  ];
  const stage4Content = sampleSentences.join(' ');

  // 5. Stage 5: Contextual Multi-Sentence Paragraph
  const stage5Content = `Mastering keyboard precision requires deliberate repetition of challenging letter sequences. By identifying weak keys such as ${topKeys.map(k => k.toUpperCase()).join(', ')} and practicing targeted word combinations, you rebuild neural pathways for instantaneous muscle memory. Maintain proper finger posture, breathe steadily, and allow your fingers to glide smoothly across the entire QWERTY layout without hesitation.`;

  return [
    {
      id: 'eng-drill-stage-1',
      title: `Stage 1: Weak Key Repetition (${topKeys.map(k => k.toUpperCase()).join(', ')})`,
      stage: 1,
      stageName: 'Key Drills',
      targetKeys: topKeys,
      content: stage1Content,
      description: 'Focus on precise finger placement and immediate return to home position.'
    },
    {
      id: 'eng-drill-stage-2',
      title: `Stage 2: Bigram & Trigram Key Combinations`,
      stage: 2,
      stageName: 'Key Combinations',
      targetKeys: topKeys,
      content: stage2Content,
      description: 'Build smooth micro-transitions between vowels and your weakest consonants.'
    },
    {
      id: 'eng-drill-stage-3',
      title: `Stage 3: Targeted High-Error English Words`,
      stage: 3,
      stageName: 'Target Words',
      targetKeys: topKeys,
      content: stage3Content,
      description: 'Type complete English words containing your target weak letter combinations.'
    },
    {
      id: 'eng-drill-stage-4',
      title: `Stage 4: Practice Sentences with Punctuation`,
      stage: 4,
      stageName: 'Practice Sentences',
      targetKeys: topKeys,
      content: stage4Content,
      description: 'Execute full grammatical structures integrating capital letters and punctuation.'
    },
    {
      id: 'eng-drill-stage-5',
      title: `Stage 5: Complete Contextual Mastery Paragraph`,
      stage: 5,
      stageName: 'Contextual Paragraph',
      targetKeys: topKeys,
      content: stage5Content,
      description: 'Synthesize all learned improvements in a fluid, realistic typing paragraph.'
    }
  ];
}
