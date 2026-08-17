import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef, useMemo, useCallback } from 'react';
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
import { TestSettings, TestResult, KeyStats, LiveStats, SessionStatus, DetailedWordError, DetailedCharError } from '../types';
import { transliterateWordRuleBased, getWordSuggestions, getRomanizedHintForWord } from '../utils/nepaliTransliteration';
import { validateStrictKeystroke, getNextExpectedKey } from '../utils/strictTypingEngine';
import { playKeypressSound, playErrorSound } from '../utils/soundEffects';
import { getFontCssValue } from '../utils/fonts';
import { extractSanitizedWords, areDevanagariWordsEquivalent, isCharacterEquivalent } from '../utils/textNormalizer';

interface TypingAreaProps {
  settings: TestSettings;
  updateSettings: (partial: Partial<TestSettings>) => void;
  targetText: string;
  passageTitle?: string;
  onTestComplete: (result: TestResult) => void;
  onRestartTest: () => void;
  onOpenCustomParagraph: () => void;
  onKeypressMetric: (key: string, isCorrect: boolean, latencyMs: number) => void;
  onNextHintKeyChange?: (key: string | undefined) => void;
  onLiveStatsChange?: (stats: LiveStats) => void;
  onLiveSessionUpdate?: (session: TestResult) => void;
}

export interface TypingAreaRef {
  focusInput: () => void;
}

