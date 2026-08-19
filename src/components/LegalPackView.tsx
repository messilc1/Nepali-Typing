import React, { useState } from 'react';
import { Scale, Search, BookOpen, Play, CheckCircle2, Clock, Filter, Sparkles, Award, ArrowLeft } from 'lucide-react';
import { LEGAL_PASSAGES } from '../data/wordPacks';
import { LegalPassage } from '../types';

interface LegalPackViewProps {
  onStartLegalTest: (passageText: string, passageTitle?: string) => void;
  onBack?: () => void;
}

export const LegalPackView: React.FC<LegalPackViewProps> = ({
  onStartLegalTest,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLength, setSelectedLength] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const categories = [
    'All',
    'Lok Sewa Model Questions',
    'Constitution',
    'Court & Judiciary',
    'Civil & Criminal',
    'Court Procedures',
    'Public Administration'
  ];

  const lengths = ['All', 'Short', 'Medium', 'Long'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredPassages = LEGAL_PASSAGES.filter(passage => {
    const matchesCat = selectedCategory === 'All' || passage.category === selectedCategory;
    const matchesLen = selectedLength === 'All' || passage.lengthCategory === selectedLength;
    const matchesDiff = selectedDifficulty === 'All' || passage.difficulty === selectedDifficulty;
    
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      passage.title.toLowerCase().includes(query) ||
      passage.nepaliTitle.includes(query) ||
      passage.text.includes(query) ||
      passage.description.toLowerCase().includes(query) ||
      passage.keyTermsIncluded.some(k => k.toLowerCase().includes(query) || k.includes(query));

    return matchesCat && matchesLen && matchesDiff && matchesSearch;
  });

  const getDifficultyBadgeColor = (diff: LegalPassage['difficulty']) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Intermediate':
        return 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Advanced':
        return 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'Expert':
        return 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getLengthBadgeColor = (len: LegalPassage['lengthCategory']) => {
    switch (len) {
      case 'Short':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Medium':
        return 'bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'Long':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div id="legal-pack-view" className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-blue-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          {onBack && (
            <div className="mb-4">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs transition-all cursor-pointer border border-white/20"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Typing Test</span>
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 px-3.5 py-1 bg-amber-400/20 text-amber-300 font-extrabold text-xs rounded-full border border-amber-400/30 w-max mb-4">
            <Scale className="w-4 h-4 text-amber-300" />
            <span>Lok Sewa Aayog & Judiciary Examination Special</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Nepali Legal & Lok Sewa Passages Hub
          </h2>

          <p className="text-indigo-100 text-xs sm:text-sm mt-3 leading-relaxed font-medium">
            Practice typing realistic Lok Sewa Aayog Computer Skill Test model exam sets, Constitutional Articles, Supreme Court judgments, and court drafting passages in authentic Devanagari format.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
              onClick={() => onStartLegalTest(LEGAL_PASSAGES[0].text, LEGAL_PASSAGES[0].nepaliTitle)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Section Officer Model Set 1 (बालअधिकार)</span>
            </button>

            <button
              onClick={() => onStartLegalTest(LEGAL_PASSAGES[1].text, LEGAL_PASSAGES[1].nepaliTitle)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Section Officer Model Set 2 (अमेजन)</span>
            </button>

            <button
              onClick={() => onStartLegalTest(LEGAL_PASSAGES[2].text, LEGAL_PASSAGES[2].nepaliTitle)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-extrabold text-xs border border-indigo-500/40 transition-all"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>Constitution Part 3 (२०७२)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Passages Search & Filter Control Center */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
        
        {/* Search Bar & Top Title */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Legal Passages Library</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a passage by category, length, or difficulty to begin practice
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search passages (e.g., संविधान, अदालत, बालअधिकार)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Filters Group */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider mr-1">Category:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Length & Difficulty Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            
            {/* Length Filter */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Length:</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
                {lengths.map(len => (
                  <button
                    key={len}
                    onClick={() => setSelectedLength(len)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      selectedLength === len
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {len === 'Short' ? 'Short (~100w)' : len === 'Medium' ? 'Medium (~250w)' : len === 'Long' ? 'Long (500w+)' : 'All'}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Difficulty:</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Passages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPassages.map((passage) => (
          <div
            key={passage.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Badges Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {passage.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getLengthBadgeColor(passage.lengthCategory)}`}>
                    {passage.lengthCategory} ({passage.wordCount} words)
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyBadgeColor(passage.difficulty)}`}>
                    {passage.difficulty}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                {passage.nepaliTitle}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {passage.title}
              </p>

              {/* Passage Preview Card */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal max-h-36 overflow-hidden relative">
                <p
                  className="nepali-font-apply line-clamp-4"
                  style={{ fontFamily: 'var(--app-nepali-font)' }}
                >
                  {passage.text}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 dark:from-slate-900/90 to-transparent pointer-events-none"></div>
              </div>

              {/* Key terms chips */}
              {passage.keyTermsIncluded && passage.keyTermsIncluded.length > 0 && (
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Key Legal Terms Included:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {passage.keyTermsIncluded.map((term, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 nepali-font-apply"
                        style={{ fontFamily: 'var(--app-nepali-font)' }}
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Start Practice Test CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Est. {Math.ceil(passage.wordCount / 30)} min practice</span>
              </span>

              <button
                onClick={() => onStartLegalTest(passage.text, passage.nepaliTitle)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 transition-all transform group-hover:scale-[1.02]"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Practice Test</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {filteredPassages.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            No legal passages found matching your filters
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search terms, category, length, or difficulty filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLength('All');
              setSelectedDifficulty('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
