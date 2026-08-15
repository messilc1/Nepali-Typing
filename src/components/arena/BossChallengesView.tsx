import React from 'react';
import { ArenaProfile, ArenaLanguage, BossChallenge } from '../../types/arenaTypes';
import { BOSS_CHALLENGES } from '../../data/arenaData';
import {
  Skull,
  ShieldAlert,
  Flame,
  Award,
  Clock,
  Target,
  Play,
  CheckCircle2,
  Lock,
  Zap
} from 'lucide-react';

interface BossChallengesViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  onStartBoss: (boss: BossChallenge) => void;
  onBack: () => void;
}

export const BossChallengesView: React.FC<BossChallengesViewProps> = ({
  profile,
  language,
  onStartBoss,
  onBack
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 border border-rose-500/40 rounded-full text-rose-300 text-xs font-bold font-mono">
            <Skull className="w-3.5 h-3.5" />
            <span>ELITE BOSS GAUNTLET</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Conquer the 6 Typing Bosses
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Intense boss trials with harsh modifiers: rare multi-syllabic vocabulary, punctuation storms, numeric ciphers, and high-accuracy locks.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-5 py-3.5 rounded-2xl">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Bosses Vanquished</span>
            <span className="text-lg font-black text-rose-400 font-mono">
              {Object.keys(profile.bossDefeated || {}).length} / 6
            </span>
          </div>
        </div>
      </div>

      {/* Boss Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {BOSS_CHALLENGES.map((boss) => {
          const isDefeated = profile.bossDefeated[boss.id]?.defeated;
          // Unlocked if previous boss is defeated or first boss
          const prevBossDefeated = boss.bossNumber === 1 || profile.bossDefeated[`boss-${boss.bossNumber - 1}`]?.defeated;
          const isUnlocked = prevBossDefeated || profile.level >= boss.bossNumber * 2;

          return (
            <div
              key={boss.id}
              className={`relative rounded-3xl border p-6 sm:p-7 flex flex-col justify-between transition-all ${
                isDefeated
                  ? 'bg-slate-950/90 border-emerald-800/60 ring-1 ring-emerald-500/30'
                  : isUnlocked
                  ? 'bg-slate-950/80 border-slate-800 hover:border-rose-500/50 shadow-lg'
                  : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div>
                {/* Boss Title & Avatar */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-3xl shadow-md">
                      {boss.avatarIcon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-rose-400">
                          BOSS #{boss.bossNumber}
                        </span>
                        {isDefeated && (
                          <span className="flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">
                            <CheckCircle2 className="w-3 h-3" /> Vanquished
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-white">{boss.name}</h3>
                      <p className="text-xs text-slate-400 font-sans">{boss.subtitle}</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">{boss.description}</p>

                {/* Boss Modifier Badge */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono mb-4 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[10px] uppercase font-bold text-rose-400">MODIFIER:</span>
                    <span className="text-white font-bold">{boss.modifier}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                    <div>
                      <span className="text-[9px] text-slate-500 block">TARGET</span>
                      <span className="text-blue-400 font-black">{boss.targetWpm} WPM</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">MIN ACCURACY</span>
                      <span className="text-emerald-400 font-black">{boss.minAccuracy}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block">TIME LIMIT</span>
                      <span className="text-amber-400 font-black">{boss.timeLimitSeconds}s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boss CTA */}
              <button
                onClick={() => onStartBoss(boss)}
                disabled={!isUnlocked}
                className={`w-full py-3 px-5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isDefeated
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : isUnlocked
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {!isUnlocked ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Locked (Defeat Boss {boss.bossNumber - 1})</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>{isDefeated ? 'Replay Boss Battle' : 'Engage Boss Battle'}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
