import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  FileText,
  Play,
  Sparkles,
  Settings2,
  Clock,
  AlertTriangle,
  Delete,
  Lightbulb,
  Keyboard as KeyboardIcon,
  Gauge,
  Sliders,
  Save,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Eye,
  Type,
  Maximize2,
  RotateCcw,
  Zap,
  ShieldAlert,
  Volume2,
  Check,
  ChevronRight,
  ClipboardPaste,
  BookOpen
} from 'lucide-react';
import {
  TestSettings,
  LanguageMode,
  DifficultyLevel,
  CustomPreset,
  CustomTextStats
} from '../types';
import {
  analyzeCustomText,
  getStoredCustomPresets,
  saveCustomPresets,
  DEFAULT_CUSTOM_PRESETS
} from '../utils/customTextAnalysis';
import { SAMPLE_PARAGRAPHS, LEGAL_PASSAGES } from '../data/wordPacks';
import { ENGLISH_PARAGRAPH_TESTS } from '../data/englishCourseData';
import { FontSelector } from './FontSelector';
import { LokSewaToggle } from './LokSewaToggle';
import { ensureLokSewaMinimumWords } from '../utils/lokSewaEvaluation';

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
  // Active Language inside Custom Text Builder
  const [language, setLanguage] = useState<LanguageMode>(initialLanguage);

  // Custom text input
  const [customText, setCustomText] = useState<string>(() => {
    if (currentSettings.testType === 'custom' && currentSettings.customText) {
      return currentSettings.customText;
    }
    return '';
  });

  // Timer Configuration State
  const [timerMode, setTimerMode] = useState<'preset' | 'custom' | 'no_limit'>(() => {
    if (currentSettings.noTimeLimit) return 'no_limit';
    if ([15, 30, 60, 120, 180, 300, 600].includes(currentSettings.durationSeconds)) return 'preset';
    return 'custom';
  });
  const [selectedDuration, setSelectedDuration] = useState<number>(currentSettings.durationSeconds || 60);
  const [customTimeInput, setCustomTimeInput] = useState<string>('90');
  const [customTimeUnit, setCustomTimeUnit] = useState<'sec' | 'min'>('sec');
  const [lokSewaMode, setLokSewaMode] = useState<boolean>(currentSettings.lokSewaMode || false);

  // Advanced Settings State
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [advancedTab, setAdvancedTab] = useState<'mistakes' | 'backspace' | 'hints' | 'keyboard' | 'wpm' | 'display' | 'behavior' | 'presets'>('mistakes');

  // Mistake & Backspace Settings
  const [mistakeMode, setMistakeMode] = useState<'strict' | 'allow'>(currentSettings.mistakeMode || 'strict');
  const [maxMistakesType, setMaxMistakesType] = useState<'none' | '5' | '10' | '20' | 'custom'>(() => {
    if (currentSettings.maxMistakes === null || currentSettings.maxMistakes === undefined) return 'none';
    if (currentSettings.maxMistakes === 5) return '5';
    if (currentSettings.maxMistakes === 10) return '10';
    if (currentSettings.maxMistakes === 20) return '20';
    return 'custom';
  });
  const [customMaxMistakes, setCustomMaxMistakes] = useState<number>(currentSettings.maxMistakes || 15);
  const [maxMistakesAction, setMaxMistakesAction] = useState<'end_test' | 'continue'>(currentSettings.maxMistakesAction || 'continue');
  const [backspaceEnabled, setBackspaceEnabled] = useState<boolean>(currentSettings.backspaceEnabled !== false);

  // Hints & Keyboard Settings
  const [showHints, setShowHints] = useState<boolean>(currentSettings.showHints ?? true);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(currentSettings.showKeyboard !== false);
  const [highlightNextKey, setHighlightNextKey] = useState<boolean>(currentSettings.highlightNextKey !== false);
  const [showFingerGuidance, setShowFingerGuidance] = useState<boolean>(currentSettings.showFingerGuidance !== false);
  const [showCurrentCharacter, setShowCurrentCharacter] = useState<boolean>(currentSettings.showCurrentCharacter !== false);
  const [showNextCharacter, setShowNextCharacter] = useState<boolean>(currentSettings.showNextCharacter !== false);

  // WPM & Stats Settings
  const [showLiveWpm, setShowLiveWpm] = useState<boolean>(currentSettings.showLiveWpm !== false);
  const [showNetWpm, setShowNetWpm] = useState<boolean>(currentSettings.showNetWpm !== false);
  const [showGrossWpm, setShowGrossWpm] = useState<boolean>(currentSettings.showGrossWpm !== false);
  const [showLiveAccuracy, setShowLiveAccuracy] = useState<boolean>(currentSettings.showLiveAccuracy !== false);

  // Display Settings
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(currentSettings.fontSize || 'md');
  const [fontFamily, setFontFamily] = useState<string>(currentSettings.fontFamily || 'Kalimati');
  const [lineSpacing, setLineSpacing] = useState<'normal' | 'relaxed' | 'loose'>(currentSettings.lineSpacing || 'relaxed');
  const [textAreaSize, setTextAreaSize] = useState<'compact' | 'standard' | 'spacious'>(currentSettings.textAreaSize || 'standard');

  // Test Behavior Settings
  const [autoStartOnKeyPress, setAutoStartOnKeyPress] = useState<boolean>(currentSettings.autoStartOnKeyPress !== false);
  const [showCountdown, setShowCountdown] = useState<boolean>(currentSettings.showCountdown || false);
  const [recordAnalytics, setRecordAnalytics] = useState<boolean>(currentSettings.recordAnalytics !== false);
  const [recordMistakes, setRecordMistakes] = useState<boolean>(currentSettings.recordMistakes !== false);
  const [recordCorrectedMistakes, setRecordCorrectedMistakes] = useState<boolean>(currentSettings.recordCorrectedMistakes !== false);

  // Preset Management
  const [presets, setPresets] = useState<CustomPreset[]>(getStoredCustomPresets);
  const [presetNameInput, setPresetNameInput] = useState<string>('');
  const [presetSavedSuccess, setPresetSavedSuccess] = useState<boolean>(false);

  // Text Analysis
  const textStats: CustomTextStats = useMemo(() => {
    return analyzeCustomText(customText, language);
  }, [customText, language]);

  // Compute calculated duration
  const effectiveDuration = useMemo(() => {
    if (timerMode === 'no_limit') return 0;
    if (timerMode === 'preset') return selectedDuration;
    const num = parseInt(customTimeInput, 10) || 60;
    return customTimeUnit === 'min' ? num * 60 : num;
  }, [timerMode, selectedDuration, customTimeInput, customTimeUnit]);

  // Handle Preset Application
  const applyPreset = (preset: CustomPreset) => {
    if (preset.language) setLanguage(preset.language);
    if (preset.noTimeLimit) {
      setTimerMode('no_limit');
    } else {
      if ([15, 30, 60, 120, 180, 300, 600].includes(preset.durationSeconds)) {
        setTimerMode('preset');
        setSelectedDuration(preset.durationSeconds);
      } else {
        setTimerMode('custom');
        setCustomTimeInput(preset.durationSeconds.toString());
        setCustomTimeUnit('sec');
      }
    }
    setMistakeMode(preset.mistakeMode);
    if (preset.maxMistakes === null) {
      setMaxMistakesType('none');
    } else if ([5, 10, 20].includes(preset.maxMistakes)) {
      setMaxMistakesType(preset.maxMistakes.toString() as any);
    } else {
      setMaxMistakesType('custom');
      setCustomMaxMistakes(preset.maxMistakes);
    }
    setMaxMistakesAction(preset.maxMistakesAction);
    setBackspaceEnabled(preset.backspaceEnabled);
    setShowHints(preset.showHints);
    setShowKeyboard(preset.showKeyboard);
    setHighlightNextKey(preset.highlightNextKey);
    setShowFingerGuidance(preset.showFingerGuidance);
    setShowCurrentCharacter(preset.showCurrentCharacter);
    setShowNextCharacter(preset.showNextCharacter);
    setShowLiveWpm(preset.showLiveWpm);
    setShowNetWpm(preset.showNetWpm);
    setShowGrossWpm(preset.showGrossWpm);
    setShowLiveAccuracy(preset.showLiveAccuracy);
    setAutoStartOnKeyPress(preset.autoStartOnKeyPress);
    setShowCountdown(preset.showCountdown);
    setRecordAnalytics(preset.recordAnalytics);
    setRecordMistakes(preset.recordMistakes);
    setRecordCorrectedMistakes(preset.recordCorrectedMistakes);
    setFontSize(preset.fontSize);
    if (preset.fontFamily) setFontFamily(preset.fontFamily);
    if (preset.lineSpacing) setLineSpacing(preset.lineSpacing);
    if (preset.textAreaSize) setTextAreaSize(preset.textAreaSize);
  };

  // Handle Save New Preset
  const handleSavePreset = () => {
    if (!presetNameInput.trim()) return;
    const newPreset: CustomPreset = {
      id: `preset-${Date.now()}`,
      name: presetNameInput.trim(),
      icon: '⚙️',
      description: `${timerMode === 'no_limit' ? 'No Time Limit' : `${effectiveDuration}s`}, ${mistakeMode === 'strict' ? 'Strict Mode' : 'Allow Mistakes'}`,
      language,
      durationSeconds: effectiveDuration,
      noTimeLimit: timerMode === 'no_limit',
      mistakeMode,
      maxMistakes: maxMistakesType === 'none' ? null : maxMistakesType === 'custom' ? customMaxMistakes : parseInt(maxMistakesType, 10),
      maxMistakesAction,
      backspaceEnabled,
      showHints,
      showKeyboard,
      highlightNextKey,
      showFingerGuidance,
      showCurrentCharacter,
      showNextCharacter,
      showLiveWpm,
      showNetWpm,
      showGrossWpm,
      showLiveAccuracy,
      autoStartOnKeyPress,
      showCountdown,
      recordAnalytics,
      recordMistakes,
      recordCorrectedMistakes,
      fontSize,
      fontFamily,
      difficulty: 'medium',
      lineSpacing,
      textAreaSize
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    saveCustomPresets(updated);
    setPresetNameInput('');
    setPresetSavedSuccess(true);
    setTimeout(() => setPresetSavedSuccess(false), 2500);
  };

  // Handle Delete Preset
  const handleDeletePreset = (id: string) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    saveCustomPresets(updated);
  };

  // Handle Start Test
  const handleStartTest = () => {
    if (!customText.trim()) return;

    const finalText = lokSewaMode ? ensureLokSewaMinimumWords(customText.trim(), 300) : customText.trim();

    const finalMaxMistakes = maxMistakesType === 'none'
      ? null
      : maxMistakesType === 'custom'
      ? customMaxMistakes
      : parseInt(maxMistakesType, 10);

    const updatedSettings: Partial<TestSettings> = {
      language,
      testType: 'custom',
      customText: finalText,
      lokSewaMode,
      durationSeconds: lokSewaMode ? 300 : effectiveDuration,
      noTimeLimit: lokSewaMode ? false : timerMode === 'no_limit',
      mistakeMode,
      maxMistakes: finalMaxMistakes,
      maxMistakesAction,
      backspaceEnabled,
      showHints,
      showKeyboard,
      highlightNextKey,
      showFingerGuidance,
      showCurrentCharacter,
      showNextCharacter,
      showLiveWpm,
      showNetWpm,
      showGrossWpm,
      showLiveAccuracy,
      autoStartOnKeyPress,
      showCountdown,
      recordAnalytics,
      recordMistakes,
      recordCorrectedMistakes,
      fontSize,
      fontFamily,
      lineSpacing,
      textAreaSize
    };

    onStartCustomTest(finalText, updatedSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Custom Typing Test Studio</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold uppercase tracking-wider">
                  {language === 'nepali' ? '🇳🇵 Nepali' : '🇬🇧 English'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste or write your own practice text, customize timers, mistake handling, and keyboard hints.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lok Sewa Exam Mode Toggle */}
            <LokSewaToggle
              isEnabled={lokSewaMode}
              onToggle={(enabled) => {
                setLokSewaMode(enabled);
                if (enabled) {
                  setTimerMode('preset');
                  setSelectedDuration(300);
                }
              }}
              language={language}
            />

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setLanguage('nepali')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  language === 'nepali'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🇳🇵 Nepali
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  language === 'english'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                🇬🇧 English
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ========================================================================= */}
          {/* 1. CUSTOM TEXT INPUT BOX & QUICK PREVIEWS */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Custom Text / Paragraph Input</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      if (text) setCustomText(text);
                    } catch (e) {
                      // Clipboard permission
                    }
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste from Clipboard</span>
                </button>

                {customText && (
                  <button
                    onClick={() => setCustomText('')}
                    className="px-2 py-1 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-all cursor-pointer"
                  >
                    Clear Text
                  </button>
                )}
              </div>
            </div>

            {/* Curated Sample Passages Quick Load */}
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Sample Presets:</span>
              {language === 'nepali' ? (
                <>
                  <button
                    onClick={() => setCustomText(SAMPLE_PARAGRAPHS.constitution)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    📜 Nepal Constitution (२०७२)
                  </button>
                  <button
                    onClick={() => setCustomText(SAMPLE_PARAGRAPHS.supreme_court_judgment)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    ⚖️ Supreme Court Judgment
                  </button>
                  <button
                    onClick={() => setCustomText(LEGAL_PASSAGES[0].text)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    📝 Lok Sewa Model Set
                  </button>
                  <button
                    onClick={() => setCustomText(SAMPLE_PARAGRAPHS.general_quote)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    💡 Wisdom Quote
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCustomText(ENGLISH_PARAGRAPH_TESTS[0].text)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    💻 Technology Article
                  </button>
                  <button
                    onClick={() => setCustomText(ENGLISH_PARAGRAPH_TESTS[1].text)}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    ⚖️ Legal & Constitutional
                  </button>
                  <button
                    onClick={() => setCustomText('The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow. Pack my box with five dozen liquor jugs.')}
                    className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    🔤 Pangram Speed Sentences
                  </button>
                </>
              )}
            </div>

            {/* Main Textarea */}
            <div className="relative">
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder={
                  language === 'nepali'
                    ? 'यहाँ आफ्नो नेपाली पाठ, कानुनी फैसला, लोक सेवा नमुना प्रश्न वा अभ्यास सामग्री लेख्नुहोस् वा टाँस्नुहोस्...'
                    : 'Paste or type your custom English text, legal paragraph, programming text, or practice material here...'
                }
                rows={6}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 text-base focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-normal leading-relaxed nepali-font-apply"
                style={{ fontFamily: language === 'nepali' ? 'var(--app-nepali-font)' : 'inherit' }}
              />
            </div>

            {/* Live Text Metrics Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Characters</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                    {textStats.characterCount} <span className="text-[10px] font-normal text-slate-400">({textStats.characterCountNoSpaces} no spaces)</span>
                  </span>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Words</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                    {textStats.wordCount}
                  </span>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Paragraphs</span>
                  <span className="font-mono font-black text-slate-900 dark:text-slate-100 text-sm">
                    {textStats.paragraphCount}
                  </span>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Duration</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    ~{Math.round(textStats.estimatedTimeSecondsAt30Wpm / 60) || 1} min
                  </span>
                </div>
              </div>

              {/* Difficulty Rating Pill */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Difficulty:</span>
                <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1 ${
                  textStats.estimatedDifficulty === 'expert'
                    ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : textStats.estimatedDifficulty === 'hard'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    : textStats.estimatedDifficulty === 'medium'
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}>
                  <span>{textStats.estimatedDifficulty}</span>
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. CUSTOM TIMER CONFIGURATION */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Test Duration & Timer Mode</span>
              </label>

              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                {timerMode === 'no_limit' ? 'No Time Limit (Until Finished)' : `${effectiveDuration}s (${Math.round(effectiveDuration / 60 * 10) / 10}m)`}
              </span>
            </div>

            {/* Presets + Custom + No Limit Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {[
                { label: '15s', sec: 15 },
                { label: '30s', sec: 30 },
                { label: '1 min', sec: 60 },
                { label: '2 min', sec: 120 },
                { label: '3 min', sec: 180 },
                { label: '5 min', sec: 300 },
                { label: '10 min', sec: 600 }
              ].map(item => (
                <button
                  key={item.sec}
                  type="button"
                  onClick={() => {
                    setTimerMode('preset');
                    setSelectedDuration(item.sec);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer ${
                    timerMode === 'preset' && selectedDuration === item.sec
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* No Time Limit Button */}
              <button
                type="button"
                onClick={() => setTimerMode('no_limit')}
                className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center justify-center ${
                  timerMode === 'no_limit'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-300'
                }`}
              >
                <span>♾️ No Limit</span>
                <span className="text-[9px] opacity-80 mt-0.5">Finish text</span>
              </button>
            </div>

            {/* Custom Duration Input Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setTimerMode('custom')}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  timerMode === 'custom'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>⏱️ Custom Time:</span>
              </button>

              {timerMode === 'custom' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="5"
                    max="3600"
                    value={customTimeInput}
                    onChange={(e) => setCustomTimeInput(e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Duration"
                  />
                  <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-0.5 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setCustomTimeUnit('sec')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        customTimeUnit === 'sec'
                          ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Seconds
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTimeUnit('min')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        customTimeUnit === 'min'
                          ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Minutes
                    </button>
                  </div>
                </div>
              )}

              {timerMode === 'no_limit' && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ The test will automatically end the exact instant you finish typing the complete custom passage.
                </span>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. ADVANCED CUSTOM SETTINGS COLLAPSIBLE / MODAL PANEL */}
          {/* ========================================================================= */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            <button
              type="button"
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
              className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 block">
                    ⚙️ Advanced Custom Settings
                  </span>
                  <span className="text-xs text-slate-500">
                    Configure Mistake Handling, Backspace, Live Hints, Keyboard, WPM & Saved Presets
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {showAdvancedSettings ? 'Hide Settings ▲' : 'Open Settings ▼'}
                </span>
              </div>
            </button>

            {showAdvancedSettings && (
              <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                
                {/* Advanced Sub-Tabs */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto text-xs font-bold">
                  {[
                    { id: 'mistakes', label: '1. Mistakes & Modes' },
                    { id: 'backspace', label: '2. Backspace' },
                    { id: 'hints', label: '3. Hints & Keys' },
                    { id: 'keyboard', label: '4. Keyboard' },
                    { id: 'wpm', label: '5. WPM & Stats' },
                    { id: 'display', label: '6. Display & Fonts' },
                    { id: 'behavior', label: '7. Test Behavior' },
                    { id: 'presets', label: '8. Saved Presets' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setAdvancedTab(tab.id as any)}
                      className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                        advancedTab === tab.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab 1: Mistake Settings */}
                {advancedTab === 'mistakes' && (
                  <div className="space-y-5 animate-fadeIn">
                    <div>
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                        Wrong Input Handling Mode
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <label
                          onClick={() => setMistakeMode('strict')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                            mistakeMode === 'strict'
                              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                              <span>🛡️ Strict Mode</span>
                              {mistakeMode === 'strict' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold uppercase">
                              Recommended
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            <strong>Wrong characters are NOT accepted.</strong> Cursor does not advance. User must type the correct character. All errors are permanently logged in Analytics.
                          </p>
                        </label>

                        <label
                          onClick={() => setMistakeMode('allow')}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                            mistakeMode === 'allow'
                              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                              <span>✍️ Allow Mistakes</span>
                              {mistakeMode === 'allow' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Allows incorrect characters to be typed normally. Calculates Gross WPM, Net WPM, mistyped words, and accuracy at the end.
                          </p>
                        </label>
                      </div>
                    </div>

                    {/* Maximum Mistakes Threshold */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        Maximum Mistakes Limit
                      </h4>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { id: 'none', label: 'No Limit' },
                          { id: '5', label: '5 Mistakes' },
                          { id: '10', label: '10 Mistakes' },
                          { id: '20', label: '20 Mistakes' },
                          { id: 'custom', label: 'Custom' }
                        ].map(opt => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setMaxMistakesType(opt.id as any)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              maxMistakesType === opt.id
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}

                        {maxMistakesType === 'custom' && (
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={customMaxMistakes}
                            onChange={(e) => setCustomMaxMistakes(parseInt(e.target.value, 10) || 1)}
                            className="w-20 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
                          />
                        )}
                      </div>

                      {maxMistakesType !== 'none' && (
                        <div className="flex items-center gap-3 pt-1">
                          <span className="text-xs text-slate-500 font-bold">When max reached:</span>
                          <button
                            type="button"
                            onClick={() => setMaxMistakesAction('end_test')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              maxMistakesAction === 'end_test'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            End Test Automatically
                          </button>
                          <button
                            type="button"
                            onClick={() => setMaxMistakesAction('continue')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              maxMistakesAction === 'continue'
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            Continue Typing
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 2: Backspace Settings */}
                {advancedTab === 'backspace' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Backspace Correction Policy
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setBackspaceEnabled(true)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          backspaceEnabled
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                          <span>✓ Backspace Enabled</span>
                          {backspaceEnabled && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Allows you to erase and correct typing mistakes.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBackspaceEnabled(false)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          !backspaceEnabled
                            ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between">
                          <span>🚫 Backspace Disabled</span>
                          {!backspaceEnabled && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Locks keystrokes. Simulates real-world typewriter examinations.
                        </p>
                      </button>
                    </div>

                    {/* Crucial Accuracy Rule Notice */}
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Permanent Analytics Tracking Policy</span>
                      </div>
                      <p>
                        Even when mistakes are corrected with Backspace and Final Submitted Text Accuracy reaches 100%, the original mistakes, keystrokes, and backspaces remain permanently recorded in your Analytics.
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 3: Hint Settings */}
                {advancedTab === 'hints' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Live Exact-Character Hint Engine
                    </h4>

                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <Lightbulb className={`w-4 h-4 ${showHints ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                          <span>Live Upcoming Character & Key Hint</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Shows the exact upcoming character and exact required key continuously.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowHints(!showHints)}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          showHints
                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Hint: {showHints ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    {/* Hint Preview Box */}
                    <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-mono space-y-2 border border-slate-200 dark:border-slate-700">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Live Example Preview:</div>
                      {language === 'nepali' ? (
                        <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200">
                          <div>Upcoming Character: <strong className="text-amber-600 dark:text-amber-400 text-base">ट</strong></div>
                          <div>Required Romanized Key: <kbd className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black">Q / T</kbd></div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200">
                          <div>Next Character: <strong className="text-blue-600 dark:text-blue-400 text-base">T</strong></div>
                          <div>Next Key: <kbd className="px-2 py-0.5 rounded bg-blue-600 text-white font-black">T</kbd></div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 4: Keyboard Settings */}
                {advancedTab === 'keyboard' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      On-Screen Keyboard & Guidance
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: 'showKeyboard', label: 'Show On-Screen Keyboard Heatmap', state: showKeyboard, set: setShowKeyboard },
                        { key: 'highlightNextKey', label: 'Highlight Next Key in Real-Time', state: highlightNextKey, set: setHighlightNextKey },
                        { key: 'showFingerGuidance', label: 'Show Touch Finger Placement Guidance', state: showFingerGuidance, set: setShowFingerGuidance },
                        { key: 'showCurrentCharacter', label: 'Show Current Character Indicator', state: showCurrentCharacter, set: setShowCurrentCharacter },
                        { key: 'showNextCharacter', label: 'Show Next Character Indicator', state: showNextCharacter, set: setShowNextCharacter }
                      ].map(item => (
                        <label
                          key={item.key}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300"
                        >
                          <span>{item.label}</span>
                          <input
                            type="checkbox"
                            checked={item.state}
                            onChange={(e) => item.set(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 5: WPM Settings */}
                {advancedTab === 'wpm' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      WPM & Accuracy Metrics Display
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Live WPM (Real-time speed)', state: showLiveWpm, set: setShowLiveWpm },
                        { label: 'Net WPM (Penalized accuracy speed)', state: showNetWpm, set: setShowNetWpm },
                        { label: 'Gross WPM (Raw keystroke speed)', state: showGrossWpm, set: setShowGrossWpm },
                        { label: 'Live Accuracy %', state: showLiveAccuracy, set: setShowLiveAccuracy }
                      ].map((item, idx) => (
                        <label
                          key={idx}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300"
                        >
                          <span>{item.label}</span>
                          <input
                            type="checkbox"
                            checked={item.state}
                            onChange={(e) => item.set(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 6: Display & Fonts */}
                {advancedTab === 'display' && (
                  <div className="space-y-4 animate-fadeIn">
                    {language === 'nepali' && (
                      <FontSelector
                        currentFont={fontFamily}
                        onSelectFont={(f) => setFontFamily(f)}
                        variant="compact"
                      />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Font Size
                        </label>
                        <div className="grid grid-cols-4 gap-1.5">
                          {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setFontSize(sz)}
                              className={`py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                                fontSize === sz
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Line Spacing
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(['normal', 'relaxed', 'loose'] as const).map(sp => (
                            <button
                              key={sp}
                              type="button"
                              onClick={() => setLineSpacing(sp)}
                              className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                                lineSpacing === sp
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {sp}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                          Text Area Size
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          {(['compact', 'standard', 'spacious'] as const).map(sz => (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => setTextAreaSize(sz)}
                              className={`py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                                textAreaSize === sz
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 7: Test Behavior */}
                {advancedTab === 'behavior' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      Test Triggers & Analytics Logging
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { label: 'Auto-start when first key is pressed', state: autoStartOnKeyPress, set: setAutoStartOnKeyPress },
                        { label: 'Show 3-2-1 Countdown before start', state: showCountdown, set: setShowCountdown },
                        { label: 'Record to Global User Analytics (Default: ON)', state: recordAnalytics, set: setRecordAnalytics },
                        { label: 'Record mistake logs & weak characters', state: recordMistakes, set: setRecordMistakes },
                        { label: 'Record corrected mistakes & backspaces', state: recordCorrectedMistakes, set: setRecordCorrectedMistakes }
                      ].map((item, idx) => (
                        <label
                          key={idx}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300"
                        >
                          <span>{item.label}</span>
                          <input
                            type="checkbox"
                            checked={item.state}
                            onChange={(e) => item.set(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 8: Saved Presets */}
                {advancedTab === 'presets' && (
                  <div className="space-y-5 animate-fadeIn">
                    {/* Save Current Configuration as Preset */}
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300 block">
                        Save Current Settings as New Preset
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={presetNameInput}
                          onChange={(e) => setPresetNameInput(e.target.value)}
                          placeholder="Preset name (e.g. Legal Judiciary 3-Min)..."
                          className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={handleSavePreset}
                          disabled={!presetNameInput.trim()}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Preset</span>
                        </button>
                      </div>
                      {presetSavedSuccess && (
                        <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Preset saved successfully to storage!</span>
                        </div>
                      )}
                    </div>

                    {/* Presets List */}
                    <div className="space-y-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                        My Saved & Standard Presets
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {presets.map(preset => (
                          <div
                            key={preset.id}
                            className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-extrabold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                                <span>{preset.name}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                                {preset.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => applyPreset(preset)}
                                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer shadow-xs"
                              >
                                Apply
                              </button>
                              {preset.id.startsWith('preset-') && !DEFAULT_CUSTOM_PRESETS.some(d => d.id === preset.id) && (
                                <button
                                  type="button"
                                  onClick={() => handleDeletePreset(preset.id)}
                                  className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* 4. PRE-TEST SUMMARY / START SCREEN */}
          {/* ========================================================================= */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Custom Typing Test Summary</span>
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                Ready to Launch
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Language</span>
                <span className="font-extrabold text-white">{language === 'nepali' ? '🇳🇵 Nepali' : '🇬🇧 English'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Volume</span>
                <span className="font-extrabold text-white">{textStats.wordCount} Words ({textStats.characterCount} Chars)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Time Limit</span>
                <span className="font-extrabold text-amber-300">{timerMode === 'no_limit' ? 'No Limit (Complete text)' : `${effectiveDuration}s`}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Mistake Mode</span>
                <span className="font-extrabold text-emerald-400">{mistakeMode === 'strict' ? 'Strict Mode' : 'Allow Mistakes'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Backspace</span>
                <span className="font-extrabold text-slate-200">{backspaceEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Live Hints</span>
                <span className="font-extrabold text-slate-200">{showHints ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Keyboard Heatmap</span>
                <span className="font-extrabold text-slate-200">{showKeyboard ? 'Enabled' : 'Disabled'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Analytics</span>
                <span className="font-extrabold text-emerald-400">{recordAnalytics ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartTest}
            disabled={!customText.trim()}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>START TEST</span>
          </button>
        </div>

      </div>
    </div>
  );
};
