import React from 'react';
import { BarChart3, Trophy, Clock, Target, Calendar, Download, Trash2, Activity, Flame } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserStats, TestResult } from '../types';

interface HistoryAnalyticsProps {
  userStats: UserStats;
  onClearHistory: () => void;
}

export const HistoryAnalytics: React.FC<HistoryAnalyticsProps> = ({
  userStats,
  onClearHistory
}) => {
  const historyData = userStats.history.map((item, idx) => ({
    index: idx + 1,
    date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    wpm: item.netWpm,
    accuracy: item.accuracy
  }));

  // CSV Export
  const exportCSV = () => {
    if (userStats.history.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Language', 'Net WPM', 'Gross WPM', 'Accuracy', 'Time (s)', 'Mistakes'];
    const rows = userStats.history.map(h => [
      h.id,
      new Date(h.timestamp).toISOString(),
      h.language,
      h.netWpm,
      h.grossWpm,
      h.accuracy,
      h.elapsedSeconds,
      h.mistakesCount
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nepali_Typing_Pro_History_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="history-analytics-view" className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 leading-none">
                {userStats.highestWpm}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Highest WPM
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 leading-none">
                {userStats.averageWpm}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Average WPM
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">
                {userStats.averageAccuracy}%
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Avg Accuracy
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 leading-none">
                {userStats.currentStreakDays}d
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                Practice Streak
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Speed & Accuracy Progress Trend
        </h3>

        {historyData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="wpm" name="WPM" stroke="#2563eb" strokeWidth={3} />
                <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No history recorded yet. Complete typing tests to see your progress graph over time!
          </div>
        )}
      </div>

      {/* History Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
              Past Test Log ({userStats.history.length})
            </h3>
            <p className="text-xs text-slate-500">Stored locally in browser storage</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Language</th>
                <th className="px-6 py-3">Net WPM</th>
                <th className="px-6 py-3">Gross WPM</th>
                <th className="px-6 py-3">Accuracy</th>
                <th className="px-6 py-3">Mistakes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {userStats.history.slice().reverse().map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 uppercase font-bold text-blue-600 dark:text-blue-400">
                    {item.language}
                  </td>
                  <td className="px-6 py-3.5 font-black text-slate-900 dark:text-slate-100">
                    {item.netWpm}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">
                    {item.grossWpm}
                  </td>
                  <td className={`px-6 py-3.5 font-bold ${item.accuracy >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {item.accuracy}%
                  </td>
                  <td className="px-6 py-3.5 text-rose-600 font-bold">
                    {item.mistakesCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
