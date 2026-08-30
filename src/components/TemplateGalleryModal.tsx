'use client';

import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { IoClose, IoColorPaletteOutline } from 'react-icons/io5';
import { TEMPLATES, TemplateDefinition } from '@/config/templates';
import { CanvasItem, GlobalSettings, useEditorStore } from '@/store/useEditorStore';
import { CanvasEditor } from './CanvasEditor';

interface TemplatePreviewProps {
  template: TemplateDefinition;
  isDark: boolean;
  onSelect: () => void;
}

const getTemplateImage = (name: string) => {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('fitness') || nameLower.includes('health') || nameLower.includes('stacked') || nameLower.includes('triple')) {
    // Fitness/Health
    return 'https://images.unsplash.com/photo-1526506456079-6617a216db8a?w=300&h=600&fit=crop';
  }
  if (nameLower.includes('fintech') || nameLower.includes('neoncard')) {
    // Finance
    return 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=600&fit=crop';
  }
  if (nameLower.includes('productivity') || nameLower.includes('bento') || nameLower.includes('hero 3d')) {
    // Productivity
    return 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=600&fit=crop';
  }
  if (nameLower.includes('social') || nameLower.includes('lifestyle') || nameLower.includes('story') || nameLower.includes('aesthetic')) {
    // Social / Lifestyle
    return 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&h=600&fit=crop';
  }
  if (nameLower.includes('ai') || nameLower.includes('copilot') || nameLower.includes('cyberpunk') || nameLower.includes('duotone')) {
    // AI / Tech / Cyberpunk
    return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=300&h=600&fit=crop';
  }
  if (nameLower.includes('saas') || nameLower.includes('cloud') || nameLower.includes('overlap')) {
    // Dashboards / SaaS
    return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=600&fit=crop';
  }
  if (nameLower.includes('minimalist') || nameLower.includes('white') || nameLower.includes('basic')) {
    // Minimal
    return 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&h=600&fit=crop';
  }
  if (nameLower.includes('playful') || nameLower.includes('glassmorphism') || nameLower.includes('sunset')) {
    // Colorful
    return 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=300&h=600&fit=crop';
  }
  if (nameLower.includes('dark') || nameLower.includes('contrast')) {
    // Dark mode
    return 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=300&h=600&fit=crop';
  }

  // Default / Generic
  return 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=300&h=600&fit=crop';
};

function TemplatePreview({ template, isDark, onSelect }: TemplatePreviewProps) {
  const { canvases } = useMemo(() => {
    let mockCanvases: CanvasItem[] = [];
    let mockSettings: Partial<GlobalSettings> = {};
    template.apply(
      (c) => { mockCanvases = c; },
      (s) => { mockSettings = s; }
    );
    return { canvases: mockCanvases, settings: mockSettings };
  }, [template]);

  return (
    <div 
      onClick={onSelect}
      className={`group cursor-pointer rounded-2xl border-2 transition-all duration-300 flex flex-col overflow-hidden ${
        isDark 
          ? 'border-gray-800 bg-gray-900/40 hover:border-blue-500 hover:bg-gray-800/80' 
          : 'border-gray-200 bg-gray-50 hover:border-blue-500 hover:bg-gray-100'
      }`}
    >
      <div className="p-4 border-b border-inherit flex items-center justify-between bg-inherit">
        <h3 className={`font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
          {template.name}
        </h3>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${
          isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
        }`}>
          {canvases.length} Screens
        </span>
      </div>
      
      {/* Preview Container */}
      <div className={`p-4 h-[240px] flex items-center justify-center overflow-hidden relative ${
        isDark ? 'bg-black/50' : 'bg-gray-200/50'
      }`}>
        <div className="flex items-center gap-2 pointer-events-none transform scale-[0.8] origin-center transition-transform group-hover:scale-[0.85]">
          {canvases.slice(0, 4).map((canvas, i) => (
            <div key={canvas.id} className="relative">
              <CanvasEditor 
                canvas={{...canvas, imageSrc: getTemplateImage(template.name)}} 
                index={i} 
                total={canvases.length} 
                targetWidth={120} 
              />
            </div>
          ))}
          {canvases.length > 4 && (
            <div className={`absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-${isDark ? 'gray-900' : 'gray-200'} to-transparent z-10 flex items-center justify-end pr-2`}>
              <span className="text-xs font-bold opacity-50">+{canvases.length - 4}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TemplateGalleryModal({ onClose }: { onClose: () => void }) {
  const { loadTemplate, updateGlobalSettings, globalSettings, setActiveTemplateIndex } = useEditorStore();
  const isDark = globalSettings.theme !== 'light';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 sm:p-10 animate-in fade-in duration-200">
      <div className={`w-full max-w-[90vw] h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden ${
        isDark ? 'bg-zinc-950 border border-white/10' : 'bg-white border border-black/10'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20">
              <IoColorPaletteOutline className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Template Gallery
              </h2>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Choose a pre-designed layout sequence for your screenshots.
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={`p-2.5 rounded-full transition-colors ${
              isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black'
            }`}
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        {/* Grid Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-inherit">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {TEMPLATES.map((template, index) => (
              <TemplatePreview 
                key={template.name} 
                template={template} 
                isDark={isDark}
                onSelect={() => {
                  template.apply(loadTemplate, updateGlobalSettings);
                  setActiveTemplateIndex(index);
                  toast.success(`Applied ${template.name} template!`);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
