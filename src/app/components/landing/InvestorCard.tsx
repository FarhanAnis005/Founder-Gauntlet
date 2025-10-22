// File: frontend/src/components/landing/InvestorCard.tsx
'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

// Define the type for the props
type InvestorCardProps = {
  name: string;
  title: string;
  focus: string;
  image: string;
};

// Define the variant for the card's entrance animation
export const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function InvestorCard({ name, title, focus, image }: InvestorCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values to track mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for a smoother return to neutral
  const springConfig = { damping: 15, stiffness: 200 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  // Transform mouse position into 3D rotation
  // The range [-15, 15] defines the max tilt in degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    // Normalize mouse position to a range of -0.5 to 0.5
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d', // Essential for 3D transforms
        rotateX,
        rotateY,
      }}
      className="relative h-[450px] w-[320px] flex-shrink-0 rounded-3xl bg-surface-bg p-6 text-center"
      variants={cardVariants}
    >
      <div style={{ transform: 'translateZ(50px)' }} className="transform-gpu"> {/* Lifts content off the card */}
        <div className="relative mx-auto h-32 w-32 rounded-full overflow-hidden border-2 border-accent/50">
          <Image
            src={image}
            alt={name}
            fill
            style={{ objectFit: 'cover', objectPosition: 'top' }}
            sizes="20vw"
          />
        </div>
        <h3 className="mt-6 text-2xl font-bold text-main-text">{name}</h3>
        <p className="mt-1 text-base font-medium text-accent">{title}</p>
        <p className="mt-4 text-body-text">{focus}</p>
      </div>
    </motion.div>
  );
}