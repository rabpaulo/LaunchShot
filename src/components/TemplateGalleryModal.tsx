'use client';

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import {
  IoClose,
  IoColorPaletteOutline,
  IoSearchOutline,
} from 'react-icons/io5';
import { TEMPLATES, TemplateDefinition } from '@/config/templates';
import { CanvasItem, GlobalSettings, useEditorStore } from '@/store/useEditorStore';

interface ParsedTemplate {
  index: number;
  template: TemplateDefinition;
  name: string;
  style: string;
  category: string;
  canvases: CanvasItem[];
  settings: Partial<GlobalSettings>;
}

// Category definition for fast filtering
const CATEGORIES = [
  'All',
  'SaaS & AI',
  'Fintech & Finance',
  'Fitness & Health',
  'Lifestyle & Social',
  'Banner & Feature',
  'Minimal & Clean',
];

// Pre-parse templates once at module level so opening the modal takes 0ms
const PARSED_TEMPLATES: ParsedTemplate[] = TEMPLATES.map((template, index) => {
  let mockCanvases: CanvasItem[] = [];
  let mockSettings: Partial<GlobalSettings> = {};
  try {
    template.apply(
      (c) => { mockCanvases = c; },
      (s) => { mockSettings = s; }
    );
  } catch (err) {
    console.error('Error parsing template:', template.name, err);
  }

  return {
    index,
    template,
    name: template.name,
    style: template.style,
    category: template.category || 'Minimal & Clean',
    canvases: mockCanvases,
    settings: mockSettings,
  };
});

