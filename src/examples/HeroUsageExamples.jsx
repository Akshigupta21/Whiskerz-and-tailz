// Example Usage of Dynamic HeroSection Component
import React from 'react';
import HeroSection from '../components/HeroSection';
import { getHeroConfig, getCustomHeroConfig } from '../config/heroConfig';

// Example 1: Using pre-configured settings
const HomePage = () => {
  const heroConfig = getHeroConfig('home');
  
  const handleShopNow = () => {
    // Navigate to products page
    console.log('Navigate to products');
  };

  const handleLearnMore = () => {
    // Scroll to about section
    console.log('Scroll to about section');
  };

  const handleWatchVideo = () => {
    // Open video modal
    console.log('Open video modal');
  };

  return (
    <div>
      <HeroSection 
        {...heroConfig}
        onButtonClick={handleShopNow}
        onSecondaryButtonClick={handleLearnMore}
        onVideoClick={handleWatchVideo}
      />
      {/* Rest of homepage content */}
    </div>
  );
};

// Example 2: Using configuration with custom overrides
const FoodPage = () => {
  const heroConfig = getCustomHeroConfig('food', {
    title: "Organic Pet Food",
    subtitle: "Farm Fresh Nutrition",
    description: "Special promotion: 20% off all organic pet food this week!",
    primaryButtonText: "Shop Organic",
    backgroundImage: "https://custom-food-bg-image.jpg"
  });

  return (
    <div>
      <HeroSection 
        {...heroConfig}
        onButtonClick={() => console.log('Shop organic food')}
        onSecondaryButtonClick={() => console.log('View nutrition guide')}
      />
      {/* Rest of food page content */}
    </div>
  );
};

// Example 3: Completely custom configuration
const SpecialPromotionPage = () => {
  const customConfig = {
    title: "Black Friday Sale",
    subtitle: "Up to 70% Off Everything",
    description: "Limited time offer! The biggest sale of the year on all pet products, food, and services.",
    primaryButtonText: "Shop Sale",
    secondaryButtonText: "View Deals",
    showVideoButton: false,
    backgroundImage: "https://promo-bg-image.jpg",
    showStats: true,
    showSocialProof: true,
    className: "hero-promotion",
    customStats: [
      { number: "70%", label: "Max Discount" },
      { number: "48h", label: "Sale Ends" },
      { number: "1000+", label: "Items on Sale" },
      { number: "Free", label: "Shipping" }
    ]
  };

  return (
    <div>
      <HeroSection 
        {...customConfig}
        onButtonClick={() => console.log('Shop sale items')}
        onSecondaryButtonClick={() => console.log('View all deals')}
      />
      {/* Rest of promotion page content */}
    </div>
  );
};

// Example 4: Minimal hero for utility pages
const CheckoutPage = () => {
  return (
    <div>
      <HeroSection 
        title="Secure Checkout"
        subtitle="Complete Your Purchase"
        description="You're just one step away from getting amazing products for your pet."
        primaryButtonText="Complete Order"
        showStats={false}
        showSocialProof={false}
        showVideoButton={false}
        className="hero-minimal"
        onButtonClick={() => console.log('Process payment')}
      />
      {/* Checkout form content */}
    </div>
  );
};

export { HomePage, FoodPage, SpecialPromotionPage, CheckoutPage };
