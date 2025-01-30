export const getSecureUrl = (url) => {
  if (!url) return '';

  try {
    // Parse the URL to handle it properly
    const urlObj = new URL(url);

    // Handle Cloudinary URLs
    if (urlObj.hostname.includes('cloudinary.com')) {
      // Build secure URL with proper protocol and transformations
      const parts = url.split('/upload/');
      if (parts.length === 2) {
        const [basePath, resourcePath] = parts;
        const securePath = basePath.replace('http://', 'https://');
        
        // Add fetch format for images if needed
        const isImage = /\.(jpg|jpeg|png|gif|avif|webp)$/.test(resourcePath.toLowerCase());
        const transformations = isImage ? 'f_auto,q_auto/' : '';
        
        return `${securePath}/upload/${transformations}${resourcePath}`;
      }
    }

    // For non-Cloudinary URLs, just ensure HTTPS
    return url.replace(/^http:\/\//i, 'https://');
  } catch (error) {
    console.error('Error processing URL:', error);
    return url; // Return original URL if parsing fails
  }
};