'use client';

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { CanvasItem, LayoutType, useEditorStore } from '@/store/useEditorStore';
import { processUploadedFiles } from '@/utils/imageProcessor';
import { CanvasImage } from './CanvasImage';
import { ImageEditorModal } from './ImageEditorModal';
import { MinimalPhoneFrame } from './MinimalPhoneFrame';
import { BadgeSticker } from './BadgeSticker';
import { FloatingCard } from './FloatingCard';
import { CalloutPin } from './CalloutPin';
import {
  IoCloudUploadOutline,
  IoTrashOutline,
  IoBrowsersOutline,
  IoChevronBack,
  IoChevronForward,
  IoCopyOutline,
  IoStar,
  IoSparklesOutline,
  IoClose,
  IoTextOutline,
  IoLogoApple,
  IoLogoGooglePlaystore,
  IoOptionsOutline,
  IoBrushOutline,
  IoLayersOutline,
  IoPhonePortraitOutline,
  IoAdd,
  IoResizeOutline,
  IoMoveOutline,
  IoRefreshOutline,
} from 'react-icons/io5';
import { FastAverageColor } from 'fast-average-color';
import TextareaAutosize from 'react-textarea-autosize';
import { TARGET_SIZES, isAndroidDevice, isAppleDevice } from '@/config/sizes';
import { FONT_OPTIONS } from '@/config/fonts';
import { BADGE_PRESETS, BADGE_POSITION_OPTIONS, BadgeConfig, BadgePosition, getBadgeStore } from '@/config/badges';
import { DoodleAccentGroup, DoodleShape } from './DoodleAccent';
import {
  DOODLE_PRESETS,
  DOODLE_COLOR_PALETTE,
  DOODLE_TYPE_OPTIONS,
  DOODLE_POSITION_OPTIONS,
  DoodleType,
  DoodlePosition
} from '@/config/doodles';
import { FLOATING_CARD_PRESETS, CALLOUT_PIN_PRESETS } from '@/config/floatingCards';
import { getPanoramaSliceStyle } from '@/config/panoramas';
import { DEFAULT_STATUS_BAR } from '@/config/statusBar';
import { useShallow } from 'zustand/react/shallow';

const fac = new FastAverageColor();

interface CanvasEditorProps {
  canvas: CanvasItem;
  index: number;
  total: number;
  isPreviewMode?: boolean;
  targetWidth?: number;
  nextCanvas?: CanvasItem;
  nextNextCanvas?: CanvasItem;
}

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: 'basic-top', label: 'Basic Top (Standard)' },
  { value: 'basic-bottom', label: 'Basic Bottom (Header Phone)' },
  { value: 'split-vertical', label: 'Split Vertical' },
  { value: 'tilt-right', label: 'Tilt Right (Dynamic Angle)' },
  { value: 'tilt-right-complement', label: 'Tilt Right Complement (Angle left)' },
  { value: 'tilt-left', label: 'Tilt Left (Dynamic Angle)' },
  { value: 'tilt-left-complement', label: 'Tilt Left Complement (Angle right)' },
  { value: 'tilt-bottom-right', label: 'Tilt Bottom Right (Dynamic Angle)' },
  { value: 'tilt-bottom-left', label: 'Tilt Bottom Left (Dynamic Angle)' },
  { value: 'half-right', label: 'Half Right (Bleed Right)' },
  { value: 'half-left', label: 'Half Left (Bleed Left)' },
  { value: 'hero-center', label: 'Hero Center (Large Scale)' },
  { value: 'hero-3d-center', label: 'Hero 3D Center (Perspective)' },
  { value: '3d-isometric-right', label: '3D Isometric Right' },
  { value: '3d-isometric-left', label: '3D Isometric Left' },
  { value: 'banner-kinetic-stack', label: 'Kinetic Repeating Banner (3 Phones)' },
  { value: 'banner-stack-right', label: 'Banner Stacked Right' },
  { value: 'banner-triple-bottom', label: 'Banner Triple Bottom' },
  { value: 'og-style-1', label: 'Social Graphic - Clean Studio' },
  { value: 'og-style-2', label: 'Social Graphic - Angled Focus' },
  { value: 'og-style-3', label: 'Social Graphic - 3D Perspective' },
  { value: 'device-only', label: 'Device Only (Clean Mockup)' },
];

function getContrastColor(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
}

