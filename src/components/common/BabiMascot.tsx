import React from 'react';

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

interface BabiMascotProps {
  variant?: MascotVariant;
  size?: MascotSize;
  number?: string | number;
  className?: string;
  speechText?: string;
  speechBubble?: string; // backwards compatibility alias
}

// Substantially enlarged size dimensions for full-body view
const sizeClasses: Record<MascotSize, { wrapper: string; text: string }> = {
  xs: { wrapper: 'w-8 h-10', text: 'text-[9px]' },
  sm: { wrapper: 'w-12 h-15', text: 'text-[11px]' },
  md: { wrapper: 'w-20 h-25', text: 'text-xs' },
  lg: { wrapper: 'w-32 h-40', text: 'text-sm' },
  xl: { wrapper: 'w-48 h-60', text: 'text-base' },
  '2xl': { wrapper: 'w-64 h-80', text: 'text-lg' },
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

  return (
    <div className={`inline-flex items-center gap-3 select-none shrink-0 ${className}`}>
      <div className={`relative ${currentSize.wrapper} shrink-0 filter drop-shadow-lg transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 160 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* 3D Elephant Skin Soft Clay Gradient */}
            <linearGradient id="babiSkinFull3D" x1="40" y1="20" x2="130" y2="180" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="25%" stopColor="#94A3B8" />
              <stop offset="65%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>

            {/* Belly Soft Lighter Shading */}
            <radialGradient id="babiBellyGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F1F5F9" />
              <stop offset="55%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </radialGradient>

            {/* Warm Ears Inner Gradient */}
            <linearGradient id="babiEarInnerWarm" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FED7AA" />
              <stop offset="60%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>

            {/* Ivory Tusks Gradient */}
            <linearGradient id="babiIvoryTusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>

            {/* Gold Accent Gradient */}
            <linearGradient id="babiGoldMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            {/* Côte d'Ivoire Orange Accent */}
            <linearGradient id="civOrangeVibrant" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>

            {/* Head Ambient Shine */}
            <radialGradient id="headAmbientShine" cx="45%" cy="30%" r="45%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>

            {/* Ground Shadow */}
            <radialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#0F172A" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* GROUND SHADOW */}
          <ellipse cx="80" cy="190" rx="55" ry="8" fill="url(#groundShadow)" />

          {/* TAIL (peeking behind left hip) */}
          <path
            d="M48 152 C35 158 26 170 30 178 C32 181 36 179 34 175 C31 169 38 162 46 158"
            fill="none"
            stroke="#64748B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Tail Tuft */}
          <ellipse cx="30" cy="179" rx="4" ry="6" transform="rotate(-25 30 179)" fill="#334155" />

          {/* LEFT LARGE ELEPHANT EAR */}
          <path
            d="M45 48 C18 45 4 68 12 92 C19 110 40 114 48 102"
            fill="url(#babiSkinFull3D)"
            stroke="#334155"
            strokeWidth="3.5"
          />
          <path
            d="M42 58 C24 57 16 71 21 88 C26 100 38 100 44 92"
            fill="url(#babiEarInnerWarm)"
            opacity="0.85"
          />

          {/* RIGHT LARGE ELEPHANT EAR */}
          <path
            d="M115 48 C142 45 156 68 148 92 C141 110 120 114 112 102"
            fill="url(#babiSkinFull3D)"
            stroke="#334155"
            strokeWidth="3.5"
          />
          <path
            d="M118 58 C136 57 144 71 139 88 C134 100 122 100 116 92"
            fill="url(#babiEarInnerWarm)"
            opacity="0.85"
          />

          {/* CHUBBY ELEPHANT BODY / TORSO */}
          <path
            d="M50 100 C42 120 40 145 46 168 C52 178 108 178 114 168 C120 145 118 120 110 100 Z"
            fill="url(#babiSkinFull3D)"
            stroke="#334155"
            strokeWidth="3.5"
          />

          {/* CHUBBY ROUND BELLY */}
          <ellipse
            cx="80"
            cy="144"
            rx="27"
            ry="24"
            fill="url(#babiBellyGrad)"
            stroke="#64748B"
            strokeWidth="1.5"
          />

          {/* CÔTE D'IVOIRE TRICOLOR SASH / BELT */}
          <g transform="translate(56, 128) rotate(-6)">
            {/* Orange Band */}
            <rect x="0" y="0" width="16" height="10" rx="2" fill="#FF7700" />
            {/* White Band */}
            <rect x="16" y="0" width="16" height="10" rx="1" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.5" />
            {/* Green Band */}
            <rect x="32" y="0" width="16" height="10" rx="2" fill="#009E49" />
            {/* Gold Center Buckle */}
            <circle cx="24" cy="5" r="4.5" fill="url(#babiGoldMetal)" stroke="#78350F" strokeWidth="1" />
          </g>

          {/* LEGS & FEET (FRONT) */}
          {/* Left Leg & Foot */}
          <g>
            <path
              d="M52 160 C50 172 48 184 50 188 C52 191 70 191 71 188 C72 184 71 172 70 160 Z"
              fill="url(#babiSkinFull3D)"
              stroke="#334155"
              strokeWidth="3"
            />
            {/* Toenails */}
            <circle cx="55" cy="188" r="2.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
            <circle cx="61" cy="189" r="2.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
            <circle cx="67" cy="188" r="2.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
          </g>

          {/* Right Leg & Foot */}
          <g>
            <path
              d="M89 160 C88 172 87 184 89 188 C90 191 108 191 110 188 C112 184 110 172 108 160 Z"
              fill="url(#babiSkinFull3D)"
              stroke="#334155"
              strokeWidth="3"
            />
            {/* Toenails */}
            <circle cx="93" cy="188" r="2.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
            <circle cx="99" cy="189" r="2.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
            <circle cx="105" cy="188" r="2.5" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.8" />
          </g>

          {/* LEFT ARM / HAND */}
          <path
            d="M48 108 C36 114 30 126 33 138 C35 144 42 144 45 138 C49 130 54 122 55 114 Z"
            fill="url(#babiSkinFull3D)"
            stroke="#334155"
            strokeWidth="3"
          />

          {/* HEAD */}
          <ellipse
            cx="80"
            cy="70"
            rx="42"
            ry="38"
            fill="url(#babiSkinFull3D)"
            stroke="#334155"
            strokeWidth="3.5"
          />
          {/* Head 3D Ambient Highlight */}
          <ellipse
            cx="74"
            cy="58"
            rx="28"
            ry="20"
            fill="url(#headAmbientShine)"
          />

          {/* BIG ADORABLE CARTOON EYES */}
          {/* Left Eye */}
          <ellipse cx="64" cy="64" rx="8" ry="10" fill="#0F172A" />
          <ellipse cx="66" cy="61" rx="4" ry="5" fill="#1E293B" />
          <circle cx="67" cy="60" r="3" fill="#FFFFFF" />
          <circle cx="62" cy="68" r="1.5" fill="#FFFFFF" />

          {/* Right Eye */}
          <ellipse cx="96" cy="64" rx="8" ry="10" fill="#0F172A" />
          <ellipse cx="98" cy="61" rx="4" ry="5" fill="#1E293B" />
          <circle cx="99" cy="60" r="3" fill="#FFFFFF" />
          <circle cx="94" cy="68" r="1.5" fill="#FFFFFF" />

          {/* Cute Rosy Cheeks */}
          <circle cx="53" cy="77" r="6" fill="#FB7185" opacity="0.65" />
          <circle cx="107" cy="77" r="6" fill="#FB7185" opacity="0.65" />

          {/* IVORY TUSKS */}
          {/* Left Tusk */}
          <path
            d="M62 82 C60 92 51 98 42 99 C48 94 53 87 60 80 Z"
            fill="url(#babiIvoryTusk)"
            stroke="#D97706"
            strokeWidth="1.5"
          />
          {/* Right Tusk */}
          <path
            d="M98 82 C100 92 109 98 118 99 C112 94 107 87 100 80 Z"
            fill="url(#babiIvoryTusk)"
            stroke="#D97706"
            strokeWidth="1.5"
          />

          {/* ELEPHANT TRUNK (Curling upward joyfully) */}
          <path
            d="M72 75 C72 89 77 101 87 103 C96 105 101 98 98 91 C96 86 89 86 89 91 C89 94 92 95 94 94 C92 97 85 96 80 88 C77 82 77 75 77 75 Z"
            fill="url(#babiSkinFull3D)"
            stroke="#334155"
            strokeWidth="3.2"
            strokeLinejoin="round"
          />
          {/* Trunk Wrinkles */}
          <line x1="74" y1="81" x2="79" y2="81" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="75" y1="86" x2="81" y2="86" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />

          {/* RIGHT ARM & HAND (Tailored per variant) */}

          {/* DEFAULT / WAVING / WELCOME: Right hand waving hello */}
          {(variant === 'waving' || variant === 'welcome' || (!variant && variant !== 'academic' && variant !== 'wallet' && variant !== 'ai' && variant !== 'security' && variant !== 'support' && variant !== 'number' && variant !== 'badge')) && (
            <g>
              {/* Upraised arm */}
              <path
                d="M106 105 C118 100 128 86 134 72 C137 66 145 70 142 77 C135 93 124 112 112 118 Z"
                fill="url(#babiSkinFull3D)"
                stroke="#334155"
                strokeWidth="3"
              />
              {/* Chubby Waving Palm */}
              <circle cx="137" cy="69" r="7" fill="url(#babiSkinFull3D)" stroke="#334155" strokeWidth="2.5" />
              {/* Wave sparkles */}
              <path d="M148 58 L152 54 M152 64 L157 65 M144 50 L145 45" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* ACADEMIC: Mortarboard hat on head + Diploma in hand */}
          {variant === 'academic' && (
            <>
              {/* Mortarboard on Head */}
              <g transform="translate(80, 36)">
                <polygon points="0,-22 42,-8 0,6 -42,-8" fill="#1E1B4B" stroke="#FDE047" strokeWidth="2" />
                <polygon points="0,-22 42,-8 0,6 -42,-8" fill="url(#babiGoldMetal)" opacity="0.25" />
                <path d="M-22,-8 C-22,6 22,6 22,-8 Z" fill="#0F172A" />
                {/* Gold Tassel */}
                <line x1="0" y1="-8" x2="32" y2="6" stroke="#F59E0B" strokeWidth="3" />
                <circle cx="32" cy="6" r="3.5" fill="#D97706" />
              </g>
              {/* Arm holding Diploma */}
              <g>
                <path
                  d="M106 108 C118 114 126 122 130 134 C132 139 125 143 121 138 C116 130 112 122 110 114 Z"
                  fill="url(#babiSkinFull3D)"
                  stroke="#334155"
                  strokeWidth="3"
                />
                {/* Rolled Diploma Scroll */}
                <g transform="translate(126, 128) rotate(-20)">
                  <rect x="-6" y="-14" width="12" height="28" rx="3" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
                  <rect x="-6" y="-3" width="12" height="6" fill="#EA580C" />
                  <circle cx="0" cy="0" r="2.5" fill="url(#babiGoldMetal)" />
                </g>
              </g>
            </>
          )}

          {/* WALLET / CASH: Arm holding shiny XOF Gold Coin */}
          {variant === 'wallet' && (
            <g>
              <path
                d="M106 108 C118 112 128 120 132 130 C134 136 127 141 123 136 C118 128 112 122 110 114 Z"
                fill="url(#babiSkinFull3D)"
                stroke="#334155"
                strokeWidth="3"
              />
              {/* Big Gold Coin */}
              <g transform="translate(132, 130)">
                <circle cx="0" cy="0" r="17" fill="url(#babiGoldMetal)" stroke="#78350F" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="13" fill="none" stroke="#FEF08A" strokeWidth="1.5" strokeDasharray="3 2" />
                <text x="0" y="5" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350F" fontFamily="sans-serif">
                  XOF
                </text>
              </g>
            </g>
          )}

          {/* AI / HIGH-TECH: Futuristic Visor & AI Glowing Orb */}
          {variant === 'ai' && (
            <>
              {/* Cyber Visor on Eyes */}
              <g transform="translate(42, 54)">
                <rect x="0" y="0" width="76" height="20" rx="8" fill="#06B6D4" fillOpacity="0.5" stroke="#0891B2" strokeWidth="2.5" />
                <line x1="8" y1="10" x2="68" y2="10" stroke="#E0F2FE" strokeWidth="2" strokeDasharray="4 2" />
              </g>
              {/* Arm holding Glowing AI Orb */}
              <g>
                <path
                  d="M106 108 C118 112 128 120 132 130 C134 136 127 141 123 136 C118 128 112 122 110 114 Z"
                  fill="url(#babiSkinFull3D)"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <g transform="translate(132, 128)">
                  <circle cx="0" cy="0" r="14" fill="#06B6D4" fillOpacity="0.4" stroke="#22D3EE" strokeWidth="2" />
                  <circle cx="0" cy="0" r="8" fill="#67E8F9" />
                  <path d="M-4 0 L4 0 M0 -4 L0 4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  {/* Sparkles */}
                  <circle cx="12" cy="-10" r="2" fill="#FACC15" />
                  <circle cx="-10" cy="-12" r="1.5" fill="#38BDF8" />
                </g>
              </g>
            </>
          )}

          {/* SECURITY: Holding Green Emerald Shield */}
          {variant === 'security' && (
            <g>
              <path
                d="M106 108 C118 112 128 120 132 130 C134 136 127 141 123 136 C118 128 112 122 110 114 Z"
                fill="url(#babiSkinFull3D)"
                stroke="#334155"
                strokeWidth="3"
              />
              <g transform="translate(132, 130)">
                <path d="M0 -15 L14 -8 V4 C14 13 0 19 0 19 C0 19 -14 13 -14 4 V-8 L0 -15 Z" fill="#10B981" stroke="#065F46" strokeWidth="2.5" />
                <path d="M-5 2 L-1 6 L6 -3" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            </g>
          )}

          {/* SUPPORT: Headset with Mic */}
          {variant === 'support' && (
            <>
              {/* Headband on Head */}
              <g transform="translate(80, 58)">
                <path d="M-40 -8 C-40 -38 40 -38 40 -8" fill="none" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
                <rect x="-44" y="-12" width="9" height="22" rx="4" fill="#C2410C" />
                <rect x="35" y="-12" width="9" height="22" rx="4" fill="#C2410C" />
                {/* Mic Boom */}
                <path d="M38 2 C38 18 20 24 6 24" fill="none" stroke="#F97316" strokeWidth="3" />
                <circle cx="5" cy="24" r="3.5" fill="#EA580C" />
              </g>
              {/* Waving hand */}
              <g>
                <path
                  d="M106 105 C118 100 128 86 134 72 C137 66 145 70 142 77 C135 93 124 112 112 118 Z"
                  fill="url(#babiSkinFull3D)"
                  stroke="#334155"
                  strokeWidth="3"
                />
                <circle cx="137" cy="69" r="7" fill="url(#babiSkinFull3D)" stroke="#334155" strokeWidth="2.5" />
              </g>
            </>
          )}

          {/* NUMBER / BADGE MEDALLION */}
          {(variant === 'number' || variant === 'badge' || number !== undefined) && (
            <g transform="translate(132, 126)">
              <circle cx="0" cy="0" r="18" fill="url(#civOrangeVibrant)" stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="0" cy="0" r="14" fill="none" stroke="#FDBA74" strokeWidth="1" strokeDasharray="3 2" />
              <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">
                {number ?? '★'}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Optional Speech Bubble */}
      {displayText && (
        <div className="relative bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-orange-200/80 shadow-md text-left max-w-xs animate-fadeIn">
          <div className="absolute -left-2 top-3 w-3 h-3 bg-white border-l border-b border-orange-200/80 transform rotate-45"></div>
          <span className="text-[12px] font-bold text-orange-950 block leading-snug">{displayText}</span>
        </div>
      )}
    </div>
  );
};
