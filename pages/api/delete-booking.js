import { withAdminRoute } from '@/lib/session';
import prisma from '@/lib/prisma';

export default withAdminRoute(async function deleteBookingRoute(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id, deleteAllCancelled } = req.body || {};

    if (deleteAllCancelled !== undefined && typeof deleteAllCancelled !== 'boolean') {
        return res.status(400).json({ message: 'Invalid deletion request.' });
    }

    try {
        if (deleteAllCancelled === true) {
            await prisma.booking.updateMany({
                where: { status: 'CANCELLED' },
                data: { driverId: null, vehicleId: null }
            });

            const result = await prisma.booking.deleteMany({
                where: { status: 'CANCELLED' }
            });

            if (result.count === 0) {
                return res.status(200).json({ message: 'No cancelled bookings found to delete.' });
            }

            return res.status(200).json({
                message: `Successfully deleted ${result.count} cancelled booking(s).`
            });
        }

        if (typeof id !== 'string' || !id.trim() || id.length > 128) {
            return res.status(400).json({ message: 'Booking ID is required.' });
        }

        let booking = await prisma.booking.findFirst({
            where: {
                OR: [
                    { bookingId: id },
                    { id: id },
                ],
            },
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found.' });
        }

        await prisma.booking.update({
            where: { id: booking.id },
            data: { driverId: null, vehicleId: null }
        });

        await prisma.booking.delete({
            where: { id: booking.id },
        });

        res.status(200).json({ message: 'Booking deleted successfully.' });
    } catch {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});