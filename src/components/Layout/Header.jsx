'use client';
import { useRouter } from 'next/router';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSettings } from '../../lib/SettingsContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Menu, X, Truck } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/book', label: 'Book' },
  { href: '/Gallery', label: 'Gallery' },
];

const baseMoreLinks = [
  { href: '/industries', label: 'Industries' },
  { href: '/whyus', label: 'Why Us' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export const Header = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState({ centerX: -100 }); // Initialize off-screen
  const settings = useSettings();

  const [isAdmin, setIsAdmin] = useState(false);

  const tabsRef = useRef([]);
  const moreButtonRef = useRef(null); // New ref for More button

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

  useEffect(() => {
    let targetCenterX = -100; // Default off-screen

    // Check main nav links
    const activeNavLinkIndex = navLinks.findIndex(link => link.href === router.pathname);
    if (activeNavLinkIndex !== -1) {
      const activeTabNode = tabsRef.current[activeNavLinkIndex];
      if (activeTabNode) {
        targetCenterX = activeTabNode.offsetLeft + (activeTabNode.offsetWidth / 2);
      }
    } else {
      // If not found in main nav, check more links
      const activeMoreLink = moreLinks.some(link => link.href === router.pathname);
      if (activeMoreLink && moreButtonRef.current) {
        targetCenterX = moreButtonRef.current.offsetLeft + (moreButtonRef.current.offsetWidth / 2);
      }
    }

    setActiveTab({ centerX: targetCenterX });
  }, [router.pathname]);

  const siteName = settings.siteName ?? 'Tanish Logistic';
  const logoUrl = settings.logoUrl ?? '/icon.png';

  return (
    <header className="bg-white text-gray-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <img src={logoUrl} alt={`${siteName} Logo`} className="h-12" />
              <span className="text-2xl font-bold text-gray-800 font-serif">{siteName}</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center relative">
            {navLinks.map((link, i) => (
              <div
                key={link.href}
                ref={el => tabsRef.current[i] = el}
                className="relative flex items-center justify-center h-full px-4" // Use padding for spacing
              >
                <Link href={link.href}>
                  <span className={`text-lg font-medium hover:text-blue-600 transition-colors duration-300 ${router.pathname === link.href ? 'text-blue-600' : ''}`}>
                    {link.label}
                  </span>
                </Link>
              </div>
            ))}

            {activeTab.centerX !== -100 && ( // Only show if centerX is not -100 (off-screen)
              <motion.div
                layoutId="active-nav-truck"
                initial={false}
                animate={{
                  x: activeTab.centerX,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 25,
                }}
                className="absolute -bottom-5 h-6 w-6" // Fixed width for the truck container
                style={{ left: 0, transform: 'translateX(-50%)' }} // Center the truck container on its X position
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, repeatType: 'mirror' }}
                >
                  <Truck className="h-6 w-6 text-blue-600" />
                </motion.div>
              </motion.div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button ref={moreButtonRef} variant="ghost" className="text-lg font-medium hover:text-blue-600">More</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white shadow-lg rounded-lg mt-2">
                {moreLinks.map((link) => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href} className={`block px-4 py-2 text-lg ${router.pathname === link.href ? 'text-blue-600' : 'text-gray-800'} hover:bg-gray-100`}>
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 hover:text-blue-600">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[...navLinks, ...moreLinks].map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`block px-3 py-2 rounded-md text-base font-medium ${router.pathname === link.href ? 'bg-blue-50 text-blue-600' : 'text-gray-800'} hover:bg-gray-100`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};