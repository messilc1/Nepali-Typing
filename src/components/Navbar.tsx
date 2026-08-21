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
  X,
  GraduationCap,
  Gamepad2
} from 'lucide-react';
import { NavigationTab, TestSettings, UserStats } from '../types';
import { FontSelector } from './FontSelector';
import { ThemeSelector } from './ThemeSelector';
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
    <header id="main-navbar" className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Row: Brand + Right Controls */}
        <div className="flex items-center justify-between h-16 gap-3 w-full">
          
          {/* Logo & Brand Title */}
          <div
            id="navbar-brand-logo"
            className="flex items-center gap-3 cursor-pointer shrink-0 select-none"
            onClick={() => handleTabClick('test')}
          >
            <BrandLogo size={36} />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  Nepali Typing Pro
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  Unicode
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
                Professional Devanagari & English Examination Platform
              </p>
            </div>
          </div>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            
            {/* Streak Counter */}
            <div
              id="navbar-streak-badge"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-lg text-amber-700 dark:text-amber-400 font-semibold text-xs whitespace-nowrap"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{userStats.currentStreakDays}d streak</span>
            </div>

            {/* Theme Selector Component */}
            <div className="shrink-0">
              <ThemeSelector
                currentTheme={settings.theme}
                onSelectTheme={(theme) => updateSettings({ theme })}
                compact={true}
              />
            </div>

            {/* Font Selector Dropdown */}
            <div className="shrink-0 max-w-[130px] sm:max-w-none hidden sm:block">
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
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>
                {settings.language === 'nepali' ? 'Nepali' : 'English'}
              </span>
            </button>

            {/* Sound Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={toggleSound}
              title={settings.sound !== 'none' ? 'Mute key click sounds' : 'Enable key click sounds'}
              className="p-1.5 h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
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
              className="hidden sm:flex p-1.5 h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors items-center justify-center shrink-0 cursor-pointer shadow-2xs"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Settings Gear */}
            <button
              id="btn-open-settings"
              onClick={onOpenSettings}
              title="Settings"
              className="p-1.5 h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="Toggle Menu"
              className="md:hidden p-1.5 h-8 w-8 sm:h-9 sm:w-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-2xs"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-blue-600" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Primary Navigation Tabs (Desktop / Tablet Clean Horizontal Bar) */}
        <div className="hidden md:flex items-center justify-center py-2 border-t border-slate-100 dark:border-slate-800/80 w-full">
          <nav className="flex items-center justify-center flex-wrap gap-1 p-1 bg-slate-100/70 dark:bg-slate-800/60 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            
            <button
              id="nav-tab-test"
              onClick={() => handleTabClick('test')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'test'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Nepali Typing</span>
            </button>

            <button
              id="nav-tab-english"
              onClick={() => handleTabClick('english')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'english'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>English Typing</span>
            </button>

            <button
              id="nav-tab-arena"
              onClick={() => handleTabClick('arena')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'arena'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Typing Arena</span>
            </button>

            <button
              id="nav-tab-practice"
              onClick={() => handleTabClick('practice')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'practice'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Practice Mode</span>
            </button>

            <button
              id="nav-tab-improvement"
              onClick={() => handleTabClick('improvement')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'improvement'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Improvement</span>
            </button>

            <button
              id="nav-tab-legal"
              onClick={() => handleTabClick('legal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'legal'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Legal Pack</span>
              <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium px-1.5 py-0.2 rounded">
                Lok Sewa
              </span>
            </button>

            <button
              id="nav-tab-analytics"
              onClick={() => handleTabClick('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>

            <button
              id="nav-tab-certification"
              onClick={() => handleTabClick('certification')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'certification'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Certification Test</span>
            </button>

            <button
              id="nav-tab-about"
              onClick={() => handleTabClick('about')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'about'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About</span>
            </button>

          </nav>
        </div>

        {/* Mobile Dropdown Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 space-y-2 animate-fadeIn w-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              <button
                onClick={() => handleTabClick('test')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'test'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Keyboard className="w-4 h-4 text-blue-500" />
                <span>Nepali Typing</span>
              </button>

              <button
                onClick={() => handleTabClick('english')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'english'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>English Typing</span>
              </button>

              <button
                onClick={() => handleTabClick('arena')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'arena'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-indigo-500" />
                <span>Typing Arena</span>
              </button>

              <button
                onClick={() => handleTabClick('practice')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'practice'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Practice Mode</span>
              </button>

              <button
                onClick={() => handleTabClick('improvement')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'improvement'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Improvement</span>
              </button>

              <button
                onClick={() => handleTabClick('legal')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'legal'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Scale className="w-4 h-4 text-slate-500" />
                <span>Legal Pack</span>
              </button>

              <button
                onClick={() => handleTabClick('analytics')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'analytics'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => handleTabClick('certification')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'certification'
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>Certification</span>
              </button>

              <button
                onClick={() => handleTabClick('about')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                  activeTab === 'about'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Info className="w-4 h-4 text-blue-500" />
                <span>About</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
