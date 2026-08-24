'use client';

import React, { useState } from 'react';
import { IoClose, IoDownloadOutline } from 'react-icons/io5';
import { TargetSizeId, TARGET_SIZES } from '@/config/sizes';
import { useEditorStore } from '@/store/useEditorStore';
import { exportImages } from '@/utils/export';

interface ExportModalProps {
  onClose: () => void;
}

export function ExportModal({ onClose }: ExportModalProps) {
  const { canvases, globalSettings } = useEditorStore();
  
  const [selectedPlatforms, setSelectedPlatforms] = useState<('ios' | 'android')[]>(['ios']);
  const [activeDeviceTab, setActiveDeviceTab] = useState<'iPhone' | 'Samsung Galaxy' | 'Android' | 'Tablet' | 'Header'>('iPhone');
  
  // By default, select the current target size
  const [selectedSizes, setSelectedSizes] = useState<TargetSizeId[]>([globalSettings.targetSize]);
  
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const isDark = globalSettings.theme !== 'light';

  const toggleSize = (id: TargetSizeId) => {
    setSelectedSizes(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleExport = async () => {
    if (selectedSizes.length === 0) return;
    setIsExporting(true);
    setProgress(10);
    
    // For now, we only export the current one due to DOM rendering constraints.
    // In a full implementation, we would render off-screen canvases for each size.
    try {
      await exportImages(canvases);
      setProgress(100);
    } catch (err) {
      console.error(err);
    }
    
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 500);
  };

  const availableSizes = Object.values(TARGET_SIZES).filter(s => {
    if (s.category !== activeDeviceTab) return false;
    
    // For specific platforms, filter out incompatible sizes
    if (activeDeviceTab === 'iPhone' || activeDeviceTab === 'Samsung Galaxy' || activeDeviceTab === 'Android') {
      if (selectedPlatforms.includes('ios') && !selectedPlatforms.includes('android')) {
        return s.id.startsWith('ios');
      }
      if (selectedPlatforms.includes('android') && !selectedPlatforms.includes('ios')) {
        return !s.id.startsWith('ios');
      }
    }
    
    // For Tablet and Header, always show them regardless of ios/android toggle 
    // (since they are universal or have specific names like ipad)
    return true;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
              Choose your export options
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
                Exporting... {progress}%
              </h3>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                Please wait while we render your screenshots. This may take a few moments.
              </p>
            </div>
            <div className="w-full max-w-md h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-900 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
            {/* Platforms */}
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                Platforms
              </h3>
              <div className="flex gap-3">
                {['ios', 'android'].map(platform => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatforms(prev => 
                      prev.includes(platform as any) 
                        ? prev.filter(p => p !== platform) 
                        : [...prev, platform as any]
                    )}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold flex items-center justify-center gap-2 transition-all ${
                      selectedPlatforms.includes(platform as any)
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

            {/* Devices Tabs */}
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                Devices
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['iPhone', 'Samsung Galaxy', 'Android', 'Tablet', 'Header'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveDeviceTab(tab as any)}
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
              Total combinations: <span className={isDark ? 'text-white' : 'text-black'}>{selectedSizes.length}</span>
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
                disabled={selectedSizes.length === 0}
                className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${
                  isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-black'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <IoDownloadOutline className="w-5 h-5" />
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
