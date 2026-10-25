'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

export function BentoGrid({
  items,
  className = '',
  cols = 3,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-${cols} ${className}`} {...props}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.08 }}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 hover:shadow-xl hover:border-sky-400/50 transition-all duration-300"
            style={{ gridColumn: item.colSpan ? `span ${item.colSpan}` : undefined }}
          >
            {Icon && (
              <div className="h-12 w-12 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6" />
              </div>
            )}
            <h3 className="text-lg font-bold text-slate-950 mb-2">{item.title}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
            {item.features && (
              <div className="mt-4">
                {item.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 my-1 text-xs text-slate-600">
                    <span className="h-3 w-3 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      )}
    </div>
  );
}

export default BentoGrid;