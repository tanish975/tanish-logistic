/** @jest-environment jsdom */
import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import AdminPage from '../pages/admin';

const mockRouter = { isReady: true, query: {} };
jest.mock('next/router', () => ({ useRouter: () => mockRouter }));
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
        href: typeof href === 'string' ? href : '#',
        onClick: (event) => {
          event.preventDefault();
          onClick?.(event);
        },
      },
      children
    );
  };
});
jest.mock('sonner', () => ({
  Toaster: () => null,
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));
jest.mock('@/components/ui/LoginForm', () => () => 'Login prompt');
jest.mock('@/components/admin/DashboardView', () => {
  const React = require('react');
  return function MockDashboard({ onNavigate }) {
    return React.createElement(
      'section',
      null,
      React.createElement('h2', null, 'Overview content'),
      React.createElement(
        'button',
        { type: 'button', onClick: () => onNavigate('bookings') },
        'View all bookings'
      )
    );
  };
});
jest.mock('@/components/admin/RoutesView', () => () => 'Routes section');
jest.mock('@/components/admin/CustomersView', () => () => 'Customers section');
jest.mock('@/components/admin/ReviewsView', () => () => 'Reviews section');
jest.mock('../pages/settings', () => () => 'Settings section');

const originalFetch = global.fetch;
const sampleBookings = [
  {
    id: 'b1',
    bookingId: 'TN1001',
    clientName: 'Asha Patel',
    companyName: 'Sample Industries',
    pickup: 'Vadodara',
    drop: 'Surat',
    status: 'PENDING',
    date: '2026-10-30T00:00:00.000Z',
    createdAt: '2026-10-29T00:00:00.000Z',
  },
  {
    id: 'b2',
    bookingId: 'TN1002',
    clientName: 'Ravi Kumar',
    companyName: 'Sample Cargo',
    pickup: 'Ahmedabad',
    drop: 'Pune',
    status: 'DELIVERED',
    date: '2026-10-28T00:00:00.000Z',
    createdAt: '2026-10-27T00:00:00.000Z',
  },
];

function response(data, ok = true, status = 200) {
  return { ok, status, json: async () => data };
}

beforeEach(() => {
  mockRouter.isReady = true;
  mockRouter.query = {};
  global.fetch = jest.fn(async (url) => {
    if (url === '/api/user')
      return response({
        isLoading: false,
        user: {
          role: 'ADMIN',
          name: 'Tanish Admin',
          email: 'admin@example.invalid',
        },
      });
    if (url === '/api/get-bookings')
      return response(sampleBookings.map((booking) => ({ ...booking })));
    if (url === '/api/reviews?all=true')
      return response([{ id: 'r1', status: 'pending' }]);
    if (url === '/api/update-booking-status')
      return response({ message: 'Updated' });
    if (url === '/api/delete-booking') return response({ message: 'Deleted' });
    if (url === '/api/logout') return response({ message: 'Logged out' });
    throw new Error(`Unexpected request: ${url}`);
  });
});

afterAll(() => {
  global.fetch = originalFetch;
});

describe('admin navigation and responsive workspace', () => {
  it('renders the authenticated overview and labelled navigation', async () => {
    render(<AdminPage />);
    await screen.findByRole('heading', { name: 'Overview content' });
    const nav = screen.getByRole('navigation', { name: 'Admin navigation' });
    expect(
      within(nav)
        .getByRole('link', { name: /Dashboard/ })
        .getAttribute('aria-current')
    ).toBe('page');
    expect(
      within(nav)
        .getByRole('link', { name: /Bookings/ })
        .getAttribute('href')
    ).toContain('section=bookings');
    expect(within(nav).getByRole('link', { name: /Reviews/ })).not.toBeNull();
    expect(screen.getByText('Tanish Admin')).not.toBeNull();
  });

  it('opens a deep-linked section on page load', async () => {
    mockRouter.query = { section: 'routes' };
    render(<AdminPage />);
    await screen.findByText('Routes section');
    const nav = screen.getByRole('navigation', { name: 'Admin navigation' });
    expect(
      within(nav)
        .getByRole('link', { name: /Routes/ })
        .getAttribute('aria-current')
    ).toBe('page');
  });

  it('opens and closes the mobile navigation when selecting a section', async () => {
    render(<AdminPage />);
    await screen.findByRole('heading', { name: 'Overview content' });
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    const dialog = await screen.findByRole('dialog', {
      name: 'Admin navigation',
    });
    fireEvent.click(within(dialog).getByRole('link', { name: /Customers/ }));
    await screen.findByText('Customers section');
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Admin navigation' })
      ).toBeNull()
    );
  });

  it('makes the dashboard booking shortcut, search and status filter work', async () => {
    render(<AdminPage />);
    fireEvent.click(
      await screen.findByRole('button', { name: 'View all bookings' })
    );
    await screen.findByRole('heading', { name: 'All bookings' });
    await screen.findAllByText('Asha Patel');
    fireEvent.change(screen.getByLabelText('Search bookings'), {
      target: { value: 'Surat' },
    });
    expect(screen.getAllByText('Asha Patel').length).toBeGreaterThan(0);
    expect(screen.queryByText('Ravi Kumar')).toBeNull();
    fireEvent.change(screen.getByLabelText('Search bookings'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByLabelText('Filter bookings by status'), {
      target: { value: 'DELIVERED' },
    });
    expect(screen.getAllByText('Ravi Kumar').length).toBeGreaterThan(0);
    expect(screen.queryByText('Asha Patel')).toBeNull();
  });

  it('keeps non-admin visitors at the login prompt', async () => {
    global.fetch.mockImplementationOnce(async () =>
      response({ isLoading: false, user: null })
    );
    render(<AdminPage />);
    await screen.findByText('Login prompt');
    expect(
      screen.queryByRole('navigation', { name: 'Admin navigation' })
    ).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not open the workspace for a signed-in non-admin user', async () => {
    global.fetch.mockImplementationOnce(async () =>
      response({ isLoading: false, user: { id: 'u1', role: 'USER' } })
    );
    render(<AdminPage />);
    await screen.findByText('Login prompt');
    expect(
      screen.queryByRole('navigation', { name: 'Admin navigation' })
    ).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe('booking and session actions', () => {
  const openBookings = async () => {
    render(<AdminPage />);
    fireEvent.click(
      await screen.findByRole('button', { name: 'View all bookings' })
    );
    await screen.findAllByText('TN1001');
  };

  it('updates the real booking identifier and updates the displayed status', async () => {
    await openBookings();
    fireEvent.change(
      screen.getAllByLabelText('Update status for booking TN1001')[0],
      { target: { value: 'CONFIRMED' } }
    );
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/update-booking-status',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ bookingId: 'b1', newStatus: 'CONFIRMED' }),
        })
      )
    );
    await waitFor(() =>
      expect(
        screen.getAllByLabelText('Update status for booking TN1001')[0].value
      ).toBe('CONFIRMED')
    );
  });

  it('does not change the displayed status when an update fails', async () => {
    const base = global.fetch.getMockImplementation();
    global.fetch.mockImplementation((url, options) =>
      url === '/api/update-booking-status'
        ? response({ message: 'Error' }, false, 500)
        : base(url, options)
    );
    await openBookings();
    fireEvent.change(
      screen.getAllByLabelText('Update status for booking TN1001')[0],
      { target: { value: 'CONFIRMED' } }
    );
    await waitFor(() =>
      expect(
        screen.getAllByLabelText('Update status for booking TN1001')[0].value
      ).toBe('PENDING')
    );
  });

  it('asks for confirmation before deleting a booking', async () => {
    await openBookings();
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Delete booking TN1001' })[0]
    );
    let dialog = await screen.findByRole('dialog', {
      name: 'Delete this booking?',
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(
      global.fetch.mock.calls.some(([url]) => url === '/api/delete-booking')
    ).toBe(false);

    fireEvent.click(
      screen.getAllByRole('button', { name: 'Delete booking TN1001' })[0]
    );
    dialog = await screen.findByRole('dialog', {
      name: 'Delete this booking?',
    });
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Delete booking' })
    );
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/delete-booking',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({ id: 'b1' }),
        })
      )
    );
    await waitFor(() => expect(screen.queryByText('TN1001')).toBeNull());
    expect(screen.getAllByText('TN1002').length).toBeGreaterThan(0);
  });

  it('confirms and deletes only cancelled bookings in bulk', async () => {
    const base = global.fetch.getMockImplementation();
    global.fetch.mockImplementation((url, options) =>
      url === '/api/get-bookings'
        ? response([
            ...sampleBookings,
            {
              id: 'b3',
              bookingId: 'TN1003',
              clientName: 'Neha',
              status: 'CANCELLED',
            },
          ])
        : base(url, options)
    );
    await openBookings();
    await screen.findAllByText('TN1003');
    fireEvent.click(
      screen.getByRole('button', { name: 'Delete all cancelled' })
    );
    const dialog = await screen.findByRole('dialog', {
      name: 'Delete all cancelled bookings?',
    });
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Delete cancelled bookings' })
    );
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/delete-booking',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ deleteAllCancelled: true }),
        })
      )
    );
    await waitFor(() => expect(screen.queryByText('TN1003')).toBeNull());
    expect(screen.getAllByText('TN1001').length).toBeGreaterThan(0);
  });

  it('confirms sign out and returns to the login prompt', async () => {
    render(<AdminPage />);
    await screen.findByRole('heading', { name: 'Overview content' });
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    const dialog = await screen.findByRole('dialog', { name: 'Sign out?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Sign out' }));
    await screen.findByText('Login prompt');
    expect(global.fetch).toHaveBeenCalledWith('/api/logout', {
      method: 'POST',
    });
  });

  it('clears the visible workspace but warns if server-side revocation fails', async () => {
    const base = global.fetch.getMockImplementation();
    global.fetch.mockImplementation((url, options) =>
      url === '/api/logout'
        ? Promise.resolve(response({ localSessionCleared: true }, false, 503))
        : base(url, options)
    );
    const { toast } = require('sonner');
    render(<AdminPage />);
    await screen.findByRole('heading', { name: 'Overview content' });
    fireEvent.click(screen.getByRole('button', { name: 'Sign out' }));
    const dialog = await screen.findByRole('dialog', { name: 'Sign out?' });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Sign out' }));
    await screen.findByText('Login prompt');
    expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('other sessions could not be revoked'));
  });

  it('returns to login when the booking request reports an expired session', async () => {
    const base = global.fetch.getMockImplementation();
    global.fetch.mockImplementation((url, options) =>
      url === '/api/get-bookings'
        ? response({}, false, 401)
        : base(url, options)
    );
    render(<AdminPage />);
    await screen.findByText('Login prompt');
    expect(
      screen.queryByRole('navigation', { name: 'Admin navigation' })
    ).toBeNull();
  });
});
