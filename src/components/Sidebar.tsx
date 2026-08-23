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
  Check,
  Trash2
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
    applyFontToAll,
    clearAllCanvases
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
    <div className={`w-[340px] h-screen border-r flex flex-col flex-shrink-0 z-10 relative transition-colors ${
      isDark ? 'bg-black border-gray-800/80 text-gray-200' : 'bg-white border-gray-200/80 text-gray-800 shadow-sm'
    }`}>
      <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-zinc-500 to-zinc-700 rounded-xl text-white shadow-lg shadow-zinc-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className={`text-lg font-extrabold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              LaunchShot
            </h1>
            <p className={`text-[11px] font-medium tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              STUDIO EDITION
            </p>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Assets
            </h2>
          </div>
          
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
            className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 group ${
              isDragging
                ? 'border-zinc-500 bg-zinc-500/10 scale-[1.02] shadow-xl shadow-zinc-500/10'
                : isDark
                  ? 'border-gray-700 hover:border-zinc-500/50 bg-zinc-900 hover:bg-zinc-800'
                  : 'border-gray-200 hover:border-zinc-300 bg-gray-50 hover:bg-zinc-50/50'
            }`}
          >
            <div className={`p-3 rounded-full transition-colors ${
              isDragging 
                ? 'bg-zinc-500 text-white shadow-lg shadow-zinc-500/20' 
                : isDark
                  ? 'bg-gray-800 text-zinc-400 group-hover:bg-zinc-500/20 group-hover:text-zinc-300 shadow-sm'
                  : 'bg-white text-zinc-500 group-hover:bg-zinc-100 shadow-sm'
            }`}>
              <UploadCloud className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                {isProcessing ? 'Processing Images...' : isDragging ? 'Drop it like it\'s hot!' : 'Upload Screenshots'}
              </p>
              <p className={`text-[11px] font-medium leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                Drag & drop or <span className="text-zinc-500 hover:text-zinc-600 underline decoration-zinc-500/30 underline-offset-2">browse</span>
              </p>
            </div>

            <div className={`mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${
              isDark 
                ? 'bg-zinc-950/40 border-zinc-500/20 text-zinc-300' 
                : 'bg-zinc-50 border-zinc-100 text-zinc-600'
            }`}>
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Auto Magic Color applied</span>
            </div>
          </div>
        </section>

        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Target Device Size */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Target Device Size
            </h2>
          </div>
          
          <div className="space-y-3">
            <select
              value={globalSettings.targetSize || 'ios-6.5'}
              onChange={(e) =>
                updateGlobalSettings({ targetSize: e.target.value as TargetSizeId })
              }
              className={`w-full border rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm font-semibold transition-colors ${
                isDark 
                  ? 'bg-gray-800/60 border-gray-700/80 text-gray-200' 
                  : 'bg-white border-gray-200 text-gray-800'
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

            <div className={`p-3.5 rounded-xl border flex flex-col gap-1.5 text-xs ${
              isDark 
                ? 'bg-gray-800/30 border-gray-800/80 text-gray-400' 
                : 'bg-gray-50 border-gray-200/80 text-gray-600'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-medium opacity-75">Export Res</span>
                <span className={`font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {activeSize.width} × {activeSize.height}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium opacity-75">Scale Factor</span>
                <span className={`font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {activeSize.pixelRatio}x Native
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Mockup Style */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Mockup Style
            </h2>
          </div>
          <div className={`flex p-1 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}>
            {['dark', 'light', 'glass'].map((style) => (
              <button
                key={style}
                onClick={() => updateGlobalSettings({ mockupStyle: style as any })}
                className={`flex-1 capitalize text-xs font-semibold py-1.5 rounded-lg transition-all ${
                  globalSettings.mockupStyle === style
                    ? isDark
                      ? 'bg-gray-700 text-white shadow-sm'
                      : 'bg-white text-gray-900 shadow-sm'
                    : isDark
                      ? 'text-gray-500 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Typography & Google Fonts */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Typography
            </h2>
            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isDark ? 'bg-zinc-500/10 text-zinc-400' : 'bg-zinc-50 text-zinc-600'
            }`}>Google Fonts</span>
          </div>

          <select
            value={globalSettings.fontFamily || 'plus-jakarta'}
            onChange={(e) => handleFontChange(e.target.value)}
            className={`w-full border rounded-xl shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm font-semibold transition-colors ${
              isDark 
                ? 'bg-gray-800/60 border-gray-700/80 text-gray-200' 
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            {FONT_OPTIONS.map((font) => (
              <option key={font.id} value={font.id} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                {font.name}
              </option>
            ))}
          </select>
        </section>

        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Mesh Gradients & Background Presets */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Curated Backgrounds
            </h2>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {BACKGROUND_PRESETS.map((preset) => {
              const isSelected = selectedBg === preset.value;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectBackground(preset.value, preset.textColor)}
                  className={`h-10 rounded-xl border relative transition-all duration-200 hover:scale-110 shadow-sm flex items-center justify-center ${
                    isSelected 
                      ? 'ring-2 ring-zinc-500 ring-offset-2 ring-offset-gray-900 border-transparent shadow-zinc-500/30' 
                      : isDark ? 'border-white/10' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ background: preset.value }}
                  title={preset.name}
                >
                  {isSelected && (
                    <Check className={`w-4 h-4 ${preset.textColor === '#0f172a' ? 'text-gray-900' : 'text-white drop-shadow-md'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer Controls */}
      <div className={`p-5 border-t space-y-3 shadow-lg ${
        isDark ? 'bg-black/95 border-gray-800' : 'bg-white/95 border-gray-200'
      }`}>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all screenshots? This cannot be undone.')) {
                clearAllCanvases();
              }
            }}
            className={`flex items-center justify-center py-2.5 px-3 border rounded-xl shadow-sm transition-all hover:scale-[1.02] ${
              isDark
                ? 'border-gray-700 bg-gray-800/80 text-gray-400 hover:bg-red-950/50 hover:text-red-400 hover:border-red-900/50'
                : 'border-gray-300 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
            }`}
            title="Clear All Screenshots"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => addCanvas()}
            className={`flex-1 flex items-center justify-center py-2.5 px-4 border rounded-xl shadow-sm text-xs font-bold transition-all hover:scale-[1.02] ${
              isDark
                ? 'border-gray-700 bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            <PlusCircle className="w-4 h-4 mr-2 opacity-70" />
            Add Blank Screen
          </button>
        </div>
        
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-lg shadow-zinc-600/30 text-xs font-extrabold text-white bg-gradient-to-r from-zinc-500 to-zinc-700 hover:from-zinc-600 hover:to-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-all hover:scale-[1.02]"
        >
          <Download className="w-4 h-4 mr-2" />
          Export All ({canvases.length})
        </button>
      </div>
    </div>
  );
}
