import Link from 'next/link';
import {
  ChevronDown,
  RefreshCw,
  Search,
  Trash2,
  MapPin,
  Plus,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  BOOKING_STATUSES,
  bookingStatus,
  formatBookingDate,
} from '@/lib/admin-display';

function StatusControl({ booking, onUpdateStatus, updatingBookingId }) {
  const id = booking.id || booking.bookingId;
  const reference = booking.bookingId || booking.id || 'booking';
  const current = bookingStatus(booking.status);
  const knownStatus = BOOKING_STATUSES.some(
    (status) => status.value === booking.status
  );
  return (
    <div className="relative inline-flex min-w-[135px] max-w-full">
      <select
        aria-label={`Update status for booking ${reference}`}
        value={booking.status || ''}
        onChange={(event) => onUpdateStatus(id, event.target.value)}
        disabled={updatingBookingId !== null}
        className={`h-9 w-full appearance-none rounded-md border py-1.5 pl-3 pr-8 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 disabled:opacity-60 ${current.control}`}
      >
        {!knownStatus && (
          <option value={booking.status || ''}>{current.label}</option>
        )}
        {BOOKING_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2"
        aria-hidden="true"
      />
    </div>
  );
}

function DeleteButton({ booking, onDelete }) {
  const id = booking.id || booking.bookingId;
  const reference = booking.bookingId || booking.id || 'booking';
  return (
    <button
      type="button"
      onClick={() => onDelete(id)}
      aria-label={`Delete booking ${reference}`}
      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
    >
      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
      Delete
    </button>
  );
}

export default function BookingsWorkspace({
  bookings,
  totalCount,
  cancelledCount,
  searchInput,
  setSearchInput,
  statusFilter,
  setStatusFilter,
  bookingStatus: loadState,
  onRefresh,
  onUpdateStatus,
  onDelete,
  onDeleteAllCancelled,
  updatingBookingId,
}) {
  const isLoading = loadState === 'loading';
  return (
    <section className="space-y-5 pb-8" aria-labelledby="all-bookings-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-sky-700">
            SHIPMENT MANAGEMENT
          </p>
          <h2
            id="all-bookings-title"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]"
          >
            All bookings
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            Search requests, update their status and manage your shipments.
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
            />{' '}
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

      <div className="rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              aria-label="Search bookings"
              placeholder="Search customer, booking ID or route"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="h-10 w-full border-slate-200 bg-white pl-10 text-sm placeholder:text-slate-400 focus-visible:ring-sky-600"
            />
          </div>
          <div className="relative w-full sm:w-44">
            <select
              aria-label="Filter bookings by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 w-full appearance-none rounded-md border border-slate-200 bg-white px-3 pr-9 text-sm font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"
            >
              <option value="all">All statuses</option>
              {BOOKING_STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Booking list</h3>
            <p className="mt-1 text-xs text-slate-500">
              {loadState === 'ready'
                ? `Showing ${bookings.length} of ${totalCount} bookings`
                : isLoading
                  ? 'Loading bookings…'
                  : 'Bookings unavailable'}
            </p>
          </div>
          <button
            type="button"
            onClick={onDeleteAllCancelled}
            disabled={!cancelledCount || loadState !== 'ready'}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete all
            cancelled
          </button>
        </div>

        {loadState === 'error' ? (
          <div
            role="alert"
            className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-600"
          >
            Could not load bookings.{' '}
            <button
              type="button"
              onClick={onRefresh}
              className="font-semibold text-sky-700 underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div
            className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-500"
            role="status"
          >
            Loading bookings…
          </div>
        ) : bookings.length === 0 ? (
          <div className="border-t border-slate-100 px-5 py-12 text-center">
            <p className="text-sm font-semibold text-slate-800">
              No bookings found
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {totalCount
                ? 'Try a different search or status filter.'
                : 'New shipment requests will appear here.'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto border-t border-slate-100 md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">
                      Booking
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Customer
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Route
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Pickup date
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id || booking.bookingId}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900">
                        {booking.bookingId || booking.id || '—'}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          {booking.clientName || booking.customerName || '—'}
                        </p>
                        {booking.companyName && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {booking.companyName}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {booking.pickup || '—'}{' '}
                        <span
                          aria-hidden="true"
                          className="mx-1 text-slate-400"
                        >
                          →
                        </span>
                        <span className="sr-only"> to </span>{' '}
                        {booking.drop || '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {formatBookingDate(booking.date)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusControl
                          booking={booking}
                          onUpdateStatus={onUpdateStatus}
                          updatingBookingId={updatingBookingId}
                        />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <DeleteButton booking={booking} onDelete={onDelete} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-slate-100 border-t border-slate-100 md:hidden">
              {bookings.map((booking) => (
                <li
                  key={booking.id || booking.bookingId}
                  className="space-y-3 px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words [overflow-wrap:anywhere] font-bold text-slate-900">
                        {booking.bookingId || booking.id || '—'}
                      </p>
                      <p className="mt-1 break-words [overflow-wrap:anywhere] text-sm font-medium text-slate-700">
                        {booking.clientName || booking.customerName || '—'}
                      </p>
                      {booking.companyName && (
                        <p className="mt-0.5 break-words [overflow-wrap:anywhere] text-xs text-slate-500">
                          {booking.companyName}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-slate-500">
                      {formatBookingDate(booking.date)}
                    </span>
                  </div>
                  <p className="flex items-start gap-1.5 text-sm leading-5 text-slate-600">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-slate-400"
                      aria-hidden="true"
                    />
                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                      {booking.pickup || '—'} <span aria-hidden="true">→</span>
                      <span className="sr-only"> to </span>{' '}
                      {booking.drop || '—'}
                    </span>
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <StatusControl
                      booking={booking}
                      onUpdateStatus={onUpdateStatus}
                      updatingBookingId={updatingBookingId}
                    />
                    <DeleteButton booking={booking} onDelete={onDelete} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
