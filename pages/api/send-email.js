import { Resend } from 'resend';
import { verifyPublicSubmission } from '@/lib/bot-protection';
import { withRateLimit } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_PHONE = '+91 99242 04744';
const FALLBACK_MESSAGE = `Please try again or call us at ${CONTACT_PHONE}.`;
const REFRESH_MESSAGE = `Please refresh the page and try again, or call us at ${CONTACT_PHONE}.`;

// Keep the request bounded even before the field-level validation runs.
export const config = { api: { bodyParser: { sizeLimit: '32kb' } } };

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function validateInquiry(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Please complete the contact form.' };
  }

  const limits = { name: 120, email: 254, phone: 60, company: 200, service: 100, message: 5000, website: 200 };
  const required = new Set(['name', 'email', 'phone', 'message']);
  const values = {};
  for (const [field, maxLength] of Object.entries(limits)) {
    const value = body[field];
    if (value === undefined && !required.has(field)) {
      values[field] = '';
      continue;
    }
    if (typeof value !== 'string' || value.length > maxLength) {
      return { error: 'Please check the contact form and try again.' };
    }
    values[field] = value.trim();
    if (required.has(field) && !values[field]) {
      return { error: 'Please complete all required contact form fields.' };
    }
  }

  // A hidden field is not proof of a bot, so show a failure rather than
  // pretending an enquiry was delivered if a browser or extension fills it.
  if (values.website) return { error: `Unable to submit the form. ${REFRESH_MESSAGE}` };

  const singleLineFields = ['name', 'email', 'phone', 'company', 'service'];
  if (singleLineFields.some((field) => /[\u0000-\u001f\u007f\u2028\u2029]/.test(values[field])) ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(values.message)) {
    return { error: 'Please check the contact form and try again.' };
  }

  if (!/^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]+$/.test(values.email)) {
    return { error: 'Please provide a valid email address.' };
  }
  const phoneDigits = (values.phone.match(/\p{Decimal_Number}/gu) || []).length;
  if (phoneDigits < 7 || phoneDigits > 20) {
    return { error: 'Please enter a valid phone number (7–20 digits).' };
  }
  return { values };
}

const sendContactEmail = withRateLimit(async function sendContactEmail(req, res) {
  const { values, error } = validateInquiry(req.body);
  if (error) return res.status(400).json({ message: error });

  const verification = await verifyPublicSubmission(req);
  if (!verification.allowed) {
    const message = verification.status === 403
      ? `We could not verify your submission. ${REFRESH_MESSAGE}`
      : `The contact form is temporarily unavailable. ${FALLBACK_MESSAGE}`;
    return res.status(verification.status).json({ message });
  }

  const { name, email, phone, company, service, message } = values;
  const safeName = escapeHtml(name);
  try {
    const { data: adminEmail, error: adminError } = await resend.emails.send({
      from: 'Contact Form <noreply@tanishlogistic.com>',
      to: 'tanishlogistic744@gmail.com',
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <p>You have a new contact form submission:</p>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || 'Not provided')}</p>
        <p><strong>Service Interested In:</strong> ${escapeHtml(service || 'Not specified')}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\r\n|\r|\n/g, '<br>')}</p>
      `,
    });

    if (adminError || !adminEmail?.id) {
      return res.status(500).json({ message: `Failed to send your message. ${FALLBACK_MESSAGE}` });
    }

    // Once the admin has received the inquiry, a confirmation failure must not
    // tell the customer to resubmit (which could duplicate the admin email).
    const confirmationWarning = () => res.status(200).json({
      message: 'Message sent successfully! However, we could not send the confirmation email.',
      warning: 'Confirmation email failed',
    });
    try {
      const { data: userEmail, error: userError } = await resend.emails.send({
        from: 'Tanish Logistic <noreply@tanishlogistic.com>',
        to: email,
        subject: 'Thank you for your message!',
        html: `
          <h1>Thank You, ${safeName}!</h1>
          <p>We have received your message and appreciate you contacting us.</p>
          <p>One of our team members will get back to you shortly.</p>
          <br>
          <p>Best regards,</p>
          <p>The Tanish Logistic Team</p>
        `,
      });
      if (userError || !userEmail?.id) return confirmationWarning();

      return res.status(200).json({
        message: 'Message sent successfully!',
      });
    } catch {
      return confirmationWarning();
    }
  } catch {
    return res.status(500).json({ message: `Failed to send your message. ${FALLBACK_MESSAGE}` });
  }
}, { limit: 5, windowMs: 10 * 60_000, name: 'contact form' });

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }
  return sendContactEmail(req, res);
}
