'use client';

import { useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useEditorStore, type CanvasItem } from '@/store/useEditorStore';
import { FONT_OPTIONS } from '@/config/fonts';
import { BACKGROUND_PRESETS, DEFAULT_BACKDROP_EFFECTS } from '@/config/backgrounds';
import { DEFAULT_SHADOW } from '@/utils/shadowEngine';
import { DOODLE_PRESETS, DOODLE_TYPE_OPTIONS, DOODLE_POSITION_OPTIONS, type DoodleItem } from '@/config/doodles';
import { DEFAULT_STATUS_BAR } from '@/config/statusBar';
import { captureDesign } from '@/config/designs';
import { designKind, mediaPresentation, mediaSlotCount, resolveMediaImages, resolveCanvasSize } from '@/config/creation';
import { DESIGN_PRESETS, presetChanges } from '@/config/designPresets';
import { SlideRenderer } from './SlideRenderer';
import { LAYOUT_OPTIONS, getDefaultTextBoxWidth } from './CanvasEditor';
import { DoodleShape } from './DoodleAccent';
import styles from './StudioWorkspace.module.css';

function Group({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return <details className={styles.controlGroup} open={open || undefined}><summary>{title}</summary><div>{children}</div></details>;
}

function Range({ label, value, min, max, step = 1, unit = '', onChange }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (value: number) => void }) {
  return <label>{label}<span>{value}{unit}</span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={event => onChange(Number(event.target.value))} /></label>;
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label>{label}<span>{value}</span><input aria-label={label} type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#ffffff'} onChange={event => onChange(event.target.value)} /></label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className={styles.checkLabel}><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} />{label}</label>;
}

function AssetInput({ label, onChange }: { label: string; onChange: (url: string) => void }) {
  return <label>{label}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={async event => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    const url = URL.createObjectURL(file);
    try { const image = new Image(); image.src = url; await image.decode(); onChange(url); }
    catch { URL.revokeObjectURL(url); toast.error('This image could not be read.'); }
  }} /></label>;
}

export function WorkspacePresets({ canvas }: { canvas: CanvasItem }) {
  const state = useEditorStore();
  const presets = DESIGN_PRESETS.filter(preset => preset.kind === designKind(canvas));
  if (!presets.length) return null;
  const size = resolveCanvasSize(canvas, state.globalSettings);
  const width = Math.min(195, 145 * size.logicalWidth / size.logicalHeight);
  return <section>
    <div className={styles.sectionHeading}><h2>Start with a look</h2><span>This design only</span></div>
    <div className={styles.presetCards}>{presets.map(preset => {
      const preview = { ...canvas, ...presetChanges(preset), title: canvas.title || 'Make room for good things.', subtitle: canvas.subtitle || 'A little progress. Every day.', imageSrc: canvas.imageSrc || '/preset-screen.svg', translations: undefined };
      return <button key={preset.id} aria-label={`Apply ${preset.name}`} onClick={() => { state.updateCanvas(canvas.id, presetChanges(preset)); toast.success(`${preset.name} applied`); }}>
        <div className={styles.presetPreview} aria-hidden="true"><SlideRenderer canvas={preview} canvases={[preview]} settings={state.globalSettings} width={width} renderId={`preset-${preset.id}`} /></div>
        <span>{preset.name}</span>
      </button>;
    })}</div>
    <p className={styles.hint}>Scroll for more looks. Empty previews use sample content; your images and copy stay yours.</p>
  </section>;
}

export function WorkspaceExtraImages({ canvas }: { canvas: CanvasItem }) {
  const state = useEditorStore();
  const index = state.canvases.findIndex(item => item.id === canvas.id);
  const images = resolveMediaImages(canvas, state.canvases[index - 1], state.canvases[index + 1], state.canvases[index + 2]);
  return <>{(['secondaryImageSrc', 'tertiaryImageSrc'] as const).slice(0, Math.max(0, mediaSlotCount(canvas) - 1)).map((key, slot) => <div key={key} className={styles.extraImage}>
    <AssetInput label={slot === 0 ? 'Secondary screenshot' : 'Third screenshot'} onChange={url => state.updateCanvas(canvas.id, { [key]: url })} />
    <button className={styles.fullButton} disabled={!images[slot + 1]} onClick={() => state.updateCanvas(canvas.id, { [key]: null })}>Clear {slot === 0 ? 'secondary' : 'third'} image</button>
    <p className={styles.hint}>{canvas[key] === null ? 'Empty slot. Upload an image to fill it.' : !canvas[key] && images[slot + 1] ? 'Reusing a screenshot. Upload your own or clear this slot.' : 'Used only in this design.'}</p>
  </div>)}</>;
}

