import test from 'node:test';
import assert from 'node:assert/strict';
import { useEditorStore } from '../src/store/useEditorStore.ts';
import { newDesign, resolveCanvasSize, resolveDeviceTarget, validCreationFields, validOutputSize } from '../src/config/creation.ts';
import { slideExportIssue } from '../src/utils/export.ts';

test('mixed designs keep dimensions, device proportions, history, and compatible styles', async () => {
  const store = useEditorStore;
  store.getState().createProject('Mixed designs');
  const settings = store.getState().globalSettings;
  const screenshot = store.getState().canvases[0];
  store.getState().addCanvas(newDesign('banner', settings));
  const banner = store.getState().canvases.at(-1);
  store.getState().addCanvas({ ...newDesign('mockup', settings), deviceTarget: 'ipad-12.9', transparentBackground: true });
  const mockup = store.getState().canvases.at(-1);
  assert.equal(resolveCanvasSize(banner, settings).width, 1200);
  assert.equal(resolveDeviceTarget(mockup, settings), 'ipad-12.9');
  assert.equal(resolveCanvasSize(mockup, settings).width, 1080);
  store.getState().updateCanvas(banner.id, { outputSize: { width: 900, height: 450 } });
  assert.deepEqual(store.getState().canvases[0], screenshot);
  store.getState().undo();
  assert.deepEqual(store.getState().canvases[1], banner);
  store.getState().redo();
  store.getState().selectCanvas(banner.id);
  store.getState().applyLayoutToAll('banner-split');
  assert.equal(store.getState().canvases[2].layout, 'device-only');
  store.getState().applyStudioStyle('bold-gradient');
  assert.deepEqual(store.getState().canvases[0], screenshot);
  assert.deepEqual(store.getState().canvases[2], mockup);
  store.getState().loadTemplate([{ ...screenshot, backgroundColor: '#123456' }]);
  assert.deepEqual(store.getState().canvases[2], mockup);
  store.getState().duplicateCanvas(mockup.id);
  assert.deepEqual(store.getState().canvases.at(-1).outputSize, mockup.outputSize);
  const project = { name: 'Round trip', canvases: store.getState().canvases, globalSettings: settings };
  assert.equal(await store.getState().importProjectFile(JSON.stringify({ version: '2.0.0', project })), true);
  assert.deepEqual(store.getState().canvases, JSON.parse(JSON.stringify(project.canvases)));
  assert.equal(await store.getState().importProjectFile(JSON.stringify({ project: { ...project, canvases: [{ ...mockup, outputSize: { width: 1e9, height: 100 } }] } })), false);
});

test('dimensions and presentation are validated and exports require only used content', () => {
  const settings = useEditorStore.getState().globalSettings;
  const banner = newDesign('banner', settings);
  const mockup = newDesign('mockup', settings);
  for (const width of [0, 63, 4097, 100.5, NaN, Infinity, '100']) assert.equal(validOutputSize({ width, height: 100 }), false);
  assert.equal(validOutputSize({ width: 64, height: 4096 }), true);
  assert.equal(validCreationFields({ ...banner, kind: 'unknown' }), false);
  assert.equal(validCreationFields({ ...banner, deviceTarget: 'play-feature-graphic' }), false);
  assert.equal(slideExportIssue(banner, 'en', 'en'), undefined);
  assert.match(slideExportIssue({ ...banner, mediaPresentation: 'image' }, 'en', 'en'), /missing screenshot/);
  assert.equal(slideExportIssue({ ...mockup, imageSrc: 'asset:example' }, 'en', 'en'), undefined);
});

test('deletion chooses an adjacent design, supports an empty project, and keeps history valid', () => {
  const store = useEditorStore;
  for (const position of [0, 1, 2]) {
    store.getState().createProject('Removal');
    store.getState().addCanvas(newDesign('banner', store.getState().globalSettings));
    store.getState().addCanvas(newDesign('mockup', store.getState().globalSettings));
    const before = structuredClone(store.getState().canvases);
    store.getState().selectCanvas(before[position].id);
    store.getState().removeCanvas(before[position].id);
    assert.equal(store.getState().selectedCanvasId, before[position === 2 ? 1 : position + 1].id);
    store.getState().undo();
    assert.deepEqual(store.getState().canvases, before);
    store.getState().redo();
    assert.equal(store.getState().canvases.length, 2);
    assert.ok(store.getState().canvases.some(c => c.id === store.getState().selectedCanvasId));
    for (const canvas of store.getState().canvases) store.getState().removeCanvas(canvas.id);
    assert.equal(store.getState().selectedCanvasId, null);
    assert.deepEqual(store.getState().canvases, []);
    store.getState().undo();
    assert.equal(store.getState().selectedCanvasId, store.getState().canvases[0].id);
    store.getState().redo();
    assert.equal(store.getState().selectedCanvasId, null);
  }
});

