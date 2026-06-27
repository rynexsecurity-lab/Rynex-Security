require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || 'false') === 'true',
      requireTLS: String(process.env.SMTP_REQUIRE_TLS || 'true') === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    console.log('Verifying transporter...');
    await transporter.verify();
    console.log('Transporter verified successfully.');
  } catch (err) {
    console.error('Transporter verification failed:');
    console.error(err);
    process.exit(2);
  }
})();
