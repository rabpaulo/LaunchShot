import { CanvasItem, LayoutType } from '@/store/useEditorStore';

interface NicheTemplate {
  keywords: string[];
  theme: {
    fontFamily: string;
    colors: string[];
    mockupStyle: 'dark' | 'light' | 'glass' | 'clay-dark' | 'clay-light';
  };
  copy: { title: string; subtitle: string }[];
}

export const NICHE_TEMPLATES: Record<string, NicheTemplate> = {
  finance: {
    keywords: ['finance', 'bank', 'money', 'budget', 'crypto', 'invest', 'trading', 'wallet'],
    theme: {
      fontFamily: 'inter',
      colors: ['#0f172a', '#1e293b', '#334155', '#475569'],
      mockupStyle: 'dark',
    },
    copy: [
      { title: 'Take Control of Your Money', subtitle: 'Track your spending and save more automatically.' },
      { title: 'Smart Budgeting', subtitle: 'Set limits and get alerts before you overspend.' },
      { title: 'Grow Your Wealth', subtitle: 'Invest in stocks, crypto, and ETFs with zero fees.' },
      { title: 'Bank Grade Security', subtitle: 'Your data is protected with 256-bit encryption.' },
    ],
  },
  fitness: {
    keywords: ['fitness', 'workout', 'gym', 'health', 'exercise', 'diet', 'weight', 'run'],
    theme: {
      fontFamily: 'outfit',
      colors: ['#000000', '#1a1a1a', '#2a2a2a', '#000000'],
      mockupStyle: 'clay-dark',
    },
    copy: [
      { title: 'Transform Your Body', subtitle: 'Personalized workout plans designed by experts.' },
      { title: 'Track Every Rep', subtitle: 'Log your exercises and see your progress over time.' },
      { title: 'Nutrition Made Easy', subtitle: 'Count macros and find healthy recipes in seconds.' },
      { title: 'Join the Community', subtitle: 'Share your wins and get motivated by others.' },
    ],
  },
  productivity: {
    keywords: ['productivity', 'todo', 'task', 'notes', 'calendar', 'focus', 'habit', 'work'],
    theme: {
      fontFamily: 'plus-jakarta',
      colors: ['#ffffff', '#f8fafc', '#f1f5f9', '#ffffff'],
      mockupStyle: 'light',
    },
    copy: [
      { title: 'Get More Done', subtitle: 'Organize your life and work in one unified space.' },
      { title: 'Never Forget a Task', subtitle: 'Smart reminders and recurring to-dos keep you on track.' },
      { title: 'Collaborate Seamlessly', subtitle: 'Share lists and assign tasks to your team.' },
      { title: 'Analyze Your Time', subtitle: 'Detailed insights to help you optimize your schedule.' },
    ],
  },
  dating: {
    keywords: ['dating', 'love', 'meet', 'chat', 'match', 'romance', 'singles'],
    theme: {
      fontFamily: 'poppins',
      colors: ['#ec4899', '#db2777', '#be185d', '#9d174d'],
      mockupStyle: 'glass',
    },
    copy: [
      { title: 'Find Your Perfect Match', subtitle: 'Meet people who share your interests and values.' },
      { title: 'Verified Profiles', subtitle: 'Chat safely with real people in your area.' },
      { title: 'Spark a Connection', subtitle: 'Fun icebreakers make starting a conversation easy.' },
      { title: 'Plan Your Date', subtitle: 'Discover great local spots for your first meetup.' },
    ],
  },
  ecommerce: {
    keywords: ['shop', 'store', 'buy', 'ecommerce', 'fashion', 'clothes', 'sale', 'retail'],
    theme: {
      fontFamily: 'playfair',
      colors: ['#ffffff', '#fafafa', '#f5f5f5', '#ffffff'],
      mockupStyle: 'clay-light',
    },
    copy: [
      { title: 'Shop the Latest Trends', subtitle: 'Discover new arrivals from top brands every day.' },
      { title: 'Exclusive Discounts', subtitle: 'Get access to app-only sales and promotions.' },
      { title: 'Fast & Free Delivery', subtitle: 'Order today and get it delivered to your door tomorrow.' },
      { title: 'Easy Returns', subtitle: 'Not a perfect fit? Return items with just a tap.' },
    ],
  },
  travel: {
    keywords: ['travel', 'flight', 'hotel', 'vacation', 'trip', 'book', 'explore', 'map'],
    theme: {
      fontFamily: 'montserrat',
      colors: ['#0284c7', '#0369a1', '#075985', '#0c4a6e'],
      mockupStyle: 'glass',
    },
    copy: [
      { title: 'Explore the World', subtitle: 'Find the best deals on flights and hotels globally.' },
      { title: 'Plan Your Itinerary', subtitle: 'Build your perfect trip day by day.' },
      { title: 'Discover Local Gems', subtitle: 'Recommendations from locals wherever you go.' },
      { title: '24/7 Support', subtitle: 'We are here to help if your plans change.' },
    ],
  },
  food: {
    keywords: ['food', 'recipe', 'cook', 'delivery', 'eat', 'restaurant', 'meal', 'grocery'],
    theme: {
      fontFamily: 'poppins',
      colors: ['#ea580c', '#c2410c', '#9a3412', '#7c2d12'],
      mockupStyle: 'clay-light',
    },
    copy: [
      { title: 'Delicious Recipes', subtitle: 'Discover thousands of meals tailored to your taste.' },
      { title: 'Fast Delivery', subtitle: 'Get your favorite food delivered in under 30 minutes.' },
      { title: 'Smart Grocery Lists', subtitle: 'Automatically generate shopping lists from recipes.' },
      { title: 'Track Macros', subtitle: 'Keep an eye on your nutritional goals effortlessly.' },
    ],
  },
  social: {
    keywords: ['social', 'network', 'chat', 'message', 'friends', 'community', 'connect', 'share'],
    theme: {
      fontFamily: 'inter',
      colors: ['#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a'],
      mockupStyle: 'light',
    },
    copy: [
      { title: 'Connect With Friends', subtitle: 'Share your moments with the people who matter.' },
      { title: 'Instant Messaging', subtitle: 'Fast, secure, and reliable chat anywhere in the world.' },
      { title: 'Join Communities', subtitle: 'Find groups that share your passions and hobbies.' },
      { title: 'Express Yourself', subtitle: 'Customize your profile and stand out from the crowd.' },
    ],
  },
  education: {
    keywords: ['education', 'learn', 'course', 'study', 'school', 'language', 'student', 'teach'],
    theme: {
      fontFamily: 'playfair',
      colors: ['#059669', '#047857', '#065f46', '#064e3b'],
      mockupStyle: 'glass',
    },
    copy: [
      { title: 'Learn Something New', subtitle: 'Access thousands of high-quality courses.' },
      { title: 'Interactive Lessons', subtitle: 'Engage with material through quizzes and challenges.' },
      { title: 'Track Your Progress', subtitle: 'Watch your skills grow day by day.' },
      { title: 'Earn Certificates', subtitle: 'Showcase your achievements to the world.' },
    ],
  },
  meditation: {
    keywords: ['meditation', 'sleep', 'calm', 'mindful', 'breathe', 'relax', 'zen', 'focus'],
    theme: {
      fontFamily: 'outfit',
      colors: ['#4f46e5', '#4338ca', '#3730a3', '#312e81'],
      mockupStyle: 'dark',
    },
    copy: [
      { title: 'Find Your Peace', subtitle: 'Guided meditations to help you relax and focus.' },
      { title: 'Sleep Better', subtitle: 'Soothing sounds and stories for a deep slumber.' },
      { title: 'Reduce Stress', subtitle: 'Quick breathing exercises for instant anxiety relief.' },
      { title: 'Daily Mindfulness', subtitle: 'Start your day with intention and clarity.' },
    ],
  },
  gaming: {
    keywords: ['gaming', 'game', 'play', 'stream', 'esports', 'arcade', 'multiplayer'],
    theme: {
      fontFamily: 'space-grotesk',
      colors: ['#000000', '#111111', '#222222', '#000000'],
      mockupStyle: 'clay-dark',
    },
    copy: [
      { title: 'Next-Gen Graphics', subtitle: 'Experience breathtaking visuals and smooth gameplay.' },
      { title: 'Play With Friends', subtitle: 'Real-time multiplayer battles across the globe.' },
      { title: 'Climb the Ranks', subtitle: 'Compete in tournaments and earn exclusive rewards.' },
      { title: 'Stream Your Skills', subtitle: 'Broadcast your gameplay live to thousands of viewers.' },
    ],
  },
  news: {
    keywords: ['news', 'reader', 'article', 'magazine', 'journal', 'headline', 'read'],
    theme: {
      fontFamily: 'playfair',
      colors: ['#ffffff', '#f8fafc', '#f1f5f9', '#ffffff'],
      mockupStyle: 'light',
    },
    copy: [
      { title: 'Stay Informed', subtitle: 'Breaking news and in-depth analysis from trusted sources.' },
      { title: 'Personalized Feed', subtitle: 'Follow the topics and writers you care about most.' },
      { title: 'Offline Reading', subtitle: 'Save articles to read later, even without an internet connection.' },
      { title: 'Audio Summaries', subtitle: 'Listen to the days top stories while on the go.' },
    ],
  },
  realestate: {
    keywords: ['realestate', 'house', 'home', 'rent', 'buy', 'property', 'apartment', 'mortgage'],
    theme: {
      fontFamily: 'plus-jakarta',
      colors: ['#0f766e', '#0f645c', '#115e59', '#134e4a'],
      mockupStyle: 'glass',
    },
    copy: [
      { title: 'Find Your Dream Home', subtitle: 'Browse millions of listings in your desired neighborhood.' },
      { title: '3D Virtual Tours', subtitle: 'Walk through properties without leaving your couch.' },
      { title: 'Instant Valuations', subtitle: 'See exactly what your current home is worth.' },
      { title: 'Connect With Agents', subtitle: 'Get expert advice and schedule viewings instantly.' },
    ],
  },
};

