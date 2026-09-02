import { StatusBarConfig } from '@/config/statusBar';
import { TargetSizeId } from '@/config/sizes';

interface StatusBarOverlayProps {
  config?: StatusBarConfig;
  targetSizeId?: TargetSizeId;
  width: number;
}

export function StatusBarOverlay({ config, width }: StatusBarOverlayProps) {
  if (!config || !config.enabled) return null;

  const isLightText = config.theme === 'light';
  const textColorClass = isLightText ? 'text-white' : 'text-black';
  const fillClass = isLightText ? 'fill-white' : 'fill-black';
  const borderClass = isLightText ? 'border-white/80' : 'border-black/80';

  // Scale font & spacing based on device width
  const fontSize = Math.max(10, Math.round(width * 0.04));
  const iconScale = Math.max(0.75, width / 360);

  return (
    <div
      className={`absolute top-0 left-0 w-full z-30 flex items-center justify-between px-6 pointer-events-none select-none ${textColorClass}`}
      style={{
        height: `${Math.max(26, Math.round(width * 0.09))}px`,
        paddingTop: `${Math.max(4, Math.round(width * 0.018))}px`,
      }}
    >
      {/* Time Display */}
      <div className="flex items-center">
        <span
          className="font-bold tracking-tight"
          style={{ fontSize: `${fontSize}px`, fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {config.time || '9:41'}
        </span>
      </div>

      {/* Dynamic Status Icons */}
      <div
        className="flex items-center gap-1.5"
        style={{ transform: `scale(${iconScale})`, transformOrigin: 'right center' }}
      >
        {/* Cellular / Network Signal */}
        {config.showCellular && (
          <div className="flex items-center gap-1">
            <svg className={`w-4 h-3.5 ${fillClass}`} viewBox="0 0 24 24">
              <rect x="2" y="16" width="3" height="6" rx="0.5" />
              <rect x="7" y="12" width="3" height="10" rx="0.5" />
              <rect x="12" y="8" width="3" height="14" rx="0.5" />
              <rect x="17" y="4" width="3" height="18" rx="0.5" />
            </svg>
            <span className="text-[10px] font-extrabold tracking-tighter mr-0.5">
              {config.networkType || '5G'}
            </span>
          </div>
        )}

        {/* Wi-Fi Icon */}
        {config.showWifi && (
          <svg className={`w-3.5 h-3.5 ${fillClass}`} viewBox="0 0 24 24">
            <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.67 0 7.02 1.41 9.53 3.73L12 19.34 2.47 11.23C4.98 8.91 8.33 7.5 12 7.5z" />
          </svg>
        )}

        {/* Battery Indicator */}
        <div className="flex items-center gap-0.5">
          <div className={`w-6 h-3 rounded-[3px] border ${borderClass} p-0.5 flex items-center relative`}>
            <div
              className={`h-full rounded-[1px] ${isLightText ? 'bg-white' : 'bg-black'}`}
              style={{ width: `${Math.max(10, Math.min(100, config.batteryLevel))}%` }}
            />
          </div>
          <div className={`w-0.5 h-1 rounded-r-[1px] ${isLightText ? 'bg-white/80' : 'bg-black/80'}`} />
        </div>
      </div>
    </div>
  );
}
