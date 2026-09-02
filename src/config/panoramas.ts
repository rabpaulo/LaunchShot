export interface PanoramaPreset {
  id: string;
  name: string;
  description: string;
  background: string;
  textColor: string;
}

export interface PanoramaSettings {
  enabled: boolean;
  presetId?: string;
  customBackground?: string;
  imageSrc?: string;
}

export const PANORAMA_PRESETS: PanoramaPreset[] = [
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    description: 'Vibrant cosmic teal, indigo, and ultraviolet continuous glow',
    background: 'linear-gradient(90deg, #090d16 0%, #0f2b38 25%, #1e1b4b 50%, #311042 75%, #090d16 100%)',
    textColor: '#ffffff',
  },
  {
    id: 'sunset-horizon',
    name: 'Sunset Horizon',
    description: 'Warm flowing gradient from golden amber to deep coral crimson',
    background: 'linear-gradient(90deg, #180d2b 0%, #4a154b 25%, #8b1e42 50%, #d9532f 75%, #f59e0b 100%)',
    textColor: '#ffffff',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon Pulse',
    description: 'High-contrast electric violet, magenta, and cyan mesh',
    background: 'linear-gradient(90deg, #050510 0%, #170d38 25%, #4f1d6b 50%, #0e3d54 75%, #050510 100%)',
    textColor: '#ffffff',
  },
  {
    id: 'emerald-flow',
    name: 'Emerald Flow',
    description: 'Deep forest green transitioning through rich jade and mint neon',
    background: 'linear-gradient(90deg, #041d14 0%, #064e3b 30%, #047857 60%, #10b981 85%, #064e3b 100%)',
    textColor: '#ffffff',
  },
  {
    id: 'deep-space',
    name: 'Deep Space Nebula',
    description: 'Minimalist dark obsidian with starry purple starlight drifts',
    background: 'linear-gradient(90deg, #020204 0%, #0a0a1a 30%, #181133 60%, #0c081e 85%, #020204 100%)',
    textColor: '#ffffff',
  },
  {
    id: 'clean-slate-light',
    name: 'Studio Clean Light',
    description: 'Crisp minimal white, platinum, and subtle pastel grey transition',
    background: 'linear-gradient(90deg, #f8fafc 0%, #eff6ff 30%, #fdf2f8 60%, #fefce8 85%, #f8fafc 100%)',
    textColor: '#0f172a',
  },
  {
    id: 'royal-indigo',
    name: 'Royal Indigo Horizon',
    description: 'Executive sapphire blue and royal purple continuous wash',
    background: 'linear-gradient(90deg, #0f172a 0%, #1e1b4b 25%, #2e1065 50%, #172554 75%, #0f172a 100%)',
    textColor: '#ffffff',
  },
  {
    id: 'electric-peach',
    name: 'Electric Peach & Gold',
    description: 'Warm creator aesthetic with bright coral, peach, and gold highlights',
    background: 'linear-gradient(90deg, #fff7ed 0%, #fed7aa 30%, #fecdd3 60%, #fed7aa 85%, #ffedd5 100%)',
    textColor: '#1c1917',
  }
];

export function getPanoramaSliceStyle(
  index: number,
  totalCanvases: number,
  panorama: PanoramaSettings
): { background?: string; backgroundSize?: string; backgroundPosition?: string; backgroundImage?: string; backgroundRepeat?: string } {
  if (!panorama.enabled || totalCanvases <= 0) return {};

  const preset = PANORAMA_PRESETS.find(p => p.id === panorama.presetId) || PANORAMA_PRESETS[0];
  const bg = panorama.customBackground || (panorama.imageSrc ? `url(${panorama.imageSrc})` : preset.background);
  const isImageOrGradient = bg.startsWith('url') || bg.includes('gradient');

  // If there's only 1 canvas, show 100% of the background
  if (totalCanvases === 1) {
    return {
      ...(isImageOrGradient ? { backgroundImage: bg } : { background: bg }),
      backgroundSize: '100% 100%',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    };
  }

  // Calculate slice percentage
  const posX = (index / (totalCanvases - 1)) * 100;

  if (panorama.imageSrc) {
    return {
      backgroundImage: `url(${panorama.imageSrc})`,
      backgroundSize: `${totalCanvases * 100}% 100%`,
      backgroundPosition: `${posX}% center`,
      backgroundRepeat: 'no-repeat',
    };
  }

  return {
    ...(isImageOrGradient ? { backgroundImage: bg } : { background: bg }),
    backgroundSize: `${totalCanvases * 100}% 100%`,
    backgroundPosition: `${posX}% center`,
    backgroundRepeat: 'no-repeat',
  };
}
