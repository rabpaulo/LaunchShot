import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { projectStorage, portableProject, restoreProjectImages } from '@/utils/projectStorage';
import { styleSlide, styleSettings, type StudioStyleId } from '@/config/styles';
import { type TargetSizeId, DEFAULT_SIZE, DEFAULT_IPHONE_SIZE, DEFAULT_ANDROID_SIZE, isAndroidDevice, isAppleDevice } from '@/config/sizes';
import { DEFAULT_FONT } from '@/config/fonts';
import { designKind, validCreationFields, type DesignKind, type OutputSize } from '@/config/creation';
import { type BadgeConfig, getBadgeStore } from '@/config/badges';
import type { DoodleConfig } from '@/config/doodles';
import { DEFAULT_LANGUAGE } from '@/config/languages';
import { type StatusBarConfig, DEFAULT_STATUS_BAR } from '@/config/statusBar';
import { type PanoramaSettings, PANORAMA_PRESETS } from '@/config/panoramas';
import type { FloatingCardConfig, CalloutPinConfig } from '@/config/floatingCards';
import { type ShadowSettings, DEFAULT_SHADOW } from '@/utils/shadowEngine';
import { type BackdropEffects, DEFAULT_BACKDROP_EFFECTS, POSTSPARK_COLOR_PALETTE } from '@/config/backgrounds';
import { getContrastColor } from '@/utils/imageProcessor';
import FileSaver from 'file-saver';
import { applyDesign, captureDesign, type SavedDesign, type SlideDesign } from '@/config/designs';

const saveAs = (FileSaver as { saveAs?: (blob: Blob, name: string) => void })?.saveAs || (FileSaver as unknown as (blob: Blob, name: string) => void);

