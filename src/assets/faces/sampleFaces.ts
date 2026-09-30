// Sample demo faces for instant 2D try-on testing without mandatory file upload
export interface SampleFace {
  id: string;
  name: { fr: string; ar: string };
  gender: string;
  faceShape: string;
  image: string; // SVG portrait or image path
  eyeLevelRatio: number; // Y position of eyes (approx 42-45% of height)
}

// Clean aesthetic vector portraits with accurately calibrated eye centers for immediate optical try-on
export const SAMPLE_FACES: SampleFace[] = [
  {
    id: 'face-sophia',
    name: { fr: 'Modèle Sofia (Femme)', ar: 'عارضة صوفيا (وجه بيضاوي)' },
    gender: 'female',
    faceShape: 'Oval',
    eyeLevelRatio: 0.44,
    image: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f5efe6"/>
            <stop offset="100%" stop-color="#e8ded2"/>
          </linearGradient>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fcdbc9"/>
            <stop offset="50%" stop-color="#f6c8b0"/>
            <stop offset="100%" stop-color="#e4a88b"/>
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#2c1a11"/>
            <stop offset="100%" stop-color="#140b07"/>
          </linearGradient>
        </defs>
        <rect width="600" height="750" fill="url(#bgGrad)"/>
        <!-- Hair Back -->
        <path d="M 170 300 C 130 180 180 80 300 80 C 420 80 470 180 430 300 C 490 520 450 680 440 750 L 160 750 C 150 680 110 520 170 300 Z" fill="url(#hairGrad)"/>
        <!-- Neck & Shoulders -->
        <path d="M 230 460 L 230 620 L 80 750 L 520 750 L 370 620 L 370 460 Z" fill="#e8b196"/>
        <!-- Face Oval -->
        <path d="M 180 280 C 180 160 210 130 300 130 C 390 130 420 160 420 280 C 420 440 375 520 300 520 C 225 520 180 440 180 280 Z" fill="url(#skinGrad)"/>
        <!-- Eyebrows -->
        <path d="M 200 300 Q 235 285 270 298" stroke="#331c12" stroke-width="5" stroke-linecap="round" fill="none"/>
        <path d="M 330 298 Q 365 285 400 300" stroke="#331c12" stroke-width="5" stroke-linecap="round" fill="none"/>
        <!-- Left Eye (Center: x=235, y=330) -->
        <ellipse cx="235" cy="330" rx="26" ry="14" fill="#ffffff"/>
        <ellipse cx="235" cy="330" rx="12" ry="12" fill="#5c3a21"/>
        <circle cx="235" cy="330" r="5" fill="#0f0906"/>
        <circle cx="238" cy="327" r="2.5" fill="#ffffff"/>
        <!-- Right Eye (Center: x=365, y=330) -->
        <ellipse cx="365" cy="330" rx="26" ry="14" fill="#ffffff"/>
        <ellipse cx="365" cy="330" rx="12" ry="12" fill="#5c3a21"/>
        <circle cx="365" cy="330" r="5" fill="#0f0906"/>
        <circle cx="368" cy="327" r="2.5" fill="#ffffff"/>
        <!-- Nose Bridge & Tip -->
        <path d="M 296 325 L 293 395 Q 300 408 307 395" stroke="#d49474" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Lips -->
        <path d="M 255 450 Q 300 435 345 450 Q 300 475 255 450 Z" fill="#c46262"/>
        <!-- Hair Front / Bangs -->
        <path d="M 160 250 C 180 130 220 95 300 95 C 380 95 420 130 440 250 C 400 180 340 170 300 170 C 260 170 200 180 160 250 Z" fill="url(#hairGrad)"/>
      </svg>
    `)}`
  },
  {
    id: 'face-karim',
    name: { fr: 'Modèle Karim (Homme)', ar: 'عارض كريم (وجه رجالي مربع)' },
    gender: 'male',
    faceShape: 'Square',
    eyeLevelRatio: 0.44,
    image: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 750" width="600" height="750">
        <defs>
          <linearGradient id="bgGradM" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e2e8f0"/>
            <stop offset="100%" stop-color="#cbd5e1"/>
          </linearGradient>
          <linearGradient id="skinGradM" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f1cfb9"/>
            <stop offset="60%" stop-color="#deb498"/>
            <stop offset="100%" stop-color="#c99b7d"/>
          </linearGradient>
        </defs>
        <rect width="600" height="750" fill="url(#bgGradM)"/>
        <!-- Shoulders & Shirt -->
        <path d="M 190 490 L 190 620 L 50 750 L 550 750 L 410 620 L 410 490 Z" fill="#334155"/>
        <path d="M 230 490 L 230 630 L 370 630 L 370 490 Z" fill="#cb9b7d"/>
        <!-- Face Angular -->
        <path d="M 185 270 C 185 180 200 140 300 140 C 400 140 415 180 415 270 L 405 440 L 355 510 L 245 510 L 195 440 Z" fill="url(#skinGradM)"/>
        <!-- Short Hair -->
        <path d="M 175 250 C 170 140 210 80 300 80 C 390 80 430 140 425 250 C 410 160 380 130 300 130 C 220 130 190 160 175 250 Z" fill="#1e1b18"/>
        <!-- Eyebrows Strong -->
        <path d="M 195 295 L 265 295" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
        <path d="M 335 295 L 405 295" stroke="#1c1917" stroke-width="6" stroke-linecap="round"/>
        <!-- Left Eye (x=235, y=330) -->
        <ellipse cx="235" cy="330" rx="24" ry="12" fill="#ffffff"/>
        <ellipse cx="235" cy="330" rx="11" ry="11" fill="#362215"/>
        <circle cx="235" cy="330" r="4.5" fill="#000000"/>
        <circle cx="238" cy="328" r="2" fill="#ffffff"/>
        <!-- Right Eye (x=365, y=330) -->
        <ellipse cx="365" cy="330" rx="24" ry="12" fill="#ffffff"/>
        <ellipse cx="365" cy="330" rx="11" ry="11" fill="#362215"/>
        <circle cx="365" cy="330" r="4.5" fill="#000000"/>
        <circle cx="368" cy="328" r="2" fill="#ffffff"/>
        <!-- Nose -->
        <path d="M 298 320 L 295 395 L 306 395" stroke="#b08162" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <!-- Beard Stubble -->
        <path d="M 205 440 Q 300 520 395 440" stroke="#785942" stroke-width="2" stroke-dasharray="2,3" fill="none"/>
        <!-- Lips -->
        <path d="M 260 455 L 340 455" stroke="#a36b58" stroke-width="4.5" stroke-linecap="round"/>
      </svg>
    `)}`
  }
];
