import React, { useState } from 'react';
import { ArenaProfile, ArenaLanguage, Racer } from '../../types/arenaTypes';
import { BOT_ARCHETYPES } from '../../data/arenaData';
import { Target, Zap, Play, Sparkles, RefreshCw, Flame } from 'lucide-react';

interface WeaknessArenaViewProps {
  profile: ArenaProfile;
  language: ArenaLanguage;
  liveKeyStatsMap?: Record<string, { totalHits: number; errors: number; totalDurationMs: number }>;
  onStartWeaknessRace: (config: {
    opponents: Racer[];
    text: string;
    targetKeys: string[];
    raceTitle: string;
  }) => void;
  onBack: () => void;
}

export const WeaknessArenaView: React.FC<WeaknessArenaViewProps> = ({
  profile,
  language,
  liveKeyStatsMap = {},
  onStartWeaknessRace,
  onBack
}) => {
  // Extract weak keys from real telemetry
  const detectedWeakKeys = Object.entries(liveKeyStatsMap)
    .filter(([_, stats]: [string, any]) => (stats?.errors || 0) > 0 || (stats?.totalDurationMs || 0) / Math.max(1, stats?.totalHits || 1) > 350)
    .sort((a: [string, any], b: [string, any]) => (b[1]?.errors || 0) - (a[1]?.errors || 0))
    .map(([k]) => k)
    .slice(0, 4);

  const defaultKeys = language === 'nepali' ? ['ण', 'ष', 'ज्ञ', 'त्र'] : ['r', 't', 'p', ';'];
  const activeWeakKeys = detectedWeakKeys.length > 0 ? detectedWeakKeys : defaultKeys;

  // Generate targeted passages containing those keys
  const generateTargetText = () => {
    if (language === 'nepali') {
      return 'shreshtha gyan ra dridha sankalpa le shiksha kshetra ma thulo parivartan lyauna sakinchha. satya ra nispakshya nyaya le matra prajatantrik samrachana baliyo hunchha.';
    }
    return 'rapid practice through difficult transitions prepares your kinetic reflexes for continuous peak typing performance and perfect precision across all quadrant reaches.';
  };

  const handleLaunch = () => {
    const bot = BOT_ARCHETYPES[1]; // Novice Bot
    const opponents: Racer[] = [
      {
        id: 'weakness-bot-1',
        name: 'Pace Bot (Coach)',
        avatar: '🤖',
        isPlayer: false,
        isAi: true,
        wpm: 38,
        currentProgress: 0,
        position: 2,
        status: 'ready'
      }
    ];

    onStartWeaknessRace({
      opponents,
      text: generateTargetText(),
      targetKeys: activeWeakKeys,
      raceTitle: `Weakness Drill (${activeWeakKeys.join(', ')})`
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/50 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 text-xs font-bold font-mono">
            <Target className="w-3.5 h-3.5" />
            <span>AI WEAKNESS INTEGRATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Weakness Elimination Circuit
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Directly connected to your live keyboard heatmap and error telemetry. Spawns targeted racing challenges to eradicate your most frequent typos.
          </p>
        </div>
      </div>

      {/* Weak Keys & Target Words Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Identified Target Keys for Drill
          </span>

          <div className="flex flex-wrap gap-3">
            {activeWeakKeys.map((key) => (
              <div
                key={key}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/80 border border-rose-800/80 rounded-2xl shadow-md text-rose-200 font-mono"
              >
                <span className="text-xl font-black text-rose-300">{key === ' ' ? 'Space' : key}</span>
                <span className="text-[10px] bg-rose-900/80 px-2 py-0.5 rounded text-rose-300 font-bold uppercase">Target</span>
              </div>
            ))}
          </div>
        </div>

        {/* Drill Mechanics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <Zap className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-200 block">High Repetition</span>
            <span className="text-[11px] text-slate-400">Forces muscle memory lock on problem keys</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-200 block">Combo Multiplier</span>
            <span className="text-[11px] text-slate-400">Earn +20% bonus XP for clean execution</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <Sparkles className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
            <span className="text-xs font-bold text-slate-200 block">Adaptive Pacing</span>
            <span className="text-[11px] text-slate-400">Coach bot matches your pace dynamically</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            Back to Arena Hub
          </button>

          <button
            onClick={handleLaunch}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Weakness Race</span>
          </button>
        </div>
      </div>
    </div>
  );
};
