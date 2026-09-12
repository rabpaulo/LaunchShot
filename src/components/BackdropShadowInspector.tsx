'use client';

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '@/store/useEditorStore';
import { ShadowStyle, ShadowIntensity } from '@/utils/shadowEngine';
import { POSTSPARK_COLOR_PALETTE, BACKGROUND_PRESETS } from '@/config/backgrounds';
import { getContrastColor } from '@/utils/imageProcessor';
import { FastAverageColor } from 'fast-average-color';
import {
  IoSparklesOutline,
  IoShuffleOutline,
  IoLayersOutline,
  IoGridOutline,
  IoContrastOutline,
  IoColorPaletteOutline,
  IoSunny,
  IoChevronDown,
  IoChevronUp,
  IoImageOutline,
  IoCheckmark,
  IoClose,
} from 'react-icons/io5';

const fac = new FastAverageColor();

interface BackdropShadowInspectorProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function BackdropShadowInspector({ isOpen = true, onClose }: BackdropShadowInspectorProps) {
  const {
    canvases,
    globalSettings,
    updateShadow,
    updateBackdropEffects,
    updateCanvas,
    applyBackgroundToAll,
    shuffleBackground,
  } = useEditorStore(
    useShallow((state) => ({
      canvases: state.canvases,
      globalSettings: state.globalSettings,
      updateShadow: state.updateShadow,
      updateBackdropEffects: state.updateBackdropEffects,
      updateCanvas: state.updateCanvas,
      applyBackgroundToAll: state.applyBackgroundToAll,
      shuffleBackground: state.shuffleBackground,
    }))
  );

  const [backdropOpen, setBackdropOpen] = useState(true);
  const [shadowOpen, setShadowOpen] = useState(true);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isDark = globalSettings.theme !== 'light';
  const shadow = globalSettings.shadow || {
    style: 'spread' as ShadowStyle,
    intensity: 'medium' as ShadowIntensity,
    lightSource: [2, 2] as [number, number],
  };
  const backdropEffects = globalSettings.backdropEffects || {
    overlay: false,
    effects: false,
    pattern: false,
    vignette: false,
    mode: 'solid' as const,
  };

  const activeCanvas = canvases[0];
  const activeColor = activeCanvas?.backgroundColor || '#fce7f3';

  const handleSelectColor = (color: string) => {
    const textColor = getContrastColor(color);
    applyBackgroundToAll(color, textColor);
    updateBackdropEffects({ mode: 'solid' });
  };

