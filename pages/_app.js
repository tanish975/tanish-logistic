import React, { useState, useEffect } from 'react';
import '../src/index.css';
import { Header } from '../src/components/Layout/Header';
import { Footer } from '../src/components/Layout/Footer';
import { useRouter } from 'next/router';
import { SettingsProvider, useSettings } from '../src/lib/SettingsContext';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname === '/admin' || router.pathname.startsWith('/admin/');

  return (
    <SettingsProvider>
      <ThemeColors />
      <div className="App">
        <div className="min-h-screen flex flex-col">
          {!isAdminPage && <Header />}
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          {!isAdminPage && <Footer />}
        </div>
      </div>
    </SettingsProvider>
  );
}

// Component to apply theme colors as CSS variables
function ThemeColors() {
  const settings = useSettings();
  
  useEffect(() => {
    // Apply colors to CSS variables
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor || '#3b82f6');
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor || '#8b5cf6');
  }, [settings.primaryColor, settings.secondaryColor]);

  return null;
}

export default MyApp;
