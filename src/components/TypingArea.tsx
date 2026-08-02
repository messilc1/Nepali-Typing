import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  RotateCcw,
  Clock,
  Type,
  FileText,
  Scale,
  Quote,
  Sparkles,
  Command,
  Languages,
  Sliders,
  Lightbulb,
  HelpCircle
} from 'lucide-react';
import { TestSettings, TestResult, KeyStats } from '../types';
import { transliterateWordRuleBased, getWordSuggestions, getRomanizedHintForWord } from '../utils/nepaliTransliteration';
import { playKeypressSound, playErrorSound } from '../utils/soundEffects';

interface TypingAreaProps {
  settings: TestSettings;
  updateSettings: (partial: Partial<TestSettings>) => void;
  targetText: string;
  onTestComplete: (result: TestResult) => void;
  onRestartTest: () => void;
  onOpenCustomParagraph: () => void;
  onKeypressMetric: (key: string, isCorrect: boolean, latencyMs: number) => void;
  onNextHintKeyChange?: (key: string | undefined) => void;
}

export interface TypingAreaRef {
  focusInput: () => void;
}

export const TypingArea = forwardRef<TypingAreaRef, TypingAreaProps>(({
  settings,
  updateSettings,
  targetText,
  onTestComplete,
  onRestartTest,
  onOpenCustomParagraph,
  onKeypressMetric,
  onNextHintKeyChange
}, ref) => {
  // Input state
  const [typedInput, setTypedInput] = useState<string>(''); // For current word in Romanized mode or full text
  const [typedHistory, setTypedHistory] = useState<string[]>([]); // Array of committed words
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  
  // Romanized buffer & candidates
  const [romanBuffer, setRomanBuffer] = useState<string>('');
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);

  // Test state
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  
  // Realtime counters
  const [keystrokes, setKeystrokes] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [backspacesCount, setBackspacesCount] = useState<number>(0);

  // Key tracking metrics
  const keyStatsRef = useRef<Record<string, KeyStats>>({});
  const mistypedWordsRef = useRef<Record<string, number>>({});
  const mistypedCharsRef = useRef<Record<string, number>>({});
  const lastKeyTimeRef = useRef<number | null>(null);
  const wpmSamplesRef = useRef<{ second: number; wpm: number; rawWpm: number; errors: number }[]>([]);

  // DOM Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const targetWords = targetText.trim().split(/\s+/).filter(Boolean);

  // Typing Hint Calculation
  const currentTargetWord = targetWords[currentWordIndex] || '';
  const fullHint = getRomanizedHintForWord(currentTargetWord);

  let matchedPrefixLen = 0;
  let hasMismatch = false;

  const currentBuffer = settings.language === 'nepali' ? romanBuffer : typedInput;
  const lowerBuf = currentBuffer.toLowerCase();
  const lowerHint = fullHint.toLowerCase();

  for (let i = 0; i < lowerBuf.length; i++) {
    if (i < lowerHint.length && lowerBuf[i] === lowerHint[i]) {
      matchedPrefixLen = i + 1;
    } else {
      hasMismatch = true;
      break;
    }
  }

  let nextHintKey: string | undefined = undefined;
  if (settings.showHints && currentTargetWord && !isTestFinished) {
    if (matchedPrefixLen < fullHint.length) {
      nextHintKey = fullHint[matchedPrefixLen];
    } else if (typedInput === currentTargetWord || (settings.language === 'nepali' && romanBuffer.length >= fullHint.length)) {
      nextHintKey = ' ';
    }
  }

  useEffect(() => {
    if (settings.showHints) {
      onNextHintKeyChange?.(nextHintKey);
    } else {
      onNextHintKeyChange?.(undefined);
    }
  }, [settings.showHints, nextHintKey, onNextHintKeyChange]);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    }
  }));

  // Auto focus input on load / click
  useEffect(() => {
    inputRef.current?.focus();
  }, [targetText, settings.language]);

  // Reset state when targetText or settings change
  useEffect(() => {
    resetState();
  }, [targetText, settings.language, settings.testType, settings.durationSeconds, settings.wordCount]);

  const resetState = () => {
    setTypedInput('');
    setTypedHistory([]);
    setCurrentWordIndex(0);
    setRomanBuffer('');
    setActiveSuggestions([]);
    setIsTestRunning(false);
    setIsTestFinished(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setKeystrokes(0);
    setMistakesCount(0);
    setBackspacesCount(0);
    keyStatsRef.current = {};
    mistypedWordsRef.current = {};
    mistypedCharsRef.current = {};
    lastKeyTimeRef.current = null;
    wpmSamplesRef.current = [];
  };

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTestRunning && !isTestFinished && startTime !== null) {
      interval = setInterval(() => {
        const now = Date.now();
        const seconds = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(seconds);

        // Record WPM sample for graph every second
        const totalCharsTyped = typedHistory.join(' ').length + typedInput.length;
        const grossWpmSample = seconds > 0 ? Math.round((totalCharsTyped / 5) / (seconds / 60)) : 0;
        const netWpmSample = seconds > 0 ? Math.max(0, Math.round(((totalCharsTyped - mistakesCount * 5) / 5) / (seconds / 60))) : 0;

        wpmSamplesRef.current.push({
          second: seconds,
          wpm: netWpmSample,
          rawWpm: grossWpmSample,
          errors: mistakesCount
        });

        // Time-based test completion check
        if (settings.testType === 'time' && settings.durationSeconds > 0) {
          if (seconds >= settings.durationSeconds) {
            finishTest(seconds);
          }
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTestRunning, isTestFinished, startTime, typedHistory, typedInput, mistakesCount, settings.testType, settings.durationSeconds]);

  // Finish test and calculate full statistics
  const finishTest = (finalElapsedSec?: number) => {
    if (isTestFinished) return;
    setIsTestFinished(true);
    setIsTestRunning(false);

    const timeSpent = Math.max(1, finalElapsedSec ?? elapsedSeconds);

    // Calculate metrics
    let correctChars = 0;
    let wrongChars = 0;
    let correctWords = 0;
    let wrongWords = 0;

    targetWords.forEach((word, idx) => {
      const typed = typedHistory[idx] || (idx === currentWordIndex ? typedInput : '');
      if (!typed) return;

      if (typed === word) {
        correctWords++;
        correctChars += word.length + 1; // +1 for space
      } else {
        wrongWords++;
        // Compare char by char
        for (let i = 0; i < Math.max(word.length, typed.length); i++) {
          if (typed[i] === word[i]) {
            correctChars++;
          } else {
            wrongChars++;
          }
        }
      }
    });

    const totalTypedChars = correctChars + wrongChars;
    const grossWpm = Math.round((totalTypedChars / 5) / (timeSpent / 60));
    const netWpm = Math.max(0, Math.round(((correctChars - wrongChars) / 5) / (timeSpent / 60)));
    const accuracy = totalTypedChars > 0 ? Math.min(100, Math.round((correctChars / totalTypedChars) * 100)) : 100;

    let performanceGrade: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' = 'Average';
    if (netWpm >= 50 && accuracy >= 95) performanceGrade = 'Excellent';
    else if (netWpm >= 30 && accuracy >= 90) performanceGrade = 'Good';
    else if (netWpm >= 15 && accuracy >= 80) performanceGrade = 'Average';
    else performanceGrade = 'Needs Improvement';

    // Calculate consistency %
    const samples = wpmSamplesRef.current.map(s => s.wpm);
    let consistency = 85;
    if (samples.length > 1) {
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(50, Math.min(100, Math.round(100 - (stdDev / (mean || 1)) * 50)));
    }

    const resultObj: TestResult = {
      id: 'test_' + Date.now(),
      timestamp: Date.now(),
      language: settings.language,
      testType: settings.testType,
      durationSeconds: settings.durationSeconds,
      elapsedSeconds: timeSpent,
      grossWpm,
      netWpm,
      accuracy,
      totalCharactersTyped: totalTypedChars,
      correctCharacters: correctChars,
      wrongCharacters: wrongChars,
      totalWordsTyped: typedHistory.length,
      correctWords,
      wrongWords,
      mistakesCount,
      backspacesCount,
      consistencyPercent: consistency,
      performanceGrade,
      wpmOverTime: wpmSamplesRef.current.length > 0 ? wpmSamplesRef.current : [{ second: timeSpent, wpm: netWpm, rawWpm: grossWpm, errors: mistakesCount }],
      keyStatsMap: keyStatsRef.current,
      mistypedWordsMap: mistypedWordsRef.current,
      mistypedCharsMap: mistypedCharsRef.current,
      slowWordsMap: {},
      sampleText: targetText.substring(0, 100) + '...'
    };

    onTestComplete(resultObj);
  };

  // Handle Keystrokes & Romanized Conversion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTestFinished) return;

    // Shortcuts
    if (e.ctrlKey && e.code === 'Space') {
      e.preventDefault();
      updateSettings({
        language: settings.language === 'nepali' ? 'english' : 'nepali'
      });
      return;
    }

    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      onRestartTest();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      resetState();
      return;
    }

    // Start timer on first keystroke
    if (!isTestRunning) {
      setIsTestRunning(true);
      setStartTime(Date.now());
    }

    // Sound feedback
    const now = Date.now();
    const latency = lastKeyTimeRef.current ? now - lastKeyTimeRef.current : 50;
    lastKeyTimeRef.current = now;

    if (e.key === 'Backspace') {
      setBackspacesCount(prev => prev + 1);
      playKeypressSound(settings.sound, settings.soundVolume);

      if (settings.language === 'nepali') {
        if (romanBuffer.length > 0) {
          const newBuf = romanBuffer.slice(0, -1);
          setRomanBuffer(newBuf);
          const converted = transliterateWordRuleBased(newBuf);
          setTypedInput(converted);
          setActiveSuggestions(getWordSuggestions(newBuf));
        } else if (typedInput.length > 0) {
          setTypedInput(prev => prev.slice(0, -1));
        } else if (currentWordIndex > 0) {
          // Move back to previous word
          const prevIdx = currentWordIndex - 1;
          setCurrentWordIndex(prevIdx);
          setTypedInput(typedHistory[prevIdx] || '');
          setTypedHistory(prev => prev.slice(0, -1));
        }
      }
      return;
    }

    // Handle space key -> word commit
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      if (!typedInput.trim() && !romanBuffer) return;

      const currentTargetWord = targetWords[currentWordIndex] || '';
      const finalWord = typedInput;

      // Track accuracy and mistakes
      if (finalWord !== currentTargetWord) {
        setMistakesCount(prev => prev + 1);
        playErrorSound(settings.soundVolume);
        mistypedWordsRef.current[currentTargetWord] = (mistypedWordsRef.current[currentTargetWord] || 0) + 1;
      } else {
        playKeypressSound(settings.sound, settings.soundVolume);
      }

      // Record key metrics
      const keyKey = e.key.toLowerCase();
      onKeypressMetric(keyKey, finalWord === currentTargetWord, latency);

      // Commit word
      setTypedHistory(prev => [...prev, finalWord]);
      const nextWordIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextWordIdx);
      setTypedInput('');
      setRomanBuffer('');
      setActiveSuggestions([]);

      // Check for Word count completion or end of passage
      if (
        (settings.testType === 'words' && nextWordIdx >= settings.wordCount) ||
        nextWordIdx >= targetWords.length
      ) {
        finishTest();
      }
      return;
    }

    // Regular keypress
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setKeystrokes(prev => prev + 1);
      playKeypressSound(settings.sound, settings.soundVolume);

      if (settings.language === 'nepali') {
        const newBuf = romanBuffer + e.key;
        setRomanBuffer(newBuf);
        const converted = transliterateWordRuleBased(newBuf);
        setTypedInput(converted);
        setActiveSuggestions(getWordSuggestions(newBuf));
      } else {
        setTypedInput(prev => prev + e.key);
      }
    }
  };

  // Scroll current word into view smoothly
  useEffect(() => {
    if (activeWordRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [currentWordIndex]);

  // Compute font size class
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'sm': return 'text-lg leading-relaxed';
      case 'md': return 'text-xl leading-relaxed sm:text-2xl sm:leading-loose';
      case 'lg': return 'text-2xl leading-loose sm:text-3xl sm:leading-loose';
      case 'xl': return 'text-3xl leading-loose sm:text-4xl sm:leading-loose';
      default: return 'text-xl leading-relaxed sm:text-2xl sm:leading-loose';
    }
  };

  // Compute font family style
  const getFontFamilyStyle = () => {
    return { fontFamily: `'${settings.fontFamily}', 'Mukta', 'Noto Sans Devanagari', sans-serif` };
  };

  return (
    <div id="typing-area-container" className="w-full flex flex-col items-center gap-4">
      
      {/* Test Control Header Options */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        
        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          
          <button
            onClick={() => updateSettings({ testType: 'time' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              settings.testType === 'time'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Time</span>
          </button>

          <button
            onClick={() => updateSettings({ testType: 'words' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              settings.testType === 'words'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Words</span>
          </button>

          <button
            onClick={onOpenCustomParagraph}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              settings.testType === 'custom'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Custom Paragraph</span>
          </button>

          <button
            onClick={() => updateSettings({ testType: 'legal' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              settings.testType === 'legal'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Passage</span>
          </button>

          <button
            onClick={() => updateSettings({ testType: 'quote' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              settings.testType === 'quote'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Quotes</span>
          </button>

        </div>

        {/* Duration / Word Count Options Sub-Pills */}
        <div className="flex items-center gap-2 text-xs">
          {settings.testType === 'time' && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
              {[15, 30, 60, 120, 300].map(sec => (
                <button
                  key={sec}
                  onClick={() => updateSettings({ durationSeconds: sec })}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    settings.durationSeconds === sec
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </div>
          )}

          {settings.testType === 'words' && (
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
              {[10, 25, 50, 100, 250].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => updateSettings({ wordCount: cnt })}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                    settings.wordCount === cnt
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          )}

          {/* Difficulty selector */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
            {(['easy', 'medium', 'hard', 'expert'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => updateSettings({ difficulty: lvl })}
                className={`px-2 py-1 rounded-lg capitalize text-[11px] font-bold transition-all ${
                  settings.difficulty === lvl
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Typing Hint Toggle in Sidebar/Header */}
          <button
            onClick={() => updateSettings({ showHints: !settings.showHints })}
            title="Toggle Typing Hint (Romanized key sequence step-by-step)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              settings.showHints
                ? 'bg-amber-400 dark:bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <Lightbulb className={`w-3.5 h-3.5 ${settings.showHints ? 'fill-slate-950' : ''}`} />
            <span>Hint: {settings.showHints ? 'ON' : 'OFF'}</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={onRestartTest}
            title="Restart Test (Ctrl + Enter)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

      </div>

      {/* Main Typing Canvas */}
      <div
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
        className="relative w-full min-h-[220px] max-h-[400px] bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border-2 border-slate-200/80 dark:border-slate-800 shadow-lg hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-text overflow-hidden select-none flex flex-col justify-between"
      >
        {/* Hidden Input field capturing keystrokes */}
        <input
          ref={inputRef}
          type="text"
          value={romanBuffer}
          onKeyDown={handleKeyDown}
          onChange={() => {}} // Controlled by onKeyDown
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          autoFocus
        />

        {/* Romanized Hint Mode Banner (Unobtrusive floating hint bar) */}
        {settings.showHints && currentTargetWord && !isTestFinished && (
          <div className="mb-4 w-full bg-gradient-to-r from-amber-50 via-amber-50/90 to-amber-100/60 dark:from-amber-950/70 dark:via-amber-900/40 dark:to-amber-950/30 border-2 border-amber-300/80 dark:border-amber-700/80 p-3 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Hint Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-400 dark:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
                <Lightbulb className="w-3.5 h-3.5 fill-slate-950" />
                <span>Romanized Hint</span>
              </div>

              {/* Target Word */}
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100" style={getFontFamilyStyle()}>
                  {currentTargetWord}
                </span>
                <span className="text-amber-500 font-bold">→</span>
              </div>

              {/* Step-by-Step Character Highlights */}
              <div className="flex items-center gap-1 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 shadow-inner font-mono text-sm sm:text-base">
                {fullHint.split('').map((char, charIdx) => {
                  const isTypedCorrect = charIdx < matchedPrefixLen;
                  const isNextRequired = charIdx === matchedPrefixLen;

                  let charStyle = 'text-slate-400 dark:text-slate-500';
                  if (isTypedCorrect) {
                    charStyle = 'text-emerald-600 dark:text-emerald-400 font-black';
                  } else if (isNextRequired) {
                    charStyle = 'bg-amber-400 dark:bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded-lg ring-2 ring-amber-400/80 shadow-md animate-pulse';
                  }

                  return (
                    <span key={charIdx} className={`transition-all ${charStyle}`}>
                      {char}
                    </span>
                  );
                })}

                {/* Prompt Spacebar when word is finished */}
                {(matchedPrefixLen >= fullHint.length || typedInput === currentTargetWord) && (
                  <span className="ml-2 bg-amber-400 dark:bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-lg ring-2 ring-amber-400/80 shadow-md animate-pulse uppercase tracking-wider">
                    Space ↵
                  </span>
                )}
              </div>
            </div>

            {/* Mismatch indicator when wrong key pressed */}
            {hasMismatch && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100/90 dark:bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800">
                <span>Wrong key! Next required key:</span>
                <kbd className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded shadow-sm uppercase">
                  {nextHintKey === ' ' ? 'Space' : nextHintKey}
                </kbd>
              </div>
            )}

          </div>
        )}

        {/* Romanized Live Buffer Indicator (Floating Preview) */}
        {settings.language === 'nepali' && romanBuffer && (
          <div className="mb-4 inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-xl text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-sm animate-fadeIn">
            <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">
              Typed: <strong className="text-blue-900 dark:text-blue-200">{romanBuffer}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="flex items-center gap-1 text-base font-bold text-blue-700 dark:text-blue-300" style={getFontFamilyStyle()}>
              <Sparkles className="w-4 h-4 text-amber-500" />
              {typedInput}
            </span>
            {activeSuggestions.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <span>Suggestions:</span>
                {activeSuggestions.slice(1, 3).map((sug, i) => (
                  <span key={i} className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-800">
                    {sug}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Text View Container */}
        <div
          className={`w-full flex flex-wrap gap-x-3 gap-y-2 text-slate-400 dark:text-slate-500 font-normal transition-all ${getFontSizeClass()}`}
          style={getFontFamilyStyle()}
        >
          {targetWords.map((word, wordIdx) => {
            const isCurrent = wordIdx === currentWordIndex;
            const isTyped = wordIdx < currentWordIndex;
            const typedWord = typedHistory[wordIdx] || '';

            return (
              <span
                key={wordIdx}
                ref={isCurrent ? activeWordRef : null}
                className={`relative px-0.5 py-0.5 transition-all ${
                  isTyped
                    ? typedWord === word
                      ? 'text-blue-600 dark:text-blue-400 font-medium'
                      : ''
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {word.split('').map((char, charIdx) => {
                  let charClass = '';
                  if (isCurrent) {
                    if (charIdx < typedInput.length) {
                      if (typedInput[charIdx] === char) {
                        charClass = 'text-blue-600 dark:text-blue-400 font-medium';
                      } else {
                        charClass = 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 rounded px-0.5';
                      }
                    }
                    // No highlight for active alphabet (charIdx === typedInput.length) or upcoming alphabets
                  } else if (isTyped && typedWord !== word) {
                    if (charIdx < typedWord.length) {
                      if (typedWord[charIdx] === char) {
                        charClass = 'text-blue-600 dark:text-blue-400 font-medium';
                      } else {
                        charClass = 'text-rose-600 dark:text-rose-400 underline decoration-rose-500 decoration-2';
                      }
                    } else {
                      charClass = 'text-rose-400 dark:text-rose-600 opacity-60';
                    }
                  }

                  return (
                    <span key={charIdx} className={charClass}>
                      {char}
                    </span>
                  );
                })}

                {/* Extra characters typed beyond length */}
                {isCurrent && typedInput.length > word.length && (
                  <span className="text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 rounded px-0.5">
                    {typedInput.slice(word.length)}
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {/* Bottom Helper Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono">
              <Command className="w-3.5 h-3.5 text-blue-500" />
              <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Ctrl + Space</kbd> Switch Language
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">Ctrl + Enter</kbd> Restart
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Word {Math.min(currentWordIndex + 1, targetWords.length)} / {targetWords.length}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
});

TypingArea.displayName = 'TypingArea';
