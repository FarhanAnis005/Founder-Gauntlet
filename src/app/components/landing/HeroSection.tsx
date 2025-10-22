// File: frontend/src/components/landing/HeroSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// --- Data for our investor cards ---
const investors = [
  {
    name: 'Barbara Corcoran',
    image: '/images/investor-3.jpg', // Ensure you have these images in /public/images/
    question: 'How do you know people will actually pay for this?',
    shortName: 'Barbara',
  },
  {
    name: 'Kevin O\'Leary',
    image: '/images/investor-1.jpg',
    question: 'Why is this not a hobby? Show me the numbers.',
    shortName: 'Kevin',
  },
  {
    name: 'Mark Cuban',
    image: '/images/investor-2.jpg',
    question: "What's stopping a tech giant from doing this in a weekend?",
    shortName: 'Mark',
  },
];

// --- Reusable Component for the Typing Animation ---
const AnimatedTypingText = ({ text, className }: { text: string; className?: string }) => {
    const containerVariants = {
      hidden: {},
      visible: { transition: { staggerChildren: 0.025, delayChildren: 0.1 } },
    };
    const charVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };
  
    const words = text.split(' ');
  
    return (
      <motion.span
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        aria-label={text}
      >
        {words.map((word, wordIndex) => (
          // Wrap each word in a non-breaking span
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIndex) => (
              <motion.span key={charIndex} variants={charVariants} className="inline-block">
                {char}
              </motion.span>
            ))}
            {/* Add a non-breaking space after each word except the last */}
            {wordIndex < words.length - 1 && '\u00A0'}
          </span>
        ))}
      </motion.span>
    );
  };

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % investors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentInvestor = investors[index];

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-primary-bg p-4 sm:p-6 lg:p-8"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* 1. Opaque Card with Subtle Glow Border */}
      <div className="relative w-full max-w-5xl">
         {/* This div creates the soft glow effect around the card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/30 to-blue-800/30 rounded-3xl blur-md" />
        <motion.div
          className="relative w-full bg-surface-bg rounded-3xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 w-full items-center p-6 sm:p-8 md:p-12">
            
            {/* Left Side: Text Content */}
            <div className="flex flex-col justify-center text-center md:text-left">
              <p className="text-body-text text-base sm:text-lg">
                Stop practicing in the mirror.
              </p>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-main-text my-2 sm:my-3">
                Face
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentInvestor.shortName}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block ml-3"
                  >
                    <AnimatedTypingText text={currentInvestor.shortName} className="text-accent" />
                  </motion.div>
                </AnimatePresence>
              </h1>

              <div className="text-body-text text-lg sm:text-xl min-h-[56px] sm:min-h-[84px] flex items-center justify-center md:justify-start">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentInvestor.question}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AnimatedTypingText text={`"${currentInvestor.question}"`} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Side: Image */}
            <div className="flex justify-center items-center h-full order-first md:order-last">
              <div className="relative w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px] rounded-2xl overflow-hidden">
                {/* 2. Simple, Refined Image Border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-accent/40" />
                <AnimatePresence>
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.1 } }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                    className="w-full h-full"
                  >
                    <Image
                      src={currentInvestor.image}
                      alt={currentInvestor.name}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'top' }}
                      sizes="(max-width: 768px) 80vw, 40vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}