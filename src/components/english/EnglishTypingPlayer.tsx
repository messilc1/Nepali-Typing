import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  EnglishLevelExercise,
  EnglishParagraphTest,
  EnglishPracticeModule,
  EnglishImprovementDrill,
  TestResult,
  KeyStats,
  DetailedCharError,
  DetailedWordError,
  SessionStatus
} from '../../types';
import { EnglishKeyboardGuide } from './EnglishKeyboardGuide';
import {
  Clock,
  Zap,
  Target,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Star,
  Award,
  Flame,
  Volume2,
  VolumeX,
  Keyboard as KeyboardIcon,
  ShieldCheck
} from 'lucide-react';

interface EnglishTypingPlayerProps {
  modeType: 'course-lesson' | 'quick-test' | 'word-test' | 'paragraph-test' | 'practice-module' | 'improvement-drill';
  lesson?: EnglishLevelExercise;
  paragraphTest?: EnglishParagraphTest;
  practiceModule?: EnglishPracticeModule;
  improvementDrill?: EnglishImprovementDrill;
  timeLimitSeconds?: number;
  wordLimit?: number;
  customText?: string;
  mistakeMode?: 'strict' | 'allow';
  maxMistakes?: number | null;
  maxMistakesAction?: 'end_test' | 'continue';
  backspaceEnabled?: boolean;
  noTimeLimit?: boolean;
  showHints?: boolean;
  onComplete: (result: TestResult, passedLesson?: boolean, stars?: number) => void;
  onExit: () => void;
  onNextLesson?: () => void;
}

