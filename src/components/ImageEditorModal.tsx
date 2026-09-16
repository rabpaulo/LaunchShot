import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Cropper from 'react-easy-crop';
import { IoClose, IoColorWandOutline, IoCropOutline } from 'react-icons/io5';
import { CanvasItem, useEditorStore } from '@/store/useEditorStore';
import { TARGET_SIZES } from '@/config/sizes';
import { resolveCanvasSize, resolveDeviceTarget, mediaPresentation, mediaAspectRatio } from '@/config/creation';

interface ImageEditorModalProps {
  canvas: CanvasItem;
  onClose: () => void;
}

export function ImageEditorModal({ canvas, onClose }: ImageEditorModalProps) {
  const updateCanvas = useEditorStore(s => s.updateCanvas);
  const globalSettings = useEditorStore(s => s.globalSettings);
  const sizeConfig = mediaPresentation(canvas) === 'image' ? resolveCanvasSize(canvas, globalSettings) : TARGET_SIZES[resolveDeviceTarget(canvas, globalSettings)];
  const phoneW = sizeConfig.logicalWidth;
  const phoneH = sizeConfig.logicalHeight;
  // calculate scale to fit the preview container in the modal
  const scale = Math.min(1, 550 / phoneH, 380 / phoneW);
  
  const [crop, setCrop] = useState(canvas.imageCrop || { x: 0, y: 0 });
  const [zoom, setZoom] = useState(canvas.imageZoom || 1);
  const [rotation, setRotation] = useState(canvas.imageRotation || 0);
  
  const [filters, setFilters] = useState(canvas.imageFilters || {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0
  });

  const [activeTab, setActiveTab] = useState<'crop' | 'filters'>('crop');

  const handleSave = () => {
    updateCanvas(canvas.id, {
      imageCrop: crop,
      imageZoom: zoom,
      imageRotation: rotation,
      imageFilters: filters
    });
    onClose();
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0
    });
  };

  const onCropComplete = useCallback(() => {
    // CSS transforms handle cropping rendering
  }, []);

  const isDark = globalSettings.theme !== 'light';

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className={`border-[1.5px] rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl h-[85vh] ${
        isDark ? 'bg-[#141c18] border-[#34443a] text-[#f3f6f4]' : 'bg-white border-[#c5cec2] text-[#14201d]'
      }`}>
        
        {/* Cropper Area */}
        <div className={`flex-1 min-h-[300px] flex items-center justify-center overflow-hidden p-8 ${
          isDark ? 'bg-[#090e0b]' : 'bg-[#e6ebe1]'
        }`}>
          <div style={{ width: phoneW, height: phoneH, transform: `scale(${scale})`, position: 'relative', backgroundColor: isDark ? '#111' : '#f0f0f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
            {canvas.imageSrc && (
            <Cropper
              image={canvas.imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={mediaAspectRatio(canvas, globalSettings)}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              style={{
                mediaStyle: {
                  filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%)`,
                  objectFit: (canvas.imageFit || globalSettings.imageFit) === 'contain' ? 'contain' : 'cover'
                }
              }}
            />
          )}
          </div>
        </div>

        {/* Controls */}
        <div className={`w-full md:w-80 border-l-[1.5px] flex flex-col ${
          isDark ? 'bg-[#141c18] border-[#34443a]' : 'bg-white border-[#c5cec2]'
        }`}>
          <div className={`p-4 border-b-[1.5px] flex items-center justify-between ${
            isDark ? 'border-[#34443a] bg-[#111814]' : 'border-[#c5cec2] bg-[#f8f9f5]'
          }`}>
            <div>
              <span className={`text-[10px] font-bold tracking-[1.5px] uppercase block ${
                isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'
              }`}>
                Adjust & Crop
              </span>
              <h3 className="font-bold text-base">Edit Image</h3>
            </div>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-xl border-[1.5px] transition-colors ${
                isDark ? 'border-[#44594c] hover:bg-[#283a2f] text-[#f3f6f4]' : 'border-[#b6c4b2] hover:bg-[#e7efe3] text-[#14201d]'
              }`}
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          <div className={`flex border-b-[1.5px] ${isDark ? 'border-[#34443a] bg-[#111814]/50' : 'border-[#c5cec2] bg-[#f8f9f5]/50'}`}>
            <button 
              onClick={() => setActiveTab('crop')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'crop'
                  ? isDark
                    ? 'text-white border-[#2e855c] bg-[#203828]/50'
                    : 'text-[#14201d] border-[#1f5c3f] bg-[#e8f1e2]/50'
                  : isDark
                    ? 'text-[#a3b2aa] border-transparent hover:text-white'
                    : 'text-[#4a5752] border-transparent hover:text-[#14201d]'
              }`}
            >
              <IoCropOutline className="w-4 h-4" /> Transform
            </button>
            <button 
              onClick={() => setActiveTab('filters')}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'filters'
                  ? isDark
                    ? 'text-white border-[#2e855c] bg-[#203828]/50'
                    : 'text-[#14201d] border-[#1f5c3f] bg-[#e8f1e2]/50'
                  : isDark
                    ? 'text-[#a3b2aa] border-transparent hover:text-white'
                    : 'text-[#4a5752] border-transparent hover:text-[#14201d]'
              }`}
            >
              <IoColorWandOutline className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === 'crop' && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}>Zoom</span>
                    <span className={isDark ? 'text-[#f3f6f4]' : 'text-[#14201d]'}>{zoom.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" step="0.1" 
                    value={zoom} onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[#1f5c3f] dark:accent-[#2e855c]"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className={isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}>Rotation</span>
                    <span className={isDark ? 'text-[#f3f6f4]' : 'text-[#14201d]'}>{rotation}°</span>
                  </div>
                  <input 
                    type="range" min="-180" max="180" step="1" 
                    value={rotation} onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-[#1f5c3f] dark:accent-[#2e855c]"
                  />
                </div>
              </>
            )}

            {activeTab === 'filters' && (
              <>
                {[
                  { label: 'Brightness', key: 'brightness', min: 0, max: 200, unit: '%' },
                  { label: 'Contrast', key: 'contrast', min: 0, max: 200, unit: '%' },
                  { label: 'Saturation', key: 'saturation', min: 0, max: 200, unit: '%' },
                  { label: 'Grayscale', key: 'grayscale', min: 0, max: 100, unit: '%' },
                  { label: 'Blur', key: 'blur', min: 0, max: 20, unit: 'px' },
                ].map((f) => (
                  <div key={f.key} className="space-y-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}>{f.label}</span>
                      <span className={isDark ? 'text-[#f3f6f4]' : 'text-[#14201d]'}>{filters[f.key as keyof typeof filters]}{f.unit}</span>
                    </div>
                    <input 
                      type="range" min={f.min} max={f.max} step="1" 
                      value={filters[f.key as keyof typeof filters]} 
                      onChange={(e) => setFilters(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                      className="w-full accent-[#1f5c3f] dark:accent-[#2e855c]"
                    />
                  </div>
                ))}
              </>
            )}
          </div>

          <div className={`p-4 border-t-[1.5px] flex gap-3 ${
            isDark ? 'border-[#34443a] bg-[#111814]' : 'border-[#c5cec2] bg-[#f8f9f5]'
          }`}>
            <button 
              onClick={handleReset}
              className={`px-4 py-2 text-xs font-bold rounded-xl border-[1.5px] transition-colors flex-1 ${
                isDark ? 'bg-[#1d2922] hover:bg-[#283a2f] border-[#44594c] text-[#f3f6f4]' : 'bg-white hover:bg-[#e7efe3] border-[#b6c4b2] text-[#14201d]'
              }`}
            >
              Reset
            </button>
            <button 
              onClick={handleSave}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex-[2] text-white shadow-sm ${
                isDark
                  ? 'bg-[#2e855c] hover:bg-[#38a16f] border border-[#2e855c]'
                  : 'bg-[#1f5c3f] hover:bg-[#16452f] border border-[#1f5c3f]'
              }`}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
