'use client';

import React from 'react';
import { CalloutPinConfig } from '@/config/floatingCards';

interface CalloutPinProps {
  pin: CalloutPinConfig;
  onRemove?: () => void;
}

export function CalloutPin({ pin, onRemove }: CalloutPinProps) {
  const getPositionClass = () => {
    switch (pin.position) {
      case 'top-left':
        return 'top-16 left-12';
      case 'top-right':
        return 'top-16 right-12';
      case 'bottom-left':
        return 'bottom-24 left-12';
      case 'bottom-right':
        return 'bottom-24 right-12';
      case 'center':
        return 'top-1/2 left-1/2';
      default:
        return 'top-1/2 left-1/2';
    }
  };

  const accentColor = pin.color || '#3b82f6';

  const transforms: string[] = [];
  if (pin.position === 'center' || !pin.position) {
    transforms.push('translate(-50%, -50%)');
  }
  if (pin.offsetX) transforms.push(`translateX(${pin.offsetX}px)`);
  if (pin.offsetY) transforms.push(`translateY(${pin.offsetY}px)`);

  return (
    <div
      className={`absolute z-30 flex items-center gap-2 pointer-events-auto transition-transform duration-200 hover:scale-105 ${getPositionClass()}`}
      style={{
        transform: transforms.length > 0 ? transforms.join(' ') : undefined,
      }}
    >
      {/* Pulse Dot */}
      <div className="relative flex items-center justify-center">
        <span
          className="animate-ping absolute inline-flex h-6 w-6 rounded-full opacity-75"
          style={{ backgroundColor: accentColor }}
        />
        <span
          className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white shadow-lg"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Label Pill */}
      <div
        className="px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-xl backdrop-blur-md border border-white/30 flex items-center gap-1.5"
        style={{ backgroundColor: `${accentColor}cc` }}
      >
        <span>{pin.text}</span>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="hover:text-red-200 font-bold ml-1 text-xs"
            title="Remove pin"
          >
            &times;
          </button>
        )}
      </div>
    </div>
  );
}
