import { test, expect } from '@playwright/test';
import { Buffer } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';

async function uploadImage(page) {
  const base64 = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 400; canvas.height = 850;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#4d8860'; ctx.fillRect(0, 0, 400, 850);
    ctx.fillStyle = '#fff'; ctx.font = '32px sans-serif'; ctx.fillText('A clear view', 30, 100);
    return canvas.toDataURL().split(',')[1];
  });
  await page.getByLabel('Replace slide screenshot', { exact: true }).setInputFiles({ name: 'screen.png', mimeType: 'image/png', buffer: Buffer.from(base64, 'base64') });
}
async function add(page, kind) {
  const menu = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Add design$/ }) });
  if (await menu.getAttribute('open') === null) await menu.locator('summary').click();
  await menu.getByRole('button', { name: `Add ${kind}`, exact: true }).click();
}

test('every selectable font loads and text stays above overlapping phone frames', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Headline', { exact: true }).fill('Your ideas deserve space to grow and shine');
  const fonts = page.getByLabel('Font family', { exact: true });
  const ids = await fonts.locator('option').evaluateAll(options => options.map(option => option.value));
  const title = page.locator('[id^="workspace-"] [data-render-text]').first();
  for (const id of ids) {
    await fonts.selectOption(id);
    const loaded = await title.evaluate(async element => {
      const style = getComputedStyle(element);
      const faces = await document.fonts.load(`${style.fontWeight} ${style.fontSize} ${style.fontFamily.split(',')[0]}`, element.textContent);
      return faces.length > 0 && faces.every(face => face.status === 'loaded');
    });
    expect(loaded, id).toBe(true);
  }
  await fonts.selectOption('playfair');
  await page.getByRole('button', { name: 'Use this font on all slides' }).click();
  await page.getByText('Layout & device', { exact: true }).click();
  await page.getByLabel('Text box width').fill('100');
  for (const layout of ['banner-stack-right', 'banner-kinetic-stack']) {
    await page.getByLabel('Slide layout').selectOption(layout);
    const overlap = await page.locator('[id^="workspace-"]').evaluate(stage => {
      const text = stage.querySelector('[data-render-text]') || stage.querySelector('.group\\/textbox span');
      const box = text.getBoundingClientRect();
      let samples = 0, covered = 0;
      for (let y = box.top + 2; y < box.bottom; y += 4) for (let x = box.left + 2; x < box.right; x += 4) {
        const stack = document.elementsFromPoint(x, y), t = stack.indexOf(text), p = stack.findIndex(el => el.matches('[data-device-frame]'));
        if (t >= 0 && p >= 0) { samples++; if (p < t) covered++; }
      }
      return { samples, covered };
    });
    expect(overlap.samples).toBeGreaterThan(0);
    expect(overlap.covered).toBe(0);
  }
  await expect(page.getByRole('status').filter({ hasText: 'Saved locally' })).toBeVisible();
  await page.reload();
  await expect(fonts).toHaveValue('playfair');
});

