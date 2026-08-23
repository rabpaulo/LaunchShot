# 🚀 LaunchShot (AppLaunch Studio)

> **Effortless, high-converting App Store and Google Play screenshot showcases in seconds.**

**LaunchShot** is a modern, web-based screenshot designer built for mobile developers and indie hackers. Drag and drop your raw app screenshots, and LaunchShot will automatically extract your app's color palette, select contrasting typography, and apply high-converting showcase templates ready for the Apple App Store and Google Play Store.

---

## ✨ Features

- **🎨 Automatic Color Scheme Extraction:** Uses fast color quantization algorithms (`fast-average-color`) to extract dominant background colors and auto-calculate contrasting accessible typography (black or white) per screenshot.
- **📱 Comprehensive Device Sizing:**
  - **Apple iPhone Series:** iPhone 16 Pro Max (6.9"), iPhone 11 Pro Max / XS Max (6.5"), iPhone 16 Pro / 15 Pro (6.3"/6.1"), iPhone X/XS (5.8"), iPhone 8 Plus / 7 Plus (5.5"), and iPhone SE (4.7").
  - **Samsung Galaxy Flagship Series:** Full support for Galaxy S20, S21, S22, S23, S24, S25, and S26 series (both Ultra QHD+ and Base/Plus FHD+).
  - **Android Standards:** Tall 20:9 (`1080x2400`) and classic 16:9 (`1080x1920`).
- **🖼️ 7 Showcase Layout Templates:**
  - **Basic Top (Standard):** Bold title on top, phone anchored at the bottom.
  - **Basic Bottom (Header Phone):** Phone at the top, title and subtitle at the bottom.
  - **Tilt Right:** Dynamic modern angle with phone breaking out of the bottom right.
  - **Tilt Left:** Mirrored dynamic angle for sequence variation.
  - **Half Right (Bleed):** Clean vertical split with phone bleeding off the right edge.
  - **Half Left (Bleed):** Phone bleeding off the left edge.
  - **Device Only:** Distraction-free, centered phone mockup.
- **⚡ Multi-Image Drag & Drop Workflow:**
  - Full-screen drag and drop overlay for bulk importing screenshots.
  - Automatic template cycling across all imported images.
  - Direct drag and drop onto individual mockups to replace single screenshots.
- **🔄 Smooth Canvas Navigation & Flow:**
  - Mouse wheel horizontal scrolling across all slides.
  - Quick jump slide navigation pills (`[1] [2] [3]...`) in the top bar.
  - Zoom controls (`40%` to `100%`) with quick-fit reset.
  - Reorder slides left/right and duplicate existing slides with one click.
- **💾 LocalStorage Persistence:** Automatically persists your edits in the browser so you never lose your progress on refresh.
- **📦 1-Click High-Res ZIP Export:** Uses `html-to-image` and `JSZip` to generate pixel-perfect, native hardware resolution PNGs packaged in a single `.zip` file.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware
- **Color Extraction:** [`fast-average-color`](https://github.com/fast-average-color/fast-average-color)
- **Exporting & Archiving:** [`html-to-image`](https://github.com/bubkoo/html-to-image), [`jszip`](https://github.com/Stuk/jszip), and [`file-saver`](https://github.com/eligrey/FileSaver.js)
- **Icons:** [`lucide-react`](https://lucide.dev/)

---

## 🚀 Getting Started

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

## 📂 Project Structure

```text
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root application layout
│   │   ├── page.tsx           # Main workspace & canvas container
│   │   └── globals.css        # Global Tailwind CSS styles
│   ├── components/
│   │   ├── CanvasEditor.tsx   # Individual screenshot card & layout renderer
│   │   ├── MinimalPhoneFrame.tsx # Responsive, flat CSS device bezel
│   │   └── Sidebar.tsx        # Device settings & bulk upload panel
│   ├── config/
│   │   └── sizes.ts           # Device dimensions, aspect ratios & export pixel ratios
│   ├── store/
│   │   └── useEditorStore.ts  # Zustand store with LocalStorage persistence
│   └── utils/
│       ├── export.ts          # High-resolution rendering & ZIP generator
│       └── imageProcessor.ts  # Bulk file processing & color quantization
```

---

## 📱 Supported Resolutions

| Device Category | Target Preset | Export Dimensions | Pixel Scale |
| :--- | :--- | :--- | :--- |
| **iPhone** | iPhone 16 Pro Max (6.9") | `1290 × 2796` | 3x Native |
| **iPhone** | iPhone 11 Pro Max / XS Max (6.5") | `1284 × 2778` | 3x Native |
| **iPhone** | iPhone 16 Pro / 15 Pro (6.3" / 6.1") | `1179 × 2556` | 3x Native |
| **iPhone** | iPhone X / XS (5.8") | `1125 × 2436` | 3x Native |
| **iPhone** | iPhone 8 Plus / 7 Plus (5.5") | `1242 × 2208` | 3x Native |
| **iPhone** | iPhone SE (4.7") | `750 × 1334` | 2x Native |
| **Samsung** | Galaxy S24 / S25 / S26 Ultra | `1440 × 3120` | 3x Native |
| **Samsung** | Galaxy S24 / S25 / S26 Base & Plus | `1080 × 2340` | 3x Native |
| **Samsung** | Galaxy S22 / S23 Ultra | `1440 × 3088` | 3x Native |
| **Samsung** | Galaxy S20 / S21 Ultra | `1440 × 3200` | 3x Native |
| **Samsung** | Galaxy S20 / S21 Base & Plus | `1080 × 2400` | 3x Native |
| **Android** | Tall Standard 20:9 | `1080 × 2400` | 3x Native |
| **Android** | Classic 16:9 | `1080 × 1920` | 3x Native |

---

## 📄 License

This project is licensed under the MIT License.
