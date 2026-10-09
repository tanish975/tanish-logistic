import React from 'react';
import Link from 'next/link';
import { Building2, Mail, MapPin, Phone, Truck } from 'lucide-react';
import { useSettings } from '../../lib/SettingsContext';

const quickLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/industries', label: 'Industries' },
  { href: '/whyus', label: 'Why Us' },
  { href: '/contact', label: 'Contact' },
];

export const Footer = () => {
  const settings = useSettings();

  const siteName = settings.siteName || 'Tanish Logistic';
  const logoUrl = settings.logoUrl || '/icon.png';
  const copyright = settings.copyright || `(c) ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const primaryColor = settings.primaryColor || '#0369A1';

  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.7fr_1.2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/50">
              <img src={logoUrl} alt={`${siteName} Logo`} className="h-12 w-12 rounded-md object-contain" />
              <span className="text-2xl font-extrabold">{siteName}</span>
            </Link>
            <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
              Transportation and logistics support for businesses that need dependable road freight, clear coordination, and practical coverage across India.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200">
              <Truck className="h-4 w-4" style={{ color: primaryColor }} aria-hidden="true" />
              Driven by Trust, Powered by Roads
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Company</h2>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-8 items-center text-sm font-semibold text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Contact</h2>
            <ul className="mt-5 space-y-5 text-sm text-slate-300">
              <li className="flex gap-3">
                <Building2 className="mt-1 h-5 w-5 shrink-0" style={{ color: primaryColor }} aria-hidden="true" />
                <div>
                  <p className="font-bold text-white">Head Office</p>
                  <p className="mt-1 leading-7">House No. 393, Sector 2, Block B, Adarsh Nagar, near Mata Rani Mandir, Mandi Gobind Garh, FGS, Punjab</p>
                </div>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-1 h-5 w-5 shrink-0" style={{ color: primaryColor }} aria-hidden="true" />
                <div>
                  <p className="font-bold text-white">Branch Address</p>
                  <p className="mt-1 leading-7">{settings.contactDetails || 'Vadodara, Gujarat, India'}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-1 h-5 w-5 shrink-0" style={{ color: primaryColor }} aria-hidden="true" />
                <a href="mailto:tanishlogistic744@gmail.com" className="font-semibold text-slate-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40">
                  tanishlogistic744@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-1 h-5 w-5 shrink-0" style={{ color: primaryColor }} aria-hidden="true" />
                <div className="flex flex-col gap-2">
                  <a href="tel:+916351255716" className="font-semibold text-slate-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40">
                    +91 6351255716
                  </a>
                  <a href="tel:+919924204744" className="font-semibold text-slate-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/40">
                    +91 9924204744
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-sm text-slate-500">{copyright}</p>
        </div>
      </div>
    </footer>
  );
};
