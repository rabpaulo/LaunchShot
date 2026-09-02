import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type TargetSizeId, DEFAULT_SIZE } from '@/config/sizes';
import { DEFAULT_FONT } from '@/config/fonts';
import type { BadgeConfig } from '@/config/badges';
import type { DoodleConfig } from '@/config/doodles';
import { DEFAULT_LANGUAGE } from '@/config/languages';
import { StatusBarConfig, DEFAULT_STATUS_BAR } from '@/config/statusBar';
import { PanoramaSettings, PANORAMA_PRESETS } from '@/config/panoramas';
import { FloatingCardConfig, CalloutPinConfig } from '@/config/floatingCards';
import FileSaver from 'file-saver';

const saveAs = (FileSaver as { saveAs?: (blob: Blob, name: string) => void })?.saveAs || (FileSaver as unknown as (blob: Blob, name: string) => void);

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
  | 'banner-triple-bottom'
  | 'banner-kinetic-stack';

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
  doodle?: DoodleConfig;
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
  statusBar?: StatusBarConfig;
  floatingCards?: FloatingCardConfig[];
  calloutPins?: CalloutPinConfig[];
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
  statusBar?: StatusBarConfig;
  panorama?: PanoramaSettings;
};

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  canvases: CanvasItem[];
  globalSettings: GlobalSettings;
}

interface HistorySnapshot {
  canvases: CanvasItem[];
  globalSettings: GlobalSettings;
}

interface EditorState {
  // Canvases & Global Settings (Active Project)
  canvases: CanvasItem[];
  globalSettings: GlobalSettings;
  
  // Undo / Redo History
  past: HistorySnapshot[];
  future: HistorySnapshot[];
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  // Multi-Project / Drafts Manager
  projects: Project[];
  activeProjectId: string;
  createProject: (name?: string, initialCanvases?: CanvasItem[]) => void;
  switchProject: (projectId: string) => void;
  renameProject: (projectId: string, name: string) => void;
  duplicateProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  exportProjectFile: (projectId?: string) => void;
  importProjectFile: (jsonText: string) => boolean;

  // Actions on Canvases
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
  applyDoodlesToAll: (doodle: DoodleConfig) => void;
  applyDoodleColorToAll: (color: string) => void;
  toggleDoodlesOnAll: (enabled: boolean) => void;
  
  // Status Bar Sanitizer
  updateStatusBarGlobal: (updates: Partial<StatusBarConfig>) => void;
  toggleStatusBarOnAll: (enabled: boolean) => void;

  // Panoramic Multi-Screen Spanning
  applyPanoramaToAll: (presetId: string) => void;
  togglePanorama: (enabled: boolean) => void;
  setCustomPanoramaBackground: (background: string) => void;

  // Floating Cards & Callouts
  addFloatingCard: (canvasId: string, card: Omit<FloatingCardConfig, 'id'>) => void;
  removeFloatingCard: (canvasId: string, cardId: string) => void;
  addCalloutPin: (canvasId: string, pin: Omit<CalloutPinConfig, 'id'>) => void;
  removeCalloutPin: (canvasId: string, pinId: string) => void;

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
  statusBar: DEFAULT_STATUS_BAR,
  panorama: {
    enabled: false,
    presetId: 'aurora-borealis',
  },
};

const initialDefaultCanvas: CanvasItem = {
  id: 'canvas-default-1',
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
  doodle: {
    enabled: false,
    color: '#facc15',
    doodles: [
      { type: 'question', position: 'top-right' },
      { type: 'underline-wave', position: 'underline' },
    ],
  },
  statusBar: DEFAULT_STATUS_BAR,
  floatingCards: [],
  calloutPins: [],
  translations: {
    en: {
      title: 'Amazing Features',
      subtitle: 'Discover what makes our app great',
    },
  },
};

