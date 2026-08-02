import React, { useState } from 'react';
import { KeyStats } from '../types';
import { Info, Sparkles, Flame } from 'lucide-react';

interface OnScreenKeyboardProps {
  keyStatsMap: Record<string, KeyStats>;
  activeKey?: string;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export const OnScreenKeyboard: React.FC<OnScreenKeyboardProps> = ({
  keyStatsMap,
  activeKey
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [heatmapMode, setHeatmapMode] = useState<'mistakes' | 'speed' | 'frequency'>('mistakes');

  // Compute key score/color
  const getKeyColorClass = (key: string) => {
    const stats = keyStatsMap[key.toLowerCase()];
    if (!stats || stats.totalHits === 0) {
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }

    if (heatmapMode === 'mistakes') {
      const accuracy = stats.totalHits > 0 ? (stats.correctHits / stats.totalHits) * 100 : 100;
      if (accuracy >= 95) return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 font-bold';
      if (accuracy >= 85) return 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800 font-bold';
      if (accuracy >= 70) return 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 border-amber-400 dark:border-amber-700 font-bold';
      return 'bg-rose-200 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100 border-rose-400 dark:border-rose-700 font-extrabold shadow-sm';
    } else if (heatmapMode === 'speed') {
      const avgTime = stats.totalHits > 0 ? stats.totalTimeMs / stats.totalHits : 0;
      if (avgTime < 150) return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 font-bold';
      if (avgTime < 250) return 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800 font-bold';
      if (avgTime < 350) return 'bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-100 border-amber-400 dark:border-amber-700 font-bold';
      return 'bg-rose-200 dark:bg-rose-950/90 text-rose-900 dark:text-rose-100 border-rose-400 dark:border-rose-700 font-extrabold';
    } else {
      // Frequency
      if (stats.totalHits > 30) return 'bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border-blue-400 dark:border-blue-700 font-bold';
      if (stats.totalHits > 10) return 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800 font-bold';
      return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  const selectedStats = selectedKey ? keyStatsMap[selectedKey.toLowerCase()] : null;

  return (
    <div id="keyboard-heatmap-section" className="w-full bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Interactive Keyboard Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time key accuracy, reaction speed & error distribution
          </p>
        </div>

        {/* Heatmap Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setHeatmapMode('mistakes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              heatmapMode === 'mistakes'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Mistakes
          </button>
          <button
            onClick={() => setHeatmapMode('speed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              heatmapMode === 'speed'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Key Speed
          </button>
          <button
            onClick={() => setHeatmapMode('frequency')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              heatmapMode === 'frequency'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Frequency
          </button>
        </div>
      </div>

      {/* On-Screen Keyboard Layout */}
      <div className="flex flex-col items-center gap-2 max-w-3xl mx-auto my-4 overflow-x-auto">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center justify-center gap-1.5 w-full">
            {row.map(key => {
              const isActive = activeKey?.toLowerCase() === key;
              const colorClass = getKeyColorClass(key);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`w-9 h-11 sm:w-12 sm:h-12 rounded-xl border flex flex-col items-center justify-center text-sm uppercase transition-all transform hover:scale-105 active:scale-95 shadow-sm ${colorClass} ${
                    isActive ? 'ring-4 ring-blue-500 scale-110 z-10 shadow-lg' : ''
                  }`}
                >
                  <span className="font-bold">{key}</span>
                  {keyStatsMap[key]?.mistakes ? (
                    <span className="text-[9px] text-rose-600 dark:text-rose-400 font-mono leading-none">
                      {keyStatsMap[key].mistakes}x
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}

        {/* Spacebar */}
        <div className="flex justify-center w-full mt-1">
          <button
            onClick={() => setSelectedKey('space')}
            className="w-48 sm:w-64 h-10 rounded-xl border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-semibold tracking-widest hover:bg-slate-200 uppercase"
          >
            Space
          </button>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Green = Good (&gt;95%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span>Yellow = Average (85-94%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Orange = Slow (70-84%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span>Red = Frequent Mistakes (&lt;70%)</span>
        </div>
      </div>

      {/* Key Inspector Modal / Popup details when key clicked */}
      {selectedKey && (
        <div className="mt-6 p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-xl uppercase flex items-center justify-center shadow-md">
              {selectedKey}
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Key Analysis: <span className="uppercase text-blue-600 dark:text-blue-400">{selectedKey}</span>
              </h4>
              {selectedStats ? (
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-1">
                  <span>Accuracy: <strong className="text-emerald-600 dark:text-emerald-400">{selectedStats.totalHits > 0 ? Math.round((selectedStats.correctHits / selectedStats.totalHits) * 100) : 100}%</strong></span>
                  <span>Hits: <strong>{selectedStats.totalHits}</strong></span>
                  <span>Mistakes: <strong className="text-rose-600 dark:text-rose-400">{selectedStats.mistakes}</strong></span>
                  <span>Reaction Time: <strong>{selectedStats.totalHits > 0 ? Math.round(selectedStats.totalTimeMs / selectedStats.totalHits) : 0}ms</strong></span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  No data recorded for key '{selectedKey}' yet. Complete a typing test to view details.
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setSelectedKey(null)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline px-2 py-1"
          >
            Close
          </button>
        </div>
      )}

    </div>
  );
};