export function WorkspaceTypography({ canvas }: { canvas: CanvasItem }) {
  const state = useEditorStore();
  const update = (changes: Partial<CanvasItem>) => state.updateCanvas(canvas.id, changes);
  return <Group title="Typography" open>
    <label>Font family<select aria-label="Font family" value={canvas.fontFamily || state.globalSettings.fontFamily} onChange={event => update({ fontFamily: event.target.value })}>
      {Array.from(new Set(FONT_OPTIONS.map(font => font.category))).map(category => <optgroup key={category} label={category}>{FONT_OPTIONS.filter(font => font.category === category).map(font => <option key={font.id} value={font.id} style={{ fontFamily: font.fontFamily }}>{font.name}</option>)}</optgroup>)}
    </select></label>
    <div className={styles.controlColumns}>
      <label>Title size<input type="number" min={16} max={72} placeholder="Auto" value={canvas.titleFontSize ?? ''} onChange={event => update({ titleFontSize: event.target.value ? Math.min(72, Math.max(16, Number(event.target.value))) : undefined })} /></label>
      <label>Subtitle size<input type="number" min={11} max={36} placeholder="Auto" value={canvas.subtitleFontSize ?? ''} onChange={event => update({ subtitleFontSize: event.target.value ? Math.min(36, Math.max(11, Number(event.target.value))) : undefined })} /></label>
    </div>
    <Range label="Text box width" value={canvas.textBoxWidth ?? getDefaultTextBoxWidth(canvas.layout)} min={25} max={100} unit="%" onChange={textBoxWidth => update({ textBoxWidth })} />
    <p className={styles.hint}>Drag a side handle on the canvas to resize the text box, or a corner to scale the text too.</p>
    <p className={styles.hint}>Font sizes stay fixed. If text is cut off, widen the box, reduce the font size, or shorten the copy.</p>
    <label>Text alignment<select aria-label="Text alignment" value={canvas.textAlign || ''} onChange={event => update({ textAlign: (event.target.value || undefined) as CanvasItem['textAlign'] })}><option value="">Layout default</option>{['left', 'center', 'right'].map(value => <option key={value}>{value}</option>)}</select></label>
    <div className={styles.controlColumns}><Color label="Headline color" value={canvas.textColor} onChange={textColor => update({ textColor })} /><Color label="Subtitle color" value={canvas.subtitleColor || canvas.textColor} onChange={subtitleColor => update({ subtitleColor })} /></div>
    <Toggle label="Gradient headline" checked={!!canvas.gradientText} onChange={gradientText => update({ gradientText })} />
    <button className={styles.fullButton} onClick={() => state.applyFontToAll(canvas.fontFamily || state.globalSettings.fontFamily)}>Use this font on all slides</button>
    <button className={styles.fullButton} onClick={() => update({ textBoxWidth: undefined, titleFontSize: undefined, subtitleFontSize: undefined, textAlign: undefined })}>Reset text sizing</button>
  </Group>;
}

