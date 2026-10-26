import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { SiteMetadata } from '@/components/Layout/Metadata';
import { BlurFade } from '@/components/magicui/blur-fade';
import { BorderBeam } from '@/components/magicui/border-beam';
import { DotPattern } from '@/components/magicui/dot-pattern';
import {
  CheckCircle2,
  PhoneCall,
  Truck,
  PackageCheck,
  ArrowRight,
  Phone,
} from 'lucide-react';

const nextSteps = [
  {
    icon: PhoneCall,
    title: 'Confirmation Call',
    description:
      'A dedicated coordinator verifies cargo fit, vehicle type, and pricing with you — typically within a few business hours.',
  },
  {
    icon: Truck,
    title: 'Vehicle Assignment',
    description:
      'We match your load to the right chassis and axle configuration, lock the lane, and schedule dispatch.',
  },
  {
    icon: PackageCheck,
    title: 'Dispatch & Updates',
    description:
      'You receive dispatch confirmation and corridor updates from our 24/7 desk until delivery is completed.',
  },
];

const ThankYou = () => {
  const router = useRouter();
  const bookingId = router.query?.booking;

  // A thank-you page only makes sense right after a booking submission.
  // If someone lands here without a booking reference (stale tab, direct
  // visit, refresh), send them home instead of an orphaned success screen.
  React.useEffect(() => {
    if (router.isReady && !router.query?.booking) {
      router.replace('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <SiteMetadata
        title="Booking Received — Thank You"
        description="Your freight booking request has been received. Our dispatch desk will confirm your shipment shortly."
      />
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-950 py-20 text-white sm:py-28">
        <DotPattern
          width={22}
          height={22}
          cr={1.2}
          className="text-sky-400/25 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <BlurFade inView>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Booking Submitted Successfully
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Our commercial operations desk has received your dispatch
              request. Please save your booking reference for tracking and
              invoice reconciliation.
            </p>
          </BlurFade>

          {bookingId && (
            <BlurFade inView delay={0.12}>
              <div className="relative mx-auto mt-10 max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm">
                <BorderBeam
                  size={70}
                  duration={8}
                  borderWidth={1.5}
                  colorFrom="#10b981"
                  colorTo="#22d3ee"
                />
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Your Booking Reference
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-white tabular-nums sm:text-4xl">
                  {bookingId}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  Quote this reference on call or email for any updates.
                </p>
              </div>
            </BlurFade>
          )}
        </div>
      </section>

      {/* What happens next */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <BlurFade inView>
            <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              What happens next?
            </h2>
          </BlurFade>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {nextSteps.map((step, idx) => (
              <BlurFade key={step.title} inView delay={idx * 0.1}>
                <div className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Step {idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>

          <BlurFade inView delay={0.15} className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              className="group h-12 rounded-xl bg-sky-700 px-7 text-sm font-bold text-white shadow-lg shadow-sky-950/20 transition-all duration-200 hover:bg-sky-800 active:scale-[0.98] sm:text-base"
            >
              <Link href="/" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <span>Return to Home</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border border-slate-300 px-6 text-sm font-semibold text-slate-800 transition-all duration-200 hover:bg-slate-100 active:scale-[0.98] sm:text-base"
            >
              <a href="tel:+919924204744" className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
                <Phone className="h-4 w-4" />
                <span>Call Dispatch Desk</span>
              </a>
            </Button>
          </BlurFade>
        </div>
      </section>
    </div>
  );
};

export default ThankYou;
