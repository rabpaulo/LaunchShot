import test from 'node:test';
import assert from 'node:assert/strict';
import { useEditorStore } from '../src/store/useEditorStore.ts';
import { translateText } from '../src/utils/translator.ts';
import { slideExportIssue } from '../src/utils/export.ts';

test('style is atomic, preserves copy and transforms, and later slide selection is explicit', () => {
  const store = useEditorStore;
  store.getState().createProject('Workflow');
  store.getState().importScreenshots(['data:image/png;base64,one', 'data:image/png;base64,two']);
  const [first, second] = store.getState().canvases;
  assert.equal(store.getState().canvases.length, 2);
  store.getState().selectCanvas(second.id);
  store.getState().updateCanvas(second.id, { title: 'A meaningful benefit', imageZoom: 1.25 });
  store.getState().applyStudioStyle('bold-gradient');
  assert.equal(store.getState().canvases[0].backgroundColor, store.getState().canvases[1].backgroundColor);
  assert.equal(store.getState().canvases[1].imageZoom, 1.25);
  assert.equal(store.getState().canvases[1].title, 'A meaningful benefit');
  assert.equal(store.getState().canvases[0].title, '');
  assert.equal(store.getState().selectedCanvasId, second.id);
  assert.equal(store.getState().canvases[0].badge.enabled, false);
  store.getState().undo();
  assert.equal(store.getState().canvases[0].backgroundColor, first.backgroundColor);
  assert.equal(store.getState().canvases[1].title, 'A meaningful benefit');
});

test('translation failure throws rather than returning the original text', async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('Offline'); };
  try { await assert.rejects(translateText('My custom headline', 'es', 'en'), /Translation to es failed/); }
  finally { globalThis.fetch = original; }
});

test('export requires assets and requested translations', () => {
  const canvas = { imageSrc: 'asset:one', layout: 'basic-top', title: 'Hello', subtitle: '', translations: { en: { title: 'Hello', subtitle: '' } } };
  assert.equal(slideExportIssue(canvas, 'en', 'en'), undefined);
  assert.match(slideExportIssue(canvas, 'pt', 'en'), /translation/);
  assert.match(slideExportIssue({ ...canvas, imageSrc: null }, 'en', 'en'), /missing screenshot/);
  assert.match(slideExportIssue({ ...canvas, translations: { en: { title: '', subtitle: '' } } }, 'en', 'en'), /headline/);
});
