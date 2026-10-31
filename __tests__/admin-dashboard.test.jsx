/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import DashboardView from '../src/components/admin/DashboardView';

jest.mock('next/link', () => {
  const React = require('react');
  return function Link({
    children,
    href,
    onClick,
    shallow: _shallow,
    scroll: _scroll,
    ...props
  }) {
    return React.createElement(
      'a',
      {
        ...props,
        href,
        onClick: (event) => {
          event.preventDefault();
          onClick?.(event);
        },
      },
      children
    );
  };
});

const sampleBookings = [
  {
    id: 'b1',
    bookingId: 'TN1001',
    clientName: 'Asha Patel',
    pickup: 'Vadodara',
    drop: 'Surat',
    status: 'PENDING',
    createdAt: new Date().toISOString(),
    date: new Date().toISOString(),
  },
  {
    id: 'b2',
    bookingId: 'TN1002',
    clientName: 'Ravi Kumar',
    pickup: 'Ahmedabad',
    drop: 'Pune',
    status: 'DELIVERED',
    createdAt: new Date().toISOString(),
    date: new Date().toISOString(),
  },
  {
    id: 'b3',
    bookingId: 'TN1003',
    clientName: 'Meera Shah',
    pickup: 'Pune',
    drop: 'Rajkot',
    status: 'IN_TRANSIT',
    createdAt: new Date().toISOString(),
    date: new Date().toISOString(),
  },
];
const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({
      bookingVolume: 3,
      bookingsByStatus: { PENDING: 1, DELIVERED: 1, IN_TRANSIT: 1 },
      bookingsOverTime: [],
    }),
  }));
});
afterAll(() => {
  global.fetch = originalFetch;
});

describe('admin overview', () => {
  it('renders real booking metrics and recent shipments without crashing', async () => {
    render(
      <DashboardView
        bookings={sampleBookings}
        bookingStatus="ready"
        onNavigate={jest.fn()}
        onRefresh={jest.fn()}
      />
    );
    expect(
      await screen.findByRole('heading', { name: /operations at a glance/i })
    ).not.toBeNull();
    const metrics = screen.getByRole('region', { name: 'Booking overview' });
    expect(
      within(metrics).getByText('Total bookings').parentElement.textContent
    ).toContain('3');
    expect(
      within(metrics).getByText('Pending').parentElement.textContent
    ).toContain('1');
    expect(screen.getByText('TN1001')).not.toBeNull();
    expect(screen.getByText('Vadodara')).not.toBeNull();
    expect(
      screen.getByRole('region', { name: 'Booking activity' })
    ).not.toBeNull();
  });

  it('does not present zero bookings as fact when data fails to load', () => {
    render(
      <DashboardView
        bookings={[]}
        bookingStatus="error"
        onNavigate={jest.fn()}
        onRefresh={jest.fn()}
      />
    );
    expect(screen.getByText(/could not load bookings/i)).not.toBeNull();
    const metrics = screen.getByRole('region', { name: 'Booking overview' });
    expect(within(metrics).getAllByText('—').length).toBeGreaterThan(0);
  });

  it('opens the booking section and refreshes using the provided callbacks', () => {
    const onNavigate = jest.fn();
    const onRefresh = jest.fn();
    render(
      <DashboardView
        bookings={sampleBookings}
        bookingStatus="ready"
        onNavigate={onNavigate}
        onRefresh={onRefresh}
      />
    );
    fireEvent.click(screen.getByRole('link', { name: /view all bookings/i }));
    expect(onNavigate).toHaveBeenCalledWith('bookings');
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    expect(onRefresh).toHaveBeenCalled();
  });
});
