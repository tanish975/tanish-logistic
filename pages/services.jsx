import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Handshake, Package, Route, ShieldCheck, Truck, Warehouse, Check, Clock, Phone } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SiteMetadata } from '@/components/Layout/Metadata';
import { PublicPageHero, SectionIntro, FinalCta } from '@/components/Layout/PublicPage';
import { WordRotator } from '@/components/Animations/WordRotator';

const serviceDetails = [
  {
    number: '01',
    title: 'Full Truckload (FTL) & Interstate Freight',
    description: 'Dedicated commercial vehicles moving exclusively for your business from origin to destination without mid-route unloading, consolidations, or multiple handoffs.',
    image: '/gallery/Picture6.jpg',
    badge: 'Direct Long-Haul',
    capabilities: [
      'Point-to-point direct highway transit with minimal stoppage',
      'Vehicle sizing precisely calibrated for cargo weight & cube',
      'Dedicated driver with verified commercial credentials',
      'Continuous corridor monitoring from dispatch to delivery',
    ],
    idealFor: 'Full container loads, raw material deliveries, distributor stock transfers, and bulk finished goods.',
  },
  {
    number: '02',
    title: 'B2B Industrial & Bulk Cargo Logistics',
    description: 'Heavy-duty transport solutions tailored for manufacturing plants, steel processors, fabrication yards, chemical producers, and industrial equipment makers.',
    image: '/gallery/Picture3.png',
    badge: 'Heavy Industrial',
    capabilities: [
      'Multi-axle chassis and flatbed trailers for heavy tonnage',
      'Heavy-duty securing, lashing, and waterproof tarpaulin covers',
      'Compliance with factory loading and unloading safety standards',
      'Commercial documentation, weighbridge slips & E-Way bill checks',
    ],
    idealFor: 'Machinery, structural steel, coils, auto components, capital goods, and packaged industrial materials.',
  },
  {
    number: '03',
    title: 'Dedicated Contract Fleet Partnerships',
    description: 'Long-term corporate transport agreements providing committed vehicle availability, guaranteed monthly capacities, and predictable corridor pricing.',
    image: '/gallery/Picture4.png',
    badge: 'Enterprise SLA',
    capabilities: [
      'Reserved fleet allocated to your primary supply lanes',
      'Customized KPI reporting (on-time departure, transit SLA, dwell times)',
      'Dedicated account manager acting as your transport coordinator',
      'Transparent monthly consolidated billing with audit trails',
    ],
    idealFor: 'Enterprises needing reliable daily or weekly lane capacity between factories, warehouses, and distribution centers.',
  },
  {
    number: '04',
    title: 'Express Highway Transit & Urgent Dispatch',
    description: 'Time-critical commercial road freight for production-line stoppages, emergency spares, or tight contract fulfillment deadlines requiring expedited transit.',
    image: '/gallery/Picture8.jpg',
    badge: 'Time-Definite',
    capabilities: [
      'Priority vehicle placement within 2 to 4 hours of confirmation',
      'Dual-driver relay option for non-stop interstate haulage',
      'Proactive route bypass planning around toll and city congestion',
      'Hourly transit milestone check-ins with client logistics desks',
    ],
    idealFor: 'Critical plant machinery breakdowns, project-deadline shipments, and peak-season commercial fulfillment.',
  },
];

const vehicleSpecs = [
  {
    type: '14ft / 17ft Closed Container',
    payload: '3.5 - 6.0 Metric Tons',
    volume: '800 - 1,100 Cu. Ft.',
    body: 'Closed Weatherproof Container',
    bestFor: 'FMCG, Pharmaceuticals, Cartons, Consumer Goods, Electronics',
  },
  {
    type: '19ft / 22ft Open Body Truck',
    payload: '7.5 - 10.0 Metric Tons',
    volume: '1,200 - 1,500 Cu. Ft.',
    body: 'High-Deck Open Body with Tarpaulin',
    bestFor: 'Machinery Components, Agricultural Produce, Plastics, Drums',
  },
  {
    type: '32ft Single Axle (SXL) Container',
    payload: '7.0 - 9.0 Metric Tons',
    volume: '1,800 - 2,000 Cu. Ft. (High Cube)',
    body: 'Closed High-Volume Container',
    bestFor: 'Lightweight Bulk Cargo, Textiles, Automotive Parts, Packaging',
  },
  {
    type: '32ft Multi-Axle (MXL) Container',
    payload: '14.0 - 18.0 Metric Tons',
    volume: '1,850 - 2,100 Cu. Ft.',
    body: 'Heavy Multi-Axle Container',
    bestFor: 'Industrial Steel, Heavy Machinery, Chemical Drums, Industrial Goods',
  },
  {
    type: '40ft Semi-Bed / Flatbed Trailer',
    payload: '25.0 - 32.0 Metric Tons',
    volume: 'Open Bed / High Capacity',
    body: 'Multi-Axle Heavy Trailer',
    bestFor: 'Steel Coils, Structural Beams, Over-Dimensional Cargo, Transformers',
  },
];

