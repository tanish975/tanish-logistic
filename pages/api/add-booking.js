import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const booking = req.body;
    
    // Generate booking ID
    const count = await prisma.booking.count();
    const bookingId = `TN${String(count + 1).padStart(4, '0')}`;
    
    const savedBooking = await prisma.booking.create({
      data: {
        bookingId,
        clientName: booking.customerName || booking.clientName || '',
        companyName: booking.companyName || '',
        phone: booking.phone || '',
        email: booking.email || '',
        pickup: booking.pickup || booking.pickupLocation || '',
        drop: booking.drop || booking.dropLocation || '',
        cargo: booking.goodsType || booking.cargoType || '',
        cargoWeight: booking.weight ? parseFloat(booking.weight) : null,
        cargoValue: booking.cargoValue ? parseFloat(booking.cargoValue) : null,
        cargoDescription: booking.cargoDescription || booking.message || '',
        pickupAddress: booking.pickupAddress || booking.pickupLocation || '',
        dropAddress: booking.dropAddress || booking.dropLocation || '',
        date: booking.date ? new Date(booking.date) : new Date(),
        serviceType: booking.serviceType || booking.vehicleType || '',
        specialInstructions: booking.specialInstructions || booking.message || '',
        price: booking.price ? parseFloat(booking.price) : null,
        status: 'PENDING',
      },
    });
    
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error saving booking:', error);
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      res.status(409).json({ message: 'A booking with this ID already exists', error: error.message });
    } else if (error.code === 'P2021') {
      res.status(503).json({ message: 'Database table not found. Please run database migrations.', error: error.message });
    } else if (error.message && error.message.includes('connection')) {
      res.status(503).json({ message: 'Database connection error. Please try again later.', error: error.message });
    } else {
      res.status(500).json({ message: 'Error saving booking', error: error.message });
    }
  }
}
