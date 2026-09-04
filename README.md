# LaunchShot (AppLaunch Studio)

> **Effortless, high-converting App Store and Google Play screenshot showcases in seconds.**

LaunchShot is a modern, web-based screenshot designer built for mobile developers and indie hackers. Drag and drop your raw app screenshots, and LaunchShot will automatically extract your app's color palette, select contrasting accessible typography, and apply high-converting showcase templates ready for the Apple App Store and Google Play Store.

---

## Features

### Movable Social Proof Badges
- **Direct Canvas Drag-and-Drop:** Freely click and drag rating, award, milestone, and security badges anywhere across the canvas with scale-compensated pointer tracking (`zoomScale`).
- **Position Presets:** Snap badges instantly to key locations: *Above Title (Default)*, *Top Left*, *Top Center*, *Top Right*, *Bottom Left*, *Bottom Center*, or *Bottom Right*.
- **Offset Fine-Tuning & HUD:** Real-time floating HUD showing live coordinates `(X, Y)` with quick reset, plus nudge step buttons (`-10px`, `+10px`) in the badge menu.
- **Badge Styles:** Choose between Frosted Glass (`pill-glass`), Solid White (`pill-solid`), and Minimal Star (`minimal-star`) styling.
- **Batch Apply to All:** Propagate badge styling, copy, and positioning across all screenshots with a single click.
- **Clean Export Protection:** All interactive drag rings, handles, and HUD indicators use the `no-export` class and are automatically excluded from final PNG exports.

### Interactive Resizable Text Boxes
- **On-Canvas Resize Handles:** Direct-manipulation resize handles on the left, right, and bottom corner of the text container.
- **Corner Proportional Scaling:** Corner drag handle simultaneously scales text box width and font sizes (`titleFontSize` and `subtitleFontSize`) with safety clamping.
- **Dimensions HUD:** Live percentage width and pixel font size indicator with quick `+` and `-` nudge buttons and layout default reset.
- **Text Box Menu:** Dedicated popover toolbar with width sliders, typography size controls, text alignment (left, center, right), and "Apply to All" batch functionality.
- **Layout-Aware Scaling:** Non-linear height factoring and layout-aware typography for split, half-bleed, and kinetic layouts.

### 31+ Authentic Niche Showcase Templates
- **Curated Niche Catalog:** 31 pre-built mobile app niches with authentic, high-converting copy and tailored visual styles:
  - AI & Smart Copilot, Finance & Crypto, Fitness & Workout, Nutrition & Macros, Meditation & Sleep, Productivity & Notes, Habits & Streaks, Dating & Relationships, E-Commerce & Fashion, Travel & Vacation, Food & Dining, Social & Community, Education & Language, Music & Audio, Photo & Video Editor, Gaming & Esports, News & Daily Briefs, Real Estate & Rentals, VPN & Security, Health & Medical, Parenting & Baby Tracker, Pet Care & Training, Smart Home & IoT, Books & Summaries, Weather & Outdoors, Events & Nightlife, Auto & Mileage Tracker, Mental Health & CBT, Astrology & Horoscope, Business & Invoicing, Utilities & Scanner.
- **5-Slide Story Arc:** Each niche generates 5 structured story slides (Hook & Rating, Core Benefit, Feature Deep-Dive, Trust & Security, Call to Action).

### Hand-Drawn Doodle Accents
- **Organic Visual Highlights:** Accentuate key words and titles with hand-drawn SVG doodles: underlines, circles, waves, sparkles, stars, questions, arrows, and double squiggles.
- **Flexible Positioning:** Place doodles above, below, to the left, to the right, or underneath selected text.
- **Curated Color Palette:** Color accents automatically harmonize with app themes (sunshine yellow, coral pink, sky blue, emerald green, lavender).

### Floating UI Cards & Callout Pins
- **Micro-UI Cards:** Insert floating stat metrics, user review stars, push notifications, and feature chips directly over screenshots.
- **Pulsing Callout Pins:** Highlight specific on-screen app features with animated pulsing radar dots and customizable label tags.

### Status Bar Sanitizer
- **Production-Ready Status Bars:** Clean up cluttered real-world screenshots with clean 9:41 time, full battery, strong Wi-Fi, and 5G indicators.
- **Cross-Platform Support:** Native layouts for both iOS (Dynamic Island / Notch) and Android (Center Punch-Hole).
- **Customizable Levels:** Toggle battery percentages and adjust carrier signals per canvas or globally.

### Panoramic Multi-Screen Spanning
- **Continuous Visual Flow:** Span panoramic gradients and continuous visual backgrounds across sequential screenshot cards.
- **Automatic Slicing:** Dynamically calculates exact slice offsets per slide index and total canvas count.

### Multi-Language Localization (20+ Languages)
- **Dedicated Translation Manager:** Manage and preview copy across 20+ App Store and Google Play languages (Spanish, Portuguese, French, German, Japanese, Chinese, Korean, and more).
- **One-Click Auto-Translation:** Instantly translate individual slides or all canvases across all supported languages with smart dictionary matching.
- **Localized ZIP Batch Export:** Export screenshots for multiple languages simultaneously, packaged neatly into localized folders.
- **JSON Import & Export:** Export and import translation matrices in standard JSON format for professional localization pipelines.

### App Store & Google Play Context Preview
- **Realistic Store Simulation:** Test how screenshots appear to users directly inside realistic mockups of Apple App Store and Google Play search listing interfaces.
- **Listing Elements:** Preview app icons, star ratings, review counts, titles, and download CTA buttons alongside your screenshots.

