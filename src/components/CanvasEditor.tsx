'use client';

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CanvasItem, LayoutType, useEditorStore } from '@/store/useEditorStore';
import { processUploadedFiles } from '@/utils/imageProcessor';
import { MinimalPhoneFrame } from './MinimalPhoneFrame';
import { BadgeSticker } from './BadgeSticker';
import {
  IoCloudUploadOutline,
  IoTrashOutline,
  IoBrowsersOutline,
  IoChevronBack,
  IoChevronForward,
  IoCopyOutline,
  IoStar,
  IoSparklesOutline,
  IoClose,
  IoTextOutline,
  IoLogoApple,
  IoLogoGooglePlaystore
} from 'react-icons/io5';
import { FastAverageColor } from 'fast-average-color';
import TextareaAutosize from 'react-textarea-autosize';
import { TARGET_SIZES } from '@/config/sizes';
import { FONT_OPTIONS } from '@/config/fonts';
import { BADGE_PRESETS, BadgeConfig } from '@/config/badges';

const fac = new FastAverageColor();

interface CanvasEditorProps {
  canvas: CanvasItem;
  index: number;
  total: number;
  isPreviewMode?: boolean;
}

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: 'basic-top', label: 'Basic Top (Standard)' },
  { value: 'basic-bottom', label: 'Basic Bottom (Header Phone)' },
  { value: 'tilt-right', label: 'Tilt Right (Dynamic Angle)' },
  { value: 'tilt-right-complement', label: 'Tilt Right Complement (Angle left)' },
  { value: 'tilt-left', label: 'Tilt Left (Dynamic Angle)' },
  { value: 'tilt-left-complement', label: 'Tilt Left Complement (Angle right)' },
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

