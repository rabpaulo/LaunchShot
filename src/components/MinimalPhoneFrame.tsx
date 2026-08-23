import React from 'react';

interface MinimalPhoneFrameProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export function MinimalPhoneFrame({ 
  children, 
  width = 280, 
  height = 580 
}: MinimalPhoneFrameProps) {
  // Proportional corner radius and bezel
  const borderRadius = Math.round(width * 0.12);
  const innerRadius = Math.round(borderRadius * 0.78);
  const bezelPadding = Math.max(6, Math.round(width * 0.025));

  return (
    <div 
      className="relative inline-block bg-black shadow-2xl overflow-hidden flex-shrink-0"
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
        {/* Dynamic Island / Notch */}
        <div 
          className="absolute top-2 left-1/2 -translate-x-1/2 bg-black rounded-full z-20 shadow-inner"
          style={{
            width: `${Math.round(width * 0.28)}px`,
            height: `${Math.max(14, Math.round(height * 0.03))}px`,
          }}
        />
        
        {/* Screen Content */}
        <div className="w-full h-full bg-gray-200 z-10 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
