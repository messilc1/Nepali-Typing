import React, { useState } from 'react';
import { ArenaProfile, ArenaLanguage, LocalPlayerConfig } from '../../types/arenaTypes';
import { QUICK_RACE_TEXTS } from '../../data/arenaData';
import {
  Monitor,
  Users,
  Play,
  RotateCcw,
  Trophy,
  Crown,
  CheckCircle2,
  ArrowRight,
  Zap,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LocalMultiplayerViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  onBack: () => void;
}

export const LocalMultiplayerView: React.FC<LocalMultiplayerViewProps> = ({
  profile,
  language,
  onBack
}) => {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [players, setPlayers] = useState<LocalPlayerConfig[]>([
    { id: 'p1', name: 'Subhash', avatar: '🏎️', color: 'blue', score: 0, wpm: 0, accuracy: 100, finished: false, timeSeconds: 0 },
    { id: 'p2', name: 'Player 2', avatar: '🚀', color: 'emerald', score: 0, wpm: 0, accuracy: 100, finished: false, timeSeconds: 0 },
    { id: 'p3', name: 'Player 3', avatar: '🦅', color: 'amber', score: 0, wpm: 0, accuracy: 100, finished: false, timeSeconds: 0 },
    { id: 'p4', name: 'Player 4', avatar: '🔥', color: 'purple', score: 0, wpm: 0, accuracy: 100, finished: false, timeSeconds: 0 }
  ]);

  const [activeTurnPlayerIdx, setActiveTurnPlayerIdx] = useState<number>(0);
  const [gameState, setGameState] = useState<'setup' | 'turn-ready' | 'typing' | 'turn-results' | 'tournament-complete'>('setup');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(3);

  // Active typing turn state
  const samplePool = QUICK_RACE_TEXTS[language] || QUICK_RACE_TEXTS.english;
  const [targetText, setTargetText] = useState<string>(samplePool[0]);
  const words = targetText.split(/\s+/).filter(Boolean);

  const [typedBuffer, setTypedBuffer] = useState<string>('');
  const [wordIdx, setWordIdx] = useState<number>(0);
  const [turnStartTime, setTurnStartTime] = useState<number | null>(null);
  const [turnElapsedSec, setTurnElapsedSec] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const activePlayer = players[activeTurnPlayerIdx] || players[0];

  const handleStartTournament = () => {
    setGameState('turn-ready');
    setActiveTurnPlayerIdx(0);
    setRoundNumber(1);
    setTargetText(samplePool[Math.floor(Math.random() * samplePool.length)]);
  };

  const handleBeginTurn = () => {
    setGameState('typing');
    setTypedBuffer('');
    setWordIdx(0);
    setMistakes(0);
    setCorrectCount(0);
    setTurnStartTime(Date.now());
  };

  const handleTurnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameState !== 'typing') return;

    const key = e.key;
    const targetWord = words[wordIdx] || '';

    if (key === ' ') {
      e.preventDefault();
      if (typedBuffer === targetWord) {
        const nextWordIdx = wordIdx + 1;
        const newCorrect = correctCount + targetWord.length + 1;
        setCorrectCount(newCorrect);
        setWordIdx(nextWordIdx);
        setTypedBuffer('');

        if (nextWordIdx >= words.length) {
          finishTurn(newCorrect);
        }
      } else {
        setMistakes((prev) => prev + 1);
      }
      return;
    }

    if (key === 'Backspace') {
      e.preventDefault();
      setTypedBuffer((prev) => prev.slice(0, -1));
      return;
    }

    if (key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const nextBuf = typedBuffer + key;
      if (targetWord.startsWith(nextBuf)) {
        setTypedBuffer(nextBuf);
        setCorrectCount((prev) => prev + 1);
      } else {
        setMistakes((prev) => prev + 1);
      }
    }
  };

  const finishTurn = (finalCorrect: number) => {
    const now = Date.now();
    const duration = turnStartTime ? Math.max(1, (now - turnStartTime) / 1000) : 1;
    const minutes = duration / 60;
    const gross = (finalCorrect / 5) / minutes;
    const net = Math.max(0, gross - (mistakes / minutes));
    const totalKeystrokes = finalCorrect + mistakes;
    const acc = totalKeystrokes > 0 ? (finalCorrect / totalKeystrokes) * 100 : 100;

    // Update active player's score
    const updatedPlayers = [...players];
    updatedPlayers[activeTurnPlayerIdx] = {
      ...updatedPlayers[activeTurnPlayerIdx],
      wpm: Math.round(net),
      accuracy: Math.round(acc),
      timeSeconds: duration,
      finished: true,
      score: updatedPlayers[activeTurnPlayerIdx].score + Math.round(net)
    };
    setPlayers(updatedPlayers);

    // Check if round is complete for all players
    const nextPlayerIdx = activeTurnPlayerIdx + 1;
    if (nextPlayerIdx < playerCount) {
      setActiveTurnPlayerIdx(nextPlayerIdx);
      setGameState('turn-ready');
    } else {
      // Round Complete
      if (roundNumber < totalRounds) {
        setGameState('turn-results');
      } else {
        setGameState('tournament-complete');
        try {
          confetti({ particleCount: 100, spread: 80 });
        } catch {}
      }
    }
  };

  const handleNextRound = () => {
    setRoundNumber((prev) => prev + 1);
    setActiveTurnPlayerIdx(0);
    setTargetText(samplePool[Math.floor(Math.random() * samplePool.length)]);
    setGameState('turn-ready');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-indigo-300 text-xs font-bold font-mono">
            <Monitor className="w-3.5 h-3.5" />
            <span>LOCAL MULTIPLAYER BATTLE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Same-Device Pass &amp; Play Championship
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Compete with friends on the same computer. Race identical texts turn-by-turn with automated scorekeeping and podium crowning.
          </p>
        </div>
      </div>

      {/* Setup Mode Screen */}
      {gameState === 'setup' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <label className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Select Number of Competitors
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`py-3 px-4 rounded-2xl border text-sm font-black transition-all cursor-pointer ${
                    playerCount === count
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {count} Players
                </button>
              ))}
            </div>
          </div>

          {/* Player Names & Avatars Roster */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Player Roster
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {players.slice(0, playerCount).map((p, idx) => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl">
                  <span className="text-2xl">{p.avatar}</span>
                  <div className="flex-1">
                    <span className="text-[10px] text-slate-500 font-mono block">Player {idx + 1}</span>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => {
                        const updated = [...players];
                        updated[idx].name = e.target.value;
                        setPlayers(updated);
                      }}
                      className="bg-transparent text-sm font-bold text-white focus:outline-none focus:border-b border-blue-500 w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={onBack}
              className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              Back to Arena Hub
            </button>

            <button
              onClick={handleStartTournament}
              className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Local Championship</span>
            </button>
          </div>
        </div>
      )}

      {/* Turn Ready Screen (Pass to Next Player) */}
      {gameState === 'turn-ready' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-blue-950/80 border border-blue-800 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-blue-950/50">
            {activePlayer.avatar}
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest block mb-1">
              ROUND {roundNumber} OF {totalRounds}
            </span>
            <h3 className="text-3xl font-black text-white">
              Pass Keyboard to <span className="text-blue-400">{activePlayer.name}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
              Make sure {activePlayer.name} is seated and ready before starting the timer.
            </p>
          </div>

          <button
            onClick={handleBeginTurn}
            className="px-10 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base transition-all cursor-pointer shadow-xl shadow-blue-600/40 inline-flex items-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>I'm Ready &mdash; Start Race</span>
          </button>
        </div>
      )}

      {/* Active Typing Screen */}
      {gameState === 'typing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{activePlayer.avatar}</span>
              <div>
                <h3 className="text-lg font-black text-white">{activePlayer.name}'s Turn</h3>
                <span className="text-xs font-mono text-slate-400">Round {roundNumber} / {totalRounds}</span>
              </div>
            </div>

            <div className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm font-black text-blue-400">
              Word {wordIdx + 1} / {words.length}
            </div>
          </div>

          {/* Words stream */}
          <div className="text-xl sm:text-2xl leading-relaxed select-none flex flex-wrap gap-2.5 items-center p-4 bg-slate-950 rounded-2xl border border-slate-800">
            {words.map((w, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-lg ${
                  idx === wordIdx
                    ? 'bg-blue-600/30 text-blue-200 ring-2 ring-blue-500 font-bold'
                    : idx < wordIdx
                    ? 'text-slate-500 line-through opacity-50'
                    : 'text-slate-300'
                }`}
              >
                {w}
              </span>
            ))}
          </div>

          {/* Typing input */}
          <input
            type="text"
            value={typedBuffer}
            onChange={() => {}}
            onKeyDown={handleTurnKeyDown}
            placeholder="Type word and press Space..."
            className="w-full bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-2xl px-5 py-4 text-xl font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            autoFocus
          />
        </div>
      )}

      {/* Tournament Standings / Complete Screen */}
      {(gameState === 'turn-results' || gameState === 'tournament-complete') && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="text-center pb-4 border-b border-slate-800">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2" />
            <h3 className="text-2xl font-black text-white">
              {gameState === 'tournament-complete' ? 'CHAMPIONSHIP COMPLETE!' : `ROUND ${roundNumber} STANDINGS`}
            </h3>
          </div>

          {/* Leaderboard Table */}
          <div className="space-y-2 font-mono text-sm">
            {[...players.slice(0, playerCount)]
              .sort((a, b) => b.score - a.score)
              .map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border ${
                    idx === 0
                      ? 'bg-amber-950/60 border-amber-800 text-amber-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-500 w-5">#{idx + 1}</span>
                    <span className="text-2xl">{p.avatar}</span>
                    <span className="font-sans font-bold">{p.name}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span>{p.wpm} WPM</span>
                    <span className="text-amber-400 font-black">{p.score} PTS</span>
                  </div>
                </div>
              ))}
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            {gameState === 'tournament-complete' ? (
              <button
                onClick={() => setGameState('setup')}
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm cursor-pointer shadow-lg"
              >
                Start New Local Match
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className="px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm cursor-pointer shadow-lg"
              >
                Proceed to Round {roundNumber + 1}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
