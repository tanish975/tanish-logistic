import { getValidatedSession, hasSameOrigin, withAdminRoute } from '@/lib/session';
import { withRateLimit } from '@/lib/rate-limit';
import { verifyPublicSubmission } from '@/lib/bot-protection';
import prisma from '@/lib/prisma';

export const config = { api: { bodyParser: { sizeLimit: '16kb' } } };
const STATUSES = new Set(['pending', 'approved', 'rejected']);
const PLATFORMS = new Set(['Site', 'Google', 'Facebook', 'Instagram', 'Twitter', 'Trustpilot', 'Other']);

const createReview = withRateLimit(async function createReview(req, res) {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ message: 'Please complete the review form.' });
  }
  const name = body.name === undefined ? 'Anonymous' : body.name;
  if (typeof name !== 'string' || !name.trim() || name.length > 120 ||
      /[\u0000-\u001f\u007f]/.test(name) || typeof body.comment !== 'string' ||
      !body.comment.trim() || body.comment.length > 5000 ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(body.comment) ||
      !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
    return res.status(400).json({ message: 'Please provide a valid name, rating and review.' });
  }

  try {
    const { user } = await getValidatedSession(req, res);
    const isAdmin = user?.role === 'ADMIN';
    if (isAdmin && !hasSameOrigin(req)) {
      return res.status(403).json({ message: 'Forbidden. A same-origin request is required.' });
    }
    if (!isAdmin) {
      const verification = await verifyPublicSubmission(req);
      if (!verification.allowed) {
        return res.status(verification.status).json({ message: 'We could not verify your review. Please try again.' });
      }
    }
    const platform = isAdmin && PLATFORMS.has(body.platform) ? body.platform : 'Site';
    let date = new Date();
    if (isAdmin && body.date !== undefined) {
      if (typeof body.date !== 'string' || body.date.length > 30 || Number.isNaN(Date.parse(body.date))) {
        return res.status(400).json({ message: 'Please provide a valid review date.' });
      }
      date = new Date(body.date);
    }
    const newReview = await prisma.review.create({
      data: {
        platform,
        rating: body.rating,
        comment: body.comment.trim(),
        name: name.trim(),
        date,
        // Never accept moderation or publication state from the submitter.
        status: 'pending',
        isPublic: false,
      },
    });
    return res.status(201).json({ id: newReview.id, message: 'Review submitted for moderation.' });
  } catch {
    return res.status(500).json({ message: 'Unable to submit review.' });
  }
}, { limit: 5, windowMs: 10 * 60_000, name: 'review' });

const manageReviews = withAdminRoute(async function manageReviews(req, res) {
  try {
    if (req.method === 'GET') {
      const { status, all } = req.query || {};
      if (status !== undefined && !STATUSES.has(status)) {
        return res.status(400).json({ message: 'Invalid review status.' });
      }
      const where = all === 'true' ? {} : (status ? { status } : { isPublic: true, status: 'approved' });
      const reviews = await prisma.review.findMany({ where, orderBy: { createdAt: 'desc' } });
      return res.status(200).json(reviews);
    }
    if (req.method === 'PUT' || req.method === 'DELETE') {
      const { id, status } = req.body || {};
      if (typeof id !== 'string' || !id.trim() || id.length > 128) {
        return res.status(400).json({ message: 'Review ID is required.' });
      }
      if (req.method === 'DELETE') {
        await prisma.review.delete({ where: { id } });
        return res.status(200).json({ message: 'Review deleted successfully.' });
      }
      if (!STATUSES.has(status)) return res.status(400).json({ message: 'Invalid review status.' });
      const updatedReview = await prisma.review.update({
        where: { id },
        // Publication is tied to explicit admin approval.
        data: { status, isPublic: status === 'approved' },
      });
      return res.status(200).json(updatedReview);
    }
    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).json({ message: 'Method not allowed.' });
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ message: 'Review not found.' });
    return res.status(500).json({ message: 'Unable to manage reviews.' });
  }
});

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  return req.method === 'POST' ? createReview(req, res) : manageReviews(req, res);
}
