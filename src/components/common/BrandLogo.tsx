import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'icon' | 'white' | 'admin';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'full'
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7 sm:w-8 sm:h-8', text: 'text-lg', sub: 'text-[8px]', height: 'h-8' },
    md: { icon: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-xl', sub: 'text-[9px]', height: 'h-10' },
    lg: { icon: 'w-11 h-11 sm:w-12 sm:h-12', text: 'text-2xl', sub: 'text-[10px]', height: 'h-12' },
    xl: { icon: 'w-14 h-14 sm:w-16 sm:h-16', text: 'text-3xl', sub: 'text-xs', height: 'h-16' }
  }[size];

  // Pure icon variant
  if (variant === 'icon') {
    return (
      <div className={`relative ${sizeMap.icon} shrink-0 transition-transform hover:scale-105 ${className}`}>
        <img 
          src="/brand-cube.png" 
          alt="GLOBAL-AF Logo" 
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>
    );
  }

  // Dedicated Annonceur & Admin Portal Variant (for Image 1)
  if (variant === 'admin') {
    return (
      <div className={`inline-flex flex-col items-center select-none ${className}`}>
        <div className="flex items-center gap-3">
          {/* 3D Cube with subtle ambient glow */}
          <div className="relative w-12 h-12 shrink-0 drop-shadow-[0_4px_12px_rgba(255,119,0,0.25)]">
            <img 
              src="/brand-cube.png" 
              alt="GLOBAL-AF" 
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col text-left">
            {/* 100% Uniform typography across GLOBAL, -, A, and F */}
            <div 
              className="flex items-center font-black text-2xl tracking-tight text-white leading-none"
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              <span className="text-white">GLOBAL</span>
              <span className="text-slate-400 font-bold mx-0.5">-</span>
              <span className="text-[#FF7700]">A</span>
              <span className="text-[#009E49]">F</span>
            </div>

            <div 
              className="flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase text-amber-400 mt-1"
              style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
            >
              <span>CONSOLE</span>
              <span className="text-slate-600">•</span>
              <span>ANNONCEURS & B2B</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer select-none ${className}`}>
      {/* 3D Isometric Cube Icon (Clean alpha, no halo) */}
      <div className={`relative ${sizeMap.icon} shrink-0 transition-transform group-hover:scale-105`}>
        <img 
          src="/brand-cube.png" 
          alt="GLOBAL-AF" 
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>

      <div className="flex flex-col">
        {/* 100% Uniform font family and weight across GLOBAL-AF */}
        <div className="flex items-center gap-1.5 leading-none">
          <div 
            className={`font-black tracking-tight leading-none ${sizeMap.text} flex items-center`}
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            <span className={isWhite ? 'text-white' : 'text-slate-900'}>GLOBAL</span>
            <span className="text-slate-400 font-bold mx-0.5">-</span>
            <span className="text-[#FF7700]">A</span>
            <span className="text-[#009E49]">F</span>
          </div>
          
          {/* Côte d'Ivoire Tricolore Pill */}
          <div className="flex items-center h-2.5 w-4 rounded-xs overflow-hidden border border-slate-300 shadow-2xs shrink-0" title="Côte d'Ivoire">
            <span className="w-1/3 h-full bg-[#FF7700]"></span>
            <span className="w-1/3 h-full bg-white"></span>
            <span className="w-1/3 h-full bg-[#009E49]"></span>
          </div>
        </div>

        {showSubtitle && (
          <div 
            className={`flex items-center gap-1 ${sizeMap.sub} font-bold tracking-wider uppercase mt-1 ${isWhite ? 'text-slate-400' : 'text-slate-600'}`}
            style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            <span>APPRENDRE</span>
            <span className="text-[#FF7700]">•</span>
            <span>AGIR</span>
            <span className="text-[#009E49]">•</span>
            <span>GAGNER</span>
          </div>
        )}
      </div>
    </div>
  );
};
