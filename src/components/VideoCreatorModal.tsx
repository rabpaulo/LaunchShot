'use client';

import React, { useState } from 'react';
import { IoClose, IoFilmOutline } from 'react-icons/io5';
import { TargetSizeId, TARGET_SIZES } from '@/config/sizes';
import { useEditorStore } from '@/store/useEditorStore';
import { generateVideo } from '@/utils/videoGenerator';
import { saveAs } from 'file-saver';

interface VideoCreatorModalProps {
  onClose: () => void;
}

export function VideoCreatorModal({ onClose }: VideoCreatorModalProps) {
  const { canvases, globalSettings } = useEditorStore();
  const [selectedSize, setSelectedSize] = useState<TargetSizeId>(globalSettings.targetSize || 'ios-6.5');
  const [isExporting, setIsExporting] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  const isDark = globalSettings.theme !== 'light';

  const handleExport = async () => {
    setIsExporting(true);
    setProgressMessage('Starting...');
    setProgressPercent(0);
    
    try {
      const { blob, extension } = await generateVideo(canvases, selectedSize, (msg, percent) => {
        setProgressMessage(msg);
        setProgressPercent(percent);
      });
      saveAs(blob, `showcase-video.${extension}`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate video. Check console for details.');
    }
    
    setIsExporting(false);
    onClose();
  };

  const availableSizes = Object.values(TARGET_SIZES).filter(s => s.id.startsWith('ios')); // mostly we want phone sizes for videos

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
        isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          isDark ? 'border-zinc-800' : 'border-gray-200'
        }`}>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Create Showcase Video
            </h2>
            <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              Generate a Ken Burns animated video from your screenshots.
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
            <div className="text-center">
              <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Creating Video... {progressPercent}%
              </h3>
              <p className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                {progressMessage}
              </p>
            </div>
            <div className="w-full max-w-md h-2 bg-zinc-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-900 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                Video Resolution
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {availableSizes.map(size => {
                  const isSelected = selectedSize === size.id;
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
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
                })}
              </div>
            </div>
            
            <div className={`p-4 rounded-xl text-sm ${isDark ? 'bg-blue-900/20 text-blue-200 border border-blue-900/50' : 'bg-blue-50 text-blue-800 border border-blue-100'}`}>
              <strong>Note:</strong> The video will be generated directly in your browser. Wait for the download to start automatically. Browsers like Safari and recent Chrome versions will export <code>.mp4</code>, others may export <code>.webm</code>.
            </div>
          </div>
        )}

        {/* Footer */}
        {!isExporting && (
          <div className={`p-5 border-t flex items-center justify-end gap-3 ${
            isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-gray-200 bg-gray-50'
          }`}>
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
              disabled={canvases.length === 0}
              className={`px-6 py-2.5 rounded-xl font-bold text-white transition-all flex items-center gap-2 ${
                isDark ? 'bg-zinc-100 text-zinc-900 hover:bg-white' : 'bg-zinc-900 text-white hover:bg-black'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <IoFilmOutline className="w-5 h-5" />
              Generate Video
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
