import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const canvasEditorSource = await readFile(
  new URL('../src/components/CanvasEditor.tsx', import.meta.url),
  'utf8',
);

test('the canvas flex item scales with zoomScale and maintains aspect ratio', () => {
  assert.match(canvasEditorSource, /transform:\s*`scale\(\$\{zoomScale\}\)`/);
  assert.match(canvasEditorSource, /width:\s*`\$\{canvasWidth\}px`/);
  assert.match(canvasEditorSource, /height:\s*`\$\{canvasHeight\}px`/);
});

