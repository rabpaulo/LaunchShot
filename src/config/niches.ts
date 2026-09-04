import type { CanvasItem, LayoutType, MockupStyle } from '@/store/useEditorStore';
import { type BadgeConfig, BADGE_PRESETS } from '@/config/badges';
import type { DoodleConfig } from '@/config/doodles';

export interface NicheCopyItem {
  title: string;
  subtitle: string;
  badge?: BadgeConfig;
  doodle?: DoodleConfig;
  layout?: LayoutType;
}

export interface NicheTemplate {
  name: string;
  keywords: string[];
  theme: {
    fontFamily: string;
    colors: string[];
    mockupStyle: MockupStyle;
  };
  layouts: LayoutType[];
  copy: NicheCopyItem[];
}

export interface NicheCategoryMeta {
  id: string;
  name: string;
  query: string;
}

export const NICHE_CATEGORIES_LIST: NicheCategoryMeta[] = [
  { id: 'ai', name: 'AI & Copilots', query: 'ai' },
  { id: 'finance', name: 'Finance & Crypto', query: 'finance' },
  { id: 'fitness', name: 'Fitness & Workout', query: 'fitness' },
  { id: 'nutrition', name: 'Nutrition & Macros', query: 'nutrition' },
  { id: 'meditation', name: 'Meditation & Sleep', query: 'meditation' },
  { id: 'productivity', name: 'Productivity & Notes', query: 'productivity' },
  { id: 'habits', name: 'Habits & Streaks', query: 'habits' },
  { id: 'dating', name: 'Dating & Relationships', query: 'dating' },
  { id: 'ecommerce', name: 'Shopping & Fashion', query: 'ecommerce' },
  { id: 'travel', name: 'Travel & Flights', query: 'travel' },
  { id: 'food', name: 'Food Delivery & Dining', query: 'food' },
  { id: 'social', name: 'Social & Messaging', query: 'social' },
  { id: 'education', name: 'Education & Language', query: 'education' },
  { id: 'music', name: 'Music & Audio', query: 'music' },
  { id: 'photo', name: 'Photo & Video Editor', query: 'photo' },
  { id: 'gaming', name: 'Gaming & Esports', query: 'gaming' },
  { id: 'news', name: 'News & Magazines', query: 'news' },
  { id: 'realestate', name: 'Real Estate & Rentals', query: 'realestate' },
  { id: 'vpn', name: 'VPN & Privacy', query: 'vpn' },
  { id: 'health', name: 'Health & Medical', query: 'health' },
  { id: 'parenting', name: 'Baby & Parenting', query: 'parenting' },
  { id: 'pets', name: 'Pet Care & Training', query: 'pets' },
  { id: 'smarthome', name: 'Smart Home & IoT', query: 'smarthome' },
  { id: 'books', name: 'Books & Summaries', query: 'books' },
  { id: 'weather', name: 'Weather & Outdoors', query: 'weather' },
  { id: 'events', name: 'Events & Nightlife', query: 'events' },
  { id: 'automotive', name: 'Auto & Mileage', query: 'automotive' },
  { id: 'mentalhealth', name: 'Mental Health & CBT', query: 'mentalhealth' },
  { id: 'astrology', name: 'Astrology & Horoscope', query: 'astrology' },
  { id: 'business', name: 'Business & Invoicing', query: 'business' },
  { id: 'utilities', name: 'Utilities & Scanner', query: 'utilities' },
];


