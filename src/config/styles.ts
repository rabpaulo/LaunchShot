import type { CanvasItem, GlobalSettings } from '@/store/useEditorStore';

export type StudioStyleId = 'clean-light' | 'clean-dark' | 'bold-gradient';
export const STUDIO_STYLES: { id: StudioStyleId; name: string; background: string; color: string }[] = [
  { id: 'clean-light', name: 'Clean Light', background: '#f2f0eb', color: '#172326' },
  { id: 'clean-dark', name: 'Clean Dark', background: '#172326', color: '#f6f4ed' },
  { id: 'bold-gradient', name: 'Bold Gradient', background: 'linear-gradient(150deg, #312e81, #7c3aed 65%, #c026d3)', color: '#ffffff' },
];

export function styleSlide(canvas: CanvasItem, id: StudioStyleId): CanvasItem {
  const style = STUDIO_STYLES.find(item => item.id === id)!;
  return {
    ...canvas, layout: !canvas.kind || canvas.kind === 'screenshot' ? 'basic-top' : canvas.layout, backgroundColor: style.background, backgroundImageSrc: undefined,
    textColor: style.color, subtitleColor: style.color, fontFamily: 'inter',
    textAlign: 'center', textBoxWidth: 86, titleFontSize: 38, subtitleFontSize: 17,
    gradientText: false, rotationAngle: 0, yawAngle: 0, imageFit: 'contain', mockupStyle: 'dark',
    backdropEffects: { mode: id === 'bold-gradient' ? 'gradient' : 'solid', overlay: false, effects: false, pattern: false, vignette: false },
  };
}

export function styleSettings(settings: GlobalSettings, id: StudioStyleId): GlobalSettings {
  return { ...settings, studioStyle: id, fontFamily: 'inter', mockupStyle: 'dark', imageFit: 'contain',
    panorama: { ...settings.panorama!, enabled: false },
  };
}
