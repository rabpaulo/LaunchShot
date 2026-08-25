/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CanvasItem } from '@/store/useEditorStore';
import { BADGE_PRESETS } from '@/config/badges';
import { extractKeywords } from '@/utils/keywordExtractor';



export type AsoTone = 
  | 'high-converting' 
  | 'apple-minimalist' 
  | 'feature-tech' 
  | 'social-proof' 
  | 'problem-solution' 
  | 'playful-vibrant';

export interface AsoToneOption {
  id: AsoTone;
  name: string;
  description: string;
}

export const ASO_TONE_OPTIONS: AsoToneOption[] = [
  { id: 'high-converting', name: 'High Converting (Hook & Power)', description: 'Punchy, action-driven, high-converting value props' },
  { id: 'apple-minimalist', name: 'Apple Minimalist (Short & Sleek)', description: '2-4 word poetic headlines with refined clarity' },
  { id: 'feature-tech', name: 'Feature & Tech Utility', description: 'Clear capabilities, speed, specs, and offline reliability' },
  { id: 'social-proof', name: 'Social Proof & Accolades', description: 'Ratings, design awards, and community milestones' },
  { id: 'problem-solution', name: 'Problem to Transformation', description: 'Highlight user pain points then deliver instant relief' },
  { id: 'playful-vibrant', name: 'Playful & Vibrant', description: 'Fun, engaging, conversational, and energetic' },
];


export const TONE_FORMULAS: Record<AsoTone, {
  hook: (kw1: string, kw2: string) => { title: string; subtitle: string };
  feature1: (kw1: string, kw2: string) => { title: string; subtitle: string };
  feature2: (kw1: string, kw2: string) => { title: string; subtitle: string };
  trust: (kw1: string, kw2: string) => { title: string; subtitle: string };
  cta: (kw1: string, kw2: string) => { title: string; subtitle: string };
}> = {
  'high-converting': {
    hook: (kw1, kw2) => ({
      title: kw1 ? `The Ultimate ${kw1} App` : 'Experience the Ultimate App',
      subtitle: kw1 ? `Master your ${kw2} and elevate your daily workflow effortlessly.` : 'Designed from the ground up for maximum daily impact.'
    }),
    feature1: (kw1, kw2) => ({
      title: kw1 ? `Supercharge Your ${kw1}` : 'Supercharge Your Workflow',
      subtitle: `Unlock powerful automation and intelligent insights in seconds.`
    }),
    feature2: (kw1, kw2) => ({
      title: kw1 ? `Track & Optimize ${kw2}` : 'Deep Real-Time Analytics',
      subtitle: 'Visualize your progress with beautiful, high-clarity metrics.'
    }),
    trust: (kw1) => ({
      title: '100% Private & Blazing Fast',
      subtitle: 'Bank-grade encryption, zero tracking, and complete offline access.'
    }),
    cta: (kw1) => ({
      title: kw1 ? `Start Your ${kw1} Journey` : 'Start Your Journey Today',
      subtitle: 'Download now to experience the next level of excellence.'
    })
  },

  'apple-minimalist': {
    hook: (kw1) => ({
      title: kw1 ? `${kw1}. Perfected.` : 'Simply Powerful.',
      subtitle: 'Focus on what truly matters with zero distractions.'
    }),
    feature1: (kw1, kw2) => ({
      title: kw1 ? `Effortless ${kw1}.` : 'Precision Craft.',
      subtitle: 'Every interaction designed for natural, fluid delight.'
    }),
    feature2: (kw1, kw2) => ({
      title: kw1 ? `Clarity for ${kw2}.` : 'Pure Focus.',
      subtitle: 'High-contrast hierarchy that puts your data first.'
    }),
    trust: () => ({
      title: 'Private by Design.',
      subtitle: 'On-device intelligence. Your data stays strictly yours.'
    }),
    cta: () => ({
      title: 'Begin Today.',
      subtitle: 'Download free on the App Store.'
    })
  },

  'feature-tech': {
    hook: (kw1, kw2) => ({
      title: kw1 ? `Pro-Grade ${kw1} Engine` : 'Built for Power Users',
      subtitle: kw1 ? `Advanced tools engineered specifically for modern ${kw2} workflows.` : 'Lightning fast performance with deep customization.'
    }),
    feature1: (kw1) => ({
      title: kw1 ? `Automate Your ${kw1}` : 'Automate Everything',
      subtitle: 'Sub-100ms response times with smart keyboard shortcuts and widgets.'
    }),
    feature2: (kw1, kw2) => ({
      title: kw1 ? `Multi-Format ${kw2} Export` : 'Seamless Cloud Sync',
      subtitle: 'Instant two-way sync across phone, tablet, and desktop.'
    }),
    trust: () => ({
      title: '100% Offline & Encrypted',
      subtitle: 'Zero cloud dependencies required. Works anywhere in the world.'
    }),
    cta: (kw1) => ({
      title: kw1 ? `Upgrade Your ${kw1} Toolkit` : 'Level Up Your Toolkit',
      subtitle: 'Get the pro edition today. Free forever for individuals.'
    })
  },

  'social-proof': {
    hook: (kw1) => ({
      title: kw1 ? `The #1 Rated ${kw1} App` : 'Loved by 1M+ Users',
      subtitle: 'See why everyone is switching to the highest rated app in its category.'
    }),
    feature1: (kw1, kw2) => ({
      title: kw1 ? `Why People Love Our ${kw1}` : 'Award-Winning Design',
      subtitle: 'Featured by Apple as App of the Day and Editor\'s Choice globally.'
    }),
    feature2: (kw1, kw2) => ({
      title: kw1 ? `Join 500k+ Mastering ${kw2}` : 'Join a Global Community',
      subtitle: 'Connect with passionate thinkers, share progress, and grow together.'
    }),
    trust: () => ({
      title: 'Trusted by Top Industry Leaders',
      subtitle: 'Independently audited security with over 50,000 five-star reviews.'
    }),
    cta: () => ({
      title: 'Claim Your Welcome Perks',
      subtitle: 'Join millions of happy users today. Free to download.'
    })
  },

  'problem-solution': {
    hook: (kw1, kw2) => ({
      title: kw1 ? `Tired of Complex ${kw1}?` : 'Stop Struggling with Chaos',
      subtitle: kw1 ? `Finally, a simple way to master your ${kw2} without the headache.` : 'The clear, frustration-free solution you have been waiting for.'
    }),
    feature1: (kw1) => ({
      title: kw1 ? `Eliminate ${kw1} Overwhelm` : 'Save Hours Every Week',
      subtitle: 'Cut out repetitive manual work with intelligent automated guidance.'
    }),
    feature2: (kw1, kw2) => ({
      title: kw1 ? `Never Miss a ${kw2} Detail` : 'Total Peace of Mind',
      subtitle: 'Smart notifications and safety checks ensure you never slip up.'
    }),
    trust: () => ({
      title: 'Zero Risk, Zero Hidden Fees',
      subtitle: 'Transparent privacy policy, no predatory ads, and full data control.'
    }),
    cta: (kw1) => ({
      title: kw1 ? `Fix Your ${kw1} Today` : 'Transform Your Routine Now',
      subtitle: 'Start free in under 60 seconds with zero credit card required.'
    })
  },

  'playful-vibrant': {
    hook: (kw1) => ({
      title: kw1 ? `Meet Your New Favorite ${kw1}` : 'Your Life, Leveled Up!',
      subtitle: 'Bring vibrant energy, fun interactions, and joy back to your daily routine.'
    }),
    feature1: (kw1) => ({
      title: kw1 ? `Magic Moments with ${kw1}` : 'Tap, Swipe, Enjoy!',
      subtitle: 'Playful animations and delightful sounds make every action a breeze.'
    }),
    feature2: (kw1, kw2) => ({
      title: kw1 ? `Show Off Your ${kw2}` : 'Celebrate Every Win!',
      subtitle: 'Unlock cool achievements, custom avatar skins, and streak badges.'
    }),
    trust: () => ({
      title: 'Safe, Clean & Kid-Friendly',
      subtitle: '100% private, family-safe, and designed with love.'
    }),
    cta: () => ({
      title: 'Jump in and Have Fun!',
      subtitle: 'Download now and start smiling right away.'
    })
  }
};

