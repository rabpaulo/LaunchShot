'use client';

import React, { useRef, useState } from 'react';
import { CanvasItem, LayoutType, useEditorStore } from '@/store/useEditorStore';
import { MinimalPhoneFrame } from './MinimalPhoneFrame';
import { BadgeSticker } from './BadgeSticker';
import { 
  UploadCloud, 
  Trash2, 
  LayoutTemplate, 
  ChevronLeft, 
  ChevronRight, 
  Copy,
  Star,
  Sparkles,
  X
} from 'lucide-react';
import { FastAverageColor } from 'fast-average-color';
import { TARGET_SIZES } from '@/config/sizes';
import { FONT_OPTIONS } from '@/config/fonts';
import { BADGE_PRESETS, BadgeConfig } from '@/config/badges';

const fac = new FastAverageColor();

interface CanvasEditorProps {
  canvas: CanvasItem;
  index: number;
  total: number;
}

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: 'basic-top', label: 'Basic Top (Standard)' },
  { value: 'basic-bottom', label: 'Basic Bottom (Header Phone)' },
  { value: 'tilt-right', label: 'Tilt Right (Dynamic Angle)' },
  { value: 'tilt-left', label: 'Tilt Left (Dynamic Angle)' },
  { value: 'half-right', label: 'Half Right (Bleed Right)' },
  { value: 'half-left', label: 'Half Left (Bleed Left)' },
  { value: 'device-only', label: 'Device Only (Clean Mockup)' },
];

