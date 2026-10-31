import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, PackageCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.user) onLoginSuccess(data.user);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f6f8] px-4 py-8 font-sans text-slate-950 sm:px-6">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] md:grid-cols-2">
        <div className="relative flex flex-col overflow-hidden bg-[#102536] p-7 text-white sm:p-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <Image src="/logo.svg" width={34} height={34} alt="" priority />
            </span>
            <div>
              <p className="text-sm font-bold">Tanish Logistic</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Operations workspace
              </p>
            </div>
          </div>
          <div className="relative mt-10 md:mb-auto md:mt-20">
            <p className="text-xs font-bold tracking-wide text-sky-300">
              ADMIN WORKSPACE
            </p>
            <h1 className="mt-3 max-w-xs text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              A clearer view of every shipment.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Manage bookings, routes, customer feedback and site settings in
              one place.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 md:mt-20">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
              <PackageCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Freight operations</p>
              <p className="mt-1 text-xs text-slate-400">
                One workspace for the dispatch team.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <div className="mx-auto w-full max-w-sm">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Sign in
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use your admin account to continue.
            </p>
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="admin-email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="username"
                  required
                  className="h-11 border-slate-200 focus-visible:ring-sky-600"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="admin-password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                  className="h-11 border-slate-200 focus-visible:ring-sky-600"
                />
              </div>
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800"
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 text-sm font-bold text-white transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in…' : 'Sign in'}{' '}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to
              website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
