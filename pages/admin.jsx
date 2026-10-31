'use client';

import Head from 'next/head';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Menu, ShieldAlert } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import LoginForm from '@/components/ui/LoginForm';
import AdminSidebar, { ADMIN_SECTIONS } from '@/components/admin/AdminSidebar';
import BookingsWorkspace from '@/components/admin/BookingsWorkspace';
import DashboardView from '@/components/admin/DashboardView';
import CustomersView from '@/components/admin/CustomersView';
import ReviewsView from '@/components/admin/ReviewsView';
import RoutesView from '@/components/admin/RoutesView';
import { BOOKING_STATUSES } from '@/lib/admin-display';
import SettingsPage from './settings';

function AccessDenied({ onLogout }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f3f6f8] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-700">
          <ShieldAlert className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-slate-950">
          Admin access required
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          This account does not have permission to access the admin workspace.
        </p>
        <Button onClick={onLogout} variant="outline" className="mt-6 w-full">
          Sign out
        </Button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [bookingStatus, setBookingStatus] = useState('loading');
  const [reviews, setReviews] = useState([]);
  const [reviewsStatus, setReviewsStatus] = useState('loading');
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmLabel: 'Confirm',
  });

  const loadBookings = useCallback(async ({ notify = false } = {}) => {
    setBookingStatus('loading');
    try {
      const response = await fetch('/api/get-bookings', {
        credentials: 'include',
      });
      if (response.status === 401) {
        setUser(null);
        setBookings([]);
        setReviews([]);
        setReviewsStatus('loading');
        setBookingStatus('error');
        toast.error('Your session expired. Please sign in again.');
        return;
      }
      if (!response.ok) throw new Error('Failed to load bookings');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected bookings response');
      setBookings(data);
      setBookingStatus('ready');
      if (notify) toast.success('Bookings refreshed.');
    } catch {
      setBookingStatus('error');
      if (notify) toast.error('Could not load bookings. Please try again.');
    }
  }, []);

  const loadReviews = useCallback(async () => {
    setReviewsStatus((previous) =>
      previous === 'ready' || previous === 'refreshing'
        ? 'refreshing'
        : 'loading'
    );
    try {
      const response = await fetch('/api/reviews?all=true', {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to load reviews');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected reviews response');
      setReviews(data);
      setReviewsStatus('ready');
    } catch {
      setReviewsStatus('error');
    }
  }, []);

  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        if (!active) return;
        if (response.ok && data.user?.role === 'ADMIN') {
          setUser(data.user);
          loadBookings();
          loadReviews();
        } else {
          setUser(null);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    checkSession();
    return () => {
      active = false;
    };
  }, [loadBookings, loadReviews]);

  useEffect(() => {
    if (!router.isReady) return;
    const requested =
      typeof router.query.section === 'string'
        ? router.query.section
        : 'dashboard';
    setCurrentSection(
      ADMIN_SECTIONS.some((section) => section.id === requested)
        ? requested
        : 'dashboard'
    );
  }, [router.isReady, router.query.section]);

  const filteredBookings = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        [
          booking.clientName,
          booking.customerName,
          booking.companyName,
          booking.bookingId,
          booking.id,
          booking.pickup,
          booking.drop,
        ].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(query)
        );
      return (
        matchesSearch &&
        (statusFilter === 'all' || booking.status === statusFilter)
      );
    });
  }, [bookings, searchInput, statusFilter]);

  const navigateTo = (section) => {
    if (!ADMIN_SECTIONS.some((item) => item.id === section)) return;
    setCurrentSection(section);
    setIsSidebarOpen(false);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    if (loggedInUser?.role === 'ADMIN') {
      setBookings([]);
      setReviews([]);
      setReviewsStatus('loading');
      loadBookings();
      loadReviews();
    }
  };

  const performLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok && !result.localSessionCleared) throw new Error('Sign-out failed');
      setUser(null);
      setBookings([]);
      setReviews([]);
      setBookingStatus('loading');
      setReviewsStatus('loading');
      if (result.localSessionCleared) {
        toast.error('Signed out on this device, but other sessions could not be revoked. Contact your administrator.');
      } else {
        toast.info('You have been signed out.');
      }
    } catch {
      toast.error('Could not sign out. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsSidebarOpen(false);
    setConfirmState({
      open: true,
      title: 'Sign out?',
      message:
        'You can sign back in whenever you need to access the admin workspace.',
      confirmLabel: 'Sign out',
      destructive: false,
      onConfirm: performLogout,
    });
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    if (!BOOKING_STATUSES.some((status) => status.value === newStatus)) return;
    setUpdatingBookingId(bookingId);
    try {
      const response = await fetch('/api/update-booking-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, newStatus }),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to update booking');
      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === bookingId || booking.bookingId === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
      toast.success('Booking status updated.');
    } catch {
      toast.error('Could not update the booking status. Please try again.');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleDeleteBooking = (bookingId) => {
    setConfirmState({
      open: true,
      title: 'Delete this booking?',
      message:
        'This will permanently remove the booking. This action cannot be undone.',
      confirmLabel: 'Delete booking',
      destructive: true,
      onConfirm: async () => {
        try {
          const response = await fetch('/api/delete-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: bookingId }),
            credentials: 'include',
          });
          const data = await response.json();
          if (!response.ok)
            throw new Error(data.message || 'Failed to delete booking');
          setBookings((previous) =>
            previous.filter(
              (booking) =>
                booking.id !== bookingId && booking.bookingId !== bookingId
            )
          );
          toast.success(data.message || 'Booking deleted.');
        } catch {
          toast.error('Could not delete the booking. Please try again.');
        }
      },
    });
  };

  const handleDeleteAllCancelled = () => {
    setConfirmState({
      open: true,
      title: 'Delete all cancelled bookings?',
      message:
        'All cancelled bookings will be permanently removed. This action cannot be undone.',
      confirmLabel: 'Delete cancelled bookings',
      destructive: true,
      onConfirm: async () => {
        try {
          const response = await fetch('/api/delete-booking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deleteAllCancelled: true }),
            credentials: 'include',
          });
          if (!response.ok)
            throw new Error('Failed to delete cancelled bookings');
          setBookings((previous) =>
            previous.filter((booking) => booking.status !== 'CANCELLED')
          );
          toast.success('Cancelled bookings deleted.');
        } catch {
          toast.error('Could not delete cancelled bookings. Please try again.');
        }
      },
    });
  };

  const runConfirmation = async () => {
    if (!confirmState.onConfirm || isConfirming) return;
    setIsConfirming(true);
    try {
      await confirmState.onConfirm();
    } finally {
      setIsConfirming(false);
      setConfirmState((previous) => ({ ...previous, open: false }));
    }
  };

  const head = (
    <Head>
      <title>Tanish Logistic | Admin workspace</title>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );
  if (isLoading) {
    return (
      <>
        {head}
        <main
          role="status"
          className="flex min-h-screen items-center justify-center bg-[#f3f6f8] text-sm font-medium text-slate-600"
        >
          Loading admin workspace…
        </main>
      </>
    );
  }
  if (!user)
    return (
      <>
        {head}
        <main>
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </main>
      </>
    );
  if (user.role !== 'ADMIN')
    return (
      <>
        {head}
        <Toaster richColors />
        <main>
          <AccessDenied onLogout={performLogout} />
        </main>
      </>
    );

  const section =
    ADMIN_SECTIONS.find((item) => item.id === currentSection) ||
    ADMIN_SECTIONS[0];
  const pendingBookings =
    bookingStatus === 'ready'
      ? bookings.filter((booking) => booking.status === 'PENDING').length
      : 0;
  const pendingReviews =
    reviewsStatus === 'ready' || reviewsStatus === 'refreshing'
      ? reviews.filter((review) => review.status === 'pending').length
      : 0;
  const sidebarProps = {
    currentSection,
    onNavigate: navigateTo,
    user,
    pendingBookings,
    pendingReviews,
    onSignOut: handleLogout,
  };
  const refreshBookings = () => loadBookings({ notify: true });
  const refreshOverview = () => {
    refreshBookings();
    loadReviews();
  };
  const name = user.name?.trim() || user.email?.split('@')[0] || 'Admin';

  const content = (() => {
    switch (currentSection) {
      case 'dashboard':
        return (
          <DashboardView
            bookings={bookings}
            bookingStatus={bookingStatus}
            onNavigate={navigateTo}
            onRefresh={refreshOverview}
          />
        );
      case 'bookings':
        return (
          <BookingsWorkspace
            bookings={filteredBookings}
            totalCount={bookings.length}
            cancelledCount={
              bookings.filter((booking) => booking.status === 'CANCELLED')
                .length
            }
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            bookingStatus={bookingStatus}
            onRefresh={refreshBookings}
            onUpdateStatus={handleUpdateBookingStatus}
            onDelete={handleDeleteBooking}
            onDeleteAllCancelled={handleDeleteAllCancelled}
            updatingBookingId={updatingBookingId}
          />
        );
      case 'routes':
        return <RoutesView />;
      case 'customers':
        return <CustomersView />;
      case 'reviews':
        if (reviewsStatus === 'loading')
          return (
            <p
              role="status"
              className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500"
            >
              Loading reviews…
            </p>
          );
        if (reviewsStatus === 'error')
          return (
            <div
              role="alert"
              className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600"
            >
              Could not load reviews.{' '}
              <button
                type="button"
                onClick={loadReviews}
                className="font-semibold text-sky-700 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          );
        return <ReviewsView reviews={reviews} onRefresh={loadReviews} />;
      case 'settings':
        return <SettingsPage embedded />;
      default:
        return null;
    }
  })();

  return (
    <>
      {head}
      <Toaster richColors />
      <div className="min-h-screen bg-[#f3f6f8] font-sans text-slate-950">
        <a
          href="#admin-main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-sky-800 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
        >
          Skip to content
        </a>
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
          <AdminSidebar {...sidebarProps} />
        </aside>
        <div className="min-w-0 lg:pl-64">
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
            <Dialog open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  aria-label="Open navigation"
                  aria-expanded={isSidebarOpen}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 lg:hidden"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
              </DialogTrigger>
              <DialogContent className="left-0 top-0 flex h-[100dvh] w-[min(20rem,88vw)] max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 bg-[#102536] p-0 text-white [&>button]:text-slate-300 [&>button]:hover:text-white">
                <DialogTitle className="sr-only">Admin navigation</DialogTitle>
                <DialogDescription className="sr-only">
                  Choose an admin section or sign out.
                </DialogDescription>
                <AdminSidebar {...sidebarProps} />
              </DialogContent>
            </Dialog>
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden font-medium text-slate-500 sm:inline">
                Operations
              </span>
              <span
                className="hidden text-slate-300 sm:inline"
                aria-hidden="true"
              >
                /
              </span>
              <h1 className="truncate font-bold text-slate-800">
                {section.label}
              </h1>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-3">
              <span className="hidden text-xs font-semibold text-slate-500 sm:inline">
                Admin workspace
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-sm font-bold text-sky-800">
                <span className="sr-only">Signed in as {name}</span>
                <span aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
              </span>
            </div>
          </header>
          <main
            id="admin-main"
            tabIndex={-1}
            className="mx-auto w-full max-w-[1600px] min-w-0 px-4 py-6 outline-none sm:px-6 sm:py-8 lg:px-8"
          >
            {content}
          </main>
        </div>
      </div>

      <Dialog
        open={confirmState.open}
        onOpenChange={(open) => {
          if (!isConfirming)
            setConfirmState((previous) => ({ ...previous, open }));
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] rounded-xl">
          <DialogHeader>
            <DialogTitle>{confirmState.title}</DialogTitle>
            <DialogDescription>{confirmState.message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              disabled={isConfirming}
              onClick={() =>
                setConfirmState((previous) => ({ ...previous, open: false }))
              }
            >
              Cancel
            </Button>
            <Button
              variant={confirmState.destructive ? 'destructive' : 'default'}
              className={
                confirmState.destructive
                  ? 'bg-rose-700 text-white hover:bg-rose-800'
                  : undefined
              }
              disabled={isConfirming}
              onClick={runConfirmation}
            >
              {isConfirming ? 'Please wait…' : confirmState.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