export function WorkspaceDesignControls({ canvas, onTemplates, onImageEdit }: { canvas: CanvasItem; onTemplates: () => void; onImageEdit: () => void }) {
  const state = useEditorStore();
  const [templateName, setTemplateName] = useState('');
  const update = (changes: Partial<CanvasItem>) => state.updateCanvas(canvas.id, changes);
  const shadow = canvas.shadow || state.globalSettings.shadow || DEFAULT_SHADOW;
  const effects = canvas.backdropEffects || state.globalSettings.backdropEffects || DEFAULT_BACKDROP_EFFECTS;
  const doodle = canvas.doodle || { enabled: false, color: '#facc15', doodles: [] };
  const statusBar = canvas.statusBar || state.globalSettings.statusBar || DEFAULT_STATUS_BAR;
  const gradient = canvas.backgroundColor.match(/^linear-gradient\((\d+)deg,\s*(#[\da-f]{6})\s*0%,\s*(#[\da-f]{6})\s*100%\)$/i);
  const setGradient = (angle: number, start: string, end: string) => update({ backgroundColor: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`, backgroundImageSrc: undefined });
  const changeDoodle = (index: number, changes: Partial<DoodleItem>) => update({ doodle: { ...doodle, doodles: doodle.doodles.map((item, position) => position === index ? { ...item, ...changes } : item) } });

  return <div className={styles.designControls}>
    <Group title="Layout & device" open={designKind(canvas) !== 'screenshot'}>
      <label>Slide layout<select aria-label="Slide layout" value={canvas.layout} onChange={event => update({ layout: event.target.value as CanvasItem['layout'] })}>{LAYOUT_OPTIONS.filter(option => designKind(canvas) === 'banner' ? ['banner-centered', 'banner-split', 'banner-stack-right', 'banner-triple-bottom', 'banner-kinetic-stack', 'og-style-1', 'og-style-2', 'og-style-3'].includes(option.value) : designKind(canvas) === 'mockup' ? ['device-only', 'duo-row', 'trio-row'].includes(option.value) : !['banner-centered', 'banner-split'].includes(option.value)).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <button className={styles.fullButton} onClick={() => state.applyLayoutToAll(canvas.layout)}>Use layout on this design type</button>
      {mediaPresentation(canvas) === 'device' && <>
      <label>Device frame<select aria-label="Device frame" value={canvas.mockupStyle || state.globalSettings.mockupStyle} onChange={event => update({ mockupStyle: event.target.value as CanvasItem['mockupStyle'] })}>{['dark', 'light', 'glass', 'clay-dark', 'clay-light'].map(value => <option key={value}>{value}</option>)}</select></label>
      <Toggle label="Show device notch" checked={state.globalSettings.showNotch} onChange={showNotch => state.updateGlobalSettings({ showNotch })} />
      </>}
      {mediaPresentation(canvas) !== 'none' && <>
      <Range label="Media scale" value={Math.round((canvas.mediaScale ?? 1) * 100)} min={25} max={150} unit="%" onChange={value => update({ mediaScale: value / 100 })} />
      <Range label="Horizontal position" value={canvas.mediaOffset?.x ?? 0} min={-50} max={50} unit="%" onChange={x => update({ mediaOffset: { x, y: canvas.mediaOffset?.y ?? 0 } })} />
      <Range label="Vertical position" value={canvas.mediaOffset?.y ?? 0} min={-50} max={50} unit="%" onChange={y => update({ mediaOffset: { x: canvas.mediaOffset?.x ?? 0, y } })} />
      <Range label="Device rotation" value={canvas.rotationAngle || 0} min={-180} max={180} unit="°" onChange={rotationAngle => update({ rotationAngle, mediaScale: canvas.mediaScale ?? 1 })} />
      {mediaPresentation(canvas) === 'device' && <Range label="Device yaw" value={canvas.yawAngle ?? 0} min={-60} max={60} unit="°" onChange={yawAngle => update({ yawAngle })} />}
      <div className={styles.row}><button onClick={() => update({ mediaOffset: { x: 0, y: 0 } })}>Center media</button><button onClick={() => update({ mediaScale: 1, mediaOffset: { x: 0, y: 0 }, rotationAngle: 0, yawAngle: 0 })}>Reset placement</button></div>
      <label>Screenshot fit<select aria-label="Screenshot fit" value={canvas.imageFit || state.globalSettings.imageFit} onChange={event => update({ imageFit: event.target.value as 'cover' | 'contain' })}><option value="contain">Show entire screenshot</option><option value="cover">Fill device screen</option></select></label>
      <button className={styles.fullButton} disabled={!canvas.imageSrc} onClick={onImageEdit}>Crop & image filters</button>
      </>}
      <AssetInput label="App icon" onChange={appIconSrc => update({ appIconSrc })} />
      {canvas.appIconSrc && <button className={styles.fullButton} onClick={() => update({ appIconSrc: undefined })}>Remove app icon</button>}
    </Group>

    <Group title="Background & colors" open={designKind(canvas) !== 'screenshot'}>
      <label>Background preset<select aria-label="Background preset" value="" onChange={event => { const preset = BACKGROUND_PRESETS.find(item => item.id === event.target.value); if (preset) update({ backgroundColor: preset.value, backgroundImageSrc: undefined, textColor: preset.textColor || canvas.textColor }); }}><option value="" disabled>Choose a background</option>{BACKGROUND_PRESETS.map(preset => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select></label>
      <Color label="Solid background" value={canvas.backgroundColor} onChange={backgroundColor => update({ backgroundColor, backgroundImageSrc: undefined })} />
      <div className={styles.controlColumns}>
        <Color label="Gradient start" value={gradient?.[2] || '#286348'} onChange={color => setGradient(Number(gradient?.[1] || 135), color, gradient?.[3] || '#dff1e8')} />
        <Color label="Gradient end" value={gradient?.[3] || '#dff1e8'} onChange={color => setGradient(Number(gradient?.[1] || 135), gradient?.[2] || '#286348', color)} />
      </div>
      <Range label="Gradient angle" value={Number(gradient?.[1] || 135)} min={0} max={360} unit="°" onChange={angle => setGradient(angle, gradient?.[2] || '#286348', gradient?.[3] || '#dff1e8')} />
      <AssetInput label="Background image" onChange={backgroundImageSrc => update({ backgroundImageSrc })} />
      {canvas.backgroundImageSrc && <button className={styles.fullButton} onClick={() => update({ backgroundImageSrc: undefined })}>Remove background image</button>}
      {(['overlay', 'effects', 'pattern', 'vignette'] as const).map(key => <Toggle key={key} label={{ overlay: 'Soft overlay', effects: 'Ambient glow', pattern: 'Dot pattern', vignette: 'Vignette' }[key]} checked={effects[key]} onChange={value => update({ backdropEffects: { ...effects, [key]: value } })} />)}
    </Group>

    {mediaPresentation(canvas) === 'device' && <Group title="Shadows & lighting" open={designKind(canvas) !== 'screenshot'}>
      <label>Shadow style<select aria-label="Shadow style" value={shadow.style} onChange={event => update({ shadow: { ...shadow, style: event.target.value as typeof shadow.style } })}><option value="none">None</option><option value="spread">Soft spread</option><option value="hug">Close contact</option></select></label>
      <label>Shadow intensity<select aria-label="Shadow intensity" value={shadow.intensity} onChange={event => update({ shadow: { ...shadow, intensity: event.target.value as typeof shadow.intensity } })}>{['low', 'medium', 'high'].map(value => <option key={value}>{value}</option>)}</select></label>
      <p className={styles.hint}>Choose where the light comes from.</p>
      <div className={styles.lightGrid} aria-label="Light source">{Array.from({ length: 25 }, (_, index) => { const row = Math.floor(index / 5), col = index % 5; return <button key={index} aria-label={`Light row ${row + 1} column ${col + 1}`} aria-pressed={shadow.lightSource[0] === row && shadow.lightSource[1] === col} onClick={() => update({ shadow: { ...shadow, lightSource: [row, col] } })}><span /></button>; })}</div>
    </Group>}

    <Group title="Doodles">
      <Toggle label="Show doodles" checked={doodle.enabled} onChange={enabled => update({ doodle: { ...doodle, enabled, doodles: doodle.doodles.length ? doodle.doodles : DOODLE_PRESETS[0].config.doodles } })} />
      <label>Doodle preset<select aria-label="Doodle preset" value="" onChange={event => { const preset = DOODLE_PRESETS.find(item => item.id === event.target.value); if (preset) update({ doodle: structuredClone(preset.config) }); }}><option value="" disabled>Choose a doodle set</option>{DOODLE_PRESETS.map(preset => <option key={preset.id} value={preset.id}>{preset.label}</option>)}</select></label>
      <Color label="Doodle color" value={doodle.color || '#facc15'} onChange={color => update({ doodle: { ...doodle, color, doodles: doodle.doodles.map(item => ({ ...item, color })) } })} />
      {doodle.doodles.map((item, index) => <div className={styles.elementCard} key={index}>
        <div className={styles.sectionHeading}><span>Doodle {index + 1}</span><DoodleShape type={item.type} color={item.color || doodle.color || '#facc15'} /></div>
        <label>Shape {index + 1}<select value={item.type} onChange={event => changeDoodle(index, { type: event.target.value as DoodleItem['type'] })}>{DOODLE_TYPE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <label>Position {index + 1}<select value={item.position} onChange={event => changeDoodle(index, { position: event.target.value as DoodleItem['position'] })}>{DOODLE_POSITION_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <Range label={`Doodle ${index + 1} size`} value={item.size ?? 1} min={0.3} max={3} step={0.1} onChange={size => changeDoodle(index, { size })} />
        <Range label={`Doodle ${index + 1} rotation`} value={item.rotation || 0} min={-180} max={180} unit="°" onChange={rotation => changeDoodle(index, { rotation })} />
        <Range label={`Doodle ${index + 1} horizontal offset`} value={item.offsetX || 0} min={-200} max={200} onChange={offsetX => changeDoodle(index, { offsetX })} />
        <Range label={`Doodle ${index + 1} vertical offset`} value={item.offsetY || 0} min={-200} max={200} onChange={offsetY => changeDoodle(index, { offsetY })} />
        <button className={styles.fullButton} onClick={() => update({ doodle: { ...doodle, doodles: doodle.doodles.filter((_, position) => position !== index) } })}>Remove doodle {index + 1}</button>
      </div>)}
      <button className={styles.fullButton} onClick={() => update({ doodle: { ...doodle, enabled: true, doodles: [...doodle.doodles, { type: 'star', position: 'top-right' }] } })}>Add doodle</button>
      <button className={styles.fullButton} onClick={() => state.applyDoodlesToAll(doodle)}>Use doodles on all slides</button>
    </Group>


    <Group title="Status bar">
      <Toggle label="Replace screenshot status bar" checked={statusBar.enabled} onChange={enabled => update({ statusBar: { ...statusBar, enabled } })} />
      <label>Status bar time<input value={statusBar.time} onChange={event => update({ statusBar: { ...statusBar, time: event.target.value } })} /></label>
      <label>Status bar theme<select aria-label="Status bar theme" value={statusBar.theme} onChange={event => update({ statusBar: { ...statusBar, theme: event.target.value as typeof statusBar.theme } })}>{['auto', 'light', 'dark'].map(value => <option key={value}>{value}</option>)}</select></label>
      <Range label="Battery level" value={statusBar.batteryLevel} min={0} max={100} unit="%" onChange={batteryLevel => update({ statusBar: { ...statusBar, batteryLevel } })} />
      <Toggle label="Show Wi-Fi" checked={statusBar.showWifi} onChange={showWifi => update({ statusBar: { ...statusBar, showWifi } })} />
      <Toggle label="Show cellular signal" checked={statusBar.showCellular} onChange={showCellular => update({ statusBar: { ...statusBar, showCellular } })} />
    </Group>


    <Group title="Reusable templates">
      {designKind(canvas) === 'screenshot' && <button className={styles.fullButton} onClick={onTemplates}>Browse template gallery</button>}
      <label>Template name<input value={templateName} placeholder="My launch style" onChange={event => setTemplateName(event.target.value)} /></label>
      <p className={styles.hint}>Save this slide’s layout, colors, typography, shadows, decorations, background image, and app icon. Each slide keeps its screenshots and copy.</p>
      <button className={styles.fullButton} disabled={!templateName.trim()} onClick={() => { state.saveDesign(templateName, canvas.id); setTemplateName(''); toast.success('Template saved'); }}>Save as template</button>
      {state.savedDesigns.filter(template => (template.design.kind || 'screenshot') === designKind(canvas)).map(template => <div className={styles.savedTemplate} key={template.id}><button onClick={() => state.applySlideDesign(template.design, canvas.id)}>Apply {template.name}</button><button aria-label={`Delete template ${template.name}`} onClick={() => state.removeDesign(template.id)}>Delete</button></div>)}
      <button className={styles.fullButton} onClick={() => { state.applySlideDesign(captureDesign(canvas, state.globalSettings)); toast.success('Design applied to all slides'); }}>Apply design to this design type</button>
    </Group>
  </div>;
}
