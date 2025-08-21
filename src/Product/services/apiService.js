import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  healthCheck: () => apiClient.get('/health'),

  // User services
  users: {
    getAll: () => apiClient.get('/users'),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (userData) => apiClient.post('/users', userData),
    update: (id, userData) => apiClient.put(`/users/${id}`, userData),
    delete: (id) => apiClient.delete(`/users/${id}`),
    login: (credentials) => apiClient.post('/users/login', credentials),
    register: (userData) => apiClient.post('/users/register', userData),
  },

  // Product services
  products: {
    getAll: (params = {}) => apiClient.get('/products', { params }),
    getById: (id) => apiClient.get(`/products/${id}`),
    create: (productData) => apiClient.post('/products', productData),
    update: (id, productData) => apiClient.put(`/products/${id}`, productData),
    delete: (id) => apiClient.delete(`/products/${id}`),
    search: (query) => apiClient.get(`/products/search?q=${query}`),
    getByCategory: (categoryId) => apiClient.get(`/products/category/${categoryId}`),
    getFeatured: () => apiClient.get('/products/featured'),
    getDealOfTheDay: () => apiClient.get('/products/deal-of-the-day'),
    getShopAll: (params = {}) => apiClient.get('/products/shop-all', { params }),
    getBestsellers: () => apiClient.get('/products/bestsellers'),
    getOnSale: () => apiClient.get('/products/on-sale'),
    getNewArrivals: () => apiClient.get('/products/new'),
    getFilterOptions: () => apiClient.get('/products/filter-options'),
  },

  // Product Category services
  productCategories: {
    getAll: () => apiClient.get('/product-categories'),
    getById: (id) => apiClient.get(`/product-categories/${id}`),
    create: (categoryData) => apiClient.post('/product-categories', categoryData),
    update: (id, categoryData) => apiClient.put(`/product-categories/${id}`, categoryData),
    delete: (id) => apiClient.delete(`/product-categories/${id}`),
  },

  // Pet services
  pets: {
    getAll: (params = {}) => apiClient.get('/pets', { params }),
    getById: (id) => apiClient.get(`/pets/${id}`),
    create: (petData) => apiClient.post('/pets', petData),
    update: (id, petData) => apiClient.put(`/pets/${id}`, petData),
    delete: (id) => apiClient.delete(`/pets/${id}`),
    getByType: (typeId) => apiClient.get(`/pets/type/${typeId}`),
  },

  // Pet Type services
  petTypes: {
    getAll: () => apiClient.get('/pet-types'),
    getById: (id) => apiClient.get(`/pet-types/${id}`),
    create: (typeData) => apiClient.post('/pet-types', typeData),
    update: (id, typeData) => apiClient.put(`/pet-types/${id}`, typeData),
    delete: (id) => apiClient.delete(`/pet-types/${id}`),
  },

  // Cart services
  cart: {
    getCart: (userId) => apiClient.get(`/cart/${userId}`),
    addItem: (cartData) => apiClient.post('/cart', cartData),
    updateItem: (id, itemData) => apiClient.put(`/cart/${id}`, itemData),
    removeItem: (id) => apiClient.delete(`/cart/${id}`),
    clearCart: (userId) => apiClient.delete(`/cart/clear/${userId}`),
  },

  // Order services
  orders: {
    getAll: (userId) => apiClient.get(`/orders?userId=${userId}`),
    getById: (id) => apiClient.get(`/orders/${id}`),
    create: (orderData) => apiClient.post('/orders', orderData),
    update: (id, orderData) => apiClient.put(`/orders/${id}`, orderData),
    cancel: (id) => apiClient.put(`/orders/${id}/cancel`),
    getOrderHistory: (userId) => apiClient.get(`/orders/history/${userId}`),
  },

  // Blog services
  blogs: {
    getAll: (params = {}) => apiClient.get('/blog-posts', { params }),
    getById: (id) => apiClient.get(`/blog-posts/${id}`),
    create: (blogData) => apiClient.post('/blog-posts', blogData),
    update: (id, blogData) => apiClient.put(`/blog-posts/${id}`, blogData),
    delete: (id) => apiClient.delete(`/blog-posts/${id}`),
    getByCategory: (categoryName) => apiClient.get(`/blog-posts/category/${categoryName}`),
    getFeatured: (limit = 5) => apiClient.get(`/blog-posts/featured?limit=${limit}`),
    getRecent: (limit = 5) => apiClient.get(`/blog-posts/recent?limit=${limit}`),
  },

  // Blog Category services
  blogCategories: {
    getAll: () => apiClient.get('/blog-categories'),
    getById: (id) => apiClient.get(`/blog-categories/${id}`),
    create: (categoryData) => apiClient.post('/blog-categories', categoryData),
    update: (id, categoryData) => apiClient.put(`/blog-categories/${id}`, categoryData),
    delete: (id) => apiClient.delete(`/blog-categories/${id}`),
  },

  // Service services
  services: {
    getAll: () => apiClient.get('/services'),
    getById: (id) => apiClient.get(`/services/${id}`),
    create: (serviceData) => apiClient.post('/services', serviceData),
    update: (id, serviceData) => apiClient.put(`/services/${id}`, serviceData),
    delete: (id) => apiClient.delete(`/services/${id}`),
  },

  // Service Booking services
  serviceBookings: {
    getAll: (userId) => apiClient.get(`/service-bookings?userId=${userId}`),
    getById: (id) => apiClient.get(`/service-bookings/${id}`),
    create: (bookingData) => apiClient.post('/service-bookings', bookingData),
    update: (id, bookingData) => apiClient.put(`/service-bookings/${id}`, bookingData),
    cancel: (id) => apiClient.put(`/service-bookings/${id}/cancel`),
  },

  // Adoption Agency services
  adoptionAgencies: {
    getAll: () => apiClient.get('/adoption-agencies'),
    getById: (id) => apiClient.get(`/adoption-agencies/${id}`),
    create: (agencyData) => apiClient.post('/adoption-agencies', agencyData),
    update: (id, agencyData) => apiClient.put(`/adoption-agencies/${id}`, agencyData),
    delete: (id) => apiClient.delete(`/adoption-agencies/${id}`),
  },

  // Testimonial services
  testimonials: {
    getAll: () => apiClient.get('/testimonials'),
    getById: (id) => apiClient.get(`/testimonials/${id}`),
    create: (testimonialData) => apiClient.post('/testimonials', testimonialData),
    update: (id, testimonialData) => apiClient.put(`/testimonials/${id}`, testimonialData),
    delete: (id) => apiClient.delete(`/testimonials/${id}`),
    getFeatured: () => apiClient.get('/testimonials/featured'),
  },

  // Donation services
  donations: {
    getAll: () => apiClient.get('/donations'),
    getById: (id) => apiClient.get(`/donations/${id}`),
    create: (donationData) => apiClient.post('/donations', donationData),
    getUserDonations: (userId) => apiClient.get(`/donations/user/${userId}`),
  },

  // Brand services
  brands: {
    getAll: () => apiClient.get('/brands'),
    getById: (id) => apiClient.get(`/brands/${id}`),
    create: (brandData) => apiClient.post('/brands', brandData),
    update: (id, brandData) => apiClient.put(`/brands/${id}`, brandData),
    delete: (id) => apiClient.delete(`/brands/${id}`),
  },

  // Subscription services
  subscriptions: {
    getAll: () => apiClient.get('/subscriptions'),
    getById: (id) => apiClient.get(`/subscriptions/${id}`),
    create: (subscriptionData) => apiClient.post('/subscriptions', subscriptionData),
    update: (id, subscriptionData) => apiClient.put(`/subscriptions/${id}`, subscriptionData),
    cancel: (id) => apiClient.put(`/subscriptions/${id}/cancel`),
    getUserSubscriptions: (userId) => apiClient.get(`/subscriptions/user/${userId}`),
  },

  // Static Content services
  staticContent: {
    getAll: () => apiClient.get('/static-content'),
    getById: (id) => apiClient.get(`/static-content/${id}`),
    getByKey: (key) => apiClient.get(`/static-content/key/${key}`),
    create: (contentData) => apiClient.post('/static-content', contentData),
    update: (id, contentData) => apiClient.put(`/static-content/${id}`, contentData),
    delete: (id) => apiClient.delete(`/static-content/${id}`),
  },

  // Credit Card services
  creditCards: {
    getAll: (userId) => apiClient.get(`/credit-cards?userId=${userId}`),
    getById: (id) => apiClient.get(`/credit-cards/${id}`),
    create: (cardData) => apiClient.post('/credit-cards', cardData),
    update: (id, cardData) => apiClient.put(`/credit-cards/${id}`, cardData),
    delete: (id) => apiClient.delete(`/credit-cards/${id}`),
  },
};

export default apiService;