function downloadBlob(blob: Blob, filename: string) {
  try {
    if (typeof saveAs === 'function') {
      saveAs(blob, filename);
      return;
    }
  } catch {}
  if (typeof document !== 'undefined') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export type LayoutType = 
  | 'banner-centered'
  | 'banner-split'
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
  | 'banner-kinetic-stack'
  | 'multi-screen-right'
  | 'multi-screen-left'
  | 'multi-screen-center'
  | 'trio-row'
  | 'duo-row';

export type CanvasItem = {
  kind?: DesignKind;
  outputSize?: OutputSize;
  deviceTarget?: TargetSizeId;
  mediaPresentation?: 'none' | 'image' | 'device';
  transparentBackground?: boolean;
  mockupStyle?: MockupStyle;
  id: string;
  imageSrc: string | null;
  secondaryImageSrc?: string | null;
  tertiaryImageSrc?: string | null;
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
  textBoxWidth?: number;
  titleFontSize?: number;
  subtitleFontSize?: number;
  textAlign?: 'left' | 'center' | 'right';
  shadow?: ShadowSettings;
  backdropEffects?: BackdropEffects;
  rotationAngle?: number;
};

export type MockupStyle = 'dark' | 'light' | 'glass' | 'clay-dark' | 'clay-light';

export type GlobalSettings = {
  studioStyle?: StudioStyleId;
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
  shadow?: ShadowSettings;
  backdropEffects?: BackdropEffects;
  aspectRatio?: string;
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
  savedDesigns: SavedDesign[];
  saveDesign: (name: string, canvasId: string) => void;
  removeDesign: (id: string) => void;
  applySlideDesign: (design: SlideDesign, canvasId?: string) => void;
  selectedCanvasId: string | null;
  selectCanvas: (id: string) => void;
  applyStudioStyle: (id: StudioStyleId) => void;
  importScreenshots: (sources: string[]) => void;
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
  exportProjectFile: (projectId?: string) => Promise<void>;
  importProjectFile: (jsonText: string) => Promise<boolean>;

  // Actions on Canvases
  addCanvas: (initialData?: Partial<CanvasItem>) => void;
  updateCanvas: (id: string, updates: Partial<CanvasItem>) => void;
  removeCanvas: (id: string) => void;
  moveCanvas: (id: string, direction: 'left' | 'right') => void;
  duplicateCanvas: (id: string) => void;
  updateGlobalSettings: (updates: Partial<GlobalSettings>) => void;
  switchToAppStore: () => void;
  switchToPlayStore: () => void;
  ensurePlatformForStore: (store: 'app-store' | 'play-store') => void;
  setZoomScale: (scale: number) => void;
  toggleTheme: () => void;
  applyBackgroundToAll: (bg: string, textColor?: string) => void;
  applyFontToAll: (fontFamily: string) => void;
  applyLayoutToAll: (layout: LayoutType) => void;
  applyContentToAll: (title: string, subtitle: string) => void;
  applyTextBoxToAll: (textBoxWidth?: number, titleFontSize?: number, subtitleFontSize?: number, textAlign?: 'left' | 'center' | 'right') => void;
  applyAppIconToAll: (appIconSrc: string) => void;
  removeAppIconFromAll: () => void;
  applyDoodlesToAll: (doodle: DoodleConfig) => void;
  applyDoodleColorToAll: (color: string) => void;
  toggleDoodlesOnAll: (enabled: boolean) => void;
  applyBadgeToAll: (badge: BadgeConfig) => void;
  updateBadge: (canvasId: string, badgeUpdates: Partial<BadgeConfig>) => void;
  
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

  // PostSpark Studio Mockup Controls (Shadows, Backdrops, Aspect Ratio)
  updateShadow: (updates: Partial<ShadowSettings>) => void;
  updateBackdropEffects: (updates: Partial<BackdropEffects>) => void;
  setAspectRatio: (aspectRatio: string) => void;
  rotateMockup: (canvasId?: string) => void;
  shuffleBackground: () => void;
  resetCanvasAdjustments: (canvasId?: string) => void;

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
  batchUpdateTranslations: (
    translationsMap: Record<string, Record<string, { title: string; subtitle: string }>>,
    newActiveLanguage?: string
  ) => void;
}

const defaultGlobalSettings: GlobalSettings = {
  targetSize: DEFAULT_SIZE,
  fontFamily: DEFAULT_FONT,
  zoomScale: 0.65,
  theme: 'light',
  studioStyle: 'clean-light',
  mockupStyle: 'dark',
  showNotch: true,
  imageFit: 'contain',
  viewMode: 'horizontal',
  appName: '',
  companyName: '',
  activeLanguage: DEFAULT_LANGUAGE,
  statusBar: { ...DEFAULT_STATUS_BAR, enabled: false },
  panorama: {
    enabled: false,
    presetId: 'aurora-borealis',
  },
  shadow: DEFAULT_SHADOW,
  backdropEffects: DEFAULT_BACKDROP_EFFECTS,
  aspectRatio: '4:3',
};

const initialDefaultCanvas: CanvasItem = {
  id: 'canvas-default-1',
  imageSrc: null,
  title: '',
  subtitle: '',
  layout: 'basic-top',
  backgroundColor: '#f2f0eb',
  textColor: '#0f172a',
  fontFamily: DEFAULT_FONT,
  shadow: DEFAULT_SHADOW,
  backdropEffects: DEFAULT_BACKDROP_EFFECTS,
  rotationAngle: 0,
  badge: {
    enabled: false,
    icon: 'star',
    text: '',
    subtext: '',
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
  statusBar: { ...DEFAULT_STATUS_BAR, enabled: false },
  floatingCards: [],
  calloutPins: [],
  translations: {
    en: {
      title: '',
      subtitle: '',
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
  'hero-center',
  'multi-screen-right',
  'multi-screen-left',
  'multi-screen-center'
];

function cloneState(canvases: CanvasItem[], globalSettings: GlobalSettings): HistorySnapshot {
  return {
    canvases: JSON.parse(JSON.stringify(canvases)),
    globalSettings: JSON.parse(JSON.stringify(globalSettings)),
  };
}

function pushHistory(
  state: {
    past: HistorySnapshot[];
    future: HistorySnapshot[];
    canvases: CanvasItem[];
    globalSettings: GlobalSettings;
    projects?: Project[];
    activeProjectId?: string;
    selectedCanvasId?: string | null;
  },
  newCanvases: CanvasItem[],
  newSettings?: GlobalSettings
) {
  const nextSettings = newSettings || state.globalSettings;
  const newPast = [...state.past, cloneState(state.canvases, state.globalSettings)].slice(-30);
  const updatedProjects = (state.projects || []).map((p) =>
    p.id === state.activeProjectId
      ? { ...p, canvases: newCanvases, globalSettings: nextSettings, updatedAt: Date.now() }
      : p
  );

  return {
    selectedCanvasId: newCanvases.some(c => c.id === state.selectedCanvasId) ? state.selectedCanvasId! : newCanvases[0]?.id || null,
    past: newPast,
    future: [],
    canUndo: newPast.length > 0,
    canRedo: false,
    canvases: newCanvases,
    globalSettings: nextSettings,
    projects: updatedProjects,
  };
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      savedDesigns: [],
      saveDesign: (name, canvasId) => set(state => {
        const canvas = state.canvases.find(item => item.id === canvasId);
        if (!canvas || !name.trim()) return state;
        return { savedDesigns: [...state.savedDesigns, { id: crypto.randomUUID(), name: name.trim(), design: captureDesign(canvas, state.globalSettings) }] };
      }),
      removeDesign: (id) => set(state => ({ savedDesigns: state.savedDesigns.filter(item => item.id !== id) })),
      applySlideDesign: (design, canvasId) => set(state => pushHistory(state, state.canvases.map(canvas => (!canvasId || canvas.id === canvasId) && designKind(canvas) === (design.kind || 'screenshot') ? applyDesign(canvas, design) : canvas))),
      selectedCanvasId: null,
      selectCanvas: (id) => set({ selectedCanvasId: id }),
      applyStudioStyle: (id) => set(state => {
        const selected = state.canvases.find(canvas => canvas.id === state.selectedCanvasId) || state.canvases[0];
        const mixed = state.canvases.some(canvas => designKind(canvas) !== 'screenshot');
        return pushHistory(state, state.canvases.map(canvas => selected && designKind(canvas) === designKind(selected) ? styleSlide(canvas, id) : canvas), mixed ? { ...state.globalSettings, studioStyle: id } : styleSettings(state.globalSettings, id));
      }),
      importScreenshots: (sources) => set(state => {
        const empty = state.canvases.length === 1 && designKind(state.canvases[0]) === 'screenshot' && !state.canvases[0].imageSrc && !state.canvases[0].title;
        const additions = sources.map(source => empty ? {
          ...state.canvases[0], id: crypto.randomUUID(), imageSrc: source,
        } : styleSlide({
          ...initialDefaultCanvas, id: crypto.randomUUID(), imageSrc: source,
          translations: { [state.globalSettings.activeLanguage || 'en']: { title: '', subtitle: '' } },
        }, state.globalSettings.studioStyle || 'clean-light'));
        const next = [...(empty ? [] : state.canvases), ...additions];
        return { ...pushHistory(state, next), selectedCanvasId: additions[0]?.id || state.selectedCanvasId };
      }),
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
          const updatedProjects = (state.projects || []).map((p) =>
            p.id === state.activeProjectId
              ? { ...p, canvases: previous.canvases, globalSettings: previous.globalSettings, updatedAt: Date.now() }
              : p
          );

          return {
            past: newPast,
            future: newFuture,
            canUndo: newPast.length > 0,
            canRedo: newFuture.length > 0,
            canvases: previous.canvases,
            globalSettings: previous.globalSettings,
            projects: updatedProjects,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.future.length === 0) return state;
          const next = state.future[0];
          const newFuture = state.future.slice(1);
          const currentSnapshot = cloneState(state.canvases, state.globalSettings);
          const newPast = [...state.past, currentSnapshot].slice(-30);
          const updatedProjects = (state.projects || []).map((p) =>
            p.id === state.activeProjectId
              ? { ...p, canvases: next.canvases, globalSettings: next.globalSettings, updatedAt: Date.now() }
              : p
          );

          return {
            past: newPast,
            future: newFuture,
            canUndo: newPast.length > 0,
            canRedo: newFuture.length > 0,
            canvases: next.canvases,
            globalSettings: next.globalSettings,
            projects: updatedProjects,
          };
        }),

      createProject: (name = 'New Project', initialCanvases) =>
        set((state) => {
          const newId = `project-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)}`;
          const currentCanvases = initialCanvases || [
            {
              ...initialDefaultCanvas,
              id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36),
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
            globalSettings: { ...defaultGlobalSettings, appName: name },
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
            canvases: JSON.parse(JSON.stringify(target.canvases)),
            globalSettings: JSON.parse(JSON.stringify(target.globalSettings)),
            past: [],
            future: [],
            canUndo: false,
            canRedo: false,
          };
        }),

      renameProject: (projectId: string, name: string) =>
        set((state) => {
          const updatedProjects = state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  name,
                  updatedAt: Date.now(),
                  globalSettings: { ...p.globalSettings, appName: name },
                }
              : p
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

          const duplicateId = `project-${typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)}`;
          const isCurrentActive = projectId === state.activeProjectId;
          const duplicateCanvases = isCurrentActive ? state.canvases : target.canvases;
          const duplicateSettings = isCurrentActive ? state.globalSettings : target.globalSettings;

          const duplicate: Project = {
            ...target,
            id: duplicateId,
            name: `${target.name} (Copy)`,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            canvases: JSON.parse(JSON.stringify(duplicateCanvases)),
            globalSettings: JSON.parse(JSON.stringify(duplicateSettings)),
          };

          return {
            projects: [...state.projects, duplicate],
          };
        }),

      deleteProject: (projectId: string) =>
        set((state) => {
          if (state.projects.length <= 1) return state; // Never delete last project

          const syncedProjects = state.projects.map((p) =>
            p.id === state.activeProjectId
              ? { ...p, canvases: state.canvases, globalSettings: state.globalSettings, updatedAt: Date.now() }
              : p
          );
          const remaining = syncedProjects.filter((p) => p.id !== projectId);
          let nextActiveId = state.activeProjectId;
          let nextCanvases = state.canvases;
          let nextSettings = state.globalSettings;

          if (state.activeProjectId === projectId) {
            nextActiveId = remaining[0].id;
            nextCanvases = JSON.parse(JSON.stringify(remaining[0].canvases));
            nextSettings = JSON.parse(JSON.stringify(remaining[0].globalSettings));
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

      exportProjectFile: async (projectId) => {
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
          version: '2.0.0',
          type: 'launchshot-project',
          exportedAt: new Date().toISOString(),
          project: {
            ...project,
            canvases: state.activeProjectId === targetId ? state.canvases : project.canvases,
            globalSettings: state.activeProjectId === targetId ? state.globalSettings : project.globalSettings,
          },
        };

        const blob = new Blob([JSON.stringify(await portableProject(exportPayload), null, 2)], { type: 'application/json' });
        const sanitizedName = (project.name || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-');
        downloadBlob(blob, `${sanitizedName}.launchshot`);
      },

      importProjectFile: async (jsonText: string): Promise<boolean> => {
        try {
          const parsed = JSON.parse(jsonText);
          if (parsed.version && !['1.0.0', '2.0.0'].includes(parsed.version)) return false;
          const projectData = parsed.project || parsed;

          if (!projectData || !Array.isArray(projectData.canvases)) {
            throw new Error('Invalid project file: missing canvases');
          }

          if (projectData.canvases.some((canvas: CanvasItem) => !canvas || typeof canvas.title !== 'string' || typeof canvas.subtitle !== 'string' || typeof canvas.id !== 'string' || (canvas.imageSrc != null && typeof canvas.imageSrc !== 'string') || !validCreationFields(canvas))) return false;
          const newId = `project-${crypto.randomUUID()}`;
          const importedProject: Project = {
            id: newId,
            name: projectData.name || 'Imported Project',
            createdAt: projectData.createdAt || Date.now(),
            updatedAt: Date.now(),
            canvases: await restoreProjectImages(projectData.canvases) as CanvasItem[],
            globalSettings: { ...defaultGlobalSettings, ...projectData.globalSettings },
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
          const newTitle = initialData?.title ?? '';
          const newSubtitle = initialData?.subtitle ?? '';

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
          return { ...pushHistory(state, newCanvases), selectedCanvasId: duplicate.id };
        }),

      updateGlobalSettings: (updates) =>
        set((state) => {
          const nextSettings = { ...state.globalSettings, ...updates };
          return pushHistory(state, state.canvases, nextSettings);
        }),

      switchToAppStore: () =>
        set((state) => {
          const currentSize = state.globalSettings.targetSize;
          if (isAndroidDevice(currentSize)) {
            const nextSettings = {
              ...state.globalSettings,
              targetSize: DEFAULT_IPHONE_SIZE,
            };
            return pushHistory(state, state.canvases, nextSettings);
          }
          return state;
        }),

      switchToPlayStore: () =>
        set((state) => {
          const currentSize = state.globalSettings.targetSize;
          if (isAppleDevice(currentSize)) {
            const nextSettings = {
              ...state.globalSettings,
              targetSize: DEFAULT_ANDROID_SIZE,
            };
            return pushHistory(state, state.canvases, nextSettings);
          }
          return state;
        }),

      ensurePlatformForStore: (store) =>
        set((state) => {
          const currentSize = state.globalSettings.targetSize;
          if (store === 'app-store' && isAndroidDevice(currentSize)) {
            const nextSettings = {
              ...state.globalSettings,
              targetSize: DEFAULT_IPHONE_SIZE,
            };
            return pushHistory(state, state.canvases, nextSettings);
          } else if (store === 'play-store' && isAppleDevice(currentSize)) {
            const nextSettings = {
              ...state.globalSettings,
              targetSize: DEFAULT_ANDROID_SIZE,
            };
            return pushHistory(state, state.canvases, nextSettings);
          }
          return state;
        }),

      updateShadow: (updates) =>
        set((state) => {
          const currentShadow = state.globalSettings.shadow || DEFAULT_SHADOW;
          const nextShadow = { ...currentShadow, ...updates };
          const nextSettings = {
            ...state.globalSettings,
            shadow: nextShadow,
          };
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            shadow: { ...(c.shadow || currentShadow), ...updates },
          }));
          return pushHistory(state, nextCanvases, nextSettings);
        }),

      updateBackdropEffects: (updates) =>
        set((state) => {
          const currentEffects = state.globalSettings.backdropEffects || DEFAULT_BACKDROP_EFFECTS;
          const nextEffects = { ...currentEffects, ...updates };
          const nextSettings = {
            ...state.globalSettings,
            backdropEffects: nextEffects,
          };
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            backdropEffects: { ...(c.backdropEffects || currentEffects), ...updates },
          }));
          return pushHistory(state, nextCanvases, nextSettings);
        }),

      setAspectRatio: (aspectRatio) =>
        set((state) => {
          const nextSettings = {
            ...state.globalSettings,
            aspectRatio,
          };
          return pushHistory(state, state.canvases, nextSettings);
        }),

      rotateMockup: (canvasId) =>
        set((state) => {
          const targetId = canvasId || (state.canvases.find(c => c.id === state.selectedCanvasId) || state.canvases[0])?.id;
          if (!targetId) return state;
          const angles = [0, 8, -8, 15, -15];
          const nextCanvases = state.canvases.map((c) => {
            if (c.id === targetId) {
              const currentAngle = c.rotationAngle || 0;
              const currentIndex = angles.indexOf(currentAngle);
              const nextAngle = angles[(currentIndex + 1) % angles.length];
              return { ...c, rotationAngle: nextAngle };
            }
            return c;
          });
          return pushHistory(state, nextCanvases);
        }),

      shuffleBackground: () =>
        set((state) => {
          const randomIndex = Math.floor(Math.random() * POSTSPARK_COLOR_PALETTE.length);
          const chosenColor = POSTSPARK_COLOR_PALETTE[randomIndex];
          const textColor = getContrastColor(chosenColor);
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            backgroundColor: chosenColor,
            textColor,
          }));
          return pushHistory(state, nextCanvases);
        }),

      resetCanvasAdjustments: (canvasId) =>
        set((state) => {
          const targetId = canvasId || (state.canvases.find(c => c.id === state.selectedCanvasId) || state.canvases[0])?.id;
          const nextCanvases = state.canvases.map((c) => {
            if (!targetId || c.id === targetId) {
              return {
                ...c,
                rotationAngle: 0,
                imageZoom: 1,
                imageRotation: 0,
                shadow: DEFAULT_SHADOW,
                backdropEffects: DEFAULT_BACKDROP_EFFECTS,
              };
            }
            return c;
          });
          const nextSettings = {
            ...state.globalSettings,
            shadow: DEFAULT_SHADOW,
            backdropEffects: DEFAULT_BACKDROP_EFFECTS,
            zoomScale: 0.65,
          };
          return pushHistory(state, nextCanvases, nextSettings);
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
          const selected = state.canvases.find(c => c.id === state.selectedCanvasId) || state.canvases[0];
          const nextCanvases = state.canvases.map(c => selected && designKind(c) === designKind(selected) ? { ...c, layout } : c);
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

      applyTextBoxToAll: (textBoxWidth, titleFontSize, subtitleFontSize, textAlign) =>
        set((state) => {
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            ...(textBoxWidth !== undefined ? { textBoxWidth } : {}),
            ...(titleFontSize !== undefined ? { titleFontSize } : {}),
            ...(subtitleFontSize !== undefined ? { subtitleFontSize } : {}),
            ...(textAlign !== undefined ? { textAlign } : {}),
          }));
          return pushHistory(state, nextCanvases);
        }),

      applyBadgeToAll: (badge) =>
        set((state) => {
          let nextSettings = state.globalSettings;
          const badgeStore = getBadgeStore(badge);
          if (badgeStore === 'app-store' && isAndroidDevice(state.globalSettings.targetSize)) {
            nextSettings = { ...state.globalSettings, targetSize: DEFAULT_IPHONE_SIZE };
          } else if (badgeStore === 'play-store' && isAppleDevice(state.globalSettings.targetSize)) {
            nextSettings = { ...state.globalSettings, targetSize: DEFAULT_ANDROID_SIZE };
          }
          const nextCanvases = state.canvases.map((c) => ({
            ...c,
            badge: { ...badge },
          }));
          return pushHistory(state, nextCanvases, nextSettings);
        }),

      updateBadge: (canvasId, badgeUpdates) =>
        set((state) => {
          const currentBadge = state.canvases.find((c) => c.id === canvasId)?.badge || { enabled: true, icon: 'star', text: '', style: 'pill-glass' };
          const mergedBadge = { ...currentBadge, ...badgeUpdates };
          let nextSettings = state.globalSettings;
          const badgeStore = getBadgeStore(mergedBadge);
          if (badgeStore === 'app-store' && isAndroidDevice(state.globalSettings.targetSize)) {
            nextSettings = { ...state.globalSettings, targetSize: DEFAULT_IPHONE_SIZE };
          } else if (badgeStore === 'play-store' && isAppleDevice(state.globalSettings.targetSize)) {
            nextSettings = { ...state.globalSettings, targetSize: DEFAULT_ANDROID_SIZE };
          }
          const nextCanvases = state.canvases.map((c) => {
            if (c.id !== canvasId) return c;
            return {
              ...c,
              badge: mergedBadge,
            };
          });
          return pushHistory(state, nextCanvases, nextSettings);
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
          if (state.canvases.some(canvas => designKind(canvas) !== 'screenshot')) {
            let index = 0;
            return pushHistory(state, state.canvases.map(canvas => {
              if (designKind(canvas) !== 'screenshot' || !newCanvases.length) return canvas;
              const template = newCanvases[Math.min(index++, newCanvases.length - 1)];
              return applyDesign(canvas, captureDesign(template, state.globalSettings));
            }));
          }
          const updatedCanvases = [...newCanvases];

          for (let i = 0; i < Math.min(updatedCanvases.length, state.canvases.length); i++) {
            const userCanvas = state.canvases[i];
            if (userCanvas.imageSrc) {
              updatedCanvases[i].imageSrc = userCanvas.imageSrc;
              if (userCanvas.imageCrop) updatedCanvases[i].imageCrop = userCanvas.imageCrop;
              if (userCanvas.imageZoom) updatedCanvases[i].imageZoom = userCanvas.imageZoom;
              if (userCanvas.imageRotation) updatedCanvases[i].imageRotation = userCanvas.imageRotation;
              if (userCanvas.imageFilters) updatedCanvases[i].imageFilters = userCanvas.imageFilters;
              if (userCanvas.imageFit) updatedCanvases[i].imageFit = userCanvas.imageFit;
            }
          }

          if (state.canvases.length > updatedCanvases.length) {
            const lastTemplateCanvas = updatedCanvases[updatedCanvases.length - 1];

            for (let i = updatedCanvases.length; i < state.canvases.length; i++) {
              const userCanvas = state.canvases[i];
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

      batchUpdateTranslations: (translationsMap, newActiveLanguage) =>
        set((state) => {
          const currentLang = newActiveLanguage || state.globalSettings.activeLanguage || DEFAULT_LANGUAGE;

          const updatedCanvases = state.canvases.map((c) => {
            const currentTranslations = { ...(c.translations || {}) };

            for (const [lang, map] of Object.entries(translationsMap)) {
              if (map[c.id]) {
                currentTranslations[lang] = map[c.id];
              }
            }

            const activeTrans = currentTranslations[currentLang];

            return {
              ...c,
              title: activeTrans ? activeTrans.title : c.title,
              subtitle: activeTrans ? activeTrans.subtitle : c.subtitle,
              translations: currentTranslations,
            };
          });

          const nextSettings = newActiveLanguage
            ? { ...state.globalSettings, activeLanguage: newActiveLanguage }
            : state.globalSettings;

          return pushHistory(state, updatedCanvases, nextSettings);
        }),
    }),
    {
      name: 'screenshot-editor-storage',
      storage: createJSONStorage(() => projectStorage),
      skipHydration: true,
      // Exclude past & future from persistence to save localStorage quota
      partialize: (state) => ({
        savedDesigns: state.savedDesigns,
        canvases: state.canvases,
        globalSettings: state.globalSettings,
        projects: state.projects,
        activeProjectId: state.activeProjectId,
      }),
      merge: (persistedState, currentState) => {
        const persisted = (persistedState as Partial<EditorState>) || {};
        const safeCanvases =
          Array.isArray(persisted.canvases) && persisted.canvases.length > 0
            ? persisted.canvases
            : currentState.canvases;
        const safeSettings = persisted.globalSettings
          ? { ...currentState.globalSettings, ...persisted.globalSettings }
          : currentState.globalSettings;
        let safeProjects =
          Array.isArray(persisted.projects) && persisted.projects.length > 0
            ? persisted.projects
            : currentState.projects;
        let safeActiveId = persisted.activeProjectId || currentState.activeProjectId;

        if (!safeProjects || safeProjects.length === 0) {
          safeProjects = [
            {
              id: safeActiveId || 'default-project',
              name: safeSettings.appName || 'Default Project',
              createdAt: Date.now(),
              updatedAt: Date.now(),
              canvases: safeCanvases,
              globalSettings: safeSettings,
            },
          ];
        }

        if (!safeProjects.some((p) => p.id === safeActiveId)) {
          safeActiveId = safeProjects[0].id;
        }

        return {
          ...currentState,
          ...persisted,
          canvases: safeCanvases,
          globalSettings: safeSettings,
          projects: safeProjects,
          activeProjectId: safeActiveId,
          past: [],
          future: [],
          canUndo: false,
          canRedo: false,
        };
      },
    }
  )
);
