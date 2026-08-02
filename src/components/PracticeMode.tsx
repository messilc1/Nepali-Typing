import React, { useState } from 'react';
import { BookOpen, CheckCircle2, RotateCcw, Sparkles, Award } from 'lucide-react';
import { PRACTICE_MODULES } from '../data/wordPacks';
import { TestSettings } from '../types';
import { transliterateWordRuleBased } from '../utils/nepaliTransliteration';
import { playKeypressSound, playErrorSound } from '../utils/soundEffects';

interface PracticeModeProps {
  settings: TestSettings;
  onLaunchPracticeSession: (items: string[]) => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  settings,
  onLaunchPracticeSession
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('vowels');
  const [typedInput, setTypedInput] = useState<string>('');
  const [romanBuffer, setRomanBuffer] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  const activeModule = PRACTICE_MODULES.find(m => m.id === selectedModuleId) || PRACTICE_MODULES[0];
  const currentItem = activeModule.items[currentIndex] || activeModule.items[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (romanBuffer.length > 0) {
        const newBuf = romanBuffer.slice(0, -1);
        setRomanBuffer(newBuf);
        setTypedInput(transliterateWordRuleBased(newBuf));
      } else {
        setTypedInput(prev => prev.slice(0, -1));
      }
      playKeypressSound(settings.sound, settings.soundVolume);
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (typedInput.trim() === currentItem) {
        playKeypressSound(settings.sound, settings.soundVolume);
        setCompletedCount(prev => prev + 1);
        const nextIdx = (currentIndex + 1) % activeModule.items.length;
        setCurrentIndex(nextIdx);
        setTypedInput('');
        setRomanBuffer('');
      } else {
        playErrorSound(settings.soundVolume);
        setMistakesCount(prev => prev + 1);
      }
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      playKeypressSound(settings.sound, settings.soundVolume);
      if (settings.language === 'nepali') {
        const newBuf = romanBuffer + e.key;
        setRomanBuffer(newBuf);
        const converted = transliterateWordRuleBased(newBuf);
        setTypedInput(converted);
        
        // Auto match check
        if (converted === currentItem) {
          setCompletedCount(prev => prev + 1);
          const nextIdx = (currentIndex + 1) % activeModule.items.length;
          setCurrentIndex(nextIdx);
          setTypedInput('');
          setRomanBuffer('');
        }
      } else {
        const newTyped = typedInput + e.key;
        setTypedInput(newTyped);
        if (newTyped === currentItem) {
          setCompletedCount(prev => prev + 1);
          const nextIdx = (currentIndex + 1) % activeModule.items.length;
          setCurrentIndex(nextIdx);
          setTypedInput('');
        }
      }
    }
  };

  return (
    <div id="practice-mode-view" className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Module Selector Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Interactive Practice Drills
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a category to build muscle memory on specific vowels, consonants, matras, or legal terms
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PRACTICE_MODULES.map(mod => (
            <button
              key={mod.id}
              onClick={() => {
                setSelectedModuleId(mod.id);
                setCurrentIndex(0);
                setTypedInput('');
                setRomanBuffer('');
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedModuleId === mod.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-extrabold text-sm leading-snug">{mod.nepaliTitle}</div>
              <div className={`text-[10px] mt-1 ${selectedModuleId === mod.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {mod.items.length} items
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Drill Practice Card */}
      <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border-2 border-blue-200 dark:border-blue-900/60 shadow-lg text-center flex flex-col items-center justify-center relative overflow-hidden">
        
        <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
          {activeModule.title} • Item {currentIndex + 1} of {activeModule.items.length}
        </div>

        {/* Current Big Devanagari Character */}
        <div
          className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-slate-100 my-6 tracking-wide drop-shadow-sm nepali-font-apply"
          style={{ fontFamily: 'var(--app-nepali-font)' }}
        >
          {currentItem}
        </div>

        {/* Live Typing Input Display */}
        <div className="w-full max-w-md my-4">
          <input
            type="text"
            value={typedInput}
            onKeyDown={handleKeyDown}
            onChange={() => {}}
            placeholder="Type here..."
            autoFocus
            className="w-full px-6 py-4 text-center text-2xl font-bold rounded-2xl border-2 border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-inner nepali-font-apply"
            style={{ fontFamily: 'var(--app-nepali-font)' }}
          />

          {romanBuffer && (
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
              Romanized Buffer: <strong className="text-blue-600 dark:text-blue-400">{romanBuffer}</strong>
            </div>
          )}
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-6 mt-4 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span>Completed: <strong className="text-emerald-600 dark:text-emerald-400">{completedCount}</strong></span>
          <span>Mistakes: <strong className="text-rose-600 dark:text-rose-400">{mistakesCount}</strong></span>
        </div>

        {/* Full Module Drill Launch Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 w-full flex justify-center">
          <button
            onClick={() => onLaunchPracticeSession(activeModule.items)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Full Test with this Module</span>
          </button>
        </div>

      </div>

    </div>
  );
};
