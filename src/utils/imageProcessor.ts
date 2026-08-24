import { FastAverageColor } from 'fast-average-color';
import { useEditorStore } from '@/store/useEditorStore';

const fac = new FastAverageColor();

export function getContrastColor(hex: string): string {
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
  return yiq >= 128 ? '#000000' : '#ffffff';
}

export async function processUploadedFiles(
  files: File[],
  onProgress?: (progress: number, current: number, total: number) => void
) {
  if (!files || files.length === 0) return;

  const imageFiles = files.filter((f) => f.type.startsWith('image/'));
  if (imageFiles.length === 0) return;

  const { canvases, updateCanvas, addCanvas } = useEditorStore.getState();

  // If there's only 1 default empty canvas, replace it with the first uploaded image
  let startIndex = 0;
  if (canvases.length === 1 && !canvases[0].imageSrc) {
    const firstFile = imageFiles[0];
    const url = URL.createObjectURL(firstFile);
    try {
      const color = await fac.getColorAsync(url);
      updateCanvas(canvases[0].id, {
        imageSrc: url,
        backgroundColor: color.hex,
        textColor: getContrastColor(color.hex),
      });
    } catch {
      updateCanvas(canvases[0].id, { imageSrc: url });
    }
    startIndex = 1;
  }

  // Add the remaining images
  for (let i = startIndex; i < imageFiles.length; i++) {
    if (onProgress) {
      onProgress(Math.round((i / imageFiles.length) * 100), i, imageFiles.length);
    }
    const file = imageFiles[i];
    const url = URL.createObjectURL(file);
    try {
      const color = await fac.getColorAsync(url);
      addCanvas({
        imageSrc: url,
        backgroundColor: color.hex,
        textColor: getContrastColor(color.hex),
      });
    } catch {
      addCanvas({ imageSrc: url });
    }
  }
  if (onProgress) {
    onProgress(100, imageFiles.length, imageFiles.length);
  }
}
