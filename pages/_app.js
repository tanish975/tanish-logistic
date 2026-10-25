import React, { useEffect, useState } from 'react';
import '../src/index.css';
import { Header } from '../src/components/Layout/Header';
import { Footer } from '../src/components/Layout/Footer';
import { useRouter } from 'next/router';
import { SettingsProvider, useSettings } from '../src/lib/SettingsContext';
import { PageTransition, TransitionLink, usePageTransition } from '../src/components/Layout/PageTransition';
import { ScrollProgress, ScrollToTop } from '../src/components/Layout/ScrollProgress';
import { PageLoader } from '../src/components/Animations';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isAdminPage = router.pathname === '/admin' || router.pathname.startsWith('/admin/');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <SettingsProvider>
      <ThemeColors />
      <div className="App">
        <ScrollProgress />
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          {!isAdminPage && <Header />}
          <PageTransition>
            <main className="flex-1">
              {isLoading && <PageLoader />}
              <Component {...pageProps} />
            </main>
          </PageTransition>
          {!isAdminPage && <Footer />}
        </div>
      </div>
    </SettingsProvider>
  );
}

function ThemeColors() {
  const settings = useSettings();
  
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor || '#3b82f6');
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor || '#8b5cf6');
  }, [settings.primaryColor, settings.secondaryColor]);

  return null;
}

export default MyApp;