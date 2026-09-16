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

## Design types: Screenshots, Banners, and Mockups

LaunchShot supports three distinct design kinds within a single unified workspace:

- **Store Screenshots**: Portrait listings for Apple App Store and Google Play, with automatic device framing, badge callouts, headline typography, and multi-screen continuity.
- **Banners & Social Graphics**: Landscape, square, and banner formats for Open Graph (OG) previews, marketing banners, and social posts. Banners configure media presentation as text and background only, unframed images, or device mockups.
- **Device Mockups**: Standalone mockups with transparent background support, single or multi-device compositions, and adjustable perspective transforms.

Use **Add design** in the filmstrip to add a banner or mockup alongside your store screenshots. **Start with a look** offers three presets per type:
- **Banners**: Clean split image, bold centered headline, and dark layered devices.
- **Mockups**: Clean single device, gradient device pair, and dark device trio.

Scroll the visual cards to browse. Presets apply to the selected design in one undoable action, preserving its copy, images, translations, output size, and device model. Sample content appears only in preset previews. Designs support standard store dimensions, social banner presets, or custom dimensions from 64 to 4,096 pixels.

## Template Gallery and Niche Generator

LaunchShot includes an extensive gallery of professionally crafted, multi-screen templates and an automated niche generator to bootstrap listing designs instantly.

### Template Gallery
Access the gallery via the **Browse template gallery** button in the inspector or template modal. The gallery categorizes 50+ templates including:
- **SaaS & AI**: Dark and modern glassmorphic designs for AI assistants, cloud platforms, and developer utilities.
- **Fintech & Finance**: High-contrast, security-focused palettes for banking, crypto, and budgeting apps.
- **Fitness & Health**: High-energy and wellness themes with vibrant gradients and activity metrics.
- **Lifestyle & Social**: Editorial, warm magazine, aesthetic photo, and conversational themes.
- **Banner & Feature**: Multi-device kinetic stacks, panoramic story arcs, and repeating showcase layouts.
- **Minimal & Clean**: Studio monochrome and minimalist whitespace designs focusing on pure product screenshots.

### Auto-Generate by Niche
Select from over 30 pre-configured niche categories in the sidebar or enter custom keywords:
- Categories include: AI & Copilots, Finance & Crypto, Fitness & Workout, Nutrition & Macros, Meditation & Sleep, Productivity & Notes, Habits & Streaks, Dating & Relationships, Shopping & Ecommerce, Travel & Flights, Food Delivery & Dining, Social & Messaging, Education & Language, Music & Audio, Photo & Video Editor, Gaming & Esports, News & Magazines, Real Estate & Rentals, VPN & Privacy, Health & Medical, Baby & Parenting, Pet Care & Training, Smart Home & IoT, Books & Summaries, Weather & Outdoors, Events & Nightlife, Auto & Mileage, Mental Health & CBT, Astrology & Horoscope, Business & Invoicing, Utilities & Scanner.
- Each niche automatically sets tailored 5-screen copy, authentic badges, Google Font selections, mockup styling, and harmonized color palettes.

## Smart ASO Copywriting and Conversion Story Arcs

The built-in Smart ASO (App Store Optimization) copywriter generates conversion-focused copy following the CRO 3-to-6 word rule, optimized for rapid scanning on mobile store listings.

### Conversion Personas and Tones
- **High Converting (Hook & Outcome)**: Punchy benefit-led headlines that maximize conversion rates.
- **Apple Minimalist (Short & Sleek)**: 2-3 word poetic editorial headlines with keynote clarity (automatically switches target device to iPhone).
- **Feature & Power Utility**: Clear capabilities, sub-50ms speed, and offline reliability focus.
- **Social Proof & Authority**: Verified ratings, design awards, and community milestones.
- **Problem to Transformation**: Identifies user pain points and delivers immediate software relief.
- **Playful & Vibrant**: Fun, conversational, gamified tone for consumer apps.

### 5-Screen Story Arc Framework
The generator constructs a sequential narrative across the listing:
1. **Screen 1 (Hook)**: Core value proposition and hero differentiator.
2. **Screen 2 (Pain / Friction)**: Relatable problem solved or key transformation.
3. **Screen 3 (Workflow / Solution)**: Deep feature dive or speed/simplicity demonstration.
4. **Screen 4 (Trust / Social Proof)**: Security, privacy, ratings, or award credentials.
5. **Screen 5 (Call to Action)**: Onboarding prompt and closing conversion trigger.

Use the **New Angle** action to cycle through alternative marketing hooks while preserving existing layout and visual settings.

## Layouts and Multi-Screen Compositions

