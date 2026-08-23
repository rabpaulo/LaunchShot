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

  const isDark = globalSettings.theme !== 'light';

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
    <div className={`w-80 h-screen border-r flex flex-col shadow-sm flex-shrink-0 z-10 relative transition-colors ${
      isDark ? 'bg-[#10141e] border-gray-800/80 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
    }`}>
      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-base font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              LaunchShot
            </h1>
            <p className={`text-[11px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              App Store Screenshot Studio
            </p>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-700'
          }`}>
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
            className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group ${
              isDragging
                ? 'border-indigo-500 bg-indigo-900/30 scale-[1.02]'
                : isDark
                  ? 'border-gray-700 hover:border-indigo-500 bg-gray-800/40 hover:bg-gray-800/70'
                  : 'border-gray-300 hover:border-indigo-400 bg-gray-50/70 hover:bg-indigo-50/30'
            }`}
          >
            <div className={`p-2.5 rounded-full transition-colors ${
              isDragging 
                ? 'bg-indigo-600 text-white' 
                : isDark
                  ? 'bg-gray-800 text-gray-400 group-hover:text-indigo-400 shadow-sm'
                  : 'bg-white text-gray-500 group-hover:text-indigo-600 shadow-sm'
            }`}>
              <UploadCloud className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-0.5">
              <p className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {isProcessing ? 'Processing Images...' : isDragging ? 'Drop screenshots now!' : 'Drag & drop multiple images'}
              </p>
              <p className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                or <span className="text-indigo-400 font-medium underline">browse files</span>
              </p>
            </div>

            <div className={`mt-1 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${
              isDark 
                ? 'bg-indigo-950/60 border-indigo-500/30 text-indigo-300' 
                : 'bg-indigo-100/70 border-indigo-200 text-indigo-700'
            }`}>
              <ImageIcon className="w-3 h-3" />
              <span>Auto color extraction & templates</span>
            </div>
          </div>
        </div>

        {/* Target Device Size */}
        <section>
          <h2 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-700'
          }`}>
            Target Device Size
          </h2>
          
          <div className="space-y-2">
            <select
              value={globalSettings.targetSize || 'ios-6.5'}
              onChange={(e) =>
                updateGlobalSettings({ targetSize: e.target.value as TargetSizeId })
              }
              className={`w-full border rounded-xl shadow-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium ${
                isDark 
                  ? 'bg-gray-800/80 border-gray-700 text-gray-200' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              {Object.entries(groupedSizes).map(([category, sizes]) => (
                <optgroup key={category} label={category} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                  {sizes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>

            <div className={`p-3 rounded-xl border flex flex-col gap-1 text-[11px] ${
              isDark 
                ? 'bg-gray-800/40 border-gray-800 text-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-600'
            }`}>
              <div className="flex justify-between">
                <span className="font-medium opacity-75">Export Res:</span>
                <span className={`font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {activeSize.width} × {activeSize.height} px
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium opacity-75">Scale:</span>
                <span>{activeSize.pixelRatio}x Native</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium opacity-75">Platform:</span>
                <span>{activeSize.category}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Typography & Google Fonts */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-gray-400' : 'text-gray-700'
            }`}>
              <Type className="w-3.5 h-3.5 text-indigo-400" />
              Typography
            </h2>
            <span className="text-[10px] text-gray-500">Google Fonts</span>
          </div>

          <select
            value={globalSettings.fontFamily || 'plus-jakarta'}
            onChange={(e) => handleFontChange(e.target.value)}
            className={`w-full border rounded-xl shadow-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium ${
              isDark 
                ? 'bg-gray-800/80 border-gray-700 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                {font.name}
              </option>
            ))}
          </select>
        </section>

        {/* Mesh Gradients & Background Presets */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-gray-400' : 'text-gray-700'
            }`}>
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              Background Presets
            </h2>
            <span className="text-[10px] text-indigo-400 font-medium">Click to apply all</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {BACKGROUND_PRESETS.map((preset) => {
              const isSelected = selectedBg === preset.value;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectBackground(preset.value, preset.textColor)}
                  className={`h-9 rounded-xl border relative transition-all duration-150 hover:scale-105 shadow-xs flex items-center justify-center ${
                    isSelected 
                      ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900 border-transparent' 
                      : isDark ? 'border-white/10' : 'border-gray-200'
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
      <div className={`p-4 border-t space-y-2.5 ${
        isDark ? 'bg-[#0b0e17]/80 border-gray-800' : 'bg-gray-50/80 border-gray-200'
      }`}>
        <button
          onClick={() => addCanvas()}
          className={`w-full flex items-center justify-center py-2 px-4 border rounded-xl shadow-xs text-xs font-semibold transition-colors ${
            isDark
              ? 'border-gray-700 bg-gray-800/80 text-gray-200 hover:bg-gray-700 hover:text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          <PlusCircle className="w-4 h-4 mr-1.5 text-gray-400" />
          Add Blank Screenshot
        </button>
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-600/30 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Export All ({canvases.length} Screenshots)
        </button>
      </div>
    </div>
  );
}