test('cleared image slots stay empty and preserve the rest of the design through undo', async () => {
  const { resolveMediaImages, mediaSlotCount } = await import('../src/config/creation.ts');
  const store = useEditorStore;
  store.getState().createProject('Clear images');
  const id = store.getState().canvases[0].id;
  store.getState().updateCanvas(id, { kind: 'mockup', layout: 'trio-row', imageSrc: 'primary', title: 'Keep this', imageZoom: 1.4, mediaScale: .75 });
  const before = structuredClone(store.getState().canvases[0]);
  assert.equal(mediaSlotCount(before), 3);
  assert.deepEqual(resolveMediaImages(before, { ...before, imageSrc: 'neighbor' }), ['primary', 'neighbor', 'primary']);
  for (const key of ['secondaryImageSrc', 'tertiaryImageSrc', 'imageSrc']) {
    store.getState().updateCanvas(id, { [key]: null });
    const canvas = store.getState().canvases[0];
    const slot = { imageSrc: 0, secondaryImageSrc: 1, tertiaryImageSrc: 2 }[key];
    assert.equal(resolveMediaImages(canvas, before, before, before)[slot], null);
    assert.equal(canvas.title, before.title);
    assert.equal(canvas.imageZoom, before.imageZoom);
    assert.equal(canvas.mediaScale, before.mediaScale);
    store.getState().undo();
    assert.deepEqual(store.getState().canvases[0], before);
  }
  assert.equal(mediaSlotCount({ ...before, mediaPresentation: 'none' }), 0);
  assert.equal(mediaSlotCount({ ...before, layout: 'duo-row' }), 2);
  assert.equal(mediaSlotCount({ ...before, mediaPresentation: 'image' }), 1);
});

test('presets preserve content and placement survives templates and portable projects', async () => {
  const { DESIGN_PRESETS, presetChanges } = await import('../src/config/designPresets.ts');
  const { captureDesign, applyDesign } = await import('../src/config/designs.ts');
  const store = useEditorStore;
  assert.equal(DESIGN_PRESETS.length, 6);
  for (const preset of DESIGN_PRESETS) {
    store.getState().createProject('Preset');
    const sibling = structuredClone(store.getState().canvases[0]);
    store.getState().addCanvas({ ...newDesign(preset.kind, store.getState().globalSettings), title: 'Keep my copy', subtitle: 'And this', imageSrc: 'https://example.com/image.png', secondaryImageSrc: null, deviceTarget: 'ipad-12.9' });
    const before = structuredClone(store.getState().canvases[1]);
    store.getState().updateCanvas(before.id, presetChanges(preset));
    const after = store.getState().canvases[1];
    for (const key of ['title', 'subtitle', 'translations', 'imageSrc', 'secondaryImageSrc', 'outputSize', 'deviceTarget']) assert.deepEqual(after[key], before[key]);
    assert.deepEqual(store.getState().canvases[0], sibling);
    assert.equal(validCreationFields(after), true);
    store.getState().undo();
    assert.deepEqual(store.getState().canvases[1], before);
    store.getState().redo();
    store.getState().updateCanvas(before.id, { mediaScale: .75, mediaOffset: { x: 12, y: -8 } });
    const positioned = store.getState().canvases[1];
    const design = captureDesign(positioned, store.getState().globalSettings);
    assert.deepEqual(applyDesign(before, design).mediaOffset, positioned.mediaOffset);
    const project = { name: 'Transfer', canvases: store.getState().canvases, globalSettings: store.getState().globalSettings };
    assert.equal(await store.getState().importProjectFile(JSON.stringify({ version: '2.0.0', project })), true);
    assert.deepEqual(store.getState().canvases[1], JSON.parse(JSON.stringify(positioned)));
  }
  const canvas = store.getState().canvases[1];
  for (const mediaScale of [NaN, Infinity, '1', null, .24, 1.51]) assert.equal(validCreationFields({ ...canvas, mediaScale }), false);
  for (const mediaOffset of [null, {}, { x: '1', y: 0 }, { x: Infinity, y: 0 }, { x: 0, y: 51 }]) assert.equal(validCreationFields({ ...canvas, mediaOffset }), false);
});
