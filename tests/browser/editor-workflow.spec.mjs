import { test, expect } from '@playwright/test';
import { inspectorTab } from './inspector.mjs';

const image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
async function seed(page, count = 3, overrides = {}, options = {}) {
  await page.addInitScript(({ count, image, overrides, options }) => {
    const canvases = Array.from({ length: count }, (_, i) => ({ id: `design-${i + 1}`, title: `Benefit ${i + 1}`, subtitle: '', imageSrc: image, layout: 'basic-top', backgroundColor: '#f2f0eb', textColor: '#172326', ...(overrides[i] || {}) }));
    const globalSettings = { targetSize: 'ios-6.5', theme: 'light', activeLanguage: options.language || 'en' };
    const project = { id: options.projectId || 'workflow-project', name: 'Workflow project', canvases, globalSettings, createdAt: 1, updatedAt: 1 };
    localStorage.setItem('screenshot-editor-storage', JSON.stringify({ state: { canvases, globalSettings, projects: [project], activeProjectId: project.id, selectedCanvasId: canvases[0].id }, version: 0 }));
  }, { count, image, overrides, options });
  await page.goto('/');
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue(overrides[0]?.title ?? 'Benefit 1');
}
async function order(page) { return page.locator('[data-reorder-id]').evaluateAll(cards => cards.map(card => card.dataset.reorderId)); }
async function saved(page) { await expect(page.getByRole('status').filter({ hasText: 'Saved locally' })).toBeVisible(); }

test('the first export uses the hydrated language even when reopening the default project', async ({ page }) => {
  await seed(page, 1, { 0: { title: 'Beneficio', translations: { en: { title: 'Benefit', subtitle: '' }, es: { title: 'Beneficio', subtitle: '' } } } }, { projectId: 'default-project', language: 'es' });
  await page.getByRole('button', { name: 'Export screenshots', exact: true }).click();
  await expect(page.getByLabel('Spanish', { exact: true })).toBeChecked();
  await expect(page.getByLabel('English', { exact: true })).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Export 1 PNG', exact: true })).toBeEnabled();
});

test('inspector tabs preserve navigation and scroll across designs, with readable laptop and mobile controls', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await seed(page);
  const headline = page.getByLabel('Headline', { exact: true });
  const bounds = await headline.boundingBox();
  expect(bounds.y + bounds.height).toBeLessThan(768);
  await expect(page.getByRole('tab', { name: 'Content', exact: true })).toHaveAttribute('aria-selected', 'true');
  await inspectorTab(page, 'Design');
  await expect(page.getByRole('button', { name: 'Apply this look to all screenshots', exact: true })).toHaveCount(1);
  await page.getByText('Reusable templates', { exact: true }).click();
  await page.getByLabel('Template name').fill('My saved look');
  const scroll = page.locator('[class*="inspectorScroll"]');
  const designScroll = await scroll.evaluate(el => el.scrollTop);
  expect(designScroll).toBeGreaterThan(400);
  await page.getByRole('button', { name: 'Select slide 2', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Design', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect.poll(() => scroll.evaluate(el => el.scrollTop)).toBe(designScroll);
  await inspectorTab(page, 'Content');
  await expect(headline).toBeVisible();
  await expect.poll(() => scroll.evaluate(el => el.scrollTop)).toBe(0);
  await inspectorTab(page, 'Design');
  await expect.poll(() => scroll.evaluate(el => el.scrollTop)).toBe(designScroll);
  const tabBounds = await page.getByRole('tab', { name: 'Design', exact: true }).boundingBox();
  expect(tabBounds.y).toBeLessThan(160);
  await inspectorTab(page, 'Output');
  await expect(page.getByRole('region', { name: 'Export readiness' })).toContainText('Ready to export');
  await page.getByRole('tab', { name: 'Output', exact: true }).press('Home');
  await expect(page.getByRole('tab', { name: 'Content', exact: true })).toBeFocused();
  await page.getByRole('tab', { name: 'Content', exact: true }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Design', exact: true })).toBeFocused();
  await inspectorTab(page, 'Content');
  await page.screenshot({ animations: 'disabled', path: 'test-results/editor-content-light.png' });
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click();
  await page.screenshot({ animations: 'disabled', path: 'test-results/editor-content-dark.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await inspectorTab(page, 'Output');
  await expect(page.getByLabel('Canvas size')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ animations: 'disabled', path: 'test-results/editor-output-mobile.png' });
});

test('keyboard reordering is atomic, cancels cleanly, preserves selection and persists after reload', async ({ page }) => {
  await seed(page);
  await page.getByRole('button', { name: 'Select slide 2', exact: true }).click();
  const handle = page.getByRole('button', { name: 'Reorder slide 1', exact: true });
  await handle.press('Space');
  await handle.press('ArrowDown');
  await handle.press('ArrowDown');
  await handle.press('Enter');
  await expect.poll(() => order(page)).toEqual(['design-2', 'design-3', 'design-1']);
  await expect(page.getByRole('button', { name: 'Reorder slide 3', exact: true })).toBeFocused();
  await expect(page.locator('#workspace-design-2')).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: 'Moved slide 1 to position 3 of 3.' })).toHaveText('Moved slide 1 to position 3 of 3.');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect.poll(() => order(page)).toEqual(['design-1', 'design-2', 'design-3']);
  await page.getByRole('button', { name: 'Reorder slide 1', exact: true }).press('Space');
  await page.getByRole('button', { name: 'Reorder slide 1', exact: true }).press('ArrowDown');
  await page.getByRole('button', { name: 'Reorder slide 1', exact: true }).press('Escape');
  await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  await saved(page);
  await page.reload();
  await expect.poll(() => order(page)).toEqual(['design-2', 'design-3', 'design-1']);
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('Benefit 2');
});

