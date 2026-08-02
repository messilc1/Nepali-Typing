import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LiveStatsBar } from './components/LiveStatsBar';
import { TypingArea, TypingAreaRef } from './components/TypingArea';
import { OnScreenKeyboard } from './components/OnScreenKeyboard';
import { ResultModal } from './components/ResultModal';
import { ErrorAnalysisView } from './components/ErrorAnalysisView';
import { PracticeMode } from './components/PracticeMode';
import { LegalPackView } from './components/LegalPackView';
import { HistoryAnalytics } from './components/HistoryAnalytics';
import { SettingsModal } from './components/SettingsModal';
import { CustomParagraphModal } from './components/CustomParagraphModal';

import { TestSettings, TestResult, UserStats, KeyStats } from './types';
import { applyGlobalNepaliFont, getStoredNepaliFont } from './utils/fonts';
import {
  NEPALI_WORDS_EASY,
  NEPALI_WORDS_MEDIUM,
  NEPALI_WORDS_HARD,
  NEPALI_WORDS_EXPERT,
  ENGLISH_WORDS_EASY,
  ENGLISH_WORDS_MEDIUM,
  LEGAL_TERMS_PACK,
  SAMPLE_PARAGRAPHS
} from './data/wordPacks';

const DEFAULT_SETTINGS: TestSettings = {
  language: 'nepali',
  testType: 'time',
  durationSeconds: 30,
  wordCount: 25,
  customText: '',
  difficulty: 'medium',
  fontSize: 'md',
  fontFamily: getStoredNepaliFont(),
  theme: 'white-blue',
  sound: 'click',
  soundVolume: 0.5,
  showLiveWpm: true,
  showLiveAccuracy: true,
  showKeyboard: true,
  showMistakes: true,
  showTimer: true,
  showCursorTrail: true,
  showHints: false
};

const INITIAL_USER_STATS: UserStats = {
  totalTestsCompleted: 0,
  totalTimeSpentSeconds: 0,
  highestWpm: 0,
  averageWpm: 0,
  averageAccuracy: 100,
  currentStreakDays: 1,
  lastPracticeDate: new Date().toISOString().split('T')[0],
  history: [],
  unlockedBadges: []
};