export function applyAsoCopy(
  canvases: CanvasItem[], 
  description?: string, 
  tone: AsoTone = 'high-converting'
): CanvasItem[] {
  if (canvases.length === 0) return canvases;
  
  const keywords = description ? extractKeywords(description) : [];
  const kw1 = keywords[0] || '';
  const kw2 = keywords[1] || keywords[0] || '';
  const formulas = TONE_FORMULAS[tone] || TONE_FORMULAS['high-converting'];

  return canvases.map((canvas, index) => {
    const total = canvases.length;
    
    // Single canvas
    if (total === 1) {
      const copy = formulas.hook(kw1, kw2);
      return {
        ...canvas,
        title: copy.title,
        subtitle: copy.subtitle,
        badge: BADGE_PRESETS[0].config, // Rating
      };
    }

    // Screen 1: Hook / Positioning
    if (index === 0) {
      const copy = formulas.hook(kw1, kw2);
      return {
        ...canvas,
        title: copy.title,
        subtitle: copy.subtitle,
        badge: tone === 'social-proof' 
          ? BADGE_PRESETS[2].config // Apple Design Award
          : BADGE_PRESETS[0].config // 4.9 App Store
      };
    }

    // Last Screen: CTA / Outro
    if (index === total - 1) {
      const copy = formulas.cta(kw1, kw2);
      return {
        ...canvas,
        title: copy.title,
        subtitle: copy.subtitle,
        badge: BADGE_PRESETS[3].config // App of the Day
      };
    }

    // Screen 2: Killer Core Feature
    if (index === 1) {
      const copy = formulas.feature1(kw1, kw2);
      return {
        ...canvas,
        title: copy.title,
        subtitle: copy.subtitle,
        badge: undefined
      };
    }

    // Penultimate screen or Slide 4: Trust / Security / Speed
    if (index === total - 2 || index === 3) {
      const copy = formulas.trust(kw1, kw2);
      return {
        ...canvas,
        title: copy.title,
        subtitle: copy.subtitle,
        badge: BADGE_PRESETS[10].config // Privacy & Security badge
      };
    }

    // Middle Screens: Secondary features & Depth
    const kwCurrent = keywords[((index - 1) % Math.max(1, keywords.length))] || kw2;
    const copy = formulas.feature2(kwCurrent, kw1);
    return {
      ...canvas,
      title: copy.title,
      subtitle: copy.subtitle,
      badge: undefined
    };
  });
}

