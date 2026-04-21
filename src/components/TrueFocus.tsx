'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import './TrueFocus.css';

interface TrueFocusProps {
  sentence?: string;
  separator?: string;
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  animationDuration?: number;
  pauseBetweenAnimations?: number;
  className?: string;
}

const TrueFocus = ({
  sentence = 'True Focus',
  separator = ' ',
  manualMode = false,
  blurAmount = 5,
  borderColor = '#ff5a8f',
  glowColor = 'rgba(255, 90, 143, 0.6)',
  animationDuration = 0.5,
  pauseBetweenAnimations = 2,
  className = ''
}: TrueFocusProps) => {
  const words = sentence.split(separator);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Automatic cycling (Moves even if not clicked)
  useEffect(() => {
    const interval = setInterval(
      () => {
        setCurrentIndex(prev => (prev + 1) % words.length);
      },
      (animationDuration + pauseBetweenAnimations) * 1000
    );

    return () => clearInterval(interval);
  }, [animationDuration, pauseBetweenAnimations, words.length]);

  // Click-to-advance listener (Scoped to Hero Section)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't trigger if clicking on interactive elements
      if (target.closest('button') || target.closest('a') || target.closest('input')) return;
      
      // Check if the click happened inside the hero section
      const heroSection = document.getElementById('hero-section');
      if (heroSection && heroSection.contains(target)) {
        setCurrentIndex(prev => (prev + 1) % words.length);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [words.length]);

  // Update focus rectangle when current index changes
  useEffect(() => {
    const updateFocusRect = () => {
      if (currentIndex < 0 || currentIndex >= words.length) return;
      if (!wordRefs.current[currentIndex] || !containerRef.current) return;

      const activeElement = wordRefs.current[currentIndex];
      
      if (activeElement) {
        setFocusRect({
          x: activeElement.offsetLeft,
          y: activeElement.offsetTop,
          width: activeElement.offsetWidth,
          height: activeElement.offsetHeight
        });
      }
    };

    updateFocusRect();
    // Re-calculate on resize to keep focus accurate
    window.addEventListener('resize', updateFocusRect);
    return () => window.removeEventListener('resize', updateFocusRect);
  }, [currentIndex, words.length]);

  return (
    <div className={`focus-container ${className}`} ref={containerRef}>
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            key={index}
            ref={el => { wordRefs.current[index] = el; }}
            className={`focus-word ${isActive ? 'active' : ''}`}
            style={{
              filter: isActive ? 'blur(0px)' : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
              // @ts-ignore
              '--border-color': borderColor,
              '--glow-color': glowColor,
            }}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        initial={false}
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: focusRect.width > 0 ? 1 : 0
        }}
        transition={{
          duration: animationDuration,
          ease: "easeInOut"
        }}
        style={{
          // @ts-ignore
          '--border-color': borderColor,
          '--glow-color': glowColor
        }}
      >
        <span className="corner top-left"></span>
        <span className="corner top-right"></span>
        <span className="corner bottom-left"></span>
        <span className="corner bottom-right"></span>
      </motion.div>
    </div>
  );
};

export default TrueFocus;