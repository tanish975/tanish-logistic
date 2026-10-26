import React from 'react';
import Link from 'next/link';
import { Building2, Mail, MapPin, Phone, Truck, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../lib/SettingsContext';

const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Freight Services' },
  { href: '/whyus', label: 'Why Choose Us' },
  { href: '/Gallery', label: 'Fleet & Infrastructure' },
  { href: '/about', label: 'About Company' },
  { href: '/contact', label: 'Contact & Hubs' },
  { href: '/book', label: 'Book Transport' },
];

const serviceLinks = [
  { href: '/services', label: 'Full Truckload (FTL)' },
  { href: '/services', label: 'B2B Cargo Movement' },
  { href: '/services', label: 'Interstate Road Freight' },
  { href: '/services', label: 'Dedicated Contract Fleet' },
  { href: '/services', label: 'Industrial & Heavy Cargo' },
  { href: '/services', label: 'Express Highway Transit' },
];

export const Footer = () => {
  const settings = useSettings();

  const siteName = settings.siteName || 'Tanish Logistic';
  const logoUrl = settings.logoUrl || '/icon.png';
  const copyright = settings.copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const primaryColor = settings.primaryColor || '#0369A1';

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* Main Footer Links & Hubs */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.4fr]">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm">
                <img src={logoUrl} alt={`${siteName} Logo`} className="h-full w-full object-contain" />
              </div>
              <div>
                <span className="text-2xl font-extrabold tracking-tight text-white">{siteName}</span>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Enterprise Road Freight</span>
              </div>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-slate-400 max-w-sm">
              Strategic B2B road transport for industrial manufacturers, distributors, and logistics partners across India. Driven by trust, backed by road discipline.
            </p>
            <div className="mt-6 flex flex-col gap-2.5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Dispatch Operations: Open 24 Hours / 7 Days
              </div>
              <div className="text-xs text-slate-400">
                GST Registered &bull; Carrier Compliant &bull; Transit Insured Options
              </div>
            </div>
          </div>

          {/* Company Links */}
          <nav aria-label="Company navigation">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Company</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition flex items-center gap-1.5"
                  >
                    <ArrowRight className="h-3 w-3 text-slate-500" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Freight Services */}
          <nav aria-label="Services navigation">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Capabilities</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {serviceLinks.map((service, idx) => (
                <li key={idx}>
                  <Link
                    href={service.href}
                    className="text-slate-300 hover:text-white transition flex items-center gap-1.5"
                  >
                    <ArrowRight className="h-3 w-3 text-slate-500" />
                    <span>{service.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Operating Hubs & Direct Contacts */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-sky-400">Headquarters & Operating Hubs</p>
            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
                <div className="flex items-start gap-2.5">
                  <Building2 className="mt-0.5 h-4 w-4 text-sky-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white text-xs uppercase tracking-wide">Registered Head Office (Punjab)</p>
                    <p className="mt-1 text-slate-400 text-xs leading-relaxed">
                      House No. 393, Sector 2, Block B, Adarsh Nagar, Nr. Mata Rani Mandir, Mandi Gobind Garh, FGS, Punjab
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3.5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white text-xs uppercase tracking-wide">Western Corridor Branch (Gujarat)</p>
                    <p className="mt-1 text-slate-400 text-xs leading-relaxed">
                      Shop No. 04, Udandeep Complex, B/h. Nityanand Complex, Opp. Essar Petrol Pump, Tarsali, Sussen Road, Vadodara - 390009
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                <a href="tel:+919924204744" className="flex items-center gap-1.5 hover:text-sky-300 transition">
                  <Phone className="h-3.5 w-3.5 text-sky-400" />
                  +91 9924204744
                </a>
                <a href="tel:+919924204744" className="flex items-center gap-1.5 hover:text-sky-300 transition">
                  <Phone className="h-3.5 w-3.5 text-sky-400" />
                  +91 9924204744
                </a>
                <a href="mailto:tanishlogistic744@gmail.com" className="flex items-center gap-1.5 hover:text-sky-300 transition">
                  <Mail className="h-3.5 w-3.5 text-sky-400" />
                  tanishlogistic744@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-200 transition">About Us</Link>
            <Link href="/services" className="hover:text-slate-200 transition">Services</Link>
            <Link href="/contact" className="hover:text-slate-200 transition">Dispatch Support</Link>
            <Link href="/privacy" className="hover:text-slate-200 transition">Privacy Policy</Link>
            <Link href="/book" className="text-sky-400 hover:text-sky-300 transition font-semibold">Book Shipment</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