export const TypingArea = forwardRef<TypingAreaRef, TypingAreaProps>(({
  settings,
  updateSettings,
  targetText,
  passageTitle,
  onTestComplete,
  onRestartTest,
  onOpenCustomParagraph,
  onKeypressMetric,
  onNextHintKeyChange,
  onLiveStatsChange,
  onLiveSessionUpdate
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
  const [inputShake, setInputShake] = useState<boolean>(false);
  const [rejectedKeyInfo, setRejectedKeyInfo] = useState<{ key: string; expected: string } | null>(null);

  // Sync Refs to avoid stale closures in interval & callbacks
  const typedInputRef = useRef<string>('');
  const typedHistoryRef = useRef<string[]>([]);
  const currentWordIndexRef = useRef<number>(0);
  const mistakesCountRef = useRef<number>(0);
  const backspacesCountRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const isTestRunningRef = useRef<boolean>(false);
  const isTestFinishedRef = useRef<boolean>(false);

  // Key tracking metrics
  const keyStatsRef = useRef<Record<string, KeyStats>>({});
  const mistypedWordsRef = useRef<Record<string, number>>({});
  const mistypedCharsRef = useRef<Record<string, number>>({});
  const lastKeyTimeRef = useRef<number | null>(null);
  const wpmSamplesRef = useRef<{ second: number; wpm: number; rawWpm: number; errors: number }[]>([]);
  const currentWordMistakesRef = useRef<number>(0);
  const currentWordBackspacesRef = useRef<number>(0);
  const currentWordStartTimeRef = useRef<number | null>(null);
  const currentWordErrorStartRef = useRef<number | null>(null);
  const currentWordMistypedSnapshotRef = useRef<string>('');
  const wordErrorsListRef = useRef<DetailedWordError[]>([]);
  const charErrorsListRef = useRef<DetailedCharError[]>([]);

  // DOM Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  const targetWords = useMemo(() => extractSanitizedWords(targetText), [targetText]);

  // Compute live statistics helper
  const computeLiveStats = useCallback((overrideElapsedSec?: number): LiveStats => {
    const words = targetWords;
    const history = typedHistoryRef.current;
    const curIdx = currentWordIndexRef.current;
    const input = typedInputRef.current;
    const mistakes = mistakesCountRef.current;
    const backspaces = backspacesCountRef.current;
    const start = startTimeRef.current;

    const now = Date.now();
    const timeSpentSec = start
      ? Math.max(0.1, (now - start) / 1000)
      : (overrideElapsedSec ?? 0);
    
    const elapsedSec = overrideElapsedSec ?? Math.floor(timeSpentSec);

    let correctChars = 0;
    let wrongChars = 0;
    let correctWords = 0;
    let wrongWords = 0;

    words.forEach((word, idx) => {
      const typed = history[idx] || (idx === curIdx ? input : '');
      if (!typed) return;

      if (typed === word) {
        if (idx < curIdx) {
          correctWords++;
          correctChars += word.length + 1; // +1 for space
        } else {
          correctChars += word.length;
        }
      } else {
        if (idx < curIdx) {
          wrongWords++;
        }
        const maxLen = Math.max(word.length, typed.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < typed.length && i < word.length && typed[i] === word[i]) {
            correctChars++;
          } else if (i < typed.length) {
            wrongChars++;
          }
        }
      }
    });

    const totalCharsTyped = correctChars + wrongChars;
    const minutes = timeSpentSec > 0 ? Math.max(1 / 60, timeSpentSec / 60) : 1 / 60;
    
    const grossWpm = start && timeSpentSec > 0 ? Math.round((totalCharsTyped / 5) / minutes) : 0;
    const netWpm = start && timeSpentSec > 0 ? Math.max(0, Math.round(((correctChars - wrongChars) / 5) / minutes)) : 0;
    const accuracy = totalCharsTyped > 0 ? Math.min(100, Math.max(0, Math.round((correctChars / totalCharsTyped) * 100))) : 100;

    let remainingSec: number | null = null;
    if (settings.testType === 'time' && settings.durationSeconds > 0) {
      remainingSec = Math.max(0, settings.durationSeconds - elapsedSec);
    }

    const samples = wpmSamplesRef.current.map(s => s.wpm);
    let consistency = 90;
    if (samples.length > 1) {
      const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
      const variance = samples.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / samples.length;
      const stdDev = Math.sqrt(variance);
      consistency = Math.max(50, Math.min(100, Math.round(100 - (stdDev / (mean || 1)) * 50)));
    }

    return {
      grossWpm,
      netWpm,
      accuracy,
      elapsedSeconds: elapsedSec,
      remainingSeconds: remainingSec,
      totalWords: words.length,
      completedWordsCount: history.length,
      mistakesCount: mistakes,
      backspacesCount: backspaces,
      totalCharactersTyped: totalCharsTyped,
      correctCharacters: correctChars,
      wrongCharacters: wrongChars,
      correctWords,
      wrongWords,
      consistency
    };
  }, [targetWords, settings.testType, settings.durationSeconds]);

  // Typing Hint Calculation - Fully Dynamic Real-Time Engine
  const currentTargetWord = targetWords[currentWordIndex] || '';

  const fullHint = useMemo(() => {
    if (!currentTargetWord) return '';
    if (settings.language === 'english') {
      return currentTargetWord.replace(/[.,!?:;"'()\[\]{}]/g, '').toLowerCase();
    }
    return getRomanizedHintForWord(currentTargetWord);
  }, [currentTargetWord, settings.language]);

  const currentBuffer = settings.language === 'nepali' ? romanBuffer : typedInput;

  const { matchedPrefixLen, hasMismatch, mismatchedChar, expectedChar } = useMemo(() => {
    const lowerBuf = currentBuffer.toLowerCase();
    const lowerHint = fullHint.toLowerCase();

    let prefixLen = 0;
    let mismatch = false;
    let badChar = '';
    let expChar = '';

    for (let i = 0; i < lowerBuf.length; i++) {
      if (i < lowerHint.length && lowerBuf[i] === lowerHint[i]) {
        prefixLen = i + 1;
      } else {
        mismatch = true;
        badChar = currentBuffer[i] || '';
        expChar = fullHint[i] || '';
        break;
      }
    }

    return {
      matchedPrefixLen: prefixLen,
      hasMismatch: mismatch,
      mismatchedChar: badChar,
      expectedChar: expChar
    };
  }, [currentBuffer, fullHint]);

  const isWordFullyTyped =
    (fullHint.length > 0 && matchedPrefixLen >= fullHint.length) ||
    typedInput === currentTargetWord;

  const nextHintKey = useMemo(() => {
    if (!settings.showHints || isTestFinished || !currentTargetWord) return undefined;
    if (isWordFullyTyped) return ' '; // Prompt spacebar
    if (matchedPrefixLen < fullHint.length) {
      return fullHint[matchedPrefixLen];
    }
    return undefined;
  }, [settings.showHints, isTestFinished, currentTargetWord, isWordFullyTyped, matchedPrefixLen, fullHint]);

  const completedPart = useMemo(() => fullHint.substring(0, matchedPrefixLen), [fullHint, matchedPrefixLen]);
  const remainingPart = useMemo(() => {
    const startIdx = matchedPrefixLen + (nextHintKey && nextHintKey !== ' ' ? 1 : 0);
    return fullHint.substring(startIdx);
  }, [fullHint, matchedPrefixLen, nextHintKey]);

  useEffect(() => {
    if (settings.showHints && !isTestFinished && currentTargetWord) {
      onNextHintKeyChange?.(nextHintKey);
    } else {
      onNextHintKeyChange?.(undefined);
    }
  }, [settings.showHints, isTestFinished, currentTargetWord, nextHintKey, onNextHintKeyChange]);

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    }
  }));

  // Auto focus input on load / click
  useEffect(() => {
    inputRef.current?.focus();
  }, [targetText, settings.language]);

  // Ref for active session tracking
  const sessionIdRef = useRef<string | null>(null);

  // Helper to construct real-time session record
  const emitLiveSession = useCallback((status: SessionStatus = 'Abandoned') => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = 'session_' + Date.now();
    }

    const liveStats = computeLiveStats();
    const historyLen = typedHistoryRef.current.length;
    const progressPercent = targetWords.length > 0 ? Math.min(100, Math.round((historyLen / targetWords.length) * 100)) : 0;

    const liveResult: TestResult = {
      id: sessionIdRef.current,
      timestamp: startTimeRef.current || Date.now(),
      lastActivityTimestamp: Date.now(),
      language: settings.language,
      testType: settings.testType,
      sessionStatus: status,
      progressPercent,
      durationSeconds: settings.durationSeconds,
      elapsedSeconds: liveStats.elapsedSeconds,
      remainingSeconds: liveStats.remainingSeconds,
      grossWpm: liveStats.grossWpm,
      netWpm: liveStats.netWpm,
      accuracy: liveStats.accuracy,
      totalCharactersTyped: liveStats.totalCharactersTyped,
      correctCharacters: liveStats.correctCharacters,
      wrongCharacters: liveStats.wrongCharacters,
      totalWordsTyped: liveStats.completedWordsCount,
      correctWords: liveStats.correctWords,
      wrongWords: liveStats.wrongWords,
      mistakesCount: liveStats.mistakesCount,
      backspacesCount: liveStats.backspacesCount,
      consistencyPercent: liveStats.consistency,
      performanceGrade: liveStats.netWpm >= 50 && liveStats.accuracy >= 95 ? 'Excellent' : liveStats.netWpm >= 30 && liveStats.accuracy >= 90 ? 'Good' : liveStats.netWpm >= 15 && liveStats.accuracy >= 80 ? 'Average' : 'Needs Improvement',
      wpmOverTime: wpmSamplesRef.current.length > 0 ? wpmSamplesRef.current : [{ second: liveStats.elapsedSeconds, wpm: liveStats.netWpm, rawWpm: liveStats.grossWpm, errors: liveStats.mistakesCount }],
      keyStatsMap: keyStatsRef.current,
      mistypedWordsMap: mistypedWordsRef.current,
      mistypedCharsMap: mistypedCharsRef.current,
      slowWordsMap: {},
      wordErrors: [...wordErrorsListRef.current],
      charErrors: [...charErrorsListRef.current],
      sampleText: targetText.substring(0, 100) + '...',
      categoryOrTitle: passageTitle || (
        settings.testType === 'legal'
          ? (settings.legalCategory || 'Lok Sewa Legal Pack')
          : settings.testType === 'custom'
          ? 'Custom Paragraph'
          : settings.testType === 'quote'
          ? 'Quote Test'
          : settings.testType === 'paragraph'
          ? 'Paragraph Test'
          : settings.testType === 'words'
          ? `${settings.wordCount} Words Test`
          : `${settings.durationSeconds}s Speed Test`
      )
    };

    onLiveSessionUpdate?.(liveResult);
  }, [computeLiveStats, targetWords, settings, targetText, passageTitle, onLiveSessionUpdate]);

  const resetState = useCallback(() => {
    sessionIdRef.current = null;
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

    typedInputRef.current = '';
    typedHistoryRef.current = [];
    currentWordIndexRef.current = 0;
    mistakesCountRef.current = 0;
    backspacesCountRef.current = 0;
    startTimeRef.current = null;
    isTestRunningRef.current = false;
    isTestFinishedRef.current = false;

    keyStatsRef.current = {};
    mistypedWordsRef.current = {};
    mistypedCharsRef.current = {};
    lastKeyTimeRef.current = null;
    wpmSamplesRef.current = [];
    currentWordMistakesRef.current = 0;
    currentWordBackspacesRef.current = 0;
    currentWordStartTimeRef.current = null;
    currentWordErrorStartRef.current = null;
    currentWordMistypedSnapshotRef.current = '';
    wordErrorsListRef.current = [];
    charErrorsListRef.current = [];

    onLiveStatsChange?.({
      grossWpm: 0,
      netWpm: 0,
      accuracy: 100,
      elapsedSeconds: 0,
      remainingSeconds: settings.testType === 'time' ? settings.durationSeconds : null,
      totalWords: targetWords.length,
      completedWordsCount: 0,
      mistakesCount: 0,
      backspacesCount: 0,
      totalCharactersTyped: 0,
      correctCharacters: 0,
      wrongCharacters: 0,
      correctWords: 0,
      wrongWords: 0,
      consistency: 100
    });
  }, [targetWords, settings.testType, settings.durationSeconds, onLiveStatsChange]);

  // Reset state when targetText or settings change
  useEffect(() => {
    resetState();
  }, [targetText, settings.language, settings.testType, settings.durationSeconds, settings.wordCount, resetState]);

  // Finish test and calculate full statistics
  const finishTest = useCallback((finalElapsedSec?: number) => {
    if (isTestFinishedRef.current) return;
    isTestFinishedRef.current = true;
    isTestRunningRef.current = false;
    setIsTestFinished(true);
    setIsTestRunning(false);

    const now = Date.now();
    const start = startTimeRef.current || now;
    const timeSpent = Math.max(1, finalElapsedSec ?? Math.floor((now - start) / 1000));

    // Calculate metrics
    let correctChars = 0;
    let wrongChars = 0;
    let correctWords = 0;
    let wrongWords = 0;

    const history = typedHistoryRef.current;
    const curWordIdx = currentWordIndexRef.current;
    const activeInput = typedInputRef.current;

    targetWords.forEach((word, idx) => {
      const typed = history[idx] || (idx === curWordIdx ? activeInput : '');
      if (!typed) return;

      if (typed === word) {
        if (idx < curWordIdx) {
          correctWords++;
          correctChars += word.length + 1; // +1 for space
        } else {
          correctChars += word.length;
        }
      } else {
        if (idx < curWordIdx) {
          wrongWords++;
        }
        for (let i = 0; i < Math.max(word.length, typed.length); i++) {
          if (i < typed.length && i < word.length && typed[i] === word[i]) {
            correctChars++;
          } else if (i < typed.length) {
            wrongChars++;
          }
        }
      }
    });

    // If the active word being typed had mistakes and wasn't committed with space yet:
    if (currentWordMistakesRef.current > 0) {
      const activeWord = targetWords[curWordIdx] || '';
      const isWordCompleted = activeInput === activeWord;
      const timeSpentOnWord = currentWordStartTimeRef.current ? (Date.now() - currentWordStartTimeRef.current) : 1000;
      const correctionTime = currentWordErrorStartRef.current ? (Date.now() - currentWordErrorStartRef.current) : 0;
      
      wordErrorsListRef.current.push({
        targetWord: activeWord,
        typedWord: currentWordMistypedSnapshotRef.current || activeInput || activeWord,
        mistakes: currentWordMistakesRef.current,
        corrected: isWordCompleted,
        timeSpentMs: timeSpentOnWord,
        backspacesUsed: currentWordBackspacesRef.current,
        correctionMethod: currentWordBackspacesRef.current > 0 ? 'Backspace' : 'None',
        correctionTimeMs: correctionTime,
        timestamp: Date.now()
      });
    }

    const totalTypedChars = correctChars + wrongChars;
    const minutes = Math.max(1 / 60, timeSpent / 60);
    const grossWpm = Math.round((totalTypedChars / 5) / minutes);
    const netWpm = Math.max(0, Math.round(((correctChars - wrongChars) / 5) / minutes));
    const accuracy = totalTypedChars > 0 ? Math.min(100, Math.max(0, Math.round((correctChars / totalTypedChars) * 100))) : 100;
    
    // Keystroke Accuracy factors in every mistake made before correction
    const totalKeystrokeAttempts = totalTypedChars + mistakesCountRef.current;
    const keystrokeAccuracy = totalKeystrokeAttempts > 0 
      ? Math.max(0, Math.min(100, Math.round((totalTypedChars / totalKeystrokeAttempts) * 100)))
      : accuracy;

    const correctedMistakesCount = wordErrorsListRef.current.filter(w => w.corrected).reduce((acc, w) => acc + w.mistakes, 0);
    const uncorrectedMistakesCount = wordErrorsListRef.current.filter(w => !w.corrected).reduce((acc, w) => acc + w.mistakes, 0);

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

    const isTimedOut = settings.testType === 'time' && (finalElapsedSec || elapsedSeconds) >= settings.durationSeconds;
    const sessionStatus: SessionStatus = isTimedOut ? 'Timed Out' : 'Completed';

    const resultObj: TestResult = {
      id: sessionIdRef.current || ('test_' + Date.now()),
      timestamp: startTimeRef.current || Date.now(),
      lastActivityTimestamp: Date.now(),
      language: settings.language,
      testType: settings.testType,
      sessionStatus,
      progressPercent: 100,
      durationSeconds: settings.durationSeconds,
      elapsedSeconds: timeSpent,
      remainingSeconds: 0,
      grossWpm,
      netWpm,
      accuracy,
      finalAccuracy: accuracy,
      keystrokeAccuracy,
      correctedMistakesCount,
      uncorrectedMistakesCount,
      totalCharactersTyped: totalTypedChars,
      correctCharacters: correctChars,
      wrongCharacters: wrongChars,
      totalWordsTyped: history.length,
      correctWords,
      wrongWords,
      mistakesCount: mistakesCountRef.current,
      backspacesCount: backspacesCountRef.current,
      consistencyPercent: consistency,
      performanceGrade,
      wpmOverTime: wpmSamplesRef.current.length > 0 ? wpmSamplesRef.current : [{ second: timeSpent, wpm: netWpm, rawWpm: grossWpm, errors: mistakesCountRef.current }],
      keyStatsMap: { ...keyStatsRef.current },
      mistypedWordsMap: { ...mistypedWordsRef.current },
      mistypedCharsMap: { ...mistypedCharsRef.current },
      slowWordsMap: {},
      wordErrors: [...wordErrorsListRef.current],
      charErrors: [...charErrorsListRef.current],
      sampleText: targetText.substring(0, 100) + '...',
      categoryOrTitle: passageTitle || (
        settings.testType === 'legal'
          ? (settings.legalCategory || 'Lok Sewa Legal Pack')
          : settings.testType === 'custom'
          ? 'Custom Paragraph'
          : settings.testType === 'quote'
          ? 'Quote Test'
          : settings.testType === 'paragraph'
          ? 'Paragraph Test'
          : settings.testType === 'words'
          ? `${settings.wordCount} Words Test`
          : `${settings.durationSeconds}s Speed Test`
      )
    };

    onTestComplete(resultObj);
  }, [targetText, targetWords, settings, passageTitle, elapsedSeconds, onTestComplete]);

  // Auto-clear error shake and rejected key feedback
  useEffect(() => {
    if (inputShake) {
      const timer = setTimeout(() => {
        setInputShake(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [inputShake]);

  useEffect(() => {
    if (rejectedKeyInfo) {
      const timer = setTimeout(() => {
        setRejectedKeyInfo(null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [rejectedKeyInfo]);

  // Clean, responsive Timer logic (Independent of keystroke updates)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTestRunning && !isTestFinished && startTime !== null) {
      interval = setInterval(() => {
        const now = Date.now();
        const seconds = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(seconds);

        const live = computeLiveStats(seconds);
        onLiveStatsChange?.(live);

        // Emit live session record continuously for Analytics
        emitLiveSession('Abandoned');

        // Record WPM sample for graph every second
        const lastSampleSecond = wpmSamplesRef.current.length > 0 ? wpmSamplesRef.current[wpmSamplesRef.current.length - 1].second : -1;
        if (seconds > lastSampleSecond) {
          wpmSamplesRef.current.push({
            second: seconds,
            wpm: live.netWpm,
            rawWpm: live.grossWpm,
            errors: live.mistakesCount
          });
        }

        // Time-based test completion check
        if (
          ((settings.testType === 'time') || (settings.testType === 'custom' && !settings.noTimeLimit)) &&
          settings.durationSeconds > 0
        ) {
          if (seconds >= settings.durationSeconds) {
            finishTest(settings.durationSeconds);
          }
        }
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTestRunning, isTestFinished, startTime, settings.testType, settings.durationSeconds, settings.noTimeLimit, computeLiveStats, finishTest, onLiveStatsChange, emitLiveSession]);

  const handleLocalRestart = useCallback(() => {
    if (isTestRunningRef.current) {
      emitLiveSession('Abandoned');
    }
    resetState();
    onRestartTest();
  }, [emitLiveSession, resetState, onRestartTest]);

  // Handle Keystrokes with Strict Character-by-Character Validation Engine
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTestFinishedRef.current) return;

    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleLocalRestart();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      resetState();
      return;
    }

    const currentTargetWord = targetWords[currentWordIndex] || '';
    const isLastWord = currentWordIndex === targetWords.length - 1;
    const currentBuf = settings.language === 'nepali' ? romanBuffer : typedInput;

    const now = Date.now();
    const latency = lastKeyTimeRef.current ? now - lastKeyTimeRef.current : 50;
    lastKeyTimeRef.current = now;

    // Handle Backspace
    if (e.key === 'Backspace') {
      if (settings.backspaceEnabled === false) {
        e.preventDefault();
        return;
      }
      setBackspacesCount(prev => {
        const next = prev + 1;
        backspacesCountRef.current = next;
        return next;
      });
      currentWordBackspacesRef.current++;
      playKeypressSound(settings.sound, settings.soundVolume);
      setRejectedKeyInfo(null);

      // Note Backspace correction on active character errors for this word
      charErrorsListRef.current.forEach(cErr => {
        if (cErr.targetWord === currentTargetWord && !cErr.corrected) {
          cErr.correctionMethod = 'Backspace';
        }
      });

      if (settings.language === 'nepali') {
        if (romanBuffer.length > 0) {
          const newBuf = romanBuffer.slice(0, -1);
          setRomanBuffer(newBuf);
          const converted = transliterateWordRuleBased(newBuf);
          setTypedInput(converted);
          typedInputRef.current = converted;
          setActiveSuggestions(getWordSuggestions(newBuf));
          const nextExp = getNextExpectedKey(currentTargetWord, newBuf, settings.language, converted);
          onNextHintKeyChange?.(nextExp);
        }
      } else {
        if (typedInput.length > 0) {
          const newTyped = typedInput.slice(0, -1);
          setTypedInput(newTyped);
          typedInputRef.current = newTyped;
          const nextExp = getNextExpectedKey(currentTargetWord, newTyped, settings.language, newTyped);
          onNextHintKeyChange?.(nextExp);
        }
      }

      onLiveStatsChange?.(computeLiveStats());
      return;
    }

    // Start timer & session on FIRST keypress attempt
    if (!isTestRunningRef.current) {
      isTestRunningRef.current = true;
      setIsTestRunning(true);
      startTimeRef.current = now;
      setStartTime(now);
      currentWordStartTimeRef.current = now;
      if (!sessionIdRef.current) {
        sessionIdRef.current = 'session_' + now;
      }
      emitLiveSession('Abandoned');
    }

    if (!currentWordStartTimeRef.current) {
      currentWordStartTimeRef.current = now;
    }

    // Handle Space Key -> Word Commit
    if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();

      const validation = validateStrictKeystroke({
        targetWord: currentTargetWord,
        currentBuffer: currentBuf,
        currentConverted: typedInput,
        pressedKey: ' ',
        language: settings.language,
        isLastWord
      });

      if (settings.mistakeMode === 'strict' && !validation.isValid) {
        // Space REJECTED: User must finish typing the current word correctly first!
        playErrorSound(settings.soundVolume);
        setMistakesCount(prev => {
          const next = prev + 1;
          mistakesCountRef.current = next;
          return next;
        });
        currentWordMistakesRef.current++;
        if (!currentWordErrorStartRef.current) {
          currentWordErrorStartRef.current = Date.now();
        }
        setKeystrokes(prev => prev + 1);
        setInputShake(true);
        setRejectedKeyInfo({
          key: 'Space',
          expected: validation.expectedKey === ' ' ? 'Space' : validation.expectedKey
        });

        const mistypedSnapshot = settings.language === 'nepali'
          ? (typedInput ? `${typedInput} ` : ' ')
          : (currentBuf ? `${currentBuf} ` : ' ');
        currentWordMistypedSnapshotRef.current = mistypedSnapshot;

        mistypedCharsRef.current[' '] = (mistypedCharsRef.current[' '] || 0) + 1;
        mistypedWordsRef.current[currentTargetWord] = (mistypedWordsRef.current[currentTargetWord] || 0) + 1;
        
        const existingCharErr = charErrorsListRef.current.find(
          c => c.targetWord === currentTargetWord && c.targetChar === (validation.expectedKey || ' ') && c.typedChar === ' '
        );
        if (existingCharErr) {
          existingCharErr.frequency += 1;
          existingCharErr.timestamp = Date.now();
        } else {
          charErrorsListRef.current.push({
            targetChar: validation.expectedKey || ' ',
            typedChar: ' ',
            frequency: 1,
            targetWord: currentTargetWord,
            position: currentBuf.length,
            corrected: false,
            correctionMethod: 'None',
            timestamp: Date.now()
          });
        }

        onKeypressMetric('space', false, latency);
        onLiveStatsChange?.(computeLiveStats());
        return;
      }

      // Space ACCEPTED (either strict matched or allow mode commit)
      const committedWord = (settings.language === 'nepali' ? (typedInput || currentBuf) : currentBuf) || currentTargetWord;
      const isWordCorrect = committedWord === currentTargetWord || areDevanagariWordsEquivalent(committedWord, currentTargetWord);

      if (!isWordCorrect && settings.mistakeMode === 'allow') {
        playErrorSound(settings.soundVolume);
        setMistakesCount(prev => {
          const next = prev + 1;
          mistakesCountRef.current = next;
          return next;
        });
        currentWordMistakesRef.current++;
        mistypedWordsRef.current[currentTargetWord] = (mistypedWordsRef.current[currentTargetWord] || 0) + 1;
      } else {
        playKeypressSound(settings.sound, settings.soundVolume);
      }

      setKeystrokes(prev => prev + 1);
      setRejectedKeyInfo(null);
      onKeypressMetric('space', isWordCorrect, latency);

      // If user made mistakes on this word and corrected it with Backspace, record the DetailedWordError
      if (currentWordMistakesRef.current > 0) {
        const timeSpentOnWord = currentWordStartTimeRef.current ? (Date.now() - currentWordStartTimeRef.current) : 1000;
        const correctionTime = currentWordErrorStartRef.current ? (Date.now() - currentWordErrorStartRef.current) : 0;
        
        wordErrorsListRef.current.push({
          targetWord: currentTargetWord,
          typedWord: committedWord || currentWordMistypedSnapshotRef.current || currentTargetWord,
          mistakes: currentWordMistakesRef.current,
          corrected: isWordCorrect,
          timeSpentMs: timeSpentOnWord,
          backspacesUsed: currentWordBackspacesRef.current,
          correctionMethod: currentWordBackspacesRef.current > 0 ? 'Backspace' : 'None',
          correctionTimeMs: correctionTime,
          errorPosition: 0,
          timestamp: Date.now()
        });

        // Mark character errors as corrected
        charErrorsListRef.current.forEach(cErr => {
          if (cErr.targetWord === currentTargetWord) {
            cErr.corrected = isWordCorrect;
            cErr.correctionMethod = currentWordBackspacesRef.current > 0 ? 'Backspace' : 'None';
            if (!cErr.correctionTimeMs && currentWordErrorStartRef.current) {
              cErr.correctionTimeMs = Date.now() - currentWordErrorStartRef.current;
            }
          }
        });
      }

      // Reset word error tracking for the next word
      currentWordMistakesRef.current = 0;
      currentWordBackspacesRef.current = 0;
      currentWordMistypedSnapshotRef.current = '';
      currentWordStartTimeRef.current = Date.now();
      currentWordErrorStartRef.current = null;

      const nextHistory = [...typedHistory, committedWord];
      typedHistoryRef.current = nextHistory;
      setTypedHistory(nextHistory);

      const nextWordIdx = currentWordIndex + 1;
      currentWordIndexRef.current = nextWordIdx;
      setCurrentWordIndex(nextWordIdx);

      setTypedInput('');
      typedInputRef.current = '';
      setRomanBuffer('');
      setActiveSuggestions([]);

      onLiveStatsChange?.(computeLiveStats());
      emitLiveSession('Abandoned');

      // Check test completion for words mode or end of passage
      if (
        (settings.testType === 'words' && nextWordIdx >= settings.wordCount) ||
        nextWordIdx >= targetWords.length
      ) {
        finishTest();
      }
      return;
    }

    // Handle Regular Keypress
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const validation = validateStrictKeystroke({
        targetWord: currentTargetWord,
        currentBuffer: currentBuf,
        currentConverted: typedInput,
        pressedKey: e.key,
        language: settings.language,
        isLastWord
      });

      if (!validation.isValid) {
        // Character REJECTED
        playErrorSound(settings.soundVolume);
        setMistakesCount(prev => {
          const next = prev + 1;
          mistakesCountRef.current = next;
          return next;
        });
        currentWordMistakesRef.current++;
        if (!currentWordErrorStartRef.current) {
          currentWordErrorStartRef.current = Date.now();
        }
        setKeystrokes(prev => prev + 1);
        setInputShake(true);
        setRejectedKeyInfo({
          key: e.key,
          expected: validation.expectedKey === ' ' ? 'Space' : validation.expectedKey
        });

        // Compute realistic mistyped word snapshot (e.g. "संवीधान" or candidate representation)
        let candidateSnapshot = '';
        if (settings.language === 'nepali') {
          const attemptedBuf = currentBuf + e.key;
          const transliteratedAttempt = transliterateWordRuleBased(attemptedBuf);
          candidateSnapshot = transliteratedAttempt || (typedInput + e.key);
        } else {
          candidateSnapshot = currentBuf + e.key;
        }
        currentWordMistypedSnapshotRef.current = candidateSnapshot;

        mistypedCharsRef.current[e.key] = (mistypedCharsRef.current[e.key] || 0) + 1;
        mistypedWordsRef.current[currentTargetWord] = (mistypedWordsRef.current[currentTargetWord] || 0) + 1;
        
        const expectedCharStr = validation.expectedKey === ' ' ? 'Space' : (validation.expectedKey || e.key);
        const existingCharErr = charErrorsListRef.current.find(
          c => c.targetWord === currentTargetWord && c.targetChar === expectedCharStr && c.typedChar === e.key
        );
        if (existingCharErr) {
          existingCharErr.frequency += 1;
          existingCharErr.timestamp = Date.now();
        } else {
          charErrorsListRef.current.push({
            targetChar: expectedCharStr,
            typedChar: e.key,
            frequency: 1,
            targetWord: currentTargetWord,
            position: currentBuf.length,
            corrected: false,
            correctionMethod: 'None',
            timestamp: Date.now()
          });
        }

        onKeypressMetric(e.key.toLowerCase(), false, latency);
        onLiveStatsChange?.(computeLiveStats());

        // In allow mode, allow character to be appended anyway
        if (settings.mistakeMode === 'allow') {
          if (settings.language === 'nepali') {
            const nextBuf = currentBuf + e.key;
            const converted = transliterateWordRuleBased(nextBuf);
            setRomanBuffer(nextBuf);
            setTypedInput(converted);
            typedInputRef.current = converted;
          } else {
            const nextBuf = currentBuf + e.key;
            setTypedInput(nextBuf);
            typedInputRef.current = nextBuf;
          }
        }

        // Check if max mistakes limit reached
        if (settings.maxMistakes && (mistakesCountRef.current) >= settings.maxMistakes && settings.maxMistakesAction === 'end_test') {
          finishTest();
          return;
        }

        if (settings.mistakeMode === 'strict') {
          return;
        }
      }

      // Character ACCEPTED: Valid input according to Romanized Nepali / English rules!
      if (validation.isValid) {
        playKeypressSound(settings.sound, settings.soundVolume);
        setKeystrokes(prev => prev + 1);
        setRejectedKeyInfo(null);

        if (settings.language === 'nepali') {
          setRomanBuffer(validation.newBuffer);
          setTypedInput(validation.newConverted);
          typedInputRef.current = validation.newConverted;
          setActiveSuggestions(getWordSuggestions(validation.newBuffer));
        } else {
          setTypedInput(validation.newBuffer);
          typedInputRef.current = validation.newBuffer;
        }

        onKeypressMetric(e.key.toLowerCase(), true, latency);
        onLiveStatsChange?.(computeLiveStats());
        emitLiveSession('Abandoned');

        // Auto-complete if last word of the test is complete
        if (isLastWord && validation.isWordComplete) {
          if (currentWordMistakesRef.current > 0) {
            const timeSpentOnWord = currentWordStartTimeRef.current ? (Date.now() - currentWordStartTimeRef.current) : 1000;
            const correctionTime = currentWordErrorStartRef.current ? (Date.now() - currentWordErrorStartRef.current) : 0;
            
            wordErrorsListRef.current.push({
              targetWord: currentTargetWord,
              typedWord: currentWordMistypedSnapshotRef.current || currentTargetWord,
              mistakes: currentWordMistakesRef.current,
              corrected: true,
              timeSpentMs: timeSpentOnWord,
              backspacesUsed: currentWordBackspacesRef.current,
              correctionMethod: currentWordBackspacesRef.current > 0 ? 'Backspace' : 'None',
              correctionTimeMs: correctionTime,
              errorPosition: 0,
              timestamp: Date.now()
            });

            charErrorsListRef.current.forEach(cErr => {
              if (cErr.targetWord === currentTargetWord) {
                cErr.corrected = true;
                cErr.correctionMethod = currentWordBackspacesRef.current > 0 ? 'Backspace' : 'None';
                if (!cErr.correctionTimeMs && currentWordErrorStartRef.current) {
                  cErr.correctionTimeMs = Date.now() - currentWordErrorStartRef.current;
                }
              }
            });
          }

          const nextHistory = [...typedHistory, currentTargetWord];
          typedHistoryRef.current = nextHistory;
          setTypedHistory(nextHistory);

          const nextWordIdx = currentWordIndex + 1;
          currentWordIndexRef.current = nextWordIdx;
          setCurrentWordIndex(nextWordIdx);

          setTypedInput('');
          typedInputRef.current = '';
          setRomanBuffer('');

          finishTest();
          return;
        }
      }
    }
  };

  // Smooth synchronized auto-scrolling: keeps active line at ~33% container height so 2-3 lines ahead remain visible
  useEffect(() => {
    if (activeWordRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const wordEl = activeWordRef.current;

      const containerRect = container.getBoundingClientRect();
      const wordRect = wordEl.getBoundingClientRect();

      const relativeTop = wordRect.top - containerRect.top + container.scrollTop;
      const targetScrollTop = relativeTop - container.clientHeight * 0.33;

      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    }
  }, [currentWordIndex, typedInput]);

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
    return { fontFamily: getFontCssValue(settings.fontFamily) };
  };

  return (
    <div id="typing-area-container" className="w-full flex flex-col items-center gap-4">
      
      {/* Test Control Header Options - Clean Segmented Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        
        {/* Mode Selector Group */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50 text-xs">
          
          <button
            onClick={() => updateSettings({ testType: 'time' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              settings.testType === 'time'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Time</span>
          </button>

          <button
            onClick={() => updateSettings({ testType: 'words' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              settings.testType === 'words'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Words</span>
          </button>

          <button
            onClick={onOpenCustomParagraph}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              settings.testType === 'custom'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Custom Paragraph</span>
          </button>

          <button
            onClick={() => updateSettings({ testType: 'legal' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              settings.testType === 'legal'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Passage</span>
          </button>

          <button
            onClick={() => updateSettings({ testType: 'quote' })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
              settings.testType === 'quote'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Quotes</span>
          </button>

        </div>

        {/* Options & Action Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {settings.testType === 'time' && (
            <div className="flex items-center gap-0.5 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              {[15, 30, 60, 120, 180, 300, 600].map(sec => (
                <button
                  key={sec}
                  onClick={() => updateSettings({ durationSeconds: sec })}
                  className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    settings.durationSeconds === sec
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                </button>
              ))}
            </div>
          )}

          {settings.testType === 'words' && (
            <div className="flex items-center gap-0.5 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              {[10, 25, 50, 100, 250].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => updateSettings({ wordCount: cnt })}
                  className={`px-2 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    settings.wordCount === cnt
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          )}

          {/* Difficulty selector */}
          <div className="hidden sm:flex items-center gap-0.5 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
            {(['easy', 'medium', 'hard', 'expert'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => updateSettings({ difficulty: lvl })}
                className={`px-2 py-1 rounded-md capitalize text-[11px] font-medium transition-colors cursor-pointer ${
                  settings.difficulty === lvl
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Typing Hint Toggle */}
          <button
            onClick={() => updateSettings({ showHints: !settings.showHints })}
            title="Toggle Typing Hint (Romanized key sequence step-by-step)"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              settings.showHints
                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80'
            }`}
          >
            <Lightbulb className={`w-3.5 h-3.5 ${settings.showHints ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>Hint: {settings.showHints ? 'ON' : 'OFF'}</span>
          </button>

          {/* Restart Button */}
          <button
            onClick={handleLocalRestart}
            title="Restart Test (Ctrl + Enter)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

      </div>

      {/* Main Typing Canvas */}
      <div
        ref={containerRef}
        onClick={() => inputRef.current?.focus()}
        className={`relative w-full min-h-[240px] bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border transition-all cursor-text overflow-hidden select-none flex flex-col justify-between shadow-2xs ${
          inputShake
            ? 'border-rose-500 ring-2 ring-rose-500/20'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Floating Rejected Key Notification */}
        {rejectedKeyInfo && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/90 px-3 py-1 rounded-lg border border-rose-200 dark:border-rose-800 shadow-sm animate-fadeIn">
            <span>Key <strong className="font-mono text-rose-900 dark:text-rose-100 uppercase">{rejectedKeyInfo.key}</strong> not expected</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>Use:</span>
            <kbd className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-mono text-[11px] px-1.5 py-0.5 rounded uppercase">
              {rejectedKeyInfo.expected}
            </kbd>
          </div>
        )}

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

        {/* Romanized Live Hint Panel */}
        {settings.showHints && currentTargetWord && !isTestFinished && (
          <div className="mb-5 w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 sm:p-4 rounded-xl flex flex-col gap-2.5 animate-fadeIn">
            
            {/* Top Bar: Title & Progress */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                  Typing Guidance
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  • Word {currentWordIndex + 1} of {targetWords.length}
                </span>
              </div>

              {hasMismatch && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  <span>Typed <strong className="font-mono uppercase">{mismatchedChar || '?'}</strong>, needed:</span>
                  <kbd className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-[11px] px-1.5 py-0.2 rounded font-mono">
                    {nextHintKey === ' ' ? 'Space' : nextHintKey}
                  </kbd>
                </div>
              )}
            </div>

            {/* Main Guidance Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Target Word & Key Sequence */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                {/* Devanagari Word */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Current Word</span>
                  <span className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400" style={getFontFamilyStyle()}>
                    {currentTargetWord}
                  </span>
                </div>

                <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">→</span>

                {/* Character Key Sequence Breakdown */}
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Key Sequence</span>
                  <div className="flex items-center gap-0.5 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-sm sm:text-base">
                    {/* Completed Part */}
                    {completedPart && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {completedPart}
                      </span>
                    )}

                    {/* Next Key */}
                    {!isWordFullyTyped && nextHintKey && nextHintKey !== ' ' && (
                      <span className="bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded text-xs uppercase mx-0.5">
                        {nextHintKey}
                      </span>
                    )}

                    {/* Remaining Part */}
                    {remainingPart && (
                      <span className="text-slate-400 dark:text-slate-500">
                        {remainingPart}
                      </span>
                    )}

                    {/* Spacebar Prompt */}
                    {isWordFullyTyped && (
                      <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                        Press Space ↵
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Prominent Next Key Badge */}
              <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-lg min-w-[80px]">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">Next Key</span>
                <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono uppercase">
                  {nextHintKey === ' ' ? 'SPACE' : (nextHintKey || '—')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Romanized Live Buffer Indicator (Floating Preview) */}
        {settings.language === 'nepali' && romanBuffer && (
          <div className="mb-4 inline-flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 text-sm font-medium animate-fadeIn">
            <span className="text-slate-400 dark:text-slate-500 font-mono text-xs">
              Input: <strong className="text-slate-900 dark:text-white">{romanBuffer}</strong>
            </span>
            <span className="text-slate-200 dark:text-slate-700">|</span>
            <span className="text-base font-bold text-blue-600 dark:text-blue-400" style={getFontFamilyStyle()}>
              {typedInput}
            </span>
            {activeSuggestions.length > 1 && (
              <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-2">
                <span>Options:</span>
                {activeSuggestions.slice(1, 3).map((sug, i) => (
                  <span key={i} className="bg-white dark:bg-slate-900 px-1.5 py-0.2 rounded border border-slate-200 dark:border-slate-700 text-xs">
                    {sug}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Text View Container */}
        <div
          ref={textContainerRef}
          className={`w-full flex flex-wrap gap-x-3.5 gap-y-2.5 text-slate-400 dark:text-slate-500 font-normal transition-all max-h-[220px] sm:max-h-[260px] overflow-y-auto pr-2 py-4 scroll-smooth ${getFontSizeClass()}`}
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
