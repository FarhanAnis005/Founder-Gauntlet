// File: frontend/src/components/landing/CrossExaminationSection.tsx
'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { SignInButton } from '@clerk/nextjs'; // <-- 1. Import Clerk's SignInButton

export default function CrossExaminationSection() {
    return (
        <section 
            className="w-full min-h-screen flex flex-col items-center justify-center bg-primary-bg p-4 sm:p-6 lg:p-8"
            style={{
                backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
            }}
        >
            {/* --- 2. FIX: Moved Headline and Text outside the card --- */}
            <div className="w-full max-w-5xl text-center mb-16">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-main-text">
                    Step 3: Face the Cross-Examination
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-body-text">
                    Engage in a real-time conversation. Our AI challenges your assumptions and pressure-tests your plan.
                </p>
            </div>

            {/* The main card that animates into view */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-surface-bg rounded-3xl overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Left Side: A visual element, like the pulsating mic */}
                <div className="flex flex-col items-center justify-center p-8 md:p-12 min-h-[300px]">
                    <Mic className="w-24 h-24 text-accent animate-pulse-glow" />
                </div>

                {/* Right Side: Call to Action */}
                <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-primary-bg/50">
                    <h3 className="text-2xl font-bold text-main-text mb-2">Ready to Start?</h3>
                    <p className="text-body-text mb-8 text-center">Sign in to face the AI and get instant feedback.</p>
                    
                    {/* --- 3. FIX: Integrated Clerk's SignInButton --- */}
                    <SignInButton mode="modal">
                        {/* Container for the glowing button */}
                        <div className="relative group">
                            {/* The glow effect */}
                            <div 
                                className="absolute -inset-1.5 bg-gradient-to-r from-accent to-blue-600 rounded-lg blur-lg opacity-60 group-hover:opacity-100 transition duration-300" 
                                aria-hidden="true"
                            />
                            {/* The actual button, positioned on top */}
                            <button className="relative px-7 py-4 bg-surface-bg rounded-lg text-lg font-semibold text-main-text hover:bg-primary-bg transition-colors duration-200">
                                Sign In to Start Your Pitch
                            </button>
                        </div>
                    </SignInButton>
                </div>
            </motion.div>
        </section>
    );
}