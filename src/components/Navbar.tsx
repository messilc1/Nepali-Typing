import React from 'react';
import {
  Keyboard,
  BookOpen,
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
import { TestSettings, UserStats } from '../types';
import { FontSelector } from './FontSelector';

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
    <header id="main-navbar" className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] py-2 gap-3 flex-wrap md:flex-nowrap">
          
          {/* Logo & Brand Title */}
          <div
            id="navbar-brand-logo"
            className="flex items-center gap-3 cursor-pointer shrink-0 select-none py-1"
            onClick={() => setActiveTab('test')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Keyboard className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 leading-none">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent whitespace-nowrap">
                  Nepali Typing Pro
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                  Unicode
                </span>
              </div>
              <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400 font-medium hidden sm:block whitespace-nowrap mt-0.5">
                Romanized Nepali & English Speed Engine
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shrink-0">
            <button
              id="nav-tab-test"
              onClick={() => setActiveTab('test')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'legal'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Scale className="w-4 h-4 text-indigo-500" />
              <span>Legal Pack</span>
              <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                Lok Sewa
              </span>
            </button>

            <button
              id="nav-tab-heatmap"
              onClick={() => setActiveTab('heatmap')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Right Controls & Speed Engine Switchers */}
          <div className="flex items-center gap-2 shrink-0 ml-auto md:ml-0">
            
            {/* Streak Counter */}
            <div
              id="navbar-streak-badge"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-700 dark:text-amber-400 font-extrabold text-xs whitespace-nowrap shrink-0"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{userStats.currentStreakDays}d Streak</span>
            </div>

            {/* Font Selector Dropdown */}
            <div className="shrink-0">
              <FontSelector
                currentFont={settings.fontFamily}
                onSelectFont={(fontId) => updateSettings({ fontFamily: fontId })}
                variant="navbar"
              />
            </div>

            {/* Language Switcher Pill */}
            <button
              id="btn-language-toggle"
              onClick={toggleLanguage}
              title="Press Ctrl + Space to toggle language"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {settings.language === 'nepali' ? '🇳🇵 Nepali Unicode' : '🇬🇧 English'}
              </span>
              <kbd className="hidden xl:inline-block text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-700 font-mono text-slate-500">
                Ctrl+Space
              </kbd>
            </button>

            {/* Sound Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={toggleSound}
              title={settings.sound !== 'none' ? 'Mute key click sounds' : 'Enable key click sounds'}
              className="p-2 h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
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
              className="hidden sm:flex p-2 h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors items-center justify-center shrink-0 cursor-pointer"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Settings Gear */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              title="Settings"
              className="p-2 h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

          </div>

        </div>

        {/* Medium and Small Nav Row (Below lg screens) */}
        <div className="flex lg:hidden items-center justify-start gap-1 py-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('test')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'test'
                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Typing Test</span>
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practice Mode</span>
          </button>
          <button
            onClick={() => setActiveTab('legal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'legal'
                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-indigo-500" />
            <span>Legal Pack</span>
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'heatmap'
                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Heatmap & Errors</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>

      </div>
    </header>
  );
};
