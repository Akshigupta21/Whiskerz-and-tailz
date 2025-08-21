// Utility functions for the application

/**
 * Generate a placeholder image URL
 * @param {number} width - Width of the image
 * @param {number} height - Height of the image
 * @param {string} text - Text to display on the image
 * @param {string} bgColor - Background color (without #)
 * @param {string} textColor - Text color (without #)
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (width, height, text, bgColor = 'f97316', textColor = 'ffffff') => {
  const encodedText = encodeURIComponent(text || 'Image');
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Calculate percentage discount
 * @param {number} originalPrice - Original price
 * @param {number} salePrice - Sale price
 * @returns {number} Percentage discount
 */
export const calculateDiscount = (originalPrice, salePrice) => {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.slice(0, length) + '...';
};

/**
 * Generate a random ID
 * @returns {string} Random ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Format phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

/**
 * Generate a simple placeholder image URL with just a name
 * @param {string} name - Name/text to display on the image
 * @returns {string} Placeholder image URL
 */
export const getSimplePlaceholderImage = (name) => {
  return `https://via.placeholder.com/100x100/F59E0B/FFFFFF?text=${encodeURIComponent(name)}`;
};
