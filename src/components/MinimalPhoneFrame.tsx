import React from 'react';
import { TargetSizeId } from '@/config/sizes';

export type DeviceStyle = 'apple' | 'samsung-ultra' | 'samsung-base' | 'android';

interface MinimalPhoneFrameProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  targetSizeId?: TargetSizeId;
}

export function getDeviceStyle(targetSizeId?: TargetSizeId): DeviceStyle {
  if (!targetSizeId || targetSizeId.startsWith('ios-')) return 'apple';
  if (targetSizeId.includes('ultra')) return 'samsung-ultra';
  if (targetSizeId.startsWith('samsung-')) return 'samsung-base';
  return 'android';
}

export function MinimalPhoneFrame({ 
  children, 
  width = 280, 
  height = 580,
  targetSizeId = 'ios-6.5'
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

  return (
    <div 
      className="relative inline-block bg-[#121316] shadow-2xl overflow-hidden flex-shrink-0 border border-white/10"
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
        {style === 'apple' ? (
          /* Apple Dynamic Island */
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-black rounded-full z-20 shadow-inner flex items-center justify-end px-1"
            style={{
              width: `${Math.round(width * 0.27)}px`,
              height: `${Math.max(13, Math.round(height * 0.028))}px`,
            }}
          >
            {/* Subtle camera lens glare */}
            <div className="w-2 h-2 rounded-full bg-slate-900/90 border border-white/10" />
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
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950/90 border border-indigo-900/40" />
          </div>
        )}
        
        {/* Screen Content */}
        <div className="w-full h-full bg-gray-200 z-10 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
