import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Gauge,
  MapPin,
  Navigation,
  PackageCheck,
  Pause,
  Play,
  Route,
  ShieldCheck,
  Truck,
  Warehouse,
} from 'lucide-react';
import CountUp from 'react-countup';
import { motion, useReducedMotion } from 'framer-motion';
import { mockFaqs } from '../src/faq';
import { useSettings } from '@/lib/SettingsContext';

const heroContent = [
  {
    video: '/hero-videos/mixkit-52428-video-52428-full-hd.mp4',
    title: 'Road freight built for serious business',
  },
  {
    video: '/hero-videos/mixkit-cars-and-trucks-crossing-on-a-highway-in-nature-44284-full-hd.mp4',
    title: 'Dependable movement across India',
  },
  {
    video: '/hero-videos/mixkit-large-truck-driving-along-a-rural-highway-45488-hd-ready.mp4',
    title: 'Your cargo, handled with discipline',
  },
];

const stats = [
  { value: 5, suffix: '+', label: 'Years moving freight' },
  { value: 100, suffix: '+', label: 'Cities covered' },
  { value: 1000, suffix: '+', label: 'Clients supported' },
  { value: 98, suffix: '%', label: 'On-time delivery' },
];

const heroSignals = [
  { label: 'ETA discipline', value: '98% on-time' },
  { label: 'Primary lanes', value: 'North + West' },
  { label: 'Quote mode', value: 'Route-first' },
];

const serviceHighlights = [
  {
    title: 'Full truck load',
    description: 'Dedicated vehicles for production, distribution, and industrial shipments.',
    icon: Truck,
  },
  {
    title: 'Route planning',
    description: 'Practical road-route coordination for predictable ETAs and fewer handoffs.',
    icon: Route,
  },
  {
    title: 'Warehouse support',
    description: 'Pickup and dispatch workflows that stay aligned with your operating rhythm.',
    icon: Warehouse,
  },
  {
    title: 'Reliable updates',
    description: 'Clear communication from booking to delivery, so teams can plan ahead.',
    icon: ShieldCheck,
  },
];

const routeSteps = [
  { label: 'Request', detail: 'Pickup, drop, load type', icon: PackageCheck },
  { label: 'Match', detail: 'Vehicle and lane planning', icon: Navigation },
  { label: 'Move', detail: 'Dispatch with route updates', icon: Truck },
  { label: 'Deliver', detail: 'Proof and closure', icon: BadgeCheck },
];

const laneMetrics = [
  { label: 'Active route lanes', value: '24', sub: 'monitored corridors' },
  { label: 'Dispatch window', value: '2h', sub: 'typical coordination' },
  { label: 'Industrial focus', value: 'B2B', sub: 'factory to destination' },
];

