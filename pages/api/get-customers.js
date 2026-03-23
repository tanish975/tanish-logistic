import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const bookings = await prisma.booking.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const customers = {};

        bookings.forEach(booking => {
            const key = booking.phone;
            if (!key) return;

            if (!customers[key]) {
                customers[key] = {
                    name: booking.clientName,
                    phone: booking.phone,
                    email: booking.email,
                    totalBookings: 0,
                    lastBookingDate: 'N/A',
                };
            }

            customers[key].totalBookings += 1;
            
            const bookingDate = new Date(booking.createdAt || booking.date);
            const lastDateString = customers[key].lastBookingDate;
            
            if (lastDateString === 'N/A' || bookingDate > new Date(lastDateString)) {
                customers[key].lastBookingDate = bookingDate.toISOString().split('T')[0];
            }
        });

        const customerList = Object.values(customers).sort((a, b) => b.totalBookings - a.totalBookings);

        res.status(200).json(customerList);

    } catch (error) {
        console.error('Error getting customers:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
