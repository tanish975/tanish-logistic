'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export function WordRotator({ words, className = '', delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || words.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [words.length, shouldReduceMotion]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay }}
      className={`${className} inline-block`}
    >
      {words[index]}
    </motion.span>
  );
}

export default WordRotator;