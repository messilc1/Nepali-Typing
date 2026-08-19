import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, RotateCcw, Sparkles, Award, Scale, RefreshCw, Play, Filter, Keyboard as KeyboardIcon, ArrowLeft } from 'lucide-react';
import { PRACTICE_MODULES, LEGAL_TERMS_PACK } from '../data/wordPacks';
import { TestSettings, LegalTerm } from '../types';
import { transliterateWordRuleBased } from '../utils/nepaliTransliteration';
import { validateStrictKeystroke, getNextExpectedKey } from '../utils/strictTypingEngine';
import { playKeypressSound, playErrorSound } from '../utils/soundEffects';
import { NepaliRomanizedKeyboardDiagram } from './NepaliRomanizedKeyboardDiagram';

interface PracticeModeProps {
  settings: TestSettings;
  onLaunchPracticeSession: (items: string[]) => void;
  onBack?: () => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  settings,
  onLaunchPracticeSession,
  onBack
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('vowels');
  const [selectedLegalCat, setSelectedLegalCat] = useState<string>('All');
  
  // Interactive Drill State
  const [typedInput, setTypedInput] = useState<string>('');
  const [romanBuffer, setRomanBuffer] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [activeItems, setActiveItems] = useState<string[]>([]);
  const [inputShake, setInputShake] = useState<boolean>(false);
  const [rejectedKeyInfo, setRejectedKeyInfo] = useState<{ key: string; expected: string } | null>(null);

  // Legal Vocabulary filter
  const legalCategories = ['All', 'Constitution', 'Court & Judiciary', 'Civil & Criminal', 'Government & Admin'];

  useEffect(() => {
    if (inputShake) {
      const timer = setTimeout(() => setInputShake(false), 250);
      return () => clearTimeout(timer);
    }
  }, [inputShake]);

  useEffect(() => {
    if (rejectedKeyInfo) {
      const timer = setTimeout(() => setRejectedKeyInfo(null), 1200);
      return () => clearTimeout(timer);
    }
  }, [rejectedKeyInfo]);

  useEffect(() => {
    const activeModule = PRACTICE_MODULES.find(m => m.id === selectedModuleId) || PRACTICE_MODULES[0];
    if (selectedModuleId === 'legal') {
      const filtered = LEGAL_TERMS_PACK.filter(t => selectedLegalCat === 'All' || t.category === selectedLegalCat);
      setActiveItems(filtered.map(t => t.devanagari));
    } else {
      setActiveItems(activeModule.items);
    }
    setCurrentIndex(0);
    setTypedInput('');
    setRomanBuffer('');
  }, [selectedModuleId, selectedLegalCat]);

  const activeModule = PRACTICE_MODULES.find(m => m.id === selectedModuleId) || PRACTICE_MODULES[0];
  const currentItem = activeItems[currentIndex] || activeItems[0] || 'नेपाल';

  const currentLegalInfo: LegalTerm | undefined = selectedModuleId === 'legal'
    ? LEGAL_TERMS_PACK.find(t => t.devanagari === currentItem)
    : undefined;

  const handleShuffleItems = () => {
    const shuffled = [...activeItems].sort(() => Math.random() - 0.5);
    setActiveItems(shuffled);
    setCurrentIndex(0);
    setTypedInput('');
    setRomanBuffer('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentBuf = settings.language === 'nepali' ? romanBuffer : typedInput;

    if (e.key === 'Backspace') {
      if (settings.language === 'nepali') {
        if (romanBuffer.length > 0) {
          const newBuf = romanBuffer.slice(0, -1);
          setRomanBuffer(newBuf);
          setTypedInput(transliterateWordRuleBased(newBuf));
        }
      } else {
        setTypedInput(prev => prev.slice(0, -1));
      }
      playKeypressSound(settings.sound, settings.soundVolume);
      setRejectedKeyInfo(null);
      return;
    }

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const validation = validateStrictKeystroke({
        targetWord: currentItem,
        currentBuffer: currentBuf,
        currentConverted: typedInput,
        pressedKey: ' ',
        language: settings.language,
        isLastWord: false
      });

      if (!validation.isValid) {
        playErrorSound(settings.soundVolume);
        setMistakesCount(prev => prev + 1);
        setInputShake(true);
        setRejectedKeyInfo({
          key: 'Space',
          expected: validation.expectedKey === ' ' ? 'Space' : validation.expectedKey
        });
        return;
      }

      playKeypressSound(settings.sound, settings.soundVolume);
      setCompletedCount(prev => prev + 1);
      const nextIdx = (currentIndex + 1) % activeItems.length;
      setCurrentIndex(nextIdx);
      setTypedInput('');
      setRomanBuffer('');
      setRejectedKeyInfo(null);
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const validation = validateStrictKeystroke({
        targetWord: currentItem,
        currentBuffer: currentBuf,
        currentConverted: typedInput,
        pressedKey: e.key,
        language: settings.language,
        isLastWord: false
      });

      if (!validation.isValid) {
        playErrorSound(settings.soundVolume);
        setMistakesCount(prev => prev + 1);
        setInputShake(true);
        setRejectedKeyInfo({
          key: e.key,
          expected: validation.expectedKey === ' ' ? 'Space' : validation.expectedKey
        });
        return;
      }

      playKeypressSound(settings.sound, settings.soundVolume);
      setRejectedKeyInfo(null);

      if (settings.language === 'nepali') {
        setRomanBuffer(validation.newBuffer);
        setTypedInput(validation.newConverted);
      } else {
        setTypedInput(validation.newBuffer);
      }

      if (validation.isWordComplete || validation.newConverted === currentItem) {
        setCompletedCount(prev => prev + 1);
        const nextIdx = (currentIndex + 1) % activeItems.length;
        setCurrentIndex(nextIdx);
        setTypedInput('');
        setRomanBuffer('');
      }
    }
  };

