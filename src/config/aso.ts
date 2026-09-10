/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CanvasItem } from '@/store/useEditorStore';
import { BADGE_PRESETS } from '@/config/badges';
import { extractKeywords } from '@/utils/keywordExtractor';
import { isAndroidDevice } from '@/config/sizes';
import {
  ASO_DOMAINS,
  UNIVERSAL_ASO_TONES,
  detectAsoDomain,
  synthesizeCustomAsoStoryArc,
  type AsoStoryArc
} from '@/config/asoKnowledge';

export { detectAsoDomain } from '@/config/asoKnowledge';

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
  { id: 'high-converting', name: 'High Converting (Hook & Outcome)', description: 'Punchy 3-5 word benefit headlines that maximize App Store CRO' },
  { id: 'apple-minimalist', name: 'Apple Minimalist (Short & Sleek)', description: '2-3 word poetic editorial headlines with keynote clarity' },
  { id: 'feature-tech', name: 'Feature & Power Utility', description: 'Clear capabilities, sub-50ms speed, and offline reliability' },
  { id: 'social-proof', name: 'Social Proof & Authority', description: 'Verified ratings, design awards, and community milestones' },
  { id: 'problem-solution', name: 'Problem to Transformation', description: 'Names relatable user friction then delivers instant relief' },
  { id: 'playful-vibrant', name: 'Playful & Vibrant', description: 'Fun, gamified, conversational energy that delights users' },
];

export interface QuickAsoNiche {
  id: string;
  name: string;
  query: string;
}

export const QUICK_ASO_NICHES: QuickAsoNiche[] = [
  { id: 'fitness', name: 'Gym & Workout', query: 'gym workout planner and lifting tracker' },
  { id: 'meditation', name: 'Sleep & Anxiety', query: 'sleep tracker and calm soundscapes for insomnia' },
  { id: 'finance', name: 'Budget & Crypto', query: 'budget expense tracker and crypto portfolio' },
  { id: 'productivity', name: 'Tasks & Notes', query: 'minimal markdown notes and daily to-do planner' },
  { id: 'nutrition', name: 'Macros & Diet', query: 'calorie counter and intermittent fasting tracker' },
  { id: 'education', name: 'Language Tutor', query: 'language flashcards and vocabulary spaced repetition' },
  { id: 'habits', name: 'Daily Habits', query: 'daily habit streaks and goal tracker' },
  { id: 'ai', name: 'AI Copilot', query: 'smart ai writing assistant and prompt generator' },
];

/**
 * Legacy formulas map preserved for backwards compatibility
 */
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
      subtitle: 'Unlock powerful automation and intelligent insights in seconds.'
    }),
    feature2: (kw1, kw2) => ({
      title: kw1 ? `Track & Optimize ${kw2}` : 'Deep Real-Time Analytics',
      subtitle: 'Visualize your progress with beautiful, high-clarity metrics.'
    }),
    trust: () => ({
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
      subtitle: 'Sub-50ms response times with smart keyboard shortcuts and widgets.'
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

/**
 * High-Converting Smart ASO Copywriter Engine
 * Follows industry-standard 2026 conversion rate optimization (CRO) guidelines:
 * - Strictly 3-6 word headlines for thumbnail legibility in App Store & Google Play
 * - Benefit-led outcomes rather than static feature descriptions
 * - 5-Screen conversion arc: Hook -> Pain Relieved -> Core Flow -> Privacy/Speed -> Social Proof/CTA
 * - Contextual domain intelligence across fitness, sleep, finance, productivity, etc.
 * - Platform-specific badging (Google Play rating/editorial vs Apple App Store)
 */
export function applyAsoCopy(
  canvases: CanvasItem[], 
  description?: string, 
  tone: AsoTone = 'high-converting',
  targetSize?: string,
  variationIndex: number = 0
): CanvasItem[] {
  if (canvases.length === 0) return canvases;
  
  const isAndroid = isAndroidDevice(targetSize);
  const keywords = description ? extractKeywords(description) : [];
  const detectedDomain = detectAsoDomain(description);
  
  // Resolve the 5-screen conversion story arc
  let arc: AsoStoryArc;
  
  if (detectedDomain !== 'universal' && ASO_DOMAINS[detectedDomain]) {
    const domainArcs = ASO_DOMAINS[detectedDomain].tones[tone] || ASO_DOMAINS[detectedDomain].tones['high-converting'];
    const arcIndex = Math.abs(variationIndex) % domainArcs.length;
    arc = domainArcs[arcIndex];
  } else if (keywords.length > 0) {
    arc = synthesizeCustomAsoStoryArc(keywords, tone, variationIndex);
  } else {
    const universalArcs = UNIVERSAL_ASO_TONES[tone] || UNIVERSAL_ASO_TONES['high-converting'];
    const arcIndex = Math.abs(variationIndex) % universalArcs.length;
    arc = universalArcs[arcIndex];
  }

  // Device-specific badges
  const hookBadge = isAndroid
    ? (tone === 'social-proof' ? BADGE_PRESETS[5].config : BADGE_PRESETS[4].config)
    : (tone === 'social-proof' ? BADGE_PRESETS[2].config : BADGE_PRESETS[0].config);

  const trustBadge = BADGE_PRESETS[10].config; // Privacy & Security shield
  
  const ctaBadge = isAndroid
    ? BADGE_PRESETS[5].config // Google Play Editors' Choice
    : BADGE_PRESETS[3].config; // Apple Editors' Choice

  const total = canvases.length;

  return canvases.map((canvas, index) => {
    // Single canvas
    if (total === 1) {
      return {
        ...canvas,
        title: arc.hook.title,
        subtitle: arc.hook.subtitle,
        badge: hookBadge,
      };
    }

    // Screen 1: The Hook / Primary Value Prop
    if (index === 0) {
      return {
        ...canvas,
        title: arc.hook.title,
        subtitle: arc.hook.subtitle,
        badge: hookBadge,
      };
    }

    // Last Screen: CTA / The Close
    if (index === total - 1) {
      let subtitle = arc.cta.subtitle;
      if (isAndroid && tone === 'apple-minimalist') {
        subtitle = 'Download free on Google Play.';
      }
      return {
        ...canvas,
        title: arc.cta.title,
        subtitle,
        badge: ctaBadge,
      };
    }

    // Screen 2: The Pain Point Relieved / Key Feature
    if (index === 1) {
      let subtitle = arc.pain.subtitle;
      if (isAndroid && tone === 'social-proof') {
        subtitle = "Featured on Google Play as Editors' Choice and Best of 2024.";
      }
      return {
        ...canvas,
        title: arc.pain.title,
        subtitle,
        badge: undefined,
      };
    }

    // Penultimate screen or Slide 4: Trust / Security / Speed
    if (index === total - 2 || index === 3) {
      return {
        ...canvas,
        title: arc.superpower.title,
        subtitle: arc.superpower.subtitle,
        badge: trustBadge,
      };
    }

    // Middle Screens: Core Workflow & Transformation
    return {
      ...canvas,
      title: arc.feature.title,
      subtitle: arc.feature.subtitle,
      badge: undefined,
    };
  });
}
