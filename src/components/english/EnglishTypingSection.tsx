import React, { useState, useEffect, useMemo } from 'react';
import {
  UserStats,
  TestResult,
  KeyStats,
  EnglishLevelExercise,
  EnglishParagraphTest,
  EnglishPracticeModule,
  EnglishImprovementDrill,
  EnglishUserProgress
} from '../../types';
import {
  ENGLISH_COURSE_LEVELS,
  ENGLISH_PRACTICE_MODULES,
  ENGLISH_PARAGRAPH_TESTS,
  WPM_MILESTONES,
  getMilestoneTier,
  getNextMilestoneGoal
} from '../../data/englishCourseData';
import {
  analyzeEnglishTypingPerformance,
  generateProgressiveEnglishDrills
} from '../../utils/englishImprovementEngine';
import { EnglishTypingPlayer } from './EnglishTypingPlayer';
import { CustomTypingView, CustomTypingConfig } from '../CustomTypingView';
import {
  GraduationCap,
  Target,
  Zap,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Star,
  Play,
  Clock,
  ChevronRight,
  ShieldCheck,
  FileText,
  Keyboard,
  Sliders,
  Type
} from 'lucide-react';

interface EnglishTypingSectionProps {
  userStats: UserStats;
  liveKeyStatsMap?: Record<string, KeyStats>;
  onTestComplete: (result: TestResult) => void;
  onNavigateToNepali?: () => void;
}

const ENGLISH_PROGRESS_STORAGE_KEY = 'nepali_typing_english_progress';

export type EnglishSubTab = 'course' | 'practice' | 'speed' | 'paragraph' | 'custom' | 'coach';

