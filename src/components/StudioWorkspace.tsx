'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import { IoArrowBackOutline, IoArrowForwardOutline, IoArrowRedoOutline, IoArrowUndoOutline, IoCheckmarkOutline, IoCloudUploadOutline, IoCopyOutline, IoDownloadOutline, IoExpandOutline, IoFolderOpenOutline, IoOptionsOutline, IoAddOutline, IoTrashOutline, IoCloseOutline } from 'react-icons/io5';
import { useEditorStore } from '@/store/useEditorStore';
import { STUDIO_STYLES, styleSlide, styleSettings } from '@/config/styles';
import { TARGET_SIZES, DEFAULT_IPHONE_SIZE, DEFAULT_ANDROID_SIZE, isAndroidDevice } from '@/config/sizes';
import { processUploadedFiles } from '@/utils/imageProcessor';
import { getSaveStatus, subscribeSaveStatus, retrySave } from '@/utils/projectStorage';
import { copyCanvasToClipboard } from '@/utils/export';
import { SlideRenderer } from './SlideRenderer';
import styles from './StudioWorkspace.module.css';

const AdvancedWorkspace = dynamic(() => import('./AdvancedWorkspace'));
const ExportModal = dynamic(() => import('./ExportModal').then(module => module.ExportModal));
const ProjectManagerModal = dynamic(() => import('./ProjectManagerModal').then(module => module.ProjectManagerModal));
const TranslationModal = dynamic(() => import('./TranslationModal').then(module => module.TranslationModal));

