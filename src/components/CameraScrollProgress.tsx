'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function CameraScrollProgress() {
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    const updateScroll = () => {
      const winScroll = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const height = docHeight - winHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollPercent(scrolled);
    };

    const handleScroll = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(updateScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Generate sequence from 1 to 100
  const markers = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);

  return (
    <div className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center pointer-events-none select-none">
      {/* Container for the slider */}
      <div className="relative h-[70vh] md:h-[80vh] flex flex-col justify-between py-2 group">
        
        {/* Vertical Track Line */}
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-white/5" />
        
        {/* Indicators and Numbers */}
        <div className="flex flex-col h-full justify-between">
          {markers.map((num, idx) => {
            // Calculate position for 100 items
            const markerTarget = (idx / (markers.length - 1)) * 100;
            const distance = Math.abs(scrollPercent - markerTarget);
            
            // Logic for visibility: Always show multiples of 10, otherwise only show if very close to active
            const isMajor = num === 1 || num === 100 || num % 10 === 0;
            const isActive = distance < (100 / markers.length);
            
            // On mobile, we only show labels for 1, 50, 100 unless active
            const showLabelOnMobile = num === 1 || num === 50 || num === 100;

            return (
              <div key={num} className="flex items-center gap-1 md:gap-2 justify-end relative h-0">
                {/* The Number */}
                {(isMajor || isActive) && (
                  <span 
                    className={cn(
                      "text-[6px] md:text-[8px] font-black font-headline transition-all duration-200 absolute right-4 md:right-6 whitespace-nowrap",
                      isActive 
                        ? "text-primary scale-125 md:scale-150 -translate-x-1 opacity-100" 
                        : isMajor 
                          ? "text-white/40 opacity-80 md:opacity-100" 
                          : "text-white/10 opacity-0",
                      // Hide some labels on very small screens to avoid overlap
                      !showLabelOnMobile && !isActive && "hidden md:block"
                    )}
                  >
                    {num}
                  </span>
                )}
                
                {/* Tick Mark */}
                <div 
                  className={cn(
                    "h-[1px] transition-all duration-200",
                    isActive 
                      ? "w-4 md:w-6 bg-primary shadow-[0_0_8px_rgba(255,90,143,0.8)]" 
                      : isMajor 
                        ? "w-2 md:w-3 bg-white/30" 
                        : "w-1 md:w-1.5 bg-white/10"
                  )} 
                />
              </div>
            );
          })}
        </div>

        {/* Dynamic Moving Pointer */}
        <div 
          className="absolute right-[-2px] md:right-[-3px] w-3 h-[2px] md:w-4 md:h-[2px] bg-primary shadow-[0_0_15px_rgba(255,90,143,1)] z-50 transition-all duration-75 ease-out flex items-center justify-center"
          style={{ top: `${scrollPercent}%` }}
        >
            <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </div>
      </div>

      {/* Vertical Label - Hidden on small mobile */}
      <div className="mt-8 md:mt-12 rotate-90 origin-center whitespace-nowrap hidden sm:block">
        <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.5em] text-white/30">
          Zepret Depth Focus
        </span>
      </div>
    </div>
  );
}
