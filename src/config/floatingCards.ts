export type FloatingCardType = 'stat-metric' | 'user-review' | 'notification' | 'feature-chip';

export type FloatingCardPosition = 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right' 
  | 'center-left' 
  | 'center-right';

export type FloatingCardTheme = 
  | 'glass-dark' 
  | 'glass-light' 
  | 'solid-dark' 
  | 'solid-light' 
  | 'accent';

export interface FloatingCardConfig {
  id: string;
  type: FloatingCardType;
  title: string;
  subtitle?: string;
  icon?: 'star' | 'trend-up' | 'shield-check' | 'bell' | 'heart' | 'zap' | 'check-circle' | 'lock';
  position: FloatingCardPosition;
  theme: FloatingCardTheme;
  offsetY?: number;
  offsetX?: number;
}

export interface CalloutPinConfig {
  id: string;
  text: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  color?: string;
  pointingDirection?: 'left' | 'right' | 'top' | 'bottom';
  offsetY?: number;
  offsetX?: number;
}

export const FLOATING_CARD_PRESETS: Array<{
  label: string;
  config: Omit<FloatingCardConfig, 'id'>;
}> = [
  {
    label: 'Stat: +38% Growth',
    config: {
      type: 'stat-metric',
      title: '+38% Faster',
      subtitle: 'Optimized workflow',
      icon: 'trend-up',
      position: 'top-left',
      theme: 'glass-dark',
    }
  },
  {
    label: 'Rating: 5.0 Stars (10k+)',
    config: {
      type: 'stat-metric',
      title: '5.0 Stars',
      subtitle: '10k+ Verified Reviews',
      icon: 'star',
      position: 'top-right',
      theme: 'glass-dark',
    }
  },
  {
    label: 'Review: Game Changer',
    config: {
      type: 'user-review',
      title: '"Completely transformed how I work daily."',
      subtitle: 'Sarah K. • Verified User',
      icon: 'heart',
      position: 'bottom-left',
      theme: 'glass-dark',
    }
  },
  {
    label: 'Security: End-to-End Encrypted',
    config: {
      type: 'feature-chip',
      title: 'End-to-End Encrypted',
      subtitle: 'Zero Knowledge Security',
      icon: 'shield-check',
      position: 'bottom-right',
      theme: 'glass-dark',
    }
  },
  {
    label: 'Notification: Streak Active',
    config: {
      type: 'notification',
      title: 'Daily Streak: 14 Days Active',
      subtitle: 'You are in the top 5%',
      icon: 'zap',
      position: 'center-left',
      theme: 'accent',
    }
  },
  {
    label: 'Feature: Offline Access',
    config: {
      type: 'feature-chip',
      title: '100% Offline Ready',
      subtitle: 'Syncs automatically',
      icon: 'check-circle',
      position: 'center-right',
      theme: 'solid-dark',
    }
  }
];

export const CALLOUT_PIN_PRESETS: Array<{
  label: string;
  config: Omit<CalloutPinConfig, 'id'>;
}> = [
  {
    label: 'Tap to Explore',
    config: {
      text: 'One-tap Action',
      position: 'center',
      color: '#3b82f6',
      pointingDirection: 'left',
    }
  },
  {
    label: 'Real-time Sync',
    config: {
      text: 'Live Syncing',
      position: 'top-right',
      color: '#10b981',
      pointingDirection: 'bottom',
    }
  },
  {
    label: 'Smart Filters',
    config: {
      text: 'AI Filters',
      position: 'bottom-left',
      color: '#f59e0b',
      pointingDirection: 'right',
    }
  }
];
