import { toCanvas } from 'html-to-image';
import { CanvasItem } from '@/store/useEditorStore';
import { TARGET_SIZES } from '@/config/sizes';

export async function generateVideo(
  canvases: CanvasItem[],
  targetSizeId: string,
  onProgress: (msg: string, percent: number) => void
): Promise<{ blob: Blob, extension: string }> {
  const sizeConfig = TARGET_SIZES[targetSizeId as keyof typeof TARGET_SIZES] || TARGET_SIZES['ios-6.5'];
  const width = sizeConfig.width;
  const height = sizeConfig.height;
  
  onProgress('Preparing screenshots...', 0);
  
  // Render each DOM node to an HTMLCanvasElement
  const renderedFrames: HTMLCanvasElement[] = [];
  for (let i = 0; i < canvases.length; i++) {
    const node = document.getElementById(`canvas-${canvases[i].id}`);
    if (!node) continue;
    try {
      // Small delay to ensure the DOM is fully settled if we are switching layouts
      await new Promise(res => setTimeout(res, 200));
      const frameCanvas = await toCanvas(node, {
        quality: 1,
        pixelRatio: sizeConfig.pixelRatio,
      });
      renderedFrames.push(frameCanvas);
      
      // Update progress for rendering phase (0-50%)
      const renderPercent = Math.round(((i + 1) / canvases.length) * 50);
      onProgress(`Rendering screenshot ${i + 1}/${canvases.length}...`, renderPercent);
    } catch (err) {
      console.error('Failed to render canvas to image', err);
    }
  }

  if (renderedFrames.length === 0) {
    throw new Error('No frames could be rendered.');
  }

  onProgress('Encoding video...', 50);

  // Create the main recording canvas
  const canvas = document.createElement('canvas');
  canvas.width = width * sizeConfig.pixelRatio;
  canvas.height = height * sizeConfig.pixelRatio;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  // Setup MediaRecorder
  const stream = canvas.captureStream(30); // 30 FPS
  let mimeType = 'video/webm; codecs=vp9';
  let extension = 'webm';
  if (MediaRecorder.isTypeSupported('video/mp4')) {
    mimeType = 'video/mp4';
    extension = 'mp4';
  } else if (!MediaRecorder.isTypeSupported(mimeType)) {
    mimeType = 'video/webm'; // fallback
  }
  
  const recorder = new MediaRecorder(stream, { mimeType });
  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve({ blob, extension });
    };
    recorder.onerror = (e) => reject(e);

    recorder.start();

    // Animation settings
    const fps = 30;
    const slideDuration = 3; // seconds per slide
    const crossfadeDuration = 0.8; // seconds for transition
    const totalFramesPerSlide = slideDuration * fps;
    const crossfadeFrames = crossfadeDuration * fps;
    const zoomAmount = 0.15; // 15% zoom over the duration

    let currentSlide = 0;
    let frameInSlide = 0;

    const drawFrame = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const isLastSlide = currentSlide === renderedFrames.length - 1;
      // We don't crossfade if it's the last slide
      const isCrossfading = !isLastSlide && (frameInSlide > totalFramesPerSlide - crossfadeFrames);
      
      // Draw current slide
      const progress = frameInSlide / totalFramesPerSlide;
      const scale = 1 + progress * zoomAmount;
      
      const drawImageWithKenBurns = (img: HTMLCanvasElement, scl: number, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        // Translate to center, scale, translate back
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scl, scl);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore();
      };

      if (isCrossfading) {
        const crossfadeProgress = (frameInSlide - (totalFramesPerSlide - crossfadeFrames)) / crossfadeFrames;
        
        // Draw current slide fading out
        drawImageWithKenBurns(renderedFrames[currentSlide], scale, 1 - crossfadeProgress);
        
        // Draw next slide fading in
        const nextScale = 1 + (crossfadeProgress * crossfadeFrames / totalFramesPerSlide) * zoomAmount;
        drawImageWithKenBurns(renderedFrames[currentSlide + 1], nextScale, crossfadeProgress);
      } else {
        drawImageWithKenBurns(renderedFrames[currentSlide], scale, 1);
      }

      frameInSlide++;
      
      // Update encoding progress (50% to 100%)
      const totalOverallFrames = renderedFrames.length * totalFramesPerSlide;
      const currentOverallFrame = (currentSlide * totalFramesPerSlide) + frameInSlide;
      const encodeProgress = 50 + Math.round((currentOverallFrame / totalOverallFrames) * 50);
      // Throttle progress updates to avoid overwhelming React (e.g., every 5 frames)
      if (currentOverallFrame % 5 === 0) {
        onProgress(`Encoding frame ${currentOverallFrame}/${totalOverallFrames}...`, encodeProgress);
      }

      if (frameInSlide >= totalFramesPerSlide) {
        frameInSlide = 0;
        currentSlide++;
      }

      if (currentSlide >= renderedFrames.length) {
        // Animation complete
        onProgress('Finalizing video...', 100);
        recorder.stop();
        return;
      }

      // 33.3ms for ~30fps
      setTimeout(drawFrame, 1000 / fps);
    };

    drawFrame();
  });
}
