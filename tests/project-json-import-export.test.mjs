import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import 'fake-indexeddb/auto';
import { useEditorStore } from '../src/store/useEditorStore.ts';

test('exportProjectFile produces valid JSON payload for single project', async () => {
  const store = useEditorStore;
  store.getState().createProject('Single Export Test');
  const activeId = store.getState().activeProjectId;
  store.getState().updateCanvas(store.getState().canvases[0].id, { title: 'Export Headline', subtitle: 'Export Subtitle' });

  let downloadedFilename = '';
  const originalDocument = globalThis.document;

  globalThis.document = {
    createElement: () => ({
      click: () => {},
      set href(val) {},
      set download(val) { downloadedFilename = val; },
    }),
    body: { appendChild: () => {}, removeChild: () => {} },
  };

  try {
    await store.getState().exportProjectFile(activeId);
    assert.match(downloadedFilename, /\.json$/);
    assert.match(downloadedFilename, /single-export-test\.json/);
  } finally {
    globalThis.document = originalDocument;
  }
});

test('exportAllProjectsFile produces valid JSON bundle of all workspace projects', async () => {
  const store = useEditorStore;
  store.getState().createProject('Bundle Project 1');
  store.getState().createProject('Bundle Project 2');

  let downloadedFilename = '';
  const originalDocument = globalThis.document;

  globalThis.document = {
    createElement: () => ({
      click: () => {},
      set href(val) {},
      set download(val) { downloadedFilename = val; },
    }),
    body: { appendChild: () => {}, removeChild: () => {} },
  };

  try {
    await store.getState().exportAllProjectsFile();
    assert.match(downloadedFilename, /^launchshot-workspace-backup-\d{4}-\d{2}-\d{2}\.json$/);
  } finally {
    globalThis.document = originalDocument;
  }
});

test('importProjectsJson imports wrapped single project JSON and activates it', async () => {
  const store = useEditorStore;
  const project = {
    id: 'custom-proj-id',
    name: 'Imported Wrapped Project',
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
    canvases: [
      {
        id: 'canvas-1',
        title: 'Wrapped Headline',
        subtitle: 'Wrapped Subtitle',
        layout: 'basic-top',
        backgroundColor: '#112233',
        textColor: '#ffffff',
      },
    ],
    globalSettings: {
      appName: 'Imported App',
      targetSize: 'ios-6.5',
      theme: 'dark',
    },
  };

  const jsonPayload = JSON.stringify({
    version: '2.0.0',
    type: 'launchshot-project',
    project,
  });

  const result = await store.getState().importProjectsJson(jsonPayload);
  assert.equal(result.success, true);
  assert.equal(result.count, 1);

  const active = store.getState().projects.find((p) => p.id === store.getState().activeProjectId);
  assert.ok(active);
  assert.equal(active.name, 'Imported Wrapped Project');
  assert.equal(store.getState().canvases[0].title, 'Wrapped Headline');
  assert.equal(store.getState().canvases[0].backgroundColor, '#112233');
});

test('importProjectsJson imports multi-project bundle JSON and adds all projects', async () => {
  const store = useEditorStore;
  const initialCount = store.getState().projects.length;

  const bundlePayload = JSON.stringify({
    version: '2.0.0',
    type: 'launchshot-projects-bundle',
    projects: [
      {
        name: 'Multi Project A',
        canvases: [
          {
            id: 'c-a1',
            title: 'Project A Headline',
            subtitle: 'Project A Subtitle',
            layout: 'basic-top',
          },
        ],
      },
      {
        name: 'Multi Project B',
        canvases: [
          {
            id: 'c-b1',
            title: 'Project B Headline',
            subtitle: 'Project B Subtitle',
            layout: 'split-bottom',
          },
        ],
      },
    ],
  });

  const result = await store.getState().importProjectsJson(bundlePayload);
  assert.equal(result.success, true);
  assert.equal(result.count, 2);
  assert.equal(store.getState().projects.length, initialCount + 2);

  const active = store.getState().projects.find((p) => p.id === store.getState().activeProjectId);
  assert.ok(active);
  assert.equal(active.name, 'Multi Project A');
  assert.equal(store.getState().canvases[0].title, 'Project A Headline');
});

test('importProjectsJson imports raw array of project objects', async () => {
  const store = useEditorStore;
  const initialCount = store.getState().projects.length;

  const arrayPayload = JSON.stringify([
    {
      name: 'Array Project 1',
      canvases: [
        {
          id: 'arr-1',
          title: 'Array 1 Title',
          subtitle: 'Array 1 Sub',
          layout: 'basic-top',
        },
      ],
    },
    {
      name: 'Array Project 2',
      canvases: [
        {
          id: 'arr-2',
          title: 'Array 2 Title',
          subtitle: 'Array 2 Sub',
          layout: 'device-only',
        },
      ],
    },
  ]);

  const result = await store.getState().importProjectsJson(arrayPayload);
  assert.equal(result.success, true);
  assert.equal(result.count, 2);
  assert.equal(store.getState().projects.length, initialCount + 2);
});

test('importProjectsJson validates and rejects corrupted or invalid JSON', async () => {
  const store = useEditorStore;

  // Corrupted syntax
  const badSyntaxResult = await store.getState().importProjectsJson('{ invalid json');
  assert.equal(badSyntaxResult.success, false);
  assert.equal(badSyntaxResult.count, 0);

  // Missing canvases
  const missingCanvases = await store.getState().importProjectsJson(JSON.stringify({ name: 'No Canvases' }));
  assert.equal(missingCanvases.success, false);

  // Invalid creation fields (e.g. invalid yaw angle)
  const invalidYaw = await store.getState().importProjectsJson(
    JSON.stringify({
      name: 'Invalid Yaw',
      canvases: [
        {
          id: 'bad-yaw',
          title: 'Title',
          subtitle: 'Sub',
          yawAngle: 999,
        },
      ],
    })
  );
  assert.equal(invalidYaw.success, false);

  // Unsupported version
  const badVersion = await store.getState().importProjectsJson(
    JSON.stringify({
      version: '99.0.0',
      projects: [{ canvases: [{ id: 'c1', title: 'T', subtitle: 'S' }] }],
    })
  );
  assert.equal(badVersion.success, false);
});

test('importProjectsJson imports dayle.json project successfully with embedded assets and no emojis', async () => {
  const jsonContent = await readFile(new URL('../dayle.json', import.meta.url), 'utf-8');
  const store = useEditorStore;
  const result = await store.getState().importProjectsJson(jsonContent);
  assert.equal(result.success, true);
  assert.equal(result.count, 1);

  const active = store.getState().projects.find((p) => p.id === store.getState().activeProjectId);
  assert.ok(active);
  assert.equal(active.name, 'Dayle');
  assert.equal(store.getState().canvases.length, 5);
  assert.ok(store.getState().canvases[0].imageSrc);
  assert.ok(store.getState().canvases[3].tertiaryImageSrc);

  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;
  assert.equal(emojiRegex.test(jsonContent), false, 'dayle.json must contain no emojis');
});

test('ProjectManagerModal and store contain no emojis in UI and copy', async () => {
  const modalContent = await readFile(new URL('../src/components/ProjectManagerModal.tsx', import.meta.url), 'utf-8');
  const storeContent = await readFile(new URL('../src/store/useEditorStore.ts', import.meta.url), 'utf-8');

  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

  assert.equal(emojiRegex.test(modalContent), false, 'ProjectManagerModal must contain no emojis');
  assert.equal(emojiRegex.test(storeContent), false, 'useEditorStore must contain no emojis');
});


