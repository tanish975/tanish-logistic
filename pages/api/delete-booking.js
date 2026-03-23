import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Booking ID is required.' });
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

        await prisma.booking.delete({
            where: { id: booking.id },
        });

        res.status(200).json({ message: 'Booking deleted successfully.' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
