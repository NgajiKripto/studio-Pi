"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ZepretButton, ZepretCard, ZepretBadge } from '@/components/ZepretUI';
import { Camera, Timer, X, Sparkles, Check, Download, Share2, Wand2, ChevronRight, AlertCircle } from 'lucide-react';
import { aiPoseGuide } from '@/ai/flows/ai-pose-guide';
import { generateSocialShareSuggestions } from '@/ai/flows/ai-social-share-suggestions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { CameraViewportRef, FilterType } from './CameraViewport';

// Fix Next.js SSR error regarding SelfieSegmentation in @tensorflow-models/body-segmentation
// Using the new dynamic import syntax without `ssr: false` in app router if possible,
// or let's try isolating the CameraViewport to be purely client-side
const CameraViewport = dynamic(() => import('./CameraViewport').then(mod => mod.CameraViewport), { ssr: false });
import { ScrollArea } from '@/components/ui/scroll-area';

type Step = 'permission' | 'terms' | 'package' | 'payment' | 'session' | 'review';

const STEPS: Step[] = ['permission', 'terms', 'package', 'payment', 'session', 'review'];

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
  const [activeFilter, setActiveFilter] = useState<FilterType>('none');

  const viewportRef = useRef<CameraViewportRef>(null);

  const currentStepIndex = STEPS.indexOf(step);
  const progressPercent = ((currentStepIndex + 1) / STEPS.length) * 100;

  const requestCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 720 },
          height: { ideal: 1280 },
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
    if (!viewportRef.current) return;
    setIsCapturing(true);
    
    // Reset countdown state
    setCaptureCountdown(null);

    const dataUri = viewportRef.current.capture();

    if (dataUri) {
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
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8 w-full min-w-0">
          <div className="lg:col-span-3 space-y-6 min-w-0">
            <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
               {['none', 'bw', 'silhouette', 'fog', 'infrared', 'double-exposure', 'bokeh'].map((f) => (
                 <button
                   key={f}
                   onClick={() => setActiveFilter(f as FilterType)}
                   className={cn(
                     "shrink-0 px-4 py-2 text-xs md:text-sm rounded-full font-bold uppercase tracking-widest whitespace-nowrap transition-colors",
                     activeFilter === f ? "bg-primary text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                   )}
                 >
                   {f}
                 </button>
               ))}
            </div>
            <div className="relative glass-panel rounded-xl md:rounded-2xl bg-black aspect-[3/4] overflow-hidden shadow-[0_0_100px_rgba(255,90,143,0.15)]">
              <CameraViewport
                ref={viewportRef}
                stream={stream}
                filterType={activeFilter}
                className="w-full h-full"
              />
              
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

    </div>
  );
}
