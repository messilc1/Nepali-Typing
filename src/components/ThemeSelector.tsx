import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Laptop, ShieldAlert, Check, ChevronDown } from 'lucide-react';
import { ThemeType } from '../types';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onSelectTheme: (theme: ThemeType) => void;
  variant?: 'navbar' | 'compact' | 'dropdown' | 'segmented';
  className?: string;
}

interface ThemeOption {
  id: ThemeType;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'dark',
    label: 'Dark Mode',
    shortLabel: 'Dark',
    icon: Moon,
    description: 'Deep slate background with high readability'
  },
  {
    id: 'white-blue',
    label: 'Light Mode',
    shortLabel: 'Light',
    icon: Sun,
    description: 'Clean crisp light appearance'
  },
  {
    id: 'system',
    label: 'System Default',
    shortLabel: 'System',
    icon: Laptop,
    description: 'Follows your operating system theme'
  },
  {
    id: 'high-contrast-blue',
    label: 'High Contrast',
    shortLabel: 'Contrast',
    icon: ShieldAlert,
    description: 'Maximum contrast dark blue theme'
  }
];

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
  variant = 'navbar',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeOption = THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[1];
  const ActiveIcon = activeOption.icon;

  if (variant === 'segmented') {
    return (
      <div
        id="theme-selector-segmented"
        className={`inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs ${className}`}
      >
        {THEME_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = currentTheme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectTheme(opt.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={opt.description}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">{opt.shortLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default navbar variant: compact button with quick popover/dropdown
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`} id="theme-selector-container">
      <button
        id="btn-theme-selector"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title={`Theme: ${activeOption.label}. Click to switch theme.`}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 h-8 sm:h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
      >
        <ActiveIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
        <span className="hidden sm:inline font-medium">{activeOption.shortLabel}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div
          id="theme-selector-menu"
          className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-fadeIn"
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Appearance Theme
            </span>
          </div>

          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const isSelected = currentTheme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelectTheme(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <div className="font-semibold leading-tight">{opt.label}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{opt.description}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
