'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { IoClose, IoDownloadOutline, IoGlobeOutline } from 'react-icons/io5';
import { TargetSizeId, TARGET_SIZES } from '@/config/sizes';
import { useEditorStore } from '@/store/useEditorStore';
import { exportImages } from '@/utils/export';
import { SUPPORTED_LANGUAGES } from '@/config/languages';

interface ExportModalProps {
  onClose: () => void;
}

export function ExportModal({ onClose }: ExportModalProps) {
  const { canvases, globalSettings } = useEditorStore();
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<('ios' | 'android')[]>(['ios', 'android']);
  const [activeDeviceTab, setActiveDeviceTab] = useState<'iPhone' | 'Samsung Galaxy' | 'Android' | 'Tablet' | 'Header'>('iPhone');
  
  // By default, select the current target size
  const [selectedSizes, setSelectedSizes] = useState<TargetSizeId[]>([globalSettings.targetSize]);
  
  // By default, select current active language
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([globalSettings.activeLanguage || 'en']);

  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const isDark = globalSettings.theme !== 'light';

  const toggleSize = (id: TargetSizeId) => {
    setSelectedSizes(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev => {
      if (prev.includes(code)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(c => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const selectAllLanguages = () => {
    setSelectedLanguages(SUPPORTED_LANGUAGES.map(l => l.code));
  };

  const selectCurrentLanguageOnly = () => {
    setSelectedLanguages([globalSettings.activeLanguage || 'en']);
  };

  const handleExport = async () => {
    if (selectedSizes.length === 0 || selectedLanguages.length === 0) return;
    setIsExporting(true);
    setProgress(5);
    
    try {
      await exportImages(canvases, selectedSizes, selectedLanguages, (pct) => {
        setProgress(pct);
      });
    } catch (err) {
      console.error(err);
    }
    
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 600);
  };

  const availableSizes = Object.values(TARGET_SIZES).filter(s => {
    if (s.category !== activeDeviceTab) return false;
    
    if (activeDeviceTab === 'iPhone') {
      return selectedPlatforms.includes('ios');
    }
    if (activeDeviceTab === 'Samsung Galaxy' || activeDeviceTab === 'Android') {
      return selectedPlatforms.includes('android');
    }
    
    return true;
  });

  const totalCombinations = selectedSizes.length * selectedLanguages.length;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
        isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isDark ? 'border-zinc-800' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Export screenshots
            </h2>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              Choose devices, platforms, and localized languages for high-resolution PNG export
            </p>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isExporting ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
            <div className="text-center">
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Exporting screenshots... {progress}%
              </h3>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                Rendering {totalCombinations} combination{totalCombinations === 1 ? '' : 's'} across {selectedLanguages.length} language{selectedLanguages.length === 1 ? '' : 's'}.
              </p>
            </div>
            <div className="w-full max-w-md h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-7 overflow-y-auto max-h-[70vh]">
            {/* Platforms */}
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                Platforms
              </h3>
              <div className="flex gap-3">
                {['ios', 'android'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => {
                      const p = platform as 'ios' | 'android';
                      setSelectedPlatforms(prev => {
                        let next: ('ios' | 'android')[];
                        if (prev.includes(p)) {
                          if (prev.length === 1) return prev;
                          next = prev.filter(item => item !== p);
                        } else {
                          next = [...prev, p];
                        }
                        if (next.length === 1) {
                          if (next[0] === 'ios' && (activeDeviceTab === 'Samsung Galaxy' || activeDeviceTab === 'Android')) {
                            setActiveDeviceTab('iPhone');
                          } else if (next[0] === 'android' && activeDeviceTab === 'iPhone') {
                            setActiveDeviceTab('Android');
                          }
                        }
                        return next;
                      });
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedPlatforms.includes(platform as "ios" | "android")
                        ? isDark
                          ? 'border-zinc-500 bg-zinc-800 text-white'
                          : 'border-black bg-gray-50 text-black'
                        : isDark
                          ? 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {platform === 'ios' ? 'iOS' : 'Android'}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages to Export */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IoGlobeOutline className="w-4 h-4 text-blue-500" />
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                    Languages & Localization ({selectedLanguages.length} selected)
                  </h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={selectCurrentLanguageOnly}
                    className={`text-[11px] font-semibold underline ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'}`}
                  >
                    Current Only
                  </button>
                  <span className={isDark ? 'text-zinc-700' : 'text-zinc-300'}>|</span>
                  <button
                    onClick={selectAllLanguages}
                    className={`text-[11px] font-semibold underline ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-black'}`}
                  >
                    All Languages
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 scrollbar-hide">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isSelected = selectedLanguages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      onClick={() => toggleLanguage(lang.code)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? isDark
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-blue-600 border-blue-600 text-white'
                          : isDark
                            ? 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:border-zinc-600'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className={`text-[10px] font-mono opacity-80 uppercase`}>
                        {lang.code}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Devices Tabs */}
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                Devices
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['iPhone', 'Samsung Galaxy', 'Android', 'Tablet', 'Header'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => {
                      const t = tab as 'iPhone' | 'Samsung Galaxy' | 'Android' | 'Tablet' | 'Header';
                      setActiveDeviceTab(t);
                      if (t === 'Samsung Galaxy' || t === 'Android') {
                        setSelectedPlatforms(prev => prev.includes('android') ? prev : [...prev, 'android']);
                      } else if (t === 'iPhone') {
                        setSelectedPlatforms(prev => prev.includes('ios') ? prev : [...prev, 'ios']);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap flex-shrink-0 ${
                      activeDeviceTab === tab
                        ? isDark
                          ? 'bg-zinc-800 text-white shadow-sm'
                          : 'bg-white text-black shadow-sm border border-gray-200'
                        : isDark
                          ? 'text-zinc-500 hover:text-zinc-300'
                          : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Display Sizes Grid */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                {availableSizes.length === 0 ? (
                  <div className={`col-span-2 p-6 text-center rounded-xl border border-dashed ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-gray-300 text-gray-500'}`}>
                    No display sizes available for the selected platforms.
                  </div>
                ) : (
                  availableSizes.map(size => {
                    const isSelected = selectedSizes.includes(size.id);
                    return (
                      <button
                        key={size.id}
                        onClick={() => toggleSize(size.id)}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? isDark
                              ? 'border-zinc-500 bg-zinc-800/50'
                              : 'border-black bg-gray-50'
                            : isDark
                              ? 'border-zinc-800 hover:border-zinc-700'
                              : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`font-bold mb-1 ${isDark ? 'text-white' : 'text-black'}`}>
                          {size.name}
                        </div>
                        <div className={`text-xs ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                          {size.logicalWidth * size.pixelRatio}x{size.logicalHeight * size.pixelRatio}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!isExporting && (
          <div className={`p-5 border-t flex items-center justify-between ${
            isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className={`text-sm font-semibold ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
              Total combinations: <span className={isDark ? 'text-white' : 'text-black'}>{totalCombinations} ({selectedSizes.length} sizes × {selectedLanguages.length} languages)</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className={`px-5 py-2.5 rounded-xl font-bold transition-colors ${
                  isDark 
                    ? 'text-zinc-300 hover:bg-zinc-800' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                disabled={selectedSizes.length === 0 || selectedLanguages.length === 0}
                className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${
                  isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-black'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <IoDownloadOutline className="w-5 h-5" />
                Export ZIP
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
