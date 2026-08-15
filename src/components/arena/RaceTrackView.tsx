import React from 'react';
import { Racer } from '../../types/arenaTypes';
import { Flag, Zap, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface RaceTrackViewProps {
  racers: Racer[];
  userCombo?: number;
  userShieldActive?: boolean;
  reducedMotion?: boolean;
}

export const RaceTrackView: React.FC<RaceTrackViewProps> = ({
  racers,
  userCombo = 0,
  userShieldActive = false,
  reducedMotion = false
}) => {
  // Sort by progress to compute positions dynamically
  const sortedRacers = [...racers].sort((a, b) => {
    if (a.status === 'finished' && b.status === 'finished') {
      return (a.finishTime || 0) - (b.finishTime || 0);
    }
    if (a.status === 'finished') return -1;
    if (b.status === 'finished') return 1;
    return b.currentProgress - a.currentProgress;
  });

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl overflow-hidden relative">
      {/* Track Header & Environmental Lights */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-300">LIVE ARENA TRACK</span>
          <span className="text-slate-600">|</span>
          <span>{racers.length} Competitors</span>
        </div>

        <div className="flex items-center gap-3">
          {userShieldActive && (
            <div className="flex items-center gap-1 text-blue-400 bg-blue-950/70 border border-blue-800 px-2 py-0.5 rounded-md font-sans font-bold text-[11px]">
              <Shield className="w-3 h-3 text-blue-400" />
              <span>Shield Active</span>
            </div>
          )}

          {userCombo >= 10 && (
            <div className="flex items-center gap-1 text-amber-400 bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded-md font-sans font-black text-[11px] animate-pulse">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>COMBO x{(userCombo >= 100 ? 3.0 : userCombo >= 50 ? 2.0 : userCombo >= 25 ? 1.5 : 1.2).toFixed(1)}</span>
              <span className="text-amber-300">({userCombo})</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-slate-400">
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span>Finish Line (100%)</span>
          </div>
        </div>
      </div>

      {/* Lanes Container */}
      <div className="space-y-2.5 relative">
        {/* Checkered Finish Line Strip on the right */}
        <div className="absolute top-0 bottom-0 right-[42px] w-2.5 z-0 flex flex-col justify-between opacity-30 pointer-events-none">
          <div className="h-full w-full bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] rounded-sm" />
        </div>

        {racers.map((racer, idx) => {
          const rankIndex = sortedRacers.findIndex(r => r.id === racer.id) + 1;
          const isLeader = rankIndex === 1 && racer.currentProgress > 0;
          const isUser = racer.isPlayer;
          const progressPercent = Math.min(100, Math.max(0, racer.currentProgress));
          const hasHighCombo = isUser && userCombo >= 25;

          return (
            <div
              key={racer.id || idx}
              className={`relative rounded-xl p-2 sm:p-2.5 transition-all duration-300 border ${
                isUser
                  ? 'bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/50 border-blue-600/70 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/30'
                  : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Lane Info Header */}
              <div className="flex items-center justify-between text-xs mb-1.5 font-sans">
                <div className="flex items-center gap-2">
                  {/* Position Pill */}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] font-black font-mono ${
                      rankIndex === 1
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : rankIndex === 2
                        ? 'bg-slate-300 text-slate-950'
                        : rankIndex === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    #{rankIndex}
                  </span>

                  {/* Racer Name & Avatar Tag */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{racer.avatar || (isUser ? '🏎️' : '🤖')}</span>
                    <span className={`font-bold truncate max-w-[140px] sm:max-w-[200px] ${
                      isUser ? 'text-blue-300 font-extrabold' : 'text-slate-200'
                    }`}>
                      {racer.name} {isUser && <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1 py-0.2 rounded font-mono font-normal">YOU</span>}
                    </span>
                  </div>

                  {racer.rankTier && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono hidden sm:inline">
                      {racer.rankTier} {racer.rankDivision}
                    </span>
                  )}
                </div>

                {/* Live Speed & Status */}
                <div className="flex items-center gap-2 font-mono">
                  {racer.status === 'finished' ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{racer.netWpm ? `${Math.round(racer.netWpm)} WPM` : 'Finished'}</span>
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${
                        isUser ? 'text-amber-300 font-black' : 'text-slate-300'
                      }`}>
                        {Math.round(racer.wpm || 0)} <span className="text-[10px] text-slate-500 font-normal">WPM</span>
                      </span>
                      <span className="text-slate-600 text-[10px]">|</span>
                      <span className="text-slate-400 text-[11px]">{Math.round(progressPercent)}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Race Track Lane Canvas */}
              <div className="w-full h-7 sm:h-8 bg-slate-900/90 rounded-lg relative overflow-hidden border border-slate-800/70 shadow-inner flex items-center px-1">
                {/* Distance Hash Marks */}
                <div className="absolute inset-0 flex justify-between px-4 pointer-events-none opacity-15">
                  <div className="h-full border-r border-slate-400 border-dashed" />
                  <div className="h-full border-r border-slate-400 border-dashed" />
                  <div className="h-full border-r border-slate-400 border-dashed" />
                  <div className="h-full border-r border-slate-400 border-dashed" />
                </div>

                {/* Asphalt Progress Trail */}
                <div
                  className={`absolute left-0 top-0 bottom-0 rounded-l-lg transition-all ${
                    reducedMotion ? '' : 'duration-150 ease-out'
                  } ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600/30 via-indigo-600/40 to-blue-500/50'
                      : 'bg-slate-800/40'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />

                {/* Animated Vehicle / Runner */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 z-10 transition-all flex items-center ${
                    reducedMotion ? '' : 'duration-150 ease-out'
                  }`}
                  style={{
                    left: `calc(${progressPercent}% * 0.90)`,
                  }}
                >
                  {/* Nitro Trail effect */}
                  {hasHighCombo && !reducedMotion && (
                    <div className="absolute right-full mr-1 flex items-center pointer-events-none animate-pulse">
                      <span className="text-xs">🔥</span>
                      <div className="w-6 h-1.5 bg-gradient-to-l from-amber-500 via-orange-500 to-transparent rounded-full blur-[1px]" />
                    </div>
                  )}

                  {/* Vehicle Icon Badge */}
                  <div
                    className={`relative p-1 rounded-md text-base leading-none shadow-md transition-transform ${
                      isUser
                        ? 'bg-blue-600 text-white scale-110 ring-2 ring-blue-400/80 shadow-blue-500/50'
                        : 'bg-slate-800 text-slate-200 border border-slate-700'
                    } ${isLeader ? 'animate-bounce' : ''}`}
                  >
                    <span>{racer.avatar || (isUser ? '🏎️' : '🤖')}</span>
                    {isLeader && (
                      <span className="absolute -top-2 -right-1 text-[10px]">👑</span>
                    )}
                  </div>
                </div>

                {/* Finish Line Flag in Lane */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 opacity-60">
                  <Flag className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
