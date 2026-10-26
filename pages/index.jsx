import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SiteMetadata } from '@/components/Layout/Metadata';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
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
  Building2,
  Phone,
  Check,
  Sliders,
} from 'lucide-react';
import CountUp from 'react-countup';
import { motion, useReducedMotion } from 'framer-motion';
import { BentoGrid } from '@/components/Animations/BentoGrid';
import { ProcessDraw } from '@/components/Animations/ProcessDraw';
import { ClickSuccessButton } from '@/components/Animations/ClickSuccessButton';
import { BlurFade } from '@/components/magicui/blur-fade';
import { Marquee } from '@/components/magicui/marquee';
import { BorderBeam } from '@/components/magicui/border-beam';
import { DotPattern } from '@/components/magicui/dot-pattern';
import { mockFaqs } from '../src/faq';
import { useSettings } from '@/lib/SettingsContext';

const heroContent = [
  {
    video: '/hero-videos/mixkit-52428-video-52428-full-hd.mp4',
    poster: '/hero-posters/mixkit-52428-video-52428-full-hd.jpg',
    title: 'Road Freight Built for Serious Business',
  },
  {
    video: '/hero-videos/mixkit-cars-and-trucks-crossing-on-a-highway-in-nature-44284-full-hd.mp4',
    poster: '/hero-posters/mixkit-cars-and-trucks-crossing-on-a-highway-in-nature-44284-full-hd.jpg',
    title: 'Dependable Movement Across India',
  },
  {
    video: '/hero-videos/mixkit-large-truck-driving-along-a-rural-highway-45488-hd-ready.mp4',
    poster: '/hero-posters/mixkit-large-truck-driving-along-a-rural-highway-45488-hd-ready.jpg',
    title: 'Your Cargo, Handled with Discipline',
  },
  {
    video: '/hero-videos/mixkit-various-vehicles-traverse-the-asphalt-highway-beside-the-breathtaking-desert-52014-full-hd.mp4',
    poster: '/hero-posters/mixkit-various-vehicles-traverse-the-asphalt-highway-beside-the-breathtaking-desert-52014-full-hd.jpg',
    title: 'Pan-India Coverage, Every Route',
  },
];

const stats = [
  { value: 5, suffix: '+', label: 'Years Moving Freight', sub: 'Proven commercial track record' },
  { value: 100, suffix: '+', label: 'Cities & Hubs Connected', sub: 'Across major industrial belts' },
  { value: 1000, suffix: '+', label: 'Corporate Clients', sub: 'Manufacturers & distributors' },
  { value: 98, suffix: '.2%', label: 'On-Time SLA Delivery', sub: 'Disciplined road transit' },
];

const serviceHighlights = [
  {
    title: 'Full Truck Load (FTL)',
    description: 'Dedicated commercial vehicles for bulk manufacturing, distribution, and heavy industrial shipments.',
    icon: Truck,
    badge: 'Dedicated Fleet',
    features: ['Single-point loading & unloading', 'Vehicle sizing for exact load', 'Direct non-stop highway transit'],
    href: '/services',
  },
  {
    title: 'B2B Industrial Cargo',
    description: 'Scheduled freight coordination for factories, raw material suppliers, packaging, and commercial goods.',
    icon: Warehouse,
    badge: 'Industrial Movement',
    features: ['Tarpaulin & closed container security', 'Material safety handling protocols', 'Commercial documentation ready'],
    href: '/services',
  },
  {
    title: 'Interstate Highway Freight',
    description: 'Connecting western manufacturing corridors (Gujarat, Maharashtra) to northern consumer markets (NCR, Punjab).',
    icon: Route,
    badge: 'Major Corridors',
    features: ['Daily scheduled departures', 'Toll & route optimization', 'Dedicated corridor tracking'],
    href: '/services',
  },
  {
    title: 'Contract Logistics Partnerships',
    description: 'Long-term corporate transport agreements with committed vehicle availability and predictable lane pricing.',
    icon: ShieldCheck,
    badge: 'Enterprise SLA',
    features: ['Dedicated account manager', 'Guaranteed monthly vehicle quota', 'Consolidated monthly billing'],
    href: '/services',
  },
];

