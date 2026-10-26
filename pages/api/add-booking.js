import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { withRateLimit } from '@/lib/rate-limit';

// Escape user-supplied values before interpolating into HTML email
// templates (prevents HTML/phishing injection into sent emails).
function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const resend = new Resend(process.env.RESEND_API_KEY);

// ponytail: retry loop instead of count()+1 — avoids unique-constraint collisions
// under concurrent submissions. Bounded to 5 attempts; falls back to a cuid suffix.
async function generateBookingId() {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const count = await prisma.booking.count();
    const candidate = `TN${String(count + 1 + attempt).padStart(4, '0')}`;
    const existing = await prisma.booking.findUnique({
      where: { bookingId: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  return `TN${Date.now().toString().slice(-6)}`;
}

async function sendBookingEmails(booking) {
  // ADMIN_EMAIL supports one address or a comma-separated list.
  // Every listed address receives the admin notification.
  const adminEmails = (process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);
  const primaryAdminEmail = adminEmails[0];
  if (adminEmails.length === 0) {
    console.warn(
      '[add-booking] ADMIN_EMAIL is not configured - skipping confirmation emails for booking ' +
        booking.bookingId +
        '. Set ADMIN_EMAIL in your environment variables.'
    );
    return;
  }

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">New Booking Received!</h2>
      <p>You have a new booking on Tanish Logistic. Here are the details:</p>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Details</h3>
        <p><strong>Booking ID:</strong> ${escapeHtml(booking.bookingId)}</p>
        <p><strong>Client Name:</strong> ${escapeHtml(booking.clientName)}</p>
        <p><strong>Company:</strong> ${booking.companyName || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${booking.phone}</p>
        <p><strong>Email:</strong> ${booking.email}</p>
        <p><strong>Service Type:</strong> ${booking.serviceType || 'Not specified'}</p>
        <p><strong>Pickup Location:</strong> ${escapeHtml(booking.pickup)}</p>
        <p><strong>Drop Location:</strong> ${escapeHtml(booking.drop)}</p>
        <p><strong>Cargo Type:</strong> ${escapeHtml(booking.cargo)}</p>
        <p><strong>Cargo Weight:</strong> ${booking.cargoWeight ? booking.cargoWeight + ' tons' : 'Not specified'}</p>
        <p><strong>Cargo Value:</strong> ${booking.cargoValue ? '₹' + booking.cargoValue.toLocaleString() : 'Not specified'}</p>
        <p><strong>Booking Date:</strong> ${booking.date ? new Date(booking.date).toLocaleDateString() : 'Not scheduled'}</p>
        <p><strong>Status:</strong> Pending</p>
        ${booking.cargoDescription ? `<p><strong>Description:</strong> ${escapeHtml(booking.cargoDescription)}</p>` : ''}
        ${booking.specialInstructions ? `<p><strong>Special Instructions:</strong> ${escapeHtml(booking.specialInstructions)}</p>` : ''}
        ${booking.price ? `<p><strong>Estimated Price:</strong> ₹${parseFloat(booking.price).toLocaleString()}</p>` : ''}
      </div>
      <p>Please log in to your admin dashboard to review and manage this booking.</p>
      <br>
      <p>Best regards,<br>Tanish Logistic System</p>
    </div>
  `;

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #10b981;">Thank You for Your Booking!</h2>
      <p>Dear ${escapeHtml(booking.clientName)},</p>
      <p>We have received your booking request. Here are the details:</p>
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Booking Confirmation</h3>
        <p><strong>Booking ID:</strong> ${escapeHtml(booking.bookingId)}</p>
        <p><strong>Pickup Location:</strong> ${escapeHtml(booking.pickup)}</p>
        <p><strong>Drop Location:</strong> ${escapeHtml(booking.drop)}</p>
        <p><strong>Cargo Type:</strong> ${escapeHtml(booking.cargo)}</p>
        ${booking.cargoWeight ? `<p><strong>Cargo Weight:</strong> ${escapeHtml(booking.cargoWeight)} tons</p>` : ''}
        <p><strong>Service Type:</strong> ${booking.serviceType || 'Standard'}</p>
        <p><strong>Status:</strong> <span style="color: #f59e0b;">Pending Confirmation</span></p>
      </div>
      <p>Our team will review your booking and get back to you shortly. You can track your booking status using your booking ID: <strong>${escapeHtml(booking.bookingId)}</strong></p>
      <p>If you have any questions or need to make changes, feel free to contact us at <a href="mailto:${escapeHtml(primaryAdminEmail)}">${escapeHtml(primaryAdminEmail)}</a> or call us.</p>
      <br>
      <p>Best regards,<br>The Tanish Logistic Team</p>
    </div>
  `;

  await Promise.allSettled([
    resend.emails.send({
      from: 'Tanish Logistic - New Booking <noreply@tanishlogistic.com>',
      to: adminEmails,
      subject: `New Booking Received - ${escapeHtml(booking.bookingId)} - ${escapeHtml(booking.clientName)}`,
      html: adminHtml,
    }),
    booking.email ? resend.emails.send({
      from: 'Tanish Logistic <noreply@tanishlogistic.com>',
      to: booking.email,
      subject: `Booking Confirmation - ${escapeHtml(booking.bookingId)} - Tanish Logistic`,
      html: customerHtml,
    }) : Promise.resolve({ data: null, error: null }),
  ]);
}

export default withRateLimit(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const booking = req.body;

    const bookingId = await generateBookingId();

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

    sendBookingEmails(savedBooking).catch(() => {});

    res.status(201).json({
      success: true,
      bookingId: savedBooking.bookingId,
      booking: savedBooking,
      message: 'Booking created successfully. Confirmation emails will be sent shortly.',
    });
  } catch (error) {
    console.error('Booking creation failed:', error?.message || 'unknown error');
    res.status(500).json({ message: 'Error saving booking.' });
  }
}, { limit: 15, windowMs: 60_000, name: 'booking' });
