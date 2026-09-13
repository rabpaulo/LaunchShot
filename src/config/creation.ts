import type { CanvasItem, GlobalSettings } from '@/store/useEditorStore';
import { DEFAULT_IPHONE_SIZE, TARGET_SIZES, type TargetSizeId } from '@/config/sizes';

export type DesignKind = 'screenshot' | 'banner' | 'mockup';
export type OutputSize = { width: number; height: number };
export const BANNER_SIZES = [
  { name: 'Social preview', width: 1200, height: 630 },
  { name: 'Landscape', width: 1920, height: 1080 },
  { name: 'Square', width: 1080, height: 1080 },
  { name: 'Story', width: 1080, height: 1920 },
  { name: 'Feature graphic', width: 1024, height: 500 },
];
export const designKind = (canvas: CanvasItem): DesignKind => canvas.kind || 'screenshot';
export const mediaPresentation = (canvas: CanvasItem) => canvas.mediaPresentation || (designKind(canvas) === 'banner' ? 'none' : 'device');
export const isTransparent = (canvas: CanvasItem) => designKind(canvas) === 'mockup' && !!canvas.transparentBackground;
export function mediaSlotCount(canvas: CanvasItem): number {
  if (mediaPresentation(canvas) === 'none') return 0;
  if (mediaPresentation(canvas) === 'image') return 1;
  if (canvas.layout === 'duo-row') return 2;
  return ['trio-row', 'multi-screen-right', 'multi-screen-left', 'multi-screen-center', 'banner-stack-right', 'banner-kinetic-stack', 'banner-triple-bottom', 'og-style-3'].includes(canvas.layout) ? 3 : 1;
}

/** An explicitly cleared slot stays blank; omitted slots keep legacy image reuse. */
export function resolveMediaImages(canvas: CanvasItem, previous?: CanvasItem, next?: CanvasItem, nextNext?: CanvasItem) {
  const siblings = [previous, next, nextNext].map(item => item && designKind(item) === designKind(canvas) ? item.imageSrc : undefined);
  const forward = canvas.layout === 'multi-screen-right';
  return [
    canvas.imageSrc,
    canvas.secondaryImageSrc === null ? null : canvas.secondaryImageSrc || siblings[forward ? 1 : 0] || canvas.imageSrc,
    canvas.tertiaryImageSrc === null ? null : canvas.tertiaryImageSrc || (forward && siblings[2]) || siblings[1] || canvas.imageSrc,
  ];
}
export function validOutputSize(value: unknown): value is OutputSize {
  if (!value || typeof value !== 'object') return false;
  return ['width', 'height'].every(key => {
    const number = (value as Record<string, unknown>)[key];
    return typeof number === 'number' && Number.isInteger(number) && number >= 64 && number <= 4096;
  });
}
export function validCreationFields(canvas: CanvasItem): boolean {
  return (canvas.kind === undefined || ['screenshot', 'banner', 'mockup'].includes(canvas.kind))
    && (canvas.outputSize === undefined || validOutputSize(canvas.outputSize))
    && (canvas.deviceTarget === undefined || (typeof canvas.deviceTarget === 'string' && Object.hasOwn(TARGET_SIZES, canvas.deviceTarget) && TARGET_SIZES[canvas.deviceTarget].category !== 'Header'))
    && (canvas.mediaPresentation === undefined || ['none', 'image', 'device'].includes(canvas.mediaPresentation))
    && (canvas.transparentBackground === undefined || typeof canvas.transparentBackground === 'boolean')
    && (canvas.yawAngle === undefined || (Number.isFinite(canvas.yawAngle) && canvas.yawAngle >= -60 && canvas.yawAngle <= 60))
    && (canvas.mediaScale === undefined || (Number.isFinite(canvas.mediaScale) && canvas.mediaScale >= .25 && canvas.mediaScale <= 1.5))
    && (canvas.mediaOffset === undefined || (canvas.mediaOffset !== null && typeof canvas.mediaOffset === 'object' && ['x', 'y'].every(key => {
      const value = canvas.mediaOffset![key as 'x' | 'y'];
      return Number.isFinite(value) && value >= -50 && value <= 50;
    })))
    && (canvas.mockupStyle === undefined || ['dark', 'light', 'glass', 'clay-dark', 'clay-light'].includes(canvas.mockupStyle));
}
export function resolveCanvasSize(canvas: CanvasItem, settings: GlobalSettings) {
  if (!canvas.outputSize) return TARGET_SIZES[settings.targetSize] || TARGET_SIZES[DEFAULT_IPHONE_SIZE];
  const { width, height } = canvas.outputSize;
  if (designKind(canvas) === 'screenshot') {
    const preset = Object.values(TARGET_SIZES).find(size => size.width === width && size.height === height);
    if (preset) return preset;
  }
  // A stable logical coordinate system keeps typography useful at any output resolution.
  const pixelRatio = Math.max(width, height) / 960;
  return { width, height, logicalWidth: width / pixelRatio, logicalHeight: height / pixelRatio, pixelRatio };
}
export function resolveDeviceTarget(canvas: CanvasItem, settings: GlobalSettings): TargetSizeId {
  const target = canvas.deviceTarget || settings.targetSize;
  return Object.hasOwn(TARGET_SIZES, target) && TARGET_SIZES[target].category !== 'Header' ? target : DEFAULT_IPHONE_SIZE;
}
export function mediaAspectRatio(canvas: CanvasItem, settings: GlobalSettings): number {
  const size = mediaPresentation(canvas) === 'image' ? resolveCanvasSize(canvas, settings) : TARGET_SIZES[resolveDeviceTarget(canvas, settings)];
  return size.width / size.height * (mediaPresentation(canvas) === 'image' ? .46 / .48 : 1);
}
export function newDesign(kind: DesignKind, settings: GlobalSettings): Partial<CanvasItem> {
  const target = TARGET_SIZES[settings.targetSize] || TARGET_SIZES[DEFAULT_IPHONE_SIZE];
  return {
    kind, title: '', subtitle: '', imageSrc: null,
    outputSize: kind === 'screenshot' ? { width: target.width, height: target.height } : kind === 'banner' ? { width: 1200, height: 630 } : { width: 1080, height: 1080 },
    deviceTarget: kind === 'screenshot' && target.category !== 'Header' ? target.id : DEFAULT_IPHONE_SIZE,
    mediaPresentation: kind === 'banner' ? 'none' : 'device',
    layout: kind === 'banner' ? 'banner-centered' : kind === 'mockup' ? 'device-only' : 'basic-top',
    backgroundColor: '#f2f0eb', textColor: '#0f172a', fontFamily: settings.fontFamily,
    ...(kind === 'banner' ? { titleFontSize: 48, subtitleFontSize: 24 } : {}),
    backdropEffects: { mode: 'solid', overlay: false, effects: false, pattern: false, vignette: false },
  };
}
