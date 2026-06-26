const submitToWeb3Forms = async (data, metadata) => {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    const error = new Error('Web3Forms is not configured.');
    error.status = 500;
    throw error;
  }

  const payload = new FormData();
  payload.append('access_key', accessKey);
  payload.append('subject', data.subject || 'New Rynex Security contact form submission');
  payload.append('from_name', data.name);
  payload.append('name', data.name);
  payload.append('email', data.email);
  payload.append('reply_to', data.email);
  payload.append('phone', data.phone || '');
  payload.append('company', data.company || '');
  payload.append('message', data.message);
  payload.append('timestamp', metadata.timestamp);
  payload.append('ip_address', metadata.ipAddress);
  payload.append('user_agent', metadata.userAgent);

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: payload
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    const error = new Error(result.message || 'Web3Forms could not process the submission.');
    error.status = 502;
    error.web3FormsResult = result;
    throw error;
  }

  return result;
};

module.exports = { submitToWeb3Forms };
