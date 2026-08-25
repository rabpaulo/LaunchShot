import type { CanvasItem, GlobalSettings } from '@/store/useEditorStore';



export interface TemplateDefinition {
  name: string;
  apply: (
    loadTemplate: (canvases: CanvasItem[]) => void, 
    updateGlobalSettings: (settings: Partial<GlobalSettings>) => void
  ) => void;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    name: 'Banner Stacked Right',
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Calories, macros and workouts. In one app.',
          subtitle: 'Log in seconds.\nUnderstand what you eat.',
          layout: 'banner-stack-right',
          backgroundColor: '#0f3a21', // Dark green like idea1
          textColor: '#ffffff',
          fontFamily: 'inter',
          badge: { enabled: true, text: 'Top Rated', style: 'pill-glass', icon: 'star' }
        }
      ]);
    }
  },
  {
    name: 'Banner Triple Bottom',
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'The why behind your recovery.',
          subtitle: 'Every metric with its story: sleep stages, resting HR and HRV.',
          layout: 'banner-triple-bottom',
          backgroundColor: '#113c2c', // Dark green like idea2
          textColor: '#ffffff',
          fontFamily: 'inter',
        }
      ]);
    }
  },
  {
    name: 'Hero 3D Showcase',
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: 'Top Rated', style: 'pill-glass', icon: 'star' }
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
        }
      ]);
    }
  },
  {
    name: 'Dynamic Overlap',
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Immersive Experience',
          subtitle: 'Focus on what matters most.',
          layout: 'dynamic-overlap',
          backgroundColor: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          badge: { enabled: true, text: 'Editor\'s Choice', style: 'pill-solid', icon: 'trophy' }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Seamless Flow',
          subtitle: 'Your data, beautifully visualized.',
          layout: 'dynamic-overlap',
          backgroundColor: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
        }
      ]);
    }
  },

  {
    name: `NeonCard Template`,
    apply: (loadTemplate, updateGlobalSettings) => {
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
                  }
                ]);
    }
  },
  {
    name: `Basic Template (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
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
                  }
                ]);
    }
  },
  {
    name: `3D Showcase (3 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      loadTemplate([
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Immersive 3D Experience',
                    subtitle: 'Stand out from the crowd with beautiful isometric layouts',
                    layout: '3d-isometric-right',
                    backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', // Midnight Violet
                    textColor: '#ffffff',
                    fontFamily: 'inter',
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Highlight Your UI',
                    subtitle: 'Let your app design speak for itself in 3D',
                    layout: '3d-isometric-left',
                    backgroundColor: 'linear-gradient(135deg, #090d16 0%, #1e293b 60%, #334155 100%)', // Deep Obsidian
                    textColor: '#ffffff',
                    fontFamily: 'inter',
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Engage Your Users',
                    subtitle: 'Create a cinematic experience before they even download',
                    layout: '3d-isometric-right',
                    backgroundColor: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)', // Emerald Forest
                    textColor: '#ffffff',
                    fontFamily: 'inter',
                  }
                ]);
    }
  },
  {
    name: `Lifestyle Showcase (3 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
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
                  }
                ]);
    }
  },
  {
    name: `Continuous Story (5 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
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
                  }
                ]);
    }
  },
  {
    name: `Social Graphic - Style 1`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'play-feature-graphic' });
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
                    appIconSrc: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop'
                  }
                ]);
    }
  },
  {
    name: `Social Graphic - Style 2`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'play-feature-graphic' });
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
                  }
                ]);
    }
  },
  {
    name: `Social Graphic - Style 3`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'play-feature-graphic' });
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
                  }
                ]);
    }
  },
  {
    name: `Dark Mode Elegance (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark' });
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
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Less Glare, More Focus',
                    subtitle: 'Reduce eye strain with our true-black theme.',
                    layout: 'half-right',
                    backgroundColor: '#000000',
                    textColor: '#10b981', // Neon green accent
                    fontFamily: 'outfit',
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Saves Battery',
                    subtitle: 'OLED displays turn off pixels for black.',
                    layout: 'half-left',
                    backgroundColor: '#050505',
                    textColor: '#3b82f6', // Neon blue accent
                    fontFamily: 'outfit',
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
                  }
                ]);
    }
  },
  {
    name: `Playful & Vibrant (5 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'clay-light' });
      loadTemplate([
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Fun & Vibrant',
                    subtitle: 'Bring your ideas to life with color.',
                    layout: 'tilt-right',
                    backgroundColor: '#fef08a', // Yellow
                    textColor: '#1e3a8a',
                    fontFamily: 'poppins',
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Express Yourself',
                    subtitle: 'Unleash your creativity everyday.',
                    layout: 'tilt-left',
                    backgroundColor: '#fbcfe8', // Pink
                    textColor: '#831843',
                    fontFamily: 'poppins',
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Stay Active',
                    subtitle: 'Engage with a lively community.',
                    layout: 'tilt-right',
                    backgroundColor: '#a7f3d0', // Mint
                    textColor: '#064e3b',
                    fontFamily: 'poppins',
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Find Joy',
                    subtitle: 'Discover what makes you smile.',
                    layout: 'tilt-left',
                    backgroundColor: '#fed7aa', // Orange
                    textColor: '#7c2d12',
                    fontFamily: 'poppins',
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Get Started',
                    subtitle: 'Join the fun right now.',
                    layout: 'basic-bottom',
                    backgroundColor: '#bae6fd', // Blue
                    textColor: '#0c4a6e',
                    fontFamily: 'poppins',
                  }
                ]);
    }
  },
  {
    name: `App Preview Banner (1 Screen)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'light', targetSize: 'play-feature-graphic' });
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
                  }
                ]);
    }
  },
  {
    name: `Split Screen Contrast (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'glass' });
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
                  }
                ]);
    }
  },
  {
    name: `Minimalist White (3 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'glass' });
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
                  }
                ]);
    }
  },
  {
    name: `AI Sparkle & Copilot (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: '#1 AI Tool of 2024', style: 'pill-glass', icon: 'sparkle' }
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Instant Answers with Live Sources',
          subtitle: 'Deep synthesis across web knowledge in under two seconds.',
          layout: 'dynamic-overlap',
          backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
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
          badge: { enabled: true, text: '100% Private & Encrypted', style: 'pill-glass', icon: 'shield' }
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
          badge: { enabled: true, text: 'Apple Design Award', style: 'pill-solid', icon: 'trophy' }
        }
      ]);
    }
  },
  {
    name: `Bento Matrix Modern (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'light', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: 'Editors\' Choice', style: 'pill-glass', icon: 'star' }
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
          badge: { enabled: true, text: 'Loved by 1M+ Users', style: 'pill-solid', icon: 'heart' }
        }
      ]);
    }
  },
  {
    name: `Fintech Dark Mode Pro (5 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: '4.9 App Store', style: 'pill-glass', icon: 'star' }
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
          badge: { enabled: true, text: 'Bank-Grade 256-bit', style: 'pill-solid', icon: 'shield' }
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
          badge: { enabled: true, text: 'App of the Day', style: 'pill-solid', icon: 'trophy' }
        }
      ]);
    }
  },
  {
    name: `Glassmorphism Frosted Horizon (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'glass', targetSize: 'ios-6.5' });
      loadTemplate([
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Elegance in Motion',
          subtitle: 'A beautifully fluid experience designed for modern aesthetics.',
          layout: 'dynamic-overlap',
          backgroundColor: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
          textColor: '#ffffff',
          fontFamily: 'outfit',
          badge: { enabled: true, text: 'Apple Design Award', style: 'pill-glass', icon: 'trophy' }
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
          badge: { enabled: true, text: '4.9 App Store', style: 'pill-glass', icon: 'star' }
        }
      ]);
    }
  },
  {
    name: `Cyberpunk Neon Glow (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'clay-dark', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: '#1 Gaming Companion', style: 'pill-solid', icon: 'flame' }
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
        },
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'AI Replay Breakdown',
          subtitle: 'Pinpoint mechanical mistakes and climb the ranks faster.',
          layout: 'dynamic-overlap',
          backgroundColor: '#18181b',
          textColor: '#ffffff',
          fontFamily: 'space-grotesk',
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
          badge: { enabled: true, text: 'Best of 2024', style: 'pill-solid', icon: 'trophy' }
        }
      ]);
    }
  },
  {
    name: `Minimalist Studio Monochrome (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: 'Editor\'s Choice', style: 'pill-solid', icon: 'star' }
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
          badge: { enabled: true, text: 'Top Rated', style: 'pill-solid', icon: 'trophy' }
        }
      ]);
    }
  },
  {
    name: `Sunset Velvet Story (5 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: 'App of the Day', style: 'pill-glass', icon: 'trophy' }
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
          badge: { enabled: true, text: '100% Private & On-Device', style: 'pill-glass', icon: 'shield' }
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
        }
      ]);
    }
  },
  {
    name: `Warm Editorial Magazine (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'clay-light', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: 'Apple Design Award', style: 'pill-solid', icon: 'trophy' }
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
          badge: { enabled: true, text: 'Top Rated', style: 'pill-solid', icon: 'star' }
        }
      ]);
    }
  },
  {
    name: `SaaS Cloud Enterprise (4 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'dark', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: 'Trusted by 10k+ Companies', style: 'pill-glass', icon: 'shield' }
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
          badge: { enabled: true, text: 'SOC2 & HIPAA Compliant', style: 'pill-solid', icon: 'shield' }
        }
      ]);
    }
  },
  {
    name: `Duotone Punch (5 Screens)`,
    apply: (loadTemplate, updateGlobalSettings) => {
      updateGlobalSettings({ mockupStyle: 'clay-light', targetSize: 'ios-6.5' });
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
          badge: { enabled: true, text: '#1 Product of the Day', style: 'pill-solid', icon: 'flame' }
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
        }
      ]);
    }
  }
];

