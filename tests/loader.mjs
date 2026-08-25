import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith('@/')) {
    const subpath = specifier.slice(2);
    const extensions = ['.ts', '.tsx', '/index.ts', ''];
    for (const ext of extensions) {
      const candidateUrl = new URL(`../src/${subpath}${ext}`, import.meta.url);
      const filePath = fileURLToPath(candidateUrl);
      if (existsSync(filePath)) {
        return nextResolve(candidateUrl.href, context);
      }
    }
  }
  return nextResolve(specifier, context);
}
