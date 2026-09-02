'use client';

import React from 'react';
import { FloatingCardConfig } from '@/config/floatingCards';
import {
  IoStar,
  IoTrendingUp,
  IoShieldCheckmark,
  IoNotifications,
  IoHeart,
  IoFlash,
  IoCheckmarkCircle,
  IoLockClosed,
} from 'react-icons/io5';

interface FloatingCardProps {
  card: FloatingCardConfig;
  onUpdate?: (updates: Partial<FloatingCardConfig>) => void;
  onRemove?: () => void;
}

export function FloatingCard({ card, onRemove }: FloatingCardProps) {
  const getIcon = () => {
    switch (card.icon) {
      case 'star':
        return <IoStar className="w-4 h-4 text-amber-400 fill-amber-400" />;
      case 'trend-up':
        return <IoTrendingUp className="w-4 h-4 text-emerald-400" />;
      case 'shield-check':
        return <IoShieldCheckmark className="w-4 h-4 text-blue-400" />;
      case 'bell':
        return <IoNotifications className="w-4 h-4 text-amber-400" />;
      case 'heart':
        return <IoHeart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'zap':
        return <IoFlash className="w-4 h-4 text-yellow-400" />;
      case 'check-circle':
        return <IoCheckmarkCircle className="w-4 h-4 text-emerald-400" />;
      case 'lock':
        return <IoLockClosed className="w-4 h-4 text-indigo-400" />;
      default:
        return <IoStar className="w-4 h-4 text-amber-400" />;
    }
  };

  const getPositionClass = () => {
    switch (card.position) {
      case 'top-left':
        return 'top-8 left-6';
      case 'top-right':
        return 'top-8 right-6';
      case 'bottom-left':
        return 'bottom-12 left-6';
      case 'bottom-right':
        return 'bottom-12 right-6';
      case 'center-left':
        return 'top-1/2 left-4';
      case 'center-right':
        return 'top-1/2 right-4';
      default:
        return 'top-8 left-6';
    }
  };

  const getThemeClass = () => {
    switch (card.theme) {
      case 'glass-dark':
        return 'bg-black/60 backdrop-blur-xl border-white/20 text-white shadow-2xl shadow-black/50';
      case 'glass-light':
        return 'bg-white/80 backdrop-blur-xl border-black/10 text-gray-900 shadow-2xl shadow-black/10';
      case 'solid-dark':
        return 'bg-zinc-950 border-zinc-800 text-white shadow-xl';
      case 'solid-light':
        return 'bg-white border-gray-200 text-gray-900 shadow-xl';
      case 'accent':
        return 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-white/30 shadow-2xl shadow-indigo-500/30';
      default:
        return 'bg-black/60 backdrop-blur-xl border-white/20 text-white shadow-2xl';
    }
  };

  const transforms: string[] = [];
  if (card.position === 'center-left' || card.position === 'center-right') {
    transforms.push('translateY(-50%)');
  }
  if (card.offsetX) transforms.push(`translateX(${card.offsetX}px)`);
  if (card.offsetY) transforms.push(`translateY(${card.offsetY}px)`);

  return (
    <div
      className={`group absolute z-30 max-w-[220px] rounded-2xl border p-3 flex items-center gap-3 transition-transform duration-200 hover:scale-105 pointer-events-auto ${getPositionClass()} ${getThemeClass()}`}
      style={{
        transform: transforms.length > 0 ? transforms.join(' ') : undefined,
      }}
    >
      <div className="p-2 rounded-xl bg-white/10 flex-shrink-0 flex items-center justify-center">
        {getIcon()}
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-extrabold text-xs leading-tight truncate">{card.title}</span>
        {card.subtitle && (
          <span className="text-[10px] opacity-75 font-medium leading-tight truncate mt-0.5">
            {card.subtitle}
          </span>
        )}
      </div>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 transition-opacity"
          title="Remove floating card"
        >
          &times;
        </button>
      )}
    </div>
  );
}
