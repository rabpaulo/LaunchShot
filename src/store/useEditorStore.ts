import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type TargetSizeId, DEFAULT_SIZE } from '@/config/sizes';
import { DEFAULT_FONT } from '@/config/fonts';
import type { BadgeConfig } from '@/config/badges';
import { DEFAULT_LANGUAGE } from '@/config/languages';

export type LayoutType = 
  | 'basic-top' 
  | 'basic-bottom' 
  | 'split-vertical'
  | 'tilt-right' 
  | 'tilt-left' 
  | 'tilt-right-complement'
  | 'tilt-left-complement'
  | 'tilt-bottom-right'
  | 'tilt-bottom-left'
  | 'half-right' 
  | 'half-left' 
  | '3d-isometric-right'
  | '3d-isometric-left'
  | 'device-only'
  | 'hero-center'
  // Social Graphics / OG Styles
  | 'og-style-1'
  | 'og-style-2'
  | 'og-style-3'
  | 'hero-3d-center'
  | 'banner-stack-right'
  | 'banner-triple-bottom';

export type CanvasItem = {
  id: string;
  imageSrc: string | null;
  title: string;
  subtitle: string;
  layout: LayoutType;
  backgroundColor: string;
  backgroundImageSrc?: string;
  textColor: string;
  subtitleColor?: string;
  fontFamily?: string;
  badge?: BadgeConfig;
  showAppStoreBadge?: boolean;
  appIconSrc?: string;
  gradientText?: boolean;
  imageFit?: 'cover' | 'contain';
  imageCrop?: { x: number; y: number };
  imageZoom?: number;
  imageRotation?: number;
  imageFilters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    grayscale: number;
  };
  translations?: Record<string, { title: string; subtitle: string }>;
};

export type MockupStyle = 'dark' | 'light' | 'glass' | 'clay-dark' | 'clay-light';

export type GlobalSettings = {
  targetSize: TargetSizeId;
  fontFamily: string;
  zoomScale: number;
  theme: 'dark' | 'light';
  mockupStyle: MockupStyle;
  showNotch: boolean;
  imageFit: 'cover' | 'contain';
  viewMode: 'horizontal' | 'vertical';
  appName?: string;
  companyName?: string;
  activeLanguage?: string;
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
  applyAppIconToAll: (appIconSrc: string) => void;
  removeAppIconFromAll: () => void;
  clearAllCanvases: () => void;
  loadTemplate: (canvases: CanvasItem[]) => void;
  isPreviewMode: boolean;
  togglePreviewMode: () => void;
  isDraggingGlobal: boolean;
  setIsDraggingGlobal: (val: boolean) => void;
  activeTemplateIndex: number;
  setActiveTemplateIndex: (idx: number) => void;
  setActiveLanguage: (lang: string) => void;
  updateCanvasTranslation: (id: string, lang: string, data: { title: string; subtitle: string }) => void;
  applyTranslationsForLanguage: (lang: string, items: Array<{ title?: string; subtitle?: string }>) => void;
  applyAllTranslations: (translationsMap: Record<string, Array<{ title: string; subtitle: string }>>) => void;
}

const defaultGlobalSettings: GlobalSettings = {
  targetSize: DEFAULT_SIZE,
  fontFamily: DEFAULT_FONT,
  zoomScale: 0.65,
  theme: 'dark',
  mockupStyle: 'dark',
  showNotch: true,
  imageFit: 'cover',
  viewMode: 'horizontal',
  appName: 'Your App Name',
  companyName: 'Your Company Inc.',
  activeLanguage: DEFAULT_LANGUAGE,
};

