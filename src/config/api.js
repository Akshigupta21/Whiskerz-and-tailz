// Configuration for API endpoints and app settings
export const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  
  // App Information
  APP_NAME: 'Pet Lover',
  VERSION: '1.0.0',
  
  // Environment
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Default fallback data
  DEFAULT_USER: {
    id: 'demo',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Pet Street, Animal City, AC 12345',
    profileImage: 'https://placehold.co/150x150/E8F5E8/4A5D4A?text=DU',
    joinDate: new Date().toISOString().split('T')[0],
    bio: 'Demo user profile - please connect to your backend API.',
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      marketingEmails: true,
      orderUpdates: true
    }
  },
  
  // API Endpoints
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    
    // Users
    USER_PROFILE: '/users/:userId',
    USER_PREFERENCES: '/users/:userId/preferences',
    UPLOAD_AVATAR: '/users/:userId/profile-image',
    
    // Pets
    USER_PETS: '/users/:userId/pets',
    PET_DETAIL: '/users/:userId/pets/:petId',
    
    // Orders
    USER_ORDERS: '/users/:userId/orders',
    ORDER_DETAIL: '/users/:userId/orders/:orderId',
    
    // Wishlist
    USER_WISHLIST: '/users/:userId/wishlist',
    WISHLIST_ITEM: '/users/:userId/wishlist/:productId'
  }
};

export default config;
