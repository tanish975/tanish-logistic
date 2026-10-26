import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export function LogoLoader({
  text = 'Tanish Logistic',
  subtext = 'Connecting Indian Freight Corridors...',
  fullScreen = true,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion();

  const content = (
    <div className={`flex flex-col items-center justify-center p-6 text-center select-none ${className}`}>
      {/*
        The loader mirrors the site emblem: /logo-animated.svg plays its own
        animation set (ring draw-in, monogram rise, transit orbit rotation,
        marching road dashes, gold shimmer) — so we frame it in gold and let
        it move exactly like the header logo.
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
          className="relative z-10 h-28 w-28 sm:h-32 sm:w-32 object-contain drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)]"
        />
      </div>

      {/* Brand Title */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="mt-6 flex flex-col items-center gap-1.5"
      >
        <span className="text-base sm:text-lg font-black tracking-widest uppercase text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {text}
        </span>
        {subtext && (
          <span className="text-xs font-semibold tracking-wider text-slate-300">
            {subtext}
          </span>
        )}
      </motion.div>

      {/* Gold marching road line — same dash rhythm as the emblem's road ribbon */}
      <div className="mt-6 h-[5px] w-44 overflow-hidden rounded-full bg-white/[0.07] border border-white/[0.06]">
        <div
          className={shouldReduceMotion ? 'h-full w-full' : 'tl-marching-road h-full w-full'}
          style={{
            backgroundImage: 'linear-gradient(90deg, #e8c877 0 14px, transparent 14px 28px)',
            backgroundSize: '28px 100%',
          }}
        />
      </div>

      <style>{`
        @keyframes tl-march {
          from { background-position: 0 0; }
          to { background-position: 56px 0; }
        }
        .tl-marching-road {
          animation: tl-march 1.1s linear infinite;
        }
      `}</style>
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
