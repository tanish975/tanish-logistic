import { PrismaClient } from '@prisma/client';
import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    await prisma.$connect();
    const session = await getIronSession(req, res, sessionOptions);

    if (!session.user || session.user.role !== 'ADMIN') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      try {
        // 1. Total Revenue
        const totalRevenueResult = await prisma.booking.aggregate({
          _sum: {
            price: true,
          },
          where: {
            status: 'DELIVERED', // Only count revenue from delivered bookings
          },
        });
        const totalRevenue = totalRevenueResult._sum.price || 0;

        // 2. Booking Volume
        const bookingVolume = await prisma.booking.count();

        // 3. Bookings by Status
        const bookingsByStatus = await prisma.booking.groupBy({
          by: ['status'],
          _count: {
            _all: true,
          },
        });

        // 4. Bookings over the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const bookingsOverTime = await prisma.booking.groupBy({
          by: ['createdAt'],
          where: {
            createdAt: {
              gte: sevenDaysAgo,
            },
          },
          _count: {
            _all: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        });

        // Format bookings over time data for charts
        const formattedBookingsOverTime = bookingsOverTime.map(item => ({
          date: item.createdAt.toISOString().split('T')[0],
          count: item._count._all,
        })).reduce((acc, current) => {
          const existing = acc.find(item => item.date === current.date);
          if (existing) {
            existing.count += current.count;
          } else {
            acc.push(current);
          }
          return acc;
        }, []);
        
        const formattedBookingsByStatus = bookingsByStatus.reduce((acc, status) => {
          acc[status.status] = status._count._all;
          return acc;
        }, {});


        res.status(200).json({
          totalRevenue,
          bookingVolume,
          bookingsByStatus: formattedBookingsByStatus,
          bookingsOverTime: formattedBookingsOverTime,
        });

      } catch (error) {
        console.error('Error fetching analytics data:', error);
        res.status(500).json({ message: 'Failed to fetch analytics data', error: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}
