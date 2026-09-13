'use client';

import { useState } from 'react';
import { useEditorStore, type CanvasItem } from '@/store/useEditorStore';
import { BANNER_SIZES, designKind, mediaPresentation, resolveCanvasSize, resolveDeviceTarget, validOutputSize } from '@/config/creation';
import { TARGET_SIZES } from '@/config/sizes';
import styles from './StudioWorkspace.module.css';

export function CreationControls({ canvas }: { canvas: CanvasItem }) {
  const state = useEditorStore();
  const size = resolveCanvasSize(canvas, state.globalSettings);
  const kind = designKind(canvas);
  const [error, setError] = useState('');
  const update = (changes: Partial<CanvasItem>) => state.updateCanvas(canvas.id, changes);
  return <section>
    <span className={styles.eyebrow}>{kind} settings</span>
    <label>Canvas size<select aria-label="Canvas size" value={`${size.width}x${size.height}`} onChange={event => {
      const [width, height] = event.target.value.split('x').map(Number);
      update({ outputSize: { width, height } });
    }}>
      <option value={`${size.width}x${size.height}`}>{size.width} × {size.height}</option>
      {(kind === 'screenshot' ? Object.values(TARGET_SIZES) : BANNER_SIZES).filter(preset => preset.width !== size.width || preset.height !== size.height).map(preset => <option key={preset.name} value={`${preset.width}x${preset.height}`}>{preset.name} · {preset.width} × {preset.height}</option>)}
    </select></label>
    <form key={`${canvas.id}-${size.width}-${size.height}`} onSubmit={event => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const outputSize = { width: Number(data.get('width')), height: Number(data.get('height')) };
      if (!validOutputSize(outputSize)) { setError('Use whole pixels from 64 to 4096.'); return; }
      setError(''); update({ outputSize });
    }}>
      <div className={styles.controlColumns}>
        <label>Width (px)<input name="width" type="number" min="64" max="4096" step="1" required defaultValue={size.width} /></label>
        <label>Height (px)<input name="height" type="number" min="64" max="4096" step="1" required defaultValue={size.height} /></label>
      </div>
      <button className={styles.fullButton} type="submit">Apply dimensions</button>
      {error && <p role="alert">{error}</p>}
    </form>
    {kind === 'banner' && <label>Banner media<select aria-label="Banner media" value={mediaPresentation(canvas)} onChange={event => update({ mediaPresentation: event.target.value as CanvasItem['mediaPresentation'] })}><option value="none">Text and background</option><option value="image">Unframed image</option><option value="device">Device mockup</option></select></label>}
    {mediaPresentation(canvas) === 'device' && <label>Device model<select aria-label="Device model" value={resolveDeviceTarget(canvas, state.globalSettings)} onChange={event => update({ deviceTarget: event.target.value as CanvasItem['deviceTarget'] })}>{Object.values(TARGET_SIZES).filter(target => target.category !== 'Header').map(target => <option key={target.id} value={target.id}>{target.name}</option>)}</select></label>}
    {kind === 'mockup' && <label className={styles.checkLabel}><input type="checkbox" checked={!!canvas.transparentBackground} onChange={event => update({ transparentBackground: event.target.checked })} />Transparent background</label>}
  </section>;
}
