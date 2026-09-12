'use client';

import React, { useRef, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CanvasItem, GlobalSettings, LayoutType, useEditorStore } from '@/store/useEditorStore';
import { processUploadedFiles } from '@/utils/imageProcessor';
import { CanvasImage } from './CanvasImage';
import { ImageEditorModal } from './ImageEditorModal';
import { MinimalPhoneFrame } from './MinimalPhoneFrame';
import { FloatingCard } from './FloatingCard';
import { CalloutPin } from './CalloutPin';
import {
  IoCloudUploadOutline,
  IoTrashOutline,
  IoBrowsersOutline,
  IoChevronBack,
  IoChevronForward,
  IoCopyOutline,
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
  IoRefreshOutline,
} from 'react-icons/io5';
import TextareaAutosize from 'react-textarea-autosize';
import { TARGET_SIZES, isAndroidDevice } from '@/config/sizes';
import { FONT_OPTIONS } from '@/config/fonts';
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
import { DEFAULT_STATUS_BAR } from '@/config/statusBar';
import { useShallow } from 'zustand/react/shallow';


export interface CanvasEditorProps {
  settings?: GlobalSettings;
  renderId?: string;
  canvas: CanvasItem;
  index: number;
  total: number;
  isPreviewMode?: boolean;
  editableTextBox?: boolean;
  targetWidth?: number;
  prevCanvas?: CanvasItem;
  nextCanvas?: CanvasItem;
  nextNextCanvas?: CanvasItem;
}

export const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
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
  { value: 'multi-screen-right', label: 'Multi-Screen Bleed Right (3 Phones)' },
  { value: 'multi-screen-left', label: 'Multi-Screen Bleed Left (3 Phones)' },
  { value: 'multi-screen-center', label: 'Multi-Screen Center Trio (3 Phones)' },
  { value: 'banner-kinetic-stack', label: 'Kinetic Repeating Banner (3 Phones)' },
  { value: 'banner-stack-right', label: 'Banner Stacked Right' },
  { value: 'banner-triple-bottom', label: 'Banner Triple Bottom' },
  { value: 'og-style-1', label: 'Social Graphic - Clean Studio' },
  { value: 'og-style-2', label: 'Social Graphic - Angled Focus' },
  { value: 'og-style-3', label: 'Social Graphic - 3D Perspective' },
  { value: 'device-only', label: 'Device Only (Clean Mockup)' },
  { value: 'trio-row', label: 'Trio Row (3 Mockups Side-by-Side)' },
  { value: 'duo-row', label: 'Duo Row (2 Mockups Side-by-Side)' },
];

export const getDefaultTextBoxWidth = (layout: LayoutType): number => {
  switch (layout) {
    case 'multi-screen-right':
    case 'multi-screen-left':
    case 'multi-screen-center':
      return 88;
    case 'half-right':
    case 'half-left':
      return 50;
    case 'banner-stack-right':
      return 48;
    case 'banner-kinetic-stack':
      return 44;
    case 'og-style-1':
      return 50;
    case 'og-style-2':
      return 48;
    case 'og-style-3':
      return 45;
    case '3d-isometric-right':
    case '3d-isometric-left':
      return 58;
    case 'tilt-right':
    case 'tilt-left':
    case 'tilt-right-complement':
    case 'tilt-left-complement':
    case 'tilt-bottom-right':
    case 'tilt-bottom-left':
      return 60;
    case 'hero-center':
    case 'hero-3d-center':
      return 85;
    default:
      return 100;
  }
};

function CanvasButton({ readOnly, ...props }: React.ComponentProps<'button'> & { readOnly: boolean }) {
  return readOnly ? null : <button {...props} />;
}

function CanvasText({ maxRenderHeight, ...props }: React.ComponentProps<typeof TextareaAutosize> & { maxRenderHeight?: number }) {
  if (!props.readOnly) return <TextareaAutosize {...props} />;
  if (!props.value) return null;
  return <div data-render-text className={props.className} style={{ ...props.style, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: maxRenderHeight, overflow: 'hidden', transition: 'none' }}>{props.value}</div>;
}

