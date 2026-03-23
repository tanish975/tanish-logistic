import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useSettings } from '../../lib/SettingsContext';

export const Footer = () => {
  const settings = useSettings();

  const siteName = settings.siteName || 'Tanish Logistic';
  const logoUrl = settings.logoUrl || '/icon.png';
  const copyright = settings.copyright || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`;
  const primaryColor = settings.primaryColor || '#3b82f6';

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <img src={logoUrl} alt={`${siteName} Logo`} className="h-12 mb-6" />
            <p className="text-gray-400 leading-relaxed">
              {siteName} is a leading provider of logistics and transportation solutions in India. We are committed to delivering excellence and building lasting partnerships with our clients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/about"><span className="hover:text-blue-500 transition-colors">About Us</span></Link></li>
              <li><Link href="/services"><span className="hover:text-blue-500 transition-colors">Services</span></Link></li>
              <li><Link href="/industries"><span className="hover:text-blue-500 transition-colors">Industries</span></Link></li>
              <li><Link href="/contact"><span className="hover:text-blue-500 transition-colors">Contact</span></Link></li>
              <li><Link href="/admin"><span className="hover:text-blue-500 transition-colors">Admin</span></Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <span className="mt-1 mr-3 h-5 w-5" style={{ color: primaryColor }}>🏢</span>
                <div>
                  <p className="font-semibold text-white">Head Office:</p>
                  <p>House No. 393, Sector 2, Block B,</p>
                  <p>Adarsh Nagar, Nr. Mata Rani Mandir,</p>
                  <p>Mandi Gobind Garh, FGS, Punjab</p>
                </div>
              </li>
              <li className="flex items-start mt-4">
                <span className="mt-1 mr-3 h-5 w-5" style={{ color: primaryColor }}>📍</span>
                <div>
                  <p className="font-semibold text-white">Branch Address:</p>
                  <p>{settings.contactDetails || 'Vadodara, Gujarat, India'}</p>
                </div>
              </li>
              <li className="flex items-center mt-4">
                <span className="mr-3 h-5 w-5" style={{ color: primaryColor }}>📧</span>
                <a href="mailto:tanishlogistic744@gmail.com" className="hover:opacity-80" style={{ color: primaryColor }}>tanishlogistic744@gmail.com</a>
              </li>
              <li className="flex items-center">
                <span className="mr-3 h-5 w-5" style={{ color: primaryColor }}>📞</span>
                <span>+91 6351255716</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
            <div className="flex">
              <Input type="email" placeholder="Your Email" className="bg-gray-800 border-gray-700 rounded-r-none" />
              <Button style={{ backgroundColor: primaryColor }} className="hover:opacity-90 rounded-l-none">Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-center md:text-left mb-4 md:mb-0">
            {copyright}
          </p>
          <div className="flex space-x-6">
            <Link href="#"><span className="text-gray-500 hover:text-white"><Facebook /></span></Link>
            <Link href="#"><span className="text-gray-500 hover:text-white"><Twitter /></span></Link>
            <Link href="#"><span className="text-gray-500 hover:text-white"><Instagram /></span></Link>
            <Link href="#"><span className="text-gray-500 hover:text-white"><Linkedin /></span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
