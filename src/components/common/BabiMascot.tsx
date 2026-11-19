import React from 'react';
import { BabiVector, BabiMood, BabiProp } from '../brand/BabiVector';

export type MascotVariant = 
  | 'waving' 
  | 'welcome' 
  | 'number' 
  | 'academic' 
  | 'wallet' 
  | 'ai' 
  | 'security' 
  | 'support' 
  | 'badge';

export type MascotSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface BabiMascotProps {
  variant?: MascotVariant;
  size?: MascotSize;
  number?: string | number;
  className?: string;
  speechText?: string;
  speechBubble?: string; // backwards compatibility alias
}

const sizeInPx: Record<MascotSize, number> = {
  xs: 28,
  sm: 44,
  md: 68,
  lg: 110,
  xl: 160,
  '2xl': 220,
};

const badgeClasses: Record<MascotSize, string> = {
  xs: 'min-w-[14px] h-3.5 text-[8px] -bottom-1 -right-1',
  sm: 'min-w-[18px] h-4.5 text-[10px] -bottom-1 -right-1',
  md: 'min-w-[22px] h-5.5 text-xs -bottom-1 -right-1',
  lg: 'min-w-[26px] h-6.5 text-xs -bottom-1.5 -right-1.5',
  xl: 'min-w-[30px] h-7.5 text-sm -bottom-2 -right-2',
  '2xl': 'min-w-[36px] h-9 text-base -bottom-2 -right-2',
};

const variantConfig: Record<MascotVariant, { mood: BabiMood; prop: BabiProp }> = {
  welcome: { mood: 'happy', prop: 'none' },
  waving: { mood: 'wave', prop: 'none' },
  academic: { mood: 'think', prop: 'book' },
  wallet: { mood: 'cheer', prop: 'coin' },
  security: { mood: 'happy', prop: 'shield' },
  ai: { mood: 'think', prop: 'phone' },
  support: { mood: 'wave', prop: 'none' },
  badge: { mood: 'happy', prop: 'none' },
  number: { mood: 'happy', prop: 'none' },
};

export const BabiMascot: React.FC<BabiMascotProps> = ({
  variant = 'waving',
  size = 'md',
  number,
  className = '',
  speechText,
  speechBubble
}) => {
  const pixelSize = sizeInPx[size] || sizeInPx.md;
  const badgeClass = badgeClasses[size] || badgeClasses.md;
  const displayText = speechText || speechBubble;
  const config = variantConfig[variant] || variantConfig.welcome;

  return (
    <div className={`inline-flex items-center gap-3 select-none shrink-0 ${className}`}>
      <div className="relative inline-flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105 group">
        <BabiVector
          mood={config.mood}
          prop={config.prop}
          size={pixelSize}
          className="select-none pointer-events-none drop-shadow-[0_4px_10px_rgba(15,42,30,0.12)]"
        />

        {/* Number or Star Medallion Badge */}
        {(variant === 'number' || variant === 'badge' || number !== undefined) && (
          <div className={`absolute ${badgeClass} px-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-full border-2 border-white shadow-md flex items-center justify-center`}>
            {number ?? '★'}
          </div>
        )}
      </div>

      {/* Optional Speech Bubble */}
      {displayText && (
        <div className="relative bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-orange-200/80 shadow-md text-left max-w-xs animate-fadeIn">
          <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-b border-orange-200/80 transform rotate-45"></div>
          <span className="text-[12px] font-bold text-slate-900 block leading-snug">{displayText}</span>
        </div>
      )}
    </div>
  );
};
