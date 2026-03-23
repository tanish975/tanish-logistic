import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany();
      
      // Group bookings by route (pickup -> drop)
      const routeCounts = {};
      bookings.forEach(booking => {
        const routeKey = `${booking.pickup} → ${booking.drop}`;
        if (!routeCounts[routeKey]) {
          routeCounts[routeKey] = {
            pickup: booking.pickup,
            drop: booking.drop,
            count: 0
          };
        }
        routeCounts[routeKey].count += 1;
      });
      
      // Convert to array and sort by count
      const formattedRoutes = Object.values(routeCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      res.status(200).json(formattedRoutes);
    } catch (error) {
      console.error('Error fetching popular routes:', error);
      res.status(500).json({ message: 'Failed to fetch popular routes', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
