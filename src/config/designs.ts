import type { CanvasItem, GlobalSettings } from '@/store/useEditorStore';

const DESIGN_KEYS = ['layout', 'backgroundColor', 'backgroundImageSrc', 'appIconSrc', 'textColor', 'subtitleColor', 'fontFamily', 'gradientText', 'textBoxWidth', 'titleFontSize', 'subtitleFontSize', 'textAlign', 'shadow', 'backdropEffects', 'rotationAngle', 'doodle', 'badge', 'floatingCards', 'calloutPins', 'statusBar', 'showAppStoreBadge'] as const;
export type SlideDesign = Pick<CanvasItem, typeof DESIGN_KEYS[number]>;
export interface SavedDesign { id: string; name: string; design: SlideDesign }

/** Copy appearance without copying screenshot assets, headlines, or translations. */
export function captureDesign(canvas: CanvasItem, settings: GlobalSettings): SlideDesign {
  const design = Object.fromEntries(DESIGN_KEYS.map(key => [key, canvas[key]])) as SlideDesign;
  return structuredClone({ ...design, fontFamily: canvas.fontFamily || settings.fontFamily, shadow: canvas.shadow || settings.shadow, backdropEffects: canvas.backdropEffects || settings.backdropEffects });
}

export function applyDesign(canvas: CanvasItem, design: SlideDesign): CanvasItem {
  // Explicit undefined entries also reset optional properties absent from a saved template.
  return { ...canvas, ...Object.fromEntries(DESIGN_KEYS.map(key => [key, structuredClone(design[key])])) };
}
