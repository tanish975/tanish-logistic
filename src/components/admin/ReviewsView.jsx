import { useMemo, useState } from 'react';
import {
  Check,
  Clock3,
  MessageSquare,
  Plus,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatBookingDate } from '@/lib/admin-display';

function reviewActivity(reviews) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      label: new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(date),
      count: reviews.filter((review) => {
        const reviewDate = new Date(review.date);
        return (
          reviewDate.getMonth() === date.getMonth() &&
          reviewDate.getFullYear() === date.getFullYear()
        );
      }).length,
    };
  });
}

const selectClass =
  'h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600';
const primaryButtonClass =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-sky-700 px-3.5 text-sm font-semibold text-white transition hover:bg-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60';

const ReviewsView = ({ reviews, onRefresh }) => {
  const [activeFilter, setActiveFilter] = useState('approved');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReview, setNewReview] = useState({
    platform: 'Google',
    rating: 5,
    comment: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isAdding, setIsAdding] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const groupedReviews = useMemo(
    () => ({
      approved: reviews.filter((review) => review.status === 'approved'),
      pending: reviews.filter((review) => review.status === 'pending'),
      rejected: reviews.filter((review) => review.status === 'rejected'),
      other: reviews.filter(
        (review) => !['approved', 'pending', 'rejected'].includes(review.status)
      ),
    }),
    [reviews]
  );
  const { approved, pending, rejected, other } = groupedReviews;
  const displayed = groupedReviews[activeFilter] || [];
  const averageRating = approved.length
    ? (
        approved.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        approved.length
      ).toFixed(1)
    : '—';
  const platforms = [
    ...new Set(approved.map((review) => review.platform).filter(Boolean)),
  ];
  const activity = useMemo(() => reviewActivity(approved), [approved]);
  const maxActivity = Math.max(1, ...activity.map((month) => month.count));

  const handleAddReview = async (event) => {
    event.preventDefault();
    if (isAdding) return;
    setIsAdding(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (!response.ok) throw new Error('Failed to add review');
      toast.success('Review added.');
      setShowAddForm(false);
      setNewReview({
        platform: 'Google',
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0],
      });
      if (onRefresh) await onRefresh();
    } catch {
      toast.error('Could not add the review. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const updateReview = async (id, status) => {
    if (actionId) return;
    setActionId(id);
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error('Failed to update review');
      toast.success(
        status === 'approved' ? 'Review approved.' : 'Review rejected.'
      );
      if (onRefresh) await onRefresh();
    } catch {
      toast.error('Could not update the review. Please try again.');
    } finally {
      setActionId(null);
    }
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete || actionId) return;
    setActionId(reviewToDelete);
    try {
      const response = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reviewToDelete }),
      });
      if (!response.ok) throw new Error('Failed to delete review');
      toast.success('Review deleted.');
      setReviewToDelete(null);
      if (onRefresh) await onRefresh();
    } catch {
      toast.error('Could not delete the review. Please try again.');
    } finally {
      setActionId(null);
    }
  };

  const filters = [
    { id: 'approved', label: 'Approved', count: approved.length },
    { id: 'pending', label: 'Pending', count: pending.length },
    { id: 'rejected', label: 'Rejected', count: rejected.length },
    ...(other.length
      ? [{ id: 'other', label: 'Other', count: other.length }]
      : []),
  ];

  return (
    <section className="space-y-5 pb-8" aria-labelledby="reviews-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-sky-700">
            CUSTOMER FEEDBACK
          </p>
          <h2
            id="reviews-title"
            className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-[28px]"
          >
            Reviews
          </h2>
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            Review customer feedback and manage submissions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className={primaryButtonClass}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {showAddForm ? 'Close form' : 'Add external review'}
        </button>
      </div>

      <section
        className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4"
        aria-label="Review overview"
      >
        {[
          {
            label: 'Average rating',
            value: averageRating,
            note: 'Approved reviews',
            icon: Star,
            color: 'bg-amber-50 text-amber-700',
          },
          {
            label: 'Approved',
            value: approved.length,
            note: 'Reviews approved',
            icon: Check,
            color: 'bg-emerald-50 text-emerald-700',
          },
          {
            label: 'Pending',
            value: pending.length,
            note: 'Awaiting review',
            icon: Clock3,
            color: 'bg-sky-50 text-sky-700',
          },
          {
            label: 'Platforms',
            value: platforms.length,
            note: 'For approved reviews',
            icon: MessageSquare,
            color: 'bg-indigo-50 text-indigo-700',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-500">
                {item.label}
              </p>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {item.value}
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-500">{item.note}</p>
          </div>
        ))}
      </section>

      {showAddForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
          <h3 className="text-base font-bold text-slate-900">
            Add external review
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Add feedback from another platform to the review list.
          </p>
          <form onSubmit={handleAddReview} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="review-platform"
                  className="text-sm font-semibold text-slate-700"
                >
                  Platform
                </label>
                <select
                  id="review-platform"
                  value={newReview.platform}
                  onChange={(event) =>
                    setNewReview({ ...newReview, platform: event.target.value })
                  }
                  className={selectClass}
                >
                  <option>Google</option>
                  <option>Facebook</option>
                  <option>Instagram</option>
                  <option>Twitter</option>
                  <option>Trustpilot</option>
                  <option value="Site">Your website</option>
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="review-rating"
                  className="text-sm font-semibold text-slate-700"
                >
                  Rating
                </label>
                <select
                  id="review-rating"
                  value={newReview.rating}
                  onChange={(event) =>
                    setNewReview({
                      ...newReview,
                      rating: Number(event.target.value),
                    })
                  }
                  className={selectClass}
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} {rating === 1 ? 'star' : 'stars'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="review-date"
                  className="text-sm font-semibold text-slate-700"
                >
                  Date
                </label>
                <Input
                  id="review-date"
                  type="date"
                  value={newReview.date}
                  onChange={(event) =>
                    setNewReview({ ...newReview, date: event.target.value })
                  }
                  className="border-slate-200 focus-visible:ring-sky-600"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="review-comment"
                className="text-sm font-semibold text-slate-700"
              >
                Comment
              </label>
              <Textarea
                id="review-comment"
                value={newReview.comment}
                onChange={(event) =>
                  setNewReview({ ...newReview, comment: event.target.value })
                }
                placeholder="Enter the customer's review"
                required
                rows={3}
                className="border-slate-200 focus-visible:ring-sky-600"
              />
            </div>
            <button
              type="submit"
              disabled={isAdding}
              className={primaryButtonClass}
            >
              {isAdding ? 'Adding…' : 'Add review'}
            </button>
          </form>
        </div>
      )}

      <div
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6"
        role="region"
        aria-label="Review activity"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Review activity
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Approved reviews over the last 6 months
            </p>
          </div>
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            Last 6 months
          </span>
        </div>
        <div
          className="mt-5 flex h-32 items-end justify-around gap-2 border-b border-slate-200 px-1"
          aria-hidden="true"
        >
          {activity.map((month) => (
            <div
              key={month.label}
              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
            >
              <span className="mb-1 text-[11px] font-semibold text-slate-500">
                {month.count}
              </span>
              <span
                className="w-full max-w-[44px] rounded-t-md bg-sky-700"
                style={{
                  height: `${month.count ? Math.max((month.count / maxActivity) * 78, 4) : 0}%`,
                }}
              />
            </div>
          ))}
        </div>
        <div
          className="mt-2 flex justify-around gap-2 px-1 text-center text-[11px] text-slate-500"
          aria-hidden="true"
        >
          {activity.map((month) => (
            <span key={month.label} className="flex-1">
              {month.label}
            </span>
          ))}
        </div>
        <p className="sr-only">
          {activity.map((month) => `${month.label}: ${month.count}`).join(', ')}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
        <div className="space-y-4 border-b border-slate-100 px-4 py-5 sm:px-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Review list</h3>
            <p className="mt-1 text-xs text-slate-500">
              Choose a status to see its reviews.
            </p>
          </div>
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter reviews"
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={activeFilter === filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`min-h-9 rounded-lg border px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${activeFilter === filter.id ? 'border-sky-700 bg-sky-700 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
        {displayed.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-semibold text-slate-800">
              No {activeFilter} reviews
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {activeFilter === 'pending'
                ? 'There are no reviews awaiting approval.'
                : 'Reviews in this status will appear here.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {displayed.map((review) => (
              <li key={review.id} className="space-y-3 px-4 py-5 sm:px-5">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs">
                  <span className="min-w-0 break-words [overflow-wrap:anywhere] rounded-md bg-sky-50 px-2 py-1 font-bold text-sky-800">
                    {review.platform || 'Unknown platform'}
                  </span>
                  {review.name && (
                    <span className="min-w-0 break-words [overflow-wrap:anywhere] font-semibold text-slate-700">
                      {review.name}
                    </span>
                  )}
                  <span className="text-slate-500">
                    {formatBookingDate(review.date)}
                  </span>
                  {activeFilter === 'other' && (
                    <span className="break-all text-slate-500">
                      {review.status || 'Unknown status'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="sr-only">
                    {review.rating} out of 5 stars
                  </span>
                  {[0, 1, 2, 3, 4].map((index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${index < Number(review.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      aria-hidden="true"
                    />
                  ))}
                  <span
                    aria-hidden="true"
                    className="ml-1 text-xs font-semibold text-slate-600"
                  >
                    {review.rating} / 5
                  </span>
                </div>
                <p className="break-words [overflow-wrap:anywhere] text-sm leading-6 text-slate-700">
                  {review.comment}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {activeFilter === 'pending' ? (
                    <>
                      <button
                        type="button"
                        disabled={Boolean(actionId)}
                        onClick={() => updateReview(review.id, 'approved')}
                        aria-label={`Approve review by ${review.name || 'Anonymous'}`}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-md bg-emerald-700 px-3 text-xs font-semibold text-white hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 disabled:opacity-50"
                      >
                        <Check className="h-4 w-4" aria-hidden="true" /> Approve
                      </button>
                      <button
                        type="button"
                        disabled={Boolean(actionId)}
                        onClick={() => updateReview(review.id, 'rejected')}
                        aria-label={`Reject review by ${review.name || 'Anonymous'}`}
                        className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-rose-200 px-3 text-xs font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50"
                      >
                        <X className="h-4 w-4" aria-hidden="true" /> Reject
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReviewToDelete(review.id)}
                      aria-label={`Delete review by ${review.name || 'Anonymous'}`}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog
        open={Boolean(reviewToDelete)}
        onOpenChange={(open) => {
          if (!open && !actionId) setReviewToDelete(null);
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] rounded-xl">
          <DialogHeader>
            <DialogTitle>Delete this review?</DialogTitle>
            <DialogDescription>
              This will permanently remove the review. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              disabled={Boolean(actionId)}
              onClick={() => setReviewToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-rose-700 text-white hover:bg-rose-800"
              disabled={Boolean(actionId)}
              onClick={confirmDeleteReview}
            >
              {actionId ? 'Deleting…' : 'Delete review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReviewsView;
