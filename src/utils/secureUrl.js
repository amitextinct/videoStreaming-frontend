export const getSecureUrl = (url) => {
  if (!url) return '';
  
  // Convert to HTTPS
  let secureUrl = url.replace(/^http:\/\//i, 'https://');
  
  // Add crossorigin parameter for Cloudinary URLs
  if (secureUrl.includes('cloudinary.com')) {
    const separator = secureUrl.includes('?') ? '&' : '?';
    secureUrl += `${separator}crossorigin=anonymous`;
  }
  
  return secureUrl;
};