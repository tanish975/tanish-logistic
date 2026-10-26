'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * BorderBeam — a glowing gradient beam travelling along an element's border.
 * Parent element should be `relative overflow-hidden` with a rounded corner.
 * Adapted from magicui (MIT, https://magicui.design) for Tailwind v3 inline
 * mask styles + framer-motion, with prefers-reduced-motion support.
 */
export function BorderBeam({
  className,
  size = 50,
  duration = 6,
  delay = 0,
  colorFrom = '#ffaa40',
  colorTo = '#9c40ff',
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  // Purely decorative infinite animation — skip entirely for reduced motion.
  if (shouldReduceMotion) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      style={{
        border: `${borderWidth}px solid transparent`,
        WebkitMaskImage:
          'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        WebkitMaskClip: 'padding-box, border-box',
        WebkitMaskComposite: 'destination-in',
        maskImage:
          'linear-gradient(transparent, transparent), linear-gradient(#000, #000)',
        maskClip: 'padding-box, border-box',
        maskComposite: 'intersect',
      }}
    >
      <motion.div
        className={cn('absolute aspect-square', className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          background: `linear-gradient(to left, ${colorFrom}, ${colorTo}, transparent)`,
        }}
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
        }}
        {...props}
      />
    </div>
  );
}

export default BorderBeam;
