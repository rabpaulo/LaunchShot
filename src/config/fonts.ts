export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  category: 'Modern Sans' | 'Display / Editorial' | 'Tech & Grotesk';
}

export const FONT_OPTIONS: FontOption[] = [
  // Modern Sans
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', fontFamily: "'Plus Jakarta Sans', sans-serif", category: 'Modern Sans' },
  { id: 'inter', name: 'Inter', fontFamily: "'Inter', sans-serif", category: 'Modern Sans' },
  { id: 'outfit', name: 'Outfit', fontFamily: "'Outfit', sans-serif", category: 'Modern Sans' },
  { id: 'poppins', name: 'Poppins', fontFamily: "'Poppins', sans-serif", category: 'Modern Sans' },
  { id: 'montserrat', name: 'Montserrat', fontFamily: "'Montserrat', sans-serif", category: 'Modern Sans' },
  { id: 'dm-sans', name: 'DM Sans', fontFamily: "'DM Sans', sans-serif", category: 'Modern Sans' },
  { id: 'manrope', name: 'Manrope', fontFamily: "'Manrope', sans-serif", category: 'Modern Sans' },
  { id: 'nunito', name: 'Nunito', fontFamily: "'Nunito', sans-serif", category: 'Modern Sans' },

  // Tech & Grotesk
  { id: 'space-grotesk', name: 'Space Grotesk', fontFamily: "'Space Grotesk', sans-serif", category: 'Tech & Grotesk' },
  { id: 'sora', name: 'Sora', fontFamily: "'Sora', sans-serif", category: 'Tech & Grotesk' },
  { id: 'syne', name: 'Syne', fontFamily: "'Syne', sans-serif", category: 'Tech & Grotesk' },
  
  // Display / Editorial
  { id: 'bebas-neue', name: 'Bebas Neue', fontFamily: "'Bebas Neue', sans-serif", category: 'Display / Editorial' },
  { id: 'oswald', name: 'Oswald', fontFamily: "'Oswald', sans-serif", category: 'Display / Editorial' },
  { id: 'playfair', name: 'Playfair Display', fontFamily: "'Playfair Display', serif", category: 'Display / Editorial' },
  { id: 'lora', name: 'Lora', fontFamily: "'Lora', serif", category: 'Display / Editorial' },
  { id: 'fraunces', name: 'Fraunces', fontFamily: "'Fraunces', serif", category: 'Display / Editorial' },
];

export const DEFAULT_FONT = 'plus-jakarta';
