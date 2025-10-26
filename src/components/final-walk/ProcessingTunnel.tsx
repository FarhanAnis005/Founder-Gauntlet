// File: src/components/final-walk/ProcessingTunnel.tsx
'use client';

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';

export type ProcessingTunnelHandle = {
  /** Plays a short intro beat, then pauses */
  playIntro: () => void;
  /** Continues the visual after mic is granted */
  playAfterMic: () => void;
  /** Shows the final CTA, then calls onComplete after a short hold */
  showFinal: () => void;
  /** Jump to the end immediately */
  skipAll: () => void;
};

type Props = {
  /** Fired once visuals are ready (no build time, so this is immediate) */
  onReady?: () => void;
  /** Fired after `showFinal` holds briefly */
  onComplete?: () => void;
  /** Kept for compatibility; not used here */
  steps?: string[];
};

/**
 * Bold, reliable visual tunnel:
 * - No 3D transforms or GSAP
 * - Animated gradient "core", neon ring pulse, stacked frames with glow
 * - Optional scan-sweep highlight when phases change
 */
const ProcessingTunnel = forwardRef<ProcessingTunnelHandle, Props>(function ProcessingTunnel(
  { onReady, onComplete },
  ref
) {
  type Stage = 'idle' | 'intro' | 'middle' | 'final';
  const [stage, setStage] = useState<Stage>('idle');

  // Triggers to replay short scan-sweep accent when stage changes
  const [sweepKey, setSweepKey] = useState(0);

  // Guard to avoid double-complete
  const completedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    playIntro() {
      setStage('intro');
      setSweepKey((k) => k + 1);
    },
    playAfterMic() {
      setStage('middle');
      setSweepKey((k) => k + 1);
    },
    showFinal() {
      if (completedRef.current) return;
      setStage('final');
      setSweepKey((k) => k + 1);
      // Let the final CTA breathe briefly, then complete
      window.setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }, 950);
    },
    skipAll() {
      if (completedRef.current) return;
      setStage('final');
      completedRef.current = true;
      onComplete?.();
    },
  }));

  useEffect(() => {
    onReady?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stage-driven values
  const coreScale = stage === 'final' ? 1.06 : stage === 'middle' ? 1.04 : stage === 'intro' ? 1.02 : 1;
  const coreBlur = stage === 'final' ? 4 : stage === 'middle' ? 2 : stage === 'intro' ? 1 : 0;
  const ringScale = stage === 'final' ? 1.12 : stage === 'middle' ? 1.08 : stage === 'intro' ? 1.04 : 1.0;

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-primary-bg"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* --- Core gradient "atmosphere" (big soft blue glow) --- */}
      <motion.div
        aria-hidden
        className="absolute -inset-24"
        initial={{ opacity: 0.85, scale: 1, filter: 'blur(0px)' }}
        animate={{
          opacity: 0.95,
          scale: coreScale,
          filter: `blur(${coreBlur}px)`,
        }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(1200px 1200px at 50% 55%, rgba(0,123,255,0.18), transparent 65%)',
        }}
      />

      {/* --- Neon ring pulse (center focus) --- */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        initial={{ scale: 0.98, opacity: 0.7 }}
        animate={{ scale: ringScale, opacity: 0.9 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{
          width: '56vmin',
          height: '56vmin',
          boxShadow: '0 0 40px rgba(0,123,255,0.45), inset 0 0 30px rgba(0,123,255,0.25)',
          border: '3px solid rgba(0,123,255,0.65)',
          filter: 'blur(0.15px)',
        }}
      />

      {/* --- Stacked frames with glow (simple depth cue) --- */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute inset-10 sm:inset-12 md:inset-16 rounded-2xl"
          initial={{
            opacity: 0.3,
            scale: 1 - i * 0.02,
          }}
          animate={{
            opacity: stage === 'final' ? 0.5 : 0.4,
            scale:
              stage === 'final'
                ? 1.06 - i * 0.015
                : stage === 'middle'
                ? 1.035 - i * 0.015
                : stage === 'intro'
                ? 1.02 - i * 0.015
                : 1 - i * 0.02,
          }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{
            border: '2px solid rgba(255,255,255,0.22)',
            boxShadow: '0 0 28px rgba(0,123,255,0.22)',
            backdropFilter: 'blur(2px)',
          }}
        />
      ))}

      {/* --- Scan sweep accent: replays on each stage change --- */}
      <motion.div
        key={sweepKey}
        aria-hidden
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'idle' ? 0 : 0.6 }}
        transition={{ duration: 0.1 }}
      >
        <motion.div
          initial={{ x: '-120%' }}
          animate={{ x: '120%' }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '20%',
            height: '60%',
            width: '35%',
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), rgba(0,123,255,0.25), transparent)',
            filter: 'blur(10px)',
            transform: 'skewX(-15deg)',
          }}
        />
      </motion.div>

      {/* --- Final CTA (only visible on final) --- */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: stage === 'final' ? 1 : 0, y: stage === 'final' ? 0 : 8 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <div className="text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-main-text"
            style={{ textShadow: '0 0 14px rgba(0,123,255,0.4)' }}
          >
            Preparing the Gauntlet…
          </h2>
          <p
            className="text-body-text text-lg sm:text-xl mt-3 md:mt-4"
            style={{ textShadow: '0 0 8px rgba(0,123,255,0.25)' }}
          >
            Almost there.
          </p>
        </div>
      </motion.div>
    </div>
  );
});

export default ProcessingTunnel;
