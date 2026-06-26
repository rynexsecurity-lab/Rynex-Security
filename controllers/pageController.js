const renderPage = (page) => (req, res) => {
  const baseUrl = (process.env.BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
  const canonicalPath = page.route;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rynex Security',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    sameAs: [
      'https://www.linkedin.com/company/rynex-security',
      'https://www.instagram.com/rynex.security'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '03272873812',
      contactType: 'customer support',
      email: 'info@rynexsecurity.com'
    }
  };

  const web3FormsAccessKey = page.view === 'contact' ? (process.env.WEB3FORMS_ACCESS_KEY || '') : '';

  res.render(`pages/${page.view}`, {
    ...page,
    canonicalUrl: `${baseUrl}${canonicalPath}`,
    canonicalPath,
    structuredData,
    web3FormsAccessKey
  });
};

module.exports = { renderPage };
