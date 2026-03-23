import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { pending, all } = req.query;
        
        let where = {};
        
        // If requesting all reviews (for admin)
        if (all !== 'true') {
          // If not requesting all, filter by status
          if (pending === 'true') {
            where.status = 'pending';
          } else {
            // Return only approved reviews by default (for public display)
            where.status = 'approved';
          }
        }
        
        const reviews = await prisma.review.findMany({
          where,
          orderBy: { createdAt: 'desc' },
        });
        
        res.status(200).json(reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        if (error.message && error.message.includes('connection')) {
          res.status(503).json({ error: 'Database connection error. Please try again later.', details: error.message });
        } else {
          res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
        }
      }
      break;

    case 'POST':
      try {
        const { platform, rating, comment, date, name, isPublic } = req.body;
        
        if (!rating || !comment) {
          return res.status(400).json({ error: 'Rating and comment are required' });
        }

        const newReview = await prisma.review.create({
          data: {
            platform: platform || 'Site',
            rating: parseInt(rating),
            comment,
            name: name || 'Anonymous',
            date: date ? new Date(date) : new Date(),
            status: isPublic === true ? 'approved' : 'pending',
            isPublic: isPublic || false,
          },
        });

        res.status(201).json({ 
          success: true, 
          message: isPublic === true ? 'Review submitted and published!' : 'Review submitted for moderation!',
          review: newReview 
        });
      } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Failed to add review', details: error.message });
      }
      break;

    case 'PUT':
      try {
        const { id, status } = req.body;
        
        const updatedReview = await prisma.review.update({
          where: { id },
          data: { status },
        });

        res.status(200).json({ success: true, review: updatedReview });
      } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review status', details: error.message });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await prisma.review.delete({
          where: { id },
        });
        res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review', details: error.message });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
