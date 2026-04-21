import Link from 'next/link';
import { ZepretButton, ZepretCard, ZepretBadge } from '@/components/ZepretUI';
import { Sparkles, Camera, Zap, Heart, Download, Check, X, MousePointer2, Menu } from 'lucide-react';
import CameraScrollProgress from '@/components/CameraScrollProgress';
import OrbitImages from '@/components/OrbitImages';
import TrueFocus from '@/components/TrueFocus';
import LightLines from '@/components/LightLines';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';

export default function Home() {
  const communityImages = [
    'https://picsum.photos/seed/c1/600/800',
    'https://picsum.photos/seed/c2/600/800',
    'https://picsum.photos/seed/c3/600/800',
    'https://picsum.photos/seed/c4/600/800',
    'https://picsum.photos/seed/c5/600/800',
    'https://picsum.photos/seed/c6/600/800',
    'https://picsum.photos/seed/c7/600/800',
    'https://picsum.photos/seed/c8/600/800',
  ];

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Scroll Progress Indicator */}
      <CameraScrollProgress />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-zinc-900/60 backdrop-blur-xl rounded-full mt-4 md:mt-6 mx-auto w-[92%] max-w-7xl border border-white/10 shadow-[0_20px_50px_rgba(82,3,213,0.15)]">
        <div className="text-xl md:text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-[#ffb1c3] to-[#ff5a8f] font-headline">Zepret</div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="#" className="text-white font-bold border-b-2 border-[#ff5a8f] pb-1 font-headline tracking-tight">Explore</Link>
          <Link href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors font-headline tracking-tight">Showcase</Link>
          <Link href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors font-headline tracking-tight">Features</Link>
          <Link href="/studio" className="text-zinc-400 hover:text-zinc-100 transition-colors font-headline tracking-tight">Studio</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/studio" className="hidden sm:block">
            <ZepretButton className="px-4 md:px-6 py-2 rounded-full text-xs md:text-sm">Mulai Zepret</ZepretButton>
          </Link>
          
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden p-2 text-white hover:text-primary transition-colors">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-950 border-white/10 text-white w-[280px]">
              <SheetHeader className="text-left mb-8">
                <SheetTitle className="text-2xl font-black italic text-primary">ZEPRET</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 font-headline font-bold text-lg">
                <Link href="#" className="text-white">Explore</Link>
                <Link href="#" className="text-zinc-400">Showcase</Link>
                <Link href="#" className="text-zinc-400">Features</Link>
                <Link href="/studio" className="text-zinc-400">Studio</Link>
                <hr className="border-white/10" />
                <Link href="/studio">
                  <ZepretButton className="w-full">Mulai Zepret</ZepretButton>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="relative min-h-screen flex items-center justify-center px-4 py-20 lg:py-0 overflow-hidden cursor-crosshair group">
        <LightLines
          className="absolute inset-0 z-0"
          gradientFrom="#18181b"
          gradientTo="#09090b"
          lightColor="rgba(255, 90, 143, 0.5)"
          lineColor="rgba(255, 255, 255, 0.1)"
        />
        <div className="absolute -top-20 -left-20 w-64 md:w-96 h-64 md:h-96 bg-secondary-container/20 blur-[80px] md:blur-[120px] rounded-full animate-pulse-glow z-0"></div>
        <div className="absolute top-1/2 -right-20 w-60 md:w-80 h-60 md:h-80 bg-primary-container/10 blur-[70px] md:blur-[100px] rounded-full"></div>
        
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pt-16 lg:pt-0">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <ZepretBadge color="primary">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                The Holographic Era
              </ZepretBadge>
            </div>
            
            <div className="space-y-4 md:space-y-6 relative">
              <TrueFocus 
                sentence="GAYA, LO, FOTO, LO, ZEPRET, AJA!" 
                separator=", "
                blurAmount={3}
                borderColor="#ff5a8f"
                glowColor="rgba(255, 90, 143, 0.4)"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-headline font-black leading-tight tracking-tighter text-white uppercase justify-center lg:justify-start"
              />
              
              <div className="flex justify-center lg:justify-start items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary/60">
                <MousePointer2 size={12} />
                Click to shift focus
              </div>

              <div className="pt-2 md:pt-4">
                <p className="text-base md:text-xl lg:text-2xl font-black italic tracking-widest text-primary-container opacity-80 uppercase">
                  CAPTURE THE FUTURE MOMENT
                </p>
              </div>
            </div>

            <p className="text-base md:text-xl text-on-surface-variant max-w-xl mx-auto lg:mx-0 font-body leading-relaxed">
              Ubah momen biasa jadi karya seni holographic 3D. Bukan sekedar foto, tapi dimensi baru gaya lo.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Link href="/studio" className="w-full sm:w-auto">
                <ZepretButton className="w-full px-10 py-4 md:py-5 text-base md:text-lg">
                  Fotoin <Camera className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                </ZepretButton>
              </Link>
              <ZepretButton variant="glass" className="w-full sm:w-auto px-10 py-4 md:py-5 text-base md:text-lg">
                Explore Showcase
              </ZepretButton>
            </div>
          </div>

          {/* 3D Assets Mockup */}
          <div className="relative flex justify-center items-center h-[350px] md:h-[500px]">
            <div className="absolute w-full h-full bg-gradient-to-tr from-secondary-container/30 to-transparent blur-3xl opacity-50 rounded-full"></div>
            <div className="relative w-full max-w-[280px] md:max-w-md">
              <div className="absolute -top-6 md:-top-10 -left-6 md:-left-10 z-20 animate-floating-3d">
                <img 
                  className="w-32 h-32 md:w-48 md:h-48 object-contain floating-3d-shadow" 
                  src="https://picsum.photos/seed/1/400/400" 
                  alt="3D Camera" 
                  data-ai-hint="3d camera"
                />
              </div>
              <div className="relative z-10 glass-panel p-3 md:p-4 rounded-lg transform -rotate-3 md:-rotate-6 shadow-2xl border-white/20">
                <img 
                  className="w-full h-[300px] md:h-[400px] object-cover rounded-lg" 
                  src="https://picsum.photos/seed/2/600/800" 
                  alt="Gen Z Model" 
                  data-ai-hint="fashion model"
                />
                <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-2 md:px-3 py-1 bg-tertiary text-on-tertiary font-bold rounded-md text-[10px] md:text-xs">#ZEPRETFUTURA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section className="py-20 md:py-32 px-6 max-w-5xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-primary/5 blur-[80px] md:blur-[120px] rounded-full -z-10"></div>
        <div className="flex justify-center mb-8">
          <ZepretBadge color="primary" className="opacity-60">Tentang Kami</ZepretBadge>
        </div>
        <h2 className="text-3xl md:text-6xl font-headline font-black text-white mb-6 md:mb-8 leading-tight">
          Solusi <span className="italic text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">Photobox Digital</span> Masa Depan
        </h2>
        <p className="text-base md:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed mb-12 md:mb-20 font-body">
          Zepret bukan sekadar aplikasi kamera biasa. Kami menggabungkan teknologi <span className="font-bold text-white">Computer Vision</span> dengan estetika <span className="font-bold text-white">Holographic</span> untuk menciptakan pengalaman fotografi yang imersif.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 max-w-4xl mx-auto">
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-black text-primary">1M+</div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black text-zinc-500">Captures</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-black text-secondary">500+</div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black text-zinc-500">AI Frames</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-black text-tertiary">50k+</div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black text-zinc-500">Happy Users</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-black text-white">24/7</div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black text-zinc-500">Support</div>
          </div>
        </div>
      </section>

      {/* Komunitas Zepret Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-surface-container-lowest/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-8">
            <ZepretBadge color="secondary">Komunitas Zepret</ZepretBadge>
          </div>
          <h2 className="text-3xl md:text-6xl font-headline font-black text-white mb-4 md:mb-6">
            Hasil Zepret <span className="italic text-transparent bg-clip-text bg-gradient-to-br from-secondary to-primary">Teman Kita</span>
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Lihat gimana serunya teman-teman lo bergaya di Zepret Studio. Kapan giliran lo?
          </p>
        </div>

        <div className="relative h-[400px] md:h-[600px] w-full max-w-6xl mx-auto overflow-hidden">
          <OrbitImages 
            images={communityImages}
            shape="ellipse"
            radiusX={300}
            radiusY={120}
            itemSize={120}
            duration={60}
            showPath={true}
            responsive={true}
            centerContent={
              <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 backdrop-blur-xl">
                 <Camera size={24} className="text-primary animate-pulse md:w-10 md:h-10" />
              </div>
            }
          />
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <ZepretCard className="bg-surface-container-low border-white/5 p-8 md:p-20 relative overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-2 relative">
                <div className="absolute -top-10 -left-6 text-primary opacity-20 transform -rotate-12 hidden md:block">
                  <Sparkles size={60} />
                </div>
                <h2 className="text-3xl md:text-5xl font-headline font-black text-white">Cara Kerja</h2>
                <h3 className="text-2xl md:text-4xl font-headline font-black text-tertiary">Zepret Studio</h3>
              </div>
              
              <div className="space-y-8 md:space-y-10">
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-black text-lg md:text-xl text-primary shrink-0 border border-white/5">1</div>
                  <div className="space-y-1">
                    <h4 className="text-lg md:text-xl font-bold text-white">Pilih Paket Gaya</h4>
                    <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-body">Sesuaikan durasi dan jumlah aksesoris sesuai kebutuhan konten lo.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-black text-lg md:text-xl text-secondary shrink-0 border border-white/5">2</div>
                  <div className="space-y-1">
                    <h4 className="text-lg md:text-xl font-bold text-white">Beraksi di Studio</h4>
                    <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-body">Pose sesuka hati dengan ribuan filter AI dan stiker 3D interaktif.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-surface-container-highest flex items-center justify-center font-black text-lg md:text-xl text-tertiary shrink-0 border border-white/5">3</div>
                  <div className="space-y-1">
                    <h4 className="text-lg md:text-xl font-bold text-white">Download & Pamer</h4>
                    <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-body">Hasil jepretan langsung masuk ke galeri lo dengan kualitas HD.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative group mt-8 lg:mt-0">
              <div className="absolute -inset-4 bg-tertiary/20 blur-2xl md:blur-3xl rounded-full opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative rounded-2xl md:rounded-[3rem] overflow-hidden aspect-square border border-white/10 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://picsum.photos/seed/3/800/800" 
                  alt="Zepret Studio Experience" 
                  data-ai-hint="photo studio"
                />
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 flex items-center gap-2 md:gap-3 bg-primary-container/90 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl shadow-xl border border-white/20">
                  <Zap size={16} className="text-white fill-white animate-pulse md:w-5 md:h-5" />
                  <span className="font-headline font-black text-white italic tracking-wider text-xs md:text-sm">INSTANT MAGIC</span>
                </div>
              </div>
            </div>
          </div>
        </ZepretCard>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-white mb-4">
            Kenapa Harus <span className="text-primary-container">Zepret?</span>
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto">Fitur futuristik untuk kamu yang gak mau cuma sekedar foto biasa.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <ZepretCard className="group hover:border-primary/30 p-6 md:p-8">
            <div className="mb-4 md:mb-6 w-16 h-16 md:w-20 md:h-20 bg-primary-container/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="text-primary-container w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-headline font-bold text-white mb-2 md:mb-3">Frame Kece</h3>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">Pilihan frame holographic yang bikin feed lo auto aesthetic dalam sekejap.</p>
          </ZepretCard>
          <ZepretCard className="group hover:border-secondary/30 p-6 md:p-8">
            <div className="mb-4 md:mb-6 w-16 h-16 md:w-20 md:h-20 bg-secondary-container/10 rounded-2xl flex items-center justify-center">
              <Zap className="text-secondary w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-headline font-bold text-white mb-2 md:mb-3">Aksesoris 3D</h3>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">Tambah kacamata, topi, atau aksen aura holographic langsung di kamera.</p>
          </ZepretCard>
          <ZepretCard className="group hover:border-tertiary/30 p-6 md:p-8 sm:col-span-2 md:col-span-1">
            <div className="mb-4 md:mb-6 w-16 h-16 md:w-20 md:h-20 bg-tertiary-container/10 rounded-2xl flex items-center justify-center">
              <Download className="text-tertiary w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-2xl font-headline font-bold text-white mb-2 md:mb-3">Instan Download</h3>
            <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">Gak pake lama. Klik, pose, langsung simpen ke galeri dengan resolusi ultra-HD.</p>
          </ZepretCard>
        </div>
      </section>

      {/* Kinetic Scrolling Banner */}
      <section className="py-12 md:py-20 bg-surface-container-lowest overflow-hidden whitespace-nowrap border-y border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10"></div>
        <div className="flex gap-8 md:gap-12 text-5xl md:text-9xl font-headline font-black italic text-zinc-800/20 animate-marquee">
          <span className="inline-flex items-center gap-4">ZEPRET!!! <div className="w-2 md:w-4 h-2 md:h-4 bg-primary-container rounded-full"></div></span>
          <span className="inline-flex items-center gap-4 text-primary/10">POSE!!! <div className="w-2 md:w-4 h-2 md:h-4 bg-tertiary rounded-full"></div></span>
          <span className="inline-flex items-center gap-4">ZEPRET!!! <div className="w-2 md:w-4 h-2 md:h-4 bg-secondary rounded-full"></div></span>
          <span className="inline-flex items-center gap-4 text-primary/10">STYLE!!!</span>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-6xl font-headline font-black text-white mb-4">Investasi Untuk <span className="italic text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container">Gaya Lo</span></h2>
          <p className="text-sm md:text-base text-on-surface-variant mb-12 md:mb-20">Harga transparan, hasil maksimal. Mulai dari Rp 6.000 saja.</p>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-end max-w-4xl mx-auto">
             {/* Starter Pack */}
             <ZepretCard className="relative p-6 md:p-10 flex flex-col items-start text-left group">
                <ZepretBadge className="mb-4 md:mb-6 bg-white/5 border-white/10 text-zinc-400">STARTER PACK</ZepretBadge>
                <div className="flex justify-between items-end w-full mb-8 md:mb-10">
                   <div className="text-4xl md:text-5xl font-black text-white">Rp 6k</div>
                </div>
                <ul className="space-y-4 md:space-y-6 mb-8 md:mb-12 w-full">
                  <li className="flex items-center gap-3 md:gap-4 text-zinc-400 font-bold text-sm md:text-base">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </div>
                    5 Menit Sesi
                  </li>
                  <li className="flex items-center gap-3 md:gap-4 text-zinc-400 font-bold text-sm md:text-base">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </div>
                    Unlimited Captures
                  </li>
                  <li className="flex items-center gap-3 md:gap-4 text-zinc-400 font-bold text-sm md:text-base">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </div>
                    HD Download
                  </li>
                </ul>
                <Link href="/studio" className="w-full">
                  <ZepretButton variant="outline" className="w-full py-3 md:py-4 text-xs md:text-sm tracking-widest uppercase">Pilih Paket</ZepretButton>
                </Link>
             </ZepretCard>

             {/* Pro Zepret */}
             <div className="relative group mt-8 md:mt-0">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                 <div className="bg-primary px-4 md:px-6 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest text-on-primary-fixed shadow-[0_0_20px_rgba(255,177,195,0.4)]">
                   REKOMENDASI
                 </div>
               </div>
               <ZepretCard className="p-6 md:p-10 flex flex-col items-start text-left border-2 border-primary/40 bg-primary/5 shadow-[0_0_50px_rgba(255,177,195,0.1)] relative">
                  <ZepretBadge className="mb-4 md:mb-6 bg-primary/10 border-primary/20 text-primary">PRO ZEPRET</ZepretBadge>
                  <div className="flex justify-between items-end w-full mb-8 md:mb-10">
                    <div className="text-4xl md:text-5xl font-black text-white">Rp 12k</div>
                  </div>
                  <ul className="space-y-4 md:space-y-6 mb-8 md:mb-12 w-full">
                    <li className="flex items-center gap-3 md:gap-4 text-white font-bold text-sm md:text-base">
                      <Heart className="w-[18px] h-[18px] md:w-5 md:h-5 text-primary fill-primary/20 shrink-0" />
                      10 Menit Sesi
                    </li>
                    <li className="flex items-center gap-3 md:gap-4 text-white font-bold text-sm md:text-base">
                      <Heart className="w-[18px] h-[18px] md:w-5 md:h-5 text-primary fill-primary/20 shrink-0" />
                      Free 3 Aksesoris 3D
                    </li>
                    <li className="flex items-center gap-3 md:gap-4 text-white font-bold text-sm md:text-base">
                      <Heart className="w-[18px] h-[18px] md:w-5 md:h-5 text-primary fill-primary/20 shrink-0" />
                      Cloud Storage 7 Hari
                    </li>
                  </ul>
                  <Link href="/studio" className="w-full">
                    <ZepretButton className="w-full py-3 md:py-4 text-xs md:text-sm tracking-widest uppercase shadow-[0_15px_30px_rgba(255,90,143,0.3)]">Pilih Paket</ZepretButton>
                  </Link>
               </ZepretCard>
             </div>
          </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 px-4 md:px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline font-black text-white mb-8 md:mb-12 text-center">Ada <span className="text-tertiary">Pertanyaan?</span></h2>
        <div className="space-y-4">
          {[
            { q: "Gimana cara dapet filenya?", a: "Langsung dikirim ke email atau scan QR code di lokasi. Dalam hitungan detik, foto holographic lo siap buat dipamerin di IG atau TikTok." },
            { q: "Bisa bawa properti sendiri?", a: "Boleh banget! Tapi tenang, kita udah sediain ribuan aksesoris 3D digital yang bakal bikin look lo makin \"level up\"." },
            { q: "Lokasi studionya di mana?", a: "Kita ada di beberapa spot hype di Jakarta, Bandung, dan Surabaya. Cek tab \"Studio\" buat liat titik persisnya di map." }
          ].map((faq, i) => (
            <details key={i} className="group glass-panel rounded-lg border border-white/5 overflow-hidden open:border-primary/20 transition-all">
              <summary className="flex justify-between items-center p-5 md:p-6 cursor-pointer hover:bg-white/5 transition-colors">
                <span className="text-lg md:text-xl font-bold text-white pr-4">{faq.q}</span>
                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform shrink-0">expand_more</span>
              </summary>
              <div className="p-5 md:p-6 pt-0 text-sm md:text-base text-on-surface-variant border-t border-white/5 leading-relaxed font-body">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full rounded-t-2xl md:rounded-t-[3rem] py-12 md:py-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-2xl font-bold text-zinc-100 font-headline italic">Zepret</div>
            <p className="text-[10px] md:text-sm tracking-wide uppercase font-semibold text-zinc-500">© 2024 Zepret. The Holographic Curator.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {['Privacy', 'Terms', 'Contact', 'Discord'].map((item) => (
              <Link key={item} href="#" className="text-[10px] md:text-sm tracking-wide uppercase font-semibold text-zinc-500 hover:text-primary transition-all">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
