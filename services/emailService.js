const nodemailer = require('nodemailer');
const { buildAdminEmail, buildConfirmationEmail } = require('../utils/emailTemplates');

let _transporter = null;

const getTransporter = () => {
  if (_transporter) return _transporter;

  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    const error = new Error(`Email service is not configured: ${missing.join(', ')}`);
    error.status = 500;
    throw error;
  }

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: String(process.env.SMTP_SECURE || 'true') === 'true',
    requireTLS: String(process.env.SMTP_REQUIRE_TLS || 'true') === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return _transporter;
};

let _legacyTransporter = null;
const getLegacyTransporter = () => {
  if (_legacyTransporter) return _legacyTransporter;

  const required = ['LEGACY_SMTP_HOST', 'LEGACY_SMTP_PORT', 'LEGACY_SMTP_USER', 'LEGACY_SMTP_PASS'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    return null;
  }

  _legacyTransporter = nodemailer.createTransport({
    host: process.env.LEGACY_SMTP_HOST,
    port: Number(process.env.LEGACY_SMTP_PORT || 465),
    secure: String(process.env.LEGACY_SMTP_SECURE || 'true') === 'true',
    requireTLS: String(process.env.LEGACY_SMTP_REQUIRE_TLS || 'false') === 'true',
    auth: {
      user: process.env.LEGACY_SMTP_USER,
      pass: process.env.LEGACY_SMTP_PASS
    }
  });

  return _legacyTransporter;
};

const sendContactNotification = async (data, metadata) => {
  const mailTo = process.env.MAIL_TO || 'penetrationtesterofficial@gmail.com';

  // Prefer sending admin notifications via legacy SMTP (Gmail) when configured.
  const legacy = getLegacyTransporter();
  const useLegacy = Boolean(legacy) && mailTo.includes('penetrationtesterofficial@gmail.com');
  const transporter = useLegacy ? legacy : getTransporter();
  const mailFrom = useLegacy ? (process.env.LEGACY_MAIL_FROM || process.env.LEGACY_SMTP_USER) : (process.env.MAIL_FROM || process.env.SMTP_USER);

  return transporter.sendMail({
    from: mailFrom,
    to: mailTo,
    replyTo: data.email,
    subject: data.subject || `New contact request from ${data.name}`,
    html: buildAdminEmail(data, metadata)
  });
};

const sendVisitorConfirmation = async (data, metadata) => {
  const transporter = getTransporter();
  const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;

  return transporter.sendMail({
    from: mailFrom,
    to: data.email,
    subject: 'Rynex Security received your message',
    html: buildConfirmationEmail(data, metadata)
  });
};

module.exports = { sendContactNotification, sendVisitorConfirmation };
