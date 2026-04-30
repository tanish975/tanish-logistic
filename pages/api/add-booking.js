import prisma from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to send booking notification emails
async function sendBookingEmails(booking) {
  const adminEmail = process.env.ADMIN_EMAIL || 'tanishlogistic744@gmail.com';
  
  // Email to admin
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">🎉 New Booking Received!</h2>
      <p>You have a new booking on Tanish Logistic. Here are the details:</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Details</h3>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Client Name:</strong> ${booking.clientName}</p>
        <p><strong>Company:</strong> ${booking.companyName || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Service Type:</strong> ${booking.serviceType || 'Not specified'}</p>
        <p><strong>Pickup Location:</strong> ${booking.pickup}</p>
        <p><strong>Drop Location:</strong> ${booking.drop}</p>
        <p><strong>Cargo Type:</strong> ${booking.cargo}</p>
        <p><strong>Cargo Weight:</strong> ${booking.cargoWeight ? booking.cargoWeight + ' tons' : 'Not specified'}</p>
        <p><strong>Cargo Value:</strong> ${booking.cargoValue ? '₹' + booking.cargoValue.toLocaleString() : 'Not specified'}</p>
        <p><strong>Booking Date:</strong> ${booking.date ? new Date(booking.date).toLocaleDateString() : 'Not scheduled'}</p>
        <p><strong>Status:</strong> Pending</p>
        ${booking.cargoDescription ? `<p><strong>Description:</strong> ${booking.cargoDescription}</p>` : ''}
        ${booking.specialInstructions ? `<p><strong>Special Instructions:</strong> ${booking.specialInstructions}</p>` : ''}
        ${booking.price ? `<p><strong>Estimated Price:</strong> ₹${parseFloat(booking.price).toLocaleString()}</p>` : ''}
      </div>
      
      <p>Please log in to your admin dashboard to review and manage this booking.</p>
      <br>
      <p>Best regards,<br>Tanish Logistic System</p>
    </div>
  `;

  // Email to customer (if email provided)
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Thank You for Your Booking!</h2>
      <p>Dear ${booking.clientName},</p>
      <p>We have received your booking request. Here are the details:</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Confirmation</h3>
        <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p><strong>Pickup Location:</strong> ${booking.pickup}</p>
        <p><strong>Drop Location:</strong> ${booking.drop}</p>
        <p><strong>Cargo Type:</strong> ${booking.cargo}</p>
        ${booking.cargoWeight ? `<p><strong>Cargo Weight:</strong> ${booking.cargoWeight} tons</p>` : ''}
        <p><strong>Service Type:</strong> ${booking.serviceType || 'Standard'}</p>
        <p><strong>Status:</strong> <span style="color: #f59e0b;">Pending Confirmation</span></p>
      </div>
      
      <p>Our team will review your booking and get back to you shortly. You can track your booking status using your booking ID: <strong>${booking.bookingId}</strong></p>
      
      <p>If you have any questions or need to make changes, feel free to contact us at <a href="mailto:${adminEmail}">${adminEmail}</a> or call us.</p>
      
      <br>
      <p>Best regards,<br>The Tanish Logistic Team</p>
    </div>
  `;

  // Send emails with proper error handling
  const results = await Promise.allSettled([
    // Admin email
    resend.emails.send({
      from: 'Tanish Logistic - New Booking <noreply@tanishlogistic.com>',
      to: adminEmail,
      subject: `🆕 New Booking Received - ${booking.bookingId} - ${booking.clientName}`,
      html: adminHtml,
    }),
    // Customer email (only if email provided)
    booking.email ? resend.emails.send({
      from: 'Tanish Logistic <noreply@tanishlogistic.com>',
      to: booking.email,
      subject: `Booking Confirmation - ${booking.bookingId} - Tanish Logistic`,
      html: customerHtml,
    }) : Promise.resolve({ data: null, error: null })
  ]);

  // Log results
  // Note: In production, use proper logging instead of console.log
  if (results[0].status === 'fulfilled') {
    if (results[0].value.error) {
      // Failed to send admin email
    } else {
      // Admin email sent successfully
    }
  } else {
    // Admin email rejected
  }

  if (booking.email && results[1].status === 'fulfilled') {
    if (results[1].value.error) {
      // Failed to send customer email
    } else {
      // Customer email sent successfully
    }
  }

  return results;
}

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

  // Send notification emails (async, don't block response)
  sendBookingEmails(savedBooking).catch(() => {
    // Email sending failed - log in production logging system
  });

    res.status(201).json({ 
      success: true, 
      booking: savedBooking,
      message: 'Booking created successfully. Confirmation emails will be sent shortly.' 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving booking.' });
  }
}
