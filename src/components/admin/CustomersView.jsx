import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatBookingDate } from '@/lib/admin-display';

const CustomersView = () => {
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [loadState, setLoadState] = useState('loading');

  const fetchCustomers = useCallback(async () => {
    setLoadState('loading');
    try {
      const response = await fetch('/api/get-customers');
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected customer response');
      setCustomers(data);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    return customers.filter(
      (customer) =>
        !query ||
        [customer.name, customer.phone, customer.email].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(query)
        )
    );
  }, [customers, searchInput]);

  const lastBooking = (value) => {
    const formatted = formatBookingDate(value);
    return formatted === '—' && value && value !== 'N/A' ? value : formatted;
  };

  return (
    <section
      className="space-y-5 pb-8"
      aria-labelledby="customer-directory-title"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-sky-700">
            YOUR CLIENTS
          </p>
          <h2
            id="customer-directory-title"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]"
          >
            Customer directory
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            View and search customers from your booking history.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchCustomers}
          disabled={loadState === 'loading'}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 disabled:cursor-wait disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${loadState === 'loading' ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />{' '}
          Refresh
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="relative max-w-lg">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <Input
              aria-label="Search customers"
              placeholder="Search by name, phone or email"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="h-10 border-slate-200 pl-10 focus-visible:ring-sky-600"
            />
          </div>
        </div>
        <div className="px-5 py-4">
          <h3 className="text-sm font-bold text-slate-900">Customers</h3>
          <p className="mt-1 text-xs text-slate-500">
            {loadState === 'ready'
              ? `Showing ${filteredCustomers.length} of ${customers.length} customers`
              : loadState === 'loading'
                ? 'Loading customers…'
                : 'Customers unavailable'}
          </p>
        </div>
        {loadState === 'loading' ? (
          <p
            role="status"
            className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-500"
          >
            Loading customers…
          </p>
        ) : loadState === 'error' ? (
          <p
            role="alert"
            className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-600"
          >
            Could not load customers.{' '}
            <button
              type="button"
              onClick={fetchCustomers}
              className="font-semibold text-sky-700 underline underline-offset-2"
            >
              Try again
            </button>
          </p>
        ) : filteredCustomers.length === 0 ? (
          <p className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-500">
            {customers.length
              ? 'No customers match your search.'
              : 'No customers found yet.'}
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto border-t border-slate-100 md:block">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Contact
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Total bookings
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Last booking
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map((customer, index) => (
                    <tr
                      key={customer.phone || index}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {customer.name || '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        <p>{customer.phone || '—'}</p>
                        {customer.email && (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {customer.email}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {customer.totalBookings}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {lastBooking(customer.lastBookingDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-slate-100 border-t border-slate-100 md:hidden">
              {filteredCustomers.map((customer, index) => (
                <li
                  key={customer.phone || index}
                  className="space-y-2 px-4 py-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="min-w-0 break-words text-sm font-bold text-slate-900">
                      {customer.name || '—'}
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      {customer.totalBookings}{' '}
                      {customer.totalBookings === 1 ? 'booking' : 'bookings'}
                    </p>
                  </div>
                  <div className="break-all text-sm text-slate-600">
                    <p>{customer.phone || '—'}</p>
                    {customer.email && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {customer.email}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">
                    Last booking: {lastBooking(customer.lastBookingDate)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default CustomersView;
