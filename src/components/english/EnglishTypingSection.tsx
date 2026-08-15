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
import {
  LayoutDashboard,
  GraduationCap,
  Target,
  Zap,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Star,
  Play,
  Trophy,
  Flame,
  Clock,
  RotateCcw,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  Keyboard,
  ShieldCheck,
  Award,
  ArrowRight,
  Sliders
} from 'lucide-react';

interface EnglishTypingSectionProps {
  userStats: UserStats;
  liveKeyStatsMap?: Record<string, KeyStats>;
  onTestComplete: (result: TestResult) => void;
  onNavigateToNepali?: () => void;
}

const ENGLISH_PROGRESS_STORAGE_KEY = 'nepali_typing_english_progress';

export const EnglishTypingSection: React.FC<EnglishTypingSectionProps> = ({
  userStats,
  liveKeyStatsMap = {},
  onTestComplete,
  onNavigateToNepali
}) => {
  // Navigation sub-tabs within English Typing section
  const [subTab, setSubTab] = useState<'dashboard' | 'curriculum' | 'practice' | 'tests' | 'improvement'>('dashboard');

  // Active Player State
  const [activePlayerMode, setActivePlayerMode] = useState<{
    type: 'course-lesson' | 'quick-test' | 'word-test' | 'paragraph-test' | 'practice-module' | 'improvement-drill';
    lesson?: EnglishLevelExercise;
    paragraphTest?: EnglishParagraphTest;
    practiceModule?: EnglishPracticeModule;
    improvementDrill?: EnglishImprovementDrill;
    timeLimitSeconds?: number;
    wordLimit?: number;
    customText?: string;
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
    // 1. Record test result globally
    onTestComplete(result);

    // 2. If it was a course lesson, update unlocked status
    if (activePlayerMode?.lesson) {
      const currentLesson = activePlayerMode.lesson;
      const lessonId = currentLesson.id;

      setCourseProgress(prev => {
        const nextCompleted = {
          ...prev.completedExercises,
          [lessonId]: {
            wpm: result.netWpm,
            accuracy: result.accuracy,
            date: new Date().toISOString(),
            stars,
            passed: passedLesson
          }
        };

        let nextUnlockedLevel = prev.unlockedLevel;
        let nextUnlockedExerciseId = prev.unlockedExerciseId;

        if (passedLesson) {
          // Find next exercise in curriculum
          const allExercises: EnglishLevelExercise[] = [];
          ENGLISH_COURSE_LEVELS.forEach(lvl => {
            lvl.exercises.forEach(ex => allExercises.push(ex));
          });

          const currentIdx = allExercises.findIndex(e => e.id === lessonId);
          if (currentIdx >= 0 && currentIdx < allExercises.length - 1) {
            const nextEx = allExercises[currentIdx + 1];
            nextUnlockedExerciseId = nextEx.id;
            if (nextEx.level > nextUnlockedLevel) {
              nextUnlockedLevel = nextEx.level;
            }
          }
        }

        return {
          unlockedLevel: nextUnlockedLevel,
          unlockedExerciseId: nextUnlockedExerciseId,
          completedExercises: nextCompleted
        };
      });
    }
  };

  // Launch next lesson automatically
  const handleNextLesson = () => {
    if (!activePlayerMode?.lesson) return;
    const currentId = activePlayerMode.lesson.id;

    const allExercises: EnglishLevelExercise[] = [];
    ENGLISH_COURSE_LEVELS.forEach(lvl => {
      lvl.exercises.forEach(ex => allExercises.push(ex));
    });

    const currentIdx = allExercises.findIndex(e => e.id === currentId);
    if (currentIdx >= 0 && currentIdx < allExercises.length - 1) {
      const nextEx = allExercises[currentIdx + 1];
      setActivePlayerMode({
        type: 'course-lesson',
        lesson: nextEx
      });
    } else {
      setActivePlayerMode(null);
    }
  };

  // Custom text test state
  const [customTextDraft, setCustomTextDraft] = useState<string>('');
  const [selectedTimeLimit, setSelectedTimeLimit] = useState<number>(60);
  const [selectedWordLimit, setSelectedWordLimit] = useState<number>(25);

  // If Player is active, render typing player view
  if (activePlayerMode) {
    return (
      <EnglishTypingPlayer
        modeType={activePlayerMode.type}
        lesson={activePlayerMode.lesson}
        paragraphTest={activePlayerMode.paragraphTest}
        practiceModule={activePlayerMode.practiceModule}
        improvementDrill={activePlayerMode.improvementDrill}
        timeLimitSeconds={activePlayerMode.timeLimitSeconds}
        wordLimit={activePlayerMode.wordLimit}
        customText={activePlayerMode.customText}
        onComplete={handlePlayerComplete}
        onExit={() => setActivePlayerMode(null)}
        onNextLesson={
          activePlayerMode.type === 'course-lesson' ? handleNextLesson : undefined
        }
      />
    );
  }

  return (
    <div id="english-typing-academy-section" className="w-full max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Section Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                English Typing Academy
              </span>
              <span className="text-xs text-blue-200/80">Beginner to Professional Mastery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Professional English Keyboard Mastery
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Master touch typing across all 7 levels, practice standardized QWERTY finger placement, conquer WPM speed milestones, and eliminate weak keys with our AI typing coach.
            </p>
          </div>

          {/* Quick Stat Pill & Switch to Nepali Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/30 text-blue-300 flex items-center justify-center font-bold text-base">
                {currentTierInfo.badge}
              </div>
              <div>
                <span className="text-[10px] uppercase text-blue-200 font-bold block">Current Tier</span>
                <span className="font-extrabold text-white text-sm">{currentTierInfo.tier} ({englishAnalytics.avgWpm} WPM)</span>
              </div>
            </div>

            {onNavigateToNepali && (
              <button
                onClick={onNavigateToNepali}
                className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Switch to Nepali Typing</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-x-auto">
        <button
          onClick={() => setSubTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard & Milestones</span>
        </button>

        <button
          onClick={() => setSubTab('curriculum')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'curriculum'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>7-Level Course</span>
        </button>

        <button
          onClick={() => setSubTab('practice')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'practice'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>Practice Mode</span>
        </button>

        <button
          onClick={() => setSubTab('tests')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'tests'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Speed & Paragraph Tests</span>
        </button>

        <button
          onClick={() => setSubTab('improvement')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
            subTab === 'improvement'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>AI Typing Coach</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. DASHBOARD & MILESTONES TAB */}
      {/* ========================================================================= */}
      {subTab === 'dashboard' && (
        <div className="space-y-6">
          
          {/* Milestone Tier Progress Card */}
          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                  Speed Progression Hierarchy
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>Current Status: {currentTierInfo.tier} Typist</span>
                  <span className="text-lg">{currentTierInfo.badge}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {currentTierInfo.description}
                </p>
              </div>

              {nextGoal.diff > 0 && (
                <div className="bg-blue-50 dark:bg-blue-950/60 px-4 py-3 rounded-2xl border border-blue-100 dark:border-blue-900 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">Next Target</span>
                  <span className="font-extrabold text-blue-700 dark:text-blue-300 text-sm">
                    {nextGoal.nextTier.tier} ({nextGoal.nextTier.minWpm} WPM) — <span className="font-normal">{nextGoal.diff} WPM to go</span>
                  </span>
                </div>
              )}
            </div>

            {/* Visual Milestones Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 pt-2">
              {WPM_MILESTONES.map((m, idx) => {
                const isReached = (englishAnalytics.avgWpm || 0) >= m.minWpm;
                const isCurrent = currentTierInfo.tier === m.tier;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl border text-center transition-all relative ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-500/20 scale-105 z-10'
                        : isReached
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="text-lg mb-1">{m.badge}</div>
                    <div className="text-xs font-black truncate">{m.tier}</div>
                    <div className="text-[10px] font-mono font-bold mt-0.5 opacity-90">{m.requirement}</div>
                    {isReached && !isCurrent && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mx-auto mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Analytics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Average Speed</span>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                  {englishAnalytics.avgWpm} <span className="text-xs font-bold text-slate-500">WPM</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">Best: {englishAnalytics.bestWpm} WPM</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Accuracy</span>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                  {englishAnalytics.avgAccuracy}%
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">Best: {englishAnalytics.bestAccuracy}%</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Typing Time</span>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                  {Math.round(englishAnalytics.totalTimeSpentSeconds / 60)} <span className="text-xs font-bold text-slate-500">min</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{englishAnalytics.totalEnglishTests} tests taken</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Logged Errors</span>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                  {englishAnalytics.totalMistakes}
                </div>
                <span className="text-[10px] text-slate-500 font-bold">{englishAnalytics.totalBackspaces} backspaces</span>
              </div>
            </div>
          </div>

          {/* Quick Launch Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Continue Curriculum Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg shadow-blue-500/10 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
                    Curriculum Progress
                  </span>
                  <GraduationCap className="w-6 h-6 text-blue-200" />
                </div>
                <h4 className="text-lg font-black mt-3">Continue 7-Level Course</h4>
                <p className="text-xs text-blue-100/90 mt-1 leading-relaxed">
                  Resume structured lessons starting from Level {courseProgress.unlockedLevel}. Build permanent muscle memory.
                </p>
              </div>

              <button
                onClick={() => setSubTab('curriculum')}
                className="w-full py-3 rounded-2xl bg-white text-blue-700 font-extrabold text-xs transition-all hover:bg-blue-50 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Open 7-Level Course</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 60s Speed Test */}
            <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    Benchmark
                  </span>
                  <Zap className="w-6 h-6 text-amber-500" />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-3">1-Minute Speed Test</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Test your real-time WPM, keystroke latency, and accuracy with our standard 60-second test.
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePlayerMode({
                    type: 'quick-test',
                    timeLimitSeconds: 60,
                    customText: ENGLISH_PARAGRAPH_TESTS[0].text
                  });
                }}
                className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs transition-all hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start 1-Min Test</span>
              </button>
            </div>

            {/* AI Improvement Coach */}
            <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    Targeted Training
                  </span>
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-3">AI Weak-Key Drills</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {englishAnalytics.weakestKeys.length > 0
                    ? `Practice custom drills for your weakest keys (${englishAnalytics.weakestKeys.slice(0, 3).map(k => k.key.toUpperCase()).join(', ')}).`
                    : 'Target your slowest keys and frequently mistyped letter combinations.'}
                </p>
              </div>

              <button
                onClick={() => setSubTab('improvement')}
                className="w-full py-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-xs transition-all hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open AI Coach</span>
              </button>
            </div>

          </div>

          {/* Weak Keys & Error Analysis Summary */}
          {englishAnalytics.weakestKeys.length > 0 && (
            <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                    Detected Weak English Keys
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Keys with high mistake frequency and reaction latency
                  </p>
                </div>
                <button
                  onClick={() => setSubTab('improvement')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Practice Weak Keys</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {englishAnalytics.weakestKeys.slice(0, 6).map((wk, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-1.5"
                  >
                    <div className="w-10 h-10 mx-auto rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono font-black text-lg flex items-center justify-center border border-rose-300 dark:border-rose-800">
                      {wk.key}
                    </div>
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      {wk.finger}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {wk.mistakesCount} errors ({wk.accuracy}% acc)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 7-LEVEL BEGINNER-TO-PRO COURSE TAB */}
      {/* ========================================================================= */}
      {subTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              7-Level Touch Typing Curriculum
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Complete each lesson with at least 85% accuracy to pass and 95%+ for 3-star mastery. Lessons must be unlocked sequentially.
            </p>
          </div>

          <div className="space-y-6">
            {ENGLISH_COURSE_LEVELS.map(levelInfo => {
              const isLevelUnlocked = levelInfo.level <= courseProgress.unlockedLevel;

              return (
                <div
                  key={levelInfo.level}
                  className={`bg-white dark:bg-slate-800/90 rounded-3xl border transition-all overflow-hidden ${
                    isLevelUnlocked
                      ? 'border-slate-200 dark:border-slate-700 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/60 dark:bg-slate-900/40'
                  }`}
                >
                  {/* Level Header */}
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                          {levelInfo.badge}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          Target: {levelInfo.targetWpmRange}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                        {levelInfo.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {levelInfo.description}
                      </p>
                    </div>

                    {!isLevelUnlocked && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Lock className="w-4 h-4" />
                        <span>Locked (Complete Level {levelInfo.level - 1})</span>
                      </div>
                    )}
                  </div>

                  {/* Exercises Grid */}
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {levelInfo.exercises.map(exercise => {
                      const completedData = courseProgress.completedExercises[exercise.id];
                      const isExerciseUnlocked = isLevelUnlocked; // Level-based unlock

                      return (
                        <div
                          key={exercise.id}
                          className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                            completedData?.passed
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                              : isExerciseUnlocked
                              ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-md'
                              : 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-400">
                                Lesson {exercise.lessonNumber}
                              </span>
                              {completedData && (
                                <div className="flex gap-0.5">
                                  <Star className={`w-3.5 h-3.5 ${completedData.stars >= 1 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                  <Star className={`w-3.5 h-3.5 ${completedData.stars >= 2 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                  <Star className={`w-3.5 h-3.5 ${completedData.stars >= 3 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                                </div>
                              )}
                            </div>

                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                              {exercise.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                              {exercise.description}
                            </p>

                            <div className="p-2 bg-slate-100/80 dark:bg-slate-700/50 rounded-xl text-[11px] font-mono text-slate-600 dark:text-slate-300 truncate">
                              {exercise.targetText}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                            {completedData ? (
                              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                {completedData.wpm} WPM • {completedData.accuracy}% acc
                              </div>
                            ) : (
                              <span className="text-[11px] font-semibold text-slate-400">
                                Target: {exercise.targetWpm} WPM
                              </span>
                            )}

                            <button
                              disabled={!isExerciseUnlocked}
                              onClick={() => {
                                setActivePlayerMode({
                                  type: 'course-lesson',
                                  lesson: exercise
                                });
                              }}
                              className={`px-3.5 py-1.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                                isExerciseUnlocked
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{completedData ? 'Practice Again' : 'Start'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PRACTICE MODE (CATEGORIZED MODULES) */}
      {/* ========================================================================= */}
      {subTab === 'practice' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Categorized Practice Drills
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Targeted drills for home row, all keyboard rows, common words, numbers & symbols, technical terminology, and legal vocabulary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ENGLISH_PRACTICE_MODULES.map(module => (
              <div
                key={module.id}
                className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between gap-4 hover:border-blue-400 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase">
                      {module.category}
                    </span>
                    <Target className="w-5 h-5 text-slate-400" />
                  </div>

                  <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                    {module.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {module.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-600 dark:text-slate-300 max-h-20 overflow-y-auto">
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
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Practice Drill</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. SPEED & PARAGRAPH TESTS */}
      {/* ========================================================================= */}
      {subTab === 'tests' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Standard Speed & Paragraph Tests
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Take standardized time-based tests, word-count tests, or test your speed on curated professional passages.
            </p>
          </div>

          {/* Quick Timed Tests Bar */}
          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Timed Speed Tests</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-center transition-all cursor-pointer group"
                >
                  <div className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {seconds >= 60 ? `${seconds / 60}m` : `${seconds}s`}
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 mt-0.5">
                    {seconds >= 60 ? `${seconds / 60} Minute Test` : `${seconds} Seconds Test`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Paragraph Tests Library */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Passage & Document Typing Tests
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ENGLISH_PARAGRAPH_TESTS.map(test => (
                <div
                  key={test.id}
                  className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between gap-4 hover:border-blue-400 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold">
                        {test.category} • {test.difficulty}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {test.wordCount} words
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
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
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Passage Test</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Text Option */}
          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Custom Text Typing Test</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste your own English article, code comments, or document to practice typing custom content.
            </p>

            <textarea
              rows={3}
              value={customTextDraft}
              onChange={e => setCustomTextDraft(e.target.value)}
              placeholder="Paste any English text or paragraph here..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end">
              <button
                disabled={!customTextDraft.trim()}
                onClick={() => {
                  setActivePlayerMode({
                    type: 'paragraph-test',
                    customText: customTextDraft
                  });
                }}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                  customTextDraft.trim()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Custom Test</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AI TYPING IMPROVEMENT COACH */}
      {/* ========================================================================= */}
      {subTab === 'improvement' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Personalized AI Improvement Engine
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Targeted Weak-Key & Error Correction Drills
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Our AI engine continuously analyzes every keystroke mistake from your English typing sessions and generates a progressive 5-stage drill pipeline:
              <strong> Keys → Combinations → Words → Sentences → Contextual Paragraph</strong>.
            </p>
          </div>

          {/* 5-Stage Progressive Drills */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Generated Progressive 5-Stage Drills
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {generatedDrills.map(drill => (
                <div
                  key={drill.id}
                  className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-400 transition-all"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
                        {drill.stageName}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Focus: {drill.targetKeys.map(k => k.toUpperCase()).join(', ')}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 dark:text-slate-100">
                      {drill.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {drill.description}
                    </p>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 truncate">
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
                    className="self-start md:self-center px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Launch Stage {drill.stage}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Frequent Error Breakdown */}
          {englishAnalytics.topMistypedWords.length > 0 && (
            <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                Most Mistyped English Words
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Words where backspaces or incorrect keystrokes occurred repeatedly
              </p>

              <div className="flex flex-wrap gap-2">
                {englishAnalytics.topMistypedWords.map(([word, count], idx) => (
                  <div
                    key={idx}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-mono font-bold text-rose-800 dark:text-rose-200 flex items-center gap-2"
                  >
                    <span>{word}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100">
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
