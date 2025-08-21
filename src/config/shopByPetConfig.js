// ====================================
// SHOP BY PET CONFIGURATIONS
// ====================================

const petCategories = [
  {
    id: 'dogs',
    name: 'Dogs',
    icon: '🐕',
    description: 'Loyal companions with endless love and energy',
    productCount: '250+ Products',
    color: '#f97316',
    path: '/pets/dogs'
  },
  {
    id: 'cats',
    name: 'Cats',
    icon: '🐱',
    description: 'Independent friends with mysterious charm',
    productCount: '180+ Products',
    color: '#8b5cf6',
    path: '/pets/cats'
  },
  {
    id: 'birds',
    name: 'Birds',
    icon: '🦜',
    description: 'Colorful companions that brighten your day',
    productCount: '120+ Products',
    color: '#06b6d4',
    path: '/pets/birds'
  },
  {
    id: 'fish',
    name: 'Fish',
    icon: '🐠',
    description: 'Peaceful aquatic friends for relaxation',
    productCount: '90+ Products',
    color: '#10b981',
    path: '/pets/fish'
  },
  {
    id: 'rabbits',
    name: 'Rabbits',
    icon: '🐰',
    description: 'Gentle hoppers with soft hearts',
    productCount: '75+ Products',
    color: '#f59e0b',
    path: '/pets/rabbits'
  },
  {
    id: 'hamsters',
    name: 'Hamsters',
    icon: '🐹',
    description: 'Tiny treasures with big personalities',
    productCount: '60+ Products',
    color: '#ef4444',
    path: '/pets/hamsters'
  }
];

// Configuration for different page types
export const shopByPetConfigs = {
  // Homepage configuration
  homepage: {
    title: "Shop by Your Pet",
    subtitle: "Find everything your furry, feathered, or finned friend needs in one place",
    layout: "grid",
    categories: petCategories,
    showProductCount: true,
    showDescription: false,
    showViewAll: true,
    viewAllText: "View All Products",
    viewAllPath: "/product",
    theme: "home-theme",
    maxDisplay: 6,
    onCategoryClick: (category) => {
      // Homepage specific navigation
      console.log('Category clicked:', category);
    },
    onViewAllClick: () => {
      console.log('View all clicked - should navigate to products');
    }
  },

  // Food page configuration
  food: {
    title: "Pet Food by Species",
    subtitle: "Nutritious meals tailored to your pet's specific dietary needs",
    layout: "cards",
    categories: petCategories.map(cat => ({
      ...cat,
      description: `Premium ${cat.name.toLowerCase()} food and treats`,
      path: `/food/${cat.id}`,
      productCount: `${Math.floor(Math.random() * 50) + 20}+ Food Items`
    })),
    showProductCount: true,
    showDescription: true,
    showViewAll: false, // Food page doesn't need view all button (already on food page)
    viewAllText: "View All Food",
    viewAllPath: "/food",
    theme: "food-theme",
    maxDisplay: 6,
    onCategoryClick: (category) => {
      // Food specific navigation
      console.log('Food category clicked:', category);
    },
    onViewAllClick: () => {
      console.log('View all food clicked');
    }
  },

  // Product page configuration
  product: {
    title: "Products by Pet Type",
    subtitle: "Quality accessories, toys, and essentials for every type of pet",
    layout: "cards",
    categories: petCategories.map(cat => ({
      ...cat,
      description: `Toys, accessories, and care products for ${cat.name.toLowerCase()}`,
      path: `/products/${cat.id}`,
      productCount: `${Math.floor(Math.random() * 80) + 40}+ Products`
    })),
    showProductCount: true,
    showDescription: true,
    showViewAll: false, // Product page doesn't need view all button (already on product page)
    viewAllText: "View All Products",
    viewAllPath: "/product",
    theme: "product-theme",
    maxDisplay: 6,
    onCategoryClick: (category) => {
      // Product specific navigation
      console.log('Product category clicked:', category);
    },
    onViewAllClick: () => {
      console.log('View all products clicked');
    }
  },

  // Services page configuration
  services: {
    title: "Services by Pet Type",
    subtitle: "Professional care and services for your beloved companions",
    layout: "grid",
    categories: petCategories.map(cat => ({
      ...cat,
      description: `Grooming, training, and care services for ${cat.name.toLowerCase()}`,
      path: `/services/${cat.id}`,
      productCount: `${Math.floor(Math.random() * 15) + 5}+ Services`
    })),
    showProductCount: false,
    showDescription: false,
    showViewAll: true,
    viewAllText: "View All Services",
    viewAllPath: "/services",
    theme: "home-theme",
    maxDisplay: 6,
    onCategoryClick: (category) => {
      // Services specific navigation
      window.location.href = category.path;
    },
    onViewAllClick: () => {
      window.location.href = "/services";
    }
  }
};

// Alternative category sets for different contexts
export const petCategoryVariants = {
  // Minimal set for compact displays
  essential: petCategories.slice(0, 4),
  
  // Popular pets only
  popular: petCategories.filter(cat => ['dogs', 'cats', 'fish', 'birds'].includes(cat.id)),
  
  // All categories
  complete: petCategories,
  
  // Custom categories for adoption
  adoption: [
    {
      id: 'puppies',
      name: 'Puppies',
      icon: '🐶',
      description: 'Adorable young dogs looking for loving homes',
      productCount: '25+ Available',
      color: '#f97316',
      path: '/adoption/puppies'
    },
    {
      id: 'kittens',
      name: 'Kittens',
      icon: '🐱',
      description: 'Playful young cats ready for adoption',
      productCount: '18+ Available',
      color: '#8b5cf6',
      path: '/adoption/kittens'
    },
    {
      id: 'senior-pets',
      name: 'Senior Pets',
      icon: '🐕‍🦺',
      description: 'Wise companions looking for their forever homes',
      productCount: '12+ Available',
      color: '#6b7280',
      path: '/adoption/seniors'
    },
    {
      id: 'special-needs',
      name: 'Special Needs',
      icon: '💙',
      description: 'Beautiful souls needing extra love and care',
      productCount: '8+ Available',
      color: '#3b82f6',
      path: '/adoption/special-needs'
    }
  ]
};

// Utility functions for configuration
export const shopByPetUtils = {
  // Get configuration by page type
  getConfig: (pageType) => {
    return shopByPetConfigs[pageType] || shopByPetConfigs.homepage;
  },

  // Get custom configuration with overrides
  getCustomConfig: (pageType, overrides = {}) => {
    const baseConfig = shopByPetConfigs[pageType] || shopByPetConfigs.homepage;
    return {
      ...baseConfig,
      ...overrides,
      categories: overrides.categories || baseConfig.categories
    };
  },

  // Get categories by variant
  getCategoriesByVariant: (variant) => {
    return petCategoryVariants[variant] || petCategoryVariants.complete;
  },

  // Create quick config for testing
  createQuickConfig: (title, layout = 'grid', categories = petCategories.slice(0, 4)) => {
    return {
      title,
      subtitle: "Quick configuration for testing",
      layout,
      categories,
      showProductCount: true,
      showDescription: layout === 'cards',
      showViewAll: false,
      theme: "home-theme",
      maxDisplay: categories.length,
      onCategoryClick: (category) => console.log('Category clicked:', category),
      onViewAllClick: () => console.log('View all clicked')
    };
  }
};

// Export default configuration
export default shopByPetConfigs;
