import React, { useState } from 'react';
import {
  X,
  Palette,
  Volume2,
  Keyboard,
  Globe,
  Sliders,
  BarChart3,
  Trash2,
  AlertTriangle,
  Check,
  Eye,
  Type,
  ShieldCheck,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { TestSettings, LanguageMode, DifficultyLevel } from '../types';
import { FontSelector } from './FontSelector';

interface SettingsModalProps {
  settings: TestSettings;
  updateSettings: (partial: Partial<TestSettings>) => void;
  onResetAnalytics?: () => void;
  onClose: () => void;
}

type SettingsTab = 'appearance' | 'typing' | 'language' | 'test' | 'data';

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  updateSettings,
  onResetAnalytics,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const handleConfirmReset = () => {
    onResetAnalytics?.();
    setShowConfirmReset(false);
  };

  return (
    <div
      id="app-settings-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                Preferences & Settings
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Customize appearance, typing engine rules, audio, and evaluation standards
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Split View: Left Sidebar Tabs + Right Content Area */}
        <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-hidden">
          
          {/* Sidebar / Tabs */}
          <div className="sm:w-48 sm:border-r border-b sm:border-b-0 border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-950/30 p-2 sm:p-3 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer whitespace-nowrap ${
                activeTab === 'appearance'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4 shrink-0" />
              <span>Appearance</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('typing')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer whitespace-nowrap ${
                activeTab === 'typing'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-4 h-4 shrink-0" />
              <span>Typing</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('language')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer whitespace-nowrap ${
                activeTab === 'language'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span>Language</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('test')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer whitespace-nowrap ${
                activeTab === 'test'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Test Preferences</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer whitespace-nowrap ${
                activeTab === 'data'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Data & Analytics</span>
            </button>
          </div>

          {/* Right Panel: Content Area */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-6">
            
            {/* 1. APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Theme Palette */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      { id: 'white-blue', label: 'White & Blue', desc: 'Clean, light, high-focus' },
                      { id: 'dark', label: 'Dark Mode', desc: 'Night mode, deep slate' },
                      { id: 'high-contrast-blue', label: 'High Contrast', desc: 'Maximum contrast' }
                    ].map(thm => (
                      <button
                        key={thm.id}
                        type="button"
                        onClick={() => updateSettings({ theme: thm.id as any })}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          settings.theme === thm.id
                            ? 'bg-blue-50/70 dark:bg-blue-950/50 border-blue-600 text-blue-900 dark:text-blue-200'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">{thm.label}</span>
                          {settings.theme === thm.id && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                        </div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">{thm.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Nepali Typography / Font Family
                  </label>
                  <FontSelector
                    currentFont={settings.fontFamily}
                    onSelectFont={(fontId) => updateSettings({ fontFamily: fontId })}
                    variant="settings"
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Typing Text Size
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => updateSettings({ fontSize: sz })}
                        className={`py-2 rounded-lg border text-xs font-bold uppercase transition-all text-center cursor-pointer ${
                          settings.fontSize === sz
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Line Spacing */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Line Height & Spacing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['normal', 'relaxed', 'loose'] as const).map(sp => (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => updateSettings({ lineSpacing: sp })}
                        className={`py-2 rounded-lg border text-xs font-bold capitalize transition-all text-center cursor-pointer ${
                          settings.lineSpacing === sp
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Area Size */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Typing Area Container Height
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['compact', 'standard', 'spacious'] as const).map(sz => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => updateSettings({ textAreaSize: sz })}
                        className={`py-2 rounded-lg border text-xs font-bold capitalize transition-all text-center cursor-pointer ${
                          settings.textAreaSize === sz
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. TYPING TAB */}
            {activeTab === 'typing' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Audio Feedback & Volume */}
                <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-blue-600" />
                    <span>Keystroke Audio Feedback</span>
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['none', 'click', 'mechanical', 'typewriter'] as const).map(snd => (
                      <button
                        key={snd}
                        type="button"
                        onClick={() => updateSettings({ sound: snd })}
                        className={`py-2 rounded-lg border text-xs font-bold capitalize transition-all text-center cursor-pointer ${
                          settings.sound === snd
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {snd}
                      </button>
                    ))}
                  </div>

                  {settings.sound !== 'none' && (
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs text-slate-500 font-medium shrink-0">Volume:</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={settings.soundVolume ?? 0.5}
                        onChange={(e) => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                        className="w-full accent-blue-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-10 text-right">
                        {Math.round((settings.soundVolume ?? 0.5) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Mistake Rules & Backspace */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">
                      Mistake Enforcement Mode
                    </label>
                    <select
                      value={settings.mistakeMode || 'strict'}
                      onChange={(e) => updateSettings({ mistakeMode: e.target.value as any })}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="strict">Strict (Must correct error to advance)</option>
                      <option value="allow">Allow (Record error and proceed)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 block">
                      Backspace Key
                    </label>
                    <select
                      value={settings.backspaceEnabled !== false ? 'yes' : 'no'}
                      onChange={(e) => updateSettings({ backspaceEnabled: e.target.value === 'yes' })}
                      className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <option value="yes">Enabled (Can delete & correct)</option>
                      <option value="no">Disabled (Strict examination rule)</option>
                    </select>
                  </div>
                </div>

                {/* Display Toggles */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>In-Session Visual Indicators</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'showHints', label: 'Romanized Key Sequence Hints' },
                      { key: 'showLiveWpm', label: 'Live WPM Counter' },
                      { key: 'showLiveAccuracy', label: 'Live Accuracy Percentage' },
                      { key: 'showKeyboard', label: 'Virtual Keyboard & Finger Map' },
                      { key: 'showMistakes', label: 'Live Mistake Counter' },
                      { key: 'showTimer', label: 'Live Session Timer' }
                    ].map(item => (
                      <label
                        key={item.key}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-slate-400"
                      >
                        <span>{item.label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean((settings as any)[item.key])}
                          onChange={(e) => updateSettings({ [item.key]: e.target.checked })}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. LANGUAGE TAB */}
            {activeTab === 'language' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Default Typing Language
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => updateSettings({ language: 'nepali' })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.language === 'nepali'
                          ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-blue-200 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-sm">🇳🇵 Nepali Unicode</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Phonetic Romanized transliteration into standard Devanagari Unicode.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => updateSettings({ language: 'english' })}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        settings.language === 'english'
                          ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-blue-200 shadow-2xs'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-sm">🇬🇧 English QWERTY</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Standard touch typing with 7-level progressive mastery and speed sprints.
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <span className="font-bold block">💡 Unicode Romanized Engine Information:</span>
                  <p className="text-blue-700/80 dark:text-blue-300/80 leading-relaxed text-[11px]">
                    Nepali Typing Pro provides instant multi-character buffer matching, half-letter conjunct resolution (e.g. <code>k + H = ख्</code>, <code>s + M + y = स्य</code>), and Lok Sewa formatting compliance.
                  </p>
                </div>
              </div>
            )}

            {/* 4. TEST PREFERENCES TAB */}
            {activeTab === 'test' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Default Duration */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Default Session Timer
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '30s', val: 30 },
                      { label: '1 min', val: 60 },
                      { label: '2 min', val: 120 },
                      { label: '5 min', val: 300 }
                    ].map(tm => (
                      <button
                        key={tm.val}
                        type="button"
                        onClick={() => updateSettings({ durationSeconds: tm.val, noTimeLimit: false })}
                        className={`py-2 rounded-lg border text-xs font-bold transition-all text-center cursor-pointer ${
                          !settings.noTimeLimit && settings.durationSeconds === tm.val
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {tm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Word Count */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Default Word Target
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[50, 100, 200, 300].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => updateSettings({ wordCount: cnt })}
                        className={`py-2 rounded-lg border text-xs font-bold transition-all text-center cursor-pointer ${
                          settings.wordCount === cnt
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {cnt} words
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Vocabulary Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as const).map(dif => (
                      <button
                        key={dif}
                        type="button"
                        onClick={() => updateSettings({ difficulty: dif })}
                        className={`py-2 rounded-lg border text-xs font-bold uppercase transition-all text-center cursor-pointer ${
                          settings.difficulty === dif
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        {dif}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. DATA & ANALYTICS TAB */}
            {activeTab === 'data' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Analytics & Data Logging
                  </label>

                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-200">
                      <div>
                        <span className="font-bold block">Record Analytics History</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Save test WPM, accuracy, and mistake graphs</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.recordAnalytics !== false}
                        onChange={(e) => updateSettings({ recordAnalytics: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-200">
                      <div>
                        <span className="font-bold block">Log Individual Character Mistakes</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Enables AI engine to generate custom error drills</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.recordMistakes !== false}
                        onChange={(e) => updateSettings({ recordMistakes: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Danger Zone */}
                {onResetAnalytics && (
                  <div className="pt-4 border-t border-rose-100 dark:border-rose-950/80 space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4" />
                      <span>Clear Stored History</span>
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Permanently wipe all past typing session scores, charts, and mistyped keystroke logs.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowConfirmReset(true)}
                      className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Reset Analytics History</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save & Done</span>
          </button>
        </div>

      </div>

      {/* Confirmation Modal for Reset Analytics */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-2xl border border-rose-200 dark:border-rose-900 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                Confirm History Reset
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              This action will permanently delete all your typing history, performance records, charts, and analytics. This cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete All</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
