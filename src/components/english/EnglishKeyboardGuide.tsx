import React from 'react';
import { getFingerInfoForKey, FingerInfo } from '../../data/englishCourseData';
import { Sparkles, Eye, EyeOff, Hand } from 'lucide-react';

interface EnglishKeyboardGuideProps {
  currentTargetChar?: string;
  nextTargetChar?: string;
  showGuidance?: boolean;
  onToggleGuidance?: () => void;
  activeKey?: string; // Pressed key animation
}

interface KeyDefinition {
  label: string;
  subLabel?: string;
  keyChar: string;
  width?: string;
}

const KEYBOARD_LAYOUT: KeyDefinition[][] = [
  // Number Row
  [
    { label: '~', subLabel: '`', keyChar: '`', width: 'w-10 sm:w-11' },
    { label: '!', subLabel: '1', keyChar: '1', width: 'w-10 sm:w-11' },
    { label: '@', subLabel: '2', keyChar: '2', width: 'w-10 sm:w-11' },
    { label: '#', subLabel: '3', keyChar: '3', width: 'w-10 sm:w-11' },
    { label: '$', subLabel: '4', keyChar: '4', width: 'w-10 sm:w-11' },
    { label: '%', subLabel: '5', keyChar: '5', width: 'w-10 sm:w-11' },
    { label: '^', subLabel: '6', keyChar: '6', width: 'w-10 sm:w-11' },
    { label: '&', subLabel: '7', keyChar: '7', width: 'w-10 sm:w-11' },
    { label: '*', subLabel: '8', keyChar: '8', width: 'w-10 sm:w-11' },
    { label: '(', subLabel: '9', keyChar: '9', width: 'w-10 sm:w-11' },
    { label: ')', subLabel: '0', keyChar: '0', width: 'w-10 sm:w-11' },
    { label: '_', subLabel: '-', keyChar: '-', width: 'w-10 sm:w-11' },
    { label: '+', subLabel: '=', keyChar: '=', width: 'w-10 sm:w-11' },
    { label: 'Bksp', keyChar: 'Backspace', width: 'w-16 sm:w-20' }
  ],
  // Top QWERTY Row
  [
    { label: 'Tab', keyChar: 'Tab', width: 'w-14 sm:w-16' },
    { label: 'Q', keyChar: 'q', width: 'w-10 sm:w-11' },
    { label: 'W', keyChar: 'w', width: 'w-10 sm:w-11' },
    { label: 'E', keyChar: 'e', width: 'w-10 sm:w-11' },
    { label: 'R', keyChar: 'r', width: 'w-10 sm:w-11' },
    { label: 'T', keyChar: 't', width: 'w-10 sm:w-11' },
    { label: 'Y', keyChar: 'y', width: 'w-10 sm:w-11' },
    { label: 'U', keyChar: 'u', width: 'w-10 sm:w-11' },
    { label: 'I', keyChar: 'i', width: 'w-10 sm:w-11' },
    { label: 'O', keyChar: 'o', width: 'w-10 sm:w-11' },
    { label: 'P', keyChar: 'p', width: 'w-10 sm:w-11' },
    { label: '{', subLabel: '[', keyChar: '[', width: 'w-10 sm:w-11' },
    { label: '}', subLabel: ']', keyChar: ']', width: 'w-10 sm:w-11' },
    { label: '|', subLabel: '\\', keyChar: '\\', width: 'w-12 sm:w-14' }
  ],
  // Home Row
  [
    { label: 'Caps', keyChar: 'CapsLock', width: 'w-16 sm:w-20' },
    { label: 'A', keyChar: 'a', width: 'w-10 sm:w-11' },
    { label: 'S', keyChar: 's', width: 'w-10 sm:w-11' },
    { label: 'D', keyChar: 'd', width: 'w-10 sm:w-11' },
    { label: 'F', subLabel: '•', keyChar: 'f', width: 'w-10 sm:w-11' },
    { label: 'G', keyChar: 'g', width: 'w-10 sm:w-11' },
    { label: 'H', keyChar: 'h', width: 'w-10 sm:w-11' },
    { label: 'J', subLabel: '•', keyChar: 'j', width: 'w-10 sm:w-11' },
    { label: 'K', keyChar: 'k', width: 'w-10 sm:w-11' },
    { label: 'L', keyChar: 'l', width: 'w-10 sm:w-11' },
    { label: ':', subLabel: ';', keyChar: ';', width: 'w-10 sm:w-11' },
    { label: '"', subLabel: "'", keyChar: "'", width: 'w-10 sm:w-11' },
    { label: 'Enter', keyChar: 'Enter', width: 'w-16 sm:w-20' }
  ],
  // Bottom Row
  [
    { label: 'Shift', keyChar: 'ShiftLeft', width: 'w-20 sm:w-24' },
    { label: 'Z', keyChar: 'z', width: 'w-10 sm:w-11' },
    { label: 'X', keyChar: 'x', width: 'w-10 sm:w-11' },
    { label: 'C', keyChar: 'c', width: 'w-10 sm:w-11' },
    { label: 'V', keyChar: 'v', width: 'w-10 sm:w-11' },
    { label: 'B', keyChar: 'b', width: 'w-10 sm:w-11' },
    { label: 'N', keyChar: 'n', width: 'w-10 sm:w-11' },
    { label: 'M', keyChar: 'm', width: 'w-10 sm:w-11' },
    { label: '<', subLabel: ',', keyChar: ',', width: 'w-10 sm:w-11' },
    { label: '>', subLabel: '.', keyChar: '.', width: 'w-10 sm:w-11' },
    { label: '?', subLabel: '/', keyChar: '/', width: 'w-10 sm:w-11' },
    { label: 'Shift', keyChar: 'ShiftRight', width: 'w-20 sm:w-24' }
  ],
  // Space Row
  [
    { label: 'Ctrl', keyChar: 'Control', width: 'w-14 sm:w-16' },
    { label: 'Alt', keyChar: 'Alt', width: 'w-12 sm:w-14' },
    { label: 'Spacebar', keyChar: ' ', width: 'w-64 sm:w-80' },
    { label: 'Alt', keyChar: 'Alt', width: 'w-12 sm:w-14' },
    { label: 'Ctrl', keyChar: 'Control', width: 'w-14 sm:w-16' }
  ]
];

