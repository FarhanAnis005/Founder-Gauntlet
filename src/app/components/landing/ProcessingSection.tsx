// File: frontend/src/components/landing/ProcessingSection.tsx
'use client';

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ProcessingSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const lastIndexRef = useRef<number>(-1);

  // Responsive Z spacing (smaller on mobile)
  const [zStep, setZStep] = useState(300);
  useEffect(() => {
    const setStep = () => setZStep(window.innerWidth < 640 ? 200 : 300);
    setStep();
    window.addEventListener('resize', setStep);
    return () => window.removeEventListener('resize', setStep);
  }, []);

  const processingSteps = [
    'Deconstructing your deck...',
    'Analyzing market size & TAM...',
    'Evaluating revenue model & projections...',
    'Identifying key risks & weaknesses...',
    'Simulating the investor gauntlet...', // ← (typo fixed: "gauntlet")
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('.processing-layer');
      const stepCount = Math.min(processingSteps.length, layers.length); // steps mapped to visible layers

      // Reset
      textRefs.current.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 }));
      gsap.set('.cta-text', { autoAlpha: 0 });

      // Master tunnel animation
      const tl = gsap.timeline({
        defaults: { ease: 'power1.in' },
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          // snap slices: each step + final CTA slice
          snap: (value) => {
            const snaps = stepCount + 1;
            return Math.round(value * snaps) / snaps;
          },
        },
      });

      tl.fromTo(
        layers,
        { z: (i) => -(zStep * i) - 100 },
        { z: (i) => 2000 - 20 * i, stagger: 1.0 }
      );

      // Text + CTA sync
      ScrollTrigger.create({
        animation: tl,
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;
          const totalSlices = stepCount + 1;
          const sliceSize = 1 / totalSlices;

          // Which text slice are we in?
          const activeIdx = Math.min(stepCount - 1, Math.floor(p * totalSlices));

          // Are we in the final CTA slice?
          const inCTA = p >= stepCount * sliceSize;

          // Fade-out buffer near the end of the last text slice (prevents overlap)
          // When within the last 25% of the final text slice, fade the text out.
          const lastSliceStart = (stepCount - 1) * sliceSize;
          const lastSliceEnd = stepCount * sliceSize;
          const fadeWindowStart = lastSliceEnd - sliceSize * 0.25;
          const inFadeWindow = p >= fadeWindowStart && p < lastSliceEnd;

          if (inCTA) {
            // CTA visible, all texts hidden
            textRefs.current.forEach((el) => el && gsap.to(el, { autoAlpha: 0, duration: 0.2 }));
            gsap.to('.cta-text', { autoAlpha: 1, duration: 0.35 });
            lastIndexRef.current = -1; // reset so we can re-enter cleanly if user scrolls back
            return;
          }

          // Not in CTA; show the correct line
          if (activeIdx !== lastIndexRef.current) {
            // swap texts
            const prev = lastIndexRef.current;
            const nextEl = textRefs.current[activeIdx];
            const prevEl = prev >= 0 ? textRefs.current[prev] : null;

            if (prevEl) gsap.to(prevEl, { autoAlpha: 0, duration: 0.25, ease: 'power2.out' });
            if (nextEl) gsap.to(nextEl, { autoAlpha: 1, duration: 0.25, ease: 'power2.out' });
            lastIndexRef.current = activeIdx;
          }

          // Handle fade-out of the final line before CTA begins
          if (inFadeWindow && lastIndexRef.current === stepCount - 1) {
            const t = (p - fadeWindowStart) / (lastSliceEnd - fadeWindowStart); // 0..1
            const curEl = textRefs.current[stepCount - 1];
            if (curEl) gsap.to(curEl, { autoAlpha: 1 - t, duration: 0.1, overwrite: true });
          }

          // Ensure CTA stays hidden outside its slice
          gsap.to('.cta-text', { autoAlpha: 0, duration: 0.2 });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [processingSteps, zStep]);

  return (
    <div
      ref={containerRef}
      className="h-[450vh] w-full relative bg-primary-bg"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {/* 3D Processing Tunnel Layers */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="processing-layer absolute inset-6 sm:inset-10 md:inset-20 border-2 border-glass-border rounded-2xl"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateZ(-${i * zStep + 100}px)`,
            }}
          />
        ))}

        {/* Accent final frame */}
        <div
          className="processing-layer absolute inset-6 sm:inset-10 md:inset-20 border-4 border-accent shadow-[0_0_35px_theme(colors.accent-glow)] rounded-2xl"
          style={{ transformStyle: 'preserve-3d', transform: `translateZ(-${(5 * zStep) + 400}px)` }}
        />

        {/* Centered step text */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative w-full max-w-2xl text-center">
            {processingSteps.map((text, i) => (
              <p
                key={text}
                ref={(el) => { textRefs.current[i] = el; }}
                className="absolute inset-0 text-lg sm:text-xl md:text-2xl text-main-text font-medium opacity-0"
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="cta-text absolute inset-0 flex items-center justify-center opacity-0 z-10">
          <div
            className="text-center"
            style={{ transform: 'translateZ(-1700px)', transformStyle: 'preserve-3d' }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-main-text">
              Your Analysis is Ready.
            </h2>
            <p className="text-body-text text-lg sm:text-xl mt-3 md:mt-4">The Gauntlet Awaits.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