const defaultTemplate: NicheTemplate = {
  keywords: [],
  theme: {
    fontFamily: 'plus-jakarta',
    colors: ['#0f172a', '#1e293b', '#334155', '#475569'],
    mockupStyle: 'dark',
  },
  copy: [
    { title: 'Welcome to the App', subtitle: 'Discover amazing features that make your life easier.' },
    { title: 'Stay Connected', subtitle: 'Access everything you need, anytime, anywhere.' },
    { title: 'Lightning Fast', subtitle: 'Optimized for speed and flawless performance.' },
    { title: 'Get Started Today', subtitle: 'Join millions of users already on board.' },
  ],
};

export function generateTemplateForNiche(nicheInput: string): { canvases: CanvasItem[], globalOverrides: { mockupStyle: import('@/store/useEditorStore').MockupStyle } } {
  const normalizedInput = nicheInput.toLowerCase().trim();
  
  let selectedNiche = defaultTemplate;

  // Simple keyword matching
  for (const [key, template] of Object.entries(NICHE_TEMPLATES)) {
    if (normalizedInput.includes(key) || template.keywords.some(k => normalizedInput.includes(k))) {
      selectedNiche = template;
      break;
    }
  }

  const layouts: LayoutType[] = ['basic-top', 'tilt-right', 'tilt-left', 'basic-bottom'];

  const canvases = selectedNiche.copy.map((copyItem, index) => {
    const colorIndex = index % selectedNiche.theme.colors.length;
    const bgColor = selectedNiche.theme.colors[colorIndex];
    const isLightText = bgColor === '#ffffff' || bgColor === '#f8fafc' || bgColor === '#fafafa' || bgColor === '#f5f5f5' || bgColor === '#f1f5f9';

    return {
      id: crypto.randomUUID(),
      imageSrc: null,
      title: copyItem.title,
      subtitle: copyItem.subtitle,
      layout: layouts[index % layouts.length],
      backgroundColor: bgColor,
      textColor: isLightText ? '#0f172a' : '#ffffff',
      fontFamily: selectedNiche.theme.fontFamily,
    };
  });

  return {
    canvases,
    globalOverrides: {
      mockupStyle: selectedNiche.theme.mockupStyle
    }
  };
}