export const EnglishTypingPlayer: React.FC<EnglishTypingPlayerProps> = ({
  modeType,
  lesson,
  paragraphTest,
  practiceModule,
  improvementDrill,
  timeLimitSeconds,
  wordLimit,
  customText,
  mistakeMode = 'strict',
  maxMistakes = null,
  maxMistakesAction = 'continue',
  backspaceEnabled = true,
  noTimeLimit = false,
  showHints = true,
  onComplete,
  onExit,
  onNextLesson
}) => {
  // Determine target text
  const targetText = useMemo(() => {
    if (customText) return customText.trim();
    if (lesson) return lesson.targetText.trim();
    if (paragraphTest) return paragraphTest.text.trim();
    if (practiceModule) return practiceModule.items.join(' ').trim();
    if (improvementDrill) return improvementDrill.content.trim();
    return 'The quick brown fox jumps over the lazy dog.';
  }, [customText, lesson, paragraphTest, practiceModule, improvementDrill]);

  const targetChars = useMemo(() => targetText.split(''), [targetText]);

  // Typing state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [typedChars, setTypedChars] = useState<{ char: string; isCorrect: boolean }[]>([]);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Time tracking
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const lastKeyTimeRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<any>(null);

  // Detailed error trackers
  const mistypedWordsMapRef = useRef<Record<string, number>>({});
  const mistypedCharsMapRef = useRef<Record<string, number>>({});
  const keyStatsMapRef = useRef<Record<string, KeyStats>>({});
  const detailedCharErrorsRef = useRef<DetailedCharError[]>([]);
  const detailedWordErrorsRef = useRef<DetailedWordError[]>([]);
  const currentWordBufferRef = useRef<{ target: string; typed: string; hasError: boolean; startTime: number }>({
    target: '',
    typed: '',
    hasError: false,
    startTime: Date.now()
  });

  // Sound generator
  const playClickSound = useCallback((isError = false) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isError) {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  }, [soundEnabled]);

  // Current and next expected characters
  const currentTargetChar = currentIndex < targetChars.length ? targetChars[currentIndex] : '';
  const nextTargetChar = currentIndex + 1 < targetChars.length ? targetChars[currentIndex + 1] : '';

  // Calculate live metrics
  const liveStats = useMemo(() => {
    const timeInMinutes = Math.max(elapsedSeconds / 60, 0.05);
    const correctCharsCount = typedChars.filter(c => c.isCorrect).length;
    const totalTyped = typedChars.length + mistakeCount;
    
    // Standard 5-char = 1 word
    const grossWpm = Math.round((correctCharsCount + mistakeCount) / 5 / timeInMinutes);
    const netWpm = Math.max(0, Math.round(correctCharsCount / 5 / timeInMinutes));
    const accuracy = totalTyped > 0 ? Math.round((correctCharsCount / totalTyped) * 100) : 100;
    const progressPercent = Math.min(100, Math.round((currentIndex / targetChars.length) * 100));

    return {
      grossWpm,
      netWpm,
      accuracy: Math.min(100, Math.max(0, accuracy)),
      progressPercent,
      correctCharsCount
    };
  }, [elapsedSeconds, typedChars, mistakeCount, currentIndex, targetChars.length]);

  // Finish session calculation & saving
  const finishSession = useCallback(() => {
    setIsFinished(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const duration = Math.max(elapsedSeconds, 1);
    const timeInMinutes = duration / 60;
    const correctCharsCount = typedChars.filter(c => c.isCorrect).length;
    const totalKeystrokes = typedChars.length + mistakeCount;
    const accuracy = totalKeystrokes > 0 ? Math.round((correctCharsCount / totalKeystrokes) * 100) : 100;
    const netWpm = Math.max(0, Math.round(correctCharsCount / 5 / timeInMinutes));
    const grossWpm = Math.round(totalKeystrokes / 5 / timeInMinutes);

    // Calculate stars and pass status for lessons
    let passed = true;
    let stars = 3;
    if (lesson) {
      if (accuracy < 85) {
        passed = false;
        stars = 1;
      } else if (accuracy < 95) {
        passed = true;
        stars = 2;
      } else {
        passed = true;
        stars = 3;
      }
    }

    const testResult: TestResult = {
      id: `eng-test-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      language: 'english',
      testType: modeType === 'quick-test' ? 'time' : modeType === 'word-test' ? 'words' : 'custom',
      sessionStatus: 'Completed',
      durationSeconds: duration,
      elapsedSeconds: duration,
      remainingSeconds: 0,
      grossWpm,
      netWpm,
      accuracy,
      finalAccuracy: accuracy,
      keystrokeAccuracy: totalKeystrokes > 0 ? Math.max(0, Math.round(((totalKeystrokes - mistakeCount) / totalKeystrokes) * 100)) : 100,
      correctedMistakesCount: backspaceCount,
      uncorrectedMistakesCount: 0,
      totalCharactersTyped: totalKeystrokes,
      correctCharacters: correctCharsCount,
      wrongCharacters: mistakeCount,
      totalWordsTyped: Math.round(correctCharsCount / 5),
      correctWords: Math.round(correctCharsCount / 5),
      wrongWords: 0,
      mistakesCount: mistakeCount,
      backspacesCount: backspaceCount,
      consistencyPercent: 90,
      performanceGrade: netWpm >= 50 && accuracy >= 95 ? 'Excellent' : netWpm >= 30 ? 'Good' : 'Average',
      wpmOverTime: [
        { second: duration, wpm: netWpm, rawWpm: grossWpm, errors: mistakeCount }
      ],
      keyStatsMap: keyStatsMapRef.current,
      mistypedWordsMap: mistypedWordsMapRef.current,
      mistypedCharsMap: mistypedCharsMapRef.current,
      slowWordsMap: {},
      wordErrors: detailedWordErrorsRef.current,
      charErrors: detailedCharErrorsRef.current,
      sampleText: targetText,
      categoryOrTitle: lesson?.title || paragraphTest?.title || practiceModule?.title || improvementDrill?.title || 'English Practice'
    };

    onComplete(testResult, passed, stars);
  }, [elapsedSeconds, typedChars, mistakeCount, backspaceCount, lesson, paragraphTest, practiceModule, improvementDrill, modeType, onComplete]);

  // Timer effect
  useEffect(() => {
    if (hasStarted && !isFinished) {
      startTimeRef.current = startTimeRef.current || Date.now();
      timerIntervalRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000);
        setElapsedSeconds(seconds);

        // Check time limit
        if (!noTimeLimit && timeLimitSeconds && timeLimitSeconds > 0 && seconds >= timeLimitSeconds) {
          finishSession();
        }
      }, 250);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [hasStarted, isFinished, timeLimitSeconds, noTimeLimit, finishSession]);

  // Keydown handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFinished) return;

    // Ignore modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(e.key)) {
      return;
    }

    // Start timer on first keystroke
    if (!hasStarted) {
      setHasStarted(true);
      startTimeRef.current = Date.now();
      lastKeyTimeRef.current = Date.now();
    }

    setActiveKey(e.key);
    setTimeout(() => setActiveKey(undefined), 150);

    const now = Date.now();
    const keyLatency = now - lastKeyTimeRef.current;
    lastKeyTimeRef.current = now;

    const expectedChar = targetChars[currentIndex];

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (!backspaceEnabled) return;
      setBackspaceCount(prev => prev + 1);
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setTypedChars(prev => prev.slice(0, -1));
      }
      return;
    }

    // Single character input
    if (e.key.length === 1) {
      e.preventDefault();
      const lowerKey = e.key.toLowerCase();

      // Key stats update
      const existingKeyStat = keyStatsMapRef.current[lowerKey] || {
        key: lowerKey,
        label: lowerKey.toUpperCase(),
        totalHits: 0,
        correctHits: 0,
        mistakes: 0,
        totalTimeMs: 0
      };
      existingKeyStat.totalHits += 1;
      existingKeyStat.totalTimeMs += keyLatency;

      if (e.key === expectedChar) {
        // Correct Keystroke
        existingKeyStat.correctHits += 1;
        keyStatsMapRef.current[lowerKey] = existingKeyStat;

        playClickSound(false);
        setTypedChars(prev => [...prev, { char: e.key, isCorrect: true }]);

        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);

        // Check if finished
        if (nextIdx >= targetChars.length) {
          finishSession();
        }
      } else {
        // Mistake Keystroke
        existingKeyStat.mistakes += 1;
        keyStatsMapRef.current[lowerKey] = existingKeyStat;

        const newMistakeCount = mistakeCount + 1;
        setMistakeCount(newMistakeCount);
        playClickSound(true);

        // Log mistyped character
        mistypedCharsMapRef.current[expectedChar] = (mistypedCharsMapRef.current[expectedChar] || 0) + 1;

        detailedCharErrorsRef.current.push({
          targetChar: expectedChar,
          typedChar: e.key,
          frequency: 1,
          targetWord: '',
          position: currentIndex,
          corrected: false,
          correctionMethod: 'None',
          timestamp: now
        });

        // Check max mistakes limit
        if (maxMistakes && newMistakeCount >= maxMistakes && maxMistakesAction === 'end_test') {
          finishSession();
          return;
        }

        // In 'allow' mode, advance cursor with mistake recorded
        if (mistakeMode === 'allow') {
          setTypedChars(prev => [...prev, { char: e.key, isCorrect: false }]);
          const nextIdx = currentIndex + 1;
          setCurrentIndex(nextIdx);

          if (nextIdx >= targetChars.length) {
            finishSession();
          }
        }
      }
    }
  }, [isFinished, hasStarted, currentIndex, targetChars, playClickSound, finishSession, backspaceEnabled, mistakeCount, maxMistakes, maxMistakesAction, mistakeMode]);

  // Attach global keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Restart function
  const handleRestart = () => {
    setCurrentIndex(0);
    setTypedChars([]);
    setMistakeCount(0);
    setBackspaceCount(0);
    setHasStarted(false);
    setIsFinished(false);
    setElapsedSeconds(0);
    startTimeRef.current = null;
    lastKeyTimeRef.current = Date.now();
    detailedCharErrorsRef.current = [];
    detailedWordErrorsRef.current = [];
    mistypedWordsMapRef.current = {};
    mistypedCharsMapRef.current = {};
    keyStatsMapRef.current = {};
  };

  return (
    <div id="english-typing-player-container" className="w-full max-w-5xl mx-auto space-y-5 animate-in fade-in duration-300">
      
      {/* Top Navigation & Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Academy</span>
          </button>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>{lesson?.title || paragraphTest?.title || practiceModule?.title || improvementDrill?.title || 'English Typing Practice'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lesson?.subtitle || paragraphTest?.category || practiceModule?.description || improvementDrill?.stageName || 'Touch Typing Precision'}
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
            title={soundEnabled ? 'Disable Typing Sound' : 'Enable Typing Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            title="Restart Exercise"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* Live Heads-Up Dashboard (WPM, Accuracy, Time, Mistakes) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Speed</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {liveStats.netWpm} <span className="text-xs font-bold text-slate-500">WPM</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Accuracy</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {liveStats.accuracy}<span className="text-xs font-bold text-slate-500">%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Time</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {timeLimitSeconds
                ? `${Math.max(0, timeLimitSeconds - elapsedSeconds)}s`
                : `${elapsedSeconds}s`}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Mistakes</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {mistakeCount} <span className="text-[10px] font-bold text-slate-400">({backspaceCount} ⌫)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Text Display Canvas */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 relative select-none">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-blue-600 transition-all duration-200 ease-out"
            style={{ width: `${liveStats.progressPercent}%` }}
          />
        </div>

        {/* Typing Characters Stream */}
        <div className="text-xl sm:text-2xl font-mono leading-relaxed tracking-wide min-h-[140px] max-h-[260px] overflow-y-auto p-4 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 focus:outline-none">
          {targetChars.map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex;

            let charClass = 'text-slate-400 dark:text-slate-500';

            if (isTyped) {
              charClass = 'text-emerald-600 dark:text-emerald-400 font-semibold';
            } else if (isCurrent) {
              charClass = 'bg-blue-600 text-white font-extrabold px-1 rounded shadow-sm ring-2 ring-blue-400 animate-pulse';
            }

            return (
              <span key={index} className={`transition-colors ${charClass}`}>
                {char === ' ' && isCurrent ? '␣' : char}
              </span>
            );
          })}
        </div>

        {!hasStarted && !isFinished && (
          <div className="mt-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2 animate-bounce">
            <KeyboardIcon className="w-4 h-4 text-blue-500" />
            <span>Type any key to start typing practice...</span>
          </div>
        )}
      </div>

      {/* Interactive English QWERTY Keyboard Guide */}
      <EnglishKeyboardGuide
        currentTargetChar={currentTargetChar}
        nextTargetChar={nextTargetChar}
        showGuidance={showKeyboardGuide}
        onToggleGuidance={() => setShowKeyboardGuide(!showKeyboardGuide)}
        activeKey={activeKey}
      />

      {/* Completion Modal / Results Card */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Header Icon & Title */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mb-1">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
                Exercise Completed!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lesson?.title || paragraphTest?.title || 'Session results and permanent accuracy breakdown'}
              </p>
            </div>

            {/* Stars & Lesson Evaluation (If Lesson Mode) */}
            {lesson && (
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-center space-y-2">
                <div className="flex justify-center gap-2 text-2xl">
                  <Star className={`w-8 h-8 ${liveStats.accuracy >= 80 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                  <Star className={`w-8 h-8 ${liveStats.accuracy >= 90 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                  <Star className={`w-8 h-8 ${liveStats.accuracy >= 95 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                </div>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  {liveStats.accuracy >= 95 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">⭐ Mastered! Next Lesson Unlocked.</span>
                  ) : liveStats.accuracy >= 85 ? (
                    <span className="text-blue-600 dark:text-blue-400">✓ Passed (95%+ recommended for full mastery).</span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400">Repeat recommended (Minimum 85% required).</span>
                  )}
                </div>
              </div>
            )}

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Net Speed</span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {liveStats.netWpm} <span className="text-xs font-bold text-slate-500">WPM</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Accuracy</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {liveStats.accuracy}%
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Gross WPM</span>
                <div className="text-lg font-black text-slate-800 dark:text-slate-200 font-mono">
                  {liveStats.grossWpm} WPM
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Mistakes</span>
                <div className="text-lg font-black text-rose-600 dark:text-rose-400 font-mono">
                  {mistakeCount} <span className="text-xs font-semibold text-slate-400">({backspaceCount} ⌫)</span>
                </div>
              </div>
            </div>

            {/* Permanent mistake recording note */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900 text-[11px] text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-blue-500" />
              <span>All keystroke latencies and mistakes have been permanently logged in your English typing profile.</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              {onNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next Lesson</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onExit}
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer"
              >
                Exit
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
