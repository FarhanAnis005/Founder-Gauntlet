// File: frontend/src/components/landing/UploadVisionSection.tsx
'use client';

import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UploadCloud } from 'lucide-react';

export default function UploadVisionSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const animationStart = 0.2;
  const animationEnd = 0.6;
  const textFadeInStart = 0.6; // For "Ready to process" text
  const textFadeInEnd = 0.7;

  const headlineOpacity = useTransform(scrollYProgress, [animationStart, 0.4], [1, 0]);
  const headlineY = useTransform(scrollYProgress, [animationStart, 0.4], [0, -50]);
  
  // The icon now just appears and stays, ready for the next section
  const iconScale = useTransform(scrollYProgress, [animationStart, animationEnd], [0.5, 1]);
  const iconOpacity = useTransform(scrollYProgress, [animationStart, animationEnd], [0, 1]);

  const dotsContainerOpacity = useTransform(scrollYProgress, [animationStart, animationEnd], [1, 0]);
  const dotsContainerScale = useTransform(scrollYProgress, [animationStart, animationEnd], [1, 0.5]);

  // New text for "Ready to process..."
  const readyTextOpacity = useTransform(scrollYProgress, [textFadeInStart, textFadeInEnd], [0, 1]);
  const readyTextY = useTransform(scrollYProgress, [textFadeInStart, textFadeInEnd], [20, 0]);

  const dots = useMemo(() => {
    const colors = [
      '#007BFF', '#EAEAEA', '#9333ea', '#f59e0b',
    ];
    return Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 150 - 25}%`,
      left: `${Math.random() * 150 - 25}%`,
      size: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <section 
        ref={targetRef} 
        className="relative w-full h-[150vh] bg-primary-bg" // Reduced height slightly as no actual upload occurs
        style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
        }}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-main-text text-center"
          style={{ opacity: headlineOpacity, y: headlineY }}
        >
          Step 1: Upload Your Vision
        </motion.h2>

        <div className="absolute w-full h-full max-w-xs max-h-xs sm:max-w-sm sm:max-h-sm flex items-center justify-center">
          
          <motion.div 
            className="absolute w-full h-full"
            style={{ 
              opacity: dotsContainerOpacity,
              scale: dotsContainerScale
            }}
          >
            {dots.map((dot) => (
              <div
                key={dot.id}
                className="absolute rounded-full"
                style={{
                  top: dot.top,
                  left: dot.left,
                  width: `${dot.size}px`,
                  height: `${dot.size}px`,
                  backgroundColor: dot.color,
                }}
              />
            ))}
          </motion.div>
          
          <motion.div
            className="flex flex-col items-center justify-center"
            style={{ 
              scale: iconScale,
              opacity: iconOpacity,
            }}
          >
            <UploadCloud className="w-24 h-24 sm:w-32 sm:h-32 text-accent" />
            <motion.span 
              className="mt-4 text-lg text-body-text text-center"
              style={{
                opacity: readyTextOpacity,
                y: readyTextY
              }}
            >
              Your vision coalesces. <br/>Ready for analysis.
            </motion.span>
            {/* Removed the file input entirely */}
          </motion.div>

        </div>
      </div>
    </section>
  );
}