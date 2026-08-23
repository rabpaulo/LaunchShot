export type BadgeIcon = 'star' | 'trophy' | 'flame' | 'shield' | 'heart' | 'sparkle' | 'none';

export interface BadgeConfig {
  enabled: boolean;
  icon: BadgeIcon;
  text: string;
  subtext?: string;
  style: 'pill-glass' | 'pill-solid' | 'minimal-star';
}

export const BADGE_PRESETS: { label: string; config: BadgeConfig }[] = [
  {
    label: '5-Star App Store Rating',
    config: {
      enabled: true,
      icon: 'star',
      text: '★★★★★ 4.9 App Store',
      subtext: '30k+ ratings',
      style: 'pill-glass',
    },
  },
  {
    label: '5-Star User Praise',
    config: {
      enabled: true,
      icon: 'star',
      text: '★★★★★ "Game changer"',
      subtext: 'Featured by Apple',
      style: 'pill-glass',
    },
  },
  {
    label: 'App of the Day Award',
    config: {
      enabled: true,
      icon: 'trophy',
      text: 'App of the Day',
      subtext: 'Apple Design Award Nominee',
      style: 'pill-solid',
    },
  },
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
