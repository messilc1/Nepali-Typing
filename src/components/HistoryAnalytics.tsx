import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Trophy,
  Clock,
  Target,
  Download,
  Trash2,
  Activity,
  Flame,
  Zap,
  Search,
  AlertTriangle,
  Scale,
  Sparkles,
  Layers,
  FileText,
  TrendingUp,
  CheckCircle2,
  Keyboard,
  Award,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserStats, KeyStats, TestResult, SessionStatus } from '../types';
import { OnScreenKeyboard } from './OnScreenKeyboard';
import { ErrorAnalysisView } from './ErrorAnalysisView';

interface HistoryAnalyticsProps {
  userStats: UserStats;
  keyStatsMap?: Record<string, KeyStats>;
  onClearHistory: () => void;
  onStartTargetedPractice?: (items: string[]) => void;
}

export const HistoryAnalytics: React.FC<HistoryAnalyticsProps> = ({
  userStats,
  keyStatsMap = {},
  onClearHistory,
  onStartTargetedPractice = () => {}
}) => {
  // Navigation Sub-tab State
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'performance' | 'heatmap' | 'errors' | 'history' | 'achievements' | 'all'>('all');

  // View Filters State
  const [trendTimeframe, setTrendTimeframe] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [filterTestType, setFilterTestType] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterDuration, setFilterDuration] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const history = userStats.history || [];

  // ==========================================
  // 1. OVERALL PERFORMANCE METRICS CALCULATIONS
  // ==========================================
  const totalTests = history.length;
  const totalTimeSeconds = history.reduce((acc, h) => acc + (h.elapsedSeconds || 0), 0);
  const totalWordsTyped = history.reduce((acc, h) => acc + (h.totalWordsTyped || 0), 0);
  const totalCharsTyped = history.reduce((acc, h) => acc + (h.totalCharactersTyped || 0), 0);
  const totalKeystrokes = totalCharsTyped;
  const totalMistakes = history.reduce((acc, h) => acc + (h.mistakesCount || 0), 0);
  const totalBackspaces = history.reduce((acc, h) => acc + (h.backspacesCount || 0), 0);

  const highestWpm = totalTests > 0 ? Math.max(...history.map(h => h.netWpm)) : 0;
  const lowestWpm = totalTests > 0 ? Math.min(...history.map(h => h.netWpm)) : 0;
  const averageWpm = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + h.netWpm, 0) / totalTests) : 0;
  const overallGrossWpm = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + h.grossWpm, 0) / totalTests) : 0;
  
  const averageAccuracy = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + h.accuracy, 0) / totalTests) : 0;
  const bestAccuracy = totalTests > 0 ? Math.max(...history.map(h => h.accuracy)) : 0;
  const averageConsistency = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + (h.consistencyPercent || 85), 0) / totalTests) : 0;

  // Format Total Practice Time (Hours, Minutes, Seconds)
  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins < 60) return `${mins}m ${secs}s`;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hours}h ${remMins}m`;
  };

  // ==========================================
  // 2. PERSONAL BEST HISTORY HIGHLIGHTS
  // ==========================================
  const personalBests = useMemo(() => {
    let currentMax = -1;
    const records: (TestResult & { milestoneWpm: number })[] = [];

    // Sort chronologically
    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);
    sorted.forEach(item => {
      if (item.netWpm > currentMax) {
        currentMax = item.netWpm;
        records.push({ ...item, milestoneWpm: currentMax });
      }
    });

    return records.reverse(); // Most recent personal bests first
  }, [history]);

  // ==========================================
  // 3. ERROR ANALYSIS & MISTYPED TERMS
  // ==========================================
  const { sortedMistypedWords, sortedMistypedChars, legalErrorTerms } = useMemo(() => {
    const wordCounts: Record<string, number> = {};
    const charCounts: Record<string, number> = {};

    history.forEach(test => {
      Object.entries(test.mistypedWordsMap || {}).forEach(([word, count]) => {
        const cnt = Number(count) || 0;
        wordCounts[word] = (wordCounts[word] || 0) + cnt;
        word.split('').forEach(ch => {
          charCounts[ch] = (charCounts[ch] || 0) + cnt;
        });
      });
    });

    const topWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topChars = Object.entries(charCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    // Filter legal vocabulary terms
    const knownLegalWords = ['संविधान', 'अदालत', 'पुनरावलोकन', 'महान्यायाधिवक्ता', 'उत्प्रेषण', 'परमादेश', 'अधिकारपृच्छा', 'बन्दीप्रत्यक्षीकरण', 'सर्वोच्च', 'न्यायपालिका', 'विधायिका', 'हकदया', 'नजिर', 'कानून', 'प्रतिनिधिसभा', 'राष्ट्रियसभा'];
    const legalErrors = Object.entries(wordCounts)
      .filter(([w]) => knownLegalWords.some(lw => w.includes(lw) || lw.includes(w)))
      .sort((a, b) => b[1] - a[1]);

    return {
      sortedMistypedWords: topWords,
      sortedMistypedChars: topChars,
      legalErrorTerms: legalErrors
    };
  }, [history]);

  // ==========================================
  // 4. CHART & TREND DATA GROUPING
  // ==========================================
  const trendChartData = useMemo(() => {
    if (history.length === 0) return [];

    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);

    if (trendTimeframe === 'all') {
      return sorted.map((item, idx) => ({
        label: `#${idx + 1} (${new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`,
        netWpm: item.netWpm,
        grossWpm: item.grossWpm,
        accuracy: item.accuracy,
        consistency: item.consistencyPercent || 85,
        mistakes: item.mistakesCount
      }));
    }

    // Grouping by Date/Week/Month
    const groups: Record<string, { totalWpm: number; totalAcc: number; count: number; date: string }> = {};

    sorted.forEach(item => {
      const d = new Date(item.timestamp);
      let key = d.toLocaleDateString();
      if (trendTimeframe === 'monthly') {
        key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      } else if (trendTimeframe === 'weekly') {
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        key = `Week ${weekNum}, ${d.getFullYear()}`;
      }

      if (!groups[key]) {
        groups[key] = {
          totalWpm: 0,
          totalAcc: 0,
          count: 0,
          date: trendTimeframe === 'daily'
            ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            : key
        };
      }

      groups[key].totalWpm += item.netWpm;
      groups[key].totalAcc += item.accuracy;
      groups[key].count += 1;
    });

    return Object.values(groups).map(g => ({
      label: g.date,
      netWpm: Math.round(g.totalWpm / g.count),
      accuracy: Math.round(g.totalAcc / g.count),
      testCount: g.count
    }));
  }, [history, trendTimeframe]);

  // ==========================================
  // 5. FILTERED HISTORY TABLE DATA
  // ==========================================
  const filteredHistory = useMemo(() => {
    const now = Date.now();
    return history.slice().reverse().filter(item => {
      // Test Type Filter
      if (filterTestType !== 'all' && item.testType !== filterTestType) {
        return false;
      }

      // Language Filter
      if (filterLanguage !== 'all' && item.language !== filterLanguage) {
        return false;
      }

      // Date Range Filter
      if (filterDateRange === 'today') {
        const itemDate = new Date(item.timestamp).toDateString();
        const todayDate = new Date().toDateString();
        if (itemDate !== todayDate) return false;
      } else if (filterDateRange === '7days') {
        if (now - item.timestamp > 7 * 24 * 60 * 60 * 1000) return false;
      } else if (filterDateRange === '30days') {
        if (now - item.timestamp > 30 * 24 * 60 * 60 * 1000) return false;
      }

      // Duration Filter
      if (filterDuration === 'short' && item.elapsedSeconds > 30) return false;
      if (filterDuration === 'medium' && (item.elapsedSeconds <= 30 || item.elapsedSeconds > 60)) return false;
      if (filterDuration === 'long' && item.elapsedSeconds <= 60) return false;

      // Session Status Filter
      if (filterStatus !== 'all') {
        const itemStatus = item.sessionStatus || 'Completed';
        if (itemStatus !== filterStatus) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (item.categoryOrTitle || '').toLowerCase();
        const sample = (item.sampleText || '').toLowerCase();
        const lang = item.language.toLowerCase();
        const type = item.testType.toLowerCase();
        if (!title.includes(q) && !sample.includes(q) && !lang.includes(q) && !type.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [history, filterTestType, filterLanguage, filterDateRange, filterDuration, filterStatus, searchQuery]);

  // ==========================================
  // CSV EXPORT FUNCTION
  // ==========================================
  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'ID',
      'Date & Time',
      'Language',
      'Test Type',
      'Passage/Category',
      'Net WPM',
      'Gross WPM',
      'Accuracy %',
      'Consistency %',
      'Total Characters',
      'Correct Characters',
      'Total Words',
      'Mistakes',
      'Backspaces',
      'Time (s)'
    ];

    const rows = history.map(h => [
      h.id,
      `"${new Date(h.timestamp).toLocaleString()}"`,
      h.language,
      h.testType,
      `"${h.categoryOrTitle || 'General'}"`,
      h.netWpm,
      h.grossWpm,
      h.accuracy,
      h.consistencyPercent || 85,
      h.totalCharactersTyped,
      h.correctCharacters,
      h.totalWordsTyped,
      h.mistakesCount,
      h.backspacesCount,
      h.elapsedSeconds
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Nepali_Typing_Pro_Analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="comprehensive-analytics-dashboard" className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Dashboard Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-400/20 text-blue-300 font-extrabold text-xs rounded-full border border-blue-400/30 w-max mb-3">
              <Activity className="w-4 h-4 text-blue-300" />
              <span>Real-Time Performance Dashboard</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Typing Analytics & Insights
            </h2>
            <p className="text-blue-200 text-xs sm:text-sm mt-2 max-w-2xl font-medium leading-relaxed">
              Every completed typing test is automatically recorded and analyzed across speed, accuracy, consistency, error patterns, and historical trends.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={exportCSV}
              disabled={history.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-950 hover:bg-blue-50 disabled:opacity-50 font-extrabold text-xs shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Export CSV Report</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your entire typing test history? This action cannot be undone.')) {
                  onClearHistory();
                }
              }}
              disabled={history.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 disabled:opacity-50 border border-rose-400/30 font-extrabold text-xs transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-300" />
              <span>Clear History</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Sub-navigation Tabs */}
      <div className="flex items-center justify-start gap-1 p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl border border-slate-300/60 dark:border-slate-700/60 overflow-x-auto no-scrollbar text-xs font-extrabold sticky top-16 z-20 backdrop-blur-md shadow-sm">
        <button
          onClick={() => setActiveSubTab('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'all'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-blue-500" />
          <span>Complete Dashboard</span>
        </button>

        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveSubTab('performance')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'performance'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Progress & Trends</span>
        </button>

        <button
          onClick={() => setActiveSubTab('heatmap')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'heatmap'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Keyboard className="w-4 h-4 text-purple-500" />
          <span>Keyboard Heatmap</span>
        </button>

        <button
          onClick={() => setActiveSubTab('errors')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'errors'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span>Error Analysis</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'history'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-slate-500" />
          <span>Test History</span>
        </button>

        <button
          onClick={() => setActiveSubTab('achievements')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'achievements'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Achievements</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* 1. OVERALL PERFORMANCE METRICS GRID        */}
      {/* ========================================== */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span>Overall Performance Summary</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Highest WPM */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Highest Speed</span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight leading-none">
                {highestWpm}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Net WPM Peak</div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Lowest: <strong>{lowestWpm} WPM</strong></div>
          </div>

          {/* Average WPM */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Average Speed</span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                {averageWpm}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Net WPM Avg</div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Gross Avg: <strong>{overallGrossWpm} WPM</strong></div>
          </div>

          {/* Average Accuracy */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
              <Target className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight leading-none">
                {averageAccuracy}%
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Overall Accuracy</div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Best: <strong className="text-emerald-600">{bestAccuracy}%</strong></div>
          </div>

          {/* Average Consistency */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consistency</span>
              <Activity className="w-4 h-4 text-purple-500" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400 tracking-tight leading-none">
                {averageConsistency}%
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Rhythm Stability</div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Streak: <strong>{userStats.currentStreakDays} days</strong></div>
          </div>

          {/* Total Tests Completed */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
              <Layers className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                {totalTests}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Total Scored Tests</div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Practice Time: <strong>{formatTimeSpent(totalTimeSeconds)}</strong></div>
          </div>

          {/* Total Volume */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Keystrokes</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="my-2">
              <div className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                {totalKeystrokes.toLocaleString()}
              </div>
              <div className="text-[11px] font-semibold text-slate-500 mt-1">Characters Typed</div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Words: <strong>{totalWordsTyped.toLocaleString()}</strong></div>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* 2. PERFORMANCE TRENDS & CHARTS             */}
      {/* ========================================== */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Performance Progress Trends</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track your speed (WPM) and accuracy improvements over time
            </p>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
            {(['all', 'daily', 'weekly', 'monthly'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTrendTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  trendTimeframe === tf
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tf === 'all' ? 'Every Test' : tf === 'daily' ? 'Daily' : tf === 'weekly' ? 'Weekly' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>

        {trendChartData.length > 0 ? (
          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#2563eb" fontSize={11} domain={[0, 'dataMax + 10']} />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Line yAxisId="left" type="monotone" dataKey="netWpm" name="Net WPM" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-sm font-medium">
            No history recorded yet. Complete your first typing test to render progress trends!
          </div>
        )}
      </div>

      {/* Personal Bests Milestones */}
      {personalBests.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <span>Personal Best Milestones History ({personalBests.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {personalBests.slice(0, 4).map((pb, idx) => (
              <div
                key={pb.id}
                className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
                    {idx === 0 ? '🏆 Current PB' : `Record #${personalBests.length - idx}`}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(pb.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="my-2">
                  <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
                    {pb.milestoneWpm} <span className="text-xs font-semibold">WPM</span>
                  </div>
                  <div className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                    {pb.accuracy}% Accuracy • {pb.language.toUpperCase()}
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {pb.categoryOrTitle || pb.testType}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. ERROR ANALYSIS & KEYBOARD INSIGHTS      */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Mistyped Characters */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" />
            <span>Most Mistyped Characters</span>
          </h3>

          {sortedMistypedChars.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {sortedMistypedChars.slice(0, 8).map(([char, count], i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{char}</span>
                  <span className="text-[10px] font-extrabold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded">
                    {count} err
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 p-4 text-center">
              No character error data recorded yet.
            </div>
          )}
        </div>

        {/* Top Mistyped Words */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Most Mistyped Words</span>
          </h3>

          {sortedMistypedWords.length > 0 ? (
            <div className="space-y-2">
              {sortedMistypedWords.slice(0, 5).map(([word, count], i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[12rem]">{word}</span>
                  <span className="font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                    {count} errors
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 p-4 text-center">
              No word error patterns recorded yet.
            </div>
          )}
        </div>

        {/* Legal & Backspace Insights */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-500" />
            <span>Legal Vocabulary & Habits</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300 font-semibold">Total Backspaces Used:</span>
              <span className="font-black text-indigo-700 dark:text-indigo-300 text-sm">{totalBackspaces.toLocaleString()}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300 font-semibold">Avg Backspaces / Test:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{totalTests > 0 ? Math.round(totalBackspaces / totalTests) : 0}</span>
            </div>

            {legalErrorTerms.length > 0 ? (
              <div className="pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Legal Terms Requiring Practice:
                </span>
                <div className="flex flex-wrap gap-1">
                  {legalErrorTerms.slice(0, 4).map(([term, cnt], i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 text-[11px] font-bold">
                      {term} ({cnt})
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero recurring legal terminology errors!</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 4. KEYBOARD HEATMAP SECTION               */}
      {/* ========================================== */}
      {(activeSubTab === 'all' || activeSubTab === 'heatmap') && (
        <div className="space-y-4 pt-2">
          <OnScreenKeyboard keyStatsMap={keyStatsMap} />
        </div>
      )}

      {/* ========================================== */}
      {/* 5. ERROR ANALYSIS SECTION                  */}
      {/* ========================================== */}
      {(activeSubTab === 'all' || activeSubTab === 'errors') && (
        <div className="space-y-4 pt-2">
          <ErrorAnalysisView
            history={history}
            onStartTargetedPractice={onStartTargetedPractice}
          />
        </div>
      )}

      {/* ========================================== */}
      {/* 6. COMPREHENSIVE TEST HISTORY LOG TABLE    */}
      {/* ========================================== */}
      {(activeSubTab === 'all' || activeSubTab === 'history') && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden space-y-4 p-6 sm:p-8">
          
          {/* Table Title & Filter Controls Header */}
          <div className="flex flex-col space-y-4 border-b border-slate-100 dark:border-slate-700 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Detailed Test History Log ({filteredHistory.length})</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically recorded performance history
                </p>
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search history by passage or mode..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Options Group */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs font-semibold">
              
              {/* Test Type Filter */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Test Type:</label>
                <select
                  value={filterTestType}
                  onChange={(e) => setFilterTestType(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Test Types</option>
                  <option value="time">Timed Speed Test</option>
                  <option value="words">Word Count Test</option>
                  <option value="legal">Legal Pack / Lok Sewa</option>
                  <option value="custom">Custom Paragraph</option>
                  <option value="quote">Quote Test</option>
                </select>
              </div>

              {/* Session Status Filter */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Status:</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="Completed">Completed</option>
                  <option value="Timed Out">Timed Out</option>
                  <option value="Abandoned">Abandoned</option>
                  <option value="Interrupted">Interrupted</option>
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Language:</label>
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Languages</option>
                  <option value="nepali">🇳🇵 Nepali Unicode</option>
                  <option value="english">🇬🇧 English</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Date Range:</label>
                <select
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today Only</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">Duration:</label>
                <select
                  value={filterDuration}
                  onChange={(e) => setFilterDuration(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Durations</option>
                  <option value="short">Short (&le; 30s)</option>
                  <option value="medium">Medium (30s - 60s)</option>
                  <option value="long">Long (&gt; 60s)</option>
                </select>
              </div>

            </div>
          </div>

          {/* History Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Type / Passage</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Lang</th>
                  <th className="px-4 py-3">Net WPM</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">Accuracy</th>
                  <th className="px-4 py-3">Rhythm</th>
                  <th className="px-4 py-3">Errors</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredHistory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[14rem]">
                        {item.categoryOrTitle || item.testType}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[14rem]">
                        {item.sampleText}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {item.sessionStatus === 'Completed' || !item.sessionStatus ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">Completed</span>
                      ) : item.sessionStatus === 'Timed Out' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800">Timed Out</span>
                      ) : item.sessionStatus === 'Abandoned' ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800">Abandoned</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-200 dark:border-purple-800">Interrupted</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 uppercase font-bold text-blue-600 dark:text-blue-400">
                      {item.language === 'nepali' ? '🇳🇵' : '🇬🇧'}
                    </td>
                    <td className="px-4 py-3.5 font-black text-sm text-blue-600 dark:text-blue-300">
                      {item.netWpm}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-medium">
                      {item.grossWpm}
                    </td>
                    <td className={`px-4 py-3.5 font-bold ${item.accuracy >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {item.accuracy}%
                    </td>
                    <td className="px-4 py-3.5 text-purple-600 font-semibold">
                      {item.consistencyPercent || 85}%
                    </td>
                    <td className="px-4 py-3.5 text-rose-600 font-bold">
                      {item.mistakesCount}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 font-medium whitespace-nowrap">
                      {item.elapsedSeconds}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredHistory.length === 0 && (
              <div className="p-10 text-center text-slate-400 text-sm font-medium">
                No typing history records match your selected filters.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* 7. ACHIEVEMENTS & MILESTONES               */}
      {/* ========================================== */}
      {(activeSubTab === 'all' || activeSubTab === 'achievements') && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-slate-100">
                Typing Achievements & Mastery Badges
              </h3>
            </div>
            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-800 px-3 py-1 rounded-full">
              {userStats.currentStreakDays} Day Streak
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            
            {/* Badge 1 */}
            <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${highestWpm >= 30 ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                🚀
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Speed Demon I (30 WPM)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Achieve 30+ Net WPM speed</p>
                {highestWpm >= 30 ? (
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3.5 h-3.5" /> Unlocked</span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Locked ({highestWpm}/30 WPM)</span>
                )}
              </div>
            </div>

            {/* Badge 2 */}
            <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${highestWpm >= 50 ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                ⚡
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Lok Sewa Master (50 WPM)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Achieve 50+ Net WPM speed</p>
                {highestWpm >= 50 ? (
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3.5 h-3.5" /> Unlocked</span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Locked ({highestWpm}/50 WPM)</span>
                )}
              </div>
            </div>

            {/* Badge 3 */}
            <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${averageWpm >= 40 && totalTests >= 5 ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-60'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                🎓
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Certified Typist Candidate</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Complete 5+ tests with 40+ Avg WPM</p>
                {averageWpm >= 40 && totalTests >= 5 ? (
                  <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1"><CheckCircle2 className="w-3.5 h-3.5" /> Ready for Certification!</span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-400 mt-1 block">In Progress ({totalTests}/5 tests)</span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
