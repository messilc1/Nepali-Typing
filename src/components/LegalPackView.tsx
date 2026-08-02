import React, { useState } from 'react';
import { Scale, Search, BookOpen, Play, CheckCircle2 } from 'lucide-react';
import { LEGAL_TERMS_PACK, SAMPLE_PARAGRAPHS } from '../data/wordPacks';
import { LegalTerm } from '../types';

interface LegalPackViewProps {
  onStartLegalTest: (passageText: string) => void;
  onStartTermsTest: (terms: string[]) => void;
}

export const LegalPackView: React.FC<LegalPackViewProps> = ({
  onStartLegalTest,
  onStartTermsTest
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Constitution', 'Court & Judiciary', 'Government & Admin', 'Civil & Criminal'];

  const filteredTerms = LEGAL_TERMS_PACK.filter(term => {
    const matchesCat = selectedCategory === 'All' || term.category === selectedCategory;
    const matchesSearch =
      term.devanagari.includes(searchQuery) ||
      term.romanized.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div id="legal-pack-view" className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 font-extrabold text-xs rounded-full border border-amber-400/30 w-max mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Lok Sewa Aayog & Judiciary Examination Special</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Nepali Legal & Constitutional Vocabulary Hub
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Master high-frequency legal terminology, Constitutional Articles, and Supreme Court judgments required for judicial exams and Lok Sewa computer typing skill tests.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onStartLegalTest(SAMPLE_PARAGRAPHS.constitution)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Practice Constitution Passage (२०७२)</span>
            </button>
            <button
              onClick={() => onStartLegalTest(SAMPLE_PARAGRAPHS.supreme_court_judgment)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 transition-all"
            >
              <span>Practice Supreme Court Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Terms Search & Filter */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search legal terms (e.g., adalat, फैसला)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredTerms.map((term, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-2xl font-black text-slate-900 dark:text-slate-100 nepali-font-apply"
                    style={{ fontFamily: 'var(--app-nepali-font)' }}
                  >
                    {term.devanagari}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {term.category}
                  </span>
                </div>

                <div className="text-xs font-mono text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">
                  Romanized: {term.romanized}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
                  {term.englishMeaning}
                </p>
              </div>

              <button
                onClick={() => onStartTermsTest([term.devanagari])}
                className="mt-4 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left"
              >
                Practice this term →
              </button>
            </div>
          ))}
        </div>

        {filteredTerms.length > 0 && (
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => onStartTermsTest(filteredTerms.map(t => t.devanagari))}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Practice All {filteredTerms.length} Filtered Legal Terms</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
