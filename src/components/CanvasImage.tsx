import React from 'react';
import Cropper from 'react-easy-crop';
import { CanvasItem, useEditorStore } from '@/store/useEditorStore';

interface CanvasImageProps {
  canvas: CanvasItem;
  className?: string;
}

export function CanvasImage({ canvas, className = '' }: CanvasImageProps) {
  const globalSettings = useEditorStore(s => s.globalSettings);
  
  if (!canvas.imageSrc) return null;

  const filters = canvas.imageFilters;
  const filterString = filters 
    ? `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) grayscale(${filters.grayscale}%)` 
    : 'none';

  const zoom = canvas.imageZoom || 1;
  const rotation = canvas.imageRotation || 0;
  const crop = canvas.imageCrop || { x: 0, y: 0 };
  
  // By using Cropper in read-only mode, we perfectly replicate the editor's pixel math!
  return (
    <div className={`w-full h-full relative ${className}`}>
      <Cropper
        image={canvas.imageSrc}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        onCropChange={() => {}}
        onZoomChange={() => {}}
        style={{
          containerStyle: { pointerEvents: 'none' }, // Disable interaction
          mediaStyle: {
            filter: filterString,
            objectFit: canvas.imageFit === 'contain' || globalSettings.imageFit === 'contain' ? 'contain' : 'cover'
          }
        }}
      />
    </div>
  );
}
