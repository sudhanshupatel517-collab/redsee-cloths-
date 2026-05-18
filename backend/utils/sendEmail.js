const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com', // User needs to set this
      pass: process.env.EMAIL_PASS || 'your-email-app-password', // User needs to set this (App Password)
    },
  });

  // Define email options
  const mailOptions = {
    from: `Redsee <${process.env.EMAIL_USER || 'no-reply@redsee.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error('Error sending email:', error);
    // Even if it fails locally because of no credentials, we log it so dev can continue.
  }
};

module.exports = sendEmail;
