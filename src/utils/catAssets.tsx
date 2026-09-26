import React from 'react';

export interface CatMascot {
  id: string;
  name: string;
  subtitle: string;
  vibe: string;
  Component: React.FC<{ className?: string; isAlarming?: boolean }>;
}

export const AngryGuardCat: React.FC<{ className?: string; isAlarming?: boolean }> = ({
  className = 'w-48 h-48',
  isAlarming = false,
}) => {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background radial alert flash if alarming */}
      {isAlarming && (
        <circle cx="120" cy="120" r="110" fill="url(#alertGlow)" className="animate-pulse opacity-80" />
      )}

      <defs>
        <radialGradient id="alertGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="badgeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Cat Ears */}
      <polygon points="55,90 35,30 95,65" fill="#1e293b" stroke="#475569" strokeWidth="3" />
      <polygon points="60,82 45,45 88,68" fill="#f43f5e" opacity="0.6" />

      <polygon points="185,90 205,30 145,65" fill="#1e293b" stroke="#475569" strokeWidth="3" />
      <polygon points="180,82 195,45 152,68" fill="#f43f5e" opacity="0.6" />

      {/* Guard Hat / Cap */}
      <path d="M70,55 C70,30 170,30 170,55 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
      <ellipse cx="120" cy="55" rx="58" ry="10" fill="#0f172a" />
      <circle cx="120" cy="40" r="8" fill="url(#badgeGrad)" stroke="#b45309" strokeWidth="1.5" />
      <path d="M120,34 L122,39 L127,39 L123,42 L125,47 L120,44 L115,47 L117,42 L113,39 L118,39 Z" fill="#ffffff" />

      {/* Cat Head */}
      <circle cx="120" cy="115" r="62" fill="url(#bodyGrad)" stroke="#475569" strokeWidth="3" />

      {/* Cheeks Fluff */}
      <path d="M58,125 C45,130 45,145 60,150" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
      <path d="M182,125 C195,130 195,145 180,150" stroke="#475569" strokeWidth="3" strokeLinecap="round" />

      {/* Angry Furrowed Eyebrows */}
      <path d="M78,88 L110,102" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />
      <path d="M162,88 L130,102" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />

      {/* Angry Eyes */}
      <ellipse cx="92" cy="108" rx="14" ry="11" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
      <ellipse cx="148" cy="108" rx="14" ry="11" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />

      {/* Slit Pupils with red alert reflection */}
      <ellipse cx="92" cy="108" rx="4" ry="9" fill={isAlarming ? "#dc2626" : "#0f172a"} />
      <ellipse cx="148" cy="108" rx="4" ry="9" fill={isAlarming ? "#dc2626" : "#0f172a"} />

      {/* Nose */}
      <polygon points="120,126 113,120 127,120" fill="#f43f5e" />

      {/* Growling / Snapping Mouth with sharp fangs */}
      <path d="M102,138 Q120,132 138,138" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <polygon points="107,136 111,146 115,136" fill="#ffffff" />
      <polygon points="125,136 129,146 133,136" fill="#ffffff" />

      {/* Whiskers */}
      <line x1="50" y1="120" x2="80" y2="124" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="134" x2="78" y2="132" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="190" y1="120" x2="160" y2="124" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
      <line x1="192" y1="134" x2="162" y2="132" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />

      {/* Security Collar & Gold Shield Badge */}
      <rect x="85" y="170" width="70" height="12" rx="6" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" />
      <path d="M120,175 L129,183 L129,198 C129,206 120,212 120,212 C120,212 111,206 111,198 L111,183 Z" fill="url(#badgeGrad)" stroke="#78350f" strokeWidth="1.5" />
      <text x="120" y="196" fill="#78350f" fontSize="9" fontWeight="bold" textAnchor="middle">GUARD</text>
    </svg>
  );
};

