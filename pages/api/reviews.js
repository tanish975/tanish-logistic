import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';
import prisma from '@/lib/prisma';

export default async function reviewsRoute(req, res) {
  const session = await getIronSession(req, res, sessionOptions);

  // Check if user is authenticated and is admin
  if (!session.user || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Unauthorized. Admin access required.' });
  }

  try {
    if (req.method === 'GET') {
      // Fetch all reviews with optional status filter
      const { status } = req.query;
      const where = status ? { status } : {};

      const reviews = await prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return res.status(200).json(reviews);
    }

    if (req.method === 'POST') {
      const { platform, rating, comment, name = 'Anonymous', date, status = 'pending', isPublic = false } = req.body;

      if (!platform || !rating || !comment) {
        return res.status(400).json({ message: 'Platform, rating, and comment are required.' });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
      }

      const reviewDate = date ? new Date(date) : new Date();

      const newReview = await prisma.review.create({
        data: {
          platform,
          rating,
          comment,
          name,
          date: reviewDate,
          status,
          isPublic,
        },
      });

      return res.status(201).json(newReview);
    }

    if (req.method === 'PUT') {
      const { id, status: newStatus, isPublic } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Review ID is required.' });
      }

      const updateData = {};
      if (newStatus !== undefined) updateData.status = newStatus;
      if (isPublic !== undefined) updateData.isPublic = isPublic;

      const updatedReview = await prisma.review.update({
        where: { id },
        data: updateData,
      });

      return res.status(200).json(updatedReview);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Review ID is required.' });
      }

      await prisma.review.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Review deleted successfully.' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    // P2025: Record to update not found
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Review not found.' });
    }

    return res.status(500).json({ message: 'Internal server error.' });
  }
}
