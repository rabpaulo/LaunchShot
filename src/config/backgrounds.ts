export interface BackgroundPreset {
  id: string;
  name: string;
  value: string;
  category: 'Mesh & Gradients' | 'Solids & Neutrals';
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
    id: 'emerald-luxury',
    name: 'Emerald Forest',
    value: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    value: 'linear-gradient(135deg, #d946ef 0%, #8b5cf6 50%, #0ea5e9 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'midnight-violet',
    name: 'Midnight Violet',
    value: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'warm-amber',
    name: 'Warm Amber',
    value: 'linear-gradient(135deg, #d97706 0%, #ea580c 50%, #dc2626 100%)',
    category: 'Mesh & Gradients',
    textColor: '#ffffff',
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    value: 'linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #60a5fa 100%)',
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
];
