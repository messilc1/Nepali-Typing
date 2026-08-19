import React from 'react';
import {
  LOK_SEWA_DEVANAGARI_BRACKETS,
  LOK_SEWA_ENGLISH_BRACKETS,
  LOK_SEWA_TOOLTIP_TEXT
} from '../utils/lokSewaEvaluation';
import { Award, Clock, HelpCircle, Scale, ShieldCheck, X, CheckCircle2, Calculator } from 'lucide-react';

interface LokSewaRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LokSewaRulesModal: React.FC<LokSewaRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                लोक सेवा आयोग (Lok Sewa Aayog) IT Skill Test
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                Official Typing Methodology, CWPM Formula & Marking Criteria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            aria-label="Close rules"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          
          {/* Quick Summary Banner */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
              {LOK_SEWA_TOOLTIP_TEXT}
            </p>
          </div>

          {/* Formula Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Correct WPM (CWPM) Formula</span>
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-center text-base sm:text-lg font-bold text-blue-700 dark:text-blue-300 shadow-inner">
              CWPM = (Total Words Typed − Wrong Words) ÷ 5
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>
                <strong>Example:</strong> If you typed <strong>135 words</strong> in 5 minutes with <strong>8 wrong words</strong>:
              </p>
              <p className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded inline-block">
                (135 − 8) ÷ 5 = 127 ÷ 5 = <strong>25.4 CWPM</strong> &rarr; <strong>2.50 / 2.50 Full Marks</strong>
              </p>
            </div>
          </div>

          {/* Marking Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Devanagari Table */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  Devanagari (Nepali)
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                  Target: 25+ CWPM
                </span>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">CWPM Range</th>
                      <th className="py-2 px-3 text-right">Marks (/2.5)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {LOK_SEWA_DEVANAGARI_BRACKETS.map((b, i) => (
                      <tr
                        key={i}
                        className={b.marks === 2.5 ? 'bg-emerald-50/70 dark:bg-emerald-950/30 font-bold text-emerald-700 dark:text-emerald-300' : ''}
                      >
                        <td className="py-1.5 px-3">{b.label}</td>
                        <td className="py-1.5 px-3 text-right font-mono">{b.marks.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* English Table */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-500" />
                  English Typing
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                  Target: 30+ CWPM
                </span>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2 px-3">CWPM Range</th>
                      <th className="py-2 px-3 text-right">Marks (/2.5)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {LOK_SEWA_ENGLISH_BRACKETS.map((b, i) => (
                      <tr
                        key={i}
                        className={b.marks === 2.5 ? 'bg-blue-50/70 dark:bg-blue-950/30 font-bold text-blue-700 dark:text-blue-300' : ''}
                      >
                        <td className="py-1.5 px-3">{b.label}</td>
                        <td className="py-1.5 px-3 text-right font-mono">{b.marks.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Key Rules List */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Exam Rules & Conditions
            </h4>
            <ul className="text-xs space-y-1.5 list-disc pl-4 text-slate-600 dark:text-slate-400">
              <li>Test runs for an exact duration of <strong>5 minutes (300 seconds)</strong>.</li>
              <li>Every mistake or uncorrected wrong word directly decreases your net CWPM.</li>
              <li>For Devanagari Unicode / Traditional typing, 25+ CWPM earns full 2.5 marks.</li>
              <li>For English Typing, 30+ CWPM earns full 2.5 marks.</li>
              <li>The test will automatically finalize and compute your official marks upon timer completion.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
          >
            Understood & Close
          </button>
        </div>

      </div>
    </div>
  );
};
