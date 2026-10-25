import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck, Clock, Award, DollarSign, Truck, Headphones,
  CheckCircle2, ArrowRight, Check, X, Shield, MapPin, Building2
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SiteMetadata } from '@/components/Layout/Metadata';
import { PublicPageHero, FinalCta } from '@/components/Layout/PublicPage';

const coreAdvantages = [
  {
    icon: Clock,
    title: '98.2% On-Time Transit SLA',
    description: 'We calculate realistic road transit hours based on actual highway conditions, toll checkpoints, and driver rest cycles — then deliver to schedule with discipline.',
    benefit: 'Eliminates factory production delays & missed receiving windows',
  },
  {
    icon: ShieldCheck,
    title: 'Vetted Commercial Drivers',
    description: 'Every driver undergoes background verification, commercial license validation, and adherence to highway safety protocols. Zero unauthorized crew handoffs.',
    benefit: 'Ensures cargo security & professional dock interactions',
  },
  {
    icon: DollarSign,
    title: 'Transparent Fixed Invoicing',
    description: 'Quoted rates are comprehensive. No sudden toll add-ons, unexpected detention surcharges, or hidden loading fees. Clean GST-compliant invoices with audit trails.',
    benefit: 'Predictable logistics budgeting with full accounting clarity',
  },
  {
    icon: Headphones,
    title: '24/7 Dedicated Operations Desk',
    description: 'Direct phone and email contact with assigned operations coordinators who monitor active highway miles. No generic call center tiers or automated answering bots.',
    benefit: 'Instant issue escalation & proactive milestone updates',
  },
  {
    icon: Truck,
    title: 'Road-Fit Commercial Fleet',
    description: 'From 14ft city feeders to 40ft multi-axle trailers, our vehicles undergo pre-trip mechanical checks, tire pressure monitoring, and weatherproof tarp inspections.',
    benefit: 'Prevents in-transit mechanical breakdowns & cargo spoilage',
  },
  {
    icon: Award,
    title: 'Pan-India Lane Density',
    description: 'Strong lane presence connecting Western manufacturing powerhouses (Gujarat, Maharashtra) to Northern and Central consumption zones with daily departures.',
    benefit: 'Guaranteed vehicle availability even during peak shipping cycles',
  },
];

const comprehensiveComparison = [
  {
    parameter: 'Route & Lane Planning',
    tanish: 'Pre-trip route survey, designated highway corridors, verified toll passes',
    traditional: 'Unplanned transit, drivers picking ad-hoc routes with frequent stops',
  },
  {
    parameter: 'Driver Accountability',
    tanish: 'Verified commercial license, background checked, monitored driving hours',
    traditional: 'Casual subcontracted drivers with zero institutional vetting',
  },
  {
    parameter: 'Transit Communication',
    tanish: 'Proactive milestone updates from a dedicated 24/7 dispatch desk',
    traditional: 'Unresponsive phone lines; updates only after a delay has occurred',
  },
  {
    parameter: 'Invoicing & Rate Structure',
    tanish: 'All-inclusive written quotation upfront; GST compliant; zero hidden fees',
    traditional: 'Low initial quotes followed by surprise detention, toll, and unloading surcharges',
  },
  {
    parameter: 'Cargo Protection & Lashing',
    tanish: 'Multi-point lashing, heavy-duty tarpaulins, mandatory dock inspection',
    traditional: 'Minimal lashing, torn canvas tarpaulins, high risk of weather damage',
  },
  {
    parameter: 'Delivery SLA Commitment',
    tanish: '98.2% on-time delivery record backed by institutional commitments',
    traditional: 'No firm ETA guarantee; frequent rollover of delivery dates',
  },
  {
    parameter: 'Account Management',
    tanish: 'Single point of contact coordinator for your company’s shipments',
    traditional: 'Different broker for every leg, leading to finger-pointing during delays',
  },
];

