'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { CanvasEditor } from '@/components/CanvasEditor';
import { useEditorStore } from '@/store/useEditorStore';
import { processUploadedFiles } from '@/utils/imageProcessor';
import { 
  UploadCloud, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Moon,
  Sun
} from 'lucide-react';

export default function Home() {
  const { 
    canvases, 
    globalSettings, 
    setZoomScale, 
    addCanvas,
    toggleTheme 
  } = useEditorStore();

  const [isMounted, setIsMounted] = useState(false);
  const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const zoom = globalSettings.zoomScale || 0.65;
  const isDark = globalSettings.theme !== 'light'; // default dark

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const scrollByAmount = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const scrollToCanvas = (id: string) => {
    const el = document.getElementById(`card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const handleGlobalDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      setIsDraggingGlobal(true);
    }
  };

  const handleGlobalDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingGlobal(false);
  };

  const handleGlobalDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGlobal(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadedFiles(Array.from(e.dataTransfer.files));
    }
  };

  if (!isMounted) {
    return (
      <div className="flex h-screen w-full bg-[#0a0d14] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400 font-medium">Loading LaunchShot...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex h-screen w-full overflow-hidden font-sans relative select-none ${
        isDark ? 'bg-[#0a0d14] text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onDrop={handleGlobalDrop}
    >
      {/* Global Drag & Drop Overlay */}
      {isDraggingGlobal && (
        <div className="absolute inset-0 z-50 bg-indigo-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 pointer-events-none transition-all">
          <div className="bg-gray-900/95 border-4 border-dashed border-indigo-500 rounded-3xl p-12 flex flex-col items-center text-center shadow-2xl max-w-lg animate-bounce text-white">
            <div className="p-4 bg-indigo-600/20 text-indigo-400 rounded-full mb-4">
              <UploadCloud className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Drop your screenshots here!</h2>
            <p className="text-sm text-gray-300 mb-4">
              We'll automatically extract colors, apply dynamic mockups, and generate your showcase.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 bg-indigo-950/80 px-3 py-1.5 rounded-full border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
              <span>Multi-image bulk processing active</span>
            </div>
          </div>
        </div>
      )}

      <Sidebar />
      
      {/* Main Workspace Area */}
      <main className={`flex-1 h-full overflow-hidden flex flex-col relative ${
        isDark ? 'bg-[#0a0d14]' : 'bg-gray-100/70'
      }`}>
        {/* Top Navbar */}
        <header className={`h-14 border-b flex items-center justify-between px-6 flex-shrink-0 shadow-xs z-20 transition-colors ${
          isDark 
            ? 'bg-[#10141e] border-gray-800/80 text-gray-200' 
            : 'bg-white border-gray-200 text-gray-800'
        }`}>
          {/* Quick Jump Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-[60%] scrollbar-none">
            <span className={`text-xs font-bold uppercase tracking-wider mr-1 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Slides:
            </span>
            {canvases.map((canvas, i) => (
              <button
                key={canvas.id}
                onClick={() => scrollToCanvas(canvas.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 flex-shrink-0 ${
                  isDark
                    ? 'border-gray-700/60 bg-gray-800/60 text-gray-300 hover:bg-indigo-950/70 hover:text-indigo-300 hover:border-indigo-500/50'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                }`}>
                  {i + 1}
                </span>
                <span className={`max-w-[80px] truncate text-[11px] ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {canvas.title || `Slide ${i + 1}`}
                </span>
              </button>
            ))}
            
            <button
              onClick={() => addCanvas()}
              className={`p-1 rounded-lg border border-dashed transition-colors ${
                isDark 
                  ? 'border-gray-700 text-gray-400 hover:text-indigo-400 hover:border-indigo-500' 
                  : 'border-gray-300 text-gray-400 hover:text-indigo-600 hover:border-indigo-400'
              }`}
              title="Add New Screenshot"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle, Pan Arrows & Zoom Controls */}
          <div className="flex items-center space-x-2.5">
            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-gray-800/70 border-gray-700 text-amber-300 hover:bg-gray-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Scroll Jump Arrows */}
            <div className={`flex items-center border rounded-lg p-0.5 ${
              isDark ? 'bg-gray-800/50 border-gray-700/80' : 'bg-gray-50 border-gray-200'
            }`}>
              <button
                onClick={() => scrollByAmount(-400)}
                className={`p-1 rounded transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-white hover:text-gray-900'
                }`}
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollByAmount(400)}
                className={`p-1 rounded transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-white hover:text-gray-900'
                }`}
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Slider / Controls */}
            <div className={`flex items-center border rounded-lg p-1 space-x-1 ${
              isDark ? 'bg-gray-800/50 border-gray-700/80' : 'bg-gray-50 border-gray-200'
            }`}>
              <button
                onClick={() => setZoomScale(Math.max(0.4, Number((zoom - 0.05).toFixed(2))))}
                className={`p-1 rounded transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-white hover:text-gray-900'
                }`}
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <span className={`text-xs font-semibold w-12 text-center select-none ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoomScale(Math.min(1.0, Number((zoom + 0.05).toFixed(2))))}
                className={`p-1 rounded transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-white hover:text-gray-900'
                }`}
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() => setZoomScale(0.65)}
                className={`p-1 rounded transition-all ${
                  isDark 
                    ? 'text-gray-500 hover:bg-gray-700 hover:text-indigo-400' 
                    : 'text-gray-400 hover:bg-white hover:text-indigo-600'
                }`}
                title="Reset Zoom (Fit)"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Canvases Container */}
        <div 
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className="flex-1 overflow-x-auto overflow-y-auto flex items-start pt-10 pb-28 px-12 gap-8 scroll-smooth"
        >
          {canvases.map((canvas, index) => (
            <CanvasEditor 
              key={canvas.id} 
              canvas={canvas} 
              index={index} 
              total={canvases.length} 
            />
          ))}
          
          {/* Add Slide Quick Button at End */}
          <div 
            className={`flex flex-col items-center justify-center min-w-[180px] h-[500px] border-2 border-dashed rounded-2xl transition-all cursor-pointer group flex-shrink-0 ${
              isDark 
                ? 'border-gray-800 bg-[#121622]/40 hover:bg-[#121622]/90 hover:border-indigo-500' 
                : 'border-gray-300 bg-white/40 hover:bg-white/80 hover:border-indigo-400'
            }`}
            onClick={() => addCanvas()}
          >
            <div className={`p-3 rounded-full group-hover:scale-110 transition-transform mb-2 shadow-sm ${
              isDark ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
            }`}>
              <Plus className="w-6 h-6" />
            </div>
            <span className={`text-xs font-semibold transition-colors ${
              isDark ? 'text-gray-400 group-hover:text-indigo-400' : 'text-gray-600 group-hover:text-indigo-600'
            }`}>
              Add New Slide
            </span>
          </div>

          <div className="w-16 h-full flex-shrink-0" />
        </div>
      </main>
    </div>
  );
}
