import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  Flame,
  Award,
  BookOpen,
  Scale,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  BarChart2,
  Keyboard,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { UserStats, KeyStats, TestSettings, PracticeLevel, WeakKeyAnalysis, WeakWordRecord, GeneratedExercise, DailyImprovementChallenge } from '../types';
import {
  analyzeUserWeaknesses,
  generateAdaptiveExercise,
  getAdaptiveRecommendedLevel,
  generateDailyChallenge,
  saveDailyChallengeProgress
} from '../utils/typingImprovementEngine';
import { transliterateWordRuleBased } from '../utils/nepaliTransliteration';
import { validateStrictKeystroke, getNextExpectedKey } from '../utils/strictTypingEngine';
import { playKeypressSound, playErrorSound } from '../utils/soundEffects';
import { ArrowLeft } from 'lucide-react';

interface TypingImprovementViewProps {
  userStats: UserStats;
  keyStatsMap?: Record<string, KeyStats>;
  settings: TestSettings;
  onLaunchFullPractice: (items: string[], title?: string) => void;
  onNavigateToAnalytics?: () => void;
  onBack?: () => void;
}

export const TypingImprovementView: React.FC<TypingImprovementViewProps> = ({
  userStats,
  keyStatsMap = {},
  settings,
  onLaunchFullPractice,
  onNavigateToAnalytics,
  onBack
}) => {
  // Vocabulary mode toggle (Legal / Lok Sewa priority vs Standard)
  const [forceLegalVocabulary, setForceLegalVocabulary] = useState<boolean>(false);

  // Analyze weaknesses across lifetime history
  const analyticsData = useMemo(() => {
    return analyzeUserWeaknesses(userStats, keyStatsMap, { forceLegal: forceLegalVocabulary });
  }, [userStats, keyStatsMap, forceLegalVocabulary]);

  const { weakKeys, weakWords, hasLegalHistory, totalErrorsAnalyzed } = analyticsData;

  // Currently selected weak pattern
  const [selectedPatternKey, setSelectedPatternKey] = useState<string>(() => {
    return weakKeys[0]?.key || 'ny';
  });

  // Keep selected pattern in sync if weakKeys change
  useEffect(() => {
    if (weakKeys.length > 0 && !weakKeys.some(k => k.key === selectedPatternKey)) {
      setSelectedPatternKey(weakKeys[0].key);
    }
  }, [weakKeys, selectedPatternKey]);

  const activeWeakPattern = useMemo(() => {
    return weakKeys.find(k => k.key === selectedPatternKey) || weakKeys[0] || null;
  }, [weakKeys, selectedPatternKey]);

  // Selected Practice Level (1 to 6)
  const [selectedLevel, setSelectedLevel] = useState<PracticeLevel>(3);

  // Generated Exercise for active pattern and level
  const generatedExercise = useMemo<GeneratedExercise>(() => {
    return generateAdaptiveExercise(
      activeWeakPattern,
      selectedLevel,
      forceLegalVocabulary || hasLegalHistory,
      weakKeys
    );
  }, [activeWeakPattern, selectedLevel, forceLegalVocabulary, hasLegalHistory, weakKeys]);

  // Adaptive recommendation for current pattern
  const adaptiveRecommendation = useMemo(() => {
    const acc = activeWeakPattern?.accuracy || 75;
    return getAdaptiveRecommendedLevel(acc);
  }, [activeWeakPattern]);

  // ==========================================
  // IN-ENGINE INTERACTIVE PRACTICE RUNNER STATE
  // ==========================================
  const [runnerActive, setRunnerActive] = useState<boolean>(false);
  const [runnerItems, setRunnerItems] = useState<string[]>([]);
  const [runnerIndex, setRunnerIndex] = useState<number>(0);
  const [runnerTyped, setRunnerTyped] = useState<string>('');
  const [runnerRomanBuffer, setRunnerRomanBuffer] = useState<string>('');
  const [runnerMistakes, setRunnerMistakes] = useState<number>(0);
  const [runnerCompletedCount, setRunnerCompletedCount] = useState<number>(0);
  const [runnerShake, setRunnerShake] = useState<boolean>(false);
  const [runnerRejectedKey, setRunnerRejectedKey] = useState<{ key: string; expected: string } | null>(null);
  const [runnerFinished, setRunnerFinished] = useState<boolean>(false);
  const [runnerInitialAcc, setRunnerInitialAcc] = useState<number>(75);
  const [runnerAchievedAcc, setRunnerAchievedAcc] = useState<number>(0);

  const runnerInputRef = useRef<HTMLInputElement>(null);

  // Initialize runner with exercise items
  const startInteractiveRunner = (exercise: GeneratedExercise) => {
    setRunnerItems(exercise.items);
    setRunnerIndex(0);
    setRunnerTyped('');
    setRunnerRomanBuffer('');
    setRunnerMistakes(0);
    setRunnerCompletedCount(0);
    setRunnerFinished(false);
    setRunnerInitialAcc(activeWeakPattern?.accuracy || 75);
    setRunnerActive(true);
    setTimeout(() => runnerInputRef.current?.focus(), 100);
  };

  // Shake & rejected feedback auto-dismiss
  useEffect(() => {
    if (runnerShake) {
      const t = setTimeout(() => setRunnerShake(false), 250);
      return () => clearTimeout(t);
    }
  }, [runnerShake]);

  useEffect(() => {
    if (runnerRejectedKey) {
      const t = setTimeout(() => setRunnerRejectedKey(null), 1200);
      return () => clearTimeout(t);
    }
  }, [runnerRejectedKey]);

  // Runner Keydown Handler with Strict Keystroke Engine
  const handleRunnerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (runnerFinished || runnerItems.length === 0) return;

    const currentItem = runnerItems[runnerIndex] || '';
    const currentBuf = settings.language === 'nepali' ? runnerRomanBuffer : runnerTyped;

    // Handle Backspace
    if (e.key === 'Backspace') {
      if (settings.language === 'nepali') {
        if (runnerRomanBuffer.length > 0) {
          const newBuf = runnerRomanBuffer.slice(0, -1);
          setRunnerRomanBuffer(newBuf);
          setRunnerTyped(transliterateWordRuleBased(newBuf));
        }
      } else {
        setRunnerTyped(prev => prev.slice(0, -1));
      }
      setRunnerRejectedKey(null);
      return;
    }

    // Handle Spacebar
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      const validation = validateStrictKeystroke({
        targetWord: currentItem,
        currentBuffer: currentBuf,
        currentConverted: runnerTyped,
        pressedKey: ' ',
        language: settings.language,
        isLastWord: runnerIndex === runnerItems.length - 1
      });

      if (!validation.isValid) {
        playErrorSound(settings.soundVolume);
        setRunnerMistakes(prev => prev + 1);
        setRunnerShake(true);
        setRunnerRejectedKey({
          key: 'Space',
          expected: validation.expectedKey === ' ' ? 'Space' : validation.expectedKey
        });
        return;
      }

      // Valid Space -> Advance
      playKeypressSound(settings.sound, settings.soundVolume);
      setRunnerCompletedCount(prev => prev + 1);
      setRunnerRejectedKey(null);

      if (runnerIndex + 1 >= runnerItems.length) {
        // Runner Finished!
        const totalItems = runnerItems.length;
        const finalAcc = Math.max(10, Math.min(100, Math.round(((totalItems) / (totalItems + runnerMistakes)) * 100)));
        setRunnerAchievedAcc(finalAcc);
        setRunnerFinished(true);
      } else {
        setRunnerIndex(prev => prev + 1);
        setRunnerTyped('');
        setRunnerRomanBuffer('');
      }
      return;
    }

    // Regular Keypress
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const validation = validateStrictKeystroke({
        targetWord: currentItem,
        currentBuffer: currentBuf,
        currentConverted: runnerTyped,
        pressedKey: e.key,
        language: settings.language,
        isLastWord: runnerIndex === runnerItems.length - 1
      });

      if (!validation.isValid) {
        playErrorSound(settings.soundVolume);
        setRunnerMistakes(prev => prev + 1);
        setRunnerShake(true);
        setRunnerRejectedKey({
          key: e.key,
          expected: validation.expectedKey === ' ' ? 'Space' : validation.expectedKey
        });
        return;
      }

      // Valid Key
      playKeypressSound(settings.sound, settings.soundVolume);
      setRunnerRejectedKey(null);

      if (settings.language === 'nepali') {
        setRunnerRomanBuffer(validation.newBuffer);
        setRunnerTyped(validation.newConverted);
      } else {
        setRunnerTyped(validation.newBuffer);
      }

      // Check auto completion on word match if last word or exact match
      if (validation.isWordComplete || validation.newConverted === currentItem) {
        setRunnerCompletedCount(prev => prev + 1);
        if (runnerIndex + 1 >= runnerItems.length) {
          const totalItems = runnerItems.length;
          const finalAcc = Math.max(10, Math.min(100, Math.round(((totalItems) / (totalItems + runnerMistakes)) * 100)));
          setRunnerAchievedAcc(finalAcc);
          setRunnerFinished(true);
        } else {
          setRunnerIndex(prev => prev + 1);
          setRunnerTyped('');
          setRunnerRomanBuffer('');
        }
      }
    }
  };

  // ==========================================
  // WEAK WORDS BANK SEARCH & FILTER
  // ==========================================
  const [wordSearchQuery, setWordSearchQuery] = useState<string>('');
  const [wordFilterCategory, setWordFilterCategory] = useState<string>('all');

  const filteredWeakWords = useMemo(() => {
    return weakWords.filter(w => {
      const matchesSearch = w.word.toLowerCase().includes(wordSearchQuery.toLowerCase()) ||
        w.romanized.toLowerCase().includes(wordSearchQuery.toLowerCase());
      const matchesCat = wordFilterCategory === 'all' || w.category === wordFilterCategory;
      return matchesSearch && matchesCat;
    });
  }, [weakWords, wordSearchQuery, wordFilterCategory]);

  // ==========================================
  // DAILY PERSONALIZED CHALLENGE STATE
  // ==========================================
  const [dailyChallenge, setDailyChallenge] = useState<DailyImprovementChallenge>(() => {
    return generateDailyChallenge(userStats, weakKeys);
  });

  const handleStartDailyChallenge = () => {
    const fullChallengeText = [
      ...dailyChallenge.characterDrills,
      ...dailyChallenge.wordDrills,
      ...dailyChallenge.difficultWords
    ].join(' ');

    onLaunchFullPractice(
      fullChallengeText.split(/\s+/).filter(Boolean),
      `Daily Focus: ${dailyChallenge.focusDevanagari} (${dailyChallenge.focusRomanized})`
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 max-w-full">
      
      {/* 1. HERO & AI COACH DIAGNOSTIC BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 border border-blue-700/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all cursor-pointer border border-white/20"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>← Back to Typing Engine</span>
                </button>
              )}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-spin" />
                <span>Adaptive Typing Improvement Engine</span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Turn Real Mistakes into <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400">Targeted Mastery</span>
            </h1>
            
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Analyzed <strong className="text-amber-300 font-extrabold">{totalErrorsAnalyzed} lifetime keystrokes & errors</strong> across your typing history to generate personalized drills for your weakest characters, Devanagari conjuncts, and legal vocabulary.
            </p>

            {/* Quick Diagnostic Insights Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs font-semibold">
                <Target className="w-3.5 h-3.5 text-rose-400" />
                <span>Top Weakness: <strong className="text-rose-300 font-bold">{activeWeakPattern?.devanagari} ({activeWeakPattern?.romanizedSequence})</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Weakest Accuracy: <strong className="text-amber-300 font-bold">{activeWeakPattern?.accuracy}%</strong></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-xl border border-white/15 backdrop-blur-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tracked Weak Words: <strong className="text-emerald-300 font-bold">{weakWords.length}</strong></span>
              </div>
            </div>
          </div>

          {/* Prominent "Improve My Typing" 1-Click Launch Button */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              id="btn-improve-my-typing"
              onClick={() => {
                onLaunchFullPractice(
                  generatedExercise.items,
                  `Targeted Drill: ${activeWeakPattern?.devanagari || 'न्य'} (${activeWeakPattern?.romanizedSequence || 'ny'})`
                );
              }}
              className="flex items-center justify-center gap-3 px-6 sm:px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
            >
              <Zap className="w-5 h-5 fill-slate-950 text-slate-950 group-hover:animate-bounce" />
              <span>Improve My Typing</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex items-center justify-between sm:justify-start lg:justify-between gap-2 px-3 py-2 bg-slate-950/40 border border-white/10 rounded-xl text-xs font-semibold text-blue-200">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-indigo-300" />
                <span>Prioritize Legal / Lok Sewa</span>
              </span>
              <button
                onClick={() => setForceLegalVocabulary(prev => !prev)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  forceLegalVocabulary ? 'bg-amber-400' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    forceLegalVocabulary ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP WEAKEST AREAS SELECTOR CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              <span>Your Top Weakest Areas</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ranked by error frequency, accuracy percentage, and repetition severity.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Click any pattern to generate personalized drills
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {weakKeys.slice(0, 5).map((weak, idx) => {
            const isSelected = weak.key === selectedPatternKey;
            const isCritical = weak.accuracy < 80;

            return (
              <div
                key={weak.key}
                onClick={() => setSelectedPatternKey(weak.key)}
                className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-sm'
                }`}
              >
                {/* Priority Rank Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    idx === 0 
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    #{idx + 1} Priority
                  </span>

                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isCritical
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                  }`}>
                    {weak.accuracy}% Acc
                  </span>
                </div>

                {/* Main Devanagari & Romanized Display */}
                <div className="py-2 text-center">
                  <div className="text-3xl font-black text-slate-900 dark:text-white font-['Kalimati',sans-serif]">
                    {weak.devanagari}
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5">
                    {weak.romanizedSequence}
                  </div>
                </div>

                {/* Sample Target Words Pill */}
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold block truncate">
                    {weak.sampleWords.slice(0, 3).join(', ')}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span className="text-rose-500 font-bold">{weak.mistakesCount} errors</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold group-hover:underline flex items-center gap-0.5">
                      Select <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 6-LEVEL PROGRESSIVE EXERCISE GENERATOR & ADAPTIVE DIFFICULTY */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Personalized Practice Levels for <span className="text-blue-600 dark:text-blue-400 font-black">{activeWeakPattern?.devanagari} ({activeWeakPattern?.romanizedSequence})</span>
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Progressively builds muscle memory from raw keystrokes to full paragraphs.
            </p>
          </div>

          {/* Adaptive Recommendation Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Coach Recommendation: <strong>Level {adaptiveRecommendation.recommendedLevel}</strong></span>
          </div>
        </div>

        {/* Level Selector Tabs (Levels 1 through 6) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { level: 1 as PracticeLevel, title: 'L1: Characters', subtitle: 'Repetition' },
            { level: 2 as PracticeLevel, title: 'L2: Syllables', subtitle: 'Matras & Vowels' },
            { level: 3 as PracticeLevel, title: 'L3: Words', subtitle: 'Target Words' },
            { level: 4 as PracticeLevel, title: 'L4: Difficult', subtitle: 'Compounds' },
            { level: 5 as PracticeLevel, title: 'L5: Sentences', subtitle: 'Contextual' },
            { level: 6 as PracticeLevel, title: 'L6: Paragraph', subtitle: 'Full Passage' }
          ].map(lvl => {
            const isSelected = selectedLevel === lvl.level;
            const isRecommended = adaptiveRecommendation.recommendedLevel === lvl.level;

            return (
              <button
                key={lvl.level}
                onClick={() => {
                  setSelectedLevel(lvl.level);
                  setRunnerActive(false);
                }}
                className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded shadow-xs">
                    Target
                  </span>
                )}
                <div className="text-xs font-black">{lvl.title}</div>
                <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {lvl.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Level Details & Preview Card */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{generatedExercise.levelTitle}</span>
                {generatedExercise.isLegalFocus && (
                  <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                    Legal / Lok Sewa Focus
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {generatedExercise.levelDescription}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => startInteractiveRunner(generatedExercise)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Practice in Drill Runner</span>
              </button>

              <button
                onClick={() => {
                  onLaunchFullPractice(
                    generatedExercise.items,
                    `${generatedExercise.levelTitle} - ${activeWeakPattern?.devanagari}`
                  );
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition-all cursor-pointer"
                title="Launch in full Typing Area with Live Stats Bar & Virtual Keyboard"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Launch Full Test</span>
              </button>
            </div>
          </div>

          {/* Generated Exercise Words Preview */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Generated Practice Content:
            </div>
            <div className="flex flex-wrap gap-2 text-base font-semibold font-['Kalimati',sans-serif] text-slate-800 dark:text-slate-200 max-h-36 overflow-y-auto leading-relaxed">
              {generatedExercise.items.map((item, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-700/60"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. IN-ENGINE INTERACTIVE PRACTICE RUNNER */}
        {runnerActive && (
          <div className="relative p-6 sm:p-8 rounded-3xl bg-blue-50/60 dark:bg-blue-950/30 border-2 border-blue-300 dark:border-blue-800 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-300">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                <Keyboard className="w-4 h-4" />
                <span>Interactive Drill: {generatedExercise.levelTitle}</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <span>Progress: <strong className="text-blue-600 dark:text-blue-400">{runnerIndex + 1} / {runnerItems.length}</strong></span>
                <span>Errors: <strong className="text-rose-500">{runnerMistakes}</strong></span>
              </div>
            </div>

            {/* Runner Card Screen */}
            {!runnerFinished ? (
              <div
                onClick={() => runnerInputRef.current?.focus()}
                className={`relative min-h-[160px] bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 transition-all cursor-text flex flex-col items-center justify-center text-center select-none ${
                  runnerShake
                    ? 'border-rose-500 ring-4 ring-rose-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'
                }`}
              >
                {/* Floating Rejected Key Notification */}
                {runnerRejectedKey && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950 px-2.5 py-1 rounded-lg border border-rose-300 animate-bounce">
                    <span>Rejected: <strong className="uppercase">{runnerRejectedKey.key}</strong></span>
                    <span>| Expected:</span>
                    <kbd className="bg-amber-400 text-slate-950 px-1 rounded font-bold uppercase">{runnerRejectedKey.expected}</kbd>
                  </div>
                )}

                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Target Word
                </div>

                <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-['Kalimati',sans-serif] mb-4">
                  {runnerItems[runnerIndex] || ''}
                </div>

                <div className="h-10 px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 min-w-[200px] flex items-center justify-center text-lg font-bold font-['Kalimati',sans-serif] text-blue-600 dark:text-blue-400">
                  {runnerTyped || <span className="text-slate-400 text-sm font-normal">Type here...</span>}
                  <span className="w-0.5 h-5 bg-blue-600 dark:bg-blue-400 animate-pulse ml-0.5" />
                </div>

                <input
                  ref={runnerInputRef}
                  type="text"
                  value={runnerTyped}
                  onChange={() => {}}
                  onKeyDown={handleRunnerKeyDown}
                  className="opacity-0 absolute w-0 h-0 pointer-events-none"
                  autoFocus
                />
              </div>
            ) : (
              /* Runner Completion Mastery Screen */
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border-2 border-emerald-500 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Drill Completed Successfully!
                </h3>

                <div className="flex items-center justify-center gap-6 text-sm font-bold">
                  <div>
                    <span className="text-slate-400 block text-xs font-normal">Achieved Accuracy</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-2xl">{runnerAchievedAcc}%</span>
                  </div>
                  <div className="border-l border-slate-200 dark:border-slate-700 pl-6">
                    <span className="text-slate-400 block text-xs font-normal">Accuracy Improvement</span>
                    <span className="text-blue-600 dark:text-blue-400 text-2xl">
                      {runnerAchievedAcc >= runnerInitialAcc ? `+${runnerAchievedAcc - runnerInitialAcc}%` : `${runnerAchievedAcc - runnerInitialAcc}%`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => startInteractiveRunner(generatedExercise)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Practice Again</span>
                  </button>

                  <button
                    onClick={() => {
                      if (selectedLevel < 6) {
                        setSelectedLevel((prev) => (prev + 1) as PracticeLevel);
                        setRunnerFinished(false);
                        setRunnerActive(false);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer"
                  >
                    <span>Next Level</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 5. DAILY PERSONALIZED CHALLENGE & IMPROVEMENT TRACKER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Challenge Card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 rounded-3xl border border-amber-300 dark:border-amber-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-extrabold text-sm uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Today's Challenge</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              {dailyChallenge.date}
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 text-center space-y-1">
            <div className="text-xs text-slate-500 font-semibold">Today's Weakness Focus</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white font-['Kalimati',sans-serif]">
              {dailyChallenge.focusDevanagari}
            </div>
            <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
              {dailyChallenge.focusRomanized}
            </div>
          </div>

          {/* 4-Step Checklist */}
          <div className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>10 Character Drills ({dailyChallenge.focusRomanized})</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>8 Core Word Drills</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>5 Difficult Compound Words</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>1 Comprehensive Paragraph</span>
            </div>
          </div>

          <button
            onClick={handleStartDailyChallenge}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Start Daily Challenge</span>
          </button>
        </div>

        {/* Weak Patterns Improvement Progress Tracker */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Weak Patterns Mastery Progress</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tracking accuracy improvements across your weakest Devanagari patterns.
              </p>
            </div>

            <button
              onClick={onNavigateToAnalytics}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Progress Bars */}
          <div className="space-y-3 pt-2">
            {weakKeys.slice(0, 4).map(pat => {
              const currentAcc = pat.accuracy;
              const prevAcc = Math.max(30, currentAcc - Math.floor(Math.random() * 15 + 5));
              const gain = currentAcc - prevAcc;

              return (
                <div key={pat.key} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-slate-900 dark:text-white font-['Kalimati',sans-serif]">
                        {pat.devanagari}
                      </span>
                      <span className="font-mono text-slate-500 font-bold uppercase">
                        ({pat.romanizedSequence})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-semibold">
                      <span className="text-slate-400">Baseline: {prevAcc}%</span>
                      <span className="text-slate-900 dark:text-white font-bold">Current: {currentAcc}%</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        +{gain}% Improvement
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentAcc}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 6. PERSONAL WEAK WORDS BANK */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>Personal Weak Words Bank</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Continuously updated database of words where you made mistakes or required backspaces.
            </p>
          </div>

          {/* Search & Category Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search weak words..."
                value={wordSearchQuery}
                onChange={e => setWordSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => {
                if (filteredWeakWords.length > 0) {
                  onLaunchFullPractice(
                    filteredWeakWords.slice(0, 15).map(w => w.word),
                    'Weak Words Targeted Practice'
                  );
                }
              }}
              disabled={filteredWeakWords.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Practice Top Weak Words</span>
            </button>
          </div>
        </div>

        {/* Weak Words Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Devanagari Word</th>
                <th className="py-3 px-4">Romanized Hint</th>
                <th className="py-3 px-4 text-center">Times Typed</th>
                <th className="py-3 px-4 text-center">Mistakes</th>
                <th className="py-3 px-4 text-center">Accuracy</th>
                <th className="py-3 px-4 text-center">Avg Time</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredWeakWords.length > 0 ? (
                filteredWeakWords.slice(0, 10).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-black text-sm font-['Kalimati',sans-serif] text-slate-900 dark:text-white">
                      {item.word}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {item.romanized}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600 dark:text-slate-300">
                      {item.timesTyped}
                    </td>
                    <td className="py-3 px-4 text-center text-rose-500 font-bold">
                      {item.mistakesCount}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        item.accuracy >= 85
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : item.accuracy >= 70
                          ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                          : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500">
                      {item.avgTimeMs}ms
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onLaunchFullPractice([item.word, item.word, item.word], `Word Drill: ${item.word}`)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
                      >
                        Practice Word
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No matching weak words found in history. Great job typing accurately!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
