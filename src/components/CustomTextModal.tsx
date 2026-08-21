import React from 'react';
import { X } from 'lucide-react';
import { TestSettings, LanguageMode } from '../types';
import { CustomTypingView, CustomTypingConfig } from './CustomTypingView';

interface CustomTextModalProps {
  initialLanguage?: LanguageMode;
  currentSettings: TestSettings;
  onStartCustomTest: (customText: string, updatedSettings: Partial<TestSettings>) => void;
  onClose: () => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  initialLanguage = 'nepali',
  currentSettings,
  onStartCustomTest,
  onClose
}) => {
  const handleStartCustom = (config: CustomTypingConfig) => {
    const updatedSettings: Partial<TestSettings> = {
      language: config.language,
      testType: 'custom',
      customText: config.text,
      lokSewaMode: config.lokSewaMode,
      durationSeconds: config.timeLimitSeconds ?? 0,
      noTimeLimit: config.timeLimitSeconds === null,
      wordCount: config.wordCountLimit ?? 0,
      mistakeMode: config.mistakeMode,
      backspaceEnabled: config.backspaceEnabled,
      showHints: config.showHints
    };

    onStartCustomTest(config.text, updatedSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-20 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <CustomTypingView
          initialLanguage={initialLanguage}
          initialText={currentSettings.customText || ''}
          initialWordCount={currentSettings.wordCount || null}
          initialTimeSeconds={currentSettings.noTimeLimit ? null : currentSettings.durationSeconds}
          onStartTest={handleStartCustom}
          isModalMode={true}
        />
      </div>
    </div>
  );
};
