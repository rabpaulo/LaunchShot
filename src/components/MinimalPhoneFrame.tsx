import React from 'react';
import { TargetSizeId } from '@/config/sizes';
import { MockupStyle } from '@/store/useEditorStore';
import { StatusBarConfig } from '@/config/statusBar';
import { StatusBarOverlay } from './StatusBarOverlay';

export type DeviceStyle = 'apple' | 'samsung-ultra' | 'samsung-base' | 'android' | 'ipad' | 'android-tablet';

interface MinimalPhoneFrameProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  targetSizeId?: TargetSizeId;
  mockupStyle?: MockupStyle;
  showNotch?: boolean;
  statusBar?: StatusBarConfig;
}

export function getDeviceStyle(targetSizeId?: TargetSizeId): DeviceStyle {
  if (!targetSizeId) return 'apple';
  if (targetSizeId.startsWith('ios-')) return 'apple';
  if (targetSizeId.startsWith('ipad-')) return 'ipad';
  if (targetSizeId === 'android-tablet-10') return 'android-tablet';
  if (targetSizeId.includes('ultra')) return 'samsung-ultra';
  if (targetSizeId.startsWith('samsung-')) return 'samsung-base';
  return 'android';
}

export function MinimalPhoneFrame({ 
  children, 
  width = 280, 
  height = 580,
  targetSizeId = 'ios-6.5',
  mockupStyle = 'dark',
  showNotch = true,
  statusBar
}: MinimalPhoneFrameProps) {
  const style = getDeviceStyle(targetSizeId);

  // Proportional corner radii based on authentic device engineering
  let borderRadius = Math.round(width * 0.12); // Default Apple rounded
  if (style === 'samsung-ultra') {
    borderRadius = Math.max(8, Math.round(width * 0.035)); // Samsung Ultra signature sharp boxy corners
  } else if (style === 'samsung-base' || style === 'android') {
    borderRadius = Math.round(width * 0.085); // Samsung Base/Plus refined curve
  }

  const innerRadius = Math.max(4, Math.round(borderRadius * 0.78));
  const bezelPadding = Math.max(5, Math.round(width * 0.024));

  let outerStyleClass = "bg-[#121316] border-white/10 shadow-2xl"; // default dark
  if (mockupStyle === 'light') {
    outerStyleClass = "bg-[#f8fafc] border-gray-300/80 shadow-xl";
  } else if (mockupStyle === 'glass') {
    outerStyleClass = "bg-white/20 backdrop-blur-md border-white/40 shadow-2xl";
  } else if (mockupStyle === 'clay-dark') {
    outerStyleClass = "bg-[#2A2A2A] border-[#3A3A3A] shadow-[-10px_-10px_30px_rgba(255,255,255,0.05),10px_10px_30px_rgba(0,0,0,0.5)]";
  } else if (mockupStyle === 'clay-light') {
    outerStyleClass = "bg-[#E0E5EC] border-[#FFFFFF] shadow-[-10px_-10px_30px_rgba(255,255,255,0.8),10px_10px_30px_rgba(163,177,198,0.4)]";
  }

  return (
    <div 
      className={`relative inline-block overflow-hidden flex-shrink-0 border ${outerStyleClass}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${borderRadius}px`,
        padding: `${bezelPadding}px`,
      }}
    >
      {/* Outer bezel / Screen container */}
      <div 
        className="relative w-full h-full overflow-hidden bg-gray-100 flex items-center justify-center"
        style={{ borderRadius: `${innerRadius}px` }}
      >
        {/* Device-Specific Cutout (Apple Dynamic Island vs Samsung Punch Hole) */}
        {showNotch && (
          style === 'apple' ? (
          /* Apple Dynamic Island */
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-black rounded-full z-20 shadow-inner flex items-center justify-end px-1"
            style={{
              width: `${Math.round(width * 0.27)}px`,
              height: `${Math.max(13, Math.round(height * 0.028))}px`,
            }}
          >
            {/* Subtle camera lens glare */}
            <div className="w-2 h-2 rounded-full bg-zinc-900/90 border border-white/10" />
          </div>
        ) : (
          /* Samsung Infinity-O Punch-Hole Camera */
          <div 
            className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-black rounded-full z-20 shadow-md border border-neutral-800 flex items-center justify-center"
            style={{
              width: `${Math.max(10, Math.round(width * 0.045))}px`,
              height: `${Math.max(10, Math.round(width * 0.045))}px`,
            }}
          >
            {/* Camera lens reflection */}
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-950/90 border border-zinc-900/40" />
          </div>
        ))}

        {/* Status Bar Overlay */}
        {statusBar && statusBar.enabled && (
          <StatusBarOverlay config={statusBar} targetSizeId={targetSizeId} width={width} />
        )}
        
        {/* Screen Content */}
        <div className="w-full h-full bg-gray-200 z-10 overflow-hidden relative">
          {children}
        </div>
      </div>
    </div>
  );
}
