import React from 'react';
import { AlertTriangle, Target, Zap, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { TestResult } from '../types';

interface ErrorAnalysisViewProps {
  history: TestResult[];
  onStartTargetedPractice: (items: string[]) => void;
}

export const ErrorAnalysisView: React.FC<ErrorAnalysisViewProps> = ({
  history,
  onStartTargetedPractice
}) => {
  // Aggregate mistakes across tests
  const wordMistakesCount: Record<string, number> = {};
  const charMistakesCount: Record<string, number> = {};

  history.forEach(test => {
    Object.entries(test.mistypedWordsMap || {}).forEach(([word, count]) => {
      const cnt = Number(count) || 0;
      wordMistakesCount[word] = (wordMistakesCount[word] || 0) + cnt;
      word.split('').forEach(ch => {
        charMistakesCount[ch] = (charMistakesCount[ch] || 0) + cnt;
      });
    });
  });

  const sortedMistypedWords = Object.entries(wordMistakesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const sortedMistypedChars = Object.entries(charMistakesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  const recommendedPracticeItems = sortedMistypedChars.map(([ch]) => ch);

  return (
    <div id="error-analysis-view" className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-7 h-7 text-amber-300" />
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Comprehensive Error Analysis
          </h2>
        </div>
        <p className="text-blue-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          Analyze recurring typing mistakes, identify weak conjunct letters, and generate targeted drills to eliminate bottlenecks in your speed and accuracy.
        </p>

        {recommendedPracticeItems.length > 0 && (
          <div className="mt-6 pt-6 border-t border-blue-500/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-blue-100 font-medium">
              <span>Top Weak Characters Needing Practice:</span>
              <div className="flex items-center gap-1">
                {recommendedPracticeItems.slice(0, 6).map((c, i) => (
                  <span key={i} className="bg-white/20 text-white px-2 py-0.5 rounded font-extrabold text-sm">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onStartTargetedPractice(recommendedPracticeItems)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-extrabold text-xs shadow-md hover:bg-blue-50 transition-all"
            >
              <span>Launch Targeted Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Most Mistyped Characters */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-rose-500" />
            Most Mistyped Characters & Conjuncts
          </h3>

          {sortedMistypedChars.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sortedMistypedChars.map(([char, count], i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{char}</span>
                  <span className="text-xs font-extrabold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                    {count} errors
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold p-4">
              <CheckCircle2 className="w-5 h-5" />
              <span>No major character errors recorded yet! Take more typing tests to gather insights.</span>
            </div>
          )}
        </div>

        {/* Most Mistyped Words */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Most Mistyped Words List
          </h3>

          {sortedMistypedWords.length > 0 ? (
            <div className="space-y-2.5">
              {sortedMistypedWords.map(([word, count], i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{word}</span>
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2.5 py-1 rounded-lg">
                    {count} mistakes
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-semibold p-4">
              <CheckCircle2 className="w-5 h-5" />
              <span>No word errors recorded in recent sessions. Great job!</span>
            </div>
          )}
        </div>

      </div>

      {/* Suggested Practice Drills */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          Recommended Focus Areas for Speed Improvement
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
            <h4 className="font-bold text-blue-900 dark:text-blue-200 text-sm mb-1">Conjunct Letters (संयुक्त अक्षर)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Practice combining halants with consonants like क्ष (k+sh), ज्ञ (j+yn), and श्र (sh+r).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm mb-1">Matra Positioning (मात्रा)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Improve speed when switching between short vowel matras (ि, ु) and long matras (ी, ू).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm mb-1">Legal Vocabulary</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Train on Lok Sewa high-frequency terms like संविधान, अदालत, and महान्यायाधिवक्ता.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
