import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { toBlob } from 'html-to-image';
import { SlideRenderer, type SlideRendererProps } from '@/components/SlideRenderer';
import { resolveCanvasSize, isTransparent } from '@/config/creation';

export async function renderSlideImage(props: Omit<SlideRendererProps, 'renderId'>): Promise<Blob> {
  const host = document.createElement('div');
  host.className = 'export-surface';
  host.style.cssText = 'position:fixed;left:-30000px;top:0;pointer-events:none;';
  host.setAttribute('aria-hidden', 'true');
  document.body.appendChild(host);
  const root = createRoot(host);
  const renderId = `export-${crypto.randomUUID()}`;
  try {
    flushSync(() => root.render(<SlideRenderer {...props} renderId={renderId} />));
    const node = host.querySelector<HTMLElement>(`#${renderId}`);
    if (!node) throw new Error('Could not render this slide.');
    await Promise.all(Array.from(node.querySelectorAll<HTMLElement>('[data-render-text]')).map(async text => {
      const style = getComputedStyle(text);
      const family = style.fontFamily.split(',')[0];
      try {
        const faces = await document.fonts.load(`${style.fontWeight} ${style.fontSize} ${family}`, text.textContent || 'Aa');
        if (!faces.length) throw new Error('Font is unavailable');
      } catch { throw new Error('The selected font could not load. Check your connection and retry.'); }
    }));
    await document.fonts.ready;
    await Promise.all(Array.from(node.querySelectorAll('img')).map(image => image.decode()));
    // Background assets do not have image elements, so decode them explicitly too.
    if (props.canvas.backgroundImageSrc && !isTransparent(props.canvas)) {
      const background = new Image();
      background.src = props.canvas.backgroundImageSrc;
      await background.decode();
    }
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    const overflowingText = Array.from(node.querySelectorAll<HTMLElement>('[data-render-text]')).some(text => text.scrollHeight > text.clientHeight + 1 || text.scrollWidth > text.clientWidth + 1);
    if (overflowingText) throw new Error('Text does not fit at its chosen size. Widen the text box, reduce the font size, or shorten the copy.');
    const size = resolveCanvasSize(props.canvas, props.settings);
    const blob = await toBlob(node, {
      width: size.logicalWidth, height: size.logicalHeight,
      canvasWidth: size.width, canvasHeight: size.height, pixelRatio: 1,
      preferredFontFormat: 'woff2',
      filter: child => !(child instanceof HTMLElement && child.classList.contains('no-export')),
    });
    if (!blob) throw new Error('The browser could not create the PNG.');
    if (isTransparent(props.canvas)) return blob;
    // Stores require opaque PNGs. An alpha:false surface also removes the alpha channel.
    const bitmap = await createImageBitmap(blob);
    try {
      const output = document.createElement('canvas');
      output.width = size.width; output.height = size.height;
      const context = output.getContext('2d', { alpha: false });
      if (!context) throw new Error('Could not finish the PNG.');
      context.fillStyle = '#ffffff'; context.fillRect(0, 0, output.width, output.height);
      context.drawImage(bitmap, 0, 0);
      return await new Promise<Blob>((resolve, reject) => output.toBlob(image => image ? resolve(image) : reject(new Error('Could not encode the PNG.')), 'image/png'));
    } finally { bitmap.close(); }
  } finally {
    root.unmount();
    host.remove();
  }
}
