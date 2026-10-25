'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

export function ReviewShuffle({ reviews, className = '', delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion || reviews.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [reviews.length, shouldReduceMotion]);

  const review = reviews[index];

  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay }}
      className={`relative h-40 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-lg font-bold">
              {review.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">{review.name}</p>
              <p className="text-xs text-slate-500">{review.role}</p>
            </div>
            <div className="ml-auto flex items-center gap-1 text-yellow-400 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-yellow-200/40'}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">{review.text}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ReviewShuffle;