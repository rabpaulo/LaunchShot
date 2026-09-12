'use client';

import { CanvasEditor } from './CanvasEditor';
import type { CanvasItem, GlobalSettings } from '@/store/useEditorStore';
import { TARGET_SIZES } from '@/config/sizes';

export interface SlideRendererProps {
  canvas: CanvasItem;
  canvases: CanvasItem[];
  settings: GlobalSettings;
  width?: number;
  renderId: string;
  editableTextBox?: boolean;
}

/** One composition for workspace previews, style previews, and isolated exports. */
export function SlideRenderer({ canvas, canvases, settings, width, renderId, editableTextBox = false }: SlideRendererProps) {
  const index = Math.max(0, canvases.findIndex(item => item.id === canvas.id));
  const translation = canvas.translations?.[settings.activeLanguage || 'en'];
  const resolve = (item?: CanvasItem) => item && ({ ...item, ...item.translations?.[settings.activeLanguage || 'en'] });
  return <CanvasEditor
    canvas={translation ? { ...canvas, ...translation } : canvas}
    settings={settings}
    index={index}
    total={canvases.length}
    prevCanvas={resolve(canvases[index - 1])}
    nextCanvas={resolve(canvases[index + 1])}
    nextNextCanvas={resolve(canvases[index + 2])}
    isPreviewMode
    editableTextBox={editableTextBox}
    targetWidth={width || TARGET_SIZES[settings.targetSize].logicalWidth}
    renderId={renderId}
  />;
}
