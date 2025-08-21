import React, { useState, useCallback } from 'react';
import './Food.css';

// Import your components
import HeroSection from '../components/HeroSection';
import { getHeroConfig } from '../config/heroConfig';
import DealOfTheDayBanner from './DealOfTheDayBanner';
import ShopByPet from '../components/ShopByPet'; // Common ShopByPet component
import FiltersAndCategories from './FilterAndCategories';
import SpecialDietaryNeeds from './SpecialDietaryNeed';
import FeaturedFood from './FeatureFood';
import ShopAll from './ShopAll';
import FeaturedBrands from './FeaturedBrands';
import PersonalizedNutrition from './PersonalizedNutrition';
import PersonalizedRecommendations from './PersonalizedRecommendation';
import AutoDelivery from './AutoDelivery';
import Testimonials from './Testimonial';
import CallToAction from './CallToAction';
import ShoppingCart from './ShoppingCart';
import Checkout from './CheckoutPage';
import Wishlist from './Wishlist';
import AddToCartModal from './AddToCartModal';
// Import the shared ProductDetailPage component
import ProductDetailPage from '../Product/ProductDetailPage';

function Food({ 
  globalCartItems = [], 
  globalWishlistItems = [], 
  addToGlobalCart, 
  addToGlobalWishlist, 
  removeFromGlobalCart, 
  removeFromGlobalWishlist 
}) {
  const [cartItems, setCartItems] = useState(globalCartItems);
  const [wishlistItems, setWishlistItems] = useState(globalWishlistItems);
  const [currentPage, setCurrentPage] = useState('home');
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [productInModal, setProductInModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Get hero configuration for Food page
  const heroConfig = getHeroConfig('food');

  // Hero action handlers
  const handleShopFood = () => {
    // Scroll to featured food section or filter section
    const featuredSection = document.querySelector('.featured-food, .filters-categories');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNutritionGuide = () => {
    // Scroll to personalized nutrition section
    const nutritionSection = document.querySelector('.personalized-nutrition');
    if (nutritionSection) {
      nutritionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePetCategoryClick = useCallback((category) => {
    // Handle pet category selection - could scroll to filtered products or apply filters
    console.log('Selected pet category:', category.name);
    // Scroll to ShopAll section with the selected category
    const shopAllSection = document.querySelector('.shop-all-section');
    if (shopAllSection) {
      shopAllSection.scrollIntoView({ behavior: 'smooth' });
    }
    // You could also set a filter state here if needed
  }, []);

  // Sync global state with local state
  React.useEffect(() => {
    setCartItems(globalCartItems);
  }, [globalCartItems]);

  React.useEffect(() => {
    setWishlistItems(globalWishlistItems);
  }, [globalWishlistItems]);

  const addToCart = useCallback(
    (product) => {
      // Update global state
      if (addToGlobalCart) {
        addToGlobalCart(product);
      }
      
      // Update local state for modal
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.id === product.id);
        const newItem = existingItem
          ? { ...existingItem, quantity: existingItem.quantity + 1 }
          : { ...product, quantity: 1 };
        setProductInModal(newItem);
        return existingItem
          ? prev.map((item) => (item.id === product.id ? newItem : item))
          : [...prev, newItem];
      });
      setShowAddToCartModal(true);
    },
    [addToGlobalCart]
  );

  const handleQuantityChange = useCallback(
    (productId, newQuantity) => {
      if (newQuantity < 1) return;
      setCartItems((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
      );
      setProductInModal((prev) =>
        prev && prev.id === productId ? { ...prev, quantity: newQuantity } : prev
      );
    },
    []
  );

  const removeFromCart = useCallback(
    (productId) => {
      if (removeFromGlobalCart) {
        removeFromGlobalCart(productId);
      }
      setCartItems((prev) => prev.filter((item) => item.id !== productId));
    },
    [removeFromGlobalCart]
  );

  const moveToWishlist = useCallback(
    (productId) => {
      setCartItems((prev) => {
        const item = prev.find((i) => i.id === productId);
        if (item) {
          if (addToGlobalWishlist) {
            addToGlobalWishlist(item);
          }
          setWishlistItems((wishlist) =>
            wishlist.some((i) => i.id === productId)
              ? wishlist
              : [...wishlist, { ...item, quantity: 1 }]
          );
          if (removeFromGlobalCart) {
            removeFromGlobalCart(productId);
          }
          return prev.filter((i) => i.id !== productId);
        }
        return prev;
      });
    },
    [addToGlobalWishlist, removeFromGlobalCart]
  );

  const addToWishlist = useCallback(
    (product) => {
      if (addToGlobalWishlist) {
        addToGlobalWishlist(product);
      }
      setWishlistItems((prev) =>
        prev.some((i) => i.id === product.id)
          ? prev
          : [...prev, { ...product, quantity: 1 }]
      );
    },
    [addToGlobalWishlist]
  );

  const removeFromWishlist = useCallback(
    (productId) => {
      if (removeFromGlobalWishlist) {
        removeFromGlobalWishlist(productId);
      }
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
    },
    [removeFromGlobalWishlist]
  );

  const moveToCartFromWishlist = useCallback(
    (productId) => {
      setWishlistItems((prev) => {
        const item = prev.find((i) => i.id === productId);
        if (item) {
          setCartItems((cart) => {
            const existing = cart.find((i) => i.id === productId);
            return existing
              ? cart.map((i) => (i.id === productId ? { ...i, quantity: i.quantity + 1 } : i))
              : [...cart, { ...item, quantity: 1 }];
          });
          return prev.filter((i) => i.id !== productId);
        }
        return prev;
      });
    },
    []
  );

  const clearCart = useCallback(() => setCartItems([]), []);
  const closeAddToCartModal = useCallback(() => {
    setShowAddToCartModal(false);
    setProductInModal(null);
  }, []);

  const viewCart = useCallback(() => {
    setCurrentPage('cart');
    closeAddToCartModal();
  }, [closeAddToCartModal]);

  const proceedToCheckout = useCallback(() => setCurrentPage('checkout'), []);
  const goToHome = useCallback(() => setCurrentPage('home'), []);
  
  // Navigation to product detail page
  const navigateToProductDetail = useCallback((product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  }, []);
  
  const navigateBack = useCallback(() => {
    setCurrentPage('home');
    setSelectedProduct(null);
  }, []);

  const calculateSubtotal = useCallback(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const calculateShipping = useCallback(() => 8.99, []);
  const calculateTax = useCallback((subtotal) => 21.19, []);
  const calculateDiscount = useCallback(() => 10.0, []);

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const tax = calculateTax(subtotal);
  const discount = calculateDiscount();
  const total = subtotal + shipping + tax - discount;

  const orderSummary = {
    subtotal,
    shipping,
    tax,
    discount,
    total,
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
  };

  return (
    <div className="food-app">
      <main className="food-main-content">
        {currentPage === 'home' && (
          <>
            <HeroSection 
              {...heroConfig}
              onButtonClick={handleShopFood}
              onSecondaryButtonClick={handleNutritionGuide}
            />
            <DealOfTheDayBanner />
            <ShopByPet pageType="food" />
           
            <SpecialDietaryNeeds />
            <FeaturedFood
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              onProductClick={navigateToProductDetail}
              onViewAllFood={() => {
                // Scroll to ShopAll section
                const shopAllSection = document.querySelector('.shop-all-section');
                if (shopAllSection) {
                  shopAllSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            <ShopAll
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              onProductClick={navigateToProductDetail}
            />
            <FeaturedBrands />
            <PersonalizedNutrition />
            <PersonalizedRecommendations />
            <AutoDelivery />
            <Testimonials />
            <CallToAction />
          </>
        )}
        {currentPage === 'cart' && (
          <ShoppingCart
            cartItems={cartItems}
            wishlistItems={wishlistItems}
            onQuantityChange={handleQuantityChange}
            onRemoveFromCart={removeFromCart}
            onMoveToWishlist={moveToWishlist}
            onMoveToCartFromWishlist={moveToCartFromWishlist}
            onRemoveFromWishlist={removeFromWishlist}
            onClearCart={clearCart}
            orderSummary={orderSummary}
            onProceedToCheckout={proceedToCheckout}
            onContinueShopping={goToHome}
          />
        )}
        {currentPage === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            orderSummary={orderSummary}
            onBackToCart={() => setCurrentPage('cart')}
            onOrderPlaced={() => {
              setCartItems([]);
              setCurrentPage('home');
            }}
          />
        )}
        {currentPage === 'wishlist' && (
          <Wishlist
            wishlistItems={wishlistItems}
            onRemoveFromWishlist={removeFromWishlist}
            onMoveToCartFromWishlist={moveToCartFromWishlist}
            onContinueShopping={goToHome}
          />
        )}
        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={addToCart}
            onNavigateBack={navigateBack}
            onAddToWishlist={addToWishlist}
            onProductClick={navigateToProductDetail}
          />
        )}
      </main>

      {showAddToCartModal && productInModal && (
        <AddToCartModal
          product={productInModal}
          onClose={closeAddToCartModal}
          onQuantityChange={(product, newQuantity) =>
            handleQuantityChange(product.id, newQuantity)
          }
          onViewCart={viewCart}
        />
      )}
    </div>
  );
}

export default Food;
