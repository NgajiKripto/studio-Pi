"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZepretButton, ZepretCard, ZepretBadge } from '@/components/ZepretUI';
import { Camera, Timer, X, Sparkles, Check, Download, Share2, AlertCircle } from 'lucide-react';
import { aiPoseGuide } from '@/ai/flows/ai-pose-guide';
import { generateSocialShareSuggestions } from '@/ai/flows/ai-social-share-suggestions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Step = 'permission' | 'terms' | 'package' | 'payment' | 'session' | 'review';
type CameraFilterId = 'none' | 'bw' | 'silhouette' | 'mist' | 'infrared' | 'doubleExposure' | 'bokeh';

const STEPS: Step[] = ['permission', 'terms', 'package', 'payment', 'session', 'review'];
const ADVANCED_FILTERS: CameraFilterId[] = ['infrared', 'doubleExposure', 'bokeh'];

const FILTER_OPTIONS: Array<{ id: CameraFilterId; label: string; category: string }> = [
  { id: 'none', label: 'Original', category: 'Default' },
  { id: 'bw', label: 'Black & White', category: 'CSS' },
  { id: 'silhouette', label: 'Siluet', category: 'CSS' },
  { id: 'mist', label: 'Fog / Mist', category: 'CSS' },
  { id: 'infrared', label: 'Infrared', category: 'Canvas' },
  { id: 'doubleExposure', label: 'Double Exposure', category: 'Canvas' },
  { id: 'bokeh', label: 'Bokeh AI', category: 'AI/ML' },
];

const drawMirroredFrame = (ctx: CanvasRenderingContext2D, video: HTMLVideoElement, width: number, height: number) => {
  ctx.save();
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, width, height);
  ctx.restore();
};

const applyInfraredMapping = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    pixels[i] = Math.min(255, luminance * 380); // red
    pixels[i + 1] = Math.min(255, Math.pow(luminance, 1.7) * 255); // green
    pixels[i + 2] = Math.min(255, (1 - luminance) * 220 + 25); // blue
  }

  ctx.putImageData(imageData, 0, 0);
};

const drawGeneratedBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#25053f');
  gradient.addColorStop(0.5, '#5203d5');
  gradient.addColorStop(1, '#ff5a8f');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const glow = ctx.createRadialGradient(width * 0.7, height * 0.3, 20, width * 0.7, height * 0.3, width * 0.7);
  glow.addColorStop(0, 'rgba(255,255,255,0.25)');
  glow.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
};

const drawWithCanvasFilter = (ctx: CanvasRenderingContext2D, filter: string, draw: () => void) => {
  const previous = ctx.filter;
  ctx.filter = filter;
  draw();
  ctx.filter = previous;
};

declare global {
  interface Window {
    SelfieSegmentation?: new (options: { locateFile: (file: string) => string }) => {
      setOptions: (options: { modelSelection: number }) => void;
      onResults: (callback: (results: { segmentationMask?: HTMLCanvasElement }) => void) => void;
      send: (payload: { image: HTMLVideoElement }) => Promise<void>;
      close?: () => void;
    };
  }
}

