import React, { useState } from 'react';
import { X, FileText, Play, Sparkles } from 'lucide-react';
import { SAMPLE_PARAGRAPHS } from '../data/wordPacks';

interface CustomParagraphModalProps {
  onStartCustomTest: (text: string) => void;
  onClose: () => void;
}

export const CustomParagraphModal: React.FC<CustomParagraphModalProps> = ({
  onStartCustomTest,
  onClose
}) => {
  const [pastedText, setPastedText] = useState('');

  const handleStart = () => {
    if (!pastedText.trim()) return;
    onStartCustomTest(pastedText.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Custom Paragraph Typing Test
              </h2>
              <p className="text-xs text-slate-500">
                Paste any legal judgment, article, Supreme Court decision, or notes to practice
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Samples */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Or Choose Built-in Legal Passages:
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPastedText(SAMPLE_PARAGRAPHS.constitution)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Nepal Constitution (२०७२)
            </button>
            <button
              onClick={() => setPastedText(SAMPLE_PARAGRAPHS.supreme_court_judgment)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Supreme Court Judgment
            </button>
            <button
              onClick={() => setPastedText(SAMPLE_PARAGRAPHS.legal_newspaper)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Legal Newspaper Article
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div>
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your custom paragraph here in Nepali or English..."
            rows={8}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-['Mukta']"
          ></textarea>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!pastedText.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Test on Custom Text</span>
          </button>
        </div>

      </div>
    </div>
  );
};
