'use client';

import { useRef } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * BlurFade — scroll-triggered blur + fade entrance.
 * Adapted from magicui (MIT, https://magicui.design) for Tailwind v3 +
 * framer-motion, with prefers-reduced-motion support.
 */
export function BlurFade({
  children,
  className,
  variant,
  duration = 0.45,
  delay = 0,
  offset = 10,
  direction = 'up',
  inView = false,
  inViewMargin = '-60px',
  blur = '6px',
  ...props
}) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin });
  const shouldReduceMotion = useReducedMotion();
  const isInView = !inView || inViewResult || shouldReduceMotion;

  const axis = direction === 'left' || direction === 'right' ? 'x' : 'y';
  const defaultVariants = {
    hidden: {
      [axis]: direction === 'right' || direction === 'down' ? -offset : offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [axis]: 0,
      opacity: 1,
      filter: 'blur(0px)',
    },
  };
  const combinedVariants = variant ?? defaultVariants;

  // Reduced motion: render in final state, no entrance animation.
  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        exit="hidden"
        variants={combinedVariants}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: 'easeOut',
          filter: { duration },
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default BlurFade;