const servedCities = [
  'Vadodara',
  'Ahmedabad',
  'Surat',
  'Mumbai',
  'Pune',
  'Delhi NCR',
  'Gurugram',
  'Mandi Gobindgarh',
  'Ludhiana',
  'Jaipur',
  'Indore',
  'Bhopal',
  'Nagpur',
  'Nashik',
  'Kanpur',
  'Lucknow',
  'Kolkata',
  'Hyderabad',
  'Bengaluru',
  'Chennai',
];

const majorCorridors = [
  {
    corridor: 'Vadodara (Gujarat) ↔ Mandi Gobindgarh (Punjab)',
    distance: '1,280 km',
    duration: '36 - 44 hrs',
    cargo: 'Steel, Heavy Industrial Machinery, Equipment',
    frequency: 'Daily Dispatches',
    image: '/gallery/Picture1.jpg',
    status: 'High Volume Lane',
  },
  {
    corridor: 'Ahmedabad / Surat ↔ Delhi NCR Belts',
    distance: '950 km',
    duration: '28 - 34 hrs',
    cargo: 'Textiles, Chemicals, FMCG & Consumer Goods',
    frequency: 'Daily Dispatches',
    image: '/gallery/Picture8.jpg',
    status: 'Express Highway Route',
  },
  {
    corridor: 'Mumbai / Pune ↔ Central India & Indore',
    distance: '580 km',
    duration: '18 - 22 hrs',
    cargo: 'Automotive Parts, Engineering Goods, Packaging',
    frequency: 'Scheduled Multi-Axle',
    image: '/gallery/Picture10.jpg',
    status: 'Direct Route',
  },
];