export default function App() {
  // Settings & Storage State
  const [settings, setSettings] = useState<TestSettings>(() => {
    const saved = localStorage.getItem('nepali_typing_settings');
    if (saved) {
      try { return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }; } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('nepali_typing_user_stats');
    if (saved) {
      try { return { ...INITIAL_USER_STATS, ...JSON.parse(saved) }; } catch (e) {}
    }
    return INITIAL_USER_STATS;
  });

  // Navigation & Modals State
  const [activeTab, setActiveTab] = useState<'test' | 'practice' | 'legal' | 'heatmap' | 'history'>('test');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showCustomParagraphModal, setShowCustomParagraphModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Active Test State
  const [activeResult, setActiveResult] = useState<TestResult | null>(null);
  const [isPersonalBest, setIsPersonalBest] = useState<boolean>(false);
  const [targetText, setTargetText] = useState<string>('');
  const [activePassageTitle, setActivePassageTitle] = useState<string | undefined>(undefined);
  
  // Realtime Key Heatmap Metrics State
  const [keyStatsMap, setKeyStatsMap] = useState<Record<string, KeyStats>>({});
  const [activeKey, setActiveKey] = useState<string | undefined>(undefined);
  const [nextHintKey, setNextHintKey] = useState<string | undefined>(undefined);

  const typingAreaRef = useRef<TypingAreaRef>(null);

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('nepali_typing_settings', JSON.stringify(settings));
  }, [settings]);

  // Synchronize Global Devanagari Font
  useEffect(() => {
    if (settings.fontFamily) {
      applyGlobalNepaliFont(settings.fontFamily);
    }
  }, [settings.fontFamily]);

  // Persist User Stats
  useEffect(() => {
    localStorage.setItem('nepali_typing_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Apply Theme Classes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast-blue');
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'high-contrast-blue') {
      root.classList.add('high-contrast-blue');
    }
  }, [settings.theme]);

  // Generate Passage Target Text based on options
  const generateTargetText = () => {
    if (settings.testType === 'custom' && settings.customText) {
      return settings.customText;
    }

    if (settings.testType === 'legal') {
      return SAMPLE_PARAGRAPHS.supreme_court_judgment;
    }

    if (settings.testType === 'quote') {
      return SAMPLE_PARAGRAPHS.general_quote;
    }

    // Word mode or Time mode randomly sampled corpus
    let sourceWords: string[] = [];
    if (settings.language === 'nepali') {
      if (settings.difficulty === 'easy') sourceWords = NEPALI_WORDS_EASY;
      else if (settings.difficulty === 'medium') sourceWords = NEPALI_WORDS_MEDIUM;
      else if (settings.difficulty === 'hard') sourceWords = NEPALI_WORDS_HARD;
      else sourceWords = NEPALI_WORDS_EXPERT;
    } else {
      if (settings.difficulty === 'easy') sourceWords = ENGLISH_WORDS_EASY;
      else sourceWords = ENGLISH_WORDS_MEDIUM;
    }

    const count = settings.testType === 'words' ? settings.wordCount : 100;
    const sampled: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIdx = Math.floor(Math.random() * sourceWords.length);
      sampled.push(sourceWords[randomIdx]);
    }
    return sampled.join(' ');
  };

  // Generate target text on mount or settings change
  useEffect(() => {
    setTargetText(generateTargetText());
    setActiveResult(null);
  }, [settings.language, settings.testType, settings.difficulty, settings.wordCount, settings.durationSeconds, settings.customText]);

  const updateSettings = (partial: Partial<TestSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  // Record Keypress Metrics
  const handleKeypressMetric = (key: string, isCorrect: boolean, latencyMs: number) => {
    setActiveKey(key);
    setTimeout(() => setActiveKey(undefined), 100);

    setKeyStatsMap(prev => {
      const current = prev[key] || { key, label: key.toUpperCase(), totalHits: 0, correctHits: 0, mistakes: 0, totalTimeMs: 0 };
      return {
        ...prev,
        [key]: {
          ...current,
          totalHits: current.totalHits + 1,
          correctHits: current.correctHits + (isCorrect ? 1 : 0),
          mistakes: current.mistakes + (isCorrect ? 0 : 1),
          totalTimeMs: current.totalTimeMs + latencyMs
        }
      };
    });
  };

  // Test Complete Handler
  const handleTestComplete = (result: TestResult) => {
    setActiveResult(result);
    const newHighest = result.netWpm > userStats.highestWpm;
    setIsPersonalBest(newHighest);

    // Update stats
    setUserStats(prev => {
      const newHistory = [...prev.history, result];
      const totalTests = newHistory.length;
      const totalTime = prev.totalTimeSpentSeconds + result.elapsedSeconds;
      const highest = Math.max(prev.highestWpm, result.netWpm);
      const avgWpm = Math.round(newHistory.reduce((acc, h) => acc + h.netWpm, 0) / totalTests);
      const avgAcc = Math.round(newHistory.reduce((acc, h) => acc + h.accuracy, 0) / totalTests);

      // Streak calculation
      const today = new Date().toISOString().split('T')[0];
      let streak = prev.currentStreakDays;
      if (prev.lastPracticeDate !== today) {
        streak += 1;
      }

      return {
        totalTestsCompleted: totalTests,
        totalTimeSpentSeconds: totalTime,
        highestWpm: highest,
        averageWpm: avgWpm,
        averageAccuracy: avgAcc,
        currentStreakDays: streak,
        lastPracticeDate: today,
        history: newHistory,
        unlockedBadges: prev.unlockedBadges
      };
    });
  };

  const handleRestartTest = () => {
    setTargetText(generateTargetText());
    setActiveResult(null);
    typingAreaRef.current?.focusInput();
  };

  const handleLaunchTargetedPractice = (items: string[]) => {
    const practiceText = items.join(' ');
    updateSettings({ testType: 'custom', customText: practiceText });
    setActiveTab('test');
    setActiveResult(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  const handleNextHintKeyChange = useCallback((key: string | undefined) => {
    setNextHintKey(prev => (prev === key ? prev : key));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors">
      
      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        updateSettings={updateSettings}
        userStats={userStats}
        onOpenSettings={() => setShowSettingsModal(true)}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeTab === 'test' && (
          <div className="space-y-6">
            
            {/* Live Stats Bar */}
            <LiveStatsBar
              grossWpm={activeResult ? activeResult.grossWpm : 0}
              netWpm={activeResult ? activeResult.netWpm : 0}
              accuracy={activeResult ? activeResult.accuracy : 100}
              elapsedSeconds={0}
              remainingSeconds={settings.testType === 'time' ? settings.durationSeconds : null}
              totalWords={targetText.trim().split(/\s+/).length}
              completedWordsCount={0}
              mistakesCount={0}
              backspacesCount={0}
              settings={settings}
            />

            {/* Test Result Screen OR Interactive Typing Area */}
            {activeResult ? (
              <ResultModal
                result={activeResult}
                onRetry={handleRestartTest}
                onNewTest={() => {
                  setActiveResult(null);
                  setTargetText(generateTargetText());
                }}
                onLaunchTargetedPractice={handleLaunchTargetedPractice}
                isPersonalBest={isPersonalBest}
              />
            ) : (
              <TypingArea
                ref={typingAreaRef}
                settings={settings}
                updateSettings={updateSettings}
                targetText={targetText}
                passageTitle={activePassageTitle}
                onTestComplete={handleTestComplete}
                onRestartTest={handleRestartTest}
                onOpenCustomParagraph={() => setShowCustomParagraphModal(true)}
                onKeypressMetric={handleKeypressMetric}
                onNextHintKeyChange={handleNextHintKeyChange}
              />
            )}

            {/* Interactive On-Screen Keyboard Heatmap */}
            {settings.showKeyboard && (
              <OnScreenKeyboard
                keyStatsMap={keyStatsMap}
                activeKey={activeKey}
                nextHintKey={nextHintKey}
                showHints={settings.showHints}
              />
            )}

          </div>
        )}

        {activeTab === 'practice' && (
          <PracticeMode
            settings={settings}
            onLaunchPracticeSession={handleLaunchTargetedPractice}
          />
        )}

        {activeTab === 'legal' && (
          <LegalPackView
            onStartLegalTest={(passageText, passageTitle) => {
              setActivePassageTitle(passageTitle);
              updateSettings({ testType: 'custom', customText: passageText });
              setActiveTab('test');
              setActiveResult(null);
            }}
          />
        )}

        {activeTab === 'heatmap' && (
          <div className="space-y-8">
            <ErrorAnalysisView
              history={userStats.history}
              onStartTargetedPractice={handleLaunchTargetedPractice}
            />
            <OnScreenKeyboard
              keyStatsMap={keyStatsMap}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <HistoryAnalytics
            userStats={userStats}
            onClearHistory={() => {
              setUserStats(INITIAL_USER_STATS);
              localStorage.removeItem('nepali_typing_user_stats');
            }}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            <strong>Nepali Typing Pro</strong> • Intelligent Romanized Unicode Engine & Speed Trainer
          </span>
          <span className="flex items-center gap-3">
            <span>Press <kbd className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-300 dark:border-slate-700">Ctrl + Space</kbd> to toggle Language</span>
            <span>•</span>
            <span>Offline Ready</span>
          </span>
        </div>
      </footer>

      {/* Modals */}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          updateSettings={updateSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showCustomParagraphModal && (
        <CustomParagraphModal
          onStartCustomTest={(text) => {
            setActivePassageTitle('Custom Practice Paragraph');
            updateSettings({ testType: 'custom', customText: text });
            setActiveTab('test');
            setActiveResult(null);
          }}
          onClose={() => setShowCustomParagraphModal(false)}
        />
      )}

    </div>
  );
}
