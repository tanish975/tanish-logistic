import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';

export default withAdminRoute(async function routesIndexRoute(req, res) {
  if (req.method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany();

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

      const formattedRoutes = Object.values(routeCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      res.status(200).json(formattedRoutes);
    } catch {
      res.status(500).json({ message: 'Failed to fetch popular routes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});
