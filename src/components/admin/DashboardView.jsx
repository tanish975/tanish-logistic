'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Package,
  Plus,
  RefreshCw,
  Truck,
  AlertCircle,
} from 'lucide-react';
import {
  BOOKING_STATUSES,
  bookingActivity,
  bookingStatus,
  formatBookingDate,
} from '@/lib/admin-display';
import { adminSectionHref } from './AdminSidebar';

const statDetails = [
  {
    key: 'total',
    label: 'Total bookings',
    detail: 'All shipment requests',
    icon: Package,
    iconClass: 'bg-sky-50 text-sky-700',
  },
  {
    key: 'PENDING',
    label: 'Pending',
    detail: 'Waiting for review',
    icon: Clock3,
    iconClass: 'bg-amber-50 text-amber-700',
  },
  {
    key: 'IN_TRANSIT',
    label: 'In transit',
    detail: 'Shipments on the road',
    icon: Truck,
    iconClass: 'bg-indigo-50 text-indigo-700',
  },
  {
    key: 'DELIVERED',
    label: 'Delivered',
    detail: 'Completed shipments',
    icon: CheckCircle2,
    iconClass: 'bg-emerald-50 text-emerald-700',
  },
];

function StatusPill({ status }) {
  const meta = bookingStatus(status);
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.control}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
      />
      {meta.label}
    </span>
  );
}

