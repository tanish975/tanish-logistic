'use client';

import React from 'react';

export function ProcessDraw({ steps = [], className = '', ...props }) {
  return (
    <div className={`w-full min-w-0 ${className}`} {...props}>
      <ol
        aria-label="Freight movement process"
        className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        {steps.map((step, index) => (
          <li
            key={step.id ?? step.number ?? step.title ?? index}
            className="group relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md sm:p-6"
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-700 via-cyan-500 to-emerald-400 opacity-80"
            />
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sm font-extrabold tracking-wide text-sky-800">
                {step.number ?? String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="min-w-0 break-words text-base font-bold leading-snug text-slate-950">
                    {step.title}
                  </h3>
                  {step.tag && (
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      {step.tag}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 [overflow-wrap:anywhere]">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ProcessDraw;
