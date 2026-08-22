import React from 'react';
import { Gauge, Target, Clock, AlertTriangle, Delete, Activity } from 'lucide-react';
import { TestSettings } from '../types';

interface LiveStatsBarProps {
  actualSpeed?: number;
  errorSpeed?: number;
  errorFreeSpeed?: number;
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
  actualSpeed,
  errorSpeed,
  errorFreeSpeed,
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
  const displayActualSpeed = actualSpeed ?? grossWpm;
  const displayNetSpeed = errorFreeSpeed ?? errorSpeed ?? netWpm;
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage
  let progressPercent = 0;
  if (
    ((settings.testType === 'time') || (settings.testType === 'custom' && !settings.noTimeLimit)) &&
    settings.durationSeconds > 0
  ) {
    progressPercent = Math.min(100, (elapsedSeconds / settings.durationSeconds) * 100);
  } else if (settings.testType === 'words' && totalWords > 0) {
    progressPercent = Math.min(100, (completedWordsCount / totalWords) * 100);
  }

  return (
    <div id="live-stats-bar" className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-all overflow-hidden">
      <div className="flex flex-wrap items-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800/80">
        
        {/* Net Speed (Error-Free Speed) */}
        {settings.showLiveWpm && (
          <div className="flex-1 min-w-[110px] px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider" title="Error-Free Words Completed per Minute">
              Error-Free Speed
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums leading-tight mt-0.5">
              {displayNetSpeed} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
          </div>
        )}

        {/* Actual Speed (All Completed Words) */}
        {settings.showLiveWpm && (
          <div className="flex-1 min-w-[110px] px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider" title="Total Words Completed per Minute">
              Actual Speed
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums leading-tight mt-0.5">
              {displayActualSpeed} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
          </div>
        )}

        {/* Accuracy */}
        {settings.showLiveAccuracy && (
          <div className="flex-1 min-w-[110px] px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Accuracy
            </span>
            <div className={`text-2xl sm:text-3xl font-semibold tabular-nums leading-tight mt-0.5 ${
              accuracy >= 95
                ? 'text-emerald-600 dark:text-emerald-400'
                : accuracy >= 85
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}>
              {accuracy}%
            </div>
          </div>
        )}

        {/* Time / Progress */}
        {settings.showTimer && (
          <div className="flex-1 min-w-[110px] px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {remainingSeconds !== null ? 'Time Remaining' : 'Elapsed Time'}
            </span>
            <div className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-200 tabular-nums leading-tight mt-0.5">
              {remainingSeconds !== null ? formatTime(remainingSeconds) : formatTime(elapsedSeconds)}
            </div>
          </div>
        )}

        {/* Words Typed */}
        <div className="flex-1 min-w-[110px] px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Words Typed
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-slate-200 tabular-nums leading-tight mt-0.5">
            {completedWordsCount}
          </div>
        </div>

        {/* Mistakes Count */}
        {settings.showMistakes && (
          <div className="flex-1 min-w-[110px] px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Mistakes
            </span>
            <div className="text-2xl sm:text-3xl font-semibold text-rose-600 dark:text-rose-400 tabular-nums leading-tight mt-0.5">
              {mistakesCount}
            </div>
          </div>
        )}

        {/* Backspaces */}
        <div className="flex-1 min-w-[110px] px-3 py-3 sm:py-3.5 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Backspaces
          </span>
          <div className="text-2xl sm:text-3xl font-semibold text-slate-600 dark:text-slate-300 tabular-nums leading-tight mt-0.5">
            {backspacesCount}
          </div>
        </div>

      </div>

      {/* Progress Bar Line */}
      {((settings.testType === 'time' || (settings.testType === 'custom' && !settings.noTimeLimit)) || settings.testType === 'words') && (
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 overflow-hidden">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-1 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};
