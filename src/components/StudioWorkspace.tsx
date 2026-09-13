'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { IoArrowBackOutline, IoArrowForwardOutline, IoArrowRedoOutline, IoArrowUndoOutline, IoCheckmarkOutline, IoCloudUploadOutline, IoCopyOutline, IoDownloadOutline, IoExpandOutline, IoFolderOpenOutline, IoAddOutline, IoTrashOutline, IoCloseOutline } from 'react-icons/io5';
import { useEditorStore } from '@/store/useEditorStore';
import { STUDIO_STYLES, styleSlide, styleSettings } from '@/config/styles';
import { TARGET_SIZES, DEFAULT_IPHONE_SIZE, DEFAULT_ANDROID_SIZE, isAndroidDevice } from '@/config/sizes';
import { processUploadedFiles } from '@/utils/imageProcessor';
import { getSaveStatus, subscribeSaveStatus, retrySave } from '@/utils/projectStorage';
import { copyCanvasToClipboard } from '@/utils/export';
import { SlideRenderer } from './SlideRenderer';
import { WorkspaceDesignControls, WorkspaceTypography, WorkspacePresets, WorkspaceExtraImages } from './WorkspaceDesignControls';
import { captureDesign } from '@/config/designs';
import { CreationControls } from './CreationControls';
import { designKind, newDesign, resolveCanvasSize, isTransparent, type DesignKind } from '@/config/creation';
import styles from './StudioWorkspace.module.css';

const TemplateGalleryModal = dynamic(() => import('./TemplateGalleryModal').then(module => module.TemplateGalleryModal));
const ImageEditorModal = dynamic(() => import('./ImageEditorModal').then(module => module.ImageEditorModal));
const ExportModal = dynamic(() => import('./ExportModal').then(module => module.ExportModal));
const ProjectManagerModal = dynamic(() => import('./ProjectManagerModal').then(module => module.ProjectManagerModal));
const TranslationModal = dynamic(() => import('./TranslationModal').then(module => module.TranslationModal));

