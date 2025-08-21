import { apiService } from './apiService';

// Mock data service that can be replaced with real API calls
export const dataService = {
  // Get all products
  async getProducts(filters = {}) {
    try {
      // Try to get from API first
      const response = await apiService.products.getAll(filters);
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data:', error.message);
      // Return mock data if API is not available
      return getMockProducts();
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const response = await apiService.products.getFeatured();
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data:', error.message);
      return getMockProducts().slice(0, 4);
    }
  },

  // Get deal of the day
  async getDealOfTheDay() {
    try {
      const response = await apiService.products.getDealOfTheDay();
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data:', error.message);
      const products = getMockProducts();
      return products[0]; // Return first product as deal of the day
    }
  },

  // Get pet types
  async getPetTypes() {
    try {
      const response = await apiService.petTypes.getAll();
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data:', error.message);
      return getMockPetTypes();
    }
  },

  // Get product categories
  async getProductCategories() {
    try {
      const response = await apiService.productCategories.getAll();
      return response.data;
    } catch (error) {
      console.warn('API not available, using mock data:', error.message);
      return getMockProductCategories();
    }
  },

  // Save cart to backend
  async saveCart(userId, cartItems) {
    try {
      const response = await apiService.cart.addItem({
        userId,
        items: cartItems
      });
      return response.data;
    } catch (error) {
      console.warn('Could not save cart to backend:', error.message);
      // Save to localStorage as fallback
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
      return cartItems;
    }
  },

  // Load cart from backend
  async loadCart(userId) {
    try {
      const response = await apiService.cart.getCart(userId);
      return response.data.items || [];
    } catch (error) {
      console.warn('Could not load cart from backend:', error.message);
      // Load from localStorage as fallback
      const saved = localStorage.getItem(`cart_${userId}`);
      return saved ? JSON.parse(saved) : [];
    }
  },

  // Test API connection
  async testConnection() {
    try {
      const response = await apiService.healthCheck();
      console.log('✅ Backend API is connected:', response.data);
      return true;
    } catch (error) {
      console.warn('❌ Backend API is not available:', error.message);
      return false;
    }
  }
};

// Mock data functions (fallback when API is not available)
function getMockProducts() {
  return [
    {
      id: 1,
      name: "Premium Dog Food",
      price: 29.99,
      originalPrice: 39.99,
      image: "/api/placeholder/300/300",
      category: "Food",
      petType: "Dog",
      brand: "Petto Premium",
      description: "High-quality nutrition for your beloved dog",
      rating: 4.5,
      reviews: 128,
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: "Cat Scratching Post",
      price: 45.99,
      originalPrice: 55.99,
      image: "/api/placeholder/300/300",
      category: "Toys",
      petType: "Cat",
      brand: "Feline Fun",
      description: "Keep your cat entertained and your furniture safe",
      rating: 4.3,
      reviews: 86,
      inStock: true,
      featured: true
    },
    {
      id: 3,
      name: "Bird Cage Deluxe",
      price: 89.99,
      originalPrice: 109.99,
      image: "/api/placeholder/300/300",
      category: "Housing",
      petType: "Bird",
      brand: "Avian Home",
      description: "Spacious and comfortable home for your feathered friend",
      rating: 4.7,
      reviews: 52,
      inStock: true,
      featured: false
    },
    {
      id: 4,
      name: "Fish Tank Filter",
      price: 24.99,
      originalPrice: 32.99,
      image: "/api/placeholder/300/300",
      category: "Accessories",
      petType: "Fish",
      brand: "AquaClear",
      description: "Keep your aquarium clean and healthy",
      rating: 4.2,
      reviews: 94,
      inStock: true,
      featured: true
    },
    {
      id: 5,
      name: "Rabbit Hay Premium",
      price: 18.99,
      originalPrice: 22.99,
      image: "/api/placeholder/300/300",
      category: "Food",
      petType: "Rabbit",
      brand: "Bunny Best",
      description: "Fresh timothy hay for optimal rabbit nutrition",
      rating: 4.6,
      reviews: 73,
      inStock: true,
      featured: false
    }
  ];
}

function getMockPetTypes() {
  return [
    { id: 1, name: "Dog", icon: "🐕", description: "Man's best friend" },
    { id: 2, name: "Cat", icon: "🐱", description: "Independent companions" },
    { id: 3, name: "Bird", icon: "🐦", description: "Colorful and social" },
    { id: 4, name: "Fish", icon: "🐠", description: "Peaceful aquatic pets" },
    { id: 5, name: "Rabbit", icon: "🐰", description: "Gentle and loving" }
  ];
}

function getMockProductCategories() {
  return [
    { id: 1, name: "Food", description: "Nutritious meals for all pets" },
    { id: 2, name: "Toys", description: "Fun and engaging playtime" },
    { id: 3, name: "Housing", description: "Comfortable homes and beds" },
    { id: 4, name: "Accessories", description: "Essential pet accessories" },
    { id: 5, name: "Healthcare", description: "Health and wellness products" }
  ];
}