export const ScreamingShockedCat: React.FC<{ className?: string; isAlarming?: boolean }> = ({
  className = 'w-48 h-48',
  isAlarming = false,
}) => {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {isAlarming && (
        <circle cx="120" cy="120" r="110" fill="#f97316" fillOpacity="0.25" className="animate-ping" />
      )}

      {/* Ears pinned back in shock */}
      <polygon points="50,90 20,40 85,60" fill="#f97316" stroke="#c2410c" strokeWidth="3" />
      <polygon points="55,80 32,52 80,65" fill="#fca5a5" />

      <polygon points="190,90 220,40 155,60" fill="#f97316" stroke="#c2410c" strokeWidth="3" />
      <polygon points="185,80 208,52 160,65" fill="#fca5a5" />

      {/* Head */}
      <ellipse cx="120" cy="115" rx="64" ry="60" fill="#ea580c" stroke="#c2410c" strokeWidth="3" />

      {/* Shock lines */}
      <line x1="120" y1="20" x2="120" y2="40" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
      <line x1="90" y1="26" x2="98" y2="44" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
      <line x1="150" y1="26" x2="142" y2="44" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />

      {/* Giant Shocked Eyes */}
      <circle cx="86" cy="98" r="18" fill="#ffffff" stroke="#9a3412" strokeWidth="2.5" />
      <circle cx="154" cy="98" r="18" fill="#ffffff" stroke="#9a3412" strokeWidth="2.5" />

      {/* Tiny black shocked pupils */}
      <circle cx="86" cy="98" r="5" fill="#000000" />
      <circle cx="154" cy="98" r="5" fill="#000000" />

      {/* Pink Nose */}
      <polygon points="120,118 114,113 126,113" fill="#fda4af" />

      {/* Huge Screaming Open Mouth */}
      <ellipse cx="120" cy="152" rx="26" ry="24" fill="#450a0a" stroke="#7f1d1d" strokeWidth="3" />
      {/* Tongue */}
      <ellipse cx="120" cy="166" rx="16" ry="10" fill="#f43f5e" />
      {/* Tiny sharp upper fangs */}
      <polygon points="106,132 110,140 114,132" fill="#ffffff" />
      <polygon points="126,132 130,140 134,132" fill="#ffffff" />

      {/* Stunned paws holding cheeks */}
      <circle cx="62" cy="148" r="14" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />
      <circle cx="178" cy="148" r="14" fill="#ea580c" stroke="#c2410c" strokeWidth="2.5" />

      {/* Whiskers */}
      <line x1="40" y1="110" x2="68" y2="114" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="126" x2="70" y2="124" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="200" y1="110" x2="172" y2="114" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="198" y1="126" x2="170" y2="124" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const CyberLaserCat: React.FC<{ className?: string; isAlarming?: boolean }> = ({
  className = 'w-48 h-48',
  isAlarming = false,
}) => {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="cyberHead" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>
        <linearGradient id="neonLaser" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {/* Cyber Ears */}
      <polygon points="60,85 40,25 100,55" fill="#27272a" stroke="#06b6d4" strokeWidth="2.5" />
      <polygon points="180,85 200,25 140,55" fill="#27272a" stroke="#06b6d4" strokeWidth="2.5" />

      {/* Cyber Head */}
      <circle cx="120" cy="115" r="62" fill="url(#cyberHead)" stroke="#3f3f46" strokeWidth="3" />

      {/* Cyber Visor / High Tech Glasses */}
      <path d="M68,96 Q120,90 172,96 L168,118 Q120,126 72,118 Z" fill="#09090b" stroke="#06b6d4" strokeWidth="2.5" />

      {/* Glowing Laser Eye Beams */}
      <rect x="76" y="102" width="88" height="8" rx="4" fill="url(#neonLaser)" className={isAlarming ? "animate-pulse" : ""} />
      {isAlarming && (
        <>
          <line x1="90" y1="106" x2="10" y2="106" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
          <line x1="150" y1="106" x2="230" y2="106" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" className="animate-pulse" />
        </>
      )}

      {/* Cyber HUD Circuit Lines */}
      <path d="M60,130 L74,130 L80,140" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
      <path d="M180,130 L166,130 L160,140" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />

      {/* Small Tech Nose & Mouth */}
      <polygon points="120,132 116,128 124,128" fill="#06b6d4" />
      <path d="M112,138 Q120,142 128,138" stroke="#71717a" strokeWidth="2" fill="none" />

      {/* Collar */}
      <rect x="80" y="174" width="80" height="12" rx="4" fill="#18181b" stroke="#06b6d4" strokeWidth="2" />
      <circle cx="120" cy="180" r="4" fill="#ef4444" className={isAlarming ? "animate-ping" : ""} />
    </svg>
  );
};

