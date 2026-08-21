import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Award,
  Scale,
  RefreshCw,
  Play,
  Filter,
  Keyboard as KeyboardIcon,
  ArrowLeft,
  Flame,
  Zap,
  Target,
  Clock,
  AlertTriangle,
  ChevronRight,
  Plus,
  Trash2,
  X,
  PlusCircle,
  Check
} from 'lucide-react';
import { NEPALI_PRACTICE_DATA, DIFFICULTY_LEVEL_TABS, NepaliPracticeCategory, NepaliPracticeSubCategory } from '../data/nepaliPracticeData';
import { LEGAL_TERMS_PACK } from '../data/wordPacks';
import { TestSettings, LegalTerm } from '../types';
import { transliterateWordRuleBased, getRomanizedHintForWord } from '../utils/nepaliTransliteration';
import { validateStrictKeystroke } from '../utils/strictTypingEngine';
import { stripInvisibleCharacters, areDevanagariWordsEquivalent, isCharacterEquivalent } from '../utils/textNormalizer';
import { playKeypressSound, playErrorSound } from '../utils/soundEffects';
import { NepaliRomanizedKeyboardDiagram } from './NepaliRomanizedKeyboardDiagram';

const STORAGE_KEY = 'nepali_practice_user_custom_items_v1';

const getStoredCustomItems = (): Record<string, string[]> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const setStoredCustomItems = (data: Record<string, string[]>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save custom items:', err);
  }
};

interface PracticeModeProps {
  settings: TestSettings;
  onLaunchPracticeSession: (items: string[]) => void;
  onBack?: () => void;
  onNavigateToImprovement?: () => void;
}

