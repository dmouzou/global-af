import React, { useId } from 'react';

/**
 * Jeu d'illustrations vectorielles GLOBAL-AF : mêmes formes arrondies,
 * même palette (orange wax, vert feuille, vert forêt, soleil) que Babi.
 */
const C = {
  wax: '#FF7700', waxSoft: '#FFE3CC', leaf: '#009E49', leafSoft: '#D9F0E2',
  ink: '#0F2A1E', sun: '#FFC933', sunDeep: '#F2A900', white: '#FFFFFF',
  paper: '#F2F7F3', line: '#CFE3D6', elephant: '#A7B0B8',
};

interface IlluProps { className?: string; title?: string }

const Svg: React.FC<React.PropsWithChildren<IlluProps & { viewBox?: string }>> = ({
  className = '', title, viewBox = '0 0 320 240', children,
}) => (
  <svg viewBox={viewBox} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}
    aria-label={title} className={className} fill="none">
    {title && <title>{title}</title>}
    {children}
  </svg>
);

/** Missions : téléphone avec liste de tâches validées. */
export const IlluMissions: React.FC<IlluProps> = (p) => (
  <Svg {...p}>
    <circle cx="160" cy="124" r="98" fill={C.waxSoft} />
    <circle cx="258" cy="62" r="16" fill={C.sun} opacity="0.9" />
    <rect x="102" y="26" width="116" height="196" rx="20" fill={C.ink} />
    <rect x="109" y="38" width="102" height="172" rx="12" fill={C.white} />
    <rect x="130" y="30" width="60" height="5" rx="2.5" fill="#2A4A3A" />
    {[0, 1, 2].map(i => (
      <g key={i} transform={`translate(0 ${i * 46})`}>
        <rect x="117" y="52" width="86" height="38" rx="10" fill={i === 0 ? C.leafSoft : C.paper} />
        <circle cx="134" cy="71" r="10" fill={i === 0 ? C.leaf : C.line} />
        {i === 0 && <path d="M129 71 l4 4 l8 -9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
        <rect x="151" y="62" width="40" height="6" rx="3" fill={i === 0 ? C.leaf : C.line} />
        <rect x="151" y="74" width="26" height="6" rx="3" fill={C.line} />
      </g>
    ))}
    <g className="drift-a">
      <circle cx="238" cy="150" r="24" fill={C.sun} stroke={C.sunDeep} strokeWidth="4" />
      <circle cx="238" cy="150" r="16" stroke="#FFF1BF" strokeWidth="3" />
      <text x="238" y="158" textAnchor="middle" fontSize="20" fontWeight="800" fill="#B26F00" fontFamily="'Bricolage Grotesque Variable', sans-serif">F</text>
    </g>
    <g className="drift-b">
      <rect x="52" y="86" width="64" height="30" rx="15" fill={C.leaf} />
      <path d="M68 101 l6 6 l12 -13" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="92" y="97" width="16" height="6" rx="3" fill="#fff" opacity="0.7" />
    </g>
  </Svg>
);

/** Académie : livre ouvert, toque, carte vidéo. */
export const IlluAcademy: React.FC<IlluProps> = (p) => (
  <Svg {...p}>
    <circle cx="160" cy="130" r="94" fill={C.leafSoft} />
    <path d="M70 150 L158 168 L158 214 L70 196Z" fill={C.leaf} />
    <path d="M250 150 L162 168 L162 214 L250 196Z" fill={C.wax} />
    <path d="M80 160 L148 174 M80 172 L148 186 M80 184 L148 198" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
    <path d="M240 160 L172 174 M240 172 L172 186 M240 184 L172 198" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
    <g className="drift-a">
      <path d="M160 52 L222 78 L160 104 L98 78Z" fill={C.ink} />
      <path d="M126 92 V116 C126 126 194 126 194 116 V92 L160 106Z" fill="#1B3A2B" />
      <path d="M216 82 V112" stroke={C.sun} strokeWidth="4" strokeLinecap="round" />
      <circle cx="216" cy="116" r="6" fill={C.sun} />
    </g>
    <g className="drift-b">
      <rect x="40" y="62" width="62" height="44" rx="10" fill="#fff" stroke={C.line} strokeWidth="3" />
      <circle cx="71" cy="84" r="13" fill={C.wax} />
      <path d="M67 77 L80 84 L67 91Z" fill="#fff" />
    </g>
    <path d="M262 62 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4Z" fill={C.sun} />
  </Svg>
);

/** Wallet : portefeuille, téléphone Mobile Money, flèches entrée/sortie. */
export const IlluWallet: React.FC<IlluProps> = (p) => (
  <Svg {...p}>
    <circle cx="160" cy="122" r="96" fill={C.waxSoft} />
    <rect x="62" y="82" width="178" height="116" rx="22" fill={C.wax} />
    <rect x="62" y="82" width="178" height="30" rx="15" fill="#E56A00" />
    <rect x="186" y="124" width="68" height="44" rx="14" fill={C.ink} />
    <circle cx="206" cy="146" r="8" fill={C.sun} />
    <rect x="78" y="128" width="62" height="8" rx="4" fill="#fff" opacity="0.8" />
    <rect x="78" y="146" width="40" height="8" rx="4" fill="#fff" opacity="0.5" />
    <g className="drift-a">
      <rect x="226" y="30" width="44" height="76" rx="9" fill={C.ink} />
      <rect x="231" y="38" width="34" height="58" rx="5" fill="#EAF6EE" />
      <circle cx="248" cy="58" r="10" fill={C.leaf} />
      <path d="M243 58 l4 4 l8 -9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="238" y="76" width="20" height="5" rx="2.5" fill={C.line} />
    </g>
    <g className="drift-b">
      <circle cx="80" cy="60" r="20" fill={C.sun} stroke={C.sunDeep} strokeWidth="4" />
      <text x="80" y="67" textAnchor="middle" fontSize="18" fontWeight="800" fill="#B26F00" fontFamily="'Bricolage Grotesque Variable', sans-serif">F</text>
    </g>
    <path d="M110 214 H210" stroke={C.leaf} strokeWidth="5" strokeLinecap="round" />
    <path d="M198 204 l12 10 l-12 10" stroke={C.leaf} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/** Affiliation : arbre à deux niveaux seulement. */
export const IlluAffiliation: React.FC<IlluProps> = (p) => (
  <Svg {...p}>
    <circle cx="160" cy="124" r="96" fill={C.leafSoft} />
    <path d="M160 70 L100 130 M160 70 L220 130 M100 130 L70 186 M100 130 L130 186 M220 130 L190 186 M220 130 L250 186"
      stroke={C.leaf} strokeWidth="4" strokeLinecap="round" strokeDasharray="2 9" />
    <circle cx="160" cy="58" r="26" fill={C.wax} />
    <circle cx="160" cy="52" r="8" fill="#fff" />
    <path d="M146 74 q14 -16 28 0" fill="#fff" />
    {[100, 220].map(x => (
      <g key={x}>
        <circle cx={x} cy="130" r="21" fill={C.leaf} />
        <circle cx={x} cy="125" r="6.5" fill="#fff" />
        <path d="M89 141 q11 -12 22 0" fill="#fff" />
      </g>
    ))}
    {[70, 130, 190, 250].map(x => (
      <g key={x}>
        <circle cx={x} cy="190" r="16" fill="#fff" stroke={C.leaf} strokeWidth="3" />
        <circle cx={x} cy="186" r="5" fill={C.leaf} />
        <path d={`M${x - 9} 198 q9 -9 18 0`} fill={C.leaf} />
      </g>
    ))}
    <g className="drift-a">
      <rect x="214" y="40" width="86" height="30" rx="15" fill={C.sun} />
      <text x="257" y="60" textAnchor="middle" fontSize="14" fontWeight="800" fill={C.ink} fontFamily="'Bricolage Grotesque Variable', sans-serif">2 niveaux</text>
    </g>
  </Svg>
);

/** Outils IA : bulle de discussion, étincelles, puce IA. */
export const IlluTools: React.FC<IlluProps> = (p) => (
  <Svg {...p}>
    <circle cx="160" cy="124" r="96" fill="#E7F1FF" />
    <path d="M70 52 H220 a18 18 0 0 1 18 18 V138 a18 18 0 0 1 -18 18 H128 L94 184 V156 H70 a18 18 0 0 1 -18 -18 V70 a18 18 0 0 1 18 -18Z" fill="#fff" stroke={C.line} strokeWidth="3" />
    <rect x="74" y="76" width="110" height="9" rx="4.5" fill={C.line} />
    <rect x="74" y="96" width="150" height="9" rx="4.5" fill={C.line} />
    <rect x="74" y="116" width="86" height="9" rx="4.5" fill={C.wax} opacity="0.85" />
    <g className="drift-a">
      <rect x="196" y="150" width="76" height="52" rx="14" fill={C.ink} />
      <text x="234" y="184" textAnchor="middle" fontSize="24" fontWeight="800" fill={C.sun} fontFamily="'Bricolage Grotesque Variable', sans-serif">IA</text>
      <path d="M214 150 v-10 M234 150 v-10 M254 150 v-10 M214 202 v10 M234 202 v10 M254 202 v10" stroke={C.ink} strokeWidth="4" strokeLinecap="round" />
    </g>
    <g className="drift-b">
      <path d="M62 190 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6 l14 -6Z" fill={C.sun} />
      <path d="M262 76 l4 9 l9 4 l-9 4 l-4 9 l-4 -9 l-9 -4 l9 -4Z" fill={C.wax} />
    </g>
  </Svg>
);

/** Sécurité & éthique : bouclier, calendrier de rétractation, 18+. */
export const IlluShield: React.FC<IlluProps> = (p) => (
  <Svg {...p}>
    <circle cx="160" cy="124" r="96" fill={C.leafSoft} />
    <path d="M160 34 L228 60 V118 C228 160 198 188 160 204 C122 188 92 160 92 118 V60Z" fill={C.leaf} />
    <path d="M160 48 L214 69 V118 C214 150 190 174 160 188 C130 174 106 150 106 118 V69Z" fill="#12B35A" />
    <path d="M132 118 l20 20 l38 -42" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <g className="drift-a">
      <circle cx="248" cy="62" r="24" fill={C.wax} />
      <text x="248" y="70" textAnchor="middle" fontSize="20" fontWeight="800" fill="#fff" fontFamily="'Bricolage Grotesque Variable', sans-serif">18+</text>
    </g>
    <g className="drift-b">
      <rect x="40" y="130" width="60" height="62" rx="12" fill="#fff" stroke={C.line} strokeWidth="3" />
      <rect x="40" y="130" width="60" height="18" rx="9" fill={C.sun} />
      <text x="70" y="176" textAnchor="middle" fontSize="26" fontWeight="800" fill={C.ink} fontFamily="'Bricolage Grotesque Variable', sans-serif">7 j</text>
    </g>
  </Svg>
);

/** Partenaires : vitrine, mégaphone, barres de résultats. */
export const IlluPartners: React.FC<IlluProps> = (p) => (
  <Svg {...p}>
    <circle cx="160" cy="124" r="96" fill="#FFF1D6" />
    <path d="M64 96 H236 L224 62 H76Z" fill={C.wax} />
    {[0, 1, 2, 3, 4].map(i => (<rect key={i} x={76 + i * 34} y="62" width="17" height="34" fill={i % 2 ? C.white : '#E56A00'} opacity={i % 2 ? 0.9 : 1} />))}
    <rect x="72" y="96" width="156" height="104" fill="#fff" stroke={C.line} strokeWidth="3" />
    <rect x="132" y="138" width="36" height="62" rx="4" fill={C.leaf} />
    <rect x="86" y="112" width="34" height="32" rx="6" fill={C.leafSoft} />
    <rect x="180" y="112" width="34" height="32" rx="6" fill={C.leafSoft} />
    <g className="drift-a">
      <rect x="236" y="120" width="12" height="40" rx="3" fill={C.leaf} />
      <rect x="252" y="100" width="12" height="60" rx="3" fill={C.wax} />
      <rect x="268" y="80" width="12" height="80" rx="3" fill={C.ink} />
    </g>
    <g className="drift-b">
      <path d="M44 56 l36 -16 v44 l-36 -12Z" fill={C.sun} />
      <rect x="34" y="56" width="14" height="16" rx="3" fill={C.sunDeep} />
    </g>
  </Svg>
);

/** Motif wax (pagne) : aplat décoratif pour fonds de section. */
export const WaxPattern: React.FC<{ className?: string; tone?: 'light' | 'dark' | 'orange'; opacity?: number }> = ({
  className = '', tone = 'light', opacity = 1,
}) => {
  const id = `wax-${useId().replace(/:/g, '')}`;
  const stroke = tone === 'dark' ? '#FFFFFF' : tone === 'orange' ? '#FFFFFF' : '#009E49';
  const fill = tone === 'dark' ? '#FF7700' : tone === 'orange' ? '#FFFFFF' : '#FF7700';
  const base = tone === 'dark' ? 0.07 : tone === 'orange' ? 0.09 : 0.07;
  return (
    <svg className={className} width="100%" height="100%" aria-hidden="true" style={{ opacity }}>
      <defs>
        <pattern id={id} width="72" height="72" patternUnits="userSpaceOnUse">
          <circle cx="36" cy="36" r="22" stroke={stroke} strokeWidth="2.5" fill="none" opacity={base * 2.2} />
          <circle cx="36" cy="36" r="12" stroke={stroke} strokeWidth="2.5" fill="none" opacity={base * 2.2} />
          <circle cx="36" cy="36" r="4.5" fill={fill} opacity={base * 3} />
          <path d="M0 0 q9 9 0 18 M72 0 q-9 9 0 18 M0 72 q9 -9 0 -18 M72 72 q-9 -9 0 -18" stroke={stroke} strokeWidth="2.5" fill="none" opacity={base * 2} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
};

/** Ruban du foulard de Babi. */
export const ScarfRibbon: React.FC<{ className?: string; thin?: boolean }> = ({ className = '', thin }) => (
  <div className={`scarf-ribbon ${thin ? 'scarf-ribbon-thin' : ''} ${className}`} aria-hidden="true" />
);
