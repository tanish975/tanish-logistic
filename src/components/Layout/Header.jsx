'use client';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useSettings } from '../../lib/SettingsContext';
import { Button } from '../ui/button';
import { Menu, X, ArrowRight } from 'lucide-react';

const mainNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/whyus', label: 'Why Us' },
  { href: '/Gallery', label: 'Fleet & Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const darkHeroRoutes = ['/', '/services', '/whyus', '/Gallery', '/about', '/contact', '/book'];

export const Header = () => {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const settings = useSettings();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current page starts with a white background instead of a dark hero
  const isLightPage = !darkHeroRoutes.includes(router.pathname);
  const showElevatedNavbar = isScrolled || isLightPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        if (data.user?.role === 'ADMIN') {
          setIsAdmin(true);
        }
      } catch (error) {
        // Silently ignore session check failure
      }
    };
    checkSession();
  }, []);

  const siteName = settings.siteName ?? 'Tanish Logistic';
  const logoUrl = settings.logoUrl ?? '/logo-animated.svg';
  const primaryColor = settings.primaryColor || '#0369A1';

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all duration-300 pt-3 sm:pt-4 px-3 sm:px-6 lg:px-8">
      {/* Floating Glassmorphic Capsule */}
      <div
        className={`pointer-events-auto mx-auto max-w-7xl rounded-full border transition-all duration-300 ${
          showElevatedNavbar
            ? 'bg-slate-950/90 backdrop-blur-2xl border-white/20 shadow-2xl shadow-black/40 py-2 sm:py-2.5 px-5 sm:px-8'
            : 'bg-slate-950/[0.05] backdrop-blur-md border-white/15 shadow-md shadow-black/10 py-2.5 sm:py-3.5 px-5 sm:px-8'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-full"
          >
            <img
              src={logoUrl}
              alt={`${siteName} Logo`}
              className="h-12 w-12 sm:h-[52px] sm:w-[52px] shrink-0 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
            />
            <div>
              <span className="block text-lg sm:text-xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {siteName}
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Road Freight &bull; Enterprise Logistics
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Primary navigation">
            {mainNavLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                    isActive
                      ? 'bg-white/20 text-white font-bold border border-white/30 shadow-sm backdrop-blur-sm'
                      : 'text-slate-100 hover:text-white hover:bg-white/15'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className="rounded-full px-4 py-1.5 text-sm font-semibold text-amber-300 hover:bg-amber-500/20 border border-amber-400/30 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-10 rounded-full border-white/25 bg-white/10 text-white font-semibold hover:bg-white/20 hover:text-white backdrop-blur-sm transition-all duration-200 active:scale-[0.98] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            >
              <Link href="/book" className="whitespace-nowrap">
                Book Transport
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="group h-10 px-5 rounded-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white text-sm font-bold shadow-lg shadow-sky-950/50 border border-sky-400/30 transition-all duration-200 active:scale-[0.98]"
            >
              <Link href="/contact" className="inline-flex items-center gap-1.5 whitespace-nowrap">
                <span>Get Quote</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              asChild
              size="sm"
              className="h-9 px-3.5 rounded-full text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md"
            >
              <Link href="/book">Book</Link>
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Floating directly below the capsule) */}
      {isOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          className="pointer-events-auto mx-auto mt-2 max-w-7xl rounded-3xl border border-white/20 bg-slate-950/95 backdrop-blur-2xl shadow-2xl p-4 sm:p-5 text-white md:hidden"
        >
          <div className="space-y-1">
            {mainNavLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-full px-4 py-2.5 text-base font-semibold transition ${
                    isActive ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-400/20' : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between rounded-full px-4 py-2.5 text-base font-semibold text-amber-300 hover:bg-amber-500/20"
              >
                <span>Admin Dashboard</span>
                <ArrowRight className="h-4 w-4 text-amber-400" />
              </Link>
            )}
            <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2">
              <Button asChild className="h-11 w-full rounded-full text-white font-bold bg-sky-600 hover:bg-sky-500 shadow-lg">
                <Link href="/contact" onClick={() => setIsOpen(false)}>
                  Get a Free Freight Quote
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-11 w-full rounded-full border-white/20 bg-white/10 text-white font-semibold hover:bg-white/20">
                <Link href="/book" onClick={() => setIsOpen(false)}>
                  Book Transport Online
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
