import { FrameShape } from '../../types';

export interface FrameDefinition {
  id: string;
  name: { fr: string; ar: string };
  shape: FrameShape;
  colors: { id: string; name: { fr: string; ar: string }; hex: string; strokeColor: string; fillColor?: string }[];
  defaultWidthMm: number;
  defaultHeightMm: number;
  lensWidthMm: number;
  bridgeWidthMm: number;
  templeLengthMm: number;
  getSvg: (strokeColor: string, lensTint?: string) => string;
}

export const FRAME_DEFINITIONS: FrameDefinition[] = [
  {
    id: 'round-titanium-01',
    name: {
      fr: 'Titane Rond Minimaliste',
      ar: 'إطار تيتانيوم دائري خفيف'
    },
    shape: 'round',
    defaultWidthMm: 132,
    defaultHeightMm: 46,
    lensWidthMm: 48,
    bridgeWidthMm: 20,
    templeLengthMm: 145,
    colors: [
      { id: 'gold', name: { fr: 'Or Brossé', ar: 'ذهبي مطفي' }, hex: '#C5A059', strokeColor: '#B8860B' },
      { id: 'silver', name: { fr: 'Argent Platine', ar: 'فضي بلاتيني' }, hex: '#D1D5DB', strokeColor: '#9CA3AF' },
      { id: 'black', name: { fr: 'Noir Mat', ar: 'أسود مطفي' }, hex: '#1F2937', strokeColor: '#111827' }
    ],
    getSvg: (strokeColor = '#B8860B', lensTint = 'rgba(230,240,250,0.18)') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" width="500" height="180">
        <defs>
          <linearGradient id="lensReflect" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
            <stop offset="40%" stop-color="#ffffff" stop-opacity="0.05"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.15"/>
          </linearGradient>
          <filter id="subtleGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/>
          </filter>
        </defs>
        <g filter="url(#subtleGlow)">
          <!-- Left Lens & Frame -->
          <circle cx="150" cy="90" r="68" fill="${lensTint}" stroke="${strokeColor}" stroke-width="7" />
          <circle cx="150" cy="90" r="64" fill="url(#lensReflect)" stroke="none" />
          
          <!-- Right Lens & Frame -->
          <circle cx="350" cy="90" r="68" fill="${lensTint}" stroke="${strokeColor}" stroke-width="7" />
          <circle cx="350" cy="90" r="64" fill="url(#lensReflect)" stroke="none" />
          
          <!-- Bridge Arch -->
          <path d="M 218 80 Q 250 62 282 80" fill="none" stroke="${strokeColor}" stroke-width="6.5" stroke-linecap="round" />
          
          <!-- Nose Pads -->
          <ellipse cx="225" cy="100" rx="3.5" ry="7" fill="#f8fafc" stroke="${strokeColor}" stroke-width="2" />
          <ellipse cx="275" cy="100" rx="3.5" ry="7" fill="#f8fafc" stroke="${strokeColor}" stroke-width="2" />
          
          <!-- Outer Hinges & Temples -->
          <path d="M 82 86 L 35 84" fill="none" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />
          <path d="M 418 86 L 465 84" fill="none" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />
          <circle cx="79" cy="86" r="3" fill="#ffffff" />
          <circle cx="421" cy="86" r="3" fill="#ffffff" />
        </g>
      </svg>
    `
  },
  {
    id: 'aviator-classic-02',
    name: {
      fr: 'Aviateur Solaire Double Pont',
      ar: 'أفياتور كلاسيكي بجسر مزدوج'
    },
    shape: 'aviator',
    defaultWidthMm: 140,
    defaultHeightMm: 52,
    lensWidthMm: 58,
    bridgeWidthMm: 14,
    templeLengthMm: 140,
    colors: [
      { id: 'gold-green', name: { fr: 'Or & Vert Solaire', ar: 'ذهبي بعدسات خضراء' }, hex: '#D97706', strokeColor: '#D97706' },
      { id: 'gunmetal', name: { fr: 'Canon de Fusil', ar: 'رمادي غامق' }, hex: '#4B5563', strokeColor: '#374151' },
      { id: 'black', name: { fr: 'Noir Fumé', ar: 'أسود داكن' }, hex: '#111827', strokeColor: '#111827' }
    ],
    getSvg: (strokeColor = '#D97706', lensTint = 'rgba(20, 83, 45, 0.45)') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 200" width="520" height="200">
        <defs>
          <linearGradient id="aviatorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
            <stop offset="60%" stop-color="#1e293b" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.6"/>
          </linearGradient>
        </defs>
        <g>
          <!-- Left Aviator Teardrop Lens -->
          <path d="M 120 45 C 190 45 220 55 225 105 C 230 155 170 168 125 165 C 75 162 65 125 70 85 C 75 52 95 45 120 45 Z"
                fill="${lensTint}" stroke="${strokeColor}" stroke-width="6" />
          <path d="M 120 48 C 185 48 215 58 220 105 C 225 150 170 162 125 160 C 80 157 70 125 75 88 Z"
                fill="url(#aviatorGrad)" />

          <!-- Right Aviator Teardrop Lens -->
          <path d="M 400 45 C 330 45 300 55 295 105 C 290 155 350 168 395 165 C 445 162 455 125 450 85 C 445 52 425 45 400 45 Z"
                fill="${lensTint}" stroke="${strokeColor}" stroke-width="6" />
          <path d="M 400 48 C 335 48 305 58 300 105 C 295 150 350 162 395 160 C 440 157 450 125 445 88 Z"
                fill="url(#aviatorGrad)" />

          <!-- Top Brow Bar (Iconic Aviator) -->
          <line x1="165" y1="46" x2="355" y2="46" stroke="${strokeColor}" stroke-width="5" stroke-linecap="round" />
          <!-- Center Curved Bridge -->
          <path d="M 225 78 Q 260 65 295 78" fill="none" stroke="${strokeColor}" stroke-width="5.5" stroke-linecap="round" />

          <!-- Nose Pads -->
          <ellipse cx="236" cy="105" rx="3.5" ry="8" fill="#f8fafc" stroke="${strokeColor}" stroke-width="2" />
          <ellipse cx="284" cy="105" rx="3.5" ry="8" fill="#f8fafc" stroke="${strokeColor}" stroke-width="2" />

          <!-- Temples -->
          <path d="M 68 75 L 20 72" fill="none" stroke="${strokeColor}" stroke-width="5.5" stroke-linecap="round" />
          <path d="M 452 75 L 500 72" fill="none" stroke="${strokeColor}" stroke-width="5.5" stroke-linecap="round" />
        </g>
      </svg>
    `
  },
  {
    id: 'square-bold-acetate-03',
    name: {
      fr: 'Acétate Épais Rectangle & Carré',
      ar: 'إطار أسيتات عريض مستطيل'
    },
    shape: 'square',
    defaultWidthMm: 142,
    defaultHeightMm: 48,
    lensWidthMm: 52,
    bridgeWidthMm: 19,
    templeLengthMm: 145,
    colors: [
      { id: 'black', name: { fr: 'Noir Onyx', ar: 'أسود نفاث' }, hex: '#000000', strokeColor: '#09090b' },
      { id: 'tortoise', name: { fr: 'Écaille Havane', ar: 'نقشة السلحفاة هافانا' }, hex: '#78350f', strokeColor: '#582a0b' },
      { id: 'crystal', name: { fr: 'Cristal Transparent', ar: 'كريستال شفاف' }, hex: '#e2e8f0', strokeColor: '#cbd5e1' }
    ],
    getSvg: (strokeColor = '#09090b', lensTint = 'rgba(241,245,249,0.18)') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 190" width="520" height="190">
        <defs>
          <linearGradient id="sqReflect" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
            <stop offset="50%" stop-color="#ffffff" stop-opacity="0.04"/>
            <stop offset="100%" stop-color="#94a3b8" stop-opacity="0.12"/>
          </linearGradient>
        </defs>
        <g>
          <!-- Left Square Frame -->
          <rect x="75" y="40" width="155" height="110" rx="18" ry="18"
                fill="${lensTint}" stroke="${strokeColor}" stroke-width="14" />
          <rect x="85" y="50" width="135" height="90" rx="10" ry="10"
                fill="url(#sqReflect)" stroke="none" />
          
          <!-- Right Square Frame -->
          <rect x="290" y="40" width="155" height="110" rx="18" ry="18"
                fill="${lensTint}" stroke="${strokeColor}" stroke-width="14" />
          <rect x="300" y="50" width="135" height="90" rx="10" ry="10"
                fill="url(#sqReflect)" stroke="none" />

          <!-- Sturdy Acetate Keyhole Bridge -->
          <path d="M 228 58 Q 260 48 292 58 L 285 85 Q 260 95 235 85 Z" fill="${strokeColor}" />

          <!-- Metal Rivet Pins on Endpieces -->
          <circle cx="83" cy="55" r="2.5" fill="#f8fafc" />
          <circle cx="89" cy="55" r="2.5" fill="#f8fafc" />
          <circle cx="437" cy="55" r="2.5" fill="#f8fafc" />
          <circle cx="431" cy="55" r="2.5" fill="#f8fafc" />

          <!-- Hinges extending back -->
          <path d="M 75 58 L 25 65" stroke="${strokeColor}" stroke-width="12" stroke-linecap="round" />
          <path d="M 445 58 L 495 65" stroke="${strokeColor}" stroke-width="12" stroke-linecap="round" />
        </g>
      </svg>
    `
  },
  {
    id: 'cat-eye-couture-04',
    name: {
      fr: 'Papillon & Œil de Chat Rétro',
      ar: 'عين القطة كوتور ريترو'
    },
    shape: 'cat-eye',
    defaultWidthMm: 136,
    defaultHeightMm: 44,
    lensWidthMm: 53,
    bridgeWidthMm: 17,
    templeLengthMm: 140,
    colors: [
      { id: 'bordeaux', name: { fr: 'Bordeaux Profond', ar: 'عنابي فاخر' }, hex: '#831843', strokeColor: '#701a35' },
      { id: 'black', name: { fr: 'Noir Glamour', ar: 'أسود براق' }, hex: '#0f172a', strokeColor: '#0f172a' },
      { id: 'amber', name: { fr: 'Ambre Miel', ar: 'عسلي دافئ' }, hex: '#b45309', strokeColor: '#92400e' }
    ],
    getSvg: (strokeColor = '#701a35', lensTint = 'rgba(253, 242, 248, 0.2)') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 180" width="520" height="180">
        <defs>
          <linearGradient id="catReflect" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
            <stop offset="60%" stop-color="#ffffff" stop-opacity="0.05"/>
            <stop offset="100%" stop-color="#fb7185" stop-opacity="0.15"/>
          </linearGradient>
        </defs>
        <g>
          <!-- Left Cat Eye -->
          <path d="M 60 40 C 90 28 175 42 225 58 C 230 115 175 145 140 145 C 80 145 65 110 65 75 Z"
                fill="${lensTint}" stroke="${strokeColor}" stroke-width="10" stroke-linejoin="round" />
          <path d="M 72 48 C 95 38 170 50 215 65 C 220 108 170 135 140 135 C 90 135 75 105 75 80 Z"
                fill="url(#catReflect)" />

          <!-- Right Cat Eye -->
          <path d="M 460 40 C 430 28 345 42 295 58 C 290 115 345 145 380 145 C 440 145 455 110 455 75 Z"
                fill="${lensTint}" stroke="${strokeColor}" stroke-width="10" stroke-linejoin="round" />
          <path d="M 448 48 C 425 38 350 50 305 65 C 300 108 350 135 380 135 C 430 135 445 105 445 80 Z"
                fill="url(#catReflect)" />

          <!-- Bridge -->
          <path d="M 224 64 Q 260 52 296 64" fill="none" stroke="${strokeColor}" stroke-width="9" stroke-linecap="round" />

          <!-- Temples -->
          <path d="M 58 40 L 15 48" stroke="${strokeColor}" stroke-width="8" stroke-linecap="round" />
          <path d="M 462 40 L 505 48" stroke="${strokeColor}" stroke-width="8" stroke-linecap="round" />
        </g>
      </svg>
    `
  },
  {
    id: 'geometric-octagonal-05',
    name: {
      fr: 'Octogonale Géométrique Urbaine',
      ar: 'إطار هندسي ثماني الأضلاع'
    },
    shape: 'geometric',
    defaultWidthMm: 135,
    defaultHeightMm: 45,
    lensWidthMm: 50,
    bridgeWidthMm: 19,
    templeLengthMm: 142,
    colors: [
      { id: 'rosegold', name: { fr: 'Or Rose Satiné', ar: 'وردي ذهبي' }, hex: '#E0A899', strokeColor: '#C08070' },
      { id: 'black', name: { fr: 'Noir Anthracite', ar: 'أسود رمادي' }, hex: '#334155', strokeColor: '#1e293b' }
    ],
    getSvg: (strokeColor = '#C08070', lensTint = 'rgba(238,242,255,0.22)') => `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 180" width="520" height="180">
        <defs>
          <linearGradient id="geomReflect" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
            <stop offset="70%" stop-color="#ffffff" stop-opacity="0.06"/>
            <stop offset="100%" stop-color="#a855f7" stop-opacity="0.12"/>
          </linearGradient>
        </defs>
        <g>
          <!-- Left Octagon -->
          <polygon points="105,45 175,45 220,75 220,115 175,145 105,145 65,115 65,75"
                   fill="${lensTint}" stroke="${strokeColor}" stroke-width="6.5" stroke-linejoin="round" />
          <polygon points="108,50 172,50 214,77 214,113 172,140 108,140 71,113 71,77"
                   fill="url(#geomReflect)" />

          <!-- Right Octagon -->
          <polygon points="345,45 415,45 455,75 455,115 415,145 345,145 300,115 300,75"
                   fill="${lensTint}" stroke="${strokeColor}" stroke-width="6.5" stroke-linejoin="round" />
          <polygon points="348,50 412,50 449,77 449,113 412,140 348,140 306,113 306,77"
                   fill="url(#geomReflect)" />

          <!-- Bridge -->
          <path d="M 220 86 Q 260 74 300 86" fill="none" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />

          <!-- Temples -->
          <path d="M 65 75 L 20 72" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />
          <path d="M 455 75 L 500 72" stroke="${strokeColor}" stroke-width="6" stroke-linecap="round" />
        </g>
      </svg>
    `
  }
];

export const getFrameSvgDataUri = (frameDef: FrameDefinition, colorHex?: string): string => {
  const selectedColor = frameDef.colors.find(c => c.hex === colorHex) || frameDef.colors[0];
  const svgString = frameDef.getSvg(selectedColor.strokeColor);
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
};
