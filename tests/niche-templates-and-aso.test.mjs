import assert from 'node:assert/strict';
import test from 'node:test';
import { extractKeywords } from '../src/utils/keywordExtractor.ts';
import { NICHE_TEMPLATES, NICHE_CATEGORIES_LIST, generateTemplateForNiche } from '../src/config/niches.ts';
import { ASO_TONE_OPTIONS, applyAsoCopy } from '../src/config/aso.ts';
import { TEMPLATES } from '../src/config/templates.ts';

test('extractKeywords extracts single words and 2-word compound phrases', () => {
  const result = extractKeywords('A sleep tracker and meditation app for anxiety relief');
  assert.ok(result.includes('Sleep Tracker'));
  assert.ok(result.includes('Anxiety Relief'));
  assert.ok(result.includes('Meditation'));
  assert.ok(!result.includes('A'));
  assert.ok(!result.includes('And'));
  assert.ok(!result.includes('For'));
});

test('all 30+ niches in NICHE_TEMPLATES are fully populated with 5 authentic slides', () => {
  const nicheKeys = Object.keys(NICHE_TEMPLATES);
  assert.ok(nicheKeys.length >= 30, `Expected >= 30 niches, got ${nicheKeys.length}`);

  for (const [key, niche] of Object.entries(NICHE_TEMPLATES)) {
    assert.ok(niche.name, `Niche ${key} missing name`);
    assert.ok(Array.isArray(niche.keywords) && niche.keywords.length > 0, `Niche ${key} missing keywords`);
    assert.ok(niche.theme.fontFamily, `Niche ${key} missing fontFamily`);
    assert.ok(Array.isArray(niche.theme.colors) && niche.theme.colors.length >= 4, `Niche ${key} needs >= 4 colors`);
    assert.ok(Array.isArray(niche.copy) && niche.copy.length === 5, `Niche ${key} needs exactly 5 copy items`);
    assert.ok(Array.isArray(niche.layouts) && niche.layouts.length >= 4, `Niche ${key} needs >= 4 sequenced layouts`);

    for (let i = 0; i < niche.copy.length; i++) {
      const item = niche.copy[i];
      assert.ok(item.title && item.title.trim().length > 0, `Niche ${key} slide ${i} missing title`);
      assert.ok(item.subtitle && item.subtitle.trim().length > 0, `Niche ${key} slide ${i} missing subtitle`);
    }
  }
});

test('NICHE_CATEGORIES_LIST items map to valid niches and contain no emojis', () => {
  assert.ok(NICHE_CATEGORIES_LIST.length >= 30);
  const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}]/u;

  for (const cat of NICHE_CATEGORIES_LIST) {
    assert.ok(cat.id, 'Category missing id');
    assert.ok(cat.name, 'Category missing name');
    assert.ok(cat.query, 'Category missing query');
    assert.ok(!emojiRegex.test(cat.name), `Category ${cat.name} must not contain emojis`);
    
    const result = generateTemplateForNiche(cat.query);
    assert.ok(result.canvases.length === 5, `Category ${cat.name} should generate 5 canvases`);
    assert.ok(result.globalOverrides.mockupStyle, `Category ${cat.name} missing mockupStyle override`);
    assert.ok(result.globalOverrides.fontFamily, `Category ${cat.name} missing fontFamily override`);
  }

  for (const tone of ASO_TONE_OPTIONS) {
    assert.ok(!emojiRegex.test(tone.name), `Tone ${tone.name} must not contain emojis`);
  }
});


test('generateTemplateForNiche fuzzy and keyword matching works', () => {
  const aiResult = generateTemplateForNiche('ChatGPT prompt helper');
  assert.equal(aiResult.matchedNicheName, 'AI & Smart Copilot');
  assert.equal(aiResult.canvases.length, 5);

  const dogResult = generateTemplateForNiche('puppy training and clicker');
  assert.equal(dogResult.matchedNicheName, 'Pet Care & Training');

  const fallbackResult = generateTemplateForNiche('completely-unknown-niche-query-12345');
  assert.equal(fallbackResult.matchedNicheName, 'Universal App');
  assert.equal(fallbackResult.canvases.length, 5);
});

test('applyAsoCopy supports all 6 tones and produces structured story arcs', () => {
  const dummyCanvases = [
    { id: '1', imageSrc: null, title: 'Old 1', subtitle: 'Sub 1', layout: 'basic-top', backgroundColor: '#000', textColor: '#fff' },
    { id: '2', imageSrc: null, title: 'Old 2', subtitle: 'Sub 2', layout: 'half-right', backgroundColor: '#000', textColor: '#fff' },
    { id: '3', imageSrc: null, title: 'Old 3', subtitle: 'Sub 3', layout: 'tilt-left', backgroundColor: '#000', textColor: '#fff' },
    { id: '4', imageSrc: null, title: 'Old 4', subtitle: 'Sub 4', layout: 'split-vertical', backgroundColor: '#000', textColor: '#fff' },
    { id: '5', imageSrc: null, title: 'Old 5', subtitle: 'Sub 5', layout: 'basic-bottom', backgroundColor: '#000', textColor: '#fff' },
  ];

  for (const toneOpt of ASO_TONE_OPTIONS) {
    const updated = applyAsoCopy(dummyCanvases, 'crypto wallet and expense tracker', toneOpt.id);
    assert.equal(updated.length, 5);

    // Slide 1 has hook & rating/award badge
    assert.ok(updated[0].title.length > 0);
    assert.ok(updated[0].badge?.enabled);

    // Slide 4 has trust & privacy badge
    assert.ok(updated[3].badge?.enabled);
    assert.equal(updated[3].badge?.icon, 'shield');

    // Slide 5 has CTA & trophy badge
    assert.ok(updated[4].title.length > 0);
    assert.ok(updated[4].badge?.enabled);
  }
});

test('TEMPLATES catalog contains >= 20 presets that apply successfully', () => {
  assert.ok(TEMPLATES.length >= 20, `Expected >= 20 templates, got ${TEMPLATES.length}`);

  for (const template of TEMPLATES) {
    let loadedCanvases = null;
    let globalUpdates = null; // eslint-disable-line @typescript-eslint/no-unused-vars

    template.apply(
      (canvases) => { loadedCanvases = canvases; },
      (updates) => { globalUpdates = updates; }
    );

    assert.ok(Array.isArray(loadedCanvases) && loadedCanvases.length > 0, `Template ${template.name} failed to load canvases`);
  }
});
