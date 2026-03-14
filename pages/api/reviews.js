import fs from 'fs';
import path from 'path';

const reviewsFilePath = path.join(process.cwd(), 'public', 'data', 'reviews.json');

// Helper to read reviews
const readReviews = () => {
  try {
    const data = fs.readFileSync(reviewsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper to write reviews
const writeReviews = (reviews) => {
  fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2));
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { pending } = req.query;
        const reviews = readReviews();
        
        // If requesting pending reviews
        if (pending === 'true') {
          return res.status(200).json(reviews.filter(r => r.status === 'pending'));
        }
        
        // Return only approved reviews by default (for public display)
        res.status(200).json(reviews.filter(r => r.status !== 'pending'));
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
      }
      break;

    case 'POST':
      try {
        const { platform, rating, comment, date, name, isPublic } = req.body;
        
        if (!rating || !comment) {
          return res.status(400).json({ error: 'Rating and comment are required' });
        }

        const reviews = readReviews();
        const newReview = {
          id: reviews.length + 1,
          platform: platform || 'Site',
          rating: parseInt(rating),
          comment,
          name: name || 'Anonymous',
          date: date || new Date().toISOString().split('T')[0],
          status: isPublic === true ? 'approved' : 'pending', // Public submissions need approval
          isPublic: isPublic || false
        };

        reviews.unshift(newReview); // Add to beginning
        writeReviews(reviews);

        res.status(201).json({ 
          success: true, 
          message: isPublic === true ? 'Review submitted and published!' : 'Review submitted for moderation!',
          review: newReview 
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to add review' });
      }
      break;

    case 'PUT':
      try {
        const { id, status } = req.body;
        const reviews = readReviews();
        const reviewIndex = reviews.findIndex(r => r.id === id);
        
        if (reviewIndex === -1) {
          return res.status(404).json({ error: 'Review not found' });
        }

        reviews[reviewIndex].status = status;
        writeReviews(reviews);

        res.status(200).json({ success: true, review: reviews[reviewIndex] });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update review status' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        const reviews = readReviews();
        const filteredReviews = reviews.filter(r => r.id !== id);
        writeReviews(filteredReviews);
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete review' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