const defaultInitialProject: Project = {
  id: 'default-project',
  name: 'Default Project',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  canvases: [initialDefaultCanvas],
  globalSettings: defaultGlobalSettings,
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

function cloneState(canvases: CanvasItem[], globalSettings: GlobalSettings): HistorySnapshot {
  return {
    canvases: JSON.parse(JSON.stringify(canvases)),
    globalSettings: JSON.parse(JSON.stringify(globalSettings)),
  };
}

function pushHistory(
  state: { past: HistorySnapshot[]; future: HistorySnapshot[]; canvases: CanvasItem[]; globalSettings: GlobalSettings },
  newCanvases: CanvasItem[],
  newSettings?: GlobalSettings
) {
  const nextSettings = newSettings || state.globalSettings;
  const newPast = [...state.past, cloneState(state.canvases, state.globalSettings)].slice(-30);
  return {
    past: newPast,
    future: [],
    canUndo: newPast.length > 0,
    canRedo: false,
    canvases: newCanvases,
    globalSettings: nextSettings,
  };
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      canvases: [initialDefaultCanvas],
      globalSettings: defaultGlobalSettings,
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
      projects: [defaultInitialProject],
      activeProjectId: 'default-project',

      undo: () =>
        set((state) => {
          if (state.past.length === 0) return state;
          const previous = state.past[state.past.length - 1];
          const newPast = state.past.slice(0, state.past.length - 1);
          const currentSnapshot = cloneState(state.canvases, state.globalSettings);
          const newFuture = [currentSnapshot, ...state.future].slice(0, 30);

          return {
            past: newPast,
            future: newFuture,
            canUndo: newPast.length > 0,
            canRedo: newFuture.length > 0,
            canvases: previous.canvases,
            globalSettings: previous.globalSettings,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.future.length === 0) return state;
          const next = state.future[0];
          const newFuture = state.future.slice(1);
          const currentSnapshot = cloneState(state.canvases, state.globalSettings);
          const newPast = [...state.past, currentSnapshot].slice(-30);

          return {
            past: newPast,
            future: newFuture,
            canUndo: newPast.length > 0,
            canRedo: newFuture.length > 0,
            canvases: next.canvases,
            globalSettings: next.globalSettings,
          };
        }),

      createProject: (name = 'New Project', initialCanvases) =>
        set((state) => {
          const newId = `project-${crypto.randomUUID()}`;
          const currentCanvases = initialCanvases || [
            {
              ...initialDefaultCanvas,
              id: crypto.randomUUID(),
            }
          ];

          // Save current active project state before creating new
          const updatedProjects = state.projects.map((p) =>
            p.id === state.activeProjectId
              ? { ...p, canvases: state.canvases, globalSettings: state.globalSettings, updatedAt: Date.now() }
              : p
          );

          const newProject: Project = {
            id: newId,
            name,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            canvases: currentCanvases,
            globalSettings: { ...state.globalSettings, appName: name },
          };

          return {
            projects: [...updatedProjects, newProject],
            activeProjectId: newId,
            canvases: currentCanvases,
            globalSettings: newProject.globalSettings,
            past: [],
            future: [],
            canUndo: false,
            canRedo: false,
          };
        }),

      switchProject: (projectId: string) =>
        set((state) => {
          if (state.activeProjectId === projectId) return state;

          // 1. Sync current state to active project
          const updatedProjects = state.projects.map((p) =>
            p.id === state.activeProjectId
              ? { ...p, canvases: state.canvases, globalSettings: state.globalSettings, updatedAt: Date.now() }
              : p
          );

          // 2. Find target project
          const target = updatedProjects.find((p) => p.id === projectId);
          if (!target) return state;

          return {
            projects: updatedProjects,
            activeProjectId: projectId,
            canvases: target.canvases,
            globalSettings: target.globalSettings,
            past: [],
            future: [],
            canUndo: false,
            canRedo: false,
          };
        }),

      renameProject: (projectId: string, name: string) =>
        set((state) => {
          const updatedProjects = state.projects.map((p) =>
            p.id === projectId ? { ...p, name, updatedAt: Date.now() } : p
          );
          return {
            projects: updatedProjects,
            globalSettings:
              state.activeProjectId === projectId
                ? { ...state.globalSettings, appName: name }
                : state.globalSettings,
          };
        }),

      duplicateProject: (projectId: string) =>
        set((state) => {
          const target = state.projects.find((p) => p.id === projectId);
          if (!target) return state;

          const duplicateId = `project-${crypto.randomUUID()}`;
          const duplicate: Project = {
            ...target,
            id: duplicateId,
            name: `${target.name} (Copy)`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            canvases: JSON.parse(JSON.stringify(target.canvases)),
            globalSettings: JSON.parse(JSON.stringify(target.globalSettings)),
          };

          return {
            projects: [...state.projects, duplicate],
          };
        }),

      deleteProject: (projectId: string) =>
        set((state) => {
          if (state.projects.length <= 1) return state; // Never delete last project

          const remaining = state.projects.filter((p) => p.id !== projectId);
          let nextActiveId = state.activeProjectId;
          let nextCanvases = state.canvases;
          let nextSettings = state.globalSettings;

          if (state.activeProjectId === projectId) {
            nextActiveId = remaining[0].id;
            nextCanvases = remaining[0].canvases;
            nextSettings = remaining[0].globalSettings;
          }

          return {
            projects: remaining,
            activeProjectId: nextActiveId,
            canvases: nextCanvases,
            globalSettings: nextSettings,
            past: [],
            future: [],
            canUndo: false,
            canRedo: false,
          };
        }),

      exportProjectFile: (projectId) => {
        const state = get();
        const targetId = projectId || state.activeProjectId;
        const project = state.projects.find((p) => p.id === targetId) || {
          id: targetId,
          name: state.globalSettings.appName || 'LaunchShot Project',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          canvases: state.canvases,
          globalSettings: state.globalSettings,
        };

        const exportPayload = {
          version: '1.0.0',
          type: 'launchshot-project',
          exportedAt: new Date().toISOString(),
          project: {
            ...project,
            canvases: state.activeProjectId === targetId ? state.canvases : project.canvases,
            globalSettings: state.activeProjectId === targetId ? state.globalSettings : project.globalSettings,
          },
        };

        const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
        const sanitizedName = (project.name || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-');
        saveAs(blob, `${sanitizedName}.launchshot`);
      },

      importProjectFile: (jsonText: string): boolean => {
        try {
          const parsed = JSON.parse(jsonText);
          const projectData = parsed.project || parsed;

          if (!projectData || !Array.isArray(projectData.canvases)) {
            throw new Error('Invalid project file: missing canvases');
          }

          const newId = `project-${crypto.randomUUID()}`;
          const importedProject: Project = {
            id: newId,
            name: projectData.name || 'Imported Project',
            createdAt: projectData.createdAt || Date.now(),
            updatedAt: Date.now(),
            canvases: projectData.canvases,
            globalSettings: projectData.globalSettings || defaultGlobalSettings,
          };

          set((state) => {
            // Save active project before importing
            const updatedProjects = state.projects.map((p) =>
              p.id === state.activeProjectId
                ? { ...p, canvases: state.canvases, globalSettings: state.globalSettings, updatedAt: Date.now() }
                : p
            );

            return {
              projects: [...updatedProjects, importedProject],
              activeProjectId: newId,
              canvases: importedProject.canvases,
              globalSettings: importedProject.globalSettings,
              past: [],
              future: [],
              canUndo: false,
              canRedo: false,
            };
          });

          return true;
        } catch {
          return false;
        }
      },

      addCanvas: (initialData) =>
        set((state) => {
          const lastLayout = state.canvases.length > 0 ? state.canvases[state.canvases.length - 1].layout : 'basic-top';
          const nextLayoutIndex = (LAYOUTS.indexOf(lastLayout) + 1) % LAYOUTS.length;
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
          const newTitle = initialData?.title ?? 'New Feature';
          const newSubtitle = initialData?.subtitle ?? 'Describe it here';

          const newCanvas: CanvasItem = {
            id: crypto.randomUUID(),
            imageSrc: null,
            title: newTitle,
            subtitle: newSubtitle,
            layout: LAYOUTS[nextLayoutIndex],
            backgroundColor: '#000000',
            textColor: '#ffffff',
            fontFamily: state.globalSettings.fontFamily,
            statusBar: state.globalSettings.statusBar || DEFAULT_STATUS_BAR,
            floatingCards: [],
            calloutPins: [],
            translations: {
              [currentLang]: {
                title: newTitle,
                subtitle: newSubtitle,
              },
            },
            ...initialData,
          };

          const nextCanvases = [...state.canvases, newCanvas];
          return pushHistory(state, nextCanvases);
        }),

      updateCanvas: (id, updates) =>
        set((state) => {
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
          const nextCanvases = state.canvases.map((c) => {
            if (c.id !== id) return c;

            const updated = { ...c, ...updates };

            if (updates.title !== undefined || updates.subtitle !== undefined) {
              const currentTranslations = updated.translations ? { ...updated.translations } : {};
              currentTranslations[currentLang] = {
                title: updated.title,
                subtitle: updated.subtitle,
              };
              updated.translations = currentTranslations;
            }

            return updated;
          });

          return pushHistory(state, nextCanvases);
        }),

      removeCanvas: (id) =>
        set((state) => {
          const nextCanvases = state.canvases.filter((c) => c.id !== id);
          return pushHistory(state, nextCanvases);
        }),

      moveCanvas: (id, direction) =>
        set((state) => {
          const index = state.canvases.findIndex((c) => c.id === id);
          if (index === -1) return state;
          const targetIndex = direction === 'left' ? index - 1 : index + 1;
          if (targetIndex < 0 || targetIndex >= state.canvases.length) return state;

          const newCanvases = [...state.canvases];
          const [moved] = newCanvases.splice(index, 1);
          newCanvases.splice(targetIndex, 0, moved);

          return pushHistory(state, newCanvases);
        }),

      duplicateCanvas: (id) =>
        set((state) => {
          const index = state.canvases.findIndex((c) => c.id === id);
          if (index === -1) return state;
          const original = state.canvases[index];
          const duplicate: CanvasItem = {
            ...original,
            id: crypto.randomUUID(),
            floatingCards: original.floatingCards ? JSON.parse(JSON.stringify(original.floatingCards)) : [],
            calloutPins: original.calloutPins ? JSON.parse(JSON.stringify(original.calloutPins)) : [],
            translations: original.translations ? { ...original.translations } : undefined,
          };
          const newCanvases = [...state.canvases];
          newCanvases.splice(index + 1, 0, duplicate);
          return pushHistory(state, newCanvases);
        }),

      updateGlobalSettings: (updates) =>
        set((state) => {
          const nextSettings = { ...state.globalSettings, ...updates };
          return pushHistory(state, state.canvases, nextSettings);
        }),

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
        set((state) => {
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            backgroundColor: bg,
            ...(textColor ? { textColor } : {}),
          }));
          return pushHistory(state, nextCanvases);
        }),

      applyFontToAll: (fontFamily) =>
        set((state) => {
          const nextSettings = { ...state.globalSettings, fontFamily };
          const nextCanvases = state.canvases.map((c) => ({ ...c, fontFamily }));
          return pushHistory(state, nextCanvases, nextSettings);
        }),

      applyLayoutToAll: (layout) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => ({ ...c, layout }));
          return pushHistory(state, nextCanvases);
        }),

      applyContentToAll: (title, subtitle) =>
        set((state) => {
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            title,
            subtitle,
            translations: {
              ...(c.translations || {}),
              [currentLang]: { title, subtitle },
            },
          }));
          return pushHistory(state, nextCanvases);
        }),

      applyAppIconToAll: (appIconSrc) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => ({ ...c, appIconSrc }));
          return pushHistory(state, nextCanvases);
        }),

      removeAppIconFromAll: () =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => ({ ...c, appIconSrc: undefined }));
          return pushHistory(state, nextCanvases);
        }),

      applyDoodlesToAll: (doodle) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            doodle: {
              ...doodle,
              doodles: doodle.doodles ? [...doodle.doodles] : [],
            },
          }));
          return pushHistory(state, nextCanvases);
        }),

      applyDoodleColorToAll: (color) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            doodle: c.doodle
              ? {
                  ...c.doodle,
                  color,
                  doodles: (c.doodle.doodles || []).map((d) => ({ ...d, color })),
                }
              : {
                  enabled: true,
                  color,
                  doodles: [
                    { type: 'question' as const, position: 'top-right' as const, color },
                    { type: 'underline-wave' as const, position: 'underline' as const, color },
                  ],
                },
          }));
          return pushHistory(state, nextCanvases);
        }),

      toggleDoodlesOnAll: (enabled) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            doodle: c.doodle
              ? { ...c.doodle, enabled }
              : { enabled, color: '#facc15', doodles: [{ type: 'underline-wave' as const, position: 'underline' as const }] },
          }));
          return pushHistory(state, nextCanvases);
        }),

      // Status Bar Sanitizer
      updateStatusBarGlobal: (updates) =>
        set((state) => {
          const currentSb = state.globalSettings.statusBar || DEFAULT_STATUS_BAR;
          const updatedSb = { ...currentSb, ...updates };
          const nextSettings = { ...state.globalSettings, statusBar: updatedSb };
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            statusBar: { ...(c.statusBar || DEFAULT_STATUS_BAR), ...updates },
          }));
          return pushHistory(state, nextCanvases, nextSettings);
        }),

      toggleStatusBarOnAll: (enabled) =>
        set((state) => {
          const currentSb = state.globalSettings.statusBar || DEFAULT_STATUS_BAR;
          const updatedSb = { ...currentSb, enabled };
          const nextSettings = { ...state.globalSettings, statusBar: updatedSb };
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            statusBar: { ...(c.statusBar || DEFAULT_STATUS_BAR), enabled },
          }));
          return pushHistory(state, nextCanvases, nextSettings);
        }),

      // Panoramic Multi-Screen
      applyPanoramaToAll: (presetId) =>
        set((state) => {
          const preset = PANORAMA_PRESETS.find((p) => p.id === presetId) || PANORAMA_PRESETS[0];
          const updatedPanorama: PanoramaSettings = {
            enabled: true,
            presetId: preset.id,
            customBackground: preset.background,
          };
          const nextSettings = { ...state.globalSettings, panorama: updatedPanorama };
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            textColor: preset.textColor,
          }));
          return pushHistory(state, nextCanvases, nextSettings);
        }),

      togglePanorama: (enabled) =>
        set((state) => {
          const currentPanorama = state.globalSettings.panorama || { enabled: false, presetId: 'aurora-borealis' };
          const nextSettings = {
            ...state.globalSettings,
            panorama: { ...currentPanorama, enabled },
          };
          return pushHistory(state, state.canvases, nextSettings);
        }),

      setCustomPanoramaBackground: (background) =>
        set((state) => {
          const currentPanorama = state.globalSettings.panorama || { enabled: true };
          const nextSettings = {
            ...state.globalSettings,
            panorama: { ...currentPanorama, enabled: true, customBackground: background },
          };
          return pushHistory(state, state.canvases, nextSettings);
        }),

      // Floating Cards & Callout Pins
      addFloatingCard: (canvasId, card) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => {
            if (c.id !== canvasId) return c;
            const currentCards = c.floatingCards || [];
            const newCard: FloatingCardConfig = {
              id: crypto.randomUUID(),
              ...card,
            };
            return {
              ...c,
              floatingCards: [...currentCards, newCard],
            };
          });
          return pushHistory(state, nextCanvases);
        }),

      removeFloatingCard: (canvasId, cardId) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => {
            if (c.id !== canvasId) return c;
            return {
              ...c,
              floatingCards: (c.floatingCards || []).filter((fc) => fc.id !== cardId),
            };
          });
          return pushHistory(state, nextCanvases);
        }),

      addCalloutPin: (canvasId, pin) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => {
            if (c.id !== canvasId) return c;
            const currentPins = c.calloutPins || [];
            const newPin: CalloutPinConfig = {
              id: crypto.randomUUID(),
              ...pin,
            };
            return {
              ...c,
              calloutPins: [...currentPins, newPin],
            };
          });
          return pushHistory(state, nextCanvases);
        }),

      removeCalloutPin: (canvasId, pinId) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => {
            if (c.id !== canvasId) return c;
            return {
              ...c,
              calloutPins: (c.calloutPins || []).filter((cp) => cp.id !== pinId),
            };
          });
          return pushHistory(state, nextCanvases);
        }),

      clearAllCanvases: () =>
        set((state) => pushHistory(state, [])),

      loadTemplate: (newCanvases) =>
        set((state) => {
          const updatedCanvases = [...newCanvases];

          for (let i = 0; i < Math.min(updatedCanvases.length, state.canvases.length); i++) {
            if (state.canvases[i].imageSrc) {
              updatedCanvases[i].imageSrc = state.canvases[i].imageSrc;
            }
          }

          if (state.canvases.length > updatedCanvases.length) {
            const lastTemplateCanvas = updatedCanvases[updatedCanvases.length - 1];

            for (let i = updatedCanvases.length; i < state.canvases.length; i++) {
              const userCanvas = state.canvases[i];
              if (userCanvas.imageSrc) {
                updatedCanvases.push({
                  ...userCanvas,
                  layout: lastTemplateCanvas ? lastTemplateCanvas.layout : userCanvas.layout,
                  backgroundColor: lastTemplateCanvas ? lastTemplateCanvas.backgroundColor : userCanvas.backgroundColor,
                  textColor: lastTemplateCanvas ? lastTemplateCanvas.textColor : userCanvas.textColor,
                  subtitleColor: lastTemplateCanvas ? lastTemplateCanvas.subtitleColor : userCanvas.subtitleColor,
                  fontFamily: lastTemplateCanvas ? lastTemplateCanvas.fontFamily : userCanvas.fontFamily,
                  doodle: lastTemplateCanvas ? lastTemplateCanvas.doodle : userCanvas.doodle,
                });
              }
            }
          }

          return pushHistory(state, updatedCanvases);
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

            currentTranslations[oldLang] = {
              title: c.title,
              subtitle: c.subtitle,
            };

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

          const updatedCanvases = state.canvases.map((c, idx) => {
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
          });

          return pushHistory(state, updatedCanvases);
        }),

      applyAllTranslations: (translationsMap) =>
        set((state) => {
          const currentLang = state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;

          const updatedCanvases = state.canvases.map((c, idx) => {
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
          });

          return pushHistory(state, updatedCanvases);
        }),
    }),
    {
      name: 'screenshot-editor-storage',
      // Exclude past & future from persistence to save localStorage quota
      partialize: (state) => ({
        canvases: state.canvases,
        globalSettings: state.globalSettings,
        projects: state.projects,
        activeProjectId: state.activeProjectId,
      }),
    }
  )
);