export const PracticeMode: React.FC<PracticeModeProps> = ({
  settings,
  onLaunchPracticeSession,
  onBack,
  onNavigateToImprovement
}) => {
  // Selected Category & Subcategory
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('basic-characters');
  const [selectedSubCatId, setSelectedSubCatId] = useState<string>('vowels');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  
  // Custom items persisted across categories
  const [customItemsMap, setCustomItemsMap] = useState<Record<string, string[]>>(() => getStoredCustomItems());
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [newItemsInput, setNewItemsInput] = useState<string>('');

  // Interactive Drill State
  const [typedInput, setTypedInput] = useState<string>('');
  const [romanBuffer, setRomanBuffer] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [sentenceIndex, setSentenceIndex] = useState<number>(0);
  const [wordIndexInSentence, setWordIndexInSentence] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [activeItems, setActiveItems] = useState<string[]>([]);
  const [inputShake, setInputShake] = useState<boolean>(false);
  const [rejectedKeyInfo, setRejectedKeyInfo] = useState<{ key: string; expected: string } | null>(null);
  const [mistypedKeysMap, setMistypedKeysMap] = useState<Record<string, number>>({});
  
  // Timer & Drill Analytics
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isDrillCompleted, setIsDrillCompleted] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isDrillCompleted) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isDrillCompleted]);

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

  // Load items when category, subcategory or customItemsMap changes
  useEffect(() => {
    const category = NEPALI_PRACTICE_DATA.find((c) => c.id === selectedCategoryId);
    if (!category) return;
    const subCat = category.subCategories.find((s) => s.id === selectedSubCatId) || category.subCategories[0];
    if (subCat) {
      const userAdded = customItemsMap[subCat.id] || [];
      const combinedItems = [...subCat.items, ...userAdded];
      setActiveItems(combinedItems);
      setCurrentIndex(0);
      setSentenceIndex(0);
      setWordIndexInSentence(0);
      setTypedInput('');
      setRomanBuffer('');
      setCompletedCount(0);
      setMistakesCount(0);
      setMistypedKeysMap({});
      setStartTime(null);
      setElapsedSeconds(0);
      setIsDrillCompleted(false);
      setIsAddModalOpen(false);
      setNewItemsInput('');
    }
  }, [selectedCategoryId, selectedSubCatId, customItemsMap]);

  const activeCategory = NEPALI_PRACTICE_DATA.find((c) => c.id === selectedCategoryId) || NEPALI_PRACTICE_DATA[0];
  const activeSubCategory =
    activeCategory.subCategories.find((s) => s.id === selectedSubCatId) || activeCategory.subCategories[0];

  const isSentenceCategory = activeCategory.id === 'sentence-practice';

  // Sentence-specific data
  const currentSentence = isSentenceCategory ? (activeItems[sentenceIndex] || activeItems[0] || '') : '';
  const wordsInSentence = useMemo(() => {
    if (!isSentenceCategory || !currentSentence) return [];
    return currentSentence.split(/\s+/).filter((w) => w.trim().length > 0);
  }, [isSentenceCategory, currentSentence]);

  // Total words across all sentences for accurate progress
  const totalSentenceWords = useMemo(() => {
    if (!isSentenceCategory) return activeItems.length;
    return activeItems.reduce((acc, sent) => acc + sent.split(/\s+/).filter((w) => w.trim().length > 0).length, 0);
  }, [isSentenceCategory, activeItems]);

  const currentItem = isSentenceCategory
    ? (wordsInSentence[wordIndexInSentence] || wordsInSentence[0] || activeItems[0] || 'नेपाल')
    : (activeItems[currentIndex] || activeItems[0] || 'नेपाल');

  const userCustomItemsForCurrentSubCat = useMemo(() => {
    return customItemsMap[selectedSubCatId] || [];
  }, [customItemsMap, selectedSubCatId]);

  // Derived Romanized key hint for target item (works for both built-in and user-added items)
  const currentRomanHint = useMemo(() => {
    if (activeSubCategory.romanHints && activeSubCategory.romanHints[currentItem]) {
      return activeSubCategory.romanHints[currentItem];
    }
    return getRomanizedHintForWord(currentItem);
  }, [activeSubCategory, currentItem]);

  const handleShuffleItems = () => {
    const shuffled = [...activeItems].sort(() => Math.random() - 0.5);
    setActiveItems(shuffled);
    setCurrentIndex(0);
    setSentenceIndex(0);
    setWordIndexInSentence(0);
    setTypedInput('');
    setRomanBuffer('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsDrillCompleted(false);
  };

  const handleRestartDrill = () => {
    setCurrentIndex(0);
    setSentenceIndex(0);
    setWordIndexInSentence(0);
    setTypedInput('');
    setRomanBuffer('');
    setCompletedCount(0);
    setMistakesCount(0);
    setMistypedKeysMap({});
    setStartTime(null);
    setElapsedSeconds(0);
    setIsDrillCompleted(false);
  };

  const handleAddItems = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemsInput.trim()) return;

    // Split by commas, newlines, or spaces
    const rawTokens = newItemsInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedItems: string[] = [];
    for (const token of rawTokens) {
      if (!isSentenceCategory && token.includes(' ')) {
        const subTokens = token.split(/\s+/).filter((t) => t.trim().length > 0);
        parsedItems.push(...subTokens);
      } else {
        parsedItems.push(token);
      }
    }

    if (parsedItems.length === 0) return;

    const currentCustom = customItemsMap[selectedSubCatId] || [];
    // Deduplicate while preserving order
    const updatedCustom = Array.from(new Set([...currentCustom, ...parsedItems]));
    const updatedMap = {
      ...customItemsMap,
      [selectedSubCatId]: updatedCustom
    };

    setCustomItemsMap(updatedMap);
    setStoredCustomItems(updatedMap);

    const combined = [...activeSubCategory.items, ...updatedCustom];
    setActiveItems(combined);
    setNewItemsInput('');
    setIsAddModalOpen(false);
  };

  const handleRemoveCustomItem = (itemToRemove: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentCustom = customItemsMap[selectedSubCatId] || [];
    const updatedCustom = currentCustom.filter((item) => item !== itemToRemove);
    const updatedMap = {
      ...customItemsMap,
      [selectedSubCatId]: updatedCustom
    };

    setCustomItemsMap(updatedMap);
    setStoredCustomItems(updatedMap);

    const combined = [...activeSubCategory.items, ...updatedCustom];
    setActiveItems(combined);
    if (currentIndex >= combined.length) {
      setCurrentIndex(Math.max(0, combined.length - 1));
    }
  };

  // Advance to next word/item or finish drill
  const advanceToNext = () => {
    setCompletedCount((prev) => prev + 1);
    setTypedInput('');
    setRomanBuffer('');
    setRejectedKeyInfo(null);

    if (isSentenceCategory) {
      if (wordIndexInSentence + 1 < wordsInSentence.length) {
        setWordIndexInSentence((prev) => prev + 1);
      } else if (sentenceIndex + 1 < activeItems.length) {
        setSentenceIndex((prev) => prev + 1);
        setWordIndexInSentence(0);
      } else {
        setIsDrillCompleted(true);
      }
    } else {
      if (currentIndex + 1 >= activeItems.length) {
        setIsDrillCompleted(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isDrillCompleted) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const currentBuf = settings.language === 'nepali' ? romanBuffer : typedInput;
    const cleanTarget = stripInvisibleCharacters(currentItem);

    if (e.key === 'Backspace') {
      if (settings.language === 'nepali') {
        if (romanBuffer.length > 0) {
          const newBuf = romanBuffer.slice(0, -1);
          setRomanBuffer(newBuf);
          setTypedInput(transliterateWordRuleBased(newBuf));
        }
      } else {
        setTypedInput((prev) => prev.slice(0, -1));
      }
      playKeypressSound(settings.sound, settings.soundVolume);
      setRejectedKeyInfo(null);
      return;
    }

    // Space or Enter key -> separator handling
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();

      // If buffer is currently empty (e.g. user pressed Space right after word auto-completed)
      if (romanBuffer === '' && typedInput === '') {
        // Harmless trailing/word separator: play sound, never count as mistake
        playKeypressSound(settings.sound, settings.soundVolume);
        return;
      }

      const cleanConverted = stripInvisibleCharacters(typedInput);
      const targetRoman = getRomanizedHintForWord(cleanTarget);

      // Check if current word is completed
      const isWordComplete =
        cleanConverted === cleanTarget ||
        areDevanagariWordsEquivalent(cleanConverted, cleanTarget) ||
        (cleanTarget.length > 0 &&
          cleanConverted.replace(/्$/, '') === cleanTarget.replace(/्$/, '') &&
          (cleanConverted.length >= cleanTarget.length || romanBuffer.length >= targetRoman.length)) ||
        (targetRoman && targetRoman.length > 0 && romanBuffer.toLowerCase() === targetRoman.toLowerCase()) ||
        (settings.language === 'english' &&
          (typedInput.toLowerCase() === cleanTarget.toLowerCase() || isCharacterEquivalent(typedInput, cleanTarget)));

      if (isWordComplete) {
        playKeypressSound(settings.sound, settings.soundVolume);
        advanceToNext();
        return;
      }

      // If word is incomplete and user pressed Space prematurely
      playErrorSound(settings.soundVolume);
      setMistakesCount((prev) => prev + 1);
      const expectedChar = targetRoman[romanBuffer.length] || cleanTarget[cleanConverted.length] || '';
      setMistypedKeysMap((prev) => ({
        ...prev,
        [expectedChar || 'Space']: (prev[expectedChar || 'Space'] || 0) + 1
      }));
      setInputShake(true);
      setRejectedKeyInfo({
        key: 'Space',
        expected: expectedChar === ' ' ? 'Space' : (expectedChar || 'Letter')
      });
      return;
    }

    // Normal single keystroke typing
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
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
        setMistakesCount((prev) => prev + 1);
        setMistypedKeysMap((prev) => ({
          ...prev,
          [validation.expectedKey || e.key]: (prev[validation.expectedKey || e.key] || 0) + 1
        }));
        setInputShake(true);
        setRejectedKeyInfo({
          key: e.key,
          expected: validation.expectedKey === ' ' ? 'Space' : validation.expectedKey
        });
        return;
      }

      // Valid keystroke
      playKeypressSound(settings.sound, settings.soundVolume);
      setRejectedKeyInfo(null);

      if (settings.language === 'nepali') {
        const nextBuf = romanBuffer + e.key;
        const nextDevanagari = transliterateWordRuleBased(nextBuf);
        const cleanConverted = stripInvisibleCharacters(nextDevanagari);
        const targetRoman = getRomanizedHintForWord(cleanTarget);

        // Check if item is completely typed -> Automatically advance immediately
        const isItemComplete =
          cleanConverted === cleanTarget ||
          areDevanagariWordsEquivalent(cleanConverted, cleanTarget) ||
          (cleanTarget.length > 0 &&
            cleanConverted.replace(/्$/, '') === cleanTarget.replace(/्$/, '') &&
            (cleanConverted.length >= cleanTarget.length || nextBuf.length >= targetRoman.length)) ||
          (targetRoman && targetRoman.length > 0 && nextBuf.toLowerCase() === targetRoman.toLowerCase()) ||
          (validation.isWordComplete && (cleanConverted === cleanTarget || areDevanagariWordsEquivalent(cleanConverted, cleanTarget)));

        if (isItemComplete) {
          advanceToNext();
        } else {
          setRomanBuffer(nextBuf);
          setTypedInput(nextDevanagari);
        }
      } else {
        // English Mode
        const nextBuf = typedInput + e.key;
        const isItemComplete =
          nextBuf === cleanTarget ||
          isCharacterEquivalent(nextBuf, cleanTarget);

        if (isItemComplete) {
          advanceToNext();
        } else {
          setTypedInput(nextBuf);
        }
      }
    }
  };

  // Performance calculations
  const totalTargetCount = isSentenceCategory ? totalSentenceWords : activeItems.length;
  const totalKeystrokes = completedCount * 4 + typedInput.length + mistakesCount;
  const accuracy = totalKeystrokes > 0 ? Math.max(0, Math.round(((totalKeystrokes - mistakesCount) / totalKeystrokes) * 100)) : 100;
  const timeInMinutes = Math.max(elapsedSeconds / 60, 0.05);
  const wpm = Math.round(completedCount / timeInMinutes);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (difficultyFilter === 'All') return NEPALI_PRACTICE_DATA;
    return NEPALI_PRACTICE_DATA.filter((c) => c.difficulty === difficultyFilter);
  }, [difficultyFilter]);

  return (
    <div id="nepali-practice-mode-section" className="w-full max-w-7xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 dark:bg-slate-900 rounded-2xl p-6 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider">
              Nepali Practice Mode
            </span>
            <span className="text-xs text-slate-400">Devanagari Romanized Unicode Drills</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Progressive Nepali Typing Drills
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            From basic consonants and matras to complex conjuncts (संयुक्त वर्ण), administrative sentences, and paragraphs.
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 self-start md:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Test</span>
          </button>
        )}
      </div>

      {/* 1. PRACTICE AREA (Full Width Primary Interactive Workspace) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Drill Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {activeCategory.difficulty}
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                {activeSubCategory.name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeSubCategory.description}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsAddModalOpen((prev) => !prev)}
              title="Add words or characters to this category"
              className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border border-blue-200 dark:border-blue-800"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Items</span>
            </button>

            <button
              onClick={handleShuffleItems}
              title="Shuffle drill items"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={handleRestartDrill}
              title="Restart current drill"
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Inline Add Items Expansion Panel */}
        {isAddModalOpen && (
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-bold text-blue-950 dark:text-blue-200">
                  Add Items to {activeSubCategory.name}
                </span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Type or paste Nepali characters, matras, difficult conjuncts, or words below. Separate multiple items with commas, spaces, or new lines. They will be added directly into this exercise and saved.
            </p>

            <form onSubmit={handleAddItems} className="space-y-2.5">
              <textarea
                value={newItemsInput}
                onChange={(e) => setNewItemsInput(e.target.value)}
                placeholder="e.g. संविधान, न्यायपालिका, अदालत, न्यायाधीश or क्ष, त्र, ज्ञ, श्र"
                rows={2}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 nepali-font-apply focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewItemsInput('');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newItemsInput.trim()}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Practice</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Drill Progress & Live Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Progress</span>
            <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">
              {completedCount} / {totalTargetCount}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Speed</span>
            <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 mt-0.5 block">
              {wpm} WPM
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Accuracy</span>
            <span className={`text-base font-extrabold mt-0.5 block ${accuracy >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {accuracy}%
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Mistakes</span>
            <span className="text-base font-extrabold text-rose-600 dark:text-rose-400 mt-0.5 block">
              {mistakesCount}
            </span>
          </div>
        </div>

        {/* Active Drill Card or Completion Screen */}
        {!isDrillCompleted ? (
          <div className="space-y-6">
            {/* Full Sentence Context Tracker (Displayed during Sentence Practice) */}
            {isSentenceCategory && wordsInSentence.length > 0 && (
              <div className="w-full bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/80 rounded-xl p-4 text-center animate-fadeIn space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
                  <span>Sentence {sentenceIndex + 1} of {activeItems.length}</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span>Word {wordIndexInSentence + 1} of {wordsInSentence.length}</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-base sm:text-lg nepali-font-apply">
                  {wordsInSentence.map((w, wIdx) => {
                    const isPassed = wIdx < wordIndexInSentence;
                    const isCurrent = wIdx === wordIndexInSentence;
                    return (
                      <span
                        key={`${w}-${wIdx}`}
                        className={`px-2.5 py-1 rounded-lg transition-all select-none ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-extrabold ring-2 ring-blue-400 shadow-2xs'
                            : isPassed
                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 font-semibold'
                            : 'text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/60'
                        }`}
                      >
                        {w}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Target Character / Word Hero Display */}
            <div
              className={`p-8 sm:p-10 rounded-2xl border transition-all text-center flex flex-col items-center justify-center min-h-[190px] relative ${
                inputShake
                  ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-400 ring-2 ring-rose-400/20'
                  : 'bg-slate-50/90 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {isSentenceCategory
                  ? `Current Word (${wordIndexInSentence + 1} of ${wordsInSentence.length})`
                  : `Target Item (${currentIndex + 1} of ${activeItems.length})`}
              </span>

              <span
                className="text-4xl sm:text-6xl font-black text-blue-600 dark:text-blue-400 tracking-wide nepali-font-apply py-3 select-none leading-tight"
                style={{ fontFamily: 'var(--app-nepali-font)' }}
              >
                {currentItem}
              </span>

              {/* Romanized keystroke hint if available */}
              {currentRomanHint && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 shadow-2xs">
                  <span className="text-slate-400 font-sans text-[11px]">Type Roman Keys:</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-bold">{currentRomanHint}</strong>
                </div>
              )}

              {rejectedKeyInfo && (
                <div className="absolute bottom-3 text-xs font-bold text-rose-600 dark:text-rose-400 animate-fadeIn">
                  Pressed <kbd className="font-mono uppercase px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900 rounded">{rejectedKeyInfo.key}</kbd>, required: <kbd className="font-mono uppercase px-1.5 py-0.5 bg-slate-900 text-white rounded">{rejectedKeyInfo.expected}</kbd>
                </div>
              )}
            </div>

            {/* Live Romanized Input Field */}
            <div className="space-y-3 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={settings.language === 'nepali' ? romanBuffer : typedInput}
                  onChange={() => {}}
                  onKeyDown={handleKeyDown}
                  placeholder="Type Romanized Nepali here... (e.g. k -> क)"
                  autoFocus
                  className="w-full px-5 py-4 rounded-xl border-2 border-blue-500 dark:border-blue-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xl font-mono focus:outline-none focus:ring-4 focus:ring-blue-500/20 shadow-xs text-center"
                />

                {settings.language === 'nepali' && typedInput && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Devanagari:</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400 nepali-font-apply">
                      {typedInput}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
                {isSentenceCategory
                  ? 'Type Romanized keys for the current word. Pressing Space after finishing a word moves to the next word naturally.'
                  : 'Type Romanized keys for the target above. Completing the item advances automatically to the next item.'}
              </p>
            </div>

            {/* Category Items Sequence Preview */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Category Items ({activeItems.length})
                  </span>
                  {userCustomItemsForCurrentSubCat.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      {userCustomItemsForCurrentSubCat.length} added by you
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsAddModalOpen((prev) => !prev)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Add More</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 max-h-40 overflow-y-auto pr-1">
                {activeItems.map((item, idx) => {
                  const isCurrent = idx === currentIndex && !isDrillCompleted;
                  const isPassed = idx < currentIndex;
                  const isUserCustom = userCustomItemsForCurrentSubCat.includes(item);

                  return (
                    <span
                      key={`${item}-${idx}`}
                      className={`group relative inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all nepali-font-apply select-none ${
                        isCurrent
                          ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400 shadow-2xs'
                          : isPassed
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                          : isUserCustom
                          ? 'bg-blue-50/80 dark:bg-blue-950/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800/80'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{item}</span>
                      {isUserCustom && (
                        <button
                          onClick={(e) => handleRemoveCustomItem(item, e)}
                          title="Remove custom added item"
                          className="opacity-60 hover:opacity-100 hover:text-rose-600 dark:hover:text-rose-400 ml-0.5 p-0.5 rounded transition-all cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </span>
                  );
                })}

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-dashed border-blue-300 dark:border-blue-800 transition-all cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Drill Completed Performance Scorecard */
          <div className="p-8 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center space-y-5 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-black text-emerald-900 dark:text-emerald-200">
                Drill Completed Successfully!
              </h3>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                You have successfully practiced all {activeItems.length} items in {activeSubCategory.name}.
              </p>
            </div>

            {/* Score stats */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Final Speed</span>
                <span className="text-xl font-black text-blue-600 mt-0.5 block">{wpm} WPM</span>
              </div>
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Accuracy</span>
                <span className="text-xl font-black text-emerald-600 mt-0.5 block">{accuracy}%</span>
              </div>
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Time</span>
                <span className="text-xl font-black text-slate-700 dark:text-slate-300 mt-0.5 block">{elapsedSeconds}s</span>
              </div>
            </div>

            {/* Mistyped keys breakdown */}
            {Object.keys(mistypedKeysMap).length > 0 && (
              <div className="text-xs text-slate-600 dark:text-slate-300 pt-2">
                <span className="font-bold block mb-1.5">Mistyped Keys to Review:</span>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {Object.entries(mistypedKeysMap).map(([k, count]) => (
                    <span key={k} className="px-2.5 py-1 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-mono font-bold">
                      {k}: {count}x
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRestartDrill}
                className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Again</span>
              </button>

              {onNavigateToImprovement && (
                <button
                  onClick={onNavigateToImprovement}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>AI Weak Key Coach</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Launch in Main Typing Area footer bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Want to practice this entire module inside the full continuous typing arena?
          </span>
          <button
            onClick={() => onLaunchPracticeSession(activeItems)}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch in Typing Area</span>
          </button>
        </div>
      </div>

      {/* 2. CATEGORY / PRACTICE OPTIONS (Full Width Block Below Practice Area) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Practice Categories & Curriculum
            </h3>
          </div>
          {/* Difficulty filter chips */}
          <div className="flex flex-wrap items-center gap-1">
            {DIFFICULTY_LEVEL_TABS.map((dif) => (
              <button
                key={dif}
                onClick={() => setDifficultyFilter(dif)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  difficultyFilter === dif
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {dif}
              </button>
            ))}
          </div>
        </div>

        {/* Main Category Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredCategories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  if (cat.subCategories[0]) {
                    setSelectedSubCatId(cat.subCategories[0].id);
                  }
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cat.difficulty}
                  </span>
                  <h4
                    className={`font-bold text-xs mt-2.5 ${
                      isSelected ? 'text-blue-900 dark:text-blue-200' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 nepali-font-apply">
                    {cat.nepaliName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Subcategory Specific Options */}
        {activeCategory.subCategories.length > 1 && (
          <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-2">Drill Module:</span>
            {activeCategory.subCategories.map((sub) => {
              const isSelected = selectedSubCatId === sub.id;
              const customCount = (customItemsMap[sub.id] || []).length;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCatId(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <span>{sub.name}</span>
                  {customCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                      +{customCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. NEPALI UNICODE KEYBOARD MAP (Placed Below Practice Area, Full Width) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <KeyboardIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              Nepali Romanized Unicode Keyboard Map
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Reference chart for standard Romanized key mappings
          </span>
        </div>

        <NepaliRomanizedKeyboardDiagram />
      </div>
    </div>
  );
};