LaunchShot provides over 25 layout configurations spanning portrait, isometric, multi-device, and social graphic formats:

### Standard Portrait Layouts
- `basic-top`: Headline and subtitle above a centered vertical device frame.
- `basic-bottom`: Device positioned at the top with copy below.
- `split-vertical`: Balanced top-to-bottom split.
- `half-left` / `half-right`: Side-by-side split placing copy on one side and an offset device on the other.
- `device-only`: Clean device frame without text overlays.

### 2D and 3D Perspective Layouts
- `tilt-left` / `tilt-right`: Dynamic 2D angled device presentations.
- `tilt-left-complement` / `tilt-right-complement`: Balanced opposing tilts.
- `tilt-bottom-left` / `tilt-bottom-right`: Angled devices anchoring bottom corners.
- `3d-isometric-left` / `3d-isometric-right`: True 3D isometric perspective projection.
- `hero-center` / `hero-3d-center`: Elevated central device with deep shadows.

### Multi-Screen Connected Flows
- `multi-screen-right`: Connected three-device sequence cascading to the right across adjacent slides.
- `multi-screen-left`: Three-device sequence cascading to the left.
- `multi-screen-center`: Trio arrangement with a prominent central phone and flanking secondary devices.
- `duo-row`: Side-by-side twin device mockup.
- `trio-row`: Three-device horizontal lineup.

### Social Graphics and Banners
- `banner-centered`: Centered typography with optional device frame.
- `banner-split`: Split layout optimized for wide banners and landscape graphics.
- `banner-stack-right`: Multi-layered right-aligned phone stack.
- `banner-triple-bottom`: Three phones aligned along the bottom edge of wide canvas.
- `banner-kinetic-stack`: Kinetic repeating angled device stack.
- `og-style-1`, `og-style-2`, `og-style-3`: Dedicated Open Graph social card layouts.

### Multi-Slot Image Resolution
For layouts supporting secondary and tertiary devices (`duo-row`, `trio-row`, `multi-screen-right`, `banner-stack-right`, etc.), LaunchShot resolves media slots intelligently:
- Primary slot: Active slide's main screenshot.
- Secondary / Tertiary slots: Defaults to adjacent sibling slides or active screenshot unless explicitly populated or cleared.
- Explicitly cleared slots remain empty to prevent unwanted image reuse.

## Panoramic Multi-Screen Spanning

Panoramic mode creates a continuous background artwork or gradient that flows uninterrupted across all screenshots in your listing sequence.

- **Seamless Continuation**: Mathematical slice positioning calculates precise horizontal offset percentages for each canvas based on its position in the set.
- **Curated Panorama Presets**:
  - *Aurora Borealis*: Deep indigo, cosmic teal, and ultraviolet glow.
  - *Sunset Horizon*: Warm golden amber to deep coral crimson.
  - *Cyber Neon Pulse*: Electric violet, magenta, and cyan mesh.
  - *Emerald Flow*: Deep forest green through jade and mint neon.
  - *Deep Space Nebula*: Dark obsidian with purple starlight drifts.
  - *Studio Clean Light*: Crisp platinum with subtle pastel grey transitions.
  - *Royal Indigo Horizon*: Sapphire blue and royal purple wash.
  - *Electric Peach & Gold*: Warm creator aesthetic with coral and gold highlights.
- **Custom Panoramic Artwork**: Upload custom wide-format images or specify custom CSS gradients to span across all slides.

## Supported Devices, Target Sizes, and Formats

LaunchShot provides exact pixel-ratio and logical resolution presets matching store requirements:

