import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { useEditorStore } from '../src/store/useEditorStore.ts';
import { getPanoramaSliceStyle } from '../src/config/panoramas.ts';
import { parseUploadedTranslationJson } from '../src/utils/translator.ts';
import { isAndroidDevice, isAppleDevice, DEFAULT_IPHONE_SIZE, DEFAULT_ANDROID_SIZE } from '../src/config/sizes.ts';
import { BADGE_PRESETS, getBadgeStore } from '../src/config/badges.ts';
import { applyAsoCopy } from '../src/config/aso.ts';

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

test('movable badge supports position presets, offsets, and applyBadgeToAll', async () => {
  const store = useEditorStore.getState();
  const canvas0 = store.canvases[0];

  // 1. Test updating badge position and offsets on a single canvas
  store.updateBadge(canvas0.id, {
    enabled: true,
    position: 'top-right',
    offsetX: 25,
    offsetY: -15,
  });

  let updatedCanvases = useEditorStore.getState().canvases;
  assert.equal(updatedCanvases[0].badge?.position, 'top-right');
  assert.equal(updatedCanvases[0].badge?.offsetX, 25);
  assert.equal(updatedCanvases[0].badge?.offsetY, -15);

  // 2. Test applyBadgeToAll propagates badge configuration
  store.applyBadgeToAll({
    enabled: true,
    icon: 'trophy',
    text: 'Best App 2026',
    subtext: 'Award Winner',
    style: 'pill-solid',
    position: 'top-center',
    offsetX: 10,
    offsetY: 20,
  });

  updatedCanvases = useEditorStore.getState().canvases;
  for (const c of updatedCanvases) {
    assert.equal(c.badge?.enabled, true);
    assert.equal(c.badge?.icon, 'trophy');
    assert.equal(c.badge?.text, 'Best App 2026');
    assert.equal(c.badge?.subtext, 'Award Winner');
    assert.equal(c.badge?.style, 'pill-solid');
    assert.equal(c.badge?.position, 'top-center');
    assert.equal(c.badge?.offsetX, 10);
    assert.equal(c.badge?.offsetY, 20);
  }

  // 3. Verify CanvasEditor implementation has drag handling, HUD, and no-export classes
  const canvasEditorSource = await readFile(
    new URL('../src/components/CanvasEditor.tsx', import.meta.url),
    'utf8'
  );

  assert.ok(canvasEditorSource.includes('handleBadgePointerDown'), 'handleBadgePointerDown must be defined');
  assert.ok(canvasEditorSource.includes('renderMovableBadge'), 'renderMovableBadge must be defined');
  assert.ok(canvasEditorSource.includes('zoomScale'), 'badge drag must account for zoomScale');
  assert.ok(canvasEditorSource.includes('cursor-grab'), 'movable badge must indicate grab cursor');
  assert.ok(canvasEditorSource.includes('no-export'), 'badge HUD/indicators must have no-export class');
  assert.ok(canvasEditorSource.includes('BADGE_POSITION_OPTIONS'), 'badge position options must be imported and rendered');

  // 4. Verify no emojis in badges config
  const badgesConfigSource = await readFile(
    new URL('../src/config/badges.ts', import.meta.url),
    'utf8'
  );
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.ok(!emojiRegex.test(badgesConfigSource), 'badges config must not contain emojis');
});

test('isAndroidDevice and isAppleDevice correctly categorize devices', () => {
  assert.equal(isAndroidDevice('android-tall'), true);
  assert.equal(isAndroidDevice('samsung-s26'), true);
  assert.equal(isAndroidDevice('play-feature-graphic'), true);
  assert.equal(isAndroidDevice('ios-6.5'), false);
  assert.equal(isAndroidDevice('ios-6.9'), false);
  assert.equal(isAndroidDevice('ipad-pro-13'), false);

  assert.equal(isAppleDevice('ios-6.5'), true);
  assert.equal(isAppleDevice('ios-6.9'), true);
  assert.equal(isAppleDevice('ipad-pro-13'), true);
  assert.equal(isAppleDevice('android-tall'), false);
  assert.equal(isAppleDevice('samsung-s26'), false);
  assert.equal(isAppleDevice('play-feature-graphic'), false);
});

test('switchToAppStore and switchToPlayStore automatically switch devices bidirectionally', () => {
  const store = useEditorStore.getState();

  // 1. From Android to App Store -> should become iPhone
  store.updateGlobalSettings({ targetSize: 'android-tall' });
  assert.equal(useEditorStore.getState().globalSettings.targetSize, 'android-tall');
  store.switchToAppStore();
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_IPHONE_SIZE);

  // Calling switchToAppStore when already on iPhone should keep it
  store.switchToAppStore();
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_IPHONE_SIZE);

  // 2. From iPhone to Play Store -> should become Android
  store.switchToPlayStore();
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_ANDROID_SIZE);

  // Calling switchToPlayStore when already on Android should keep it
  store.switchToPlayStore();
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_ANDROID_SIZE);

  // 3. ensurePlatformForStore
  store.ensurePlatformForStore('app-store');
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_IPHONE_SIZE);
  store.ensurePlatformForStore('play-store');
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_ANDROID_SIZE);
});