test('pointer handles reorder, cancel without edits, and scroll toward off-screen designs', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1400 });
  await seed(page);
  const first = await page.getByRole('button', { name: 'Reorder slide 1', exact: true }).boundingBox();
  const third = await page.locator('[data-reorder-id="design-3"]').boundingBox();
  await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2);
  await page.mouse.down();
  await page.mouse.move(first.x + first.width / 2, third.y + third.height - 5, { steps: 10 });
  await expect(page.locator('[class*="insertionMarker"]')).toBeVisible();
  await page.mouse.up();
  await expect.poll(() => order(page)).toEqual(['design-2', 'design-3', 'design-1']);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  const again = await page.getByRole('button', { name: 'Reorder slide 1', exact: true }).boundingBox();
  await page.mouse.move(again.x + again.width / 2, again.y + again.height / 2);
  await page.mouse.down();
  await page.mouse.move(again.x + again.width / 2, third.y + third.height - 5, { steps: 10 });
  await page.keyboard.press('Escape');
  await page.mouse.up();
  await expect.poll(() => order(page)).toEqual(['design-1', 'design-2', 'design-3']);
  await expect(page.getByRole('button', { name: 'Redo', exact: true })).toBeEnabled();
  // Add enough slides to require edge scrolling, through the real workspace actions.
  for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Add blank slide', exact: true }).click();
  const list = page.locator('[class*="thumbnails"]');
  await list.evaluate(el => { el.scrollTop = 0; });
  const start = await page.getByRole('button', { name: 'Reorder slide 1', exact: true }).boundingBox();
  const listBounds = await list.boundingBox();
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(start.x + start.width / 2, listBounds.y + listBounds.height - 4, { steps: 5 });
  await expect.poll(() => list.evaluate(el => el.scrollTop)).toBeGreaterThan(200);
  await page.keyboard.press('Escape');
  await page.mouse.up();
  expect((await order(page))[0]).toBe('design-1');
});

