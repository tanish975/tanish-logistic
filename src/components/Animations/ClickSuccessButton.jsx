'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React, { useState } from 'react';

export function ClickSuccessButton({ children, className = '', onClick, ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const [clicked, setClicked] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleClick = async (e) => {
    setClicked(true);
    setChecked(true);
    onClick?.(e);
    setTimeout(() => {
      setClicked(false);
      setChecked(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${className}`}
      disabled={clicked}
      {...props}
    >
      {clicked ? (
        <motion.div
          key="success"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2"
        >
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm font-bold text-white">Confirmed</span>
        </motion.div>
      ) : (
        children
      )}
      {clicked ? (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          {checked ? (
            <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </motion.div>
      ) : null}
    </button>
  );
}

export default ClickSuccessButton;