
'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function CameraScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollPercent(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Numbers from 10 to 100
  const markers = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col items-center pointer-events-none">
      {/* Container for the slider */}
      <div className="relative h-[60vh] flex flex-col justify-between py-4 group">
        
        {/* Vertical Track Line */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/10" />
        
        {/* Indicators and Numbers */}
        {markers.map((num, idx) => {
          // Calculate if this marker is "active" based on scroll position
          // Mapping 0-100 scroll to 10-100 markers
          const markerTarget = ((idx) / (markers.length - 1)) * 100;
          const isActive = Math.abs(scrollPercent - markerTarget) < 5;

          return (
            <div key={num} className="flex items-center gap-4 justify-end h-full">
              {/* The Number */}
              <span 
                className={cn(
                  "text-[10px] font-black font-headline transition-all duration-300 rotate-90",
                  isActive ? "text-white scale-125 translate-x-[-4px]" : "text-white/30"
                )}
              >
                {num}
              </span>
              
              {/* Small Ticks between numbers (decorative) */}
              <div className="flex flex-col gap-1 items-end absolute right-0 translate-y-[-50%]">
                 {/* Main Tick */}
                 <div 
                   className={cn(
                     "h-[2px] transition-all duration-300",
                     isActive ? "w-6 bg-primary shadow-[0_0_10px_rgba(255,177,195,0.8)]" : "w-3 bg-white/20"
                   )} 
                 />
              </div>
            </div>
          );
        })}

        {/* Dynamic Moving Pointer */}
        <div 
          className="absolute right-[-4px] w-4 h-[2px] bg-primary shadow-[0_0_15px_rgba(255,90,143,0.8)] z-50 transition-all duration-150 ease-out flex items-center justify-center"
          style={{ top: `${scrollPercent}%` }}
        >
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
        </div>
      </div>

      {/* Vertical Label */}
      <div className="mt-12 rotate-90 origin-center whitespace-nowrap">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
          Zepret Depth Focus
        </span>
      </div>
    </div>
  );
}
