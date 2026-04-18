
import Link from 'next/link';
import { ZepretButton, ZepretCard, ZepretBadge } from '@/components/ZepretUI';
import { Sparkles, Camera, Zap, Heart, Download, CameraFront } from 'lucide-react';
import CameraScrollProgress from '@/components/CameraScrollProgress';
import OrbitImages from '@/components/OrbitImages';

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
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4 bg-zinc-900/60 backdrop-blur-xl rounded-full mt-6 mx-auto w-[90%] max-w-7xl border border-white/10 shadow-[0_20px_50px_rgba(82,3,213,0.15)]">
        <div className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-br from-[#ffb1c3] to-[#ff5a8f] font-headline">Zepret</div>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="#" className="text-white font-bold border-b-2 border-primary-container pb-1 font-headline tracking-tight">Explore</Link>
          <Link href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors font-headline tracking-tight">Showcase</Link>
          <Link href="#" className="text-zinc-400 hover:text-zinc-100 transition-colors font-headline tracking-tight">Features</Link>
          <Link href="/studio" className="text-zinc-400 hover:text-zinc-100 transition-colors font-headline tracking-tight">Studio</Link>
        </div>
        <Link href="/studio">
          <ZepretButton className="px-6 py-2.5 rounded-full text-sm">Mulai Zepret</ZepretButton>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 lg:pt-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-secondary-container/20 blur-[120px] rounded-full animate-pulse-glow"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-primary-container/10 blur-[100px] rounded-full"></div>
        
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <ZepretBadge color="primary">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              The Holographic Era
            </ZepretBadge>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-black leading-tight tracking-tighter text-white">
              GAYA LO, FOTO LO, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary-container">ZEPRET AJA!</span>
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-xl font-body leading-relaxed">
              Ubah momen biasa jadi karya seni holographic 3D. Bukan sekedar foto, tapi dimensi baru gaya lo.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/studio">
                <ZepretButton className="px-10 py-5 text-lg">
                  Fotoin <span className="material-symbols-outlined ml-2">camera_front</span>
                </ZepretButton>
              </Link>
              <ZepretButton variant="glass" className="px-10 py-5 text-lg">
                Explore Showcase
              </ZepretButton>
            </div>
          </div>

          {/* 3D Assets Mockup */}
          <div className="relative flex justify-center items-center h-[500px]">
            <div className="absolute w-full h-full bg-gradient-to-tr from-secondary-container/30 to-transparent blur-3xl opacity-50 rounded-full"></div>
            <div className="relative w-full max-w-md">
              <div className="absolute -top-10 -left-10 z-20 animate-floating-3d">
                <img 
                  className="w-48 h-48 object-contain floating-3d-shadow" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKwcOLPB4OZtFFS-fF1YL4_BkDkoYxHHjd9nxCrgAytW08kK1-kXPmk-9v4kb7XK4UhKUeSuv1rqyYHK3b4v-pVZH82dNz_q5brY35hwYSob0-qzcDNb9mL4Yqtsv6ytwfnS5AYjlZ6iCKglgxRcEghdZjEcRmlXuhgIA3Ieaixr2GYZI7stiw2dKre_oaFTX9TDKizmEmIsMMP-a8zi4GIv3p8-y6SSSb7aBPAtUIdhizElDUvb8Y2FAz9oqfSWwfpfQ_Pdfd_84" 
                  alt="3D Camera" 
                />
              </div>
              <div className="relative z-10 glass-panel p-4 rounded-lg transform -rotate-6 shadow-2xl border-white/20">
                <img 
                  className="w-full h-[400px] object-cover rounded-lg" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmPbf_xYAkEfmFajPMZEH4kvBY4hJlR9e72z47GK6PJwMJyZR3gSg-p7SCHCQLRRBDlbcgNRoy-zk2WiUFeMOIdIdgujLD-IYu8J3BtydssiG_MoCiX50vfsylzO3K9CTlQcsTCo_FPBbafomr7bLz_5svXHw8Gjy2LNq-Qzw9oH2cnze7dbkxhKdIc2o0KrUSieJfJFtAlblJRpS4CcC4Ifq_OGtVqOAh6JA2sczCq7scm5pOqZT3JD0YBxpuSgJ4Wpag-d_WIxI" 
                  alt="Gen Z Model" 
                />
                <div className="absolute bottom-6 right-6 px-3 py-1 bg-tertiary text-on-tertiary font-bold rounded-md text-xs">#ZEPRETFUTURA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang Kami Section */}
      <section className="py-32 px-6 max-w-5xl mx-auto text-center relative">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full -z-10"></div>
        <ZepretBadge color="primary" className="mb-8 opacity-60">
          Tentang Kami
        </ZepretBadge>
        <h2 className="text-4xl md:text-6xl font-headline font-black text-white mb-8 leading-tight">
          Solusi <span className="italic text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary">Photobox Digital</span> Masa Depan
        </h2>
        <p className="text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed mb-20 font-body">
          Zepret bukan sekadar aplikasi kamera biasa. Kami menggabungkan teknologi <span className="font-bold text-white">Computer Vision</span> dengan estetika <span className="font-bold text-white">Holographic</span> untuk menciptakan pengalaman fotografi yang imersif.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8 max-w-4xl mx-auto">
          <div className="space-y-2">
            <div className="text-5xl font-black text-primary">1M+</div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Captures</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-secondary">500+</div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">AI Frames</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-tertiary">50k+</div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Happy Users</div>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black text-white">24/7</div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Support</div>
          </div>
        </div>
      </section>

      {/* Komunitas Zepret Section */}
      <section className="py-32 px-6 bg-surface-container-lowest/30 relative">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <ZepretBadge color="secondary" className="mb-8">Komunitas Zepret</ZepretBadge>
          <h2 className="text-4xl md:text-6xl font-headline font-black text-white mb-6">
            Hasil Zepret <span className="italic text-transparent bg-clip-text bg-gradient-to-br from-secondary to-primary">Teman Kita</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Lihat gimana serunya teman-teman lo bergaya di Zepret Studio. Kapan giliran lo?
          </p>
        </div>

        <div className="relative h-[600px] w-full max-w-6xl mx-auto overflow-hidden">
          <OrbitImages 
            images={communityImages}
            shape="ellipse"
            radiusX={500}
            radiusY={200}
            itemSize={180}
            duration={60}
            showPath={true}
            responsive={true}
            centerContent={
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 backdrop-blur-xl">
                 <Camera size={40} className="text-primary animate-pulse" />
              </div>
            }
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-4">
            Kenapa Harus <span className="text-primary-container">Zepret?</span>
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto">Fitur futuristik untuk kamu yang gak mau cuma sekedar foto biasa.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ZepretCard className="group hover:border-primary/30">
            <div className="mb-6 w-20 h-20 bg-primary-container/10 rounded-2xl flex items-center justify-center">
              <Sparkles className="text-primary-container w-10 h-10" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-white mb-3">Frame Kece</h3>
            <p className="text-on-surface-variant leading-relaxed">Pilihan frame holographic yang bikin feed lo auto aesthetic dalam sekejap.</p>
          </ZepretCard>
          <ZepretCard className="group hover:border-secondary/30">
            <div className="mb-6 w-20 h-20 bg-secondary-container/10 rounded-2xl flex items-center justify-center">
              <Zap className="text-secondary w-10 h-10" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-white mb-3">Aksesoris 3D</h3>
            <p className="text-on-surface-variant leading-relaxed">Tambah kacamata, topi, atau aksen aura holographic langsung di kamera.</p>
          </ZepretCard>
          <ZepretCard className="group hover:border-tertiary/30">
            <div className="mb-6 w-20 h-20 bg-tertiary-container/10 rounded-2xl flex items-center justify-center">
              <Download className="text-tertiary w-10 h-10" />
            </div>
            <h3 className="text-2xl font-headline font-bold text-white mb-3">Instan Download</h3>
            <p className="text-on-surface-variant leading-relaxed">Gak pake lama. Klik, pose, langsung simpen ke galeri dengan resolusi ultra-HD.</p>
          </ZepretCard>
        </div>
      </section>

      {/* Kinetic Scrolling Banner */}
      <section className="py-20 bg-surface-container-lowest overflow-hidden whitespace-nowrap border-y border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background z-10"></div>
        <div className="flex gap-12 text-7xl md:text-9xl font-headline font-black italic text-zinc-800/20">
          <span className="inline-flex items-center gap-4">ZEPRET!!! <div className="w-4 h-4 bg-primary-container rounded-full"></div></span>
          <span className="inline-flex items-center gap-4 text-primary/10">POSE!!! <div className="w-4 h-4 bg-tertiary rounded-full"></div></span>
          <span className="inline-flex items-center gap-4">ZEPRET!!! <div className="w-4 h-4 bg-secondary rounded-full"></div></span>
          <span className="inline-flex items-center gap-4 text-primary/10">STYLE!!!</span>
        </div>
      </section>

      {/* Pricing Section (Optional based on UI ref) */}
      <section className="py-32 px-6 max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-16">Pilih Paket <span className="text-primary">Gaya Lo</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
             <ZepretCard className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Starter</span>
                <div className="text-4xl font-black text-white mb-8">Rp 25k</div>
                <ul className="text-sm text-left w-full space-y-4 text-zinc-400 mb-8">
                  <li>✨ 3 Foto Digital HD</li>
                  <li>🖼️ Standard 3D Frames</li>
                </ul>
                <ZepretButton variant="outline" className="w-full">Pilih</ZepretButton>
             </ZepretCard>
             <ZepretCard className="flex flex-col items-center border-primary/40 bg-primary/5 scale-105 relative z-10 shadow-[0_0_50px_rgba(255,177,195,0.15)]">
                <div className="absolute -top-4 bg-primary text-on-primary-fixed px-4 py-1 rounded-full text-[10px] font-black uppercase">Paling Laris</div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Creator</span>
                <div className="text-5xl font-black text-white mb-8">Rp 75k</div>
                <ul className="text-sm text-left w-full space-y-4 text-zinc-200 mb-8 font-bold">
                  <li>✨ 10 Foto Digital HD</li>
                  <li>🖼️ Unlimited 3D Frames</li>
                  <li>🕶️ Semua Aksesoris 3D</li>
                </ul>
                <ZepretButton className="w-full">Ambil Sekarang</ZepretButton>
             </ZepretCard>
             <ZepretCard className="flex flex-col items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Ultimate</span>
                <div className="text-4xl font-black text-white mb-8">Rp 150k</div>
                <ul className="text-sm text-left w-full space-y-4 text-zinc-400 mb-8">
                  <li>✨ Semua Foto + Video 4K</li>
                  <li>🖼️ Custom Holographic Aura</li>
                </ul>
                <ZepretButton variant="outline" className="w-full">Pilih</ZepretButton>
             </ZepretCard>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-lowest w-full rounded-t-[3rem] py-16 px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-2xl font-bold text-zinc-100 font-headline">Zepret</div>
            <p className="text-sm tracking-wide uppercase font-semibold text-zinc-500">© 2024 Zepret. The Holographic Curator.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="#" className="text-sm tracking-wide uppercase font-semibold text-zinc-500 hover:text-primary transition-all">Privacy</Link>
            <Link href="#" className="text-sm tracking-wide uppercase font-semibold text-zinc-500 hover:text-primary transition-all">Terms</Link>
            <Link href="#" className="text-sm tracking-wide uppercase font-semibold text-zinc-500 hover:text-primary transition-all">Contact</Link>
            <Link href="#" className="text-sm tracking-wide uppercase font-semibold text-zinc-500 hover:text-primary transition-all">Discord</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