const hubStations = [
  { name: 'Mumbai', region: 'Maharashtra', image: 'https://images.pexels.com/photos/2234638/pexels-photo-2234638.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Main western hub for manufacturing, port, and FMCG freight.' },
  { name: 'Delhi NCR', region: 'North India', image: 'https://images.pexels.com/photos/931007/pexels-photo-931007.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Capital-region access for high-volume commercial lanes.' },
  { name: 'Bengaluru', region: 'Karnataka', image: 'https://images.pexels.com/photos/38326/pexels-photo-38326.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Southern network support for technology and industrial clients.' },
  { name: 'Jaipur', region: 'Rajasthan', image: 'https://images.pexels.com/photos/1007427/pexels-photo-1007427.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Strategic western route coverage for regional movement.' },
  { name: 'Kolkata', region: 'West Bengal', image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Eastern corridor access for distribution and port-linked freight.' },
  { name: 'Chennai', region: 'Tamil Nadu', image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop', description: 'Gateway to southern ports, factories, and industrial belts.' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const Home = () => {
  const settings = useSettings();
  const shouldReduceMotion = useReducedMotion();
  const siteName = settings.siteName || 'Tanish Logistic';
  const slogan = settings.slogan || 'Driven by Trust, Powered by Roads';
  const primaryColor = settings.primaryColor || '#0369A1';
  const [currentHeroIndex, setCurrentHeroIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(Boolean(shouldReduceMotion));

  React.useEffect(() => {
    if (isPaused || shouldReduceMotion) return undefined;

    const interval = setInterval(() => {
      setCurrentHeroIndex((prevIndex) => (prevIndex + 1) % heroContent.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, shouldReduceMotion]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <section
        className="relative isolate min-h-[calc(100dvh-5rem)] overflow-hidden bg-slate-950 text-white"
        onFocus={() => setIsPaused(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(Boolean(shouldReduceMotion))}
      >
        <div className="absolute inset-0">
          {heroContent.map((content, index) => (
            <motion.video
              key={content.video}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{
                opacity: index === currentHeroIndex ? 1 : 0,
                scale: index === currentHeroIndex ? 1 : 1.02,
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: 'easeOut' }}
              aria-hidden="true"
            >
              <source src={content.video} type="video/mp4" />
            </motion.video>
          ))}
          <div className="absolute inset-0 bg-slate-950/72" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100dvh-5rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={itemVariants} className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-sky-100 backdrop-blur">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {slogan}
            </motion.div>
            <motion.h1 variants={itemVariants} className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {heroContent[currentHeroIndex].title}
            </motion.h1>
            <motion.p variants={itemVariants} className="mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              Reliable B2B transport for manufacturers, distributors, and growing teams that need shipments coordinated with care across Indian road networks.
            </motion.p>
            <motion.div variants={itemVariants} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-md px-6 text-base font-bold text-white shadow-xl shadow-sky-950/30" style={{ backgroundColor: primaryColor }}>
                <Link href="/contact">
                  Get a freight quote
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-white/70 bg-white/10 px-6 text-base font-bold text-white backdrop-blur hover:bg-white hover:text-slate-950">
                <Link href="/services">View services</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl shadow-slate-950/40 backdrop-blur-md sm:p-6"
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.16)_0,rgba(255,255,255,0)_42%)]" />
            <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-sky-200/70 to-transparent" />
            <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-sky-100">Live operations focus</p>
                <h2 className="mt-2 text-2xl font-bold">Built around timing, routes, and accountability.</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsPaused((paused) => !paused)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                aria-label={isPaused ? 'Resume hero videos' : 'Pause hero videos'}
                aria-pressed={isPaused}
              >
                {isPaused ? <Play className="h-5 w-5" aria-hidden="true" /> : <Pause className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
            <div className="mt-6 rounded-lg border border-white/12 bg-slate-950/35 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sky-400/15 text-sky-200">
                    <Activity className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">Lane status</p>
                    <p className="text-base font-extrabold text-white">Vadodara to NCR</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">On schedule</span>
              </div>
              <div className="mt-5 grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-2 text-xs font-bold text-slate-300">
                <span className="h-3 w-3 rounded-full bg-sky-300" />
                <span className="h-px bg-gradient-to-r from-sky-300 to-white/25" />
                <span className="h-3 w-3 rounded-full bg-white" />
                <span className="h-px bg-gradient-to-r from-white/25 to-emerald-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-300" />
              </div>
              <div className="mt-3 grid grid-cols-3 text-xs font-semibold text-slate-300">
                <span>Booked</span>
                <span className="text-center">In transit</span>
                <span className="text-right">Delivery</span>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ['Primary lanes', 'Punjab, Gujarat, Maharashtra, NCR'],
                ['Best fit', 'B2B freight and industrial movement'],
                ['Communication', 'Booking-to-delivery coordination'],
                ['Response', 'Quote-first support for new routes'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-white/12 bg-slate-950/25 p-4">
                  <p className="text-sm font-medium text-slate-300">{label}</p>
                  <p className="mt-2 text-base font-bold leading-6 text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {heroSignals.map((signal) => (
                <div key={signal.label} className="rounded-md bg-white/10 p-3">
                  <p className="text-xs font-semibold text-slate-300">{signal.label}</p>
                  <p className="mt-1 text-sm font-extrabold text-white">{signal.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 px-px md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white px-4 py-6 text-center sm:px-6">
              <div className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
                <CountUp end={stat.value} duration={2.2} enableScrollSpy={!shouldReduceMotion} />
                {stat.suffix}
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-600 sm:text-base">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 py-16 text-white sm:py-20">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(148,163,184,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.2)_1px,transparent_1px)] [background-size:48px_48px]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-sky-300">Route intelligence</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">A command-center feel for freight decisions.</h2>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
                The new experience shows buyers that the team thinks in routes, timing, vehicle fit, and delivery confidence before a shipment moves.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {laneMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur">
                    <p className="text-3xl font-extrabold text-white">{metric.value}</p>
                    <p className="mt-1 text-sm font-bold text-sky-200">{metric.label}</p>
                    <p className="mt-2 text-xs font-medium text-slate-400">{metric.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[460px] overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur">
              <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,rgba(125,211,252,0.13)_1px,transparent_1px)] [background-size:28px_28px]" aria-hidden="true" />
              <div className="relative flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Network view</p>
                  <h3 className="mt-1 text-xl font-extrabold">Western corridor dispatch</h3>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-400/15 text-emerald-200">
                  <Gauge className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>

              <div className="relative mt-8 h-64 rounded-lg border border-white/10 bg-slate-950/40">
                <div className="absolute left-[12%] top-[64%] h-4 w-4 rounded-full bg-sky-300 shadow-[0_0_24px_rgba(125,211,252,0.9)]" />
                <div className="absolute left-[37%] top-[42%] h-4 w-4 rounded-full bg-white shadow-[0_0_22px_rgba(255,255,255,0.75)]" />
                <div className="absolute left-[68%] top-[24%] h-4 w-4 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.9)]" />
                <div className="absolute left-[79%] top-[58%] h-4 w-4 rounded-full bg-amber-300 shadow-[0_0_24px_rgba(252,211,77,0.8)]" />
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 260" role="img" aria-label="Stylized logistics route map">
                  <path d="M72 172 C180 112 214 118 282 114 C382 108 405 44 532 64" fill="none" stroke="rgba(125,211,252,0.6)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 10" />
                  <path d="M282 114 C366 142 414 182 544 152" fill="none" stroke="rgba(251,191,36,0.58)" strokeWidth="3" strokeLinecap="round" strokeDasharray="8 10" />
                </svg>
                {!shouldReduceMotion && (
                  <>
                    <motion.div
                      className="absolute left-[12%] top-[64%] h-2.5 w-2.5 rounded-full bg-white"
                      animate={{ x: [0, 165, 365, 455], y: [0, -76, -126, -108], opacity: [0, 1, 1, 0] }}
                      transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="absolute left-[37%] top-[42%] h-2.5 w-2.5 rounded-full bg-amber-100"
                      animate={{ x: [0, 95, 210], y: [0, 52, 38], opacity: [0, 1, 0] }}
                      transition={{ duration: 4.2, repeat: Infinity, delay: 0.8, ease: 'easeInOut' }}
                    />
                  </>
                )}
                <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-3">
                  {['Pickup verified', 'Vehicle assigned', 'ETA tracking'].map((label) => (
                    <div key={label} className="rounded-md border border-white/10 bg-slate-950/70 px-3 py-2 text-xs font-bold text-slate-200 backdrop-blur">
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-5 grid gap-3 sm:grid-cols-4">
                {routeSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: shouldReduceMotion ? 0 : 0.35, delay: shouldReduceMotion ? 0 : index * 0.05 }}
                      className="rounded-lg border border-white/10 bg-white/5 p-3"
                    >
                      <Icon className="h-5 w-5 text-sky-200" aria-hidden="true" />
                      <p className="mt-3 text-sm font-extrabold text-white">{step.label}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-400">{step.detail}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-sky-700">What we manage</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-normal text-slate-950 sm:text-4xl">Freight workflows that stay practical on Indian roads.</h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                The experience is built for buyers who need clarity before they book: what can move, where it can move, and how the team will stay informed.
              </p>
              <Button asChild className="mt-7 h-11 rounded-md px-5 font-bold" style={{ backgroundColor: primaryColor }}>
                <Link href="/book">
                  Start a booking
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {serviceHighlights.map((service) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.title}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-80px' }}
                    className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-slate-950">{service.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-sky-700">Coverage network</p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">Major hubs, connected by road discipline.</h2>
            </div>
            <Button asChild variant="outline" className="h-11 rounded-md border-slate-300 px-5 font-bold text-slate-800 hover:bg-slate-100">
              <Link href="/industries">Explore industries</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hubStations.map((hub) => (
              <article key={`${hub.name}-${hub.region}`} className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={hub.image}
                    alt={`${hub.name} logistics hub`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-sky-700" aria-hidden="true" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">{hub.name}</h3>
                      <p className="text-sm font-semibold text-slate-500">{hub.region}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{hub.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-sky-700">Common questions</p>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">Answers before the first call.</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Clear expectations make logistics easier. These are the questions clients usually ask before booking with {siteName}.
            </p>
          </div>
          <Accordion type="single" collapsible className="w-full rounded-lg border border-slate-200 bg-white px-5 shadow-sm">
            {mockFaqs.slice(0, 6).map((faq, index) => (
              <AccordionItem key={faq.question} value={`item-${index}`} className="border-slate-200">
                <AccordionTrigger className="text-left text-base font-bold text-slate-950 hover:text-sky-700">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-7 text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="bg-slate-950 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-sky-500/15 text-sky-200">
              <Clock3 className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">Need a dependable route for your next shipment?</h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
              Share pickup, drop, load type, and timing. The team will help you find the right movement plan.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <Button asChild size="lg" className="h-12 rounded-md px-6 font-bold text-white" style={{ backgroundColor: primaryColor }}>
              <Link href="/contact">
                Request quote
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-md border-white/30 bg-white/5 px-6 font-bold text-white hover:bg-white hover:text-slate-950">
              <Link href="/services">Compare services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
