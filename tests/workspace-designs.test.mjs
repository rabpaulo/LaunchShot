import test from 'node:test';
import assert from 'node:assert/strict';
import { useEditorStore } from '../src/store/useEditorStore.ts';

test('a saved design preserves images and translated copy on the target and applies atomically to all slides', () => {
  const store = useEditorStore;
  store.getState().createProject('Designs');
  store.getState().importScreenshots(['data:image/png;base64,one', 'data:image/png;base64,two']);
  const [first, second] = store.getState().canvases;
  store.getState().updateCanvas(first.id, { fontFamily: 'playfair', backgroundColor: '#123456', textBoxWidth: 65, doodle: { enabled: true, doodles: [{ type: 'star', position: 'top-right' }] } });
  store.getState().updateCanvas(second.id, { title: 'Keep my headline', subtitle: 'Keep my subtitle', imageZoom: 1.5, gradientText: true });
  store.getState().saveDesign('Editorial', first.id);
  const template = store.getState().savedDesigns.at(-1);
  // JSON persistence omits undefined fields; applying must still reset old optional styling.
  const persistedDesign = JSON.parse(JSON.stringify(template.design));
  const before = structuredClone(store.getState().canvases);
  store.getState().applySlideDesign(persistedDesign, second.id);
  const target = store.getState().canvases[1];
  assert.equal(target.imageSrc, second.imageSrc);
  assert.equal(target.imageZoom, 1.5);
  assert.equal(target.title, 'Keep my headline');
  assert.equal(target.translations.en.title, 'Keep my headline');
  assert.equal(target.fontFamily, 'playfair');
  assert.equal(target.textBoxWidth, 65);
  assert.equal(target.gradientText, undefined);
  assert.deepEqual(store.getState().canvases[0], before[0]);
  store.getState().undo();
  assert.deepEqual(store.getState().canvases, before);
  store.getState().applySlideDesign(persistedDesign);
  assert.ok(store.getState().canvases.every(canvas => canvas.fontFamily === 'playfair'));
  store.getState().undo();
  assert.deepEqual(store.getState().canvases, before);
});

test('uploading into a styled blank workspace retains the design', () => {
  const store = useEditorStore;
  store.getState().createProject('Start blank');
  const blank = store.getState().canvases[0];
  store.getState().updateCanvas(blank.id, { fontFamily: 'lora', backgroundColor: '#abcdef', textBoxWidth: 70 });
  store.getState().importScreenshots(['data:image/png;base64,one']);
  assert.equal(store.getState().canvases.length, 1);
  assert.equal(store.getState().canvases[0].fontFamily, 'lora');
  assert.equal(store.getState().canvases[0].backgroundColor, '#abcdef');
  assert.equal(store.getState().canvases[0].textBoxWidth, 70);
});

test('applyTextStyleToAll updates typography attributes across all canvases and supports undo', () => {
  const store = useEditorStore;
  store.getState().createProject('Text Styles Multi');
  store.getState().importScreenshots(['data:image/png;base64,1', 'data:image/png;base64,2', 'data:image/png;base64,3']);
  const before = structuredClone(store.getState().canvases);

  store.getState().applyTextStyleToAll({
    fontFamily: 'outfit',
    titleFontSize: 54,
    subtitleFontSize: 28,
    textBoxWidth: 85,
    textAlign: 'center',
    textColor: '#101010',
    subtitleColor: '#555555',
    gradientText: true,
  });

  const canvases = store.getState().canvases;
  assert.equal(canvases.length, 3);
  for (const c of canvases) {
    assert.equal(c.fontFamily, 'outfit');
    assert.equal(c.titleFontSize, 54);
    assert.equal(c.subtitleFontSize, 28);
    assert.equal(c.textBoxWidth, 85);
    assert.equal(c.textAlign, 'center');
    assert.equal(c.textColor, '#101010');
    assert.equal(c.subtitleColor, '#555555');
    assert.equal(c.gradientText, true);
  }

  // Undo restores previous states
  store.getState().undo();
  assert.deepEqual(store.getState().canvases, before);

  // Redo re-applies
  store.getState().redo();
  for (const c of store.getState().canvases) {
    assert.equal(c.fontFamily, 'outfit');
    assert.equal(c.titleFontSize, 54);
  }
});

