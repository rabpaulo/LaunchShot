export type TargetSizeId = 
  // iPhone
  | 'ios-6.9'
  | 'ios-6.5'
  | 'ios-6.3'
  | 'ios-5.8'
  | 'ios-5.5'
  | 'ios-4.7'
  // Samsung Galaxy S20 -> S26
  | 'samsung-s26-ultra'
  | 'samsung-s26'
  | 'samsung-s25-ultra'
  | 'samsung-s25'
  | 'samsung-s24-ultra'
  | 'samsung-s24'
  | 'samsung-s23-ultra'
  | 'samsung-s23'
  | 'samsung-s22-ultra'
  | 'samsung-s22'
  | 'samsung-s21-ultra'
  | 'samsung-s21'
  | 'samsung-s20-ultra'
  | 'samsung-s20'
  // General Android
  | 'android-tall'
  | 'android-16-9';

export interface TargetSizeConfig {
  id: TargetSizeId;
  name: string;
  category: 'iPhone' | 'Samsung Galaxy' | 'Android';
  width: number;
  height: number;
  logicalWidth: number;
  logicalHeight: number;
  pixelRatio: number;
}

export const TARGET_SIZES: Record<TargetSizeId, TargetSizeConfig> = {
  // iPhone
  'ios-6.9': {
    id: 'ios-6.9',
    name: 'iPhone 16 Pro Max (6.9" 1290x2796)',
    category: 'iPhone',
    width: 1290,
    height: 2796,
    logicalWidth: 430,
    logicalHeight: 932,
    pixelRatio: 3,
  },
  'ios-6.5': {
    id: 'ios-6.5',
    name: 'iPhone 11 Pro Max / XS Max (6.5" 1284x2778)',
    category: 'iPhone',
    width: 1284,
    height: 2778,
    logicalWidth: 428,
    logicalHeight: 926,
    pixelRatio: 3,
  },
  'ios-6.3': {
    id: 'ios-6.3',
    name: 'iPhone 16 Pro / 15 Pro (6.3" 1179x2556)',
    category: 'iPhone',
    width: 1179,
    height: 2556,
    logicalWidth: 393,
    logicalHeight: 852,
    pixelRatio: 3,
  },
  'ios-5.8': {
    id: 'ios-5.8',
    name: 'iPhone X / XS / 11 Pro (5.8" 1125x2436)',
    category: 'iPhone',
    width: 1125,
    height: 2436,
    logicalWidth: 375,
    logicalHeight: 812,
    pixelRatio: 3,
  },
  'ios-5.5': {
    id: 'ios-5.5',
    name: 'iPhone 8 Plus / 7 Plus (5.5" 1242x2208)',
    category: 'iPhone',
    width: 1242,
    height: 2208,
    logicalWidth: 414,
    logicalHeight: 736,
    pixelRatio: 3,
  },
  'ios-4.7': {
    id: 'ios-4.7',
    name: 'iPhone SE / 8 (4.7" 750x1334)',
    category: 'iPhone',
    width: 750,
    height: 1334,
    logicalWidth: 375,
    logicalHeight: 667,
    pixelRatio: 2,
  },

  // Samsung Galaxy S26
  'samsung-s26-ultra': {
    id: 'samsung-s26-ultra',
    name: 'Galaxy S26 Ultra (1440x3120 QHD+)',
    category: 'Samsung Galaxy',
    width: 1440,
    height: 3120,
    logicalWidth: 480,
    logicalHeight: 1040,
    pixelRatio: 3,
  },
  'samsung-s26': {
    id: 'samsung-s26',
    name: 'Galaxy S26 / S26+ (1080x2340 FHD+)',
    category: 'Samsung Galaxy',
    width: 1080,
    height: 2340,
    logicalWidth: 360,
    logicalHeight: 780,
    pixelRatio: 3,
  },

  // Samsung Galaxy S25
  'samsung-s25-ultra': {
    id: 'samsung-s25-ultra',
    name: 'Galaxy S25 Ultra (1440x3120 QHD+)',
    category: 'Samsung Galaxy',
    width: 1440,
    height: 3120,
    logicalWidth: 480,
    logicalHeight: 1040,
    pixelRatio: 3,
  },
  'samsung-s25': {
    id: 'samsung-s25',
    name: 'Galaxy S25 / S25+ (1080x2340 FHD+)',
    category: 'Samsung Galaxy',
    width: 1080,
    height: 2340,
    logicalWidth: 360,
    logicalHeight: 780,
    pixelRatio: 3,
  },

  // Samsung Galaxy S24
  'samsung-s24-ultra': {
    id: 'samsung-s24-ultra',
    name: 'Galaxy S24 Ultra (1440x3120 QHD+)',
    category: 'Samsung Galaxy',
    width: 1440,
    height: 3120,
    logicalWidth: 480,
    logicalHeight: 1040,
    pixelRatio: 3,
  },
  'samsung-s24': {
    id: 'samsung-s24',
    name: 'Galaxy S24 / S24+ (1080x2340 FHD+)',
    category: 'Samsung Galaxy',
    width: 1080,
    height: 2340,
    logicalWidth: 360,
    logicalHeight: 780,
    pixelRatio: 3,
  },

  // Samsung Galaxy S23
  'samsung-s23-ultra': {
    id: 'samsung-s23-ultra',
    name: 'Galaxy S23 Ultra (1440x3088 QHD+)',
    category: 'Samsung Galaxy',
    width: 1440,
    height: 3088,
    logicalWidth: 480,
    logicalHeight: 1030,
    pixelRatio: 3,
  },
  'samsung-s23': {
    id: 'samsung-s23',
    name: 'Galaxy S23 / S23+ (1080x2340 FHD+)',
    category: 'Samsung Galaxy',
    width: 1080,
    height: 2340,
    logicalWidth: 360,
    logicalHeight: 780,
    pixelRatio: 3,
  },

  // Samsung Galaxy S22
  'samsung-s22-ultra': {
    id: 'samsung-s22-ultra',
    name: 'Galaxy S22 Ultra (1440x3088 QHD+)',
    category: 'Samsung Galaxy',
    width: 1440,
    height: 3088,
    logicalWidth: 480,
    logicalHeight: 1030,
    pixelRatio: 3,
  },
  'samsung-s22': {
    id: 'samsung-s22',
    name: 'Galaxy S22 / S22+ (1080x2340 FHD+)',
    category: 'Samsung Galaxy',
    width: 1080,
    height: 2340,
    logicalWidth: 360,
    logicalHeight: 780,
    pixelRatio: 3,
  },

  // Samsung Galaxy S21
  'samsung-s21-ultra': {
    id: 'samsung-s21-ultra',
    name: 'Galaxy S21 Ultra (1440x3200 QHD+)',
    category: 'Samsung Galaxy',
    width: 1440,
    height: 3200,
    logicalWidth: 480,
    logicalHeight: 1066,
    pixelRatio: 3,
  },
  'samsung-s21': {
    id: 'samsung-s21',
    name: 'Galaxy S21 / S21+ / FE (1080x2400 FHD+)',
    category: 'Samsung Galaxy',
    width: 1080,
    height: 2400,
    logicalWidth: 360,
    logicalHeight: 800,
    pixelRatio: 3,
  },

  // Samsung Galaxy S20
  'samsung-s20-ultra': {
    id: 'samsung-s20-ultra',
    name: 'Galaxy S20 Ultra (1440x3200 QHD+)',
    category: 'Samsung Galaxy',
    width: 1440,
    height: 3200,
    logicalWidth: 480,
    logicalHeight: 1066,
    pixelRatio: 3,
  },
  'samsung-s20': {
    id: 'samsung-s20',
    name: 'Galaxy S20 / S20+ / FE (1080x2400 FHD+)',
    category: 'Samsung Galaxy',
    width: 1080,
    height: 2400,
    logicalWidth: 360,
    logicalHeight: 800,
    pixelRatio: 3,
  },

  // General Android
  'android-tall': {
    id: 'android-tall',
    name: 'Android Tall 20:9 (1080x2400)',
    category: 'Android',
    width: 1080,
    height: 2400,
    logicalWidth: 360,
    logicalHeight: 800,
    pixelRatio: 3,
  },
  'android-16-9': {
    id: 'android-16-9',
    name: 'Android Standard 16:9 (1080x1920)',
    category: 'Android',
    width: 1080,
    height: 1920,
    logicalWidth: 360,
    logicalHeight: 640,
    pixelRatio: 3,
  },
};

export const DEFAULT_SIZE: TargetSizeId = 'ios-6.5';
