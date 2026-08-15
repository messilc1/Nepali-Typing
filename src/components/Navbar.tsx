import React, { useState } from 'react';
import {
  Keyboard,
  BookOpen,
  Zap,
  BarChart3,
  Settings,
  Flame,
  Volume2,
  VolumeX,
  Scale,
  Globe,
  Maximize,
  Minimize,
  Award,
  Info,
  Menu,
  X
} from 'lucide-react';
import { NavigationTab, TestSettings, UserStats } from '../types';
import { FontSelector } from './FontSelector';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleTabClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ROW 1: Brand & Utility Controls */}
        <div className="flex items-center justify-between min-h-[4rem] py-2 gap-3 w-full">
          
          {/* Logo & Brand Title */}
          <div
            id="navbar-brand-logo"
            className="flex items-center gap-3 cursor-pointer shrink-0 select-none py-1"
            onClick={() => handleTabClick('test')}
          >
            <BrandLogo size={42} />
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-2 leading-none">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  Nepali Typing Pro
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shrink-0">
                  Unicode
                </span>
              </div>
              <p className="text-[11px] leading-snug text-slate-500 dark:text-slate-400 font-semibold hidden sm:block whitespace-nowrap mt-0.5">
                Standard Devanagari & English Typing Engine
              </p>
            </div>
          </div>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            
            {/* Streak Counter */}
            <div
              id="navbar-streak-badge"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-amber-700 dark:text-amber-400 font-extrabold text-xs whitespace-nowrap shrink-0"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{userStats.currentStreakDays}d Streak</span>
            </div>

            {/* Font Selector Dropdown */}
            <div className="shrink-0 max-w-[130px] sm:max-w-none">
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
              title="Toggle language (Nepali / English)"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs">
                {settings.language === 'nepali' ? '🇳🇵 Nepali' : '🇬🇧 English'}
              </span>
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

            {/* Mobile Hamburger Menu Button */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle Menu"
              className="md:hidden p-2 h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-blue-600" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* ROW 2: Primary Navigation Tabs (Desktop & Tablet Layout) */}
        <div className="hidden md:flex items-center justify-center py-2 border-t border-slate-200/60 dark:border-slate-800/60 w-full">
          <nav className="flex items-center justify-center flex-wrap gap-1 sm:gap-1.5 bg-slate-100/90 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 max-w-full">
            
            <button
              id="nav-tab-test"
              onClick={() => handleTabClick('test')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              onClick={() => handleTabClick('practice')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'practice'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Practice Mode</span>
            </button>

            <button
              id="nav-tab-improvement"
              onClick={() => handleTabClick('improvement')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'improvement'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Improvement</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-600 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded whitespace-nowrap">
                AI Coach
              </span>
            </button>

            <button
              id="nav-tab-legal"
              onClick={() => handleTabClick('legal')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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
              id="nav-tab-analytics"
              onClick={() => handleTabClick('analytics')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>

            <button
              id="nav-tab-certification"
              onClick={() => handleTabClick('certification')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'certification'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 border border-amber-200 dark:border-amber-800'
              }`}
            >
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>🏆 Certification Test</span>
            </button>

            <button
              id="nav-tab-about"
              onClick={() => handleTabClick('about')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>About</span>
            </button>

          </nav>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-fadeIn w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => handleTabClick('test')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeTab === 'test'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-extrabold'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Keyboard className="w-4 h-4 text-blue-500" />
                <span>Typing Test</span>
              </button>

              <button
                onClick={() => handleTabClick('practice')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeTab === 'practice'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-extrabold'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Practice Mode</span>
              </button>

              <button
                onClick={() => handleTabClick('improvement')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeTab === 'improvement'
                    ? 'bg-blue-600 text-white border-blue-600 font-extrabold'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Improvement</span>
              </button>

              <button
                onClick={() => handleTabClick('legal')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeTab === 'legal'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-extrabold'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Scale className="w-4 h-4 text-indigo-500" />
                <span>Legal Pack</span>
              </button>

              <button
                onClick={() => handleTabClick('analytics')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeTab === 'analytics'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-extrabold'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Analytics</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleTabClick('certification')}
                className={`col-span-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === 'certification'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>🏆 Certification</span>
              </button>

              <button
                onClick={() => handleTabClick('about')}
                className={`col-span-1 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  activeTab === 'about'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-extrabold'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Info className="w-4 h-4 text-blue-500" />
                <span>About</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 mt-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Daily Streak</span>
              </div>
              <span className="font-black text-xs text-amber-700 dark:text-amber-400 bg-amber-200/60 dark:bg-amber-900/60 px-2 py-0.5 rounded-full">
                {userStats.currentStreakDays} Days
              </span>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
