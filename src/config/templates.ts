/* eslint-disable @typescript-eslint/no-unused-vars */
import type { CanvasItem, GlobalSettings } from '@/store/useEditorStore';

import { TEMPLATE_LOGOS, type TemplateLogo } from '@/config/templateLogos';

export interface TemplateDefinition {
  name: string;
  style: string;
  category: string;
  logo: TemplateLogo;
  apply: (
    loadTemplate: (canvases: CanvasItem[]) => void, 
    updateGlobalSettings: (settings: Partial<GlobalSettings>) => void
  ) => void;
}

const RAW_TEMPLATES: { name: string; apply: (loadTemplate: (canvases: CanvasItem[]) => void, updateGlobalSettings: (settings: Partial<GlobalSettings>) => void) => void }[] = [
  {
    name: 'Aesthetic Modern (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Save places',
          subtitle: 'worth remembering',
          layout: 'tilt-right',
          backgroundColor: 'radial-gradient(circle at 50% 50%, #fdf2f8 0%, #ffffff 60%)',
          textColor: '#000000',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'question', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Find whats good',
          subtitle: 'around you',
          layout: 'basic-top',
          backgroundColor: 'radial-gradient(circle at 50% 50%, #eff6ff 0%, #ffffff 60%)',
          textColor: '#000000',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Spend less time',
          subtitle: 'searching',
          layout: 'hero-center',
          backgroundColor: 'radial-gradient(circle at 50% 50%, #fefce8 0%, #ffffff 60%)',
          textColor: '#000000',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'speech-bubble', position: 'top-left' },
              { type: 'burst', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Curate your',
          subtitle: 'world into lists',
          layout: 'basic-bottom',
          backgroundColor: 'radial-gradient(circle at 50% 50%, #fdf2f8 0%, #ffffff 60%)',
          textColor: '#000000',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'heart', position: 'top-left' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'And more',
          subtitle: 'exploring',
          layout: 'tilt-bottom-right',
          backgroundColor: 'radial-gradient(circle at 50% 50%, #f8fafc 0%, #ffffff 60%)',
          textColor: '#000000',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'sparkles', position: 'top-right' },
              { type: 'arrow-curved', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: 'Banner Stacked Right',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Calories, macros and workouts. In one app.',
          subtitle: 'Log in seconds.\nUnderstand what you eat.',
          layout: 'banner-stack-right',
          backgroundColor: '#0f3a21',
          textColor: '#ffffff',
          fontFamily: 'inter',
          badge: { enabled: true, text: 'Top Rated', style: 'pill-glass', icon: 'star' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'burst', position: 'bottom-right' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: 'Kinetic Repeating Banner (Platano Style)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'light', targetSize: 'play-feature-graphic' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Platano',
          subtitle: 'AI Creative Studio',
          layout: 'banner-kinetic-stack',
          backgroundColor: '#fed843',
          textColor: '#0f172a',
          fontFamily: 'outfit',
          badge: { enabled: true, text: 'Featured App', style: 'pill-solid', icon: 'star' },
          doodle: {
            enabled: false,
            color: '#f59e0b',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'sparkles', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Photo Studio',
          subtitle: 'Create AI avatars & portraits',
          layout: 'basic-top',
          backgroundColor: '#fef08a',
          textColor: '#0f172a',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#f59e0b',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Creative Filters',
          subtitle: 'Instant styles and lighting',
          layout: 'basic-top',
          backgroundColor: '#fef9c3',
          textColor: '#0f172a',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#f59e0b',
            doodles: [
              { type: 'sparkles', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: 'Banner Triple Bottom',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'The why behind your recovery.',
          subtitle: 'Every metric with its story: sleep stages, resting HR and HRV.',
          layout: 'banner-triple-bottom',
          backgroundColor: '#113c2c',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'underline-wave', position: 'underline' },
              { type: 'lightning', position: 'top-right' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: 'Hero 3D Showcase',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Unleash Your Productivity.',
          subtitle: 'The ultimate tool for modern professionals.',
          layout: 'hero-3d-center',
          backgroundColor: 'radial-gradient(circle at 50% 0%, #334155 0%, #0f172a 60%, #000000 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          badge: { enabled: true, text: 'Top Rated', style: 'pill-glass', icon: 'star' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'sparkles', position: 'top-right' },
              { type: 'lightning', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Track Everything.',
          subtitle: 'Never miss a detail again.',
          layout: 'hero-3d-center',
          backgroundColor: 'radial-gradient(circle at 50% 0%, #334155 0%, #0f172a 60%, #000000 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'target', position: 'top-left' },
              { type: 'burst', position: 'bottom-right' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: 'Dynamic Overlap',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Immersive Experience',
          subtitle: 'Focus on what matters most.',
          layout: 'basic-top',
          backgroundColor: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          badge: { enabled: true, text: 'Editor\'s Choice', style: 'pill-solid', icon: 'trophy' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'speech-bubble', position: 'top-left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Seamless Flow',
          subtitle: 'Your data, beautifully visualized.',
          layout: 'basic-top',
          backgroundColor: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'underline-wave', position: 'underline' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        }
      ]);
    }
  },

  {
    name: `NeonCard Template`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'TRACK ALL YOUR SPENDING',
          subtitle: 'STAY ON TOP OF EVERY TRANSACTION',
          layout: 'split-vertical',
          backgroundColor: '#1f1f1f',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'SAVE MONEY AUTOMATICALLY',
          subtitle: 'SET SMART RULES TO GROW YOUR SAVINGS',
          layout: 'split-vertical',
          backgroundColor: '#1f1f1f',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'target', position: 'top-left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'SEND MONEY INSTANTLY',
          subtitle: 'TRANSFER WORLDWIDE WITH REAL RATES',
          layout: 'split-vertical',
          backgroundColor: '#1f1f1f',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'arrow-curved', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'FREEZE, UNFREEZE',
          subtitle: 'STAY IN CONTROL ANYTIME',
          layout: 'split-vertical',
          backgroundColor: '#1f1f1f',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'star', position: 'top-left' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'FULL CARD CONTROL',
          subtitle: 'MANAGE LIMITS, PINS & MORE',
          layout: 'split-vertical',
          backgroundColor: '#1f1f1f',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Basic Template (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Amazing Features',
          subtitle: 'Discover what makes our app great',
          layout: 'basic-top',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'question', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Beautiful Design',
          subtitle: 'Carefully crafted for you',
          layout: 'tilt-right',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'heart', position: 'top-left' },
              { type: 'circle-loop', position: 'left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Blazing Fast',
          subtitle: 'Optimized for speed and performance',
          layout: 'tilt-left',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'burst', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Start Today',
          subtitle: 'Join thousands of happy users',
          layout: 'basic-bottom',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'check', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `3D Showcase (3 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Immersive 3D Experience',
          subtitle: 'Stand out from the crowd with beautiful isometric layouts',
          layout: '3d-isometric-right',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'sparkles', position: 'top-right' },
              { type: 'arrow-curved', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Highlight Your UI',
          subtitle: 'Let your app design speak for itself in 3D',
          layout: '3d-isometric-left',
          backgroundColor: 'linear-gradient(135deg, #090d16 0%, #1e293b 60%, #334155 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'target', position: 'top-left' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Engage Your Users',
          subtitle: 'Create a cinematic experience before they even download',
          layout: '3d-isometric-right',
          backgroundColor: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Lifestyle Showcase (3 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Your Life, Upgraded',
          subtitle: 'Seamless integration into your daily routine',
          layout: 'basic-top',
          backgroundColor: '#000000',
          backgroundImageSrc: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&q=80&w=1080',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'heart', position: 'top-left' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Stay Connected',
          subtitle: 'Never miss a beat, no matter where you are',
          layout: 'half-right',
          backgroundColor: '#000000',
          backgroundImageSrc: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1080',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'speech-bubble', position: 'top-left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Peace of Mind',
          subtitle: 'Secure, reliable, and always ready when you need it',
          layout: 'tilt-left',
          backgroundColor: '#000000',
          backgroundImageSrc: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&q=80&w=1080',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'check', position: 'top-right' },
              { type: 'star', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Continuous Story (5 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Welcome to the Future',
          subtitle: 'Swipe to see how we change the game.',
          layout: 'half-right',
          backgroundColor: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'arrow-curved', position: 'top-right' },
              { type: 'sparkles', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Connect Instantly',
          subtitle: 'With friends, family, and the world.',
          layout: 'half-left',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'speech-bubble', position: 'top-left' },
              { type: 'circle-loop', position: 'left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Share Your Moments',
          subtitle: 'Capture and share memories in a flash.',
          layout: 'tilt-right',
          backgroundColor: 'linear-gradient(135deg, #312e81 0%, #4c1d95 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'heart', position: 'top-left' },
              { type: 'burst', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Stay Secure',
          subtitle: 'Enterprise-grade encryption built in.',
          layout: 'tilt-left',
          backgroundColor: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'star', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Join Us Today',
          subtitle: 'Download now and get started.',
          layout: 'basic-bottom',
          backgroundColor: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'lightning', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Social Graphic - Style 1`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'play-feature-graphic' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Builder, at a glance',
          subtitle: 'Polished social graphics for every channel.',
          layout: 'og-style-1',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'inter',
          showAppStoreBadge: true,
          appIconSrc: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=200&h=200&fit=crop',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'question', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Social Graphic - Style 2`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'play-feature-graphic' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Power up Builder',
          subtitle: 'Never stop shipping visuals in minutes.',
          layout: 'og-style-2',
          backgroundColor: '#111827',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          showAppStoreBadge: true,
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Social Graphic - Style 3`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'play-feature-graphic' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Builder feels premium',
          subtitle: 'Dark, cinematic assets for launch day.',
          layout: 'og-style-3',
          backgroundColor: '#030712',
          textColor: '#ffffff',
          fontFamily: 'poppins',
          showAppStoreBadge: true,
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'sparkles', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Dark Mode Elegance (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Embrace the Dark',
          subtitle: 'A beautiful interface designed for night owls.',
          layout: 'basic-top',
          backgroundColor: '#0a0a0a',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#4ade80',
            doodles: [
              { type: 'star', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Less Glare, More Focus',
          subtitle: 'Reduce eye strain with our true-black theme.',
          layout: 'half-right',
          backgroundColor: '#000000',
          textColor: '#10b981',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#10b981',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Saves Battery',
          subtitle: 'OLED displays turn off pixels for black.',
          layout: 'half-left',
          backgroundColor: '#050505',
          textColor: '#3b82f6',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#38bdf8',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Switch Anytime',
          subtitle: 'Toggle between light and dark instantly.',
          layout: 'basic-bottom',
          backgroundColor: '#0a0a0a',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Playful & Vibrant (5 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'clay-light' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Fun & Vibrant',
          subtitle: 'Bring your ideas to life with color.',
          layout: 'tilt-right',
          backgroundColor: '#fef08a',
          textColor: '#1e3a8a',
          fontFamily: 'poppins',
          doodle: {
            enabled: false,
            color: '#e11d48',
            doodles: [
              { type: 'question', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Express Yourself',
          subtitle: 'Unleash your creativity everyday.',
          layout: 'tilt-left',
          backgroundColor: '#fbcfe8',
          textColor: '#831843',
          fontFamily: 'poppins',
          doodle: {
            enabled: false,
            color: '#be185d',
            doodles: [
              { type: 'heart', position: 'top-left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Stay Active',
          subtitle: 'Engage with a lively community.',
          layout: 'tilt-right',
          backgroundColor: '#a7f3d0',
          textColor: '#064e3b',
          fontFamily: 'poppins',
          doodle: {
            enabled: false,
            color: '#047857',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Find Joy',
          subtitle: 'Discover what makes you smile.',
          layout: 'tilt-left',
          backgroundColor: '#fed7aa',
          textColor: '#7c2d12',
          fontFamily: 'poppins',
          doodle: {
            enabled: false,
            color: '#c2410c',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'star', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Get Started',
          subtitle: 'Join the fun right now.',
          layout: 'basic-bottom',
          backgroundColor: '#bae6fd',
          textColor: '#0c4a6e',
          fontFamily: 'poppins',
          doodle: {
            enabled: false,
            color: '#0369a1',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `App Preview Banner (1 Screen)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'light', targetSize: 'play-feature-graphic' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Your Ultimate Toolkit',
          subtitle: 'Everything you need in one powerful application.',
          layout: 'half-right',
          backgroundColor: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'sparkles', position: 'top-right' },
              { type: 'lightning', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Split Screen Contrast (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Split The Difference',
          subtitle: 'Contrast is king.',
          layout: 'split-vertical',
          backgroundColor: '#111827',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Bold Choices',
          subtitle: 'Make a statement.',
          layout: 'split-vertical',
          backgroundColor: '#f3f4f6',
          textColor: '#111827',
          fontFamily: 'space-grotesk',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'target', position: 'top-left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Stand Out',
          subtitle: 'Never blend in.',
          layout: 'split-vertical',
          backgroundColor: '#111827',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'burst', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Take Action',
          subtitle: 'Begin today.',
          layout: 'split-vertical',
          backgroundColor: '#f3f4f6',
          textColor: '#111827',
          fontFamily: 'space-grotesk',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'check', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Minimalist White (3 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Simply Beautiful',
          subtitle: 'Focus on what matters most.',
          layout: 'basic-top',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'question', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Clarity First',
          subtitle: 'Zero distractions.',
          layout: 'half-right',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Pure Focus',
          subtitle: 'Get things done.',
          layout: 'tilt-left',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `AI Sparkle & Copilot (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Supercharge Your Intelligence',
          subtitle: 'Your personal AI companion for writing, research, and coding.',
          layout: 'hero-3d-center',
          backgroundColor: 'radial-gradient(circle at 50% 0%, #312e81 0%, #0f172a 60%, #000000 100%)',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          badge: { enabled: true, text: '#1 AI Tool of 2024', style: 'pill-glass', icon: 'sparkle' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'sparkles', position: 'top-right' },
              { type: 'arrow-curved', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Instant Answers with Live Sources',
          subtitle: 'Deep synthesis across web knowledge in under two seconds.',
          layout: 'basic-top',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'speech-bubble', position: 'top-left' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: '100% On-Device Privacy',
          subtitle: 'Your prompts and personal data never train public AI models.',
          layout: 'half-left',
          backgroundColor: 'radial-gradient(circle at 50% 50%, #4338ca 0%, #1e1b4b 80%, #000000 100%)',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          badge: { enabled: true, text: '100% Private & Encrypted', style: 'pill-glass', icon: 'shield' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'target', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Experience Next-Gen AI Today',
          subtitle: 'Join over 10M+ thinkers unlocking superhuman productivity.',
          layout: 'basic-bottom',
          backgroundColor: '#090d16',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          badge: { enabled: true, text: 'Apple Design Award', style: 'pill-solid', icon: 'trophy' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Bento Matrix Modern (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'light', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Organize Life & Work',
          subtitle: 'The unified modular workspace for high achievers.',
          layout: 'split-vertical',
          backgroundColor: '#111827',
          textColor: '#ffffff',
          fontFamily: 'plus-jakarta',
          badge: { enabled: true, text: 'Editors\' Choice', style: 'pill-glass', icon: 'star' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Capture at Lightspeed',
          subtitle: 'Natural language task entry with smart priority filters.',
          layout: 'half-right',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          fontFamily: 'plus-jakarta',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Never Miss a Beat',
          subtitle: 'Kanban boards, interactive calendars, and timeline views.',
          layout: 'half-left',
          backgroundColor: '#111827',
          textColor: '#ffffff',
          fontFamily: 'plus-jakarta',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'target', position: 'top-left' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Syncs Everywhere',
          subtitle: 'Instant offline support across phone, tablet, and desktop.',
          layout: 'split-vertical',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          fontFamily: 'plus-jakarta',
          badge: { enabled: true, text: 'Loved by 1M+ Users', style: 'pill-solid', icon: 'heart' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'check', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Fintech Dark Mode Pro (5 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Money Management, Simplified',
          subtitle: 'Spend, save, and invest with complete clarity in one place.',
          layout: 'banner-stack-right',
          backgroundColor: '#0a2216',
          textColor: '#ffffff',
          fontFamily: 'inter',
          badge: { enabled: true, text: '4.9 App Store', style: 'pill-glass', icon: 'star' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Real-Time Expense Tracking',
          subtitle: 'Automatic categorization across all your connected banks.',
          layout: 'half-right',
          backgroundColor: '#090d16',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Grow Wealth on Autopilot',
          subtitle: 'Invest in stocks, ETFs, and crypto with zero commission fees.',
          layout: '3d-isometric-right',
          backgroundColor: '#064e3b',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'target', position: 'top-left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Bank-Grade 256-bit Security',
          subtitle: 'Biometric locks, instant card freeze, and end-to-end encryption.',
          layout: 'split-vertical',
          backgroundColor: '#111827',
          textColor: '#ffffff',
          fontFamily: 'inter',
          badge: { enabled: true, text: 'Bank-Grade 256-bit', style: 'pill-solid', icon: 'shield' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'check', position: 'top-right' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Take Control Today',
          subtitle: 'Join over 5 million people mastering financial freedom.',
          layout: 'basic-bottom',
          backgroundColor: '#022c22',
          textColor: '#ffffff',
          fontFamily: 'inter',
          badge: { enabled: true, text: 'App of the Day', style: 'pill-solid', icon: 'trophy' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Glassmorphism Frosted Horizon (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Elegance in Motion',
          subtitle: 'A beautifully fluid experience designed for modern aesthetics.',
          layout: 'basic-top',
          backgroundColor: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          badge: { enabled: true, text: 'Apple Design Award', style: 'pill-glass', icon: 'trophy' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'sparkles', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Focus on What Matters',
          subtitle: 'Zero visual friction with frosted translucent layers.',
          layout: 'half-right',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Effortless Navigation',
          subtitle: 'Intuitive gestures and natural interactive ergonomics.',
          layout: 'tilt-left',
          backgroundColor: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #6366f1 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'arrow-curved', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Start Your Journey',
          subtitle: 'Download now to elevate your daily routine.',
          layout: 'basic-bottom',
          backgroundColor: 'radial-gradient(circle at 50% 0%, #334155 0%, #0f172a 60%, #000000 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          badge: { enabled: true, text: '4.9 App Store', style: 'pill-glass', icon: 'star' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'sparkles', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Cyberpunk Neon Glow (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'clay-dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Dominate the Leaderboards',
          subtitle: 'Live match analytics, champion meta builds, and pro guides.',
          layout: '3d-isometric-right',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          badge: { enabled: true, text: '#1 Gaming Companion', style: 'pill-solid', icon: 'flame' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Real-Time Voice Overlay',
          subtitle: 'Ultra-low latency audio chat engineered for competitive play.',
          layout: '3d-isometric-left',
          backgroundColor: '#09090b',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'speech-bubble', position: 'top-left' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'AI Replay Breakdown',
          subtitle: 'Pinpoint mechanical mistakes and climb the ranks faster.',
          layout: 'basic-top',
          backgroundColor: '#18181b',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'target', position: 'top-left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Level Up Your Game',
          subtitle: 'Join over 20 million passionate gamers worldwide.',
          layout: 'basic-bottom',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
          badge: { enabled: true, text: 'Best of 2024', style: 'pill-solid', icon: 'trophy' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'lightning', position: 'bottom-right' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Minimalist Studio Monochrome (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Pure Aesthetic. Zero Clutter.',
          subtitle: 'A clean studio showcase that lets your interface shine.',
          layout: 'basic-top',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'inter',
          badge: { enabled: true, text: 'Editor\'s Choice', style: 'pill-solid', icon: 'star' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'question', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Precision in Every Pixel',
          subtitle: 'High contrast visual hierarchy for maximum retention.',
          layout: 'half-right',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Seamless Micro-Interactions',
          subtitle: 'Engineered for smooth responsiveness and delight.',
          layout: 'half-left',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Download Free Today',
          subtitle: 'Join thousands enjoying a distraction-free experience.',
          layout: 'basic-bottom',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: 'inter',
          badge: { enabled: true, text: 'Top Rated', style: 'pill-solid', icon: 'trophy' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Sunset Velvet Story (5 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Begin Your Journey',
          subtitle: 'Swipe to see how we transform your daily workflow.',
          layout: 'half-right',
          backgroundColor: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          badge: { enabled: true, text: 'App of the Day', style: 'pill-glass', icon: 'trophy' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'heart', position: 'top-left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Connect Instantly',
          subtitle: 'With friends, colleagues, and collaborators worldwide.',
          layout: 'half-left',
          backgroundColor: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'speech-bubble', position: 'top-left' },
              { type: 'circle-loop', position: 'left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Share Your World',
          subtitle: 'Capture and broadcast vibrant memories in seconds.',
          layout: 'tilt-right',
          backgroundColor: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'sparkles', position: 'top-right' },
              { type: 'arrow-curved', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Stay 100% Private',
          subtitle: 'Enterprise-grade encryption protecting all your interactions.',
          layout: 'tilt-left',
          backgroundColor: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          badge: { enabled: true, text: '100% Private & On-Device', style: 'pill-glass', icon: 'shield' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'star', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Join Millions Today',
          subtitle: 'Download now and claim your welcome perks.',
          layout: 'basic-bottom',
          backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'lightning', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Warm Editorial Magazine (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'clay-light', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Timeless Stories. Curated Daily.',
          subtitle: 'Thoughtful long-form journalism and visual essays.',
          layout: 'basic-top',
          backgroundColor: '#f5f5f4',
          textColor: '#1c1917',
          fontFamily: 'playfair',
          badge: { enabled: true, text: 'Apple Design Award', style: 'pill-solid', icon: 'trophy' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'question', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Immersive Editorial Design',
          subtitle: 'Typography crafted for calm, unhurried reading.',
          layout: 'half-right',
          backgroundColor: '#1c1917',
          textColor: '#f5f5f4',
          fontFamily: 'playfair',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'star', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Audio Narratives on the Go',
          subtitle: 'Listen to award-winning stories during your commute.',
          layout: 'split-vertical',
          backgroundColor: '#f5f5f4',
          textColor: '#1c1917',
          fontFamily: 'playfair',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'speech-bubble', position: 'top-left' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Read Deeper Every Day',
          subtitle: 'Join over 2 million thoughtful readers worldwide.',
          layout: 'basic-bottom',
          backgroundColor: '#1c1917',
          textColor: '#f5f5f4',
          fontFamily: 'playfair',
          badge: { enabled: true, text: 'Top Rated', style: 'pill-solid', icon: 'star' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `SaaS Cloud Enterprise (4 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Run Your Enterprise from Anywhere',
          subtitle: 'Real-time pipeline analytics, team tasks, and client billing.',
          layout: 'basic-top',
          backgroundColor: '#0f172a',
          textColor: '#ffffff',
          fontFamily: 'plus-jakarta',
          badge: { enabled: true, text: 'Trusted by 10k+ Companies', style: 'pill-glass', icon: 'shield' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'target', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Live Revenue & Growth Dashboards',
          subtitle: 'Visualize ARR, customer churn, and pipeline velocity.',
          layout: 'half-right',
          backgroundColor: '#1e293b',
          textColor: '#ffffff',
          fontFamily: 'plus-jakarta',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Seamless Integrations',
          subtitle: 'Direct two-way sync with Slack, Salesforce, GitHub, and Stripe.',
          layout: 'split-vertical',
          backgroundColor: '#334155',
          textColor: '#ffffff',
          fontFamily: 'plus-jakarta',
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Start Your Free 14-Day Trial',
          subtitle: 'No credit card required. Onboard your whole team in 5 minutes.',
          layout: 'basic-bottom',
          backgroundColor: '#0f172a',
          textColor: '#ffffff',
          fontFamily: 'plus-jakarta',
          badge: { enabled: true, text: 'SOC2 & HIPAA Compliant', style: 'pill-solid', icon: 'shield' },
          doodle: {
            enabled: false,
            color: '#facc15',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'check', position: 'bottom-left' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: `Duotone Punch (5 Screens)`,
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'clay-light', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Bold Ideas. High Energy.',
          subtitle: 'Make an unmistakable statement in the App Store.',
          layout: 'tilt-right',
          backgroundColor: '#fef08a',
          textColor: '#1e3a8a',
          fontFamily: 'poppins',
          badge: { enabled: true, text: '#1 Product of the Day', style: 'pill-solid', icon: 'flame' },
          doodle: {
            enabled: false,
            color: '#e11d48',
            doodles: [
              { type: 'question', position: 'top-right' },
              { type: 'underline-wave', position: 'underline' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Vibrant Interactions',
          subtitle: 'Every touchpoint feels responsive, fluid, and alive.',
          layout: 'tilt-left',
          backgroundColor: '#fbcfe8',
          textColor: '#831843',
          fontFamily: 'poppins',
          doodle: {
            enabled: false,
            color: '#be185d',
            doodles: [
              { type: 'circle-loop', position: 'left' },
              { type: 'sparkles', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Speed That Blows You Away',
          subtitle: 'Engineered for sub-100ms response times globally.',
          layout: 'tilt-right',
          backgroundColor: '#a7f3d0',
          textColor: '#064e3b',
          fontFamily: 'poppins',
          doodle: {
            enabled: false,
            color: '#047857',
            doodles: [
              { type: 'lightning', position: 'top-right' },
              { type: 'burst', position: 'bottom-left' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Community Driven',
          subtitle: 'Share your creations and get recognized instantly.',
          layout: 'tilt-left',
          backgroundColor: '#fed7aa',
          textColor: '#7c2d12',
          fontFamily: 'poppins',
          doodle: {
            enabled: false,
            color: '#c2410c',
            doodles: [
              { type: 'heart', position: 'top-left' },
              { type: 'star', position: 'top-right' }
            ]
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Get Started for Free',
          subtitle: 'Join the next wave of creative thinkers.',
          layout: 'basic-bottom',
          backgroundColor: '#bae6fd',
          textColor: '#0c4a6e',
          fontFamily: 'poppins',
          doodle: {
            enabled: false,
            color: '#0369a1',
            doodles: [
              { type: 'crown', position: 'top-right' },
              { type: 'double-underline', position: 'underline' }
            ]
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Vibrant (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Welcome to the Future',
          subtitle: 'Experience innovation like never before.',
          layout: 'basic-top',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          subtitleColor: '#bfdbfe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#bfdbfe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Lightning Fast',
          subtitle: 'Optimized for the ultimate speed.',
          layout: 'tilt-right',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          subtitleColor: '#bfdbfe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#bfdbfe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Connect Anywhere',
          subtitle: 'Stay online, no matter where you go.',
          layout: 'tilt-left',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          subtitleColor: '#bfdbfe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#bfdbfe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Secure & Private',
          subtitle: 'Your data belongs to you, always.',
          layout: 'half-right',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          subtitleColor: '#bfdbfe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#bfdbfe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Get Started Today',
          subtitle: 'Join millions of happy users.',
          layout: 'hero-center',
          backgroundColor: '#3b82f6',
          textColor: '#ffffff',
          subtitleColor: '#bfdbfe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#bfdbfe',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Android Material You (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'clay-light', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Your Daily Companion',
          subtitle: 'Make every day more productive.',
          layout: 'hero-center',
          backgroundColor: '#f3e8ff',
          textColor: '#4c1d95',
          subtitleColor: '#6d28d9',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6d28d9',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Smart Insights',
          subtitle: 'Understand your habits instantly.',
          layout: 'half-left',
          backgroundColor: '#f3e8ff',
          textColor: '#4c1d95',
          subtitleColor: '#6d28d9',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6d28d9',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Seamless Sync',
          subtitle: 'Across all your favorite devices.',
          layout: 'half-right',
          backgroundColor: '#f3e8ff',
          textColor: '#4c1d95',
          subtitleColor: '#6d28d9',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6d28d9',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Beautiful Design',
          subtitle: 'Crafted with Material You in mind.',
          layout: 'tilt-bottom-right',
          backgroundColor: '#f3e8ff',
          textColor: '#4c1d95',
          subtitleColor: '#6d28d9',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6d28d9',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Achieve More',
          subtitle: 'Start your journey right now.',
          layout: 'basic-bottom',
          backgroundColor: '#f3e8ff',
          textColor: '#4c1d95',
          subtitleColor: '#6d28d9',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6d28d9',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Dark AMOLED (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'samsung-s26' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'True Black Interface',
          subtitle: 'Save battery with stunning AMOLED dark mode.',
          layout: 'split-vertical',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Focus on Content',
          subtitle: 'No distractions, just what matters.',
          layout: 'basic-top',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Night Owl Mode',
          subtitle: 'Easy on your eyes after sunset.',
          layout: '3d-isometric-right',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Customizable Themes',
          subtitle: 'Make it truly your own.',
          layout: '3d-isometric-left',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Embrace the Dark',
          subtitle: 'Download now and save power.',
          layout: 'hero-center',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Minimal Glass (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'samsung-s26' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Clarity & Focus',
          subtitle: 'A clutter-free experience.',
          layout: 'og-style-1',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          subtitleColor: '#475569',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#475569',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Intuitive Controls',
          subtitle: 'Gestures that feel natural.',
          layout: 'half-right',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          subtitleColor: '#475569',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#475569',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Crystal Clear',
          subtitle: 'High resolution assets and typography.',
          layout: 'half-left',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          subtitleColor: '#475569',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#475569',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Organize Your Life',
          subtitle: 'Everything in its right place.',
          layout: 'tilt-right-complement',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          subtitleColor: '#475569',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#475569',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Minimalist Perfection',
          subtitle: 'Try it for free today.',
          layout: 'tilt-left-complement',
          backgroundColor: '#f8fafc',
          textColor: '#0f172a',
          subtitleColor: '#475569',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#475569',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Gradient Burst (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Unleash the Power',
          subtitle: 'Next generation mobile experience.',
          layout: 'hero-3d-center',
          backgroundColor: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fbcfe8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fbcfe8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Vibrant Colors',
          subtitle: 'Stand out from the crowd.',
          layout: 'tilt-right',
          backgroundColor: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fbcfe8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fbcfe8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Dynamic Layouts',
          subtitle: 'Adapts to your screen size.',
          layout: 'half-left',
          backgroundColor: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fbcfe8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fbcfe8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Share with Friends',
          subtitle: 'One tap to spread the word.',
          layout: 'basic-bottom',
          backgroundColor: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fbcfe8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fbcfe8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Join the Revolution',
          subtitle: 'Be part of something bigger.',
          layout: 'basic-top',
          backgroundColor: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fbcfe8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fbcfe8',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Android Gaming Pro (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'samsung-s26' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Level Up Your Game',
          subtitle: 'Track stats, analyze matches, win more.',
          layout: 'basic-top',
          backgroundColor: '#171717',
          textColor: '#22c55e',
          subtitleColor: '#d4d4d8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#d4d4d8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Real-Time Stats',
          subtitle: 'Never miss a beat during the match.',
          layout: 'tilt-right',
          backgroundColor: '#171717',
          textColor: '#22c55e',
          subtitleColor: '#d4d4d8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#d4d4d8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Pro Strategies',
          subtitle: 'Learn from the best in the world.',
          layout: 'tilt-left',
          backgroundColor: '#171717',
          textColor: '#22c55e',
          subtitleColor: '#d4d4d8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#d4d4d8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Connect with Squad',
          subtitle: 'Voice chat and tactical planning.',
          layout: 'half-right',
          backgroundColor: '#171717',
          textColor: '#22c55e',
          subtitleColor: '#d4d4d8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#d4d4d8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Ready to Play?',
          subtitle: 'Download and dominate.',
          layout: 'hero-center',
          backgroundColor: '#171717',
          textColor: '#22c55e',
          subtitleColor: '#d4d4d8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#d4d4d8',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Split Tone (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'light', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Two Sides of the Story',
          subtitle: 'Balance your personal and work life.',
          layout: 'hero-center',
          backgroundColor: '#fbbf24',
          textColor: '#78350f',
          subtitleColor: '#92400e',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#92400e',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Split Screen Ready',
          subtitle: 'Multitask like a true professional.',
          layout: 'half-left',
          backgroundColor: '#fbbf24',
          textColor: '#78350f',
          subtitleColor: '#92400e',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#92400e',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Contrast that Pops',
          subtitle: 'Designed to capture attention.',
          layout: 'half-right',
          backgroundColor: '#fbbf24',
          textColor: '#78350f',
          subtitleColor: '#92400e',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#92400e',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Drag and Drop',
          subtitle: 'Move files across apps effortlessly.',
          layout: 'tilt-bottom-right',
          backgroundColor: '#fbbf24',
          textColor: '#78350f',
          subtitleColor: '#92400e',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#92400e',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Find Your Balance',
          subtitle: 'Get the app today.',
          layout: 'basic-bottom',
          backgroundColor: '#fbbf24',
          textColor: '#78350f',
          subtitleColor: '#92400e',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#92400e',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Android Productivity (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'clay-light', targetSize: 'samsung-s26' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Boost Productivity',
          subtitle: 'Get more done in less time.',
          layout: 'split-vertical',
          backgroundColor: '#e0f2fe',
          textColor: '#0369a1',
          subtitleColor: '#0284c7',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0284c7',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Task Management',
          subtitle: 'Keep track of every little detail.',
          layout: 'basic-top',
          backgroundColor: '#e0f2fe',
          textColor: '#0369a1',
          subtitleColor: '#0284c7',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0284c7',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Collaborate Live',
          subtitle: 'Work with your team in real-time.',
          layout: '3d-isometric-right',
          backgroundColor: '#e0f2fe',
          textColor: '#0369a1',
          subtitleColor: '#0284c7',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0284c7',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Automate Workflows',
          subtitle: 'Let the app do the heavy lifting.',
          layout: '3d-isometric-left',
          backgroundColor: '#e0f2fe',
          textColor: '#0369a1',
          subtitleColor: '#0284c7',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0284c7',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Start Achieving',
          subtitle: 'Your goals are within reach.',
          layout: 'hero-center',
          backgroundColor: '#e0f2fe',
          textColor: '#0369a1',
          subtitleColor: '#0284c7',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0284c7',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Fitness Pulse (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Track Every Heartbeat',
          subtitle: 'Real-time heart rate zones, cardio load, and active calorie burn.',
          layout: 'og-style-1',
          backgroundColor: '#ef4444',
          textColor: '#ffffff',
          subtitleColor: '#fecaca',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fecaca',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'High-Intensity Intervals',
          subtitle: 'Built-in HIIT timers, interval audio cues, and custom workout sets.',
          layout: 'half-right',
          backgroundColor: '#ef4444',
          textColor: '#ffffff',
          subtitleColor: '#fecaca',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fecaca',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Live GPS Pace & Routes',
          subtitle: 'Precision elevation graphs, split times, and outdoor running maps.',
          layout: 'half-left',
          backgroundColor: '#ef4444',
          textColor: '#ffffff',
          subtitleColor: '#fecaca',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fecaca',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Smart Muscle Recovery',
          subtitle: 'HRV readiness scores and daily rest recommendations before you train.',
          layout: 'tilt-right-complement',
          backgroundColor: '#ef4444',
          textColor: '#ffffff',
          subtitleColor: '#fecaca',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fecaca',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Crush Your Personal Bests',
          subtitle: 'Join over 1 million athletes leveling up their physical peak.',
          layout: 'tilt-left-complement',
          backgroundColor: '#ef4444',
          textColor: '#ffffff',
          subtitleColor: '#fecaca',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fecaca',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Android Finance Trust (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'samsung-s26' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Nordic Wealth & Banking',
          subtitle: 'Institutional-grade security with clean Scandinavian clarity.',
          layout: 'hero-3d-center',
          backgroundColor: '#064e3b',
          textColor: '#ffffff',
          subtitleColor: '#a7f3d0',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a7f3d0',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Zero-Fee Global Transfers',
          subtitle: 'Send 40+ currencies worldwide at true interbank exchange rates.',
          layout: 'tilt-right',
          backgroundColor: '#064e3b',
          textColor: '#ffffff',
          subtitleColor: '#a7f3d0',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a7f3d0',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Automated Micro-Investing',
          subtitle: 'Round up daily purchases into diversified global ETF portfolios.',
          layout: 'half-left',
          backgroundColor: '#064e3b',
          textColor: '#ffffff',
          subtitleColor: '#a7f3d0',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a7f3d0',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Bank-Grade 256-Bit Vault',
          subtitle: 'Biometric authorization, instant card freeze, and fraud defense.',
          layout: 'basic-bottom',
          backgroundColor: '#064e3b',
          textColor: '#ffffff',
          subtitleColor: '#a7f3d0',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a7f3d0',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Master Your Financial Future',
          subtitle: 'Open your verified account in under 3 minutes.',
          layout: 'basic-top',
          backgroundColor: '#064e3b',
          textColor: '#ffffff',
          subtitleColor: '#a7f3d0',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a7f3d0',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Social (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'clay-light', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Catch the Social Wave',
          subtitle: 'Connect with close friends and join spontaneous voice rooms.',
          layout: 'basic-top',
          backgroundColor: '#ffedd5',
          textColor: '#9a3412',
          subtitleColor: '#c2410c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c2410c',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Authentic Daily Drops',
          subtitle: 'Share real, unfiltered snapshots with your closest circle.',
          layout: 'tilt-right',
          backgroundColor: '#ffedd5',
          textColor: '#9a3412',
          subtitleColor: '#c2410c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c2410c',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Micro-Communities & Clubs',
          subtitle: 'Discover interest-based channels tailored to your exact passions.',
          layout: 'tilt-left',
          backgroundColor: '#ffedd5',
          textColor: '#9a3412',
          subtitleColor: '#c2410c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c2410c',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'End-to-End Encrypted Chat',
          subtitle: 'Private direct messages, secret threads, and disappearing media.',
          layout: 'half-right',
          backgroundColor: '#ffedd5',
          textColor: '#9a3412',
          subtitleColor: '#c2410c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c2410c',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Find Your Digital Tribe',
          subtitle: 'Download free and start creating memorable moments today.',
          layout: 'hero-center',
          backgroundColor: '#ffedd5',
          textColor: '#9a3412',
          subtitleColor: '#c2410c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c2410c',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Android Utility Tools (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'samsung-s26' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'The Swiss Army Knife for Mobile',
          subtitle: 'Over 20 essential utility tools, sensors, and offline diagnostics.',
          layout: 'hero-center',
          backgroundColor: '#374151',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Pro Document & OCR Scanner',
          subtitle: 'Digitize documents to searchable PDFs with instant text recognition.',
          layout: 'half-left',
          backgroundColor: '#374151',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Live Network & Wi-Fi Analyzer',
          subtitle: 'Measure signal strength, packet latency, and local network devices.',
          layout: 'half-right',
          backgroundColor: '#374151',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Universal Unit & Currency Converter',
          subtitle: 'Convert 150+ measurement units and live foreign exchange rates.',
          layout: 'tilt-bottom-right',
          backgroundColor: '#374151',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Lightweight & 100% Offline',
          subtitle: 'No background battery drain, no intrusive trackers, zero bloat.',
          layout: 'basic-bottom',
          backgroundColor: '#374151',
          textColor: '#ffffff',
          subtitleColor: '#9ca3af',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#9ca3af',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Education (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'light', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Learn Anything in 10 Minutes',
          subtitle: 'Bite-sized interactive masterclasses engineered for busy minds.',
          layout: 'split-vertical',
          backgroundColor: '#dcfce7',
          textColor: '#166534',
          subtitleColor: '#15803d',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#15803d',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Gamified Language Mastery',
          subtitle: 'Speech recognition AI that perfects your pronunciation in real time.',
          layout: 'basic-top',
          backgroundColor: '#dcfce7',
          textColor: '#166534',
          subtitleColor: '#15803d',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#15803d',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Track Streaks & Milestones',
          subtitle: 'Stay committed with spaced repetition and personalized daily study goals.',
          layout: '3d-isometric-right',
          backgroundColor: '#dcfce7',
          textColor: '#166534',
          subtitleColor: '#15803d',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#15803d',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Offline Audio Lessons',
          subtitle: 'Access complete audio modules and quizzes on flights and commutes.',
          layout: '3d-isometric-left',
          backgroundColor: '#dcfce7',
          textColor: '#166534',
          subtitleColor: '#15803d',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#15803d',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Accelerate Your Intellect',
          subtitle: 'Join over 25 million curious students learning every day.',
          layout: 'hero-center',
          backgroundColor: '#dcfce7',
          textColor: '#166534',
          subtitleColor: '#15803d',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#15803d',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Travel (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'samsung-s26' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Explore the Globe with Ease',
          subtitle: 'Uncover secret flight deals, boutique stays, and curated road trips.',
          layout: 'og-style-1',
          backgroundColor: '#cffafe',
          textColor: '#164e63',
          subtitleColor: '#0891b2',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0891b2',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'AI Fare Prediction Radar',
          subtitle: 'Know the exact time to book flights with price drop confidence.',
          layout: 'half-right',
          backgroundColor: '#cffafe',
          textColor: '#164e63',
          subtitleColor: '#0891b2',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0891b2',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Offline Itinerary Organizer',
          subtitle: 'Automatic booking sync, boarding passes, and offline terminal maps.',
          layout: 'half-left',
          backgroundColor: '#cffafe',
          textColor: '#164e63',
          subtitleColor: '#0891b2',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0891b2',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Curated Local Guides',
          subtitle: 'Hand-picked dining spots, scenic viewpoints, and neighborhood gems.',
          layout: 'tilt-right-complement',
          backgroundColor: '#cffafe',
          textColor: '#164e63',
          subtitleColor: '#0891b2',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0891b2',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Your Next Adventure Begins',
          subtitle: 'Start exploring breathtaking destinations with total confidence.',
          layout: 'tilt-left-complement',
          backgroundColor: '#cffafe',
          textColor: '#164e63',
          subtitleColor: '#0891b2',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#0891b2',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Android Creative Studio (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'light', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Vector & Digital Art Studio',
          subtitle: 'Professional illustration, pressure-sensitive brushes, and layer masks.',
          layout: 'hero-3d-center',
          backgroundColor: 'linear-gradient(45deg, #f43f5e 0%, #facc15 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fffbeb',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fffbeb',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Endless Custom Brushes',
          subtitle: 'Acrylic, watercolor, ink, and pencil textures with ultra-low latency.',
          layout: 'tilt-right',
          backgroundColor: 'linear-gradient(45deg, #f43f5e 0%, #facc15 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fffbeb',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fffbeb',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Non-Destructive Layer Blending',
          subtitle: 'Unlimited layer stacks, clipping masks, and live adjustment filters.',
          layout: 'half-left',
          backgroundColor: 'linear-gradient(45deg, #f43f5e 0%, #facc15 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fffbeb',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fffbeb',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Precision Color Palettes',
          subtitle: 'HEX codes, Pantone harmony wheels, and dynamic color pickers.',
          layout: 'basic-bottom',
          backgroundColor: 'linear-gradient(45deg, #f43f5e 0%, #facc15 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fffbeb',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fffbeb',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Export in 8K Ultra Resolution',
          subtitle: 'Lossless vector SVG, high-DPI PNG, and PSD format compatibility.',
          layout: 'basic-top',
          backgroundColor: 'linear-gradient(45deg, #f43f5e 0%, #facc15 100%)',
          textColor: '#ffffff',
          subtitleColor: '#fffbeb',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fffbeb',
            doodles: []
          }
        }
      ]);
    }
  },
  {
    name: 'Play Store Feature Graphic (1 Screen)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'play-feature-graphic' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'The Ultimate Experience',
          subtitle: 'Download now and transform your daily routine.',
          layout: 'hero-center',
          backgroundColor: 'radial-gradient(circle, #2563eb 0%, #1e3a8a 100%)',
          textColor: '#ffffff',
          subtitleColor: '#93c5fd',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#93c5fd',
            doodles: []
          }
        }
      ]);
    }
  },

  {
    name: 'Android Tablet Pro (4 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'android-tablet-10' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Bigger Canvas',
          subtitle: 'More space for your ideas.',
          layout: 'basic-bottom',
          backgroundColor: '#020617',
          textColor: '#e2e8f0',
          subtitleColor: '#94a3b8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#94a3b8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Multitasking Master',
          subtitle: 'Run apps side by side effortlessly.',
          layout: 'split-vertical',
          backgroundColor: '#020617',
          textColor: '#e2e8f0',
          subtitleColor: '#94a3b8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#94a3b8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Desktop Class',
          subtitle: 'Features you need, on the go.',
          layout: 'device-only',
          backgroundColor: '#020617',
          textColor: '#e2e8f0',
          subtitleColor: '#94a3b8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#94a3b8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Immersive Media',
          subtitle: 'Watch and play in high definition.',
          layout: '3d-isometric-right',
          backgroundColor: '#020617',
          textColor: '#e2e8f0',
          subtitleColor: '#94a3b8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#94a3b8',
            doodles: []
          }
        }
      ]);
    }
  },

  {
    name: 'Android Tablet Minimal (4 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'light', targetSize: 'android-tablet-10' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Focus on Writing',
          subtitle: 'A distraction free environment.',
          layout: 'hero-center',
          backgroundColor: '#f1f5f9',
          textColor: '#0f172a',
          subtitleColor: '#475569',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#475569',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Cloud Sync',
          subtitle: 'Access from phone, tablet, and PC.',
          layout: 'og-style-1',
          backgroundColor: '#f1f5f9',
          textColor: '#0f172a',
          subtitleColor: '#475569',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#475569',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Export Anywhere',
          subtitle: 'PDF, Word, and Markdown support.',
          layout: 'basic-top',
          backgroundColor: '#f1f5f9',
          textColor: '#0f172a',
          subtitleColor: '#475569',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#475569',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Clean Interface',
          subtitle: 'Only the tools you need right now.',
          layout: 'half-right',
          backgroundColor: '#f1f5f9',
          textColor: '#0f172a',
          subtitleColor: '#475569',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#475569',
            doodles: []
          }
        }
      ]);
    }
  },

  {
    name: 'Play Store Casual Games (6 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Pop the Bubbles',
          subtitle: 'Match 3 to clear the board!',
          layout: 'basic-bottom',
          backgroundColor: '#f472b6',
          textColor: '#ffffff',
          subtitleColor: '#fdf2f8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fdf2f8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Daily Rewards',
          subtitle: 'Come back every day for free coins.',
          layout: 'split-vertical',
          backgroundColor: '#f472b6',
          textColor: '#ffffff',
          subtitleColor: '#fdf2f8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fdf2f8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Unlock Characters',
          subtitle: 'Over 50 cute animals to collect.',
          layout: 'device-only',
          backgroundColor: '#f472b6',
          textColor: '#ffffff',
          subtitleColor: '#fdf2f8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fdf2f8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Compete Globally',
          subtitle: 'Climb the leaderboards.',
          layout: '3d-isometric-right',
          backgroundColor: '#f472b6',
          textColor: '#ffffff',
          subtitleColor: '#fdf2f8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fdf2f8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Play Offline',
          subtitle: 'No Wi-Fi? No problem!',
          layout: 'hero-3d-center',
          backgroundColor: '#f472b6',
          textColor: '#ffffff',
          subtitleColor: '#fdf2f8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fdf2f8',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Endless Fun',
          subtitle: 'Thousands of levels await.',
          layout: 'og-style-2',
          backgroundColor: '#f472b6',
          textColor: '#ffffff',
          subtitleColor: '#fdf2f8',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#fdf2f8',
            doodles: []
          }
        }
      ]);
    }
  },

  {
    name: 'Android Security & VPN (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'samsung-s26' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Bank-Grade Security',
          subtitle: 'Your data is encrypted and safe.',
          layout: 'hero-center',
          backgroundColor: '#0f766e',
          textColor: '#ffffff',
          subtitleColor: '#ccfbf1',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#ccfbf1',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'One-Tap Connect',
          subtitle: 'Secure your connection instantly.',
          layout: 'og-style-1',
          backgroundColor: '#0f766e',
          textColor: '#ffffff',
          subtitleColor: '#ccfbf1',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#ccfbf1',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Global Servers',
          subtitle: 'Access content from anywhere.',
          layout: 'basic-top',
          backgroundColor: '#0f766e',
          textColor: '#ffffff',
          subtitleColor: '#ccfbf1',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#ccfbf1',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Zero Logs Policy',
          subtitle: 'We never track your browsing.',
          layout: 'half-right',
          backgroundColor: '#0f766e',
          textColor: '#ffffff',
          subtitleColor: '#ccfbf1',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#ccfbf1',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Stay Protected',
          subtitle: 'On public Wi-Fi and beyond.',
          layout: 'tilt-right',
          backgroundColor: '#0f766e',
          textColor: '#ffffff',
          subtitleColor: '#ccfbf1',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#ccfbf1',
            doodles: []
          }
        }
      ]);
    }
  },

  {
    name: 'Play Store E-Commerce (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'light', targetSize: 'samsung-s26-ultra' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Shop the Latest Trends',
          subtitle: 'Thousands of items added daily.',
          layout: 'basic-bottom',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          subtitleColor: '#6b7280',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6b7280',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Exclusive Discounts',
          subtitle: 'App-only deals you will love.',
          layout: 'split-vertical',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          subtitleColor: '#6b7280',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6b7280',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Fast Checkout',
          subtitle: 'Save your details securely.',
          layout: 'device-only',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          subtitleColor: '#6b7280',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6b7280',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Track Your Order',
          subtitle: 'Real-time shipping updates.',
          layout: '3d-isometric-right',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          subtitleColor: '#6b7280',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6b7280',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Easy Returns',
          subtitle: 'Hassle-free 30-day return policy.',
          layout: 'hero-3d-center',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          subtitleColor: '#6b7280',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#6b7280',
            doodles: []
          }
        }
      ]);
    }
  },

  {
    name: 'Android Weather App (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Accurate Forecasts',
          subtitle: 'Know what to expect before you step out.',
          layout: 'hero-center',
          backgroundColor: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
          textColor: '#ffffff',
          subtitleColor: '#e0f2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#e0f2fe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Live Radar',
          subtitle: 'Track storms in real-time.',
          layout: 'og-style-1',
          backgroundColor: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
          textColor: '#ffffff',
          subtitleColor: '#e0f2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#e0f2fe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Severe Alerts',
          subtitle: 'Stay safe with push notifications.',
          layout: 'basic-top',
          backgroundColor: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
          textColor: '#ffffff',
          subtitleColor: '#e0f2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#e0f2fe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Hourly Breakdowns',
          subtitle: 'Plan your day hour by hour.',
          layout: 'half-right',
          backgroundColor: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
          textColor: '#ffffff',
          subtitleColor: '#e0f2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#e0f2fe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Beautiful Widgets',
          subtitle: 'Weather at a glance on your home screen.',
          layout: 'tilt-right',
          backgroundColor: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
          textColor: '#ffffff',
          subtitleColor: '#e0f2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#e0f2fe',
            doodles: []
          }
        }
      ]);
    }
  },

  {
    name: 'Play Store Photography (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'samsung-s26' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Professional Filters',
          subtitle: 'Elevate your photos in one tap.',
          layout: 'basic-bottom',
          backgroundColor: '#18181b',
          textColor: '#ffffff',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a1a1aa',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Advanced Editing',
          subtitle: 'Fine-tune exposure, contrast, and more.',
          layout: 'split-vertical',
          backgroundColor: '#18181b',
          textColor: '#ffffff',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a1a1aa',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'RAW Support',
          subtitle: 'Edit high quality files seamlessly.',
          layout: 'device-only',
          backgroundColor: '#18181b',
          textColor: '#ffffff',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a1a1aa',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Batch Processing',
          subtitle: 'Apply edits to multiple photos at once.',
          layout: '3d-isometric-right',
          backgroundColor: '#18181b',
          textColor: '#ffffff',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a1a1aa',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Share Your Art',
          subtitle: 'Export in full resolution.',
          layout: 'hero-3d-center',
          backgroundColor: '#18181b',
          textColor: '#ffffff',
          subtitleColor: '#a1a1aa',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#a1a1aa',
            doodles: []
          }
        }
      ]);
    }
  },

  {
    name: 'Android Local Dating (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'clay-light', targetSize: 'android-tall' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Meet Local Singles',
          subtitle: 'Find your perfect match nearby.',
          layout: 'hero-center',
          backgroundColor: '#fda4af',
          textColor: '#881337',
          subtitleColor: '#be123c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#be123c',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Verified Profiles',
          subtitle: 'Real people, real connections.',
          layout: 'og-style-1',
          backgroundColor: '#fda4af',
          textColor: '#881337',
          subtitleColor: '#be123c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#be123c',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Icebreakers',
          subtitle: 'Start the conversation effortlessly.',
          layout: 'basic-top',
          backgroundColor: '#fda4af',
          textColor: '#881337',
          subtitleColor: '#be123c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#be123c',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Video Chat',
          subtitle: 'Connect face-to-face securely.',
          layout: 'half-right',
          backgroundColor: '#fda4af',
          textColor: '#881337',
          subtitleColor: '#be123c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#be123c',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Find Love Today',
          subtitle: 'Join the community.',
          layout: 'tilt-right',
          backgroundColor: '#fda4af',
          textColor: '#881337',
          subtitleColor: '#be123c',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#be123c',
            doodles: []
          }
        }
      ]);
    }
  },

  {
    name: 'Play Store Music Player (5 Screens)',
    apply: (loadTemplate, _updateGlobalSettings) => {
      _updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'samsung-s26-ultra' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'High-Res Audio',
          subtitle: 'Experience music in studio quality.',
          layout: 'basic-bottom',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          textColor: '#ffffff',
          subtitleColor: '#c7d2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c7d2fe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Smart Playlists',
          subtitle: 'Mixes tailored to your taste.',
          layout: 'split-vertical',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          textColor: '#ffffff',
          subtitleColor: '#c7d2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c7d2fe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Offline Mode',
          subtitle: 'Download your favorites for the road.',
          layout: 'device-only',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          textColor: '#ffffff',
          subtitleColor: '#c7d2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c7d2fe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Lyrics on Sync',
          subtitle: 'Sing along with real-time lyrics.',
          layout: '3d-isometric-right',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          textColor: '#ffffff',
          subtitleColor: '#c7d2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c7d2fe',
            doodles: []
          }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Crossfade & EQ',
          subtitle: 'Take control of your sound.',
          layout: 'hero-3d-center',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          textColor: '#ffffff',
          subtitleColor: '#c7d2fe',
          fontFamily: 'inter',
          doodle: {
            enabled: false,
            color: '#c7d2fe',
            doodles: []
          }
        }
      ]);
    }
  }
];
export const TEMPLATES: TemplateDefinition[] = RAW_TEMPLATES.map((raw) => {
  const logo = TEMPLATE_LOGOS[raw.name] || {
    appName: raw.name.replace(/\s*\([^)]*\)/, ''),
    style: 'Clean Modern',
    icon: 'star',
    bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    accentColor: '#3b82f6',
    svgDataUri: '',
  };

  const nameLower = raw.name.toLowerCase();
  let category = 'Minimal & Clean';
  if (
    nameLower.includes('ai') ||
    nameLower.includes('copilot') ||
    nameLower.includes('saas') ||
    nameLower.includes('cloud') ||
    nameLower.includes('cyberpunk') ||
    nameLower.includes('matrix') ||
    nameLower.includes('vpn') ||
    nameLower.includes('security') ||
    nameLower.includes('utility') ||
    nameLower.includes('productivity') ||
    nameLower.includes('tablet pro')
  ) {
    category = 'SaaS & AI';
  } else if (
    nameLower.includes('fintech') ||
    nameLower.includes('crypto') ||
    nameLower.includes('card') ||
    nameLower.includes('finance') ||
    nameLower.includes('neoncard') ||
    nameLower.includes('wallet') ||
    nameLower.includes('trust')
  ) {
    category = 'Fintech & Finance';
  } else if (
    nameLower.includes('fitness') ||
    nameLower.includes('health') ||
    nameLower.includes('calorie') ||
    nameLower.includes('workout') ||
    nameLower.includes('yoga') ||
    nameLower.includes('running') ||
    nameLower.includes('pulse')
  ) {
    category = 'Fitness & Health';
  } else if (
    nameLower.includes('banner') ||
    nameLower.includes('kinetic') ||
    nameLower.includes('triple') ||
    nameLower.includes('stack') ||
    nameLower.includes('platano') ||
    nameLower.includes('hero 3d') ||
    nameLower.includes('bento') ||
    nameLower.includes('feature graphic')
  ) {
    category = 'Banner & Feature';
  } else if (
    nameLower.includes('social') ||
    nameLower.includes('lifestyle') ||
    nameLower.includes('story') ||
    nameLower.includes('aesthetic') ||
    nameLower.includes('photo') ||
    nameLower.includes('travel') ||
    nameLower.includes('food') ||
    nameLower.includes('dating') ||
    nameLower.includes('weather') ||
    nameLower.includes('music') ||
    nameLower.includes('casual') ||
    nameLower.includes('gaming') ||
    nameLower.includes('creative') ||
    nameLower.includes('education') ||
    nameLower.includes('commerce') ||
    nameLower.includes('material')
  ) {
    category = 'Lifestyle & Social';
  }

  return {
    name: raw.name,
    style: logo.style,
    category,
    logo,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({
        appName: logo.appName,
        companyName: logo.style,
      });
      raw.apply(
        (canvases) => {
          const canvasesWithLogo = canvases.map((c) => ({
            ...c,
            appIconSrc: c.appIconSrc || logo.svgDataUri,
          }));
          loadTemplate(canvasesWithLogo);
        },
        (settings) => {
          updateGlobalSettings({
            appName: logo.appName,
            companyName: logo.style,
            ...settings,
          });
        }
      );
    },
  };
});
