import React from 'react';
import { ArenaProfile } from '../../types/arenaTypes';
import { Award, Zap, Target, Flame, Trophy, Clock, Flag, TrendingUp } from 'lucide-react';

interface MyRecordsViewProps {
  profile: ArenaProfile;
  onBack: () => void;
}

export const MyRecordsView: React.FC<MyRecordsViewProps> = ({
  profile,
  onBack
}) => {
  const records = profile.records;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-indigo-300 text-xs font-bold font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>PERSONAL BESTS &amp; CAREER MILESTONES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Lifetime Arena Records
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Detailed tracking of all lifetime records across Nepali &amp; English typing races, streaks, win rates, and highest tier finishes.
          </p>
        </div>
      </div>

      {/* Grid of Records */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <Zap className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Highest English WPM</span>
            <span className="text-3xl font-black text-amber-400 font-mono block my-1">
              {records.highestWpmEnglish || profile.highestWpm || 0}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Verified Speed</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <Zap className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Highest Nepali WPM</span>
            <span className="text-3xl font-black text-blue-400 font-mono block my-1">
              {records.highestWpmNepali || 0}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Unicode Transliteration</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <Target className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Best Accuracy</span>
            <span className="text-3xl font-black text-emerald-400 font-mono block my-1">
              {records.bestAccuracy ? records.bestAccuracy.toFixed(1) : profile.bestAccuracy ? profile.bestAccuracy.toFixed(1) : '100'}%
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Precision Gate</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <Flame className="w-6 h-6 text-orange-400 mx-auto mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Longest Combo</span>
            <span className="text-3xl font-black text-orange-400 font-mono block my-1">
              {records.longestCombo || profile.longestCombo || 0}x
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Unbroken Keystrokes</span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Races Won</span>
            <span className="text-3xl font-black text-yellow-400 font-mono block my-1">
              {profile.winsCount || 0}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {profile.racesCount > 0 ? `${((profile.winsCount / profile.racesCount) * 100).toFixed(0)}% Win Rate` : '0% Win Rate'}
            </span>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center">
            <TrendingUp className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase">Highest Rank</span>
            <span className="text-2xl font-black text-indigo-300 font-mono block my-1">
              {records.highestRankReached || `${profile.tier} ${profile.division}`}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{profile.rating} Current MMR</span>
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