export const CanvasEditor = React.memo(function CanvasEditor({ canvas: savedCanvas, index, total, isPreviewMode = false, editableTextBox = false, targetWidth, prevCanvas, nextCanvas, nextNextCanvas, settings, renderId }: CanvasEditorProps) {
  const [resizeDraft, setResizeDraft] = useState<Partial<CanvasItem> | null>(null);
  const canvas = resizeDraft ? { ...savedCanvas, ...resizeDraft } : savedCanvas;
  const resizeCleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => resizeCleanup.current?.(), []);
  const { 
    globalSettings: liveSettings,
    updateCanvas, 
    removeCanvas, 
    moveCanvas, 
    duplicateCanvas,
    applyLayoutToAll,
    applyContentToAll,
    applyTextBoxToAll,
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
    applyDoodlesToAll: state.applyDoodlesToAll,
    setIsDraggingGlobal: state.setIsDraggingGlobal,
    addFloatingCard: state.addFloatingCard,
    removeFloatingCard: state.removeFloatingCard,
    addCalloutPin: state.addCalloutPin,
    removeCalloutPin: state.removeCalloutPin,
    switchToAppStore: state.switchToAppStore,
    switchToPlayStore: state.switchToPlayStore,
  })));
  const globalSettings = settings || liveSettings;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDoodleMenu, setShowDoodleMenu] = useState(false);
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);
  const [showStatusBarMenu, setShowStatusBarMenu] = useState(false);
  const [showTextBoxMenu, setShowTextBoxMenu] = useState(false);
  const [isResizingTextBox, setIsResizingTextBox] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);

  const isDark = globalSettings.theme !== 'light';
  const isAndroid = isAndroidDevice(globalSettings.targetSize);
  const uploadSlotRef = useRef<'primary' | 'secondary' | 'tertiary'>('primary');

  const processSingleFile = async (file: File, slot: 'primary' | 'secondary' | 'tertiary' = 'primary') => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    if (slot === 'primary') {
      updateCanvas(canvas.id, { imageSrc: url });
      toast.success('Screenshot replaced');
    } else if (slot === 'secondary') {
      updateCanvas(canvas.id, { secondaryImageSrc: url });
      toast.success("Secondary screen updated!");
    } else if (slot === 'tertiary') {
      updateCanvas(canvas.id, { tertiaryImageSrc: url });
      toast.success("Tertiary screen updated!");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processSingleFile(file, uploadSlotRef.current);
    }
    if (e.target) e.target.value = '';
  };

  const handlePhoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGlobal(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      
      // Process the first file for this specific canvas
      await processSingleFile(files[0], uploadSlotRef.current);
      
      // If there are more files, process them globally (fills empty canvases or appends)
      if (files.length > 1 && uploadSlotRef.current === 'primary') {
        await processUploadedFiles(files.slice(1));
      }
    }
  };

  const handleSpecificPhoneDrop = async (e: React.DragEvent, slot: 'primary' | 'secondary' | 'tertiary') => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGlobal(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      await processSingleFile(files[0], slot);
    }
  };

  const sizeConfig = TARGET_SIZES[globalSettings.targetSize] || TARGET_SIZES['ios-6.5'];
  const canvasWidth = sizeConfig.logicalWidth;
  const canvasHeight = sizeConfig.logicalHeight;
  const zoomScale = targetWidth ? (targetWidth / canvasWidth) : (globalSettings.zoomScale || 0.65);
  
  const currentLayout = canvas.layout || 'basic-top';
  const isCompact = canvasHeight < 750;
  const isMultiScreen = 
    currentLayout === 'multi-screen-right' || 
    currentLayout === 'multi-screen-left' || 
    currentLayout === 'multi-screen-center';
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
    let heightFactor = 0.62;
    if (currentLayout === 'device-only') heightFactor = 0.82;
    else if (currentLayout === 'half-right' || currentLayout === 'half-left') heightFactor = 0.70;
    else if (currentLayout === 'tilt-right' || currentLayout === 'tilt-left' || currentLayout === 'tilt-right-complement' || currentLayout === 'tilt-left-complement') heightFactor = 0.68;
    else if (currentLayout === 'tilt-bottom-right' || currentLayout === 'tilt-bottom-left') heightFactor = 0.66;
    else if (currentLayout === 'split-vertical') heightFactor = 0.52;
    else if (currentLayout === 'trio-row') heightFactor = 0.58;
    else if (currentLayout === 'duo-row') heightFactor = 0.68;
    else if (isMultiScreen) heightFactor = 0.66;
    else if (isCompact) heightFactor = 0.54;

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
          containerClass: "flex flex-col justify-between items-center overflow-hidden",
          textContainerClass: `w-full px-6 pt-7 pb-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-1.5`,
          phoneWrapperClass: "w-full flex justify-center items-start flex-1 overflow-hidden relative pt-3",
          textAlign: "center" as const,
        };
      case 'basic-bottom':
        return {
          containerClass: "flex flex-col-reverse justify-between items-center overflow-hidden",
          textContainerClass: `w-full px-6 pb-7 pt-2 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-1.5`,
          phoneWrapperClass: "w-full flex justify-center items-end flex-1 overflow-hidden relative pb-3",
          textAlign: "center" as const,
        };
      case 'tilt-right':
        return {
          containerClass: "relative overflow-hidden",
          textContainerClass: `absolute top-0 left-0 w-[60%] pt-8 px-7 text-left z-20 flex flex-col items-start gap-2`,
          phoneWrapperClass: "absolute -bottom-16 -right-10 rotate-[12deg] origin-bottom-right z-10",
          textAlign: "left" as const,
        };
      case 'tilt-right-complement':
        return {
          containerClass: "relative overflow-hidden",
          textContainerClass: `absolute top-0 right-0 w-[60%] pt-8 px-7 text-right z-20 flex flex-col items-end gap-2`,
          phoneWrapperClass: "absolute -bottom-16 -left-[160px] rotate-[12deg] origin-bottom-left z-10",
          textAlign: "right" as const,
        };
      case 'tilt-left':
        return {
          containerClass: "relative overflow-hidden",
          textContainerClass: `absolute top-0 right-0 w-[60%] pt-8 px-7 text-right z-20 flex flex-col items-end gap-2`,
          phoneWrapperClass: "absolute -bottom-16 -left-10 -rotate-[12deg] origin-bottom-left z-10",
          textAlign: "right" as const,
        };
      case 'tilt-left-complement':
        return {
          containerClass: "relative overflow-hidden",
          textContainerClass: `absolute top-0 left-0 w-[60%] pt-8 px-7 text-left z-20 flex flex-col items-start gap-2`,
          phoneWrapperClass: "absolute -bottom-16 -right-[160px] -rotate-[12deg] origin-bottom-right z-10",
          textAlign: "left" as const,
        };
      case 'tilt-bottom-right':
        return {
          containerClass: "relative overflow-hidden",
          textContainerClass: `absolute bottom-0 left-0 w-[60%] pb-10 px-7 text-left z-20 flex flex-col items-start gap-2`,
          phoneWrapperClass: "absolute -top-16 -right-10 rotate-[12deg] origin-top-right z-10",
          textAlign: "left" as const,
        };
      case 'tilt-bottom-left':
        return {
          containerClass: "relative overflow-hidden",
          textContainerClass: `absolute bottom-0 right-0 w-[60%] pb-10 px-7 text-right z-20 flex flex-col items-end gap-2`,
          phoneWrapperClass: "absolute -top-16 -left-10 -rotate-[12deg] origin-top-left z-10",
          textAlign: "right" as const,
        };
      case 'half-right':
        return {
          containerClass: "relative flex items-center justify-start overflow-hidden",
          textContainerClass: `w-[50%] pl-8 pr-2 text-left z-20 flex flex-col justify-center items-start gap-2.5`,
          phoneWrapperClass: `absolute top-1/2 right-0 [transform:translate(40%,-50%)] z-10`,
          textAlign: "left" as const,
        };
      case 'half-left':
        return {
          containerClass: "relative flex items-center justify-end overflow-hidden",
          textContainerClass: `w-[50%] pr-8 pl-2 text-right z-20 flex flex-col justify-center items-end gap-2.5`,
          phoneWrapperClass: `absolute top-1/2 left-0 [transform:translate(-40%,-50%)] z-10`,
          textAlign: "right" as const,
        };
      case 'split-vertical':
        return {
          containerClass: "flex flex-col justify-between items-center overflow-hidden",
          textContainerClass: "w-full px-6 pt-6 pb-1 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-1.5",
          subtitleContainerClass: "w-full px-6 pb-6 pt-1 text-center z-20 flex-shrink-0 flex flex-col items-center justify-center gap-1.5",
          phoneWrapperClass: "w-full flex justify-center items-center flex-1 overflow-hidden relative",
          textAlign: "center" as const,
        };
      case '3d-isometric-right':
        return {
          containerClass: "relative [perspective:2000px] overflow-hidden",
          textContainerClass: "absolute top-0 left-0 w-[58%] pt-8 px-7 text-left z-20 flex flex-col items-start gap-2",
          phoneWrapperClass: "absolute -bottom-20 -right-20 z-10 [transform:rotateX(15deg)_rotateY(-35deg)_rotateZ(10deg)_scale(0.82)] shadow-[20px_40px_60px_rgba(0,0,0,0.5)] transition-transform duration-300",
          textAlign: "left" as const,
        };
      case '3d-isometric-left':
        return {
          containerClass: "relative [perspective:2000px] overflow-hidden",
          textContainerClass: "absolute top-0 right-0 w-[58%] pt-8 px-7 text-right z-20 flex flex-col items-end gap-2",
          phoneWrapperClass: "absolute -bottom-20 -left-20 z-10 [transform:rotateX(15deg)_rotateY(35deg)_rotateZ(-10deg)_scale(0.82)] shadow-[-20px_40px_60px_rgba(0,0,0,0.5)] transition-transform duration-300",
          textAlign: "right" as const,
        };
      case 'og-style-1':
        return {
          containerClass: "relative flex items-center bg-white overflow-hidden",
          textContainerClass: "w-[50%] pl-10 pr-3 text-left z-20 flex flex-col justify-center items-start gap-3",
          phoneWrapperClass: "absolute top-1/2 -right-8 -translate-y-1/2 z-10 scale-[1.05]",
          textAlign: "left" as const,
        };
      case 'og-style-2':
        return {
          containerClass: "relative flex items-center overflow-hidden",
          textContainerClass: "w-[48%] pl-10 pr-3 text-left z-20 flex flex-col justify-center items-start gap-4",
          phoneWrapperClass: "absolute -bottom-24 -right-12 z-10 scale-[1.2] [transform:rotate(-15deg)]",
          textAlign: "left" as const,
        };
      case 'og-style-3':
        return {
          containerClass: "relative flex items-center overflow-hidden [perspective:2000px]",
          textContainerClass: "w-[45%] pl-10 pr-3 text-left z-20 flex flex-col justify-center items-start gap-4",
          phoneWrapperClass: "absolute top-1/2 -right-16 -translate-y-1/2 z-10 [transform:rotateX(15deg)_rotateY(-35deg)_rotateZ(10deg)_scale(0.88)]",
          textAlign: "left" as const,
        };
      case 'hero-3d-center':
        return {
          containerClass: "relative flex flex-col items-center justify-start overflow-hidden pt-10 [perspective:2000px]",
          textContainerClass: "w-[85%] text-center z-20 drop-shadow-2xl flex flex-col justify-center items-center gap-2",
          phoneWrapperClass: "absolute bottom-[-18%] z-10 [transform:rotateX(25deg)_rotateY(0deg)_scale(1.08)] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] transition-transform duration-700 hover:[transform:rotateX(18deg)_scale(1.08)]",
          textAlign: "center" as const,
        };
      case 'multi-screen-right':
        return {
          containerClass: "relative flex flex-col justify-between items-center overflow-hidden",
          textContainerClass: "w-full px-6 pt-7 pb-1 text-center z-30 flex-shrink-0 flex flex-col items-center justify-center gap-1.5",
          phoneWrapperClass: "w-full flex-1 relative overflow-hidden flex items-center justify-center",
          textAlign: "center" as const,
        };
      case 'multi-screen-left':
        return {
          containerClass: "relative flex flex-col justify-between items-center overflow-hidden",
          textContainerClass: "w-full px-6 pt-7 pb-1 text-center z-30 flex-shrink-0 flex flex-col items-center justify-center gap-1.5",
          phoneWrapperClass: "w-full flex-1 relative overflow-hidden flex items-center justify-center",
          textAlign: "center" as const,
        };
      case 'multi-screen-center':
        return {
          containerClass: "relative flex flex-col justify-between items-center overflow-hidden",
          textContainerClass: "w-full px-6 pt-7 pb-1 text-center z-30 flex-shrink-0 flex flex-col items-center justify-center gap-1.5",
          phoneWrapperClass: "w-full flex-1 relative overflow-hidden flex items-center justify-center",
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
          textContainerClass: "w-[48%] pl-10 pr-3 text-left z-30 flex flex-col justify-center items-start gap-3",
          phoneWrapperClass: "absolute top-1/2 right-4 -translate-y-1/2 z-30 scale-100",
          textAlign: "left" as const,
        };
      case 'banner-triple-bottom':
        return {
          containerClass: "relative flex flex-col items-center justify-start overflow-hidden pt-10",
          textContainerClass: "w-[80%] text-center z-30 drop-shadow-2xl flex flex-col justify-center items-center gap-3",
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
          containerClass: "flex flex-col items-center justify-start overflow-hidden pt-10 relative",
          textContainerClass: "w-[85%] text-center z-20 flex flex-col justify-center items-center gap-1.5 pt-2",
          phoneWrapperClass: "absolute bottom-[-20%] z-10 scale-[1.12]",
          textAlign: "center" as const,
        };
      case 'trio-row':
        return {
          containerClass: "w-full h-full flex flex-col justify-center items-center overflow-hidden relative",
          textContainerClass: "hidden",
          phoneWrapperClass: "w-full h-full flex flex-row items-center justify-center gap-3 sm:gap-5 lg:gap-7 px-4 z-10",
          textAlign: "center" as const,
        };
      case 'duo-row':
        return {
          containerClass: "w-full h-full flex flex-col justify-center items-center overflow-hidden relative",
          textContainerClass: "hidden",
          phoneWrapperClass: "w-full h-full flex flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 px-6 z-10",
          textAlign: "center" as const,
        };
      default:
        return {
          containerClass: "flex flex-col justify-between items-center overflow-hidden",
          textContainerClass: `w-full px-6 pt-7 pb-2 text-center z-20 flex-shrink-0 gap-1.5`,
          phoneWrapperClass: "w-full flex justify-center items-start flex-1 overflow-hidden relative pt-3",
          textAlign: "center" as const,
        };
    }
  };

  const layoutConfig = getLayoutConfig();


  const defaultTextBoxWidth = getDefaultTextBoxWidth(currentLayout);
  const currentTextBoxWidth = canvas.textBoxWidth ?? defaultTextBoxWidth;

  const defaultTitleFontSize = isHalfLayout 
    ? (isCompact ? 20 : 26) 
    : (isMultiScreen ? (isCompact ? 22 : 28) : (isCompact ? 24 : 32));
  const effectiveTitleFontSize = canvas.titleFontSize || defaultTitleFontSize;

  const defaultSubtitleFontSize = isHalfLayout 
    ? (isCompact ? 12 : 14) 
    : (isCompact ? 13 : 16);
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
    let changes: Partial<CanvasItem> | null = null;
    const previewResize = (next: Partial<CanvasItem>) => { changes = next; setResizeDraft(next); };

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
        previewResize({ textBoxWidth: newWidth });
      } else if (handle === 'left') {
        const deltaPct = (-deltaX / canvasWidth) * 100;
        const newWidth = Math.min(100, Math.max(25, Math.round(initialWidth + deltaPct)));
        previewResize({ textBoxWidth: newWidth });
      } else if (handle === 'corner') {
        const deltaFont = Math.round(deltaY * 0.15);
        const newFontSize = Math.min(72, Math.max(16, initialTitleSize + deltaFont));
        const newSubSize = Math.min(36, Math.max(11, initialSubSize + Math.round(deltaFont * 0.45)));

        const deltaPct = ((deltaX * (effectiveTextAlign === 'right' ? -1 : 1)) / canvasWidth) * 100;
        const newWidth = Math.min(100, Math.max(25, Math.round(initialWidth + deltaPct)));

        previewResize({
          textBoxWidth: newWidth,
          titleFontSize: newFontSize,
          subtitleFontSize: newSubSize,
        });
      }
    };

    const onPointerUp = () => {
      if (changes) updateCanvas(canvas.id, changes);
      setResizeDraft(null);
      setIsResizingTextBox(false);
      cleanup();
    };
    const onPointerCancel = () => {
      setResizeDraft(null);
      setIsResizingTextBox(false);
      cleanup();
    };
    const cleanup = () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      resizeCleanup.current = null;
    };
    resizeCleanup.current = cleanup;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);
  };


  const toggleGradientText = () => {
    updateCanvas(canvas.id, { gradientText: !canvas.gradientText });
  };

  return (
    <div 
      id={`card-${canvas.id}`}
      data-slide-render
      onPointerDown={() => { if (!isPreviewMode) useEditorStore.getState().selectCanvas(canvas.id); }}
      className={`flex flex-col flex-shrink-0 group relative transition-transform duration-200 ${
        targetWidth
          ? `items-center ${editableTextBox ? '' : 'pointer-events-none'} snap-center`
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
            <CanvasButton readOnly={isPreviewMode}
              onClick={() => applyLayoutToAll(currentLayout)}
              className={`px-2 py-1.5 ml-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all shadow-sm ${
                isDark 
                  ? 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/20 hover:border-zinc-400' 
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
              }`}
              title="Apply this layout to all screenshots"
            >
              Apply All
            </CanvasButton>
          </div>

          <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>


          {/* Hand-Drawn Doodle Accents Toggle */}
          <CanvasButton readOnly={isPreviewMode}
            onClick={() => {
              setShowDoodleMenu(!showDoodleMenu);
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
          </CanvasButton>

          {/* Resizable Text Box Settings Toggle */}
          <CanvasButton readOnly={isPreviewMode}
            onClick={() => {
              setShowTextBoxMenu(!showTextBoxMenu);
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
          </CanvasButton>

          {/* Floating Widgets Toggle */}
          <CanvasButton readOnly={isPreviewMode}
            onClick={() => {
              setShowWidgetMenu(!showWidgetMenu);
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
          </CanvasButton>

          {/* Status Bar Sanitizer Toggle */}
          <CanvasButton readOnly={isPreviewMode}
            onClick={() => {
              setShowStatusBarMenu(!showStatusBarMenu);
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
          </CanvasButton>

          {/* Gradient Text Toggle */}
          <CanvasButton readOnly={isPreviewMode}
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
          </CanvasButton>
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
          <CanvasButton readOnly={isPreviewMode}
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
          </CanvasButton>

          <CanvasButton readOnly={isPreviewMode}
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
          </CanvasButton>

          <CanvasButton readOnly={isPreviewMode}
            onClick={() => duplicateCanvas(canvas.id)}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-gray-800 hover:text-zinc-400' 
                : 'text-gray-400 hover:bg-zinc-50 hover:text-zinc-600'
            }`}
            title="Duplicate Screenshot"
          >
            <IoCopyOutline className="w-4 h-4" />
          </CanvasButton>

          <CanvasButton readOnly={isPreviewMode}
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
          </CanvasButton>

          {total > 1 && (
            <>
              <div className={`w-px h-5 mx-1 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <CanvasButton readOnly={isPreviewMode}
                onClick={() => removeCanvas(canvas.id)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:bg-red-950/50 hover:text-red-400' 
                    : 'text-gray-400 hover:bg-red-50 hover:text-red-600'
                }`}
                title="Delete Screenshot"
              >
                <IoTrashOutline className="w-4 h-4" />
              </CanvasButton>
            </>
          )}
        </div>


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
              <CanvasButton readOnly={isPreviewMode}
                onClick={() => setShowDoodleMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </CanvasButton>
            </div>

            {/* Quick Toggle On/Off */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Toggle Accents</span>
              <CanvasButton readOnly={isPreviewMode}
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
              </CanvasButton>
            </div>

            {/* Color Palette Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium opacity-75">Doodle Color</span>
                <span className="text-[10px] font-mono opacity-60">{canvas.doodle?.color || '#facc15'}</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {DOODLE_COLOR_PALETTE.map((pal) => (
                  <CanvasButton readOnly={isPreviewMode}
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
                  <CanvasButton readOnly={isPreviewMode}
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
                  </CanvasButton>
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
              <CanvasButton readOnly={isPreviewMode}
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
              </CanvasButton>
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
              <CanvasButton readOnly={isPreviewMode}
                onClick={() => setShowWidgetMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </CanvasButton>
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
                      <CanvasButton readOnly={isPreviewMode}
                        onClick={() => removeFloatingCard(canvas.id, card.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Remove Card"
                      >
                        <IoTrashOutline className="w-3.5 h-3.5" />
                      </CanvasButton>
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
                      <CanvasButton readOnly={isPreviewMode}
                        onClick={() => removeCalloutPin(canvas.id, pin.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Remove Pin"
                      >
                        <IoTrashOutline className="w-3.5 h-3.5" />
                      </CanvasButton>
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
                  <CanvasButton readOnly={isPreviewMode}
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
                  </CanvasButton>
                ))}
              </div>
            </div>

            {/* Callout Pins to Add */}
            <div className={`pt-2 border-t space-y-1.5 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
              <span className="text-[11px] font-semibold opacity-75">Add Callout Pin:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {CALLOUT_PIN_PRESETS.map((preset) => (
                  <CanvasButton readOnly={isPreviewMode}
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
                  </CanvasButton>
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
              <CanvasButton readOnly={isPreviewMode}
                onClick={() => setShowStatusBarMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </CanvasButton>
            </div>

            {/* Toggle Status Bar */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold">Enable Status Bar</span>
              <CanvasButton readOnly={isPreviewMode}
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
              </CanvasButton>
            </div>

            {/* Status Bar OS Platform */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium opacity-75">OS Platform:</label>
              <div className="grid grid-cols-2 gap-1.5">
                <CanvasButton readOnly={isPreviewMode}
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
                </CanvasButton>
                <CanvasButton readOnly={isPreviewMode}
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
                </CanvasButton>
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
                  <CanvasButton readOnly={isPreviewMode}
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
                  </CanvasButton>
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
              <CanvasButton readOnly={isPreviewMode}
                onClick={() => setShowTextBoxMenu(false)}
                className="text-gray-400 hover:text-gray-200 p-0.5 rounded"
              >
                <IoClose className="w-3.5 h-3.5" />
              </CanvasButton>
            </div>

            {/* Width Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold">Text Box Width:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-indigo-400">{currentTextBoxWidth}%</span>
                  {canvas.textBoxWidth !== undefined && (
                    <CanvasButton readOnly={isPreviewMode}
                      onClick={() => updateCanvas(canvas.id, { textBoxWidth: undefined })}
                      className="text-[10px] text-gray-400 hover:text-gray-200 underline"
                    >
                      Auto
                    </CanvasButton>
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
                  <CanvasButton readOnly={isPreviewMode}
                    key={pct}
                    onClick={() => updateCanvas(canvas.id, { textBoxWidth: pct })}
                    className={`py-1 rounded border font-medium transition-all ${
                      currentTextBoxWidth === pct
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {pct}%
                  </CanvasButton>
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
                    <CanvasButton readOnly={isPreviewMode}
                      onClick={() => updateCanvas(canvas.id, { titleFontSize: undefined })}
                      className="text-[10px] text-gray-400 hover:text-gray-200 underline"
                    >
                      Auto
                    </CanvasButton>
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
                  <CanvasButton readOnly={isPreviewMode}
                    key={sz}
                    onClick={() => updateCanvas(canvas.id, { titleFontSize: sz })}
                    className={`py-1 rounded border font-medium transition-all ${
                      effectiveTitleFontSize === sz
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {sz}px
                  </CanvasButton>
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
                    <CanvasButton readOnly={isPreviewMode}
                      onClick={() => updateCanvas(canvas.id, { subtitleFontSize: undefined })}
                      className="text-[10px] text-gray-400 hover:text-gray-200 underline"
                    >
                      Auto
                    </CanvasButton>
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
                  <CanvasButton readOnly={isPreviewMode}
                    key={al.value}
                    onClick={() => updateCanvas(canvas.id, { textAlign: al.value as 'left' | 'center' | 'right' })}
                    className={`py-1 rounded-lg text-xs font-semibold border transition-all ${
                      effectiveTextAlign === al.value
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {al.label}
                  </CanvasButton>
                ))}
              </div>
            </div>

            {/* Apply to All Screens & Reset */}
            <div className="flex gap-2 pt-2 border-t border-zinc-800/40">
              <CanvasButton readOnly={isPreviewMode}
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
              </CanvasButton>
              <CanvasButton readOnly={isPreviewMode}
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
              </CanvasButton>
            </div>
          </div>
        )}
      </div>
      )}

      {/* Scaled Preview Canvas */}
      <div
        className={`origin-top overflow-hidden ${
          isPreviewMode ? (editableTextBox ? '' : 'pointer-events-none') : 'shadow-2xl rounded-3xl border border-black/20'
        }`}
        style={{ 
          transform: `scale(${zoomScale})`,
          marginBottom: `calc(${canvasHeight}px * (${zoomScale} - 1))`,
          marginLeft: (isPreviewMode || targetWidth) ? `calc(${canvasWidth}px * (${zoomScale} - 1) / 2)` : undefined,
          marginRight: (isPreviewMode || targetWidth) ? `calc(${canvasWidth}px * (${zoomScale} - 1) / 2)` : undefined,
        }}
      >
        <div
          id={renderId || `canvas-${canvas.id}`}
          className={`relative overflow-hidden select-none ${layoutConfig.containerClass}`}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            background: canvas.backgroundColor || '#000000',
            fontFamily: fontConfig.fontFamily,
          }}
        >
          {/* Custom Background Image */}
          {canvas.backgroundImageSrc && (
            <div
              className="absolute inset-0 bg-cover bg-center pointer-events-none z-0"
              style={{ backgroundImage: `url(${canvas.backgroundImageSrc})` }}
            />
          )}

          {/* Backdrop Pattern Effect */}
          {(canvas.backdropEffects?.pattern ?? globalSettings.backdropEffects?.pattern) && (
            <div className="absolute inset-0 pointer-events-none z-0 opacity-25 [background-image:radial-gradient(rgba(0,0,0,0.4)_1px,transparent_1px)] [background-size:20px_20px]" />
          )}

          {/* Backdrop Vignette Effect */}
          {(canvas.backdropEffects?.vignette ?? globalSettings.backdropEffects?.vignette) && (
            <div className="absolute inset-0 pointer-events-none z-0 [background:radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.38)_100%)]" />
          )}

          {/* Backdrop Overlay Tint Effect */}
          {(canvas.backdropEffects?.overlay ?? globalSettings.backdropEffects?.overlay) && (
            <div className="absolute inset-0 pointer-events-none z-0 bg-black/15 backdrop-blur-[0.5px]" />
          )}

          {/* Backdrop Center Glow Effect */}
          {(canvas.backdropEffects?.effects ?? globalSettings.backdropEffects?.effects) && (
            <div className="absolute inset-0 pointer-events-none z-0 [background:radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.22)_0%,transparent_65%)]" />
          )}

          {/* Floating UI Cards */}
          {canvas.floatingCards?.map((card) => (
            <FloatingCard
              key={card.id}
              card={card}
              onRemove={isPreviewMode ? undefined : () => removeFloatingCard(canvas.id, card.id)}
            />
          ))}

          {/* Callout Pins */}
          {canvas.calloutPins?.map((pin) => (
            <CalloutPin
              key={pin.id}
              pin={pin}
              onRemove={isPreviewMode ? undefined : () => removeCalloutPin(canvas.id, pin.id)}
            />
          ))}


          {/* Background Image Overlay */}
          {canvas.backgroundImageSrc && (
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

          {/* Text Section */}
          {currentLayout !== 'device-only' && (
            <div 
              className={`group/textbox relative transition-all ${layoutConfig.textContainerClass}`}
              style={{
                width: canvas.textBoxWidth ? `${canvas.textBoxWidth}%` : undefined,
                height: ['basic-top', 'basic-bottom'].includes(currentLayout) ? canvasHeight * .32 : undefined,
              }}
            >
              {/* Visual selection outline on hover/resizing (no-export) */}
              {(!isPreviewMode || editableTextBox) && (
                <div className={`absolute inset-0 rounded-2xl border transition-colors pointer-events-none no-export ${
                  isResizingTextBox
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40 bg-indigo-500/5'
                    : 'border-transparent group-hover/textbox:border-indigo-400/40'
                }`} />
              )}

              {/* Interactive Resize Handles & Dimensions HUD (no-export) */}
              {(!isPreviewMode || editableTextBox) && (
                <>
                  {/* Floating HUD on hover or active */}
                  <div className={`absolute -top-8 left-1/2 -translate-x-1/2 no-export ${
                    isResizingTextBox ? 'opacity-100' : 'opacity-0 group-hover/textbox:opacity-100 focus-within:opacity-100'
                  } transition-opacity z-50 pointer-events-auto flex items-center gap-1.5 bg-gray-950/95 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-semibold shadow-2xl border border-white/20 whitespace-nowrap`}>
                    <IoResizeOutline className="w-3 h-3 text-indigo-400" />
                    <span>Width: {currentTextBoxWidth}%</span>
                    <span className="opacity-40">|</span>
                    <span>Title: {effectiveTitleFontSize}px</span>
                    
                    <CanvasButton readOnly={isPreviewMode}
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
                    </CanvasButton>
                    <CanvasButton readOnly={isPreviewMode}
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
                    </CanvasButton>
                    
                    {(canvas.textBoxWidth || canvas.titleFontSize || canvas.subtitleFontSize || canvas.textAlign) && (
                      <>
                        <span className="opacity-40">|</span>
                        <CanvasButton readOnly={isPreviewMode}
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
                        </CanvasButton>
                      </>
                    )}
                  </div>

                  {/* Right Resize Handle */}
                  {effectiveTextAlign !== 'right' && (
                    <div
                      onPointerDown={(e) => handleResizeStart(e, 'right')}
                      className={`absolute ${editableTextBox ? 'right-1' : '-right-2.5'} top-1/2 -translate-y-1/2 w-4 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center cursor-ew-resize shadow-2xl z-40 transition-transform hover:scale-110 no-export ${
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
                      className={`absolute ${editableTextBox ? 'left-1' : '-left-2.5'} top-1/2 -translate-y-1/2 w-4 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center cursor-ew-resize shadow-2xl z-40 transition-transform hover:scale-110 no-export ${
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
                      effectiveTextAlign === 'right' ? (editableTextBox ? 'left-1' : '-left-2.5') : (editableTextBox ? 'right-1' : '-right-2.5')
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


              {/* Title & Hand-Drawn Doodle Accents */}
              {currentLayout === 'banner-kinetic-stack' ? (
                <div className="w-full flex flex-col justify-center select-none overflow-hidden relative group/kinetic">
                  <div className="mb-1 w-full relative z-20">
                    <CanvasText
                      readOnly={isPreviewMode}
                      tabIndex={isPreviewMode ? -1 : undefined}
                      maxRenderHeight={['basic-top', 'basic-bottom'].includes(currentLayout) ? canvasHeight * .20 : undefined}
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
                    <CanvasText
                      readOnly={isPreviewMode}
                      tabIndex={isPreviewMode ? -1 : undefined}
                      maxRenderHeight={['basic-top', 'basic-bottom'].includes(currentLayout) ? canvasHeight * .20 : undefined}
                      value={canvas.title}
                      onChange={(e) => updateCanvas(canvas.id, { title: e.target.value })}
                      className={`w-full bg-transparent border-2 border-transparent hover:border-white/20 focus:border-white/40 focus:bg-white/5 rounded-xl px-3 py-1 outline-none font-extrabold placeholder-white/50 tracking-tight leading-tight transition-all resize-none overflow-hidden relative z-10 break-words hyphens-none ${
                        canvas.titleFontSize
                          ? 'mb-1.5'
                          : isMultiScreen
                            ? (isCompact ? 'text-[22px] mb-1' : 'text-[28px] mb-1.5')
                            : isHalfLayout 
                              ? (isCompact ? 'text-[20px] mb-1' : 'text-[26px] mb-1.5')
                              : (isCompact ? 'text-[24px] mb-1' : 'text-[32px] mb-1.5')
                      } ${
                        canvas.gradientText 
                          ? 'bg-gradient-to-r from-white via-zinc-100 to-zinc-300 bg-clip-text text-transparent drop-shadow-sm' 
                          : ''
                      }`}
                      style={{ 
                        fontSize: `${effectiveTitleFontSize}px`,
                        color: canvas.gradientText ? undefined : (canvas.textColor || '#ffffff'), 
                        textAlign: effectiveTextAlign 
                      }}
                      placeholder="Enter Title"
                    />
                    <DoodleAccentGroup doodle={canvas.doodle} defaultColor="#facc15" />
                  </div>

                  {/* Subtitle (Only if not split-vertical) */}
                  {currentLayout !== 'split-vertical' && (
                    <CanvasText
                      readOnly={isPreviewMode}
                      tabIndex={isPreviewMode ? -1 : undefined}
                      maxRenderHeight={['basic-top', 'basic-bottom'].includes(currentLayout) ? canvasHeight * .08 : undefined}
                      value={canvas.subtitle}
                      onChange={(e) => updateCanvas(canvas.id, { subtitle: e.target.value })}
                      className={`w-full bg-transparent border-2 border-transparent hover:border-white/20 focus:border-white/40 focus:bg-white/5 rounded-xl px-3 py-1 outline-none font-medium placeholder-white/50 resize-none overflow-hidden leading-relaxed transition-all break-words hyphens-none ${
                        canvas.subtitleFontSize
                          ? ''
                          : isMultiScreen
                            ? (isCompact ? 'text-xs' : 'text-sm')
                            : isHalfLayout
                              ? (isCompact ? 'text-[11px]' : 'text-xs sm:text-sm')
                              : (isCompact ? 'text-xs' : 'text-sm sm:text-base')
                      }`}
                      style={{
                        fontSize: `${effectiveSubtitleFontSize}px`,
                        color: canvas.subtitleColor || canvas.textColor || '#ffffff',
                        textAlign: effectiveTextAlign
                      }}
                      placeholder="Enter Subtitle"
                    />
                  )}
                </>
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
              <CanvasText
                      readOnly={isPreviewMode}
                      tabIndex={isPreviewMode ? -1 : undefined}
                maxRenderHeight={['basic-top', 'basic-bottom'].includes(currentLayout) ? canvasHeight * .08 : undefined}
                      value={canvas.subtitle}
                onChange={(e) => updateCanvas(canvas.id, { subtitle: e.target.value })}
                className={`w-full bg-transparent border-2 border-transparent hover:border-white/20 focus:border-white/40 focus:bg-white/5 rounded-xl px-3 py-2 outline-none font-medium placeholder-white/50 resize-none overflow-hidden leading-relaxed transition-all break-words hyphens-none ${
                  canvas.subtitleFontSize
                    ? ''
                    : isCompact ? 'text-sm' : 'text-xl'
                }`}
                style={{
                  fontSize: `${effectiveSubtitleFontSize}px`,
                  color: canvas.subtitleColor || canvas.textColor || '#ffffff',
                  textAlign: effectiveTextAlign
                }}
                placeholder="Enter Subtitle"
              />
            </div>
          )}

          {/* Adaptive Phone Mockup Section */}
          {(() => {
            const slot2Image = currentLayout === 'multi-screen-right'
              ? (canvas.secondaryImageSrc || nextCanvas?.imageSrc || canvas.imageSrc)
              : (canvas.secondaryImageSrc || prevCanvas?.imageSrc || canvas.imageSrc);

            const slot3Image = currentLayout === 'multi-screen-right'
              ? (canvas.tertiaryImageSrc || nextNextCanvas?.imageSrc || nextCanvas?.imageSrc || canvas.imageSrc)
              : (canvas.tertiaryImageSrc || nextCanvas?.imageSrc || canvas.imageSrc);

            return (
              <div 
                className={layoutConfig.phoneWrapperClass}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={handlePhoneDrop}
              >
            {currentLayout === 'trio-row' ? (
              <div className="w-full h-full flex flex-row items-center justify-center gap-3 sm:gap-5 lg:gap-7 px-4">
                {/* Slot 2 (Left Phone) */}
                <div
                  className="rounded-[36px] cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    uploadSlotRef.current = 'secondary';
                    fileInputRef.current?.click();
                  }}
                  onDrop={(e) => handleSpecificPhoneDrop(e, 'secondary')}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  style={{
                    transform: canvas.rotationAngle ? `rotate(${canvas.rotationAngle}deg)` : undefined,
                  }}
                >
                  <MinimalPhoneFrame 
                    width={Math.round(phoneW * 0.74)} 
                    height={Math.round(phoneH * 0.74)} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                    shadow={canvas.shadow || globalSettings.shadow}
                  >
                    {slot2Image ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage settings={globalSettings} canvas={{ ...canvas, imageSrc: slot2Image }} />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              uploadSlotRef.current = 'secondary';
                              fileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-full transition-colors flex items-center gap-1.5"
                          >
                            <IoCloudUploadOutline className="w-3.5 h-3.5" />
                            Change Image
                          </CanvasButton>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          uploadSlotRef.current = 'secondary';
                          fileInputRef.current?.click();
                        }}
                        className="w-full h-full flex flex-col items-center justify-center bg-[#111215] [background-image:linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] cursor-pointer group/placeholder select-none transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-white/10 group-hover/placeholder:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 group-hover/placeholder:text-white group-hover/placeholder:scale-110 transition-all shadow-md">
                          <IoAdd className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>

                {/* Slot 1 (Center Phone - Primary) */}
                <div
                  className="rounded-[36px] cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex-shrink-0"
                  onClick={() => {
                    uploadSlotRef.current = 'primary';
                    fileInputRef.current?.click();
                  }}
                  onDrop={(e) => handleSpecificPhoneDrop(e, 'primary')}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  style={{
                    transform: canvas.rotationAngle ? `rotate(${canvas.rotationAngle}deg)` : undefined,
                  }}
                >
                  <MinimalPhoneFrame 
                    width={Math.round(phoneW * 0.74)} 
                    height={Math.round(phoneH * 0.74)} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                    shadow={canvas.shadow || globalSettings.shadow}
                  >
                    {canvas.imageSrc ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage settings={globalSettings} canvas={canvas} />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity">
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              uploadSlotRef.current = 'primary';
                              fileInputRef.current?.click();
                            }}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
                          >
                            <IoCloudUploadOutline className="w-4 h-4" />
                            Change Image
                          </CanvasButton>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          uploadSlotRef.current = 'primary';
                          fileInputRef.current?.click();
                        }}
                        className="w-full h-full flex flex-col items-center justify-center bg-[#111215] [background-image:linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] cursor-pointer group/placeholder select-none transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-white/10 group-hover/placeholder:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 group-hover/placeholder:text-white group-hover/placeholder:scale-110 transition-all shadow-md">
                          <IoAdd className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>

                {/* Slot 3 (Right Phone) */}
                <div
                  className="rounded-[36px] cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    uploadSlotRef.current = 'tertiary';
                    fileInputRef.current?.click();
                  }}
                  onDrop={(e) => handleSpecificPhoneDrop(e, 'tertiary')}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  style={{
                    transform: canvas.rotationAngle ? `rotate(${canvas.rotationAngle}deg)` : undefined,
                  }}
                >
                  <MinimalPhoneFrame 
                    width={Math.round(phoneW * 0.74)} 
                    height={Math.round(phoneH * 0.74)} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                    shadow={canvas.shadow || globalSettings.shadow}
                  >
                    {slot3Image ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage settings={globalSettings} canvas={{ ...canvas, imageSrc: slot3Image }} />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              uploadSlotRef.current = 'tertiary';
                              fileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-full transition-colors flex items-center gap-1.5"
                          >
                            <IoCloudUploadOutline className="w-3.5 h-3.5" />
                            Change Image
                          </CanvasButton>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          uploadSlotRef.current = 'tertiary';
                          fileInputRef.current?.click();
                        }}
                        className="w-full h-full flex flex-col items-center justify-center bg-[#111215] [background-image:linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] cursor-pointer group/placeholder select-none transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-white/10 group-hover/placeholder:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 group-hover/placeholder:text-white group-hover/placeholder:scale-110 transition-all shadow-md">
                          <IoAdd className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
              </div>
            ) : currentLayout === 'duo-row' ? (
              <div className="w-full h-full flex flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 px-6">
                {/* Left Phone (Slot 1) */}
                <div
                  className="rounded-[38px] cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex-shrink-0"
                  onClick={() => {
                    uploadSlotRef.current = 'primary';
                    fileInputRef.current?.click();
                  }}
                  onDrop={(e) => handleSpecificPhoneDrop(e, 'primary')}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  style={{
                    transform: canvas.rotationAngle ? `rotate(${canvas.rotationAngle}deg)` : undefined,
                  }}
                >
                  <MinimalPhoneFrame 
                    width={Math.round(phoneW * 0.86)} 
                    height={Math.round(phoneH * 0.86)} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                    shadow={canvas.shadow || globalSettings.shadow}
                  >
                    {canvas.imageSrc ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage settings={globalSettings} canvas={canvas} />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              uploadSlotRef.current = 'primary';
                              fileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-full transition-colors flex items-center gap-1.5"
                          >
                            <IoCloudUploadOutline className="w-3.5 h-3.5" />
                            Change Image
                          </CanvasButton>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          uploadSlotRef.current = 'primary';
                          fileInputRef.current?.click();
                        }}
                        className="w-full h-full flex flex-col items-center justify-center bg-[#111215] [background-image:linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] cursor-pointer group/placeholder select-none transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-white/10 group-hover/placeholder:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 group-hover/placeholder:text-white group-hover/placeholder:scale-110 transition-all shadow-md">
                          <IoAdd className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>

                {/* Right Phone (Slot 2) */}
                <div
                  className="rounded-[38px] cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    uploadSlotRef.current = 'secondary';
                    fileInputRef.current?.click();
                  }}
                  onDrop={(e) => handleSpecificPhoneDrop(e, 'secondary')}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  style={{
                    transform: canvas.rotationAngle ? `rotate(${canvas.rotationAngle}deg)` : undefined,
                  }}
                >
                  <MinimalPhoneFrame 
                    width={Math.round(phoneW * 0.86)} 
                    height={Math.round(phoneH * 0.86)} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                    shadow={canvas.shadow || globalSettings.shadow}
                  >
                    {slot2Image ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage settings={globalSettings} canvas={{ ...canvas, imageSrc: slot2Image }} />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              uploadSlotRef.current = 'secondary';
                              fileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-full transition-colors flex items-center gap-1.5"
                          >
                            <IoCloudUploadOutline className="w-3.5 h-3.5" />
                            Change Image
                          </CanvasButton>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          uploadSlotRef.current = 'secondary';
                          fileInputRef.current?.click();
                        }}
                        className="w-full h-full flex flex-col items-center justify-center bg-[#111215] [background-image:linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] cursor-pointer group/placeholder select-none transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-white/10 group-hover/placeholder:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 group-hover/placeholder:text-white group-hover/placeholder:scale-110 transition-all shadow-md">
                          <IoAdd className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
              </div>
            ) : isMultiScreen ? (
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                {/* Slot 2 (Left Phone) */}
                <div
                  className={`rounded-[40px] ${
                    currentLayout === 'multi-screen-right'
                      ? 'absolute top-[4%] -left-[14%] sm:left-[2%] z-10 scale-[0.88] origin-top opacity-95 shadow-xl transition-transform duration-300 hover:scale-[0.90] cursor-pointer group/phone-sub1'
                      : currentLayout === 'multi-screen-left'
                      ? 'absolute top-[4%] -left-[30%] z-10 scale-[0.88] origin-top opacity-95 shadow-xl transition-transform duration-300 hover:scale-[0.90] cursor-pointer group/phone-sub1'
                      : 'absolute top-[4%] -left-[14%] sm:left-[0%] z-10 scale-[0.86] origin-top opacity-95 shadow-xl transition-transform duration-300 hover:scale-[0.88] cursor-pointer group/phone-sub1'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    uploadSlotRef.current = 'secondary';
                    fileInputRef.current?.click();
                  }}
                  onDrop={(e) => handleSpecificPhoneDrop(e, 'secondary')}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                  >
                    {slot2Image ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage settings={globalSettings} canvas={{ ...canvas, imageSrc: slot2Image }} />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              uploadSlotRef.current = 'secondary';
                              fileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-full transition-colors flex items-center gap-1.5"
                          >
                            <IoCloudUploadOutline className="w-3.5 h-3.5" />
                            Change Image
                          </CanvasButton>
                          {canvas.secondaryImageSrc && (
                            <CanvasButton readOnly={isPreviewMode}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCanvas(canvas.id, { secondaryImageSrc: null });
                                toast.success("Reset to auto linked screen");
                              }}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] rounded-full transition-colors flex items-center gap-1"
                            >
                              <IoRefreshOutline className="w-3 h-3" />
                              Reset to Auto
                            </CanvasButton>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                        <IoCloudUploadOutline className="w-8 h-8 text-gray-400 mb-1" />
                        <span className="text-[10px] font-semibold text-gray-500">Upload Left Screen</span>
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>

                {/* Slot 3 (Right Phone) */}
                <div
                  className={`rounded-[40px] ${
                    currentLayout === 'multi-screen-right'
                      ? 'absolute top-[4%] -right-[30%] z-10 scale-[0.88] origin-top opacity-95 shadow-xl transition-transform duration-300 hover:scale-[0.90] cursor-pointer group/phone-sub2'
                      : currentLayout === 'multi-screen-left'
                      ? 'absolute top-[4%] -right-[14%] sm:right-[2%] z-10 scale-[0.88] origin-top opacity-95 shadow-xl transition-transform duration-300 hover:scale-[0.90] cursor-pointer group/phone-sub2'
                      : 'absolute top-[4%] -right-[14%] sm:right-[0%] z-10 scale-[0.86] origin-top opacity-95 shadow-xl transition-transform duration-300 hover:scale-[0.88] cursor-pointer group/phone-sub2'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    uploadSlotRef.current = 'tertiary';
                    fileInputRef.current?.click();
                  }}
                  onDrop={(e) => handleSpecificPhoneDrop(e, 'tertiary')}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
                  <MinimalPhoneFrame 
                    width={phoneW} 
                    height={phoneH} 
                    targetSizeId={globalSettings.targetSize}
                    mockupStyle={globalSettings.mockupStyle}
                    showNotch={globalSettings.showNotch}
                    statusBar={canvas.statusBar || globalSettings.statusBar}
                  >
                    {slot3Image ? (
                      <div className="w-full h-full relative group/img bg-black flex items-center justify-center">
                        <CanvasImage settings={globalSettings} canvas={{ ...canvas, imageSrc: slot3Image }} />
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              uploadSlotRef.current = 'tertiary';
                              fileInputRef.current?.click();
                            }}
                            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-medium text-xs rounded-full transition-colors flex items-center gap-1.5"
                          >
                            <IoCloudUploadOutline className="w-3.5 h-3.5" />
                            Change Image
                          </CanvasButton>
                          {canvas.tertiaryImageSrc && (
                            <CanvasButton readOnly={isPreviewMode}
                              onClick={(e) => {
                                e.stopPropagation();
                                updateCanvas(canvas.id, { tertiaryImageSrc: null });
                                toast.success("Reset to auto linked screen");
                              }}
                              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] rounded-full transition-colors flex items-center gap-1"
                            >
                              <IoRefreshOutline className="w-3 h-3" />
                              Reset to Auto
                            </CanvasButton>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                        <IoCloudUploadOutline className="w-8 h-8 text-gray-400 mb-1" />
                        <span className="text-[10px] font-semibold text-gray-500">Upload Right Screen</span>
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>

                {/* Slot 1 (Foreground Center Phone - Primary) */}
                <div
                  className={`rounded-[40px] ${
                    currentLayout === 'multi-screen-right'
                      ? 'absolute bottom-[-14%] left-[22%] z-20 shadow-[-16px_25px_60px_rgba(0,0,0,0.65),0_10px_25px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-[1.02] cursor-pointer group/phone-main'
                      : currentLayout === 'multi-screen-left'
                      ? 'absolute bottom-[-14%] right-[22%] z-20 shadow-[16px_25px_60px_rgba(0,0,0,0.65),0_10px_25px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-[1.02] cursor-pointer group/phone-main'
                      : 'absolute bottom-[-14%] left-1/2 -translate-x-1/2 z-20 shadow-[0_25px_60px_rgba(0,0,0,0.65),0_10px_25px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-[1.02] cursor-pointer group/phone-main'
                  }`}
                  onClick={() => {
                    uploadSlotRef.current = 'primary';
                    fileInputRef.current?.click();
                  }}
                  onDrop={(e) => handleSpecificPhoneDrop(e, 'primary')}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                >
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
                        <CanvasImage settings={globalSettings} canvas={canvas} />
                        <div 
                          className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity"
                        >
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => {
                              e.stopPropagation();
                              uploadSlotRef.current = 'primary';
                              fileInputRef.current?.click();
                            }}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
                          >
                            <IoCloudUploadOutline className="w-4 h-4" />
                            Change Image
                          </CanvasButton>
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => { e.stopPropagation(); setIsEditingImage(true); }}
                            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
                          >
                            <IoOptionsOutline className="w-4 h-4" />
                            Edit & Filter
                          </CanvasButton>
                          <CanvasButton readOnly={isPreviewMode}
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              updateCanvas(canvas.id, { imageFit: canvas.imageFit === 'contain' ? 'cover' : 'contain' });
                            }}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-full transition-colors"
                          >
                            Fit: {canvas.imageFit === 'contain' ? 'Contain' : 'Cover'}
                          </CanvasButton>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          uploadSlotRef.current = 'primary';
                          fileInputRef.current?.click();
                        }}
                      >
                        <IoCloudUploadOutline className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-xs font-semibold text-gray-500">Upload Main Screenshot</span>
                      </div>
                    )}
                  </MinimalPhoneFrame>
                </div>
              </div>
            ) : (
              <div className="group/phone relative transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl rounded-[40px] cursor-pointer"
                   onClick={() => {
                     uploadSlotRef.current = 'primary';
                     fileInputRef.current?.click();
                   }}
                   style={{
                     transform: canvas.rotationAngle ? `rotate(${canvas.rotationAngle}deg)` : undefined,
                   }}>
                <MinimalPhoneFrame 
                  width={phoneW} 
                  height={phoneH} 
                  targetSizeId={globalSettings.targetSize}
                  mockupStyle={globalSettings.mockupStyle}
                  showNotch={globalSettings.showNotch}
                  statusBar={canvas.statusBar || globalSettings.statusBar}
                  shadow={canvas.shadow || globalSettings.shadow}
                >
                  {canvas.imageSrc ? (
                  <div className={`w-full h-full relative group/img bg-black flex items-center justify-center`}>
                    <CanvasImage settings={globalSettings} canvas={canvas} />
                    <div 
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity"
                    >
                      <CanvasButton readOnly={isPreviewMode}
                        onClick={(e) => {
                          e.stopPropagation();
                          uploadSlotRef.current = 'primary';
                          fileInputRef.current?.click();
                        }}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
                      >
                        <IoCloudUploadOutline className="w-4 h-4" />
                        Change Image
                      </CanvasButton>
                      <CanvasButton readOnly={isPreviewMode}
                        onClick={(e) => { e.stopPropagation(); setIsEditingImage(true); }}
                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium text-sm rounded-full transition-colors flex items-center gap-2"
                      >
                        <IoOptionsOutline className="w-4 h-4" />
                        Edit & Filter
                      </CanvasButton>
                      <CanvasButton readOnly={isPreviewMode}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          updateCanvas(canvas.id, { imageFit: canvas.imageFit === 'contain' ? 'cover' : 'contain' });
                        }}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-full transition-colors"
                      >
                        Fit: {canvas.imageFit === 'contain' ? 'Contain' : 'Cover'}
                      </CanvasButton>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center bg-[#111215] [background-image:linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] cursor-pointer group/placeholder select-none transition-colors"
                    onClick={() => {
                      uploadSlotRef.current = 'primary';
                      fileInputRef.current?.click();
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 group-hover/placeholder:bg-white/20 border border-white/20 flex items-center justify-center text-white/80 group-hover/placeholder:text-white group-hover/placeholder:scale-110 transition-all shadow-md">
                      <IoAdd className="w-5 h-5" />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-zinc-500 group-hover/placeholder:text-zinc-300 transition-colors">
                      Upload Screenshot
                    </span>
                  </div>
                )}
              </MinimalPhoneFrame>
              </div>
            )}
            
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
                        <CanvasImage settings={globalSettings} canvas={nextCanvas?.imageSrc ? nextCanvas : canvas} />
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
                        <CanvasImage settings={globalSettings} canvas={nextNextCanvas?.imageSrc ? nextNextCanvas : canvas} />
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
                        <CanvasImage settings={globalSettings} canvas={nextCanvas?.imageSrc ? nextCanvas : canvas} />
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
                        <CanvasImage settings={globalSettings} canvas={nextNextCanvas?.imageSrc ? nextNextCanvas : canvas} />
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
                        <CanvasImage settings={globalSettings} canvas={canvas} />
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
                        <CanvasImage settings={globalSettings} canvas={canvas} />
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
        );
      })()}
        </div>
      </div>
      
      {!isPreviewMode && <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />}
      {isEditingImage && <ImageEditorModal canvas={canvas} onClose={() => setIsEditingImage(false)} />}
    </div>
  );
});
