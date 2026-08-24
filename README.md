# LaunchShot (AppLaunch Studio)

> **Effortless, high-converting App Store and Google Play screenshot showcases in seconds.**

**LaunchShot** is a modern, web-based screenshot designer built for mobile developers and indie hackers. Drag and drop your raw app screenshots, and LaunchShot will automatically extract your app's color palette, select contrasting typography, and apply high-converting showcase templates ready for the Apple App Store and Google Play Store.

---

## Features

- **Automatic Color Scheme Extraction:** Uses fast color quantization algorithms (`fast-average-color`) to extract dominant background colors and auto-calculate contrasting accessible typography (black or white) per screenshot.
- **Comprehensive Device Sizing:**
  - **Apple iPhone Series:** iPhone 16 Pro Max (6.9"), iPhone 11 Pro Max / XS Max (6.5"), iPhone 16 Pro / 15 Pro (6.3"/6.1"), iPhone X/XS (5.8"), iPhone 8 Plus / 7 Plus (5.5"), and iPhone SE (4.7").
  - **Apple iPad Series:** iPad Pro (12.9"), iPad Pro (11").
  - **Samsung Galaxy Flagship Series:** Full support for Galaxy S20, S21, S22, S23, S24, S25, and S26 series (both Ultra QHD+ and Base/Plus FHD+).
  - **Android Standards:** Tall 20:9 (`1080x2400`), classic 16:9 (`1080x1920`), and Android Tablets 10".
  - **Social Graphics:** Play Store Feature Graphic (`1024x500`).
- **Showcase Layout Templates:**
  - Includes a wide variety of templates covering Basic layouts, Tilt angles, Half bleeds, 3D Isometrics, Split-verticals, and custom Social Graphics templates.
- **Smart ASO Copywriter & Niche Generator:** 
  - Automatically extract keywords from your app's description and inject them into proven App Store Optimization formulas.
  - One-click Niche template generator applies specialized colors, copy, and layouts based on your app's category (Fitness, Finance, Dating, Food, etc.).
- **App Store & Social Badges:**
  - Toggle native "Download on the App Store" badges and top-rated star badges (e.g., "4.9 App Store").
- **Mockup Styles:**
  - Choose between Light, Dark, Glass, Clay-Light, and Clay-Dark flat CSS device bezels.
- **Multi-Image Drag & Drop Workflow:**
  - Full-screen drag and drop overlay for bulk importing screenshots.
  - Automatic template cycling across all imported images.
- **Smooth Canvas Navigation & Flow:**
  - Mouse wheel horizontal scrolling across all slides.
  - Zoom controls (`40%` to `100%`) with quick-fit reset.
  - Distraction-free Preview Mode.
- **LocalStorage Persistence:** Automatically persists your edits in the browser so you never lose your progress on refresh.
- **1-Click High-Res ZIP Export:** Uses `html-to-image` and `JSZip` to generate pixel-perfect, native hardware resolution PNGs packaged in a single `.zip` file.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware
- **Color Extraction:** [`fast-average-color`](https://github.com/fast-average-color/fast-average-color)
- **Exporting & Archiving:** [`html-to-image`](https://github.com/bubkoo/html-to-image), [`jszip`](https://github.com/Stuk/jszip), and [`file-saver`](https://github.com/eligrey/FileSaver.js)
- **Icons:** [`react-icons`](https://react-icons.github.io/react-icons/) (Ionicons, Io5)

---

## Getting Started

### Prerequisites

- Node.js 18+ installed on your machine
- npm, pnpm, or yarn

### Installation

1. Clone your repository:
   ```bash
   git clone <your-repo-url>
   cd applaunch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root application layout
│   │   ├── page.tsx           # Main workspace & canvas container
│   │   └── globals.css        # Global Tailwind CSS styles
│   ├── components/
│   │   ├── CanvasEditor.tsx   # Individual screenshot card & layout renderer
│   │   ├── MinimalPhoneFrame.tsx # Responsive, flat CSS device bezel
│   │   └── Sidebar.tsx        # Device settings, templates, & bulk upload panel
│   ├── config/
│   │   ├── aso.ts             # App Store Optimization copy formulas
│   │   ├── badges.ts          # App Store badge configurations
│   │   ├── fonts.ts           # Google Fonts configurations
│   │   ├── niches.ts          # Niche-specific layout mapping
│   │   ├── sizes.ts           # Device dimensions, aspect ratios & export pixel ratios
│   │   └── templates.ts       # Layout template gallery
│   ├── store/
│   │   └── useEditorStore.ts  # Zustand store with LocalStorage persistence
│   └── utils/
│       ├── export.ts          # High-resolution rendering & ZIP generator
│       ├── imageProcessor.ts  # Bulk file processing & color quantization
│       └── keywordExtractor.ts # NLP keyword extraction for ASO
```

---

## License

This project is licensed under the MIT License.
