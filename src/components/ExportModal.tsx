'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { IoCloseOutline, IoDownloadOutline } from 'react-icons/io5';
import { useEditorStore } from '@/store/useEditorStore';
import { TARGET_SIZES, isAndroidDevice, type TargetSizeId } from '@/config/sizes';
import { SUPPORTED_LANGUAGES } from '@/config/languages';
import { designKind } from '@/config/creation';
import { exportImages, slideExportIssue, type ExportResult } from '@/utils/export';
import styles from './StudioWorkspace.module.css';

const PRESETS: { id: TargetSizeId; label: string; store: 'ios' | 'android' }[] = [
  { id: 'ios-iphone-17-pro-max', label: 'App Store · iPhone 6.9-inch', store: 'ios' },
  { id: 'ios-6.5', label: 'App Store · iPhone 6.5-inch', store: 'ios' },
  { id: 'ipad-12.9', label: 'App Store · iPad', store: 'ios' },
  { id: 'android-tall', label: 'Google Play · Phone portrait', store: 'android' },
  { id: 'android-tablet-10', label: 'Google Play · Tablet', store: 'android' },
  { id: 'play-feature-graphic', label: 'Google Play · Feature graphic', store: 'android' },
];

export function ExportModal({ onClose }: { onClose: () => void }) {
  const { canvases, globalSettings } = useEditorStore();
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['original']);
  const [selectedLanguages, setSelectedLanguages] = useState([globalSettings.activeLanguage || 'en']);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ExportResult | null>(null);
  const [error, setError] = useState('');
  const currentLanguage = globalSettings.activeLanguage || 'en';
  const issues = selectedLanguages.flatMap(language => canvases.flatMap((canvas, index) => {
    const message = selectedSizes.includes('original') || designKind(canvas) === 'screenshot' ? slideExportIssue(canvas, language, currentLanguage) : undefined;
    return message ? [`Slide ${index + 1} (${language}): ${message}`] : [];
  }));
  const platform = isAndroidDevice(globalSettings.targetSize) ? 'android' : 'ios';
  const visible = PRESETS.filter(preset => preset.store === platform);
  const availableLanguages = SUPPORTED_LANGUAGES.filter(language => language.code === currentLanguage || canvases.some(canvas => canvas.translations?.[language.code]));
  const screenshotCount = canvases.filter(canvas => designKind(canvas) === 'screenshot').length;
  const count = selectedLanguages.length * selectedSizes.reduce((sum, size) => sum + (size === 'original' ? canvases.length : screenshotCount), 0);
  const label = screenshotCount === canvases.length ? 'Export screenshots' : 'Export designs';

  async function runExport() {
    setBusy(true); setResult(null); setError('');
    try { setResult(await exportImages(canvases, selectedSizes, selectedLanguages, setProgress)); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Export failed. Please retry.'); }
    finally { setBusy(false); }
  }

  return createPortal(<div className={`${styles.workspace} ${globalSettings.theme === 'dark' ? styles.dark : ''} ${styles.dialogBackdrop}`} role="presentation">
    <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={label} onKeyDown={event => { if (event.key === 'Escape' && !busy) onClose(); }}>
      <header><div><span className={styles.eyebrow}>READY FOR YOUR LISTING</span><h2>{label}</h2></div><button autoFocus aria-label="Close export" disabled={busy} onClick={onClose}><IoCloseOutline /></button></header>
      <p>Full-resolution PNGs, organized by language and destination.</p>
      {busy ? <div className={styles.exportProgress}><strong>Rendering screenshots… {progress}%</strong><progress value={progress} max={100} /><p>Your workspace stays unchanged while we export.</p></div> : <>
        <label className={styles.checkLabel}><input type="checkbox" checked={selectedSizes.includes('original')} onChange={event => setSelectedSizes(previous => event.target.checked ? ['original', ...previous] : previous.filter(size => size !== 'original'))} />Each design at its own size</label>
        {screenshotCount > 0 && <><p>Additional store sizes apply to screenshot designs only.</p>
        <fieldset><legend>Store destination</legend>{visible.map(preset => <label className={styles.checkLabel} key={preset.id}>
          <input type="checkbox" checked={selectedSizes.includes(preset.id)} onChange={() => setSelectedSizes(previous => previous.includes(preset.id) ? previous.filter(id => id !== preset.id) : [...previous, preset.id])} />
          <span>{preset.label}<small>{TARGET_SIZES[preset.id].width} × {TARGET_SIZES[preset.id].height}</small></span>
        </label>)}</fieldset>
        <details><summary>Additional sizes and devices</summary><div className={styles.extraSizes}>{Object.values(TARGET_SIZES).filter(size => !visible.some(preset => preset.id === size.id)).map(size => <label className={styles.checkLabel} key={size.id}><input type="checkbox" checked={selectedSizes.includes(size.id)} onChange={() => setSelectedSizes(previous => previous.includes(size.id) ? previous.filter(id => id !== size.id) : [...previous, size.id])} /><span>{size.name}<small>{size.width} × {size.height}</small></span></label>)}</div></details></>}
        <fieldset><legend>Language</legend><div className={styles.languageOptions}>{availableLanguages.map(language => <label className={styles.checkLabel} key={language.code}><input type="checkbox" checked={selectedLanguages.includes(language.code)} onChange={() => setSelectedLanguages(previous => previous.includes(language.code) ? previous.filter(code => code !== language.code) : [...previous, language.code])} /><span>{language.name}</span></label>)}</div></fieldset>
        {issues.length > 0 && <div className={styles.notice} role="alert"><strong>A few things need your attention</strong><ul>{issues.slice(0,8).map(issue => <li key={issue}>{issue}</li>)}</ul></div>}
        {(error || result?.failures.length) ? <div className={styles.notice} role="alert"><strong>{error || `${result?.exported} PNGs exported; ${result?.failures.length} failed.`}</strong><ul>{result?.failures.map((failure, index) => <li key={index}>Slide {failure.slide} · {failure.language} · {failure.size}: {failure.message}</li>)}</ul><p>Retry export after correcting the issue. Successful images are included in the ZIP.</p></div> : result && <p role="status">{result.exported} PNGs exported successfully.</p>}
        <footer><button onClick={onClose}>{result && !result.failures.length ? 'Done' : 'Back to editing'}</button><button className={styles.primary} disabled={!count || issues.length > 0} onClick={() => void runExport()}><IoDownloadOutline />{error || result?.failures.length ? 'Retry export' : `Export ${count} PNG${count === 1 ? '' : 's'}`}</button></footer>
      </>}
    </div>
  </div>, document.body);
}
