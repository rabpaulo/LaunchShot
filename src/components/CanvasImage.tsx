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
  const hasTransform = zoom !== 1 || rotation !== 0 || crop.x !== 0 || crop.y !== 0;

  const isContain = canvas.imageFit === 'contain' || globalSettings.imageFit === 'contain';

  if (!hasTransform) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={canvas.imageSrc}
        alt=""
        className={`w-full h-full ${isContain ? 'object-contain' : 'object-cover'} select-none ${className}`}
        style={{ filter: filterString }}
        draggable={false}
      />
    );
  }

  // If cropped/rotated, use Cropper in read-only mode to replicate pixel-accurate CSS transforms
  return (
    <div className={`w-full h-full relative select-none ${className}`}>
      <Cropper
        image={canvas.imageSrc}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        showGrid={false}
        onCropChange={() => {}}
        onZoomChange={() => {}}
        style={{
          containerStyle: { pointerEvents: 'none' },
          mediaStyle: {
            filter: filterString,
            objectFit: isContain ? 'contain' : 'cover'
          }
        }}
      />
    </div>
  );
}
