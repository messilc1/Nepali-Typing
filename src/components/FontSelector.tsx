import React, { useState, useRef, useEffect } from 'react';
import { Type, Check, ChevronDown, Sparkles } from 'lucide-react';
import { SUPPORTED_NEPALI_FONTS, applyGlobalNepaliFont, NepaliFont } from '../utils/fonts';

interface FontSelectorProps {
  currentFont: string;
  onSelectFont: (fontId: string) => void;
  variant?: 'navbar' | 'toolbar' | 'settings';
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  currentFont,
  onSelectFont,
  variant = 'navbar'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (font: NepaliFont) => {
    applyGlobalNepaliFont(font.id);
    onSelectFont(font.id);
    setIsOpen(false);
  };

  const activeFontObj = SUPPORTED_NEPALI_FONTS.find(f => f.id === currentFont) || SUPPORTED_NEPALI_FONTS[1];

  if (variant === 'settings') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-blue-600" /> Nepali Devanagari Font Engine
          </label>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
            Pure Unicode Preserved
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
          {SUPPORTED_NEPALI_FONTS.map(font => {
            const isSelected = currentFont === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => handleSelect(font)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/10 dark:bg-blue-950/80 border-blue-600 dark:border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100">
                    {font.name}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {font.category}
                  </span>
                </div>

                {/* Live Devanagari Render Preview */}
                <div
                  className="text-base font-bold text-slate-800 dark:text-slate-200 truncate pt-0.5"
                  style={{ fontFamily: font.fontFamilyCss }}
                >
                  {font.previewText}
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 p-1 bg-blue-600 text-white rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Selector Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Change Nepali Unicode Display Font"
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all text-xs font-extrabold shadow-sm cursor-pointer ${
          variant === 'toolbar'
            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            : 'bg-slate-100/90 dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        <Type className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
        <span className="hidden sm:inline text-slate-500 font-normal">Font:</span>
        <span className="font-extrabold" style={{ fontFamily: activeFontObj.fontFamilyCss }}>
          {activeFontObj.name}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 sm:right-auto sm:left-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 space-y-1 animate-fadeIn max-h-96 overflow-y-auto">
          
          <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Nepali Fonts</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Instant Live Switch</span>
          </div>

          <div className="space-y-1 pt-1">
            {SUPPORTED_NEPALI_FONTS.map(font => {
              const isSelected = currentFont === font.id;
              return (
                <button
                  key={font.id}
                  type="button"
                  onClick={() => handleSelect(font)}
                  className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-100 font-bold border border-blue-200 dark:border-blue-800'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {font.name}
                      </span>
                      <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                        {font.category}
                      </span>
                    </div>
                    {/* Real-time sample rendered in actual font */}
                    <span
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate"
                      style={{ fontFamily: font.fontFamilyCss }}
                    >
                      {font.previewText}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="p-1 bg-blue-600 text-white rounded-lg shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
