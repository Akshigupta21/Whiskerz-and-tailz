// Helper functions for Food components

export const formatPrice = (price) => {
  if (typeof price !== 'number') return '₹0';
  return `₹${price.toLocaleString('en-IN')}`;
};

export const calculateDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

export const getPlaceholderImage = (category = 'food') => {
  const placeholders = {
    food: 'https://via.placeholder.com/300x300/f97316/white?text=Pet+Food',
    product: 'https://via.placeholder.com/300x300/f97316/white?text=Pet+Product',
    default: 'https://via.placeholder.com/300x300/f97316/white?text=No+Image'
  };
  return placeholders[category] || placeholders.default;
};

export const getSimplePlaceholderImage = (text = 'Image') => {
  return `https://via.placeholder.com/300x300/f97316/white?text=${encodeURIComponent(text)}`;
};

export const generateProductId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(phone);
};

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

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const isInStock = (product) => {
  return product && product.stock > 0;
};

export const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
