import { test, expect } from '@playwright/test';
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';

async function screenshots(page, count = 2) {
  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 400; canvas.height = 850;
    const context = canvas.getContext('2d'); context.fillStyle = '#dff1e8'; context.fillRect(0, 0, 400, 850);
    context.fillStyle = '#203c32'; context.font = 'bold 32px Arial'; context.fillText('Your daily focus', 25, 100);
    context.font = '18px Arial'; context.fillText('A little progress, every day.', 25, 135);
    for (let i = 0; i < 4; i++) {
      context.fillStyle = '#ffffff'; context.fillRect(25, 180 + i * 130, 350, 105);
      context.fillStyle = '#306646'; context.fillRect(42, 203 + i * 130, 32, 32);
      context.fillStyle = '#45604e'; context.fillText(['Plan your day', 'Read a chapter', 'Take a walk', 'Reflect & reset'][i], 92, 226 + i * 130);
    }
    return canvas.toDataURL().split(',')[1];
  });
  return Array.from({ length: count }, (_, index) => ({ name: `screen-${index}.png`, mimeType: 'image/png', buffer: Buffer.from(png, 'base64') }));
}
async function upload(page, count = 2) {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Upload screenshots', exact: true })).toBeVisible();
  await page.locator('input[type=file][multiple]').setInputFiles(await screenshots(page, count));
  await expect(page.getByLabel('Headline', { exact: true })).toBeVisible();
}
async function saved(page) { await expect(page.getByRole('status').filter({ hasText: 'Saved locally' })).toBeVisible(); }

// Real browser coverage: persisted image bytes, selection, history, renderer and PNG output.
test('upload, style, edit later slide, reopen and export opaque PNGs without changing the editor', async ({ page }) => {
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  await upload(page);
  await page.getByLabel('Headline', { exact: true }).fill('Find your daily focus');
  await page.getByRole('button', { name: 'Select slide 2', exact: true }).click();
  await page.getByLabel('Headline', { exact: true }).fill('Build habits that last');
  await page.getByRole('button', { name: 'Apply Clean Dark' }).click();
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('Build habits that last');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Apply Clean Light' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Apply Bold Gradient' }).click();
  await saved(page);
  await page.screenshot({ path: 'test-results/workspace.png', fullPage: true });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Select slide 2', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Select slide 2', exact: true }).click();
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('Build habits that last');
  await expect(page.locator('[id^="workspace-"] img').first()).toBeVisible();
  expect(await page.locator('[id^="workspace-"] img').first().evaluate(image => image.naturalWidth)).toBe(400);
  const before = await page.getByLabel('Headline', { exact: true }).inputValue();
  await page.getByRole('button', { name: 'Export screenshots', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /^Export 2 PNGs$/ }).click();
  const download = await downloadPromise;
  const zip = await JSZip.loadAsync(await readFile(await download.path()));
  const files = Object.values(zip.files).filter(file => file.name.endsWith('.png'));
  expect(files).toHaveLength(2);
  for (const file of files) {
    const png = await file.async('nodebuffer');
    expect(png.readUInt32BE(16)).toBe(1320); expect(png.readUInt32BE(20)).toBe(2868);
    expect(png[25]).toBe(2); // RGB PNG, no alpha channel.
    expect(png.length).toBeGreaterThan(15000);
  }
  await files[0].async('nodebuffer').then(async data => { const { writeFile } = await import('node:fs/promises'); await writeFile('test-results/export.png', data); });
  await expect(page.getByText('2 PNGs exported successfully.')).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue(before);
  expect(errors).toEqual([]);
});

test('portable project includes images and reimports into a fresh browser context', async ({ page, browser }) => {
  await upload(page, 1);
  await page.getByLabel('Headline', { exact: true }).fill('A portable project');
  await saved(page);
  await page.getByRole('button', { name: 'Default Project', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTitle('Export Project (.launchshot file)').click();
  const download = await downloadPromise;
  const path = await download.path();
  const payload = JSON.parse(await readFile(path, 'utf8'));
  expect(payload.version).toBe('2.0.0');
  expect(payload.project.canvases[0].imageSrc).toMatch(/^data:image\/png;base64,/);
  const context = await browser.newContext();
  const other = await context.newPage();
  await other.goto('http://127.0.0.1:3000');
  await other.getByRole('button', { name: 'Default Project', exact: true }).click();
  await other.locator('input[accept=".launchshot,.json"]').setInputFiles({ name: 'test.launchshot', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(payload)) });
  await expect(other.getByText('Project imported successfully!')).toBeVisible();
  await other.keyboard.press('Escape');
  await other.getByRole('button', { name: 'Close projects' }).click();
  await expect(other.getByLabel('Headline', { exact: true })).toHaveValue('A portable project');
  await context.close();
});

test('invalid images, empty headlines and storage failures are actionable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Upload screenshots', exact: true })).toBeVisible();
  await page.locator('input[type=file][multiple]').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('broken') });
  await expect(page.getByText(/Could not read broken.png/)).toBeVisible();
  await page.locator('input[type=file][multiple]').setInputFiles(await screenshots(page, 1));
  await page.getByRole('button', { name: 'Export screenshots', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Export 1 PNG', exact: true })).toBeDisabled();
  await expect(page.getByText(/Write a headline before exporting/)).toBeVisible();
  await page.getByRole('button', { name: 'Back to editing' }).click();
  await saved(page);
  await page.evaluate(() => {
    window.originalPut = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function () { throw new DOMException('Full', 'QuotaExceededError'); };
  });
  await page.getByLabel('Headline', { exact: true }).fill('Still here after a failed save');
  await expect(page.getByText('Could not save', { exact: true })).toBeVisible();
  await page.evaluate(() => { IDBObjectStore.prototype.put = window.originalPut; });
  await page.getByRole('button', { name: 'Retry save' }).click();
  await saved(page);
  await page.reload();
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('Still here after a failed save');
});

