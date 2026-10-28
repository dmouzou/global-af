import React from 'react';
import mascotWelcome from '../../assets/mascot/babi-clean-welcome.png';
import mascotWaving from '../../assets/mascot/babi-clean-waving.png';
import mascotAcademic from '../../assets/mascot/babi-clean-academic.png';
import mascotWallet from '../../assets/mascot/babi-clean-wallet.png';
import mascotSecurity from '../../assets/mascot/babi-clean-security.png';

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

const sizeClasses: Record<MascotSize, { wrapper: string; badge: string; text: string }> = {
  xs: { wrapper: 'w-8 h-8', badge: 'min-w-[16px] h-4 text-[9px]', text: 'text-[9px]' },
  sm: { wrapper: 'w-12 h-12', badge: 'min-w-[18px] h-4.5 text-[10px]', text: 'text-[11px]' },
  md: { wrapper: 'w-20 h-20', badge: 'min-w-[22px] h-5.5 text-xs', text: 'text-xs' },
  lg: { wrapper: 'w-32 h-32', badge: 'min-w-[26px] h-6.5 text-xs', text: 'text-sm' },
  xl: { wrapper: 'w-44 h-44', badge: 'min-w-[30px] h-7.5 text-sm', text: 'text-base' },
  '2xl': { wrapper: 'w-60 h-60', badge: 'min-w-[36px] h-9 text-base', text: 'text-lg' },
};

const variantImages: Record<MascotVariant, string> = {
  welcome: mascotWelcome,
  waving: mascotWaving,
  academic: mascotAcademic,
  wallet: mascotWallet,
  security: mascotSecurity,
  ai: mascotWelcome,
  support: mascotWelcome,
  badge: mascotWelcome,
  number: mascotWelcome,
};

export const BabiMascot: React.FC<BabiMascotProps> = ({
  variant = 'waving',
  size = 'md',
  number,
  className = '',
  speechText,
  speechBubble
}) => {
  const currentSize = sizeClasses[size] || sizeClasses.md;
  const displayText = speechText || speechBubble;
  const imageSrc = variantImages[variant] || mascotWelcome;

  return (
    <div className={`inline-flex items-center gap-3 select-none shrink-0 ${className}`}>
      <div className={`relative ${currentSize.wrapper} shrink-0 drop-shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-105 group`}>
        {/* 3D Elephant Mascot Image */}
        <img
          src={imageSrc}
          alt="Babi l'Éléphant Mascotte 3D"
          className="w-full h-full object-contain select-none pointer-events-none"
          loading="eager"
        />

        {/* Number or Star Medallion Badge */}
        {(variant === 'number' || variant === 'badge' || number !== undefined) && (
          <div className={`absolute -bottom-1 -right-1 ${currentSize.badge} px-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce-short`}>
            {number ?? '★'}
          </div>
        )}
      </div>

      {/* Optional Speech Bubble */}
      {displayText && (
        <div className="relative bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-orange-200/80 shadow-lg text-left max-w-xs animate-fadeIn">
          <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-b border-orange-200/80 transform rotate-45"></div>
          <span className="text-[12px] font-bold text-slate-900 block leading-snug">{displayText}</span>
        </div>
      )}
    </div>
  );
};
