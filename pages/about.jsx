import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Users, Award, Target, CheckCircle2, ArrowRight, ShieldCheck, MapPin, Building2, Clock, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { SiteMetadata } from '@/components/Layout/Metadata';
import { ProcessDraw } from '@/components/animations/ProcessDraw';
import { PublicPageHero, FinalCta } from '@/components/Layout/PublicPage';

const stats = [
  { number: "5+", label: "Years of Operation", sub: "Commercial road freight" },
  { number: "100+", label: "Cities & Industrial Hubs", sub: "Pan-India connectivity" },
  { number: "1,000+", label: "Enterprise Clients", sub: "Repeat commercial shippers" },
  { number: "98.2%", label: "On-Time Delivery SLA", sub: "Strict corridor timing" }
];

const values = [
  {
    icon: ShieldCheck,
    title: "Operational Reliability",
    description: "Every shipment is planned with route verification and vehicle health checks. We commit to promises we can keep, every single haul.",
  },
  {
    icon: Users,
    title: "Dedicated Client Partnership",
    description: "We don't operate as disconnected brokers. Clients have direct access to operations managers who know their routes and cargo profiles intimately.",
  },
  {
    icon: Award,
    title: "Fleet & Driver Integrity",
    description: "All drivers are commercial license holders with extensive highway experience, vetted background credentials, and adherence to safe driving hours.",
  },
  {
    icon: Target,
    title: "Route & Cost Optimization",
    description: "By optimizing toll lanes, highway transit windows, and return loads, we pass predictable, competitive freight pricing to our corporate partners.",
  }
];

const milestones = [
  {
    year: "2023",
    title: "Founding & Western Hub Launch",
    description: "Established operations in Vadodara (Gujarat) with dedicated FTL routes servicing chemical, machinery, and manufacturing clients across the Western industrial belt.",
  },
  {
    year: "2024",
    title: "Punjab Hub & Northern Corridor Expansion",
    description: "Opened our registered head office in Mandi Gobindgarh (Punjab), connecting Gujarat steel and machinery supplies directly to Northern industrial centers.",
  },
  {
    year: "2025",
    title: "Fleet Modernization & GPS Integration",
    description: "Standardized our commercial fleet with 24/7 GPS route monitoring, expanded carrier compliance, and launched our direct corporate booking platform.",
  },
  {
    year: "2026 & Beyond",
    title: "Multi-Corridor Scale & Enterprise SLA",
    description: "Broadening regular multi-axle and trailer capacity across Southern and Central routes while maintaining our signature 98.2% on-time transit record.",
  }
];