const processSteps = [
  {
    step: '01',
    title: 'Route & Load Analysis',
    desc: 'Share your pickup origin, drop destination, cargo weight, and timing. We assess vehicle suitability, toll routes, and lane conditions.',
  },
  {
    step: '02',
    title: 'Vehicle Placement & Verification',
    desc: 'The right commercial vehicle is assigned. Driver credentials, fitness permits, and GPS telemetry are verified before reporting to dock.',
  },
  {
    step: '03',
    title: 'Dispatched Transit & Monitoring',
    desc: 'Your shipment moves with disciplined highway transit. Dedicated operations coordinators oversee checkpoints and milestones.',
  },
  {
    step: '04',
    title: 'Delivery Confirmation & POD',
    desc: 'Safe unloading at destination, physical Proof of Delivery (POD) signed, and electronic confirmation sent to your billing team.',
  },
];

const Services = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <SiteMetadata
        title="Freight Services — Tanish Logistic | FTL, Industrial Cargo & Contract Fleet"
        description="Explore Tanish Logistic's commercial road freight services across India: Full Truckload (FTL), B2B industrial transport, contract fleet logistics, and vehicle sizing guide."
      />

      {/* Enterprise Page Hero */}
      <PublicPageHero
        eyebrow="Commercial Transport Solutions"
        title="Road Freight Services Built Around Real Industrial Movement."
        description="Choose from focused B2B road transport capabilities designed for manufacturing plants, distributors, and logistics partners who require strict SLA accountability."
        primaryLabel="Request Service Quote"
        secondaryHref="/book"
        secondaryLabel="Book Transport Online"
      >
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-6 backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Guaranteed Service Standards</p>
          <div className="mt-4 space-y-3.5 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Full Truckload (FTL) with single-point responsibility</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Dedicated dispatch desk available 24 hours / 7 days</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Vetted commercial drivers with highway expertise</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>GST compliant, E-Way Bill ready, clean transparent invoicing</span>
            </div>
          </div>
        </div>
      </PublicPageHero>

      {/* Detailed Service Offerings (Photographic Splits) */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Core Capabilities
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Tailored road freight for diverse commercial demands.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Every shipment receives the same operational discipline: proper chassis matching, verified driver assignment, and transparent communication.
            </p>
          </div>

          <div className="mt-16 space-y-24">
            {serviceDetails.map((service, idx) => {
              const isEven = idx % 2 === 1;
              return (
                <div
                  key={idx}
                  className={`grid gap-12 lg:grid-cols-2 lg:items-center ${isEven ? 'lg:grid-flow-dense' : ''}`}
                >
                  {/* Photo Column */}
                  <div className={isEven ? 'lg:col-start-2' : ''}>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-xl ring-1 ring-slate-900/10">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 rounded-md bg-slate-900/85 px-3 py-1 text-xs font-bold text-sky-300 backdrop-blur">
                        {service.badge}
                      </div>
                      <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-slate-900/85 p-3.5 text-white backdrop-blur-md">
                        <p className="text-xs font-semibold text-slate-300">Operational Category</p>
                        <p className="text-sm font-bold text-white">{service.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className={isEven ? 'lg:col-start-1' : ''}>
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700 font-extrabold text-sm">
                      {service.number}
                    </div>
                    <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold text-slate-950">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-6 space-y-2.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Key Operational Features:</p>
                      {service.capabilities.map((cap, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-sky-700">Best Suited For:</p>
                      <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {service.idealFor}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3.5">
                      <Button asChild className="h-11 rounded-xl px-6 text-sm font-bold text-white bg-sky-700 hover:bg-sky-800 shadow-sm transition-all duration-200 active:scale-[0.98]">
                        <Link href="/contact" className="inline-flex items-center justify-center whitespace-nowrap">
                          Inquire for Rate
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="h-11 rounded-xl border border-slate-300 px-6 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-all duration-200 active:scale-[0.98]">
                        <Link href="/book" className="inline-flex items-center justify-center whitespace-nowrap">
                          Book This Service
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fleet & Commercial Vehicle Specification Matrix (Minimalist Corporate Table) */}
      <section className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Fleet Sizing Guide
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Commercial vehicle specifications & capacities.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Select the appropriate vehicle configuration based on your cargo tonnage, volumetric cubic capacity, and weatherproofing requirements.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-900">
                    <th className="p-4 sm:p-5 font-bold">Vehicle Configuration</th>
                    <th className="p-4 sm:p-5 font-bold">Rated Payload</th>
                    <th className="p-4 sm:p-5 font-bold">Cubic Volume</th>
                    <th className="p-4 sm:p-5 font-bold">Body Type</th>
                    <th className="p-4 sm:p-5 font-bold">Primary Commercial Cargo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicleSpecs.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-4 sm:p-5 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-sky-700 shrink-0" />
                          <span>{v.type}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 font-semibold text-slate-900 whitespace-nowrap">
                        {v.payload}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600 whitespace-nowrap">
                        {v.volume}
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600 whitespace-nowrap">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {v.body}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-600 text-xs sm:text-sm">
                        {v.bestFor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Operational Dispatch Workflow */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Operational Workflow
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              From quote request to signed delivery receipt.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              A structured 4-step execution model designed to give procurement and plant logistics teams total clarity.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg"
              >
                <div className="text-3xl font-extrabold text-sky-700 tabular-nums">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCta
        eyebrow="Custom Freight Quotations"
        title="Need an optimized movement plan for your next load?"
        description="Share your cargo origin, destination drop point, cargo dimensions, and expected dispatch date. Our operations directors will respond with verified vehicle pricing."
        primaryLabel="Request a Route Quote"
        secondaryLabel="Book Transport Online"
      />
    </div>
  );
};

export default Services;
