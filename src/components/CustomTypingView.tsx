import React, { useState, useMemo } from 'react';
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
  Info
} from 'lucide-react';
import { LanguageMode, TestSettings } from '../types';
import { SAMPLE_PARAGRAPHS } from '../data/wordPacks';
import { ENGLISH_PARAGRAPH_TESTS } from '../data/englishCourseData';

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

interface CustomTypingViewProps {
  initialLanguage?: LanguageMode;
  initialText?: string;
  initialWordCount?: number | null;
  initialTimeSeconds?: number | null;
  onStartTest: (config: CustomTypingConfig) => void;
  isModalMode?: boolean;
}

const PRESET_WORD_COUNTS = [50, 100, 150, 200, 300, 500];
const PRESET_TIMES = [
  { label: '30s', seconds: 30 },
  { label: '60s (1m)', seconds: 60 },
  { label: '2m', seconds: 120 },
  { label: '3m', seconds: 180 },
  { label: '4m', seconds: 240 },
  { label: '5m', seconds: 300 },
  { label: '10m', seconds: 600 }
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

  // Word count mode: 'unlimited' | 'preset' | 'custom'
  const [wordMode, setWordMode] = useState<'unlimited' | 'custom'>(() => {
    return initialWordCount !== null && initialWordCount > 0 ? 'custom' : 'unlimited';
  });
  const [selectedWordCount, setSelectedWordCount] = useState<number>(initialWordCount || 200);
  const [customWordInput, setCustomWordInput] = useState<string>(
    initialWordCount ? initialWordCount.toString() : '200'
  );

  // Time mode: 'unlimited' | 'preset' | 'custom'
  const [timeMode, setTimeMode] = useState<'unlimited' | 'custom'>(() => {
    return initialTimeSeconds !== null && initialTimeSeconds > 0 ? 'custom' : 'custom';
  });
  const [selectedTimeSeconds, setSelectedTimeSeconds] = useState<number>(initialTimeSeconds ?? 300);
  const [customMinInput, setCustomMinInput] = useState<string>('5');
  const [customSecInput, setCustomSecInput] = useState<string>('0');

  // Additional options
  const [lokSewaMode, setLokSewaMode] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [mistakeMode, setMistakeMode] = useState<'strict' | 'allow'>('strict');
  const [backspaceEnabled, setBackspaceEnabled] = useState<boolean>(true);
  const [showHints, setShowHints] = useState<boolean>(true);

  // Analyze text stats
  const stats = useMemo(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      return { chars: 0, words: 0, lines: 0 };
    }
    const words = trimmed.split(/\s+/).filter(Boolean).length;
    const chars = trimmed.length;
    const lines = trimmed.split('\n').length;
    return { chars, words, lines };
  }, [text]);

  // Compute effective word count limit
  const effectiveWordLimit = useMemo((): number | null => {
    if (wordMode === 'unlimited') return null;
    const customNum = parseInt(customWordInput, 10);
    return !isNaN(customNum) && customNum > 0 ? customNum : selectedWordCount;
  }, [wordMode, customWordInput, selectedWordCount]);

  // Compute effective time limit
  const effectiveTimeLimitSeconds = useMemo((): number | null => {
    if (lokSewaMode) return 300; // 5 minutes standard for Lok Sewa
    if (timeMode === 'unlimited') return null;
    const min = parseInt(customMinInput, 10) || 0;
    const sec = parseInt(customSecInput, 10) || 0;
    const total = min * 60 + sec;
    return total > 0 ? total : selectedTimeSeconds;
  }, [lokSewaMode, timeMode, customMinInput, customSecInput, selectedTimeSeconds]);

  // Quick Sample Insertion
  const handleLoadSample = (sampleText: string) => {
    setText(sampleText.trim());
  };

  const handlePasteClipboard = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(prev => (prev ? prev + '\n' + clipText : clipText));
      }
    } catch {
      // Clipboard permission denied or unsupported
    }
  };

  const handleStart = () => {
    if (!text.trim()) return;

    onStartTest({
      text: text.trim(),
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
                Paste or create custom text with flexible word counts, custom timers, and exam rules.
              </p>
            </div>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shrink-0">
          <button
            type="button"
            onClick={() => setLanguage('nepali')}
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
            onClick={() => setLanguage('english')}
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

      {/* Editor Main Area */}
      <div className="space-y-4">
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
              <span>Word Count Target</span>
            </span>

            {/* Unlimited vs Custom Selector */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="wordMode"
                  checked={wordMode === 'unlimited'}
                  onChange={() => setWordMode('unlimited')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span>Unlimited</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="wordMode"
                  checked={wordMode === 'custom'}
                  onChange={() => setWordMode('custom')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span>Set Words</span>
              </label>
            </div>
          </div>

          {/* Word Count Presets & Custom Input */}
          {wordMode === 'custom' ? (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_WORD_COUNTS.map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      setSelectedWordCount(cnt);
                      setCustomWordInput(cnt.toString());
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      customWordInput === cnt.toString()
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {cnt} words
                  </button>
                ))}
              </div>

              {/* Custom Number Input */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Custom:</span>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={customWordInput}
                  onChange={(e) => setCustomWordInput(e.target.value)}
                  placeholder="e.g. 275"
                  className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-400">words</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">
              No word-count limit. The test continues until time runs out or the whole passage is completed.
            </p>
          )}
        </div>

        {/* 2. TIME DURATION CONFIGURATION */}
        <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Time Duration</span>
            </span>

            {/* Unlimited vs Custom Selector */}
            <div className="flex items-center gap-3 text-xs font-medium">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="timeMode"
                  disabled={lokSewaMode}
                  checked={timeMode === 'unlimited' && !lokSewaMode}
                  onChange={() => setTimeMode('unlimited')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span>Unlimited</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="timeMode"
                  disabled={lokSewaMode}
                  checked={timeMode === 'custom' || lokSewaMode}
                  onChange={() => setTimeMode('custom')}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span>Set Time</span>
              </label>
            </div>
          </div>

          {/* Time Presets & Custom Input */}
          {timeMode === 'custom' || lokSewaMode ? (
            <div className="space-y-2.5 animate-fadeIn">
              <div className="flex flex-wrap items-center gap-1.5">
                {PRESET_TIMES.map(t => (
                  <button
                    key={t.seconds}
                    type="button"
                    disabled={lokSewaMode}
                    onClick={() => {
                      setSelectedTimeSeconds(t.seconds);
                      setCustomMinInput(Math.floor(t.seconds / 60).toString());
                      setCustomSecInput((t.seconds % 60).toString());
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      effectiveTimeLimitSeconds === t.seconds
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Custom Minutes and Seconds */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Custom:</span>
                <input
                  type="number"
                  min="0"
                  max="120"
                  disabled={lokSewaMode}
                  value={customMinInput}
                  onChange={(e) => setCustomMinInput(e.target.value)}
                  placeholder="Min"
                  className="w-16 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
                <span className="text-xs text-slate-400">m</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  disabled={lokSewaMode}
                  value={customSecInput}
                  onChange={(e) => setCustomSecInput(e.target.value)}
                  placeholder="Sec"
                  className="w-16 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                />
                <span className="text-xs text-slate-400">s</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">
              No timer limit. Take all the time you need to complete the text or word target.
            </p>
          )}
        </div>

      </div>

      {/* Active Rule Condition Pill / Summary */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-2.5 text-xs text-blue-900 dark:text-blue-200">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold block">
            {effectiveWordLimit && effectiveTimeLimitSeconds ? (
              <>Combination Mode: {effectiveWordLimit} words in {Math.floor(effectiveTimeLimitSeconds / 60)}m {effectiveTimeLimitSeconds % 60 ? `${effectiveTimeLimitSeconds % 60}s` : ''}</>
            ) : effectiveWordLimit ? (
              <>Word Count Target: {effectiveWordLimit} words (No time limit)</>
            ) : effectiveTimeLimitSeconds ? (
              <>Timed Test: {Math.floor(effectiveTimeLimitSeconds / 60)}m {effectiveTimeLimitSeconds % 60 ? `${effectiveTimeLimitSeconds % 60}s` : ''} (No word count limit)</>
            ) : (
              <>Untimed Full Passage Mode</>
            )}
          </span>
          <p className="text-blue-700/80 dark:text-blue-300/80 text-[11px] leading-relaxed">
            {effectiveWordLimit && effectiveTimeLimitSeconds
              ? `The test ends automatically when either condition is met first: completing ${effectiveWordLimit} words OR when the timer reaches zero.`
              : effectiveWordLimit
              ? `The test automatically ends immediately when ${effectiveWordLimit} words have been typed.`
              : effectiveTimeLimitSeconds
              ? `The test ends when the timer reaches zero.`
              : `The test runs continuously until you finish the full passage.`}
          </p>
        </div>
      </div>

      {/* Advanced Rules & Lok Sewa Toggle (Collapsible) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide Additional Test Settings' : 'Configure Rules, Mistakes & Lok Sewa Mode'}</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 space-y-3.5 animate-fadeIn">
            {/* Lok Sewa Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Lok Sewa Aayog (PSC Nepal) Exam Mode</span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Enforces official 5-minute timer, 200 words evaluation standard, and CWPM formula.
                </p>
              </div>
              <input
                type="checkbox"
                checked={lokSewaMode}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  setLokSewaMode(enabled);
                  if (enabled) {
                    setTimeMode('custom');
                    setSelectedTimeSeconds(300);
                  }
                }}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Mistake Mode</label>
                <select
                  value={mistakeMode}
                  onChange={(e) => setMistakeMode(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                >
                  <option value="strict">Strict (Must type correctly)</option>
                  <option value="allow">Allow (Record mistakes & move on)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Backspace Key</label>
                <select
                  value={backspaceEnabled ? 'yes' : 'no'}
                  onChange={(e) => setBackspaceEnabled(e.target.value === 'yes')}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                >
                  <option value="yes">Enabled (Can correct mistakes)</option>
                  <option value="no">Disabled (Examination restriction)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">Typing Hints</label>
                <select
                  value={showHints ? 'yes' : 'no'}
                  onChange={(e) => setShowHints(e.target.value === 'yes')}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                >
                  <option value="yes">Show Romanized Sequence</option>
                  <option value="no">Hidden (Blind typing test)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="pt-3 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleStart}
          disabled={!text.trim()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Custom Test</span>
        </button>
      </div>

    </div>
  );
};