export default function DashboardView({
  bookings = [],
  bookingStatus: loadState = 'ready',
  onNavigate = () => {},
  onRefresh = () => {},
}) {
  const isReady = loadState === 'ready';
  const isLoading = loadState === 'loading';
  const counts = useMemo(() => {
    const result = Object.fromEntries(
      BOOKING_STATUSES.map(({ value }) => [value, 0])
    );
    for (const booking of bookings) {
      if (Object.hasOwn(result, booking.status)) result[booking.status] += 1;
    }
    return { ...result, total: bookings.length };
  }, [bookings]);
  const activity = useMemo(() => bookingActivity(bookings), [bookings]);
  const maxActivity = Math.max(1, ...activity.map((day) => day.count));
  const recent = bookings.slice(0, 5);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-sky-700">
            FREIGHT OPERATIONS
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]">
            Your operations at a glance
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            Track your bookings and keep your dispatch desk moving.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 disabled:cursor-wait disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            Refresh
          </button>
          <Link
            href="/book"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-700 px-3.5 text-sm font-semibold text-white transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> New booking
          </Link>
        </div>
      </div>

      {loadState === 'error' && (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Could not load bookings. Please try again.</span>
          <button
            type="button"
            onClick={onRefresh}
            className="font-bold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      <section
        aria-label="Booking overview"
        className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4"
      >
        {statDetails.map(({ key, label, detail, icon: Icon, iconClass }) => (
          <div
            key={key}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-500 sm:text-sm">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 tabular-nums sm:text-[28px]">
                  {isReady ? counts[key] : '—'}
                </p>
              </div>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconClass}`}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,1fr)]">
        <section
          aria-label="Booking activity"
          className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Booking activity
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                New bookings over the last 7 days
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              Last 7 days
            </span>
          </div>
          {isReady ? (
            <div className="mt-7">
              <div className="relative h-40 sm:h-44">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 flex flex-col justify-between"
                >
                  {[0, 1, 2, 3].map((line) => (
                    <span
                      key={line}
                      className="block w-full border-t border-dashed border-slate-100"
                    />
                  ))}
                  <span className="block w-full border-t border-slate-200" />
                </div>
                <ol className="relative grid h-full grid-cols-7 items-end gap-2 px-1 sm:gap-4 sm:px-3">
                  {activity.map((day) => (
                    <li
                      key={day.key}
                      className="flex h-full min-w-0 flex-col items-center justify-end"
                      title={`${day.dateLabel}: ${day.count} ${day.count === 1 ? 'booking' : 'bookings'}`}
                    >
                      <span className="sr-only">
                        {day.dateLabel}: {day.count}{' '}
                        {day.count === 1 ? 'booking' : 'bookings'}
                      </span>
                      {day.count > 0 && (
                        <span
                          aria-hidden="true"
                          className="mb-1 text-[11px] font-semibold tabular-nums text-slate-500"
                        >
                          {day.count}
                        </span>
                      )}
                      <span
                        aria-hidden="true"
                        className={`block w-full max-w-12 rounded-t-md ${day.count ? 'bg-sky-700' : 'bg-slate-200'}`}
                        style={{
                          height: day.count
                            ? `${Math.max(8, (day.count / maxActivity) * 82)}%`
                            : '3px',
                        }}
                      />
                    </li>
                  ))}
                </ol>
              </div>
              <div
                aria-hidden="true"
                className="mt-3 grid grid-cols-7 gap-2 px-1 text-center text-[11px] font-medium text-slate-500 sm:gap-4 sm:px-3"
              >
                {activity.map((day) => (
                  <span key={day.key} className="whitespace-nowrap">
                    {day.weekday}
                  </span>
                ))}
              </div>
              {!activity.some((day) => day.count > 0) && (
                <p className="mt-4 text-center text-xs text-slate-500">
                  No new bookings in the last 7 days.
                </p>
              )}
            </div>
          ) : (
            <p className="flex h-52 items-center justify-center text-sm text-slate-500">
              {isLoading
                ? 'Loading booking activity…'
                : 'Booking activity is unavailable.'}
            </p>
          )}
        </section>

        <section
          aria-labelledby="status-breakdown-title"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                id="status-breakdown-title"
                className="text-base font-bold text-slate-900"
              >
                Shipment status
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                A breakdown of all bookings
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {isReady ? `${counts.total} total` : '—'}
            </span>
          </div>
          <ul className="mt-6 space-y-4">
            {BOOKING_STATUSES.map((status) => (
              <li key={status.value}>
                <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                  <span className="inline-flex items-center gap-2 font-medium text-slate-600">
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full ${status.dot}`}
                    />
                    {status.label}
                  </span>
                  <span className="font-bold tabular-nums text-slate-800">
                    {isReady ? counts[status.value] : '—'}
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                >
                  <div
                    className={`h-full rounded-full ${status.bar}`}
                    style={{
                      width:
                        isReady && counts.total
                          ? `${(counts[status.value] / counts.total) * 100}%`
                          : '0%',
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section
        aria-labelledby="recent-bookings-title"
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6">
          <div>
            <h3
              id="recent-bookings-title"
              className="text-base font-bold text-slate-900"
            >
              Recent bookings
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              The latest shipment requests
            </p>
          </div>
          <Link
            href={adminSectionHref('bookings')}
            shallow
            scroll={false}
            onClick={(event) => {
              if (
                !event.metaKey &&
                !event.ctrlKey &&
                !event.shiftKey &&
                !event.altKey
              )
                onNavigate('bookings');
            }}
            className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
          >
            View all bookings{' '}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        {isReady && recent.length > 0 ? (
          <>
            <div
              aria-hidden="true"
              className="hidden grid-cols-[1fr_1.2fr_1.7fr_1fr_1fr] gap-4 bg-slate-50/80 px-6 py-3 text-xs font-semibold text-slate-500 md:grid"
            >
              <span>Booking</span>
              <span>Customer</span>
              <span>Route</span>
              <span>Pickup date</span>
              <span>Status</span>
            </div>
            <ul className="divide-y divide-slate-100">
              {recent.map((booking) => (
                <li
                  key={booking.id || booking.bookingId}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-4 gap-y-2 px-5 py-4 text-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-4 md:px-6"
                >
                  <div className="min-w-0 break-words [overflow-wrap:anywhere] font-bold text-slate-900">
                    {booking.bookingId || booking.id || '—'}
                  </div>
                  <div className="min-w-0 break-words [overflow-wrap:anywhere] text-right font-medium text-slate-700 md:text-left">
                    {booking.clientName || booking.customerName || '—'}
                  </div>
                  <div className="col-span-2 min-w-0 break-words [overflow-wrap:anywhere] text-slate-600 md:col-span-1">
                    <span>{booking.pickup || '—'}</span>
                    <span aria-hidden="true" className="mx-2 text-slate-400">
                      →
                    </span>
                    <span className="sr-only"> to </span>
                    <span>{booking.drop || '—'}</span>
                  </div>
                  <div className="self-center text-xs text-slate-500 md:text-sm">
                    {formatBookingDate(booking.date)}
                  </div>
                  <div className="justify-self-end md:justify-self-start">
                    <StatusPill status={booking.status} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="px-5 py-10 text-center text-sm text-slate-500">
            {isLoading
              ? 'Loading recent bookings…'
              : loadState === 'error'
                ? 'Recent bookings are unavailable.'
                : 'No bookings yet. New requests will appear here.'}
          </div>
        )}
      </section>
    </div>
  );
}