const WhyUs = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <SiteMetadata
        title="Why Choose Tanish Logistic — The Enterprise Difference in B2B Freight"
        description="Discover why manufacturing leaders and distributors choose Tanish Logistic: 98.2% on-time SLA, verified commercial drivers, transparent billing, and 24/7 operations."
      />

      {/* Enterprise Page Hero */}
      <PublicPageHero
        eyebrow="The Tanish Advantage"
        title="Why Leading Enterprises Trust Tanish Logistic With Their Freight."
        description="In commercial supply chains, a late shipment costs more than freight. Explore the operating disciplines, verified fleet standards, and institutional accountability that set us apart."
        primaryLabel="Request a Route Quote"
        secondaryHref="/book"
        secondaryLabel="Book Transport Online"
      >
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-6 backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Institutional Commitments</p>
          <div className="mt-4 space-y-3.5 text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span>On-Time Delivery SLA</span>
              <strong className="text-emerald-400">98.2% Verified</strong>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span>Driver Compliance</span>
              <strong className="text-white">100% Background Vetted</strong>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span>Operations Desk</span>
              <strong className="text-white">24/7 Active Transit Support</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Billing Integrity</span>
              <strong className="text-white">Zero Hidden Charges Guarantee</strong>
            </div>
          </div>
        </div>
      </PublicPageHero>

      {/* 6 Core Institutional Advantages */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Core Strengths
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Engineered around the priorities of procurement and plant managers.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              We built our operating model specifically to eliminate the unpredictability that plagues unorganized road transport.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {coreAdvantages.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-xl hover:border-slate-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-slate-950">
                      {adv.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {adv.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{adv.benefit}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full-Bleed Photographic Split Section: Fleet Maintenance & Inspection */}
      <section className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Photo Column */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-xl ring-1 ring-slate-900/10">
                <Image
                  src="/gallery/Picture6.jpg"
                  alt="Modern commercial transport vehicle maintained by Tanish Logistic"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-slate-900/85 p-4 text-white backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Pre-Trip Departure Protocol</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-200">Brake, Tire Pressure & Chassis Safety Verification</p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
                Mechanical Readiness
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Preventive vehicle maintenance that prevents highway breakdowns.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Unscheduled roadside repairs are the leading cause of delivery delays in Indian logistics. At Tanish Logistic, we operate on a strict preventative maintenance schedule rather than waiting for breakdowns.
                </p>
                <p>
                  Before rolling onto the highway, every vehicle completes a certified pre-trip checklist: brake pad thickness, steering play, tire tread depth, electrical harness, and tarpaulin waterproofing.
                </p>
                <p>
                  This relentless attention to mechanical integrity guarantees that your cargo arrives safely and on time, even through monsoon downpours and challenging highway conditions.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button asChild className="h-12 rounded-xl px-7 text-sm sm:text-base font-bold text-white bg-sky-700 hover:bg-sky-800 shadow-md shadow-sky-900/20 transition-all duration-200 active:scale-[0.98]">
                  <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap">
                    View Fleet Capabilities
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 rounded-xl border border-slate-300 px-6 text-sm sm:text-base font-semibold text-slate-800 hover:bg-slate-100 transition-all duration-200 active:scale-[0.98]">
                  <Link href="/Gallery" className="inline-flex items-center justify-center whitespace-nowrap">
                    Explore Fleet Gallery
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Enterprise Comparison Matrix */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Direct Comparison
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Tanish Logistic vs Traditional Transporters.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              See the exact operational differences that translate into peace of mind for your supply chain.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-900">
                    <th className="p-4 sm:p-5 font-bold w-1/4">Operational Dimension</th>
                    <th className="p-4 sm:p-5 font-bold w-3/8 bg-sky-50 text-sky-950 border-x border-sky-100">
                      Tanish Logistic Standard
                    </th>
                    <th className="p-4 sm:p-5 font-bold w-3/8 text-slate-500">
                      Traditional Unorganized Carrier
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comprehensiveComparison.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        {row.parameter}
                      </td>
                      <td className="p-4 sm:p-5 bg-sky-50/40 border-x border-sky-100/70 text-slate-900 font-medium">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{row.tanish}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500">
                        <div className="flex items-start gap-2">
                          <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <span>{row.traditional}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCta
        eyebrow="Upgrade Your Freight Partner"
        title="Switch to road transport you can actually rely on."
        description="Contact our dispatch leadership in Vadodara or Mandi Gobindgarh to audit your current route lanes, reduce transit friction, and secure dedicated capacity."
        primaryLabel="Schedule a Call"
        secondaryLabel="Book Transport Online"
      />
    </div>
  );
};

export default WhyUs;