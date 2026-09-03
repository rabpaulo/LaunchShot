export interface TemplateLogo {
  appName: string;
  style: string;
  icon: string;
  bgGradient: string;
  accentColor: string;
  svgDataUri: string;
}

export function createTemplateLogoSvg(
  startColor: string,
  endColor: string,
  pathSvg: string,
  stroke: boolean = false
): string {
  const innerContent = stroke
    ? `<g transform="translate(32, 32) scale(2.66)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${pathSvg}</g>`
    : `<g transform="translate(32, 32) scale(2.66)" fill="#ffffff">${pathSvg}</g>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${startColor}"/><stop offset="100%" stop-color="${endColor}"/></linearGradient><radialGradient id="gl" cx="28%" cy="22%" r="65%"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs><rect width="128" height="128" rx="28" fill="url(#bg)"/><rect width="128" height="128" rx="28" fill="url(#gl)"/><rect width="126" height="126" x="1" y="1" rx="27" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5"/>${innerContent}</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export const TEMPLATE_LOGOS: Record<string, TemplateLogo> = {
  'Aesthetic Modern (5 Screens)': {
    appName: 'Atlas Pin',
    style: 'Minimalist Pastel Radial',
    icon: 'compass',
    bgGradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    accentColor: '#ec4899',
    svgDataUri: createTemplateLogoSvg(
      '#ec4899',
      '#f43f5e',
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm3.6 6.4l-2 5.6-5.6 2 2-5.6 5.6-2z"/>'
    ),
  },

  'Banner Stacked Right': {
    appName: 'MacroPulse',
    style: 'Dark Emerald Macro',
    icon: 'leaf',
    bgGradient: 'linear-gradient(135deg, #0f3a21 0%, #166534 100%)',
    accentColor: '#22c55e',
    svgDataUri: createTemplateLogoSvg(
      '#0f3a21',
      '#166534',
      '<path d="M17 3c-4 0-8 3.5-9 8-2-1-4-1-5 1 2 2 4 2 6 1 1 3 4 7 8 7s7-4 7-8-3-9-7-9z"/>'
    ),
  },

  'Kinetic Repeating Banner (Platano Style)': {
    appName: 'Platano Studio',
    style: 'Electric Yellow Kinetic',
    icon: 'flash',
    bgGradient: 'linear-gradient(135deg, #fed843 0%, #f59e0b 100%)',
    accentColor: '#fed843',
    svgDataUri: createTemplateLogoSvg(
      '#fed843',
      '#f59e0b',
      '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'
    ),
  },

  'Banner Triple Bottom': {
    appName: 'OuraSync',
    style: 'Deep Pine Bio-Recovery',
    icon: 'pulse',
    bgGradient: 'linear-gradient(135deg, #113c2c 0%, #065f46 100%)',
    accentColor: '#10b981',
    svgDataUri: createTemplateLogoSvg(
      '#113c2c',
      '#065f46',
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>'
    ),
  },

  'Hero 3D Showcase': {
    appName: 'Apex Pro',
    style: 'Cosmic Slate 3D',
    icon: 'cube',
    bgGradient: 'linear-gradient(135deg, #334155 0%, #0f172a 100%)',
    accentColor: '#6366f1',
    svgDataUri: createTemplateLogoSvg(
      '#334155',
      '#0f172a',
      '<path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.2L5.5 8 12 11.8 18.5 8 12 4.2zM4 9.5v7l7 3.8v-7L4 9.5zm16 0l-7 3.8v7l7-3.8v-7z"/>'
    ),
  },

  'Dynamic Overlap': {
    appName: 'FlowMesh',
    style: 'Hyper-Gradient Pop',
    icon: 'infinity',
    bgGradient: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
    accentColor: '#ec4899',
    svgDataUri: createTemplateLogoSvg(
      '#4f46e5',
      '#ec4899',
      '<path d="M18 7c-2.8 0-4.6 1.8-6 3.6C10.6 8.8 8.8 7 6 7 2.7 7 0 9.7 0 13s2.7 6 6 6c2.8 0 4.6-1.8 6-3.6 1.4 1.8 3.2 3.6 6 3.6 3.3 0 6-2.7 6-6s-2.7-6-6-6zm-12 9c-1.7 0-3-1.3-3-3s1.3-3 3-3c1.8 0 3.2 1.4 4.5 3-1.3 1.6-2.7 3-4.5 3zm12 0c-1.8 0-3.2-1.4-4.5-3 1.3-1.6 2.7-3 4.5-3 1.7 0 3 1.3 3 3s-1.3 3-3 3z"/>'
    ),
  },

  'NeonCard Template': {
    appName: 'NeonCard',
    style: 'Cyberpunk Dark Fintech',
    icon: 'card',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #27272a 100%)',
    accentColor: '#22d3ee',
    svgDataUri: createTemplateLogoSvg(
      '#09090b',
      '#27272a',
      '<path d="M2 5h20c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H2c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2zm0 3v2h20V8H2zm0 5v4h20v-4H2z"/>'
    ),
  },

  'Basic Template (4 Screens)': {
    appName: 'Zenith',
    style: 'Pitch Minimalist',
    icon: 'star',
    bgGradient: 'linear-gradient(135deg, #18181b 0%, #000000 100%)',
    accentColor: '#facc15',
    svgDataUri: createTemplateLogoSvg(
      '#18181b',
      '#000000',
      '<path d="M12 1l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5L12 1z"/>'
    ),
  },

  '3D Showcase (3 Screens)': {
    appName: 'IsoCraft',
    style: 'Isometric Horizon',
    icon: 'layers',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)',
    accentColor: '#8b5cf6',
    svgDataUri: createTemplateLogoSvg(
      '#1e1b4b',
      '#4c1d95',
      '<path d="M12 2L2 7l10 5 10-5-10-5zm0 9L2 16l10 5 10-5-10-5zm0-4.5L4.5 8 12 11.5 19.5 8 12 6.5z"/>'
    ),
  },

  'Lifestyle Showcase (3 Screens)': {
    appName: 'Aura Life',
    style: 'Photographic Editorial',
    icon: 'camera',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #27272a 100%)',
    accentColor: '#f43f5e',
    svgDataUri: createTemplateLogoSvg(
      '#09090b',
      '#27272a',
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-12.8v3.6l-3.1-1.8 3.1-1.8zm2 0l3.1 1.8-3.1 1.8V7.2zm-4.1 4.2l3.1 1.8v3.6l-3.1-5.4zm6.2 0l-3.1 5.4v-3.6l3.1-1.8z"/>'
    ),
  },

  'Continuous Story (5 Screens)': {
    appName: 'Orbit Flow',
    style: 'Midnight Ribbon Story',
    icon: 'nodes',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #4338ca 100%)',
    accentColor: '#818cf8',
    svgDataUri: createTemplateLogoSvg(
      '#0f172a',
      '#4338ca',
      '<path d="M12 2a3 3 0 100 6 3 3 0 000-6zm-7 8a3 3 0 100 6 3 3 0 000-6zm14 0a3 3 0 100 6 3 3 0 000-6zm-7 8a3 3 0 100 6 3 3 0 000-6z"/>'
    ),
  },

  'Social Graphic - Style 1': {
    appName: 'Builder Studio',
    style: 'Clean Studio Light',
    icon: 'studio',
    bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    accentColor: '#3b82f6',
    svgDataUri: createTemplateLogoSvg(
      '#3b82f6',
      '#1d4ed8',
      '<path d="M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2zm0 4h18V5H3v2zm0 2v10h8V9H3zm10 0v10h8V9h-8z"/>'
    ),
  },

  'Social Graphic - Style 2': {
    appName: 'Volt Engine',
    style: 'Charcoal Angled Contrast',
    icon: 'bolt',
    bgGradient: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
    accentColor: '#facc15',
    svgDataUri: createTemplateLogoSvg(
      '#111827',
      '#1f2937',
      '<path d="M13 2L4 13.5h6L8 22l11-12.5h-6.5L13 2z"/>'
    ),
  },

  'Social Graphic - Style 3': {
    appName: 'Obsidian Lux',
    style: 'Obsidian 3D Perspective',
    icon: 'crown-shield',
    bgGradient: 'linear-gradient(135deg, #030712 0%, #111827 100%)',
    accentColor: '#f59e0b',
    svgDataUri: createTemplateLogoSvg(
      '#030712',
      '#111827',
      '<path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4zm-3 8l3-2 3 2 1-3 2 1-1 6H7l-1-6 2-1 1 3z"/>'
    ),
  },

  'Dark Mode Elegance (4 Screens)': {
    appName: 'Velvet Elite',
    style: 'Luxury Onyx Gold',
    icon: 'quill',
    bgGradient: 'linear-gradient(135deg, #0a0a0a 0%, #18181b 100%)',
    accentColor: '#eab308',
    svgDataUri: createTemplateLogoSvg(
      '#0a0a0a',
      '#18181b',
      '<path d="M20.2 3.8a4.5 4.5 0 00-6.4 0L4 13.6V20h6.4l9.8-9.8a4.5 4.5 0 000-6.4zM6 18v-3.2l7.6-7.6 3.2 3.2L9.2 18H6z"/>'
    ),
  },

  'Playful & Vibrant (5 Screens)': {
    appName: 'FunBox',
    style: 'Candy Pop Neon',
    icon: 'gamepad',
    bgGradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
    accentColor: '#f43f5e',
    svgDataUri: createTemplateLogoSvg(
      '#f43f5e',
      '#ec4899',
      '<path d="M6 8a4 4 0 00-4 4c0 2.2 1.3 4 3 4.8l2-1.8A2 2 0 018 14h8a2 2 0 011 1l2 1.8c1.7-.8 3-2.6 3-4.8a4 4 0 00-4-4H6zm1 3h2v1H7v2H6v-2H4v-1h2v-2h1v2zm10 0a1 1 0 11-2 0 1 1 0 012 0zm-2 2a1 1 0 11-2 0 1 1 0 012 0z"/>'
    ),
  },

  'App Preview Banner (1 Screen)': {
    appName: 'Spotlight',
    style: 'Editorial Hero Banner',
    icon: 'crosshair',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    accentColor: '#38bdf8',
    svgDataUri: createTemplateLogoSvg(
      '#0f172a',
      '#1e1b4b',
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 3a4 4 0 100 8 4 4 0 000-8zm-1 3h2v2h-2v-2z"/>'
    ),
  },

  'Split Screen Contrast (4 Screens)': {
    appName: 'Duality',
    style: 'Two-Tone Graphic Split',
    icon: 'yin-yang',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #3f3f46 100%)',
    accentColor: '#f43f5e',
    svgDataUri: createTemplateLogoSvg(
      '#09090b',
      '#3f3f46',
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2v16a8 8 0 010-16z"/>'
    ),
  },

  'Minimalist White (3 Screens)': {
    appName: 'Blanc Studio',
    style: 'Swiss Clean Blanc',
    icon: 'circle',
    bgGradient: 'linear-gradient(135deg, #f4f4f5 0%, #e4e4e7 100%)',
    accentColor: '#18181b',
    svgDataUri: createTemplateLogoSvg(
      '#71717a',
      '#18181b',
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 110 12 6 6 0 010-12z"/>'
    ),
  },

  'AI Sparkle & Copilot (4 Screens)': {
    appName: 'Cognito AI',
    style: 'Luminescent AI Iris',
    icon: 'sparkle',
    bgGradient: 'linear-gradient(135deg, #4338ca 0%, #9333ea 100%)',
    accentColor: '#a855f7',
    svgDataUri: createTemplateLogoSvg(
      '#4338ca',
      '#9333ea',
      '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2zm6.5 11.5l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5z"/>'
    ),
  },

  'Bento Matrix Modern (4 Screens)': {
    appName: 'Matrix Bento',
    style: 'Modular Dark Bento',
    icon: 'grid',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #0284c7 100%)',
    accentColor: '#38bdf8',
    svgDataUri: createTemplateLogoSvg(
      '#0f172a',
      '#0284c7',
      '<path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z"/>'
    ),
  },

  'Fintech Dark Mode Pro (5 Screens)': {
    appName: 'VaultX',
    style: 'Executive Terminal Dark',
    icon: 'vault',
    bgGradient: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)',
    accentColor: '#10b981',
    svgDataUri: createTemplateLogoSvg(
      '#064e3b',
      '#047857',
      '<path d="M12 2a5 5 0 00-5 5v3H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-8a2 2 0 00-2-2h-2V7a5 5 0 00-5-5zm-3 5a3 3 0 016 0v3H9V7zm3 6a2 2 0 110 4 2 2 0 010-4z"/>'
    ),
  },

  'Glassmorphism Frosted Horizon (4 Screens)': {
    appName: 'Frost Glass',
    style: 'Glacier Frosted Glass',
    icon: 'prism',
    bgGradient: 'linear-gradient(135deg, #0369a1 0%, #0891b2 100%)',
    accentColor: '#22d3ee',
    svgDataUri: createTemplateLogoSvg(
      '#0369a1',
      '#0891b2',
      '<path d="M12 2L2 20h20L12 2zm0 4.5L18.5 18H5.5L12 6.5z"/>'
    ),
  },

  'Cyberpunk Neon Glow (4 Screens)': {
    appName: 'NeonPulse',
    style: 'High-Voltage Cyberpunk',
    icon: 'cyber',
    bgGradient: 'linear-gradient(135deg, #d946ef 0%, #06b6d4 100%)',
    accentColor: '#d946ef',
    svgDataUri: createTemplateLogoSvg(
      '#d946ef',
      '#06b6d4',
      '<path d="M3 5h14l4 4v10H7l-4-4V5zm2 2v6.5L7.5 16H19v-6.5L16.5 7H5z"/>'
    ),
  },

  'Minimalist Studio Monochrome (4 Screens)': {
    appName: 'Atelier Mono',
    style: 'Architectural Monolith',
    icon: 'column',
    bgGradient: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
    accentColor: '#a1a1aa',
    svgDataUri: createTemplateLogoSvg(
      '#18181b',
      '#27272a',
      '<path d="M5 3h14v3H5V3zm2 5h10v10H7V8zm-2 12h14v2H5v-2z"/>'
    ),
  },

  'Sunset Velvet Story (5 Screens)': {
    appName: 'Solara Dusk',
    style: 'Sunset Velvet Horizon',
    icon: 'sun',
    bgGradient: 'linear-gradient(135deg, #ea580c 0%, #db2777 100%)',
    accentColor: '#f97316',
    svgDataUri: createTemplateLogoSvg(
      '#ea580c',
      '#db2777',
      '<path d="M12 4a8 8 0 00-8 8h16a8 8 0 00-8-8zm-9 10h18v2H3v-2zm2 4h14v2H5v-2z"/>'
    ),
  },

  'Warm Editorial Magazine (4 Screens)': {
    appName: 'Chronicle',
    style: 'Warm Parchment Editorial',
    icon: 'book',
    bgGradient: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
    accentColor: '#d97706',
    svgDataUri: createTemplateLogoSvg(
      '#78350f',
      '#451a03',
      '<path d="M4 4h14a2 2 0 012 2v14H6a2 2 0 01-2-2V4zm2 2v11h12V6H6zm3 2h6v2H9V8zm0 3h6v2H9v-2z"/>'
    ),
  },

  'SaaS Cloud Enterprise (4 Screens)': {
    appName: 'CloudSphere',
    style: 'Sapphire Enterprise Cloud',
    icon: 'cloud',
    bgGradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
    accentColor: '#60a5fa',
    svgDataUri: createTemplateLogoSvg(
      '#1e40af',
      '#3b82f6',
      '<path d="M19.4 13a6.5 6.5 0 00-12.8-1.5A5 5 0 002 16a5 5 0 005 5h12a4 4 0 00.4-8z"/>'
    ),
  },

  'Duotone Punch (5 Screens)': {
    appName: 'Punch Duotone',
    style: 'Acid Duotone Poster',
    icon: 'speaker',
    bgGradient: 'linear-gradient(135deg, #84cc16 0%, #000000 100%)',
    accentColor: '#84cc16',
    svgDataUri: createTemplateLogoSvg(
      '#84cc16',
      '#18181b',
      '<path d="M11 4L6 8H2v8h4l5 4V4zm4 4a5 5 0 010 8v-2a3 3 0 000-4V8z"/>'
    ),
  },

  'Play Store Vibrant (5 Screens)': {
    appName: 'Nova Launch',
    style: 'Electric Indigo Pulse',
    icon: 'rocket',
    bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)',
    accentColor: '#3b82f6',
    svgDataUri: createTemplateLogoSvg(
      '#3b82f6',
      '#4f46e5',
      '<path d="M12 2.5s3 3 3 7.5c1.5.5 3 2 3.5 3.5l-2.5 1.5 1 4-3.5-2L12 18.5l-1.5-1.5-3.5 2 1-4-2.5-1.5c.5-1.5 2-3 3.5-3.5 0-4.5 3-7.5 3-7.5zm0 5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>'
    ),
  },

  'Android Material You (5 Screens)': {
    appName: 'Material Sync',
    style: 'Material Dynamic Pastel',
    icon: 'petals',
    bgGradient: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
    accentColor: '#a855f7',
    svgDataUri: createTemplateLogoSvg(
      '#7c3aed',
      '#db2777',
      '<path d="M12 2a4 4 0 014 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 014-4zm8 10a4 4 0 01-4 4c-3 0-6-4-6-4s3-4 6-4a4 4 0 014 4zm-8 10a4 4 0 01-4-4c0-3 4-6 4-6s4 3 4 6a4 4 0 01-4 4zm-8-10a4 4 0 014-4c3 0 6 4 6 4s-3 4-6 4a4 4 0 01-4-4z"/>'
    ),
  },

  'Play Store Dark AMOLED (5 Screens)': {
    appName: 'Eclipse AMOLED',
    style: 'AMOLED Midnight Neon',
    icon: 'eclipse',
    bgGradient: 'linear-gradient(135deg, #000000 0%, #18181b 100%)',
    accentColor: '#22c55e',
    svgDataUri: createTemplateLogoSvg(
      '#000000',
      '#18181b',
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 016.9 6A7 7 0 1012 19a7 7 0 010-14z"/>'
    ),
  },

  'Play Store Minimal Glass (5 Screens)': {
    appName: 'Aero Glass',
    style: 'Aero Translucent Ice',
    icon: 'drop',
    bgGradient: 'linear-gradient(135deg, #0284c7 0%, #0f172a 100%)',
    accentColor: '#38bdf8',
    svgDataUri: createTemplateLogoSvg(
      '#0284c7',
      '#0f172a',
      '<path d="M12 2.7S6 9.5 6 14.5a6 6 0 0012 0c0-5-6-11.8-6-11.8zm0 15.3a3.5 3.5 0 01-3.5-3.5c0-1.8 1.8-4.2 3.5-6 1.7 1.8 3.5 4.2 3.5 6a3.5 3.5 0 01-3.5 3.5z"/>'
    ),
  },

  'Play Store Gradient Burst (5 Screens)': {
    appName: 'Solaris Fire',
    style: 'Solar Horizon Flare',
    icon: 'sun-burst',
    bgGradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
    accentColor: '#f97316',
    svgDataUri: createTemplateLogoSvg(
      '#f97316',
      '#dc2626',
      '<path d="M12 1l2.5 8.5L23 12l-8.5 2.5L12 23l-2.5-8.5L1 12l8.5-2.5L12 1zm0 4.2L10.7 10 6 11.3 9.8 13.8 9 18.5 12 16.2l3 2.3-.8-4.7L18 11.3 13.3 10 12 5.2z"/>'
    ),
  },

  'Android Gaming Pro (5 Screens)': {
    appName: 'HyperGaming',
    style: 'Carbon Cyber Toxic',
    icon: 'controller',
    bgGradient: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
    accentColor: '#84cc16',
    svgDataUri: createTemplateLogoSvg(
      '#18181b',
      '#09090b',
      '<path d="M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2zm4 3v2H6v2h2v2h2v-2h2V9H8zm9 1a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-2 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>'
    ),
  },

  'Play Store Split Tone (5 Screens)': {
    appName: 'Slash Studio',
    style: 'Split Horizon Contrast',
    icon: 'slash',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #f43f5e 100%)',
    accentColor: '#f43f5e',
    svgDataUri: createTemplateLogoSvg(
      '#09090b',
      '#f43f5e',
      '<path d="M14 2L6 22h4l8-20h-4z"/>'
    ),
  },

  'Android Productivity (5 Screens)': {
    appName: 'FocusFlow',
    style: 'Zen Focus Mint',
    icon: 'shield-check',
    bgGradient: 'linear-gradient(135deg, #064e3b 0%, #0d9488 100%)',
    accentColor: '#10b981',
    svgDataUri: createTemplateLogoSvg(
      '#064e3b',
      '#0d9488',
      '<path d="M12 2L4 5v6c0 5.5 3.4 10.3 8 11.5 4.6-1.2 8-6 8-11.5V5l-8-3zm-1 14l-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4 1.4L11 16z"/>'
    ),
  },

  'Play Store Fitness Pulse (5 Screens)': {
    appName: 'PulseFit',
    style: 'High-Voltage Cardio',
    icon: 'flame',
    bgGradient: 'linear-gradient(135deg, #991b1b 0%, #ea580c 100%)',
    accentColor: '#ef4444',
    svgDataUri: createTemplateLogoSvg(
      '#991b1b',
      '#ea580c',
      '<path d="M12 2c-3.5 3.5-4 7-2 10.5L7 13l7 9-1-7 4 .5c1-4.5-1-9-5-13.5z"/>'
    ),
  },

  'Android Finance Trust (5 Screens)': {
    appName: 'Nordic Trust',
    style: 'Nordic Sapphire Vault',
    icon: 'diamond',
    bgGradient: 'linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 100%)',
    accentColor: '#0284c7',
    svgDataUri: createTemplateLogoSvg(
      '#0c4a6e',
      '#1e3a8a',
      '<path d="M12 2L2 8.5 12 22l10-13.5L12 2zm0 3.3l6.5 4.2-6.5 9-6.5-9L12 5.3z"/>'
    ),
  },

  'Play Store Social (5 Screens)': {
    appName: 'Wave Social',
    style: 'Holographic Sunset Wave',
    icon: 'chat',
    bgGradient: 'linear-gradient(135deg, #7c3aed 0%, #f43f5e 100%)',
    accentColor: '#ec4899',
    svgDataUri: createTemplateLogoSvg(
      '#7c3aed',
      '#f43f5e',
      '<path d="M18 4H6a4 4 0 00-4 4v5a4 4 0 004 4h1v3l4-3h7a4 4 0 004-4V8a4 4 0 00-4-4zm-8 6a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>'
    ),
  },

  'Android Utility Tools (5 Screens)': {
    appName: 'OmniTool',
    style: 'Precision Industrial Carbon',
    icon: 'wrench',
    bgGradient: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
    accentColor: '#f59e0b',
    svgDataUri: createTemplateLogoSvg(
      '#18181b',
      '#3f3f46',
      '<path d="M14.7 13.3l5.6 5.6a1 1 0 010 1.4l-1.4 1.4a1 1 0 01-1.4 0l-5.6-5.6a6 6 0 01-7.2-7.2l3.4 3.4 2.8-.7.7-2.8-3.4-3.4a6 6 0 016.5 9.3z"/>'
    ),
  },

  'Play Store Education (5 Screens)': {
    appName: 'EduSphere',
    style: 'Scholarly Navy & Amber',
    icon: 'cap',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    accentColor: '#fbbf24',
    svgDataUri: createTemplateLogoSvg(
      '#1e1b4b',
      '#312e81',
      '<path d="M12 3L1 9l11 6 9-4.9V17h2V9L12 3zm-6 9.8v4.4c0 2.5 3 4.5 6 4.5s6-2 6-4.5v-4.4l-6 3.3-6-3.3z"/>'
    ),
  },

  'Play Store Travel (5 Screens)': {
    appName: 'Wanderlust',
    style: 'Wanderlust Coastal Dawn',
    icon: 'globe',
    bgGradient: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
    accentColor: '#0ea5e9',
    svgDataUri: createTemplateLogoSvg(
      '#0284c7',
      '#0d9488',
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 2.1a8 8 0 016.9 7.9H13V4.1zm-2 0V12H4.1A8 8 0 0111 4.1zm-6.9 9.9H11v7.9a8 8 0 01-6.9-7.9zm8.9 7.9V14h6.9a8 8 0 01-6.9 7.9z"/>'
    ),
  },

  'Android Creative Studio (5 Screens)': {
    appName: 'Artisan Pro',
    style: 'Amethyst Artist Canvas',
    icon: 'palette',
    bgGradient: 'linear-gradient(135deg, #581c87 0%, #a855f7 100%)',
    accentColor: '#c084fc',
    svgDataUri: createTemplateLogoSvg(
      '#581c87',
      '#a855f7',
      '<path d="M12 2a10 10 0 00-2 19.8c.6 0 1-.4 1-1 0-.3-.1-.5-.3-.7-.2-.3-.3-.7-.3-1.1 0-1.1.9-2 2-2h1.7c3.5 0 6.3-2.8 6.3-6.3 0-4.8-4-8.7-8.7-8.7zM6.5 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm3-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"/>'
    ),
  },

  'Play Store Feature Graphic (1 Screen)': {
    appName: 'CinemaPlay',
    style: 'Cinematic Billboard Gold',
    icon: 'billboard',
    bgGradient: 'linear-gradient(135deg, #09090b 0%, #451a03 100%)',
    accentColor: '#f59e0b',
    svgDataUri: createTemplateLogoSvg(
      '#09090b',
      '#451a03',
      '<path d="M12 3l3 6 6 .5-4.5 4 1.5 6-6-3.5-6 3.5 1.5-6-4.5-4 6-.5 3-6z"/>'
    ),
  },

  'Android Tablet Pro (4 Screens)': {
    appName: 'TabPro',
    style: 'Executive Slate Horizon',
    icon: 'tablet',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
    accentColor: '#38bdf8',
    svgDataUri: createTemplateLogoSvg(
      '#0f172a',
      '#334155',
      '<path d="M4 3h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2zm0 3v12h7V6H4zm9 0v12h7V6h-7z"/>'
    ),
  },

  'Android Tablet Minimal (4 Screens)': {
    appName: 'TabCanvas',
    style: 'Warm Paper Atelier',
    icon: 'stylus',
    bgGradient: 'linear-gradient(135deg, #78716c 0%, #44403c 100%)',
    accentColor: '#a8a29e',
    svgDataUri: createTemplateLogoSvg(
      '#78716c',
      '#44403c',
      '<path d="M3 4h14a2 2 0 012 2v12a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2zm16 1.4l2.6 2.6-9.6 9.6-2.6.4.4-2.6 9.2-10z"/>'
    ),
  },

  'Play Store Casual Games (6 Screens)': {
    appName: 'Arcade Blast',
    style: 'Arcade Sugar Pop',
    icon: 'joystick',
    bgGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    accentColor: '#ec4899',
    svgDataUri: createTemplateLogoSvg(
      '#ec4899',
      '#8b5cf6',
      '<path d="M12 2a4 4 0 00-4 4c0 1.5.8 2.8 2 3.5V13H8a4 4 0 00-4 4v3h16v-3a4 4 0 00-4-4h-2V9.5c1.2-.7 2-2 2-3.5a4 4 0 00-4-4zm-4 15a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm8 0a1.5 1.5 0 110 3 1.5 1.5 0 010-3z"/>'
    ),
  },

  'Android Security & VPN (5 Screens)': {
    appName: 'CipherVPN',
    style: 'Quantum Cyber Shield',
    icon: 'cipher',
    bgGradient: 'linear-gradient(135deg, #042f2e 0%, #0f766e 100%)',
    accentColor: '#14b8a6',
    svgDataUri: createTemplateLogoSvg(
      '#042f2e',
      '#0f766e',
      '<path d="M12 2L4 5v6c0 5.5 3.4 10.3 8 11.5 4.6-1.2 8-6 8-11.5V5l-8-3zm0 5a3 3 0 013 3v2h-6v-2a3 3 0 013-3zm-4 7h8v4H8v-4z"/>'
    ),
  },

  'Play Store E-Commerce (5 Screens)': {
    appName: 'Boutique Luxe',
    style: 'High-Street Luxury Minimal',
    icon: 'bag',
    bgGradient: 'linear-gradient(135deg, #831843 0%, #db2777 100%)',
    accentColor: '#f43f5e',
    svgDataUri: createTemplateLogoSvg(
      '#831843',
      '#db2777',
      '<path d="M16 6V4a4 4 0 00-8 0v2H3v14a2 2 0 002 2h14a2 2 0 002-2V6h-5zm-6-2a2 2 0 014 0v2h-4V4zm-2 7a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z"/>'
    ),
  },

  'Android Weather App (5 Screens)': {
    appName: 'Nimbus Weather',
    style: 'Atmospheric Azure Storm',
    icon: 'weather',
    bgGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
    accentColor: '#38bdf8',
    svgDataUri: createTemplateLogoSvg(
      '#0284c7',
      '#38bdf8',
      '<path d="M19 10a5 5 0 00-9.8-1.4A4 4 0 003 12a4 4 0 004 4h1l-1 4 4-2-1 3 5-6h-3l2-3H7a2 2 0 010-4 3 3 0 015-1.5A3 3 0 0117 9a3 3 0 012 1z"/>'
    ),
  },

  'Play Store Photography (5 Screens)': {
    appName: 'Darkroom Pro',
    style: 'Darkroom Matte Obsidian',
    icon: 'iris',
    bgGradient: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
    accentColor: '#e4e4e7',
    svgDataUri: createTemplateLogoSvg(
      '#18181b',
      '#09090b',
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3c1.7 0 3.2.6 4.4 1.6l-3.4 4.5V5.1A7 7 0 0112 5zm-5.4 3l4.5 3.4H5.1A7 7 0 016.6 8zm-1.5 6.9A7 7 0 015.1 13h5.9l-4.5 3.4a7 7 0 01-1.4-1.5zm6.9 4a7 7 0 01-4.4-1.6l3.4-4.5v5.9a7 7 0 011 0.2zm5.4-3l-4.5-3.4h5.9a7 7 0 01-1.4 3.4zm1.5-6.9a7 7 0 010 1.9h-5.9l4.5-3.4a7 7 0 011.4 1.5z"/>'
    ),
  },

  'Android Local Dating (5 Screens)': {
    appName: 'SoulMatch',
    style: 'Warm Romance Blush',
    icon: 'hearts',
    bgGradient: 'linear-gradient(135deg, #e11d48 0%, #fda4af 100%)',
    accentColor: '#f43f5e',
    svgDataUri: createTemplateLogoSvg(
      '#e11d48',
      '#fda4af',
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>'
    ),
  },

  'Play Store Music Player (5 Screens)': {
    appName: 'GrooveBox',
    style: 'Midnight Vinyl Groove',
    icon: 'vinyl',
    bgGradient: 'linear-gradient(135deg, #312e81 0%, #7c3aed 100%)',
    accentColor: '#a855f7',
    svgDataUri: createTemplateLogoSvg(
      '#312e81',
      '#7c3aed',
      '<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-6 8h2v4H6v-4zm4-3h2v10h-2V7zm4 2h2v6h-2V9zm4 2h2v2h-2v-2z"/>'
    ),
  },
};
