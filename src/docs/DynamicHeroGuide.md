# Single Dynamic HeroSection Implementation Guide

## 🎯 **Overview**
You now have **one HeroSection component** that automatically changes its content, styling, and behavior based on the webpage. Here's how it works:

## 📁 **File Structure**
```
src/
├── components/
│   ├── HeroSection.jsx          # Single reusable hero component
│   └── HeroSection.css          # Enhanced styles with page-specific customizations
├── config/
│   └── heroConfig.js            # Configuration for all pages
└── [PageFolders]/
    └── YourPage.jsx             # Pages using the dynamic hero
```

## 🔧 **Implementation Examples**

### **Method 1: Pre-configured Pages (Easiest)**
```jsx
import HeroSection from '../components/HeroSection';
import { getHeroConfig } from '../config/heroConfig';

const YourPage = () => {
  const heroConfig = getHeroConfig('food'); // Available: home, about, food, products, services, cart, wishlist
  
  return (
    <div>
      <HeroSection 
        {...heroConfig}
        onButtonClick={() => console.log('Primary action')}
        onSecondaryButtonClick={() => console.log('Secondary action')}
        onVideoClick={() => console.log('Video action')} // If video button is enabled
      />
      {/* Rest of your page content */}
    </div>
  );
};
```

### **Method 2: Pre-configured + Custom Overrides**
```jsx
import { getCustomHeroConfig } from '../config/heroConfig';

const SpecialFoodPage = () => {
  const heroConfig = getCustomHeroConfig('food', {
    title: "Black Friday Sale",
    subtitle: "50% Off All Pet Food",
    primaryButtonText: "Shop Sale",
    customStats: [
      { number: "50%", label: "Max Discount" },
      { number: "24h", label: "Sale Ends" }
    ]
  });
  
  return <HeroSection {...heroConfig} onButtonClick={handleSale} />;
};
```

### **Method 3: Completely Custom**
```jsx
const CustomPage = () => {
  return (
    <HeroSection 
      title="Custom Page Title"
      subtitle="Your Custom Subtitle"
      description="Custom description for this specific page."
      primaryButtonText="Custom Action"
      secondaryButtonText="Custom Secondary"
      backgroundImage="your-custom-bg.jpg"
      showStats={true}
      showSocialProof={false}
      customStats={[
        { number: "100+", label: "Custom Stat" },
        { number: "24/7", label: "Support" }
      ]}
      className="hero-custom"
      onButtonClick={() => console.log('Custom action')}
    />
  );
};
```

## 🎨 **Available Page Configurations**

### **Home Page** (`getHeroConfig('home')`)
- **Style**: Blue gradient with sparkle effects
- **Content**: Welcome message, shop now CTA
- **Features**: Video button, stats, social proof
- **Background**: Pet care image

### **About Page** (`getHeroConfig('about')`)
- **Style**: Pink gradient with warm tones
- **Content**: Company story, team focus
- **Features**: Video button, stats, no social proof
- **Background**: Team/facility image

### **Food Page** (`getHeroConfig('food')`)
- **Style**: Aqua gradient with red CTA buttons
- **Content**: Nutrition-focused messaging
- **Features**: Custom food stats, no video button
- **Background**: Food/nutrition image

### **Products Page** (`getHeroConfig('products')`)
- **Style**: Soft pastels with dark text
- **Content**: Product showcase messaging
- **Features**: Custom product stats, no video button
- **Background**: Product display image

### **Services Page** (`getHeroConfig('services')`)
- **Style**: Pink/yellow gradient with glass effects
- **Content**: Professional care emphasis
- **Features**: Video button, custom service stats
- **Background**: Service facility image

### **Cart Page** (`getHeroConfig('cart')`)
- **Style**: Minimal height, simplified layout
- **Content**: Checkout encouragement
- **Features**: No stats, no social proof, no video
- **Background**: None (gradient only)

