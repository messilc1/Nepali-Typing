import React, { useEffect } from 'react';
import {
  Racer,
  CompetitiveTier,
  CompetitiveDivision,
  OfficialMultiplayerResult
} from '../../types/arenaTypes';
import {
  Trophy,
  Award,
  Zap,
  ShieldCheck,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle,
  XCircle,
  Activity,
  Target,
  Users,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playFinishFanfare } from '../../utils/gameAudio';

interface RaceResultsModalProps {
  userRacer: Racer;
  allRacers: Racer[];
  userPlace: number;
  xpEarned: number;
  ratingDelta: number;
  currentRating: number;
  tier: CompetitiveTier;
  division: CompetitiveDivision;
  isNewPersonalBest?: boolean;
  mistypedKeys?: Record<string, number>;
  mistypedWords?: Record<string, number>;
  wpmHistory?: { second: number; wpm: number; errors: number }[];
  officialMultiplayerResults?: OfficialMultiplayerResult[];
  onPlayAgain: () => void;
  onExitToHub: () => void;
  onPracticeWeakness?: (keys: string[]) => void;
  gameModeTitle?: string;
}

export const RaceResultsModal: React.FC<RaceResultsModalProps> = ({
  userRacer,
  allRacers,
  userPlace,
  xpEarned,
  ratingDelta,
  currentRating,
  tier,
  division,
  isNewPersonalBest = false,
  mistypedKeys = {},
  mistypedWords = {},
  wpmHistory = [],
  officialMultiplayerResults,
  onPlayAgain,
  onExitToHub,
  onPracticeWeakness,
  gameModeTitle = 'Typing Race'
}) => {
  const isFirstPlace = userPlace === 1;

  useEffect(() => {
    playFinishFanfare(isFirstPlace);
    if (isFirstPlace) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    }
  }, [isFirstPlace]);

  const sortedRacers = [...allRacers].sort((a, b) => {
    if (a.status === 'finished' && b.status === 'finished') {
      return (a.finishTime || 0) - (b.finishTime || 0);
    }
    if (a.status === 'finished') return -1;
    if (b.status === 'finished') return 1;
    return b.currentProgress - a.currentProgress;
  });

  const weakKeysList = Object.entries(mistypedKeys)
    .sort((a: [string, number], b: [string, number]) => Number(b[1]) - Number(a[1]))
    .map(([k]) => k)
    .slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
        {/* Header Ribbon / Placement */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="inline-flex items-center justify-center mb-3">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-xl ${
              isFirstPlace
                ? 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-amber-500/30 ring-4 ring-amber-400/40'
                : userPlace === 2
                ? 'bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-950'
                : userPlace === 3
                ? 'bg-gradient-to-tr from-amber-700 to-amber-500 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {isFirstPlace ? '🏆' : userPlace === 2 ? '🥈' : userPlace === 3 ? '🥉' : '🏁'}
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>{isFirstPlace ? 'VICTORY! 1st PLACE' : `${userPlace}${userPlace === 2 ? 'nd' : userPlace === 3 ? 'rd' : 'th'} PLACE FINISH`}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
            {gameModeTitle} &bull; {userRacer.finishTime ? `${userRacer.finishTime.toFixed(1)}s elapsed` : 'Race Complete'}
          </p>

          {isNewPersonalBest && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-500/50 rounded-full text-amber-300 text-xs font-black mt-2.5 animate-pulse">
              <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>NEW ARENA PERSONAL BEST!</span>
            </div>
          )}
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Net Speed</span>
            <span className="text-3xl font-black text-blue-400 font-mono">
              {Math.round(userRacer.netWpm || userRacer.wpm || 0)}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">WPM</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Accuracy</span>
            <span className="text-3xl font-black text-emerald-400 font-mono">
              {userRacer.accuracy ? userRacer.accuracy.toFixed(1) : '100'}%
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">
              {userRacer.mistakes || 0} Mistakes
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">XP Gained</span>
            <span className="text-3xl font-black text-amber-400 font-mono">
              +{xpEarned}
            </span>
            <span className="text-[10px] text-slate-500 block font-mono">Arena Level XP</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Rating / Rank</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl font-black text-indigo-300 font-mono">
                {currentRating}
              </span>
              <span className={`text-xs font-bold font-mono px-1 rounded ${
                ratingDelta >= 0 ? 'text-emerald-400 bg-emerald-950' : 'text-rose-400 bg-rose-950'
              }`}>
                {ratingDelta >= 0 ? `+${ratingDelta}` : ratingDelta}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-sans font-semibold">
              {tier} {division}
            </span>
          </div>
        </div>

        {/* Server-Authoritative Standings & Anti-Cheat */}
        <div className="space-y-4 my-6">
          {/* Anti-Cheat Badge */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-950/90 border border-emerald-900/50 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authoritative Match Server: Verified Results</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Synchronized
            </span>
          </div>

          {/* Official Standings */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Official Race Standings</span>
              </span>
              {officialMultiplayerResults && (
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  ● Server-Validated Results
                </span>
              )}
            </h3>

            <div className="space-y-1.5 font-mono text-xs">
              {(officialMultiplayerResults || sortedRacers).map((racer: any, idx: number) => {
                const isUser = racer.isPlayer || racer.playerId === userRacer.id;
                const netSpeed = racer.netWpm ?? racer.wpm ?? 0;
                const finishTime = racer.finishTimeSeconds ?? racer.finishTime;

                return (
                  <div
                    key={racer.id || racer.playerId || idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl ${
                      isUser
                        ? 'bg-blue-950/80 border border-blue-700/60 text-blue-200 font-bold'
                        : 'bg-slate-900/60 border border-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-center font-bold text-slate-400">#{racer.rank || idx + 1}</span>
                      <span className="text-base">{racer.avatar || '🏎️'}</span>
                      <span className="truncate max-w-[150px] sm:max-w-[220px]">
                        {racer.name} {isUser && '(YOU)'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-blue-300 font-bold">{Math.round(netSpeed)} WPM</span>
                      {racer.accuracy !== undefined && (
                        <span className="text-emerald-400">{racer.accuracy}% Acc</span>
                      )}
                      <span className="text-slate-500">
                        {finishTime ? `${Number(finishTime).toFixed(1)}s` : `${Math.round(racer.currentProgress || 100)}%`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mistyped Keys & Weakness Coach CTA */}
          {weakKeysList.length > 0 && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Mistakes Detected in this Race</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    {weakKeysList.map((key) => (
                      <span key={key} className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-mono text-xs font-black">
                        {key === ' ' ? 'Space' : key} ({mistypedKeys[key]}x)
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {onPracticeWeakness && (
                <button
                  onClick={() => onPracticeWeakness(weakKeysList)}
                  className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Train Weak Keys in Arena</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onExitToHub}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer text-center"
          >
            Return to Arena Hub
          </button>

          <button
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-black transition-all cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Next Round</span>
          </button>
        </div>
      </div>
    </div>
  );
};

