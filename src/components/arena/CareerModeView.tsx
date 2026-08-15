import React, { useState } from 'react';
import { ArenaProfile, ArenaLanguage, CareerStage } from '../../types/arenaTypes';
import { CAREER_LEVELS } from '../../data/arenaData';
import {
  Flag,
  Zap,
  Gauge,
  Flame,
  Target,
  Award,
  Crosshair,
  Crown,
  ShieldAlert,
  Sparkles,
  Lock,
  CheckCircle2,
  Star,
  Play,
  ArrowRight
} from 'lucide-react';

interface CareerModeViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  onStartStage: (stage: CareerStage) => void;
  onBack: () => void;
}

const LEVEL_ICONS: Record<string, React.ReactNode> = {
  Flag: <Flag className="w-5 h-5 text-blue-400" />,
  Zap: <Zap className="w-5 h-5 text-amber-400" />,
  Gauge: <Gauge className="w-5 h-5 text-emerald-400" />,
  Flame: <Flame className="w-5 h-5 text-orange-400" />,
  Target: <Target className="w-5 h-5 text-rose-400" />,
  Award: <Award className="w-5 h-5 text-purple-400" />,
  Crosshair: <Crosshair className="w-5 h-5 text-cyan-400" />,
  Crown: <Crown className="w-5 h-5 text-yellow-400" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-red-400" />,
  Sparkles: <Sparkles className="w-5 h-5 text-indigo-400" />
};

export const CareerModeView: React.FC<CareerModeViewProps> = ({
  profile,
  language,
  onStartStage,
  onBack
}) => {
  const [selectedLevelNum, setSelectedLevelNum] = useState<number>(() => {
    // Find highest unlocked level
    return Math.min(10, Math.max(1, profile.level));
  });

  const selectedLevel = CAREER_LEVELS.find((l) => l.levelNumber === selectedLevelNum) || CAREER_LEVELS[0];
  const isLevelUnlocked = profile.level >= selectedLevel.minLevelToUnlock;

  // Compute total stars earned in career
  const totalStarsEarned = Object.values(profile.careerProgress || {}).reduce(
    (acc: number, stage: any) => acc + (stage?.stars || 0),
    0
  );

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-300 text-xs font-bold font-mono">
            <span>CAREER MODE PROGRESSION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            From Rookie to Typing Legend
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Conquer 10 tiers of structured racing trials. Each stage tests both your speed and accuracy thresholds.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-5 py-3.5 rounded-2xl">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Career Stars</span>
            <div className="flex items-center gap-1 text-amber-400 font-mono font-black text-lg">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{totalStarsEarned} / 120</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div className="text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Unlocked Level</span>
            <span className="text-lg font-black text-blue-400 font-mono">
              Level {profile.level}
            </span>
          </div>
        </div>
      </div>

      {/* Level Selection Tabs / Roadmap */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {CAREER_LEVELS.map((lvl) => {
          const unlocked = profile.level >= lvl.minLevelToUnlock;
          const isSelected = lvl.levelNumber === selectedLevelNum;

          // Count completed stages for this level
          const completedCount = lvl.stages.filter(
            (s) => profile.careerProgress[s.id]?.completed
          ).length;

          return (
            <button
              key={lvl.levelNumber}
              onClick={() => setSelectedLevelNum(lvl.levelNumber)}
              className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all cursor-pointer font-sans ${
                isSelected
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                  : unlocked
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  : 'bg-slate-950/60 border-slate-900 text-slate-600 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="p-1 rounded-lg bg-black/20">
                {unlocked ? LEVEL_ICONS[lvl.iconName] || <Flag className="w-4 h-4" /> : <Lock className="w-4 h-4 text-slate-600" />}
              </div>
              <div className="text-left">
                <div className="text-xs font-black leading-tight">{lvl.tierName}</div>
                <div className={`text-[10px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                  Lvl {lvl.levelNumber} &bull; {completedCount}/{lvl.stages.length}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Level Stages Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-blue-400 uppercase font-bold">LEVEL {selectedLevel.levelNumber} CIRCUIT</span>
            <h3 className="text-xl sm:text-2xl font-black text-white">{selectedLevel.title}</h3>
          </div>

          {!isLevelUnlocked && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Requires Player Level {selectedLevel.minLevelToUnlock}</span>
            </div>
          )}
        </div>

        {/* 4 Stages in this level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {selectedLevel.stages.map((stage) => {
            const progress = profile.careerProgress[stage.id];
            const isCompleted = progress?.completed;
            const stars = progress?.stars || 0;

            return (
              <div
                key={stage.id}
                className={`relative rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-slate-950/90 border-emerald-900/60 ring-1 ring-emerald-500/20'
                    : isLevelUnlocked
                    ? 'bg-slate-950/80 border-slate-800 hover:border-blue-500/50'
                    : 'bg-slate-950/40 border-slate-900 opacity-50'
                }`}
              >
                <div>
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      STAGE {stage.stageNumber}
                    </span>

                    {/* Stars Earned */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-3.5 h-3.5 ${
                            starIdx <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h4 className="text-base font-black text-white mb-1">{stage.title}</h4>
                  <p className="text-xs text-slate-400 mb-4">{stage.description}</p>

                  {/* Dual Passing Conditions */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">MIN SPEED</span>
                      <strong className="text-blue-400 font-black text-sm">{stage.targetWpm} WPM</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">MIN ACCURACY</span>
                      <strong className="text-emerald-400 font-black text-sm">{stage.targetAccuracy}%</strong>
                    </div>
                  </div>

                  {progress && (
                    <div className="text-[11px] font-mono text-slate-400 mb-3 flex items-center justify-between">
                      <span>Best Speed: <strong className="text-white">{progress.bestWpm} WPM</strong></span>
                      <span>Best Acc: <strong className="text-white">{progress.bestAcc}%</strong></span>
                    </div>
                  )}
                </div>

                {/* Stage CTA Button */}
                <button
                  onClick={() => onStartStage(stage)}
                  disabled={!isLevelUnlocked}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-emerald-950/80 border border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                      : isLevelUnlocked
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCompleted ? 'Replay Stage' : 'Start Stage Race'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
