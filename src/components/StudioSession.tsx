"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ZepretButton, ZepretCard, ZepretBadge } from '@/components/ZepretUI';
import { Camera, Timer, X, Sparkles, Check, Download, Share2, Wand2 } from 'lucide-react';
import { aiPoseGuide } from '@/ai/flows/ai-pose-guide';
import { generateSocialShareSuggestions } from '@/ai/flows/ai-social-share-suggestions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

type Step = 'permission' | 'terms' | 'package' | 'payment' | 'session' | 'review';

export default function StudioSession() {
  const [step, setStep] = useState<Step>('permission');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [packageType, setPackageType] = useState<'5min' | '10min' | null>(null);
  const [activeFrame, setActiveFrame] = useState(PlaceHolderImages[0].imageUrl);
  const [isCapturing, setIsCapturing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [socialSuggestions, setSocialSuggestions] = useState<{captions: string[], hashtags: string[]} | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const requestCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 }, audio: false });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setStep('terms');
    } catch (err) {
      alert('Akses kamera ditolak. Plis izinin biar bisa Zepret!');
    }
  };

  useEffect(() => {
    if (step === 'session' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (step === 'session' && timeLeft === 0) {
      setStep('review');
    }
  }, [step, timeLeft]);

  const handlePackageSelect = (type: '5min' | '10min') => {
    setPackageType(type);
    setStep('payment');
  };

  const handlePaymentComplete = () => {
    setTimeLeft(packageType === '5min' ? 300 : 600);
    setStep('session');
    if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
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
    <div className="w-full max-w-6xl mx-auto py-12 px-4 space-y-8">
      {step === 'permission' && (
        <ZepretCard className="max-w-md mx-auto space-y-6 text-center border-primary/20">
          <div className="flex justify-center">
            <div className="p-6 bg-primary/10 rounded-full animate-pulse-glow">
              <Camera size={48} className="text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-headline font-black">Izin Kamera Dong!</h2>
          <p className="text-on-surface-variant">
            Kamera cuma dipake buat sesi foto lo & gak bakal kita simpen tanpa izin. Janji! ✌️
          </p>
          <ZepretButton onClick={requestCamera} className="w-full py-4">
            Izinkan Kamera
          </ZepretButton>
        </ZepretCard>
      )}

      {step === 'terms' && (
        <ZepretCard className="max-w-md mx-auto space-y-6">
          <h2 className="text-3xl font-headline font-black">Baca Dikit Ya...</h2>
          <div className="bg-surface-container-lowest/50 border border-white/5 p-4 space-y-3 text-sm font-medium h-48 overflow-y-auto rounded-lg">
            <p>1. Kamera hanya digunakan selama sesi aktif.</p>
            <p>2. Data foto tersimpan sementara di browser lo.</p>
            <p>3. Dilarang pose yang aneh-aneh (NSFW).</p>
            <p>4. Zepret berhak menghapus data setelah 24 jam.</p>
            <p>5. Sesi yang udah dibayar gak bisa refund (sorry!).</p>
          </div>
          <ZepretButton onClick={() => setStep('package')} className="w-full">
            Gue Setuju!
          </ZepretButton>
        </ZepretCard>
      )}

      {step === 'package' && (
        <div className="space-y-12 text-center">
          <h2 className="text-4xl md:text-5xl font-headline font-black">Pilih Paket <span className="text-primary">Gaya Lo</span></h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ZepretCard className="flex flex-col items-center space-y-6 group hover:border-primary/40">
              <ZepretBadge>Starter Pack</ZepretBadge>
              <h3 className="text-4xl font-black">Rp 6k</h3>
              <p className="text-on-surface-variant font-bold">5 Menit Zepret</p>
              <ul className="text-left space-y-3 w-full">
                <li className="flex items-center gap-2"><Check className="text-primary" size={20} /> Unlimited Snaps</li>
                <li className="flex items-center gap-2"><Check className="text-primary" size={20} /> Standard Frames</li>
                <li className="flex items-center gap-2 text-zinc-600"><X size={20} /> AI Pose Guide</li>
              </ul>
              <ZepretButton variant="outline" onClick={() => handlePackageSelect('5min')} className="w-full">
                Pilih Ini
              </ZepretButton>
            </ZepretCard>

            <ZepretCard className="flex flex-col items-center space-y-6 bg-primary-container/5 border-primary/50 relative overflow-hidden">
              <div className="absolute top-4 right-4 rotate-12 bg-primary px-3 py-1 text-[10px] font-black uppercase rounded text-on-primary-fixed">Hype</div>
              <ZepretBadge color="tertiary">Creator Mode</ZepretBadge>
              <h3 className="text-4xl font-black">Rp 12k</h3>
              <p className="text-on-surface-variant font-bold">10 Menit Zepret</p>
              <ul className="text-left space-y-3 w-full">
                <li className="flex items-center gap-2"><Check className="text-tertiary" size={20} /> Unlimited Snaps</li>
                <li className="flex items-center gap-2"><Check className="text-tertiary" size={20} /> All Premium Frames</li>
                <li className="flex items-center gap-2"><Check className="text-tertiary" size={20} /> AI Pose Guide</li>
              </ul>
              <ZepretButton onClick={() => handlePackageSelect('10min')} className="w-full">
                Sikat!
              </ZepretButton>
            </ZepretCard>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <ZepretCard className="max-w-md mx-auto space-y-6 text-center border-tertiary/20">
          <h2 className="text-2xl font-black italic">Bayar Dulu Bos!</h2>
          <div className="glass-panel p-4 inline-block bg-white rounded-2xl overflow-hidden">
            <div className="w-64 h-64 bg-zinc-100 flex items-center justify-center border-2 border-dashed border-zinc-300 rounded-xl">
              <span className="font-headline text-4xl text-zinc-300 font-black">QRIS</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-black text-white">Total: {packageType === '5min' ? 'Rp 6.000' : 'Rp 12.000'}</p>
            <p className="text-xs uppercase font-bold text-tertiary">Gopay / OVO / Dana / ShopeePay</p>
          </div>
          <ZepretButton onClick={handlePaymentComplete} className="w-full" variant="secondary">
            Gue Udah Bayar!
          </ZepretButton>
        </ZepretCard>
      )}

      {step === 'session' && (
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="relative glass-panel rounded-2xl bg-black aspect-video overflow-hidden shadow-[0_0_100px_rgba(255,90,143,0.15)]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              
              {isCapturing && (
                <div className="absolute inset-0 bg-white animate-pulse z-50" />
              )}

              <div className="absolute top-6 left-6">
                <div className={cn(
                  "glass-panel px-6 py-2 flex items-center gap-3 font-headline font-bold rounded-full",
                  timeLeft < 30 ? "bg-red-500/20 text-red-500 animate-pulse" : "text-white"
                )}>
                  <Timer size={20} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {aiSuggestion && !isCapturing && (
                <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[85%]">
                  <ZepretCard className="bg-tertiary/10 border-tertiary/30 py-4 px-6 animate-bounce backdrop-blur-md">
                    <p className="text-sm font-black flex items-center gap-3 text-tertiary">
                      <Sparkles size={18} /> {aiSuggestion}
                    </p>
                  </ZepretCard>
                </div>
              )}

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <button
                  onClick={capturePhoto}
                  disabled={isCapturing}
                  className="w-24 h-24 bg-gradient-to-br from-primary to-primary-container p-1 rounded-full shadow-[0_0_30px_rgba(255,90,143,0.5)] hover:scale-105 active:scale-95 transition-all group"
                >
                  <div className="w-full h-full rounded-full border-4 border-white/30 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-full group-active:bg-tertiary transition-colors" />
                  </div>
                </button>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
              {capturedPhotos.map((photo, i) => (
                <div key={i} className="min-w-40 h-40 glass-panel p-2 rounded-xl shrink-0 rotate-1 transform hover:rotate-0 transition-transform">
                  <img src={photo} alt="Captured" className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <ZepretCard className="bg-surface-container-low/50">
              <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-primary">Frames</h3>
              <div className="grid grid-cols-2 gap-3">
                {PlaceHolderImages.filter(p => p.id.startsWith('frame')).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFrame(f.imageUrl)}
                    className={cn(
                      "aspect-[3/4] rounded-lg border-2 transition-all overflow-hidden",
                      activeFrame === f.imageUrl ? "border-primary shadow-[0_0_15px_rgba(255,90,143,0.3)]" : "border-white/10 opacity-60"
                    )}
                  >
                    <img src={f.imageUrl} alt={f.description} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </ZepretCard>

            <ZepretCard>
              <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-tertiary">Accessories</h3>
              <div className="grid grid-cols-3 gap-3">
                 {PlaceHolderImages.filter(p => p.id.startsWith('sticker')).map(s => (
                  <button
                    key={s.id}
                    className="aspect-square glass-panel p-2 rounded-lg hover:bg-tertiary/20 transition-all group"
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
        <div className="space-y-12 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-6xl font-headline font-black italic text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container">MANTEP!</h2>
            <p className="text-xl font-bold text-on-surface-variant">Cek hasil zepretan holographic lo.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                <div className="aspect-[3/4] bg-surface-container-lowest rounded-xl overflow-hidden relative border border-white/10">
                   {capturedPhotos.length > 0 ? (
                     <div className="grid grid-cols-2 gap-2 p-2 w-full h-full">
                       {capturedPhotos.slice(0, 4).map((p, i) => (
                         <img key={i} src={p} className="w-full h-full object-cover rounded-lg border border-white/10" alt="Final" />
                       ))}
                     </div>
                   ) : (
                     <div className="flex items-center justify-center h-full text-zinc-700 font-headline font-black">NO CONTENT</div>
                   )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <ZepretButton className="w-full">
                  <Download className="mr-2" /> Simpan
                </ZepretButton>
                <ZepretButton variant="secondary" className="w-full">
                  <Share2 className="mr-2" /> Share
                </ZepretButton>
              </div>
            </div>

            <div className="space-y-6">
              <ZepretCard className="border-tertiary/30 bg-tertiary/5">
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3 text-tertiary">
                  <Sparkles /> AI Caption Gen
                </h3>
                {isLoadingAi ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-white/10 w-full rounded" />
                    <div className="h-4 bg-white/10 w-[80%] rounded" />
                  </div>
                ) : socialSuggestions ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Captions</p>
                      {socialSuggestions.captions.slice(0, 2).map((c, i) => (
                        <p key={i} className="text-sm font-bold glass-panel p-4 rounded-xl">{c}</p>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {socialSuggestions.hashtags.map((h, i) => (
                        <span key={i} className="text-[10px] font-black bg-tertiary text-on-tertiary px-3 py-1 rounded-full">{h}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ZepretButton variant="glass" onClick={generateSocialIdeas} className="w-full py-4">
                    Generate Ide Caption
                  </ZepretButton>
                )}
              </ZepretCard>

              <ZepretCard className="border-dashed border-zinc-700 bg-transparent text-center">
                <p className="font-bold text-zinc-500 mb-6">Mau Zepret lagi? <br/> Ada diskon 20% buat sesi berikutnya!</p>
                <ZepretButton variant="outline" onClick={() => window.location.reload()} className="w-full">
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
