'use client';

import { useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useEditorStore, type CanvasItem } from '@/store/useEditorStore';
import { FONT_OPTIONS } from '@/config/fonts';
import { BACKGROUND_PRESETS, DEFAULT_BACKDROP_EFFECTS } from '@/config/backgrounds';
import { DEFAULT_SHADOW } from '@/utils/shadowEngine';
import { DOODLE_PRESETS, DOODLE_TYPE_OPTIONS, DOODLE_POSITION_OPTIONS, type DoodleItem } from '@/config/doodles';
import { BADGE_PRESETS, BADGE_POSITION_OPTIONS, type BadgeConfig } from '@/config/badges';
import { FLOATING_CARD_PRESETS, CALLOUT_PIN_PRESETS } from '@/config/floatingCards';
import { DEFAULT_STATUS_BAR } from '@/config/statusBar';
import { PANORAMA_PRESETS } from '@/config/panoramas';
import { captureDesign } from '@/config/designs';
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
  const badge = canvas.badge || BADGE_PRESETS[0].config;
  const statusBar = canvas.statusBar || state.globalSettings.statusBar || DEFAULT_STATUS_BAR;
  const gradient = canvas.backgroundColor.match(/^linear-gradient\((\d+)deg,\s*(#[\da-f]{6})\s*0%,\s*(#[\da-f]{6})\s*100%\)$/i);
  const setGradient = (angle: number, start: string, end: string) => update({ backgroundColor: `linear-gradient(${angle}deg, ${start} 0%, ${end} 100%)`, backgroundImageSrc: undefined });
  const changeDoodle = (index: number, changes: Partial<DoodleItem>) => update({ doodle: { ...doodle, doodles: doodle.doodles.map((item, position) => position === index ? { ...item, ...changes } : item) } });
  const changeBadge = (changes: Partial<BadgeConfig>) => update({ badge: { ...badge, ...changes } });

  return <div className={styles.designControls}>
    <Group title="Layout & device">
      <label>Slide layout<select aria-label="Slide layout" value={canvas.layout} onChange={event => update({ layout: event.target.value as CanvasItem['layout'] })}>{LAYOUT_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <button className={styles.fullButton} onClick={() => state.applyLayoutToAll(canvas.layout)}>Use layout on all slides</button>
      <label>Device frame <span>All slides</span><select value={state.globalSettings.mockupStyle} onChange={event => state.updateGlobalSettings({ mockupStyle: event.target.value as typeof state.globalSettings.mockupStyle })}>{['dark', 'light', 'glass', 'clay-dark', 'clay-light'].map(value => <option key={value}>{value}</option>)}</select></label>
      <Toggle label="Show device notch" checked={state.globalSettings.showNotch} onChange={showNotch => state.updateGlobalSettings({ showNotch })} />
      <Range label="Device rotation" value={canvas.rotationAngle || 0} min={-180} max={180} unit="°" onChange={rotationAngle => update({ rotationAngle })} />
      <label>Screenshot fit<select aria-label="Screenshot fit" value={canvas.imageFit || state.globalSettings.imageFit} onChange={event => update({ imageFit: event.target.value as 'cover' | 'contain' })}><option value="contain">Show entire screenshot</option><option value="cover">Fill device screen</option></select></label>
      <button className={styles.fullButton} disabled={!canvas.imageSrc} onClick={onImageEdit}>Crop & image filters</button>
      <AssetInput label="Secondary screenshot" onChange={secondaryImageSrc => update({ secondaryImageSrc })} />
      <AssetInput label="Third screenshot" onChange={tertiaryImageSrc => update({ tertiaryImageSrc })} />
      <p className={styles.hint}>Extra screenshots appear in layouts with multiple devices.</p>
      <AssetInput label="App icon" onChange={appIconSrc => update({ appIconSrc })} />
      {canvas.appIconSrc && <button className={styles.fullButton} onClick={() => update({ appIconSrc: undefined })}>Remove app icon</button>}
    </Group>

    <Group title="Background & colors">
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

    <Group title="Shadows & lighting">
      <label>Shadow style<select aria-label="Shadow style" value={shadow.style} onChange={event => update({ shadow: { ...shadow, style: event.target.value as typeof shadow.style } })}><option value="none">None</option><option value="spread">Soft spread</option><option value="hug">Close contact</option></select></label>
      <label>Shadow intensity<select aria-label="Shadow intensity" value={shadow.intensity} onChange={event => update({ shadow: { ...shadow, intensity: event.target.value as typeof shadow.intensity } })}>{['low', 'medium', 'high'].map(value => <option key={value}>{value}</option>)}</select></label>
      <p className={styles.hint}>Choose where the light comes from.</p>
      <div className={styles.lightGrid} aria-label="Light source">{Array.from({ length: 25 }, (_, index) => { const row = Math.floor(index / 5), col = index % 5; return <button key={index} aria-label={`Light row ${row + 1} column ${col + 1}`} aria-pressed={shadow.lightSource[0] === row && shadow.lightSource[1] === col} onClick={() => update({ shadow: { ...shadow, lightSource: [row, col] } })}><span /></button>; })}</div>
    </Group>

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

    <Group title="Badges & stickers">
      <Toggle label="Show badge" checked={!!canvas.badge?.enabled} onChange={enabled => changeBadge({ enabled })} />
      <label>Badge preset<select aria-label="Badge preset" value="" onChange={event => update({ badge: structuredClone(BADGE_PRESETS[Number(event.target.value)].config) })}><option value="" disabled>Choose a badge</option>{BADGE_PRESETS.map((preset, index) => <option key={index} value={index}>{preset.label}</option>)}</select></label>
      <label>Badge text<input value={badge.text} onChange={event => changeBadge({ text: event.target.value })} /></label>
      <label>Badge supporting text<input value={badge.subtext || ''} onChange={event => changeBadge({ subtext: event.target.value })} /></label>
      <label>Badge icon<select aria-label="Badge icon" value={badge.icon} onChange={event => changeBadge({ icon: event.target.value as BadgeConfig['icon'] })}>{['none', 'star', 'trophy', 'flame', 'shield', 'heart', 'sparkle'].map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Badge style<select aria-label="Badge style" value={badge.style} onChange={event => changeBadge({ style: event.target.value as BadgeConfig['style'] })}>{['pill-glass', 'pill-solid', 'minimal-star'].map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Badge position<select aria-label="Badge position" value={badge.position || 'inline'} onChange={event => changeBadge({ position: event.target.value as BadgeConfig['position'] })}>{[...BADGE_POSITION_OPTIONS, { value: 'free', label: 'Custom position' }].map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <Range label="Badge horizontal offset" value={badge.offsetX || 0} min={-400} max={400} onChange={offsetX => changeBadge({ offsetX })} />
      <Range label="Badge vertical offset" value={badge.offsetY || 0} min={-800} max={800} onChange={offsetY => changeBadge({ offsetY })} />
      <Toggle label="Show store download badge" checked={!!canvas.showAppStoreBadge} onChange={showAppStoreBadge => update({ showAppStoreBadge })} />
    </Group>

    <Group title="Cards & callouts">
      <label>Add floating card<select aria-label="Add floating card" value="" onChange={event => state.addFloatingCard(canvas.id, FLOATING_CARD_PRESETS[Number(event.target.value)].config)}><option value="" disabled>Choose a card</option>{FLOATING_CARD_PRESETS.map((preset, index) => <option key={index} value={index}>{preset.label}</option>)}</select></label>
      {canvas.floatingCards?.map((card, index) => <div className={styles.elementCard} key={card.id}>
        <label>Card {index + 1} title<input value={card.title} onChange={event => update({ floatingCards: canvas.floatingCards?.map(item => item.id === card.id ? { ...item, title: event.target.value } : item) })} /></label>
        <label>Card {index + 1} subtitle<input value={card.subtitle || ''} onChange={event => update({ floatingCards: canvas.floatingCards?.map(item => item.id === card.id ? { ...item, subtitle: event.target.value } : item) })} /></label>
        <label>Card {index + 1} position<select value={card.position} onChange={event => update({ floatingCards: canvas.floatingCards?.map(item => item.id === card.id ? { ...item, position: event.target.value as typeof card.position } : item) })}>{['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center-left', 'center-right'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Card {index + 1} theme<select value={card.theme} onChange={event => update({ floatingCards: canvas.floatingCards?.map(item => item.id === card.id ? { ...item, theme: event.target.value as typeof card.theme } : item) })}>{['glass-dark', 'glass-light', 'solid-dark', 'solid-light', 'accent'].map(value => <option key={value}>{value}</option>)}</select></label>
        <button className={styles.fullButton} onClick={() => state.removeFloatingCard(canvas.id, card.id)}>Remove card {index + 1}</button>
      </div>)}
      <label>Add callout<select aria-label="Add callout" value="" onChange={event => state.addCalloutPin(canvas.id, CALLOUT_PIN_PRESETS[Number(event.target.value)].config)}><option value="" disabled>Choose a callout</option>{CALLOUT_PIN_PRESETS.map((preset, index) => <option key={index} value={index}>{preset.label}</option>)}</select></label>
      {canvas.calloutPins?.map((pin, index) => <div className={styles.elementCard} key={pin.id}>
        <label>Callout {index + 1} text<input value={pin.text} onChange={event => update({ calloutPins: canvas.calloutPins?.map(item => item.id === pin.id ? { ...item, text: event.target.value } : item) })} /></label>
        <label>Callout {index + 1} position<select value={pin.position} onChange={event => update({ calloutPins: canvas.calloutPins?.map(item => item.id === pin.id ? { ...item, position: event.target.value as typeof pin.position } : item) })}>{['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'].map(value => <option key={value}>{value}</option>)}</select></label>
        <Color label={`Callout ${index + 1} color`} value={pin.color || '#286348'} onChange={color => update({ calloutPins: canvas.calloutPins?.map(item => item.id === pin.id ? { ...item, color } : item) })} />
        <button className={styles.fullButton} onClick={() => state.removeCalloutPin(canvas.id, pin.id)}>Remove callout {index + 1}</button>
      </div>)}
    </Group>

    <Group title="Status bar">
      <Toggle label="Replace screenshot status bar" checked={statusBar.enabled} onChange={enabled => update({ statusBar: { ...statusBar, enabled } })} />
      <label>Status bar time<input value={statusBar.time} onChange={event => update({ statusBar: { ...statusBar, time: event.target.value } })} /></label>
      <label>Status bar theme<select aria-label="Status bar theme" value={statusBar.theme} onChange={event => update({ statusBar: { ...statusBar, theme: event.target.value as typeof statusBar.theme } })}>{['auto', 'light', 'dark'].map(value => <option key={value}>{value}</option>)}</select></label>
      <Range label="Battery level" value={statusBar.batteryLevel} min={0} max={100} unit="%" onChange={batteryLevel => update({ statusBar: { ...statusBar, batteryLevel } })} />
      <Toggle label="Show Wi-Fi" checked={statusBar.showWifi} onChange={showWifi => update({ statusBar: { ...statusBar, showWifi } })} />
      <Toggle label="Show cellular signal" checked={statusBar.showCellular} onChange={showCellular => update({ statusBar: { ...statusBar, showCellular } })} />
    </Group>

    <Group title="Panoramic background">
      <p className={styles.hint}>A continuous background across all slides. Turn it off to show each slide’s background.</p>
      <Toggle label="Connect slide backgrounds" checked={!!state.globalSettings.panorama?.enabled} onChange={state.togglePanorama} />
      <label>Panorama preset<select aria-label="Panorama preset" value={state.globalSettings.panorama?.presetId || PANORAMA_PRESETS[0].id} onChange={event => state.applyPanoramaToAll(event.target.value)}>{PANORAMA_PRESETS.map(preset => <option key={preset.id} value={preset.id}>{preset.name}</option>)}</select></label>
    </Group>

    <Group title="Reusable templates">
      <button className={styles.fullButton} onClick={onTemplates}>Browse template gallery</button>
      <label>Template name<input value={templateName} placeholder="My launch style" onChange={event => setTemplateName(event.target.value)} /></label>
      <p className={styles.hint}>Save this slide’s layout, colors, typography, shadows, decorations, background image, and app icon. Each slide keeps its screenshots and copy.</p>
      <button className={styles.fullButton} disabled={!templateName.trim()} onClick={() => { state.saveDesign(templateName, canvas.id); setTemplateName(''); toast.success('Template saved'); }}>Save as template</button>
      {state.savedDesigns.map(template => <div className={styles.savedTemplate} key={template.id}><button onClick={() => state.applySlideDesign(template.design, canvas.id)}>Apply {template.name}</button><button aria-label={`Delete template ${template.name}`} onClick={() => state.removeDesign(template.id)}>Delete</button></div>)}
      <button className={styles.fullButton} onClick={() => { state.applySlideDesign(captureDesign(canvas, state.globalSettings)); toast.success('Design applied to all slides'); }}>Apply this design to all slides</button>
    </Group>
  </div>;
}
