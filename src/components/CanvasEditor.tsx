'use client';

import React, { useRef } from 'react';
import { CanvasItem, LayoutType, useEditorStore } from '@/store/useEditorStore';
import { MinimalPhoneFrame } from './MinimalPhoneFrame';
import { 
  UploadCloud, 
  Trash2, 
  LayoutTemplate, 
  ChevronLeft, 
  ChevronRight, 
  Copy 
} from 'lucide-react';
import { FastAverageColor } from 'fast-average-color';
import { TARGET_SIZES } from '@/config/sizes';

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

  // Compute adaptive phone frame dimensions based on target device height
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
          textContainerClass: `w-full px-6 pt-10 pb-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center`,
          phoneWrapperClass: "w-full flex justify-center items-end flex-1 overflow-hidden relative",
          textAlign: "center" as const,
        };
      case 'basic-bottom':
        return {
          containerClass: "flex flex-col-reverse justify-between items-center",
          textContainerClass: `w-full px-6 pb-10 pt-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center`,
          phoneWrapperClass: "w-full flex justify-center items-start flex-1 overflow-hidden relative pt-4",
          textAlign: "center" as const,
        };
      case 'tilt-right':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 left-0 w-[80%] pt-10 px-8 text-left z-20`,
          phoneWrapperClass: "absolute -bottom-8 -right-8 rotate-12 origin-bottom-right z-10",
          textAlign: "left" as const,
        };
      case 'tilt-left':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 right-0 w-[80%] pt-10 px-8 text-right z-20`,
          phoneWrapperClass: "absolute -bottom-8 -left-8 -rotate-12 origin-bottom-left z-10",
          textAlign: "right" as const,
        };
      case 'half-right':
        return {
          containerClass: "relative flex items-center",
          textContainerClass: `w-[58%] pl-8 pr-2 text-left z-20 flex flex-col justify-center`,
          phoneWrapperClass: `absolute top-1/2 -right-16 -translate-y-1/2 z-10`,
          textAlign: "left" as const,
        };
      case 'half-left':
        return {
          containerClass: "relative flex items-center justify-end",
          textContainerClass: `w-[58%] pr-8 pl-2 text-right z-20 flex flex-col justify-center`,
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
          textContainerClass: `w-full px-6 pt-10 pb-2 text-center z-20 flex-shrink-0`,
          phoneWrapperClass: "w-full flex justify-center items-end flex-1 overflow-hidden relative",
          textAlign: "center" as const,
        };
    }
  };

  const layoutConfig = getLayoutConfig();

  return (
    <div 
      id={`card-${canvas.id}`}
      className="flex flex-col items-center flex-shrink-0 group relative transition-transform duration-200"
    >
      {/* Top Control Bar */}
      <div className="w-full mb-3 flex items-center justify-between bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-200/80 gap-2">
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 flex items-center justify-center bg-gray-100 text-gray-700 text-[11px] font-bold rounded-full">
            {index + 1}
          </span>

          <div className="flex items-center space-x-1">
            <LayoutTemplate className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <select
              value={currentLayout}
              onChange={(e) => updateCanvas(canvas.id, { layout: e.target.value as LayoutType })}
              className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-1 bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-200">
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

          <button
            disabled={index === 0}
            onClick={() => moveCanvas(canvas.id, 'left')}
            className={`p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors ${
              index === 0 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            title="Move Left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            disabled={index === total - 1}
            onClick={() => moveCanvas(canvas.id, 'right')}
            className={`p-1 rounded text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors ${
              index === total - 1 ? 'opacity-30 cursor-not-allowed' : ''
            }`}
            title="Move Right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => duplicateCanvas(canvas.id)}
            className="p-1 rounded text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            title="Duplicate Screenshot"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {total > 1 && (
            <button
              onClick={() => removeCanvas(canvas.id)}
              className="p-1 rounded text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Delete Screenshot"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scaled Preview Canvas */}
      <div
        className="origin-top shadow-xl rounded-2xl overflow-hidden border border-gray-200/90 transition-transform duration-150"
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
          }}
        >
          {/* Responsive Text Section */}
          {currentLayout !== 'device-only' && (
            <div className={layoutConfig.textContainerClass}>
              <input
                type="text"
                value={canvas.title}
                onChange={(e) => updateCanvas(canvas.id, { title: e.target.value })}
                className={`w-full bg-transparent border-none outline-none font-bold placeholder-white/50 tracking-tight leading-tight ${
                  isCompact ? 'text-2xl mb-1.5' : 'text-3xl mb-2.5'
                }`}
                style={{ 
                  color: canvas.textColor || '#ffffff', 
                  textAlign: layoutConfig.textAlign 
                }}
                placeholder="Enter Title"
              />
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
            <MinimalPhoneFrame width={phoneW} height={phoneH}>
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
