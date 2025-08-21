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
      // Optionally redirect to login page
    }
    return Promise.reject(error);
  }
);

// Food API service functions
export const foodApiService = {
  // Get all foods with filters
  async getAllFoods(filters = {}, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc') {
    try {
      const params = {
        page,
        limit,
        sortBy,
        sortOrder,
        ...filters
      };
      const response = await apiClient.get('/foods', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch foods from API:', error.message);
      throw error;
    }
  },

  // Get featured foods
  async getFeaturedFoods(limit = 10) {
    try {
      const response = await apiClient.get('/foods/featured', { params: { limit } });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch featured foods from API:', error.message);
      throw error;
    }
  },

  // Get deal of the day foods
  async getDealOfTheDay(limit = 5) {
    try {
      const response = await apiClient.get('/foods/deal-of-the-day', { params: { limit } });
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch deal of the day foods from API:', error.message);
      throw error;
    }
  },

  // Search foods
  async searchFoods(searchTerm, filters = {}, page = 1, limit = 20) {
    try {
      const params = {
        q: searchTerm,
        page,
        limit,
        ...filters
      };
      const response = await apiClient.get('/foods/search', { params });
      return response.data;
    } catch (error) {
      console.warn('Failed to search foods from API:', error.message);
      throw error;
    }
  },

  // Get food by ID
  async getFoodById(foodId) {
    try {
      const response = await apiClient.get(`/foods/${foodId}`);
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch food by ID from API:', error.message);
      throw error;
    }
  },

  // Get food categories
  async getFoodCategories() {
    try {
      const response = await apiClient.get('/foods/categories');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch food categories from API:', error.message);
      throw error;
    }
  },

  // Get food brands
  async getFoodBrands() {
    try {
      const response = await apiClient.get('/foods/brands');
      return response.data;
    } catch (error) {
      console.warn('Failed to fetch food brands from API:', error.message);
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

// Product API service functions (for product pages)
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
  }
};

export default { foodApiService, productApiService };
