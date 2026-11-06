/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import CustomersView from '../src/components/admin/CustomersView';
import RoutesView from '../src/components/admin/RoutesView';

const originalFetch = global.fetch;
afterAll(() => {
  global.fetch = originalFetch;
});

describe('routes', () => {
  it('shows route counts from the existing API and refreshes them', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => [{ pickup: 'Vadodara', drop: 'Surat', count: 3 }],
    }));
    render(<RoutesView />);
    await screen.findAllByText('Vadodara');
    expect(screen.getByText('3 bookings')).not.toBeNull();
    expect(global.fetch).toHaveBeenCalledWith('/api/routes');
    fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });

  it('shows a retryable error instead of an empty state on failure', async () => {
    global.fetch = jest.fn(async () => ({ ok: false }));
    render(<RoutesView />);
    expect(await screen.findByRole('alert')).not.toBeNull();
    expect(screen.queryByText(/no routes available/i)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
  });
});

describe('customers', () => {
  it('supports name, phone and email search without dropping booking details', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => [
        {
          name: 'Asha Patel',
          phone: '9876543210',
          email: 'asha@example.invalid',
          totalBookings: 2,
          lastBookingDate: '2026-10-29',
        },
        {
          name: 'Ravi Kumar',
          phone: '9870000000',
          email: 'ravi@example.invalid',
          totalBookings: 1,
          lastBookingDate: '2026-10-30',
        },
      ],
    }));
    render(<CustomersView />);
    await screen.findAllByText('Asha Patel');
    expect(screen.getByText('2 bookings')).not.toBeNull();
    fireEvent.change(screen.getByLabelText('Search customers'), {
      target: { value: '987654' },
    });
    expect(screen.queryByText('Ravi Kumar')).toBeNull();
    fireEvent.change(screen.getByLabelText('Search customers'), {
      target: { value: 'ravi@example.invalid' },
    });
    expect(screen.getAllByText('Ravi Kumar').length).toBeGreaterThan(0);
    expect(screen.queryByText('Asha Patel')).toBeNull();
  });

  it('shows a retryable error instead of reporting no customers', async () => {
    global.fetch = jest.fn(async () => ({ ok: false }));
    render(<CustomersView />);
    expect(await screen.findByRole('alert')).not.toBeNull();
    expect(screen.queryByText(/no customers found/i)).toBeNull();
  });
});