test('touch dragging uses the same reorder action', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 1366, height: 1400 }, hasTouch: true });
  const page = await context.newPage();
  try {
    await seed(page);
    const start = await page.getByRole('button', { name: 'Reorder slide 1', exact: true }).boundingBox();
    const target = await page.locator('[data-reorder-id="design-3"]').boundingBox();
    const session = await context.newCDPSession(page);
    const x = start.x + start.width / 2;
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: start.y + start.height / 2 }] });
    await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: target.y + target.height - 5 }] });
    await expect(page.locator('[class*="insertionMarker"]')).toBeVisible();
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect.poll(() => order(page)).toEqual(['design-2', 'design-3', 'design-1']);
  } finally { await context.close(); }
});

test('export fixes target content and translations, preserve choices, and reset choices on project changes', async ({ page }) => {
  await seed(page, 3, {
    0: { imageSrc: null },
    1: { title: '', translations: { en: { title: '', subtitle: '' }, es: { title: '', subtitle: '' } } },
    2: { translations: { en: { title: 'Benefit 3', subtitle: '' }, es: { title: 'Beneficio 3', subtitle: '' } } },
  });
  await page.getByRole('button', { name: 'Export screenshots', exact: true }).click();
  await page.getByLabel('App Store · iPad').check();
  await page.getByLabel('Spanish', { exact: true }).check();
  await page.getByRole('button', { name: 'Fix Slide 1 (en): Replace the missing screenshot.', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Add missing screenshot', exact: true })).toBeFocused();
  await page.getByLabel('Replace slide screenshot', { exact: true }).setInputFiles({ name: 'screen.png', mimeType: 'image/png', buffer: Buffer.from(image.split(',')[1], 'base64') });
  await page.getByRole('button', { name: 'Return to export', exact: true }).click();
  await expect(page.getByLabel('App Store · iPad')).toBeChecked();
  await expect(page.getByLabel('Spanish', { exact: true })).toBeChecked();
  await page.getByRole('button', { name: 'Fix Slide 2 (en): Write a headline before exporting.', exact: true }).click();
  await expect(page.getByLabel('Headline', { exact: true })).toBeFocused();
  await page.getByLabel('Headline', { exact: true }).fill('A clear second benefit');
  await page.getByRole('button', { name: 'Return to export', exact: true }).click();
  await page.getByRole('button', { name: 'Fix Slide 1 (es): Add the es translation first.', exact: true }).click();
  const translatedTitle = page.getByLabel('Title (Spanish) for slide 1', { exact: true });
  await expect(translatedTitle).toBeFocused();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('button', { name: 'Return to export', exact: true }).click();
  await page.getByRole('button', { name: 'Fix Slide 2 (es): Write a headline before exporting.', exact: true }).click();
  await expect(page.getByLabel('Title (Spanish) for slide 2', { exact: true })).toBeFocused();
  await translatedTitle.fill('Un beneficio claro');
  await page.getByLabel('Title (Spanish) for slide 2', { exact: true }).fill('Un segundo beneficio');
  await page.getByRole('button', { name: 'Apply & Save Translations', exact: true }).click();
  await page.getByRole('button', { name: 'Return to export', exact: true }).click();
  await expect(page.getByLabel('App Store · iPad')).toBeChecked();
  await expect(page.getByLabel('English', { exact: true })).toBeChecked();
  await expect(page.getByText('A few things need your attention')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Export 12 PNGs', exact: true })).toBeEnabled();
  await page.getByRole('button', { name: 'Back to editing', exact: true }).click();
  await page.getByRole('button', { name: 'Workflow project', exact: true }).click();
  await page.getByRole('button', { name: /New Project/i }).click();
  await page.getByPlaceholder('Enter new project name (e.g. Finance App v2)...').fill('Fresh project');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.getByRole('button', { name: 'Close projects', exact: true }).click();
  await inspectorTab(page, 'Content');
  await page.getByLabel('Headline', { exact: true }).fill('A new project');
  await page.getByRole('button', { name: 'Export screenshots', exact: true }).click();
  await expect(page.getByLabel('Each design at its own size')).toBeChecked();
  await expect(page.getByLabel('App Store · iPad')).not.toBeChecked();
  await expect(page.getByLabel('Spanish', { exact: true })).toHaveCount(0);
});
