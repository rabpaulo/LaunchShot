'use client';

import React from 'react';
import { DoodleConfig, DoodleItem, DoodleType, DoodlePosition } from '@/config/doodles';

interface DoodleAccentProps {
  doodle?: DoodleConfig;
  defaultColor?: string;
}

export function DoodleShape({ type, color = '#facc15', className = '' }: { type: DoodleType; color?: string; className?: string }) {
  switch (type) {
    case 'question':
      return (
        <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M20 30 C 18 12, 52 8, 58 26 C 62 38, 42 46, 40 60"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Question dot with sketchy circular feel */}
          <circle cx="40" cy="76" r="4.5" fill={color} />
        </svg>
      );

    case 'underline-wave':
      return (
        <svg viewBox="0 0 220 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
          <path
            d="M6 14 C 30 5, 55 24, 85 13 C 115 2, 140 23, 170 12 C 190 4, 205 18, 214 14"
            stroke={color}
            strokeWidth="5.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'circle-loop':
      return (
        <svg viewBox="0 0 110 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M70 18 C 36 10, 10 26, 12 52 C 14 78, 42 84, 76 80 C 100 76, 106 50, 92 28 C 80 12, 50 14, 38 24"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'lightning':
      return (
        <svg viewBox="0 0 60 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M38 6 L 16 44 L 34 44 L 20 84 L 52 36 L 34 36 L 46 6 Z"
            stroke={color}
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'speech-bubble':
      return (
        <svg viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M18 36 C 18 18, 34 10, 58 10 C 82 10, 92 18, 92 36 C 92 52, 78 62, 54 62 C 40 62, 34 65, 20 74 C 23 66, 23 60, 18 54 C 18 48, 18 42, 18 36 Z"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'burst':
      return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path d="M40 8 L 40 22" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <path d="M40 58 L 40 72" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <path d="M8 40 L 22 40" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <path d="M58 40 L 72 40" stroke={color} strokeWidth="5" strokeLinecap="round" />
          <path d="M16 16 L 27 27" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M53 53 L 64 64" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M64 16 L 53 27" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M27 53 L 16 64" stroke={color} strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      );

    case 'sparkles':
      return (
        <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          {/* Main 4-point sparkle star */}
          <path
            d="M45 10 Q 45 42 12 45 Q 45 48 45 80 Q 45 48 78 45 Q 45 42 45 10 Z"
            fill={color}
            opacity="0.9"
          />
          {/* Secondary mini sparkle */}
          <path
            d="M74 16 Q 74 28 62 29 Q 74 30 74 42 Q 74 30 86 29 Q 74 28 74 16 Z"
            fill={color}
            opacity="0.8"
          />
        </svg>
      );

    case 'arrow-curved':
      return (
        <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M20 20 C 50 12, 72 32, 65 65"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M48 60 L 65 67 L 72 48"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'crown':
      return (
        <svg viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M12 52 L 20 22 L 38 38 L 48 14 L 58 38 L 76 22 L 84 52 Z"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 58 L 86 58"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'heart':
      return (
        <svg viewBox="0 0 90 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M45 72 C 28 58, 12 44, 12 28 C 12 14, 24 8, 36 12 C 42 14, 45 20, 45 20 C 45 20, 48 14, 54 12 C 66 8, 78 14, 78 28 C 78 44, 62 58, 45 72 Z"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M45 10 L 56 32 L 80 36 L 62 52 L 67 76 L 45 64 L 23 76 L 28 52 L 10 36 L 34 32 Z"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'fire':
      return (
        <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M40 10 C 48 24, 62 38, 64 52 C 66 70, 52 82, 38 82 C 22 82, 14 68, 16 54 C 18 42, 28 36, 30 24 C 28 34, 38 42, 42 46 C 44 48, 48 40, 40 10 Z"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'check':
      return (
        <svg viewBox="0 0 80 70" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M12 36 L 32 56 L 72 16"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'double-underline':
      return (
        <svg viewBox="0 0 200 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
          <path
            d="M8 10 C 60 7, 130 6, 192 10"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <path
            d="M18 22 C 75 18, 140 19, 182 22"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'spiral':
      return (
        <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <path
            d="M45 45 C 48 42, 50 48, 46 50 C 40 54, 34 44, 40 36 C 48 26, 62 34, 58 48 C 52 66, 28 62, 22 44 C 14 24, 40 12, 64 18 C 84 24, 88 56, 70 74 C 54 88, 22 84, 10 64"
            stroke={color}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'target':
      return (
        <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="45" cy="45" r="34" stroke={color} strokeWidth="4.5" strokeDasharray="3 1" />
          <circle cx="45" cy="45" r="20" stroke={color} strokeWidth="4.5" />
          <circle cx="45" cy="45" r="6" fill={color} />
        </svg>
      );

    case 'none':
    default:
      return null;
  }
}

function getPositionStyle(position: DoodlePosition, type: DoodleType): { containerStyle: React.CSSProperties; widthClass: string } {
  switch (position) {
    case 'top-right':
      return {
        containerStyle: {
          position: 'absolute',
          top: '-24px',
          right: '-28px',
          zIndex: 30,
          pointerEvents: 'none',
          transform: type === 'question' ? 'rotate(12deg)' : type === 'crown' ? 'rotate(15deg)' : 'none',
        },
        widthClass: type === 'sparkles' ? 'w-14 h-14' : type === 'question' ? 'w-12 h-14' : 'w-12 h-12',
      };

    case 'top-left':
      return {
        containerStyle: {
          position: 'absolute',
          top: '-24px',
          left: '-28px',
          zIndex: 30,
          pointerEvents: 'none',
          transform: type === 'speech-bubble' ? 'rotate(-8deg)' : 'rotate(-10deg)',
        },
        widthClass: type === 'speech-bubble' ? 'w-16 h-14' : 'w-12 h-12',
      };

    case 'bottom-right':
      return {
        containerStyle: {
          position: 'absolute',
          bottom: '-20px',
          right: '-24px',
          zIndex: 30,
          pointerEvents: 'none',
          transform: type === 'lightning' ? 'rotate(10deg)' : 'none',
        },
        widthClass: type === 'lightning' ? 'w-10 h-16' : type === 'burst' ? 'w-12 h-12' : 'w-12 h-12',
      };

    case 'bottom-left':
      return {
        containerStyle: {
          position: 'absolute',
          bottom: '-20px',
          left: '-24px',
          zIndex: 30,
          pointerEvents: 'none',
          transform: 'rotate(-10deg)',
        },
        widthClass: type === 'lightning' ? 'w-10 h-16' : 'w-12 h-12',
      };

    case 'underline':
      return {
        containerStyle: {
          position: 'absolute',
          bottom: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '75%',
          maxWidth: '320px',
          zIndex: 25,
          pointerEvents: 'none',
        },
        widthClass: 'w-full h-7',
      };

    case 'left':
      return {
        containerStyle: {
          position: 'absolute',
          top: '50%',
          left: '-32px',
          transform: 'translateY(-50%) rotate(-6deg)',
          zIndex: 30,
          pointerEvents: 'none',
        },
        widthClass: type === 'circle-loop' ? 'w-16 h-14' : 'w-12 h-12',
      };

    case 'right':
      return {
        containerStyle: {
          position: 'absolute',
          top: '50%',
          right: '-32px',
          transform: 'translateY(-50%) rotate(8deg)',
          zIndex: 30,
          pointerEvents: 'none',
        },
        widthClass: 'w-12 h-12',
      };

    case 'circle-around':
      return {
        containerStyle: {
          position: 'absolute',
          inset: '-12px -16px',
          zIndex: 25,
          pointerEvents: 'none',
          transform: 'rotate(-1deg)',
        },
        widthClass: 'w-full h-full',
      };

    default:
      return {
        containerStyle: {
          position: 'absolute',
          top: 0,
          right: 0,
          pointerEvents: 'none',
        },
        widthClass: 'w-10 h-10',
      };
  }
}

export function DoodleItemRenderer({ item, defaultColor }: { item: DoodleItem; defaultColor: string }) {
  if (!item || item.type === 'none') return null;

  const color = item.color || defaultColor || '#facc15';
  const { containerStyle, widthClass } = getPositionStyle(item.position, item.type);

  // Apply custom offsets / rotation if specified
  const transforms: string[] = [];
  if (containerStyle.transform && containerStyle.transform !== 'none') {
    transforms.push(containerStyle.transform);
  }
  if (item.rotation !== undefined) {
    transforms.push(`rotate(${item.rotation}deg)`);
  }
  if (item.size !== undefined) {
    transforms.push(`scale(${item.size})`);
  }

  const mergedStyle: React.CSSProperties = {
    ...containerStyle,
    transform: transforms.length > 0 ? transforms.join(' ') : undefined,
    ...(item.offsetX !== undefined ? { marginLeft: `${item.offsetX}px` } : {}),
    ...(item.offsetY !== undefined ? { marginTop: `${item.offsetY}px` } : {}),
  };

  return (
    <div style={mergedStyle} className="select-none animate-in fade-in duration-300">
      <DoodleShape type={item.type} color={color} className={widthClass} />
    </div>
  );
}

export function DoodleAccentGroup({ doodle, defaultColor = '#facc15' }: DoodleAccentProps) {
  if (!doodle || !doodle.enabled || !doodle.doodles || doodle.doodles.length === 0) {
    return null;
  }

  const groupColor = doodle.color || defaultColor;

  return (
    <>
      {doodle.doodles.map((item, index) => (
        <DoodleItemRenderer
          key={`${item.type}-${item.position}-${index}`}
          item={item}
          defaultColor={groupColor}
        />
      ))}
    </>
  );
}
