import React, { useState } from 'react';
import { ArenaProfile, ArenaLanguage, Racer } from '../../types/arenaTypes';
import { QUICK_RACE_TEXTS } from '../../data/arenaData';
import {
  Trophy,
  Crown,
  Play,
  CheckCircle2,
  Users,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface TournamentViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  onLaunchTournamentMatch: (config: {
    opponents: Racer[];
    text: string;
    raceTitle: string;
  }) => void;
  onBack: () => void;
}

export const TournamentView: React.FC<TournamentViewProps> = ({
  profile,
  language,
  onLaunchTournamentMatch,
  onBack
}) => {
  const [currentRound, setCurrentRound] = useState<'Qualification' | 'Round of 16' | 'Quarter Final' | 'Semi Final' | 'Grand Final'>('Quarter Final');

  const handlePlayMatch = () => {
    const opponent: Racer = {
      id: 'tourney-rival',
      name: 'Pooja_Shrestha (Rank #3)',
      avatar: '🦅',
      isPlayer: false,
      isAi: true,
      wpm: 68,
      currentProgress: 0,
      position: 2,
      status: 'ready'
    };

    const samplePool = QUICK_RACE_TEXTS[language] || QUICK_RACE_TEXTS.english;
    const selectedText = samplePool[Math.floor(Math.random() * samplePool.length)];

    onLaunchTournamentMatch({
      opponents: [opponent],
      text: selectedText,
      raceTitle: `Weekly Championship &bull; ${currentRound}`
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>WEEKLY TOURNAMENT ARENA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            The Championship Bracket
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Single elimination bracket from Round of 32 down to the Grand Final. Compete with progressively harder passages.
          </p>
        </div>

        <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Stage</span>
          <strong className="text-amber-400 font-mono font-black text-base">{currentRound}</strong>
        </div>
      </div>

      {/* Bracket Visualizer Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 overflow-x-auto gap-2">
          {['Qualification', 'Round of 16', 'Quarter Final', 'Semi Final', 'Grand Final'].map((rnd, idx) => {
            const isCurrent = rnd === currentRound;
            const isPast = idx < 2;

            return (
              <div
                key={rnd}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : isPast
                    ? 'bg-slate-950 border border-emerald-800 text-emerald-400 font-bold'
                    : 'bg-slate-950/60 border border-slate-800 text-slate-500'
                }`}
              >
                {isPast && <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{rnd}</span>
              </div>
            );
          })}
        </div>

        {/* Current Matchup Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-6">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Upcoming Matchup</span>

          <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 max-w-md mx-auto">
            <div className="p-4 rounded-xl bg-slate-900 border border-blue-600/60">
              <span className="text-3xl block mb-1">{profile.selectedAvatar || '🏎️'}</span>
              <strong className="text-sm text-blue-300 block font-sans">You</strong>
              <span className="text-xs font-mono text-slate-400">{profile.rating} MMR</span>
            </div>

            <div className="text-2xl font-black text-amber-400 font-mono">VS</div>

            <div className="p-4 rounded-xl bg-slate-900 border border-rose-600/60">
              <span className="text-3xl block mb-1">🦅</span>
              <strong className="text-sm text-rose-300 block font-sans truncate">Pooja Shrestha</strong>
              <span className="text-xs font-mono text-slate-400">1820 MMR</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handlePlayMatch}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/30 inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Enter Quarter Final Race</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-between">
          <button
            onClick={onBack}
            className="px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Back to Arena Hub
          </button>
        </div>
      </div>
    </div>
  );
};
