import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message, phone, company, service } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required fields.' });
    }

      // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    try {
      // Send email to admin
      const { data: adminEmail, error: adminError } = await resend.emails.send({
        from: 'Contact Form <noreply@tanishlogistic.com>', // TODO: Replace "yourdomain.com" with your actual domain name!
        to: 'tanishlogistic744@gmail.com', // Note: Because you have your own domain, you can now change this to any email id if needed.
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <p>You have a new contact form submission:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${company || 'Not provided'}</p>
          <p><strong>Service Interested In:</strong> ${service || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      if (adminError) {
        return res.status(500).json({ message: 'Failed to send admin email.' });
      }

      // Send confirmation email to user
      const { data: userEmail, error: userError } = await resend.emails.send({
        from: 'Tanish Logistic <noreply@tanishlogistic.com>', // TODO: Replace "yourdomain.com" with your actual domain name!
        to: email,
        subject: 'Thank you for your message!',
        html: `
          <h1>Thank You, ${name}!</h1>
          <p>We have received your message and appreciate you contacting us.</p>
          <p>One of our team members will get back to you shortly.</p>
          <br>
          <p>Best regards,</p>
          <p>The Tanish Logistic Team</p>
        `,
      });

      if (userError) {
        // Admin email was sent successfully, so we return success with a warning
        // rather than failing the entire request
        return res.status(200).json({
          message: 'Message sent successfully! However, we could not send the confirmation email.',
          warning: 'Confirmation email failed',
          adminEmailId: adminEmail.id
        });
      }

        res.status(200).json({ message: 'Message sent successfully!', data: { adminEmailId: adminEmail.id, userEmailId: userEmail.id } });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send message due to a server error.' });
    }
}
