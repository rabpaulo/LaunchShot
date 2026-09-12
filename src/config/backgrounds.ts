export interface BackgroundPreset {
  id: string;
  name: string;
  value: string;
  category: 'Mesh & Gradients' | 'Solids & Neutrals' | 'Modern Pastels' | 'Radial Glows';
  textColor?: string;
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  // Mesh & Gradients
  {
    id: 'aurora-glow',
    name: 'Aurora Glow',
    value: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'sunset-velvet',
    name: 'Sunset Velvet',
    value: 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #8b5cf6 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    value: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'tinder-flame',
    name: 'Dating Flame',
    value: 'linear-gradient(135deg, #fd297b 0%, #ff5864 50%, #ff655b 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'instagram-vibe',
    name: 'Social Glow',
    value: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'mint-fresh',
    name: 'Mint Glow',
    value: 'linear-gradient(135deg, #34d399 0%, #06b6d4 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'charcoal-mesh',
    name: 'Deep Obsidian',
    value: 'linear-gradient(135deg, #090d16 0%, #1e293b 60%, #334155 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },

  // Radial Glows
  {
    id: 'apple-spotlight',
    name: 'Studio Spotlight',
    value: 'radial-gradient(circle at 50% 0%, #334155 0%, #0f172a 60%, #000000 100%)',
    category: 'Radial Glows',
    textColor: '#ffffff',
  },
  {
    id: 'emerald-center',
    name: 'Emerald Core',
    value: 'radial-gradient(circle at 50% 50%, #059669 0%, #064e3b 80%, #022c22 100%)',
    category: 'Radial Glows',
    textColor: '#ffffff',
  },
  {
    id: 'neon-abyss',
    name: 'Neon Abyss',
    value: 'radial-gradient(circle at 80% 20%, #4c1d95 0%, #000000 70%)',
    category: 'Radial Glows',
    textColor: '#ffffff',
  },
  {
    id: 'rose-gold-radial',
    name: 'Rose Gold',
    value: 'radial-gradient(circle at 20% 80%, #fda4af 0%, #be123c 60%, #4c0519 100%)',
    category: 'Radial Glows',
    textColor: '#ffffff',
  },
  {
    id: 'sapphire-glow',
    name: 'Sapphire Glow',
    value: 'radial-gradient(circle at top right, #2563eb 0%, #172554 80%)',
    category: 'Radial Glows',
    textColor: '#ffffff',
  },

  // Modern Pastels
  {
    id: 'pastel-blush',
    name: 'Blush Pink',
    value: '#fce7f3',
    category: 'Modern Pastels',
    textColor: '#831843',
  },
  {
    id: 'pastel-sage',
    name: 'Sage Green',
    value: '#d1fae5',
    category: 'Modern Pastels',
    textColor: '#064e3b',
  },
  {
    id: 'pastel-sky',
    name: 'Sky Blue',
    value: '#e0f2fe',
    category: 'Modern Pastels',
    textColor: '#082f49',
  },
  {
    id: 'pastel-lavender',
    name: 'Soft Lavender',
    value: '#f3e8ff',
    category: 'Modern Pastels',
    textColor: '#3b0764',
  },
  {
    id: 'pastel-butter',
    name: 'Butter Yellow',
    value: '#fef3c7',
    category: 'Modern Pastels',
    textColor: '#713f12',
  },
  {
    id: 'pastel-peach',
    name: 'Soft Peach',
    value: '#ffedd5',
    category: 'Modern Pastels',
    textColor: '#7c2d12',
  },

  // Solids & Neutrals
  {
    id: 'pure-dark',
    name: 'Pitch Black',
    value: '#000000',
    category: 'Solids & Neutrals',
    textColor: '#ffffff',
  },
  {
    id: 'slate-dark',
    name: 'Dark Slate',
    value: '#0f172a',
    category: 'Solids & Neutrals',
    textColor: '#ffffff',
  },
  {
    id: 'clean-white',
    name: 'Pure White',
    value: '#ffffff',
    category: 'Solids & Neutrals',
    textColor: '#0f172a',
  },
  {
    id: 'soft-pearl',
    name: 'Soft Pearl',
    value: '#f8fafc',
    category: 'Solids & Neutrals',
    textColor: '#0f172a',
  },
  {
    id: 'warm-sand',
    name: 'Warm Sand',
    value: '#f5f5f4',
    category: 'Solids & Neutrals',
    textColor: '#1c1917',
  },
  {
    id: 'duolingo-green',
    name: 'Language Green',
    value: '#58cc02',
    category: 'Solids & Neutrals',
    textColor: '#ffffff',
  },
  {
    id: 'twitter-blue',
    name: 'Social Blue',
    value: '#1da1f2',
    category: 'Solids & Neutrals',
    textColor: '#ffffff',
  },
];

export interface BackdropEffects {
  overlay: boolean;
  effects: boolean;
  pattern: boolean;
  vignette: boolean;
  mode: 'none' | 'solid' | 'gradient' | 'image';
}

export const DEFAULT_BACKDROP_EFFECTS: BackdropEffects = {
  overlay: false,
  effects: false,
  pattern: false,
  vignette: false,
  mode: 'solid',
};

export const POSTSPARK_COLOR_PALETTE: string[] = [
  // Row 1: Soft Pastels
  '#fdf2f8', '#fff1f2', '#fff7ed', '#fefce8', '#f0fdf4', '#ecfeff', '#eff6ff', '#faf5ff',
  // Row 2: Fresh Tones
  '#fce7f3', '#ffe4e6', '#ffedd5', '#fef9c3', '#dcfce7', '#cffafe', '#dbeafe', '#f3e8ff',
  // Row 3: Modern Neutrals & Monochromes
  '#ffffff', '#f8fafc', '#e2e8f0', '#94a3b8', '#64748b', '#334155', '#1e293b', '#09090b',
  // Row 4: Bright Accents
  '#f43f5e', '#fb923c', '#facc15', '#4ade80', '#2dd4bf', '#38bdf8', '#818cf8', '#c084fc',
  // Row 5: Deep & Jewel Tones
  '#be123c', '#c2410c', '#a16207', '#15803d', '#0f766e', '#0369a1', '#4338ca', '#7e22ce',
];

