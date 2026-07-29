import React from 'react';
import Link from 'next/link';
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
               <li className="flex items-center mt-4">
                 <span className="mr-3 h-5 w-5" style={{ color: primaryColor }}>📞</span>
                 <div className="flex flex-col">
                   <a href="tel:+916351255716" className="hover:opacity-80 transition-opacity" style={{ color: primaryColor }}>
                     +91 6351255716
                   </a>
                   <a href="tel:+919924204744" className="hover:opacity-80 transition-opacity mt-1" style={{ color: primaryColor }}>
                     +91 9924204744
                   </a>
                 </div>
                </li>

            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-center md:text-left mb-4 md:mb-0">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
