/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginForm from '../src/components/ui/LoginForm';

jest.mock(
  'next/link',
  () =>
    function MockLink({ children, href, ...props }) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
);
const originalFetch = global.fetch;
afterAll(() => {
  global.fetch = originalFetch;
});

describe('admin sign-in', () => {
  it('submits the existing credentials payload and reports the logged-in user', async () => {
    const user = { id: 'u1', role: 'ADMIN', name: 'Admin' };
    const onLoginSuccess = jest.fn();
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ user }),
    }));
    render(<LoginForm onLoginSuccess={onLoginSuccess} />);
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@example.invalid' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'a-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'admin@example.invalid',
            password: 'a-password',
          }),
        })
      )
    );
    await waitFor(() => expect(onLoginSuccess).toHaveBeenCalledWith(user));
  });

  it('shows a helpful error without treating a failed login as success', async () => {
    const onLoginSuccess = jest.fn();
    global.fetch = jest.fn(async () => ({
      ok: false,
      json: async () => ({ message: 'Invalid credentials.' }),
    }));
    render(<LoginForm onLoginSuccess={onLoginSuccess} />);
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@example.invalid' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect((await screen.findByRole('alert')).textContent).toContain(
      'Invalid credentials.'
    );
    expect(onLoginSuccess).not.toHaveBeenCalled();
  });
});
