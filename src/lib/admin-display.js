export const BOOKING_STATUSES = [
  {
    value: 'PENDING',
    label: 'Pending',
    dot: 'bg-amber-500',
    bar: 'bg-amber-400',
    control: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  {
    value: 'CONFIRMED',
    label: 'Confirmed',
    dot: 'bg-sky-500',
    bar: 'bg-sky-500',
    control: 'border-sky-200 bg-sky-50 text-sky-800',
  },
  {
    value: 'IN_TRANSIT',
    label: 'In transit',
    dot: 'bg-indigo-500',
    bar: 'bg-indigo-500',
    control: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  },
  {
    value: 'DELIVERED',
    label: 'Delivered',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
    control: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  },
  {
    value: 'CANCELLED',
    label: 'Cancelled',
    dot: 'bg-rose-500',
    bar: 'bg-rose-400',
    control: 'border-rose-200 bg-rose-50 text-rose-800',
  },
];

export function bookingStatus(status) {
  return (
    BOOKING_STATUSES.find((item) => item.value === status) || {
      value: status,
      label: status ? String(status).replace(/_/g, ' ') : 'Unknown',
      dot: 'bg-slate-400',
      bar: 'bg-slate-400',
      control: 'border-slate-200 bg-slate-50 text-slate-700',
    }
  );
}

export function formatBookingDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function localDayKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Match the existing analytics definition: bookings are counted by creation
// date, with the booking date used only when creation time is unavailable.
export function bookingActivity(bookings, now = new Date()) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return {
      key: localDayKey(date),
      weekday: new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(
        date
      ),
      dateLabel: new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
      }).format(date),
      count: 0,
    };
  });
  const byDay = new Map(days.map((day) => [day.key, day]));
  for (const booking of bookings) {
    const value = booking.createdAt || booking.date;
    if (!value) continue;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) continue;
    const day = byDay.get(localDayKey(date));
    if (day) day.count += 1;
  }
  return days;
}
