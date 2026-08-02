import React from 'react';
import { Gauge, Target, Clock, AlertTriangle, Delete, Activity } from 'lucide-react';
import { TestSettings } from '../types';

interface LiveStatsBarProps {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  elapsedSeconds: number;
  remainingSeconds: number | null;
  totalWords: number;
  completedWordsCount: number;
  mistakesCount: number;
  backspacesCount: number;
  settings: TestSettings;
}

export const LiveStatsBar: React.FC<LiveStatsBarProps> = ({
  grossWpm,
  netWpm,
  accuracy,
  elapsedSeconds,
  remainingSeconds,
  totalWords,
  completedWordsCount,
  mistakesCount,
  backspacesCount,
  settings
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage
  let progressPercent = 0;
  if (settings.testType === 'time' && settings.durationSeconds > 0) {
    progressPercent = Math.min(100, (elapsedSeconds / settings.durationSeconds) * 100);
  } else if (settings.testType === 'words' && totalWords > 0) {
    progressPercent = Math.min(100, (completedWordsCount / totalWords) * 100);
  }

  return (
    <div id="live-stats-bar" className="w-full bg-white dark:bg-slate-800/80 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-700/80 mb-6 transition-all">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
        
        {/* Net WPM */}
        {settings.showLiveWpm && (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight leading-none">
                {netWpm}
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Net WPM
              </div>
            </div>
          </div>
        )}

        {/* Gross WPM */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-none">
              {grossWpm}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Gross WPM
            </div>
          </div>
        </div>

        {/* Accuracy */}
        {settings.showLiveAccuracy && (
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              accuracy >= 95
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : accuracy >= 85
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
            }`}>
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-2xl font-bold tracking-tight leading-none ${
                accuracy >= 95
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : accuracy >= 85
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {accuracy}%
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Accuracy
              </div>
            </div>
          </div>
        )}

        {/* Time / Progress */}
        {settings.showTimer && (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-none">
                {remainingSeconds !== null ? formatTime(remainingSeconds) : formatTime(elapsedSeconds)}
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                {remainingSeconds !== null ? 'Remaining' : 'Elapsed'}
              </div>
            </div>
          </div>
        )}

        {/* Mistakes Count */}
        {settings.showMistakes && (
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 tracking-tight leading-none">
                {mistakesCount}
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Mistakes
              </div>
            </div>
          </div>
        )}

        {/* Backspaces */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300">
            <Delete className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 tracking-tight leading-none">
              {backspacesCount}
            </div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
              Backspaces
            </div>
          </div>
        </div>

      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-full h-2 mt-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  );
};
