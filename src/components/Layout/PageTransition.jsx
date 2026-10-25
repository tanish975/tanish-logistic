'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useCallback } from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.3,
};

export function PageTransition({ children }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function TransitionLink({ href, children, className = '', ...props }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setIsPending(true);
    router.push(href).then(() => setIsPending(false));
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={className}
      aria-busy={isPending}
      {...props}
    >
      {children}
    </a>
  );
}

export function usePageTransition() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const pushWithTransition = useCallback((href) => {
    setIsTransitioning(true);
    router.push(href).finally(() => {
      setTimeout(() => setIsTransitioning(false), 300);
    });
  }, [router]);

  return { isTransitioning, pushWithTransition };
}

export default PageTransition;