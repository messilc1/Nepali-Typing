import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Clock,
  Type,
  Sparkles,
  Trash2,
  Clipboard,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Info,
  Bookmark,
  Plus,
  Save,
  Check,
  X,
  Star
} from 'lucide-react';
import { LanguageMode } from '../types';
import { SAMPLE_PARAGRAPHS } from '../data/wordPacks';
import { ENGLISH_PARAGRAPH_TESTS } from '../data/englishCourseData';
import { expandTextToWordCount, countWords } from '../utils/textRepetition';

export interface CustomTypingConfig {
  text: string;
  language: LanguageMode;
  wordCountLimit: number | null; // null = unlimited
  timeLimitSeconds: number | null; // null = unlimited
  lokSewaMode: boolean;
  mistakeMode?: 'strict' | 'allow';
  backspaceEnabled?: boolean;
  showHints?: boolean;
}

export interface CustomTypingPreset {
  id: string;
  name: string;
  language: LanguageMode;
  text: string;
  wordCountLimit: number | null;
  timeLimitSeconds: number | null;
  lokSewaMode: boolean;
  mistakeMode: 'strict' | 'allow';
  backspaceEnabled: boolean;
  showHints: boolean;
  isDefault?: boolean;
}

interface CustomTypingViewProps {
  initialLanguage?: LanguageMode;
  initialText?: string;
  initialWordCount?: number | null;
  initialTimeSeconds?: number | null;
  onStartTest: (config: CustomTypingConfig) => void;
  isModalMode?: boolean;
}

const PRESETS_STORAGE_KEY = 'nepali_typing_custom_presets';

const DEFAULT_PRESETS: CustomTypingPreset[] = [
  {
    id: 'preset-loksewa-5min',
    name: '🇳🇵 Lok Sewa 5-Min Model Exam',
    language: 'nepali',
    text: SAMPLE_PARAGRAPHS.constitution,
    wordCountLimit: null,
    timeLimitSeconds: 300,
    lokSewaMode: true,
    mistakeMode: 'strict',
    backspaceEnabled: true,
    showHints: true,
    isDefault: true
  },
  {
    id: 'preset-quick-200words',
    name: '🇳🇵 200-Word Legal Sprint',
    language: 'nepali',
    text: SAMPLE_PARAGRAPHS.supreme_court_judgment,
    wordCountLimit: 200,
    timeLimitSeconds: null,
    lokSewaMode: false,
    mistakeMode: 'strict',
    backspaceEnabled: true,
    showHints: false
  },
  {
    id: 'preset-eng-speed-3min',
    name: '🇬🇧 English 3-Minute Speed Test',
    language: 'english',
    text: ENGLISH_PARAGRAPH_TESTS[0]?.text || 'The civil service examination tests speed, accuracy, and endurance.',
    wordCountLimit: null,
    timeLimitSeconds: 180,
    lokSewaMode: false,
    mistakeMode: 'strict',
    backspaceEnabled: true,
    showHints: true
  }
];

