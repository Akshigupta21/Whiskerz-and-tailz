// API Service for Pet Lover App
import config from '../config/api';

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      console.log('Headers:', config.headers);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`HTTP error! status: ${response.status}, response: ${errorData}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorData}`);
      }
      
      const data = await response.json();
      console.log(`API Response: ${url}`, data);
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // User Profile Methods
  async getUserProfile(userId) {
    try {
      console.log('Fetching user profile for ID:', userId);
      // Use the /profile endpoint for authenticated users
      return await this.request(`/users/profile`);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, userData) {
    try {
      console.log('Updating user profile:', userData);
      // Use the /profile endpoint for authenticated users
      return await this.request(`/users/profile`, {
        method: 'PATCH',
        body: JSON.stringify(userData)
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Get user type from database
  async getUserType(userId) {
    const user = await this.getUserProfile(userId);
    return user.userType;
  }

  async updateUserPreferences(userId, preferences) {
    return this.request(`/users/${userId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(preferences)
    });
  }

  // Pet Methods
  async getUserPets(userId) {
    return this.request(`/users/${userId}/pets`);
  }

  async createPet(userId, petData) {
    return this.request(`/users/${userId}/pets`, {
      method: 'POST',
      body: JSON.stringify(petData)
    });
  }

  async updatePet(userId, petId, petData) {
    return this.request(`/users/${userId}/pets/${petId}`, {
      method: 'PUT',
      body: JSON.stringify(petData)
    });
  }

  async deletePet(userId, petId) {
    return this.request(`/users/${userId}/pets/${petId}`, {
      method: 'DELETE'
    });
  }

  // Order Methods
  async getUserOrders(userId) {
    try {
      return await this.request(`/users/${userId}/orders`);
    } catch (error) {
      // Return demo data if API fails
      console.log('Using fallback order data');
      return [
        {
          id: 'ORD-001',
          date: '2024-01-20',
          total: 89.99,
          status: 'Delivered',
          items: 3,
          products: [
            { name: 'Premium Dog Food', quantity: 2, price: 45.99 },
            { name: 'Pet Toy', quantity: 1, price: 12.99 }
          ]
        },
        {
          id: 'ORD-002',
          date: '2024-01-15',
          total: 156.50,
          status: 'Delivered',
          items: 5,
          products: [
            { name: 'Cat Litter', quantity: 3, price: 25.00 },
            { name: 'Cat Food', quantity: 2, price: 30.75 }
          ]
        },
        {
          id: 'ORD-003',
          date: '2024-01-10',
          total: 42.25,
          status: 'Processing',
          items: 2,
          products: [
            { name: 'Pet Shampoo', quantity: 1, price: 18.99 },
            { name: 'Pet Brush', quantity: 1, price: 23.26 }
          ]
        }
      ];
    }
  }

  async getOrderDetails(userId, orderId) {
    try {
      return await this.request(`/users/${userId}/orders/${orderId}`);
    } catch (error) {
      // Return demo data for the specific order
      const demoOrders = await this.getUserOrders(userId);
      const order = demoOrders.find(o => o.id === orderId);
      if (order) {
        return {
          ...order,
          shipping: {
            address: '123 Pet Street, Animal City, AC 12345',
            method: 'Standard Shipping',
            tracking: 'TRK123456789'
          },
          payment: {
            method: 'Credit Card',
            last4: '1234'
          }
        };
      }
      throw error;
    }
  }

  // Wishlist Methods
  async getUserWishlist(userId) {
    return this.request(`/users/${userId}/wishlist`);
  }

  async addToWishlist(userId, productId) {
    return this.request(`/users/${userId}/wishlist`, {
      method: 'POST',
      body: JSON.stringify({ productId })
    });
  }

  async removeFromWishlist(userId, productId) {
    return this.request(`/users/${userId}/wishlist/${productId}`, {
      method: 'DELETE'
    });
  }

  // Authentication Methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  // Profile Image Upload
  async uploadProfileImage(userId, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    return fetch(`${this.baseURL}/users/${userId}/profile-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: formData
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  // Additional methods needed for ProfilePage functionality
  async removeFromWishlist(userId, itemId) {
    return this.request(`/users/${userId}/wishlist/${itemId}`, {
      method: 'DELETE'
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE'
    });
  }

  async getUserWishlist(userId) {
    try {
      return await this.request(`/users/${userId}/wishlist`);
    } catch (error) {
      // Return demo wishlist data if API fails
      console.log('Using fallback wishlist data');
      return [
        {
          id: 'wish-001',
          name: 'Premium Dog Food',
          price: 45.99,
          image: 'https://placehold.co/200x150/E8F5E8/4A5D4A?text=Food',
          category: 'Food'
        },
        {
          id: 'wish-002',
          name: 'Interactive Cat Toy',
          price: 24.99,
          image: 'https://placehold.co/200x150/E8F5E8/4A5D4A?text=Toy',
          category: 'Toys'
        }
      ];
    }
  }

  // Product Management Methods
  async getAllProducts(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/products?${queryParams}` : '/products';
      return await this.request(url);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Return fallback data
      return [
        {
          id: 'prod-001',
          name: 'Premium Dog Food',
          price: 45.99,
          category: 'Food',
          brand: 'PetNutrition',
          description: 'High-quality nutrition for adult dogs',
          image: 'https://placehold.co/300x300/E8F5E8/4A5D4A?text=Dog+Food',
          inStock: true,
          businessId: null,
          businessName: 'Pet Store Chain'
        }
      ];
    }
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(productId, productData) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE'
    });
  }

  async getBusinessProducts(businessId) {
    try {
      return await this.request(`/products?businessId=${businessId}`);
    } catch (error) {
      console.error('Error fetching business products:', error);
      return [];
    }
  }

  // Food Management Methods (similar to products)
  async getAllFoods(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/foods?${queryParams}` : '/foods';
      return await this.request(url);
    } catch (error) {
      console.error('Error fetching foods:', error);
      return [];
    }
  }

  async createFood(foodData) {
    return this.request('/foods', {
      method: 'POST',
      body: JSON.stringify(foodData)
    });
  }

  // Service Management Methods
  async getAllServices(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/services?${queryParams}` : '/services';
      return await this.request(url);
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }

  async createService(serviceData) {
    return this.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData)
    });
  }

  async updateService(serviceId, serviceData) {
    return this.request(`/services/${serviceId}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData)
    });
  }

  async deleteService(serviceId) {
    return this.request(`/services/${serviceId}`, {
      method: 'DELETE'
    });
  }

  async getBusinessServices(businessId) {
    try {
      return await this.request(`/services?businessId=${businessId}`);
    } catch (error) {
      console.error('Error fetching business services:', error);
      return [];
    }
  }

  // Metadata API methods for forms
  async getCategories() {
    try {
      return await this.request('/product-categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getBrands() {
    try {
      return await this.request('/brands');
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  async getPetTypes() {
    try {
      return await this.request('/pet-types');
    } catch (error) {
      console.error('Error fetching pet types:', error);
      return [];
    }
  }
}

// Export singleton instance
export default new ApiService();

// Export class for testing
export { ApiService };
