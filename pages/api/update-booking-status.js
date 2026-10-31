import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';

export default withAdminRoute(async function updateBookingStatusRoute(req, res) {
  if (req.method !== 'PUT' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { bookingId, id, status, newStatus } = req.body || {};

    const actualId = bookingId || id;
    const actualStatus = newStatus || status;

    if (typeof actualId !== 'string' || !actualId.trim() || actualId.length > 128 ||
        typeof actualStatus !== 'string' || !['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].includes(actualStatus.toUpperCase())) {
      return res.status(400).json({ message: 'Booking ID and status are required' });
    }

    let booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { bookingId: actualId },
          { id: actualId },
        ],
      },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: actualStatus.toUpperCase(),
      },
    });

    res.status(200).json(updatedBooking);
  } catch {
    res.status(500).json({ message: 'Error updating booking status' });
  }
});