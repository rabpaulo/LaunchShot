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
      subtext: '30k+ ratings',
      style: 'pill-glass',
    },
  },
  {
    label: 'Apple Featured',
    config: {
      enabled: true,
      icon: 'star',
      text: '"Game changer"',
      subtext: 'Featured by Apple',
      style: 'pill-glass',
    },
  },
  {
    label: 'Apple Design Award',
    config: {
      enabled: true,
      icon: 'trophy',
      text: 'App of the Day',
      subtext: 'Apple Design Award Nominee',
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
      subtext: '30k+ ratings',
      style: 'pill-glass',
    },
  },
  {
    label: 'Google Play Editors\' Choice',
    config: {
      enabled: true,
      icon: 'star',
      text: 'Editors\' Choice',
      subtext: 'Google Play Store',
      style: 'pill-glass',
    },
  },
  {
    label: 'Google Play Best of Award',
    config: {
      enabled: true,
      icon: 'trophy',
      text: 'Best of 2023',
      subtext: 'Google Play Award',
      style: 'pill-solid',
    },
  },
  // Platform Agnostic
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
    label: 'Privacy & Security',
    config: {
      enabled: true,
      icon: 'shield',
      text: '100% Private & On-Device',
      subtext: 'No Data Collected',
      style: 'pill-glass',
    },
  },
];
