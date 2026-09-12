# LaunchShot Studio

Turn raw app screenshots into a consistent App Store or Google Play listing.

## The workflow

1. Upload PNG, JPEG, or WebP screenshots in story order. Optionally name your app and choose its store destination.
2. Choose **Clean Light**, **Clean Dark**, or **Bold Gradient**. Each style previews your own screenshots and applies to the entire set in one undoable action.
3. Select a slide in the thumbnail strip, write a benefit-led headline, and add optional supporting text. Replace, duplicate, remove, or reorder slides without changing the others.
4. Preview the listing and export full-resolution PNGs organized by language and destination.

The workspace fits the selected slide to the available area. Longer headlines automatically shrink in the standard portrait layouts. Missing images, empty headlines, missing translations, and text that cannot fit are reported before or during export.

**Advanced tools** opens the existing editor with the full template catalog, custom layouts, typography, device frames, image cropping and filters, backgrounds, shadows, panoramas, badges, doodles, and callouts. Existing projects keep their layouts and content. New projects start without ratings, review counts, awards, or status-bar overlays.

## Saving and project files

Projects and uploaded image blobs are saved locally in IndexedDB. The header shows **Saving**, **Saved locally**, or a save failure with a retry action. Wait for **Saved locally** before closing the tab. Browser storage is local to this device and origin; clearing browser data removes it.

The previous `screenshot-editor-storage` localStorage snapshot migrates on first open. The old copy is removed only after the new snapshot is saved. Readable image references are recovered; expired blob URLs become empty image slots so you can replace them without losing copy or layout edits. Images whose original browser session has already ended cannot be reconstructed from an expired URL.

Use **Projects → Export Project** for a portable `.launchshot` backup. Version 2 files embed image data, so they can be imported into another browser. Version 1 JSON files remain supported. Project export reports assets it cannot read instead of producing an incomplete backup.

## Export and translations

Export renders a snapshot through the same read-only composition used by the workspace. It waits for fonts and images, produces opaque RGB PNGs at the selected dimensions, and leaves editor settings, selection, and undo history untouched. A partially successful ZIP includes `export-errors.json`; the dialog lists failures and offers retry.

Recommended presets are grouped by store destination. Additional device sizes remain available. Reference specifications, checked September 12, 2026:

- [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Google Play preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

Languages and translations remain optional. Automatic translation uses the existing dictionary and remote providers; failed requests report failure and do not mark source text as translated. JSON translation import/export supports manual localization. Remote translation sends the requested text to the configured providers.

## Development

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm test
npm run lint
npm run build
```

Browser tests use Chromium:

```bash
npx playwright install chromium
npm run test:browser
```

The browser suite starts a local development server if one is not running. It covers upload, later-slide selection, style undo, durable image restoration, portable project transfer, invalid input, save failure/retry, partial PNG export/retry, translation failure, long headlines, and legacy image recovery. Generated screenshots and traces are written to ignored `test-results/`.

## Implementation boundaries

- `StudioWorkspace` owns the focused interface; `AdvancedWorkspace` retains the existing editor.
- `SlideRenderer` passes explicit slide data, settings, language, and dimensions to the shared canvas composition. Read-only text and controls are rendered separately from editing controls.
- `projectStorage` persists image assets under stable IDs and resolves temporary display URLs when loading. Zustand retains its existing editor and history model.
- `exportSurface` renders an isolated snapshot, waits for assets, validates text fit, and encodes opaque PNGs.

The first-time-user target is four of five testers exporting five screenshots within five minutes without assistance. This requires a separate human usability session; automated browser tests do not establish that result.

## License

MIT.
