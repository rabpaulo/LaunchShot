export type BadgeIcon = 'star' | 'trophy' | 'flame' | 'shield' | 'heart' | 'sparkle' | 'none';

export interface BadgeConfig {
  enabled: boolean;
  icon: BadgeIcon;
  text: string;
  subtext?: string;
  style: 'pill-glass' | 'pill-solid' | 'minimal-star';
}

export const BADGE_PRESETS: { label: string; config: BadgeConfig }[] = [
  // App Store Badges
  {
    label: 'App Store Rating',
    config: {
      enabled: true,
      icon: 'star',
      text: '4.9 App Store',
      subtext: '50k+ reviews',
      style: 'pill-glass',
    },
  },
  {
    label: 'Apple Featured',
    config: {
      enabled: true,
      icon: 'star',
      text: '"Essential App"',
      subtext: 'Featured by Apple',
      style: 'pill-glass',
    },
  },
  {
    label: 'Apple Design Award',
    config: {
      enabled: true,
      icon: 'trophy',
      text: 'Apple Design Award',
      subtext: 'Winner',
      style: 'pill-solid',
    },
  },
  {
    label: 'App of the Day',
    config: {
      enabled: true,
      icon: 'trophy',
      text: 'App of the Day',
      subtext: 'App Store',
      style: 'pill-solid',
    },
  },
  // Google Play Badges
  {
    label: 'Google Play Rating',
    config: {
      enabled: true,
      icon: 'star',
      text: '4.9 Google Play',
      subtext: '100k+ ratings',
      style: 'pill-glass',
    },
  },
  {
    label: 'Google Play Editors\' Choice',
    config: {
      enabled: true,
      icon: 'star',
      text: 'Editors\' Choice',
      subtext: 'Google Play',
      style: 'pill-glass',
    },
  },
  {
    label: 'Google Play Best of Award',
    config: {
      enabled: true,
      icon: 'trophy',
      text: 'Best of 2024',
      subtext: 'Google Play Winner',
      style: 'pill-solid',
    },
  },
  // Social Proof & Community
  {
    label: '#1 Product Hunt',
    config: {
      enabled: true,
      icon: 'flame',
      text: '#1 Product of the Day',
      subtext: 'Product Hunt',
      style: 'pill-solid',
    },
  },
  {
    label: 'Community Milestone',
    config: {
      enabled: true,
      icon: 'heart',
      text: 'Loved by 1M+ Users',
      subtext: 'Worldwide',
      style: 'pill-glass',
    },
  },
  {
    label: 'AI Innovation Award',
    config: {
      enabled: true,
      icon: 'sparkle',
      text: '#1 AI Tool of 2024',
      subtext: 'Top Rated',
      style: 'pill-glass',
    },
  },
  // Security & Privacy
  {
    label: 'Privacy & Security',
    config: {
      enabled: true,
      icon: 'shield',
      text: '100% Private & On-Device',
      subtext: 'Zero Data Logged',
      style: 'pill-glass',
    },
  },
  {
    label: 'HIPAA & Bank Grade',
    config: {
      enabled: true,
      icon: 'shield',
      text: 'Bank-Grade 256-bit',
      subtext: 'End-to-End Encrypted',
      style: 'pill-solid',
    },
  },
];

