'use client';

import React, { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Sidebar } from '@/components/Sidebar';
import { ExportModal } from '@/components/ExportModal';
import { IoDownloadOutline } from 'react-icons/io5';
import { CanvasEditor } from '@/components/CanvasEditor';
import { useEditorStore } from '@/store/useEditorStore';
import { processUploadedFiles } from '@/utils/imageProcessor';
import {
  IoCloudUploadOutline,
  IoSparklesOutline,
  IoAddOutline,
  IoRemoveOutline,
  IoExpandOutline,
  IoChevronBack,
  IoChevronForward,
  IoAdd,
  IoMoonOutline,
  IoSunnyOutline,
  IoGridOutline,
  IoPhonePortraitOutline,
  IoListOutline,
  IoAlbumsOutline,
  IoChevronUp,
  IoChevronDown
} from 'react-icons/io5';

export default function Home() {
  const { 
    canvases, 
    addCanvas, 
    globalSettings, 
    setZoomScale, 
    toggleTheme,
    isPreviewMode,
    togglePreviewMode,
    isDraggingGlobal,
    setIsDraggingGlobal,
    updateGlobalSettings
  } = useEditorStore();

  const [isMounted, setIsMounted] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const zoom = globalSettings.zoomScale || 0.65;
  const isDark = globalSettings.theme !== 'light';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types && Array.from(e.dataTransfer.types).includes('Files')) {
        setIsDraggingGlobal(true);
      }
    };

    const handleWindowDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (!e.relatedTarget || (e.relatedTarget as HTMLElement).nodeName === 'HTML') {
        setIsDraggingGlobal(false);
      }
    };

    const handleWindowDrop = async (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingGlobal(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        await processUploadedFiles(Array.from(e.dataTransfer.files));
        toast.success(e.dataTransfer.files.length === 1 ? "Screenshot uploaded!" : `${e.dataTransfer.files.length} screenshots uploaded!`);
      }
    };

    // Global fail-safe for mouse leave
    const handleMouseLeave = () => {
      setIsDraggingGlobal(false);
    };

    window.addEventListener('dragover', handleWindowDragOver);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('dragover', handleWindowDragOver);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [setIsDraggingGlobal]);


  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current && globalSettings.viewMode !== 'vertical') {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        scrollContainerRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  const scrollByAmount = (amount: number) => {
    if (scrollContainerRef.current) {
      if (globalSettings.viewMode === 'vertical') {
        scrollContainerRef.current.scrollBy({ top: amount, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
      }
    }
  };

  const scrollToCanvas = (id: string) => {
    const el = document.getElementById(`card-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };



  if (!isMounted) {
    return (
      <div className="flex h-screen w-full bg-black items-center justify-center">
        <div className="flex flex-col items-center opacity-80">
          <IoPhonePortraitOutline className="w-10 h-10 text-zinc-500 mb-4 animate-bounce" />
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



    >
      {/* Global Drag & Drop Overlay */}
      {isDraggingGlobal && (
        <div className="fixed inset-0 z-[9999] bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 pointer-events-none transition-all">
          <div className="bg-gray-900/95 border border-zinc-500/50 rounded-[2rem] p-12 flex flex-col items-center text-center shadow-2xl max-w-lg scale-105 transition-transform">
            <div className="p-4 bg-zinc-600/20 text-zinc-400 rounded-full mb-6 ring-4 ring-zinc-500/10">
              <IoCloudUploadOutline className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-3 tracking-tight text-white">Drop Screenshots</h2>
            <p className="text-sm text-gray-300 mb-6 font-medium px-4">
              We'll automatically extract colors, apply dynamic mockups, and generate your showcase.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 bg-zinc-950/80 px-4 py-2 rounded-full border border-zinc-500/30">
              <IoSparklesOutline className="w-4 h-4" />
              <span>Multi-image bulk processing active</span>
            </div>
          </div>
        </div>
      )}

      {!isPreviewMode && <Sidebar />}
      
      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}

      {/* Main Workspace Area */}
      <main className={`flex-1 h-full overflow-hidden flex flex-col relative ${
        isDark ? 'bg-black' : 'bg-[#f8fafc]'
      }`}>
        {/* Top Navbar */}
        {!isPreviewMode && (
          <header className={`h-16 border-b flex items-center justify-between px-6 flex-shrink-0 z-20 transition-colors ${
            isDark 
              ? 'bg-zinc-950/90 backdrop-blur-md border-gray-800/80 text-gray-200' 
              : 'bg-white/90 backdrop-blur-md border-gray-200/80 text-gray-800'
          }`}>
          {/* Quick Jump Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-[65%] scrollbar-none items-center h-full">
            <IoGridOutline className={`w-4 h-4 mr-2 opacity-50 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            
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
              <IoAdd className="w-4 h-4" />
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
              {isDark ? <IoSunnyOutline className="w-4 h-4" /> : <IoMoonOutline className="w-4 h-4" />}
            </button>

            {/* View Mode Toggle */}
            <button
              onClick={() => updateGlobalSettings({ viewMode: globalSettings.viewMode === 'vertical' ? 'horizontal' : 'vertical' })}
              className={`p-2 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-gray-800/70 border-gray-700 text-zinc-300 hover:bg-gray-700' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-zinc-600 shadow-sm'
              }`}
              title={globalSettings.viewMode === 'vertical' ? "Switch to Horizontal View" : "Switch to Vertical View"}
            >
              {globalSettings.viewMode === 'vertical' ? <IoAlbumsOutline className="w-4 h-4" /> : <IoListOutline className="w-4 h-4" />}
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
                title={globalSettings.viewMode === 'vertical' ? "Scroll Up" : "Scroll Left"}
              >
                {globalSettings.viewMode === 'vertical' ? <IoChevronUp className="w-4 h-4" /> : <IoChevronBack className="w-4 h-4" />}
              </button>
              <div className={`w-px h-4 mx-0.5 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <button
                onClick={() => scrollByAmount(400)}
                className={`p-1.5 rounded-md transition-all ${
                  isDark 
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
                title={globalSettings.viewMode === 'vertical' ? "Scroll Down" : "Scroll Right"}
              >
                {globalSettings.viewMode === 'vertical' ? <IoChevronDown className="w-4 h-4" /> : <IoChevronForward className="w-4 h-4" />}
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
                <IoRemoveOutline className="w-4 h-4" />
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
                <IoAddOutline className="w-4 h-4" />
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
                <IoExpandOutline className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Top Toolbar Preview Button */}
            <button
              onClick={togglePreviewMode}
              className={`ml-2 px-4 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center shadow-sm ${
                isDark
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700'
                  : 'bg-black text-white hover:bg-zinc-800'
              }`}
            >
              <IoExpandOutline className="w-3.5 h-3.5 mr-1.5" />
              Preview Mode
            </button>
            
            <button
              disabled={canvases.length === 0}
              onClick={() => setShowExportModal(true)}
              className={`ml-3 px-4 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center shadow-md ${
                canvases.length === 0
                  ? 'bg-zinc-400 opacity-50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border border-blue-500/50'
              }`}
            >
              <IoDownloadOutline className="w-3.5 h-3.5 mr-1.5" />
              Export
            </button>
          </div>
          </header>
        )}

        {isPreviewMode && (
          <>
            <div className="absolute top-6 right-6 z-[100]">
              <button
                onClick={togglePreviewMode}
                className={`px-4 py-2 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 transition-all ${
                  isDark 
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                    : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                Exit Preview
              </button>
            </div>
            
            {/* Slideshow Nav */}
            <button
              onClick={() => scrollByAmount(globalSettings.viewMode === 'vertical' ? -window.innerHeight : -window.innerWidth)}
              className={`absolute z-[100] p-4 rounded-full bg-black/40 text-white hover:bg-black/80 transition-colors backdrop-blur-md ${
                globalSettings.viewMode === 'vertical'
                  ? 'top-24 left-1/2 -translate-x-1/2'
                  : 'left-6 top-1/2 -translate-y-1/2'
              }`}
            >
              {globalSettings.viewMode === 'vertical' ? <IoChevronUp className="w-8 h-8" /> : <IoChevronBack className="w-8 h-8" />}
            </button>
            <button
              onClick={() => scrollByAmount(globalSettings.viewMode === 'vertical' ? window.innerHeight : window.innerWidth)}
              className={`absolute z-[100] p-4 rounded-full bg-black/40 text-white hover:bg-black/80 transition-colors backdrop-blur-md ${
                globalSettings.viewMode === 'vertical'
                  ? 'bottom-6 left-1/2 -translate-x-1/2'
                  : 'right-6 top-1/2 -translate-y-1/2'
              }`}
            >
              {globalSettings.viewMode === 'vertical' ? <IoChevronDown className="w-8 h-8" /> : <IoChevronForward className="w-8 h-8" />}
            </button>
          </>
        )}

        {/* Scrollable Canvases Container */}
        <div 
          ref={scrollContainerRef}
          onWheel={handleWheel}
          className={`flex-1 overflow-x-auto overflow-y-auto flex scroll-smooth ${
            globalSettings.viewMode === 'vertical' ? 'flex-col items-center' : 'items-start'
          } ${
            isPreviewMode 
              ? `items-center justify-start pt-0 pb-0 gap-0 snap-mandatory ${globalSettings.viewMode === 'vertical' ? 'snap-y' : 'snap-x'}` 
              : 'pt-12 pb-32 px-12 gap-12'
          }`}
        >
          {canvases.map((canvas, index) => (
            <CanvasEditor 
              key={canvas.id} 
              canvas={canvas} 
              index={index} 
              total={canvases.length} 
              isPreviewMode={isPreviewMode}
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
              <IoAdd className="w-8 h-8" />
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
