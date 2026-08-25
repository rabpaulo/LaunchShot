import { toBlob } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CanvasItem, useEditorStore } from '@/store/useEditorStore';
import { TARGET_SIZES } from '@/config/sizes';

export const exportImages = async (canvases: CanvasItem[], selectedSizes?: string[]) => {
  const store = useEditorStore.getState();
  const originalSize = store.globalSettings.targetSize;
  
  const sizesToExport = selectedSizes && selectedSizes.length > 0 ? selectedSizes : [originalSize];
  const zip = new JSZip();
  let hasImages = false;

  for (let sIdx = 0; sIdx < sizesToExport.length; sIdx++) {
    const sizeId = sizesToExport[sIdx];
    
    // 1. Update the store to the new size
    store.updateGlobalSettings({ targetSize: sizeId as import('@/config/sizes').TargetSizeId });
    
    // 2. Wait for DOM to re-render
    await new Promise((resolve) => setTimeout(resolve, 800)); // wait for layout to settle

    const sizeConfig = TARGET_SIZES[sizeId as keyof typeof TARGET_SIZES];
    if (!sizeConfig) continue;

    const pixelRatio = sizeConfig.pixelRatio;
    
    // Create a folder for this size if there are multiple sizes
    const folder = sizesToExport.length > 1 ? zip.folder(sizeConfig.name) : zip;

    for (let i = 0; i < canvases.length; i++) {
      const canvasNode = document.getElementById(`canvas-${canvases[i].id}`);
      if (!canvasNode) continue;

      try {
        const blob = await toBlob(canvasNode, {
          quality: 1,
          pixelRatio,
        });
        if (blob) {
          folder!.file(`screenshot-${i + 1}.png`, blob);
          hasImages = true;
        }
      } catch (err) {
        console.error(`Failed to export canvas ${canvases[i].id} for size ${sizeId}`, err);
      }
    }
  }

  // 3. Restore the original size
  store.updateGlobalSettings({ targetSize: originalSize });

  if (hasImages) {
    const content = await zip.generateAsync({ type: 'blob' });
    const filename = sizesToExport.length > 1 ? 'screenshots-multi-device.zip' : `screenshots-${sizesToExport[0]}.zip`;
    saveAs(content, filename);
  } else {
    alert('Failed to generate any images.');
  }
};