const LAYOUTS: LayoutType[] = [
  'basic-top', 
  'tilt-right', 
  'tilt-right-complement',
  'tilt-left', 
  'tilt-left-complement',
  'tilt-bottom-right',
  'tilt-bottom-left',
  'half-right', 
  'half-left', 
  'basic-bottom', 
  'split-vertical',
  '3d-isometric-right',
  '3d-isometric-left',
  'device-only',
  'hero-center'
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
          translations: {
            en: {
              title: 'Amazing Features',
              subtitle: 'Discover what makes our app great',
            },
          },
        },
      ],
      globalSettings: defaultGlobalSettings,
      addCanvas: (initialData) =>
        set((state) => {
          const lastLayout = state.canvases.length > 0 ? state.canvases[state.canvases.length - 1].layout : 'basic-top';
          const nextLayoutIndex = (LAYOUTS.indexOf(lastLayout) + 1) % LAYOUTS.length;
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
          const newTitle = initialData?.title ?? 'New Feature';
          const newSubtitle = initialData?.subtitle ?? 'Describe it here';
          
          return {
            canvases: [
              ...state.canvases,
              {
                id: crypto.randomUUID(),
                imageSrc: null,
                title: newTitle,
                subtitle: newSubtitle,
                layout: LAYOUTS[nextLayoutIndex],
                backgroundColor: '#000000',
                textColor: '#ffffff',
                fontFamily: state.globalSettings.fontFamily,
                translations: {
                  [currentLang]: {
                    title: newTitle,
                    subtitle: newSubtitle,
                  },
                },
                ...initialData,
              },
            ],
          };
        }),
      updateCanvas: (id, updates) =>
        set((state) => {
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
          return {
            canvases: state.canvases.map((c) => {
              if (c.id !== id) return c;
              
              const updated = { ...c, ...updates };
              
              // If title or subtitle changed, keep translations in sync for the active language
              if (updates.title !== undefined || updates.subtitle !== undefined) {
                const currentTranslations = updated.translations ? { ...updated.translations } : {};
                currentTranslations[currentLang] = {
                  title: updated.title,
                  subtitle: updated.subtitle,
                };
                updated.translations = currentTranslations;
              }
              
              return updated;
            }),
          };
        }),
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
            translations: original.translations ? { ...original.translations } : undefined,
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
        set((state) => {
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
          return {
            canvases: state.canvases.map((c) => ({
              ...c,
              title,
              subtitle,
              translations: {
                ...(c.translations || {}),
                [currentLang]: { title, subtitle },
              },
            })),
          };
        }),
      applyAppIconToAll: (appIconSrc) =>
        set((state) => ({
          canvases: state.canvases.map((c) => ({
            ...c,
            appIconSrc,
          })),
        })),
      removeAppIconFromAll: () =>
        set((state) => ({
          canvases: state.canvases.map((c) => ({
            ...c,
            appIconSrc: undefined,
          })),
        })),
      clearAllCanvases: () =>
        set(() => ({
          canvases: []
        })),
      loadTemplate: (newCanvases) =>
        set((state) => {
          const updatedCanvases = [...newCanvases];
          
          // 1. Map existing images onto the template's canvases
          for (let i = 0; i < Math.min(updatedCanvases.length, state.canvases.length); i++) {
            if (state.canvases[i].imageSrc) {
              updatedCanvases[i].imageSrc = state.canvases[i].imageSrc;
            }
          }

          // 2. If the user had MORE canvases (with images) than the template, preserve them
          if (state.canvases.length > updatedCanvases.length) {
            const lastTemplateCanvas = updatedCanvases[updatedCanvases.length - 1];
            
            for (let i = updatedCanvases.length; i < state.canvases.length; i++) {
              const userCanvas = state.canvases[i];
              // Only preserve extra user canvases if they actually have an image
              if (userCanvas.imageSrc) {
                updatedCanvases.push({
                  ...userCanvas,
                  layout: lastTemplateCanvas ? lastTemplateCanvas.layout : userCanvas.layout,
                  backgroundColor: lastTemplateCanvas ? lastTemplateCanvas.backgroundColor : userCanvas.backgroundColor,
                  textColor: lastTemplateCanvas ? lastTemplateCanvas.textColor : userCanvas.textColor,
                  subtitleColor: lastTemplateCanvas ? lastTemplateCanvas.subtitleColor : userCanvas.subtitleColor,
                  fontFamily: lastTemplateCanvas ? lastTemplateCanvas.fontFamily : userCanvas.fontFamily,
                });
              }
            }
          }
          
          return { canvases: updatedCanvases };
        }),
      isPreviewMode: false,
      togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode })),
      isDraggingGlobal: false,
      setIsDraggingGlobal: (val) => set({ isDraggingGlobal: val }),
      activeTemplateIndex: 0,
      setActiveTemplateIndex: (idx) => set({ activeTemplateIndex: idx }),

      setActiveLanguage: (newLang) =>
        set((state) => {
          const oldLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
          if (oldLang === newLang) return state;

          const updatedCanvases = state.canvases.map((c) => {
            const currentTranslations = c.translations ? { ...c.translations } : {};
            
            // Save current title and subtitle into oldLang translation
            currentTranslations[oldLang] = {
              title: c.title,
              subtitle: c.subtitle,
            };

            // Retrieve newLang translation if available
            const targetTrans = currentTranslations[newLang];
            const nextTitle = targetTrans ? targetTrans.title : c.title;
            const nextSubtitle = targetTrans ? targetTrans.subtitle : c.subtitle;

            return {
              ...c,
              title: nextTitle,
              subtitle: nextSubtitle,
              translations: currentTranslations,
            };
          });

          return {
            globalSettings: { ...state.globalSettings, activeLanguage: newLang },
            canvases: updatedCanvases,
          };
        }),

      updateCanvasTranslation: (id, lang, data) =>
        set((state) => {
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
          return {
            canvases: state.canvases.map((c) => {
              if (c.id !== id) return c;
              const translations = { ...(c.translations || {}), [lang]: data };
              
              // If we are updating the active language, also update canvas.title and canvas.subtitle
              if (lang === currentLang) {
                return {
                  ...c,
                  title: data.title,
                  subtitle: data.subtitle,
                  translations,
                };
              }

              return {
                ...c,
                translations,
              };
            }),
          };
        }),

      applyTranslationsForLanguage: (lang, items) =>
        set((state) => {
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
          const isCurrent = lang === currentLang;

          return {
            canvases: state.canvases.map((c, idx) => {
              const item = items[idx];
              if (!item) return c;

              const title = item.title !== undefined ? item.title : c.title;
              const subtitle = item.subtitle !== undefined ? item.subtitle : c.subtitle;

              const translations = {
                ...(c.translations || {}),
                [lang]: { title, subtitle },
              };

              return {
                ...c,
                title: isCurrent ? title : c.title,
                subtitle: isCurrent ? subtitle : c.subtitle,
                translations,
              };
            }),
          };
        }),

      applyAllTranslations: (translationsMap) =>
        set((state) => {
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;

          return {
            canvases: state.canvases.map((c, idx) => {
              const updatedTranslations = { ...(c.translations || {}) };

              for (const [lang, items] of Object.entries(translationsMap)) {
                if (items[idx]) {
                  updatedTranslations[lang] = {
                    title: items[idx].title || '',
                    subtitle: items[idx].subtitle || '',
                  };
                }
              }

              const currentTrans = updatedTranslations[currentLang];

              return {
                ...c,
                title: currentTrans ? currentTrans.title : c.title,
                subtitle: currentTrans ? currentTrans.subtitle : c.subtitle,
                translations: updatedTranslations,
              };
            }),
          };
        }),
    }),
    {
      name: 'screenshot-editor-storage',
    }
  )
);
