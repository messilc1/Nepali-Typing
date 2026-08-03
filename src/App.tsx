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
import { CertificationView } from './components/CertificationView';
import { AboutView } from './components/AboutView';
import { SettingsModal } from './components/SettingsModal';
import { CustomParagraphModal } from './components/CustomParagraphModal';

import { TestSettings, TestResult, UserStats, KeyStats, LiveStats, NavigationTab } from './types';
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

  // Navigation & Modals State - Tab Persistence Logic
  const [activeTab, setActiveTabState] = useState<NavigationTab>(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      if (['test', 'practice', 'legal', 'analytics', 'certification', 'about'].includes(hash)) {
        return hash as NavigationTab;
      }
      const saved = localStorage.getItem('nepali_typing_active_tab');
      if (saved && ['test', 'practice', 'legal', 'analytics', 'certification', 'about'].includes(saved)) {
        return saved as NavigationTab;
      }
    } catch {}
    return 'test';
  });

  const setActiveTab = useCallback((tab: NavigationTab) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('nepali_typing_active_tab', tab);
      if (window.location.hash.replace('#', '') !== tab) {
        window.history.replaceState(null, '', `#${tab}`);
      }
    } catch {}
  }, []);

  // Sync hash changes if user uses browser Back/Forward
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['test', 'practice', 'legal', 'analytics', 'certification', 'about'].includes(hash)) {
        setActiveTabState(hash as NavigationTab);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showCustomParagraphModal, setShowCustomParagraphModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Active Test State
  const [activeResult, setActiveResult] = useState<TestResult | null>(null);
  const [isPersonalBest, setIsPersonalBest] = useState<boolean>(false);
  const [targetText, setTargetText] = useState<string>('');
  const [activePassageTitle, setActivePassageTitle] = useState<string | undefined>(undefined);
  
  // Realtime Live Stats State
  const [liveStats, setLiveStats] = useState<LiveStats>({
    grossWpm: 0,
    netWpm: 0,
    accuracy: 100,
    elapsedSeconds: 0,
    remainingSeconds: settings.testType === 'time' ? settings.durationSeconds : null,
    totalWords: 0,
    completedWordsCount: 0,
    mistakesCount: 0,
    backspacesCount: 0,
    totalCharactersTyped: 0,
    correctCharacters: 0,
    wrongCharacters: 0,
    correctWords: 0,
    wrongWords: 0,
    consistency: 100
  });
  
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
      const existingIdx = prev.history.findIndex(h => h.id === result.id);
      let newHistory = [...prev.history];
      if (existingIdx >= 0) {
        newHistory[existingIdx] = result;
      } else {
        newHistory.push(result);
      }

      const totalTests = newHistory.filter(h => h.sessionStatus === 'Completed' || !h.sessionStatus).length;
      const totalTime = prev.totalTimeSpentSeconds + result.elapsedSeconds;
      const highest = Math.max(prev.highestWpm, result.netWpm);
      const avgWpm = Math.round(newHistory.reduce((acc, h) => acc + h.netWpm, 0) / (newHistory.length || 1));
      const avgAcc = Math.round(newHistory.reduce((acc, h) => acc + h.accuracy, 0) / (newHistory.length || 1));

      // Streak calculation
      const today = new Date().toISOString().split('T')[0];
      let streak = prev.currentStreakDays;
      if (prev.lastPracticeDate !== today) {
        streak += 1;
      }

      const updated: UserStats = {
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

      try {
        localStorage.setItem('nepali_typing_user_stats', JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });
  };

  // Live Session Update Handler (Realtime tracking for Analytics)
  const handleLiveSessionUpdate = useCallback((session: TestResult) => {
    setUserStats(prev => {
      const existingIdx = prev.history.findIndex(h => h.id === session.id);
      let newHistory = [...prev.history];
      if (existingIdx >= 0) {
        newHistory[existingIdx] = session;
      } else {
        newHistory.push(session);
      }

      const updated: UserStats = {
        ...prev,
        history: newHistory
      };

      try {
        localStorage.setItem('nepali_typing_user_stats', JSON.stringify(updated));
      } catch (e) {}

      return updated;
    });
  }, []);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors w-full max-w-full overflow-x-hidden">
      
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0 overflow-x-hidden">
        
        {activeTab === 'test' && (
          <div className="space-y-6">
            
            {/* Live Stats Bar */}
            <LiveStatsBar
              grossWpm={activeResult ? activeResult.grossWpm : liveStats.grossWpm}
              netWpm={activeResult ? activeResult.netWpm : liveStats.netWpm}
              accuracy={activeResult ? activeResult.accuracy : liveStats.accuracy}
              elapsedSeconds={activeResult ? activeResult.elapsedSeconds : liveStats.elapsedSeconds}
              remainingSeconds={activeResult ? null : liveStats.remainingSeconds}
              totalWords={liveStats.totalWords || targetText.trim().split(/\s+/).filter(Boolean).length}
              completedWordsCount={activeResult ? activeResult.totalWordsTyped : liveStats.completedWordsCount}
              mistakesCount={activeResult ? activeResult.mistakesCount : liveStats.mistakesCount}
              backspacesCount={activeResult ? activeResult.backspacesCount : liveStats.backspacesCount}
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
                onLiveStatsChange={setLiveStats}
                onLiveSessionUpdate={handleLiveSessionUpdate}
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

        {(activeTab === 'analytics' || (activeTab as string) === 'history' || (activeTab as string) === 'heatmap') && (
          <HistoryAnalytics
            userStats={userStats}
            keyStatsMap={keyStatsMap}
            onStartTargetedPractice={handleLaunchTargetedPractice}
            onClearHistory={() => {
              setUserStats(INITIAL_USER_STATS);
              localStorage.removeItem('nepali_typing_user_stats');
            }}
          />
        )}

        {activeTab === 'certification' && (
          <CertificationView />
        )}

        {activeTab === 'about' && (
          <AboutView onNavigateTab={setActiveTab} />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1">
              <div className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                Nepali Typing Pro
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                &copy; 2026 Nepali Typing Pro. All Rights Reserved.
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-bold">
                Created by Adv. Subhash Lamichhane
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                <a
                  href="https://subhashlamichhane.com.np/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>Website: https://subhashlamichhane.com.np/</span>
                </a>
                <span>&bull;</span>
                <a
                  href="https://www.linkedin.com/in/subhash-lamichhane/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  <span>LinkedIn: https://www.linkedin.com/in/subhash-lamichhane/</span>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 font-semibold text-slate-600 dark:text-slate-400">
              <button onClick={() => setActiveTab('test')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Typing Test</button>
              <span>&bull;</span>
              <button onClick={() => setActiveTab('practice')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Practice Mode</button>
              <span>&bull;</span>
              <button onClick={() => setActiveTab('legal')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Legal Pack</button>
              <span>&bull;</span>
              <button onClick={() => setActiveTab('analytics')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Analytics</button>
              <span>&bull;</span>
              <button onClick={() => setActiveTab('certification')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Certification</button>
              <span>&bull;</span>
              <button onClick={() => setActiveTab('about')} className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">About</button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <span>Standardized Devanagari Unicode Assessment & Certification Engine</span>
            <span className="flex items-center gap-2">
              <span>v2.5.0</span>
            </span>
          </div>
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
