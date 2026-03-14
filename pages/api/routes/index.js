import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const popularRoutes = await prisma.booking.groupBy({
        by: ['pickup', 'drop'],
        _count: {
          _all: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
        take: 10, // Adjust the number of popular routes to return
      });

      // Remap the result to a more friendly format
      const formattedRoutes = popularRoutes.map(route => ({
        pickup: route.pickup,
        drop: route.drop,
        count: route._count._all,
      }));

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