export function StudioWorkspace() {
  const state = useEditorStore();
  const saveStatus = useSyncExternalStore(subscribeSaveStatus, getSaveStatus, () => 'loading');
  const [hydrated, setHydrated] = useState(false);
  const [modal, setModal] = useState<'export' | 'projects' | 'translations' | 'preview' | 'templates' | 'image' | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const [available, setAvailable] = useState({ width: 600, height: 650 });
  const uploadRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLElement>(null);
  const selected = state.canvases.find(canvas => canvas.id === state.selectedCanvasId) || state.canvases[0];
  const index = selected ? state.canvases.indexOf(selected) : 0;
  const project = state.projects.find(item => item.id === state.activeProjectId);
  const isEmpty = state.canvases.length === 0 || (state.canvases.length === 1 && designKind(selected) === 'screenshot' && !selected?.imageSrc && !selected?.title);
  const mixed = state.canvases.some(canvas => designKind(canvas) !== 'screenshot');
  const itemLabel = mixed ? 'design' : 'slide';
  const exportLabel = mixed ? 'Export designs' : 'Export screenshots';
  const size = selected ? resolveCanvasSize(selected, state.globalSettings) : TARGET_SIZES[DEFAULT_IPHONE_SIZE];
  const fit = Math.min((available.width - 80) / size.logicalWidth, (available.height - 80) / size.logicalHeight, 1.2);
  const width = Math.max(120, size.logicalWidth * (zoom ?? .65));
  const platform = isAndroidDevice(selected?.deviceTarget || state.globalSettings.targetSize) ? 'android' : 'ios';

  useEffect(() => { inspectorRef.current?.scrollTo({ top: 0 }); }, [selected?.id]);

  useEffect(() => {
    let mounted = true;
    void Promise.resolve(useEditorStore.persist.rehydrate()).then(() => {
      if (mounted) setHydrated(useEditorStore.persist.hasHydrated());
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setAvailable({ width, height });
      const current = useEditorStore.getState();
      const item = current.canvases.find(canvas => canvas.id === current.selectedCanvasId) || current.canvases[0];
      const target = item ? resolveCanvasSize(item, current.globalSettings) : TARGET_SIZES[DEFAULT_IPHONE_SIZE];
      // Fit once on opening. Later panel/window changes must not change the chosen scale.
      setZoom(current => current ?? Math.max(.2, Math.min((width - 80) / target.logicalWidth, (height - 80) / target.logicalHeight, 1.2)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [hydrated]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (modal || (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable=true]'))) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) useEditorStore.getState().redo(); else useEditorStore.getState().undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modal]);

  async function upload(files: File[]) {
    if (busy) return;
    setBusy(true);
    setDragging(false);
    try {
      if (!files.some(file => file.type.startsWith('image/'))) throw new Error('Choose PNG, JPEG, or WebP screenshots.');
      await processUploadedFiles(files);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Upload failed. Please try again.'); }
    finally { setBusy(false); }
  }

  async function replace(file?: File) {
    if (!file || !selected) return;
    const id = selected.id;
    const url = URL.createObjectURL(file);
    try {
      const image = new Image(); image.src = url; await image.decode();
      state.updateCanvas(id, { imageSrc: url, imageCrop: { x: 0, y: 0 }, imageZoom: 1 });
    } catch { URL.revokeObjectURL(url); toast.error('This image could not be read.'); }
  }

  function choosePlatform(value: string) {
    const target = TARGET_SIZES[value === 'ios' ? DEFAULT_IPHONE_SIZE : DEFAULT_ANDROID_SIZE];
    if (selected) state.updateCanvas(selected.id, { deviceTarget: target.id, outputSize: { width: target.width, height: target.height } });
  }

  function removeDesign(id: string) {
    state.removeCanvas(id);
    toast.success('Design deleted. Use Undo to restore it.');
    requestAnimationFrame(() => {
      const selectedId = useEditorStore.getState().selectedCanvasId;
      const target = selectedId ? document.getElementById(`select-${selectedId}`) : stageRef.current?.querySelector('button');
      target?.focus();
    });
  }

  function addDesign(kind: DesignKind) {
    state.addCanvas(newDesign(kind, state.globalSettings));
    state.selectCanvas(useEditorStore.getState().canvases.at(-1)!.id);
  }

  if (!hydrated) return <main className={styles.loading}>
    <span className={styles.wordmark}>LaunchShot<span>studio</span></span>
    <p>{saveStatus === 'error' ? 'Your saved workspace could not be opened.' : 'Opening your workspace…'}</p>
    {saveStatus === 'error' && <button className={styles.primary} onClick={async () => {
      await useEditorStore.persist.rehydrate(); setHydrated(useEditorStore.persist.hasHydrated());
    }}>Retry opening workspace</button>}
  </main>;

  return <div className={styles.workspace}
    onDragOver={event => { if (event.dataTransfer.types.includes('Files')) { event.preventDefault(); setDragging(true); } }}
    onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }}
    onDrop={event => { event.preventDefault(); void upload(Array.from(event.dataTransfer.files)); }}>
    <input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={event => { void upload(Array.from(event.target.files || [])); event.target.value = ''; }} />
    <input ref={replaceRef} aria-label="Replace slide screenshot" type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={event => { void replace(event.target.files?.[0]); event.target.value = ''; }} />
    <header className={styles.header}>
      <Link href="/" className={styles.wordmark}>LaunchShot<span>studio</span></Link>
      <div className={styles.project}>
        <button onClick={() => setModal('projects')} disabled={busy}><IoFolderOpenOutline />{project?.name || 'Untitled project'}</button>
        <span role="status" className={saveStatus === 'error' ? styles.error : styles.saveStatus}>
          {saveStatus === 'saved' && <IoCheckmarkOutline />}
          {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'error' ? 'Could not save' : 'Saved locally'}
        </span>
        {saveStatus === 'error' && <button onClick={() => void retrySave()}>Retry save</button>}
      </div>
      <div className={styles.headerActions}>
        <button aria-label="Undo" title="Undo" disabled={!state.canUndo} onClick={state.undo}><IoArrowUndoOutline /></button>
        <button aria-label="Redo" title="Redo" disabled={!state.canRedo} onClick={state.redo}><IoArrowRedoOutline /></button>
        <span className={styles.divider} />
        <button disabled={isEmpty} onClick={() => setModal('preview')}>Preview</button>
        <button className={styles.primary} disabled={isEmpty || busy} onClick={() => setModal('export')}><IoDownloadOutline />{exportLabel}</button>
      </div>
    </header>

    <main className={styles.editor}>
      <aside className={styles.filmstrip} aria-label={mixed ? "Designs" : "Slides"}>
        <div className={styles.sectionHeading}><h2>Your designs</h2><span>{state.canvases.length} items</span></div>
        <details className={styles.controlGroup}><summary>Add design</summary><div>{(['screenshot', 'banner', 'mockup'] as const).map(kind => <button key={kind} className={styles.fullButton} onClick={() => addDesign(kind)}>Add {kind}</button>)}</div></details>
        <div className={styles.thumbnails}>
          {state.canvases.map((canvas, position) => <div key={canvas.id} className={styles.thumbnailCard}><button id={`select-${canvas.id}`} className={`${styles.thumbnail} ${canvas.id === selected?.id ? styles.selected : ''}`} onClick={() => state.selectCanvas(canvas.id)} aria-label={`Select ${itemLabel} ${position + 1}`} aria-pressed={canvas.id === selected?.id}>
            <div className={styles.thumbnailImage}>
              <SlideRenderer canvas={canvas} canvases={state.canvases} settings={state.globalSettings} width={108} renderId={`thumb-${canvas.id}`} />
            </div>
            <span><b>{String(position + 1).padStart(2, '0')}</b>{canvas.title || designKind(canvas)}</span>
          </button>
          <div className={styles.thumbnailActions}>
            <button aria-label={`Duplicate design ${position + 1}`} onClick={() => state.duplicateCanvas(canvas.id)}><IoCopyOutline />Duplicate</button>
            <button aria-label={`Delete design ${position + 1}`} onClick={() => removeDesign(canvas.id)}><IoTrashOutline />Delete</button>
          </div>
          </div>)}
        </div>
        <button className={styles.addSlide} onClick={() => { state.addCanvas(selected ? { ...captureDesign(selected, state.globalSettings), outputSize: selected.outputSize, deviceTarget: selected.deviceTarget } : { layout: 'basic-top', backgroundColor: '#f2f0eb', textColor: '#0f172a' }); state.selectCanvas(useEditorStore.getState().canvases.at(-1)!.id); }}><IoAddOutline />Add blank {itemLabel}</button>
        <button className={styles.addSlide} disabled={busy} onClick={() => uploadRef.current?.click()}><IoCloudUploadOutline />{busy ? 'Reading screenshots…' : isEmpty ? 'Upload screenshots' : 'Add screenshots'}</button>
      </aside>

      <section className={styles.canvasArea}>
        <div className={styles.canvasHeading}><span>{itemLabel.toUpperCase()} {String(selected ? index + 1 : 0).padStart(2, '0')} <i>/</i> {String(state.canvases.length).padStart(2, '0')}</span><span>{selected && designKind(selected) !== 'screenshot' ? designKind(selected) : platform === 'ios' ? 'App Store' : 'Google Play'} · {size.width} × {size.height}</span></div>
        <div ref={stageRef} className={styles.stage}>
          {selected && <div className={`${styles.canvasPreview} ${isTransparent(selected) ? styles.checkerboard : ''}`} style={{ width, height: width * size.logicalHeight / size.logicalWidth }}>
            <SlideRenderer key={selected.id} canvas={selected} canvases={state.canvases} settings={state.globalSettings} width={width} renderId={`workspace-${selected.id}`} editableTextBox />
          </div>}
          {!selected && <button className={styles.primary} onClick={() => state.addCanvas({ layout: 'basic-top', backgroundColor: '#f2f0eb', textColor: '#0f172a' })}>Create a blank design</button>}
        </div>
        <div className={styles.canvasFooter}>
          <div><button aria-label={`Move ${itemLabel} earlier`} disabled={!selected || index === 0} onClick={() => state.moveCanvas(selected.id, 'left')}><IoArrowBackOutline /></button><button aria-label={`Move ${itemLabel} later`} disabled={!selected || index === state.canvases.length - 1} onClick={() => state.moveCanvas(selected.id, 'right')}><IoArrowForwardOutline /></button><span>{mixed ? "Design" : "Slide"} order</span></div>
          <div><button aria-label="Zoom out" onClick={() => setZoom(Math.max(.2, (zoom ?? .65) - .1))}>−</button><span>{Math.round((zoom ?? .65) * 100)}%</span><button aria-label="Zoom in" onClick={() => setZoom(Math.min(2, (zoom ?? .65) + .1))}>+</button><button onClick={() => setZoom(Math.max(.2, fit))}><IoExpandOutline />Fit</button></div>
        </div>
      </section>

      <aside ref={inspectorRef} className={styles.inspector} aria-label={mixed ? "Design inspector" : "Slide inspector"}>
        {selected ? <>
        <div className={styles.sectionHeading}><h2>Make it yours</h2><span>{mixed ? "Design" : "Slide"} {index + 1}</span></div>
        <WorkspacePresets canvas={selected} />
        <section><span className={styles.eyebrow}>{designKind(selected) === 'banner' ? 'THE IMAGE' : 'THE SCREENSHOT'}</span>
          <button className={styles.fullButton} onClick={() => replaceRef.current?.click()}><IoCloudUploadOutline />{designKind(selected) === 'banner' ? (selected.imageSrc ? 'Replace image' : 'Upload image') : selected?.imageSrc ? 'Replace screenshot' : 'Add missing screenshot'}</button>
          <button className={styles.fullButton} disabled={!selected.imageSrc} onClick={() => state.updateCanvas(selected.id, { imageSrc: null })}><IoCloseOutline />Clear image</button>
          <WorkspaceExtraImages canvas={selected} />
        </section>
        <CreationControls key={`creation-${selected.id}`} canvas={selected} />
        {designKind(selected) !== 'mockup' && <section><span className={styles.eyebrow}>THE MESSAGE</span>
          <label>Headline<textarea aria-label="Headline" rows={3} value={selected?.title || ''} placeholder={designKind(selected) === 'banner' ? 'Write your banner headline' : 'What can someone do with your app?'} onChange={event => state.updateCanvas(selected.id, { title: event.target.value })} /></label>
          <p className={styles.hint}>Lead with one clear benefit. Keep it easy to read.</p>
          <label>Supporting text <span>Optional</span><textarea aria-label="Supporting text" rows={2} value={selected?.subtitle || ''} placeholder="Add a little more context" onChange={event => state.updateCanvas(selected.id, { subtitle: event.target.value })} /></label>
          {designKind(selected) === 'screenshot' && selected.layout !== 'device-only' && !selected?.title.trim() && <p className={styles.notice}>Add a headline before exporting this slide.</p>}
          <WorkspaceTypography canvas={selected} />
        </section>}
        {designKind(selected) === 'screenshot' && <section><div className={styles.sectionHeading}><span className={styles.eyebrow}>THE STYLE</span><span>Applies to this design type</span></div>
          <div className={styles.styleOptions}>{STUDIO_STYLES.map(style => <button key={style.id} aria-label={`Apply ${style.name}`} aria-pressed={state.globalSettings.studioStyle === style.id} onClick={() => state.applyStudioStyle(style.id)}>
            <div style={{ background: style.background }}><SlideRenderer canvas={styleSlide(selected, style.id)} canvases={state.canvases} settings={styleSettings(state.globalSettings, style.id)} width={62} renderId={`style-${style.id}`} /></div>
            <span>{style.name}</span>
          </button>)}</div>
        </section>}
        <WorkspaceDesignControls key={selected.id} canvas={selected} onTemplates={() => setModal('templates')} onImageEdit={() => setModal('image')} />
        <section><label>App name<input value={state.globalSettings.appName || ''} placeholder="Your app name" onChange={event => state.renameProject(state.activeProjectId, event.target.value)} /></label></section>
        <section>{designKind(selected) === 'screenshot' && <label>Store destination<select value={platform} onChange={event => choosePlatform(event.target.value)}><option value="ios">Apple App Store</option><option value="android">Google Play</option></select></label>}
          <button className={styles.fullButton} onClick={() => setModal('translations')}>Languages & translations</button>
        </section>
        <div className={styles.inspectorFooter}>
          <button onClick={() => { void copyCanvasToClipboard(selected.id).then(ok => ok ? toast.success('Design copied') : toast.error('Clipboard is unavailable in this browser.')).catch(() => toast.error('Could not copy this design.')); }}><IoCopyOutline />Copy {itemLabel} image</button>
        </div>
        </> : <p className={styles.hint}>Add a design or upload screenshots to start designing.</p>}
      </aside>
    </main>

    {dragging && <div className={styles.dropOverlay}><IoCloudUploadOutline /><h2>Drop your screenshots</h2><p>We’ll keep them in order and match your style.</p></div>}
    {modal === 'export' && <ExportModal onClose={() => setModal(null)} />}
    {modal === 'projects' && <ProjectManagerModal onClose={() => setModal(null)} />}
    {modal === 'translations' && <TranslationModal onClose={() => setModal(null)} />}
    {modal === 'templates' && <TemplateGalleryModal onClose={() => setModal(null)} />}
    {modal === 'image' && selected && <ImageEditorModal canvas={selected} onClose={() => setModal(null)} />}
    {modal === 'preview' && <div className={styles.previewOverlay} role="dialog" aria-modal="true" aria-label="Listing preview" onKeyDown={event => { if (event.key === 'Escape') setModal(null); }}>
      <header><div><span className={styles.eyebrow}>{mixed ? 'DESIGN PREVIEW' : 'LISTING PREVIEW'}</span><h2>{state.globalSettings.appName || project?.name}</h2><p>{mixed ? 'Review your designs together.' : 'Review your screenshots together, at listing scale.'}</p></div><button autoFocus onClick={() => setModal(null)}><IoCloseOutline />Close preview</button></header>
      <div className={styles.previewSlides}>{state.canvases.map(canvas => <SlideRenderer key={canvas.id} canvas={canvas} canvases={state.canvases} settings={state.globalSettings} width={250} renderId={`preview-${canvas.id}`} />)}</div>
      <button className={styles.primary} onClick={() => setModal('export')}><IoDownloadOutline />{exportLabel}</button>
    </div>}
  </div>;
}