test('getBadgeStore tags App Store and Google Play badges and store switches platform on applyBadge', () => {
  const appStoreBadge = BADGE_PRESETS.find(p => p.config.store === 'app-store')?.config;
  const playStoreBadge = BADGE_PRESETS.find(p => p.config.store === 'play-store')?.config;

  assert.ok(appStoreBadge, 'App Store badge preset must exist');
  assert.ok(playStoreBadge, 'Play Store badge preset must exist');
  assert.equal(getBadgeStore(appStoreBadge), 'app-store');
  assert.equal(getBadgeStore(playStoreBadge), 'play-store');

  const store = useEditorStore.getState();

  // Set target size to Android
  store.updateGlobalSettings({ targetSize: 'android-tall' });
  assert.equal(useEditorStore.getState().globalSettings.targetSize, 'android-tall');

  // Applying an App Store badge to all must switch targetSize to iPhone
  store.applyBadgeToAll(appStoreBadge);
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_IPHONE_SIZE);

  // Applying a Play Store badge to all must switch targetSize to Android
  store.applyBadgeToAll(playStoreBadge);
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_ANDROID_SIZE);

  // updateBadge single canvas must also switch platform
  store.updateBadge(useEditorStore.getState().canvases[0].id, appStoreBadge);
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_IPHONE_SIZE);
  store.updateBadge(useEditorStore.getState().canvases[0].id, playStoreBadge);
  assert.equal(useEditorStore.getState().globalSettings.targetSize, DEFAULT_ANDROID_SIZE);
});

test('applyAsoCopy chooses Google Play badges and copy for Android, and App Store badges for iPhone', () => {
  const store = useEditorStore.getState();
  const canvases = store.canvases;

  // With Android targetSize
  const androidCanvases = applyAsoCopy(canvases, 'fitness habits', 'high-converting', 'android-tall');
  assert.ok(androidCanvases[0].badge?.text.includes('Google Play') || getBadgeStore(androidCanvases[0].badge) === 'play-store');

  // With iPhone targetSize
  const iosCanvases = applyAsoCopy(canvases, 'fitness habits', 'high-converting', 'ios-6.5');
  assert.ok(iosCanvases[0].badge?.text.includes('App Store') || getBadgeStore(iosCanvases[0].badge) === 'app-store');
});

test('UI components contain bidirectional platform switching handlers and no emojis', async () => {
  const storePreviewSource = await readFile(new URL('../src/components/StoreContextPreview.tsx', import.meta.url), 'utf8');
  assert.ok(storePreviewSource.includes('switchToAppStore'), 'StoreContextPreview must use switchToAppStore');
  assert.ok(storePreviewSource.includes('switchToPlayStore'), 'StoreContextPreview must use switchToPlayStore');
  assert.ok(storePreviewSource.includes('DEFAULT_IPHONE_SIZE'), 'StoreContextPreview must use DEFAULT_IPHONE_SIZE');
  assert.ok(storePreviewSource.includes('DEFAULT_ANDROID_SIZE'), 'StoreContextPreview must use DEFAULT_ANDROID_SIZE');

  const sidebarSource = await readFile(new URL('../src/components/Sidebar.tsx', import.meta.url), 'utf8');
  assert.ok(sidebarSource.includes('switchToAppStore'), 'Sidebar must use switchToAppStore');
  assert.ok(sidebarSource.includes('switchToPlayStore'), 'Sidebar must use switchToPlayStore');
  assert.ok(sidebarSource.includes('IoLogoApple'), 'Sidebar must render Apple store icon');
  assert.ok(sidebarSource.includes('IoLogoGooglePlaystore'), 'Sidebar must render Google Play icon');

  const canvasEditorSource = await readFile(new URL('../src/components/CanvasEditor.tsx', import.meta.url), 'utf8');
  assert.ok(canvasEditorSource.includes('switchToAppStore'), 'CanvasEditor must use switchToAppStore');
  assert.ok(canvasEditorSource.includes('switchToPlayStore'), 'CanvasEditor must use switchToPlayStore');
  assert.ok(canvasEditorSource.includes('getBadgeStore'), 'CanvasEditor must use getBadgeStore');

  // Check no emojis in UI files
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.ok(!emojiRegex.test(storePreviewSource), 'StoreContextPreview must not contain emojis');
  assert.ok(!emojiRegex.test(sidebarSource), 'Sidebar must not contain emojis');
  assert.ok(!emojiRegex.test(canvasEditorSource), 'CanvasEditor must not contain emojis');
});

test('badge coordinates have dedicated X and Y input fields in CanvasEditor', async () => {
  const canvasEditorSource = await readFile(new URL('../src/components/CanvasEditor.tsx', import.meta.url), 'utf8');

  // Input fields for X and Y position
  assert.ok(canvasEditorSource.includes('badge-x-'), 'CanvasEditor must have an input field for X position');
  assert.ok(canvasEditorSource.includes('badge-y-'), 'CanvasEditor must have an input field for Y position');
  assert.ok(canvasEditorSource.includes('X Position'), 'CanvasEditor must have an X Position label');
  assert.ok(canvasEditorSource.includes('Y Position'), 'CanvasEditor must have a Y Position label');
  assert.ok(canvasEditorSource.includes('isEditingBadgeX'), 'CanvasEditor must manage state for editing badge X');
  assert.ok(canvasEditorSource.includes('isEditingBadgeY'), 'CanvasEditor must manage state for editing badge Y');

  // Ensure store updates offsetX and offsetY accurately
  const store = useEditorStore.getState();
  const targetCanvasId = store.canvases[0].id;
  store.updateCanvas(targetCanvasId, {
    badge: {
      enabled: true,
      icon: 'star',
      text: 'Coordinates Test',
      style: 'pill-glass',
      offsetX: 42,
      offsetY: -18,
    },
  });

  const updatedBadge = useEditorStore.getState().canvases.find(c => c.id === targetCanvasId)?.badge;
  assert.equal(updatedBadge?.offsetX, 42, 'offsetX must be 42');
  assert.equal(updatedBadge?.offsetY, -18, 'offsetY must be -18');
});