export default function StudioSession() {
  const [step, setStep] = useState<Step>('permission');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [packageType, setPackageType] = useState<'5min' | '10min' | null>(null);
  const [activeFrame, setActiveFrame] = useState(PlaceHolderImages[0].imageUrl);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureCountdown, setCaptureCountdown] = useState<number | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [socialSuggestions, setSocialSuggestions] = useState<{captions: string[], hashtags: string[]} | null>(null);
  const [activeFilter, setActiveFilter] = useState<CameraFilterId>('none');
  const [isBokehModelReady, setIsBokehModelReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const bokehMaskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const selfieSegmentationRef = useRef<InstanceType<NonNullable<typeof window.SelfieSegmentation>> | null>(null);
  const segmentationPendingRef = useRef(false);
  const sharpFrameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const blurredFrameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const foregroundCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentStepIndex = STEPS.indexOf(step);
  const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;
  const requiresCanvasPreview = ADVANCED_FILTERS.includes(activeFilter);
  const previewCssFilter = activeFilter === 'bw'
    ? 'grayscale(1)'
    : activeFilter === 'silhouette'
      ? 'contrast(2.8) brightness(0.45)'
      : 'none';

  const drawPhotoWithActiveFilter = useCallback(async (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    sourceVideo: HTMLVideoElement
  ) => {
    ctx.clearRect(0, 0, width, height);

    if (activeFilter === 'bw' || activeFilter === 'silhouette') {
      drawWithCanvasFilter(ctx, previewCssFilter, () => drawMirroredFrame(ctx, sourceVideo, width, height));
      return;
    }

    if (activeFilter === 'mist') {
      drawWithCanvasFilter(ctx, 'saturate(1.05) contrast(1.05)', () => drawMirroredFrame(ctx, sourceVideo, width, height));
      drawWithCanvasFilter(ctx, 'blur(2px)', () => drawMirroredFrame(ctx, sourceVideo, width, height));
      const mistLayer = ctx.createLinearGradient(0, 0, 0, height);
      mistLayer.addColorStop(0, 'rgba(255,255,255,0.24)');
      mistLayer.addColorStop(1, 'rgba(228,240,255,0.08)');
      ctx.fillStyle = mistLayer;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    if (activeFilter === 'infrared') {
      drawMirroredFrame(ctx, sourceVideo, width, height);
      applyInfraredMapping(ctx, width, height);
      return;
    }

    if (activeFilter === 'doubleExposure') {
      drawGeneratedBackground(ctx, width, height);
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = 0.8;
      drawMirroredFrame(ctx, sourceVideo, width, height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      drawWithCanvasFilter(ctx, 'blur(1px)', () => drawMirroredFrame(ctx, sourceVideo, width, height));
      return;
    }

    if (activeFilter === 'bokeh') {
      if (!sharpFrameCanvasRef.current) sharpFrameCanvasRef.current = document.createElement('canvas');
      if (!blurredFrameCanvasRef.current) blurredFrameCanvasRef.current = document.createElement('canvas');
      if (!foregroundCanvasRef.current) foregroundCanvasRef.current = document.createElement('canvas');

      const sharpCanvas = sharpFrameCanvasRef.current;
      const blurredCanvas = blurredFrameCanvasRef.current;
      const foregroundCanvas = foregroundCanvasRef.current;

      [sharpCanvas, blurredCanvas, foregroundCanvas].forEach((offscreen) => {
        offscreen.width = width;
        offscreen.height = height;
      });

      const sharpCtx = sharpCanvas.getContext('2d');
      const blurredCtx = blurredCanvas.getContext('2d');
      const foregroundCtx = foregroundCanvas.getContext('2d');

      if (sharpCtx && blurredCtx && foregroundCtx) {
        sharpCtx.clearRect(0, 0, width, height);
        blurredCtx.clearRect(0, 0, width, height);
        foregroundCtx.clearRect(0, 0, width, height);

        drawMirroredFrame(sharpCtx, sourceVideo, width, height);
        drawWithCanvasFilter(blurredCtx, 'blur(14px)', () => drawMirroredFrame(blurredCtx, sourceVideo, width, height));

        ctx.drawImage(blurredCanvas, 0, 0);

        const maskCanvas = bokehMaskCanvasRef.current;
        if (maskCanvas) {
          foregroundCtx.drawImage(sharpCanvas, 0, 0);
          foregroundCtx.globalCompositeOperation = 'destination-in';
          foregroundCtx.drawImage(maskCanvas, 0, 0, width, height);
          foregroundCtx.globalCompositeOperation = 'source-over';
          ctx.drawImage(foregroundCanvas, 0, 0);
          return;
        }
      }

      drawMirroredFrame(ctx, sourceVideo, width, height);
      return;
    }

    drawMirroredFrame(ctx, sourceVideo, width, height);
  }, [activeFilter, previewCssFilter]);

  const requestCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 }, 
          facingMode: "user" 
        }, 
        audio: false 
      });
      setStream(s);
      setStep('terms');
    } catch (err) {
      alert('Akses kamera ditolak. Plis izinin biar bisa Zepret!');
    }
  };

  // Sync stream to video element whenever step becomes 'session'
  useEffect(() => {
    if (step === 'session' && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [step, stream]);

  useEffect(() => {
    if (activeFilter !== 'bokeh') return;
    if (selfieSegmentationRef.current || typeof window === 'undefined') return;

    let mounted = true;
    const scriptId = 'mediapipe-selfie-segmentation';

    const initializeModel = () => {
      if (!window.SelfieSegmentation) return;
      const model = new window.SelfieSegmentation({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });
      model.setOptions({ modelSelection: 1 });
      model.onResults((results) => {
        if (!mounted || !results.segmentationMask) return;
        const maskCanvas = bokehMaskCanvasRef.current ?? document.createElement('canvas');
        bokehMaskCanvasRef.current = maskCanvas;
        const source = results.segmentationMask;
        maskCanvas.width = source.width;
        maskCanvas.height = source.height;
        const maskCtx = maskCanvas.getContext('2d');
        if (!maskCtx) return;
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
        maskCtx.drawImage(source, 0, 0, maskCanvas.width, maskCanvas.height);
      });
      selfieSegmentationRef.current = model;
      if (mounted) setIsBokehModelReady(true);
    };

    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) {
      if (window.SelfieSegmentation) {
        initializeModel();
      } else {
        existing.addEventListener('load', initializeModel, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
    script.async = true;
    script.onload = initializeModel;
    document.head.appendChild(script);

    return () => {
      mounted = false;
    };
  }, [activeFilter]);

  useEffect(() => {
    if (step !== 'session' || !requiresCanvasPreview) return;
    const video = videoRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!video || !previewCanvas) return;

    let raf = 0;
    let disposed = false;

    const render = async () => {
      if (disposed) return;
      const width = video.videoWidth;
      const height = video.videoHeight;
      if (width > 0 && height > 0) {
        if (previewCanvas.width !== width || previewCanvas.height !== height) {
          previewCanvas.width = width;
          previewCanvas.height = height;
        }
        const previewCtx = previewCanvas.getContext('2d');
        if (previewCtx) {
          if (activeFilter === 'bokeh' && selfieSegmentationRef.current && !segmentationPendingRef.current) {
            segmentationPendingRef.current = true;
            selfieSegmentationRef.current.send({ image: video }).catch(console.error).finally(() => {
              segmentationPendingRef.current = false;
            });
          }
          await drawPhotoWithActiveFilter(previewCtx, width, height, video);
        }
      }
      raf = window.requestAnimationFrame(() => void render());
    };

    raf = window.requestAnimationFrame(() => void render());
    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
    };
  }, [step, activeFilter, requiresCanvasPreview, drawPhotoWithActiveFilter]);

  // Handle timer for the session
  useEffect(() => {
    if (step === 'session' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (step === 'session' && timeLeft === 0) {
      setStep('review');
    }
  }, [step, timeLeft]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      selfieSegmentationRef.current?.close?.();
    };
  }, [stream]);

  const handlePackageSelect = (type: '5min' | '10min') => {
    setPackageType(type);
    setStep('payment');
  };

  const handlePaymentComplete = () => {
    setTimeLeft(packageType === '5min' ? 300 : 600);
    setStep('session');
  };

  const startCaptureCountdown = () => {
    if (captureCountdown !== null) return; // Prevent multiple countdowns
    setCaptureCountdown(5);

    let count = 5;
    const timer = setInterval(() => {
      count -= 1;
      setCaptureCountdown(count);

      if (count === 0) {
        clearInterval(timer);
        capturePhoto();
      }
    }, 1000);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    
    // Reset countdown state
    setCaptureCountdown(null);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      if (activeFilter === 'bokeh' && selfieSegmentationRef.current && !segmentationPendingRef.current) {
        segmentationPendingRef.current = true;
        try {
          await selfieSegmentationRef.current.send({ image: videoRef.current });
        } catch (error) {
          console.error(error);
        } finally {
          segmentationPendingRef.current = false;
        }
      }

      await drawPhotoWithActiveFilter(ctx, canvas.width, canvas.height, videoRef.current);
      const dataUri = canvas.toDataURL('image/jpeg');
      setCapturedPhotos(prev => [dataUri, ...prev]);
      
      setIsLoadingAi(true);
      try {
        const suggestion = await aiPoseGuide({ photoDataUri: dataUri, currentContext: "Cool pose" });
        setAiSuggestion(suggestion.suggestion);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingAi(false);
      }
    }
    
    setTimeout(() => setIsCapturing(false), 300);
  };

  const generateSocialIdeas = async () => {
    if (capturedPhotos.length === 0) return;
    setIsLoadingAi(true);
    try {
      const res = await generateSocialShareSuggestions({ photoDataUri: capturedPhotos[0] });
      setSocialSuggestions(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 md:py-12 px-4 space-y-8 md:space-y-12">
      {/* Step Progress Bar */}
      <div className="max-w-xl mx-auto space-y-3">
        <div className="flex justify-between items-end">
           <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary">Progress: {Math.round(progressPercent)}%</p>
           <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">Step {currentStepIndex + 1} of 6</p>
        </div>
        <div className="h-1.5 md:h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,90,143,0.5)]" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {step === 'permission' && (
        <ZepretCard className="max-w-md mx-auto space-y-6 text-center border-primary/20 p-6 md:p-8">
          <div className="flex justify-center">
            <div className="p-4 md:p-6 bg-primary/10 rounded-full animate-pulse-glow">
              <Camera className="text-primary w-8 h-8 md:w-12 md:h-12" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-headline font-black">Izin Kamera Dong!</h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Kamera cuma dipake buat sesi foto lo & gak bakal kita simpen tanpa izin. Janji! ✌️
          </p>
          <ZepretButton onClick={requestCamera} className="w-full py-4">
            Izinkan Kamera
          </ZepretButton>
        </ZepretCard>
      )}

      {step === 'terms' && (
        <ZepretCard className="max-w-md mx-auto space-y-6 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-headline font-black">Baca Dikit Ya...</h2>
          <div className="bg-surface-container-lowest/50 border border-white/5 p-4 space-y-3 text-sm font-medium h-48 overflow-y-auto rounded-lg">
            <p className="flex gap-2"><AlertCircle size={16} className="text-primary shrink-0" /> Kamera hanya digunakan selama sesi aktif.</p>
            <p className="flex gap-2"><AlertCircle size={16} className="text-primary shrink-0" /> Data foto tersimpan sementara di browser lo.</p>
            <p className="flex gap-2"><AlertCircle size={16} className="text-primary shrink-0" /> Dilarang pose yang aneh-aneh (NSFW).</p>
            <p className="flex gap-2"><AlertCircle size={16} className="text-primary shrink-0" /> Zepret berhak menghapus data setelah 24 jam.</p>
            <p className="flex gap-2"><AlertCircle size={16} className="text-primary shrink-0" /> Sesi yang udah dibayar gak bisa refund (sorry!).</p>
          </div>
          <ZepretButton onClick={() => setStep('package')} className="w-full">
            Gue Setuju!
          </ZepretButton>
        </ZepretCard>
      )}

      {step === 'package' && (
        <div className="space-y-8 md:space-y-12 text-center">
          <h2 className="text-3xl md:text-5xl font-headline font-black">Pilih Paket <span className="text-primary">Gaya Lo</span></h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            <ZepretCard className="flex flex-col items-center space-y-6 group hover:border-primary/40 p-6 md:p-8">
              <ZepretBadge>Starter Pack</ZepretBadge>
              <h3 className="text-3xl md:text-4xl font-black">Rp 6k</h3>
              <p className="text-sm md:text-base text-on-surface-variant font-bold">5 Menit Sesi</p>
              <ul className="text-left space-y-3 w-full text-sm md:text-base">
                <li className="flex items-center gap-2"><Check className="text-primary" size={18} /> Unlimited Snaps</li>
                <li className="flex items-center gap-2"><Check className="text-primary" size={18} /> Standard Frames</li>
                <li className="flex items-center gap-2 text-zinc-600"><X size={18} /> HD Download</li>
              </ul>
              <ZepretButton variant="outline" onClick={() => handlePackageSelect('5min')} className="w-full">
                Pilih Ini
              </ZepretButton>
            </ZepretCard>

            <ZepretCard className="flex flex-col items-center space-y-6 bg-primary-container/5 border-primary/50 relative overflow-hidden p-6 md:p-8">
              <div className="absolute top-4 right-4 rotate-12 bg-primary px-3 py-1 text-[9px] md:text-[10px] font-black uppercase rounded text-on-primary-fixed">Hype</div>
              <ZepretBadge color="tertiary">Pro Zepret</ZepretBadge>
              <h3 className="text-3xl md:text-4xl font-black">Rp 12k</h3>
              <p className="text-sm md:text-base text-on-surface-variant font-bold">10 Menit Sesi</p>
              <ul className="text-left space-y-3 w-full text-sm md:text-base">
                <li className="flex items-center gap-2"><Check className="text-tertiary" size={18} /> Unlimited Snaps</li>
                <li className="flex items-center gap-2"><Check className="text-tertiary" size={18} /> Free 3 Aksesoris 3D</li>
                <li className="flex items-center gap-2"><Check className="text-tertiary" size={18} /> Cloud Storage 7 Hari</li>
              </ul>
              <ZepretButton onClick={() => handlePackageSelect('10min')} className="w-full">
                Sikat!
              </ZepretButton>
            </ZepretCard>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <ZepretCard className="max-w-md mx-auto space-y-6 text-center border-tertiary/20 p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-black italic">Bayar Dulu Bos!</h2>
          <div className="glass-panel p-3 md:p-4 inline-block bg-white rounded-2xl overflow-hidden">
            <div className="w-48 h-48 md:w-64 md:h-64 bg-zinc-100 flex items-center justify-center border-2 border-dashed border-zinc-300 rounded-xl">
              <span className="font-headline text-3xl md:text-4xl text-zinc-300 font-black">QRIS</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xl md:text-2xl font-black text-white">Total: {packageType === '5min' ? 'Rp 6.000' : 'Rp 12.000'}</p>
            <p className="text-[10px] md:text-xs uppercase font-bold text-tertiary">Gopay / OVO / Dana / ShopeePay</p>
          </div>
          <ZepretButton onClick={handlePaymentComplete} className="w-full" variant="secondary">
            Gue Udah Bayar!
          </ZepretButton>
        </ZepretCard>
      )}

      {step === 'session' && (
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="relative glass-panel rounded-xl md:rounded-2xl bg-black aspect-video overflow-hidden shadow-[0_0_100px_rgba(255,90,143,0.15)]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={cn(
                  "w-full h-full object-cover scale-x-[-1]",
                  requiresCanvasPreview ? "opacity-0" : "opacity-100",
                )}
                style={{ filter: previewCssFilter }}
              />

              {requiresCanvasPreview && (
                <canvas
                  ref={previewCanvasRef}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {activeFilter === 'mist' && (
                <div className="absolute inset-0 pointer-events-none bg-white/10 backdrop-blur-[2px]" />
              )}
              
              {isCapturing && (
                <div className="absolute inset-0 bg-white animate-pulse z-50" />
              )}

              {captureCountdown !== null && captureCountdown > 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-[10rem] md:text-[15rem] font-black text-white/50 z-50 pointer-events-none drop-shadow-2xl">
                  {captureCountdown}
                </div>
              )}

              <div className="absolute top-4 left-4 md:top-6 md:left-6">
                <div className={cn(
                  "glass-panel px-4 py-1.5 md:px-6 md:py-2 flex items-center gap-2 md:gap-3 font-headline font-bold rounded-full text-sm md:text-base",
                  timeLeft < 30 ? "bg-red-500/20 text-red-500 animate-pulse" : "text-white"
                )}>
                  <Timer className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {aiSuggestion && !isCapturing && (
                <div className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 w-[90%] md:w-[85%]">
                  <ZepretCard className="bg-tertiary/10 border-tertiary/30 py-3 md:py-4 px-4 md:px-6 animate-bounce backdrop-blur-md">
                    <p className="text-xs md:text-sm font-black flex items-center gap-2 md:gap-3 text-tertiary">
                      <Sparkles className="w-4 h-4 md:w-[18px] md:h-[18px]" /> {aiSuggestion}
                    </p>
                  </ZepretCard>
                </div>
              )}

              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2">
                <button
                  onClick={startCaptureCountdown}
                  disabled={isCapturing || captureCountdown !== null}
                  className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-primary to-primary-container p-1 rounded-full shadow-[0_0_20px_rgba(255,90,143,0.5)] md:shadow-[0_0_30px_rgba(255,90,143,0.5)] hover:scale-105 active:scale-95 transition-all group"
                >
                  <div className="w-full h-full rounded-full border-2 md:border-4 border-white/30 flex items-center justify-center">
                    <div className="w-10 h-10 md:w-16 md:h-16 bg-white rounded-full group-active:bg-tertiary transition-colors" />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {capturedPhotos.length > 0 ? (
                capturedPhotos.map((photo, i) => (
                  <div key={i} className="min-w-[120px] md:min-w-[160px] h-[120px] md:h-[160px] glass-panel p-1.5 md:p-2 rounded-lg md:rounded-xl shrink-0 rotate-1 transform hover:rotate-0 transition-transform">
                    <img src={photo} alt="Captured" className="w-full h-full object-cover rounded-md md:rounded-lg" />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-zinc-600 font-bold uppercase tracking-widest border-2 border-dashed border-white/5 rounded-2xl">
                  Belum Ada Foto
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <ZepretCard className="p-6">
              <h3 className="text-sm md:text-lg font-black mb-4 md:mb-6 uppercase tracking-widest text-secondary">Filter Kamera</h3>
              <ScrollArea className="h-40">
                <div className="grid grid-cols-2 gap-2 md:gap-3 pr-3">
                  {FILTER_OPTIONS.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-left transition-all",
                        activeFilter === filter.id
                          ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(255,90,143,0.25)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400">{filter.category}</p>
                      <p className="text-xs md:text-sm font-bold text-white">{filter.label}</p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
              {activeFilter === 'bokeh' && (
                <p className="mt-4 text-[11px] text-zinc-400 font-bold">
                  {isBokehModelReady ? 'Model segmentasi aktif: blur hanya area background.' : 'Memuat model segmentasi ringan...'}
                </p>
              )}
            </ZepretCard>

            <ZepretCard className="bg-surface-container-low/50 p-6">
              <h3 className="text-sm md:text-lg font-black mb-4 md:mb-6 uppercase tracking-widest text-primary">Frames</h3>
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 md:gap-3">
                {PlaceHolderImages.filter(p => p.id.startsWith('frame')).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFrame(f.imageUrl)}
                    className={cn(
                      "aspect-[3/4] rounded-lg border-2 transition-all overflow-hidden",
                      activeFrame === f.imageUrl ? "border-primary shadow-[0_0_10px_rgba(255,90,143,0.3)]" : "border-white/10 opacity-60"
                    )}
                  >
                    <img src={f.imageUrl} alt={f.description} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </ZepretCard>

            <ZepretCard className="p-6">
              <h3 className="text-sm md:text-lg font-black mb-4 md:mb-6 uppercase tracking-widest text-tertiary">Accessories</h3>
              <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 md:gap-3">
                 {PlaceHolderImages.filter(p => p.id.startsWith('sticker')).map(s => (
                  <button
                    key={s.id}
                    className="aspect-square glass-panel p-1.5 md:p-2 rounded-lg hover:bg-tertiary/20 transition-all group"
                  >
                    <img src={s.imageUrl} alt={s.description} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </ZepretCard>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-8 md:space-y-12 max-w-5xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-6xl font-headline font-black italic text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container leading-tight">MANTEP!</h2>
            <p className="text-base md:text-xl font-bold text-on-surface-variant">Cek hasil zepretan holographic lo.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <div className="glass-panel p-4 md:p-6 rounded-xl md:rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <div className="aspect-[3/4] bg-surface-container-lowest rounded-lg md:rounded-xl overflow-hidden relative border border-white/10">
                   {capturedPhotos.length > 0 ? (
                     <div className="grid grid-cols-2 gap-2 p-2 w-full h-full">
                       {capturedPhotos.slice(0, 4).map((p, i) => (
                         <img key={i} src={p} className="w-full h-full object-cover rounded-md md:rounded-lg border border-white/10" alt="Final" />
                       ))}
                     </div>
                   ) : (
                     <div className="flex items-center justify-center h-full text-zinc-700 font-headline font-black">NO CONTENT</div>
                   )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <ZepretButton className="w-full py-3 text-sm">
                  <Download className="mr-1.5 md:mr-2" size={18} /> Simpan
                </ZepretButton>
                <ZepretButton variant="secondary" className="w-full py-3 text-sm">
                  <Share2 className="mr-1.5 md:mr-2" size={18} /> Share
                </ZepretButton>
              </div>
            </div>

            <div className="space-y-6">
              <ZepretCard className="border-tertiary/30 bg-tertiary/5 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-6 flex items-center gap-3 text-tertiary">
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6" /> AI Caption Gen
                </h3>
                {isLoadingAi ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white/10 w-full rounded" />
                    <div className="h-4 bg-white/10 w-[80%] rounded" />
                  </div>
                ) : socialSuggestions ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-500">Captions</p>
                      {socialSuggestions.captions.slice(0, 2).map((c, i) => (
                        <p key={i} className="text-sm font-bold glass-panel p-3 md:p-4 rounded-xl leading-relaxed">{c}</p>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {socialSuggestions.hashtags.map((h, i) => (
                        <span key={i} className="text-[9px] md:text-[10px] font-black bg-tertiary text-on-tertiary px-2.5 py-1 rounded-full">{h}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ZepretButton variant="glass" onClick={generateSocialIdeas} className="w-full py-4 text-sm">
                    Generate Ide Caption
                  </ZepretButton>
                )}
              </ZepretCard>

              <ZepretCard className="border-dashed border-zinc-700 bg-transparent text-center p-6 md:p-8">
                <p className="text-sm md:text-base font-bold text-zinc-500 mb-6">Mau Zepret lagi? <br/> Ada diskon 20% buat sesi berikutnya!</p>
                <ZepretButton variant="outline" onClick={() => window.location.reload()} className="w-full py-3 text-sm">
                  Mulai Sesi Baru
                </ZepretButton>
              </ZepretCard>
            </div>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
