import {
  bookingActivity,
  bookingStatus,
  formatBookingDate,
} from '../src/lib/admin-display';

describe('booking display helpers', () => {
  it('groups only valid creation dates within the last seven local days', () => {
    const now = new Date(2026, 9, 31, 12, 0, 0);
    const onDay = (day) => new Date(2026, 9, day, 12, 0, 0).toISOString();
    const days = bookingActivity(
      [
        { createdAt: onDay(31) },
        { date: onDay(31) },
        { createdAt: onDay(25) },
        { createdAt: onDay(24) },
        { createdAt: 'invalid' },
      ],
      now
    );
    expect(days).toHaveLength(7);
    expect(days[0].count).toBe(1);
    expect(days[6].count).toBe(2);
    expect(days.reduce((total, day) => total + day.count, 0)).toBe(3);
  });

  it('handles missing dates and unrecognised statuses without throwing', () => {
    expect(formatBookingDate('invalid')).toBe('—');
    expect(formatBookingDate(null)).toBe('—');
    expect(bookingStatus('IN_TRANSIT').label).toBe('In transit');
    expect(bookingStatus('CUSTOM_STATUS').label).toBe('CUSTOM STATUS');
  });
});