export const EnglishTypingSection: React.FC<EnglishTypingSectionProps> = ({
  userStats,
  liveKeyStatsMap = {},
  onTestComplete,
  onNavigateToNepali
}) => {
  // Main 6-Option English Navigation
  const [subTab, setSubTab] = useState<EnglishSubTab>('course');

  // Selected level for course curriculum view
  const [selectedLevelNumber, setSelectedLevelNumber] = useState<number>(1);

  // Active Player State
  const [activePlayerMode, setActivePlayerMode] = useState<{
    type: 'course-lesson' | 'quick-test' | 'word-test' | 'paragraph-test' | 'practice-module' | 'improvement-drill';
    lesson?: EnglishLevelExercise;
    paragraphTest?: EnglishParagraphTest;
    practiceModule?: EnglishPracticeModule;
    improvementDrill?: EnglishImprovementDrill;
    timeLimitSeconds?: number | null;
    wordLimit?: number | null;
    customText?: string;
    mistakeMode?: 'strict' | 'allow';
    maxMistakes?: number | null;
    maxMistakesAction?: 'end_test' | 'continue';
    backspaceEnabled?: boolean;
    noTimeLimit?: boolean;
    showHints?: boolean;
  } | null>(null);

  // User Course Progression State
  const [courseProgress, setCourseProgress] = useState<EnglishUserProgress>(() => {
    try {
      const saved = localStorage.getItem(ENGLISH_PROGRESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return {
      unlockedLevel: 1,
      unlockedExerciseId: 'eng-l1-e1',
      completedExercises: {}
    };
  });

  // Save progress
  useEffect(() => {
    try {
      localStorage.setItem(ENGLISH_PROGRESS_STORAGE_KEY, JSON.stringify(courseProgress));
    } catch {
      // Storage error
    }
  }, [courseProgress]);

  // English Analytics Summary
  const englishAnalytics = useMemo(() => {
    return analyzeEnglishTypingPerformance(userStats.history || [], liveKeyStatsMap);
  }, [userStats.history, liveKeyStatsMap]);

  // Milestone info
  const currentTierInfo = useMemo(() => {
    return getMilestoneTier(englishAnalytics.avgWpm || 0);
  }, [englishAnalytics.avgWpm]);

  const nextGoal = useMemo(() => {
    return getNextMilestoneGoal(englishAnalytics.avgWpm || 0);
  }, [englishAnalytics.avgWpm]);

  // Generated AI Drills
  const generatedDrills = useMemo(() => {
    return generateProgressiveEnglishDrills(
      englishAnalytics.weakestKeys,
      englishAnalytics.topMistypedWords
    );
  }, [englishAnalytics.weakestKeys, englishAnalytics.topMistypedWords]);

  // Handle lesson completion & unlock logic
  const handlePlayerComplete = (result: TestResult, passedLesson = true, stars = 3) => {
    onTestComplete(result);

    if (activePlayerMode?.lesson) {
      const currentLesson = activePlayerMode.lesson;
      const lessonId = currentLesson.id;

      setCourseProgress(prev => {
        const nextCompleted = {
          ...prev.completedExercises,
          [lessonId]: {
            exerciseId: lessonId,
            bestWpm: Math.max(result.netWpm, prev.completedExercises[lessonId]?.bestWpm || 0),
            bestAccuracy: Math.max(result.accuracy, prev.completedExercises[lessonId]?.bestAccuracy || 0),
            starsEarned: Math.max(stars, prev.completedExercises[lessonId]?.starsEarned || 0),
            isCompleted: true,
            lastCompletedAt: Date.now()
          }
        };

        let nextUnlockedLevel = prev.unlockedLevel;
        let nextUnlockedExId = prev.unlockedExerciseId;

        const currentLevel = ENGLISH_COURSE_LEVELS.find(l => l.level === currentLesson.level);
        if (currentLevel) {
          const currentExIdx = currentLevel.exercises.findIndex(e => e.id === lessonId);
          if (currentExIdx !== -1 && currentExIdx + 1 < currentLevel.exercises.length) {
            nextUnlockedExId = currentLevel.exercises[currentExIdx + 1].id;
          } else {
            if (passedLesson && currentLesson.level >= prev.unlockedLevel && currentLesson.level < 7) {
              nextUnlockedLevel = currentLesson.level + 1;
              const nextLvlData = ENGLISH_COURSE_LEVELS.find(l => l.level === nextUnlockedLevel);
              if (nextLvlData && nextLvlData.exercises.length > 0) {
                nextUnlockedExId = nextLvlData.exercises[0].id;
              }
            }
          }
        }

        return {
          unlockedLevel: nextUnlockedLevel,
          unlockedExerciseId: nextUnlockedExId,
          completedExercises: nextCompleted
        };
      });
    }
  };

  const handleNextLesson = () => {
    if (!activePlayerMode?.lesson) return;
    const currentLesson = activePlayerMode.lesson;
    const allExercises = ENGLISH_COURSE_LEVELS.flatMap(l => l.exercises);
    const currentIdx = allExercises.findIndex(e => e.id === currentLesson.id);

    if (currentIdx !== -1 && currentIdx + 1 < allExercises.length) {
      const nextEx = allExercises[currentIdx + 1];
      setActivePlayerMode({
        type: 'course-lesson',
        lesson: nextEx
      });
    } else {
      setActivePlayerMode(null);
    }
  };

  // Custom typing start handler
  const handleStartCustomTest = (config: CustomTypingConfig) => {
    if (config.language === 'nepali' && onNavigateToNepali) {
      onNavigateToNepali();
      return;
    }

    setActivePlayerMode({
      type: 'paragraph-test',
      customText: config.text,
      timeLimitSeconds: config.timeLimitSeconds,
      noTimeLimit: config.timeLimitSeconds === null,
      wordLimit: config.wordCountLimit,
      mistakeMode: config.mistakeMode,
      backspaceEnabled: config.backspaceEnabled,
      showHints: config.showHints
    });
  };

  // If Player is active, render typing player view
  if (activePlayerMode) {
    return (
      <EnglishTypingPlayer
        modeType={activePlayerMode.type}
        lesson={activePlayerMode.lesson}
        paragraphTest={activePlayerMode.paragraphTest}
        practiceModule={activePlayerMode.practiceModule}
        improvementDrill={activePlayerMode.improvementDrill}
        timeLimitSeconds={activePlayerMode.timeLimitSeconds ?? undefined}
        wordLimit={activePlayerMode.wordLimit ?? undefined}
        customText={activePlayerMode.customText}
        mistakeMode={activePlayerMode.mistakeMode}
        maxMistakes={activePlayerMode.maxMistakes}
        maxMistakesAction={activePlayerMode.maxMistakesAction}
        backspaceEnabled={activePlayerMode.backspaceEnabled}
        noTimeLimit={activePlayerMode.noTimeLimit}
        showHints={activePlayerMode.showHints}
        onComplete={handlePlayerComplete}
        onExit={() => setActivePlayerMode(null)}
        onNextLesson={
          activePlayerMode.type === 'course-lesson' ? handleNextLesson : undefined
        }
      />
    );
  }

  const activeLevelData = ENGLISH_COURSE_LEVELS.find(l => l.level === selectedLevelNumber) || ENGLISH_COURSE_LEVELS[0];

  return (
    <div id="english-typing-academy-section" className="w-full max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Clean, Minimalist Header Banner */}
      <div className="bg-slate-900 dark:bg-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider">
              English Typing Academy
            </span>
            <span className="text-xs text-slate-400">Touch Typing & Speed Mastery</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Standard English Typing
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Structured 7-level touch typing course, targeted practice drills, standardized speed tests, custom text tests, and AI error correction.
          </p>
        </div>

        {/* Quick Stats & Switch to Nepali */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-xs flex items-center gap-2.5">
            <span className="text-base">{currentTierInfo.badge}</span>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block leading-none">Speed Tier</span>
              <span className="font-bold text-white text-xs">{currentTierInfo.tier} ({englishAnalytics.avgWpm} WPM)</span>
            </div>
          </div>

          {onNavigateToNepali && (
            <button
              onClick={onNavigateToNepali}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Nepali Typing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main 6-Item English Typing Navigation */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-x-auto">
        <button
          onClick={() => setSubTab('course')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'course'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>7 Level Course</span>
        </button>

        <button
          onClick={() => setSubTab('practice')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'practice'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Practice Mode</span>
        </button>

        <button
          onClick={() => setSubTab('speed')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'speed'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Speed Test</span>
        </button>

        <button
          onClick={() => setSubTab('paragraph')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'paragraph'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Paragraph Test</span>
        </button>

        <button
          onClick={() => setSubTab('custom')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'custom'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Custom Typing</span>
        </button>

        <button
          onClick={() => setSubTab('coach')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'coach'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Typing Coach</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. 7 LEVEL COURSE */}
      {/* ========================================================================= */}
      {subTab === 'course' && (
        <div className="space-y-6">
          {/* Level Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {ENGLISH_COURSE_LEVELS.map(lvl => {
              const isUnlocked = lvl.level <= courseProgress.unlockedLevel;
              const isSelected = selectedLevelNumber === lvl.level;
              const completedCount = lvl.exercises.filter(
                e => courseProgress.completedExercises[e.id]?.isCompleted
              ).length;
              const isLevelDone = completedCount === lvl.exercises.length;

              return (
                <button
                  key={lvl.level}
                  onClick={() => setSelectedLevelNumber(lvl.level)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : isUnlocked
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                      : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold">Level {lvl.level}</span>
                    {isLevelDone ? (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                    ) : isUnlocked ? (
                      <Unlock className={`w-3 h-3 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`} />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}
                  </div>
                  <div className="text-[11px] font-semibold truncate">{lvl.title}</div>
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {completedCount}/{lvl.exercises.length} Done
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Level Details & Exercise List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  Level {activeLevelData.level}: {activeLevelData.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeLevelData.description}
                </p>
              </div>
              <div className="text-xs font-bold text-slate-400">
                Focus: <span className="font-mono text-blue-600 dark:text-blue-400">{activeLevelData.focusConcept}</span>
              </div>
            </div>

            {/* Exercises Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeLevelData.exercises.map((ex, idx) => {
                const isExUnlocked = activeLevelData.level < courseProgress.unlockedLevel ||
                  ex.id === courseProgress.unlockedExerciseId ||
                  courseProgress.completedExercises[ex.id]?.isCompleted ||
                  idx === 0;
                const record = courseProgress.completedExercises[ex.id];

                return (
                  <div
                    key={ex.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                      record?.isCompleted
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                        : isExUnlocked
                        ? 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                        : 'bg-slate-50/30 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 opacity-60'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                          {ex.title}
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map(st => (
                            <Star
                              key={st}
                              className={`w-3 h-3 ${
                                record && record.starsEarned >= st
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {ex.description}
                      </p>

                      <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-300 truncate">
                        {ex.targetText}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {record ? (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          Best: {record.bestWpm} WPM ({record.bestAccuracy}%)
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Min Req: {ex.targetWpm} WPM / {ex.minAccuracy}%
                        </span>
                      )}

                      <button
                        disabled={!isExUnlocked}
                        onClick={() => {
                          setActivePlayerMode({
                            type: 'course-lesson',
                            lesson: ex
                          });
                        }}
                        className={`px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          isExUnlocked
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-2xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{record ? 'Practice Again' : 'Start Lesson'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PRACTICE MODE */}
      {/* ========================================================================= */}
      {subTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
              Targeted English Skill Drills
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Practice frequent English words, n-grams, numbers, and syntax symbols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ENGLISH_PRACTICE_MODULES.map(module => (
              <div
                key={module.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-4 hover:border-blue-400 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[11px] font-bold uppercase">
                      {module.category}
                    </span>
                    <Target className="w-4 h-4 text-slate-400" />
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {module.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {module.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-300 max-h-16 overflow-y-auto">
                    {module.items.join(' ')}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActivePlayerMode({
                      type: 'practice-module',
                      practiceModule: module
                    });
                  }}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Practice Drill</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SPEED TEST */}
      {/* ========================================================================= */}
      {subTab === 'speed' && (
        <div className="space-y-6">
          {/* Lok Sewa 5-Minute Exam Simulation Card */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/30 p-5 sm:p-6 rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black tracking-wide uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Official Exam Mode
                </span>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  Lok Sewa Aayog (PSC Nepal) IT Skill Test
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                5-Minute English Lok Sewa Typing Exam
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Evaluated with standard formula: <code className="font-mono font-bold bg-white/80 dark:bg-slate-900/80 px-1 py-0.5 rounded">CWPM = Correct Words ÷ 5</code>. 200 words target with auto-stop on reaching 200 words or 5 minutes.
              </p>
            </div>

            <button
              onClick={() => {
                setActivePlayerMode({
                  type: 'quick-test',
                  timeLimitSeconds: 300,
                  customText: ENGLISH_PARAGRAPH_TESTS[0].text
                });
              }}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch 5-Min Exam</span>
            </button>
          </div>

          {/* Timed Speed Tests */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Timed Speed Sprints</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[15, 30, 60, 120, 300].map(seconds => (
                <button
                  key={seconds}
                  onClick={() => {
                    setActivePlayerMode({
                      type: 'quick-test',
                      timeLimitSeconds: seconds,
                      customText: ENGLISH_PARAGRAPH_TESTS[0].text
                    });
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-center transition-all cursor-pointer group"
                >
                  <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {seconds >= 60 ? `${seconds / 60}m` : `${seconds}s`}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {seconds >= 60 ? `${seconds / 60} Minute Test` : `${seconds} Seconds Sprint`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Word Count Speed Tests */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Word Count Target Tests</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[10, 25, 50, 100, 200].map(words => (
                <button
                  key={words}
                  onClick={() => {
                    setActivePlayerMode({
                      type: 'word-test',
                      wordLimit: words,
                      noTimeLimit: true,
                      customText: ENGLISH_PARAGRAPH_TESTS[1].text
                    });
                  }}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-center transition-all cursor-pointer group"
                >
                  <div className="text-lg font-black text-slate-900 dark:text-slate-100 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {words}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {words} Words Target
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PARAGRAPH TEST */}
      {/* ========================================================================= */}
      {subTab === 'paragraph' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
              Standard Curated Paragraphs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Test your typing speed and accuracy on complete professional passages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ENGLISH_PARAGRAPH_TESTS.map(test => (
              <div
                key={test.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3 hover:border-blue-400 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                      {test.category} • {test.difficulty}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {test.wordCount} words
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {test.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {test.text}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActivePlayerMode({
                      type: 'paragraph-test',
                      paragraphTest: test
                    });
                  }}
                  className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Start Passage Test</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CUSTOM TYPING (MAIN TAB) */}
      {/* ========================================================================= */}
      {subTab === 'custom' && (
        <div className="space-y-6">
          <CustomTypingView
            initialLanguage="english"
            initialText=""
            initialWordCount={200}
            initialTimeSeconds={300}
            onStartTest={handleStartCustomTest}
            isModalMode={false}
          />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. AI TYPING COACH */}
      {/* ========================================================================= */}
      {subTab === 'coach' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Personalized AI Improvement Coach
              </span>
            </div>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100">
              Targeted Weak-Key & Error Correction Drills
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Our AI engine continuously analyzes your keystrokes and generates progressive 5-stage drills targeting your exact mistyped characters and words.
            </p>
          </div>

          {/* 5-Stage Progressive Drills */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Progressive 5-Stage AI Drills
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {generatedDrills.map(drill => (
                <div
                  key={drill.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-blue-400 transition-all"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                        {drill.stageName}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Focus: {drill.targetKeys.map(k => k.toUpperCase()).join(', ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                      {drill.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {drill.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
                      {drill.content}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActivePlayerMode({
                        type: 'improvement-drill',
                        improvementDrill: drill
                      });
                    }}
                    className="self-start md:self-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch Stage {drill.stage}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Frequent Error Breakdown */}
          {englishAnalytics.topMistypedWords.length > 0 && (
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Most Mistyped English Words
              </h3>

              <div className="flex flex-wrap gap-2">
                {englishAnalytics.topMistypedWords.map(([word, count], idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-mono font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1.5"
                  >
                    <span>{word}</span>
                    <span className="text-[10px] px-1 py-0.5 rounded-md bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100">
                      {count} errors
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
