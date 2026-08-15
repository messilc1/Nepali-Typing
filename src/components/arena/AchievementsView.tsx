import React, { useState } from 'react';
import { ArenaProfile, AchievementDef } from '../../types/arenaTypes';
import { ACHIEVEMENTS } from '../../data/arenaData';
import { Trophy, Award, Lock, CheckCircle2, Zap, Flame, Star } from 'lucide-react';

interface AchievementsViewProps {
  profile: ArenaProfile;
  onBack: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  profile,
  onBack
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'speed' | 'accuracy' | 'streak' | 'races' | 'career' | 'mastery'>('all');

  const filteredAchievements = ACHIEVEMENTS.filter((ach) =>
    selectedCategory === 'all' ? true : ach.category === selectedCategory
  );

  const unlockedCount = ACHIEVEMENTS.filter((ach) => profile.achievements[ach.id]?.unlocked).length;
  const totalXpRewards = ACHIEVEMENTS.reduce((acc, a) => acc + (profile.achievements[a.id]?.unlocked ? a.xpReward : 0), 0);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-yellow-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-full text-yellow-300 text-xs font-bold font-mono">
            <Trophy className="w-3.5 h-3.5" />
            <span>TROPHY ROOM</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Arena Achievements &amp; Badges
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Unlock prestige trophies across speed tiers, accuracy precision, race volume, streak maintenance, and boss victories.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-5 py-3.5 rounded-2xl">
          <div className="text-center font-mono">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Trophies Earned</span>
            <span className="text-lg font-black text-amber-400">{unlockedCount} / {ACHIEVEMENTS.length}</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
          {['all', 'speed', 'accuracy', 'streak', 'races', 'career', 'mastery'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase font-mono transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredAchievements.map((ach) => {
            const isUnlocked = profile.achievements[ach.id]?.unlocked;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 shadow-lg ring-1 ring-amber-500/20'
                    : 'bg-slate-950/60 border-slate-900 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  isUnlocked ? 'bg-amber-950/60 border border-amber-800 text-amber-400' : 'bg-slate-900 text-slate-600'
                }`}>
                  {isUnlocked ? ach.icon : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-white">{ach.title}</h4>
                    <span className="text-[10px] font-mono font-bold text-amber-400">+{ach.xpReward} XP</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
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