test('partial export lists the failed slide, retries, and keeps the selected slide', async ({ page }) => {
  await upload(page);
  await page.getByLabel('Headline', { exact: true }).fill('Start with a clear plan');
  await page.getByRole('button', { name: 'Select slide 2', exact: true }).click();
  await page.getByLabel('Headline', { exact: true }).fill('Make room for what matters');
  const brokenSource = await page.locator('[id^="workspace-"] img').first().getAttribute('src');
  await page.evaluate(source => {
    window.originalDecode = HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode = function () {
      if (this.src === source) return Promise.reject(new Error('Image unavailable'));
      return window.originalDecode.call(this);
    };
  }, brokenSource);
  await page.getByRole('button', { name: 'Export screenshots', exact: true }).click();
  const partial = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export 2 PNGs', exact: true }).click();
  await partial;
  await expect(page.getByText('1 PNGs exported; 1 failed.')).toBeVisible();
  await expect(page.getByText(/Slide 2 · en · .*Image unavailable/)).toBeVisible();
  await page.evaluate(() => { HTMLImageElement.prototype.decode = window.originalDecode; });
  const retry = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Retry export' }).click();
  await retry;
  await expect(page.getByText('2 PNGs exported successfully.')).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('Make room for what matters');
});

test('translation failure, five-slide listing and long headlines at laptop size', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await upload(page, 5);
  for (let i = 1; i <= 5; i++) {
    await page.getByRole('button', { name: `Select slide ${i}`, exact: true }).click();
    await page.getByLabel('Headline', { exact: true }).fill(i === 5 ? 'Bring your ideas together, stay focused on the work that matters, and make a little progress every single day' : `A clear benefit for slide ${i}`);
  }
  await page.getByRole('button', { name: 'Languages & translations' }).click();
  await page.getByRole('button', { name: /^Spanish 0\/5$/ }).click();
  await page.route('https://translate.googleapis.com/**', route => route.fulfill({ status: 503, body: '{}' }));
  await page.route('https://api.mymemory.translated.net/**', route => route.fulfill({ status: 503, body: '{}' }));
  await page.getByRole('button', { name: 'Auto-Translate Spanish', exact: true }).click();
  await expect(page.getByText(/Failed to translate|Translation failed|translation failed/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /^Spanish 0\/5$/ })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Listing preview' })).toBeVisible();
  expect(await page.locator('[id^="preview-"]').count()).toBe(5);
  await page.screenshot({ path: 'test-results/listing-preview.png' });
  await page.getByRole('button', { name: 'Close preview' }).click();
  await page.getByRole('button', { name: 'Export screenshots', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export 5 PNGs', exact: true }).click();
  const download = await downloadPromise;
  const zip = await JSZip.loadAsync(await readFile(await download.path()));
  expect(Object.values(zip.files).filter(file => file.name.endsWith('.png'))).toHaveLength(5);
  const last = Object.values(zip.files).find(file => file.name.endsWith('05.png'));
  const { writeFile } = await import('node:fs/promises');
  await writeFile('test-results/long-headline.png', await last.async('nodebuffer'));
});

test('legacy projects retain copy and offer replacement for an expired image', async ({ page }) => {
  await page.addInitScript(() => {
    const canvas = { id: 'old-slide', title: 'Keep this headline', subtitle: 'Keep this subtitle', imageSrc: 'blob:http://old-session/expired', layout: 'basic-top', backgroundColor: '#f2f0eb', textColor: '#172326' };
    localStorage.setItem('screenshot-editor-storage', JSON.stringify({ state: { canvases: [canvas], activeProjectId: 'legacy', projects: [{ id: 'legacy', name: 'Legacy project', canvases: [canvas], globalSettings: { targetSize: 'ios-6.5' }, createdAt: 1, updatedAt: 1 }] }, version: 0 }));
  });
  await page.goto('/');
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('Keep this headline');
  await expect(page.getByRole('button', { name: 'Add missing screenshot' })).toBeVisible();
  await page.locator('input[type=file]:not([multiple])').setInputFiles((await screenshots(page, 1))[0]);
  await expect(page.getByRole('button', { name: 'Replace screenshot' })).toBeVisible();
  await saved(page);
});

test('advanced layout edits target the selected slide and return to the focused workspace', async ({ page }) => {
  await upload(page);
  await page.getByRole('button', { name: 'Select slide 2', exact: true }).click();
  await page.getByRole('button', { name: 'Advanced tools', exact: true }).click();
  await page.getByRole('button', { name: 'Single Mockup', exact: true }).click();
  await page.getByRole('button', { name: 'Back to workspace', exact: true }).click();
  await expect(page.locator('[id^="workspace-"] [data-render-text]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Select slide 1', exact: true }).click();
  await page.getByLabel('Headline', { exact: true }).fill('First slide still has a headline');
  await expect(page.locator('[id^="workspace-"] [data-render-text]')).toHaveText('First slide still has a headline');
});
