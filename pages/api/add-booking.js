import { Resend } from 'resend';
import { PrismaClient, Prisma } from '@prisma/client';
import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

async function generateBookingId() {
  const latestBooking = await prisma.booking.findFirst({
    orderBy: { createdAt: 'desc' },
    select: { bookingId: true },
  });

  let nextIdNum = 1;
  if (latestBooking && latestBooking.bookingId) {
    const lastNum = parseInt(latestBooking.bookingId.replace('TN', ''), 10);
    if (!isNaN(lastNum)) {
      nextIdNum = lastNum + 1;
    }
  }
  return 'TN' + String(nextIdNum).padStart(4, '0');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    companyName, contactPerson, phone, email, pickupLocation, pickupAddress,
    dropLocation, dropAddress, cargoType, cargoWeight, cargoValue,
    cargoDescription, preferredDate, serviceType, specialInstructions,
  } = req.body;

  if (
    !contactPerson || !phone || !email || !pickupLocation || !dropLocation ||
    !pickupAddress || !dropAddress || !cargoType || !preferredDate || !serviceType ||
    (cargoWeight === null || cargoWeight === undefined || cargoWeight === '')
  ) {
    return res.status(400).json({ message: 'Missing required booking fields.' });
  }

  try {
    const bookingId = await generateBookingId();

    const data = {
      bookingId: bookingId,
      clientName: contactPerson,
      companyName: companyName || null,
      phone: phone,
      email: email,
      pickup: pickupLocation,
      drop: dropLocation,
      cargo: cargoType,
      cargoWeight: parseFloat(cargoWeight) || 0.0,
      cargoValue: cargoValue ? parseFloat(cargoValue) : null,
      cargoDescription: cargoDescription || null,
      pickupAddress: pickupAddress,
      dropAddress: dropAddress,
      date: new Date(preferredDate),
      serviceType: serviceType,
      specialInstructions: specialInstructions || null,
      status: 'PENDING',
    };

    const newBooking = await prisma.booking.create({ data });

    // Send notification emails (wrapped in a try-catch to not block the main flow)
    try {
      // Email to admin
      await resend.emails.send({
        from: 'Booking System <onboarding@resend.dev>',
        to: 'tanishlogistic744@gmail.com',
        subject: `New Booking Received - #${newBooking.bookingId}`,
        html: `<p>A new booking has been created. Details: ${JSON.stringify(newBooking, null, 2)}</p>`,
      });

      // Confirmation email to user
      await resend.emails.send({
        from: 'Tanish Logistic <onboarding@resend.dev>',
        to: newBooking.email,
        subject: `Your Booking is Confirmed! #${newBooking.bookingId}`,
        html: `<p>Thank you for your booking, ${newBooking.clientName}. Your booking ID is ${newBooking.bookingId}.</p>`,
      });
    } catch (emailError) {
      console.error('Failed to send booking emails:', emailError);
    }

    res.status(201).json({ message: 'Booking added successfully.', booking: newBooking });
  } catch (error) {
    console.error('Error adding booking:', error); // Keep general error logging
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}