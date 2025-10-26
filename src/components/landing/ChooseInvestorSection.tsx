// File: frontend/src/components/landing/ChooseInvestorSection.tsx
'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InvestorCard from './InvestorCard';

gsap.registerPlugin(ScrollTrigger);

const investors = [
  { name: 'Mark Cuban',    title: 'The Visionary',      focus: 'Values disruptive tech, massive scale potential, and founders who know their numbers cold.', image: '/images/investor-mark.jpg' },
  { name: 'Lori Greiner',  title: 'The Retail Queen',   focus: 'Looks for products with mass-market appeal that can be sold on QVC or in big-box stores.',   image: '/images/investor-lori.jpg' },
  { name: "Kevin O'Leary", title: 'Mr. Wonderful',      focus: 'Demands profitability and a clear path to getting his money back, often through royalties.', image: '/images/investor-kevin.jpg' },
  { name: 'Barbara Corcoran', title: 'The Gut Investor', focus: 'Invests in the entrepreneur first and the business second. Values passion and resilience.',  image: '/images/investor-barbara.jpg' },
  { name: 'Daymond John',  title: 'The Brand Builder',  focus: 'Expert in fashion and branding. Seeks products he can build into a powerful lifestyle brand.', image: '/images/investor-daymond.jpg' },
];

export default function ChooseInvestorSection() {
  const sectionRef  = useRef<HTMLDivElement | null>(null);   // entire section (title + viewport)
  const viewportRef = useRef<HTMLDivElement | null>(null);   // pinned viewport
  const trackRef    = useRef<HTMLDivElement | null>(null);   // moving track

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section  = sectionRef.current!;
      const viewport = viewportRef.current!;
      const track    = trackRef.current!;
      if (!section || !viewport || !track) return;

      let tween: gsap.core.Tween | null = null;
      let st: ScrollTrigger | null = null;

      const build = () => {
        // kill previous instances created by THIS component only
        tween?.kill();
        st?.kill();

        // Measure once (no vh math) — stable on mobile
        const totalScroll = Math.max(0, track.scrollWidth - viewport.clientWidth);
        if (totalScroll === 0) return;

        // tween + ScrollTrigger (pin the viewport, trigger is the section)
        tween = gsap.to(track, {
          x: -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: viewport,          // pin only the viewport box, not the title
            start: 'top top',
            end: `+=${totalScroll}`,// vertical scroll distance equals horizontal delta
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            // snap: false (off to avoid jumping)
          },
        });
        st = tween.scrollTrigger!;
      };

      build();

      // Debounced resize/RO — prevents rebuild spam (causes hopping)
      let ro: ResizeObserver | null = null;
      let raf = 0;
      let lastW = viewport.clientWidth;
      let lastSW = track.scrollWidth;

      const scheduleRefresh = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const w = viewport.clientWidth;
          const sw = track.scrollWidth;
          // only rebuild if dimensions actually changed notably
          if (Math.abs(w - lastW) > 4 || Math.abs(sw - lastSW) > 4) {
            lastW = w; lastSW = sw;
            build();
            ScrollTrigger.refresh();
          }
        });
      };

      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(scheduleRefresh);
        ro.observe(viewport);
        ro.observe(track);
      } else {
        window.addEventListener('resize', scheduleRefresh);
      }

      // One final refresh after images load (affects scrollWidth)
      const onLoad = () => {
        scheduleRefresh();
        ScrollTrigger.refresh();
      };
      if (document.readyState === 'complete') onLoad();
      else window.addEventListener('load', onLoad, { once: true });

      return () => {
        cancelAnimationFrame(raf);
        ro?.disconnect();
        window.removeEventListener('resize', scheduleRefresh);
        tween?.kill();
        st?.kill();
      };
    }, sectionRef);

    return () => ctx.revert(); // only kills what this component created
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-primary-bg py-24"
      // Important: ensure no transform on ancestors of the pinned element to avoid transform-pin jitter
      style={{
        transform: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Title (not pinned) */}
      <div className="mx-auto w-full max-w-6xl px-6 text-center mb-16">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-main-text">
          Step 2: Choose Your Judge
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-body-text">
          Our AI simulates the mindset of different investor archetypes. See who you&apos;re pitching to.
        </p>
      </div>

      {/* Pinned viewport */}
      <div
        ref={viewportRef}
        className="relative h-[520px] w-full overflow-hidden"
        style={{ touchAction: 'pan-y' }} // keep vertical scroll, avoid horizontal gesture fights
      >
        {/* Moving track */}
        <div
          ref={trackRef}
          className="flex h-full w-max items-center gap-x-10 pl-12 pr-12"
        >
          {investors.map((investor) => (
            <InvestorCard key={investor.name} {...investor} />
          ))}
        </div>
      </div>
    </section>
  );
}