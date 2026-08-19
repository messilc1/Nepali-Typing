import React, { useState } from 'react';
import { Scale, HelpCircle, Award, Check } from 'lucide-react';
import { LOK_SEWA_TOOLTIP_TEXT } from '../utils/lokSewaEvaluation';
import { LokSewaRulesModal } from './LokSewaRulesModal';

interface LokSewaToggleProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  compact?: boolean;
  className?: string;
}

export const LokSewaToggle: React.FC<LokSewaToggleProps> = ({
  isEnabled,
  onToggle,
  compact = false,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);

  return (
    <>
      <div className={`relative inline-flex items-center gap-1.5 ${className}`}>
        
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => onToggle(!isEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
            isEnabled
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-amber-400/80 shadow-sm shadow-amber-500/20 ring-2 ring-amber-400/40'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
          title={isEnabled ? 'Lok Sewa Exam Mode is ON (5m • CWPM Scoring)' : 'Click to enable Lok Sewa Exam Mode'}
        >
          <Scale className={`w-3.5 h-3.5 ${isEnabled ? 'text-white' : 'text-amber-500'}`} />
          <span>Lok Sewa Mode</span>
          {isEnabled ? (
            <span className="flex items-center gap-0.5 bg-amber-700/60 text-white text-[10px] px-1.5 py-0.2 rounded font-extrabold uppercase tracking-wider">
              ON
            </span>
          ) : (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
              OFF
            </span>
          )}
        </button>

        {/* Info Tooltip Trigger */}
        <div
          className="relative inline-flex items-center"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowRulesModal(true);
            }}
            className="w-5 h-5 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition cursor-pointer"
            aria-label="Lok Sewa Mode information"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Hover Tooltip Popup */}
          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-slate-900 text-white text-xs rounded-2xl shadow-xl border border-slate-700 z-50 pointer-events-auto animate-fadeIn">
              <div className="flex items-center justify-between gap-1 mb-1.5 pb-1 border-b border-slate-800">
                <span className="font-extrabold text-amber-400 flex items-center gap-1 text-[11px]">
                  <Award className="w-3 h-3 text-amber-400" />
                  Lok Sewa IT Skill Test
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowTooltip(false);
                    setShowRulesModal(true);
                  }}
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                >
                  View Rules
                </button>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {LOK_SEWA_TOOLTIP_TEXT}
              </p>
            </div>
          )}
        </div>

        {/* View Rules Quick Link */}
        {!compact && (
          <button
            type="button"
            onClick={() => setShowRulesModal(true)}
            className="text-[11px] text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium underline underline-offset-2 ml-0.5 cursor-pointer"
          >
            Rules
          </button>
        )}

      </div>

      {/* Full Modal */}
      <LokSewaRulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
      />
    </>
  );
};