test('mixed designs persist and export independent dimensions and transparent tablet mockups', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Headline', { exact: true }).fill('Make room for progress');
  await uploadImage(page);
  await add(page, 'banner');
  await page.getByLabel('Headline', { exact: true }).fill('A new perspective');
  await page.getByLabel('Font family').selectOption('playfair');
  await page.getByLabel('Width (px)').fill('900');
  await page.getByLabel('Height (px)').fill('450');
  await page.getByRole('button', { name: 'Apply dimensions' }).click();
  await expect(page.locator('[id^="workspace-"] [data-device-frame]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.getByLabel('Width (px)')).toHaveValue('1200');
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  await expect(page.getByLabel('Width (px)')).toHaveValue('900');
  await add(page, 'mockup');
  await uploadImage(page);
  await page.getByLabel('Device model').selectOption('ipad-12.9');
  await page.getByLabel('Transparent background').check();
  const frame = await page.locator('[id^="workspace-"] [data-device-frame]').boundingBox();
  expect(frame.width / frame.height).toBeCloseTo(2048 / 2732, 2);
  await expect(page.getByRole('status').filter({ hasText: 'Saved locally' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Select slide 2', exact: true }).click();
  await expect(page.getByLabel('Width (px)')).toHaveValue('900');
  await expect(page.getByLabel('Font family')).toHaveValue('playfair');
  await page.getByRole('button', { name: 'Select slide 3', exact: true }).click();
  await expect(page.getByLabel('Transparent background')).toBeChecked();
  await page.getByRole('button', { name: 'Fit', exact: true }).click();
  await page.screenshot({ path: 'test-results/mixed-mockup-workspace.png' });
  await page.getByRole('button', { name: 'Export designs', exact: true }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export 3 PNGs', exact: true }).click();
  const zip = await JSZip.loadAsync(await readFile(await (await downloaded).path()));
  const files = Object.values(zip.files).filter(file => file.name.endsWith('.png'));
  expect(files).toHaveLength(3);
  for (const file of files) {
    const bytes = await file.async('nodebuffer');
    const expected = file.name.includes('/banner-') ? [900, 450] : file.name.includes('/mockup-') ? [1080, 1080] : [1320, 2868];
    expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual(expected);
    const pixels = await page.evaluate(async base64 => {
      const image = new Image(); image.src = `data:image/png;base64,${base64}`; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
      return { corner: ctx.getImageData(0, 0, 1, 1).data[3], center: ctx.getImageData(image.width / 2, image.height / 2, 1, 1).data[3] };
    }, bytes.toString('base64'));
    expect(pixels.corner).toBe(file.name.includes('/mockup-') ? 0 : 255);
    expect(pixels.center).toBe(255);
  }
  await expect(page.getByText('3 PNGs exported successfully.')).toBeVisible();
});

test('banner media, custom-size validation, and multiple tablet frames use the selected design', async ({ page }) => {
  await page.goto('/');
  await add(page, 'banner');
  await page.getByLabel('Headline', { exact: true }).fill('Make something memorable');
  await page.getByLabel('Banner media').selectOption('image');
  await uploadImage(page);
  await page.getByText('Layout & device', { exact: true }).click();
  await page.getByLabel('Slide layout').selectOption('banner-split');
  await expect(page.locator('[id^="workspace-"] [data-banner-image] img')).toBeVisible();
  await expect(page.locator('[id^="workspace-"] [data-device-frame]')).toHaveCount(0);
  await page.getByLabel('Width (px)').fill('4097');
  await page.getByRole('button', { name: 'Apply dimensions' }).click();
  expect(await page.getByLabel('Width (px)').evaluate(input => input.validity.rangeOverflow)).toBe(true);
  await page.getByLabel('Width (px)').fill('1200');
  await page.getByLabel('Banner media').selectOption('device');
  await expect(page.locator('[id^="workspace-"] [data-device-frame]')).toHaveCount(1);
  await page.getByRole('button', { name: 'Fit', exact: true }).click();
  await page.screenshot({ path: 'test-results/banner-workspace.png' });
  await add(page, 'mockup');
  await uploadImage(page);
  await page.getByLabel('Device model').selectOption('ipad-12.9');
  await page.getByText('Layout & device', { exact: true }).click();
  await page.getByLabel('Slide layout').selectOption('trio-row');
  await expect(page.locator('[id^="workspace-"] [data-device-frame]')).toHaveCount(3);
  const framesFit = await page.locator('[id^="workspace-"]').evaluate(stage => {
    const bounds = stage.getBoundingClientRect();
    return Array.from(stage.querySelectorAll('[data-device-frame]')).every(frame => {
      const box = frame.getBoundingClientRect();
      return box.left >= bounds.left && box.right <= bounds.right && box.top >= bounds.top && box.bottom <= bounds.bottom;
    });
  });
  expect(framesFit).toBe(true);
  await page.getByRole('button', { name: 'Select slide 2', exact: true }).click();
  await expect(page.getByLabel('Slide layout')).toHaveValue('banner-split');
});