const About = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <SiteMetadata
        title="About Tanish Logistic — Road Freight Built on Discipline & Trust"
        description="Learn about Tanish Logistic's founding, mission, operating philosophy, and leadership across India's premier industrial and commercial road corridors."
      />

      {/* Enterprise Page Hero */}
      <PublicPageHero
        eyebrow="Company Overview"
        title="Built on Road Discipline, Proven Across Indian Corridors."
        description="For over 5 years, Tanish Logistic has partnered with manufacturing plants, industrial enterprises, and distributors to deliver reliable, transparent B2B road transport."
        primaryHref="/contact"
        primaryLabel="Partner With Us"
        secondaryHref="/services"
        secondaryLabel="Explore Services"
      >
        <div className="rounded-2xl border border-white/15 bg-slate-900/80 p-6 backdrop-blur-md">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Institutional Profile</p>
          <div className="mt-4 space-y-3.5 text-xs text-slate-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span>Operating Focus</span>
              <strong className="text-white">Full Truckload (FTL) & Commercial B2B</strong>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span>Primary Corridor</span>
              <strong className="text-white">Western & Northern Highways</strong>
            </div>
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <span>Key Operating Hubs</span>
              <strong className="text-white">Vadodara (GJ) & Mandi Gobindgarh (PB)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>Compliance & Safety</span>
              <strong className="text-emerald-400">100% Carrier Vetted & Insured</strong>
            </div>
          </div>
        </div>
      </PublicPageHero>

      {/* Corporate Metrics Bar */}
      <section className="border-b border-slate-200 bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
            {stats.map((stat, idx) => (
              <div key={idx} className="border-l-2 border-sky-700 pl-6">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 tabular-nums">
                  {stat.number}
                </div>
                <p className="mt-1 text-sm sm:text-base font-bold text-slate-900">{stat.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photographic Story Split 1: Our Origins */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Story Text */}
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
                Our Origins
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Born to bring clarity and accountability to Indian road transport.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Founded in 2023, Tanish Logistic began with a straightforward realization: India&apos;s industrial growth depends on road freight, yet manufacturing teams were too often left navigating unreliable brokers, surprise detention charges, and zero shipment visibility.
                </p>
                <p>
                  We set out to build a transport enterprise anchored in discipline. Starting from our strategic hub in Vadodara, Gujarat, we focused on high-demand manufacturing routes where on-time arrival of raw materials, machinery, and finished goods directly dictates plant productivity.
                </p>
                <p>
                  Today, Tanish Logistic manages freight movement for over 1,000 corporate clients across 100+ cities, combining experienced highway logistics with responsive customer communication.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 border border-slate-200">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  GST Registered Carrier
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 border border-slate-200">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  E-Way Bill Compliance
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 border border-slate-200">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Commercial Cargo Insurance
                </span>
              </div>
            </div>

            {/* Photo 1: Fleet in action */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-xl ring-1 ring-slate-900/10">
                <Image
                  src="/gallery/Picture4.png"
                  alt="Fleet of delivery vehicles at logistics center"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-slate-900/85 p-4 text-white backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Tanish Logistic Fleet Division</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-200">Commercial Road Assets &bull; Western Corridor Depot</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photographic Story Split 2: Operational Rigor */}
      <section className="py-20 sm:py-28 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Photo 2: Cargo loading */}
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-xl ring-1 ring-slate-900/10">
                <Image
                  src="/gallery/Picture3.png"
                  alt="Cargo loading operations with safety protocols"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/20 bg-slate-900/85 p-4 text-white backdrop-blur-md">
                  <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Cargo Handling Protocols</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-200">Pre-Dispatch Fastening & Tarpaulin Lashing Inspection</p>
                </div>
              </div>
            </div>

            {/* Text Column */}
            <div className="order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
                Our Operating Standard
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                Safety, vehicle fit, and road discipline before departure.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600">
                <p>
                  Logistics failures rarely happen on open highways; they happen at loading docks due to improper weight estimation, inadequate lashing, or mismatched truck specifications.
                </p>
                <p>
                  Before any Tanish vehicle leaves origin, our operations team verifies axle weight distributions, weatherproofing tarpaulins, driver fit-to-drive checks, and destination contact protocols.
                </p>
                <p>
                  This disciplined workflow is why our damage claims rate is under 0.05% and our repeat client retention rate exceeds 94%.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-2xl font-extrabold text-sky-700">&lt; 0.05%</p>
                  <p className="text-xs font-bold text-slate-900 mt-1">Cargo Incident Rate</p>
                  <p className="text-xs text-slate-500 mt-0.5">Rigorous securing & handling</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-2xl font-extrabold text-sky-700">94%+</p>
                  <p className="text-xs font-bold text-slate-900 mt-1">Client Retention</p>
                  <p className="text-xs text-slate-500 mt-0.5">Repeat corporate freight contracts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Freight Process Flow */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Our Working Process
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              From Quote to Delivery: Disciplined at Every Mile
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Every shipment moves through a standardized operational sequence designed for accountability and reliability.
            </p>
          </div>

          <ProcessDraw
            steps={[
              {
                number: '01',
                title: 'Requirement Capture',
                description: 'We assess cargo dimensions, weight, commodity type, and pickup-drop locations to recommend optimal vehicle type.',
                tag: 'Step 1',
              },
              {
                number: '02',
                title: 'Route Planning',
                description: 'Toll-efficient highway routing with weather and traffic checks, optimized for safe transit timelines.',
                tag: 'Step 2',
              },
              {
                number: '03',
                title: 'Vehicle & Driver Allocation',
                description: 'Commercial license verified drivers assigned to suitable axle-rated trucks with real-time compliance documentation.',
                tag: 'Step 3',
              },
              {
                number: '04',
                title: 'Pickup & Securement',
                description: 'Cargo is loaded with proper lashing, tarpaulin coverage, and weight distribution checks before departure.',
                tag: 'Step 4',
              },
              {
                number: '05',
                title: 'Transit Monitoring',
                description: 'Continuous GPS tracking and corridor monitoring with proactive delay communication to customers.',
                tag: 'Step 5',
              },
              {
                number: '06',
                title: 'Delivery & Sign-off',
                description: 'Timely delivery with photo confirmation, weighbridge verification, and customer sign-off documentation.',
                tag: 'Step 6',
              },
            ]}
          />
        </div>
      </section>
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Guiding Principles
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Principles that guide every kilometer we travel.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              In freight transport, trust is earned shipment by shipment, mile by mile.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg hover:border-slate-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-lg font-bold text-slate-950">
                      {val.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {val.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Corporate Journey Timeline */}
      <section className="py-20 sm:py-28 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Our Journey
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Key milestones in our operational expansion.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Consistent organic growth backed by asset investments, route depth, and satisfied corporate partners.
            </p>
          </div>

          <div className="mt-14 max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] gap-6 items-start rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
                >
                  <div className="border-r border-slate-200 pr-4">
                    <span className="text-2xl sm:text-3xl font-extrabold text-sky-700 tabular-nums">
                      {item.year}
                    </span>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                      Milestone
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCta
        eyebrow="Partner with Tanish Logistic"
        title="Experience dependable road freight for your business."
        description="Connect with our operations directors in Vadodara or Mandi Gobindgarh to review your shipping lanes, vehicle requirements, and pricing models."
        primaryLabel="Contact Our Team"
        secondaryLabel="View Transport Services"
      />
    </div>
  );
};

export default About;
