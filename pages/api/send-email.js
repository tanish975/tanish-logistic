import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '******' : 'NOT SET'); // Log masked key

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, message, phone, company, service } = req.body;

    try {
      // Send email to admin
      const { data: adminEmail, error: adminError } = await resend.emails.send({
        from: 'Contact Form <onboarding@resend.dev>',
        to: 'tksunaria@gmail.com', // TEMP: Changed for testing with onboarding@resend.dev. Change to your desired admin email when using a verified domain.
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
        console.error('Resend API error (admin):', adminError);
        return res.status(500).json({ message: 'Failed to send admin email.', error: adminError.message });
      }

      // Send confirmation email to user
      const { data: userEmail, error: userError } = await resend.emails.send({
        from: 'Tanish Logistic <onboarding@resend.dev>',
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
        console.error('Resend API error (user):', userError);
        // Optional: Decide if you still want to return a success to the user
        // even if their confirmation email failed. For now, we'll flag it.
        return res.status(500).json({ message: 'Admin email sent, but failed to send confirmation email.', error: userError.message });
      }

      console.log('Resend API success:', { adminEmailId: adminEmail.id, userEmailId: userEmail.id });
      res.status(200).json({ message: 'Message sent successfully!', data: { adminEmailId: adminEmail.id, userEmailId: userEmail.id } });
    } catch (error) {
      console.error('General error in send-email handler:', error);
      res.status(500).json({ message: 'Failed to send message due to a server error.', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
