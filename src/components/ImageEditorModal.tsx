import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { IoClose, IoColorWandOutline, IoCropOutline } from 'react-icons/io5';
import { CanvasItem, useEditorStore } from '@/store/useEditorStore';
import { TARGET_SIZES } from '@/config/sizes';

interface ImageEditorModalProps {
  canvas: CanvasItem;
  onClose: () => void;
}

export function ImageEditorModal({ canvas, onClose }: ImageEditorModalProps) {
  const updateCanvas = useEditorStore(s => s.updateCanvas);
  const globalSettings = useEditorStore(s => s.globalSettings);
  const sizeConfig = TARGET_SIZES[globalSettings.targetSize as keyof typeof TARGET_SIZES] || TARGET_SIZES['ios-6.5'];
  const phoneW = sizeConfig.width;
  const phoneH = sizeConfig.height;
  // calculate scale to fit the 800px max height of the modal
  const scale = Math.min(1, 600 / phoneH, 600 / phoneW);
  
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

  const onCropComplete = useCallback((_croppedArea: unknown, _croppedAreaPixels: unknown) => {
    // We don't necessarily need to save croppedAreaPixels unless we are actively cropping the image via canvas, 
    // but react-easy-crop handles everything via CSS transforms which html-to-image supports beautifully!
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden shadow-2xl h-[85vh]">
        
        {/* Cropper Area */}
        <div className="flex-1 bg-black min-h-[300px] flex items-center justify-center overflow-hidden p-8">
          <div style={{ width: phoneW, height: phoneH, transform: `scale(${scale})`, position: 'relative', backgroundColor: '#111' }}>
            {canvas.imageSrc && (
            <Cropper
              image={canvas.imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              style={{
                mediaStyle: {
                  filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%)`,
                  objectFit: canvas.imageFit === 'contain' || globalSettings.imageFit === 'contain' ? 'contain' : 'cover'
                }
              }}
            />
          )}
          </div>
        </div>

        {/* Controls */}
        <div className="w-full md:w-80 bg-zinc-900 border-l border-zinc-800 flex flex-col">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-white font-semibold">Edit Image</h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          <div className="flex border-b border-zinc-800">
            <button 
              onClick={() => setActiveTab('crop')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'crop' ? 'text-white border-b-2 border-indigo-500 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <IoCropOutline className="w-4 h-4" /> Transform
            </button>
            <button 
              onClick={() => setActiveTab('filters')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'filters' ? 'text-white border-b-2 border-indigo-500 bg-zinc-800/50' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <IoColorWandOutline className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeTab === 'crop' && (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Zoom</span>
                    <span className="text-zinc-200">{zoom.toFixed(2)}x</span>
                  </div>
                  <input 
                    type="range" min="1" max="5" step="0.1" 
                    value={zoom} onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Rotation</span>
                    <span className="text-zinc-200">{rotation}°</span>
                  </div>
                  <input 
                    type="range" min="-180" max="180" step="1" 
                    value={rotation} onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full accent-indigo-500"
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
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">{f.label}</span>
                      <span className="text-zinc-200">{filters[f.key as keyof typeof filters]}{f.unit}</span>
                    </div>
                    <input 
                      type="range" min={f.min} max={f.max} step="1" 
                      value={filters[f.key as keyof typeof filters]} 
                      onChange={(e) => setFilters(prev => ({ ...prev, [f.key]: Number(e.target.value) }))}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="p-4 border-t border-zinc-800 flex gap-3 bg-zinc-900/90">
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex-1"
            >
              Reset
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors flex-[2]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
