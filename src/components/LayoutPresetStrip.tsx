'use client';

import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore, LayoutType } from '@/store/useEditorStore';
import { TARGET_SIZES, TargetSizeId, ASPECT_RATIOS } from '@/config/sizes';
import {
  IoPhonePortraitOutline,
  IoChevronForward,
  IoCheckmark,
  IoLayersOutline,
  IoSparklesOutline,
} from 'react-icons/io5';

interface LayoutCardOption {
  id: LayoutType;
  name: string;
  renderPreview: (isDark: boolean) => React.ReactNode;
}

const LAYOUT_PRESETS: LayoutCardOption[] = [
  {
    id: 'device-only',
    name: 'Single Mockup',
    renderPreview: (isDark) => (
      <div className="w-full h-full flex items-center justify-center">
        <div className={`w-8 h-16 rounded-[7px] border shadow-md transition-all ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
      </div>
    ),
  },
  {
    id: 'tilt-right',
    name: 'Tilted Angle',
    renderPreview: (isDark) => (
      <div className="w-full h-full flex items-center justify-center">
        <div className={`w-8 h-16 rounded-[7px] border shadow-md rotate-[12deg] transition-all ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
      </div>
    ),
  },
  {
    id: 'basic-top',
    name: 'Hero Top',
    renderPreview: (isDark) => (
      <div className="w-full h-full flex flex-col items-center justify-between p-1.5 overflow-hidden">
        <div className={`w-10 h-1.5 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
        <div className={`w-9 h-14 rounded-[7px] border translate-y-2 shadow-sm ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
      </div>
    ),
  },
  {
    id: 'hero-center',
    name: 'Center Hero',
    renderPreview: (isDark) => (
      <div className="w-full h-full flex flex-col items-center justify-center overflow-hidden relative">
        <div className={`w-11 h-20 rounded-[8px] border shadow-lg translate-y-3 ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
      </div>
    ),
  },
  {
    id: 'basic-bottom',
    name: 'Hero Bottom',
    renderPreview: (isDark) => (
      <div className="w-full h-full flex flex-col items-center justify-between p-1.5 overflow-hidden">
        <div className={`w-9 h-14 rounded-[7px] border -translate-y-2 shadow-sm ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
        <div className={`w-10 h-1.5 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`} />
      </div>
    ),
  },
  {
    id: 'duo-row',
    name: 'Duo Side-by-Side',
    renderPreview: (isDark) => (
      <div className="w-full h-full flex items-center justify-center gap-1.5">
        <div className={`w-6 h-13 rounded-[6px] border shadow-sm ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
        <div className={`w-6 h-13 rounded-[6px] border shadow-sm ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
      </div>
    ),
  },
  {
    id: 'trio-row',
    name: 'Trio Side-by-Side',
    renderPreview: (isDark) => (
      <div className="w-full h-full flex items-center justify-center gap-1">
        <div className={`w-5 h-12 rounded-[5px] border shadow-sm ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
        <div className={`w-5 h-12 rounded-[5px] border shadow-sm ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
        <div className={`w-5 h-12 rounded-[5px] border shadow-sm ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
      </div>
    ),
  },
  {
    id: 'multi-screen-center',
    name: 'Layered Trio',
    renderPreview: (isDark) => (
      <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
        <div className={`absolute -left-1 w-6 h-12 rounded-[5px] opacity-70 scale-90 border ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-800 border-zinc-700'
        }`} />
        <div className={`z-10 w-7 h-14 rounded-[6px] border shadow-lg ${
          isDark ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-900 border-zinc-800'
        }`} />
        <div className={`absolute -right-1 w-6 h-12 rounded-[5px] opacity-70 scale-90 border ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-800 border-zinc-700'
        }`} />
      </div>
    ),
  },
  {
    id: '3d-isometric-right',
    name: '3D Perspective',
    renderPreview: (isDark) => (
      <div className="w-full h-full flex items-center justify-center [perspective:300px]">
        <div className={`w-8 h-15 rounded-[6px] border shadow-xl [transform:rotateX(15deg)_rotateY(-30deg)_rotateZ(5deg)] ${
          isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800'
        }`} />
      </div>
    ),
  },
];

export function LayoutPresetStrip() {
  const {
    canvases,
    globalSettings,
    updateGlobalSettings,
    updateCanvas,
    setAspectRatio,
  } = useEditorStore(
    useShallow((state) => ({
      canvases: state.canvases,
      globalSettings: state.globalSettings,
      updateGlobalSettings: state.updateGlobalSettings,
      updateCanvas: state.updateCanvas,
      setAspectRatio: state.setAspectRatio,
    }))
  );

  const [showAspectMenu, setShowAspectMenu] = useState(false);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  const isDark = globalSettings.theme !== 'light';
  const activeCanvas = canvases[0];
  const activeLayout = activeCanvas?.layout || 'trio-row';
  const activeAspect = globalSettings.aspectRatio || '4:3';
  const activeDeviceConfig = TARGET_SIZES[globalSettings.targetSize] || TARGET_SIZES['ios-iphone-17'] || TARGET_SIZES['ios-6.5'];

  const handleSelectLayout = (layout: LayoutType) => {
    canvases.forEach((c) => {
      updateCanvas(c.id, { layout });
    });
  };

  const handleSelectAspect = (aspectId: string) => {
    setAspectRatio(aspectId);
    setShowAspectMenu(false);
  };

  const handleSelectDevice = (deviceId: TargetSizeId) => {
    updateGlobalSettings({ targetSize: deviceId });
    setShowDeviceMenu(false);
  };

  const popularDevices: { id: TargetSizeId; label: string }[] = [
    { id: 'ios-iphone-17', label: 'iPhone 17' },
    { id: 'ios-iphone-17-pro', label: 'iPhone 17 Pro' },
    { id: 'ios-iphone-17-pro-max', label: 'iPhone 17 Pro Max' },
    { id: 'ios-6.9', label: 'iPhone 16 Pro Max' },
    { id: 'ios-6.5', label: 'iPhone 11 / XS Max' },
    { id: 'samsung-s26-ultra', label: 'Galaxy S26 Ultra' },
    { id: 'samsung-s25', label: 'Galaxy S25' },
    { id: 'android-tall', label: 'Android Tall (20:9)' },
    { id: 'ipad-12.9', label: 'iPad Pro 12.9"' },
  ];

  return (
    <aside
      className={`w-28 sm:w-32 md:w-36 h-full flex flex-col flex-shrink-0 border-r z-20 select-none ${
        isDark ? 'bg-zinc-950 border-zinc-800/80 text-zinc-200' : 'bg-[#fcfdfe] border-zinc-200 text-zinc-800'
      }`}
    >
      {/* Top Selectors: Aspect Ratio & Device */}
      <div className="p-2.5 space-y-2 border-b border-zinc-800/50">
        {/* Aspect Ratio Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowAspectMenu(!showAspectMenu);
              setShowDeviceMenu(false);
            }}
            className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
              isDark
                ? 'bg-zinc-900/90 border-zinc-700/60 hover:bg-zinc-800 text-zinc-200'
                : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-800 shadow-sm'
            }`}
            title="Aspect Ratio"
          >
            <div className="flex items-center gap-1.5 truncate">
              <IoLayersOutline className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="truncate">{activeAspect}</span>
            </div>
            <IoChevronForward className="w-3 h-3 text-zinc-400 flex-shrink-0" />
          </button>

          {showAspectMenu && (
            <div
              className={`absolute top-full left-0 mt-1 w-44 rounded-xl border shadow-2xl p-1.5 z-50 ${
                isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-zinc-400">
                Aspect Ratio
              </div>
              {ASPECT_RATIOS.map((aspect) => (
                <button
                  key={aspect.id}
                  onClick={() => handleSelectAspect(aspect.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    activeAspect === aspect.id
                      ? isDark ? 'bg-zinc-800 text-blue-400' : 'bg-blue-50 text-blue-600 font-semibold'
                      : isDark ? 'hover:bg-zinc-800/60 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  <span>{aspect.label}</span>
                  {activeAspect === aspect.id && <IoCheckmark className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Device Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowDeviceMenu(!showDeviceMenu);
              setShowAspectMenu(false);
            }}
            className={`w-full py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
              isDark
                ? 'bg-zinc-900/90 border-zinc-700/60 hover:bg-zinc-800 text-zinc-200'
                : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-800 shadow-sm'
            }`}
            title="Select Device Frame"
          >
            <div className="flex items-center gap-1.5 truncate">
              <IoPhonePortraitOutline className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span className="truncate">
                {activeDeviceConfig.name.split(' (')[0] || 'iPhone 17'}
              </span>
            </div>
            <IoChevronForward className="w-3 h-3 text-zinc-400 flex-shrink-0" />
          </button>

          {showDeviceMenu && (
            <div
              className={`absolute top-full left-0 mt-1 w-52 max-h-72 overflow-y-auto rounded-xl border shadow-2xl p-1.5 z-50 ${
                isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 text-zinc-400">
                Devices
              </div>
              {popularDevices.map((dev) => (
                <button
                  key={dev.id}
                  onClick={() => handleSelectDevice(dev.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    globalSettings.targetSize === dev.id
                      ? isDark ? 'bg-zinc-800 text-emerald-400' : 'bg-emerald-50 text-emerald-700 font-semibold'
                      : isDark ? 'hover:bg-zinc-800/60 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  <span className="truncate">{dev.label}</span>
                  {globalSettings.targetSize === dev.id && <IoCheckmark className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vertical Layout Presets Strip */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2.5 scrollbar-thin">
        {LAYOUT_PRESETS.map((preset) => {
          const isActive = activeLayout === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectLayout(preset.id)}
              className={`w-full rounded-2xl p-2 transition-all flex flex-col items-center group relative cursor-pointer border ${
                isActive
                  ? isDark
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
                    : 'border-blue-500 bg-blue-50 shadow-md ring-1 ring-blue-500'
                  : isDark
                    ? 'border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700'
                    : 'border-zinc-200 bg-zinc-50/70 hover:bg-white hover:border-zinc-300 shadow-xs'
              }`}
              title={preset.name}
            >
              {/* Miniature visual canvas */}
              <div
                className="w-full h-24 rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-[1.03]"
                style={{
                  backgroundColor: activeCanvas?.backgroundColor || '#fce7f3',
                }}
              >
                {preset.renderPreview(isDark)}
              </div>

              <span
                className={`mt-1.5 text-[10px] font-semibold text-center truncate w-full ${
                  isActive
                    ? isDark ? 'text-blue-400' : 'text-blue-700'
                    : isDark ? 'text-zinc-400 group-hover:text-zinc-200' : 'text-zinc-600 group-hover:text-zinc-900'
                }`}
              >
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
