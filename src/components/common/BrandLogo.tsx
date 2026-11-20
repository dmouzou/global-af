import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'icon' | 'white' | 'admin';
}

/** Marque « AH » : carré orange, bande verte et filet blanc (tricolore), lettres tracées. */
export const AhMark: React.FC<{ className?: string; title?: string }> = ({ className = '', title }) => (
  <svg viewBox="0 0 100 100" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
    {title && <title>{title}</title>}
    <defs><clipPath id="ah-clip"><rect width="100" height="100" rx="24" /></clipPath></defs>
    <g clipPath="url(#ah-clip)">
      <rect width="100" height="100" fill="#FF7700" />
      <rect y="77" width="100" height="23" fill="#009E49" />
      <rect y="74" width="100" height="3.5" fill="#FFFFFF" />
    </g>
    <g fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 62 L31 26 L45 62 M23 49 H39" />
      <path d="M58 26 V62 M80 26 V62 M58 44 H80" />
    </g>
  </svg>
);

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'full'
}) => {
  const sizeMap = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', sub: 'text-[8px]' },
    md: { icon: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-[10px]' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', sub: 'text-xs' }
  }[size];

  if (variant === 'icon') {
    return <AhMark title="AH GLOBAL" className={`${sizeMap.icon} shrink-0 ${className}`} />;
  }

  const onDark = variant === 'white' || variant === 'admin';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <AhMark title="AH GLOBAL" className={`${sizeMap.icon} shrink-0 drop-shadow-sm`} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-display font-extrabold tracking-tight leading-none ${sizeMap.text}`}>
            <span className="text-wax">AH</span>
            <span className={`ml-1.5 ${onDark ? 'text-white' : 'text-ink'}`}>GLOBAL</span>
          </span>
          <span className="flex h-2.5 w-4 shrink-0 overflow-hidden rounded-[2px] ring-1 ring-ink/15" title="Côte d'Ivoire" aria-hidden="true">
            <i className="h-full w-1/3 bg-wax" /><i className="h-full w-1/3 bg-white" /><i className="h-full w-1/3 bg-leaf" />
          </span>
        </div>
        {variant === 'admin' ? (
          <div className="mt-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-sun">
            <span>Console</span><span className="text-white/30">•</span><span>Annonceurs & B2B</span>
          </div>
        ) : showSubtitle && (
          <div className={`mt-1 flex items-center gap-1 font-bold uppercase tracking-wider ${sizeMap.sub} ${onDark ? 'text-white/60' : 'text-ink/60'}`}>
            <span>Apprendre</span><span className="text-wax">•</span><span>Agir</span><span className="text-leaf">•</span><span>Gagner</span>
          </div>
        )}
      </div>
    </div>
  );
};