export const CustomTypingView: React.FC<CustomTypingViewProps> = ({
  initialLanguage = 'nepali',
  initialText = '',
  initialWordCount = null,
  initialTimeSeconds = 300,
  onStartTest,
  isModalMode = false
}) => {
  const [language, setLanguage] = useState<LanguageMode>(initialLanguage);
  const [text, setText] = useState<string>(initialText);

  // Word count limit state
  const [wordLimitMode, setWordLimitMode] = useState<'unlimited' | 'limit'>(() => {
    return initialWordCount !== null && initialWordCount > 0 ? 'limit' : 'unlimited';
  });
  const [selectedWordLimit, setSelectedWordLimit] = useState<number>(initialWordCount || 200);
  const [customWordLimitInput, setCustomWordLimitInput] = useState<string>(
    initialWordCount ? initialWordCount.toString() : '200'
  );

  // Time limit state
  const [timeLimitMode, setTimeLimitMode] = useState<'unlimited' | 'limit'>(() => {
    return initialTimeSeconds !== null && initialTimeSeconds > 0 ? 'limit' : 'limit';
  });
  const [selectedTimeLimitSec, setSelectedTimeLimitSec] = useState<number>(initialTimeSeconds ?? 300);
  const [customMinInput, setCustomMinInput] = useState<string>('5');
  const [customSecInput, setCustomSecInput] = useState<string>('0');

  // Additional options
  const [lokSewaMode, setLokSewaMode] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [mistakeMode, setMistakeMode] = useState<'strict' | 'allow'>('strict');
  const [backspaceEnabled, setBackspaceEnabled] = useState<boolean>(true);
  const [showHints, setShowHints] = useState<boolean>(true);

  // Presets management
  const [presets, setPresets] = useState<CustomTypingPreset[]>(() => {
    try {
      const saved = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PRESETS;
  });

  const [activePresetId, setActivePresetId] = useState<string>('');
  const [showSavePresetDialog, setShowSavePresetDialog] = useState<boolean>(false);
  const [newPresetName, setNewPresetName] = useState<string>('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Persist presets
  useEffect(() => {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    } catch {}
  }, [presets]);

  // Analyze text stats
  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { chars: 0, words: 0, lines: 0 };
    }
    const words = countWords(trimmed);
    const chars = trimmed.length;
    const lines = trimmed.split('\n').length;
    return { chars, words, lines };
  }, [text]);

  // Compute effective word count limit
  const effectiveWordLimit = useMemo((): number | null => {
    if (wordLimitMode === 'unlimited') return null;
    const customNum = parseInt(customWordLimitInput, 10);
    return !isNaN(customNum) && customNum > 0 ? customNum : selectedWordLimit;
  }, [wordLimitMode, customWordLimitInput, selectedWordLimit]);

  // Compute effective time limit
  const effectiveTimeLimitSeconds = useMemo((): number | null => {
    if (lokSewaMode) return 300; // 5 minutes standard for Lok Sewa
    if (timeLimitMode === 'unlimited') return null;
    const min = parseInt(customMinInput, 10) || 0;
    const sec = parseInt(customSecInput, 10) || 0;
    const total = min * 60 + sec;
    return total > 0 ? total : selectedTimeLimitSec;
  }, [lokSewaMode, timeLimitMode, customMinInput, customSecInput, selectedTimeLimitSec]);

  // Quick Sample Insertion
  const handleLoadSample = (sampleText: string) => {
    setText(sampleText.trim());
    setActivePresetId('');
  };

  const handlePasteClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(prev => (prev ? prev + '\n' + clipText : clipText));
        setActivePresetId('');
      }
    } catch {
      // Clipboard permission denied or unsupported
    }
  };

  // Preset operations
  const handleLoadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;
    setActivePresetId(preset.id);
    setLanguage(preset.language);
    setText(preset.text);
    if (preset.wordCountLimit) {
      setWordLimitMode('limit');
      setSelectedWordLimit(preset.wordCountLimit);
      setCustomWordLimitInput(preset.wordCountLimit.toString());
    } else {
      setWordLimitMode('unlimited');
    }

    if (preset.timeLimitSeconds) {
      setTimeLimitMode('limit');
      setSelectedTimeLimitSec(preset.timeLimitSeconds);
      const min = Math.floor(preset.timeLimitSeconds / 60);
      const sec = preset.timeLimitSeconds % 60;
      setCustomMinInput(min.toString());
      setCustomSecInput(sec.toString());
    } else {
      setTimeLimitMode('unlimited');
    }

    setLokSewaMode(preset.lokSewaMode);
    setMistakeMode(preset.mistakeMode);
    setBackspaceEnabled(preset.backspaceEnabled);
    setShowHints(preset.showHints);
  };

  const handleSaveCurrentAsPreset = () => {
    if (!newPresetName.trim() || !text.trim()) return;
    const newPreset: CustomTypingPreset = {
      id: `preset-${Date.now()}`,
      name: newPresetName.trim(),
      language,
      text: text.trim(),
      wordCountLimit: effectiveWordLimit,
      timeLimitSeconds: effectiveTimeLimitSeconds,
      lokSewaMode,
      mistakeMode,
      backspaceEnabled,
      showHints
    };
    setPresets(prev => [newPreset, ...prev]);
    setActivePresetId(newPreset.id);
    setShowSavePresetDialog(false);
    setNewPresetName('');
    setSaveSuccessMsg('Preset saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPresets(prev => prev.filter(p => p.id !== id));
    if (activePresetId === id) setActivePresetId('');
  };

  const handleResetToDefault = () => {
    setLanguage('nepali');
    setText(SAMPLE_PARAGRAPHS.constitution);
    setWordLimitMode('unlimited');
    setTimeLimitMode('limit');
    setSelectedTimeLimitSec(300);
    setCustomMinInput('5');
    setCustomSecInput('0');
    setLokSewaMode(false);
    setMistakeMode('strict');
    setBackspaceEnabled(true);
    setShowHints(true);
    setActivePresetId('');
  };

  const handleStart = () => {
    if (!text.trim()) return;

    let targetText = text.trim();
    // Repetition check: if effectiveWordLimit is greater than text words, expand text automatically
    if (effectiveWordLimit && effectiveWordLimit > stats.words && stats.words > 0) {
      targetText = expandTextToWordCount(targetText, effectiveWordLimit);
    }

    onStartTest({
      text: targetText,
      language,
      wordCountLimit: effectiveWordLimit,
      timeLimitSeconds: effectiveTimeLimitSeconds,
      lokSewaMode,
      mistakeMode,
      backspaceEnabled,
      showHints
    });
  };

  return (
    <div
      id="custom-typing-studio-container"
      className={`w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs transition-colors ${
        isModalMode ? 'p-5 sm:p-7' : 'p-6 sm:p-8 max-w-5xl mx-auto space-y-6'
      }`}
    >
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Custom Typing Studio</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste or write your custom text, configure word count & timers, and save reusable presets.
              </p>
            </div>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => {
              setLanguage('nepali');
              if (!text || text === (ENGLISH_PARAGRAPH_TESTS[0]?.text || '')) {
                setText(SAMPLE_PARAGRAPHS.constitution);
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              language === 'nepali'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>🇳🇵 Nepali (Unicode)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setLanguage('english');
              if (!text || text === SAMPLE_PARAGRAPHS.constitution) {
                setText(ENGLISH_PARAGRAPH_TESTS[0]?.text || '');
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              language === 'english'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>🇬🇧 English</span>
          </button>
        </div>
      </div>

      {/* Preset Selector & Management Bar */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Preset:</span>
          </span>

          <select
            value={activePresetId}
            onChange={(e) => handleLoadPreset(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">— Select Saved Preset —</option>
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.language === 'nepali' ? 'Nepali' : 'English'})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSavePresetDialog(true)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="Save current text & settings as a named preset"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preset</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-2.5 py-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all font-medium cursor-pointer"
            title="Reset to recommended default settings"
          >
            Reset Defaults
          </button>
        </div>
      </div>

      {/* Save Preset Dialog Modal / Box */}
      {showSavePresetDialog && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <Save className="w-4 h-4 text-blue-600" />
              <span>Save Current Configuration as Preset</span>
            </span>
            <button
              type="button"
              onClick={() => setShowSavePresetDialog(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              placeholder="e.g. My 5-Minute Lok Sewa Model Set"
              className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleSaveCurrentAsPreset}
              disabled={!newPresetName.trim() || !text.trim()}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {saveSuccessMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Editor Main Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Practice Text & Paragraph</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Clipboard className="w-3 h-3" />
              <span>Paste Clipboard</span>
            </button>
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer ml-2"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              language === 'nepali'
                ? 'यहाँ आफ्नो नेपाली पाठ, कानुनी निर्णय, वा अभ्यास गर्न चाहेको अनुच्छेद लेख्नुहोस् वा टाँस्नुहोस्...'
                : 'Paste or type your custom English text, code comments, technical article, or literature excerpt here...'
            }
            rows={isModalMode ? 6 : 8}
            className={`w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-sans resize-y ${
              language === 'nepali' ? 'nepali-font-apply' : 'font-sans'
            }`}
          />

          {/* Character & Word counter in footer */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-100/70 dark:bg-slate-800/60 border-t border-slate-200/60 dark:border-slate-700/60 rounded-b-xl -mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>
              {stats.words} {stats.words === 1 ? 'word' : 'words'} • {stats.chars} characters • {stats.lines} lines
            </span>
            {stats.words > 0 && (
              <span>~{Math.max(1, Math.round(stats.words / 35))} min at 35 WPM</span>
            )}
          </div>
        </div>

        {/* Quick Sample Text Suggestions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Quick Samples:
          </span>
          {language === 'nepali' ? (
            <>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_PARAGRAPHS.constitution)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                📜 नेपालको संविधान
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_PARAGRAPHS.supreme_court_judgment)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                ⚖️ सर्वोच्च अदालत फैसला
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_PARAGRAPHS.legal_newspaper)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                💻 समसामयिक समाचार लेख
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleLoadSample(ENGLISH_PARAGRAPH_TESTS[0]?.text || '')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                🏛️ Public Service Exam Article
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(ENGLISH_PARAGRAPH_TESTS[1]?.text || '')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                🌐 Cyber Security & Cloud Tech
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(ENGLISH_PARAGRAPH_TESTS[2]?.text || '')}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                💡 Science & Innovation
              </button>
            </>
          )}
        </div>
      </div>

      {/* Test Conditions Controls: Word Count + Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* 1. WORD COUNT CONFIGURATION */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Word Limit Target</span>
            </span>

            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-slate-700/70 rounded-lg text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setWordLimitMode('unlimited')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  wordLimitMode === 'unlimited'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Unlimited
              </button>
              <button
                type="button"
                onClick={() => setWordLimitMode('limit')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  wordLimitMode === 'limit'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Fixed Limit
              </button>
            </div>
          </div>

          {wordLimitMode === 'limit' ? (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {[50, 100, 150, 200, 300, 500].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setSelectedWordLimit(count);
                      setCustomWordLimitInput(count.toString());
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedWordLimit === count && customWordLimitInput === count.toString()
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {count}w
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 font-medium">Custom Words:</span>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={customWordLimitInput}
                  onChange={(e) => {
                    setCustomWordLimitInput(e.target.value);
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setSelectedWordLimit(val);
                  }}
                  className="w-24 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {effectiveWordLimit && effectiveWordLimit > stats.words && stats.words > 0 && (
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-[11px] text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Auto-repetition enabled: Text will loop seamlessly to provide {effectiveWordLimit} words.
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-1">
              Type the full provided text until completion (or until the timer expires).
            </p>
          )}
        </div>

        {/* 2. TIME LIMIT CONFIGURATION */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Time Limit</span>
            </span>

            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-slate-700/70 rounded-lg text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setTimeLimitMode('unlimited')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  timeLimitMode === 'unlimited'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                No Timer
              </button>
              <button
                type="button"
                onClick={() => setTimeLimitMode('limit')}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  timeLimitMode === 'limit'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs font-bold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Fixed Timer
              </button>
            </div>
          </div>

          {timeLimitMode === 'limit' ? (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: '30s', sec: 30 },
                  { label: '1m', sec: 60 },
                  { label: '2m', sec: 120 },
                  { label: '3m', sec: 180 },
                  { label: '5m', sec: 300 },
                  { label: '10m', sec: 600 }
                ].map((item) => (
                  <button
                    key={item.sec}
                    type="button"
                    onClick={() => {
                      setSelectedTimeLimitSec(item.sec);
                      const min = Math.floor(item.sec / 60);
                      const sec = item.sec % 60;
                      setCustomMinInput(min.toString());
                      setCustomSecInput(sec.toString());
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedTimeLimitSec === item.sec && effectiveTimeLimitSeconds === item.sec
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <span className="text-slate-500 font-medium">Custom:</span>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={customMinInput}
                  onChange={(e) => setCustomMinInput(e.target.value)}
                  className="w-14 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-slate-500">m</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={customSecInput}
                  onChange={(e) => setCustomSecInput(e.target.value)}
                  className="w-14 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <span className="text-slate-500">s</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-1">
              Test runs continuously at your own pace without any countdown timer.
            </p>
          )}
        </div>
      </div>

      {/* Expandable Advanced Options */}
      <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-2.5 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Advanced Exam & Typing Rules</span>
          </div>
          <span className="text-[11px] text-slate-400">{showAdvanced ? 'Hide ▲' : 'Expand ▼'}</span>
        </button>

        {showAdvanced && (
          <div className="p-4 bg-white dark:bg-slate-900 space-y-3.5 border-t border-slate-100 dark:border-slate-800 animate-fadeIn text-xs">
            {/* Lok Sewa Examination Evaluation Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 cursor-pointer">
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-200">
                  Lok Sewa Strict Exam Mode (लोक सेवा मूल्यांकन)
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enforces official Section Officer marking: 5 words per mistake deduction, 5-minute timer.
                </span>
              </div>
              <input
                type="checkbox"
                checked={lokSewaMode}
                onChange={(e) => setLokSewaMode(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </label>

            {/* Mistake Enforcement Mode */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80">
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-200">Mistake Enforcement</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Strict stops on wrong keys; Allow permits typing through mistakes.
                </span>
              </div>
              <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-700/60 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setMistakeMode('strict')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer ${
                    mistakeMode === 'strict'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Strict
                </button>
                <button
                  type="button"
                  onClick={() => setMistakeMode('allow')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer ${
                    mistakeMode === 'allow'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Allow Errors
                </button>
              </div>
            </div>

            {/* Backspace Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 cursor-pointer">
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-200">Enable Backspace Key</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Disable for high-pressure examination stamina drill without corrections.
                </span>
              </div>
              <input
                type="checkbox"
                checked={backspaceEnabled}
                onChange={(e) => setBackspaceEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </label>

            {/* Live Romanized Hints */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 cursor-pointer">
              <div>
                <span className="font-bold block text-slate-800 dark:text-slate-200">Display Live Keystroke Hints</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Shows the exact Romanized letter sequence for complex Devanagari conjuncts.
                </span>
              </div>
              <input
                type="checkbox"
                checked={showHints}
                onChange={(e) => setShowHints(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
              />
            </label>
          </div>
        )}
      </div>

      {/* Start Test Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Target:</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {effectiveWordLimit ? `${effectiveWordLimit} Words` : `${stats.words} Words (Full Text)`}
          </span>
          <span>•</span>
          <span>Duration:</span>
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {effectiveTimeLimitSeconds
              ? `${Math.floor(effectiveTimeLimitSeconds / 60)}m ${effectiveTimeLimitSeconds % 60 ? `${effectiveTimeLimitSeconds % 60}s` : ''}`
              : 'Untimed'}
          </span>
        </div>

        <button
          id="btn-start-custom-typing"
          type="button"
          onClick={handleStart}
          disabled={!text.trim()}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Start Custom Test</span>
        </button>
      </div>
    </div>
  );
};
