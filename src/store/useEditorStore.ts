import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TargetSizeId, DEFAULT_SIZE } from '@/config/sizes';
import { DEFAULT_FONT } from '@/config/fonts';
import { BadgeConfig } from '@/config/badges';

export type LayoutType = 
  | 'basic-top' 
  | 'basic-bottom' 
  | 'tilt-right' 
  | 'tilt-left' 
  | 'half-right' 
  | 'half-left' 
  | 'device-only';

export type CanvasItem = {
  id: string;
  imageSrc: string | null;
  title: string;
  subtitle: string;
  layout: LayoutType;
  backgroundColor: string;
  textColor: string;
  fontFamily?: string;
  badge?: BadgeConfig;
  gradientText?: boolean;
  imageFit?: 'cover' | 'contain';
};

export type MockupStyle = 'dark' | 'light' | 'glass';

export type GlobalSettings = {
  targetSize: TargetSizeId;
  fontFamily: string;
  zoomScale: number;
  theme: 'dark' | 'light';
  mockupStyle: MockupStyle;
  showNotch: boolean;
};

interface EditorState {
  canvases: CanvasItem[];
  globalSettings: GlobalSettings;
  addCanvas: (initialData?: Partial<CanvasItem>) => void;
  updateCanvas: (id: string, updates: Partial<CanvasItem>) => void;
  removeCanvas: (id: string) => void;
  moveCanvas: (id: string, direction: 'left' | 'right') => void;
  duplicateCanvas: (id: string) => void;
  updateGlobalSettings: (updates: Partial<GlobalSettings>) => void;
  setZoomScale: (scale: number) => void;
  toggleTheme: () => void;
  applyBackgroundToAll: (bg: string, textColor?: string) => void;
  applyFontToAll: (fontFamily: string) => void;
  applyLayoutToAll: (layout: LayoutType) => void;
  applyContentToAll: (title: string, subtitle: string) => void;
  clearAllCanvases: () => void;
}

const defaultGlobalSettings: GlobalSettings = {
  targetSize: DEFAULT_SIZE,
  fontFamily: DEFAULT_FONT,
  zoomScale: 0.65,
  theme: 'dark',
  mockupStyle: 'dark',
  showNotch: true,
};

const LAYOUTS: LayoutType[] = [
  'basic-top', 
  'tilt-right', 
  'half-right', 
  'basic-bottom', 
  'tilt-left', 
  'half-left', 
  'device-only'
];

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      canvases: [
        {
          id: crypto.randomUUID(),
          imageSrc: null,
          title: 'Amazing Features',
          subtitle: 'Discover what makes our app great',
          layout: 'basic-top',
          backgroundColor: '#000000',
          textColor: '#ffffff',
          fontFamily: DEFAULT_FONT,
          badge: {
            enabled: true,
            icon: 'star',
            text: '4.9 App Store',
            subtext: '30k+ ratings',
            style: 'pill-glass',
          },
        },
      ],
      globalSettings: defaultGlobalSettings,
      addCanvas: (initialData) =>
        set((state) => {
          const lastLayout = state.canvases.length > 0 ? state.canvases[state.canvases.length - 1].layout : 'basic-top';
          const nextLayoutIndex = (LAYOUTS.indexOf(lastLayout) + 1) % LAYOUTS.length;
          
          return {
            canvases: [
              ...state.canvases,
              {
                id: crypto.randomUUID(),
                imageSrc: null,
                title: 'New Feature',
                subtitle: 'Describe it here',
                layout: LAYOUTS[nextLayoutIndex],
                backgroundColor: '#000000',
                textColor: '#ffffff',
                fontFamily: state.globalSettings.fontFamily,
                ...initialData,
              },
            ],
          };
        }),
      updateCanvas: (id, updates) =>
        set((state) => ({
          canvases: state.canvases.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      removeCanvas: (id) =>
        set((state) => ({
          canvases: state.canvases.filter((c) => c.id !== id),
        })),
      moveCanvas: (id, direction) =>
        set((state) => {
          const index = state.canvases.findIndex((c) => c.id === id);
          if (index === -1) return state;
          const targetIndex = direction === 'left' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= state.canvases.length) return state;

          const newCanvases = [...state.canvases];
          const [moved] = newCanvases.splice(index, 1);
          newCanvases.splice(targetIndex, 0, moved);

          return { canvases: newCanvases };
        }),
      duplicateCanvas: (id) =>
        set((state) => {
          const index = state.canvases.findIndex((c) => c.id === id);
          if (index === -1) return state;
          const original = state.canvases[index];
          const duplicate: CanvasItem = {
            ...original,
            id: crypto.randomUUID(),
          };
          const newCanvases = [...state.canvases];
          newCanvases.splice(index + 1, 0, duplicate);
          return { canvases: newCanvases };
        }),
      updateGlobalSettings: (updates) =>
        set((state) => ({
          globalSettings: { ...state.globalSettings, ...updates },
        })),
      setZoomScale: (scale) =>
        set((state) => ({
          globalSettings: { ...state.globalSettings, zoomScale: scale },
        })),
      toggleTheme: () =>
        set((state) => ({
          globalSettings: {
            ...state.globalSettings,
            theme: state.globalSettings.theme === 'dark' ? 'light' : 'dark',
          },
        })),
      applyBackgroundToAll: (bg, textColor) =>
        set((state) => ({
          canvases: state.canvases.map((c) => ({
            ...c,
            backgroundColor: bg,
            ...(textColor ? { textColor } : {}),
          })),
        })),
      applyFontToAll: (fontFamily) =>
        set((state) => ({
          globalSettings: { ...state.globalSettings, fontFamily },
          canvases: state.canvases.map((c) => ({
            ...c,
            fontFamily,
          })),
        })),
      applyLayoutToAll: (layout) =>
        set((state) => ({
          canvases: state.canvases.map((c) => ({
            ...c,
            layout,
          })),
        })),
      applyContentToAll: (title, subtitle) =>
        set((state) => ({
          canvases: state.canvases.map((c) => ({
            ...c,
            title,
            subtitle,
          })),
        })),
      clearAllCanvases: () =>
        set((state) => ({
          canvases: [
            {
              id: crypto.randomUUID(),
              imageSrc: null,
              title: 'New Workspace',
              subtitle: 'Drag and drop screenshots here',
              layout: 'basic-top',
              backgroundColor: '#000000',
              textColor: '#ffffff',
              fontFamily: state.globalSettings.fontFamily,
            }
          ]
        })),
    }),
    {
      name: 'screenshot-editor-storage',
    }
  )
);
