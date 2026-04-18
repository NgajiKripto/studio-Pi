'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CameraScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const height = docHeight - winHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollPercent(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Numbers from 1 at the top to 100 at the bottom as requested
  const markers = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center pointer-events-none">
      {/* Container for the slider */}
      <div className="relative h-[70vh] flex flex-col justify-between py-4 group">
        
        {/* Vertical Track Line */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/10" />
        
        {/* Indicators and Numbers */}
        {markers.map((num, idx) => {
          // Calculate if this marker is "active" based on scroll position
          // Using the index to determine visual position (0% top to 100% bottom)
          const markerTarget = (idx / (markers.length - 1)) * 100;
          const isActive = Math.abs(scrollPercent - markerTarget) < (100 / (markers.length - 1)) / 2;

          return (
            <div key={num} className="flex items-center gap-4 justify-end h-full relative">
              {/* The Number */}
              <span 
                className={cn(
                  "text-[9px] font-black font-headline transition-all duration-300 rotate-90 absolute right-8",
                  isActive ? "text-primary scale-125 translate-x-[-4px]" : "text-white/30"
                )}
              >
                {num}
              </span>
              
              {/* Main Tick */}
              <div className="flex flex-col gap-1 items-end absolute right-0">
                 <div 
                   className={cn(
                     "h-[1.5px] transition-all duration-300",
                     isActive ? "w-8 bg-primary shadow-[0_0_10px_rgba(255,177,195,0.8)]" : "w-4 bg-white/20"
                   )} 
                 />
              </div>
            </div>
          );
        })}

        {/* Dynamic Moving Pointer */}
        <div 
          className="absolute right-[-4px] w-5 h-[2px] bg-primary shadow-[0_0_15px_rgba(255,90,143,0.8)] z-50 transition-all duration-150 ease-out flex items-center justify-center"
          style={{ top: `${scrollPercent}%` }}
        >
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        </div>
      </div>

      {/* Vertical Label */}
      <div className="mt-16 rotate-90 origin-center whitespace-nowrap">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
          Zepret Depth Focus
        </span>
      </div>
    </div>
  );
}
