/** @jest-environment jsdom */
import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import ReviewsView from '../src/components/admin/ReviewsView';

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const originalFetch = global.fetch;
const reviews = [
  {
    id: 'r1',
    name: 'Asha',
    platform: 'Site',
    rating: 5,
    comment: 'Great service',
    status: 'approved',
    date: '2026-10-30',
  },
  {
    id: 'r2',
    name: 'Ravi',
    platform: 'Google',
    rating: 4,
    comment: 'Please review',
    status: 'pending',
    date: '2026-10-29',
  },
  {
    id: 'r3',
    name: 'Meera',
    platform: 'Site',
    rating: 1,
    comment: 'Rejected feedback',
    status: 'rejected',
    date: '2026-10-28',
  },
];

beforeEach(() => {
  global.fetch = jest.fn(async () => ({ ok: true, json: async () => ({}) }));
});
afterAll(() => {
  global.fetch = originalFetch;
});

describe('review management', () => {
  it('keeps rejected reviews separate from approved review metrics', () => {
    render(<ReviewsView reviews={reviews} onRefresh={jest.fn()} />);
    expect(screen.getByText('5.0')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Approved (1)' })).not.toBeNull();
    expect(screen.queryByText('Rejected feedback')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Rejected (1)' }));
    expect(screen.getByText('Rejected feedback')).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Delete review by Meera' })
    ).not.toBeNull();
  });

  it('sends approval and rejection to the existing review API', async () => {
    const onRefresh = jest.fn().mockResolvedValue();
    render(<ReviewsView reviews={reviews} onRefresh={onRefresh} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pending (1)' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Approve review by Ravi' })
    );
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/reviews',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ id: 'r2', status: 'approved' }),
        })
      )
    );
    await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Reject review by Ravi' }).disabled
      ).toBe(false)
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Reject review by Ravi' })
    );
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/reviews',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ id: 'r2', status: 'rejected' }),
        })
      )
    );
  });

  it('requires confirmation before deleting a review', async () => {
    const onRefresh = jest.fn().mockResolvedValue();
    render(<ReviewsView reviews={reviews} onRefresh={onRefresh} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Delete review by Asha' })
    );
    let dialog = await screen.findByRole('dialog', {
      name: 'Delete this review?',
    });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(global.fetch).not.toHaveBeenCalled();
    fireEvent.click(
      screen.getByRole('button', { name: 'Delete review by Asha' })
    );
    dialog = await screen.findByRole('dialog', { name: 'Delete this review?' });
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Delete review' })
    );
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/reviews',
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ id: 'r1' }),
        })
      )
    );
    await waitFor(() => expect(onRefresh).toHaveBeenCalled());
  });

  it('adds an external review using the existing request shape', async () => {
    const onRefresh = jest.fn().mockResolvedValue();
    render(<ReviewsView reviews={reviews} onRefresh={onRefresh} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Add external review' })
    );
    fireEvent.change(screen.getByLabelText('Platform'), {
      target: { value: 'Trustpilot' },
    });
    fireEvent.change(screen.getByLabelText('Rating'), {
      target: { value: '4' },
    });
    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2026-10-25' },
    });
    fireEvent.change(screen.getByLabelText('Comment'), {
      target: { value: 'External feedback' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add review' }));
    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/reviews',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            platform: 'Trustpilot',
            rating: 4,
            comment: 'External feedback',
            date: '2026-10-25',
          }),
        })
      )
    );
    await waitFor(() => expect(onRefresh).toHaveBeenCalled());
  });

  it('keeps reviews with unexpected statuses accessible', () => {
    render(
      <ReviewsView
        reviews={[
          ...reviews,
          { id: 'r4', status: 'legacy', rating: 3, comment: 'Old record' },
        ]}
        onRefresh={jest.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Other (1)' }));
    expect(screen.getByText('Old record')).not.toBeNull();
  });
});