export function CanvasEditor({ canvas, index, total, isPreviewMode = false }: CanvasEditorProps) {
  const { 
    globalSettings, 
    updateCanvas, 
    removeCanvas, 
    moveCanvas, 
    duplicateCanvas,
    applyLayoutToAll,
    applyContentToAll,
    setIsDraggingGlobal
} = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBadgeMenu, setShowBadgeMenu] = useState(false);

  const isDark = globalSettings.theme !== 'light';
  const isAndroid = globalSettings.targetSize.includes('samsung') || globalSettings.targetSize.includes('android') || globalSettings.targetSize.includes('play');

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
      toast.success("Screenshot replaced successfully!");
    } catch {
      updateCanvas(canvas.id, { imageSrc: url });
      toast.success("Screenshot replaced successfully!");
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
    setIsDraggingGlobal(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      
      // Process the first file for this specific canvas
      await processSingleFile(files[0]);
      
      // If there are more files, process them globally (fills empty canvases or appends)
      if (files.length > 1) {
        await processUploadedFiles(files.slice(1));
      }
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
    
    // Determine the device frame aspect ratio based on the target size
    let aspectRatio = 0.48; // Default standard phone (approx 9:19.5)
    
    const targetConfig = TARGET_SIZES[globalSettings.targetSize] || TARGET_SIZES['ios-6.5'];
    
    if (targetConfig.category === 'Tablet') {
      aspectRatio = targetConfig.logicalWidth / targetConfig.logicalHeight;
    } else if (targetConfig.category === 'Header') {
      // For headers, keep the standard phone aspect ratio inside the banner
      aspectRatio = 0.48;
    } else {
      // For phones, match the phone's actual aspect ratio
      aspectRatio = targetConfig.logicalWidth / targetConfig.logicalHeight;
    }

    const phoneW = Math.round(phoneH * aspectRatio);
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
      case 'tilt-right-complement':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 right-0 w-[80%] pt-8 px-8 text-right z-20 flex flex-col items-end gap-2`,
          phoneWrapperClass: "absolute -bottom-8 -left-[152px] rotate-12 origin-bottom-left z-10",
          textAlign: "right" as const,
        };
      case 'tilt-left':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 right-0 w-[80%] pt-8 px-8 text-right z-20 flex flex-col items-end gap-2`,
          phoneWrapperClass: "absolute -bottom-8 -left-8 -rotate-12 origin-bottom-left z-10",
          textAlign: "right" as const,
        };
      case 'tilt-left-complement':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 left-0 w-[80%] pt-8 px-8 text-left z-20 flex flex-col items-start gap-2`,
          phoneWrapperClass: "absolute -bottom-8 -right-[152px] -rotate-12 origin-bottom-right z-10",
          textAlign: "left" as const,
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
            case 'split-vertical':
        return {
          containerClass: "flex flex-col justify-between items-center",
          textContainerClass: "w-full px-6 pt-8 pb-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-2",
          subtitleContainerClass: "w-full px-6 pb-8 pt-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-2",
          phoneWrapperClass: "w-full flex justify-center items-center flex-1 overflow-hidden relative",
          textAlign: "center" as const,
        };
      case '3d-isometric-right':
        return {
          containerClass: "relative [perspective:2000px]",
          textContainerClass: "absolute top-0 left-0 w-[65%] pt-12 px-8 text-left z-20 flex flex-col items-start gap-2",
          phoneWrapperClass: "absolute -bottom-16 -right-24 z-10 [transform:rotateX(15deg)_rotateY(-35deg)_rotateZ(10deg)_scale(0.85)] shadow-[20px_40px_60px_rgba(0,0,0,0.5)] transition-transform duration-300",
          textAlign: "left" as const,
        };
      case '3d-isometric-left':
        return {
          containerClass: "relative [perspective:2000px]",
          textContainerClass: "absolute top-0 right-0 w-[65%] pt-12 px-8 text-right z-20 flex flex-col items-end gap-2",
          phoneWrapperClass: "absolute -bottom-16 -left-24 z-10 [transform:rotateX(15deg)_rotateY(35deg)_rotateZ(-10deg)_scale(0.85)] shadow-[-20px_40px_60px_rgba(0,0,0,0.5)] transition-transform duration-300",
          textAlign: "right" as const,
        };
      case 'og-style-1':
        return {
          containerClass: "relative flex items-center bg-white",
          textContainerClass: "w-[55%] pl-12 pr-4 text-left z-20 flex flex-col justify-center items-start gap-4",
          phoneWrapperClass: "absolute top-1/2 -right-8 -translate-y-1/2 z-10 scale-[1.1]",
          textAlign: "left" as const,
        };
      case 'og-style-2':
        return {
          containerClass: "relative flex items-center overflow-hidden",
          textContainerClass: "w-[50%] pl-14 pr-4 text-left z-20 flex flex-col justify-center items-start gap-6",
          phoneWrapperClass: "absolute -bottom-24 -right-12 z-10 scale-[1.3] [transform:rotate(-15deg)]",
          textAlign: "left" as const,
        };
      case 'og-style-3':
        return {
          containerClass: "relative flex items-center overflow-hidden [perspective:2000px]",
          textContainerClass: "w-[45%] pl-12 pr-4 text-left z-20 flex flex-col justify-center items-start gap-6",
          phoneWrapperClass: "absolute top-1/2 -right-16 -translate-y-1/2 z-10 [transform:rotateX(15deg)_rotateY(-35deg)_rotateZ(10deg)_scale(0.9)]",
          textAlign: "left" as const,
        };
      case 'hero-3d-center':
        return {
          containerClass: "relative flex flex-col items-center justify-start overflow-hidden pt-12 [perspective:2000px]",
          textContainerClass: "w-[80%] text-center z-20 drop-shadow-2xl flex flex-col justify-center items-center gap-6",
          phoneWrapperClass: "absolute bottom-[-15%] z-10 [transform:rotateX(30deg)_rotateY(0deg)_scale(1.15)] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] transition-transform duration-700 hover:[transform:rotateX(20deg)_scale(1.15)]",
          textAlign: "center" as const,
        };
      case 'dynamic-overlap':
        return {
          containerClass: "relative flex items-center justify-center overflow-hidden",
          textContainerClass: "w-[75%] p-10 bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl text-center z-20 flex flex-col justify-center items-center gap-6",
          phoneWrapperClass: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 scale-[1.3] opacity-80 blur-[2px] -rotate-6",
          textAlign: "center" as const,
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
      {!isPreviewMode && (
        <div 
          onWheel={(e) => e.stopPropagation()}
        className={`w-full mb-4 flex items-center justify-between px-4 py-2.5 rounded-2xl shadow-sm border relative z-50 transition-colors ${
        isDark 
          ? 'bg-gray-900/90 backdrop-blur-md border-gray-700/80 text-gray-200' 
          : 'bg-white/90 backdrop-blur-md border-gray-200/80 text-gray-800'
      }`}>
        <div className="flex items-center space-x-3">
          <span className={`w-6 h-6 flex items-center justify-center text-[11px] font-bold rounded-full shadow-sm ${
            isDark ? 'bg-zinc-900/50 text-zinc-300' : 'bg-zinc-50 text-zinc-700'
          }`}>
            {index + 1}
          </span>

          <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

          {/* Layout Selector */}
          <div className="flex items-center space-x-1.5">
            <IoBrowsersOutline className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={currentLayout}
              onChange={(e) => updateCanvas(canvas.id, { layout: e.target.value as LayoutType })}
              className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-zinc-500 focus:outline-none cursor-pointer border transition-colors ${
                isDark 
                  ? 'bg-gray-800/80 border-gray-700 text-gray-200 hover:border-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                  {opt.label}
                </option>
              ))}
            </select>
            
            {/* Apply Layout to All Button */}
            <button
              onClick={() => applyLayoutToAll(currentLayout)}
              className={`px-2 py-1.5 ml-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all shadow-sm ${
                isDark 
                  ? 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/20 hover:border-zinc-400' 
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
              title="Apply this layout to all screenshots"
            >
              Apply All
            </button>
          </div>

          <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

          {/* Social Proof Badge Toggle */}
          <button
            onClick={() => setShowBadgeMenu(!showBadgeMenu)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
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
            <IoStar className={`w-3.5 h-3.5 ${canvas.badge?.enabled ? 'fill-amber-400 text-amber-500' : 'text-gray-400'}`} />
            <span>Badge</span>
          </button>

          {/* Gradient Text Toggle */}
          <button
            onClick={toggleGradientText}
            className={`p-2 rounded-lg border transition-all ${
              canvas.gradientText
                ? isDark 
                  ? 'bg-zinc-950/60 text-zinc-300 border-zinc-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                  : 'bg-zinc-50 text-zinc-700 border-zinc-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                : isDark
                  ? 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
            }`}
            title="Toggle Gradient Text Style"
          >
            <IoSparklesOutline className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Colors */}
          <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border mr-2 ${
            isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <input
              type="color"
              value={canvas.backgroundColor || '#000000'}
              onChange={(e) => updateCanvas(canvas.id, { backgroundColor: e.target.value })}
              className="w-5 h-5 rounded-md border-0 cursor-pointer p-0 shadow-sm"
              title="Change Background Color"
            />
            <input
              type="color"
              value={canvas.textColor || '#ffffff'}
              onChange={(e) => updateCanvas(canvas.id, { textColor: e.target.value })}
              className="w-5 h-5 rounded-md border-0 cursor-pointer p-0 shadow-sm"
              title="Change Text Color"
            />
          </div>

          <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

          {/* Move & Duplicate */}
          <button
            disabled={index === 0}
            onClick={() => moveCanvas(canvas.id, 'left')}
            className={`p-2 rounded-lg transition-colors ${
              index === 0 
                ? 'opacity-20 cursor-not-allowed text-gray-500' 
                : isDark
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-zinc-400'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-zinc-600'
            }`}
            title="Move Left"
          >
            <IoChevronBack className="w-4 h-4" />
          </button>

          <button
            disabled={index === total - 1}
            onClick={() => moveCanvas(canvas.id, 'right')}
            className={`p-2 rounded-lg transition-colors ${
              index === total - 1 
                ? 'opacity-20 cursor-not-allowed text-gray-500' 
                : isDark
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-zinc-400'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-zinc-600'
            }`}
            title="Move Right"
          >
            <IoChevronForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => duplicateCanvas(canvas.id)}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-zinc-400' 
                : 'text-gray-400 hover:bg-zinc-50 hover:text-zinc-600'
            }`}
            title="Duplicate Screenshot"
          >
            <IoCopyOutline className="w-4 h-4" />
          </button>

          <button
            onClick={() => applyContentToAll(canvas.title, canvas.subtitle)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              isDark 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-zinc-400' 
                : 'text-gray-400 hover:bg-zinc-50 hover:text-zinc-600'
            }`}
            title="Apply this Title & Subtitle to all screens"
          >
            <IoTextOutline className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden xl:block">
              Apply Text
            </span>
          </button>

          {total > 1 && (
            <>
              <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <button
                onClick={() => removeCanvas(canvas.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:bg-red-950/50 hover:text-red-400' 
                    : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                }`}
                title="Delete Screenshot"
              >
                <IoTrashOutline className="w-4 h-4" />
              </button>
            </>
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
                <IoStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Select Social Proof Badge
              </span>
              <button 
                onClick={() => setShowBadgeMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </div>

            <div 
              className="space-y-1.5 max-h-56 overflow-y-auto"
              onWheel={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => handleApplyBadge({ enabled: false, icon: 'none', text: '', style: 'pill-glass' })}
                className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl font-medium transition-colors ${
                  isDark ? 'hover:bg-red-950/40 text-red-400' : 'hover:bg-red-50 text-red-600'
                }`}
              >
                Remove Badge
              </button>

              {BADGE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleApplyBadge(p.config)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex flex-col gap-0.5 transition-colors border ${
                    isDark 
                      ? 'border-transparent hover:border-gray-700 hover:bg-gray-800 text-gray-200' 
                      : 'border-transparent hover:border-zinc-100 hover:bg-zinc-50 text-gray-700'
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
      )}

      {/* Scaled Preview Canvas */}
      <div
        className={`origin-top overflow-hidden transition-all duration-150 ${
          isPreviewMode ? 'pointer-events-none' : 'shadow-2xl rounded-3xl border border-black/20'
        }`}
        style={{ 
          transform: `scale(${zoomScale})`,
          marginBottom: `calc(${canvasHeight}px * (${zoomScale} - 1))`,
          marginLeft: isPreviewMode ? `calc(${canvasWidth}px * (${zoomScale} - 1) / 2)` : undefined,
          marginRight: isPreviewMode ? `calc(${canvasWidth}px * (${zoomScale} - 1) / 2)` : undefined,
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
          {/* Background Image Overlay */}
          {canvas.backgroundImageSrc && (
            <div className="absolute inset-0 bg-black/40 z-0" />
          )}

          {/* Responsive Text & Badge Section */}
          {currentLayout !== 'device-only' && (
            <div className={layoutConfig.textContainerClass}>
              {/* App Icon (OG Styles) */}
              {canvas.appIconSrc && (
                <div className="w-20 h-20 rounded-[18px] bg-white shadow-xl flex items-center justify-center overflow-hidden mb-2 border border-black/5">
                  <img src={canvas.appIconSrc} alt="App Icon" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Badge Sticker */}
              {canvas.badge?.enabled && (
                <div className="mb-1 pointer-events-auto">
                  <BadgeSticker 
                    badge={canvas.badge} 
                    textColor={canvas.textColor} 
                    onChangeText={(newText) => updateCanvas(canvas.id, { badge: { ...canvas.badge!, text: newText } })}
                    onChangeSubtext={(newSubtext) => updateCanvas(canvas.id, { badge: { ...canvas.badge!, subtext: newSubtext } })}
                  />
                </div>
              )}

              {/* Title */}
              <TextareaAutosize
                value={canvas.title}
                onChange={(e) => updateCanvas(canvas.id, { title: e.target.value })}
                className={`w-full bg-transparent border-2 border-transparent hover:border-white/20 focus:border-white/40 focus:bg-white/5 rounded-xl px-3 py-1 outline-none font-extrabold placeholder-white/50 tracking-tight leading-tight transition-all resize-none overflow-hidden ${
                  isCompact ? 'text-[28px] mb-1' : 'text-[42px] mb-2'
                } ${
                  canvas.gradientText 
                    ? 'bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-sm' 
                    : ''
                }`}
                style={{ 
                  color: canvas.gradientText ? undefined : (canvas.textColor || '#ffffff'), 
                  textAlign: layoutConfig.textAlign 
                }}
                placeholder="Enter Title"
              />

              {/* Subtitle (Only if not split-vertical) */}
              {currentLayout !== 'split-vertical' && (
                <TextareaAutosize
                  value={canvas.subtitle}
                  onChange={(e) => updateCanvas(canvas.id, { subtitle: e.target.value })}
                  className={`w-full bg-transparent border-2 border-transparent hover:border-white/20 focus:border-white/40 focus:bg-white/5 rounded-xl px-3 py-2 outline-none font-medium placeholder-white/50 resize-none overflow-hidden leading-relaxed transition-all ${
                    isCompact ? 'text-sm' : 'text-xl'
                  }`}
                  style={{
                    color: canvas.textColor || '#ffffff',
                    textAlign: layoutConfig.textAlign
                  }}
                  placeholder="Enter Subtitle"
                />
              )}

              {/* Native App Store Badge (Social Graphics) */}
              {canvas.showAppStoreBadge && (
                <div className={`mt-2 flex items-center gap-1.5 bg-black text-white px-3.5 py-1.5 rounded-lg border border-white/20 shadow-md hover:scale-105 transition-transform cursor-pointer w-max ${layoutConfig.textAlign === 'center' ? 'mx-auto' : ''} ${layoutConfig.textAlign === 'right' ? 'ml-auto' : ''}`}>
                  {!isAndroid ? (
                    <>
                      <IoLogoApple className="w-[22px] h-[22px]" />
                      <div className="flex flex-col text-left justify-center">
                        <span className="text-[7px] uppercase tracking-wide leading-none opacity-80 mb-0.5">Download on the</span>
                        <span className="text-[14px] font-semibold leading-none tracking-tight">App Store</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <IoLogoGooglePlaystore className="w-[20px] h-[20px]" />
                      <div className="flex flex-col text-left justify-center pl-0.5">
                        <span className="text-[7px] uppercase tracking-wide leading-none opacity-80 mb-0.5">GET IT ON</span>
                        <span className="text-[14px] font-semibold leading-none tracking-tight">Google Play</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subtitle Container for split-vertical */}
          {currentLayout === 'split-vertical' && layoutConfig.subtitleContainerClass && (
            <div className={layoutConfig.subtitleContainerClass}>
              <TextareaAutosize
                value={canvas.subtitle}
                onChange={(e) => updateCanvas(canvas.id, { subtitle: e.target.value })}
                className={`w-full bg-transparent border-2 border-transparent hover:border-white/20 focus:border-white/40 focus:bg-white/5 rounded-xl px-3 py-2 outline-none font-medium placeholder-white/50 resize-none overflow-hidden leading-relaxed transition-all ${
                  isCompact ? 'text-sm' : 'text-xl'
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
            <div className="group/phone relative transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <MinimalPhoneFrame 
                width={phoneW} 
                height={phoneH} 
                targetSizeId={globalSettings.targetSize}
                mockupStyle={globalSettings.mockupStyle}
                showNotch={globalSettings.showNotch}
              >
                {canvas.imageSrc ? (
                <div className={`w-full h-full relative group/img bg-black flex items-center justify-center`}>
                  <img
                    src={canvas.imageSrc}
                    alt="App Screenshot"
                    className={`w-full h-full ${canvas.imageFit === 'contain' || globalSettings.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                  />
                  <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
                    >
                      <IoCloudUploadOutline className="w-4 h-4" />
                      Change Image
                    </button>
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        updateCanvas(canvas.id, { imageFit: canvas.imageFit === 'contain' ? 'cover' : 'contain' });
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-full transition-colors"
                    >
                      Fit: {canvas.imageFit === 'contain' ? 'Contain' : 'Cover'}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IoCloudUploadOutline className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-500">Upload Screenshot</span>
                </div>
              )}
            </MinimalPhoneFrame>
            </div>
            
            {currentLayout === 'og-style-3' && (
              <>
                <div className="absolute top-12 left-16 group/phone transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer -z-10 opacity-90 scale-95"
                     onClick={() => fileInputRef.current?.click()}>
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                  >
                    {canvas.imageSrc ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <img src={canvas.imageSrc} alt="App screen" className={`w-full h-full ${canvas.imageFit === 'contain' || globalSettings.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-4">
                        <IoCloudUploadOutline className="w-12 h-12" />
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
                <div className="absolute top-24 left-32 group/phone transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer -z-20 opacity-80 scale-90"
                     onClick={() => fileInputRef.current?.click()}>
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                  >
                    {canvas.imageSrc ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <img src={canvas.imageSrc} alt="App screen" className={`w-full h-full ${canvas.imageFit === 'contain' || globalSettings.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-4">
                        <IoCloudUploadOutline className="w-12 h-12" />
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
              </>
            )}
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