test('applyDeviceSettingsToAll updates layout, mockup style and transforms across all canvases', () => {
  const store = useEditorStore;
  store.getState().createProject('Device Settings Multi');
  store.getState().importScreenshots(['data:image/png;base64,a', 'data:image/png;base64,b']);

  store.getState().applyDeviceSettingsToAll({
    layout: 'tilt-left',
    mockupStyle: 'clay',
    showNotch: false,
    mediaScale: 0.9,
    mediaOffset: { x: 10, y: -20 },
    rotationAngle: 12,
    yawAngle: -8,
    imageFit: 'contain',
  });

  const canvases = store.getState().canvases;
  for (const c of canvases) {
    assert.equal(c.layout, 'tilt-left');
    assert.equal(c.mockupStyle, 'clay');
    assert.equal(c.showNotch, false);
    assert.equal(c.mediaScale, 0.9);
    assert.deepEqual(c.mediaOffset, { x: 10, y: -20 });
    assert.equal(c.rotationAngle, 12);
    assert.equal(c.yawAngle, -8);
    assert.equal(c.imageFit, 'contain');
  }
});

test('applyBackgroundToAll, applyShadowToAll, and applyStatusBarToAll update state and sync history', () => {
  const store = useEditorStore;
  store.getState().createProject('Visual Properties Multi');
  store.getState().importScreenshots(['data:image/png;base64,x', 'data:image/png;base64,y']);

  // Apply Background
  store.getState().applyBackgroundToAll('#2c3e50', '#ecf0f1', { mode: 'solid', pattern: true, effects: true });
  for (const c of store.getState().canvases) {
    assert.equal(c.backgroundColor, '#2c3e50');
    assert.equal(c.textColor, '#ecf0f1');
  }
  assert.equal(store.getState().globalSettings.backgroundColor, '#2c3e50');
  assert.equal(store.getState().globalSettings.textColor, '#ecf0f1');
  assert.equal(store.getState().globalSettings.backdropEffects?.pattern, true);

  // Apply Shadow
  store.getState().applyShadowToAll({ style: 'hug', intensity: 'high', lightSource: [1, 3] });
  assert.equal(store.getState().globalSettings.shadow?.style, 'hug');
  assert.equal(store.getState().globalSettings.shadow?.intensity, 'high');
  assert.deepEqual(store.getState().globalSettings.shadow?.lightSource, [1, 3]);

  // Apply Status Bar
  store.getState().applyStatusBarToAll({ enabled: true, theme: 'dark', style: 'dynamic-island', time: '10:00' });
  for (const c of store.getState().canvases) {
    assert.equal(c.statusBar?.enabled, true);
    assert.equal(c.statusBar?.theme, 'dark');
    assert.equal(c.statusBar?.style, 'dynamic-island');
    assert.equal(c.statusBar?.time, '10:00');
  }
  assert.equal(store.getState().globalSettings.statusBar?.enabled, true);
  assert.equal(store.getState().globalSettings.statusBar?.theme, 'dark');
});

test('applyAllDesignToAll copies full design styling from source slide to all slides without overwriting images or text', () => {
  const store = useEditorStore;
  store.getState().createProject('Apply All Design');
  store.getState().importScreenshots(['data:image/png;base64,img1', 'data:image/png;base64,img2']);
  const [first, second] = store.getState().canvases;

  store.getState().updateCanvas(first.id, {
    fontFamily: 'syne',
    backgroundColor: '#ffaa00',
    textColor: '#000000',
    layout: 'duo-row',
    mockupStyle: 'modern',
    textBoxWidth: 90,
  });

  store.getState().updateCanvas(second.id, {
    title: 'Custom Title 2',
    subtitle: 'Custom Subtitle 2',
  });

  store.getState().applyAllDesignToAll(first.id);

  const target = store.getState().canvases[1];
  assert.equal(target.imageSrc, 'data:image/png;base64,img2', 'Target image must be preserved');
  assert.equal(target.title, 'Custom Title 2', 'Target title must be preserved');
  assert.equal(target.subtitle, 'Custom Subtitle 2', 'Target subtitle must be preserved');
  assert.equal(target.fontFamily, 'syne', 'Font family should be applied');
  assert.equal(target.backgroundColor, '#ffaa00', 'Background should be applied');
  assert.equal(target.textColor, '#000000', 'Text color should be applied');
  assert.equal(target.layout, 'duo-row', 'Layout should be applied');
  assert.equal(target.mockupStyle, 'modern', 'Mockup style should be applied');
  assert.equal(target.textBoxWidth, 90, 'Text box width should be applied');
});

