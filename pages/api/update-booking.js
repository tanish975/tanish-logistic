import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id, status } = req.body;

    if (!id || !status) {
        return res.status(400).json({ message: 'Booking ID and status are required.' });
    }

    try {
        // Try to find by bookingId first, then by id
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

        const updatedBooking = await prisma.booking.update({
            where: { id: booking.id },
            data: { status: status.toUpperCase() },
        });

        res.status(200).json({ message: 'Booking updated successfully.', booking: updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
