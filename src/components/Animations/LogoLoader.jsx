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
      {/* Outer Glow Halo & Medallion Container */}
      <div className="relative flex items-center justify-center">
        {/* Ambient Back Glow */}
        <div className="absolute -inset-6 rounded-full bg-sky-500/20 blur-2xl animate-pulse" />

        {/* Outer Orbital Rotating Ring */}
        {!shouldReduceMotion && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute -inset-4 rounded-full border border-dashed border-sky-400/40"
          />
        )}

        {/* Pulse Expansion Ring */}
        {!shouldReduceMotion && (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute -inset-2 rounded-full border border-sky-400/30"
          />
        )}

        {/* Centered Upgraded Logo Emblem */}
        <motion.div
          animate={shouldReduceMotion ? {} : { scale: [0.97, 1.03, 0.97] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="relative z-10 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-slate-900/60 p-2 shadow-2xl shadow-sky-950/80 backdrop-blur-md border border-white/20"
        >
          <img
            src="/logo-animated.svg"
            alt="Tanish Logistic"
            className="h-full w-full object-contain rounded-full drop-shadow-[0_4px_16px_rgba(2,132,199,0.5)]"
          />
        </motion.div>
      </div>

      {/* Brand Title */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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

      {/* Shimmering Linear Progress Bar */}
      <div className="mt-5 relative h-1 w-36 overflow-hidden rounded-full bg-slate-800/80 border border-white/10">
        {!shouldReduceMotion ? (
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_8px_rgba(56,189,248,0.8)]"
          />
        ) : (
          <div className="h-full w-full bg-sky-500" />
        )}
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
