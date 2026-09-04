import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { useEditorStore } from '../src/store/useEditorStore.ts';
import { getPanoramaSliceStyle } from '../src/config/panoramas.ts';
import { parseUploadedTranslationJson } from '../src/utils/translator.ts';

test('store initializes with active project and pushHistory keeps projects in sync', () => {
  const store = useEditorStore.getState();
  assert.ok(store.projects.length >= 1, 'Projects list must not be empty');
  assert.equal(store.activeProjectId, store.projects[0].id);

  // Update canvas title
  store.updateCanvas(store.canvases[0].id, { title: 'Updated Test Title' });

  const updatedStore = useEditorStore.getState();
  const activeProj = updatedStore.projects.find((p) => p.id === updatedStore.activeProjectId);
  assert.ok(activeProj, 'Active project must exist');
  assert.equal(activeProj.canvases[0].title, 'Updated Test Title', 'Active project must sync updated canvas title');
});

test('undo and redo maintain projects synchronization', () => {
  const store = useEditorStore.getState();
  const initialTitle = store.canvases[0].title;

  store.updateCanvas(store.canvases[0].id, { title: 'Undoable Title' });
  assert.equal(useEditorStore.getState().canvases[0].title, 'Undoable Title');
  assert.equal(
    useEditorStore.getState().projects.find((p) => p.id === store.activeProjectId)?.canvases[0].title,
    'Undoable Title'
  );

  store.undo();
  assert.equal(useEditorStore.getState().canvases[0].title, initialTitle);
  assert.equal(
    useEditorStore.getState().projects.find((p) => p.id === store.activeProjectId)?.canvases[0].title,
    initialTitle,
    'Active project must sync on undo'
  );

  store.redo();
  assert.equal(useEditorStore.getState().canvases[0].title, 'Undoable Title');
  assert.equal(
    useEditorStore.getState().projects.find((p) => p.id === store.activeProjectId)?.canvases[0].title,
    'Undoable Title',
    'Active project must sync on redo'
  );

  // Clean up
  store.undo();
});

test('duplicateProject duplicates active canvases when active project is targeted', () => {
  const store = useEditorStore.getState();
  store.updateCanvas(store.canvases[0].id, { title: 'Special Active Title' });

  store.duplicateProject(store.activeProjectId);
  const updatedProjects = useEditorStore.getState().projects;
  const duplicated = updatedProjects[updatedProjects.length - 1];

  assert.ok(duplicated.name.includes('(Copy)'));
  assert.equal(duplicated.canvases[0].title, 'Special Active Title', 'Duplicate must copy active canvas edits');
});

test('batchUpdateTranslations atomically applies translations and syncs projects and history', () => {
  const store = useEditorStore.getState();
  const canvasId = store.canvases[0].id;

  const translationsPayload = {
    es: {
      [canvasId]: { title: 'Título en Español', subtitle: 'Subtítulo en Español' },
    },
    fr: {
      [canvasId]: { title: 'Titre en Français', subtitle: 'Sous-titre en Français' },
    },
  };

  store.batchUpdateTranslations(translationsPayload, 'es');

  const nextState = useEditorStore.getState();
  assert.equal(nextState.globalSettings.activeLanguage, 'es');
  assert.equal(nextState.canvases[0].title, 'Título en Español');
  assert.equal(nextState.canvases[0].subtitle, 'Subtítulo en Español');
  assert.equal(nextState.canvases[0].translations?.fr?.title, 'Titre en Français');

  const activeProj = nextState.projects.find((p) => p.id === nextState.activeProjectId);
  assert.equal(activeProj?.canvases[0].title, 'Título en Español', 'Projects must sync translated title');
  assert.equal(activeProj?.globalSettings.activeLanguage, 'es');

  // Reset back to English
  store.setActiveLanguage('en');
});

