import { CanvasItem } from '@/store/useEditorStore';
import { BADGE_PRESETS } from '@/config/badges';
import { extractKeywords } from '@/utils/keywordExtractor';

export const GENERIC_ASO_FORMULAS = {
  socialProof: [
    { title: 'Join 1M+ Users', subtitle: 'The #1 rated app in its category.' },
    { title: 'Loved by Millions', subtitle: 'See why everyone is making the switch.' },
    { title: 'Award Winning Design', subtitle: 'Featured by Apple as App of the Day.' },
  ],
  features: [
    { title: 'Track Everything', subtitle: 'Keep all your important data in one secure place.' },
    { title: 'Syncs Everywhere', subtitle: 'Access your account on phone, tablet, and web.' },
    { title: 'Work Offline', subtitle: 'No internet? No problem. Full offline support.' },
    { title: 'Dark Mode Included', subtitle: 'Beautifully designed for day and night.' },
  ],
  cta: [
    { title: 'Start Free Today', subtitle: 'No credit card required. Cancel anytime.' },
    { title: 'Ready to Upgrade?', subtitle: 'Download now and claim your welcome bonus.' },
    { title: 'Begin Your Journey', subtitle: 'Take the first step towards your goals right now.' },
  ]
};

export function applyAsoCopy(canvases: CanvasItem[], description?: string): CanvasItem[] {
  if (canvases.length === 0) return canvases;
  
  const keywords = description ? extractKeywords(description) : [];
  
  return canvases.map((canvas, index) => {
    // Screen 1: Social Proof / Hook
    if (index === 0) {
      let title = 'Join 1M+ Users';
      let subtitle = 'The #1 rated app in its category.';
      
      if (keywords.length > 0) {
        title = `The Ultimate ${keywords[0]} App`;
        subtitle = `Join thousands of users mastering their ${keywords[1] || keywords[0]} today.`;
      } else {
        const copy = GENERIC_ASO_FORMULAS.socialProof[Math.floor(Math.random() * GENERIC_ASO_FORMULAS.socialProof.length)];
        title = copy.title;
        subtitle = copy.subtitle;
      }
      
      return { 
        ...canvas, 
        title, 
        subtitle,
        badge: BADGE_PRESETS[0].config // App Store Rating
      };
    }
    
    // Last Screen: CTA
    if (index === canvases.length - 1 && canvases.length > 1) {
      let title = 'Start Free Today';
      let subtitle = 'No credit card required. Cancel anytime.';
      
      if (keywords.length > 0) {
        title = `Start Your ${keywords[0]} Journey`;
        subtitle = `Download now to experience the best in ${keywords[1] || keywords[0]}.`;
      } else {
        const copy = GENERIC_ASO_FORMULAS.cta[Math.floor(Math.random() * GENERIC_ASO_FORMULAS.cta.length)];
        title = copy.title;
        subtitle = copy.subtitle;
      }
      
      return { 
        ...canvas, 
        title, 
        subtitle,
        badge: undefined 
      };
    }
    
    // Middle Screens: Features
    let title = '';
    let subtitle = '';
    let isPrivacyScreen = false;
    
    if (keywords.length >= 2) {
      // Rotate through remaining keywords for middle screens
      // index starts at 1, so index-1 maps to keyword[1], keyword[2], etc.
      // offset by 1 because keyword[0] was used in screen 1
      const kwIndex = ((index - 1) % Math.max(1, keywords.length - 1)) + 1;
      const kw = keywords[kwIndex] || keywords[0];
      
      const featureTemplates = [
        { t: `Master Your ${kw}`, s: `Powerful tools designed specifically for your ${kw} needs.` },
        { t: `Analyze ${kw} Data`, s: `Get deep insights and analytics at a single glance.` },
        { t: `Share Your ${kw}`, s: `Connect with others and grow together seamlessly.` },
        { t: `Optimize ${kw}`, s: `Built for speed, reliability, and maximum performance.` }
      ];
      
      const copy = featureTemplates[(index - 1) % featureTemplates.length];
      title = copy.t;
      subtitle = copy.s;
      isPrivacyScreen = title.includes('Secure') || title.includes('Data');
    } else {
      const copy = GENERIC_ASO_FORMULAS.features[index % GENERIC_ASO_FORMULAS.features.length];
      title = copy.title;
      subtitle = copy.subtitle;
      isPrivacyScreen = title.includes('Offline') || title.includes('Secure');
    }
    
    return { 
      ...canvas, 
      title, 
      subtitle,
      badge: isPrivacyScreen ? BADGE_PRESETS[7].config : undefined // Privacy badge
    };
  });
}
