'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

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

  // Keep page content in the server-rendered HTML so the shell cannot show the footer alone.
  return (
    <AnimatePresence mode="wait" initial={false}>
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

export default PageTransition;
