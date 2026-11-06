import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';

export default withAdminRoute(async function analyticsIndexRoute(req, res) {
  try {
    if (req.method === 'GET') {
      const bookings = await prisma.booking.findMany();

      const totalRevenue = bookings
        .filter(b => b.status === 'DELIVERED')
        .reduce((sum, b) => sum + (b.price || 0), 0);

      const bookingVolume = bookings.length;

      const bookingsByStatus = {};
      bookings.forEach(b => {
        bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1;
      });

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
  } catch {
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
});
