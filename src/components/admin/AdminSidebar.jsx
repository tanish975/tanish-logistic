import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Map,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

export const ADMIN_SECTIONS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'A clear view of your freight operations.',
    icon: LayoutDashboard,
  },
  {
    id: 'bookings',
    label: 'Bookings',
    description: 'Review and manage shipment requests.',
    icon: Package,
  },
  {
    id: 'routes',
    label: 'Routes',
    description: 'See the routes your customers book most.',
    icon: Map,
  },
  {
    id: 'customers',
    label: 'Customers',
    description: 'Find customers and their booking history.',
    icon: Users,
  },
  {
    id: 'reviews',
    label: 'Reviews',
    description: 'Read and manage customer feedback.',
    icon: MessageSquare,
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Manage your website settings.',
    icon: Settings,
  },
];

export function adminSectionHref(section) {
  return section === 'dashboard' ? '/admin/' : `/admin/?section=${section}`;
}

export default function AdminSidebar({
  currentSection,
  onNavigate,
  user,
  pendingBookings = 0,
  pendingReviews = 0,
  onSignOut,
}) {
  const name = user?.name?.trim() || user?.email?.split('@')[0] || 'Admin';
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#102536] text-slate-200">
      <div className="flex items-center gap-3 px-5 pb-7 pt-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
          <Image
            src="/logo.svg"
            width={36}
            height={36}
            alt=""
            className="h-9 w-9"
          />
        </div>
        <div className="min-w-0 pr-3">
          <p className="truncate text-sm font-bold tracking-tight text-white">
            Tanish Logistic
          </p>
          <p className="mt-0.5 text-xs text-slate-400">Operations workspace</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3">
        <p className="px-3 pb-3 text-[11px] font-semibold tracking-wide text-slate-400">
          WORKSPACE
        </p>
        <nav aria-label="Admin navigation" className="space-y-1">
          {ADMIN_SECTIONS.map(({ id, label, icon: Icon }) => {
            const active = currentSection === id;
            const count =
              id === 'bookings'
                ? pendingBookings
                : id === 'reviews'
                  ? pendingReviews
                  : 0;
            return (
              <Link
                key={id}
                href={adminSectionHref(id)}
                shallow
                scroll={false}
                aria-current={active ? 'page' : undefined}
                onClick={(event) => {
                  if (
                    !event.metaKey &&
                    !event.ctrlKey &&
                    !event.shiftKey &&
                    !event.altKey
                  )
                    onNavigate(id);
                }}
                className={`group relative flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${active ? 'bg-white/[0.11] text-white' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'}`}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-sky-400"
                  />
                )}
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${active ? 'text-sky-300' : 'text-slate-400 group-hover:text-slate-200'}`}
                  aria-hidden="true"
                />
                <span className="flex-1">{label}</span>
                {count > 0 ? (
                  <span
                    className={`min-w-6 rounded-md px-1.5 py-0.5 text-center text-[11px] tabular-nums ${active ? 'bg-white/15 text-white' : 'bg-white/[0.07] text-slate-300'}`}
                  >
                    <span aria-hidden="true">{count}</span>
                    <span className="sr-only">
                      {count} pending {id}
                    </span>
                  </span>
                ) : active ? (
                  <ChevronRight
                    className="h-3.5 w-3.5 text-slate-400"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg px-1 py-2">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sm font-bold text-sky-950"
            aria-hidden="true"
          >
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{name}</p>
            <p className="truncate text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-2 flex min-h-10 w-full items-center gap-3 rounded-lg px-2 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
        >
          <LogOut className="h-4 w-4 text-slate-400" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </div>
  );
}
