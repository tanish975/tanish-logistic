import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '../ui/button';

const fadeUp = (reduce) => ({
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.45, ease: 'easeOut' } },
});

const stagger = (reduce) => ({
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: reduce ? 0 : 0.08 } },
});

export const PublicPageHero = ({
  eyebrow,
  title,
  description,
  primaryHref = '/contact',
  primaryLabel = 'Get a quote',
  secondaryHref = '/services',
  secondaryLabel = 'View services',
  children,
}) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/80 to-transparent" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.85fr] lg:px-8">
        <motion.div variants={stagger(shouldReduceMotion)} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.div variants={fadeUp(shouldReduceMotion)} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-sky-100 backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {eyebrow}
          </motion.div>
          <motion.h1 variants={fadeUp(shouldReduceMotion)} className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            {title}
          </motion.h1>
          <motion.p variants={fadeUp(shouldReduceMotion)} className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {description}
          </motion.p>
          <motion.div variants={fadeUp(shouldReduceMotion)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-md bg-sky-700 px-6 text-base font-bold text-white hover:bg-sky-800">
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-white/30 bg-white/5 px-6 text-base font-bold text-white hover:bg-white hover:text-slate-950">
              <Link href={secondaryHref}>{secondaryLabel}</Link>
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: 'easeOut' }}
          className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export const SectionIntro = ({ eyebrow, title, description, align = 'left' }) => (
  <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
    <p className="text-sm font-bold uppercase tracking-wide text-sky-700">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">{title}</h2>
    {description && <p className="mt-5 text-base leading-8 text-slate-600">{description}</p>}
  </div>
);

export const FinalCta = ({ title, description, primaryLabel = 'Request quote', secondaryLabel = 'Book transport' }) => (
  <section className="bg-slate-950 py-16 text-white sm:py-20">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
      <div>
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-12 rounded-md bg-sky-700 px-6 font-bold text-white hover:bg-sky-800">
          <Link href="/contact">
            {primaryLabel}
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-white/30 bg-white/5 px-6 font-bold text-white hover:bg-white hover:text-slate-950">
          <Link href="/book">{secondaryLabel}</Link>
        </Button>
      </div>
    </div>
  </section>
);