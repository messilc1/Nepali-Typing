import React, { useState } from 'react';
import { X, Volume2, Type, Eye, Palette, Check, Trash2, AlertTriangle } from 'lucide-react';
import { TestSettings } from '../types';
import { FontSelector } from './FontSelector';

interface SettingsModalProps {
  settings: TestSettings;
  updateSettings: (partial: Partial<TestSettings>) => void;
  onResetAnalytics?: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  updateSettings,
  onResetAnalytics,
  onClose
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const handleConfirmReset = () => {
    onResetAnalytics?.();
    setShowConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Preferences & Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Font Family Selector */}
        <FontSelector
          currentFont={settings.fontFamily}
          onSelectFont={(fontId) => updateSettings({ fontFamily: fontId })}
          variant="settings"
        />

        {/* Font Size */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Font Size
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
              <button
                key={sz}
                onClick={() => updateSettings({ fontSize: sz })}
                className={`p-2.5 rounded-xl border text-xs font-bold uppercase transition-all text-center ${
                  settings.fontSize === sz
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-blue-600" /> Theme Palette
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'white-blue', name: 'White & Blue (Default)' },
              { id: 'dark', name: 'Dark Mode' },
              { id: 'high-contrast-blue', name: 'High Contrast' }
            ].map(thm => (
              <button
                key={thm.id}
                onClick={() => updateSettings({ theme: thm.id as any })}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  settings.theme === thm.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {thm.name}
              </button>
            ))}
          </div>
        </div>

        {/* Typing Sound */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-blue-600" /> Audio Feedback
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['none', 'click', 'mechanical', 'typewriter'] as const).map(snd => (
              <button
                key={snd}
                onClick={() => updateSettings({ sound: snd })}
                className={`p-2.5 rounded-xl border text-xs font-bold capitalize transition-all text-center ${
                  settings.sound === snd
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {snd}
              </button>
            ))}
          </div>
        </div>

        {/* Display Toggles */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-blue-600" /> Display Toggles
          </label>

          {[
            { key: 'showHints', label: 'Show Typing Hints (Romanized Key Sequence)' },
            { key: 'showLiveWpm', label: 'Show Live WPM Counter' },
            { key: 'showLiveAccuracy', label: 'Show Live Accuracy %' },
            { key: 'showKeyboard', label: 'Show On-Screen Keyboard Heatmap' },
            { key: 'showMistakes', label: 'Show Live Mistakes Count' },
            { key: 'showTimer', label: 'Show Live Timer / Progress' }
          ].map(item => (
            <label key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={(settings as any)[item.key]}
                onChange={(e) => updateSettings({ [item.key]: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          ))}
        </div>

        {/* Reset Analytics Danger Zone */}
        {onResetAnalytics && (
          <div className="pt-4 border-t border-rose-100 dark:border-rose-950/80">
            <label className="block text-xs font-bold uppercase tracking-wider text-rose-500 mb-2 flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-rose-500" /> Data & Analytics Management
            </label>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Reset Analytics History</span>
            </button>
          </div>
        )}

        {/* Save Preferences Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all"
          >
            Save Preferences
          </button>
        </div>

      </div>

      {/* Confirmation Modal for Reset Analytics */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 sm:p-8 rounded-3xl border border-rose-200 dark:border-rose-900 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Confirm Reset Analytics History
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              This action will permanently delete all your typing history, performance records, charts, and analytics. This cannot be undone. Are you sure you want to continue?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Reset Analytics</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
