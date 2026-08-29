export type DoodleType =
  | 'none'
  | 'question'
  | 'underline-wave'
  | 'circle-loop'
  | 'lightning'
  | 'speech-bubble'
  | 'burst'
  | 'sparkles'
  | 'arrow-curved'
  | 'crown'
  | 'heart'
  | 'star'
  | 'fire'
  | 'check'
  | 'double-underline'
  | 'spiral'
  | 'target';

export type DoodlePosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'underline'
  | 'left'
  | 'right'
  | 'circle-around';

export interface DoodleItem {
  type: DoodleType;
  position: DoodlePosition;
  color?: string;
  size?: number; // scale multiplier, default 1
  rotation?: number; // rotation in degrees
  offsetX?: number; // pixel offset X
  offsetY?: number; // pixel offset Y
}

export interface DoodleConfig {
  enabled: boolean;
  color?: string; // fallback color if item has no color
  doodles: DoodleItem[];
}

export const DEFAULT_DOODLE_COLOR = '#facc15'; // Vibrant Yellow (matches image)

export const DOODLE_COLOR_PALETTE: { name: string; value: string }[] = [
  { name: 'Vibrant Yellow', value: '#facc15' },
  { name: 'Warm Amber', value: '#fbbf24' },
  { name: 'Neon Green', value: '#4ade80' },
  { name: 'Electric Cyan', value: '#38bdf8' },
  { name: 'Coral Pink', value: '#fb7185' },
  { name: 'Vivid Orange', value: '#fb923c' },
  { name: 'Soft Purple', value: '#c084fc' },
  { name: 'Crisp White', value: '#ffffff' },
  { name: 'Pure Black', value: '#0f172a' },
];

export interface DoodlePreset {
  id: string;
  label: string;
  description: string;
  config: DoodleConfig;
}

export const DOODLE_PRESETS: DoodlePreset[] = [
  {
    id: 'habits-question-wave',
    label: 'Question & Wave Underline',
    description: 'Sketch question mark on top-right with squiggly underline',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'question', position: 'top-right' },
        { type: 'underline-wave', position: 'underline' },
      ],
    },
  },
  {
    id: 'streaks-loop-lightning',
    label: 'Circle Loop & Lightning',
    description: 'Hand-drawn oval loop to the left with energy bolt on bottom-right',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'circle-loop', position: 'left' },
        { type: 'lightning', position: 'bottom-right' },
      ],
    },
  },
  {
    id: 'widgets-bubble-burst',
    label: 'Speech Bubble & Spark Burst',
    description: 'Sketch chat bubble on top-left with spark accents on bottom-right',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'speech-bubble', position: 'top-left' },
        { type: 'burst', position: 'bottom-right' },
      ],
    },
  },
  {
    id: 'sparkle-arrow',
    label: 'Sparkles & Curved Arrow',
    description: 'Magic 4-point sparkles with a directional curved arrow',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'sparkles', position: 'top-right' },
        { type: 'arrow-curved', position: 'bottom-left' },
      ],
    },
  },
  {
    id: 'crown-sparkles',
    label: 'Crown & Sparkles',
    description: 'Winning 3-point crown on top-right with sparkle accents',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'crown', position: 'top-right' },
        { type: 'sparkles', position: 'bottom-right' },
      ],
    },
  },
  {
    id: 'heart-wave',
    label: 'Heart & Wave Underline',
    description: 'Playful sketch heart with a wavy underline',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'heart', position: 'top-left' },
        { type: 'underline-wave', position: 'underline' },
      ],
    },
  },
  {
    id: 'lightning-double-line',
    label: 'Lightning & Double Underline',
    description: 'Fast energetic lightning bolt with double hand-drawn underline',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'lightning', position: 'top-right' },
        { type: 'double-underline', position: 'underline' },
      ],
    },
  },
  {
    id: 'target-burst',
    label: 'Target & Spark Burst',
    description: 'Focus bullseye target with energetic spark dashes',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'target', position: 'top-right' },
        { type: 'burst', position: 'bottom-left' },
      ],
    },
  },
  {
    id: 'star-loop',
    label: 'Star & Circle Loop',
    description: '5-point star on top-right with highlight circle loop',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'star', position: 'top-right' },
        { type: 'circle-loop', position: 'left' },
      ],
    },
  },
  {
    id: 'fire-sparkles',
    label: 'Flame & Sparkles',
    description: 'Trending hand-drawn flame with magic sparkles',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'fire', position: 'top-right' },
        { type: 'sparkles', position: 'bottom-left' },
      ],
    },
  },
  {
    id: 'check-double-line',
    label: 'Checkmark & Double Line',
    description: 'Verified checkmark with double underline stroke',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'check', position: 'top-right' },
        { type: 'double-underline', position: 'underline' },
      ],
    },
  },
  {
    id: 'only-wave',
    label: 'Wavy Underline Only',
    description: 'Minimal squiggly underline emphasizing the title text',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'underline-wave', position: 'underline' },
      ],
    },
  },
  {
    id: 'only-loop',
    label: 'Circle Loop Only',
    description: 'Organic hand-drawn loop circling the title',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'circle-loop', position: 'left' },
      ],
    },
  },
  {
    id: 'only-lightning',
    label: 'Lightning Bolt Only',
    description: 'Hand-drawn lightning bolt on bottom-right',
    config: {
      enabled: true,
      color: '#facc15',
      doodles: [
        { type: 'lightning', position: 'bottom-right' },
      ],
    },
  },
];

export const DOODLE_TYPE_OPTIONS: { value: DoodleType; label: string }[] = [
  { value: 'question', label: 'Question Mark' },
  { value: 'underline-wave', label: 'Wavy Underline' },
  { value: 'circle-loop', label: 'Circle Loop' },
  { value: 'lightning', label: 'Lightning Bolt' },
  { value: 'speech-bubble', label: 'Speech Bubble' },
  { value: 'burst', label: 'Spark Burst' },
  { value: 'sparkles', label: 'Magic Sparkles' },
  { value: 'arrow-curved', label: 'Curved Arrow' },
  { value: 'crown', label: 'Crown' },
  { value: 'heart', label: 'Heart' },
  { value: 'star', label: 'Star' },
  { value: 'fire', label: 'Flame' },
  { value: 'check', label: 'Checkmark' },
  { value: 'double-underline', label: 'Double Underline' },
  { value: 'spiral', label: 'Swirl Spiral' },
  { value: 'target', label: 'Target Bullseye' },
  { value: 'none', label: 'None' },
];

export const DOODLE_POSITION_OPTIONS: { value: DoodlePosition; label: string }[] = [
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'underline', label: 'Underline' },
  { value: 'left', label: 'Left Side' },
  { value: 'right', label: 'Right Side' },
  { value: 'circle-around', label: 'Around Text' },
];
