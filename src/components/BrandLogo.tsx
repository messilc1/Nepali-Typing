import React from 'react';

interface BrandLogoProps {
  size?: number;
  className?: string;
  variant?: 'default' | 'monochrome' | 'white' | 'dark';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 40,
  className = '',
  variant = 'default',
  showText = false
}) => {
  // Color combinations based on variant
  const isWhite = variant === 'white';
  const isMono = variant === 'monochrome';
  const isDark = variant === 'dark';

  const primaryColor = isWhite ? '#FFFFFF' : isDark ? '#0F172A' : '#1E40AF';
  const accentColor = isWhite ? '#E2E8F0' : isDark ? '#334155' : '#2563EB';
  const iconFill = isWhite ? '#1E40AF' : '#FFFFFF';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105"
      >
        {/* Keycap Base Container */}
        <rect
          x="2"
          y="2"
          width="44"
          height="44"
          rx="12"
          fill={isMono ? '#0F172A' : primaryColor}
        />
        
        {/* Subtle Inner Bevel / Shadow for Precision Depth */}
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="10"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Stylized Devanagari "ने" + Keyboard Key Geometry */}
        {/* 1. Shirorekha (Top Horizontal Bar) */}
        <path
          d="M 12 15 H 36"
          stroke={iconFill}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 2. Devanagari "ने" Loop & Connector */}
        <path
          d="M 28 15 V 35"
          stroke={iconFill}
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Loop for 'ने' */}
        <path
          d="M 28 24 H 20 C 17.2 24 15 26.2 15 29 C 15 31.8 17.2 34 20 34 C 22.8 34 25 31.8 25 29 V 24"
          stroke={iconFill}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Speed / Cursor Accent Bar */}
        <rect
          x="33"
          y="20"
          width="3"
          height="12"
          rx="1.5"
          fill={isWhite || isMono ? iconFill : '#60A5FA'}
        />
      </svg>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className={`font-black text-lg sm:text-xl tracking-tight ${
            isWhite ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}>
            Nepali Typing Pro
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
            isWhite ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
          }`}>
            Unicode Standard
          </span>
        </div>
      )}
    </div>
  );
};
