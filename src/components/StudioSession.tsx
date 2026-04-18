"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ZepretButton, ZepretCard, ZepretBadge } from '@/components/ZepretUI';
import { Camera, Timer, X, Sparkles, Check, ChevronRight, Download, Share2, Wand2, ArrowLeft } from 'lucide-react';
import { aiPoseGuide } from '@/ai/flows/ai-pose-guide';
import { aiStyleAssistant } from '@/ai/flows/ai-style-assistant-flow';
import { generateSocialShareSuggestions } from '@/ai/flows/ai-social-share-suggestions';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type Step = 'landing' | 'permission' | 'terms' | 'package' | 'payment' | 'session' | 'review';

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

  // Camera Management
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

  // Timer Management
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
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    
    // Play sound (simulated)
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = context.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, context.currentTime);
    osc.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.1);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height);
      const dataUri = canvas.toDataURL('image/jpeg');
      setCapturedPhotos(prev => [dataUri, ...prev]);
      
      // Get AI Pose Suggestion
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
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      {/* STEPS RENDERER */}

      {step === 'permission' && (
        <ZepretCard className="max-w-md mx-auto space-y-6 text-center">
          <div className="flex justify-center">
            <div className="p-4 bg-secondary border-2 border-black neobrutal-shadow rounded-full">
              <Camera size={48} />
            </div>
          </div>
          <h2 className="text-2xl">Izin Kamera Dong!</h2>
          <p className="font-medium">
            Kamera cuma dipake buat sesi foto lo & gak bakal kita simpen tanpa izin. Janji! ✌️
          </p>
          <ZepretButton onClick={requestCamera} className="w-full">
            Izinkan Kamera
          </ZepretButton>
        </ZepretCard>
      )}

      {step === 'terms' && (
        <ZepretCard className="max-w-md mx-auto space-y-6">
          <h2 className="text-2xl">Baca Dikit Ya...</h2>
          <div className="bg-accent border-2 border-black p-4 space-y-2 text-sm font-medium h-48 overflow-y-auto">
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
        <div className="space-y-8 text-center">
          <h2 className="text-4xl">Pilih Paket Gaya Lo</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <ZepretCard className="space-y-4 flex flex-col items-center">
              <ZepretBadge>Starter</ZepretBadge>
              <h3 className="text-2xl">Sesi 5 Menit</h3>
              <p className="text-3xl font-black italic">Rp 6.000</p>
              <ul className="text-left space-y-2 text-sm font-bold">
                <li className="flex items-center gap-2"><Check size={16} /> Unlimited Snap</li>
                <li className="flex items-center gap-2"><Check size={16} /> Standard Frames</li>
                <li className="flex items-center gap-2 text-muted-foreground"><X size={16} /> Free 3D Stickers</li>
              </ul>
              <ZepretButton variant="outline" onClick={() => handlePackageSelect('5min')} className="w-full mt-auto">
                Pilih Ini
              </ZepretButton>
            </ZepretCard>

            <ZepretCard className="space-y-4 flex flex-col items-center bg-secondary neobrutal-shadow-lg scale-105 border-4">
              <ZepretBadge color="primary">Recommended</ZepretBadge>
              <h3 className="text-2xl">Sesi 10 Menit</h3>
              <p className="text-3xl font-black italic">Rp 12.000</p>
              <ul className="text-left space-y-2 text-sm font-bold">
                <li className="flex items-center gap-2"><Check size={16} /> Unlimited Snap</li>
                <li className="flex items-center gap-2"><Check size={16} /> Premium Frames</li>
                <li className="flex items-center gap-2"><Check size={16} /> 3 Free 3D Stickers</li>
                <li className="flex items-center gap-2"><Check size={16} /> AI Pose Guide</li>
              </ul>
              <ZepretButton onClick={() => handlePackageSelect('10min')} className="w-full mt-auto">
                Sikat!
              </ZepretButton>
            </ZepretCard>
          </div>
        </div>
      )}

      {step === 'payment' && (
        <ZepretCard className="max-w-md mx-auto space-y-6 text-center">
          <h2 className="text-2xl italic">Bayar Dulu Bos!</h2>
          <div className="bg-white border-4 border-black p-4 inline-block neobrutal-shadow">
            {/* Mock QRIS */}
            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center border-2 border-black">
              <span className="font-headline text-4xl opacity-20">QRIS MOCK</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-lg">Total: {packageType === '5min' ? 'Rp 6.000' : 'Rp 12.000'}</p>
            <p className="text-xs uppercase font-black text-muted-foreground">Scan pake ShopeePay, GoPay, Dana, dll</p>
          </div>
          <ZepretButton onClick={handlePaymentComplete} className="w-full bg-secondary text-black">
            Gue Udah Bayar!
          </ZepretButton>
        </ZepretCard>
      )}

      {step === 'session' && (
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Studio Area */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative border-4 border-black neobrutal-shadow-lg bg-black aspect-video overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              
              {/* Overlay Flash */}
              {isCapturing && (
                <div className="absolute inset-0 bg-white animate-pulse z-50" />
              )}

              {/* HUD */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className={cn(
                  "bg-black text-white px-4 py-2 border-2 border-white flex items-center gap-2 font-headline",
                  timeLeft < 30 ? "bg-red-600 animate-pulse-timer" : ""
                )}>
                  <Timer size={20} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* AI Pose Overlay */}
              {aiSuggestion && !isCapturing && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%]">
                  <ZepretCard className="bg-secondary/90 border-2 py-2 px-4 animate-bounce">
                    <p className="text-sm font-bold flex items-center gap-2">
                      <Wand2 size={16} /> {aiSuggestion}
                    </p>
                  </ZepretCard>
                </div>
              )}

              {/* Capture Trigger */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                <button
                  onClick={capturePhoto}
                  disabled={isCapturing}
                  className="w-20 h-20 bg-primary border-4 border-black rounded-full neobrutal-shadow hover:scale-105 active:scale-95 transition-transform group flex items-center justify-center"
                >
                  <div className="w-14 h-14 border-2 border-black rounded-full bg-white group-active:bg-secondary" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {capturedPhotos.map((photo, i) => (
                <div key={i} className="min-w-32 h-32 border-3 border-black neobrutal-shadow bg-white overflow-hidden rotate-2">
                  <img src={photo} alt="Captured" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-6">
            <ZepretCard className="bg-accent">
              <h3 className="text-lg mb-4">Pilih Frame</h3>
              <div className="grid grid-cols-2 gap-2">
                {PlaceHolderImages.filter(p => p.id.startsWith('frame')).map(f => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFrame(f.imageUrl)}
                    className={cn(
                      "aspect-[2/3] border-2 border-black hover:scale-105 transition-transform overflow-hidden",
                      activeFrame === f.imageUrl ? "ring-4 ring-primary" : ""
                    )}
                  >
                    <img src={f.imageUrl} alt={f.description} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </ZepretCard>

            <ZepretCard>
              <h3 className="text-lg mb-4 italic">3D Stickers</h3>
              <div className="grid grid-cols-3 gap-2">
                 {PlaceHolderImages.filter(p => p.id.startsWith('sticker')).map(s => (
                  <button
                    key={s.id}
                    className="aspect-square border-2 border-black bg-gray-50 hover:bg-secondary transition-colors"
                  >
                    <img src={s.imageUrl} alt={s.description} className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>
              <p className="text-[10px] mt-2 font-bold uppercase opacity-60">Drag & drop coming soon!</p>
            </ZepretCard>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl italic">Mantap!</h2>
            <p className="text-xl font-bold">Cek hasil zepretan lo di bawah.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <ZepretCard className="p-2 border-4 rotate-1">
                <div className="aspect-[3/4] bg-gray-100 border-2 border-black flex items-center justify-center overflow-hidden">
                   {capturedPhotos.length > 0 ? (
                     <div className="grid grid-cols-2 gap-1 p-1 w-full h-full">
                       {capturedPhotos.slice(0, 4).map((p, i) => (
                         <img key={i} src={p} className="w-full h-full object-cover border-2 border-black" alt="Final" />
                       ))}
                     </div>
                   ) : (
                     <p className="font-headline opacity-20">NO PHOTOS</p>
                   )}
                </div>
              </ZepretCard>
              
              <div className="flex gap-4">
                <ZepretButton className="flex-1 flex items-center justify-center gap-2">
                  <Download /> Simpan
                </ZepretButton>
                <ZepretButton variant="secondary" className="flex-1 flex items-center justify-center gap-2">
                  <Share2 /> Share ke IG
                </ZepretButton>
              </div>
            </div>

            <div className="space-y-6">
              <ZepretCard className="bg-secondary">
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <Sparkles /> AI Caption Gen
                </h3>
                {isLoadingAi ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-black/10 w-full" />
                    <div className="h-4 bg-black/10 w-[80%]" />
                  </div>
                ) : socialSuggestions ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-black uppercase">Captions:</p>
                      {socialSuggestions.captions.slice(0, 2).map((c, i) => (
                        <p key={i} className="text-sm font-bold bg-white p-2 border-2 border-black">{c}</p>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {socialSuggestions.hashtags.map((h, i) => (
                        <span key={i} className="text-[10px] font-black bg-black text-white px-2 py-1">{h}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ZepretButton variant="outline" onClick={generateSocialIdeas} className="w-full">
                    Generate Ide Caption
                  </ZepretButton>
                )}
              </ZepretCard>

              <ZepretCard className="border-dashed">
                <h3 className="text-lg italic mb-2">Mau Zepret Lagi?</h3>
                <p className="text-sm font-medium mb-4">Dapetin diskon 20% buat sesi berikutnya!</p>
                <ZepretButton variant="outline" onClick={() => window.location.reload()} className="w-full">
                  Mulai Sesi Baru
                </ZepretButton>
              </ZepretCard>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN CANVAS FOR CAPTURE */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
