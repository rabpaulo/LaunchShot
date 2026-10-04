import test from 'node:test';
import assert from 'node:assert/strict';
import { useEditorStore } from '../src/store/useEditorStore.ts';
import { getSlideExportIssue, getExportIssues, slideExportIssue } from '../src/utils/export.ts';

function mixedProject() {
  const store = useEditorStore;
  store.getState().createProject('Reordering');
  const first = store.getState().canvases[0];
  store.getState().updateCanvas(first.id, { title: 'First', imageSrc: 'asset:first' });
  store.getState().addCanvas({ kind: 'banner', title: 'Second', mediaPresentation: 'none', layout: 'banner-centered' });
  store.getState().addCanvas({ kind: 'mockup', title: '', layout: 'device-only', imageSrc: 'asset:third', transparentBackground: true });
  return store;
}

test('reordering mixed designs preserves content, selection, project synchronization and one-step history', () => {
  const store = mixedProject();
  const original = store.getState().canvases;
  store.getState().selectCanvas(original[1].id);
  const past = store.getState().past.length;
  store.getState().reorderCanvas(original[0].id, 2);
  const moved = store.getState();
  assert.deepEqual(moved.canvases, [original[1], original[2], original[0]]);
  assert.equal(moved.selectedCanvasId, original[1].id);
  assert.equal(moved.past.length, past + 1);
  assert.deepEqual(moved.projects.find(project => project.id === moved.activeProjectId).canvases, moved.canvases);
  store.getState().undo();
  assert.deepEqual(store.getState().canvases, original);
  assert.equal(store.getState().selectedCanvasId, original[1].id);
  store.getState().redo();
  assert.deepEqual(store.getState().canvases, moved.canvases);
  store.getState().reorderCanvas(original[0].id, 0);
  assert.deepEqual(store.getState().canvases, original);
});

test('invalid and unchanged reorders leave state and redo history untouched', () => {
  const store = mixedProject();
  const id = store.getState().canvases[0].id;
  store.getState().reorderCanvas(id, 2);
  store.getState().undo();
  const before = store.getState();
  for (const [canvasId, index] of [[id, 0], [id, -1], [id, 3], [id, 1.5], [id, NaN], ['unknown', 1]]) {
    store.getState().reorderCanvas(canvasId, index);
    assert.equal(store.getState(), before);
  }
  assert.equal(store.getState().canRedo, true);
});

test('export issues identify the design and language without changing existing validation semantics', () => {
  const canvas = { id: 'design-a', title: 'Keep moving', subtitle: '', imageSrc: 'asset:image', layout: 'basic-top', translations: { en: { title: 'Keep moving', subtitle: '' }, es: { title: '', subtitle: '' } } };
  assert.equal(getSlideExportIssue(canvas, 'en', 'en'), undefined);
  for (const [item, lang, reason] of [[{ ...canvas, imageSrc: null }, 'en', 'missing-image'], [canvas, 'es', 'missing-headline'], [canvas, 'pt', 'missing-translation']]) {
    const issue = getSlideExportIssue(item, lang, 'en');
    assert.equal(issue.canvasId, 'design-a');
    assert.equal(issue.language, lang);
    assert.equal(issue.reason, reason);
    assert.equal(slideExportIssue(item, lang, 'en'), issue.message);
  }
  assert.equal(getSlideExportIssue({ ...canvas, kind: 'mockup' }, 'pt', 'en'), undefined);
  assert.equal(getSlideExportIssue({ ...canvas, kind: 'banner', mediaPresentation: 'none', imageSrc: null }, 'en', 'en'), undefined);
});

test('readiness checks exactly the designs and languages included in an export', () => {
  const screenshot = { id: 'screenshot', title: '', subtitle: '', layout: 'basic-top', imageSrc: 'asset:image' };
  const mockup = { ...screenshot, id: 'mockup', kind: 'mockup', imageSrc: null };
  assert.deepEqual(getExportIssues([screenshot, mockup], { sizes: [], languages: ['en'] }, 'en'), []);
  assert.deepEqual(getExportIssues([screenshot, mockup], { sizes: ['original'], languages: [] }, 'en'), []);
  assert.deepEqual(getExportIssues([screenshot, mockup], { sizes: ['ios-6.5'], languages: ['en'] }, 'en').map(issue => issue.canvasId), ['screenshot']);
  assert.deepEqual(getExportIssues([screenshot, mockup], { sizes: ['original'], languages: ['en'] }, 'en').map(issue => issue.canvasId), ['screenshot', 'mockup']);
  assert.equal(getExportIssues([screenshot], { sizes: ['original'], languages: ['es'] }, 'en')[0].reason, 'missing-translation');
});