export const DetectiveCat: React.FC<{ className?: string }> = ({
  className = 'w-48 h-48',
}) => {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ears */}
      <polygon points="65,90 45,35 100,65" fill="#475569" stroke="#334155" strokeWidth="3" />
      <polygon points="175,90 195,35 140,65" fill="#475569" stroke="#334155" strokeWidth="3" />

      {/* Detective Hat */}
      <ellipse cx="120" cy="62" rx="66" ry="14" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
      <path d="M80,62 C80,35 160,35 160,62 Z" fill="#92400e" stroke="#451a03" strokeWidth="2.5" />
      <rect x="80" y="56" width="80" height="6" fill="#451a03" />

      {/* Head */}
      <circle cx="120" cy="120" r="58" fill="#64748b" stroke="#334155" strokeWidth="3" />

      {/* Curious Eyes with Glasses */}
      <circle cx="94" cy="115" r="14" fill="#f8fafc" stroke="#451a03" strokeWidth="3" />
      <circle cx="146" cy="115" r="14" fill="#f8fafc" stroke="#451a03" strokeWidth="3" />
      <line x1="108" y1="115" x2="132" y2="115" stroke="#451a03" strokeWidth="3" />

      <circle cx="94" cy="115" r="6" fill="#1e293b" />
      <circle cx="146" cy="115" r="6" fill="#1e293b" />

      {/* Nose and mustache/mouth */}
      <polygon points="120,132 114,126 126,126" fill="#fda4af" />
      <path d="M110,138 Q120,144 130,138" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Magnifying Glass held in paw */}
      <circle cx="165" cy="155" r="22" stroke="#d97706" strokeWidth="4" fill="#38bdf8" fillOpacity="0.2" />
      <line x1="180" y1="170" x2="205" y2="195" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
};

export const HappyVictoryCat: React.FC<{ className?: string }> = ({
  className = 'w-48 h-48',
}) => {
  return (
    <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Golden Aura Glow */}
      <circle cx="120" cy="120" r="100" fill="#fef08a" fillOpacity="0.2" className="animate-pulse" />

      {/* Ears */}
      <polygon points="60,95 40,40 98,70" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
      <polygon points="64,88 50,55 92,72" fill="#fbcfe8" />

      <polygon points="180,95 200,40 142,70" fill="#f59e0b" stroke="#d97706" strokeWidth="3" />
      <polygon points="176,88 190,55 148,72" fill="#fbcfe8" />

      {/* Head */}
      <circle cx="120" cy="120" r="60" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />

      {/* Happy Closed Crescent Eyes */}
      <path d="M82,112 Q92,102 102,112" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M138,112 Q148,102 158,112" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* Blush cheeks */}
      <ellipse cx="78" cy="126" rx="8" ry="5" fill="#fb7185" fillOpacity="0.7" />
      <ellipse cx="162" cy="126" rx="8" ry="5" fill="#fb7185" fillOpacity="0.7" />

      {/* Cute Nose and W-Mouth */}
      <polygon points="120,125 115,120 125,120" fill="#f43f5e" />
      <path d="M110,132 Q115,138 120,132 Q125,138 130,132" stroke="#78350f" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Golden Key held in paws */}
      <g transform="translate(100, 160)">
        <circle cx="20" cy="10" r="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="3" />
        <circle cx="20" cy="10" r="4" fill="#fbbf24" />
        <rect x="18" y="20" width="4" height="28" fill="#ca8a04" />
        <rect x="22" y="34" width="8" height="4" rx="1" fill="#ca8a04" />
        <rect x="22" y="42" width="6" height="4" rx="1" fill="#ca8a04" />
      </g>
    </svg>
  );
};

export const CAT_MASCOTS: CatMascot[] = [
  {
    id: 'angry_guard',
    name: 'Sergeant Whiskers',
    subtitle: 'Chief Security Officer',
    vibe: 'Furious & vigilant against wrong PIN entries',
    Component: AngryGuardCat,
  },
  {
    id: 'screaming_shocked',
    name: 'Panic Paws',
    subtitle: 'Emergency Siren Specialist',
    vibe: 'Screams dramatically when caught unauthorized',
    Component: ScreamingShockedCat,
  },
  {
    id: 'cyber_laser',
    name: 'Cyber Panther 2077',
    subtitle: 'Tactical Recon Unit',
    vibe: 'Shoots infrared laser-eyes at phone intruders',
    Component: CyberLaserCat,
  },
  {
    id: 'detective_cat',
    name: 'Sherlock Claws',
    subtitle: 'Intruder Investigator',
    vibe: 'Inspects and documents unauthorized attempts',
    Component: DetectiveCat,
  },
];
