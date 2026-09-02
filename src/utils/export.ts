import { toBlob } from 'html-to-image';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import type { CanvasItem } from '@/store/useEditorStore';
import { useEditorStore } from '@/store/useEditorStore';
import { TARGET_SIZES } from '@/config/sizes';
import { DEFAULT_LANGUAGE } from '@/config/languages';

const saveAs = (FileSaver as { saveAs?: (blob: Blob, name: string) => void })?.saveAs || (FileSaver as unknown as (blob: Blob, name: string) => void);

export function downloadBlob(blob: Blob, filename: string) {
  try {
    if (typeof saveAs === 'function') {
      saveAs(blob, filename);
      return;
    }
  } catch {
    // fallback
  }
  if (typeof document !== 'undefined') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

export const exportImages = async (
  canvases: CanvasItem[],
  selectedSizes?: string[],
  selectedLanguages?: string[],
  onProgress?: (progress: number) => void
) => {
  const store = useEditorStore.getState();
  const originalSize = store.globalSettings.targetSize;
  const originalLanguage = store.globalSettings.activeLanguage || DEFAULT_LANGUAGE;
  const savedPast = store.past;
  const savedFuture = store.future;

  const sizesToExport = selectedSizes && selectedSizes.length > 0 ? selectedSizes : [originalSize];
  const languagesToExport = selectedLanguages && selectedLanguages.length > 0 ? selectedLanguages : [originalLanguage];

  const zip = new JSZip();
  let hasImages = false;

  const totalSteps = languagesToExport.length * sizesToExport.length * canvases.length;
  let currentStep = 0;

  try {
    if (typeof document !== 'undefined' && document.fonts) {
      await document.fonts.ready;
    }

    for (let lIdx = 0; lIdx < languagesToExport.length; lIdx++) {
      const langCode = languagesToExport[lIdx];
      const langFolder = languagesToExport.length > 1 ? langCode : null;

      // 1. Switch active language in store
      store.setActiveLanguage(langCode);

      for (let sIdx = 0; sIdx < sizesToExport.length; sIdx++) {
        const sizeId = sizesToExport[sIdx];
        const sizeConfig = TARGET_SIZES[sizeId as keyof typeof TARGET_SIZES];
        if (!sizeConfig) continue;

        // 2. Update store target size
        store.updateGlobalSettings({ targetSize: sizeId as import('@/config/sizes').TargetSizeId });

        // 3. Wait for layout and typography re-render to settle
        await new Promise((resolve) => setTimeout(resolve, 600));
        if (typeof document !== 'undefined' && document.fonts) {
          await document.fonts.ready;
        }

        const pixelRatio = sizeConfig.pixelRatio;

        // Determine destination folder in ZIP
        let folder = zip;
        if (langFolder && sizesToExport.length > 1) {
          folder = zip.folder(langFolder)!.folder(sizeConfig.name)!;
        } else if (langFolder) {
          folder = zip.folder(langFolder)!;
        } else if (sizesToExport.length > 1) {
          folder = zip.folder(sizeConfig.name)!;
        }

        // Render each canvas
        for (let i = 0; i < canvases.length; i++) {
          const canvasId = canvases[i].id;
          const canvasNode = document.getElementById(`canvas-${canvasId}`);
          if (!canvasNode) continue;

          try {
            const blob = await toBlob(canvasNode, {
              quality: 1,
              pixelRatio,
              cacheBust: true,
              filter: (node) => {
                if (node instanceof HTMLElement && node.classList.contains('no-export')) {
                  return false;
                }
                return true;
              },
            });
            if (blob) {
              folder.file(`screenshot-${i + 1}.png`, blob);
              hasImages = true;
            }
          } catch (err) {
            console.error(`Failed to export canvas ${canvasId} for size ${sizeId} in language ${langCode}`, err);
          }

          currentStep++;
          if (onProgress) {
            const pct = Math.min(95, Math.round((currentStep / totalSteps) * 95));
            onProgress(pct);
          }
        }
      }
    }
  } finally {
    // 4. Restore original store state without polluting undo/redo history
    store.setActiveLanguage(originalLanguage);
    store.updateGlobalSettings({ targetSize: originalSize });
    useEditorStore.setState({
      past: savedPast,
      future: savedFuture,
      canUndo: savedPast.length > 0,
      canRedo: savedFuture.length > 0,
    });
  }

  if (hasImages) {
    if (onProgress) onProgress(98);
    const content = await zip.generateAsync({ type: 'blob' });
    if (onProgress) onProgress(100);

    let filename = 'screenshots.zip';
    if (languagesToExport.length > 1 && sizesToExport.length > 1) {
      filename = 'screenshots-multi-language-devices.zip';
    } else if (languagesToExport.length > 1) {
      filename = 'screenshots-multi-language.zip';
    } else if (sizesToExport.length > 1) {
      filename = 'screenshots-multi-device.zip';
    } else {
      filename = `screenshots-${sizesToExport[0]}.zip`;
    }

    downloadBlob(content, filename);
  } else {
    alert('Failed to generate any images.');
  }
};
