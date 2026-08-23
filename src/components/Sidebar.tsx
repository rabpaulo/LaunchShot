'use client';

import React, { useRef, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { 
  PlusCircle, 
  Download, 
  UploadCloud, 
  Smartphone, 
  Image as ImageIcon,
  Palette,
  Type,
  Check
} from 'lucide-react';
import { exportImages } from '@/utils/export';
import { processUploadedFiles } from '@/utils/imageProcessor';
import { TARGET_SIZES, TargetSizeId } from '@/config/sizes';
import { FONT_OPTIONS } from '@/config/fonts';
import { BACKGROUND_PRESETS } from '@/config/backgrounds';

export function Sidebar() {
  const { 
    globalSettings, 
    updateGlobalSettings, 
    addCanvas, 
    canvases,
    applyBackgroundToAll,
    applyFontToAll
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBg, setSelectedBg] = useState<string | null>(null);

  const handleExport = async () => {
    await exportImages(canvases);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      await processUploadedFiles(Array.from(files));
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleSelectBackground = (presetValue: string, textColor?: string) => {
    setSelectedBg(presetValue);
    applyBackgroundToAll(presetValue, textColor);
  };

  const handleFontChange = (fontId: string) => {
    updateGlobalSettings({ fontFamily: fontId });
    applyFontToAll(fontId);
  };

  // Group sizes by category
  const groupedSizes = Object.values(TARGET_SIZES).reduce((acc, size) => {
    if (!acc[size.category]) acc[size.category] = [];
    acc[size.category].push(size);
    return acc;
  }, {} as Record<string, typeof TARGET_SIZES[TargetSizeId][]>);

  const activeSize = TARGET_SIZES[globalSettings.targetSize] || TARGET_SIZES['ios-6.5'];

  return (
    <div className="w-80 h-screen border-r border-gray-200 bg-white flex flex-col shadow-sm flex-shrink-0 z-10 relative">
      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-sm">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">AppLaunch Studio</h1>
            <p className="text-[11px] text-gray-500">App Store Screenshot Generator</p>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Upload Screenshots
          </label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            accept="image/*"
            multiple
            className="hidden"
          />

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/80 scale-[1.02]'
                : 'border-gray-300 hover:border-indigo-400 bg-gray-50/70 hover:bg-indigo-50/30'
            }`}
          >
            <div className={`p-2.5 rounded-full transition-colors ${
              isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-gray-500 group-hover:text-indigo-600 shadow-sm'
            }`}>
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-gray-800">
                {isProcessing ? 'Processing Images...' : isDragging ? 'Drop screenshots now!' : 'Drag & drop multiple images'}
              </p>
              <p className="text-[10px] text-gray-500">
                or <span className="text-indigo-600 font-medium underline">browse files</span> from your computer
              </p>
            </div>

            <div className="mt-1 flex items-center gap-1.5 px-2 py-0.5 bg-indigo-100/70 rounded text-[10px] font-medium text-indigo-700">
              <ImageIcon className="w-3 h-3" />
              <span>Auto color extraction & templates</span>
            </div>
          </div>
        </div>

        {/* Target Device Size */}
        <section>
          <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Target Device Size
          </h2>
          
          <div className="space-y-2">
            <select
              value={globalSettings.targetSize || 'ios-6.5'}
              onChange={(e) =>
                updateGlobalSettings({ targetSize: e.target.value as TargetSizeId })
              }
              className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs font-medium text-gray-800 bg-white"
            >
              {Object.entries(groupedSizes).map(([category, sizes]) => (
                <optgroup key={category} label={category}>
                  {sizes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-1 text-[11px] text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Export Res:</span>
                <span className="font-semibold text-gray-800">{activeSize.width} × {activeSize.height} px</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Scale:</span>
                <span>{activeSize.pixelRatio}x Native</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Platform:</span>
                <span>{activeSize.category}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Typography & Google Fonts */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-600" />
              Typography
            </h2>
            <span className="text-[10px] text-gray-400">Google Fonts</span>
          </div>

          <select
            value={globalSettings.fontFamily || 'plus-jakarta'}
            onChange={(e) => handleFontChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xs font-medium text-gray-800 bg-white"
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </section>

        {/* Mesh Gradients & Background Presets */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              Background Presets
            </h2>
            <span className="text-[10px] text-indigo-600 font-medium">Click to apply all</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {BACKGROUND_PRESETS.map((preset) => {
              const isSelected = selectedBg === preset.value;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectBackground(preset.value, preset.textColor)}
                  className={`h-9 rounded-lg border relative transition-all duration-150 hover:scale-105 shadow-xs flex items-center justify-center ${
                    isSelected ? 'ring-2 ring-indigo-600 ring-offset-2 border-transparent' : 'border-gray-200'
                  }`}
                  style={{ background: preset.value }}
                  title={preset.name}
                >
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${preset.textColor === '#0f172a' ? 'text-gray-900' : 'text-white'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-gray-200 space-y-2.5 bg-gray-50/80">
        <button
          onClick={() => addCanvas()}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-1.5 text-gray-500" />
          Add Blank Screenshot
        </button>
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export All ({canvases.length} Screenshots)
        </button>
      </div>
    </div>
  );
}
