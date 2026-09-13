import { test, expect } from '@playwright/test';
import { Buffer } from 'node:buffer';
import { readFile, writeFile } from 'node:fs/promises';
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
async function openLayout(page) {
  const group = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Layout & device$/ }) });
  if (await group.getAttribute('open') === null) await group.locator('summary').click();
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
  await openLayout(page);
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
  await page.getByRole('button', { name: 'Select design 2', exact: true }).click();
  await expect(page.getByLabel('Width (px)')).toHaveValue('900');
  await expect(page.getByLabel('Font family')).toHaveValue('playfair');
  await page.getByRole('button', { name: 'Select design 3', exact: true }).click();
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
  await openLayout(page);
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
  await openLayout(page);
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
  await page.getByRole('button', { name: 'Select design 2', exact: true }).click();
  await expect(page.getByLabel('Slide layout')).toHaveValue('banner-split');
});

test('design removal is visible, keyboard accessible, undoable, and image clearing persists', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Headline', { exact: true }).fill('Keep this headline');
  await uploadImage(page);
  await page.getByRole('button', { name: 'Clear image', exact: true }).click();
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('Keep this headline');
  await expect(page.locator('[id^="workspace-"] [data-device-frame] img')).toHaveCount(0);
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.locator('[id^="workspace-"] [data-device-frame] img')).toHaveCount(1);
  await add(page, 'mockup');
  await uploadImage(page);
  await page.getByRole('button', { name: 'Apply Dark device trio' }).click();
  await expect(page.locator('[id^="workspace-"] [data-device-frame] img')).toHaveCount(3);
  await page.getByRole('button', { name: 'Clear secondary image', exact: true }).click();
  await page.getByRole('button', { name: 'Clear third image', exact: true }).click();
  await expect(page.locator('[id^="workspace-"] [data-device-frame] img')).toHaveCount(1);
  await expect(page.getByRole('status').filter({ hasText: 'Saved locally' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Select design 2', exact: true }).click();
  await expect(page.locator('[id^="workspace-"] [data-device-frame] img')).toHaveCount(1);
  await page.getByRole('button', { name: 'Duplicate design 2', exact: true }).click();
  const remove = page.getByRole('button', { name: 'Delete design 3', exact: true });
  await remove.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Select design 2', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Delete design 2', exact: true }).click();
  await page.getByRole('button', { name: 'Delete design 1', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Create a blank design', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('Keep this headline');
  await expect(page.locator('[id^="workspace-"] [data-device-frame] img')).toHaveCount(1);
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Create a blank design', exact: true })).toBeVisible();
});

test('six visual presets preserve copy and export positioned media at the chosen size', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Delete design 1', exact: true }).click();
  const presets = [
    ['banner', 'Clean split image'], ['banner', 'Bold centered headline'], ['banner', 'Dark layered devices'],
    ['mockup', 'Clean single device'], ['mockup', 'Gradient device pair'], ['mockup', 'Dark device trio'],
  ];
  const previewBounds = [];
  for (const [index, [kind, name]] of presets.entries()) {
    await add(page, kind);
    // Preview samples must not become real project content.
    if (kind === 'banner') await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('');
    await uploadImage(page);
    if (kind === 'banner') await page.getByLabel('Headline', { exact: true }).fill('Make room for progress');
    await page.getByRole('button', { name: `Apply ${name}`, exact: true }).click();
    if (kind === 'banner') await expect(page.getByLabel('Headline', { exact: true })).toHaveValue('Make room for progress');
    if (kind === 'mockup' || name === 'Dark layered devices') {
      await page.getByLabel('Shadow style', { exact: true }).selectOption('none');
      await expect.poll(() => page.locator('[id^="workspace-"] [data-device-frame]').evaluateAll(frames => frames.every(frame => getComputedStyle(frame).boxShadow === 'none'))).toBe(true);
      await page.getByLabel('Shadow style', { exact: true }).selectOption('spread');
      await page.getByLabel('Device yaw', { exact: true }).fill('30');
    }
    await page.getByRole('button', { name: 'Fit', exact: true }).click();
    await page.screenshot({ path: `test-results/preset-default-${index + 1}.png` });
    if (name !== 'Bold centered headline') {
      await page.getByLabel('Media scale', { exact: true }).fill('75');
      await page.getByLabel('Horizontal position', { exact: true }).fill('8');
      await page.getByLabel('Vertical position', { exact: true }).fill('-5');
      const transform = await page.locator('[id^="workspace-"] [data-media-composition]').evaluate(el => ({ scale: getComputedStyle(el).scale, translate: getComputedStyle(el).translate }));
      expect(transform.scale).toContain('0.75');
      expect(transform.translate).not.toBe('none');
      await page.getByRole('button', { name: 'Center media', exact: true }).click();
      await expect(page.getByLabel('Horizontal position', { exact: true })).toHaveValue('0');
      await expect(page.getByLabel('Media scale', { exact: true })).toHaveValue('75');
      await page.getByRole('button', { name: 'Reset placement', exact: true }).click();
      await expect(page.getByLabel('Media scale', { exact: true })).toHaveValue('100');
      if (kind === 'mockup' || name === 'Dark layered devices') {
        await expect(page.getByLabel('Device yaw', { exact: true })).toHaveValue('0');
        await page.getByLabel('Device yaw', { exact: true }).fill(index % 2 ? '-40' : '40');
      }
      await page.getByLabel('Media scale', { exact: true }).fill('75');
      await page.getByLabel('Horizontal position', { exact: true }).fill('8');
    }
    if (name === 'Clean single device') await page.getByLabel('Transparent background').check();
    await page.getByRole('button', { name: 'Fit', exact: true }).click();
    await page.screenshot({ path: `test-results/preset-${index + 1}.png` });
    previewBounds.push(await greenBounds(page, (await page.locator('[id^="workspace-"]').screenshot()).toString('base64')));
  }
  await expect(page.getByRole('status').filter({ hasText: 'Saved locally' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Select design 6', exact: true }).click();
  await expect(page.getByLabel('Media scale', { exact: true })).toHaveValue('75');
  await expect(page.getByLabel('Horizontal position', { exact: true })).toHaveValue('8');
  await expect(page.getByLabel('Device yaw', { exact: true })).toHaveValue('-40');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('button', { name: 'Delete design 6', exact: true })).toBeVisible();
  await page.screenshot({ path: 'test-results/presets-narrow.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'Export designs', exact: true }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export 6 PNGs', exact: true }).click();
  const zip = await JSZip.loadAsync(await readFile(await (await downloaded).path()));
  const files = Object.values(zip.files).filter(file => file.name.endsWith('.png'));
  expect(files).toHaveLength(6);
  for (const file of files) {
    const bytes = await file.async('nodebuffer');
    expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual(file.name.includes('/banner-') ? [1200, 630] : [1080, 1080]);
    const index = Number(file.name.match(/(\d+)\.png$/)[1]) - 1;
    await writeFile(`test-results/yaw-export-${index + 1}.png`, bytes);
    const bounds = await greenBounds(page, bytes.toString('base64'));
    if (previewBounds[index] === null) expect(bounds).toBeNull();
    else for (let edge = 0; edge < 4; edge++) expect(bounds[edge], `design ${index + 1}, edge ${edge}, preview ${previewBounds[index]}, export ${bounds}`).toBeCloseTo(previewBounds[index][edge], 2);
    const alpha = await page.evaluate(async base64 => {
      const image = new Image(); image.src = `data:image/png;base64,${base64}`; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
      return ctx.getImageData(0, 0, 1, 1).data[3];
    }, bytes.toString('base64'));
    expect(alpha).toBe(index === 3 ? 0 : 255);
  }
  await expect(page.getByText('6 PNGs exported successfully.')).toBeVisible();
});

// Compare the uploaded green image's normalized bounds in the workspace and exported PNG.
async function greenBounds(page, base64) {
  return page.evaluate(async source => {
    const image = new Image(); image.src = `data:image/png;base64,${source}`; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      // Include dimmed secondary screens: perspective rasterization and shadows
      // vary exact RGB values between viewport and PNG, but preserve their green hue.
      const [red, green, blue, alpha] = pixels.subarray(i, i + 4);
      if (green > 70 && green > red * 1.4 && green > blue * 1.15 && alpha > 200) {
        left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
      }
    }
    return right < 0 ? null : [left / canvas.width, top / canvas.height, right / canvas.width, bottom / canvas.height];
  }, base64);
}

test('device yaw turns every phone while preserving layout, flat rotation and copy', async ({ page }) => {
  await page.goto('/');
  await uploadImage(page);
  await page.getByLabel('Headline', { exact: true }).fill('A new angle');
  await openLayout(page);
  const stage = page.locator('[id^="workspace-"]');
  const frames = stage.locator('[data-device-frame]');
  const yaw = page.getByLabel('Device yaw', { exact: true });
  await expect(yaw).toHaveValue('0');
  await expect(frames).toHaveCSS('transform', 'none');
  for (const [layout, count] of [['basic-top', 1], ['duo-row', 2], ['trio-row', 3], ['3d-isometric-right', 1]]) {
    await page.getByLabel('Slide layout').selectOption(layout);
    await page.getByLabel('Media scale', { exact: true }).fill('75');
    await page.getByLabel('Horizontal position', { exact: true }).fill('8');
    await page.getByLabel('Device rotation', { exact: true }).fill('15');
    await expect(frames).toHaveCount(count);
    await page.mouse.move(0, 0);
    const title = stage.locator('[data-render-text]').first();
    const titleBounds = await title.boundingBox();
    const composition = stage.locator('[data-media-composition]');
    const before = await composition.getAttribute('style');
    for (const angle of [-60, 60, 0]) {
      await yaw.fill(String(angle));
      await expect.poll(() => frames.evaluateAll((elements, value) => elements.every(el => value === 0 ? getComputedStyle(el).transform === 'none' : el.style.transform.includes(`rotateY(${value}deg)`)), angle)).toBe(true);
      expect(await title.boundingBox()).toEqual(titleBounds);
      expect(await composition.getAttribute('style')).toBe(before);
    }
  }
  await yaw.fill('35');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(yaw).toHaveValue('0');
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  await expect(yaw).toHaveValue('35');
  await expect(page.getByRole('status').filter({ hasText: 'Saved locally' })).toBeVisible();
  await page.reload();
  await openLayout(page);
  await expect(yaw).toHaveValue('35');
  await page.getByRole('button', { name: 'Reset placement', exact: true }).click();
  await expect(yaw).toHaveValue('0');
  await expect(frames).toHaveCSS('transform', 'none');
});