export const CanvasEditor = React.memo(function CanvasEditor({ canvas, index, total, isPreviewMode = false, targetWidth, nextCanvas, nextNextCanvas }: CanvasEditorProps) {
  const { 
    globalSettings, 
    updateCanvas, 
    removeCanvas, 
    moveCanvas, 
    duplicateCanvas,
    applyLayoutToAll,
    applyContentToAll,
    applyTextBoxToAll,
    applyBadgeToAll,
    updateBadge,
    applyDoodlesToAll,
    setIsDraggingGlobal,
    addFloatingCard,
    removeFloatingCard,
    addCalloutPin,
    removeCalloutPin,
    switchToAppStore,
    switchToPlayStore,
  } = useEditorStore(useShallow((state) => ({
    globalSettings: state.globalSettings,
    updateCanvas: state.updateCanvas,
    removeCanvas: state.removeCanvas,
    moveCanvas: state.moveCanvas,
    duplicateCanvas: state.duplicateCanvas,
    applyLayoutToAll: state.applyLayoutToAll,
    applyContentToAll: state.applyContentToAll,
    applyTextBoxToAll: state.applyTextBoxToAll,
    applyBadgeToAll: state.applyBadgeToAll,
    updateBadge: state.updateBadge,
    applyDoodlesToAll: state.applyDoodlesToAll,
    setIsDraggingGlobal: state.setIsDraggingGlobal,
    addFloatingCard: state.addFloatingCard,
    removeFloatingCard: state.removeFloatingCard,
    addCalloutPin: state.addCalloutPin,
    removeCalloutPin: state.removeCalloutPin,
    switchToAppStore: state.switchToAppStore,
    switchToPlayStore: state.switchToPlayStore,
  })));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showBadgeMenu, setShowBadgeMenu] = useState(false);
  const [showDoodleMenu, setShowDoodleMenu] = useState(false);
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);
  const [showStatusBarMenu, setShowStatusBarMenu] = useState(false);
  const [showTextBoxMenu, setShowTextBoxMenu] = useState(false);
  const [isResizingTextBox, setIsResizingTextBox] = useState(false);
  const [isDraggingBadge, setIsDraggingBadge] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const isDark = globalSettings.theme !== 'light';
  const isAndroid = isAndroidDevice(globalSettings.targetSize);

  const processSingleFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    try {
      const color = await fac.getColorAsync(url);
      updateCanvas(canvas.id, { 
        imageSrc: url,
        backgroundColor: color.hex,
        textColor: getContrastColor(color.hex),
      });
      toast.success("Screenshot replaced successfully!");
    } catch {
      updateCanvas(canvas.id, { imageSrc: url });
      toast.success("Screenshot replaced successfully!");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processSingleFile(file);
    }
  };

  const handlePhoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGlobal(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      
      // Process the first file for this specific canvas
      await processSingleFile(files[0]);
      
      // If there are more files, process them globally (fills empty canvases or appends)
      if (files.length > 1) {
        await processUploadedFiles(files.slice(1));
      }
    }
  };

  const sizeConfig = TARGET_SIZES[globalSettings.targetSize] || TARGET_SIZES['ios-6.5'];
  const canvasWidth = sizeConfig.logicalWidth;
  const canvasHeight = sizeConfig.logicalHeight;
  const zoomScale = targetWidth ? (targetWidth / canvasWidth) : (globalSettings.zoomScale || 0.65);
  
  const currentLayout = canvas.layout || 'basic-top';
  const isCompact = canvasHeight < 750;
  const isHalfLayout = 
    currentLayout === 'half-right' || 
    currentLayout === 'half-left' || 
    currentLayout === 'banner-stack-right' ||
    currentLayout === 'og-style-1' ||
    currentLayout === 'og-style-2' ||
    currentLayout === 'og-style-3';

  // Active Font
  const activeFontId = canvas.fontFamily || globalSettings.fontFamily || 'plus-jakarta';
  const fontConfig = FONT_OPTIONS.find((f) => f.id === activeFontId) || FONT_OPTIONS[0];

  // Compute adaptive phone frame dimensions
  const getPhoneDimensions = () => {
    let heightFactor = 0.65;
    if (currentLayout === 'device-only') heightFactor = 0.82;
    else if (currentLayout === 'half-right' || currentLayout === 'half-left') heightFactor = 0.70;
    else if (currentLayout === 'tilt-right' || currentLayout === 'tilt-left') heightFactor = 0.72;
    else if (isCompact) heightFactor = 0.58;

    const phoneH = Math.round(canvasHeight * heightFactor);
    
    // Determine the device frame aspect ratio based on the target size
    let aspectRatio = 0.48; // Default standard phone (approx 9:19.5)
    
    const targetConfig = TARGET_SIZES[globalSettings.targetSize] || TARGET_SIZES['ios-6.5'];
    
    if (targetConfig.category === 'Tablet') {
      aspectRatio = targetConfig.logicalWidth / targetConfig.logicalHeight;
    } else if (targetConfig.category === 'Header') {
      // For headers, keep the standard phone aspect ratio inside the banner
      aspectRatio = 0.48;
    } else {
      // For phones, match the phone's actual aspect ratio
      aspectRatio = targetConfig.logicalWidth / targetConfig.logicalHeight;
    }

    const phoneW = Math.round(phoneH * aspectRatio);
    return { phoneW, phoneH };
  };

  const { phoneW, phoneH } = getPhoneDimensions();

  // Dynamic layout rendering config
  const getLayoutConfig = () => {
    switch (currentLayout) {
      case 'basic-top':
        return {
          containerClass: "flex flex-col justify-between items-center",
          textContainerClass: `w-full px-6 pt-8 pb-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-2`,
          phoneWrapperClass: "w-full flex justify-center items-end flex-1 overflow-hidden relative",
          textAlign: "center" as const,
        };
      case 'basic-bottom':
        return {
          containerClass: "flex flex-col-reverse justify-between items-center",
          textContainerClass: `w-full px-6 pb-8 pt-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-2`,
          phoneWrapperClass: "w-full flex justify-center items-start flex-1 overflow-hidden relative pt-4",
          textAlign: "center" as const,
        };
      case 'tilt-right':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 left-0 w-[80%] pt-8 px-8 text-left z-20 flex flex-col items-start gap-2`,
          phoneWrapperClass: "absolute -bottom-8 -right-8 rotate-12 origin-bottom-right z-10",
          textAlign: "left" as const,
        };
      case 'tilt-right-complement':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 right-0 w-[80%] pt-8 px-8 text-right z-20 flex flex-col items-end gap-2`,
          phoneWrapperClass: "absolute -bottom-8 -left-[152px] rotate-12 origin-bottom-left z-10",
          textAlign: "right" as const,
        };
      case 'tilt-left':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 right-0 w-[80%] pt-8 px-8 text-right z-20 flex flex-col items-end gap-2`,
          phoneWrapperClass: "absolute -bottom-8 -left-8 -rotate-12 origin-bottom-left z-10",
          textAlign: "right" as const,
        };
      case 'tilt-left-complement':
        return {
          containerClass: "relative",
          textContainerClass: `absolute top-0 left-0 w-[80%] pt-8 px-8 text-left z-20 flex flex-col items-start gap-2`,
          phoneWrapperClass: "absolute -bottom-8 -right-[152px] -rotate-12 origin-bottom-right z-10",
          textAlign: "left" as const,
        };
      case 'tilt-bottom-right':
        return {
          containerClass: "relative",
          textContainerClass: `absolute bottom-0 left-0 w-[80%] pb-12 px-8 text-left z-20 flex flex-col items-start gap-0`,
          phoneWrapperClass: "absolute -top-8 -right-8 rotate-12 origin-top-right z-10",
          textAlign: "left" as const,
        };
      case 'tilt-bottom-left':
        return {
          containerClass: "relative",
          textContainerClass: `absolute bottom-0 right-0 w-[80%] pb-12 px-8 text-right z-20 flex flex-col items-end gap-0`,
          phoneWrapperClass: "absolute -top-8 -left-8 -rotate-12 origin-top-left z-10",
          textAlign: "right" as const,
        };
      case 'half-right':
        return {
          containerClass: "relative flex items-center justify-start overflow-hidden",
          textContainerClass: `w-[54%] pl-8 pr-2 text-left z-20 flex flex-col justify-center items-start gap-2.5`,
          phoneWrapperClass: `absolute top-1/2 right-0 [transform:translate(40%,-50%)] z-10`,
          textAlign: "left" as const,
        };
      case 'half-left':
        return {
          containerClass: "relative flex items-center justify-end overflow-hidden",
          textContainerClass: `w-[54%] pr-8 pl-2 text-right z-20 flex flex-col justify-center items-end gap-2.5`,
          phoneWrapperClass: `absolute top-1/2 left-0 [transform:translate(-40%,-50%)] z-10`,
          textAlign: "right" as const,
        };
            case 'split-vertical':
        return {
          containerClass: "flex flex-col justify-between items-center",
          textContainerClass: "w-full px-6 pt-8 pb-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-2",
          subtitleContainerClass: "w-full px-6 pb-8 pt-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-2",
          phoneWrapperClass: "w-full flex justify-center items-center flex-1 overflow-hidden relative",
          textAlign: "center" as const,
        };
      case '3d-isometric-right':
        return {
          containerClass: "relative [perspective:2000px]",
          textContainerClass: "absolute top-0 left-0 w-[65%] pt-12 px-8 text-left z-20 flex flex-col items-start gap-2",
          phoneWrapperClass: "absolute -bottom-16 -right-24 z-10 [transform:rotateX(15deg)_rotateY(-35deg)_rotateZ(10deg)_scale(0.85)] shadow-[20px_40px_60px_rgba(0,0,0,0.5)] transition-transform duration-300",
          textAlign: "left" as const,
        };
      case '3d-isometric-left':
        return {
          containerClass: "relative [perspective:2000px]",
          textContainerClass: "absolute top-0 right-0 w-[65%] pt-12 px-8 text-right z-20 flex flex-col items-end gap-2",
          phoneWrapperClass: "absolute -bottom-16 -left-24 z-10 [transform:rotateX(15deg)_rotateY(35deg)_rotateZ(-10deg)_scale(0.85)] shadow-[-20px_40px_60px_rgba(0,0,0,0.5)] transition-transform duration-300",
          textAlign: "right" as const,
        };
      case 'og-style-1':
        return {
          containerClass: "relative flex items-center bg-white",
          textContainerClass: "w-[55%] pl-12 pr-4 text-left z-20 flex flex-col justify-center items-start gap-4",
          phoneWrapperClass: "absolute top-1/2 -right-8 -translate-y-1/2 z-10 scale-[1.1]",
          textAlign: "left" as const,
        };
      case 'og-style-2':
        return {
          containerClass: "relative flex items-center overflow-hidden",
          textContainerClass: "w-[50%] pl-14 pr-4 text-left z-20 flex flex-col justify-center items-start gap-6",
          phoneWrapperClass: "absolute -bottom-24 -right-12 z-10 scale-[1.3] [transform:rotate(-15deg)]",
          textAlign: "left" as const,
        };
      case 'og-style-3':
        return {
          containerClass: "relative flex items-center overflow-hidden [perspective:2000px]",
          textContainerClass: "w-[45%] pl-12 pr-4 text-left z-20 flex flex-col justify-center items-start gap-6",
          phoneWrapperClass: "absolute top-1/2 -right-16 -translate-y-1/2 z-10 [transform:rotateX(15deg)_rotateY(-35deg)_rotateZ(10deg)_scale(0.9)]",
          textAlign: "left" as const,
        };
      case 'hero-3d-center':
        return {
          containerClass: "relative flex flex-col items-center justify-start overflow-hidden pt-12 [perspective:2000px]",
          textContainerClass: "w-[80%] text-center z-20 drop-shadow-2xl flex flex-col justify-center items-center gap-6",
          phoneWrapperClass: "absolute bottom-[-15%] z-10 [transform:rotateX(30deg)_rotateY(0deg)_scale(1.15)] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] transition-transform duration-700 hover:[transform:rotateX(20deg)_scale(1.15)]",
          textAlign: "center" as const,
        };
      case 'banner-kinetic-stack':
        return {
          containerClass: "relative flex items-center overflow-hidden",
          textContainerClass: "w-[44%] pl-8 pr-2 text-left z-20 flex flex-col justify-center items-start h-full",
          phoneWrapperClass: "absolute top-1/2 right-4 -translate-y-1/2 z-30 scale-100",
          textAlign: "left" as const,
        };
      case 'banner-stack-right':
        return {
          containerClass: "relative flex items-center overflow-hidden",
          textContainerClass: "w-[48%] pl-12 pr-4 text-left z-30 flex flex-col justify-center items-start gap-4",
          phoneWrapperClass: "absolute top-1/2 right-4 -translate-y-1/2 z-30 scale-100",
          textAlign: "left" as const,
        };
      case 'banner-triple-bottom':
        return {
          containerClass: "relative flex flex-col items-center justify-start overflow-hidden pt-12",
          textContainerClass: "w-[80%] text-center z-30 drop-shadow-2xl flex flex-col justify-center items-center gap-4",
          phoneWrapperClass: "absolute bottom-[-10%] z-30 scale-100",
          textAlign: "center" as const,
        };
      case 'device-only':
        return {
          containerClass: "flex items-center justify-center",
          textContainerClass: "hidden",
          phoneWrapperClass: "flex items-center justify-center z-10",
          textAlign: "center" as const,
        };
      case 'hero-center':
        return {
          containerClass: "flex flex-col items-center justify-start overflow-hidden pt-12 relative",
          textContainerClass: "w-[90%] text-center z-20 flex flex-col justify-center items-center gap-0 pt-4",
          phoneWrapperClass: "absolute bottom-[-15%] z-10 scale-[1.3]",
          textAlign: "center" as const,
        };
      default:
        return {
          containerClass: "flex flex-col justify-between items-center",
          textContainerClass: `w-full px-6 pt-8 pb-2 text-center z-20 flex-shrink-0 gap-2`,
          phoneWrapperClass: "w-full flex justify-center items-end flex-1 overflow-hidden relative",
          textAlign: "center" as const,
        };
    }
  };

  const layoutConfig = getLayoutConfig();

  const getDefaultTextBoxWidth = (layout: LayoutType): number => {
    switch (layout) {
      case 'half-right':
      case 'half-left':
        return 54;
      case 'banner-stack-right':
        return 48;
      case 'banner-kinetic-stack':
        return 44;
      case 'og-style-1':
        return 55;
      case 'og-style-2':
        return 50;
      case 'og-style-3':
        return 45;
      case '3d-isometric-right':
      case '3d-isometric-left':
        return 65;
      case 'tilt-right':
      case 'tilt-left':
      case 'tilt-right-complement':
      case 'tilt-left-complement':
      case 'tilt-bottom-right':
      case 'tilt-bottom-left':
        return 80;
      default:
        return 100;
    }
  };

  const defaultTextBoxWidth = getDefaultTextBoxWidth(currentLayout);
  const currentTextBoxWidth = canvas.textBoxWidth ?? defaultTextBoxWidth;

  const defaultTitleFontSize = isHalfLayout ? (isCompact ? 22 : 28) : (isCompact ? 28 : 40);
  const effectiveTitleFontSize = canvas.titleFontSize || defaultTitleFontSize;

  const defaultSubtitleFontSize = isHalfLayout ? (isCompact ? 12 : 15) : (isCompact ? 14 : 18);
  const effectiveSubtitleFontSize = canvas.subtitleFontSize || defaultSubtitleFontSize;

  const effectiveTextAlign = canvas.textAlign || layoutConfig.textAlign;

  const handleResizeStart = (e: React.PointerEvent, handle: 'left' | 'right' | 'corner') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizingTextBox(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = currentTextBoxWidth;
    const initialTitleSize = effectiveTitleFontSize;
    const initialSubSize = effectiveSubtitleFontSize;

    document.body.style.userSelect = 'none';
    if (handle === 'corner') {
      document.body.style.cursor = effectiveTextAlign === 'right' ? 'nesw-resize' : 'nwse-resize';
    } else {
      document.body.style.cursor = 'ew-resize';
    }

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoomScale;
      const deltaY = (moveEvent.clientY - startY) / zoomScale;

      if (handle === 'right') {
        const deltaPct = (deltaX / canvasWidth) * 100;
        const newWidth = Math.min(100, Math.max(25, Math.round(initialWidth + deltaPct)));
        updateCanvas(canvas.id, { textBoxWidth: newWidth });
      } else if (handle === 'left') {
        const deltaPct = (-deltaX / canvasWidth) * 100;
        const newWidth = Math.min(100, Math.max(25, Math.round(initialWidth + deltaPct)));
        updateCanvas(canvas.id, { textBoxWidth: newWidth });
      } else if (handle === 'corner') {
        const deltaFont = Math.round(deltaY * 0.15);
        const newFontSize = Math.min(72, Math.max(16, initialTitleSize + deltaFont));
        const newSubSize = Math.min(36, Math.max(11, initialSubSize + Math.round(deltaFont * 0.45)));

        const deltaPct = ((deltaX * (effectiveTextAlign === 'right' ? -1 : 1)) / canvasWidth) * 100;
        const newWidth = Math.min(100, Math.max(25, Math.round(initialWidth + deltaPct)));

        updateCanvas(canvas.id, {
          textBoxWidth: newWidth,
          titleFontSize: newFontSize,
          subtitleFontSize: newSubSize,
        });
      }
    };

    const onPointerUp = () => {
      setIsResizingTextBox(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleBadgePointerDown = (e: React.PointerEvent) => {
    if (isPreviewMode || targetWidth) return;
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;

    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBadge(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialOffsetX = canvas.badge?.offsetX || 0;
    const initialOffsetY = canvas.badge?.offsetY || 0;

    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoomScale;
      const deltaY = (moveEvent.clientY - startY) / zoomScale;

      const newOffsetX = Math.round(initialOffsetX + deltaX);
      const newOffsetY = Math.round(initialOffsetY + deltaY);

      updateCanvas(canvas.id, {
        badge: {
          ...canvas.badge!,
          offsetX: newOffsetX,
          offsetY: newOffsetY,
        },
      });
    };

    const onPointerUp = () => {
      setIsDraggingBadge(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const getBadgePositionClasses = (position?: BadgePosition) => {
    switch (position) {
      case 'top-left':
        return 'top-6 left-6';
      case 'top-center':
        return 'top-6 left-1/2';
      case 'top-right':
        return 'top-6 right-6';
      case 'bottom-left':
        return 'bottom-8 left-6';
      case 'bottom-center':
        return 'bottom-8 left-1/2';
      case 'bottom-right':
        return 'bottom-8 right-6';
      case 'free':
        return 'top-10 left-1/2';
      default:
        return 'top-6 left-1/2';
    }
  };

  const renderMovableBadge = (isCanvasAnchored = false) => {
    if (!canvas.badge?.enabled) return null;

    const isAnchored =
      isCanvasAnchored ||
      (canvas.badge.position && canvas.badge.position !== 'inline') ||
      currentLayout === 'device-only';

    const ox = canvas.badge.offsetX || 0;
    const oy = canvas.badge.offsetY || 0;
    const isMoved =
      ox !== 0 ||
      oy !== 0 ||
      (canvas.badge.position !== undefined && canvas.badge.position !== 'inline');

    let transformStyle: string | undefined = undefined;
    if (
      isAnchored &&
      (canvas.badge.position === 'top-center' ||
        canvas.badge.position === 'bottom-center' ||
        canvas.badge.position === 'free' ||
        (!canvas.badge.position && currentLayout === 'device-only'))
    ) {
      transformStyle = `translateX(calc(-50% + ${ox}px)) translateY(${oy}px)`;
    } else if (ox !== 0 || oy !== 0) {
      transformStyle = `translate(${ox}px, ${oy}px)`;
    }

    const badgeContent = (
      <div
        onPointerDown={handleBadgePointerDown}
        className={`group/badge relative inline-flex items-center select-none ${
          isPreviewMode ? '' : 'cursor-grab active:cursor-grabbing'
        } ${isDraggingBadge ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black/50 scale-105 z-50' : ''}`}
        style={{
          transform: transformStyle,
          transition: isDraggingBadge ? 'none' : 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)',
        }}
        title={isPreviewMode ? undefined : 'Drag badge to reposition anywhere'}
      >
        {/* Editor-only Move Indicator & Position HUD (no-export) */}
        {!isPreviewMode && (
          <>
            {/* Outline on hover */}
            <div
              className={`absolute -inset-1 rounded-full border transition-all pointer-events-none no-export ${
                isDraggingBadge
                  ? 'border-amber-400/80 bg-amber-400/10'
                  : 'border-transparent group-hover/badge:border-amber-400/40 group-hover/badge:bg-amber-400/5'
              }`}
            />

            {/* Floating Drag Handle / Position HUD */}
            <div
              className={`absolute -top-7 left-1/2 -translate-x-1/2 no-export ${
                isDraggingBadge
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 group-hover/badge:opacity-100 group-focus-within/badge:opacity-100 scale-95 group-hover/badge:scale-100'
              } transition-all duration-150 z-50 pointer-events-auto flex items-center gap-1.5 bg-gray-950/95 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-semibold shadow-2xl border border-white/20 whitespace-nowrap`}
            >
              <IoMoveOutline className="w-3 h-3 text-amber-400 flex-shrink-0 animate-pulse" />
              <span>
                {isMoved ? `(${ox > 0 ? `+${ox}` : ox}, ${oy > 0 ? `+${oy}` : oy})` : 'Drag to move'}
              </span>

              {isMoved && (
                <>
                  <span className="opacity-40">|</span>
                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateCanvas(canvas.id, {
                        badge: {
                          ...canvas.badge!,
                          position: 'inline',
                          offsetX: 0,
                          offsetY: 0,
                        },
                      });
                      toast.success('Reset badge position');
                    }}
                    className="text-[9px] text-amber-300 hover:text-amber-200 uppercase tracking-wider pl-0.5"
                    title="Reset badge position"
                  >
                    Reset
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {/* Actual Badge Sticker */}
        <BadgeSticker
          badge={canvas.badge}
          textColor={canvas.textColor}
          onChangeText={(newText) =>
            updateCanvas(canvas.id, { badge: { ...canvas.badge!, text: newText } })
          }
          onChangeSubtext={(newSubtext) =>
            updateCanvas(canvas.id, { badge: { ...canvas.badge!, subtext: newSubtext } })
          }
        />
      </div>
    );

    if (isAnchored) {
      return (
        <div
          className={`absolute z-30 pointer-events-auto ${getBadgePositionClasses(
            canvas.badge.position || (currentLayout === 'device-only' ? 'top-center' : 'inline')
          )}`}
        >
          {badgeContent}
        </div>
      );
    }

    return (
      <div
        className={`mb-1.5 pointer-events-auto w-full flex ${
          effectiveTextAlign === 'right' ? 'justify-end' :
          effectiveTextAlign === 'center' ? 'justify-center' : 'justify-start'
        }`}
      >
        {badgeContent}
      </div>
    );
  };

  const handleApplyBadge = (preset: BadgeConfig) => {
    if (!preset.enabled) {
      updateCanvas(canvas.id, { badge: preset });
      setShowBadgeMenu(false);
      return;
    }

    const badgeStore = getBadgeStore(preset);
    if (badgeStore === 'app-store' && isAndroidDevice(globalSettings.targetSize)) {
      switchToAppStore();
      toast.success('Switched to iPhone for App Store badge');
    } else if (badgeStore === 'play-store' && isAppleDevice(globalSettings.targetSize)) {
      switchToPlayStore();
      toast.success('Switched to Android device for Play Store badge');
    }

    updateCanvas(canvas.id, {
      badge: {
        ...preset,
        position: canvas.badge?.position ?? 'inline',
        offsetX: canvas.badge?.offsetX ?? 0,
        offsetY: canvas.badge?.offsetY ?? 0,
      },
    });
    setShowBadgeMenu(false);
  };

  const toggleGradientText = () => {
    updateCanvas(canvas.id, { gradientText: !canvas.gradientText });
  };

  return (
    <div 
      id={`card-${canvas.id}`}
      className={`flex flex-col flex-shrink-0 group relative transition-transform duration-200 ${
        targetWidth
          ? 'items-center pointer-events-none snap-center'
          : isPreviewMode 
            ? 'w-screen h-screen items-center justify-center snap-center' 
            : 'items-center'
      }`}
    >
      {/* Top Control Bar */}
      {!isPreviewMode && !targetWidth && (
        <div 
          onWheel={(e) => e.stopPropagation()}
        className={`w-full mb-4 flex items-center justify-between px-4 py-2.5 rounded-2xl shadow-sm border relative z-50 transition-colors ${
        isDark 
          ? 'bg-gray-900/90 backdrop-blur-md border-gray-700/80 text-gray-200' 
          : 'bg-white/90 backdrop-blur-md border-gray-200/80 text-gray-800'
      }`}>
        <div className="flex items-center space-x-3">
          <span className={`w-6 h-6 flex items-center justify-center text-[11px] font-bold rounded-full shadow-sm ${
            isDark ? 'bg-zinc-900/50 text-zinc-300' : 'bg-zinc-50 text-zinc-700'
          }`}>
            {index + 1}
          </span>

          <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

          {/* Layout Selector */}
          <div className="flex items-center space-x-1.5">
            <IoBrowsersOutline className={`w-4 h-4 flex-shrink-0 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <select
              value={currentLayout}
              onChange={(e) => updateCanvas(canvas.id, { layout: e.target.value as LayoutType })}
              className={`text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-zinc-500 focus:outline-none cursor-pointer border transition-colors ${
                isDark 
                  ? 'bg-gray-800/80 border-gray-700 text-gray-200 hover:border-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                  {opt.label}
                </option>
              ))}
            </select>
            
            {/* Apply Layout to All Button */}
            <button
              onClick={() => applyLayoutToAll(currentLayout)}
              className={`px-2 py-1.5 ml-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all shadow-sm ${
                isDark 
                  ? 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/20 hover:border-zinc-400' 
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
              title="Apply this layout to all screenshots"
            >
              Apply All
            </button>
          </div>

          <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

          {/* Social Proof Badge Toggle */}
          <button
            onClick={() => {
              setShowBadgeMenu(!showBadgeMenu);
              setShowDoodleMenu(false);
              setShowWidgetMenu(false);
              setShowStatusBarMenu(false);
              setShowTextBoxMenu(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              canvas.badge?.enabled
                ? isDark 
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' 
                  : 'bg-amber-50 text-amber-700 border-amber-300'
                : isDark
                  ? 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
            title="Add Rating / Award Badge"
          >
            <IoStar className={`w-3.5 h-3.5 ${canvas.badge?.enabled ? 'fill-amber-400 text-amber-500' : 'text-gray-400'}`} />
            <span>Badge</span>
          </button>

          {/* Hand-Drawn Doodle Accents Toggle */}
          <button
            onClick={() => {
              setShowDoodleMenu(!showDoodleMenu);
              setShowBadgeMenu(false);
              setShowWidgetMenu(false);
              setShowStatusBarMenu(false);
              setShowTextBoxMenu(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              canvas.doodle?.enabled
                ? isDark 
                  ? 'bg-yellow-950/60 text-yellow-300 border-yellow-500/40 shadow-sm' 
                  : 'bg-yellow-50 text-yellow-800 border-yellow-300 shadow-sm'
                : isDark
                  ? 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
            title="Add Hand-Drawn Doodle Accents"
          >
            <IoBrushOutline className={`w-3.5 h-3.5 ${canvas.doodle?.enabled ? 'text-yellow-400' : 'text-gray-400'}`} />
            <span>Doodles</span>
          </button>

          {/* Resizable Text Box Settings Toggle */}
          <button
            onClick={() => {
              setShowTextBoxMenu(!showTextBoxMenu);
              setShowBadgeMenu(false);
              setShowDoodleMenu(false);
              setShowWidgetMenu(false);
              setShowStatusBarMenu(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              canvas.textBoxWidth || canvas.titleFontSize || canvas.subtitleFontSize || canvas.textAlign
                ? isDark
                  ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40 shadow-sm'
                  : 'bg-indigo-50 text-indigo-800 border-indigo-300 shadow-sm'
                : isDark
                  ? 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
            title="Resize Text Box & Adjust Typography Size"
          >
            <IoResizeOutline className="w-3.5 h-3.5" />
            <span>Text Box {(canvas.textBoxWidth || canvas.titleFontSize) ? `(${currentTextBoxWidth}%)` : ''}</span>
          </button>

          {/* Floating Widgets Toggle */}
          <button
            onClick={() => {
              setShowWidgetMenu(!showWidgetMenu);
              setShowBadgeMenu(false);
              setShowDoodleMenu(false);
              setShowStatusBarMenu(false);
              setShowTextBoxMenu(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              (canvas.floatingCards && canvas.floatingCards.length > 0) || (canvas.calloutPins && canvas.calloutPins.length > 0)
                ? isDark
                  ? 'bg-blue-950/60 text-blue-300 border-blue-500/40 shadow-sm'
                  : 'bg-blue-50 text-blue-800 border-blue-300 shadow-sm'
                : isDark
                  ? 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
            title="Add Floating UI Cards & Callout Pins"
          >
            <IoLayersOutline className="w-3.5 h-3.5" />
            <span>Widgets {(canvas.floatingCards?.length || 0) + (canvas.calloutPins?.length || 0) > 0 ? `(${(canvas.floatingCards?.length || 0) + (canvas.calloutPins?.length || 0)})` : ''}</span>
          </button>

          {/* Status Bar Sanitizer Toggle */}
          <button
            onClick={() => {
              setShowStatusBarMenu(!showStatusBarMenu);
              setShowBadgeMenu(false);
              setShowDoodleMenu(false);
              setShowWidgetMenu(false);
              setShowTextBoxMenu(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              (canvas.statusBar || globalSettings.statusBar)?.enabled
                ? isDark
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm'
                : isDark
                  ? 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
            title="Status Bar Sanitizer (9:41, Battery, Wi-Fi, 5G)"
          >
            <IoPhonePortraitOutline className="w-3.5 h-3.5" />
            <span>Status</span>
          </button>

          {/* Gradient Text Toggle */}
          <button
            onClick={toggleGradientText}
            className={`p-2 rounded-lg border transition-all ${
              canvas.gradientText
                ? isDark 
                  ? 'bg-zinc-950/60 text-zinc-300 border-zinc-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                  : 'bg-zinc-50 text-zinc-700 border-zinc-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                : isDark
                  ? 'bg-gray-800/80 text-gray-400 border-gray-700 hover:bg-gray-700'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
            }`}
            title="Toggle Gradient Text Style"
          >
            <IoSparklesOutline className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Colors */}
          <div className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border mr-2 ${
            isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <input
              type="color"
              value={canvas.backgroundColor || '#000000'}
              onChange={(e) => updateCanvas(canvas.id, { backgroundColor: e.target.value })}
              className="w-5 h-5 rounded-md border-0 cursor-pointer p-0 shadow-sm"
              title="Change Background Color"
            />
            <input
              type="color"
              value={canvas.textColor || '#ffffff'}
              onChange={(e) => updateCanvas(canvas.id, { textColor: e.target.value })}
              className="w-5 h-5 rounded-md border-0 cursor-pointer p-0 shadow-sm"
              title="Change Text Color"
            />
            <input
              type="color"
              value={canvas.subtitleColor || canvas.textColor || '#ffffff'}
              onChange={(e) => updateCanvas(canvas.id, { subtitleColor: e.target.value })}
              className="w-5 h-5 rounded-md border-0 cursor-pointer p-0 shadow-sm"
              title="Change Subtitle Color"
            />
          </div>

          <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

          {/* Move & Duplicate */}
          <button
            disabled={index === 0}
            onClick={() => moveCanvas(canvas.id, 'left')}
            className={`p-2 rounded-lg transition-colors ${
              index === 0 
                ? 'opacity-20 cursor-not-allowed text-gray-500' 
                : isDark
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-zinc-400'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-zinc-600'
            }`}
            title="Move Left"
          >
            <IoChevronBack className="w-4 h-4" />
          </button>

          <button
            disabled={index === total - 1}
            onClick={() => moveCanvas(canvas.id, 'right')}
            className={`p-2 rounded-lg transition-colors ${
              index === total - 1 
                ? 'opacity-20 cursor-not-allowed text-gray-500' 
                : isDark
                  ? 'text-gray-400 hover:bg-gray-800 hover:text-zinc-400'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-zinc-600'
            }`}
            title="Move Right"
          >
            <IoChevronForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => duplicateCanvas(canvas.id)}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-zinc-400' 
                : 'text-gray-400 hover:bg-zinc-50 hover:text-zinc-600'
            }`}
            title="Duplicate Screenshot"
          >
            <IoCopyOutline className="w-4 h-4" />
          </button>

          <button
            onClick={() => applyContentToAll(canvas.title, canvas.subtitle)}
            className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              isDark 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-zinc-400' 
                : 'text-gray-400 hover:bg-zinc-50 hover:text-zinc-600'
            }`}
            title="Apply this Title & Subtitle to all screens"
          >
            <IoTextOutline className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden xl:block">
              Apply Text
            </span>
          </button>

          {total > 1 && (
            <>
              <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <button
                onClick={() => removeCanvas(canvas.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:bg-red-950/50 hover:text-red-400' 
                    : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                }`}
                title="Delete Screenshot"
              >
                <IoTrashOutline className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Badge Selector Popover */}
        {showBadgeMenu && (
          <div className={`absolute top-12 left-20 z-50 rounded-2xl shadow-2xl border p-3.5 w-80 flex flex-col gap-2.5 ${
            isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <span className="text-xs font-bold flex items-center gap-1.5">
                <IoStar className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Social Proof Badge
              </span>
              <button 
                onClick={() => setShowBadgeMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {canvas.badge?.enabled ? (
              <div 
                className="space-y-3 max-h-72 overflow-y-auto pr-0.5"
                onWheel={(e) => e.stopPropagation()}
              >
                {/* Position Presets */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold">
                    <span className="flex items-center gap-1">
                      <IoMoveOutline className="w-3 h-3 text-amber-400" />
                      Position
                    </span>
                    {(canvas.badge.offsetX || canvas.badge.offsetY || (canvas.badge.position && canvas.badge.position !== 'inline')) ? (
                      <button
                        onClick={() => {
                          updateCanvas(canvas.id, {
                            badge: {
                              ...canvas.badge!,
                              position: 'inline',
                              offsetX: 0,
                              offsetY: 0,
                            },
                          });
                          toast.success('Reset badge position');
                        }}
                        className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-0.5"
                      >
                        <IoRefreshOutline className="w-2.5 h-2.5" />
                        Reset
                      </button>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {BADGE_POSITION_OPTIONS.map((pos) => {
                      const isActive = (canvas.badge?.position || 'inline') === pos.value;
                      return (
                        <button
                          key={pos.value}
                          onClick={() => {
                            updateCanvas(canvas.id, {
                              badge: {
                                ...canvas.badge!,
                                position: pos.value,
                                offsetX: 0,
                                offsetY: 0,
                              },
                            });
                          }}
                          className={`px-2 py-1 text-[11px] rounded-lg font-medium border text-left truncate transition-colors ${
                            isActive
                              ? isDark
                                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                                : 'bg-amber-50 border-amber-300 text-amber-700'
                              : isDark
                                ? 'border-gray-800 hover:border-gray-700 bg-gray-800/40 text-gray-300'
                                : 'border-gray-200 hover:border-gray-300 bg-gray-50 text-gray-700'
                          }`}
                        >
                          {pos.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fine-Tuning Offsets */}
                <div className="space-y-1.5 pt-1 border-t border-gray-800/20">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400">
                    <span>Offsets</span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      X: {canvas.badge.offsetX || 0}px | Y: {canvas.badge.offsetY || 0}px
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* X Nudge */}
                    <div className={`flex items-center justify-between rounded-lg p-1 text-xs border ${
                      isDark ? 'bg-gray-800/60 border-gray-700/60' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <span className="text-[10px] font-semibold px-1 text-gray-400">X</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateCanvas(canvas.id, {
                              badge: {
                                ...canvas.badge!,
                                offsetX: (canvas.badge?.offsetX || 0) - 10,
                              },
                            })
                          }
                          className="w-5 h-5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center font-bold text-xs"
                          title="Nudge Left (-10px)"
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            updateCanvas(canvas.id, {
                              badge: {
                                ...canvas.badge!,
                                offsetX: (canvas.badge?.offsetX || 0) + 10,
                              },
                            })
                          }
                          className="w-5 h-5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center font-bold text-xs"
                          title="Nudge Right (+10px)"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Y Nudge */}
                    <div className={`flex items-center justify-between rounded-lg p-1 text-xs border ${
                      isDark ? 'bg-gray-800/60 border-gray-700/60' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <span className="text-[10px] font-semibold px-1 text-gray-400">Y</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateCanvas(canvas.id, {
                              badge: {
                                ...canvas.badge!,
                                offsetY: (canvas.badge?.offsetY || 0) - 10,
                              },
                            })
                          }
                          className="w-5 h-5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center font-bold text-xs"
                          title="Nudge Up (-10px)"
                        >
                          -
                        </button>
                        <button
                          onClick={() =>
                            updateCanvas(canvas.id, {
                              badge: {
                                ...canvas.badge!,
                                offsetY: (canvas.badge?.offsetY || 0) + 10,
                              },
                            })
                          }
                          className="w-5 h-5 rounded hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center font-bold text-xs"
                          title="Nudge Down (+10px)"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Style Selector */}
                <div className="space-y-1 pt-1 border-t border-gray-800/20">
                  <span className="text-[11px] font-semibold text-gray-400">Badge Style</span>
                  <div className="grid grid-cols-3 gap-1">
                    {(['pill-glass', 'pill-solid', 'minimal-star'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() =>
                          updateCanvas(canvas.id, {
                            badge: {
                              ...canvas.badge!,
                              style: st,
                            },
                          })
                        }
                        className={`px-1.5 py-1 text-[10px] rounded-lg font-medium border text-center transition-colors ${
                          canvas.badge?.style === st
                            ? isDark
                              ? 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                              : 'bg-amber-50 border-amber-300 text-amber-700'
                            : isDark
                              ? 'border-gray-800 hover:border-gray-700 text-gray-300'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {st === 'pill-glass' ? 'Frosted' : st === 'pill-solid' ? 'Solid' : 'Minimal'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: Apply All & Remove */}
                <div className="pt-2 border-t border-gray-800/20 flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      applyBadgeToAll(canvas.badge!);
                      toast.success('Applied badge to all screenshots');
                      setShowBadgeMenu(false);
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-xl border text-center transition-colors ${
                      isDark
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    Apply to All
                  </button>
                  <button
                    onClick={() => handleApplyBadge({ enabled: false, icon: 'none', text: '', style: 'pill-glass' })}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                      isDark
                        ? 'text-red-400 border-red-900/40 hover:bg-red-950/40'
                        : 'text-red-600 border-red-200 hover:bg-red-50'
                    }`}
                  >
                    Remove
                  </button>
                </div>

                {/* Presets List Header */}
                <div className="pt-2 border-t border-gray-800/20">
                  <span className="text-[11px] font-semibold text-gray-400 block mb-1.5">Switch Preset</span>
                  <div className="space-y-1">
                    {BADGE_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => handleApplyBadge(p.config)}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex flex-col gap-0.5 transition-colors border ${
                          isDark 
                            ? 'border-transparent hover:border-gray-700 hover:bg-gray-800 text-gray-200' 
                            : 'border-transparent hover:border-zinc-100 hover:bg-zinc-50 text-gray-700'
                        }`}
                      >
                        <span className="font-semibold">{p.label}</span>
                        <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{p.config.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* When Badge is disabled: select preset to enable */
              <div 
                className="space-y-1.5 max-h-56 overflow-y-auto"
                onWheel={(e) => e.stopPropagation()}
              >
                {BADGE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleApplyBadge(p.config)}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex flex-col gap-0.5 transition-colors border ${
                      isDark 
                        ? 'border-transparent hover:border-gray-700 hover:bg-gray-800 text-gray-200' 
                        : 'border-transparent hover:border-zinc-100 hover:bg-zinc-50 text-gray-700'
                    }`}
                  >
                    <span className="font-semibold">{p.label}</span>
                    <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{p.config.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Doodle Selector Popover */}
        {showDoodleMenu && (
          <div className={`absolute top-12 left-44 z-50 rounded-2xl shadow-2xl border p-3.5 w-80 flex flex-col gap-3 ${
            isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <span className="text-xs font-bold flex items-center gap-1.5">
                <IoBrushOutline className="w-3.5 h-3.5 text-yellow-400" />
                Doodle Accents
              </span>
              <button 
                onClick={() => setShowDoodleMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Toggle On/Off */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Toggle Accents</span>
              <button
                onClick={() => {
                  const isCurrentlyEnabled = !!canvas.doodle?.enabled;
                  const defaultDoodles = [
                    { type: 'question' as const, position: 'top-right' as const },
                    { type: 'underline-wave' as const, position: 'underline' as const }
                  ];
                  updateCanvas(canvas.id, {
                    doodle: {
                      enabled: !isCurrentlyEnabled,
                      color: canvas.doodle?.color || '#facc15',
                      doodles: canvas.doodle?.doodles?.length ? canvas.doodle.doodles : defaultDoodles
                    }
                  });
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                  canvas.doodle?.enabled
                    ? 'bg-yellow-500 text-black border-yellow-400 shadow-sm'
                    : isDark ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                {canvas.doodle?.enabled ? 'Active' : 'Off'}
              </button>
            </div>

            {/* Color Palette Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium opacity-75">Doodle Color</span>
                <span className="text-[10px] font-mono opacity-60">{canvas.doodle?.color || '#facc15'}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {DOODLE_COLOR_PALETTE.map((pal) => (
                  <button
                    key={pal.value}
                    onClick={() => {
                      const currentDoodles = canvas.doodle?.doodles || [
                        { type: 'question', position: 'top-right' },
                        { type: 'underline-wave', position: 'underline' }
                      ];
                      updateCanvas(canvas.id, {
                        doodle: {
                          enabled: true,
                          color: pal.value,
                          doodles: currentDoodles.map(d => ({ ...d, color: pal.value }))
                        }
                      });
                    }}
                    className={`w-5 h-5 rounded-full border shadow-sm transition-transform hover:scale-125 ${
                      (canvas.doodle?.color || '#facc15') === pal.value ? 'ring-2 ring-yellow-400 ring-offset-1 scale-110' : 'border-black/20'
                    }`}
                    style={{ backgroundColor: pal.value }}
                    title={pal.name}
                  />
                ))}
                <input
                  type="color"
                  value={canvas.doodle?.color || '#facc15'}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    const currentDoodles = canvas.doodle?.doodles || [
                      { type: 'question', position: 'top-right' },
                      { type: 'underline-wave', position: 'underline' }
                    ];
                    updateCanvas(canvas.id, {
                      doodle: {
                        enabled: true,
                        color: newColor,
                        doodles: currentDoodles.map(d => ({ ...d, color: newColor }))
                      }
                    });
                  }}
                  className="w-5 h-5 rounded-full border-0 cursor-pointer p-0 shadow-sm ml-1"
                  title="Custom Doodle Color"
                />
              </div>
            </div>

            {/* Curated Presets */}
            <div className="space-y-1">
              <span className="text-[11px] font-medium opacity-75">Preset Styles</span>
              <div 
                className="space-y-1 max-h-36 overflow-y-auto pr-1"
                onWheel={(e) => e.stopPropagation()}
              >
                {DOODLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      const color = canvas.doodle?.color || preset.config.color || '#facc15';
                      updateCanvas(canvas.id, {
                        doodle: {
                          ...preset.config,
                          color,
                          doodles: preset.config.doodles.map(d => ({ ...d, color }))
                        }
                      });
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded-xl flex items-center justify-between transition-colors border ${
                      isDark 
                        ? 'border-transparent hover:border-gray-700 hover:bg-gray-800 text-gray-200' 
                        : 'border-transparent hover:border-zinc-100 hover:bg-zinc-50 text-gray-700'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{preset.label}</span>
                      <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{preset.description}</span>
                    </div>
                    <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                      <DoodleShape type={preset.config.doodles[0]?.type || 'question'} color={canvas.doodle?.color || '#facc15'} className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Doodle Fine-Tuning */}
            <div className={`pt-2 border-t space-y-1.5 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
              <span className="text-[11px] font-medium opacity-75">Custom Doodles</span>
              
              {/* Primary Doodle */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-14 font-semibold text-[10px] uppercase opacity-70">Primary:</span>
                <select
                  value={canvas.doodle?.doodles?.[0]?.type || 'question'}
                  onChange={(e) => {
                    const newType = e.target.value as DoodleType;
                    const current = canvas.doodle?.doodles ? [...canvas.doodle.doodles] : [];
                    const currentFirst = current[0] || { type: 'question' as const, position: 'top-right' as const };
                    current[0] = { ...currentFirst, type: newType, color: canvas.doodle?.color || '#facc15' };
                    updateCanvas(canvas.id, {
                      doodle: {
                        enabled: true,
                        color: canvas.doodle?.color || '#facc15',
                        doodles: current
                      }
                    });
                  }}
                  className={`flex-1 text-xs rounded-lg px-2 py-1 border outline-none font-medium ${
                    isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {DOODLE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <select
                  value={canvas.doodle?.doodles?.[0]?.position || 'top-right'}
                  onChange={(e) => {
                    const newPos = e.target.value as DoodlePosition;
                    const current = canvas.doodle?.doodles ? [...canvas.doodle.doodles] : [];
                    const currentFirst = current[0] || { type: 'question' as const, position: 'top-right' as const };
                    current[0] = { ...currentFirst, position: newPos, color: canvas.doodle?.color || '#facc15' };
                    updateCanvas(canvas.id, {
                      doodle: {
                        enabled: true,
                        color: canvas.doodle?.color || '#facc15',
                        doodles: current
                      }
                    });
                  }}
                  className={`w-28 text-xs rounded-lg px-2 py-1 border outline-none font-medium ${
                    isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {DOODLE_POSITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Secondary Doodle */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="w-14 font-semibold text-[10px] uppercase opacity-70">Secondary:</span>
                <select
                  value={canvas.doodle?.doodles?.[1]?.type || 'none'}
                  onChange={(e) => {
                    const newType = e.target.value as DoodleType;
                    const current = canvas.doodle?.doodles ? [...canvas.doodle.doodles] : [{ type: 'question' as const, position: 'top-right' as const }];
                    if (newType === 'none') {
                      current.splice(1, 1);
                    } else {
                      const currentSecond = current[1] || { type: 'underline-wave' as const, position: 'underline' as const };
                      current[1] = { ...currentSecond, type: newType, color: canvas.doodle?.color || '#facc15' };
                    }
                    updateCanvas(canvas.id, {
                      doodle: {
                        enabled: true,
                        color: canvas.doodle?.color || '#facc15',
                        doodles: current
                      }
                    });
                  }}
                  className={`flex-1 text-xs rounded-lg px-2 py-1 border outline-none font-medium ${
                    isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {DOODLE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                <select
                  value={canvas.doodle?.doodles?.[1]?.position || 'underline'}
                  onChange={(e) => {
                    const newPos = e.target.value as DoodlePosition;
                    const current = canvas.doodle?.doodles ? [...canvas.doodle.doodles] : [{ type: 'question' as const, position: 'top-right' as const }];
                    const currentSecond = current[1] || { type: 'underline-wave' as const, position: 'underline' as const };
                    current[1] = { ...currentSecond, position: newPos, color: canvas.doodle?.color || '#facc15' };
                    updateCanvas(canvas.id, {
                      doodle: {
                        enabled: true,
                        color: canvas.doodle?.color || '#facc15',
                        doodles: current
                      }
                    });
                  }}
                  className={`w-28 text-xs rounded-lg px-2 py-1 border outline-none font-medium ${
                    isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  {DOODLE_POSITION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className={isDark ? 'bg-gray-900 text-gray-300' : ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Apply to All Screens Button */}
            {canvas.doodle?.enabled && (
              <button
                onClick={() => {
                  if (canvas.doodle) {
                    applyDoodlesToAll(canvas.doodle);
                    toast.success("Applied doodle style to all screens!");
                  }
                }}
                className={`w-full py-2 text-center rounded-xl text-xs font-bold border transition-colors ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200'
                }`}
              >
                Apply Doodles to All Screens
              </button>
            )}
          </div>
        )}

        {/* Floating Widgets Popover */}
        {showWidgetMenu && (
          <div className={`absolute top-12 left-52 z-50 rounded-2xl shadow-2xl border p-3.5 w-84 flex flex-col gap-3 ${
            isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <span className="text-xs font-bold flex items-center gap-1.5">
                <IoLayersOutline className="w-3.5 h-3.5 text-blue-400" />
                Floating UI Cards & Callouts
              </span>
              <button 
                onClick={() => setShowWidgetMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Active Widgets on this Screen */}
            {((canvas.floatingCards && canvas.floatingCards.length > 0) || (canvas.calloutPins && canvas.calloutPins.length > 0)) && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold opacity-75">Active on this screen:</span>
                <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                  {canvas.floatingCards?.map((card) => (
                    <div
                      key={card.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
                        isDark ? 'bg-zinc-800/80 border-zinc-700' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col truncate">
                        <span className="font-bold truncate">{card.title}</span>
                        <span className="text-[10px] opacity-70">Card • {card.position}</span>
                      </div>
                      <button
                        onClick={() => removeFloatingCard(canvas.id, card.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Remove Card"
                      >
                        <IoTrashOutline className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {canvas.calloutPins?.map((pin) => (
                    <div
                      key={pin.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs ${
                        isDark ? 'bg-zinc-800/80 border-zinc-700' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex flex-col truncate">
                        <span className="font-bold truncate">{pin.text}</span>
                        <span className="text-[10px] opacity-70">Callout Pin • {pin.position}</span>
                      </div>
                      <button
                        onClick={() => removeCalloutPin(canvas.id, pin.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Remove Pin"
                      >
                        <IoTrashOutline className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Presets to Add */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold opacity-75">Add Floating Card:</span>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {FLOATING_CARD_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      addFloatingCard(canvas.id, preset.config);
                      toast.success(`Added ${preset.label}`);
                    }}
                    className={`text-left p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-zinc-800/70 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                    }`}
                  >
                    <IoAdd className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Callout Pins to Add */}
            <div className={`pt-2 border-t space-y-1.5 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
              <span className="text-[11px] font-semibold opacity-75">Add Callout Pin:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {CALLOUT_PIN_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      addCalloutPin(canvas.id, preset.config);
                      toast.success(`Added ${preset.label}`);
                    }}
                    className={`text-left p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      isDark
                        ? 'bg-zinc-800/70 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                        : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                    }`}
                  >
                    <IoAdd className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="truncate">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Status Bar Sanitizer Popover */}
        {showStatusBarMenu && (
          <div className={`absolute top-12 left-64 z-50 rounded-2xl shadow-2xl border p-3.5 w-76 flex flex-col gap-3 ${
            isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <span className="text-xs font-bold flex items-center gap-1.5">
                <IoPhonePortraitOutline className="w-3.5 h-3.5 text-emerald-400" />
                Status Bar Sanitizer
              </span>
              <button 
                onClick={() => setShowStatusBarMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Toggle Status Bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Enable Status Bar</span>
              <button
                onClick={() => {
                  const currentStatus = (canvas.statusBar || globalSettings.statusBar || DEFAULT_STATUS_BAR);
                  const isEnabled = !currentStatus.enabled;
                  updateCanvas(canvas.id, {
                    statusBar: { ...currentStatus, enabled: isEnabled }
                  });
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                  (canvas.statusBar || globalSettings.statusBar)?.enabled
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : isDark ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                {(canvas.statusBar || globalSettings.statusBar)?.enabled ? 'Active' : 'Off'}
              </button>
            </div>

            {/* Status Bar OS Platform */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium opacity-75">OS Platform:</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (isAndroid) {
                      switchToAppStore();
                      toast.success('Switched to iPhone for iOS status bar');
                    }
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                    !isAndroid
                      ? isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900 text-white border-zinc-800'
                      : isDark ? 'border-zinc-800 text-zinc-400 hover:text-white' : 'border-gray-200 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <IoLogoApple className="w-3 h-3" />
                  <span>iOS (iPhone)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isAndroid) {
                      switchToPlayStore();
                      toast.success('Switched to Android device for Android status bar');
                    }
                  }}
                  className={`py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                    isAndroid
                      ? isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900 text-white border-zinc-800'
                      : isDark ? 'border-zinc-800 text-zinc-400 hover:text-white' : 'border-gray-200 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <IoLogoGooglePlaystore className="w-3 h-3" />
                  <span>Android</span>
                </button>
              </div>
            </div>

            {/* Time Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium opacity-75">Status Bar Time:</label>
              <input
                type="text"
                value={(canvas.statusBar || globalSettings.statusBar)?.time || '9:41'}
                onChange={(e) => {
                  const currentStatus = (canvas.statusBar || globalSettings.statusBar || DEFAULT_STATUS_BAR);
                  updateCanvas(canvas.id, {
                    statusBar: { ...currentStatus, time: e.target.value }
                  });
                }}
                placeholder="9:41"
                className={`w-full px-3 py-1.5 rounded-lg border text-xs outline-none ${
                  isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              />
            </div>

            {/* Icon Theme Toggle */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium opacity-75">Icon Color Theme:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {['light', 'dark'].map((th) => (
                  <button
                    key={th}
                    onClick={() => {
                      const currentStatus = (canvas.statusBar || globalSettings.statusBar || DEFAULT_STATUS_BAR);
                      updateCanvas(canvas.id, {
                        statusBar: { ...currentStatus, theme: th as 'light' | 'dark' }
                      });
                    }}
                    className={`py-1.5 rounded-lg text-xs font-bold capitalize border transition-all ${
                      ((canvas.statusBar || globalSettings.statusBar)?.theme || 'light') === th
                        ? isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900 text-white border-zinc-800'
                        : isDark ? 'border-zinc-800 text-zinc-400' : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    {th} Text
                  </button>
                ))}
              </div>
            </div>

            {/* Battery Level */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-medium opacity-75">
                <span>Battery Level:</span>
                <span>{(canvas.statusBar || globalSettings.statusBar)?.batteryLevel ?? 100}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={(canvas.statusBar || globalSettings.statusBar)?.batteryLevel ?? 100}
                onChange={(e) => {
                  const currentStatus = (canvas.statusBar || globalSettings.statusBar || DEFAULT_STATUS_BAR);
                  updateCanvas(canvas.id, {
                    statusBar: { ...currentStatus, batteryLevel: Number(e.target.value) }
                  });
                }}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Resizable Text Box Popover */}
        {showTextBoxMenu && (
          <div className={`absolute top-12 left-44 z-50 rounded-2xl shadow-2xl border p-4 w-80 flex flex-col gap-3.5 ${
            isDark ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-gray-800' : 'border-gray-100'
            }`}>
              <span className="text-xs font-bold flex items-center gap-1.5">
                <IoResizeOutline className="w-3.5 h-3.5 text-indigo-400" />
                Text Box Dimensions & Size
              </span>
              <button 
                onClick={() => setShowTextBoxMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Width Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Text Box Width:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-indigo-400">{currentTextBoxWidth}%</span>
                  {canvas.textBoxWidth !== undefined && (
                    <button
                      onClick={() => updateCanvas(canvas.id, { textBoxWidth: undefined })}
                      className="text-[10px] text-gray-400 hover:text-gray-200 underline"
                    >
                      Auto
                    </button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min="25"
                max="100"
                step="1"
                value={currentTextBoxWidth}
                onChange={(e) => updateCanvas(canvas.id, { textBoxWidth: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="grid grid-cols-4 gap-1 text-[10px]">
                {[40, 54, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => updateCanvas(canvas.id, { textBoxWidth: pct })}
                    className={`py-1 rounded border font-medium transition-all ${
                      currentTextBoxWidth === pct
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Title Font Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Title Font Size:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-indigo-400">{effectiveTitleFontSize}px</span>
                  {canvas.titleFontSize !== undefined && (
                    <button
                      onClick={() => updateCanvas(canvas.id, { titleFontSize: undefined })}
                      className="text-[10px] text-gray-400 hover:text-gray-200 underline"
                    >
                      Auto
                    </button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min="16"
                max="72"
                step="1"
                value={effectiveTitleFontSize}
                onChange={(e) => updateCanvas(canvas.id, { titleFontSize: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <div className="grid grid-cols-4 gap-1 text-[10px]">
                {[22, 28, 36, 44].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateCanvas(canvas.id, { titleFontSize: sz })}
                    className={`py-1 rounded border font-medium transition-all ${
                      effectiveTitleFontSize === sz
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitle Font Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Subtitle Font Size:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-indigo-400">{effectiveSubtitleFontSize}px</span>
                  {canvas.subtitleFontSize !== undefined && (
                    <button
                      onClick={() => updateCanvas(canvas.id, { subtitleFontSize: undefined })}
                      className="text-[10px] text-gray-400 hover:text-gray-200 underline"
                    >
                      Auto
                    </button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min="11"
                max="36"
                step="1"
                value={effectiveSubtitleFontSize}
                onChange={(e) => updateCanvas(canvas.id, { subtitleFontSize: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Text Alignment */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold">Alignment:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ].map((al) => (
                  <button
                    key={al.value}
                    onClick={() => updateCanvas(canvas.id, { textAlign: al.value as 'left' | 'center' | 'right' })}
                    className={`py-1 rounded-lg text-xs font-semibold border transition-all ${
                      effectiveTextAlign === al.value
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {al.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply to All Screens & Reset */}
            <div className="flex gap-2 pt-2 border-t border-zinc-800/40">
              <button
                onClick={() => {
                  applyTextBoxToAll(
                    canvas.textBoxWidth,
                    canvas.titleFontSize,
                    canvas.subtitleFontSize,
                    canvas.textAlign
                  );
                  toast.success("Applied text box dimensions to all screens!");
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200'
                }`}
              >
                Apply to All Screens
              </button>
              <button
                onClick={() => {
                  updateCanvas(canvas.id, {
                    textBoxWidth: undefined,
                    titleFontSize: undefined,
                    subtitleFontSize: undefined,
                    textAlign: undefined,
                  });
                  toast.success("Reset to layout defaults");
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border text-amber-400 hover:bg-amber-950/20 border-amber-500/30 transition-colors`}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Scaled Preview Canvas */}
      <div
        className={`origin-top overflow-hidden transition-all duration-150 ${
          isPreviewMode ? 'pointer-events-none' : 'shadow-2xl rounded-3xl border border-black/20'
        }`}
        style={{ 
          transform: `scale(${zoomScale})`,
          marginBottom: `calc(${canvasHeight}px * (${zoomScale} - 1))`,
          marginLeft: (isPreviewMode || targetWidth) ? `calc(${canvasWidth}px * (${zoomScale} - 1) / 2)` : undefined,
          marginRight: (isPreviewMode || targetWidth) ? `calc(${canvasWidth}px * (${zoomScale} - 1) / 2)` : undefined,
        }}
      >
        <div
          id={`canvas-${canvas.id}`}
          className={`relative overflow-hidden select-none ${layoutConfig.containerClass}`}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            ...(globalSettings.panorama?.enabled
              ? getPanoramaSliceStyle(index, total, globalSettings.panorama)
              : { background: canvas.backgroundColor || '#000000' }),
            fontFamily: fontConfig.fontFamily,
          }}
        >
          {/* Floating UI Cards */}
          {canvas.floatingCards?.map((card) => (
            <FloatingCard
              key={card.id}
              card={card}
              onRemove={() => removeFloatingCard(canvas.id, card.id)}
            />
          ))}

          {/* Callout Pins */}
          {canvas.calloutPins?.map((pin) => (
            <CalloutPin
              key={pin.id}
              pin={pin}
              onRemove={() => removeCalloutPin(canvas.id, pin.id)}
            />
          ))}

          {/* Anchored Movable Social Proof Badge */}
          {canvas.badge?.enabled &&
            ((canvas.badge.position && canvas.badge.position !== 'inline') ||
              currentLayout === 'device-only') &&
            renderMovableBadge(true)}

          {/* Background Image Overlay */}
          {canvas.backgroundImageSrc && !globalSettings.panorama?.enabled && (
            <div className="absolute inset-0 bg-black/40 z-0" />
          )}

          {/* Subtle Organic Curved Watermark Pattern for Kinetic Banner */}
          {currentLayout === 'banner-kinetic-stack' && (
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden z-0">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                  <pattern id={`banana-pattern-${canvas.id}`} width="130" height="95" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
                    <path
                      d="M20,65 C45,80 80,72 100,42 C88,58 58,64 32,54 C24,50 18,54 20,65 Z"
                      fill="currentColor"
                      className="text-amber-500"
                    />
                    <path
                      d="M80,24 C90,32 104,26 108,14 C103,20 92,22 82,18 Z"
                      fill="currentColor"
                      className="text-amber-600"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#banana-pattern-${canvas.id})`} />
              </svg>
            </div>
          )}

          {/* Responsive Text & Badge Section */}
          {currentLayout !== 'device-only' && (
            <div 
              className={`group/textbox relative transition-all ${layoutConfig.textContainerClass}`}
              style={{
                width: canvas.textBoxWidth ? `${canvas.textBoxWidth}%` : undefined,
              }}
            >
              {/* Visual selection outline on hover/resizing (no-export) */}
              {!isPreviewMode && (
                <div className={`absolute inset-0 rounded-2xl border transition-colors pointer-events-none no-export ${
                  isResizingTextBox
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40 bg-indigo-500/5'
                    : 'border-transparent group-hover/textbox:border-indigo-400/40'
                }`} />
              )}

              {/* Interactive Resize Handles & Dimensions HUD (no-export) */}
              {!isPreviewMode && (
                <>
                  {/* Floating HUD on hover or active */}
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 no-export ${
                    isResizingTextBox ? 'opacity-100' : 'opacity-0 group-hover/textbox:opacity-100 focus-within:opacity-100'
                  } transition-opacity z-50 pointer-events-auto flex items-center gap-1.5 bg-gray-950/95 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-2xl border border-white/20 whitespace-nowrap`}>
                    <IoResizeOutline className="w-3 h-3 text-indigo-400" />
                    <span>Width: {currentTextBoxWidth}%</span>
                    <span className="opacity-40">|</span>
                    <span>Title: {effectiveTitleFontSize}px</span>
                    
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newW = Math.max(25, currentTextBoxWidth - 5);
                        updateCanvas(canvas.id, { textBoxWidth: newW });
                      }}
                      className="w-4 h-4 rounded hover:bg-white/20 flex items-center justify-center font-bold text-xs"
                      title="Narrower (-5%)"
                    >
                      -
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newW = Math.min(100, currentTextBoxWidth + 5);
                        updateCanvas(canvas.id, { textBoxWidth: newW });
                      }}
                      className="w-4 h-4 rounded hover:bg-white/20 flex items-center justify-center font-bold text-xs"
                      title="Wider (+5%)"
                    >
                      +
                    </button>
                    
                    {(canvas.textBoxWidth || canvas.titleFontSize || canvas.subtitleFontSize || canvas.textAlign) && (
                      <>
                        <span className="opacity-40">|</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateCanvas(canvas.id, {
                              textBoxWidth: undefined,
                              titleFontSize: undefined,
                              subtitleFontSize: undefined,
                              textAlign: undefined,
                            });
                            toast.success("Reset text box to layout default");
                          }}
                          className="text-[9px] text-amber-300 hover:text-amber-200 uppercase tracking-wider pl-0.5"
                          title="Reset to layout defaults"
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </div>

                  {/* Right Resize Handle */}
                  {effectiveTextAlign !== 'right' && (
                    <div
                      onPointerDown={(e) => handleResizeStart(e, 'right')}
                      className={`absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center cursor-ew-resize shadow-2xl z-40 transition-transform hover:scale-110 no-export ${
                        isResizingTextBox ? 'opacity-100 scale-110' : 'opacity-0 group-hover/textbox:opacity-100 focus-within:opacity-100'
                      } border border-white/40`}
                      title="Drag to resize text box width"
                    >
                      <div className="w-0.5 h-4 bg-white/80 rounded-full" />
                    </div>
                  )}

                  {/* Left Resize Handle */}
                  {effectiveTextAlign !== 'left' && (
                    <div
                      onPointerDown={(e) => handleResizeStart(e, 'left')}
                      className={`absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center cursor-ew-resize shadow-2xl z-40 transition-transform hover:scale-110 no-export ${
                        isResizingTextBox ? 'opacity-100 scale-110' : 'opacity-0 group-hover/textbox:opacity-100 focus-within:opacity-100'
                      } border border-white/40`}
                      title="Drag to resize text box width"
                    >
                      <div className="w-0.5 h-4 bg-white/80 rounded-full" />
                    </div>
                  )}

                  {/* Corner Scale Handle */}
                  <div
                    onPointerDown={(e) => handleResizeStart(e, 'corner')}
                    className={`absolute bottom-0 ${
                      effectiveTextAlign === 'right' ? '-left-2.5' : '-right-2.5'
                    } translate-y-2.5 w-5 h-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center ${
                      effectiveTextAlign === 'right' ? 'cursor-nesw-resize' : 'cursor-nwse-resize'
                    } shadow-2xl z-40 transition-transform hover:scale-125 no-export ${
                      isResizingTextBox ? 'opacity-100 scale-125' : 'opacity-0 group-hover/textbox:opacity-100 focus-within:opacity-100'
                    } border-2 border-white`}
                    title="Drag corner to scale font size & width"
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </>
              )}

              {/* Badge Sticker (Inline Flow) */}
              {canvas.badge?.enabled &&
                (!canvas.badge.position || canvas.badge.position === 'inline') &&
                renderMovableBadge(false)}

              {/* Title & Hand-Drawn Doodle Accents */}
              {currentLayout === 'banner-kinetic-stack' ? (
                <div className="w-full flex flex-col justify-center select-none overflow-hidden relative group/kinetic">
                  <div className="mb-1 w-full relative z-20">
                    <TextareaAutosize
                      value={canvas.title}
                      onChange={(e) => updateCanvas(canvas.id, { title: e.target.value })}
                      className="w-full bg-black/5 hover:bg-black/10 focus:bg-black/15 border border-black/15 focus:border-black/30 rounded-lg px-2 py-0.5 outline-none font-bold text-xs resize-none transition-all placeholder-black/40"
                      style={{ color: canvas.textColor || '#000000' }}
                      placeholder="Type repeating word (e.g. Platano)"
                      title="Edit repeating keyword"
                    />
                  </div>

                  {/* Vertical Kinetic Typography Stack */}
                  <div className="flex flex-col -my-2 select-none overflow-hidden relative">
                    {Array.from({ length: 9 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="text-[34px] sm:text-[46px] font-black tracking-tight leading-[1.03] select-none truncate transition-transform hover:translate-x-1"
                        style={{
                          color: canvas.textColor || '#000000',
                          fontFamily: fontConfig.fontFamily,
                        }}
                      >
                        {canvas.title || 'Platano'}
                      </span>
                    ))}
                    <DoodleAccentGroup doodle={canvas.doodle} defaultColor="#facc15" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative w-full">
                    <TextareaAutosize
                      value={canvas.title}
                      onChange={(e) => updateCanvas(canvas.id, { title: e.target.value })}
                      className={`w-full bg-transparent border-2 border-transparent hover:border-white/20 focus:border-white/40 focus:bg-white/5 rounded-xl px-3 py-1 outline-none font-extrabold placeholder-white/50 tracking-tight leading-tight transition-all resize-none overflow-hidden relative z-10 break-words hyphens-none ${
                        canvas.titleFontSize
                          ? 'mb-2'
                          : isHalfLayout 
                            ? (isCompact ? 'text-[22px] mb-1' : 'text-[28px] mb-2')
                            : (isCompact ? 'text-[28px] mb-1' : 'text-[40px] mb-2')
                      } ${
                        canvas.gradientText 
                          ? 'bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-sm' 
                          : ''
                      }`}
                      style={{ 
                        fontSize: canvas.titleFontSize ? `${canvas.titleFontSize}px` : undefined,
                        color: canvas.gradientText ? undefined : (canvas.textColor || '#ffffff'), 
                        textAlign: effectiveTextAlign 
                      }}
                      placeholder="Enter Title"
                    />
                    <DoodleAccentGroup doodle={canvas.doodle} defaultColor="#facc15" />
                  </div>

                  {/* Subtitle (Only if not split-vertical) */}
                  {currentLayout !== 'split-vertical' && (
                    <TextareaAutosize
                      value={canvas.subtitle}
                      onChange={(e) => updateCanvas(canvas.id, { subtitle: e.target.value })}
                      className={`w-full bg-transparent border-2 border-transparent hover:border-white/20 focus:border-white/40 focus:bg-white/5 rounded-xl px-3 py-2 outline-none font-medium placeholder-white/50 resize-none overflow-hidden leading-relaxed transition-all break-words hyphens-none ${
                        canvas.subtitleFontSize
                          ? ''
                          : isHalfLayout
                            ? (isCompact ? 'text-xs' : 'text-sm sm:text-base')
                            : (isCompact ? 'text-sm' : 'text-lg sm:text-xl')
                      }`}
                      style={{
                        fontSize: canvas.subtitleFontSize ? `${canvas.subtitleFontSize}px` : undefined,
                        color: canvas.subtitleColor || canvas.textColor || '#ffffff',
                        textAlign: effectiveTextAlign
                      }}
                      placeholder="Enter Subtitle"
                    />
                  )}
                </>
              )}

              {/* Native App Store Badge (Social Graphics) */}
              {canvas.showAppStoreBadge && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isAndroid) {
                      switchToAppStore();
                      toast.success('Switched to iPhone for App Store');
                    } else {
                      switchToPlayStore();
                      toast.success('Switched to Android device for Google Play');
                    }
                  }}
                  title={isAndroid ? "Click to switch to iPhone (App Store)" : "Click to switch to Android (Google Play)"}
                  className={`mt-2 flex items-center gap-1.5 bg-black text-white px-3.5 py-1.5 rounded-lg border border-white/20 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer w-max ${effectiveTextAlign === 'center' ? 'mx-auto' : ''} ${effectiveTextAlign === 'right' ? 'ml-auto' : ''}`}
                >
                  {!isAndroid ? (
                    <>
                      <IoLogoApple className="w-[22px] h-[22px]" />
                      <div className="flex flex-col text-left justify-center">
                        <span className="text-[7px] uppercase tracking-wide leading-none opacity-80 mb-0.5">Download on the</span>
                        <span className="text-[14px] font-semibold leading-none tracking-tight">App Store</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <IoLogoGooglePlaystore className="w-[20px] h-[20px]" />
                      <div className="flex flex-col text-left justify-center pl-0.5">
                        <span className="text-[7px] uppercase tracking-wide leading-none opacity-80 mb-0.5">GET IT ON</span>
                        <span className="text-[14px] font-semibold leading-none tracking-tight">Google Play</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Subtitle Container for split-vertical */}
          {currentLayout === 'split-vertical' && layoutConfig.subtitleContainerClass && (
            <div 
              className={layoutConfig.subtitleContainerClass}
              style={{
                width: canvas.textBoxWidth ? `${canvas.textBoxWidth}%` : undefined,
              }}
            >
              <TextareaAutosize
                value={canvas.subtitle}
                onChange={(e) => updateCanvas(canvas.id, { subtitle: e.target.value })}
                className={`w-full bg-transparent border-2 border-transparent hover:border-white/20 focus:border-white/40 focus:bg-white/5 rounded-xl px-3 py-2 outline-none font-medium placeholder-white/50 resize-none overflow-hidden leading-relaxed transition-all break-words hyphens-none ${
                  canvas.subtitleFontSize
                    ? ''
                    : isCompact ? 'text-sm' : 'text-xl'
                }`}
                style={{
                  fontSize: canvas.subtitleFontSize ? `${canvas.subtitleFontSize}px` : undefined,
                  color: canvas.subtitleColor || canvas.textColor || '#ffffff',
                  textAlign: effectiveTextAlign
                }}
                placeholder="Enter Subtitle"
              />
            </div>
          )}

          {/* Adaptive Phone Mockup Section */}
          <div 
            className={layoutConfig.phoneWrapperClass}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={handlePhoneDrop}
          >
            <div className="group/phone relative transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <MinimalPhoneFrame 
                width={phoneW} 
                height={phoneH} 
                targetSizeId={globalSettings.targetSize}
                mockupStyle={globalSettings.mockupStyle}
                showNotch={globalSettings.showNotch}
                statusBar={canvas.statusBar || globalSettings.statusBar}
              >
                {canvas.imageSrc ? (
                <div className={`w-full h-full relative group/img bg-black flex items-center justify-center`}>
                  <CanvasImage canvas={canvas} />
                  <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity"
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
                    >
                      <IoCloudUploadOutline className="w-4 h-4" />
                      Change Image
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setIsEditingImage(true); }}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
                    >
                      <IoOptionsOutline className="w-4 h-4" />
                      Edit & Filter
                    </button>
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        updateCanvas(canvas.id, { imageFit: canvas.imageFit === 'contain' ? 'cover' : 'contain' });
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-full transition-colors"
                    >
                      Fit: {canvas.imageFit === 'contain' ? 'Contain' : 'Cover'}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IoCloudUploadOutline className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-xs font-semibold text-gray-500">Upload Screenshot</span>
                </div>
              )}
            </MinimalPhoneFrame>
            </div>
            
            {(currentLayout === 'banner-stack-right' || currentLayout === 'banner-kinetic-stack') && (
              <>
                <div className="absolute top-8 -left-[28%] group/phone transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer -z-10 opacity-95 scale-[0.85]"
                     onClick={() => fileInputRef.current?.click()}>
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                  >
                    {nextCanvas?.imageSrc || canvas.imageSrc || undefined ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage canvas={nextCanvas?.imageSrc ? nextCanvas : canvas} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-4">
                        <IoCloudUploadOutline className="w-12 h-12" />
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
                <div className="absolute top-16 -left-[56%] group/phone transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer -z-20 opacity-80 scale-[0.7]"
                     onClick={() => fileInputRef.current?.click()}>
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                  >
                    {nextNextCanvas?.imageSrc || canvas.imageSrc || undefined ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage canvas={nextNextCanvas?.imageSrc ? nextNextCanvas : canvas} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-4">
                        <IoCloudUploadOutline className="w-12 h-12" />
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
              </>
            )}

            {(currentLayout === 'banner-triple-bottom') && (
              <>
                <div className="absolute top-12 -left-[95%] group/phone transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer -z-10 scale-[0.85]"
                     onClick={() => fileInputRef.current?.click()}>
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                  >
                    {nextCanvas?.imageSrc || canvas.imageSrc || undefined ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage canvas={nextCanvas?.imageSrc ? nextCanvas : canvas} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-4">
                        <IoCloudUploadOutline className="w-12 h-12" />
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
                <div className="absolute top-12 -right-[95%] group/phone transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer -z-10 scale-[0.85]"
                     onClick={() => fileInputRef.current?.click()}>
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                  >
                    {nextNextCanvas?.imageSrc || canvas.imageSrc || undefined ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage canvas={nextNextCanvas?.imageSrc ? nextNextCanvas : canvas} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-4">
                        <IoCloudUploadOutline className="w-12 h-12" />
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
              </>
            )}
            
            {currentLayout === 'og-style-3' && (
              <>
                <div className="absolute top-12 left-16 group/phone transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer -z-10 opacity-90 scale-95"
                     onClick={() => fileInputRef.current?.click()}>
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                  >
                    {canvas.imageSrc ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage canvas={canvas} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-4">
                        <IoCloudUploadOutline className="w-12 h-12" />
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
                <div className="absolute top-24 left-32 group/phone transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer -z-20 opacity-80 scale-90"
                     onClick={() => fileInputRef.current?.click()}>
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                  >
                    {canvas.imageSrc ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage canvas={canvas} />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 gap-4">
                        <IoCloudUploadOutline className="w-12 h-12" />
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      {isEditingImage && <ImageEditorModal canvas={canvas} onClose={() => setIsEditingImage(false)} />}
    </div>
  );
});
