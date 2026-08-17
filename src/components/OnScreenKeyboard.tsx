import React, { useState } from 'react';
import { KeyStats } from '../types';
import { Info, Sparkles, Flame } from 'lucide-react';

interface OnScreenKeyboardProps {
  keyStatsMap: Record<string, KeyStats>;
  activeKey?: string;
  nextHintKey?: string;
  showHints?: boolean;
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

export const OnScreenKeyboard: React.FC<OnScreenKeyboardProps> = ({
  keyStatsMap,
  activeKey,
  nextHintKey,
  showHints = false
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
    <div id="keyboard-heatmap-section" className="w-full bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-all">
      
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Interactive Keyboard Heatmap
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key accuracy, speed distribution, and error monitoring
          </p>
        </div>

        {/* Heatmap Mode Selector */}
        <div className="flex items-center gap-0.5 bg-slate-100/70 dark:bg-slate-800/60 p-1 rounded-lg border border-slate-200/50 dark:border-slate-700/50 text-xs font-medium">
          <button
            onClick={() => setHeatmapMode('mistakes')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              heatmapMode === 'mistakes'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Mistakes
          </button>
          <button
            onClick={() => setHeatmapMode('speed')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              heatmapMode === 'speed'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Speed
          </button>
          <button
            onClick={() => setHeatmapMode('frequency')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              heatmapMode === 'frequency'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Frequency
          </button>
        </div>
      </div>

      {/* On-Screen Keyboard Layout */}
      <div className="flex flex-col items-center gap-1.5 max-w-3xl mx-auto my-3 overflow-x-auto pb-1">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center justify-center gap-1 sm:gap-1.5 w-full">
            {row.map(key => {
              const isActive = activeKey?.toLowerCase() === key;
              const isHintNext = showHints && nextHintKey && nextHintKey.toLowerCase() === key;
              const colorClass = getKeyColorClass(key);

              return (
                <button
                  key={key}
                  onClick={() => setSelectedKey(key)}
                  className={`w-8 h-10 sm:w-11 sm:h-11 rounded-lg border flex flex-col items-center justify-center text-xs sm:text-sm font-medium uppercase transition-colors cursor-pointer relative ${
                    isHintNext
                      ? 'bg-amber-400 dark:bg-amber-500 text-slate-950 font-bold border-amber-500 ring-2 ring-amber-400/80 z-20 shadow-xs'
                      : colorClass
                  } ${
                    isActive ? 'ring-2 ring-blue-500 z-10' : ''
                  }`}
                >
                  <span>{key}</span>
                  {isHintNext && nextHintKey && nextHintKey === nextHintKey.toUpperCase() && nextHintKey !== nextHintKey.toLowerCase() && (
                    <span className="text-[7px] font-bold text-slate-950 leading-none bg-amber-200/90 px-0.5 rounded mt-0.5">
                      ⇧ SHIFT
                    </span>
                  )}
                  {keyStatsMap[key]?.mistakes ? (
                    <span className="text-[8px] text-rose-600 dark:text-rose-400 font-mono leading-none">
                      {keyStatsMap[key].mistakes}x
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}

        {/* Spacebar */}
        <div className="flex justify-center w-full mt-0.5">
          {(() => {
            const isHintSpace = showHints && (nextHintKey === ' ' || nextHintKey?.toLowerCase() === 'space');
            return (
              <button
                onClick={() => setSelectedKey('space')}
                className={`w-48 sm:w-64 h-9 rounded-lg border text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer ${
                  isHintSpace
                    ? 'bg-amber-400 dark:bg-amber-500 text-slate-950 font-bold border-amber-500 ring-2 ring-amber-400/80 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Space
              </button>
            );
          })()}
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Good (&gt;95%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
          <span>Average (85-94%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Slow (70-84%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Frequent Mistakes (&lt;70%)</span>
        </div>
      </div>

      {/* Key Inspector Modal / Popup details when key clicked */}
      {selectedKey && (
        <div className="mt-4 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold text-base uppercase flex items-center justify-center">
              {selectedKey}
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-xs">
                Key Analysis: <span className="uppercase text-blue-600 dark:text-blue-400">{selectedKey}</span>
              </h4>
              {selectedStats ? (
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  <span>Accuracy: <strong className="text-emerald-600 dark:text-emerald-400">{selectedStats.totalHits > 0 ? Math.round((selectedStats.correctHits / selectedStats.totalHits) * 100) : 100}%</strong></span>
                  <span>Hits: <strong>{selectedStats.totalHits}</strong></span>
                  <span>Mistakes: <strong className="text-rose-600 dark:text-rose-400">{selectedStats.mistakes}</strong></span>
                  <span>Avg Reaction: <strong>{selectedStats.totalHits > 0 ? Math.round(selectedStats.totalTimeMs / selectedStats.totalHits) : 0}ms</strong></span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  No data recorded for '{selectedKey}' yet in this test.
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setSelectedKey(null)}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

    </div>
  );
};