export const EnglishKeyboardGuide: React.FC<EnglishKeyboardGuideProps> = ({
  currentTargetChar = '',
  nextTargetChar = '',
  showGuidance = true,
  onToggleGuidance,
  activeKey
}) => {
  const currentFingerInfo: FingerInfo = getFingerInfoForKey(currentTargetChar || 'f');
  const nextFingerInfo: FingerInfo | null = nextTargetChar ? getFingerInfoForKey(nextTargetChar) : null;
  const isUppercase = currentTargetChar >= 'A' && currentTargetChar <= 'Z';

  return (
    <div id="english-interactive-keyboard-guide" className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 space-y-4">
      
      {/* Header & Live Finger Coach Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Interactive English QWERTY Keyboard Guide</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                Live Finger Coach
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Color-coded finger regions guide your muscle memory without looking down
            </p>
          </div>
        </div>

        {/* Guidance Toggle Button */}
        {onToggleGuidance && (
          <button
            onClick={onToggleGuidance}
            className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
          >
            {showGuidance ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-blue-500" />}
            <span>{showGuidance ? 'Hide Keyboard Guide' : 'Show Keyboard Guide'}</span>
          </button>
        )}
      </div>

      {showGuidance && (
        <>
          {/* Real-time Target Key & Finger Assignment Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gradient-to-r from-slate-50 via-blue-50/40 to-slate-50 dark:from-slate-800/60 dark:via-blue-950/30 dark:to-slate-800/60 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 text-xs">
            
            {/* Current Target Key */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 animate-pulse">
                {currentTargetChar === ' ' ? '␣' : currentTargetChar || '—'}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Target Key to Press
                </span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 truncate block text-sm">
                  {currentTargetChar === ' ' ? 'Spacebar' : `Key '${currentTargetChar}'`}
                  {isUppercase && <span className="text-blue-600 dark:text-blue-400 font-bold ml-1">(+ Shift)</span>}
                </span>
              </div>
            </div>

            {/* Hand & Finger Assignment */}
            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/80 pt-2 md:pt-0 md:pl-3">
              <div className={`px-2.5 py-1.5 rounded-xl font-black text-xs shrink-0 flex items-center gap-1.5 ${currentFingerInfo.bgClass} border ${currentFingerInfo.borderClass}`}>
                <Hand className="w-3.5 h-3.5" />
                <span>{currentFingerInfo.hand} Hand</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Assigned Finger
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                  {currentFingerInfo.finger} Finger
                </span>
              </div>
            </div>

            {/* Next Expected Key */}
            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700/80 pt-2 md:pt-0 md:pl-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono font-bold text-sm flex items-center justify-center shrink-0">
                {nextTargetChar === ' ' ? '␣' : nextTargetChar || '—'}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  Next Coming Key
                </span>
                <span className="font-semibold text-slate-600 dark:text-slate-300 text-xs truncate block">
                  {nextFingerInfo ? `${nextFingerInfo.label}` : 'End of Drill'}
                </span>
              </div>
            </div>

          </div>

          {/* QWERTY Physical Keyboard Render */}
          <div className="overflow-x-auto pb-2 flex justify-center">
            <div className="inline-flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 min-w-max select-none shadow-inner">
              {KEYBOARD_LAYOUT.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-1.5 justify-center">
                  {row.map((k, kIdx) => {
                    const fingerInfo = getFingerInfoForKey(k.keyChar);
                    const isTarget =
                      currentTargetChar.toLowerCase() === k.keyChar.toLowerCase() ||
                      (currentTargetChar === ' ' && k.keyChar === ' ');
                    const isNext =
                      nextTargetChar.toLowerCase() === k.keyChar.toLowerCase() ||
                      (nextTargetChar === ' ' && k.keyChar === ' ');
                    const isActive = activeKey?.toLowerCase() === k.keyChar.toLowerCase();

                    // Shift highlight if target requires Shift
                    const isShiftNeeded = isUppercase && (
                      (currentFingerInfo.hand === 'Left' && k.keyChar === 'ShiftRight') ||
                      (currentFingerInfo.hand === 'Right' && k.keyChar === 'ShiftLeft')
                    );

                    let keyClasses = 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 shadow-sm';

                    if (isActive) {
                      keyClasses = 'bg-blue-500 text-white border-blue-600 scale-95 shadow-inner ring-2 ring-blue-400';
                    } else if (isTarget) {
                      keyClasses = 'bg-blue-600 text-white font-black border-blue-700 scale-105 shadow-md shadow-blue-500/30 ring-2 ring-blue-400 animate-bounce';
                    } else if (isShiftNeeded) {
                      keyClasses = 'bg-amber-500 text-white font-black border-amber-600 scale-105 shadow-md shadow-amber-500/30 ring-2 ring-amber-400 animate-pulse';
                    } else if (isNext) {
                      keyClasses = 'bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-800 ring-1 ring-blue-300';
                    }

                    return (
                      <div
                        key={kIdx}
                        className={`h-10 sm:h-11 ${k.width || 'w-10 sm:w-11'} rounded-lg border flex flex-col items-center justify-center text-[11px] sm:text-xs font-bold transition-all relative select-none ${keyClasses}`}
                      >
                        {k.subLabel && !isTarget && (
                          <span className="text-[9px] leading-none opacity-50 absolute top-1 right-1.5 font-mono">
                            {k.subLabel}
                          </span>
                        )}
                        <span className="font-mono">{k.label}</span>
                        {/* Finger dot indicator */}
                        <div
                          className={`w-1.5 h-1.5 rounded-full mt-0.5 opacity-60 ${
                            fingerInfo.finger === 'Pinky'
                              ? 'bg-rose-400'
                              : fingerInfo.finger === 'Ring'
                              ? 'bg-amber-400'
                              : fingerInfo.finger === 'Middle'
                              ? 'bg-lime-400'
                              : fingerInfo.finger === 'Index'
                              ? 'bg-emerald-400'
                              : 'bg-blue-400'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Color Legend & Hand Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] pt-1 text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-bold text-slate-700 dark:text-slate-300">Finger Color Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>Pinky</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Ring</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
                <span>Middle</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Index</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>Thumb (Space)</span>
              </div>
            </div>

            <div className="text-[11px] font-semibold text-slate-400 italic">
              Home Row Anchors: Feel tactile bumps on <strong>F</strong> and <strong>J</strong>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
