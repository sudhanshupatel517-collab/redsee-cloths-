const { Resend } = require('resend');

const sendEmail = async (options) => {
  // Initialize Resend with the API key from environment variables
  const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

  try {
    const data = await resend.emails.send({
      from: `Redsee <${process.env.EMAIL_USER || 'onboarding@resend.dev'}>`,
      to: [options.email],
      subject: options.subject,
      text: options.message,
      html: options.html, // Optional HTML support
    });

    console.log(`Email sent successfully via Resend to ${options.email}`, data);
  } catch (error) {
    console.error('Error sending email with Resend:', error);
    // Keep proceeding even if email fails (like in development)
  }
};

module.exports = sendEmail;
