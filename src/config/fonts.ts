export interface FontOption {
  id: string;
  name: string;
  fontFamily: string;
  category: 'Modern Sans' | 'Display / Editorial' | 'Tech & Grotesk';
}

export const FONT_OPTIONS: FontOption[] = [
  { 
    id: 'plus-jakarta', 
    name: 'Plus Jakarta Sans (Default)', 
    fontFamily: "'Plus Jakarta Sans', sans-serif", 
    category: 'Modern Sans' 
  },
  { 
    id: 'inter', 
    name: 'Inter', 
    fontFamily: "'Inter', sans-serif", 
    category: 'Modern Sans' 
  },
  { 
    id: 'outfit', 
    name: 'Outfit', 
    fontFamily: "'Outfit', sans-serif", 
    category: 'Modern Sans' 
  },
  { 
    id: 'poppins', 
    name: 'Poppins', 
    fontFamily: "'Poppins', sans-serif", 
    category: 'Modern Sans' 
  },
  { 
    id: 'montserrat', 
    name: 'Montserrat', 
    fontFamily: "'Montserrat', sans-serif", 
    category: 'Modern Sans' 
  },
  { 
    id: 'playfair', 
    name: 'Playfair Display', 
    fontFamily: "'Playfair Display', serif", 
    category: 'Display / Editorial' 
  },
  { 
    id: 'space-grotesk', 
    name: 'Space Grotesk', 
    fontFamily: "'Space Grotesk', sans-serif", 
    category: 'Tech & Grotesk' 
  },
];

export const DEFAULT_FONT = 'plus-jakarta';
