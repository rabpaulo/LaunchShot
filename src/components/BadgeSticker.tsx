'use client';

import React from 'react';
import { BadgeConfig } from '@/config/badges';
import { IoTrophy, IoFlame, IoShieldCheckmark, IoHeart, IoSparkles, IoStar } from 'react-icons/io5';

interface BadgeStickerProps {
  badge?: BadgeConfig;
  textColor?: string;
  onChangeText?: (text: string) => void;
  onChangeSubtext?: (text: string) => void;
}

export function BadgeSticker({ badge, textColor = '#ffffff', onChangeText, onChangeSubtext }: BadgeStickerProps) {
  if (!badge || !badge.enabled || !badge.text) return null;

  const renderIcon = () => {
    switch (badge.icon) {
      case 'trophy':
        return <IoTrophy className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
      case 'flame':
        return <IoFlame className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />;
      case 'shield':
        return <IoShieldCheckmark className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />;
      case 'heart':
        return <IoHeart className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />;
      case 'sparkle':
        return <IoSparkles className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />;
      case 'star':
        return <IoStar className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />;
      default:
        return null;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeText) {
      onChangeText(e.target.value);
    }
  };

  const handleSubtextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeSubtext) {
      onChangeSubtext(e.target.value);
    }
  };

  if (badge.style === 'minimal-star') {
    return (
      <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide"
        style={{ color: textColor }}
      >
        {renderIcon()}
        {onChangeText ? (
          <input
            type="text"
            value={badge.text}
            onChange={handleTextChange}
            onPointerDown={(e) => e.stopPropagation()}
            className="bg-transparent border-none outline-none focus:ring-1 focus:ring-white/30 rounded px-1 transition-all w-24 text-center"
            style={{ color: textColor }}
          />
        ) : (
          <span>{badge.text}</span>
        )}
        {badge.subtext && (
          <span className="opacity-75 font-normal flex items-center gap-1">
            · 
            {onChangeSubtext ? (
              <input
                type="text"
                value={badge.subtext}
                onChange={handleSubtextChange}
                onPointerDown={(e) => e.stopPropagation()}
                className="bg-transparent border-none outline-none focus:ring-1 focus:ring-white/30 rounded px-1 transition-all w-24"
                style={{ color: textColor }}
              />
            ) : (
              badge.subtext
            )}
          </span>
        )}
      </div>
    );
  }

  if (badge.style === 'pill-solid') {
    return (
      <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-white/95 text-gray-900 rounded-full shadow-lg border border-white/40 text-xs font-bold backdrop-blur-md">
        {renderIcon()}
        {onChangeText ? (
          <input
            type="text"
            value={badge.text}
            onChange={handleTextChange}
            onPointerDown={(e) => e.stopPropagation()}
            className="bg-transparent border-none outline-none focus:ring-1 focus:ring-black/10 rounded px-1 text-gray-900 tracking-tight transition-all w-28 text-center"
          />
        ) : (
          <span className="tracking-tight">{badge.text}</span>
        )}
        {badge.subtext && (
          <span className="text-[10px] text-gray-500 font-medium pl-1 border-l border-gray-200 flex items-center">
            {onChangeSubtext ? (
              <input
                type="text"
                value={badge.subtext}
                onChange={handleSubtextChange}
                onPointerDown={(e) => e.stopPropagation()}
                className="bg-transparent border-none outline-none focus:ring-1 focus:ring-black/10 rounded px-1 transition-all w-20 text-gray-500"
              />
            ) : (
              badge.subtext
            )}
          </span>
        )}
      </div>
    );
  }

  // Default: pill-glass (frosted glass)
  return (
    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-black/25 backdrop-blur-md rounded-full shadow-md border border-white/20 text-xs font-semibold"
      style={{ color: textColor }}
    >
      {renderIcon()}
      {onChangeText ? (
        <input
          type="text"
          value={badge.text}
          onChange={handleTextChange}
          onPointerDown={(e) => e.stopPropagation()}
          className="bg-transparent border-none outline-none focus:ring-1 focus:ring-white/30 rounded px-1 tracking-tight transition-all w-28 text-center"
          style={{ color: textColor }}
        />
      ) : (
        <span className="tracking-tight">{badge.text}</span>
      )}
      {badge.subtext && (
        <span className="text-[10px] opacity-80 font-normal pl-1 border-l border-white/20 flex items-center">
          {onChangeSubtext ? (
            <input
              type="text"
              value={badge.subtext}
              onChange={handleSubtextChange}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-transparent border-none outline-none focus:ring-1 focus:ring-white/30 rounded px-1 transition-all w-20"
              style={{ color: textColor }}
            />
          ) : (
            badge.subtext
          )}
        </span>
      )}
    </div>
  );
}