function getContrastColor(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

export function CanvasEditor({ canvas, index, total }: CanvasEditorProps) {
  const { 
    globalSettings, 
    updateCanvas, 
    removeCanvas, 
    moveCanvas, 
    duplicateCanvas 
  } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBadgeMenu, setShowBadgeMenu] = useState(false);

  const isDark = globalSettings.theme !== 'light';

  const processSingleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    try {
      const color = await fac.getColorAsync(url);
      updateCanvas(canvas.id, { 
        imageSrc: url,
        backgroundColor: color.hex,
        textColor: getContrastColor(color.hex),
      });
    } catch {
      updateCanvas(canvas.id, { imageSrc: url });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processSingleFile(file);
    }
  };

  const handlePhoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processSingleFile(file);
    }
  };

  const sizeConfig = TARGET_SIZES[globalSettings.targetSize] || TARGET_SIZES['ios-6.5'];
  const canvasWidth = sizeConfig.logicalWidth;
  const canvasHeight = sizeConfig.logicalHeight;
  const zoomScale = globalSettings.zoomScale || 0.65;
  
  const currentLayout = canvas.layout || 'basic-top';
  const isCompact = canvasHeight < 750;

  // Active Font
  const activeFontId = canvas.fontFamily || globalSettings.fontFamily || 'plus-jakarta';
  const fontConfig = FONT_OPTIONS.find((f) => f.id === activeFontId) || FONT_OPTIONS[0];

  // Compute adaptive phone frame dimensions
  const getPhoneDimensions = () => {
    let heightFactor = 0.65;
    if (currentLayout === 'device-only') heightFactor = 0.82;
    else if (currentLayout === 'half-right' || currentLayout === 'half-left') heightFactor = 0.78;
    else if (currentLayout === 'tilt-right' || currentLayout === 'tilt-left') heightFactor = 0.72;
    else if (isCompact) heightFactor = 0.58;

    const phoneH = Math.round(canvasHeight * heightFactor);
    const phoneW = Math.round(phoneH * 0.48);
    return { phoneW, phoneH };
  };

  const { phoneW, phoneH } = getPhoneDimensions();

  // Dynamic layout rendering config
  const getLayoutConfig = () => {
    switch (currentLayout) {
      case 'basic-top':
        return {
          containerClass: "flex flex-col justify-between items-center",
          textContainerClass: `w-full px-6 pt-8 pb-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-2`,
          phoneWrapperClass: "w-full flex justify-center items-end flex-1 overflow-hidden relative",
          textAlign: "center" as const,
        };
      case 'basic-bottom':
        return {
          containerClass: "flex flex-col-reverse justify-between items-center",
          textContainerClass: `w-full px-6 pb-8 pt-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-2`,
          phoneWrapperClass: "w-full flex justify-center items-start flex-1 overflow-hidden relative pt-4",
          textAlign: "center" as const,
        };
      case 'tilt-right':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 left-0 w-[80%] pt-8 px-8 text-left z-20 flex flex-col items-start gap-2`,
          phoneWrapperClass: "absolute -bottom-8 -right-8 rotate-12 origin-bottom-right z-10",
          textAlign: "left" as const,
        };
      case 'tilt-left':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 right-0 w-[80%] pt-8 px-8 text-right z-20 flex flex-col items-end gap-2`,
          phoneWrapperClass: "absolute -bottom-8 -left-8 -rotate-12 origin-bottom-left z-10",
          textAlign: "right" as const,
        };
      case 'half-right':
        return {
          containerClass: "relative flex items-center",
          textContainerClass: `w-[58%] pl-8 pr-2 text-left z-20 flex flex-col justify-center gap-2`,
          phoneWrapperClass: `absolute top-1/2 -right-16 -translate-y-1/2 z-10`,
          textAlign: "left" as const,
        };
      case 'half-left':
        return {
          containerClass: "relative flex items-center justify-end",
          textContainerClass: `w-[58%] pr-8 pl-2 text-right z-20 flex flex-col justify-center gap-2`,
          phoneWrapperClass: `absolute top-1/2 -left-16 -translate-y-1/2 z-10`,
          textAlign: "right" as const,
        };
      case 'device-only':
        return {
          containerClass: "flex items-center justify-center",
          textContainerClass: "hidden",
          phoneWrapperClass: "flex items-center justify-center z-10",
          textAlign: "center" as const,
        };
      default:
        return {
          containerClass: "flex flex-col justify-between items-center",
          textContainerClass: `w-full px-6 pt-8 pb-2 text-center z-20 flex-shrink-0 gap-2`,
          phoneWrapperClass: "w-full flex justify-center items-end flex-1 overflow-hidden relative",
          textAlign: "center" as const,
        };
    }
  };

  const layoutConfig = getLayoutConfig();

  const handleApplyBadge = (preset: BadgeConfig) => {
    updateCanvas(canvas.id, { badge: preset });
    setShowBadgeMenu(false);
  };

  const toggleGradientText = () => {
    updateCanvas(canvas.id, { gradientText: !canvas.gradientText });
  };

  return (
    <div 
      id={`card-${canvas.id}`}
      className="flex flex-col items-center flex-shrink-0 group relative transition-transform duration-200"
    >
      {/* Top Control Bar */}
      <div className={`w-full mb-3 flex items-center justify-between px-3 py-2 rounded-xl shadow-xs border gap-2 relative transition-colors ${
        isDark 
          ? 'bg-[#10141e] border-gray-800 text-gray-200' 
          : 'bg-white border-gray-200/80 text-gray-800'
      }`}>
        <div className="flex items-center space-x-2">
          <span className={`w-5 h-5 flex items-center justify-center text-[11px] font-bold rounded-full ${
            isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            {index + 1}
          </span>

          {/* Layout Selector */}
          <div className="flex items-center space-x-1">
            <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <select
              value={currentLayout}
              onChange={(e) => updateCanvas(canvas.id, { layout: e.target.value as LayoutType })}
              className={`text-xs font-semibold rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer border ${
                isDark 
                  ? 'bg-gray-800 border-gray-700 text-gray-200' 
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Social Proof Badge Toggle */}
          <button
            onClick={() => setShowBadgeMenu(!showBadgeMenu)}
            className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 border transition-all ${
              canvas.badge?.enabled
                ? isDark 
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' 
                  : 'bg-amber-50 text-amber-700 border-amber-300'
                : isDark
                  ? 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
            title="Add Rating / Award Badge"
          >
            <Star className={`w-3.5 h-3.5 ${canvas.badge?.enabled ? 'fill-amber-400 text-amber-500' : 'text-gray-400'}`} />
            <span>Badge</span>
          </button>

          {/* Gradient Text Toggle */}
          <button
            onClick={toggleGradientText}
            className={`p-1.5 rounded-lg border transition-all ${
              canvas.gradientText
                ? isDark 
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40' 
                  : 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : isDark
                  ? 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
            }`}
            title="Toggle Gradient Text Style"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Colors */}
          <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-lg border ${
            isDark ? 'bg-gray-800/70 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <input
              type="color"
              value={canvas.backgroundColor || '#000000'}
              onChange={(e) => updateCanvas(canvas.id, { backgroundColor: e.target.value })}
              className="w-4 h-4 rounded border-0 cursor-pointer p-0"
              title="Change Background Color"
            />
            <input
              type="color"
              value={canvas.textColor || '#ffffff'}
              onChange={(e) => updateCanvas(canvas.id, { textColor: e.target.value })}
              className="w-4 h-4 rounded border-0 cursor-pointer p-0"
              title="Change Text Color"
            />
          </div>

          {/* Move & Duplicate */}
          <button
            disabled={index === 0}
            onClick={() => moveCanvas(canvas.id, 'left')}
            className={`p-1.5 rounded-lg transition-colors ${
              index === 0 
                ? 'opacity-20 cursor-not-allowed text-gray-500' 
                : isDark
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-indigo-400'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
            }`}
            title="Move Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            disabled={index === total - 1}
            onClick={() => moveCanvas(canvas.id, 'right')}
            className={`p-1.5 rounded-lg transition-colors ${
              index === total - 1 
                ? 'opacity-20 cursor-not-allowed text-gray-500' 
                : isDark
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-indigo-400'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
            }`}
            title="Move Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => duplicateCanvas(canvas.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-indigo-400' 
                : 'text-gray-400 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
            title="Duplicate Screenshot"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {total > 1 && (
            <button
              onClick={() => removeCanvas(canvas.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-400 hover:bg-red-950/50 hover:text-red-400' 
                  : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
              }`}
              title="Delete Screenshot"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Badge Selector Popover */}
        {showBadgeMenu && (
          <div className={`absolute top-12 left-20 z-50 rounded-2xl shadow-2xl border p-3 w-72 flex flex-col gap-2 ${
            isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Select Social Proof Badge
              </span>
              <button 
                onClick={() => setShowBadgeMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              <button
                onClick={() => handleApplyBadge({ enabled: false, icon: 'none', text: '', style: 'pill-glass' })}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl font-medium transition-colors ${
                  isDark ? 'hover:bg-red-950/40 text-red-400' : 'hover:bg-red-50 text-red-600'
                }`}
              >
                🚫 Remove Badge
              </button>

              {BADGE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleApplyBadge(p.config)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex flex-col gap-0.5 transition-colors border ${
                    isDark 
                      ? 'border-transparent hover:border-gray-700 hover:bg-gray-800 text-gray-200' 
                      : 'border-transparent hover:border-indigo-100 hover:bg-indigo-50 text-gray-700'
                  }`}
                >
                  <span className="font-semibold">{p.label}</span>
                  <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{p.config.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scaled Preview Canvas */}
      <div
        className="origin-top shadow-2xl rounded-3xl overflow-hidden border border-black/20 transition-transform duration-150"
        style={{ 
          transform: `scale(${zoomScale})`,
          marginBottom: `calc(${canvasHeight}px * (${zoomScale} - 1))`,
        }}
      >
        <div
          id={`canvas-${canvas.id}`}
          className={`relative overflow-hidden select-none ${layoutConfig.containerClass}`}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            background: canvas.backgroundColor || '#000000',
            fontFamily: fontConfig.fontFamily,
          }}
        >
          {/* Responsive Text & Badge Section */}
          {currentLayout !== 'device-only' && (
            <div className={layoutConfig.textContainerClass}>
              {/* Badge Sticker */}
              {canvas.badge?.enabled && (
                <div className="mb-1">
                  <BadgeSticker badge={canvas.badge} textColor={canvas.textColor} />
                </div>
              )}

              {/* Title */}
              <input
                type="text"
                value={canvas.title}
                onChange={(e) => updateCanvas(canvas.id, { title: e.target.value })}
                className={`w-full bg-transparent border-none outline-none font-bold placeholder-white/50 tracking-tight leading-tight ${
                  isCompact ? 'text-2xl mb-1' : 'text-3xl mb-2'
                } ${
                  canvas.gradientText 
                    ? 'bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm' 
                    : ''
                }`}
                style={{ 
                  color: canvas.gradientText ? undefined : (canvas.textColor || '#ffffff'), 
                  textAlign: layoutConfig.textAlign 
                }}
                placeholder="Enter Title"
              />

              {/* Subtitle */}
              <textarea
                value={canvas.subtitle}
                onChange={(e) => updateCanvas(canvas.id, { subtitle: e.target.value })}
                className={`w-full bg-transparent border-none outline-none font-medium placeholder-white/50 resize-none overflow-hidden leading-snug ${
                  isCompact ? 'text-sm h-12' : 'text-lg h-16'
                }`}
                style={{ 
                  color: canvas.textColor || '#ffffff', 
                  textAlign: layoutConfig.textAlign 
                }}
                placeholder="Enter Subtitle"
              />
            </div>
          )}

          {/* Adaptive Phone Mockup Section */}
          <div 
            className={layoutConfig.phoneWrapperClass}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={handlePhoneDrop}
          >
            <MinimalPhoneFrame 
              width={phoneW} 
              height={phoneH} 
              targetSizeId={globalSettings.targetSize}
            >
              {canvas.imageSrc ? (
                <div className="w-full h-full relative group/img">
                  <img
                    src={canvas.imageSrc}
                    alt="App Screenshot"
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <span className="text-white font-medium text-sm">Change Image</span>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-500">Upload Screenshot</span>
                </div>
              )}
            </MinimalPhoneFrame>
          </div>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
