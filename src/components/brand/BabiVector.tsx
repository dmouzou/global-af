import React, { useId } from 'react';

export type BabiMood = 'happy' | 'wave' | 'cheer' | 'think' | 'wow';
export type BabiProp = 'none' | 'coin' | 'book' | 'phone' | 'shield';

interface BabiVectorProps {
  mood?: BabiMood;
  prop?: BabiProp;
  /** Largeur en pixels (la hauteur suit). */
  size?: number;
  /** Clignement, oreilles, trompe, respiration. */
  animated?: boolean;
  className?: string;
  title?: string;
}

const EAR_PINK = '#F2A9A3';

/**
 * Babi en vectoriel : petites places, application, états vides.
 * Les parties mobiles (paupières, oreilles, trompe, bras) sont animées en CSS.
 */
export const BabiVector: React.FC<BabiVectorProps> = ({
  mood = 'happy', prop = 'none', size = 140, animated = true, className = '', title = "Babi l'éléphant",
}) => {
  const uid = useId().replace(/:/g, '');
  const g = (n: string) => `${n}-${uid}`;
  const holding = prop !== 'none';
  const armLUp = mood === 'wave' || mood === 'cheer';
  const armRUp = mood === 'cheer';

  const lookX = mood === 'think' ? 4 : 0;
  const lookY = mood === 'think' ? -4 : 0;
  const closedEyes = mood === 'cheer';
  const bigEyes = mood === 'wow';

  return (
    <svg
      viewBox="0 0 300 330"
      width={size}
      height={(size * 330) / 300}
      role="img"
      aria-label={title}
      className={`babi-v mood-${mood} ${animated ? 'is-alive' : ''} ${className}`}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={g('skin')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CDD4DA" />
          <stop offset="1" stopColor="#A2ABB4" />
        </linearGradient>
        <linearGradient id={g('skinSide')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#B7BFC6" />
          <stop offset="1" stopColor="#9AA3AC" />
        </linearGradient>
        <radialGradient id={g('ear')} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#F8C8C2" />
          <stop offset="1" stopColor={EAR_PINK} />
        </radialGradient>
        <pattern id={g('scarf')} patternUnits="userSpaceOnUse" width="22" height="22" patternTransform="rotate(38)">
          <rect width="22" height="22" fill="#FFFFFF" />
          <rect width="9" height="22" fill="#FF7700" />
          <rect x="13" width="9" height="22" fill="#009E49" />
        </pattern>
        <radialGradient id={g('gold')} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#FFE59A" />
          <stop offset="1" stopColor="#F2A900" />
        </radialGradient>
      </defs>

      <ellipse cx="150" cy="320" rx="86" ry="9" fill="#0F2A1E" opacity="0.12" />

      <g className="babi-body">
        {/* jambes */}
        <rect x="98" y="262" width="42" height="54" rx="21" fill={`url(#${g('skinSide')})`} />
        <rect x="160" y="262" width="42" height="54" rx="21" fill={`url(#${g('skinSide')})`} />
        <ellipse cx="108" cy="311" rx="6" ry="4" fill="#F3EEE4" />
        <ellipse cx="119" cy="313" rx="6" ry="4" fill="#F3EEE4" />
        <ellipse cx="181" cy="313" rx="6" ry="4" fill="#F3EEE4" />
        <ellipse cx="192" cy="311" rx="6" ry="4" fill="#F3EEE4" />

        {/* corps */}
        <ellipse cx="150" cy="228" rx="76" ry="70" fill={`url(#${g('skin')})`} />
        <ellipse cx="150" cy="248" rx="46" ry="38" fill="#D8DEE3" opacity="0.55" />

        {/* bras gauche (côté spectateur) */}
        {armLUp ? null : holding ? (
          <path d="M84 212 C 82 236, 100 252, 122 252" stroke="#B3BBC2" strokeWidth="26" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M82 212 C 70 232, 66 250, 70 266" stroke="#B3BBC2" strokeWidth="26" strokeLinecap="round" fill="none" />
        )}

        {/* bras droit */}
        {armRUp ? null : holding ? (
          <path d="M216 212 C 218 236, 200 252, 178 252" stroke="#B3BBC2" strokeWidth="26" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M218 212 C 230 232, 234 250, 230 266" stroke="#B3BBC2" strokeWidth="26" strokeLinecap="round" fill="none" />
        )}

        {/* oreilles */}
        <g className="babi-ear-l">
          <ellipse cx="72" cy="124" rx="50" ry="60" fill={`url(#${g('skinSide')})`} />
          <ellipse cx="76" cy="126" rx="33" ry="43" fill={`url(#${g('ear')})`} />
        </g>
        <g className="babi-ear-r">
          <ellipse cx="228" cy="124" rx="50" ry="60" fill={`url(#${g('skinSide')})`} />
          <ellipse cx="224" cy="126" rx="33" ry="43" fill={`url(#${g('ear')})`} />
        </g>

        {/* bras levés : dessinés devant les oreilles */}
        {armLUp && (
          <g className="babi-arm-wave">
            <path d="M84 208 C 58 190, 52 158, 62 136" stroke="#B3BBC2" strokeWidth="26" strokeLinecap="round" fill="none" />
            <circle cx="62" cy="134" r="15" fill="#BDC5CB" />
            <ellipse cx="56" cy="124" rx="4" ry="5" fill="#F3EEE4" />
            <ellipse cx="66" cy="121" rx="4" ry="5" fill="#F3EEE4" />
            <ellipse cx="74" cy="126" rx="3.5" ry="4.5" fill="#F3EEE4" />
          </g>
        )}
        {armRUp && (
          <g>
            <path d="M216 208 C 242 190, 248 158, 238 136" stroke="#B3BBC2" strokeWidth="26" strokeLinecap="round" fill="none" />
            <circle cx="238" cy="134" r="15" fill="#BDC5CB" />
          </g>
        )}

        {/* tête */}
        <circle cx="150" cy="122" r="70" fill={`url(#${g('skin')})`} />
        <ellipse cx="128" cy="76" rx="24" ry="11" fill="#fff" opacity="0.3" transform="rotate(-24 128 76)" />

        {/* sourcils (réflexion) */}
        {mood === 'think' && (
          <path d="M104 92 Q118 84 134 92" stroke="#7D8790" strokeWidth="4" strokeLinecap="round" fill="none" />
        )}

        {/* yeux */}
        {closedEyes ? (
          <>
            <path d="M108 118 Q122 102 136 118" stroke="#3B2417" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M164 118 Q178 102 192 118" stroke="#3B2417" strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <ellipse cx="122" cy="118" rx={bigEyes ? 16 : 14} ry={bigEyes ? 19 : 16} fill="#fff" />
            <ellipse cx="178" cy="118" rx={bigEyes ? 16 : 14} ry={bigEyes ? 19 : 16} fill="#fff" />
            <ellipse cx={122 + lookX} cy={120 + lookY} rx="9" ry="11" fill="#3B2417" />
            <ellipse cx={178 + lookX} cy={120 + lookY} rx="9" ry="11" fill="#3B2417" />
            <circle cx={125 + lookX} cy={115 + lookY} r="3.4" fill="#fff" />
            <circle cx={181 + lookX} cy={115 + lookY} r="3.4" fill="#fff" />
            <ellipse className="babi-lid babi-lid-l" cx="122" cy="102" rx="15" ry="16" fill="#BEC5CC" />
            <ellipse className="babi-lid babi-lid-r" cx="178" cy="102" rx="15" ry="16" fill="#BEC5CC" />
          </>
        )}

        {/* joues */}
        <circle cx="100" cy="148" r="10" fill="#F4A9A0" opacity="0.55" />
        <circle cx="200" cy="148" r="10" fill="#F4A9A0" opacity="0.55" />

        {/* bouche (la trompe passe devant) */}
        {mood === 'cheer' || mood === 'wow' ? (
          <path d="M126 164 Q150 196 174 164 Q150 172 126 164Z" fill="#8A2B2B" />
        ) : mood === 'think' ? (
          <path d="M134 172 Q150 176 166 170" stroke="#6C4A3A" strokeWidth="4" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M122 164 Q150 192 178 164" stroke="#6C4A3A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        )}

        {/* défenses */}
        <path d="M128 156 Q118 176 126 184 Q134 176 136 160Z" fill="#FFF4DC" />
        <path d="M172 156 Q182 176 174 184 Q166 176 164 160Z" fill="#FFF4DC" />

        {/* foulard */}
        <path d="M94 190 Q150 208 206 190 L150 262Z" fill={`url(#${g('scarf')})`} stroke="#FF7700" strokeWidth="3" strokeLinejoin="round" />
        <path d="M144 262 q-6 12 0 18 q6 -6 0 -18Z" fill="#009E49" />
        <path d="M156 262 q-6 12 0 18 q6 -6 0 -18Z" fill="#FF7700" />

        {/* trompe */}
        <g className="babi-trunk">
          <path
            d="M138 140 C 134 170, 134 196, 144 214 C 150 224, 164 222, 166 210 C 167 202, 160 200, 158 206 C 156 196, 164 170, 162 140Z"
            fill={`url(#${g('skinSide')})`}
            stroke="#8D969F"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M141 160 q9 4 18 0 M140 176 q10 4 20 0 M141 192 q9 4 17 0" stroke="#8D969F" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.7" />
        </g>

        {/* accessoires tenus */}
        {prop === 'coin' && (
          <g>
            <circle cx="150" cy="250" r="26" fill={`url(#${g('gold')})`} stroke="#D68A00" strokeWidth="3" />
            <circle cx="150" cy="250" r="18" fill="none" stroke="#FFF1BF" strokeWidth="2.5" />
            <text x="150" y="258" textAnchor="middle" fontSize="22" fontWeight="800" fill="#B26F00" fontFamily="'Bricolage Grotesque Variable', sans-serif">F</text>
          </g>
        )}
        {prop === 'book' && (
          <g>
            <path d="M104 238 L148 246 L148 280 L104 272Z" fill="#009E49" />
            <path d="M196 238 L152 246 L152 280 L196 272Z" fill="#FF7700" />
            <path d="M110 245 L142 251 M110 255 L142 261 M110 265 L142 271" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
            <path d="M190 245 L158 251 M190 255 L158 261 M190 265 L158 271" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />
          </g>
        )}
        {prop === 'phone' && (
          <g>
            <rect x="126" y="226" width="48" height="76" rx="9" fill="#0F2A1E" />
            <rect x="131" y="234" width="38" height="58" rx="5" fill="#EAF6EE" />
            <circle cx="150" cy="256" r="11" fill="#009E49" />
            <path d="M144 256 l5 5 l8 -9" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <rect x="139" y="274" width="22" height="4" rx="2" fill="#B7D8C3" />
          </g>
        )}
        {prop === 'shield' && (
          <g>
            <path d="M150 226 L184 238 V262 C184 280 168 292 150 298 C132 292 116 280 116 262 V238Z" fill="#009E49" stroke="#006B32" strokeWidth="3" strokeLinejoin="round" />
            <path d="M134 262 l11 11 l21 -23" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        )}
      </g>
    </svg>
  );
};
