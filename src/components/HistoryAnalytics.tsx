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
  ChevronRight,
  RefreshCw,
  SlidersHorizontal,
  X,
  Play
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { UserStats, KeyStats, TestResult, SessionStatus, DetailedWordError, DetailedCharError } from '../types';
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
  onStartTargetedPractice = (_items?: string[]) => {}
}) => {
  // Primary Analytics Section Switcher ('current' vs 'lifetime')
  const [primarySection, setPrimarySection] = useState<'current' | 'lifetime'>('current');

  // Selected session ID for "Current Test Analysis"
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Sub-tabs for Lifetime Analytics
  const [lifetimeSubTab, setLifetimeSubTab] = useState<'overview' | 'trends' | 'heatmap' | 'errors' | 'history'>('overview');

  // Filters state for test history
  const [trendTimeframe, setTrendTimeframe] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
  const [filterTestType, setFilterTestType] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterDuration, setFilterDuration] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const history = userStats.history || [];

  // Determine current/selected session
  const currentSession = useMemo(() => {
    if (history.length === 0) return null;
    if (selectedSessionId) {
      const found = history.find(h => h.id === selectedSessionId);
      if (found) return found;
    }
    // Default to the latest completed session
    return history[history.length - 1];
  }, [history, selectedSessionId]);

  // ==========================================
  // CUMULATIVE KEYBOARD HEATMAP AGGREGATION
  // ==========================================
  const cumulativeKeyStatsMap = useMemo(() => {
    const merged: Record<string, KeyStats> = { ...keyStatsMap };
    history.forEach(test => {
      Object.entries(test.keyStatsMap || {}).forEach(([k, stats]) => {
        const keyLower = k.toLowerCase();
        const keyStat = stats as KeyStats;
        const existing: KeyStats = merged[keyLower] || {
          key: keyLower,
          label: keyLower.toUpperCase(),
          totalHits: 0,
          correctHits: 0,
          mistakes: 0,
          totalTimeMs: 0
        };
        merged[keyLower] = {
          key: keyLower,
          label: keyLower.toUpperCase(),
          totalHits: existing.totalHits + (keyStat.totalHits || 0),
          correctHits: existing.correctHits + (keyStat.correctHits || 0),
          mistakes: existing.mistakes + (keyStat.mistakes || 0),
          totalTimeMs: existing.totalTimeMs + (keyStat.totalTimeMs || 0)
        };
      });
    });
    return merged;
  }, [history, keyStatsMap]);

  // ==========================================
  // LIFETIME METRICS CALCULATIONS
  // ==========================================
  const totalTests = history.length;
  const completedTestsCount = history.filter(h => (h.sessionStatus || 'Completed') === 'Completed').length;
  const timedOutTestsCount = history.filter(h => h.sessionStatus === 'Timed Out').length;
  const abandonedTestsCount = history.filter(h => h.sessionStatus === 'Abandoned').length;

  const totalTimeSeconds = history.reduce((acc, h) => acc + (h.elapsedSeconds || 0), 0);
  const totalWordsTyped = history.reduce((acc, h) => acc + (h.totalWordsTyped || 0), 0);
  const totalCharsTyped = history.reduce((acc, h) => acc + (h.totalCharactersTyped || 0), 0);
  const totalMistakes = history.reduce((acc, h) => acc + (h.mistakesCount || 0), 0);
  const totalBackspaces = history.reduce((acc, h) => acc + (h.backspacesCount || 0), 0);

  const highestWpm = totalTests > 0 ? Math.max(...history.map(h => h.netWpm)) : 0;
  const lowestWpm = totalTests > 0 ? Math.min(...history.map(h => h.netWpm)) : 0;
  const averageNetWpm = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + h.netWpm, 0) / totalTests) : 0;
  const averageGrossWpm = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + h.grossWpm, 0) / totalTests) : 0;
  
  const averageAccuracy = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + h.accuracy, 0) / totalTests) : 0;
  const bestAccuracy = totalTests > 0 ? Math.max(...history.map(h => h.accuracy)) : 0;
  const averageConsistency = totalTests > 0 ? Math.round(history.reduce((acc, h) => acc + (h.consistencyPercent || 85), 0) / totalTests) : 0;

  // Format Total Practice Time
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
  // LIFETIME MISTYPED WORDS & CHARS
  // ==========================================
  const { lifetimeMistypedWords, lifetimeMistypedChars } = useMemo(() => {
    const wordCounts: Record<string, number> = {};
    const charCounts: Record<string, number> = {};

    history.forEach(test => {
      Object.entries(test.mistypedWordsMap || {}).forEach(([word, count]) => {
        const cnt = Number(count) || 0;
        wordCounts[word] = (wordCounts[word] || 0) + cnt;
      });
      Object.entries(test.mistypedCharsMap || {}).forEach(([ch, count]) => {
        const cnt = Number(count) || 0;
        charCounts[ch] = (charCounts[ch] || 0) + cnt;
      });
    });

    const topWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    const topChars = Object.entries(charCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    return {
      lifetimeMistypedWords: topWords,
      lifetimeMistypedChars: topChars
    };
  }, [history]);

  // ==========================================
  // PERSONAL BEST HISTORY HIGHLIGHTS
  // ==========================================
  const personalBests = useMemo(() => {
    let currentMax = -1;
    const records: (TestResult & { milestoneWpm: number })[] = [];

    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);
    sorted.forEach(item => {
      if (item.netWpm > currentMax) {
        currentMax = item.netWpm;
        records.push({ ...item, milestoneWpm: currentMax });
      }
    });

    return records.reverse();
  }, [history]);

  // ==========================================
  // TREND CHART DATA
  // ==========================================
  const trendChartData = useMemo(() => {
    if (history.length === 0) return [];
    const sorted = [...history].sort((a, b) => a.timestamp - b.timestamp);

    if (trendTimeframe === 'all') {
      return sorted.map((item, idx) => ({
        label: `#${idx + 1}`,
        dateStr: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        netWpm: item.netWpm,
        grossWpm: item.grossWpm,
        accuracy: item.accuracy,
        consistency: item.consistencyPercent || 85,
        mistakes: item.mistakesCount
      }));
    }

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
        key = `W${weekNum}, ${d.getFullYear()}`;
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
      dateStr: g.date,
      netWpm: Math.round(g.totalWpm / g.count),
      accuracy: Math.round(g.totalAcc / g.count),
      testCount: g.count
    }));
  }, [history, trendTimeframe]);

  // ==========================================
  // FILTERED HISTORY TABLE DATA
  // ==========================================
  const filteredHistory = useMemo(() => {
    const now = Date.now();
    return history.slice().reverse().filter(item => {
      if (filterTestType !== 'all' && item.testType !== filterTestType) return false;
      if (filterLanguage !== 'all' && item.language !== filterLanguage) return false;

      if (filterDateRange === 'today') {
        if (new Date(item.timestamp).toDateString() !== new Date().toDateString()) return false;
      } else if (filterDateRange === '7days') {
        if (now - item.timestamp > 7 * 24 * 60 * 60 * 1000) return false;
      } else if (filterDateRange === '30days') {
        if (now - item.timestamp > 30 * 24 * 60 * 60 * 1000) return false;
      }

      if (filterDuration === 'short' && item.elapsedSeconds > 30) return false;
      if (filterDuration === 'medium' && (item.elapsedSeconds <= 30 || item.elapsedSeconds > 60)) return false;
      if (filterDuration === 'long' && item.elapsedSeconds <= 60) return false;

      if (filterStatus !== 'all') {
        const itemStatus = item.sessionStatus || 'Completed';
        if (itemStatus !== filterStatus) return false;
      }

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

  // CSV Export Function
  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = [
      'ID',
      'Date & Time',
      'Language',
      'Test Type',
      'Status',
      'Title/Category',
      'Net WPM',
      'Gross WPM',
      'Accuracy %',
      'Consistency %',
      'Total Characters',
      'Correct Characters',
      'Total Words',
      'Mistakes',
      'Backspaces',
      'Duration (s)'
    ];

    const rows = history.map(h => [
      h.id,
      `"${new Date(h.timestamp).toLocaleString()}"`,
      h.language,
      h.testType,
      h.sessionStatus || 'Completed',
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
      
      {/* Dashboard Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-400/20 text-blue-300 font-extrabold text-xs rounded-full border border-blue-400/30 w-max mb-3">
              <Activity className="w-4 h-4 text-blue-300" />
              <span>Real-Time Performance Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Typing Analytics & Performance Report
            </h2>
            <p className="text-blue-200 text-xs sm:text-sm mt-2 max-w-2xl font-medium leading-relaxed">
              Analyze typing performance, inspect word and character mistake distributions, and track long-term progress over time.
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
          </div>
        </div>

        {/* PRIMARY SECTION TOGGLE: Current Test Analysis VS Lifetime Analytics */}
        <div className="mt-8 pt-6 border-t border-blue-800/60 flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <button
            onClick={() => setPrimarySection('current')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-sm ${
              primarySection === 'current'
                ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300/50 scale-105'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Current Test Analysis</span>
            {history.length > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-950 text-blue-200 font-mono">
                Latest
              </span>
            )}
          </button>

          <button
            onClick={() => setPrimarySection('lifetime')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer shadow-sm ${
              primarySection === 'lifetime'
                ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300/50 scale-105'
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Lifetime Analytics</span>
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-950 text-blue-200 font-mono">
              {totalTests} Tests
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: CURRENT TEST ANALYSIS                                         */}
      {/* ========================================================================= */}
      {primarySection === 'current' && (
        <div className="space-y-8 animate-fadeIn">
          {history.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/80 p-12 rounded-3xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                No Typing Sessions Recorded Yet
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Complete your first typing test or paragraph assessment to unlock instant real-time performance analytics and error tracking.
              </p>
            </div>
          ) : (
            currentSession && (
              <div className="space-y-8">
                
                {/* Session Selector & Banner */}
                <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-black text-xs uppercase">
                        {currentSession.language}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase">
                        {currentSession.testType}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                        (currentSession.sessionStatus || 'Completed') === 'Completed'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200'
                          : currentSession.sessionStatus === 'Timed Out'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200'
                      }`}>
                        {currentSession.sessionStatus || 'Completed'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                      {currentSession.categoryOrTitle || 'Typing Assessment Session'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Recorded on {new Date(currentSession.timestamp).toLocaleString()} &bull; Duration: {currentSession.elapsedSeconds}s
                    </p>
                  </div>

                  {/* Dropdown to select past test for Current Test Analysis */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                      Select Session:
                    </label>
                    <select
                      value={currentSession.id}
                      onChange={(e) => setSelectedSessionId(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
                    >
                      {history.slice().reverse().map((h, idx) => (
                        <option key={h.id} value={h.id}>
                          #{history.length - idx}: {h.categoryOrTitle || h.testType} ({h.netWpm} WPM - {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Primary Metric Hero Cards for Selected Session */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  {/* Net WPM */}
                  <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <span className="text-xs font-extrabold uppercase text-slate-400">Net WPM</span>
                    <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 mt-1">
                      {currentSession.netWpm}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                      Gross: {currentSession.grossWpm} WPM
                    </span>
                  </div>

                  {/* Accuracy */}
                  <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <span className="text-xs font-extrabold uppercase text-slate-400">Accuracy</span>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {currentSession.accuracy}%
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                      Consistency: {currentSession.consistencyPercent || 85}%
                    </span>
                  </div>

                  {/* Mistakes */}
                  <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <span className="text-xs font-extrabold uppercase text-slate-400">Total Mistakes</span>
                    <div className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 mt-1">
                      {currentSession.mistakesCount}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                      Backspaces: {currentSession.backspacesCount}
                    </span>
                  </div>

                  {/* Characters Typed */}
                  <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                    <span className="text-xs font-extrabold uppercase text-slate-400">Characters Typed</span>
                    <div className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mt-1">
                      {currentSession.totalCharactersTyped}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                      Words: {currentSession.totalWordsTyped}
                    </span>
                  </div>

                </div>

                {/* Speed Progress Graph for this Session */}
                {currentSession.wpmOverTime && currentSession.wpmOverTime.length > 0 && (
                  <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" />
                        <span>Session Speed & Error Timeline</span>
                      </h4>
                    </div>

                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={currentSession.wpmOverTime}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                          <XAxis dataKey="second" tick={{ fontSize: 11 }} label={{ value: 'Seconds', position: 'insideBottom', offset: -5 }} />
                          <YAxis yAxisId="left" tick={{ fontSize: 11 }} label={{ value: 'WPM', angle: -90, position: 'insideLeft' }} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}
                            formatter={(val: any, name: any) => [val, name === 'wpm' ? 'Net WPM' : name === 'rawWpm' ? 'Raw WPM' : 'Errors']}
                          />
                          <Line yAxisId="left" type="monotone" dataKey="wpm" name="wpm" stroke="#2563eb" strokeWidth={3} dot={false} />
                          <Line yAxisId="left" type="monotone" dataKey="rawWpm" name="rawWpm" stroke="#93c5fd" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* WORD-LEVEL ANALYSIS TABLE (REQUIREMENT 1) */}
                <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/80 pb-4">
                    <div>
                      <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        <span>Detailed Word-Level Analysis</span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Complete breakdown of every mistyped or corrected word during this session
                      </p>
                    </div>
                  </div>

                  {currentSession.wordErrors && currentSession.wordErrors.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                            <th className="py-3 px-4">#</th>
                            <th className="py-3 px-4">Target Word</th>
                            <th className="py-3 px-4">Typed Word</th>
                            <th className="py-3 px-4 text-center">Mistakes</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center">Time Spent</th>
                            <th className="py-3 px-4 text-center">Backspaces</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                          {currentSession.wordErrors.map((err, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                              <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                              <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 font-nepali text-sm">
                                {err.targetWord}
                              </td>
                              <td className="py-3 px-4 font-bold text-rose-600 dark:text-rose-400 font-nepali text-sm">
                                {err.typedWord || '<empty>'}
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-rose-600 dark:text-rose-400">
                                {err.mistakes}x
                              </td>
                              <td className="py-3 px-4 text-center">
                                {err.corrected ? (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 font-extrabold text-[11px] inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Corrected
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 font-extrabold text-[11px] inline-flex items-center gap-1">
                                    <X className="w-3 h-3" /> Not Corrected
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                                {err.timeSpentMs ? `${(err.timeSpentMs / 1000).toFixed(1)}s` : 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                                {err.backspacesUsed ?? 0}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : currentSession.mistypedWordsMap && Object.keys(currentSession.mistypedWordsMap).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(currentSession.mistypedWordsMap).map(([word, cnt]) => (
                        <div key={word} className="p-3.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                          <span className="font-bold font-nepali text-sm text-slate-900 dark:text-slate-100">{word}</span>
                          <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-xs">
                            {cnt} {cnt === 1 ? 'mistake' : 'mistakes'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                      <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                      100% Word Accuracy! Zero word mistakes recorded in this session.
                    </div>
                  )}
                </div>

                {/* CHARACTER-LEVEL ANALYSIS (REQUIREMENT 2) */}
                <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="border-b border-slate-100 dark:border-slate-700/80 pb-4">
                    <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-500" />
                      <span>Character-Level Error Distribution</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Specific letter & character keypress mistakes made during this test
                    </p>
                  </div>

                  {currentSession.charErrors && currentSession.charErrors.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {currentSession.charErrors.map((cErr, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase block">Target</span>
                            <span className="text-lg font-black font-nepali text-purple-900 dark:text-purple-200">{cErr.targetChar}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-rose-500 uppercase block">Typed As</span>
                            <span className="text-sm font-bold font-nepali text-rose-600 dark:text-rose-400">{cErr.typedChar || 'Space'}</span>
                          </div>
                          <span className="px-2 py-1 rounded-lg bg-purple-600 text-white font-extrabold text-xs">
                            {cErr.frequency}x
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : currentSession.mistypedCharsMap && Object.keys(currentSession.mistypedCharsMap).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(currentSession.mistypedCharsMap).map(([ch, cnt]) => (
                        <div key={ch} className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 flex items-center gap-2">
                          <span className="font-extrabold font-nepali text-slate-800 dark:text-slate-100">{ch}</span>
                          <span className="px-2 py-0.5 rounded bg-purple-600 text-white font-black text-xs">{cnt}x</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-center text-emerald-800 dark:text-emerald-200 font-bold text-sm">
                      <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                      Flawless Character Accuracy! Zero character errors detected.
                    </div>
                  )}
                </div>

                {/* Session Keyboard Heatmap */}
                <div className="space-y-4">
                  <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-blue-500" />
                    <span>Session Keystroke Heatmap</span>
                  </h4>
                  <OnScreenKeyboard
                    keyStatsMap={currentSession.keyStatsMap || {}}
                  />
                </div>

                {/* Error Summary & Practice Launcher */}
                <ErrorAnalysisView
                  history={[currentSession]}
                  onStartTargetedPractice={(items) => onStartTargetedPractice(items)}
                />

              </div>
            )
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: LIFETIME ANALYTICS                                            */}
      {/* ========================================================================= */}
      {primarySection === 'lifetime' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Lifetime Sub-navigation */}
          <div className="flex items-center justify-start gap-1 p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl border border-slate-300/60 dark:border-slate-700/60 overflow-x-auto no-scrollbar text-xs font-extrabold">
            <button
              onClick={() => setLifetimeSubTab('overview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                lifetimeSubTab === 'overview'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Lifetime Overview</span>
            </button>

            <button
              onClick={() => setLifetimeSubTab('trends')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                lifetimeSubTab === 'trends'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Progress & Trends</span>
            </button>

            <button
              onClick={() => setLifetimeSubTab('heatmap')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                lifetimeSubTab === 'heatmap'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-4 h-4 text-purple-500" />
              <span>Overall Keyboard Heatmap</span>
            </button>

            <button
              onClick={() => setLifetimeSubTab('errors')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                lifetimeSubTab === 'errors'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Lifetime Error Breakdown</span>
            </button>

            <button
              onClick={() => setLifetimeSubTab('history')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                lifetimeSubTab === 'history'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Full Test Log ({history.length})</span>
            </button>
          </div>

          {/* LIFETIME OVERVIEW SUBTAB */}
          {(lifetimeSubTab === 'overview' || lifetimeSubTab === 'trends') && (
            <div className="space-y-8">
              
              {/* Lifetime Hero Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                
                <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" /> Peak Net WPM
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 mt-1">
                    {highestWpm}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                    Avg Net WPM: {averageNetWpm}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-500" /> Average Accuracy
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {averageAccuracy}%
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                    Best Accuracy: {bestAccuracy}%
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" /> Total Practice Time
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    {formatTimeSpent(totalTimeSeconds)}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                    Completed Tests: {completedTestsCount}
                  </span>
                </div>

                <div className="bg-white dark:bg-slate-800/90 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <span className="text-xs font-extrabold uppercase text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-500" /> Total Characters
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
                    {totalCharsTyped.toLocaleString()}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 mt-1 block">
                    Total Words: {totalWordsTyped.toLocaleString()}
                  </span>
                </div>

              </div>

              {/* Session Status Ratio Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 block">Completed Sessions</span>
                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{completedTestsCount}</span>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-800 dark:text-amber-200 block">Timed Out Sessions</span>
                    <span className="text-2xl font-black text-amber-700 dark:text-amber-300">{timedOutTestsCount}</span>
                  </div>
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-rose-800 dark:text-rose-200 block">Abandoned / Interrupted</span>
                    <span className="text-2xl font-black text-rose-700 dark:text-rose-300">{abandonedTestsCount}</span>
                  </div>
                  <X className="w-8 h-8 text-rose-500" />
                </div>
              </div>

              {/* Progress & Trend Chart */}
              <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-indigo-500" />
                      <span>Net WPM & Accuracy Growth Trend</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Speed and precision trajectory across past test sessions
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl text-xs font-semibold">
                    {(['all', 'daily', 'weekly', 'monthly'] as const).map(tf => (
                      <button
                        key={tf}
                        onClick={() => setTrendTimeframe(tf)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                          trendTimeframe === tf
                            ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendChartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[0, 'auto']} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)' }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="netWpm" name="Net WPM" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
                      <Line yAxisId="right" type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#10b981" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Personal Bests Milestone Log */}
              {personalBests.length > 0 && (
                <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>Personal Best Milestone History</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {personalBests.map((pb, idx) => (
                      <div key={pb.id || idx} className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-700 dark:text-amber-300 uppercase">
                            Record #{personalBests.length - idx}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(pb.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-amber-900 dark:text-amber-200">
                          {pb.milestoneWpm} <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Net WPM</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                          Accuracy: {pb.accuracy}% &bull; Mode: {pb.testType}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* LIFETIME KEYBOARD HEATMAP SUBTAB */}
          {lifetimeSubTab === 'heatmap' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
                <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-purple-500" />
                  <span>Cumulative Lifetime Keyboard Heatmap</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Aggregated keystroke analysis across all {totalTests} test sessions in your account history.
                </p>
              </div>

              <OnScreenKeyboard
                keyStatsMap={cumulativeKeyStatsMap}
              />
            </div>
          )}

          {/* LIFETIME ERROR BREAKDOWN SUBTAB */}
          {lifetimeSubTab === 'errors' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Lifetime Top Mistyped Words */}
              <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-700/80 pb-4">
                  <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <span>Lifetime Most Frequently Mistyped Words</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Words with the highest cumulative error frequency across all past sessions
                  </p>
                </div>

                {lifetimeMistypedWords.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {lifetimeMistypedWords.map(([word, cnt], idx) => (
                      <div key={word} className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-rose-400 font-mono">#{idx + 1}</span>
                          <span className="font-extrabold font-nepali text-base text-slate-900 dark:text-slate-100">{word}</span>
                        </div>
                        <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-extrabold text-xs shadow-sm">
                          {cnt} {cnt === 1 ? 'error' : 'errors'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    No mistyped words recorded in account history yet.
                  </p>
                )}
              </div>

              {/* Lifetime Top Mistyped Characters */}
              <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="border-b border-slate-100 dark:border-slate-700/80 pb-4">
                  <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span>Lifetime Most Mistyped Characters</span>
                  </h4>
                </div>

                {lifetimeMistypedChars.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {lifetimeMistypedChars.map(([ch, cnt]) => (
                      <div key={ch} className="px-4 py-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900 flex items-center gap-3">
                        <span className="font-black font-nepali text-lg text-purple-900 dark:text-purple-200">{ch}</span>
                        <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-extrabold text-xs">{cnt}x</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    No character errors recorded.
                  </p>
                )}
              </div>

              <ErrorAnalysisView
                history={history}
                onStartTargetedPractice={(items) => onStartTargetedPractice(items)}
              />

            </div>
          )}

          {/* LIFETIME FULL TEST HISTORY TABLE SUBTAB */}
          {lifetimeSubTab === 'history' && (
            <div className="bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 animate-fadeIn">
              
              {/* Table Controls & Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/80 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-md font-extrabold text-slate-800 dark:text-slate-100">
                    Full Session Log ({filteredHistory.length} Results)
                  </h4>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search test title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filter Dropdowns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Language</label>
                  <select
                    value={filterLanguage}
                    onChange={(e) => setFilterLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold"
                  >
                    <option value="all">All Languages</option>
                    <option value="nepali">Nepali</option>
                    <option value="english">English</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Test Type</label>
                  <select
                    value={filterTestType}
                    onChange={(e) => setFilterTestType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold"
                  >
                    <option value="all">All Modes</option>
                    <option value="time">Timed Speed Test</option>
                    <option value="legal">Legal Pack</option>
                    <option value="paragraph">Paragraph Assessment</option>
                    <option value="words">Word Count Test</option>
                    <option value="custom">Custom Text</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Session Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Completed">Completed</option>
                    <option value="Timed Out">Timed Out</option>
                    <option value="Abandoned">Abandoned / Interrupted</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Date Range</label>
                  <select
                    value={filterDateRange}
                    onChange={(e) => setFilterDateRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-100 text-xs font-bold"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today Only</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                  </select>
                </div>
              </div>

              {/* History Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-extrabold uppercase tracking-wider">
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Language</th>
                      <th className="py-3 px-4">Mode</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Title / Category</th>
                      <th className="py-3 px-4 text-center">Net WPM</th>
                      <th className="py-3 px-4 text-center">Accuracy</th>
                      <th className="py-3 px-4 text-center">Mistakes</th>
                      <th className="py-3 px-4 text-center">Duration</th>
                      <th className="py-3 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                            {new Date(item.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4 font-bold uppercase text-slate-700 dark:text-slate-300">
                            {item.language}
                          </td>
                          <td className="py-3 px-4 font-bold capitalize text-slate-600 dark:text-slate-400">
                            {item.testType}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              (item.sessionStatus || 'Completed') === 'Completed'
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200'
                                : item.sessionStatus === 'Timed Out'
                                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200'
                                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200'
                            }`}>
                              {item.sessionStatus || 'Completed'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                            {item.categoryOrTitle || 'General Session'}
                          </td>
                          <td className="py-3 px-4 text-center font-black text-blue-600 dark:text-blue-400 text-sm">
                            {item.netWpm}
                          </td>
                          <td className="py-3 px-4 text-center font-extrabold text-emerald-600 dark:text-emerald-400">
                            {item.accuracy}%
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-rose-600 dark:text-rose-400">
                            {item.mistakesCount}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-500 font-mono">
                            {item.elapsedSeconds}s
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedSessionId(item.id);
                                setPrimarySection('current');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-300 font-extrabold text-[11px] transition-all"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400 italic">
                          No matching typing test records found for the active filter settings.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
