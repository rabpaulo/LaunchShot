import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { toBlob } from 'html-to-image';
import { SlideRenderer, type SlideRendererProps } from '@/components/SlideRenderer';
import { resolveCanvasSize, isTransparent } from '@/config/creation';
import { FONT_OPTIONS } from '@/config/fonts';
import { editorFontVariables } from '@/app/editorFonts';

const fontDataUrlCache = new Map<string, string>();

async function getCachedFontDataUrl(url: string): Promise<string> {
  if (fontDataUrlCache.has(url)) {
    return fontDataUrlCache.get(url)!;
  }
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    fontDataUrlCache.set(url, dataUrl);
    return dataUrl;
  } catch (err) {
    console.warn(`Could not load font at ${url}`, err);
    return url;
  }
}

export async function collectAllFontEmbedCSS(): Promise<string> {
  const cssRulesList: string[] = [];

  // Collect CSS variables defined on root/html
  const computedRoot = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null;
  const rootVariables: string[] = [];

  if (computedRoot) {
    FONT_OPTIONS.forEach(font => {
      const varName = `--font-${font.id}`;
      const val = computedRoot.getPropertyValue(varName);
      if (val) {
        rootVariables.push(`${varName}: ${val};`);
      }
    });
  }

  // Extract all @font-face rules from stylesheets, tracking the parent href
  // so we can resolve relative font URLs correctly (against the stylesheet URL,
  // not the page URL).
  const sheets = typeof document !== 'undefined' ? Array.from(document.styleSheets) : [];
  const fontFaceRules: { rule: CSSFontFaceRule; sheetHref: string | null }[] = [];

  for (const sheet of sheets) {
    try {
      const rules = Array.from(sheet.cssRules || []);
      for (const rule of rules) {
        if (rule instanceof CSSFontFaceRule) {
          fontFaceRules.push({ rule, sheetHref: sheet.href });
        }
      }
    } catch {
      // Cross-origin stylesheet access might throw
    }
  }

  // Also collect @font-face rules from <style> elements that may not appear
  // in document.styleSheets (e.g. dynamically injected by Next.js)
  if (typeof document !== 'undefined') {
    for (const style of Array.from(document.querySelectorAll('style'))) {
      try {
        const sheet = style.sheet;
        if (!sheet) continue;
        // Skip if already collected via document.styleSheets
        if (sheets.includes(sheet)) continue;
        for (const rule of Array.from(sheet.cssRules || [])) {
          if (rule instanceof CSSFontFaceRule) {
            fontFaceRules.push({ rule, sheetHref: sheet.href });
          }
        }
      } catch {
        // Ignore inaccessible sheets
      }
    }
  }

  function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Convert font URLs to base64 Data URLs and adjust for SVG embedding
  for (const { rule, sheetHref } of fontFaceRules) {
    let ruleCss = rule.cssText;
    const urlMatches = Array.from(ruleCss.matchAll(/url\((['"]?)([^'")]+)\1\)/g));
    // Resolve relative font URLs against the stylesheet URL rather than the page
    // URL, because browsers may return the source-relative path in cssText.
    const baseUrl = sheetHref || window.location.href;

    for (const match of urlMatches) {
      const fullMatch = match[0];
      const fontUrl = match[2];
      if (!fontUrl.startsWith('data:')) {
        const resolvedUrl = new URL(fontUrl, baseUrl).href;
        const dataUrl = await getCachedFontDataUrl(resolvedUrl);
        ruleCss = ruleCss.replace(fullMatch, `url("${dataUrl}")`);
      }
    }

    // Replace font-display: swap with block so the browser waits for the
    // embedded font instead of showing a fallback in the SVG rendering context.
    ruleCss = ruleCss.replace(/font-display:\s*swap/g, 'font-display: block');

    cssRulesList.push(ruleCss);

    // If the font-family is a Next.js generated name (e.g. '__Plus_Jakarta_Sans_...'),
    // also create alias rules for the clean font name (e.g. 'Plus Jakarta Sans', 'plus-jakarta')
    const familyName = rule.style.fontFamily.replace(/['"]/g, '').trim();
    for (const font of FONT_OPTIONS) {
      const cleanName = font.name;
      const normalizedName = font.id.replace(/-/g, '_').toLowerCase();
      if (familyName.toLowerCase().includes(normalizedName) || familyName.toLowerCase() === cleanName.toLowerCase()) {
        const escapedFamily = escapeRegex(familyName);
        const alias1 = ruleCss.replace(
          new RegExp(`font-family:\\s*['"]?${escapedFamily}['"]?`, 'g'),
          `font-family: "${cleanName}"`
        );
        const alias2 = ruleCss.replace(
          new RegExp(`font-family:\\s*['"]?${escapedFamily}['"]?`, 'g'),
          `font-family: "${font.id}"`
        );
        if (alias1 !== ruleCss) cssRulesList.push(alias1);
        cssRulesList.push(alias2);
      }
    }
  }

  const rootBlock = rootVariables.length ? `:root, * { ${rootVariables.join(' ')} }\n` : '';
  return rootBlock + cssRulesList.join('\n');
}

export async function renderSlideImage(props: Omit<SlideRendererProps, 'renderId'>): Promise<Blob> {
  const host = document.createElement('div');
  host.className = `export-surface ${editorFontVariables}`;
  host.style.cssText = 'position:fixed;left:-30000px;top:0;pointer-events:none;';
  host.setAttribute('aria-hidden', 'true');
  document.body.appendChild(host);
  const root = createRoot(host);
  const renderId = `export-${crypto.randomUUID()}`;
  try {
    flushSync(() => root.render(<SlideRenderer {...props} renderId={renderId} />));
    const node = host.querySelector<HTMLElement>(`#${renderId}`);
    if (!node) throw new Error('Could not render this slide.');
    await document.fonts.ready;

    // Pre-compute the font embed CSS so fonts are fetched and base64-encoded early.
    const fontEmbedCSS = await collectAllFontEmbedCSS();

    // Explicitly load the active font into the browser's FontFaceSet to guarantee
    // it is decoded and ready before html-to-image clones computed styles.
    const activeFontId = props.canvas.fontFamily || props.settings.fontFamily || 'plus-jakarta';
    const activeFontConfig = FONT_OPTIONS.find(f => f.id === activeFontId) || FONT_OPTIONS[0];
    try {
      await document.fonts.load(`bold 16px "${activeFontConfig.name}"`);
    } catch {
      // Non-fatal: the font may already be loaded or not available
    }

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
      fontEmbedCSS,
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

