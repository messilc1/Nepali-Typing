import React from 'react';
import {
  Keyboard,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  Flame,
  Volume2,
  VolumeX,
  Scale,
  Globe,
  Sparkles,
  Maximize,
  Minimize
} from 'lucide-react';
import { LanguageMode, TestSettings, UserStats } from '../types';

interface NavbarProps {
  activeTab: 'test' | 'practice' | 'legal' | 'heatmap' | 'history';
  setActiveTab: (tab: 'test' | 'practice' | 'legal' | 'heatmap' | 'history') => void;
  settings: TestSettings;
  updateSettings: (partial: Partial<TestSettings>) => void;
  userStats: UserStats;
  onOpenSettings: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  settings,
  updateSettings,
  userStats,
  onOpenSettings,
  isFullscreen,
  toggleFullscreen
}) => {
  const toggleLanguage = () => {
    updateSettings({
      language: settings.language === 'nepali' ? 'english' : 'nepali'
    });
  };

  const toggleSound = () => {
    updateSettings({
      sound: settings.sound === 'none' ? 'click' : 'none'
    });
  };

  return (
    <header id="main-navbar" className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('test')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  Nepali Typing Pro
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Unicode
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Romanized Nepali & English Speed Engine
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <button
              id="nav-tab-test"
              onClick={() => setActiveTab('test')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'test'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Typing Test</span>
            </button>

            <button
              id="nav-tab-practice"
              onClick={() => setActiveTab('practice')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'practice'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Practice Mode</span>
            </button>

            <button
              id="nav-tab-legal"
              onClick={() => setActiveTab('legal')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'legal'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Scale className="w-4 h-4 text-indigo-500" />
              <span>Legal Pack</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded">
                Lok Sewa
              </span>
            </button>

            <button
              id="nav-tab-heatmap"
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'heatmap'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Heatmap & Errors</span>
            </button>

            <button
              id="nav-tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Right Controls & Actions */}
          <div className="flex items-center gap-2">
            
            {/* Streak Counter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-700 dark:text-amber-400 font-bold text-xs">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{userStats.currentStreakDays}d Streak</span>
            </div>

            {/* Language Switcher Pill */}
            <button
              id="btn-language-toggle"
              onClick={toggleLanguage}
              title="Press Ctrl + Space to toggle language"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {settings.language === 'nepali' ? '🇳🇵 Nepali Unicode' : '🇬🇧 English'}
              </span>
              <kbd className="hidden lg:inline-block text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-700 font-mono text-slate-500">
                Ctrl+Space
              </kbd>
            </button>

            {/* Sound Mute Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={toggleSound}
              title={settings.sound !== 'none' ? 'Mute key click sounds' : 'Enable key click sounds'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {settings.sound !== 'none' ? (
                <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              id="btn-fullscreen-toggle"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="hidden sm:flex p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Settings Gear */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              title="Settings"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('test')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'test' ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Test
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'practice' ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Practice
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'legal' ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Legal
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'heatmap' ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Heatmap
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-lg ${activeTab === 'history' ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Analytics
          </button>
        </div>

      </div>
    </header>
  );
};
