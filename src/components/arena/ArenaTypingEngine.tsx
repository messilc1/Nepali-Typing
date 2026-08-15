import React, { useState, useEffect, useRef } from 'react';
import {
  ArenaLanguage,
  Racer,
  MultiplayerLobbyState,
  MultiplayerPlayer,
  OfficialMultiplayerResult
} from '../../types/arenaTypes';
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
import {
  multiplayerSocket,
  CountdownEventData,
  SocketConnectionStatus
} from '../../services/multiplayerSocket';
import { RaceTrackView } from './RaceTrackView';
import {
  Zap,
  Shield,
  RotateCcw,
  Flame,
  Volume2,
  VolumeX,
  Keyboard,
  Timer,
  Wifi,
  WifiOff,
  Users
} from 'lucide-react';

interface ArenaTypingEngineProps {
  language: ArenaLanguage;
  targetText: string;
  opponents: Racer[];
  userAvatar: string;
  userName: string;
  isMultiplayer?: boolean;
  multiplayerLobby?: MultiplayerLobbyState;
  multiplayerCountdownData?: CountdownEventData;
  onFinishRace: (results: {
    userRacer: Racer;
    allRacers: Racer[];
    mistypedKeys: Record<string, number>;
    mistypedWords: Record<string, number>;
    wpmHistory: { second: number; wpm: number; errors: number }[];
    totalKeystrokes: number;
    backspaces: number;
    officialMultiplayerResults?: OfficialMultiplayerResult[];
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
  isMultiplayer = false,
  multiplayerLobby,
  multiplayerCountdownData,
  onFinishRace,
  onExit,
  reducedMotion = false
}) => {
  const [soundMuted, setSoundMuted] = useState(false);
  const myPlayerId = multiplayerSocket.getPlayerId();

  // Connection status for multiplayer
  const [connectionStatus, setConnectionStatus] = useState<SocketConnectionStatus>(
    multiplayerSocket.getStatus()
  );

  // Synchronized countdown calculation
  const [countdown, setCountdown] = useState<number>(() => {
    if (isMultiplayer && multiplayerCountdownData?.startTimestamp) {
      const remainingMs = multiplayerCountdownData.startTimestamp - Date.now();
      return Math.max(1, Math.ceil(remainingMs / 1000));
    }
    return 3;
  });

  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Target words
  const words = targetText.trim().split(/\s+/).filter(Boolean);
  const totalCharacters = targetText.length;
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [currentBuffer, setCurrentBuffer] = useState<string>('');
  const [currentConverted, setCurrentConverted] = useState<string>('');

  // Performance telemetry
  const [startTime, setStartTime] = useState<number | null>(() => {
    if (isMultiplayer && multiplayerCountdownData?.startTimestamp) {
      return multiplayerCountdownData.startTimestamp;
    }
    return null;
  });
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
    if (isMultiplayer && multiplayerCountdownData?.players) {
      return multiplayerCountdownData.players.map((p, idx) => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        isPlayer: p.id === myPlayerId,
        isAi: false,
        wpm: 0,
        currentProgress: 0,
        position: idx + 1,
        status: 'ready'
      }));
    }

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
  const officialResultsRef = useRef<OfficialMultiplayerResult[] | null>(null);

  // Auto focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Subscribe to real-time multiplayer socket events
  useEffect(() => {
    if (!isMultiplayer) return;

    const unsubStatus = multiplayerSocket.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    const unsubProgress = multiplayerSocket.onProgressUpdate((data) => {
      if (!data?.players) return;

      setAllRacers((prevRacers) => {
        return data.players.map((serverPlayer, index) => {
          const isMe = serverPlayer.id === myPlayerId;
          const existing = prevRacers.find((r) => r.id === serverPlayer.id);

          return {
            id: serverPlayer.id,
            name: serverPlayer.name,
            avatar: serverPlayer.avatar,
            isPlayer: isMe,
            isAi: false,
            wpm: serverPlayer.wpm,
            netWpm: serverPlayer.netWpm,
            accuracy: serverPlayer.accuracy,
            currentProgress: isMe ? (existing?.currentProgress ?? serverPlayer.progress) : serverPlayer.progress,
            position: serverPlayer.rank || index + 1,
            status: serverPlayer.finished
              ? 'finished'
              : serverPlayer.connected
              ? 'racing'
              : 'disconnected'
          };
        });
      });
    });

    const unsubMatchFinish = multiplayerSocket.onMatchFinish((data) => {
      officialResultsRef.current = data.results;
    });

    return () => {
      unsubStatus();
      unsubProgress();
      unsubMatchFinish();
    };
  }, [isMultiplayer, myPlayerId]);

  // Synchronized Server Countdown
  useEffect(() => {
    if (isMultiplayer && multiplayerCountdownData?.startTimestamp) {
      const interval = setInterval(() => {
        const now = Date.now();
        const diffMs = multiplayerCountdownData.startTimestamp - now;
        const secondsRemaining = Math.max(0, Math.ceil(diffMs / 1000));

        setCountdown(secondsRemaining);

        if (secondsRemaining <= 0) {
          clearInterval(interval);
          if (!isRacing && !isFinishedRef.current) {
            playCountdownBeep(true);
            setIsRacing(true);
            setStartTime(multiplayerCountdownData.startTimestamp);
            if (inputRef.current) inputRef.current.focus();
          }
        } else {
          playCountdownBeep(false);
        }
      }, 200);

      return () => clearInterval(interval);
    } else {
      // Local countdown for solo/AI mode
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
    }
  }, [countdown, isRacing, isFinished, isMultiplayer, multiplayerCountdownData]);

  // Local Bot simulation loop (only for non-multiplayer AI/Career matches)
  useEffect(() => {
    if (isMultiplayer || !isRacing || isFinished) return;

    botIntervalRef.current = setInterval(() => {
      if (isFinishedRef.current) return;

      setAllRacers((prevRacers) => {
        const now = Date.now();

        return prevRacers.map((racer) => {
          if (racer.isPlayer) {
            return racer;
          }

          if (racer.status === 'finished') {
            return racer;
          }

          const baseWpm = racer.wpm || 45;
          const jitter = (Math.random() - 0.5) * 6;
          const currentBotWpm = Math.max(15, baseWpm + jitter);

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
  }, [isMultiplayer, isRacing, isFinished, startTime, words.length]);

  // Elapsed timer & WPM calculation ticker
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

      // Record telemetry history
      wpmHistoryRef.current.push({
        second: Math.round(elapsedSec),
        wpm: Math.round(calculatedNetWpm),
        errors: mistakesCount
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRacing, isFinished, startTime, correctChars, mistakesCount]);

  // Handle typing input
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

    // Handle Space (Word completion)
    if (key === ' ') {
      e.preventDefault();
      const isMatch =
        language === 'english'
          ? currentBuffer === targetWord
          : currentConverted === targetWord || currentBuffer === targetWord;

      if (isMatch) {
        const addedChars = targetWord.length + 1;
        const newCorrectChars = correctChars + addedChars;
        setCorrectChars(newCorrectChars);

        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo > 0 && newCombo % 10 === 0) {
          playComboChime(newCombo);
        }

        const nextWordIndex = currentWordIndex + 1;
        setCurrentWordIndex(nextWordIndex);
        setCurrentBuffer('');
        setCurrentConverted('');

        // Calculate progress
        const rawProgress = (nextWordIndex / words.length) * 100;
        const newProgress = Math.min(100, rawProgress);

        // Update local user racer position
        setAllRacers((prev) =>
          prev.map((r) =>
            r.isPlayer
              ? {
                  ...r,
                  currentProgress: newProgress,
                  wpm: liveWpm,
                  netWpm: liveWpm,
                  accuracy: liveAccuracy,
                  status: newProgress >= 100 ? 'finished' : 'racing'
                }
              : r
          )
        );

        // Stream progress to WebSocket server if in multiplayer
        if (isMultiplayer) {
          multiplayerSocket.sendProgress({
            progress: newProgress,
            charsTyped: newCorrectChars,
            wordsTyped: nextWordIndex,
            accuracy: liveAccuracy,
            mistakes: mistakesCount,
            isFinished: nextWordIndex >= words.length
          });
        }

        // Check if user completed the entire text
        if (nextWordIndex >= words.length) {
          finishRace(newCorrectChars, mistakesCount);
        }
      } else {
        // Mistake on word space
        mistypedWordsRef.current[targetWord] = (mistypedWordsRef.current[targetWord] || 0) + 1;
        setMistakesCount((prev) => prev + 1);
        setCombo(0);
        playMistakePenaltySound();
      }
      return;
    }

    // Single character input
    if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      const newBuf = currentBuffer + key;
      setCurrentBuffer(newBuf);

      if (language === 'nepali') {
        const lowerBuf = newBuf.toLowerCase();
        const conv = COMMON_DICTIONARY[lowerBuf] || transliterateWordRuleBased(newBuf);
        setCurrentConverted(conv);

        const expectedPrefix = targetWord.slice(0, conv.length);
        if (conv !== expectedPrefix && newBuf !== targetWord.slice(0, newBuf.length)) {
          mistypedKeysRef.current[key] = (mistypedKeysRef.current[key] || 0) + 1;
          setMistakesCount((prev) => prev + 1);
          setCombo(0);
          playMistakePenaltySound();
        }
      } else {
        setCurrentConverted(newBuf);
        const expectedPrefix = targetWord.slice(0, newBuf.length);
        if (newBuf !== expectedPrefix) {
          mistypedKeysRef.current[key] = (mistypedKeysRef.current[key] || 0) + 1;
          setMistakesCount((prev) => prev + 1);
          setCombo(0);
          playMistakePenaltySound();
        }
      }
    }
  };

  // Complete race
  const finishRace = (finalCorrectChars: number, finalMistakes: number) => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    setIsFinished(true);
    setIsRacing(false);

    if (botIntervalRef.current) {
      clearInterval(botIntervalRef.current);
    }

    const finishNow = Date.now();
    const effectiveStartTime = startTime || finishNow - 1000;
    const finalElapsedSec = Math.max(1, (finishNow - effectiveStartTime) / 1000);
    const finalMinutes = finalElapsedSec / 60;
    const grossWpm = finalMinutes > 0 ? (finalCorrectChars / 5) / finalMinutes : 0;
    const netWpm = Math.max(0, grossWpm - (finalMistakes / finalMinutes));
    const totalKeys = finalCorrectChars + finalMistakes;
    const acc = totalKeys > 0 ? (finalCorrectChars / totalKeys) * 100 : 100;

    const userRacer: Racer = {
      id: myPlayerId,
      name: userName,
      avatar: userAvatar,
      isPlayer: true,
      isAi: false,
      wpm: Math.round(grossWpm),
      netWpm: Math.round(netWpm),
      accuracy: Number(acc.toFixed(1)),
      currentProgress: 100,
      position: 1,
      status: 'finished',
      finishTime: finalElapsedSec
    };

    setTimeout(() => {
      onFinishRace({
        userRacer,
        allRacers,
        mistypedKeys: mistypedKeysRef.current,
        mistypedWords: mistypedWordsRef.current,
        wpmHistory: wpmHistoryRef.current,
        totalKeystrokes: totalKeys,
        backspaces: backspacesCount,
        officialMultiplayerResults: officialResultsRef.current || undefined
      });
    }, 600);
  };

  const progressPercent = Math.min(100, Math.round((currentWordIndex / words.length) * 100));

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top HUD Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-2xl shadow-inner">
              {userAvatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-wide">{userName}</span>
                {isMultiplayer && (
                  <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded text-[10px] font-bold">
                    LIVE MATCH
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {language === 'nepali' ? '🇳🇵 Romanized Nepali Unicode' : '🇬🇧 English Velocity'}
              </div>
            </div>
          </div>

          {/* Connection Status & Multi Info */}
          {isMultiplayer && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
                <span className="text-slate-500">Lobby:</span>
                <span className="text-indigo-400 font-bold">{multiplayerLobby?.roomId || 'NTP'}</span>
              </div>

              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}
              >
                {connectionStatus === 'connected' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Authoritative Sync</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>Reconnecting...</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Live Telemetry Pills */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-center min-w-[75px]">
              <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Net WPM</div>
              <div className="text-xl font-black text-indigo-400">{liveWpm}</div>
            </div>

            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-center min-w-[75px]">
              <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Accuracy</div>
              <div className="text-xl font-black text-emerald-400">{liveAccuracy}%</div>
            </div>

            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-center min-w-[70px]">
              <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Combo</div>
              <div className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
                {combo > 0 && <Flame className="w-4 h-4 fill-amber-400" />}
                <span>{combo}</span>
              </div>
            </div>

            <button
              onClick={onExit}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold transition border border-slate-700"
            >
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Real-Time Multi-Lane Race Track */}
      <RaceTrackView
        racers={allRacers}
        language={language}
        activeCombo={combo}
        reducedMotion={reducedMotion}
      />

      {/* Target Passage & Live Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
        {/* Synchronized Countdown Overlay */}
        {countdown > 0 && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-3 animate-fade-in">
            <div className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-violet-300 to-amber-300 animate-bounce font-mono">
              {countdown}
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-300 tracking-wider">
              {isMultiplayer ? 'SYNCHRONIZING ALL PLAYERS...' : 'GET READY TO RACE!'}
            </div>
            {isMultiplayer && (
              <div className="text-xs text-slate-500 font-mono">
                Start timestamp synchronized with backend
              </div>
            )}
          </div>
        )}

        {/* Word Display Stream */}
        <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-6 leading-relaxed font-sans text-lg sm:text-xl select-none tracking-wide">
          <div className="flex flex-wrap gap-x-2 gap-y-3">
            {words.map((word, idx) => {
              const isPast = idx < currentWordIndex;
              const isCurrent = idx === currentWordIndex;
              const isFuture = idx > currentWordIndex;

              return (
                <span
                  key={idx}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    isPast
                      ? 'text-emerald-400/80 bg-emerald-950/20'
                      : isCurrent
                      ? 'text-white font-bold bg-indigo-600/30 border border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-md scale-105'
                      : 'text-slate-500'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </div>

          {/* Phonetic Transliteration Hint for Nepali */}
          {language === 'nepali' && words[currentWordIndex] && (
            <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Phonetic Target:</span>
                <span className="font-mono text-indigo-300 font-bold bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-800/40">
                  {words[currentWordIndex]}
                </span>
                <span className="text-slate-500 font-mono">
                  (Type: {getRomanizedHintForWord(words[currentWordIndex])})
                </span>
              </div>
              <div className="font-mono text-emerald-400 font-bold">
                Converted: {currentConverted || '...'}
              </div>
            </div>
          )}
        </div>

        {/* Interactive Typing Input */}
        <div className="space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={currentBuffer}
              onChange={() => {}}
              onKeyDown={handleKeyDown}
              disabled={countdown > 0 || isFinished}
              placeholder={
                countdown > 0
                  ? 'Race starting in countdown...'
                  : isFinished
                  ? 'Race completed!'
                  : 'Type the words here and press SPACE...'
              }
              className="w-full px-6 py-4 bg-slate-950 border-2 border-indigo-500/60 focus:border-indigo-400 rounded-2xl text-xl text-white font-mono tracking-wider focus:outline-none focus:ring-4 focus:ring-indigo-500/20 shadow-inner placeholder:text-slate-600 transition disabled:opacity-60"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-xs font-mono text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-xl border border-indigo-800/60">
                Word {currentWordIndex + 1} of {words.length} ({progressPercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
