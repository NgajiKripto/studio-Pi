"use client";
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as tf from '@tensorflow/tfjs';
// To fix WebGL backend we would normally import '@tensorflow/tfjs-backend-webgl'; but it is part of core

export type FilterType = 'none' | 'bw' | 'silhouette' | 'fog' | 'infrared' | 'double-exposure' | 'bokeh';

export interface CameraViewportProps {
  stream: MediaStream | null;
  filterType: FilterType;
  className?: string;
}

export interface CameraViewportRef {
  capture: () => string | null;
}

export const CameraViewport = forwardRef<CameraViewportRef, CameraViewportProps>(
  ({ stream, filterType, className }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const renderCanvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const backgroundImageUrl = 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2342&auto=format&fit=crop';
    const bgImageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = backgroundImageUrl;
      img.onload = () => {
        bgImageRef.current = img;
      };
    }, []);

    useEffect(() => {
      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
      }
    }, [stream]);

    const segmenterRef = useRef<any | null>(null);

    useEffect(() => {
      const initSegmenter = async () => {
        if (!segmenterRef.current) {
          try {
            await tf.ready();
            const bodySegmentation = await import('@tensorflow-models/body-segmentation');
            const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
            const segmenterConfig: any = {
              runtime: 'tfjs', // Use 'tfjs' instead of 'mediapipe' to reduce heavy loading issues if mediapipe tasks vision not loaded perfectly
              modelType: 'general'
            };
            segmenterRef.current = await bodySegmentation.createSegmenter(model, segmenterConfig);
          } catch (e) {
            console.error("Failed to load segmenter", e);
          }
        }
      };

      if (filterType === 'bokeh') {
        initSegmenter();
      }
    }, [filterType]);

    useEffect(() => {
      const video = videoRef.current;
      const renderCanvas = renderCanvasRef.current;
      if (!video || !renderCanvas) return;

      const processFrame = async () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          if (filterType === 'infrared' || filterType === 'double-exposure' || filterType === 'bokeh') {
            const ctx = renderCanvas.getContext('2d', { willReadFrequently: true });
            if (ctx) {
              if (renderCanvas.width !== video.videoWidth) {
                 renderCanvas.width = video.videoWidth;
                 renderCanvas.height = video.videoHeight;
              }

              ctx.save();
              ctx.translate(renderCanvas.width, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(video, 0, 0, renderCanvas.width, renderCanvas.height);
              ctx.restore();

              if (filterType === 'infrared') {
                const imageData = ctx.getImageData(0, 0, renderCanvas.width, renderCanvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                  const r = data[i];
                  const g = data[i + 1];
                  const b = data[i + 2];
                  // Swap red and blue, boost red
                  data[i] = Math.min(255, b * 1.5);
                  data[i + 1] = g * 0.8;
                  data[i + 2] = r * 0.5;
                }
                ctx.putImageData(imageData, 0, 0);
              } else if (filterType === 'double-exposure' && bgImageRef.current) {
                ctx.globalCompositeOperation = 'screen';
                ctx.drawImage(bgImageRef.current, 0, 0, renderCanvas.width, renderCanvas.height);
                ctx.globalCompositeOperation = 'source-over';
              } else if (filterType === 'bokeh' && segmenterRef.current) {
                try {
                  const segmentation = await segmenterRef.current.segmentPeople(video, {
                    flipHorizontal: true,
                    multiSegmentation: false,
                    segmentBodyParts: false,
                  });

                  if (segmentation && segmentation.length > 0) {
                     const foregroundThreshold = 0.5;
                     const edgeBlurAmount = 3;
                     const blurAmount = 10;

                     // We use the drawBokehEffect provided by the library
                     const bodySegmentation = await import('@tensorflow-models/body-segmentation');
                     await bodySegmentation.drawBokehEffect(
                       renderCanvas,
                       video,
                       segmentation,
                       foregroundThreshold,
                       blurAmount,
                       edgeBlurAmount,
                       true // flipHorizontal
                     );
                  }
                } catch (e) {
                   // ignoring transient segmentation errors
                }
              }
            }
          }
        }
        animationFrameRef.current = requestAnimationFrame(processFrame);
      };

      if (filterType === 'infrared' || filterType === 'double-exposure' || filterType === 'bokeh') {
        animationFrameRef.current = requestAnimationFrame(processFrame);
      } else {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
      }

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [filterType, stream]);

    useImperativeHandle(ref, () => ({
      capture: () => {
        if (!videoRef.current || !canvasRef.current) return null;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        if (filterType === 'infrared' || filterType === 'double-exposure' || filterType === 'bokeh') {
          // If canvas filters are active, use the rendered canvas
          if (renderCanvasRef.current) {
            ctx.drawImage(renderCanvasRef.current, 0, 0);
          }
        } else {
          // Otherwise, capture straight from video
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);

          if (filterType === 'bw') {
            ctx.filter = 'grayscale(100%)';
          } else if (filterType === 'silhouette') {
            ctx.filter = 'contrast(200%) brightness(50%)';
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (filterType === 'fog') {
             ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
             ctx.fillRect(0, 0, canvas.width, canvas.height);
             // Note: actual canvas blur matching CSS backdrop-filter is complex,
             // we'll stick to a semi-transparent white overlay for the static capture
          }
        }

        return canvas.toDataURL('image/jpeg');
      }
    }));

    const getCssFilterClass = () => {
      switch (filterType) {
        case 'bw':
          return 'grayscale';
        case 'silhouette':
          return 'contrast-[200%] brightness-[50%]';
        default:
          return '';
      }
    };

    return (
      <div className={`relative ${className || ''}`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover scale-x-[-1] transition-all duration-300 ${getCssFilterClass()}`}
        />

        {filterType === 'fog' && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm pointer-events-none transition-all duration-300" />
        )}

        <canvas
          ref={renderCanvasRef}
          className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${(filterType === 'infrared' || filterType === 'double-exposure' || filterType === 'bokeh') ? 'opacity-100' : 'opacity-0'}`}
        />

        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }
);

CameraViewport.displayName = 'CameraViewport';