  return (
    <div id="practice-mode-view" className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Module Selector Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        {onBack && (
          <div className="pb-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer border border-slate-200 dark:border-slate-600 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Typing Engine</span>
            </button>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Interactive Devanagari & Legal Practice Drills
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Practice vowels, consonants, matras, complex conjuncts (संयुक्त वर्ण), or legal vocabulary drills
              </p>
            </div>
          </div>

          <button
            onClick={() => onLaunchPracticeSession(activeItems)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all self-stretch sm:self-auto justify-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Test with Active Items ({activeItems.length})</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PRACTICE_MODULES.map(mod => (
            <button
              key={mod.id}
              onClick={() => {
                setSelectedModuleId(mod.id);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedModuleId === mod.id
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-extrabold text-xs sm:text-sm leading-snug">{mod.nepaliTitle}</div>
              <div className={`text-[10px] mt-1 ${selectedModuleId === mod.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {mod.id === 'legal' ? `${LEGAL_TERMS_PACK.length} legal words` : `${mod.items.length} items`}
              </div>
            </button>
          ))}
        </div>

        {/* Legal Category Sub-filter (when Legal Vocabulary is selected) */}
        {selectedModuleId === 'legal' && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-2">
              <Scale className="w-4 h-4 text-amber-500" />
              <span>Legal Vocabulary Category:</span>
            </span>
            {legalCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedLegalCat(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedLegalCat === cat
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Drill Practice Card */}
      <div className={`bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border-2 transition-all shadow-lg text-center flex flex-col items-center justify-center relative overflow-hidden ${
        inputShake
          ? 'border-rose-500 ring-4 ring-rose-500/20'
          : 'border-blue-200 dark:border-blue-900/60'
      }`}>
        {/* Floating Rejected Key Notification */}
        {rejectedKeyInfo && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/90 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 shadow-md animate-bounce">
            <span>Rejected: <strong className="font-mono text-rose-950 dark:text-rose-100 uppercase">{rejectedKeyInfo.key}</strong></span>
            <span className="text-slate-400 dark:text-slate-600">|</span>
            <span>Expected:</span>
            <kbd className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase shadow-xs">
              {rejectedKeyInfo.expected}
            </kbd>
          </div>
        )}
        
        <div className="flex items-center justify-between w-full max-w-md mb-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {activeModule.title} • Item {currentIndex + 1} of {activeItems.length}
          </div>

          <button
            onClick={handleShuffleItems}
            className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Shuffle items"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>

        {/* Current Big Devanagari Character / Word */}
        <div
          className="text-6xl sm:text-8xl font-black text-slate-900 dark:text-slate-100 my-6 tracking-wide drop-shadow-sm nepali-font-apply"
          style={{ fontFamily: 'var(--app-nepali-font)' }}
        >
          {currentItem}
        </div>

        {/* Legal Term Additional Details (If practicing legal words) */}
        {currentLegalInfo && (
          <div className="mb-4 max-w-md p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center">
            <div className="text-xs font-extrabold text-amber-800 dark:text-amber-300">
              {currentLegalInfo.englishMeaning}
            </div>
            <div className="text-[11px] font-mono text-amber-700 dark:text-amber-400 mt-0.5">
              Romanized: {currentLegalInfo.romanized}
            </div>
          </div>
        )}

        {/* Live Typing Input Display */}
        <div className="w-full max-w-md my-2">
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

      </div>

      {/* Item List Quick Reference Grid */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            Current Module Items ({activeItems.length})
          </h4>
          <span className="text-xs text-slate-400">Click any item to jump directly</span>
        </div>

        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
          {activeItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setTypedInput('');
                setRomanBuffer('');
              }}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold border transition-all nepali-font-apply ${
                currentIndex === idx
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
              style={{ fontFamily: 'var(--app-nepali-font)' }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Official Nepali Romanized Unicode Keyboard Layout Reference Diagram */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <KeyboardIcon className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Official Nepali Unicode Keyboard Layout (Romanized)
          </h3>
        </div>
        <NepaliRomanizedKeyboardDiagram />
      </div>

    </div>
  );
};
