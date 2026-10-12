'use client';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useSettings } from '../../lib/SettingsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronDown, Menu, Truck, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/book', label: 'Book' },
  { href: '/Gallery', label: 'Gallery' },
];

// ponytail: /industries route does not exist — drop the dead link instead of
// shipping a 404. Re-add once the page is built.
const baseMoreLinks = [
  { href: '/whyus', label: 'Why Us' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Header = () => {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const settings = useSettings();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        if (data.isLoggedIn && data.user?.role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Session check failed', error);
      }
    };
    checkSession();
  }, []);

  const moreLinks = isAdmin ? [...baseMoreLinks, { href: '/admin', label: 'Admin' }] : baseMoreLinks;

  const siteName = settings.siteName ?? 'Tanish Logistic';
  const logoUrl = settings.logoUrl ?? '/icon.png';
  const primaryColor = settings.primaryColor || '#0369A1';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="min-w-0 flex-shrink-0">
            <Link href="/" className="flex min-h-11 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200">
              <img src={logoUrl} alt={`${siteName} Logo`} className="h-11 w-11 rounded-md object-contain" />
              <span className="max-w-[12rem] truncate text-xl font-extrabold text-slate-950 sm:max-w-none sm:text-2xl">{siteName}</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative flex items-center justify-center"
              >
                <Link href={link.href} className={`inline-flex h-11 items-center rounded-md px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 ${router.pathname === link.href ? 'bg-sky-50 text-sky-700' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'}`}>
                  <span>
                    {link.label}
                  </span>
                </Link>
              </div>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-11 gap-1 rounded-md px-4 text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-950">
                  More
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 rounded-lg border-slate-200 bg-white p-1 shadow-xl">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className={`block rounded-md px-4 py-2.5 text-sm font-semibold ${router.pathname === link.href ? 'bg-sky-50 text-sky-700' : 'text-slate-700'} hover:bg-slate-100`}>
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-800 transition hover:bg-slate-100 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-slate-200 bg-white shadow-lg md:hidden"
        >
          <div className="space-y-1 px-4 py-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Navigation</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            {[...navLinks, ...moreLinks].map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                <span className={`flex min-h-11 items-center rounded-md px-3 py-2 text-base font-bold ${router.pathname === link.href ? 'bg-sky-50 text-sky-700' : 'text-slate-800'} hover:bg-slate-100`}>
                  {link.label}
                </span>
              </Link>
            ))}
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5" style={{ color: primaryColor }} aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-700">Need transport support?</p>
              </div>
              <Button asChild className="mt-3 h-11 w-full rounded-md font-bold text-white" style={{ backgroundColor: primaryColor }}>
                <Link href="/contact" onClick={() => setIsOpen(false)}>Get a quote</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};
