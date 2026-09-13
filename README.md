# LaunchShot Studio

Turn raw app screenshots into a consistent App Store or Google Play listing.

## The workflow

1. Upload PNG, JPEG, or WebP screenshots in story order. Optionally name your app and choose its store destination.
2. Choose **Clean Light**, **Clean Dark**, or **Bold Gradient**. Each style previews your own screenshots and applies to the entire set in one undoable action.
3. Select a slide in the thumbnail strip, write a benefit-led headline, and add optional supporting text. Use the visible **Duplicate** and **Delete** actions beside each thumbnail, or **Clear image** to empty a screenshot slot while keeping its design. Deletion and clearing support Undo/Redo; clearing a secondary or third image prevents automatic image reuse in that slot.
4. Preview the listing and export full-resolution PNGs organized by language and destination.

The workspace fits the selected slide to the available area. Longer headlines automatically shrink in the standard portrait layouts. Missing images, empty headlines, missing translations, and text that cannot fit are reported before or during export.

The inspector includes layout, typography, device frames, cropping and filters, backgrounds, shadows, doodles, and status-bar controls. New projects start without ratings, review counts, awards, or status-bar overlays.

The header provides Undo/Redo actions (also accessible via `Cmd+Z` / `Ctrl+Z` and `Shift+Cmd+Z` / `Shift+Ctrl+Z`), project switching, listing preview, export, and a studio theme toggle. The theme toggle switches between light and dark modes for the editor chrome without altering slide artwork, canvas backgrounds, or exported colors, and persists in local settings.

## Banners and mockups

Use **Add design** to add a banner or mockup alongside your store screenshots. **Start with a look** offers three presets per type: clean split image, bold centered headline, and dark layered devices for banners; clean single device, gradient device pair, and dark device trio for mockups. Scroll the visual cards to browse. Presets apply to the selected design in one undoable action, preserving its copy, images, translations, output size, and device model. Sample content appears only in preset previews. Designs support standard store dimensions, social banner presets, or custom dimensions from 64 to 4,096 pixels. Banners configure media presentation as text and background only, unframed images, or device mockups.

**Layout & device** includes media scale (25–150%), horizontal/vertical position (−50–50% of the canvas), 2D rotation (−180–180°), device yaw (−60–60°), and frame controls. Device yaw turns phone frames in 3D perspective without moving headlines or overflowing layout bounds. **Center media** resets position; **Reset placement** also resets scale, rotation, and yaw angle. Placement moves the complete media composition; **Crop & image filters** adjusts the screenshot inside it. Secondary and third image controls appear only for layouts that use them. Background and shadow settings remain editable, and mockups support transparent export.

Placement persists locally, travels with portable project files, and is included in reusable templates. The workspace, thumbnails, preview, and PNG export use the same composition. Existing projects default to their original size and position when placement fields are absent.

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

The browser suite starts a local development server if one is not running. It covers design deletion and image clearing, all six presets, placement/export parity, narrow screens, upload, later-slide selection, style undo, durable image restoration, portable project transfer, invalid input, save failure/retry, partial PNG export/retry, translation failure, long headlines, legacy image recovery, studio dark mode theming and persistence, per-slide phone yaw rotation, and typography font loading. Generated screenshots and traces are written to ignored `test-results/`.

## Implementation boundaries

- `StudioWorkspace` owns the interface, with design controls and visual presets in the inspector, UI theme switching, zoom and stage fitting, and keyboard shortcuts.
- `MinimalPhoneFrame` renders authentic device styling (Apple, Samsung, Android, iPad), bezels, shadows, status bars, and 3D yaw perspective transforms.
- `SlideRenderer` passes explicit slide data, settings, language, and dimensions to the shared canvas composition. Read-only text and controls are rendered separately from editing controls.
- `projectStorage` persists image assets under stable IDs and resolves temporary display URLs when loading. Zustand retains its existing editor and history model.
- `exportSurface` renders an isolated snapshot, waits for assets, validates text fit, and encodes opaque PNGs.

The first-time-user target is four of five testers exporting five screenshots within five minutes without assistance. This requires a separate human usability session; automated browser tests do not establish that result.

## License

MIT.