// Ultra-lightweight miniature screen card rendered with pure CSS (0ms runtime overhead, zero network requests)
const MiniScreenCard = React.memo(function MiniScreenCard({
  canvas,
  index,
  isDark,
  accentColor = '#3b82f6',
}: {
  canvas: CanvasItem;
  index: number;
  isDark: boolean;
  accentColor?: string;
}) {
  const isBottomLayout = canvas.layout?.includes('bottom');
  const isTiltRight = canvas.layout?.includes('tilt-right');
  const isTiltLeft = canvas.layout?.includes('tilt-left');
  const isHero = canvas.layout?.includes('hero');
  const isStack = canvas.layout?.includes('stack') || canvas.layout?.includes('triple');

  let phoneTransformClass = '';
  if (isTiltRight) phoneTransformClass = 'rotate-3 scale-[0.98] translate-y-1';
  else if (isTiltLeft) phoneTransformClass = '-rotate-3 scale-[0.98] translate-y-1';
  else if (isHero) phoneTransformClass = 'scale-[1.02] shadow-xl';
  else if (isStack) phoneTransformClass = 'scale-[0.95] translate-y-0.5';

  return (
    <div
      className="w-[84px] h-[154px] rounded-xl overflow-hidden flex flex-col justify-between p-1.5 flex-shrink-0 shadow-md border border-white/10 relative select-none transition-transform group-hover:scale-[1.02]"
      style={{
        background: canvas.backgroundColor || (isDark ? '#18181b' : '#f4f4f5'),
      }}
    >
      {/* Top Header Text (if not bottom-aligned) */}
      {!isBottomLayout && (
        <div className="z-10 text-center w-full px-0.5 space-y-0.5 mt-0.5">
          <div
            className="text-[7.5px] font-extrabold line-clamp-2 leading-[1.15] tracking-tight"
            style={{ color: canvas.textColor || '#ffffff' }}
          >
            {canvas.title || `Screen ${index + 1}`}
          </div>
          {canvas.subtitle && (
            <div
              className="text-[5.5px] font-medium line-clamp-1 opacity-70 leading-none"
              style={{ color: canvas.subtitleColor || canvas.textColor || '#ffffff' }}
            >
              {canvas.subtitle}
            </div>
          )}
        </div>
      )}

      {/* Mini Mockup Screen Container */}
      <div className={`flex-1 flex items-center justify-center my-0.5 relative ${phoneTransformClass}`}>
        <div className="w-[58px] h-[96px] rounded-[7px] bg-zinc-950 border border-white/20 shadow-lg p-[2px] flex flex-col overflow-hidden relative">
          {/* Simulated Notch / Dynamic Island */}
          <div className="w-3.5 h-[2px] rounded-full bg-black mx-auto mb-1 flex-shrink-0" />

          {/* Simulated App Wireframe UI */}
          <div className="flex-1 rounded-[4px] bg-zinc-900/90 p-1 flex flex-col justify-between overflow-hidden">
            {/* Header wire */}
            <div className="flex items-center justify-between">
              <div 
                className="w-3 h-1 rounded-full opacity-80"
                style={{ background: accentColor }}
              />
              <div className="w-2 h-1 rounded-full bg-white/15" />
            </div>

            {/* Central Content Cards */}
            <div className="space-y-1 my-auto">
              <div 
                className="w-full h-4 rounded-md border border-white/10 flex items-center px-1"
                style={{
                  background: `linear-gradient(90deg, ${accentColor}40 0%, ${accentColor}18 100%)`,
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full mr-1 flex-shrink-0"
                  style={{ background: accentColor }}
                />
                <div className="w-5 h-1 rounded bg-white/40" />
              </div>
              <div className="w-full h-2.5 rounded bg-white/5 border border-white/5 flex items-center px-1">
                <div className="w-6 h-0.5 rounded bg-white/20" />
              </div>
            </div>

            {/* Bottom Nav Wire */}
            <div className="flex items-center justify-around pt-0.5 border-t border-white/5">
              <div 
                className="w-1.5 h-1 rounded-full"
                style={{ background: accentColor }}
              />
              <div className="w-1.5 h-1 rounded-full bg-white/20" />
              <div className="w-1.5 h-1 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Header Text (if bottom-aligned) */}
      {isBottomLayout && (
        <div className="z-10 text-center w-full px-0.5 space-y-0.5 mb-0.5">
          <div
            className="text-[7.5px] font-extrabold line-clamp-2 leading-[1.15] tracking-tight"
            style={{ color: canvas.textColor || '#ffffff' }}
          >
            {canvas.title || `Screen ${index + 1}`}
          </div>
          {canvas.subtitle && (
            <div
              className="text-[5.5px] font-medium line-clamp-1 opacity-70 leading-none"
              style={{ color: canvas.subtitleColor || canvas.textColor || '#ffffff' }}
            >
              {canvas.subtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Template Card Container
const TemplateCard = React.memo(function TemplateCard({
  parsed,
  isDark,
  onSelect,
}: {
  parsed: ParsedTemplate;
  isDark: boolean;
  onSelect: () => void;
}) {
  const { name, category, canvases, template } = parsed;
  const { logo, style } = template;

  return (
    <div
      onClick={onSelect}
      className={`group cursor-pointer rounded-2xl border-2 transition-all duration-200 flex flex-col overflow-hidden shadow-sm hover:shadow-xl ${
        isDark
          ? 'border-gray-800 bg-gray-900/50 hover:border-blue-500 hover:bg-gray-800/80'
          : 'border-gray-200 bg-white hover:border-blue-500 hover:bg-gray-50'
      }`}
    >
      {/* Card Header with Unique Logo & Style Badge */}
      <div className={`px-4 py-3 border-b flex items-center justify-between gap-3 ${
        isDark ? 'border-gray-800/80 bg-zinc-900/60' : 'border-gray-100 bg-gray-50/70'
      }`}>
        <div className="flex items-center gap-3 min-w-0">
          {/* Unique Template Logo */}
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md flex-shrink-0 border border-white/15 bg-zinc-900 group-hover:scale-105 transition-transform">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={logo.svgDataUri} 
              alt={logo.appName} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col min-w-0">
            <h3 className={`font-bold text-sm leading-snug truncate group-hover:text-blue-400 transition-colors ${
              isDark ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {/* Unique Style Pill */}
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/25 whitespace-nowrap">
                {style}
              </span>
              <span className={`text-[10px] font-medium truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {category}
              </span>
            </div>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
          isDark
            ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
            : 'bg-zinc-100 border-zinc-200 text-zinc-600'
        }`}>
          {canvases.length} {canvases.length === 1 ? 'Screen' : 'Screens'}
        </span>
      </div>

      {/* Screen Sequence Preview Container */}
      <div className={`p-3.5 h-[190px] flex items-center overflow-x-auto scrollbar-none relative ${
        isDark ? 'bg-black/40' : 'bg-gray-100/60'
      }`}>
        <div className="flex items-center gap-2.5 mx-auto">
          {canvases.slice(0, 5).map((canvas, i) => (
            <MiniScreenCard
              key={canvas.id || i}
              canvas={canvas}
              index={i}
              isDark={isDark}
              accentColor={logo.accentColor}
            />
          ))}
          {canvases.length > 5 && (
            <div className={`w-8 h-[154px] rounded-xl border border-dashed flex items-center justify-center flex-shrink-0 ${
              isDark ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'
            }`}>
              <span className="text-[10px] font-bold">+{canvases.length - 5}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export function TemplateGalleryModal({ onClose }: { onClose: () => void }) {
  const { loadTemplate, updateGlobalSettings, globalSettings, setActiveTemplateIndex } = useEditorStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isDark = globalSettings.theme !== 'light';

  // Instant in-memory filtering by name, style, app name, and canvas copy
  const filteredTemplates = useMemo(() => {
    return PARSED_TEMPLATES.filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.style.toLowerCase().includes(q) ||
        item.template.logo.appName.toLowerCase().includes(q) ||
        item.canvases.some((c) =>
          (c.title || '').toLowerCase().includes(q)
        );
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150">
      <div className={`w-full max-w-[1100px] h-[88vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden border ${
        isDark ? 'bg-zinc-950 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        {/* Header */}
        <div className={`p-5 sm:p-6 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isDark ? 'border-gray-800 bg-zinc-950' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 flex-shrink-0">
              <IoColorPaletteOutline className="w-6 h-6" />
            </div>
            <div>
              <h2 className={`text-xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Template Gallery
              </h2>
              <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {PARSED_TEMPLATES.length} pre-designed layout sequences. Choose one to apply instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <IoSearchOutline className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs outline-none transition-all ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-white placeholder-zinc-500 focus:border-blue-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
                }`}
              />
            </div>

            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDark ? 'bg-zinc-900 hover:bg-zinc-800 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-black'
              }`}
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className={`px-6 py-2.5 border-b flex items-center gap-1.5 overflow-x-auto scrollbar-none ${
          isDark ? 'border-gray-800 bg-zinc-900/50' : 'border-gray-100 bg-gray-50/80'
        }`}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? isDark
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-blue-600 text-white shadow-sm'
                    : isDark
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-zinc-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Grid Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-inherit">
          {filteredTemplates.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <IoColorPaletteOutline className="w-12 h-12 text-gray-500 mb-3 opacity-40" />
              <p className={`text-base font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                No templates found
              </p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Try adjusting your search query or selecting another category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredTemplates.map((item) => (
                <TemplateCard
                  key={item.name}
                  parsed={item}
                  isDark={isDark}
                  onSelect={() => {
                    item.template.apply(loadTemplate, updateGlobalSettings);
                    setActiveTemplateIndex(item.index);
                    toast.success(`Applied ${item.name} template!`);
                    onClose();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
