import React, { useState, useEffect, useRef } from 'react';
import { ArenaLanguage, Racer } from '../../types/arenaTypes';
import {
  transliterateWordRuleBased,
  getRomanizedHintForWord,
  COMMON_DICTIONARY
} from '../../utils/nepaliTransliteration';
import {
  playCountdownBeep,
  playComboChime,
  playNitroBoostSound,
  playMistakePenaltySound
} from '../../utils/gameAudio';
import { RaceTrackView } from './RaceTrackView';
import {
  Zap,
  Shield,
  RotateCcw,
  Flame,
  Volume2,
  VolumeX,
  Keyboard,
  Timer
} from 'lucide-react';

interface ArenaTypingEngineProps {
  language: ArenaLanguage;
  targetText: string;
  opponents: Racer[];
  userAvatar: string;
  userName: string;
  onFinishRace: (results: {
    userRacer: Racer;
    allRacers: Racer[];
    mistypedKeys: Record<string, number>;
    mistypedWords: Record<string, number>;
    wpmHistory: { second: number; wpm: number; errors: number }[];
    totalKeystrokes: number;
    backspaces: number;
  }) => void;
  onExit: () => void;
  reducedMotion?: boolean;
}

export const ArenaTypingEngine: React.FC<ArenaTypingEngineProps> = ({
  language,
  targetText,
  opponents,
  userAvatar,
  userName,
  onFinishRace,
  onExit,
  reducedMotion = false
}) => {
  // Sound toggle
  const [soundMuted, setSoundMuted] = useState(false);

  // Countdown state: 3, 2, 1, 0 (GO!)
  const [countdown, setCountdown] = useState<number>(3);
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Typing state
  const words = targetText.trim().split(/\s+/).filter(Boolean);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentBuffer, setCurrentBuffer] = useState<string>('');
  const [currentConverted, setCurrentConverted] = useState<string>('');

  // Stats state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [backspacesCount, setBackspacesCount] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);

  // Racers state (User + Opponents)
  const [allRacers, setAllRacers] = useState<Racer[]>(() => {
    const userRacer: Racer = {
      id: 'user-player',
      name: userName,
      avatar: userAvatar,
      isPlayer: true,
      isAi: false,
      wpm: 0,
      currentProgress: 0,
      position: 1,
      status: 'ready'
    };
    return [userRacer, ...opponents];
  });

  // Tracking refs
  const inputRef = useRef<HTMLInputElement>(null);
  const keystrokeTimestampsRef = useRef<number[]>([]);
  const mistypedKeysRef = useRef<Record<string, number>>({});
  const mistypedWordsRef = useRef<Record<string, number>>({});
  const wpmHistoryRef = useRef<{ second: number; wpm: number; errors: number }[]>([]);
  const botIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFinishedRef = useRef<boolean>(false);

  // Auto focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      playCountdownBeep(false);
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRacing && !isFinished) {
      playCountdownBeep(true);
      setIsRacing(true);
      setStartTime(Date.now());
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [countdown, isRacing, isFinished]);

  // Bot simulation loop
  useEffect(() => {
    if (!isRacing || isFinished) return;

    botIntervalRef.current = setInterval(() => {
      if (isFinishedRef.current) return;

      setAllRacers((prevRacers) => {
        const now = Date.now();
        const elapsedMin = startTime ? Math.max(0.05, (now - startTime) / 60000) : 0.05;

        return prevRacers.map((racer) => {
          if (racer.isPlayer) {
            return racer; // Handled by user typing
          }

          if (racer.status === 'finished') {
            return racer;
          }

          // Target WPM with human jitter
          const baseWpm = racer.wpm || 45;
          const jitter = (Math.random() - 0.5) * 6;
          const currentBotWpm = Math.max(15, baseWpm + jitter);

          // Word progress calculation
          const totalTargetWords = words.length;
          const wordsPerSec = currentBotWpm / 60;
          const deltaProgress = (wordsPerSec * 0.1 / totalTargetWords) * 100;
          const newProgress = Math.min(100, racer.currentProgress + deltaProgress);

          if (newProgress >= 100) {
            return {
              ...racer,
              currentProgress: 100,
              status: 'finished',
              finishTime: startTime ? (now - startTime) / 1000 : 0,
              netWpm: Math.round(currentBotWpm)
            };
          }

          return {
            ...racer,
            currentProgress: newProgress,
            wpm: Math.round(currentBotWpm),
            status: 'racing'
          };
        });
      });
    }, 100);

    return () => {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    };
  }, [isRacing, isFinished, startTime, words.length]);

  // Elapsed timer & WPM history ticker
  useEffect(() => {
    if (!isRacing || isFinished || !startTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsedSec = Math.max(1, (now - startTime) / 1000);
      setElapsedSeconds(elapsedSec);

      const minutes = elapsedSec / 60;
      const calculatedGrossWpm = minutes > 0 ? (correctChars / 5) / minutes : 0;
      const calculatedNetWpm = Math.max(0, calculatedGrossWpm - (mistakesCount / minutes));
      setLiveWpm(Math.round(calculatedNetWpm));

      const totalKeystrokes = correctChars + mistakesCount;
      const calculatedAcc = totalKeystrokes > 0 ? ((correctChars / totalKeystrokes) * 100) : 100;
      setLiveAccuracy(Math.min(100, Math.max(0, calculatedAcc)));

      // Record second-by-second history
      wpmHistoryRef.current.push({
        second: Math.round(elapsedSec),
        wpm: Math.round(calculatedNetWpm),
        errors: mistakesCount
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRacing, isFinished, startTime, correctChars, mistakesCount]);

  // Handle user typing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isRacing || isFinished) {
      if (e.key !== 'Tab') e.preventDefault();
      return;
    }

    const key = e.key;
    const now = Date.now();
    keystrokeTimestampsRef.current.push(now);

    const targetWord = words[currentWordIndex] || '';

    // Handle Backspace
    if (key === 'Backspace') {
      e.preventDefault();
      setBackspacesCount((prev) => prev + 1);
      if (currentBuffer.length > 0) {
        const newBuf = currentBuffer.slice(0, -1);
        setCurrentBuffer(newBuf);
        if (language === 'nepali') {
          const lowerBuf = newBuf.toLowerCase();
          const conv = COMMON_DICTIONARY[lowerBuf] || transliterateWordRuleBased(newBuf);
          setCurrentConverted(conv);
        } else {
          setCurrentConverted(newBuf);
        }
      }
      return;
    }

    // Handle Space (Word Completion)
    if (key === ' ') {
      e.preventDefault();
      const isMatch = language === 'english'
        ? currentBuffer === targetWord
        : (currentConverted === targetWord || currentBuffer.toLowerCase() === getRomanizedHintForWord(targetWord).toLowerCase());

      if (isMatch) {
        // Complete current word
        const newWordIdx = currentWordIndex + 1;
        const newCorrectChars = correctChars + targetWord.length + 1;
        setCorrectChars(newCorrectChars);
        setCurrentWordIndex(newWordIdx);
        setCurrentBuffer('');
        setCurrentConverted('');

        // Update Combo & Sound
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo % 10 === 0) {
          playComboChime(newCombo >= 50 ? 2.0 : 1.2);
        }

        // Calculate progress percentage
        const progress = Math.min(100, (newWordIdx / words.length) * 100);

        // Update User Racer on Track
        setAllRacers((prev) =>
          prev.map((r) =>
            r.isPlayer
              ? {
                  ...r,
                  currentProgress: progress,
                  wpm: liveWpm,
                  comboCount: newCombo
                }
              : r
          )
        );

        // Check if finished race
        if (newWordIdx >= words.length) {
          finishUserRace(newCorrectChars);
        }
      } else {
        // Mistake on space before finishing word
        handleTypo(key, targetWord);
      }
      return;
    }

    // Single Printable Key Handler
    if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const nextBuf = currentBuffer + key;

      if (language === 'english') {
        const expectedChar = targetWord[currentBuffer.length];
        if (key === expectedChar) {
          setCurrentBuffer(nextBuf);
          setCurrentConverted(nextBuf);
          setCorrectChars((prev) => prev + 1);
          setCombo((prev) => prev + 1);

          // Partial word progress update on track
          const overallChars = words.reduce((acc, w) => acc + w.length + 1, 0);
          const currentTypedTotal = correctChars + 1;
          const progress = Math.min(99, (currentTypedTotal / overallChars) * 100);

          setAllRacers((prev) =>
            prev.map((r) =>
              r.isPlayer
                ? {
                    ...r,
                    currentProgress: progress,
                    wpm: liveWpm
                  }
                : r
            )
          );
        } else {
          handleTypo(key, targetWord);
        }
      } else {
        // Nepali Romanized Transliteration
        const lowerNextBuf = nextBuf.toLowerCase();
        const conv = COMMON_DICTIONARY[lowerNextBuf] || transliterateWordRuleBased(nextBuf);
        const expectedHint = getRomanizedHintForWord(targetWord);

        // Allow typing if buffer continues to build towards target hint or converted word
        const isValidAdvance =
          expectedHint.toLowerCase().startsWith(lowerNextBuf) ||
          targetWord.startsWith(conv) ||
          targetWord.startsWith(nextBuf);

        if (isValidAdvance) {
          setCurrentBuffer(nextBuf);
          setCurrentConverted(conv);
          setCorrectChars((prev) => prev + 1);
          setCombo((prev) => prev + 1);

          const overallChars = words.reduce((acc, w) => acc + w.length + 1, 0);
          const currentTypedTotal = correctChars + 1;
          const progress = Math.min(99, (currentTypedTotal / overallChars) * 100);

          setAllRacers((prev) =>
            prev.map((r) =>
              r.isPlayer
                ? {
                    ...r,
                    currentProgress: progress,
                    wpm: liveWpm
                  }
                : r
            )
          );
        } else {
          handleTypo(key, targetWord);
        }
      }
    }
  };

  const handleTypo = (key: string, word: string) => {
    playMistakePenaltySound();
    setMistakesCount((prev) => prev + 1);

    // Record mistake in maps
    mistypedKeysRef.current[key] = (mistypedKeysRef.current[key] || 0) + 1;
    mistypedWordsRef.current[word] = (mistypedWordsRef.current[word] || 0) + 1;

    // Shield protection check
    if (shieldActive) {
      setShieldActive(false); // Absorb mistake combo break
    } else {
      setCombo(0); // Break combo
    }
  };

  const finishUserRace = (finalCorrectChars: number) => {
    isFinishedRef.current = true;
    setIsFinished(true);
    setIsRacing(false);

    const now = Date.now();
    const finishDuration = startTime ? (now - startTime) / 1000 : 1;
    const finalMinutes = finishDuration / 60;
    const gross = finalMinutes > 0 ? (finalCorrectChars / 5) / finalMinutes : 0;
    const net = Math.max(0, gross - (mistakesCount / finalMinutes));
    const totalKeystrokes = finalCorrectChars + mistakesCount;
    const finalAcc = totalKeystrokes > 0 ? ((finalCorrectChars / totalKeystrokes) * 100) : 100;

    const userRacerUpdated: Racer = {
      id: 'user-player',
      name: userName,
      avatar: userAvatar,
      isPlayer: true,
      isAi: false,
      wpm: Math.round(gross),
      netWpm: Math.round(net),
      grossWpm: Math.round(gross),
      accuracy: finalAcc,
      mistakes: mistakesCount,
      currentProgress: 100,
      position: 1,
      status: 'finished',
      finishTime: finishDuration
    };

    const finalRacersList = allRacers.map((r) => (r.isPlayer ? userRacerUpdated : r));

    onFinishRace({
      userRacer: userRacerUpdated,
      allRacers: finalRacersList,
      mistypedKeys: mistypedKeysRef.current,
      mistypedWords: mistypedWordsRef.current,
      wpmHistory: wpmHistoryRef.current,
      totalKeystrokes,
      backspaces: backspacesCount
    });
  };

  // Romanized hint for current word
  const currentTargetWord = words[currentWordIndex] || '';
  const currentRomanHint = language === 'nepali' ? getRomanizedHintForWord(currentTargetWord) : currentTargetWord;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      {/* Race Track Header Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm">
            <Timer className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">{elapsedSeconds.toFixed(1)}s</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300">{liveWpm}</span>
            <span className="text-xs text-slate-500">WPM</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm hidden sm:flex">
            <span className="text-xs text-slate-400">ACC:</span>
            <span className="font-bold text-emerald-400">{liveAccuracy.toFixed(0)}%</span>
          </div>
        </div>

        {/* Controls (Sound, Exit) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Leave Race
          </button>
        </div>
      </div>

      {/* Visual Live Race Track */}
      <RaceTrackView
        racers={allRacers}
        userCombo={combo}
        userShieldActive={shieldActive}
        reducedMotion={reducedMotion}
      />

      {/* Interactive Typing Arena Input Card */}
      <div
        className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Starting Countdown Overlay */}
        {countdown > 0 && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center animate-in fade-in">
            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-amber-400 to-yellow-200 animate-pulse font-mono">
              {countdown}
            </span>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">
              Ready... Hands on Keyboard!
            </p>
          </div>
        )}

        {/* Word Display Stream */}
        <div className="relative text-xl sm:text-2xl leading-relaxed font-sans mb-6 select-none flex flex-wrap gap-2.5 items-center min-h-[90px]">
          {words.map((word, idx) => {
            const isCurrent = idx === currentWordIndex;
            const isCompleted = idx < currentWordIndex;

            return (
              <span
                key={idx}
                className={`relative px-2 py-0.5 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-blue-600/30 text-blue-200 ring-2 ring-blue-500 shadow-md font-bold'
                    : isCompleted
                    ? 'text-slate-500 line-through opacity-60'
                    : 'text-slate-300'
                }`}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Active Input & Hint Box */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full flex-1">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
              <span>TARGET WORD: <strong className="text-white text-sm">{currentTargetWord}</strong></span>
              {language === 'nepali' && (
                <span>TYPE IN ROMAN: <strong className="text-amber-400 font-bold text-sm">{currentRomanHint}</strong></span>
              )}
            </div>

            {/* Input Element */}
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={currentBuffer}
                onChange={() => {}} // Controlled via onKeyDown for strict validation
                onKeyDown={handleKeyDown}
                placeholder={countdown === 0 ? 'Type here and press Space...' : 'Waiting for race start...'}
                className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                disabled={countdown > 0 || isFinished}
                autoFocus
              />

              {/* Converted preview for Nepali */}
              {language === 'nepali' && currentConverted && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-blue-950 border border-blue-800 rounded-md text-blue-300 text-sm font-bold font-sans">
                  {currentConverted}
                </div>
              )}
            </div>
          </div>

          {/* Quick Combo / Multiplier Widget */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center min-w-[90px]">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Streak Combo</span>
              <span className="text-lg font-black text-amber-400 font-mono">
                {combo}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
