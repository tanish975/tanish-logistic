import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/button';

const fadeUp = (reduce) => ({
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.45, ease: 'easeOut' } },
});

const stagger = (reduce) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : 0.06 } },
});

export const PublicPageHero = ({
  eyebrow,
  title,
  description,
  primaryHref = '/contact',
  primaryLabel = 'Request a Quote',
  secondaryHref = '/services',
  secondaryLabel = 'View Services',
  badgeText = 'Enterprise Road Logistics',
  children,
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:64px_64px]"
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-28 pb-20 sm:px-6 sm:pt-36 sm:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <motion.div variants={stagger(shouldReduceMotion)} initial="hidden" animate="visible" className="max-w-2xl">
          {eyebrow && (
            <motion.div variants={fadeUp(shouldReduceMotion)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              {eyebrow}
            </motion.div>
          )}

          <motion.h1 variants={fadeUp(shouldReduceMotion)} className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15]">
            {title}
          </motion.h1>

          <motion.p variants={fadeUp(shouldReduceMotion)} className="mt-6 text-base leading-relaxed text-slate-300 sm:text-lg">
            {description}
          </motion.p>

          <motion.div variants={fadeUp(shouldReduceMotion)} className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="group relative h-12 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 px-7 text-sm sm:text-base font-bold text-white shadow-lg shadow-sky-950/50 hover:from-sky-500 hover:to-sky-600 hover:shadow-xl hover:shadow-sky-900/60 border border-sky-400/25 transition-all duration-200 active:scale-[0.98]"
            >
              <Link href={primaryHref} className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <span>{primaryLabel}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border border-slate-700/80 bg-slate-900/80 px-6 text-sm sm:text-base font-semibold text-slate-100 shadow-sm backdrop-blur-sm hover:border-slate-500 hover:bg-slate-800 hover:text-white transition-all duration-200 active:scale-[0.98]"
            >
              <Link href={secondaryHref} className="inline-flex items-center justify-center whitespace-nowrap">
                {secondaryLabel}
              </Link>
            </Button>
          </motion.div>

          <motion.div variants={fadeUp(shouldReduceMotion)} className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-sky-400" />
              Verified Fleet
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              98.2% On-Time SLA
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
              <Phone className="h-4 w-4 text-sky-400" />
              24/7 Dispatch Support
            </span>
          </motion.div>
        </motion.div>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: 'easeOut', delay: shouldReduceMotion ? 0 : 0.15 }}
            className="relative"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export const SectionIntro = ({ eyebrow, title, description, align = 'left', className = '' }) => (
  <div className={`${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'} ${className}`}>
    {eyebrow && (
      <p className="text-xs font-bold uppercase tracking-widest text-sky-700">
        {eyebrow}
      </p>
    )}
    <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
      {title}
    </h2>
    {description && (
      <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
        {description}
      </p>
    )}
  </div>
);

export const FinalCta = ({
  eyebrow = 'Ready to move your freight?',
  title = 'Plan your next shipment with road freight professionals.',
  description = 'Share your pickup origin, destination drop, cargo dimensions, and required dispatch timeline. Our team prepares route-optimized B2B pricing within hours.',
  primaryLabel = 'Request Freight Quote',
  secondaryLabel = 'Book Transport Online',
}) => (
  <section className="relative overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
    <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:48px_48px]" aria-hidden="true" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            {eyebrow}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <a href="tel:+919924204744" className="flex items-center gap-2 hover:text-white transition">
              <Phone className="h-4 w-4 text-sky-400" />
              <span>Direct Desk: <strong>+91 9924204744</strong></span>
            </a>
            <span className="text-slate-600">&bull;</span>
            <span>Fast Turnaround</span>
            <span className="text-slate-600">&bull;</span>
            <span>Transparent Billing</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-start lg:justify-end">
          <Button
            asChild
            size="lg"
            className="group relative h-12 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 px-7 text-sm sm:text-base font-bold text-white shadow-lg shadow-sky-950/50 hover:from-sky-500 hover:to-sky-600 hover:shadow-xl hover:shadow-sky-900/60 border border-sky-400/25 transition-all duration-200 active:scale-[0.98]"
          >
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
              <span>{primaryLabel}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-xl border border-slate-700/80 bg-slate-900/80 px-6 text-sm sm:text-base font-semibold text-slate-100 shadow-sm backdrop-blur-sm hover:border-slate-500 hover:bg-slate-800 hover:text-white transition-all duration-200 active:scale-[0.98]"
          >
            <Link href="/book" className="inline-flex items-center justify-center whitespace-nowrap">
              {secondaryLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);