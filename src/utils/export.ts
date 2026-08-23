import { toBlob } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CanvasItem, useEditorStore } from '@/store/useEditorStore';
import { TARGET_SIZES } from '@/config/sizes';

export const exportImages = async (canvases: CanvasItem[]) => {
  const { globalSettings } = useEditorStore.getState();
  const zip = new JSZip();
  let hasImages = false;

  const currentSizeConfig = TARGET_SIZES[globalSettings.targetSize] || TARGET_SIZES['ios-6.5'];
  const pixelRatio = currentSizeConfig.pixelRatio;

  for (let i = 0; i < canvases.length; i++) {
    const canvasNode = document.getElementById(`canvas-${canvases[i].id}`);
    if (!canvasNode) continue;

    try {
      const blob = await toBlob(canvasNode, {
        quality: 1,
        pixelRatio,
      });
      if (blob) {
        zip.file(`screenshot-${i + 1}.png`, blob);
        hasImages = true;
      }
    } catch (err) {
      console.error('Failed to export canvas', canvases[i].id, err);
    }
  }

  if (hasImages) {
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `screenshots-${currentSizeConfig.id}.zip`);
  } else {
    alert('Failed to generate any images.');
  }
};