  const handleAutoColor = async () => {
    const canvasWithImage = canvases.find((c) => c.imageSrc);
    if (!canvasWithImage?.imageSrc) {
      toast.error('Upload a screenshot first to generate matching colors');
      return;
    }

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = canvasWithImage.imageSrc;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const color = fac.getColor(img);
      // Generate a soft aesthetic tint from the extracted color
      const autoBg = color.isDark ? '#18181b' : color.hex;
      const textColor = getContrastColor(autoBg);
      applyBackgroundToAll(autoBg, textColor);
      toast.success('Auto background generated from content');
    } catch {
      toast.error('Failed to extract color from image');
    }
  };

  const handleImageBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    canvases.forEach((c) => {
      updateCanvas(c.id, { backgroundImageSrc: url });
    });
    updateBackdropEffects({ mode: 'image' });
    toast.success('Custom background image applied');
  };

  if (!isOpen) return null;

  return (
    <aside
      className={`w-72 sm:w-80 md:w-88 h-full flex flex-col flex-shrink-0 border-l z-20 overflow-y-auto select-none scrollbar-thin ${
        isDark ? 'bg-zinc-950 border-zinc-800/80 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900 shadow-sm'
      }`}
    >
      {/* Header bar */}
      <div className={`p-3.5 border-b flex items-center justify-between ${
        isDark ? 'border-zinc-800/80' : 'border-zinc-200'
      }`}>
        <div className="flex items-center gap-2">
          <IoColorPaletteOutline className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider">Studio Inspector</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            title="Close Inspector"
          >
            <IoClose className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-6 flex-1">
        {/* Accordion 1: Backdrop */}
        <section className={`rounded-2xl border transition-all ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/90' : 'bg-zinc-50/70 border-zinc-200 shadow-xs'
        }`}>
          <button
            type="button"
            onClick={() => setBackdropOpen(!backdropOpen)}
            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight">Backdrop</span>
            </div>
            {backdropOpen ? (
              <IoChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <IoChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {backdropOpen && (
            <div className="px-3.5 pb-4 space-y-4 pt-1 border-t border-zinc-800/40">
              {/* Quick Effects Pill Toggles */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => updateBackdropEffects({ overlay: !backdropEffects.overlay })}
                  className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    backdropEffects.overlay
                      ? isDark ? 'bg-blue-600/30 border-blue-500 text-blue-200' : 'bg-blue-50 border-blue-300 text-blue-700'
                      : isDark ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200' : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <IoLayersOutline className="w-3.5 h-3.5" />
                  <span>Overlay</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateBackdropEffects({ effects: !backdropEffects.effects })}
                  className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    backdropEffects.effects
                      ? isDark ? 'bg-blue-600/30 border-blue-500 text-blue-200' : 'bg-blue-50 border-blue-300 text-blue-700'
                      : isDark ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200' : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <IoSparklesOutline className="w-3.5 h-3.5" />
                  <span>Effects</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateBackdropEffects({ pattern: !backdropEffects.pattern })}
                  className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    backdropEffects.pattern
                      ? isDark ? 'bg-blue-600/30 border-blue-500 text-blue-200' : 'bg-blue-50 border-blue-300 text-blue-700'
                      : isDark ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200' : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <IoGridOutline className="w-3.5 h-3.5" />
                  <span>Pattern</span>
                </button>

                <button
                  type="button"
                  onClick={() => updateBackdropEffects({ vignette: !backdropEffects.vignette })}
                  className={`py-1.5 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    backdropEffects.vignette
                      ? isDark ? 'bg-blue-600/30 border-blue-500 text-blue-200' : 'bg-blue-50 border-blue-300 text-blue-700'
                      : isDark ? 'bg-zinc-800/60 border-zinc-700/60 text-zinc-400 hover:text-zinc-200' : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <IoContrastOutline className="w-3.5 h-3.5" />
                  <span>Vignette</span>
                </button>
              </div>

              {/* Magic Actions: Auto & Shuffle */}
              <div className={`p-2.5 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-white border-zinc-200'
              }`}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoColor}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isDark
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                        : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    <IoSparklesOutline className="w-3.5 h-3.5 text-amber-400" />
                    <span>Auto</span>
                  </button>

                  <button
                    type="button"
                    onClick={shuffleBackground}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isDark
                        ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                        : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    <IoShuffleOutline className="w-3.5 h-3.5" />
                    <span>Shuffle</span>
                  </button>
                </div>
                <p className={`text-[10px] leading-relaxed text-center ${
                  isDark ? 'text-zinc-500' : 'text-zinc-400'
                }`}>
                  Add image or video to generate backgrounds based on your content.
                </p>
              </div>

              {/* Background Mode Tabs: None, Solid, Gradient, Image */}
              <div className={`flex rounded-xl border p-0.5 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    updateBackdropEffects({ mode: 'none' });
                    applyBackgroundToAll('transparent', '#ffffff');
                  }}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    backdropEffects.mode === 'none'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  None
                </button>
                <button
                  type="button"
                  onClick={() => updateBackdropEffects({ mode: 'solid' })}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    backdropEffects.mode === 'solid'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Solid
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateBackdropEffects({ mode: 'gradient' });
                    const gradientPreset = BACKGROUND_PRESETS[0];
                    if (gradientPreset) {
                      applyBackgroundToAll(gradientPreset.value, gradientPreset.textColor);
                    }
                  }}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    backdropEffects.mode === 'gradient'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Gradient
                </button>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    backdropEffects.mode === 'image'
                      ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  Image
                </button>
              </div>

              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageBackgroundUpload}
                accept="image/*"
                className="hidden"
              />

              {/* 5x8 Color Palette Grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-zinc-400' : 'text-zinc-500'
                  }`}>
                    Palette
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono opacity-60 uppercase">{activeColor}</span>
                    <input
                      type="color"
                      value={activeColor.startsWith('#') ? activeColor : '#fce7f3'}
                      onChange={(e) => handleSelectColor(e.target.value)}
                      className="w-5 h-5 rounded-full border-0 cursor-pointer p-0"
                      title="Custom Color"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-1.5">
                  {POSTSPARK_COLOR_PALETTE.map((color, index) => {
                    const isSelected = activeColor.toLowerCase() === color.toLowerCase();
                    return (
                      <button
                        key={`${color}-${index}`}
                        type="button"
                        onClick={() => handleSelectColor(color)}
                        className={`w-full aspect-square rounded-full border relative transition-transform hover:scale-125 shadow-xs flex items-center justify-center ${
                          isSelected
                            ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-900 border-transparent scale-110'
                            : isDark ? 'border-white/10' : 'border-black/10'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {isSelected && (
                          <IoCheckmark className={`w-3 h-3 ${getContrastColor(color) === '#ffffff' ? 'text-white' : 'text-black'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Accordion 2: Shadow */}
        <section className={`rounded-2xl border transition-all ${
          isDark ? 'bg-zinc-900/60 border-zinc-800/90' : 'bg-zinc-50/70 border-zinc-200 shadow-xs'
        }`}>
          <button
            type="button"
            onClick={() => setShadowOpen(!shadowOpen)}
            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight">Shadow</span>
            </div>
            {shadowOpen ? (
              <IoChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <IoChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>

          {shadowOpen && (
            <div className="px-3.5 pb-4 space-y-4 pt-1 border-t border-zinc-800/40">
              {/* Shadow Style Cards: None, Spread, Hug */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'spread', label: 'Spread' },
                  { id: 'hug', label: 'Hug' },
                ].map((s) => {
                  const isSelected = shadow.style === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateShadow({ style: s.id as ShadowStyle })}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                        isSelected
                          ? isDark
                            ? 'border-zinc-300 bg-zinc-800/90 shadow-md ring-1 ring-zinc-400'
                            : 'border-zinc-900 bg-white shadow-md ring-1 ring-zinc-900'
                          : isDark
                            ? 'border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/60 text-zinc-400'
                            : 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {/* Visual shadow miniature thumbnail */}
                      <div className="w-12 h-10 rounded-lg bg-zinc-900 flex items-center justify-center relative overflow-hidden">
                        <div
                          className={`w-7 h-8 rounded-md bg-zinc-700 border border-zinc-600 transition-all ${
                            s.id === 'spread'
                              ? 'shadow-[0_8px_16px_rgba(0,0,0,0.8)]'
                              : s.id === 'hug'
                              ? 'shadow-[0_3px_5px_rgba(0,0,0,0.95)]'
                              : ''
                          }`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold capitalize">{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Intensity Pills: Low, Medium, High */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1.5 opacity-60">
                  Intensity
                </div>
                <div className={`flex rounded-xl border p-0.5 ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-100 border-zinc-200'
                }`}>
                  {(['low', 'medium', 'high'] as ShadowIntensity[]).map((int) => {
                    const isSelected = shadow.intensity === int;
                    return (
                      <button
                        key={int}
                        type="button"
                        onClick={() => updateShadow({ intensity: int })}
                        className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                          isSelected
                            ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-zinc-900 shadow-sm'
                            : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        {int}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Light Source 5x5 Interactive Matrix */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-60">
                  Light Source
                </div>
                <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center ${
                  isDark ? 'bg-zinc-950/70 border-zinc-800' : 'bg-zinc-100/70 border-zinc-200'
                }`}>
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4].map((row) =>
                      [0, 1, 2, 3, 4].map((col) => {
                        const isCurrent = shadow.lightSource[0] === row && shadow.lightSource[1] === col;
                        return (
                          <button
                            key={`node-${row}-${col}`}
                            type="button"
                            onClick={() => updateShadow({ lightSource: [row, col] })}
                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                              isCurrent
                                ? 'bg-cyan-500 border-cyan-400 text-zinc-950 shadow-md shadow-cyan-500/40 scale-110'
                                : isDark
                                ? 'bg-zinc-800/80 border-zinc-700/60 hover:bg-zinc-700 text-transparent'
                                : 'bg-zinc-200 border-zinc-300 hover:bg-zinc-300 text-transparent'
                            }`}
                            title={`Light: [${row}, ${col}]`}
                          >
                            {isCurrent && <IoSunny className="w-3.5 h-3.5 fill-current" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}
