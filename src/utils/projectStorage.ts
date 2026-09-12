import type { StateStorage } from 'zustand/middleware';

export type SaveStatus = 'loading' | 'saving' | 'saved' | 'error';
let status: SaveStatus = 'loading';
const listeners = new Set<() => void>();
export const getSaveStatus = () => status;
export const subscribeSaveStatus = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
function report(next: SaveStatus) {
  status = next;
  listeners.forEach(listener => listener());
}

let database: Promise<IDBDatabase> | undefined;
function openDatabase() {
  if (!database) database = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('launchshot', 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore('assets');
      request.result.createObjectStore('projects');
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Close other LaunchShot tabs and retry saving.'));
  }).catch(error => { database = undefined; throw error; });
  return database;
}

async function read<T>(store: string, key: string): Promise<T | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction(store).objectStore(store).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function write(store: string, key: string, value: unknown) {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(store, 'readwrite');
    transaction.objectStore(store).put(value, key);
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error || new Error('Saving failed'));
    transaction.onerror = () => reject(transaction.error);
  });
}

const assetIds = new Map<string, string>();
const pendingAssets = new Map<string, Promise<string>>();
const assetUrls = new Map<string, string>();
const imageFields = new Set(['imageSrc', 'secondaryImageSrc', 'tertiaryImageSrc', 'backgroundImageSrc', 'appIconSrc']);

export async function mapImageSources(value: unknown, transform: (source: string) => Promise<string>): Promise<unknown> {
  if (Array.isArray(value)) return Promise.all(value.map(item => mapImageSources(item, transform)));
  if (value && typeof value === 'object') {
    const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => [
      key, imageFields.has(key) && typeof item === 'string' && item
        ? await transform(item) : await mapImageSources(item, transform),
    ]));
    return Object.fromEntries(entries);
  }
  return value;
}

async function persistSource(source: string): Promise<string> {
  if (!source.startsWith('blob:') && !source.startsWith('data:')) return source;
  const cached = assetIds.get(source);
  if (cached) return cached;
  if (!pendingAssets.has(source)) pendingAssets.set(source, (async () => {
    const response = await fetch(source);
    if (!response.ok) throw new Error('An image could not be saved. Replace it and retry.');
    const blob = await response.blob();
    const id = `asset:${crypto.randomUUID()}`;
    await write('assets', id, blob);
    assetIds.set(source, id);
    return id;
  })().finally(() => pendingAssets.delete(source)));
  return pendingAssets.get(source)!;
}

async function resolveSource(source: string): Promise<string> {
  if (source.startsWith('asset:')) {
    const cached = assetUrls.get(source);
    if (cached) return cached;
    const blob = await read<Blob>('assets', source);
    if (!blob) return ''; // Preserve the slide and let the user replace the missing image.
    const url = URL.createObjectURL(blob);
    assetUrls.set(source, url);
    assetIds.set(url, source);
    return url;
  }
  if (source.startsWith('blob:')) {
    // Only an unreadable URL is missing. A quota/storage failure must not erase it.
    try {
      const response = await fetch(source);
      if (!response.ok) return '';
    } catch { return ''; }
    const id = await persistSource(source);
    return await resolveSource(id);
  }
  return source;
}

let queue = Promise.resolve();
let latest: { name: string; value: string } | undefined;
let revision = 0;
function save(name: string, value: string) {
  latest = { name, value };
  const current = ++revision;
  report('saving');
  queue = queue.catch(() => {}).then(async () => {
    if (current !== revision) return;
    const serialized = await mapImageSources(JSON.parse(value), persistSource);
    await write('projects', name, JSON.stringify(serialized));
    // Retain the legacy copy until the entire new snapshot is durable.
    try { localStorage.removeItem(name); } catch { /* IndexedDB save already succeeded. */ }
    if (current === revision) report('saved');
  }).catch(() => { if (current === revision) report('error'); });
  return queue;
}
export const retrySave = () => latest ? save(latest.name, latest.value) : Promise.resolve();

export const projectStorage: StateStorage = {
  async getItem(name) {
    if (typeof indexedDB === 'undefined' && typeof window === 'undefined') return null;
    report('loading');
    try {
      const stored = await read<string>('projects', name);
      const legacy = stored ? null : localStorage.getItem(name);
      const raw = stored || legacy;
      if (!raw) { report('saved'); return null; }
      const resolved = JSON.stringify(await mapImageSources(JSON.parse(raw), resolveSource));
      if (legacy) await save(name, resolved);
      else report('saved');
      return resolved;
    } catch (error) { report('error'); throw error; }
  },
  setItem(name, value) {
    if (typeof indexedDB === 'undefined' && typeof window === 'undefined') return;
    return save(name, value);
  },
  async removeItem(name) {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction('projects', 'readwrite');
      transaction.objectStore('projects').delete(name);
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(transaction.error);
    });
  },
};

export async function portableProject(value: unknown): Promise<unknown> {
  const cache = new Map<string, Promise<string>>();
  return mapImageSources(value, source => {
    if (!cache.has(source)) cache.set(source, (async () => {
      const url = await resolveSource(source);
      if (!url) throw new Error('Replace missing images before exporting this project.');
      const response = await fetch(url);
      if (!response.ok) throw new Error('An image could not be included in the project.');
      const blob = await response.blob();
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    })());
    return cache.get(source)!;
  });
}

export async function restoreProjectImages(value: unknown) {
  return mapImageSources(value, resolveSource);
}