export const NICHE_TEMPLATES: Record<string, NicheTemplate> = {
  ai: {
    name: 'AI & Smart Copilot',
    keywords: ['ai', 'gpt', 'llm', 'chatgpt', 'bot', 'assistant', 'prompt', 'generate', 'copilot', 'smart', 'intelligence', 'claude', 'gemini'],
    theme: {
      fontFamily: 'space-grotesk',
      colors: [
        'radial-gradient(circle at 50% 0%, #312e81 0%, #0f172a 60%, #000000 100%)',
        'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
        '#090d16',
        'radial-gradient(circle at 50% 50%, #4338ca 0%, #1e1b4b 80%, #000000 100%)'
      ],
      mockupStyle: 'glass',
    },
    layouts: ['hero-3d-center', 'half-right', 'basic-top', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Supercharge Your Intelligence',
        subtitle: 'Your personal AI companion for writing, research, and coding.',
        badge: BADGE_PRESETS[9].config,
      },
      {
        title: 'Instant Answers with Sources',
        subtitle: 'Deep synthesis across live web knowledge in under two seconds.',
      },
      {
        title: 'Generate Content & Code',
        subtitle: 'From complex documents to creative masterworks with just one prompt.',
      },
      {
        title: 'Private & On-Device Processing',
        subtitle: 'Your personal prompts and data never train public AI models.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Experience Next-Gen AI Today',
        subtitle: 'Join over 10M+ thinkers unlocking superhuman productivity.',
        badge: BADGE_PRESETS[2].config,
      },
    ],
  },

  finance: {
    name: 'Finance, Banking & Crypto',
    keywords: ['finance', 'bank', 'money', 'budget', 'crypto', 'invest', 'trading', 'wallet', 'stocks', 'expense', 'wealth', 'fintech', 'accounting'],
    theme: {
      fontFamily: 'inter',
      colors: ['#0a2216', '#090d16', '#0f172a', '#1e293b', '#042f2e'],
      mockupStyle: 'dark',
    },
    layouts: ['banner-stack-right', 'half-right', '3d-isometric-right', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Money Management, Simplified',
        subtitle: 'Spend, save, and invest with total clarity all in one place.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Real-Time Expense Tracking',
        subtitle: 'Automatic transaction categorization across all your connected banks.',
      },
      {
        title: 'Grow Wealth on Autopilot',
        subtitle: 'Invest in stocks, ETFs, and crypto with zero commission fees.',
      },
      {
        title: 'Bank-Grade 256-bit Security',
        subtitle: 'Biometric locks, instant card freezing, and end-to-end encryption.',
        badge: BADGE_PRESETS[11].config,
      },
      {
        title: 'Take Control of Your Future',
        subtitle: 'Join over 5 million people mastering their financial freedom.',
        badge: BADGE_PRESETS[3].config,
      },
    ],
  },

  fitness: {
    name: 'Fitness & Workout',
    keywords: ['fitness', 'workout', 'gym', 'health', 'exercise', 'weight', 'run', 'lifting', 'muscle', 'crossfit', 'bodybuilding', 'coach', 'trainer', 'strength', 'cardio'],
    theme: {
      fontFamily: 'outfit',
      colors: ['#000000', '#111111', 'linear-gradient(135deg, #18181b 0%, #09090b 100%)', '#1c1917', '#0f172a'],
      mockupStyle: 'clay-dark',
    },
    layouts: ['basic-top', 'tilt-right', 'tilt-left', 'half-left', 'basic-bottom'],
    copy: [
      {
        title: 'Crush Your Fitness Goals',
        subtitle: 'Personalized workout routines engineered for real, lasting strength.',
        badge: BADGE_PRESETS[5].config,
      },
      {
        title: 'Log Every Rep and Set',
        subtitle: 'Clean, distraction-free tracker with automatic rest timers.',
      },
      {
        title: 'Visualize Muscle Recovery',
        subtitle: 'In-depth muscle heatmaps and 1RM strength progression curves.',
      },
      {
        title: 'Train Anywhere, 100% Offline',
        subtitle: 'No gym reception needed. Complete access anytime, anywhere.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Start Your Transformation',
        subtitle: 'Join 500,000+ athletes leveling up their physical peak.',
        badge: BADGE_PRESETS[2].config,
      },
    ],
  },

  nutrition: {
    name: 'Nutrition & Macros',
    keywords: ['nutrition', 'calorie', 'macros', 'diet', 'meal', 'food log', 'keto', 'fasting', 'protein', 'counter', 'healthy', 'recipes'],
    theme: {
      fontFamily: 'plus-jakarta',
      colors: ['#064e3b', '#0f766e', '#134e4a', '#047857', '#065f46'],
      mockupStyle: 'light',
    },
    layouts: ['basic-top', 'half-right', 'tilt-left', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Nutrition Made Effortless',
        subtitle: 'Scan barcodes or snap a photo to log whole meals in seconds.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Hit Your Daily Macro Goals',
        subtitle: 'Smart calorie and protein targets that dynamically adapt to you.',
      },
      {
        title: '1,000+ Healthy Chef Recipes',
        subtitle: 'Filter by high-protein, keto, vegan, and quick 15-minute prep.',
      },
      {
        title: 'Micronutrient & Vitamin Insights',
        subtitle: 'Track 30+ vital nutrients, hydration, and metabolic trends.',
        badge: BADGE_PRESETS[1].config,
      },
      {
        title: 'Build Lifelong Healthy Habits',
        subtitle: 'No restrictive crash diets. Just sustainable, proven results.',
        badge: BADGE_PRESETS[3].config,
      },
    ],
  },

  meditation: {
    name: 'Meditation & Sleep',
    keywords: ['meditation', 'sleep', 'calm', 'mindful', 'breathe', 'relax', 'zen', 'focus', 'anxiety', 'insomnia', 'soundscape', 'peace'],
    theme: {
      fontFamily: 'outfit',
      colors: [
        '#1e1b4b',
        '#312e81',
        '#172554',
        '#0f172a',
        'radial-gradient(circle at 50% 0%, #312e81 0%, #0f172a 60%, #000000 100%)'
      ],
      mockupStyle: 'dark',
    },
    layouts: ['hero-3d-center', 'tilt-right', 'half-left', '3d-isometric-right', 'basic-bottom'],
    copy: [
      {
        title: 'Find Your Calm in Minutes',
        subtitle: 'Daily guided meditations to melt away stress and anxiety.',
        badge: BADGE_PRESETS[2].config,
      },
      {
        title: 'Fall Asleep Faster Tonight',
        subtitle: 'Soothing sleep stories, rain soundscapes, and binaural frequencies.',
      },
      {
        title: 'Breathe Away Overwhelm',
        subtitle: 'Clinically proven 4-7-8 and box breathing exercises for instant relief.',
      },
      {
        title: 'Track Your Mindful Minutes',
        subtitle: 'Seamless Apple Health sync with zero intrusive ads or tracking.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Your Daily Sanctuary',
        subtitle: 'Start your journey to calm, restorative peace right now.',
        badge: BADGE_PRESETS[3].config,
      },
    ],
  },

  productivity: {
    name: 'Productivity & Notes',
    keywords: ['productivity', 'todo', 'task', 'notes', 'calendar', 'focus', 'work', 'project', 'planner', 'organize', 'kanban', 'notion'],
    theme: {
      fontFamily: 'plus-jakarta',
      colors: ['#ffffff', '#f8fafc', '#f1f5f9', '#ffffff', '#f8fafc'],
      mockupStyle: 'light',
    },
    layouts: ['basic-top', 'split-vertical', 'half-right', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Organize Life & Work',
        subtitle: 'The unified workspace for your thoughts, tasks, and grand ambitions.',
        badge: BADGE_PRESETS[5].config,
      },
      {
        title: 'Capture Ideas at Lightspeed',
        subtitle: 'Natural language task entry with smart priority filtering.',
      },
      {
        title: 'Never Miss a Deadline',
        subtitle: 'Custom views: Kanban boards, calendars, and timeline lists.',
      },
      {
        title: 'Seamless Multi-Device Sync',
        subtitle: 'Instant offline support that syncs across phone, tablet, and desktop.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Master Your Time & Focus',
        subtitle: 'Join over 10 million thinkers getting more done every day.',
        badge: BADGE_PRESETS[2].config,
      },
    ],
  },

  habits: {
    name: 'Habits & Streaks',
    keywords: ['habit', 'routine', 'streak', 'atomic', 'discipline', 'goals', 'morning routine', 'self care', 'habits', 'tracker'],
    theme: {
      fontFamily: 'outfit',
      colors: ['#090d16', '#1e1b4b', '#312e81', '#0f172a', '#18181b'],
      mockupStyle: 'clay-dark',
    },
    layouts: ['basic-top', 'tilt-right', 'half-left', '3d-isometric-right', 'basic-bottom'],
    copy: [
      {
        title: 'Build Habits That Stick',
        subtitle: 'Small daily improvements that compound into massive life wins.',
        badge: BADGE_PRESETS[2].config,
      },
      {
        title: 'Never Break Your Streak',
        subtitle: 'Visual momentum trackers, widgets, and gentle smart nudges.',
      },
      {
        title: 'Morning & Night Rituals',
        subtitle: 'Scientifically designed routines for peak focus and restful evenings.',
      },
      {
        title: 'Gamified Milestone Badges',
        subtitle: 'Earn rewards and celebrate consistency with deep visual statistics.',
      },
      {
        title: 'Transform Your Life 1% Daily',
        subtitle: 'Start building your dream routine with zero overwhelm.',
        badge: BADGE_PRESETS[8].config,
      },
    ],
  },

  dating: {
    name: 'Dating & Relationships',
    keywords: ['dating', 'love', 'meet', 'chat', 'match', 'romance', 'singles', 'relationship', 'crush', 'partner', 'flirt', 'tinder', 'hinge'],
    theme: {
      fontFamily: 'poppins',
      colors: [
        'linear-gradient(135deg, #fd297b 0%, #ff5864 50%, #ff655b 100%)',
        'linear-gradient(135deg, #ec4899 0%, #db2777 50%, #9d174d 100%)',
        '#be185d',
        '#9d174d',
        'linear-gradient(135deg, #fda4af 0%, #e11d48 100%)'
      ],
      mockupStyle: 'glass',
    },
    layouts: ['tilt-right', 'half-right', '3d-isometric-left', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Designed to Be Deleted',
        subtitle: 'Meet genuine people who share your authentic values and passions.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Showcase the Real You',
        subtitle: 'Voice prompts, rich photo grids, and creative icebreakers.',
      },
      {
        title: '100% Verified Human Profiles',
        subtitle: 'Advanced photo verification with zero spam and strict bot moderation.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Plan Unforgettable First Dates',
        subtitle: 'Discover curated local restaurants and cozy meetup spots.',
      },
      {
        title: 'Your Next Love Story Begins',
        subtitle: 'Download now and start meaningful conversations today.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  ecommerce: {
    name: 'E-Commerce & Fashion',
    keywords: ['shop', 'store', 'buy', 'ecommerce', 'fashion', 'clothes', 'sale', 'retail', 'sneakers', 'streetwear', 'drops', 'boutique'],
    theme: {
      fontFamily: 'playfair',
      colors: ['#ffffff', '#fafafa', '#f5f5f5', '#111827', '#ffffff'],
      mockupStyle: 'clay-light',
    },
    layouts: ['og-style-1', 'half-right', 'tilt-left', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Discover What Is Trending',
        subtitle: 'Curated designer fashion, exclusive drops, and rare sneaker grails.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'App-Exclusive Secret Drops',
        subtitle: 'Get instant push notifications before limited collections sell out.',
      },
      {
        title: 'Virtual AR Fitting Room',
        subtitle: 'Preview true-to-size fits with cutting-edge 3D camera try-on.',
      },
      {
        title: '1-Tap Express Apple Pay',
        subtitle: 'Lightning-fast secure checkout with free express door delivery.',
        badge: BADGE_PRESETS[11].config,
      },
      {
        title: 'Elevate Your Personal Style',
        subtitle: 'Join over 5 million fashion tastemakers worldwide.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  travel: {
    name: 'Travel & Vacation',
    keywords: ['travel', 'flight', 'hotel', 'vacation', 'trip', 'book', 'explore', 'map', 'itinerary', 'airbnb', 'passport', 'airline'],
    theme: {
      fontFamily: 'montserrat',
      colors: [
        '#0284c7',
        '#0369a1',
        '#075985',
        '#0c4a6e',
        'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)'
      ],
      mockupStyle: 'glass',
    },
    layouts: ['basic-top', 'half-right', 'tilt-right', '3d-isometric-left', 'basic-bottom'],
    copy: [
      {
        title: 'Explore the World for Less',
        subtitle: 'Unlock secret airline fares, boutique villas, and scenic escapes.',
        badge: BADGE_PRESETS[2].config,
      },
      {
        title: 'AI Price Prediction Radar',
        subtitle: 'Know the exact moment to book with 95% price drop accuracy.',
      },
      {
        title: 'All Itineraries in One Place',
        subtitle: 'Offline boarding passes, hotel vouchers, and gate change alerts.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Handpicked Local Guides',
        subtitle: 'Discover hidden waterfalls, rooftop cafes, and scenic views.',
      },
      {
        title: 'Your Next Adventure Awaits',
        subtitle: 'Pack your bags and explore with complete confidence.',
        badge: BADGE_PRESETS[3].config,
      },
    ],
  },

  food: {
    name: 'Food & Dining',
    keywords: ['food', 'recipe', 'cook', 'delivery', 'eat', 'restaurant', 'meal', 'grocery', 'pizza', 'burger', 'dining', 'takeout'],
    theme: {
      fontFamily: 'poppins',
      colors: [
        '#ea580c',
        '#c2410c',
        '#9a3412',
        '#7c2d12',
        'linear-gradient(135deg, #f97316 0%, #ea580c 100%)'
      ],
      mockupStyle: 'clay-light',
    },
    layouts: ['half-right', 'tilt-right', 'split-vertical', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Crave It. Tap It. Enjoy It.',
        subtitle: 'Your favorite local restaurants and chef specials delivered fast.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Live Real-Time GPS Tracking',
        subtitle: 'Watch your order from kitchen prep straight to your doorstep.',
      },
      {
        title: 'Zero Delivery Fee Perks',
        subtitle: 'Unlock unlimited free deliveries with exclusive member perks.',
      },
      {
        title: 'Tailored to Your Dietary Needs',
        subtitle: 'Instant filters for gluten-free, vegan, halal, and high-protein.',
      },
      {
        title: 'Satisfy Your Appetite Today',
        subtitle: 'Order in seconds and feast like royalty.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  social: {
    name: 'Social & Community',
    keywords: ['social', 'network', 'chat', 'message', 'friends', 'community', 'connect', 'share', 'feed', 'post', 'dm', 'discord'],
    theme: {
      fontFamily: 'inter',
      colors: [
        '#2563eb',
        '#1d4ed8',
        '#1e40af',
        '#1e3a8a',
        'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
      ],
      mockupStyle: 'dark',
    },
    layouts: ['basic-top', 'half-right', '3d-isometric-right', 'basic-top', 'basic-bottom'],
    copy: [
      {
        title: 'Connect with Your People',
        subtitle: 'Share authentic moments and hang out in vibrant micro-communities.',
        badge: BADGE_PRESETS[7].config,
      },
      {
        title: 'Lightning Fast & Private Chat',
        subtitle: 'End-to-end encrypted messaging, voice rooms, and crystal video.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Custom Feeds with Zero Ads',
        subtitle: 'See posts from people you actually care about, chronologically.',
      },
      {
        title: 'Express Yourself in Style',
        subtitle: 'Animated avatars, custom themes, and rich multimedia stories.',
      },
      {
        title: 'Join the Conversation Today',
        subtitle: 'Download now and find your digital tribe.',
        badge: BADGE_PRESETS[8].config,
      },
    ],
  },

  education: {
    name: 'Education & Language',
    keywords: ['education', 'learn', 'course', 'study', 'school', 'language', 'student', 'teach', 'flashcard', 'vocabulary', 'exam', 'duolingo'],
    theme: {
      fontFamily: 'plus-jakarta',
      colors: [
        '#059669',
        '#047857',
        '#065f46',
        '#064e3b',
        'linear-gradient(135deg, #10b981 0%, #047857 100%)'
      ],
      mockupStyle: 'glass',
    },
    layouts: ['basic-top', 'tilt-right', 'half-left', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Master Any Skill in 5 Min/Day',
        subtitle: 'Bite-sized, gamified lessons engineered by cognitive scientists.',
        badge: BADGE_PRESETS[2].config,
      },
      {
        title: 'AI Speech & Accent Coach',
        subtitle: 'Real-time voice analysis refines your pronunciation on the spot.',
      },
      {
        title: 'Stay Motivated with Streaks',
        subtitle: 'Compete on global leaderboards and earn mastery badges.',
      },
      {
        title: 'Study 100% Offline Anywhere',
        subtitle: 'Download full modules for uninterrupted learning on flights.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Unlock Your Full Potential',
        subtitle: 'Join over 50 million eager learners worldwide.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  music: {
    name: 'Music & Audio Streaming',
    keywords: ['music', 'audio', 'podcast', 'stream', 'songs', 'sound', 'beats', 'dj', 'album', 'playlist', 'listen', 'spotify'],
    theme: {
      fontFamily: 'outfit',
      colors: ['#121212', '#18181b', 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', '#09090b', '#000000'],
      mockupStyle: 'dark',
    },
    layouts: ['basic-top', 'half-right', '3d-isometric-left', 'tilt-right', 'basic-bottom'],
    copy: [
      {
        title: 'Soundtrack Your Life',
        subtitle: 'Stream over 100M+ songs with lossless studio-master clarity.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Smart AI Daily Mixes',
        subtitle: 'Dynamic playlists that evolve with your taste and daily mood.',
      },
      {
        title: 'Immersive 3D Spatial Audio',
        subtitle: 'Concert-grade surround sound with customizable EQ curves.',
      },
      {
        title: 'Unlimited Offline Downloads',
        subtitle: 'Save playlists directly to device with zero mobile data use.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Feel the Music Everywhere',
        subtitle: 'Start streaming for free and discover your next obsession.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  photo: {
    name: 'Photo & Video Editor',
    keywords: ['photo', 'video', 'camera', 'editor', 'filter', 'preset', 'reels', 'tiktok', 'crop', 'retouch', 'cinematic', 'vsco', 'capcut'],
    theme: {
      fontFamily: 'space-grotesk',
      colors: [
        '#000000',
        '#090d16',
        '#18181b',
        '#27272a',
        'radial-gradient(circle at 50% 0%, #334155 0%, #000000 100%)'
      ],
      mockupStyle: 'glass',
    },
    layouts: ['hero-3d-center', 'tilt-left', 'half-right', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Pro Studio in Your Pocket',
        subtitle: 'Cinematic presets, AI retouching, and precision color curves.',
        badge: BADGE_PRESETS[2].config,
      },
      {
        title: '1-Tap AI Magic Eraser',
        subtitle: 'Flawlessly remove unwanted objects and backgrounds instantly.',
      },
      {
        title: 'Trending Viral Video Beats',
        subtitle: 'Auto-sync multi-clip Reels and TikTok edits to trending audio.',
      },
      {
        title: 'Export Pristine 4K 60FPS',
        subtitle: 'Zero compression artifacting and watermark-free exports.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Unleash Your Visual Artistry',
        subtitle: 'Create viral visual masterpieces in seconds.',
        badge: BADGE_PRESETS[3].config,
      },
    ],
  },

  gaming: {
    name: 'Gaming & Esports',
    keywords: ['gaming', 'game', 'play', 'stream', 'esports', 'arcade', 'multiplayer', 'rpg', 'stats', 'builds', 'clash', 'twitch'],
    theme: {
      fontFamily: 'space-grotesk',
      colors: ['#000000', '#09090b', '#18181b', '#1e1b4b', '#000000'],
      mockupStyle: 'clay-dark',
    },
    layouts: ['3d-isometric-right', '3d-isometric-left', 'basic-top', 'half-right', 'basic-bottom'],
    copy: [
      {
        title: 'Dominate the Leaderboards',
        subtitle: 'Live match analytics, champion meta builds, and pro guides.',
        badge: BADGE_PRESETS[7].config,
      },
      {
        title: 'Real-Time Team Voice Chat',
        subtitle: 'Ultra-low latency audio overlay engineered for competitive play.',
      },
      {
        title: 'AI Match Replay Breakdown',
        subtitle: 'Pinpoint mechanical mistakes and elevate your win rate.',
      },
      {
        title: 'Global Player Ranking Stats',
        subtitle: 'Track ELO progression, head-to-head records, and match history.',
      },
      {
        title: 'Level Up Your Game Today',
        subtitle: 'Join over 20 million passionate gamers worldwide.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  news: {
    name: 'News & Daily Briefs',
    keywords: ['news', 'reader', 'article', 'magazine', 'journal', 'headline', 'read', 'briefing', 'press', 'daily', 'reuters'],
    theme: {
      fontFamily: 'playfair',
      colors: ['#ffffff', '#f8fafc', '#f1f5f9', '#ffffff', '#f8fafc'],
      mockupStyle: 'light',
    },
    layouts: ['basic-top', 'half-right', 'split-vertical', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Stay Informed Without Noise',
        subtitle: 'Unbiased breaking news curated from 1,000+ trusted global publishers.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: '2-Minute Morning Briefs',
        subtitle: 'AI-condensed daily summaries covering what truly matters.',
      },
      {
        title: 'Listen to Audio Articles',
        subtitle: 'Professional narrators let you catch up while on the commute.',
      },
      {
        title: 'Zero Clickbait, 100% Ad-Free',
        subtitle: 'Pure distraction-free typography with customizable reader modes.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Think Clearer, Read Better',
        subtitle: 'Start your smart daily news habit right now.',
        badge: BADGE_PRESETS[1].config,
      },
    ],
  },

  realestate: {
    name: 'Real Estate & Rentals',
    keywords: ['realestate', 'house', 'home', 'rent', 'buy', 'property', 'apartment', 'mortgage', 'realtor', 'listings', 'condo', 'zillow'],
    theme: {
      fontFamily: 'plus-jakarta',
      colors: ['#0f766e', '#0f645c', '#115e59', '#134e4a', '#042f2e'],
      mockupStyle: 'glass',
    },
    layouts: ['basic-top', 'half-right', '3d-isometric-right', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Find Your Dream Home Faster',
        subtitle: 'Browse millions of verified MLS listings with instant price drop alerts.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Immersive 3D Virtual Tours',
        subtitle: 'Walk through properties room-by-room right from your sofa.',
      },
      {
        title: 'Deep Neighborhood Insights',
        subtitle: 'Commute times, school ratings, safety scores, and flood zones.',
      },
      {
        title: 'Instant Mortgage Calculators',
        subtitle: 'Accurately estimate monthly payments, taxes, and equity gains.',
      },
      {
        title: 'Schedule Tours with 1 Tap',
        subtitle: 'Connect with top-rated local agents for private showings.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  vpn: {
    name: 'VPN, Security & Privacy',
    keywords: ['vpn', 'security', 'privacy', 'password', 'proxy', 'encrypt', 'vault', 'cyber', 'adblock', 'shield', 'private', '1password'],
    theme: {
      fontFamily: 'space-grotesk',
      colors: ['#090d16', '#0f172a', '#1e293b', '#022c22', '#000000'],
      mockupStyle: 'dark',
    },
    layouts: ['hero-3d-center', 'tilt-right', 'half-left', '3d-isometric-right', 'basic-bottom'],
    copy: [
      {
        title: 'Total Privacy on Every Network',
        subtitle: 'Military-grade encryption with ultra-fast 10Gbps global servers.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: '1-Tap Global Server Connection',
        subtitle: 'Bypass geo-restrictions and stream your favorite content anywhere.',
      },
      {
        title: 'Block Trackers, Ads & Malware',
        subtitle: 'Built-in threat protection shields all your devices 24/7.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Autofill & Password Vault',
        subtitle: 'Never forget another password or suffer a credential leak.',
        badge: BADGE_PRESETS[11].config,
      },
      {
        title: 'Take Back Your Digital Freedom',
        subtitle: 'Protect your whole family with a single tap.',
        badge: BADGE_PRESETS[0].config,
      },
    ],
  },

  health: {
    name: 'Health & Medical',
    keywords: ['health', 'medical', 'doctor', 'symptom', 'vitals', 'telehealth', 'cycle', 'blood pressure', 'heart rate', 'clinic', 'oura', 'flo'],
    theme: {
      fontFamily: 'plus-jakarta',
      colors: ['#0284c7', '#0369a1', '#0f766e', '#115e59', '#082f49'],
      mockupStyle: 'glass',
    },
    layouts: ['basic-top', 'half-right', 'split-vertical', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Your Health, Fully Decoded',
        subtitle: 'Symptom tracking, vital trends, and personalized clinical insights.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Consult Top Doctors 24/7',
        subtitle: 'Instant chat or HD video consultations from the comfort of home.',
      },
      {
        title: 'Track Holistic Biometrics',
        subtitle: 'Monitor sleep stages, HRV, resting heart rate, and recovery scores.',
      },
      {
        title: 'Strict HIPAA Compliant Privacy',
        subtitle: 'Your medical records are end-to-end encrypted and strictly yours.',
        badge: BADGE_PRESETS[11].config,
      },
      {
        title: 'Prioritize Your Well-Being',
        subtitle: 'Join over 30 million people living healthier lives.',
        badge: BADGE_PRESETS[3].config,
      },
    ],
  },

  parenting: {
    name: 'Parenting & Baby Tracker',
    keywords: ['parenting', 'baby', 'child', 'kids', 'diaper', 'feeding', 'nursing', 'newborn', 'milestone', 'nap', 'huckleberry'],
    theme: {
      fontFamily: 'poppins',
      colors: ['#fce7f3', '#d1fae5', '#e0f2fe', '#fef3c7', '#f3e8ff'],
      mockupStyle: 'clay-light',
    },
    layouts: ['basic-top', 'tilt-right', 'half-left', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Parenting Made Calmer',
        subtitle: 'Track feedings, sleep windows, diapers, and growth leaps effortlessly.',
        badge: BADGE_PRESETS[1].config,
      },
      {
        title: 'Smart Sleep Window Predictor',
        subtitle: 'AI accurately forecasts your baby optimal nap times.',
      },
      {
        title: 'Developmental Milestones',
        subtitle: 'Engaging activities and expert milestones tailored to your baby age.',
      },
      {
        title: 'Seamless Family Sync',
        subtitle: 'Keep parents, grandparents, and nannies in perfect sync.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Enjoy Every Precious Moment',
        subtitle: 'Join 3M+ well-rested parents navigating parenthood with joy.',
        badge: BADGE_PRESETS[2].config,
      },
    ],
  },

  pets: {
    name: 'Pet Care & Training',
    keywords: ['pet', 'dog', 'puppy', 'cat', 'vet', 'training', 'bark', 'clicker', 'walk', 'vaccine', 'grooming', 'rover'],
    theme: {
      fontFamily: 'poppins',
      colors: ['#ea580c', '#d97706', '#059669', '#0284c7', '#7c2d12'],
      mockupStyle: 'clay-light',
    },
    layouts: ['tilt-right', 'half-right', 'tilt-left', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Ultimate Pet Care Companion',
        subtitle: 'Positive reinforcement dog training, health logs, and vet schedules.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: '100+ Step-by-Step Lessons',
        subtitle: 'From basic potty training to advanced obedience and agility tricks.',
      },
      {
        title: 'Medication & Vaccine Tracker',
        subtitle: 'Never miss another flea treatment, vaccine date, or grooming check.',
      },
      {
        title: 'Built-in Smart Clicker Tool',
        subtitle: 'High-frequency training sounds and clicker right on your phone.',
      },
      {
        title: 'Raise a Happy Best Friend',
        subtitle: 'Start training your pup in just 5 minutes a day.',
        badge: BADGE_PRESETS[8].config,
      },
    ],
  },

  smarthome: {
    name: 'Smart Home & IoT',
    keywords: ['smarthome', 'iot', 'homekit', 'lights', 'camera', 'automation', 'thermostat', 'security', 'matter', 'sensor', 'philips'],
    theme: {
      fontFamily: 'space-grotesk',
      colors: ['#090d16', '#1e293b', '#334155', '#0f172a', '#000000'],
      mockupStyle: 'dark',
    },
    layouts: ['hero-3d-center', 'half-right', '3d-isometric-left', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Your Whole Home in Hand',
        subtitle: 'Control lights, locks, cameras, and climate with a single tap.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Automated Living Scenes',
        subtitle: 'Good Morning and Cinema Night scenes trigger without lifting a finger.',
      },
      {
        title: 'Encrypted Live Camera Feeds',
        subtitle: 'Instant smart motion detection with zero-cloud local video storage.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Intelligent Energy Savings',
        subtitle: 'Slash monthly electric bills with automated appliance schedules.',
      },
      {
        title: 'Make Your Home Intelligent',
        subtitle: 'Connect all your smart devices in under 2 minutes.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  books: {
    name: 'Books & Summaries',
    keywords: ['books', 'reading', 'audiobook', 'summary', 'literature', 'library', 'author', 'ebook', 'kindle', 'novel', 'blinkist'],
    theme: {
      fontFamily: 'playfair',
      colors: ['#1c1917', '#292524', '#44403c', '#57534e', '#18181b'],
      mockupStyle: 'light',
    },
    layouts: ['basic-top', 'half-right', 'tilt-left', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Big Ideas in 15 Minutes',
        subtitle: 'Read or listen to key insights from the world bestselling non-fiction.',
        badge: BADGE_PRESETS[2].config,
      },
      {
        title: 'Handpicked Executive Briefs',
        subtitle: 'Master psychology, business leadership, science, and habits fast.',
      },
      {
        title: 'Hands-Free Audio Anywhere',
        subtitle: 'High-caliber voice narration with adjustable playback speeds.',
      },
      {
        title: 'Sync Highlights to Notes',
        subtitle: 'Export memorable quotes directly to Notion, Readwise, and Apple Notes.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Level Up Your Intellect Daily',
        subtitle: 'Join over 30 million lifelong curious minds.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  weather: {
    name: 'Weather & Outdoors',
    keywords: ['weather', 'hiking', 'trails', 'radar', 'forecast', 'outdoor', 'mountain', 'gps', 'rain', 'storm', 'camping', 'alltrails'],
    theme: {
      fontFamily: 'montserrat',
      colors: ['#0284c7', '#0369a1', '#075985', '#0f172a', '#0c4a6e'],
      mockupStyle: 'glass',
    },
    layouts: ['basic-top', 'half-right', '3d-isometric-right', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Hyperlocal Weather Radar',
        subtitle: 'Minute-by-minute precipitation forecasts with live Doppler radar.',
        badge: BADGE_PRESETS[2].config,
      },
      {
        title: 'Discover 400,000+ Trails',
        subtitle: 'Filter by elevation gain, waterfalls, dog-friendly, and difficulty.',
      },
      {
        title: '100% Offline Topo GPS Maps',
        subtitle: 'Stay on trail and navigate safely with zero cellular connection.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Severe Storm & UV Radar',
        subtitle: 'Real-time lightning alerts, UV index, and wildfire smoke maps.',
      },
      {
        title: 'Adventure with Total Peace',
        subtitle: 'Start exploring breathtaking trails with complete confidence.',
        badge: BADGE_PRESETS[0].config,
      },
    ],
  },

  events: {
    name: 'Events & Nightlife',
    keywords: ['events', 'tickets', 'concert', 'nightlife', 'festival', 'gigs', 'party', 'dj', 'club', 'venue', 'dice'],
    theme: {
      fontFamily: 'outfit',
      colors: ['#000000', 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)', '#18181b', '#312e81', '#090d16'],
      mockupStyle: 'dark',
    },
    layouts: ['basic-top', 'half-right', 'tilt-right', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Never Miss an Epic Night',
        subtitle: 'Discover underground gigs, music festivals, and secret warehouse sets.',
        badge: BADGE_PRESETS[7].config,
      },
      {
        title: '100% Locked Mobile Tickets',
        subtitle: 'Fair pricing, instant mobile entry, and secure ticket transfers.',
        badge: BADGE_PRESETS[11].config,
      },
      {
        title: 'Track Your Favorite Artists',
        subtitle: 'Get instant push alerts the moment new world tour dates drop.',
      },
      {
        title: 'Coordinate with Friends',
        subtitle: 'See where friends are going and transfer tickets with 1 tap.',
      },
      {
        title: 'Live the Music in Person',
        subtitle: 'Secure your concert tickets in under 30 seconds.',
        badge: BADGE_PRESETS[8].config,
      },
    ],
  },

  automotive: {
    name: 'Auto & Mileage Tracker',
    keywords: ['automotive', 'car', 'ev', 'charging', 'mileage', 'drive', 'vehicle', 'fuel', 'trips', 'parking', 'mechanic', 'plugshare'],
    theme: {
      fontFamily: 'space-grotesk',
      colors: ['#090d16', '#1e293b', '#0f172a', '#042f2e', '#000000'],
      mockupStyle: 'dark',
    },
    layouts: ['hero-3d-center', 'half-right', 'split-vertical', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Smart Driving, Real Savings',
        subtitle: 'Automatic IRS-compliant mileage logging and live EV charger maps.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Locate Available EV Chargers',
        subtitle: 'Real-time plug availability, charging speeds, and user pricing.',
      },
      {
        title: 'Classify Business vs Personal',
        subtitle: 'Swipe right for business, left for personal in a fraction of a second.',
      },
      {
        title: 'Vehicle Health & Service Logs',
        subtitle: 'Track tire maintenance, battery health, and fuel efficiency.',
      },
      {
        title: 'Maximize Your Tax Savings',
        subtitle: 'Average driver saves over $6,500 in tax write-offs each year.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  mentalhealth: {
    name: 'Mental Health & CBT',
    keywords: ['mentalhealth', 'journal', 'mood', 'therapy', 'cbt', 'diary', 'emotions', 'mind', 'wellness', 'reflection', 'day one'],
    theme: {
      fontFamily: 'plus-jakarta',
      colors: ['#312e81', '#1e1b4b', '#4338ca', '#0f172a', '#3730a3'],
      mockupStyle: 'glass',
    },
    layouts: ['basic-top', 'half-right', 'tilt-left', 'split-vertical', 'basic-bottom'],
    copy: [
      {
        title: 'Safe Sanctuary for Your Mind',
        subtitle: 'Private daily journaling, mood tracking, and guided CBT prompts.',
        badge: BADGE_PRESETS[2].config,
      },
      {
        title: 'Understand Emotional Triggers',
        subtitle: 'Visualize patterns between your daily habits and overall happiness.',
      },
      {
        title: 'Clinically Proven CBT Tools',
        subtitle: 'Reframe negative thought spirals with interactive thought records.',
      },
      {
        title: 'Biometric Lock & Encryption',
        subtitle: 'Zero-knowledge encryption. Nobody can read your entries but you.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Cultivate Inner Peace',
        subtitle: 'Begin your personal healing journey right now.',
        badge: BADGE_PRESETS[3].config,
      },
    ],
  },

  astrology: {
    name: 'Astrology & Horoscope',
    keywords: ['astrology', 'horoscope', 'zodiac', 'natal', 'tarot', 'cosmos', 'birth chart', 'stars', 'planets', 'synastry', 'costar'],
    theme: {
      fontFamily: 'space-grotesk',
      colors: ['#09090b', '#18181b', '#2e1065', '#0f172a', '#000000'],
      mockupStyle: 'dark',
    },
    layouts: ['hero-3d-center', 'tilt-right', 'half-left', '3d-isometric-right', 'basic-bottom'],
    copy: [
      {
        title: 'Astrology with Depth & Truth',
        subtitle: 'Hyper-personalized daily horoscopes and detailed birth chart readings.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Real-Time NASA Coordinates',
        subtitle: 'Accurate planetary transits mapped precisely to your birth moment.',
      },
      {
        title: 'Decode Relationship Chemistry',
        subtitle: 'Synastry charts revealing emotional compatibility and growth paths.',
      },
      {
        title: 'Daily Tarot & Cosmic Guidance',
        subtitle: 'Reflective prompts tuned to the current lunar cycles.',
      },
      {
        title: 'Know Your Cosmic Blueprint',
        subtitle: 'Unlock your personal celestial blueprint today.',
        badge: BADGE_PRESETS[8].config,
      },
    ],
  },

  business: {
    name: 'Business & Invoicing',
    keywords: ['business', 'invoice', 'crm', 'client', 'sales', 'freelance', 'accounting', 'estimates', 'billing', 'receipts', 'quickbooks'],
    theme: {
      fontFamily: 'plus-jakarta',
      colors: ['#0f172a', '#1e293b', '#334155', '#475569', '#0f172a'],
      mockupStyle: 'light',
    },
    layouts: ['banner-stack-right', 'half-right', 'split-vertical', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Run Your Business Anywhere',
        subtitle: 'Professional invoices, instant client estimates, and payment tracking.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Get Paid 2x Faster Online',
        subtitle: 'Accept credit cards, Apple Pay, Stripe, and direct bank transfers.',
        badge: BADGE_PRESETS[11].config,
      },
      {
        title: 'Auto Receipt & Expense Scan',
        subtitle: 'Scan receipts with your camera to extract taxes and line items.',
      },
      {
        title: 'Instant Profit & Loss Reports',
        subtitle: 'Generate clean accountant-ready PDF and CSV summaries in 1 tap.',
      },
      {
        title: 'Elevate Business Operations',
        subtitle: 'Send your first professional invoice in under 60 seconds.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },

  utilities: {
    name: 'Utilities & Scanner',
    keywords: ['utilities', 'scanner', 'tools', 'pdf', 'document', 'ocr', 'convert', 'qr', 'speedtest', 'calculator', 'camscanner'],
    theme: {
      fontFamily: 'inter',
      colors: ['#090d16', '#1e293b', '#0f172a', '#18181b', '#000000'],
      mockupStyle: 'dark',
    },
    layouts: ['basic-top', 'half-right', 'split-vertical', 'tilt-left', 'basic-bottom'],
    copy: [
      {
        title: 'Turn Phone into Pro Scanner',
        subtitle: 'Scan documents to crystal-clear PDFs with instant AI OCR text extraction.',
        badge: BADGE_PRESETS[0].config,
      },
      {
        title: 'Sign & Annotate on the Fly',
        subtitle: 'Add legally binding digital signatures and redact confidential info.',
      },
      {
        title: '1-Tap Cloud Sync Everywhere',
        subtitle: 'Direct export to iCloud, Google Drive, Dropbox, and local files.',
      },
      {
        title: '100% On-Device Processing',
        subtitle: 'Your confidential documents never upload to unknown servers.',
        badge: BADGE_PRESETS[10].config,
      },
      {
        title: 'Essential Pocket Toolkit',
        subtitle: 'Streamline your daily document workflow today.',
        badge: BADGE_PRESETS[5].config,
      },
    ],
  },
};

const defaultTemplate: NicheTemplate = {
  name: 'General Showcase',
  keywords: [],
  theme: {
    fontFamily: 'plus-jakarta',
    colors: ['#0f172a', '#1e293b', '#334155', '#475569', '#0f172a'],
    mockupStyle: 'dark',
  },
  layouts: ['basic-top', 'tilt-right', 'tilt-left', 'split-vertical', 'basic-bottom'],
  copy: [
    {
      title: 'Experience the Ultimate App',
      subtitle: 'Designed from the ground up to elevate your daily routine.',
      badge: BADGE_PRESETS[0].config,
    },
    {
      title: 'Powerful Features, Simple Design',
      subtitle: 'Everything you need with zero clutter or complicated setup.',
    },
    {
      title: 'Blazing Fast & Seamless',
      subtitle: 'Engineered for speed, fluid animations, and reliable performance.',
    },
    {
      title: '100% Private & Secure',
      subtitle: 'Your personal data is encrypted and completely under your control.',
      badge: BADGE_PRESETS[10].config,
    },
    {
      title: 'Get Started in Seconds',
      subtitle: 'Join millions of happy users enjoying a better experience today.',
      badge: BADGE_PRESETS[5].config,
    },
  ],
};

export function generateTemplateForNiche(nicheInput: string): { 
  canvases: CanvasItem[]; 
  globalOverrides: { mockupStyle: MockupStyle; fontFamily: string };
  matchedNicheName: string;
} {
  const normalizedInput = nicheInput.toLowerCase().trim();
  const inputWords = normalizedInput.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
  
  let bestNiche: NicheTemplate = defaultTemplate;
  let bestScore = 0;
  let matchedName = 'Universal App';

  // Smart scoring-based keyword & niche matching
  for (const [key, template] of Object.entries(NICHE_TEMPLATES)) {
    let score = 0;
    const templateName = template.name.toLowerCase();

    // 1. Exact key match (e.g. 'ai', 'pets')
    if (normalizedInput === key) {
      score += 100;
    } else if (inputWords.includes(key)) {
      score += 70;
    }

    // 2. Exact template name match
    if (normalizedInput === templateName || templateName.includes(normalizedInput)) {
      score += 80;
    }

    // 3. Keyword matching
    for (const kw of template.keywords) {
      const kwLower = kw.toLowerCase();
      if (normalizedInput === kwLower) {
        score += 90;
      } else if (inputWords.includes(kwLower)) {
        score += 60 + kwLower.length;
      } else if (kwLower.includes(' ') && normalizedInput.includes(kwLower)) {
        score += 75;
      } else if (kwLower.length > 3 && normalizedInput.includes(kwLower)) {
        score += 40;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestNiche = template;
      matchedName = template.name;
    }
  }

  const selectedNiche = bestNiche;
  const defaultLayouts: LayoutType[] = ['basic-top', 'tilt-right', 'tilt-left', 'split-vertical', 'basic-bottom'];
  const layouts = selectedNiche.layouts?.length ? selectedNiche.layouts : defaultLayouts;

  const getDefaultDoodleForSlide = (index: number): DoodleConfig => {
    switch (index % 5) {
      case 0:
        return {
          enabled: false,
          color: '#facc15',
          doodles: [
            { type: 'question', position: 'top-right' },
            { type: 'underline-wave', position: 'underline' }
          ]
        };
      case 1:
        return {
          enabled: false,
          color: '#facc15',
          doodles: [
            { type: 'circle-loop', position: 'left' },
            { type: 'lightning', position: 'bottom-right' }
          ]
        };
      case 2:
        return {
          enabled: false,
          color: '#facc15',
          doodles: [
            { type: 'speech-bubble', position: 'top-left' },
            { type: 'burst', position: 'bottom-right' }
          ]
        };
      case 3:
        return {
          enabled: false,
          color: '#facc15',
          doodles: [
            { type: 'heart', position: 'top-left' },
            { type: 'underline-wave', position: 'underline' }
          ]
        };
      case 4:
      default:
        return {
          enabled: false,
          color: '#facc15',
          doodles: [
            { type: 'crown', position: 'top-right' },
            { type: 'sparkles', position: 'bottom-left' }
          ]
        };
    }
  };

  const canvases: CanvasItem[] = selectedNiche.copy.map((copyItem, index) => {
    const colorIndex = index % selectedNiche.theme.colors.length;
    const bgColor = selectedNiche.theme.colors[colorIndex];
    
    // Check if background is light
    const isLightText = 
      bgColor === '#ffffff' || 
      bgColor === '#f8fafc' || 
      bgColor === '#fafafa' || 
      bgColor === '#f5f5f5' || 
      bgColor === '#f1f5f9' ||
      bgColor === '#fce7f3' ||
      bgColor === '#d1fae5' ||
      bgColor === '#e0f2fe' ||
      bgColor === '#fef3c7';

    return {
      id: crypto.randomUUID(),
      imageSrc: null,
      title: copyItem.title,
      subtitle: copyItem.subtitle,
      layout: copyItem.layout || layouts[index % layouts.length],
      backgroundColor: bgColor,
      textColor: isLightText ? '#0f172a' : '#ffffff',
      fontFamily: selectedNiche.theme.fontFamily,
      badge: copyItem.badge ? { ...copyItem.badge } : undefined,
      doodle: copyItem.doodle || getDefaultDoodleForSlide(index),
    };
  });

  return {
    canvases,
    globalOverrides: {
      mockupStyle: selectedNiche.theme.mockupStyle,
      fontFamily: selectedNiche.theme.fontFamily,
    },
    matchedNicheName: matchedName,
  };
}


