export interface StatusBarConfig {
  enabled: boolean;
  theme: 'auto' | 'dark' | 'light';
  time: string;
  batteryLevel: number;
  showWifi: boolean;
  showCellular: boolean;
  networkType: '5G' | 'LTE' | 'Wi-Fi';
  style: 'ios' | 'android';
}

export const DEFAULT_STATUS_BAR: StatusBarConfig = {
  enabled: true,
  theme: 'auto',
  time: '9:41',
  batteryLevel: 100,
  showWifi: true,
  showCellular: true,
  networkType: '5G',
  style: 'ios',
};
