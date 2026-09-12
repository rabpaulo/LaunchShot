import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { projectStorage, getSaveStatus, retrySave } from '../src/utils/projectStorage.ts';

const legacy = new Map();
globalThis.localStorage = { getItem: key => legacy.get(key) || null, removeItem: key => legacy.delete(key) };

function snapshot(source, title = 'Saved') { return JSON.stringify({ state: { canvases: [{ imageSrc: source, title }], projects: [] }, version: 0 }); }
async function stored(name) {
  const db = await new Promise((resolve, reject) => { const request = indexedDB.open('launchshot', 1); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
  return new Promise(resolve => { const request = db.transaction('projects').objectStore('projects').get(name); request.onsuccess = () => { resolve(request.result); db.close(); }; });
}

test('persists image bytes under stable references and reopens after original blob URL is revoked', async () => {
  const url = URL.createObjectURL(new Blob(['image bytes'], { type: 'image/png' }));
  await projectStorage.setItem('bytes', snapshot(url));
  assert.equal(getSaveStatus(), 'saved');
  const raw = JSON.parse(await stored('bytes'));
  assert.match(raw.state.canvases[0].imageSrc, /^asset:/);
  URL.revokeObjectURL(url);
  const reopened = JSON.parse(await projectStorage.getItem('bytes'));
  assert.equal(await (await fetch(reopened.state.canvases[0].imageSrc)).text(), 'image bytes');
});

test('legacy migration preserves edits and exposes expired images for replacement', async () => {
  legacy.set('legacy', snapshot('blob:http://old-session/expired', 'Keep this headline'));
  const reopened = JSON.parse(await projectStorage.getItem('legacy'));
  assert.equal(reopened.state.canvases[0].title, 'Keep this headline');
  assert.equal(reopened.state.canvases[0].imageSrc, '');
  assert.equal(legacy.has('legacy'), false);
  assert.equal(JSON.parse(await stored('legacy')).state.canvases[0].title, 'Keep this headline');
});

test('failed writes preserve the last durable project and retry the latest snapshot', async () => {
  await projectStorage.setItem('failure', snapshot('', 'Before'));
  const original = IDBObjectStore.prototype.put;
  IDBObjectStore.prototype.put = function () { throw new DOMException('Full', 'QuotaExceededError'); };
  try { await projectStorage.setItem('failure', snapshot('', 'After')); }
  finally { IDBObjectStore.prototype.put = original; }
  assert.equal(getSaveStatus(), 'error');
  assert.equal(JSON.parse(await stored('failure')).state.canvases[0].title, 'Before');
  await retrySave();
  assert.equal(getSaveStatus(), 'saved');
  assert.equal(JSON.parse(await stored('failure')).state.canvases[0].title, 'After');
});

test('migration never discards a readable legacy image when asset storage fails', async () => {
  const url = URL.createObjectURL(new Blob(['recoverable image'], { type: 'image/png' }));
  const original = IDBObjectStore.prototype.put;
  legacy.set('migration-failure', snapshot(url, 'Keep everything'));
  IDBObjectStore.prototype.put = function () { throw new DOMException('Full', 'QuotaExceededError'); };
  try { await assert.rejects(projectStorage.getItem('migration-failure')); }
  finally { IDBObjectStore.prototype.put = original; }
  assert.equal(JSON.parse(legacy.get('migration-failure')).state.canvases[0].imageSrc, url);
  const recovered = JSON.parse(await projectStorage.getItem('migration-failure'));
  assert.equal(await (await fetch(recovered.state.canvases[0].imageSrc)).text(), 'recoverable image');
  URL.revokeObjectURL(url);
});
