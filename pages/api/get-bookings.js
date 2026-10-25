import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';

export default withAdminRoute(async function getBookingsRoute(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        driver: true,
        vehicle: true,
      },
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});