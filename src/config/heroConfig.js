// Hero Section Configuration for Different Pages
// Enhanced UI with Multiple Themes and Transition Effects
export const heroConfigs = {

  home: {
    title: "Your Pet's Best Friend",
    subtitle: "Premium Pet Care & Products",
    description: "Discover the finest pet products, expert veterinary care, and personalized nutrition plans for your beloved companions. Everything your pet needs in one place.",
    primaryButtonText: "Shop Now",
    secondaryButtonText: "Learn More",
    showVideoButton: true,
    videoButtonText: "Watch Our Story",
    backgroundImage: "https://images.pexels.com/photos/4498185/pexels-photo-4498185.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    showStats: true,
    showSocialProof: true,
    theme: "gradient-sunset", // Warm, welcoming theme for home
    animationType: "slide-up-fade",
    customFeatures: [
      { icon: "🛍️", title: "Pet Products", description: "Premium toys & accessories" },
      { icon: "🥘", title: "Premium Food", description: "Nutritious meals & treats" },
      { icon: "⚕️", title: "Health Care", description: "Expert veterinary services" },
      { icon: "💝", title: "Special Offers", description: "Exclusive deals & discounts" }
    ]
  },

  about: {
    title: "About Wiskerz & Tail",
    subtitle: "Caring for Pets Since 2010", 
    description: "We're passionate pet lovers dedicated to providing exceptional care and premium products. Our mission is to strengthen the bond between pets and their families.",
    primaryButtonText: "Our Story",
    secondaryButtonText: "Meet Our Team",
    showVideoButton: true,
    videoButtonText: "Watch Journey",
    backgroundImage: "https://images.pexels.com/photos/6568956/pexels-photo-6568956.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    showStats: true,
    showSocialProof: false,
    theme: "glass-morphism", // Professional, trustworthy theme
    animationType: "zoom-in-fade",
    customFeatures: [
      { icon: "🏢", title: "Our Mission", description: "Pet happiness & health" },
      { icon: "👥", title: "Expert Team", description: "Certified pet professionals" },
      { icon: "🏆", title: "15+ Years", description: "Experience in pet care" },
      { icon: "❤️", title: "Pet Lovers", description: "Passionate about animals" }
    ]
  },

  food: {
    title: "Premium Pet Food",
    subtitle: "Nutrition That Nourishes",
    description: "Discover our carefully curated selection of premium pet foods, from organic treats to specialized diets. Every meal is a step towards better health.",
    primaryButtonText: "Shop Food",
    secondaryButtonText: "Nutrition Guide",
    showVideoButton: false,
    backgroundImage: "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    showStats: true,
    showSocialProof: true,
    theme: "nature-green", // Fresh, organic theme for food
    animationType: "slide-left-bounce",
    customFeatures: [
      { icon: "🌱", title: "Organic Food", description: "Natural & healthy ingredients" },
      { icon: "🥩", title: "Raw Diets", description: "Fresh meat & proteins" },
      { icon: "🍎", title: "Special Diets", description: "Allergies & sensitivities" },
      { icon: "🎂", title: "Treats", description: "Delicious & nutritious snacks" }
    ],
    customStats: [
      { number: "100+", label: "Food Brands" },
      { number: "5★", label: "Quality Rating" },
      { number: "30K+", label: "Fed Pets" },
      { number: "24h", label: "Fresh Delivery" }
    ]
  },

  products: {
    title: "Premium Pet Products",
    subtitle: "Everything Your Pet Needs",
    description: "From toys and accessories to grooming supplies and health products. Browse our extensive collection of premium pet products from trusted brands.",
    primaryButtonText: "Shop All",
    secondaryButtonText: "Categories",
    showVideoButton: false,
    backgroundImage: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    showStats: true,
    showSocialProof: true,
    theme: "vibrant-blue", // Dynamic, energetic theme for products
    animationType: "rotate-slide-in",
    customFeatures: [
      { icon: "🧸", title: "Toys & Games", description: "Fun & interactive playtime" },
      { icon: "🧴", title: "Grooming", description: "Shampoos & styling tools" },
      { icon: "🦴", title: "Accessories", description: "Collars, leashes & beds" },
      { icon: "💊", title: "Health Products", description: "Vitamins & supplements" }
    ],
    customStats: [
      { number: "1000+", label: "Products" },
      { number: "50+", label: "Top Brands" },
      { number: "99%", label: "Satisfaction" },
      { number: "2-Day", label: "Delivery" }
    ]
  },

  services: {
    title: "Pet Care Services",
    subtitle: "Professional Care When You Need It",
    description: "From veterinary care to grooming, training, and boarding. Our certified professionals provide comprehensive services to keep your pets healthy and happy.",
    primaryButtonText: "Book Service",
    secondaryButtonText: "View Services",
    showVideoButton: true,
    videoButtonText: "See Facilities",
    backgroundImage: "https://images.pexels.com/photos/6235663/pexels-photo-6235663.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    showStats: true,
    showSocialProof: true,
    theme: "medical-purple", // Professional, caring theme for services
    animationType: "wave-reveal",
    customFeatures: [
      { icon: "🏥", title: "Veterinary Care", description: "Health checkups & treatment" },
      { icon: "✂️", title: "Grooming", description: "Professional styling & spa" },
      { icon: "🎓", title: "Training", description: "Behavior & obedience classes" },
      { icon: "🏨", title: "Boarding", description: "Safe & comfortable stays" }
    ],
    customStats: [
      { number: "15+", label: "Vet Experts" },
      { number: "24/7", label: "Emergency Care" },
      { number: "10K+", label: "Pets Treated" },
      { number: "98%", label: "Success Rate" }
    ]
  },

  cart: {
    title: "Your Shopping Cart",
    subtitle: "Review Your Pet Essentials",
    description: "Almost there! Review your selected items and proceed to checkout. Your pets will love what you've chosen for them.",
    primaryButtonText: "Checkout",
    secondaryButtonText: "Continue Shopping",
    showVideoButton: false,
    backgroundImage: "",
    showStats: false,
    showSocialProof: false,
    theme: "minimal-clean", // Clean, focused theme for cart
    animationType: "scale-pulse",
    className: "hero-minimal", // Only for utility pages
    customFeatures: [
      { icon: "🛒", title: "Secure Checkout", description: "Safe & encrypted payment" },
      { icon: "🚚", title: "Fast Delivery", description: "2-day shipping available" },
      { icon: "↩️", title: "Easy Returns", description: "30-day return policy" },
      { icon: "🎁", title: "Gift Wrapping", description: "Free for special occasions" }
    ]
  },

  wishlist: {
    title: "Your Wishlist",
    subtitle: "Save Your Favorite Items",
    description: "Keep track of products you love and want to buy later. Never lose sight of that perfect toy or treat your pet has been eyeing.",
    primaryButtonText: "Add to Cart",
    secondaryButtonText: "Continue Shopping",
    showVideoButton: false,
    backgroundImage: "",
    showStats: false,
    showSocialProof: true,
    theme: "romantic-pink", // Warm, personal theme for wishlist
    animationType: "heart-beat",
    customFeatures: [
      { icon: "💖", title: "Favorites", description: "Save items you love" },
      { icon: "🔔", title: "Price Alerts", description: "Get notified of discounts" },
      { icon: "📋", title: "Easy Lists", description: "Organize by categories" },
      { icon: "📤", title: "Share Lists", description: "Send to family & friends" }
    ]
  },

  blog: {
    title: "Pet Care Blog",
    subtitle: "Stories, Tips & Expert Advice",
    description: "Discover expert pet care tips, heartwarming stories, and the latest insights from our community of pet lovers. Share your own experiences and connect with fellow pet parents.",
    primaryButtonText: "Read Latest",
    secondaryButtonText: "Write Story",
    showVideoButton: true,
    videoButtonText: "Watch Tips",
    backgroundImage: "https://images.pexels.com/photos/4498185/pexels-photo-4498185.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    showStats: true,
    showSocialProof: true,
    theme: "gradient-purple", // Creative, inspiring theme for blog
    animationType: "slide-up-fade",
    customFeatures: [
      { icon: "📝", title: "Expert Tips", description: "Professional pet care advice" },
      { icon: "❤️", title: "Pet Stories", description: "Heartwarming experiences" },
      { icon: "🏥", title: "Health Guides", description: "Wellness & nutrition tips" },
      { icon: "👥", title: "Community", description: "Connect with pet lovers" }
    ],
    customStats: [
      { number: "500+", label: "Articles" },
      { number: "10K+", label: "Readers" },
      { number: "50+", label: "Expert Writers" },
      { number: "Daily", label: "New Content" }
    ]
  }
};

// Helper function to get hero configuration for a specific page
export const getHeroConfig = (pageName) => {
  return heroConfigs[pageName] || heroConfigs.home;
};

// Helper function to get hero configuration with custom overrides
export const getCustomHeroConfig = (pageName, overrides = {}) => {
  const baseConfig = getHeroConfig(pageName);
  return { ...baseConfig, ...overrides };
};

export default heroConfigs;
