import { randomBytes } from 'node:crypto';
import prisma from '@/lib/prisma';
import { Resend } from 'resend';
import { withRateLimit } from '@/lib/rate-limit';
import { verifyPublicSubmission } from '@/lib/bot-protection';
import { validateBooking } from '@/lib/booking-validation';

export const config = { api: { bodyParser: { sizeLimit: '32kb' } } };

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

// Random IDs avoid count-based races and enumeration. The database unique
// constraint remains authoritative; retry the insertion itself on collision.
async function createBooking(values) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const bookingId = `TN${randomBytes(6).toString('hex').toUpperCase()}`;
    try {
      return await prisma.booking.create({ data: { ...values, bookingId, status: 'PENDING' } });
    } catch (error) {
      if (error?.code !== 'P2002' || attempt === 4) throw error;
    }
  }
  throw new Error('Unable to allocate a booking reference.');
}

async function sendBookingEmails(booking) {
  const adminEmails = (process.env.ADMIN_EMAIL || '').split(',').map((email) => email.trim()).filter(Boolean);
  if (!process.env.RESEND_API_KEY || adminEmails.length === 0 ||
      adminEmails.some((email) => !/^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]+$/.test(email))) {
    return false;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Booking Received</h2>
      <p><strong>Booking ID:</strong> ${escapeHtml(booking.bookingId)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(booking.clientName)}</p>
      <p><strong>Company:</strong> ${escapeHtml(booking.companyName || 'Not provided')}</p>
      <p><strong>Phone:</strong> ${escapeHtml(booking.phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(booking.email)}</p>
      <p><strong>Service:</strong> ${escapeHtml(booking.serviceType)}</p>
      <p><strong>Pickup:</strong> ${escapeHtml(booking.pickup)}</p>
      <p><strong>Drop:</strong> ${escapeHtml(booking.drop)}</p>
      <p><strong>Cargo:</strong> ${escapeHtml(booking.cargo)}</p>
      <p><strong>Cargo weight:</strong> ${escapeHtml(booking.cargoWeight ?? 'Not specified')}</p>
      <p><strong>Cargo value:</strong> ${escapeHtml(booking.cargoValue ?? 'Not specified')}</p>
      <p><strong>Booking date:</strong> ${escapeHtml(new Date(booking.date).toISOString().slice(0, 10))}</p>
      <p><strong>Description:</strong> ${escapeHtml(booking.cargoDescription || 'Not provided')}</p>
      <p><strong>Instructions:</strong> ${escapeHtml(booking.specialInstructions || 'Not provided')}</p>
      <p>Sign in to the admin dashboard to review this request.</p>
    </div>`;
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Thank You for Your Booking</h2>
      <p>Dear ${escapeHtml(booking.clientName)},</p>
      <p>We received your request. Our team will review it and contact you.</p>
      <p><strong>Booking ID:</strong> ${escapeHtml(booking.bookingId)}</p>
      <p><strong>Pickup:</strong> ${escapeHtml(booking.pickup)}</p>
      <p><strong>Drop:</strong> ${escapeHtml(booking.drop)}</p>
      <p><strong>Cargo:</strong> ${escapeHtml(booking.cargo)}</p>
      <p><strong>Service:</strong> ${escapeHtml(booking.serviceType)}</p>
      <p><strong>Status:</strong> Pending confirmation</p>
      <p>For questions, contact ${escapeHtml(adminEmails[0])}.</p>
      <p>Best regards,<br>The Tanish Logistic Team</p>
    </div>`;
  const results = await Promise.allSettled([
    resend.emails.send({
      from: 'Tanish Logistic - New Booking <noreply@tanishlogistic.com>',
      to: adminEmails,
      subject: `New Booking Received - ${booking.bookingId} - ${booking.clientName}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: 'Tanish Logistic <noreply@tanishlogistic.com>',
      to: booking.email,
      subject: `Booking Confirmation - ${booking.bookingId} - Tanish Logistic`,
      html: customerHtml,
    }),
  ]);
  return results.every((result) => result.status === 'fulfilled' && !result.value?.error && result.value?.data?.id);
}

const submitBooking = withRateLimit(async function submitBooking(req, res) {
  const values = validateBooking(req.body);
  if (!values) return res.status(400).json({ message: 'Please check the booking details and try again.' });
  const verification = await verifyPublicSubmission(req);
  if (!verification.allowed) {
    return res.status(verification.status).json({
      message: 'We could not verify your booking. Please try again or call +91 99242 04744.',
    });
  }
  let booking;
  try {
    booking = await createBooking(values);
  } catch {
    return res.status(500).json({ message: 'Error saving booking. Please try again.' });
  }

  // Await delivery while preserving success if email fails after persistence;
  // otherwise the customer might retry and create a duplicate booking.
  let emailDelivered = false;
  try { emailDelivered = await sendBookingEmails(booking); } catch { /* booking was already saved */ }
  return res.status(201).json({
    success: true,
    bookingId: booking.bookingId,
    message: emailDelivered ? 'Booking created successfully.' : 'Booking created; email notification may be delayed.',
    ...(!emailDelivered ? { warning: 'Email notification unavailable' } : {}),
  });
}, { limit: 5, windowMs: 10 * 60_000, name: 'booking' });

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }
  return submitBooking(req, res);
}
