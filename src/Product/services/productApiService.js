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
    }
    return Promise.reject(error);
  }
);

// Product API service functions
export const productApiService = {
  // Get all products with filters
  async getAllProducts(filters = {}) {
    try {
      const response = await apiClient.get('/products', { params: filters });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch products from API:', error.message);
      throw error;
    }
  },

  // Get product by ID
  async getProductById(productId) {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch product by ID from API:', error.message);
      throw error;
    }
  },

  // Get product categories
  async getProductCategories() {
    try {
      const response = await apiClient.get('/product-categories');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch product categories from API:', error.message);
      throw error;
    }
  },

  // Get pet types
  async getPetTypes() {
    try {
      const response = await apiClient.get('/pet-types');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch pet types from API:', error.message);
      throw error;
    }
  },

  // Get brands
  async getBrands() {
    try {
      const response = await apiClient.get('/brands');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch brands from API:', error.message);
      throw error;
    }
  },

  // Test API connection
  async testConnection() {
    try {
      const response = await apiClient.get('/health');
      return response.status === 200;
    } catch (error) {
      console.warn('API connection test failed:', error.message);
      return false;
    }
  }
};

export default productApiService;