| Platform / Category | Device Preset | Output Resolution | Logical Dimensions | Pixel Ratio |
| :--- | :--- | :--- | :--- | :--- |
| **Apple iPhone** | iPhone 17 / 17 Pro (6.3") | 1206 × 2622 | 402 × 874 | 3x |
| | iPhone 17 Pro Max (6.9") | 1320 × 2868 | 440 × 956 | 3x |
| | iPhone 16 Pro Max (6.9") | 1290 × 2796 | 430 × 932 | 3x |
| | iPhone 16 Pro / 15 Pro (6.3") | 1179 × 2556 | 393 × 852 | 3x |
| | iPhone 11 Pro Max / XS Max (6.5") | 1284 × 2778 | 428 × 926 | 3x |
| | iPhone X / XS / 11 Pro (5.8") | 1125 × 2436 | 375 × 812 | 3x |
| | iPhone 8 Plus / 7 Plus (5.5") | 1242 × 2208 | 414 × 736 | 3x |
| | iPhone SE / 8 (4.7") | 750 × 1334 | 375 × 667 | 2x |
| **Apple iPad** | iPad Pro 12.9" | 2048 × 2732 | 1024 × 1366 | 2x |
| | iPad Pro 11" | 1668 × 2388 | 834 × 1194 | 2x |
| **Samsung Galaxy** | Galaxy S26 / S25 / S24 Ultra | 1440 × 3120 (QHD+) | 480 × 1040 | 3x |
| | Galaxy S26 / S25 / S24 / S24+ | 1080 × 2340 (FHD+) | 360 × 780 | 3x |
| | Galaxy S23 / S22 Ultra | 1440 × 3088 (QHD+) | 480 × 1030 | 3x |
| | Galaxy S21 / S20 Ultra | 1440 × 3200 (QHD+) | 480 × 1066 | 3x |
| | Galaxy S21 / S20 Base / FE | 1080 × 2400 (FHD+) | 360 × 800 | 3x |
| **General Android** | Android Tall (20:9) | 1080 × 2400 | 360 × 800 | 3x |
| | Android Standard (16:9) | 1080 × 1920 | 360 × 640 | 3x |
| | Android Tablet 10" | 1600 × 2560 | 800 × 1280 | 2x |
| **Store Headers** | Play Store Feature Graphic | 1024 × 500 | 1024 × 500 | 1x |
| **Social & Banner** | Social Preview (OG Card) | 1200 × 630 | 600 × 315 | 2x |
| | Landscape Banner | 1920 × 1080 | 960 × 540 | 2x |
| | Square Graphic | 1080 × 1080 | 540 × 540 | 2x |
| | Story / Vertical Banner | 1080 × 1920 | 540 × 960 | 2x |

Additional custom dimensions from 64 × 64 to 4096 × 4096 pixels are supported. Standard aspect ratio presets include 4:3, 16:9, 1:1, 9:16, 3:2, and Device Native.

## Device Framing, Yaw, and 3D Transforms

LaunchShot gives fine-grained control over device framing and 3D positioning:

- **Mockup Styles**: Dark, Light, Glass (frosted translucency), Clay Dark, and Clay Light.
- **Hardware Detailing**: Toggleable camera cutout (notch / Dynamic Island / punch-hole).
- **Media Scaling**: Scale device presentations from 25% to 150%.
- **Canvas Offsets**: Position media horizontally and vertically from −50% to +50% of canvas bounds.
- **2D Rotation**: Rotate media compositions smoothly from −180° to +180°.
- **3D Perspective Yaw**: Turn device frames in 3D perspective from −60° to +60° without distorting text hierarchy or causing canvas overflow.
- **Center & Reset**: One-click **Center media** resets X/Y coordinates; **Reset placement** restores baseline scale, rotation, and yaw angle.

## Typography and Google Fonts

16 curated Google Fonts are loaded dynamically and categorized for app store listings:

- **Modern Sans**: Plus Jakarta Sans (default), Inter, Outfit, Poppins, Montserrat, DM Sans, Manrope, Nunito.
- **Tech & Grotesk**: Space Grotesk, Sora, Syne.
- **Display / Editorial**: Bebas Neue, Oswald, Playfair Display, Lora, Fraunces.

### Text Controls and Hierarchy
- **Granular Font Sizing**: Manual or auto-scaling title (16–72px) and subtitle (11–36px) font sizes.
- **Text Box Width**: Custom width slider (25–100%) and interactive on-canvas resize handles.
- **Text Alignment**: Left, Center, or Right alignment.
- **Color & Gradients**: Independent headline and subtitle color pickers, plus high-contrast gradient text styling.
- **Batch Typography Application**: Apply chosen font, font sizes, text box width, or complete text styles to all slides in one click.

## Backgrounds, Backdrop Effects, and Shadow Engine

### Curated Backgrounds & Custom Gradients
- Categorized presets: Mesh & Gradients, Radial Glows, Modern Pastels, Solids & Neutrals.
- Custom linear gradients with custom start/end colors and 0–360° angle control.
- Custom background image uploads with one-click removal and color matching.

### Backdrop Effects
Layer atmospheric visual effects over any canvas:
- **Soft Overlay**: Subdued contrast-balancing tint.
- **Ambient Glow**: Soft luminous highlights behind device mockups.
- **Dot Pattern**: Subtle dot mesh adding technical depth.
- **Vignette**: Edge darkening for cinematic focus.

### 3D Shadow and Lighting Engine
- **Shadow Styles**: Soft spread (diffuse ambient elevation) and close contact hug (crisp grounded shadow).
- **Intensity**: Low, Medium, and High shadow depth.
- **25-Point Directional Light Grid**: An interactive 5×5 matrix allows precise placement of simulated studio light sources.

## Doodles, Badges, and Floating Cards

Enhance screenshot conversion with visual accents and trust badges:

### Hand-Drawn Doodle Accents
17 doodle vectors with custom color palettes, size multiplier (0.3–3x), rotation (−180° to +180°), and pixel offsets:
- Shapes: Question mark, wave underline, circle loop, lightning bolt, speech bubble, burst, sparkles, curved arrow, crown, heart, star, fire, checkmark, double underline, spiral, target, and circle around.
- Global and per-slide color controls and toggle actions.

### Store Badges and Awards
Authentic App Store and Google Play badge stickers:
- Presets: App Store 4.9 Rating (50k+ reviews), Google Play 4.9 Rating (100k+ ratings), Apple Featured ("Essential App"), Apple Design Award Winner, App of the Day, Editor's Choice, Top 10 Finance, Top 5 Health & Fitness.
- Styles: Pill Glass, Pill Solid, and Minimal Star.
- Positioning: Inline (above title), Top-Left, Top-Center, Top-Right, Bottom-Left, Bottom-Center, Bottom-Right, or Free positioning.

### Floating Metric Cards and Callout Pins
- Types: Stat Metric (e.g. "+38% Faster"), Verified User Review, Notification Chip, and Security Feature Chip (e.g. "End-to-End Encrypted").
- Themes: Glass Dark, Glass Light, Solid Dark, Solid Light, and Accent.
- Directional Callout Pins: Annotate specific UI elements with custom text and pointing pointers (left, right, top, bottom).

## Status Bar Sanitizer

Replace cluttered real-world status bars with clean, standardized overlays:

- **Platforms**: Apple iOS (Dynamic Island / notch geometry) and Google Android (status bar layout).
- **Customizable Clock**: Set custom time string (defaults to "9:41").
- **Theme Modes**: Auto-contrast, Light, or Dark icon colors.
- **Indicators**: Configurable battery level slider (0–100%), Wi-Fi signal, and 5G cellular signal toggles.

## Image Editor: Cropping and Filters

Open the dedicated image editor on any slide to refine screenshots without leaving the studio:

- **Aspect-Ratio Locked Cropping**: `react-easy-crop` visual canvas maintaining exact device viewport proportions.
- **Zoom & Rotation**: Granular zoom scale and 360° image rotation.
- **Real-Time Image Filters**:
  - Brightness (0–200%)
  - Contrast (0–200%)
  - Saturation (0–200%)
  - Blur (0–20px)
  - Grayscale (0–100%)
- **Image Fitting**: Choose between **Cover** (fills entire device screen) and **Contain** (shows uncropped original screenshot).

## Store Context Live Preview

Simulate how your screenshot sequence will appear in live store environments before submitting to App Store Connect or Google Play Console:

- **App Store Simulation**: Authentic iOS product page layout with app icon, rating summary, "Get" button, and horizontal screenshot carousel.
- **Google Play Simulation**: Authentic Material You store listing layout with install CTA, review breakdown, and category tags.
- **Real-Time Platform Switching**: Instant toggle between Apple and Google listing previews with automatic device model alignment and responsive stage scaling.

## Multi-Language Translation and Localization

LaunchShot provides a complete localization suite supporting 20 languages:

- **Supported Languages**: English (`en`), Spanish (`es`), Portuguese (`pt`), French (`fr`), German (`de`), Italian (`it`), Japanese (`ja`), Chinese Simplified (`zh`), Korean (`ko`), Russian (`ru`), Arabic (`ar` - with native RTL layout support), Dutch (`nl`), Turkish (`tr`), Indonesian (`id`), Hindi (`hi`), Vietnamese (`vi`), Polish (`pl`), Thai (`th`), Swedish (`sv`), Greek (`el`).
- **Hybrid Translation Pipeline**:
  1. Built-in offline dictionary for high-frequency store copy and phrases.
  2. Primary remote translation provider (Google Translate API endpoint).
  3. Secondary fallback provider (MyMemory API).
  4. Non-destructive failure handling: Failed requests report errors without altering source text.
- **Batch Translation**: Auto-translate all slides across multiple target languages simultaneously with live progress reporting.
- **JSON Import & Export**:
  - Export single-language or multi-language JSON dictionaries.
  - Import external localization files to update headlines and subtitles instantly.

## Saving, Storage, and Project Files

- **Local IndexedDB Persistence**: Projects, canvas states, settings, and uploaded image blobs are stored locally in IndexedDB using stable binary references.
- **Save Status Lifecycle**: The header indicates real-time state: **Saving**, **Saved locally**, or **Could not save** with a one-click retry trigger.
- **Legacy Migration**: Previous `screenshot-editor-storage` localStorage snapshots migrate automatically on first load. Expired session URLs become empty image slots while preserving design settings.
- **Portable `.launchshot` Files**:
  - Version 2 files embed raw image binary data, allowing complete project restoration when transferred between computers and browsers.
  - Version 1 JSON files remain backward-compatible.
- **Multi-Project Management**: Create, rename, duplicate, switch, and delete multiple project drafts in the Project Manager modal.
- **Export All Projects**: Create a full backup bundle of all projects in a single file.

## Export Pipeline

The export engine generates pixel-perfect, store-ready PNG assets:

- **Headless Snapshot Surface**: Renders an isolated off-screen DOM tree at native device resolution using `html-to-image`, ensuring editor controls, zoom levels, and selection states never interfere with output quality.
- **Asset Readiness Verification**: Verifies all web fonts, image elements, and background textures are fully loaded and decoded before capturing.
- **Pre-Export Validation**: Detects and warns about missing screenshots, empty headlines, or missing translations prior to export.
- **Multi-Size & Multi-Language ZIP Packaging**:
  - Organizes exported PNGs into clean directory structures: `[language]/[device_size]/[slide_number].png`.
  - Generates `export-errors.json` in partial export scenarios detailing any failed slides with actionable diagnostics.
- **Clipboard Copy**: One-click **Copy design image** copies the active slide directly to the system clipboard as a PNG for immediate pasting into Slack, Figma, or documentation.

## Keyboard Shortcuts

- `Cmd+Z` / `Ctrl+Z`: Undo last change.
- `Shift+Cmd+Z` / `Shift+Ctrl+Z`: Redo change.
- `Escape`: Close open modals and previews.
- `Enter` (in ASO / Niche inputs): Trigger instant generation.

## Development and Testing

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the studio.

### Build and Lint

```bash
npm run build
npm run lint
```

### Unit Tests

Run the native Node.js test runner suite:

```bash
npm test
```

The test suite covers:
- ASO story arc synthesis and 6 conversion tones.
- 30+ niche template generation and keyword matching.
- Multi-project JSON import/export and portable binary persistence.
- Durable image restoration and IndexedDB migration.
- Translation fallbacks and language dictionary parsing.
- Canvas layout geometry and non-overlapping transform constraints.
- Atomic design styling, undo/redo state synchronization, and emoji compliance.

### Browser Tests

End-to-end browser tests use Playwright with Chromium:

```bash
npx playwright install chromium
npm run test:browser
```

The browser suite covers design deletion and image clearing, presets, placement/export parity, narrow screens, upload, later-slide selection, style undo, durable image restoration, portable project transfer, save failure/retry, partial PNG export/retry, translation failure, long headlines, legacy image recovery, studio dark mode theming and persistence, per-slide phone yaw rotation, and typography font loading. Generated screenshots and traces are written to ignored `test-results/`.

## Implementation Boundaries

- `StudioWorkspace`: Owns the workspace layout, filmstrip reordering, canvas stage, zoom fitting, and modal orchestrations.
- `MinimalPhoneFrame`: Renders authentic hardware styling (Apple, Samsung Galaxy, general Android, iPad), bezels, shadows, status bars, and 3D yaw perspective transforms.
- `SlideRenderer`: Pure functional component passing explicit slide data, settings, language, and dimensions to the shared canvas composition.
- `CanvasEditor`: Renders the high-fidelity interactive canvas composition, badge stickers, doodles, floating cards, text boxes, and responsive scaling.
- `WorkspaceDesignControls`: Inspector sub-panels for typography, layouts, device framing, background gradients, shadow lighting, doodles, status bars, and templates.
- `Sidebar`: Global sidebar providing asset drag-and-drop, niche generator, smart ASO copywriter, translation management, store platform selector, and curated background palettes.
- `projectStorage`: Persists image assets under stable binary IDs in IndexedDB and resolves display URLs during hydration.
- `shadowEngine`: Computes multi-layer CSS box shadows and ambient occlusion based on the 25-point directional light source grid.
- `translator`: Handles offline dictionary matching, Google Translate API / MyMemory API remote requests, batch translation, and JSON localization parsing.
- `exportSurface`: Headless rendering pipeline that loads fonts, verifies layout fit, and renders full-resolution PNG blobs.

Reference specifications, checked September 2026:
- [Apple screenshot specifications](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)
- [Google Play preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

## License

MIT.