export function StudioWorkspace() {
  const state = useEditorStore();
  const saveStatus = useSyncExternalStore(subscribeSaveStatus, getSaveStatus, () => 'loading');
  const [hydrated, setHydrated] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [modal, setModal] = useState<'export' | 'projects' | 'translations' | 'preview' | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const [available, setAvailable] = useState({ width: 600, height: 650 });
  const uploadRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const selected = state.canvases.find(canvas => canvas.id === state.selectedCanvasId) || state.canvases[0];
  const index = selected ? state.canvases.indexOf(selected) : 0;
  const project = state.projects.find(item => item.id === state.activeProjectId);
  const isEmpty = state.canvases.length === 0 || (state.canvases.length === 1 && !selected?.imageSrc && !selected?.title);
  const size = TARGET_SIZES[state.globalSettings.targetSize] || TARGET_SIZES[DEFAULT_IPHONE_SIZE];
  const fit = Math.min((available.width - 80) / size.logicalWidth, (available.height - 80) / size.logicalHeight, 1.2);
  const width = Math.max(120, size.logicalWidth * (zoom || fit));
  const platform = isAndroidDevice(state.globalSettings.targetSize) ? 'android' : 'ios';

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
    const observer = new ResizeObserver(([entry]) => setAvailable({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(element);
    return () => observer.disconnect();
  }, [hydrated, isEmpty, advanced]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (modal || advanced || (event.target instanceof HTMLElement && event.target.closest('input, textarea, [contenteditable=true]'))) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) useEditorStore.getState().redo(); else useEditorStore.getState().undo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [modal, advanced]);

  async function upload(files: File[]) {
    if (busy) return;
    setBusy(true);
    setDragging(false);
    try {
      if (!files.some(file => file.type.startsWith('image/'))) throw new Error('Choose PNG, JPEG, or WebP screenshots.');
      await processUploadedFiles(files);
      setZoom(null);
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
    state.updateGlobalSettings({ targetSize: value === 'ios' ? DEFAULT_IPHONE_SIZE : DEFAULT_ANDROID_SIZE });
    setZoom(null);
  }

  if (!hydrated) return <main className={styles.loading}>
    <span className={styles.wordmark}>LaunchShot<span>studio</span></span>
    <p>{saveStatus === 'error' ? 'Your saved workspace could not be opened.' : 'Opening your workspace…'}</p>
    {saveStatus === 'error' && <button className={styles.primary} onClick={async () => {
      await useEditorStore.persist.rehydrate(); setHydrated(useEditorStore.persist.hasHydrated());
    }}>Retry opening workspace</button>}
  </main>;

  if (advanced) return <AdvancedWorkspace onClose={() => setAdvanced(false)} />;

  return <div className={styles.workspace}
    onDragOver={event => { if (event.dataTransfer.types.includes('Files')) { event.preventDefault(); setDragging(true); } }}
    onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDragging(false); }}
    onDrop={event => { event.preventDefault(); void upload(Array.from(event.dataTransfer.files)); }}>
    <input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp" multiple hidden onChange={event => { void upload(Array.from(event.target.files || [])); event.target.value = ''; }} />
    <input ref={replaceRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={event => { void replace(event.target.files?.[0]); event.target.value = ''; }} />
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
        <button className={styles.primary} disabled={isEmpty || busy} onClick={() => setModal('export')}><IoDownloadOutline />Export screenshots</button>
      </div>
    </header>

    {isEmpty ? <main className={styles.welcome}>
      <div className={styles.welcomeCopy}>
        <span className={styles.eyebrow}>YOUR NEXT LAUNCH STARTS HERE</span>
        <h1>Your app.<br />Ready for its close-up.</h1>
        <p>Turn your screenshots into a polished store listing.<br />One consistent style. A few good headlines. Ready to export.</p>
        <div className={styles.steps}><span><b>01</b> Upload</span><span><b>02</b> Style & edit</span><span><b>03</b> Export</span></div>
      </div>
      <div className={styles.uploadCard}>
        <div className={styles.uploadIcon}><IoCloudUploadOutline /></div>
        <h2>Start with your screenshots</h2>
        <p>Drop them here, in the order you want to tell your story.</p>
        <label>App name <span>Optional</span><input value={state.globalSettings.appName || ''} placeholder="Your app name" onChange={event => state.renameProject(state.activeProjectId, event.target.value)} /></label>
        <label>Store destination<select value={platform} onChange={event => choosePlatform(event.target.value)}><option value="ios">Apple App Store</option><option value="android">Google Play</option></select></label>
        <button className={styles.primary} disabled={busy} onClick={() => uploadRef.current?.click()}><IoAddOutline />{busy ? 'Reading screenshots…' : 'Upload screenshots'}</button>
        <small>PNG, JPEG, or WebP · Saved in this browser</small>
      </div>
      <div className={styles.welcomeFooter}><span>Designed for the way indie developers launch.</span><button onClick={() => setModal('projects')}>Open an existing project <IoArrowForwardOutline /></button></div>
    </main> : <main className={styles.editor}>
      <aside className={styles.filmstrip} aria-label="Slides">
        <div className={styles.sectionHeading}><h2>Your story</h2><span>{state.canvases.length} slides</span></div>
        <div className={styles.thumbnails}>
          {state.canvases.map((canvas, position) => <button key={canvas.id} className={`${styles.thumbnail} ${canvas.id === selected?.id ? styles.selected : ''}`} onClick={() => state.selectCanvas(canvas.id)} aria-label={`Select slide ${position + 1}`} aria-pressed={canvas.id === selected?.id}>
            <div className={styles.thumbnailImage}>
              <SlideRenderer canvas={canvas} canvases={state.canvases} settings={state.globalSettings} width={108} renderId={`thumb-${canvas.id}`} />
            </div>
            <span><b>{String(position + 1).padStart(2, '0')}</b>{canvas.title || 'Add a headline'}</span>
          </button>)}
        </div>
        <button className={styles.addSlide} disabled={busy} onClick={() => uploadRef.current?.click()}><IoAddOutline />Add screenshots</button>
      </aside>

      <section className={styles.canvasArea}>
        <div className={styles.canvasHeading}><span>SLIDE {String(index + 1).padStart(2, '0')} <i>/</i> {String(state.canvases.length).padStart(2, '0')}</span><span>{platform === 'ios' ? 'App Store' : 'Google Play'} · {size.width} × {size.height}</span></div>
        <div ref={stageRef} className={styles.stage}>
          {selected && <div className={styles.canvasPreview} style={{ width, height: width * size.logicalHeight / size.logicalWidth }}>
            <SlideRenderer canvas={selected} canvases={state.canvases} settings={state.globalSettings} width={width} renderId={`workspace-${selected.id}`} />
          </div>}
        </div>
        <div className={styles.canvasFooter}>
          <div><button aria-label="Move slide earlier" disabled={index === 0} onClick={() => state.moveCanvas(selected.id, 'left')}><IoArrowBackOutline /></button><button aria-label="Move slide later" disabled={index === state.canvases.length - 1} onClick={() => state.moveCanvas(selected.id, 'right')}><IoArrowForwardOutline /></button><span>Slide order</span></div>
          <div><button aria-label="Zoom out" onClick={() => setZoom(Math.max(.2, (zoom || fit) - .1))}>−</button><span>{Math.round((zoom || fit) * 100)}%</span><button aria-label="Zoom in" onClick={() => setZoom(Math.min(2, (zoom || fit) + .1))}>+</button><button onClick={() => setZoom(null)}><IoExpandOutline />Fit</button></div>
        </div>
      </section>

      <aside className={styles.inspector} aria-label="Slide inspector">
        <div className={styles.sectionHeading}><h2>Make it yours</h2><span>Slide {index + 1}</span></div>
        <section><span className={styles.eyebrow}>THE MESSAGE</span>
          <label>Headline<textarea aria-label="Headline" rows={3} value={selected?.title || ''} placeholder="What can someone do with your app?" onChange={event => state.updateCanvas(selected.id, { title: event.target.value })} /></label>
          <p className={styles.hint}>Lead with one clear benefit. Keep it easy to read.</p>
          <label>Supporting text <span>Optional</span><textarea aria-label="Supporting text" rows={2} value={selected?.subtitle || ''} placeholder="Add a little more context" onChange={event => state.updateCanvas(selected.id, { subtitle: event.target.value })} /></label>
          {!selected?.title.trim() && <p className={styles.notice}>Add a headline before exporting this slide.</p>}
        </section>
        <section><span className={styles.eyebrow}>THE SCREENSHOT</span>
          <button className={styles.fullButton} onClick={() => replaceRef.current?.click()}><IoCloudUploadOutline />{selected?.imageSrc ? 'Replace screenshot' : 'Add missing screenshot'}</button>
          <div className={styles.row}>
            <button onClick={() => state.duplicateCanvas(selected.id)}><IoCopyOutline />Duplicate</button>
            <button onClick={() => state.removeCanvas(selected.id)}><IoTrashOutline />Remove</button>
          </div>
        </section>
        <section><div className={styles.sectionHeading}><span className={styles.eyebrow}>THE STYLE</span><span>Applies to all slides</span></div>
          <div className={styles.styleOptions}>{STUDIO_STYLES.map(style => <button key={style.id} aria-label={`Apply ${style.name}`} aria-pressed={state.globalSettings.studioStyle === style.id} onClick={() => state.applyStudioStyle(style.id)}>
            <div style={{ background: style.background }}><SlideRenderer canvas={styleSlide(selected, style.id)} canvases={state.canvases} settings={styleSettings(state.globalSettings, style.id)} width={62} renderId={`style-${style.id}`} /></div>
            <span>{style.name}</span>
          </button>)}</div>
        </section>
        <section><label>Store destination<select value={platform} onChange={event => choosePlatform(event.target.value)}><option value="ios">Apple App Store</option><option value="android">Google Play</option></select></label>
          <button className={styles.fullButton} onClick={() => setModal('translations')}>Languages & translations</button>
        </section>
        <div className={styles.inspectorFooter}>
          <button onClick={() => { void copyCanvasToClipboard(selected.id).then(ok => ok ? toast.success('Slide copied') : toast.error('Clipboard is unavailable in this browser.')).catch(() => toast.error('Could not copy this slide.')); }}><IoCopyOutline />Copy slide image</button>
          <button onClick={() => setAdvanced(true)}><IoOptionsOutline />Advanced tools</button>
        </div>
      </aside>
    </main>}

    {dragging && <div className={styles.dropOverlay}><IoCloudUploadOutline /><h2>Drop your screenshots</h2><p>We’ll keep them in order and match your style.</p></div>}
    {modal === 'export' && <ExportModal onClose={() => setModal(null)} />}
    {modal === 'projects' && <ProjectManagerModal onClose={() => setModal(null)} />}
    {modal === 'translations' && <TranslationModal onClose={() => setModal(null)} />}
    {modal === 'preview' && <div className={styles.previewOverlay} role="dialog" aria-modal="true" aria-label="Listing preview" onKeyDown={event => { if (event.key === 'Escape') setModal(null); }}>
      <header><div><span className={styles.eyebrow}>LISTING PREVIEW</span><h2>{state.globalSettings.appName || project?.name}</h2><p>Review your screenshots together, at listing scale.</p></div><button autoFocus onClick={() => setModal(null)}><IoCloseOutline />Close preview</button></header>
      <div className={styles.previewSlides}>{state.canvases.map(canvas => <SlideRenderer key={canvas.id} canvas={canvas} canvases={state.canvases} settings={state.globalSettings} width={250} renderId={`preview-${canvas.id}`} />)}</div>
      <button className={styles.primary} onClick={() => setModal('export')}><IoDownloadOutline />Export screenshots</button>
    </div>}
  </div>;
}
