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
  Sun,
  Layout,
  Smartphone
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
  const isDark = globalSettings.theme !== 'light';

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
      <div className="flex h-screen w-full bg-black items-center justify-center">
        <div className="flex flex-col items-center opacity-80">
          <Smartphone className="w-10 h-10 text-zinc-500 mb-4 animate-bounce" />
          <p className="text-gray-400 font-medium tracking-wide text-sm">Launching Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex h-screen w-full overflow-hidden font-sans relative select-none ${
        isDark ? 'bg-black text-gray-100' : 'bg-[#f8fafc] text-gray-900'
      }`}
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onDrop={handleGlobalDrop}
    >
      {/* Global Drag & Drop Overlay */}
      {isDraggingGlobal && (
        <div className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 pointer-events-none transition-all">
          <div className="bg-gray-900/95 border border-zinc-500/50 rounded-[2rem] p-12 flex flex-col items-center text-center shadow-2xl max-w-lg scale-105 transition-transform">
            <div className="p-4 bg-zinc-600/20 text-zinc-400 rounded-full mb-6 ring-4 ring-zinc-500/10">
              <UploadCloud className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight text-white">Drop Screenshots</h2>
            <p className="text-sm text-gray-300 mb-6 font-medium px-4">
              We'll automatically extract colors, apply dynamic mockups, and generate your showcase.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 bg-zinc-950/80 px-4 py-2 rounded-full border border-zinc-500/30">
              <Sparkles className="w-4 h-4" />
              <span>Multi-image bulk processing active</span>
            </div>
          </div>
        </div>
      )}

      <Sidebar />
      
      {/* Main Workspace Area */}
      <main className={`flex-1 h-full overflow-hidden flex flex-col relative ${
        isDark ? 'bg-black' : 'bg-[#f8fafc]'
      }`}>
        {/* Top Navbar */}
        <header className={`h-16 border-b flex items-center justify-between px-6 flex-shrink-0 z-20 transition-colors ${
          isDark 
            ? 'bg-zinc-950/90 backdrop-blur-md border-gray-800/80 text-gray-200' 
            : 'bg-white/90 backdrop-blur-md border-gray-200/80 text-gray-800'
        }`}>
          {/* Quick Jump Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-[65%] scrollbar-none items-center h-full">
            <Layout className={`w-4 h-4 mr-2 opacity-50 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            
            <div className={`flex items-center p-1 rounded-lg ${isDark ? 'bg-gray-900/50 border border-gray-800' : 'bg-gray-100 border border-gray-200/50'}`}>
              {canvases.map((canvas, i) => (
                <button
                  key={canvas.id}
                  onClick={() => scrollToCanvas(canvas.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-2 flex-shrink-0 ${
                    isDark
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      : 'text-gray-500 hover:bg-white hover:text-gray-900 hover:shadow-sm'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-bold ${
                    isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="max-w-[90px] truncate">
                    {canvas.title || `Slide ${i + 1}`}
                  </span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => addCanvas()}
              className={`p-1.5 ml-1 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-500 hover:bg-gray-800 hover:text-zinc-400' 
                  : 'text-gray-400 hover:bg-gray-100 hover:text-zinc-600'
              }`}
              title="Add New Screenshot"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle, Pan Arrows & Zoom Controls */}
          <div className="flex items-center space-x-3">
            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-gray-800/70 border-gray-700 text-amber-300 hover:bg-gray-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-zinc-600 shadow-sm'
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Scroll Jump Arrows */}
            <div className={`flex items-center border rounded-lg p-0.5 ${
              isDark ? 'bg-gray-800/50 border-gray-700/80' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <button
                onClick={() => scrollByAmount(-400)}
                className={`p-1.5 rounded-md transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className={`w-px h-4 mx-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <button
                onClick={() => scrollByAmount(400)}
                className={`p-1.5 rounded-md transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Slider / Controls */}
            <div className={`flex items-center border rounded-lg p-1 space-x-1 ${
              isDark ? 'bg-gray-800/50 border-gray-700/80' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <button
                onClick={() => setZoomScale(Math.max(0.4, Number((zoom - 0.05).toFixed(2))))}
                className={`p-1.5 rounded-md transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <span className={`text-xs font-bold w-12 text-center select-none ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoomScale(Math.min(1.0, Number((zoom + 0.05).toFixed(2))))}
                className={`p-1.5 rounded-md transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className={`w-px h-4 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

              <button
                onClick={() => setZoomScale(0.65)}
                className={`p-1.5 rounded-md transition-all ${
                  isDark 
                    ? 'text-gray-500 hover:bg-gray-700 hover:text-zinc-400' 
                    : 'text-gray-400 hover:bg-gray-100 hover:text-zinc-600'
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
          className="flex-1 overflow-x-auto overflow-y-auto flex items-start pt-12 pb-32 px-12 gap-12 scroll-smooth"
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
            className={`flex flex-col items-center justify-center min-w-[200px] h-[520px] rounded-3xl transition-all cursor-pointer group flex-shrink-0 ${
              isDark 
                ? 'border-2 border-dashed border-gray-800 bg-zinc-900/40 hover:bg-zinc-900/90 hover:border-zinc-500' 
                : 'border-2 border-dashed border-gray-300 bg-white/40 hover:bg-white/80 hover:border-zinc-400'
            }`}
            onClick={() => addCanvas()}
          >
            <div className={`p-4 rounded-full group-hover:scale-110 transition-transform mb-3 shadow-sm ${
              isDark ? 'bg-zinc-900/40 text-zinc-400' : 'bg-zinc-50 text-zinc-600'
            }`}>
              <Plus className="w-8 h-8" />
            </div>
            <span className={`text-sm font-bold tracking-tight transition-colors ${
              isDark ? 'text-gray-500 group-hover:text-zinc-400' : 'text-gray-400 group-hover:text-zinc-600'
            }`}>
              Add New Slide
            </span>
          </div>

          <div className="w-20 h-full flex-shrink-0" />
        </div>
      </main>
    </div>
  );
}