const comparisonPoints = [
  {
    feature: 'Corridor Route Planning',
    tanish: 'Route-first planning with verified toll & road condition checks',
    traditional: 'Unplanned transit with frequent unnotified halts',
  },
  {
    feature: 'Driver Verification & Vetting',
    tanish: 'Commercial license verified, background vetted, disciplined driving hours',
    traditional: 'Casual subcontracted drivers with varied accountability',
  },
  {
    feature: 'Transit Visibility & Support',
    tanish: '24/7 dedicated dispatch desk with live corridor updates',
    traditional: 'Difficult to reach during transit, updates only after delay',
  },
  {
    feature: 'Pricing & Invoicing',
    tanish: 'Transparent quotation upfront, GST compliant, zero surprise charges',
    traditional: 'Hidden detention fees, unexpected loading surcharges',
  },
  {
    feature: 'SLA & On-Time Guarantee',
    tanish: '98.2% on-time delivery commitment with proactive delay mitigation',
    traditional: 'No firm ETA guarantee, frequent delivery rollover',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
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

  // Play only the active hero video; keep others paused (but buffered).
  const heroVideoRefs = React.useRef([]);

  React.useEffect(() => {
    heroVideoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === currentHeroIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [currentHeroIndex, shouldReduceMotion]);

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <SiteMetadata
        title="Tanish Logistic — Reliable Pan-India B2B Road Freight & Transport"
        description="Tanish Logistic delivers dependable B2B road freight across India. Full truckload (FTL), dedicated corporate fleet, and scheduled industrial movement connecting major corridors."
      />

      {/* Hero Section with Video Background */}
      <section
        className="relative isolate min-h-[calc(100dvh-5rem)] overflow-hidden bg-slate-950 text-white"
        onFocus={() => setIsPaused(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(Boolean(shouldReduceMotion))}
      >
        <div className="absolute inset-0 z-0 isolate">
          {shouldReduceMotion ? (
            <Image
              src={heroContent[0].poster}
              alt="Tanish Logistic fleet on road"
              fill
              priority
              sizes="100vw"
              className="object-cover"
              quality={85}
            />
            ) : (
              heroContent.map((content, idx) => {
                const isActive = idx === currentHeroIndex;
                return (
                  <motion.video
                    key={content.video}
                    ref={(el) => {
                      heroVideoRefs.current[idx] = el;
                    }}
                    src={content.video}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 h-full w-full object-cover"
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{
                      duration: 0.7,
                      ease: 'easeOut',
                      // Outgoing video stays fully visible while the incoming
                      // one (on top, higher z-index) fades over it — then it
                      // fades out hidden underneath. No empty gap, ever.
                      delay: isActive ? 0 : 0.7,
                    }}
                    style={{ zIndex: isActive ? 2 : 1 }}
                    aria-hidden="true"
                  />
                );
              })
            )}
          {/*
              Readability gradient: dark only behind the left text column,
              fading out so the video stays vivid like the reference design.
            */}
            <div
              className="absolute inset-0 z-10 bg-gradient-to-r from-slate-950/75 via-slate-950/25 to-transparent"
              aria-hidden="true"
            />
          <div className="absolute inset-x-0 bottom-0 z-10 h-44 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent" aria-hidden="true" />
        </div>

        <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl items-center px-4 pt-28 pb-16 sm:px-6 sm:pt-36 sm:pb-24 lg:px-8">
          {/* Hero Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl drop-shadow-[0_2px_14px_rgba(2,6,23,0.85)]"
          >
<motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-200 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {slogan}
            </motion.div>


            <motion.h1
              className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.75rem] lg:leading-[1.12]"
            >
              {heroContent[currentHeroIndex].title}
            </motion.h1>

            <motion.p
              className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              Scheduled Full Truckload (FTL), dedicated corporate fleet, and industrial freight transit connecting India&apos;s primary commercial corridors with route discipline and guaranteed SLAs.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="group relative h-12 rounded-xl px-7 text-sm sm:text-base font-bold text-white shadow-lg shadow-sky-950/50 hover:shadow-xl hover:shadow-sky-900/60 border border-white/20 transition-all duration-200 active:scale-[0.98]"
                style={{ backgroundColor: primaryColor }}
              >
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                  <span>Get Freight Quote</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border border-slate-700/80 bg-slate-900/80 px-6 text-sm sm:text-base font-semibold text-slate-100 shadow-sm backdrop-blur-sm hover:border-slate-500 hover:bg-slate-800 hover:text-white transition-all duration-200 active:scale-[0.98]"
              >
                <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap">
                  Explore Capabilities
                </Link>
              </Button>
            </motion.div>

            {/* Quick Hero Badges */}
            <motion.div
              variants={itemVariants}
              className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs"
            >
              <div>
                <p className="font-extrabold text-white text-sm">98.2%</p>
                <p className="text-slate-400 mt-0.5">On-Time SLA</p>
              </div>
              <div>
                <p className="font-extrabold text-white text-sm">100+ Hubs</p>
                <p className="text-slate-400 mt-0.5">Pan-India Reach</p>
              </div>
              <div>
                <p className="font-extrabold text-white text-sm">24/7 Desk</p>
                <p className="text-slate-400 mt-0.5">Active Transit Support</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Discreet Video Pause/Play Control in Bottom Right */}
          <button
            type="button"
            onClick={() => setIsPaused((paused) => !paused)}
            className="absolute bottom-8 right-6 sm:right-8 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-900/60 text-white backdrop-blur transition hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label={isPaused ? 'Resume video rotation' : 'Pause video rotation'}
          >
            {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>
      </section>

      {/* Pan-India Coverage Marquee */}
      <section
        aria-label="Cities and industrial hubs served"
        className="border-y border-slate-800 bg-slate-950 py-4"
      >
        <p className="sr-only">
          Serving 100+ cities and industrial hubs across India, including
          Vadodara, Ahmedabad, Surat, Mumbai, Pune, Delhi NCR and Mandi
          Gobindgarh.
        </p>
        <Marquee aria-hidden="true" pauseOnHover className="[--duration:50s]">
          {servedCities.map((city) => (
            <span
              key={city}
              className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold tracking-wide text-slate-400"
            >
              <MapPin className="h-3.5 w-3.5 text-sky-500" />
              {city}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Metrics & Operational Track Record */}
      <section className="border-b border-slate-200/80 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
            {stats.map((stat, idx) => (
              <BlurFade key={stat.label} inView delay={idx * 0.08} className="relative pl-6 border-l-2 border-sky-600">
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 tabular-nums">
                  <CountUp end={stat.value} duration={2} enableScrollSpy={!shouldReduceMotion} />
                  <span>{stat.suffix}</span>
                </div>
                <p className="mt-2 text-sm sm:text-base font-bold text-slate-900">{stat.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{stat.sub}</p>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Photographic Split Section: Built on Road Discipline */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Editorial Content Column */}
            <div>
              <BlurFade inView>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
                  Operational Discipline
                </span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl lg:leading-tight">
                  Engineering road freight for high-value Indian supply chains.
                </h2>
                <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
                  At Tanish Logistic, we operate with a simple premise: commercial transport succeeds on route planning, vehicle fit, driver integrity, and transparent communication before wheels start turning.
                </p>
              </BlurFade>

              <div className="mt-8 space-y-4">
                <BlurFade inView delay={0.1} className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700 font-bold text-xs mt-0.5">
                    01
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Right Vehicle Matching</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      We match your exact cargo weight, dimensions, and fragility to the proper chassis and axle rating — eliminating over-capacity risks or under-utilized space.
                    </p>
                  </div>
                </BlurFade>

                <BlurFade inView delay={0.18} className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700 font-bold text-xs mt-0.5">
                    02
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Verified Driver & Fleet Integrity</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      Every commercial driver is verified with background credentials, commercial driving permits, and adherence to safe highway transit hours.
                    </p>
                  </div>
                </BlurFade>

                <BlurFade inView delay={0.26} className="flex items-start gap-3.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-sky-100 text-sky-700 font-bold text-xs mt-0.5">
                    03
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Single Point of Dispatch Coordination</h3>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      No chasing multiple brokers. A dedicated operations manager coordinates pickup, toll corridors, highway status, and delivery confirmation.
                    </p>
                  </div>
                </BlurFade>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button asChild className="h-11 rounded-xl px-6 text-sm font-bold text-white shadow-sm transition-all duration-200 active:scale-[0.98]" style={{ backgroundColor: primaryColor }}>
                  <Link href="/about" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <span>Our Story & Mission</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-11 rounded-xl border border-slate-300 px-6 text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-all duration-200 active:scale-[0.98]">
                  <Link href="/whyus" className="inline-flex items-center justify-center whitespace-nowrap">Why Choose Us</Link>
                </Button>
              </div>
            </div>

            {/* Photographic Right Column */}
            <BlurFade inView delay={0.15} className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-200 shadow-xl ring-1 ring-slate-900/10">
                <Image
                  src="/gallery/Picture1.jpg"
                  alt="Tanish Logistic commercial truck moving on highway"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                
                {/* Floating Image Badge */}
                <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/20 bg-slate-900/85 p-4 text-white backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Truck className="h-5 w-5 text-sky-400" />
                      <div>
                        <p className="text-xs text-slate-300">Active Freight Asset</p>
                        <p className="text-sm font-bold text-white">Commercial Long-Haul Carrier</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                      GPS Monitored
                    </span>
                  </div>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Core Logistics Capabilities Bento Grid */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlurFade inView className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              Service Capabilities
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Commercial road freight solutions built for predictable supply chains.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Each capability is designed around the real demands of plant managers, logistics directors, and procurement teams.
            </p>
          </BlurFade>

          <BentoGrid
            items={serviceHighlights.map((service, index) => ({
              id: service.title,
              icon: service.icon,
              title: service.title,
              description: service.description,
              features: service.features,
              colSpan: index % 3 === 0 ? 2 : 1,
            }))}
          />
        </div>
      </section>

      {/* Strategic Corridor Showcase with Real Photography */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <BlurFade inView className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
                Highway Corridors
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                High-frequency freight routes connecting major manufacturing hubs.
              </h2>
            </BlurFade>
            <BlurFade inView delay={0.1}>
              <Button asChild variant="outline" className="h-11 rounded-lg border-slate-300 font-bold text-slate-800 hover:bg-white shrink-0">
                <Link href="/contact">Inquire for Custom Lane</Link>
              </Button>
            </BlurFade>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {majorCorridors.map((lane, idx) => (
              <BlurFade
                key={idx}
                inView
                delay={idx * 0.1}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <Image
                    src={lane.image}
                    alt={lane.corridor}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                    {lane.status}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-950 leading-snug">
                    {lane.corridor}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-xs">
                    <div>
                      <p className="text-slate-500">Route Distance</p>
                      <p className="font-bold text-slate-900">{lane.distance}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Expected SLA</p>
                      <p className="font-bold text-slate-900">{lane.duration}</p>
                    </div>
                  </div>

                  <div className="mt-4 text-xs text-slate-600">
                    <p><strong className="text-slate-800">Typical Cargo:</strong> {lane.cargo}</p>
                    <p className="mt-1"><strong className="text-slate-800">Frequency:</strong> {lane.frequency}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href="/book"
                      className="text-xs font-bold text-sky-700 hover:text-sky-800 inline-flex items-center gap-1"
                    >
                      <span>Book Shipment on Lane</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Comparison Table */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <BlurFade inView className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
              The Tanish Difference
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Why commercial supply chains choose us over unorganized transport.
            </h2>
            <p className="mt-4 text-base text-slate-600">
              Reliable freight is built on institutional accountability, clear contracts, and verified transport assets.
            </p>
          </BlurFade>

          <BlurFade inView delay={0.12} className="mt-14 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-900">
                    <th className="p-4 sm:p-5 font-bold w-1/3">Key Operational Feature</th>
                    <th className="p-4 sm:p-5 font-bold w-1/3 bg-sky-50 text-sky-950 border-x border-sky-100">
                      Tanish Logistic Standard
                    </th>
                    <th className="p-4 sm:p-5 font-bold w-1/3 text-slate-500">
                      Traditional Unorganized Transporter
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonPoints.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 sm:p-5 font-bold text-slate-900">
                        {row.feature}
                      </td>
                      <td className="p-4 sm:p-5 bg-sky-50/50 border-x border-sky-100/70 text-slate-900 font-medium">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{row.tanish}</span>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 text-slate-500">
                        {row.traditional}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 sm:py-28 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <BlurFade inView>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-700">
                Frequently Asked Questions
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Clear expectations before the first shipment.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Have questions about billing, load capacity, transit times, or vehicle booking? Here are answers to what clients ask most frequently.
              </p>
              <div className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-slate-900">Need specific custom route pricing?</p>
                <p className="mt-1 text-xs text-slate-600">Our operations team provides direct quotes within hours.</p>
                <Button asChild size="sm" className="mt-4 rounded-md font-bold text-white" style={{ backgroundColor: primaryColor }}>
                  <Link href="/contact">Contact Dispatch Office</Link>
                </Button>
              </div>
            </BlurFade>

            <BlurFade inView delay={0.12}>
              <Accordion type="single" collapsible className="w-full rounded-2xl border border-slate-200 bg-white px-6 shadow-sm">
              {mockFaqs.slice(0, 6).map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`} className="border-slate-100 py-2">
                  <AccordionTrigger className="text-left text-base font-bold text-slate-950 hover:text-sky-700">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
              </Accordion>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Final Conversion CTA */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <DotPattern
          width={22}
          height={22}
          cr={1.2}
          className="text-sky-400/25 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_78%)]"
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <BlurFade inView>
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 px-6 py-12 text-center shadow-2xl backdrop-blur-sm sm:px-12 sm:py-16">
              <BorderBeam
                size={90}
                duration={9}
                borderWidth={1.5}
                colorFrom={primaryColor}
                colorTo="#22d3ee"
              />
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to move your next shipment?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                Get a transparent, GST-compliant quotation for your lane — or talk
                to our 24/7 dispatch desk for scheduled and contract freight.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="group h-12 rounded-xl px-7 text-sm sm:text-base font-bold text-white shadow-lg shadow-sky-950/50 transition-all duration-200 active:scale-[0.98]"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <span>Get Freight Quote</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border border-slate-700 bg-slate-900/80 px-6 text-sm sm:text-base font-semibold text-slate-100 backdrop-blur-sm transition-all duration-200 hover:border-slate-500 hover:bg-slate-800 hover:text-white active:scale-[0.98]"
                >
                  <Link href="/book" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                    <Truck className="h-4 w-4" />
                    <span>Book a Shipment</span>
                  </Link>
                </Button>
              </div>
              <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
                98.2% On-Time SLA &middot; 100+ Hubs &middot; Daily Departures
              </p>
            </div>
          </BlurFade>
        </div>
      </section>

    </div>
  );
};

export default Home;