### Color Extraction & Typography
- **Automated Palette Analysis:** Uses `fast-average-color` to extract dominant colors and auto-calculate contrasting accessible typography (light or dark text) per screenshot.
- **Google Fonts Collection:** Inter, Roboto, Poppins, Montserrat, Plus Jakarta Sans, Outfit, SF Pro Display, and more.

### Comprehensive Device Sizing
- **Apple iPhone Series:** iPhone 16 Pro Max (6.9"), iPhone 11 Pro Max / XS Max (6.5"), iPhone 16 Pro / 15 Pro (6.3"/6.1"), iPhone X/XS (5.8"), iPhone 8 Plus / 7 Plus (5.5"), iPhone SE (4.7").
- **Apple iPad Series:** iPad Pro (12.9"), iPad Pro (11").
- **Samsung Galaxy Flagship Series:** Full support for Galaxy S20, S21, S22, S23, S24, S25, and S26 series (both Ultra QHD+ and Base/Plus FHD+).
- **Android Standards:** Tall 20:9 (1080x2400), classic 16:9 (1080x1920), and Android Tablets 10".
- **Social Graphics:** Google Play Feature Graphic (1024x500).

### Workspace & Project Management
- **Multi-Project Support:** Create, duplicate, rename, and manage multiple app projects in separate tabs.
- **History & Undo/Redo:** Full undo/redo stack (`Ctrl+Z`, `Ctrl+Y`) with project state synchronization.
- **View Modes:** Toggle between Horizontal Scrolling and Vertical Stacking views, with Presentation Slideshow mode.
- **Local Persistence:** Automatic browser persistence with LocalStorage so work is never lost.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware
- **Color Extraction:** [`fast-average-color`](https://github.com/fast-average-color/fast-average-color)
- **Exporting & Archiving:** [`html-to-image`](https://github.com/bubkoo/html-to-image), [`jszip`](https://github.com/Stuk/jszip), and [`file-saver`](https://github.com/eligrey/FileSaver.js)
- **Icons:** [`react-icons`](https://react-icons.github.io/react-icons/) (Ionicons 5)

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, pnpm, or yarn

### Installation

1. Clone repository:
   ```bash
   git clone https://github.com/rabpaulo/LaunchShot.git
   cd LaunchShot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

Run the test suite with Node's native test runner:
```bash
npm test
```

### Production Build

Create an optimized production build:
```bash
npm run build
```

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root application layout
│   │   ├── page.tsx                # Main workspace & canvas container
│   │   └── globals.css             # Global Tailwind CSS styles
│   ├── components/
│   │   ├── BadgeSticker.tsx        # Editable social proof & rating badge sticker
│   │   ├── CalloutPin.tsx          # Pulsing radar callout feature pin
│   │   ├── CanvasEditor.tsx        # Canvas card, drag handles, layouts & movable badges
│   │   ├── CanvasImage.tsx         # Transformed screenshot rendering component
│   │   ├── DoodleAccent.tsx        # Hand-drawn SVG doodle accents
│   │   ├── ExportModal.tsx         # Multi-size & multi-language ZIP export dialog
│   │   ├── FloatingCard.tsx        # Floating micro-UI widgets (reviews, stats, notifications)
│   │   ├── ImageEditorModal.tsx    # Crop, zoom, rotation, and image filters modal
│   │   ├── MinimalPhoneFrame.tsx   # Responsive, flat CSS device bezel
│   │   ├── ProjectManagerModal.tsx # Multi-project management & switching
│   │   ├── Sidebar.tsx             # Controls, templates, ASO copy & niche generator
│   │   ├── StatusBarOverlay.tsx    # Clean iOS & Android sanitized status bars
│   │   ├── StoreContextPreview.tsx # App Store & Google Play UI search preview
│   │   ├── TemplateGalleryModal.tsx # Template browser & layout picker
│   │   ├── TranslationModal.tsx    # Multi-language localization & translation manager
│   │   └── ui/                     # Reusable UI primitives (dropdowns, buttons)
│   ├── config/
│   │   ├── aso.ts                  # ASO copywriting formulas & tone templates
│   │   ├── backgrounds.ts          # Curated background color presets & gradients
│   │   ├── badges.ts               # Badge presets, styles, and position options
│   │   ├── doodles.ts              # Doodle shapes, positions, and color palettes
│   │   ├── floatingCards.ts        # Widget types, themes, and default positions
│   │   ├── fonts.ts                # Typography options and Google Fonts
│   │   ├── languages.ts            # Supported localization languages
│   │   ├── niches.ts               # 31+ niche templates and metadata
│   │   ├── panoramas.ts            # Panoramic multi-canvas presets & slice styles
│   │   ├── sizes.ts                # Device dimensions, pixel ratios & formats
│   │   ├── statusBar.ts            # Default status bar configuration
│   │   ├── templateLogos.ts        # Vector logos for templates
│   │   └── templates.ts            # Full catalog of screenshot layout templates
│   ├── store/
│   │   └── useEditorStore.ts       # Central Zustand store with LocalStorage persistence
│   └── utils/
│       ├── export.ts               # High-resolution rendering & ZIP packaging
│       ├── imageProcessor.ts       # File ingestion, color quantization & resizing
│       ├── keywordExtractor.ts     # NLP keyword extraction for ASO copy
│       └── translator.ts           # Offline dictionary & translation utilities
└── tests/
    ├── canvas-layout.test.mjs       # Layout and zoom scaling tests
    ├── editor-store-and-fixes.test.mjs # Store, movable badge & text box tests
    ├── niche-templates-and-aso.test.mjs # 31 niches and geometry verification tests
    └── translations.test.mjs        # Translation matrix & parser tests
```

---

## License

This project is licensed under the MIT License.