### **Wishlist Page** (`getHeroConfig('wishlist')`)
- **Style**: Orange/peach gradient
- **Content**: Wishlist management
- **Features**: Social proof only, no stats/video
- **Background**: None (gradient only)

## 🎯 **Page-Specific CSS Classes**

Each page automatically gets a unique CSS class for custom styling:

- `.hero-home` - Home page styling
- `.hero-about` - About page styling  
- `.hero-food` - Food page styling
- `.hero-products` - Products page styling
- `.hero-services` - Services page styling
- `.hero-cart` - Minimal cart styling
- `.hero-wishlist` - Wishlist styling
- `.hero-promotion` - Special promotion styling
- `.hero-minimal` - Utility pages styling

## 🔧 **Action Handler Examples**

```jsx
const YourPage = () => {
  const heroConfig = getHeroConfig('food');
  
  // Primary button handler
  const handlePrimaryAction = () => {
    // Scroll to products section
    document.querySelector('.products-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };
  
  // Secondary button handler  
  const handleSecondaryAction = () => {
    // Navigate to another page
    window.location.href = '/nutrition-guide';
  };
  
  // Video button handler
  const handleVideoAction = () => {
    // Open video modal
    setShowVideoModal(true);
  };
  
  return (
    <HeroSection 
      {...heroConfig}
      onButtonClick={handlePrimaryAction}
      onSecondaryButtonClick={handleSecondaryAction}
      onVideoClick={handleVideoAction}
    />
  );
};
```

## 📱 **Responsive Features**

The HeroSection automatically adapts to different screen sizes:
- **Desktop**: Full layout with all features
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Stacked layout, simplified stats grid
- **Small Mobile**: Further optimized for small screens

## ✨ **Advanced Features**

### **Custom Stats**
```jsx
const customStats = [
  { number: "1M+", label: "Happy Pets" },
  { number: "24/7", label: "Support" },
  { number: "5★", label: "Rating" },
  { number: "Free", label: "Shipping" }
];

<HeroSection customStats={customStats} />
```

### **Background Images**
```jsx
<HeroSection 
  backgroundImage="https://your-image-url.jpg"
  // Image will be overlaid with gradient for text readability
/>
```

### **Conditional Elements**
```jsx
<HeroSection 
  showStats={true}           // Show/hide stats section
  showSocialProof={false}    // Show/hide social proof
  showVideoButton={true}     // Show/hide video button
/>
```

## 🚀 **Implementation in Your Pages**

### **Already Implemented:**
✅ **About.jsx** - Using `getHeroConfig('about')`
✅ **Food.jsx** - Using `getHeroConfig('food')`  
✅ **Product.jsx** - Using `getHeroConfig('products')`

### **To Implement in Other Pages:**
1. Import the components
2. Get the configuration
3. Add action handlers
4. Replace existing hero sections

## 💡 **Benefits**

✅ **Single Component** - One hero component for all pages
✅ **Centralized Config** - Easy to update content across pages
✅ **Flexible Overrides** - Customize individual pages as needed
✅ **Consistent Design** - Unified visual language
✅ **Easy Maintenance** - Update once, affects all pages
✅ **Performance** - No duplicate code or styles
✅ **Responsive** - Works perfectly on all devices

## 🎨 **Customization Examples**

### **Holiday Theme**
```jsx
const holidayConfig = getCustomHeroConfig('home', {
  title: "Holiday Pet Sale",
  subtitle: "Special Offers for Your Furry Friends",
  className: "hero-holiday",
  customStats: [
    { number: "70%", label: "Max Savings" },
    { number: "Dec 31", label: "Sale Ends" }
  ]
});
```

### **Emergency Services**
```jsx
const emergencyConfig = getCustomHeroConfig('services', {
  title: "24/7 Emergency Care",
  subtitle: "When Your Pet Needs Immediate Help",
  primaryButtonText: "Call Now",
  className: "hero-emergency",
  showVideoButton: false
});
```

This system gives you **maximum flexibility** with **minimum code duplication**. One component, infinite possibilities! 🎯
