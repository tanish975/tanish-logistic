import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Handshake, Package, Route, ShieldCheck, Truck, Warehouse } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SiteMetadata } from '@/components/Layout/Metadata';
import { PublicPageHero, SectionIntro, FinalCta } from '@/components/Layout/PublicPage';

const services = [
  {
    title: 'Intercity & interstate freight',
    description: 'Reliable road freight across cities and states for repeat commercial movement.',
    icon: Truck,
    points: ['Competitive quotes', 'Safe cargo handling', 'Route-aware scheduling'],
  },
  {
    title: 'B2B cargo movement',
    description: 'Shipment support for manufacturers, wholesalers, factories, and enterprises.',
    icon: Package,
    points: ['Bulk cargo planning', 'Dedicated coordination', 'Clear documentation'],
  },
  {
    title: 'Fleet-based transport',
    description: 'Vehicle matching for load size, timing, road conditions, and destination needs.',
    icon: Route,
    points: ['Vehicle fit guidance', 'Driver coordination', 'Maintenance-first movement'],
  },
  {
    title: 'Contract logistics',
    description: 'Long-term transport partnerships for predictable lanes and operating rhythm.',
    icon: Handshake,
    points: ['Custom lane strategy', 'Account support', 'Cost optimization'],
  },
];

const process = [
  ['01', 'Share route', 'Pickup, drop, load type, and timeline.'],
  ['02', 'Plan movement', 'We identify vehicle fit and route expectations.'],
  ['03', 'Dispatch cargo', 'The shipment moves with practical coordination.'],
  ['04', 'Close delivery', 'Proof, feedback, and next-route readiness.'],
];

const Services = () => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
    <SiteMetadata
      title="Services — Tanish Logistic"
      description="Intercity freight, B2B cargo movement, fleet-based transport, and contract logistics. See how Tanish Logistic plans, dispatches, and closes every shipment across India."
    />
    <PublicPageHero
      eyebrow="Services"
      title="Freight services shaped around real business movement."
      description="Choose from focused road-transport solutions built for manufacturers, distributors, enterprises, and growing teams that need accountable cargo movement."
      primaryLabel="Get service quote"
      secondaryHref="/book"
      secondaryLabel="Start booking"
    >
      <div className="grid gap-4">
        {['Full truck load support', 'B2B cargo coordination', 'Interstate route planning'].map((item) => (
          <div key={item} className="flex items-center gap-3 rounded-md border border-white/10 bg-slate-950/35 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" aria-hidden="true" />
            <span className="font-bold text-slate-100">{item}</span>
          </div>
        ))}
      </div>
    </PublicPageHero>

    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="What we offer"
          title="A service menu that feels operational, not generic."
          description="Each service is built to answer the buyer's real questions: what can move, how it will be planned, and who keeps the shipment accountable."
          align="center"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0 : 0.45, ease: 'easeOut' } }}}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: shouldReduceMotion ? 0 : index * 0.04 }}
                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-600 via-cyan-400 to-emerald-400" />
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-slate-950 text-sky-200">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-950">{service.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
                  </div>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {service.points.map((point) => (
                    <li key={point} className="rounded-md bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
                      {point}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="link" className="mt-5 h-auto p-0 font-extrabold text-sky-700">
                  <Link href="/contact">
                    Discuss this service
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>

    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow="How it works"
          title="A crisp route from inquiry to delivery."
          description="The page now explains the operating flow visually so customers understand the next step before they click."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {process.map(([number, title, detail]) => (
            <div key={number} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <div className="text-sm font-extrabold text-sky-700">{number}</div>
              <h3 className="mt-4 text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <FinalCta
      title="Ready to choose the right transport plan?"
      description="Send your load details and route. The team will help match the movement to the service that fits best."
    />
  </div>
  );
}

export default Services;
