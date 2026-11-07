/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import Contact from '../pages/contact';

jest.mock('react-hot-toast', () => {
  const toast = { success: jest.fn(), error: jest.fn() };
  toast.promise = jest.fn((promise, messages) => promise.then(
    (result) => {
      toast.success(messages.success(result));
      return result;
    },
    (error) => {
      toast.error(messages.error(error));
      throw error;
    },
  ));
  return { Toaster: () => null, toast };
});
jest.mock('@/components/Layout/Metadata', () => ({ SiteMetadata: () => null }));
jest.mock('@/components/Layout/PublicPage', () => ({
  PublicPageHero: ({ children }) => children,
  FinalCta: () => null,
}));
jest.mock('@/components/Animations/MovingTruckLoader', () => ({ MovingTruckLoader: () => null }));
jest.mock('@/components/ui/select', () => {
  const React = require('react');
  return {
    Select: ({ children }) => React.createElement(React.Fragment, null, children),
    SelectContent: () => null,
    SelectItem: () => null,
    SelectTrigger: ({ children }) => children,
    SelectValue: () => null,
  };
});

const originalFetch = global.fetch;

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn();
});

afterAll(() => {
  global.fetch = originalFetch;
});

function fillInquiry() {
  fireEvent.change(screen.getByLabelText('Full Name *'), { target: { value: 'Asha Patel' } });
  fireEvent.change(screen.getByLabelText('Email Address *'), { target: { value: 'asha@example.com' } });
  fireEvent.change(screen.getByLabelText('Phone Number *'), { target: { value: '+91 98765 43210' } });
  fireEvent.change(screen.getByLabelText('Freight Requirements & Route Details *'), { target: { value: 'Vadodara to Surat' } });
}

describe('contact form', () => {
  it('submits a genuine enquiry with an empty, inaccessible honeypot and resets on success', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ message: 'sent' }) });
    const { container } = render(<Contact />);
    const honeypot = container.querySelector('input[name="website"]');
    expect(honeypot.tabIndex).toBe(-1);
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(honeypot.getAttribute('autocomplete')).toBe('off');
    fillInquiry();

    fireEvent.click(screen.getByRole('button', { name: 'Submit Freight Inquiry' }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(global.fetch.mock.calls[0][0]).toBe('/api/send-email/');
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)).toEqual(expect.objectContaining({
      name: 'Asha Patel',
      email: 'asha@example.com',
      website: '',
    }));
    await waitFor(() => expect(screen.getByLabelText('Full Name *').value).toBe(''));
    expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('Inquiry sent'));
  });

  it('accepts phone numbers written with local decimal digits', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ message: 'sent' }) });
    render(<Contact />);
    fillInquiry();
    fireEvent.change(screen.getByLabelText('Phone Number *'), { target: { value: '+९१ ९८७६५ ४३२१०' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit Freight Inquiry' }));
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
    expect(JSON.parse(global.fetch.mock.calls[0][1].body).phone).toBe('+९१ ९८७६५ ४३२१०');
  });

  it('shows verification errors, preserves the enquiry, and allows a retry', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'We could not verify your submission. Please call us.' }),
    });
    render(<Contact />);
    fillInquiry();
    fireEvent.click(screen.getByRole('button', { name: 'Submit Freight Inquiry' }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('could not verify')));
    expect(screen.getByLabelText('Full Name *').value).toBe('Asha Patel');
    expect(screen.getByRole('button', { name: 'Submit Freight Inquiry' }).disabled).toBe(false);
  });

  it('tells the customer when the inquiry arrived but confirmation delivery failed', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({ warning: 'Confirmation email failed' }) });
    render(<Contact />);
    fillInquiry();
    fireEvent.click(screen.getByRole('button', { name: 'Submit Freight Inquiry' }));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('could not send a confirmation email')));
    expect(screen.getByLabelText('Full Name *').value).toBe('');
  });

  it('shows a telephone fallback when an error response is not JSON', async () => {
    global.fetch.mockResolvedValue({ ok: false, json: async () => { throw new Error('not JSON'); } });
    render(<Contact />);
    fillInquiry();
    fireEvent.click(screen.getByRole('button', { name: 'Submit Freight Inquiry' }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('+91 99242 04744')));
    expect(screen.getByLabelText('Full Name *').value).toBe('Asha Patel');
  });
});
