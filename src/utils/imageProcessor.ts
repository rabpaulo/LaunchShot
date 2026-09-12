import { useEditorStore } from '@/store/useEditorStore';


export function getContrastColor(colorStr: string): string {
  if (!colorStr) return '#ffffff';
  
  // If gradient, extract first hex or rgb color in the gradient
  const hexMatch = colorStr.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/);
  if (hexMatch) {
    const hex = hexMatch[0];
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 135 ? '#000000' : '#ffffff';
  }

  // Check rgb/rgba
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return yiq >= 135 ? '#000000' : '#ffffff';
  }

  return '#ffffff';
}

export async function processUploadedFiles(
  files: File[],
  onProgress?: (progress: number, current: number, total: number) => void
) {
  if (!files || files.length === 0) return;

  const imageFiles = files.filter((f) => f.type.startsWith('image/'));
  if (imageFiles.length === 0) return;

  const sources: string[] = [];
  for (const file of imageFiles) {
    const source = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = source;
      await image.decode();
      sources.push(source);
    } catch {
      URL.revokeObjectURL(source);
      throw new Error(`Could not read ${file.name}. Use a PNG, JPEG, or WebP screenshot.`);
    }
    onProgress?.(Math.round(sources.length / imageFiles.length * 100), sources.length, imageFiles.length);
  }
  useEditorStore.getState().importScreenshots(sources);
}
