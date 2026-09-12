import JSZip from 'jszip';
import FileSaver from 'file-saver';
import type { CanvasItem, GlobalSettings } from '@/store/useEditorStore';
import { useEditorStore } from '@/store/useEditorStore';
import { TARGET_SIZES, type TargetSizeId } from '@/config/sizes';

const saveAs = (FileSaver as { saveAs?: (blob: Blob, name: string) => void })?.saveAs || (FileSaver as unknown as (blob: Blob, name: string) => void);
export function downloadBlob(blob: Blob, filename: string) {
  if (typeof saveAs === 'function') { saveAs(blob, filename); return; }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface ExportFailure { slide: number; size: string; language: string; message: string }
export interface ExportResult { exported: number; failures: ExportFailure[] }
export function slideExportIssue(canvas: CanvasItem, language: string, currentLanguage: string): string | undefined {
  if (!canvas.imageSrc) return 'Replace the missing screenshot.';
  const copy = canvas.translations?.[language] || (language === currentLanguage ? canvas : undefined);
  if (!copy) return `Add the ${language} translation first.`;
  if (canvas.layout !== 'device-only' && !copy.title.trim()) return 'Write a headline before exporting.';
}

/** The job owns a snapshot; rendering never changes the editor or its history. */
export async function exportImages(
  canvases: CanvasItem[], selectedSizes?: string[], selectedLanguages?: string[],
  onProgress?: (progress: number) => void,
): Promise<ExportResult> {
  const settings: GlobalSettings = structuredClone(useEditorStore.getState().globalSettings);
  const snapshot = structuredClone(canvases);
  const sizes = selectedSizes?.length ? selectedSizes : [settings.targetSize];
  const languages = selectedLanguages?.length ? selectedLanguages : [settings.activeLanguage || 'en'];
  const zip = new JSZip();
  const result: ExportResult = { exported: 0, failures: [] };
  const { renderSlideImage } = await import('./exportSurface');
  let completed = 0;
  const total = sizes.length * languages.length * snapshot.length;
  for (const language of languages) {
    for (const size of sizes) {
      for (const [index, canvas] of snapshot.entries()) {
        try {
          if (!TARGET_SIZES[size as TargetSizeId]) throw new Error('Unknown export dimensions.');
          const issue = slideExportIssue(canvas, language, settings.activeLanguage || 'en');
          if (issue) throw new Error(issue);
          const blob = await renderSlideImage({ canvas, canvases: snapshot,
            settings: { ...settings, targetSize: size as TargetSizeId, activeLanguage: language },
          });
          zip.file(`${language}/${size}/${String(index + 1).padStart(2, '0')}.png`, blob);
          result.exported++;
        } catch (error) {
          result.failures.push({ slide: index + 1, size, language,
            message: error instanceof Error ? error.message : 'Could not render this slide.',
          });
        }
        onProgress?.(Math.round(++completed / total * 95));
      }
    }
  }
  if (result.exported) {
    if (result.failures.length) zip.file('export-errors.json', JSON.stringify(result.failures, null, 2));
    downloadBlob(await zip.generateAsync({ type: 'blob' }), 'launchshot-screenshots.zip');
  }
  onProgress?.(100);
  return result;
}

export async function copyCanvasToClipboard(canvasId: string): Promise<boolean> {
  const state = useEditorStore.getState();
  const canvas = state.canvases.find(item => item.id === canvasId);
  if (!canvas || !navigator.clipboard || !window.ClipboardItem) return false;
  const snapshot = structuredClone(state.canvases);
  const settings = structuredClone(state.globalSettings);
  const blob = import('./exportSurface').then(({ renderSlideImage }) => renderSlideImage({
    canvas: snapshot.find(item => item.id === canvasId)!, canvases: snapshot, settings,
  }));
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
  return true;
}
