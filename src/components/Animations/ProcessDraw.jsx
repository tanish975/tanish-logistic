'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

export function ProcessDraw({ steps, className = '', ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const lineRef = useRef(null);

  useEffect(() => {
    if (shouldReduceMotion || !lineRef.current) return;
    const line = lineRef.current;
    const length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
    line.style.transition = 'stroke-dashoffset 1s ease-out';
    line.style.strokeDashoffset = 0;
  }, [shouldReduceMotion]);

  return (
    <div className={`relative w-full ${className}`} {...props}>
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center gap-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-lg font-bold border-2 border-sky-200">
                {step.number}
              </div>
              <motion.div
                key={`line-${idx}`}
                ref={step.isLast ? lineRef : undefined}
                className={`absolute top-[22px] ${
                  step.isLast ? '-ml-[calc(50%+6px)] h-[calc(100%-12px)] w-[1px] bg-slate-200' : '-ml-[calc(50%+6px)] h-[calc(50%-12px)] w-[1px] bg-slate-200'
                }`}
              />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-950">{step.title}</h3>
              {step.tag && (
                <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-600 text-xs font-bold">{step.tag}</span>
              )}
            </div>
            <p className="text-xs text-slate-600 text-center max-w-xs">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProcessDraw;