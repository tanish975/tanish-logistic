import { getIronSession } from 'iron-session';
import sessionOptions from '@/lib/session';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getIronSession(req, res, sessionOptions);

  if (!session.user || session.user.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { bookingId, newStatus } = req.body;

  if (!bookingId || !newStatus) {
    return res.status(400).json({ message: 'Booking ID and new status are required.' });
  }

  const validStatuses = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  try {
    const updatedBooking = await prisma.booking.update({
      where: { bookingId: bookingId },
      data: { status: newStatus },
    });

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Send email notification to the customer
    try {
      let emailSubject = '';
      let emailHtml = '';

      switch (newStatus) {
        case 'CONFIRMED':
          emailSubject = `Your Booking is Confirmed! - #${updatedBooking.bookingId}`;
          emailHtml = `<h1>Booking Confirmed</h1>
                       <p>Dear ${updatedBooking.clientName},</p>
                       <p>Your booking with ID <strong>#${updatedBooking.bookingId}</strong> has been confirmed.</p>
                       <p><strong>Route:</strong> ${updatedBooking.pickup} to ${updatedBooking.drop}</p>
                       <p>We will notify you again once your shipment is in transit. Thank you for choosing Tanish Logistic.</p>`;
          break;
        case 'IN_TRANSIT':
          emailSubject = `Your Shipment is In Transit - #${updatedBooking.bookingId}`;
          emailHtml = `<h1>Shipment In Transit</h1>
                       <p>Dear ${updatedBooking.clientName},</p>
                       <p>Great news! Your shipment with booking ID <strong>#${updatedBooking.bookingId}</strong> is now in transit.</p>
                       <p><strong>Route:</strong> ${updatedBooking.pickup} to ${updatedBooking.drop}</p>
                       <p>You can expect delivery soon. We appreciate your business.</p>`;
          break;
        case 'DELIVERED':
          emailSubject = `Your Shipment Has Been Delivered - #${updatedBooking.bookingId}`;
          emailHtml = `<h1>Shipment Delivered</h1>
                       <p>Dear ${updatedBooking.clientName},</p>
                       <p>Your shipment with booking ID <strong>#${updatedBooking.bookingId}</strong> has been successfully delivered.</p>
                       <p><strong>Route:</strong> ${updatedBooking.pickup} to ${updatedBooking.drop}</p>
                       <p>We hope you were satisfied with our service. Thank you for choosing Tanish Logistic!</p>`;
          break;
      }

      if (emailSubject && emailHtml) {
        await resend.emails.send({
          from: 'Tanish Logistic <onboarding@resend.dev>', // Replace with your verified domain in production
          to: updatedBooking.email,
          subject: emailSubject,
          html: emailHtml,
        });
      }
    } catch (emailError) {
      // Log the email error but don't fail the entire request
      console.error('Failed to send status update email:', emailError);
    }

    res.status(200).json({ message: 'Booking status updated successfully.', booking: updatedBooking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
