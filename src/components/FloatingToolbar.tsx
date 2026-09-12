'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '@/store/useEditorStore';
import {
  IoRefreshOutline,
  IoOptionsOutline,
  IoMoveOutline,
  IoSyncOutline,
  IoBookmarkOutline,
  IoPencilOutline,
  IoVideocamOutline,
  IoColorPaletteOutline,
} from 'react-icons/io5';

interface FloatingToolbarProps {
  onToggleInspector?: () => void;
  isInspectorOpen?: boolean;
}

export function FloatingToolbar({ onToggleInspector, isInspectorOpen }: FloatingToolbarProps) {
  const {
    canvases,
    globalSettings,
    rotateMockup,
    resetCanvasAdjustments,
    updateCanvas,
    addCalloutPin,
  } = useEditorStore(
    useShallow((state) => ({
      canvases: state.canvases,
      globalSettings: state.globalSettings,
      rotateMockup: state.rotateMockup,
      resetCanvasAdjustments: state.resetCanvasAdjustments,
      updateCanvas: state.updateCanvas,
      addCalloutPin: state.addCalloutPin,
    }))
  );

  const [isAnimating, setIsAnimating] = useState(false);
  const isDark = globalSettings.theme !== 'light';
  const activeCanvas = canvases[0];

  const handleReset = () => {
    resetCanvasAdjustments();
    toast.success('Reset mockup adjustments');
  };

  const handleRotate = () => {
    rotateMockup();
    toast.success('Rotated device angle');
  };

  const handleAddAnnotation = () => {
    if (!activeCanvas) return;
    addCalloutPin(activeCanvas.id, {
      text: 'Highlight Feature',
      position: 'center',
      color: '#3b82f6',
      pointingDirection: 'bottom',
    });
    toast.success('Added annotation callout');
  };

  const handleToggleAnimate = () => {
    setIsAnimating(!isAnimating);
    toast.success(!isAnimating ? 'Dynamic 3D perspective enabled' : 'Perspective reset');
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      <div
        className={`flex items-center gap-1.5 p-1.5 rounded-full border shadow-2xl backdrop-blur-xl transition-all ${
          isDark
            ? 'bg-zinc-900/90 border-zinc-700/70 text-zinc-200'
            : 'bg-white/95 border-zinc-200 text-zinc-800 shadow-xl'
        }`}
      >
        {/* Reset button */}
        <button
          type="button"
          onClick={handleReset}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
          }`}
          title="Reset Canvas Adjustments"
        >
          <IoRefreshOutline className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <div className={`w-px h-4 mx-0.5 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

        {/* Settings / Adjustments (Toggles Right Inspector) */}
        <button
          type="button"
          onClick={onToggleInspector}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isInspectorOpen
              ? 'bg-blue-600 text-white shadow-md'
              : isDark
              ? 'hover:bg-zinc-800 text-zinc-300'
              : 'hover:bg-zinc-100 text-zinc-700'
          }`}
          title="Adjust Backdrop & Shadow"
        >
          <IoOptionsOutline className="w-4 h-4" />
        </button>

        {/* Position / Pan / Center */}
        <button
          type="button"
          onClick={() => {
            if (activeCanvas) {
              updateCanvas(activeCanvas.id, { imageZoom: 1, imageCrop: { x: 0, y: 0 } });
              toast.success('Centered mockup');
            }
          }}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
          }`}
          title="Center Mockup"
        >
          <IoMoveOutline className="w-4 h-4" />
        </button>

        {/* Rotate Angle */}
        <button
          type="button"
          onClick={handleRotate}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-700'
          }`}
          title="Rotate Mockup Angle"
        >
          <IoSyncOutline className="w-4 h-4" />
        </button>

        {/* Stickers / Badges */}
        <button
          type="button"
          onClick={() => {
            if (activeCanvas) {
              const currentEnabled = activeCanvas.badge?.enabled;
              updateCanvas(activeCanvas.id, {
                badge: {
                  enabled: !currentEnabled,
                  icon: 'star',
                  text: '4.9 App Store',
                  subtext: '30k+ ratings',
                  style: 'pill-glass',
                },
              });
              toast.success(!currentEnabled ? 'Badge added' : 'Badge hidden');
            }
          }}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            activeCanvas?.badge?.enabled
              ? 'bg-amber-500/20 text-amber-300'
              : isDark
              ? 'hover:bg-zinc-800 text-zinc-300'
              : 'hover:bg-zinc-100 text-zinc-700'
          }`}
          title="Toggle Badge / Sticker"
        >
          <IoBookmarkOutline className="w-4 h-4" />
        </button>

        <div className={`w-px h-4 mx-0.5 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`} />

        {/* Annotate */}
        <button
          type="button"
          onClick={handleAddAnnotation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isDark
              ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
          }`}
          title="Add Annotation Pin"
        >
          <IoPencilOutline className="w-3.5 h-3.5" />
          <span>Annotate</span>
        </button>

        {/* Animate (with New badge) */}
        <button
          type="button"
          onClick={handleToggleAnimate}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            isAnimating
              ? 'bg-teal-600 text-white shadow-md'
              : isDark
              ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200'
              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800'
          }`}
          title="Toggle 3D Animate Effect"
        >
          <span className="absolute -top-2 right-1 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-teal-500 text-black">
            New
          </span>
          <IoVideocamOutline className="w-3.5 h-3.5" />
          <span>Animate</span>
        </button>

        {/* Quick color indicator */}
        <button
          type="button"
          onClick={onToggleInspector}
          className="w-6 h-6 rounded-full border border-white/20 shadow-xs cursor-pointer ml-1 transition-transform hover:scale-110 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: activeCanvas?.backgroundColor || '#fce7f3' }}
          title="Open Backdrop Palette"
        >
          <IoColorPaletteOutline className="w-3.5 h-3.5 text-zinc-800 mix-blend-difference" />
        </button>
      </div>
    </div>
  );
}
