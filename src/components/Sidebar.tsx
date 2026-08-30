'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '@/store/useEditorStore';
import {
  IoAddCircleOutline,
  IoDownloadOutline,
  IoCloudUploadOutline,
  IoPhonePortraitOutline,
  IoImageOutline,
  IoCheckmark,
  IoTrashOutline,
  IoSparklesOutline,
  IoChevronBack,
  IoChevronForward,
  IoGlobeOutline,
  IoBrushOutline
} from 'react-icons/io5';
import { processUploadedFiles } from '@/utils/imageProcessor';
import { TARGET_SIZES, TargetSizeId } from '@/config/sizes';
import { FONT_OPTIONS } from '@/config/fonts';
import { BACKGROUND_PRESETS } from '@/config/backgrounds';
import { DOODLE_PRESETS, DOODLE_COLOR_PALETTE } from '@/config/doodles';

import { ExportModal } from './ExportModal';
import { TranslationModal } from './TranslationModal';
import { CustomDropdown } from './ui/CustomDropdown';
import { TEMPLATES } from '@/config/templates';
import { NICHE_CATEGORIES_LIST, generateTemplateForNiche } from '@/config/niches';
import { ASO_TONE_OPTIONS, AsoTone, applyAsoCopy } from '@/config/aso';
import { SUPPORTED_LANGUAGES, getLanguageName } from '@/config/languages';
import {
  exportSingleLanguageJson,
  parseUploadedTranslationJson,
  batchTranslateCanvases
} from '@/utils/translator';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(340);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedNicheCategory, setSelectedNicheCategory] = useState<string>('ai');
  const [selectedAsoTone, setSelectedAsoTone] = useState<AsoTone>('high-converting');
  const [nicheQuery, setNicheQuery] = useState('');
  const [asoDescription, setAsoDescription] = useState('');


  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        let newWidth = e.clientX;
        if (newWidth < 280) newWidth = 280;
        if (newWidth > 700) newWidth = 700;
        setSidebarWidth(newWidth);
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);
  

  const { 
    globalSettings, 
    updateGlobalSettings, 
    addCanvas, 
    canvases,
    applyBackgroundToAll,
    applyFontToAll,
    applyDoodlesToAll,
    applyDoodleColorToAll,
    toggleDoodlesOnAll,
    clearAllCanvases,
    setIsDraggingGlobal,
    activeTemplateIndex,
    setActiveTemplateIndex
  } = useEditorStore(useShallow((state) => ({
    globalSettings: state.globalSettings,
    updateGlobalSettings: state.updateGlobalSettings,
    addCanvas: state.addCanvas,
    canvases: state.canvases,
    applyBackgroundToAll: state.applyBackgroundToAll,
    applyFontToAll: state.applyFontToAll,
    applyDoodlesToAll: state.applyDoodlesToAll,
    applyDoodleColorToAll: state.applyDoodleColorToAll,
    toggleDoodlesOnAll: state.toggleDoodlesOnAll,
    clearAllCanvases: state.clearAllCanvases,
    setIsDraggingGlobal: state.setIsDraggingGlobal,
    activeTemplateIndex: state.activeTemplateIndex,
    setActiveTemplateIndex: state.setActiveTemplateIndex
  })));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedBg, setSelectedBg] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [isQuickTranslating, setIsQuickTranslating] = useState(false);

  const isDark = globalSettings.theme !== 'light';

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    try {
      await processUploadedFiles(Array.from(files), () => {});
      toast.success(files.length === 1 ? "Screenshot uploaded!" : `${files.length} screenshots uploaded!`);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 500); // short delay for visual completion
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
    setIsDraggingGlobal(false);
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
    <div 
      style={{ width: isCollapsed ? 0 : sidebarWidth }}
      className={`h-screen border-r flex flex-col flex-shrink-0 z-50 relative ${
        !isResizing ? 'transition-all duration-300 ease-in-out' : ''
      } ${
        isCollapsed ? 'border-transparent' : ''
      } ${
        isDark ? 'bg-black border-gray-800/80 text-gray-200' : 'bg-white border-gray-200/80 text-gray-800 shadow-sm'
      }`}
    >
      {/* Resizer Handle */}
      {!isCollapsed && (
        <div
          onMouseDown={startResizing}
          className="absolute right-0 top-0 w-1.5 h-full cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500 z-40 transition-colors"
        />
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute -right-3 top-6 w-6 h-6 rounded-full border flex items-center justify-center z-50 transition-colors shadow-sm ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700' 
            : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
      >
        {isCollapsed ? <IoChevronForward className="w-3 h-3" /> : <IoChevronBack className="w-3 h-3" />}
      </button>

      {/* Inner Content */}
      <div className={`flex-1 overflow-hidden ${!isResizing ? 'transition-opacity duration-200' : ''} ${
        isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div 
          style={{ width: sidebarWidth }}
          className="p-6 h-full overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700"
        >
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-zinc-500 to-zinc-700 rounded-xl text-white shadow-lg shadow-zinc-500/20">
            <IoPhonePortraitOutline className="w-5 h-5" />
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
              <IoCloudUploadOutline className="w-6 h-6" />
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
              <IoImageOutline className="w-3.5 h-3.5" />
              <span>Auto Magic Color applied</span>
            </div>
          </div>
        </section>

        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* App Icon Upload Zone */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              App Icon
            </h2>
          </div>
          
          <input
            type="file"
            id="app-icon-upload"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                useEditorStore.getState().applyAppIconToAll(url);
                toast.success("App Icon added!");
              }
            }}
            accept="image/*"
            className="hidden"
          />

          <div className="flex gap-2">
            <button
              onClick={() => document.getElementById('app-icon-upload')?.click()}
              className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-zinc-800/80 border-zinc-700 text-white hover:bg-zinc-700'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <IoImageOutline className="w-4 h-4" />
              Upload App Icon
            </button>
            <button
              onClick={() => {
                useEditorStore.getState().removeAppIconFromAll();
                toast.success("App Icon removed!");
              }}
              className={`p-2.5 rounded-xl border transition-all hover:scale-[1.02] ${
                isDark
                  ? 'bg-zinc-800/80 border-zinc-700 text-red-400 hover:bg-red-950/50 hover:border-red-900/50'
                  : 'bg-zinc-50 border-zinc-200 text-red-500 hover:bg-red-50 hover:border-red-200'
              }`}
              title="Remove App Icon"
            >
              <IoTrashOutline className="w-4 h-4" />
            </button>
          </div>
        </section>

        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Templates */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Templates
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            <CustomDropdown
              value={activeTemplateIndex}
              onChange={(val) => setActiveTemplateIndex(Number(val))}
              options={TEMPLATES.map((t, idx) => ({ label: t.name, value: idx }))}
              isDark={isDark}
            />
            <button
              onClick={() => {
                const { loadTemplate, updateGlobalSettings } = useEditorStore.getState();
                const template = TEMPLATES[activeTemplateIndex];
                if (template) {
                  template.apply(loadTemplate, updateGlobalSettings);
                }
              }}
              className={`w-full py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                isDark
                  ? 'bg-blue-900/40 border-blue-500/50 text-blue-100 hover:bg-blue-800/50'
                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Load Selected Template
            </button>
          </div>
        </section>

        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Niche Template Generator */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Auto-Generate by Niche
            </h2>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
              isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
            }`}>
              30+ Categories
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* Category Dropdown */}
            <div className="space-y-1">
              <label className={`block text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Niche Category:
              </label>
              <CustomDropdown
                value={selectedNicheCategory}
                onChange={(val) => setSelectedNicheCategory(String(val))}
                options={NICHE_CATEGORIES_LIST.map((cat) => ({ label: cat.name, value: cat.id }))}
                isDark={isDark}
              />
            </div>

            <button
              onClick={() => {
                const cat = NICHE_CATEGORIES_LIST.find(c => c.id === selectedNicheCategory);
                const query = cat ? cat.query : selectedNicheCategory;
                const { loadTemplate, updateGlobalSettings } = useEditorStore.getState();
                const { canvases, globalOverrides, matchedNicheName } = generateTemplateForNiche(query);
                loadTemplate(canvases);
                updateGlobalSettings(globalOverrides);
                toast.success(`Loaded ${matchedNicheName} template!`);
              }}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all hover:scale-[1.02] ${
                isDark
                  ? 'bg-zinc-800/80 border-zinc-700 text-white hover:bg-zinc-700'
                  : 'bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800'
              }`}
            >
              Generate Niche Template
            </button>

            {/* Custom Search Input */}
            <div className="mt-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/60 flex flex-col gap-1.5">
              <label className={`block text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Or Custom Keywords:
              </label>
              <input
                type="text"
                id="niche-input"
                value={nicheQuery}
                onChange={(e) => setNicheQuery(e.target.value)}
                placeholder="e.g. crypto, baby, vpn, fasting..."
                className={`w-full border rounded-xl shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-xs transition-colors ${
                  isDark 
                    ? 'bg-gray-900/60 border-gray-700/80 text-gray-200 placeholder-gray-500' 
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && nicheQuery.trim()) {
                    const { loadTemplate, updateGlobalSettings } = useEditorStore.getState();
                    const { canvases, globalOverrides, matchedNicheName } = generateTemplateForNiche(nicheQuery);
                    loadTemplate(canvases);
                    updateGlobalSettings(globalOverrides);
                    toast.success(`Loaded ${matchedNicheName} template!`);
                  }
                }}
              />
              {nicheQuery.trim() && (
                <button
                  onClick={() => {
                    const { loadTemplate, updateGlobalSettings } = useEditorStore.getState();
                    const { canvases, globalOverrides, matchedNicheName } = generateTemplateForNiche(nicheQuery);
                    loadTemplate(canvases);
                    updateGlobalSettings(globalOverrides);
                    toast.success(`Loaded ${matchedNicheName} template!`);
                  }}
                  className={`w-full py-1.5 px-3 rounded-lg border text-xs font-medium transition-all ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  Generate from Search
                </button>
              )}
            </div>

            {/* Smart ASO Copywriter */}
            <div className="mt-4 border-t border-dashed pt-4 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Smart ASO Copywriter
                </h2>
              </div>

              {/* Tone of Voice Selector */}
              <div className="mb-2">
                <label className={`block text-[11px] font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Copywriting Persona & Tone:
                </label>
                <CustomDropdown
                  value={selectedAsoTone}
                  onChange={(val) => setSelectedAsoTone(val as AsoTone)}
                  options={ASO_TONE_OPTIONS.map(tone => ({ label: tone.name, value: tone.id }))}
                  isDark={isDark}
                />
              </div>

              <input
                type="text"
                id="aso-desc-input"
                value={asoDescription}
                onChange={(e) => setAsoDescription(e.target.value)}
                placeholder="Optional: App description (e.g. sleep tracker for insomnia)"
                className={`w-full mb-2 border rounded-xl shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs transition-colors ${
                  isDark 
                    ? 'bg-gray-900/60 border-gray-700/80 text-gray-200 placeholder-gray-500' 
                    : 'bg-white border-gray-200 text-gray-800 placeholder-gray-400'
                }`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const { canvases, loadTemplate } = useEditorStore.getState();
                    if (canvases.length === 0) {
                      toast.error("Add or load screenshots first!");
                      return;
                    }
                    const updated = applyAsoCopy(canvases, asoDescription, selectedAsoTone);
                    loadTemplate(updated);
                    toast.success("Applied ASO copy & badges!");
                  }
                }}
              />
              <button
                onClick={() => {
                  const { canvases, loadTemplate } = useEditorStore.getState();
                  if (canvases.length === 0) {
                    toast.error("Add or load screenshots first!");
                    return;
                  }
                  const updated = applyAsoCopy(canvases, asoDescription, selectedAsoTone);
                  loadTemplate(updated);
                  toast.success("Applied ASO copy & badges!");
                }}
                className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-blue-900/40 border-blue-500/50 text-blue-100 hover:bg-blue-800/50'
                    : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <IoSparklesOutline className="w-4 h-4 text-blue-400" />
                Apply ASO Copy & Badges
              </button>
            </div>
          </div>
        </section>



        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Translations */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Translations & Localization
            </h2>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              isDark ? 'bg-zinc-800 text-blue-400' : 'bg-blue-50 text-blue-700'
            }`}>
              {(globalSettings.activeLanguage || 'en').toUpperCase()}
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Active Language Dropdown */}
            <div>
              <label className={`block text-[11px] font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Canvas Language:
              </label>
              <CustomDropdown
                value={globalSettings.activeLanguage || 'en'}
                onChange={(val) => {
                  const langCode = String(val);
                  const { setActiveLanguage } = useEditorStore.getState();
                  setActiveLanguage(langCode);
                  toast.success(`Switched canvas to ${getLanguageName(langCode)}`);
                }}
                options={SUPPORTED_LANGUAGES.map(l => ({ label: `${l.name} (${l.nativeName})`, value: l.code }))}
                isDark={isDark}
              />
            </div>

            {/* Manage & Translate Copy Button */}
            <button
              onClick={() => setShowTranslationModal(true)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-sm ${
                isDark
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-200 hover:bg-blue-600/30'
                  : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              }`}
            >
              <IoGlobeOutline className="w-4 h-4 text-blue-400" />
              Manage All Translations
            </button>

            {/* Quick Auto-Translate to Active Language */}
            {globalSettings.activeLanguage && globalSettings.activeLanguage !== 'en' && (
              <button
                disabled={isQuickTranslating || canvases.length === 0}
                onClick={async () => {
                  if (canvases.length === 0) return;
                  setIsQuickTranslating(true);
                  try {
                    const targetLang = globalSettings.activeLanguage || 'es';
                    const results = await batchTranslateCanvases(canvases, targetLang);
                    const { applyTranslationsForLanguage } = useEditorStore.getState();
                    applyTranslationsForLanguage(targetLang, results);
                    toast.success(`Auto-translated to ${getLanguageName(targetLang)}!`);
                  } catch {
                    toast.error('Translation failed.');
                  } finally {
                    setIsQuickTranslating(false);
                  }
                }}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                } disabled:opacity-50`}
              >
                <IoSparklesOutline className="w-3.5 h-3.5 text-blue-400" />
                {isQuickTranslating ? 'Translating...' : `Auto-Translate to ${(globalSettings.activeLanguage || '').toUpperCase()}`}
              </button>
            )}

            {/* JSON Import & Export Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <input
                type="file"
                id="translation-upload"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const text = await file.text();
                      const result = parseUploadedTranslationJson(text);
                      const { canvases, updateCanvas, applyAllTranslations } = useEditorStore.getState();
                      
                      if (result.type === 'single') {
                        result.data.forEach((item, index: number) => {
                          if (canvases[index]) {
                            updateCanvas(canvases[index].id, {
                              title: item.title || canvases[index].title,
                              subtitle: item.subtitle || canvases[index].subtitle,
                            });
                          }
                        });
                        toast.success("Translations applied!");
                      } else if (result.type === 'multi') {
                        applyAllTranslations(result.data);
                        toast.success("Multi-language translations applied!");
                      }
                    } catch (err: unknown) {
                      toast.error(err instanceof Error ? err.message : "Failed to parse JSON file.");
                    }
                  }
                  if (e.target) e.target.value = '';
                }}
                accept=".json"
                className="hidden"
              />

              <button
                onClick={() => document.getElementById('translation-upload')?.click()}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <IoCloudUploadOutline className="w-3.5 h-3.5" />
                Import JSON
              </button>

              <button
                onClick={() => {
                  const currentLang = globalSettings.activeLanguage || 'en';
                  exportSingleLanguageJson(canvases, currentLang, globalSettings.appName || 'app');
                  toast.success(`Exported ${currentLang.toUpperCase()} JSON!`);
                }}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <IoDownloadOutline className="w-3.5 h-3.5" />
                Export JSON
              </button>
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
            <CustomDropdown
              value={globalSettings.targetSize || 'ios-6.5'}
              onChange={(val) => updateGlobalSettings({ targetSize: val as TargetSizeId })}
              options={Object.entries(groupedSizes).flatMap(([category, sizes]) => 
                sizes.map(s => ({ label: s.name, value: s.id, category }))
              )}
              isDark={isDark}
            />

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
          <div className={`flex flex-wrap gap-1 p-1 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}>
            {['dark', 'light', 'glass', 'clay-dark', 'clay-light'].map((style) => (
              <button
                key={style}
                onClick={() => updateGlobalSettings({ mockupStyle: style as import('@/store/useEditorStore').MockupStyle })}
                className={`flex-1 min-w-[30%] py-1.5 px-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                  globalSettings.mockupStyle === style
                    ? isDark 
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                      : 'bg-white text-gray-900 shadow-sm'
                    : isDark 
                      ? 'text-gray-500 hover:text-gray-300' 
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {style.replace('-', ' ')}
              </button>
            ))}
          </div>
        </section>

        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Hand-Drawn Doodle Accents */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              <IoBrushOutline className="w-3.5 h-3.5 text-yellow-400" />
              Doodle Accents
            </h2>
            <button
              type="button"
              onClick={() => {
                const anyEnabled = canvases.some(c => c.doodle?.enabled);
                toggleDoodlesOnAll(!anyEnabled);
                toast.success(!anyEnabled ? "Enabled doodles on all screens!" : "Disabled doodles on all screens!");
              }}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                canvases.some(c => c.doodle?.enabled) ? (isDark ? 'bg-yellow-500' : 'bg-yellow-500') : (isDark ? 'bg-gray-700' : 'bg-gray-300')
              }`}
              title="Toggle Doodles on all screens"
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                canvases.some(c => c.doodle?.enabled) ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </button>
          </div>

          <div className="space-y-3">
            {/* Quick Toggle All */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toggleDoodlesOnAll(true);
                  toast.success("Enabled doodles on all screens!");
                }}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  isDark
                    ? 'bg-yellow-950/40 border-yellow-500/40 text-yellow-300 hover:bg-yellow-900/40'
                    : 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100'
                }`}
              >
                Enable on All
              </button>
              <button
                onClick={() => {
                  toggleDoodlesOnAll(false);
                  toast.success("Disabled doodles on all screens!");
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  isDark
                    ? 'bg-gray-800/80 border-gray-700 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Turn Off
              </button>
            </div>

            {/* Global Doodle Color Palette */}
            <div>
              <label className={`block text-[11px] font-medium mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Global Accent Color:
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {DOODLE_COLOR_PALETTE.map((pal) => (
                  <button
                    key={pal.value}
                    onClick={() => {
                      applyDoodleColorToAll(pal.value);
                      toast.success(`Applied ${pal.name} to all doodles!`);
                    }}
                    className="w-5 h-5 rounded-full border shadow-sm transition-transform hover:scale-125 border-black/20"
                    style={{ backgroundColor: pal.value }}
                    title={`Apply ${pal.name} to all screens`}
                  />
                ))}
                <input
                  type="color"
                  defaultValue="#facc15"
                  onChange={(e) => {
                    applyDoodleColorToAll(e.target.value);
                  }}
                  className="w-5 h-5 rounded-full border-0 cursor-pointer p-0 shadow-sm ml-1"
                  title="Custom Accent Color for All"
                />
              </div>
            </div>

            {/* Apply Preset Style to All */}
            <div className="space-y-1">
              <label className={`block text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Apply Preset to All Screens:
              </label>
              <CustomDropdown
                value=""
                placeholder="Choose Doodle Style Preset..."
                onChange={(val) => {
                  const preset = DOODLE_PRESETS.find(p => p.id === String(val));
                  if (preset) {
                    applyDoodlesToAll({ ...preset.config, enabled: true });
                    toast.success(`Applied ${preset.label} to all screens!`);
                  }
                }}
                options={DOODLE_PRESETS.map(p => ({ label: p.label, value: p.id }))}
                isDark={isDark}
              />
            </div>
          </div>
        </section>

        <div className={`w-full h-px ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

        {/* Screenshot Fit */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Screenshot Fit
            </h2>
          </div>
          <div className={`flex gap-1 p-1 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}>
            {['cover', 'contain'].map((fit) => (
              <button
                key={fit}
                onClick={() => updateGlobalSettings({ imageFit: fit as 'cover' | 'contain' })}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                  (globalSettings.imageFit || 'cover') === fit
                    ? isDark 
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm' 
                      : 'bg-white text-gray-900 shadow-sm'
                    : isDark 
                      ? 'text-gray-500 hover:text-gray-300' 
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {fit}
              </button>
            ))}
          </div>
        </section>

        {/* Phone Settings */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className={`text-[10px] font-bold uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Phone Settings
            </h2>
          </div>
          <button 
            type="button"
            onClick={() => updateGlobalSettings({ showNotch: !globalSettings.showNotch })}
            className={`w-full flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
              isDark 
                ? 'bg-gray-800/40 border-gray-700/60 hover:bg-gray-800/80' 
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Show Camera Hole
            </span>
            <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              globalSettings.showNotch ? (isDark ? 'bg-zinc-500' : 'bg-zinc-900') : (isDark ? 'bg-gray-700' : 'bg-gray-300')
            }`}>
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                globalSettings.showNotch ? 'translate-x-5' : 'translate-x-1'
              }`} />
            </div>
          </button>
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

          <CustomDropdown
            value={globalSettings.fontFamily || 'plus-jakarta'}
            onChange={(val) => handleFontChange(String(val))}
            options={FONT_OPTIONS.map(font => ({ 
              label: font.name, 
              value: font.id, 
              category: font.category,
              fontFamily: font.fontFamily 
            }))}
            isDark={isDark}
          />
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
                    <IoCheckmark className={`w-4 h-4 ${preset.textColor === '#0f172a' ? 'text-gray-900' : 'text-white drop-shadow-md'}`} />
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
            <IoTrashOutline className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => addCanvas()}
            className={`flex-1 flex items-center justify-center py-2.5 px-4 border rounded-xl shadow-sm text-xs font-bold transition-all hover:scale-[1.02] ${
              isDark
                ? 'border-gray-700 bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
                : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            <IoAddCircleOutline className="w-4 h-4 mr-2 opacity-70" />
            Add Blank
          </button>
        </div>

        <button
          onClick={() => useEditorStore.getState().togglePreviewMode()}
          className={`w-full mb-3 flex items-center justify-center py-2.5 px-4 border rounded-xl shadow-sm text-xs font-bold transition-all hover:scale-[1.02] ${
            isDark
              ? 'border-gray-700 bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
              : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md'
          }`}
        >
          <svg className="w-4 h-4 mr-2 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Enter Preview Mode
        </button>
        
        <button
          disabled={canvases.length === 0}
          onClick={() => setShowExportModal(true)}
          className={`w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-lg shadow-zinc-600/30 text-xs font-extrabold transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 ${
            canvases.length === 0 
              ? 'bg-zinc-400 opacity-50 cursor-not-allowed' 
              : (isDark ? 'bg-white text-zinc-900 hover:bg-gray-100' : 'bg-zinc-900 text-white hover:bg-zinc-800')
          }`}
        >
          <IoDownloadOutline className="w-4 h-4 mr-2" />
          Export All ({canvases.length})
        </button>
      </div>
      </div>
      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
      {showTranslationModal && <TranslationModal onClose={() => setShowTranslationModal(false)} />}
      
      {/* Invisible overlay while resizing to capture global mouse events */}
      {isResizing && (
        <div className="fixed inset-0 z-40 cursor-col-resize" />
      )}
    </div>
  );
}
