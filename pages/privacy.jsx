import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SiteMetadata } from '@/components/Layout/Metadata';
import { BlurFade } from '@/components/magicui/blur-fade';
import {
  ShieldCheck,
  Database,
  Eye,
  Share2,
  Lock,
  Clock3,
  UserCheck,
  FileText,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';

const CONTACT_EMAIL = 'tanishlogistic744@gmail.com';
const CONTACT_PHONE = '+91 99242 04744';
const LAST_UPDATED = '31 October 2026';

const sections = [
  {
    icon: Database,
    title: '1. Information We Collect',
    paragraphs: [
      'We collect information that you provide directly through our website forms:',
    ],
    list: [
      'Booking form: your name, company name, phone number, email address, pickup and drop locations, cargo details (type, weight, dimensions, description), preferred date, and any special instructions.',
      'Contact form: your name, email address, phone number, company, and message.',
      'Review form: your name or organisation, rating, and written feedback; approved reviews may be made public.',
      'Security data: IP address, browser and device information, and request signals used by Vercel to protect the website, submissions, and sign-in against automated abuse.',
      'Operational data: booking references, dispatch records, and delivery confirmations created while fulfilling your shipment.',
    ],
  },
  {
    icon: Eye,
    title: '2. How We Use Your Information',
    paragraphs: [
      'We use the information we collect solely to operate and improve our freight services:',
    ],
    list: [
      'Preparing quotations and confirming bookings.',
      'Coordinating pickup, transit, and delivery of your cargo.',
      'Sending booking confirmations, status updates, and invoices.',
      'Responding to your enquiries and providing customer support.',
      'Preventing automated abuse and protecting the website and its forms.',
      'Meeting legal, tax, and accounting obligations.',
    ],
  },
  {
    icon: Share2,
    title: '3. How We Share Your Information',
    paragraphs: [
      'We do not sell or rent your personal information. We share it only as needed to fulfil your shipment and comply with the law:',
    ],
    list: [
      'Drivers and transport partners assigned to your lane receive the details required to collect and deliver your cargo safely.',
      'Service providers (such as Vercel for hosting and bot protection, and email delivery services) process data as needed to provide these services.',
      'Law enforcement, regulators, or courts, where we are legally required to disclose information.',
    ],
  },
  {
    icon: Lock,
    title: '4. Data Security',
    paragraphs: [
      'We apply technical and organisational measures to protect your information, including encrypted transport (HTTPS), access-restricted administrative systems, and password-protected accounts.',
      'No method of transmission or storage is completely secure, but we review our practices and work to protect your data against unauthorised access, alteration, or destruction.',
    ],
  },
  {
    icon: Clock3,
    title: '5. Data Retention',
    paragraphs: [
      'We retain booking and operational records for as long as necessary to provide our services and to satisfy legal, tax, and audit requirements. Enquiry and contact communications are retained for a shorter period and deleted when no longer needed.',
    ],
  },
  {
    icon: UserCheck,
    title: '6. Your Rights and Choices',
    paragraphs: [
      'Under India\u2019s Digital Personal Data Protection Act, 2023 and similar principles in other jurisdictions, you may:',
    ],
    list: [
      'Request access to the personal information we hold about you.',
      'Request correction of inaccurate or incomplete information.',
      'Request erasure of your personal data, subject to legal retention obligations.',
      'Withdraw consent to marketing communications at any time.',
    ],
  },
  {
    icon: FileText,
    title: '7. Changes to This Policy',
    paragraphs: [
      `We may update this policy from time to time. The latest version will always be available on this page with the revision date shown above. material changes will be highlighted on this page.`,
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950 font-sans">
      <SiteMetadata
        title="Privacy Policy"
        description="How Tanish Logistic collects, uses, protects, and retains your personal information across our booking and freight services."
      />

      {/* Page Header */}
      <section className="relative isolate overflow-hidden bg-slate-950 py-20 text-white sm:py-24">
        <div
          className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] [background-size:64px_64px]"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" aria-hidden="true" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <BlurFade inView>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Legal
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              This policy explains what personal information Tanish Logistic
              collects, why we collect it, how we protect it, and the choices
              you have.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Last updated: {LAST_UPDATED}
            </p>
          </BlurFade>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <BlurFade inView>
            <p className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
              Tanish Logistic (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates this website and
              provides road freight and logistics services in India. This
              Privacy Policy applies to information collected through this
              website and during the course of providing our services. By using
              our website and services, you agree to the practices described
              below.
            </p>
          </BlurFade>

          <div className="mt-12 space-y-12">
            {sections.map((section, idx) => (
              <BlurFade key={section.title} inView delay={Math.min(idx * 0.05, 0.2)}>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <section.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-950">{section.title}</h2>
                    {section.paragraphs.map((p) => (
                      <p key={p.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {p}
                      </p>
                    ))}
                    {section.list && (
                      <ul className="mt-4 space-y-2.5">
                        {section.list.map((item) => (
                          <li key={item.slice(0, 40)} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 sm:text-base">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-600" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </BlurFade>
            ))}

            {/* Contact */}
            <BlurFade inView>
              <div className="rounded-2xl border border-slate-200 bg-slate-950 p-8 text-white sm:p-10">
                <h2 className="text-xl font-bold">8. Contact Us About Privacy</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                  If you have questions about this policy or wish to exercise
                  your data rights, reach our data contact at:
                </p>
                <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 font-semibold text-slate-100 transition hover:border-slate-600"
                  >
                    <Mail className="h-4 w-4 text-sky-400" />
                    {CONTACT_EMAIL}
                  </a>
                  <a
                    href="tel:+919924204744"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 font-semibold text-slate-100 transition hover:border-slate-600"
                  >
                    <Phone className="h-4 w-4 text-sky-400" />
                    {CONTACT_PHONE}
                  </a>
                  <span className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 font-semibold text-slate-100">
                    <MapPin className="h-4 w-4 text-sky-400" />
                    Vadodara, Gujarat, India
                  </span>
                </div>
              </div>
            </BlurFade>
          </div>

          <BlurFade inView className="mt-12 text-center">
            <Button
              asChild
              className="h-11 rounded-xl bg-sky-700 px-6 text-sm font-bold text-white hover:bg-sky-800"
            >
              <Link href="/">Return to Home</Link>
            </Button>
          </BlurFade>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
