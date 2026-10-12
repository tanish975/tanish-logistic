import Link from 'next/link';
import { Home, Truck, BookOpen, Contact } from 'lucide-react';
import { SiteMetadata } from '@/components/Layout/Metadata';

const NotFound = () => (
  <div>
    <SiteMetadata
      title="Page not found — Tanish Logistic"
      description="The page you were looking for could not be found. Return to the Tanish Logistic home page, services, or booking form."
    />
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-16 text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-sky-100 text-sky-700">
        <Truck className="h-10 w-10" aria-hidden="true" />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-950">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h2>
      <p className="mt-3 max-w-md text-base leading-7 text-slate-600">
        The route you requested doesn't exist or has moved. Let us help you get back on track.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="inline-flex h-12 items-center justify-center rounded-md bg-sky-700 px-6 text-base font-bold text-white hover:bg-sky-800">
          <Home className="mr-2 h-5 w-5" aria-hidden="true" /> Back to Home
        </Link>
        <Link href="/book" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-base font-bold text-slate-800 hover:bg-slate-100">
          <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" /> Start a booking
        </Link>
        <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-md border border-slate-300 bg-white px-6 text-base font-bold text-slate-800 hover:bg-slate-100">
          <Contact className="mr-2 h-5 w-5" aria-hidden="true" /> Contact us
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;