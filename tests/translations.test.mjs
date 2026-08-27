import assert from 'node:assert/strict';
import test from 'node:test';
import { SUPPORTED_LANGUAGES, getLanguageByCode, getLanguageName } from '../src/config/languages.ts';
import { translateText, parseUploadedTranslationJson } from '../src/utils/translator.ts';

test('SUPPORTED_LANGUAGES contains valid languages and no emojis', () => {
  assert.ok(SUPPORTED_LANGUAGES.length >= 15, `Expected >= 15 languages, got ${SUPPORTED_LANGUAGES.length}`);
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}]/u;

  for (const lang of SUPPORTED_LANGUAGES) {
    assert.ok(lang.code, 'Language missing code');
    assert.ok(lang.name, `Language ${lang.code} missing name`);
    assert.ok(lang.nativeName, `Language ${lang.code} missing nativeName`);
    assert.ok(!emojiRegex.test(lang.name), `Language ${lang.name} must not contain emojis`);
    assert.ok(!emojiRegex.test(lang.nativeName), `Language ${lang.nativeName} must not contain emojis`);
  }
});

test('getLanguageByCode and getLanguageName resolve correctly', () => {
  const es = getLanguageByCode('es');
  assert.ok(es);
  assert.equal(es.name, 'Spanish');
  assert.equal(es.nativeName, 'Español');

  const pt = getLanguageByCode('PT');
  assert.ok(pt);
  assert.equal(pt.name, 'Portuguese');

  const name = getLanguageName('fr');
  assert.ok(name.includes('French'));
  assert.ok(name.includes('Français'));
});

test('translateText handles offline dictionary matching', async () => {
  const spanishTitle = await translateText('Amazing Features', 'es', 'en');
  assert.equal(spanishTitle, 'Funciones Increíbles');

  const portugueseTitle = await translateText('Amazing Features', 'pt', 'en');
  assert.equal(portugueseTitle, 'Recursos Incríveis');

  const frenchTitle = await translateText('Amazing Features', 'fr', 'en');
  assert.equal(frenchTitle, 'Fonctionnalités Uniques');

  const germanTitle = await translateText('Amazing Features', 'de', 'en');
  assert.equal(germanTitle, 'Tolle Funktionen');

  const japaneseTitle = await translateText('Amazing Features', 'ja', 'en');
  assert.equal(japaneseTitle, '注目の機能');

  // Same language returns original
  const sameLang = await translateText('Hello World', 'en', 'en');
  assert.equal(sameLang, 'Hello World');

  // Empty string returns empty
  const empty = await translateText('', 'es', 'en');
  assert.equal(empty, '');
});

test('parseUploadedTranslationJson handles single language array format', () => {
  const jsonString = JSON.stringify([
    { title: 'Función 1', subtitle: 'Descripción 1' },
    { title: 'Función 2', subtitle: 'Descripción 2' },
  ]);

  const parsed = parseUploadedTranslationJson(jsonString);
  assert.equal(parsed.type, 'single');
  assert.equal(parsed.data.length, 2);
  assert.equal(parsed.data[0].title, 'Función 1');
  assert.equal(parsed.data[0].subtitle, 'Descripción 1');
});

test('parseUploadedTranslationJson handles multi-language dictionary format', () => {
  const jsonString = JSON.stringify({
    es: [
      { title: 'Función 1 ES', subtitle: 'Descripción 1 ES' },
      { title: 'Función 2 ES', subtitle: 'Descripción 2 ES' },
    ],
    pt: [
      { title: 'Recurso 1 PT', subtitle: 'Descrição 1 PT' },
      { title: 'Recurso 2 PT', subtitle: 'Descrição 2 PT' },
    ],
  });

  const parsed = parseUploadedTranslationJson(jsonString);
  assert.equal(parsed.type, 'multi');
  assert.ok(parsed.data.es);
  assert.ok(parsed.data.pt);
  assert.equal(parsed.data.es[0].title, 'Función 1 ES');
  assert.equal(parsed.data.pt[0].title, 'Recurso 1 PT');
});
