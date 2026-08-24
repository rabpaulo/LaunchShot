import { CanvasItem, GlobalSettings } from '@/store/useEditorStore';

export interface TemplateDefinition {
  name: string;
  apply: (
    loadTemplate: (canvases: CanvasItem[]) => void, 
    updateGlobalSettings: (settings: Partial<GlobalSettings>) => void
  ) => void;
}

export const TEMPLATES: TemplateDefinition[] = [
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
                    fontFamily: globalSettings.fontFamily,
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Beautiful Design',
                    subtitle: 'Carefully crafted for you',
                    layout: 'tilt-right',
                    backgroundColor: '#000000',
                    textColor: '#ffffff',
                    fontFamily: globalSettings.fontFamily,
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Blazing Fast',
                    subtitle: 'Optimized for speed and performance',
                    layout: 'tilt-left',
                    backgroundColor: '#000000',
                    textColor: '#ffffff',
                    fontFamily: globalSettings.fontFamily,
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Start Today',
                    subtitle: 'Join thousands of happy users',
                    layout: 'basic-bottom',
                    backgroundColor: '#000000',
                    textColor: '#ffffff',
                    fontFamily: globalSettings.fontFamily,
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
                    fontFamily: globalSettings.fontFamily,
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Highlight Your UI',
                    subtitle: 'Let your app design speak for itself in 3D',
                    layout: '3d-isometric-left',
                    backgroundColor: 'linear-gradient(135deg, #090d16 0%, #1e293b 60%, #334155 100%)', // Deep Obsidian
                    textColor: '#ffffff',
                    fontFamily: globalSettings.fontFamily,
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Engage Your Users',
                    subtitle: 'Create a cinematic experience before they even download',
                    layout: '3d-isometric-right',
                    backgroundColor: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)', // Emerald Forest
                    textColor: '#ffffff',
                    fontFamily: globalSettings.fontFamily,
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
                    fontFamily: globalSettings.fontFamily,
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
                    fontFamily: globalSettings.fontFamily,
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
                    fontFamily: globalSettings.fontFamily,
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
                    fontFamily: globalSettings.fontFamily,
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Connect Instantly',
                    subtitle: 'With friends, family, and the world.',
                    layout: 'half-left',
                    backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                    textColor: '#ffffff',
                    fontFamily: globalSettings.fontFamily,
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Share Your Moments',
                    subtitle: 'Capture and share memories in a flash.',
                    layout: 'tilt-right',
                    backgroundColor: 'linear-gradient(135deg, #312e81 0%, #4c1d95 100%)',
                    textColor: '#ffffff',
                    fontFamily: globalSettings.fontFamily,
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Stay Secure',
                    subtitle: 'Enterprise-grade encryption built in.',
                    layout: 'tilt-left',
                    backgroundColor: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
                    textColor: '#ffffff',
                    fontFamily: globalSettings.fontFamily,
                  },
                  {
                    id: crypto.randomUUID(),
                    imageSrc: null,
                    title: 'Join Us Today',
                    subtitle: 'Download now and get started.',
                    layout: 'basic-bottom',
                    backgroundColor: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
                    textColor: '#ffffff',
                    fontFamily: globalSettings.fontFamily,
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
];
