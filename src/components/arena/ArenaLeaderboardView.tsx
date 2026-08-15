import React, { useState } from 'react';
import { ArenaProfile, ArenaLanguage, ArenaLeaderboardEntry } from '../../types/arenaTypes';
import { MOCK_GLOBAL_LEADERBOARD, MOCK_NEPALI_LEADERBOARD } from '../../data/arenaData';
import {
  Trophy,
  Globe,
  Users,
  Flame,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Crown
} from 'lucide-react';

interface ArenaLeaderboardViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  onBack: () => void;
}

export const ArenaLeaderboardView: React.FC<ArenaLeaderboardViewProps> = ({
  profile,
  language,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'nepal' | 'friends' | 'leagues'>('global');

  const currentList = activeTab === 'nepal' ? MOCK_NEPALI_LEADERBOARD : MOCK_GLOBAL_LEADERBOARD;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>COMPETITION LEADERBOARDS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Worldwide &amp; Nepal Rankings
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Live verified competition scores, weekly league standings, and promotion ladders.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-3 rounded-2xl">
          <div className="text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current League</span>
            <span className="text-sm font-black text-amber-300">{profile.league} League</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
          {[
            { id: 'global', label: '🌎 Global', icon: <Globe className="w-4 h-4" /> },
            { id: 'nepal', label: '🇳🇵 Nepal', icon: <Trophy className="w-4 h-4" /> },
            { id: 'friends', label: '👥 Friends', icon: <Users className="w-4 h-4" /> },
            { id: 'leagues', label: '🏆 Weekly Leagues', icon: <Crown className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="space-y-2 font-mono text-xs">
          {currentList.map((entry) => {
            const isUser = entry.isCurrentUser;

            return (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                  isUser
                    ? 'bg-blue-950/80 border-blue-600/70 text-blue-200 ring-1 ring-blue-500/30'
                    : 'bg-slate-950/80 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center font-black ${
                    entry.rank === 1
                      ? 'text-amber-400 text-sm'
                      : entry.rank === 2
                      ? 'text-slate-300 text-sm'
                      : entry.rank === 3
                      ? 'text-amber-600 text-sm'
                      : 'text-slate-500'
                  }`}>
                    #{entry.rank}
                  </span>

                  <span className="text-2xl">{entry.avatar}</span>

                  <div>
                    <strong className={`font-sans text-sm block ${isUser ? 'text-blue-300 font-extrabold' : 'text-white'}`}>
                      {entry.playerName} {isUser && <span className="text-[10px] bg-blue-500/30 text-blue-300 px-1 py-0.2 rounded">YOU</span>}
                    </strong>
                    <span className="text-[11px] text-slate-400">
                      {entry.tier} {entry.division} &bull; {entry.wins} Wins
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-sm font-black text-white">{entry.wpm} WPM</span>
                    <span className="text-[10px] text-slate-500 block">{entry.accuracy}% Acc</span>
                  </div>

                  <div className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-indigo-300 font-bold">
                    {entry.rating} MMR
                  </div>
                </div>
              </div>
            );
          })}
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
