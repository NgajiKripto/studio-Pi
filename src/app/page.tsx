import Link from 'next/link';
import { ZepretButton, ZepretCard, ZepretBadge } from '@/components/ZepretUI';
import { Camera, Sparkles, Zap, Heart } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-10 left-10 -rotate-12 opacity-20 pointer-events-none">
        <Zap size={120} className="text-secondary fill-secondary" />
      </div>
      <div className="absolute bottom-10 right-10 rotate-12 opacity-20 pointer-events-none">
        <Heart size={120} className="text-primary fill-primary" />
      </div>

      <div className="max-w-4xl w-full z-10 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="flex justify-center mb-4">
            <ZepretBadge color="secondary">Gen Z Authorized</ZepretBadge>
          </div>
          <h1 className="text-6xl md:text-9xl font-headline tracking-tighter leading-none italic">
            ZE<span className="text-primary">PRET</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold max-w-2xl mx-auto leading-tight">
            GAYA DIKIT ZEPRET!!! Website photobox interaktif buat lo yang pengen estetik tapi males keluar rumah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/studio">
              <ZepretButton className="text-2xl px-12 py-6 animate-hover-bounce">
                Mulai Zepret!
              </ZepretButton>
            </Link>
            <Link href="#how-it-works">
              <ZepretButton variant="outline" className="text-xl">
                Gimana Caranya?
              </ZepretButton>
            </Link>
          </div>
        </section>

        {/* Features Preview */}
        <section id="how-it-works" className="grid md:grid-cols-3 gap-6 pt-12">
          <ZepretCard className="space-y-4 hover:rotate-2 transition-transform">
            <div className="w-12 h-12 bg-primary flex items-center justify-center border-2 border-black neobrutal-shadow">
              <Camera className="text-white" />
            </div>
            <h3 className="text-xl">1. Zepret</h3>
            <p className="font-medium text-muted-foreground">Pake kamera HP/Laptop lo. Gak perlu install aplikasi ribet.</p>
          </ZepretCard>

          <ZepretCard className="space-y-4 hover:-rotate-2 transition-transform bg-secondary">
            <div className="w-12 h-12 bg-white flex items-center justify-center border-2 border-black neobrutal-shadow">
              <Sparkles className="text-black" />
            </div>
            <h3 className="text-xl">2. Hias!</h3>
            <p className="font-medium text-black">Frame estetik, 3D stickers, sama filter yang bikin lo makin glowing.</p>
          </ZepretCard>

          <ZepretCard className="space-y-4 hover:rotate-1 transition-transform">
            <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-black neobrutal-shadow">
              <Zap className="text-white" />
            </div>
            <h3 className="text-xl">3. Share</h3>
            <p className="font-medium text-muted-foreground">Download hasilnya & pamerin ke IG/TikTok. Gas!</p>
          </ZepretCard>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12">
          <p className="font-headline text-sm opacity-60">© 2024 Zepret Studio. Made with love for Gen Z.</p>
        </footer>
      </div>
    </main>
  );
}
