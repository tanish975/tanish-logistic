/** @jest-environment jsdom */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SettingsPage from '../pages/settings';
import { FileUpload } from '../src/components/ui/FileUpload';

jest.mock('sonner', () => ({
  Toaster: () => null,
  toast: { success: jest.fn(), error: jest.fn() },
}));
const originalFetch = global.fetch;
const settings = {
  siteName: 'Tanish Logistic',
  slogan: 'A slogan',
  primaryColor: '#0369a1',
  secondaryColor: '#0f172a',
  defaultPostStatus: 'draft',
  commentModeration: 'manual',
};
afterAll(() => {
  global.fetch = originalFetch;
});

describe('admin settings', () => {
  it('loads and saves existing settings when embedded', async () => {
    global.fetch = jest.fn(async (_url, options) =>
      options?.method === 'POST'
        ? { ok: true, json: async () => ({}) }
        : { ok: true, json: async () => settings }
    );
    render(<SettingsPage embedded />);
    const siteName = await screen.findByLabelText('Site Name');
    await waitFor(() => expect(siteName.value).toBe('Tanish Logistic'));
    expect(screen.getByLabelText('Default Post Status')).not.toBeNull();
    expect(
      document.querySelectorAll('select option[value="draft"]')
    ).toHaveLength(1);
    fireEvent.change(siteName, { target: { value: 'Updated name' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save All Settings' }));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/settings/general',
        expect.objectContaining({ method: 'POST' })
      )
    );
    const [, options] = global.fetch.mock.calls.find(
      ([, request]) => request?.method === 'POST'
    );
    expect(JSON.parse(options.body)).toEqual(
      expect.objectContaining({
        siteName: 'Updated name',
        defaultPostStatus: 'draft',
        commentModeration: 'manual',
      })
    );
  });

  it('does not offer a blank form when settings fail to load', async () => {
    global.fetch = jest.fn(async () => ({ ok: false }));
    render(<SettingsPage embedded />);
    expect((await screen.findByRole('alert')).textContent).toContain(
      'Could not load settings'
    );
    expect(
      screen.queryByRole('button', { name: 'Save All Settings' })
    ).toBeNull();
  });

  it('uploads a logo without submitting the surrounding settings form', async () => {
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ url: '/sample-logo.png' }),
    }));
    const onSubmit = jest.fn((event) => event.preventDefault());
    const onUploadSuccess = jest.fn();
    render(
      <form onSubmit={onSubmit}>
        <label htmlFor="logo">Logo</label>
        <FileUpload id="logo" onUploadSuccess={onUploadSuccess} />
      </form>
    );
    fireEvent.change(screen.getByLabelText('Logo'), {
      target: {
        files: [new File(['sample'], 'logo.png', { type: 'image/png' })],
      },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Upload' }));
    await waitFor(() =>
      expect(onUploadSuccess).toHaveBeenCalledWith('/sample-logo.png')
    );
    expect(onSubmit).not.toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/upload',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
