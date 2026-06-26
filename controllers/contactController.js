const { validationResult, matchedData } = require('express-validator');
const { sendContactNotification, sendVisitorConfirmation } = require('../services/emailService');

const submitContactForm = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Please correct the highlighted fields and try again.',
      errors: errors.array().map((error) => ({ field: error.path, message: error.msg }))
    });
  }

  const data = matchedData(req, { locations: ['body'] });

  if (data.website) {
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  }

  const metadata = {
    timestamp: new Date().toISOString(),
    ipAddress: req.ip,
    userAgent: req.get('user-agent') || 'Unknown'
  };

  try {
    const emailResults = await Promise.allSettled([
      sendContactNotification(data, metadata, {
        success: true,
        message: 'Submitted successfully.'
      }),
      sendVisitorConfirmation(data, metadata)
    ]);

    const notificationSent = emailResults[0].status === 'fulfilled';

    emailResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        const label = index === 0 ? 'Contact notification email' : 'Visitor confirmation email';
        console.error(`${label} failed:`, result.reason?.message || result.reason);
      }
    });

    if (!notificationSent) {
      const error = new Error('Message could not be sent through email notification.');
      error.status = 502;
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully. We will contact you shortly.'
    });
  } catch (error) {
    error.status = error.status || 502;
    return next(error);
  }
};

module.exports = { submitContactForm };
