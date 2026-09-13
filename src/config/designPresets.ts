import type { CanvasItem } from '@/store/useEditorStore';

export const DESIGN_PRESETS: { id: string; name: string; kind: 'banner' | 'mockup'; changes: Partial<CanvasItem> }[] = [
  { id: 'clean-split', name: 'Clean split image', kind: 'banner', changes: { layout: 'banner-split', mediaPresentation: 'image', backgroundColor: '#f2f0eb', textColor: '#172326', textAlign: 'left', textBoxWidth: 46, titleFontSize: 52, subtitleFontSize: 22 } },
  { id: 'bold-headline', name: 'Bold centered headline', kind: 'banner', changes: { layout: 'banner-centered', mediaPresentation: 'none', backgroundColor: 'linear-gradient(135deg, #312e81 0%, #c026d3 100%)', textColor: '#ffffff', textAlign: 'center', textBoxWidth: 86, titleFontSize: 68, subtitleFontSize: 26 } },
  { id: 'layered-launch', name: 'Dark layered devices', kind: 'banner', changes: { layout: 'banner-stack-right', mediaPresentation: 'device', backgroundColor: 'radial-gradient(circle at 85% 20%, #334155 0%, #0f172a 75%)', textColor: '#f8fafc', textAlign: 'left', textBoxWidth: 48, titleFontSize: 52, subtitleFontSize: 22, rotationAngle: -8, mediaScale: 1.15, mediaOffset: { x: -5, y: 0 } } },
  { id: 'studio-single', name: 'Clean single device', kind: 'mockup', changes: { layout: 'device-only', mediaPresentation: 'device', backgroundColor: '#e9eee8', textColor: '#172326', mockupStyle: 'clay-light', shadow: { style: 'spread', intensity: 'low', lightSource: [0, 1] } } },
  { id: 'gradient-pair', name: 'Gradient device pair', kind: 'mockup', changes: { layout: 'duo-row', mediaPresentation: 'device', backgroundColor: 'linear-gradient(135deg, #4338ca 0%, #db2777 100%)', textColor: '#ffffff', rotationAngle: -8, mediaScale: 1.1 } },
  { id: 'dark-trio', name: 'Dark device trio', kind: 'mockup', changes: { layout: 'trio-row', mediaPresentation: 'device', backgroundColor: 'radial-gradient(circle at 50% 0%, #475569 0%, #111827 75%)', textColor: '#ffffff', mockupStyle: 'light', shadow: { style: 'spread', intensity: 'high', lightSource: [0, 2] } } },
];

/** Appearance only: applying a preset never inserts sample copy or replaces assets. */
export function presetChanges(preset: typeof DESIGN_PRESETS[number]): Partial<CanvasItem> {
  return {
    fontFamily: 'inter', gradientText: false, subtitleColor: preset.changes.textColor,
    mockupStyle: 'dark', rotationAngle: 0, yawAngle: 0, mediaScale: 1, mediaOffset: { x: 0, y: 0 },
    backdropEffects: { mode: preset.changes.backgroundColor?.includes('gradient') ? 'gradient' : 'solid', overlay: false, effects: false, pattern: false, vignette: false },
    shadow: { style: 'spread', intensity: 'medium', lightSource: [0, 1] },
    ...structuredClone(preset.changes),
  };
}
