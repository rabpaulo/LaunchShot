'use client';

import React from 'react';
import { BadgeConfig } from '@/config/badges';
import { Trophy, Flame, Shield, Heart, Sparkles, Star } from 'lucide-react';

interface BadgeStickerProps {
  badge?: BadgeConfig;
  textColor?: string;
}

export function BadgeSticker({ badge, textColor = '#ffffff' }: BadgeStickerProps) {
  if (!badge || !badge.enabled || !badge.text) return null;

  const renderIcon = () => {
    switch (badge.icon) {
      case 'trophy':
        return <Trophy className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />;
      case 'flame':
        return <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />;
      case 'shield':
        return <Shield className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30" />;
      case 'heart':
        return <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />;
      case 'sparkle':
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
      case 'star':
        return <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />;
      default:
        return null;
    }
  };

  if (badge.style === 'minimal-star') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide select-none"
        style={{ color: textColor }}
      >
        {renderIcon()}
        <span>{badge.text}</span>
        {badge.subtext && <span className="opacity-75 font-normal">· {badge.subtext}</span>}
      </div>
    );
  }

  if (badge.style === 'pill-solid') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/95 text-gray-900 rounded-full shadow-lg border border-white/40 text-xs font-bold select-none backdrop-blur-md">
        {renderIcon()}
        <span className="tracking-tight">{badge.text}</span>
        {badge.subtext && (
          <span className="text-[10px] text-gray-500 font-medium pl-1 border-l border-gray-200">
            {badge.subtext}
          </span>
        )}
      </div>
    );
  }

  // Default: pill-glass (frosted glass)
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/25 backdrop-blur-md rounded-full shadow-md border border-white/20 text-xs font-semibold select-none"
      style={{ color: textColor }}
    >
      {renderIcon()}
      <span className="tracking-tight">{badge.text}</span>
      {badge.subtext && (
        <span className="text-[10px] opacity-80 font-normal pl-1 border-l border-white/20">
          {badge.subtext}
        </span>
      )}
    </div>
  );
}
