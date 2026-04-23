"use client";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const StudioSession = dynamic(() => import('@/components/StudioSession'), { ssr: false });

export default function StudioPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Mini Header */}
      <header className="border-b-4 border-black p-4 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 font-headline font-black text-xl hover:text-primary transition-colors">
            <ArrowLeft /> ZEPRET
          </Link>
          <div className="hidden sm:block">
            <span className="font-headline italic text-xs uppercase opacity-60 tracking-widest">
              Digital Photobox Experience v1.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Studio Component */}
      <StudioSession />
    </main>
  );
}
