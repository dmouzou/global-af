import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'badge' | 'icon' | 'full' | 'pill' | 'card';
  showLabel?: boolean;
}

/**
 * Wave Logo with real image asset
 */
export const WaveLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showLabel = true
}) => {
  const sizeMap = {
    xs: { h: 'h-6', img: 'w-6 h-6', text: 'text-xs' },
    sm: { h: 'h-8', img: 'w-8 h-8', text: 'text-xs' },
    md: { h: 'h-10', img: 'w-10 h-10', text: 'text-sm' },
    lg: { h: 'h-12', img: 'w-12 h-12', text: 'text-base' },
    xl: { h: 'h-14', img: 'w-14 h-14', text: 'text-lg' },
    '2xl': { h: 'h-20', img: 'w-20 h-20', text: 'text-xl' }
  }[size];

  const ImgEl = (
    <img
      src="/logos/wave.svg"
      alt="Logo Wave Côte d'Ivoire"
      className={`${sizeMap.img} object-contain rounded-xl shadow-2xs shrink-0 transition-transform group-hover:scale-105`}
    />
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center group ${className}`}>{ImgEl}</div>;
  }

  if (variant === 'card') {
    return (
      <div className={`p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#00C2E0] transition-all flex items-center gap-3 group ${className}`}>
        {ImgEl}
        <div>
          <div className="font-bold text-slate-900 text-xs sm:text-sm">Wave Côte d'Ivoire</div>
          <div className="text-[11px] text-slate-500">1% transfert & retrait immédiat</div>
        </div>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00C2E0]/10 border border-[#00C2E0]/30 text-slate-800 ${sizeMap.h} ${className}`}>
        {ImgEl}
        <div className="flex items-center gap-1">
          <span className="font-black text-[#003B73] text-xs">Wave</span>
          <span className="text-[10px] font-bold text-[#00C2E0] uppercase">CI</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-[#00C2E0] transition-all group ${sizeMap.h} ${className}`}>
      {ImgEl}
      {showLabel && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-tight text-[#003B73]">Wave</span>
            <span className="text-[9px] font-black uppercase px-1 py-0.5 rounded bg-[#00C2E0]/20 text-[#003B73]">CI</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5">1% frais de retrait</span>
        </div>
      )}
    </div>
  );
};

/**
 * Orange Money Logo with real image asset
 */
export const OrangeMoneyLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showLabel = true
}) => {
  const sizeMap = {
    xs: { h: 'h-6', img: 'w-6 h-6', text: 'text-xs' },
    sm: { h: 'h-8', img: 'w-8 h-8', text: 'text-xs' },
    md: { h: 'h-10', img: 'w-10 h-10', text: 'text-sm' },
    lg: { h: 'h-12', img: 'w-12 h-12', text: 'text-base' },
    xl: { h: 'h-14', img: 'w-14 h-14', text: 'text-lg' },
    '2xl': { h: 'h-20', img: 'w-20 h-20', text: 'text-xl' }
  }[size];

  const ImgEl = (
    <img
      src="/logos/orange-money.svg"
      alt="Logo Orange Money Côte d'Ivoire"
      className={`${sizeMap.img} object-contain rounded-xl shadow-2xs shrink-0 transition-transform group-hover:scale-105`}
    />
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center group ${className}`}>{ImgEl}</div>;
  }

  if (variant === 'card') {
    return (
      <div className={`p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#FF7900] transition-all flex items-center gap-3 group ${className}`}>
        {ImgEl}
        <div>
          <div className="font-bold text-slate-900 text-xs sm:text-sm">Orange Money</div>
          <div className="text-[11px] text-slate-500">Validation instantanée par USSD/App</div>
        </div>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF7900]/10 border border-[#FF7900]/30 text-slate-800 ${sizeMap.h} ${className}`}>
        {ImgEl}
        <div className="flex items-center gap-1">
          <span className="font-black text-[#D96000] text-xs">Orange</span>
          <span className="text-[10px] font-black uppercase text-slate-900 bg-[#FF7900]/20 px-1 rounded">Money</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-[#FF7900] transition-all group ${sizeMap.h} ${className}`}>
      {ImgEl}
      {showLabel && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-tight text-[#FF7900]">Orange</span>
            <span className="font-bold text-xs uppercase text-slate-900">Money</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5">Orange CI · Instatané</span>
        </div>
      )}
    </div>
  );
};

/**
 * MTN MoMo Logo with real image asset
 */
export const MtnMoMoLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showLabel = true
}) => {
  const sizeMap = {
    xs: { h: 'h-6', img: 'w-6 h-6', text: 'text-xs' },
    sm: { h: 'h-8', img: 'w-8 h-8', text: 'text-xs' },
    md: { h: 'h-10', img: 'w-10 h-10', text: 'text-sm' },
    lg: { h: 'h-12', img: 'w-12 h-12', text: 'text-base' },
    xl: { h: 'h-14', img: 'w-14 h-14', text: 'text-lg' },
    '2xl': { h: 'h-20', img: 'w-20 h-20', text: 'text-xl' }
  }[size];

  const ImgEl = (
    <img
      src="/logos/mtn-momo.png"
      alt="Logo MTN MoMo Côte d'Ivoire"
      className={`${sizeMap.img} object-contain rounded-xl shadow-2xs shrink-0 transition-transform group-hover:scale-105`}
    />
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center group ${className}`}>{ImgEl}</div>;
  }

  if (variant === 'card') {
    return (
      <div className={`p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#FFCC00] transition-all flex items-center gap-3 group ${className}`}>
        {ImgEl}
        <div>
          <div className="font-bold text-slate-900 text-xs sm:text-sm">MTN MoMo</div>
          <div className="text-[11px] text-slate-500">Vérification sécurisée MTN CI</div>
        </div>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFCC00]/20 border border-[#FFCC00]/50 text-slate-800 ${sizeMap.h} ${className}`}>
        {ImgEl}
        <div className="flex items-center gap-1">
          <span className="font-black text-[#002B49] text-xs">MTN</span>
          <span className="text-[10px] font-black uppercase text-[#806000]">MoMo</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-[#FFCC00] transition-all group ${sizeMap.h} ${className}`}>
      {ImgEl}
      {showLabel && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-tight text-[#002B49]">MTN</span>
            <span className="font-black text-xs text-[#004F71] bg-[#FFCC00] px-1 py-0.5 rounded">MoMo</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5">Côte d'Ivoire</span>
        </div>
      )}
    </div>
  );
};

/**
 * Moov Africa Logo with real image asset
 */
export const MoovMoneyLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showLabel = true
}) => {
  const sizeMap = {
    xs: { h: 'h-6', img: 'w-6 h-6', text: 'text-xs' },
    sm: { h: 'h-8', img: 'w-8 h-8', text: 'text-xs' },
    md: { h: 'h-10', img: 'w-10 h-10', text: 'text-sm' },
    lg: { h: 'h-12', img: 'w-12 h-12', text: 'text-base' },
    xl: { h: 'h-14', img: 'w-14 h-14', text: 'text-lg' },
    '2xl': { h: 'h-20', img: 'w-20 h-20', text: 'text-xl' }
  }[size];

  const ImgEl = (
    <img
      src="/logos/moov-africa.svg"
      alt="Logo Moov Africa Côte d'Ivoire"
      className={`${sizeMap.img} object-contain rounded-xl shadow-2xs shrink-0 transition-transform group-hover:scale-105`}
    />
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center group ${className}`}>{ImgEl}</div>;
  }

  if (variant === 'card') {
    return (
      <div className={`p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0058A8] transition-all flex items-center gap-3 group ${className}`}>
        {ImgEl}
        <div>
          <div className="font-bold text-slate-900 text-xs sm:text-sm">Moov Africa</div>
          <div className="text-[11px] text-slate-500">Moov Money Côte d'Ivoire</div>
        </div>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0058A8]/10 border border-[#0058A8]/30 text-slate-800 ${sizeMap.h} ${className}`}>
        {ImgEl}
        <div className="flex items-center gap-1">
          <span className="font-black text-[#0058A8] text-xs">Moov</span>
          <span className="text-[10px] font-bold text-[#FF7000] uppercase">Money</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-[#0058A8] transition-all group ${sizeMap.h} ${className}`}>
      {ImgEl}
      {showLabel && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-sm tracking-tight text-[#0058A8]">Moov</span>
            <span className="font-bold text-xs uppercase text-[#FF7000]">Money</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5">Moov Africa CI</span>
        </div>
      )}
    </div>
  );
};

export const OperatorLogo: React.FC<{
  operator: 'Wave' | 'Orange Money' | 'MTN MoMo' | 'Moov Money' | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'badge' | 'icon' | 'full' | 'pill' | 'card';
  showLabel?: boolean;
  className?: string;
}> = ({ operator, size = 'md', variant = 'full', showLabel = true, className = '' }) => {
  const norm = (operator || '').toLowerCase();

  if (norm.includes('wave')) {
    return <WaveLogo size={size} variant={variant} showLabel={showLabel} className={className} />;
  }
  if (norm.includes('orange')) {
    return <OrangeMoneyLogo size={size} variant={variant} showLabel={showLabel} className={className} />;
  }
  if (norm.includes('mtn') || norm.includes('momo')) {
    return <MtnMoMoLogo size={size} variant={variant} showLabel={showLabel} className={className} />;
  }
  if (norm.includes('moov')) {
    return <MoovMoneyLogo size={size} variant={variant} showLabel={showLabel} className={className} />;
  }

  return <OrangeMoneyLogo size={size} variant={variant} showLabel={showLabel} className={className} />;
};
