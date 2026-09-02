import { FastAverageColor } from 'fast-average-color';
import { useEditorStore } from '@/store/useEditorStore';

const fac = new FastAverageColor();

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

  const { canvases, updateCanvas, addCanvas } = useEditorStore.getState();

  // First, find all canvases that don't have an image
  const emptyCanvases = canvases.filter(c => !c.imageSrc);
  
  let processedCount = 0;

  // 1. Fill empty canvases first
  for (let i = 0; i < Math.min(emptyCanvases.length, imageFiles.length); i++) {
    const file = imageFiles[i];
    const url = URL.createObjectURL(file);
    try {
      const color = await fac.getColorAsync(url);
      updateCanvas(emptyCanvases[i].id, { 
        imageSrc: url,
        backgroundColor: color.hex,
        textColor: getContrastColor(color.hex),
      });
    } catch {
      updateCanvas(emptyCanvases[i].id, { imageSrc: url });
    }
    processedCount++;
    if (onProgress) {
      onProgress(Math.round((processedCount / imageFiles.length) * 100), processedCount, imageFiles.length);
    }
  }

  // 2. If we still have images left, append new canvases using the layout of the last canvas (if any)
  const lastCanvas = canvases.length > 0 ? canvases[canvases.length - 1] : null;
  
  for (let i = processedCount; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const url = URL.createObjectURL(file);
    try {
      const color = await fac.getColorAsync(url);
      addCanvas({
        imageSrc: url,
        backgroundColor: color.hex,
        textColor: getContrastColor(color.hex),
        title: 'Amazing Feature',
        subtitle: 'Describe your feature here',
        layout: lastCanvas ? lastCanvas.layout : 'basic-top',
        fontFamily: lastCanvas ? lastCanvas.fontFamily : 'inter'
      });
    } catch {
      addCanvas({ 
        imageSrc: url,
        layout: lastCanvas ? lastCanvas.layout : 'basic-top',
        fontFamily: lastCanvas ? lastCanvas.fontFamily : 'inter'
      });
    }
    processedCount++;
    if (onProgress) {
      onProgress(Math.round((processedCount / imageFiles.length) * 100), processedCount, imageFiles.length);
    }
  }
  
  if (onProgress) {
    onProgress(100, imageFiles.length, imageFiles.length);
  }
}
