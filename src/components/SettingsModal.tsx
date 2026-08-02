import React from 'react';
import { X, Volume2, Type, Eye, Palette, Check } from 'lucide-react';
import { TestSettings } from '../types';

interface SettingsModalProps {
  settings: TestSettings;
  updateSettings: (partial: Partial<TestSettings>) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  updateSettings,
  onClose
}) => {
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

        {/* Font Family */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-blue-600" /> Font Family
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Mukta', 'Noto Sans Devanagari', 'Plus Jakarta Sans'] as const).map(f => (
              <button
                key={f}
                onClick={() => updateSettings({ fontFamily: f })}
                className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  settings.fontFamily === f
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

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

        {/* Done button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all"
          >
            Save Preferences
          </button>
        </div>

      </div>
    </div>
  );
};
