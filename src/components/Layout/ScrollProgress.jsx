'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

export function ScrollProgress() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: 3,
        zIndex: 9999,
        background: 'linear-gradient(90deg, #0369A1, #052424, #abff02)',
        boxShadow: '0 2px 10px rgba(5, 36, 36, 0.3)',
        transformOrigin: 'left center',
      }}
      animate={{
        scaleX: scrollYProgress,
        originX: 0,
      }}
      transition={{ duration: 0.1, ease: 'linear' }}
      aria-hidden="true"
    />
  );
}

export function ScrollToTop() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (latest) => {
      setIsVisible(latest > 300);
    });
    return () => unsubscribe();
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'instant' : 'smooth' });
  };

  if (shouldReduceMotion && !isVisible) return null;

  return (
    <motion.button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-sky-700 p-3 text-white shadow-lg hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/50"
      aria-label="Scroll to top"
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      initial={false}
      style={{ display: isVisible ? 'flex' : 'none' }}
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </motion.button>
  );
}

export default ScrollProgress;