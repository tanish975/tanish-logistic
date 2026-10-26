import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function LogoLoader({ fullScreen = true, className = '' }) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <div className={`flex flex-col items-center justify-center p-6 select-none ${className}`}>
      {/*
        Logo-only loader: the emblem plays its own animation set (ring
        draw-in, monogram rise, transit orbit rotation, marching road
        dashes, gold shimmer) — exactly like the header logo.
      */}
      <div className="relative flex items-center justify-center">
        {/* Warm ambient gold glow */}
        <div className="absolute -inset-8 rounded-full bg-[#e8c877]/10 blur-2xl" />

        {/* Bare emblem — same animated logo as the header */}
        <motion.img
          src="/logo-animated.svg"
          alt="Tanish Logistic"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative z-10 h-32 w-32 sm:h-36 sm:w-36 object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]"
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 backdrop-blur-xl"
        role="status"
        aria-label="Loading page"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

export default LogoLoader;
