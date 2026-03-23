import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const bookings = await prisma.booking.findMany();
      
      // Calculate analytics from bookings
      const totalRevenue = bookings
        .filter(b => b.status === 'DELIVERED')
        .reduce((sum, b) => sum + (b.price || 0), 0);
      
      const bookingVolume = bookings.length;
      
      // Bookings by status
      const bookingsByStatus = {};
      bookings.forEach(b => {
        bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1;
      });
      
      // Bookings over time (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const bookingsOverTime = bookings
        .filter(b => new Date(b.createdAt || b.date) >= sevenDaysAgo)
        .map(b => ({
          date: new Date(b.createdAt || b.date).toISOString().split('T')[0],
          count: 1
        }));
      
      res.status(200).json({
        totalRevenue,
        bookingVolume,
        bookingsByStatus,
        bookingsOverTime
      });
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data', error: error.message });
  }
}
