import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, MapPin, RefreshCw } from 'lucide-react';

const RoutesView = () => {
  const [routes, setRoutes] = useState([]);
  const [loadState, setLoadState] = useState('loading');

  const fetchPopularRoutes = useCallback(async () => {
    setLoadState('loading');
    try {
      const response = await fetch('/api/routes');
      if (!response.ok) throw new Error('Failed to fetch routes');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected routes response');
      setRoutes(data);
      setLoadState('ready');
    } catch {
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    fetchPopularRoutes();
  }, [fetchPopularRoutes]);

  return (
    <section className="space-y-5 pb-8" aria-labelledby="popular-routes-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-sky-700">
            ROUTE INSIGHTS
          </p>
          <h2
            id="popular-routes-title"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]"
          >
            Popular routes
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            The top 10 routes by number of bookings.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchPopularRoutes}
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
        <div className="px-5 py-4">
          <h3 className="text-sm font-bold text-slate-900">Route frequency</h3>
          <p className="mt-1 text-xs text-slate-500">
            Based on pickup and drop-off locations
          </p>
        </div>
        {loadState === 'loading' ? (
          <p
            role="status"
            className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-500"
          >
            Loading routes…
          </p>
        ) : loadState === 'error' ? (
          <p
            role="alert"
            className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-600"
          >
            Could not load routes.{' '}
            <button
              type="button"
              onClick={fetchPopularRoutes}
              className="font-semibold text-sky-700 underline underline-offset-2"
            >
              Try again
            </button>
          </p>
        ) : routes.length === 0 ? (
          <p className="border-t border-slate-100 px-5 py-10 text-center text-sm text-slate-500">
            No routes available yet. Routes will appear as bookings are made.
          </p>
        ) : (
          <>
            <div className="hidden overflow-x-auto border-t border-slate-100 md:block">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="bg-slate-50/80 text-xs font-semibold text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">
                      Rank
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Pickup
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Drop-off
                    </th>
                    <th scope="col" className="px-5 py-3 text-right">
                      Bookings
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {routes.map((route, index) => (
                    <tr
                      key={`${route.pickup}-${route.drop}`}
                      className="hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-500">
                        {String(index + 1).padStart(2, '0')}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {route.pickup || '—'}
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {route.drop || '—'}
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-slate-900">
                        {route.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ol className="divide-y divide-slate-100 border-t border-slate-100 md:hidden">
              {routes.map((route, index) => (
                <li
                  key={`${route.pickup}-${route.drop}`}
                  className="flex items-start gap-3 px-4 py-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-1.5 text-sm font-semibold leading-5 text-slate-800">
                      <MapPin
                        className="h-4 w-4 shrink-0 text-slate-400"
                        aria-hidden="true"
                      />
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                        {route.pickup || '—'}
                      </span>
                      <ArrowRight
                        className="h-3.5 w-3.5 shrink-0 text-slate-400"
                        aria-hidden="true"
                      />
                      <span className="sr-only">to</span>
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                        {route.drop || '—'}
                      </span>
                    </p>
                    <p className="mt-1.5 text-xs text-slate-500">
                      {route.count} {route.count === 1 ? 'booking' : 'bookings'}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
};

export default RoutesView;
