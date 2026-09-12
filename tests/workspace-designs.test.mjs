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
