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
  Plus
} from 'lucide-react';

export default function Home() {
  const { 
    canvases, 
    globalSettings, 
    setZoomScale, 
    addCanvas 
  } = useEditorStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const zoom = globalSettings.zoomScale || 0.65;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Convert mouse wheel vertical scroll to horizontal scroll
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
      <div className="flex h-screen w-full bg-gray-50 items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading Editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans relative select-none"
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onDrop={handleGlobalDrop}
    >
      {/* Global Drag & Drop Overlay */}
      {isDraggingGlobal && (
        <div className="absolute inset-0 z-50 bg-indigo-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 pointer-events-none transition-all">
          <div className="bg-white/95 border-4 border-dashed border-indigo-500 rounded-3xl p-12 flex flex-col items-center text-center shadow-2xl max-w-lg animate-bounce">
            <div className="p-4 bg-indigo-100 rounded-full text-indigo-600 mb-4">
              <UploadCloud className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Drop your screenshots here!</h2>
            <p className="text-sm text-gray-600 mb-4">
              We'll automatically extract the app colors, apply dynamic templates, and generate your showcases.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span>Multi-image bulk processing active</span>
            </div>
          </div>
        </div>
      )}

      <Sidebar />
      
      {/* Main Canvas Area */}
      <main className="flex-1 h-full overflow-hidden flex flex-col relative bg-gray-100/70">
        {/* Top Navbar with Quick Jump Navigation & Zoom Controls */}
        <header className="h-14 border-b border-gray-200/80 bg-white flex items-center justify-between px-6 flex-shrink-0 shadow-sm z-20">
          {/* Quick Jump Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-[60%] scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">
              Slides:
            </span>
            {canvases.map((canvas, i) => (
              <button
                key={canvas.id}
                onClick={() => scrollToCanvas(canvas.id)}
                className="px-2.5 py-1 text-xs font-semibold rounded-md border border-gray-200 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-700 text-[10px] flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="max-w-[80px] truncate text-[11px] text-gray-600">
                  {canvas.title || `Slide ${i + 1}`}
                </span>
              </button>
            ))}
            
            <button
              onClick={() => addCanvas()}
              className="p-1 rounded-md border border-dashed border-gray-300 text-gray-400 hover:text-indigo-600 hover:border-indigo-400 transition-colors"
              title="Add New Screenshot"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom and Navigation Controls */}
          <div className="flex items-center space-x-2">
            {/* Scroll Jump Arrows */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-0.5 mr-2">
              <button
                onClick={() => scrollByAmount(-400)}
                className="p-1 rounded text-gray-500 hover:bg-white hover:text-gray-900 transition-all"
                title="Scroll Left (or use mouse wheel)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollByAmount(400)}
                className="p-1 rounded text-gray-500 hover:bg-white hover:text-gray-900 transition-all"
                title="Scroll Right (or use mouse wheel)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Slider / Controls */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-1 space-x-1">
              <button
                onClick={() => setZoomScale(Math.max(0.4, Number((zoom - 0.05).toFixed(2))))}
                className="p-1 rounded text-gray-500 hover:bg-white hover:text-gray-900 transition-all"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <span className="text-xs font-semibold text-gray-700 w-12 text-center select-none">
                {Math.round(zoom * 100)}%
              </span>

              <button
                onClick={() => setZoomScale(Math.min(1.0, Number((zoom + 0.05).toFixed(2))))}
                className="p-1 rounded text-gray-500 hover:bg-white hover:text-gray-900 transition-all"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() => setZoomScale(0.65)}
                className="p-1 rounded text-gray-400 hover:bg-white hover:text-indigo-600 transition-all"
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
          <div className="flex flex-col items-center justify-center min-w-[180px] h-[500px] border-2 border-dashed border-gray-300 rounded-2xl bg-white/40 hover:bg-white/80 hover:border-indigo-400 transition-all cursor-pointer group flex-shrink-0"
            onClick={() => addCanvas()}
          >
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform mb-2 shadow-sm">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-gray-600 group-hover:text-indigo-600">
              Add New Slide
            </span>
          </div>

          <div className="w-16 h-full flex-shrink-0" />
        </div>
      </main>
    </div>
  );
}
