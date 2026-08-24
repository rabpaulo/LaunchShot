import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const canvasEditorSource = await readFile(
  new URL('../src/components/CanvasEditor.tsx', import.meta.url),
  'utf8',
);

test('the canvas flex item reserves its scaled visual dimensions', () => {
  assert.match(canvasEditorSource, /const scaledCanvasWidth = canvasWidth \* zoomScale/);
  assert.match(canvasEditorSource, /const scaledCanvasHeight = canvasHeight \* zoomScale/);
  assert.match(canvasEditorSource, /width: `\$\{scaledCanvasWidth\}px`/);
  assert.match(canvasEditorSource, /height: `\$\{scaledCanvasHeight\}px`/);
  assert.doesNotMatch(canvasEditorSource, /marginBottom: `calc\(/);
});

test('the scaled canvas is anchored to the stage rather than centered by intrinsic width', () => {
  assert.match(canvasEditorSource, /origin-top-left/);
  assert.match(canvasEditorSource, /min-w-0/);
});