test('loadTemplate preserves image transforms when copying user images', () => {
  const store = useEditorStore.getState();
  const canvasId = store.canvases[0].id;

  store.updateCanvas(canvasId, {
    imageSrc: 'data:image/png;base64,testImageDummy',
    imageCrop: { x: 25, y: 35 },
    imageZoom: 1.75,
    imageRotation: 15,
    imageFilters: { brightness: 120, contrast: 110, saturation: 100, blur: 2, grayscale: 0 },
    imageFit: 'contain',
  });

  const templateCanvases = [
    {
      id: 'template-1',
      imageSrc: null,
      title: 'Template Title 1',
      subtitle: 'Template Subtitle 1',
      layout: 'tilt-right',
      backgroundColor: '#111827',
      textColor: '#ffffff',
    },
    {
      id: 'template-2',
      imageSrc: null,
      title: 'Template Title 2',
      subtitle: 'Template Subtitle 2',
      layout: 'split-vertical',
      backgroundColor: '#1f2937',
      textColor: '#ffffff',
    },
  ];

  store.loadTemplate(templateCanvases);

  const applied = useEditorStore.getState().canvases;
  assert.equal(applied[0].imageSrc, 'data:image/png;base64,testImageDummy');
  assert.deepEqual(applied[0].imageCrop, { x: 25, y: 35 }, 'imageCrop must be preserved');
  assert.equal(applied[0].imageZoom, 1.75, 'imageZoom must be preserved');
  assert.equal(applied[0].imageRotation, 15, 'imageRotation must be preserved');
  assert.deepEqual(
    applied[0].imageFilters,
    { brightness: 120, contrast: 110, saturation: 100, blur: 2, grayscale: 0 },
    'imageFilters must be preserved'
  );
  assert.equal(applied[0].imageFit, 'contain', 'imageFit must be preserved');
});

test('getPanoramaSliceStyle uses backgroundImage for gradients and sets backgroundRepeat', () => {
  const slice = getPanoramaSliceStyle(1, 3, {
    enabled: true,
    presetId: 'aurora-borealis',
  });

  assert.ok(slice.backgroundImage, 'Gradient panorama should be assigned to backgroundImage');
  assert.equal(slice.backgroundSize, '300% 100%');
  assert.equal(slice.backgroundPosition, '50% center');
  assert.equal(slice.backgroundRepeat, 'no-repeat');
});

test('parseUploadedTranslationJson validates and rejects empty objects', () => {
  assert.throws(() => {
    parseUploadedTranslationJson('{}');
  }, /Unsupported JSON format/);

  assert.throws(() => {
    parseUploadedTranslationJson('{"nonArray": "value"}');
  }, /Unsupported JSON format/);
});

test('CanvasEditor gives targetWidth precedence over isPreviewMode to prevent preview overflow', async () => {
  const canvasEditorSource = await readFile(
    new URL('../src/components/CanvasEditor.tsx', import.meta.url),
    'utf8'
  );

  // Verify targetWidth precedence in card className
  assert.match(
    canvasEditorSource,
    /targetWidth\s*\?\s*['"]items-center pointer-events-none snap-center['"]\s*:\s*isPreviewMode/
  );
});

test('FloatingCard includes group class and vertical centering for center positions', async () => {
  const floatingCardSource = await readFile(
    new URL('../src/components/FloatingCard.tsx', import.meta.url),
    'utf8'
  );

  // Verify container has group class so hover delete button works
  assert.match(floatingCardSource, /className=\{`group absolute z-30/);
  // Verify vertical centering translateY(-50%)
  assert.match(floatingCardSource, /transforms\.push\('translateY\(-50%\)'\)/);
});

test('applyTextBoxToAll updates textBoxWidth, titleFontSize, subtitleFontSize, and textAlign across canvases', () => {
  const store = useEditorStore.getState();
  
  // Set custom text box properties
  store.applyTextBoxToAll(60, 32, 16, 'center');
  
  const updated = useEditorStore.getState().canvases;
  assert.ok(updated.length > 0);
  for (const c of updated) {
    assert.equal(c.textBoxWidth, 60);
    assert.equal(c.titleFontSize, 32);
    assert.equal(c.subtitleFontSize, 16);
    assert.equal(c.textAlign, 'center');
  }

  // Update a single canvas to different width
  store.updateCanvas(updated[0].id, { textBoxWidth: 75 });
  const singleUpdated = useEditorStore.getState().canvases;
  assert.equal(singleUpdated[0].textBoxWidth, 75);
  if (singleUpdated.length > 1) {
    assert.equal(singleUpdated[1].textBoxWidth, 60);
  }
});

