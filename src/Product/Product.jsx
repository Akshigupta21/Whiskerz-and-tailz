import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import './Product.css';

// Import components
import HeroSection from '../components/HeroSection';
import { getHeroConfig } from '../config/heroConfig';
import ShopByPet from '../components/ShopByPet'; // Common ShopByPet component
import DealOfTheDay from './DealOfTheDay';
import FeaturedProducts from './FeaturedProducts';
import ShopAllProducts from './ShopAllProducts';
import ProductDetailPage from './ProductDetailPage';
import ProductIdeaGeneratorPage from './ProductIdeaGeneratorPage';
import CartPage from '../pages/CartPage';
import Wishlist from './Wishlist';
import CheckoutPage from './CheckoutPage';
import AddToCartModal from './AddToCartModal';

// Import services
import { dataService } from './services/dataService';
import { apiService } from './services/apiService';

const Product = ({
  globalCartItems = [], 
  globalWishlistItems = [], 
  addToGlobalCart, 
  addToGlobalWishlist, 
  removeFromGlobalCart, 
  removeFromGlobalWishlist 
}) => {
  const [showCartModal, setShowCartModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPetTypeFilter, setSelectedPetTypeFilter] = useState('All Products');
  const [cartItems, setCartItems] = useState(globalCartItems);
  const [wishlistItems, setWishlistItems] = useState(globalWishlistItems);

  // Get hero configuration for Products page
  const heroConfig = getHeroConfig('products');

  // Hero action handlers
  const handleShopAll = () => {
    // Scroll to shop all products section
    const shopAllSection = document.querySelector('.shop-all-section');
    if (shopAllSection) {
      shopAllSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewCategories = () => {
    // Scroll to pet type selection
    const petTypeSection = document.querySelector('.shop-by-pet-type');
    if (petTypeSection) {
      petTypeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sync global state with local state
  useEffect(() => {
    setCartItems(globalCartItems);
  }, [globalCartItems]);

  useEffect(() => {
    setWishlistItems(globalWishlistItems);
  }, [globalWishlistItems]);

  // Firebase states
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Initialize Firebase and authenticate
  useEffect(() => {
    const initializeFirebaseAndBackend = async () => {
      // Test backend connection
      const backendStatus = await dataService.testConnection();
      setIsBackendConnected(backendStatus);

      try {
        const appId = 'pet-lover-app-id';
        const firebaseConfig = {
          // Add your Firebase config here when available
          apiKey: "demo",
          authDomain: "demo.firebaseapp.com",
          projectId: "demo",
          storageBucket: "demo.appspot.com",
          messagingSenderId: "123456789",
          appId: appId
        };

        const app = initializeApp(firebaseConfig);
        const firestore = getFirestore(app);
        const auth = getAuth(app);

        setDb(firestore);

        // Set up auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setUserId(user.uid);
          } else {
            // Sign in anonymously if no user
            try {
              const userCredential = await signInAnonymously(auth);
              setUserId(userCredential.user.uid);
            } catch (error) {
              console.error('Error signing in anonymously:', error);
            }
          }
          setIsAuthReady(true);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        setIsAuthReady(true); // Still set ready to allow app to function without Firebase
      }
    };

    initializeFirebaseAndBackend();
  }, []);

  // Cart functions
  const handleAddToCart = (product) => {
    // Actually add to cart first
    addToCart(product, 1);
    // Then show the modal
    setSelectedProduct(product);
    setShowCartModal(true);
  };

  const handleCloseCartModal = () => {
    setShowCartModal(false);
    setSelectedProduct(null);
  };

  const addToCart = (product, quantity = 1) => {
    // Update global state with quantity
    if (addToGlobalCart) {
      addToGlobalCart(product, quantity);
    }
    
    // Update local state for consistency
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    if (removeFromGlobalCart) {
      removeFromGlobalCart(productId);
    }
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Wishlist functions
  const addToWishlist = (product) => {
    if (addToGlobalWishlist) {
      addToGlobalWishlist(product);
    }
    setWishlistItems(prevItems => {
      const isAlreadyInWishlist = prevItems.some(item => item.id === product.id);
      if (!isAlreadyInWishlist) {
        return [...prevItems, product];
      }
      return prevItems;
    });
  };

  const removeFromWishlist = (productId) => {
    if (removeFromGlobalWishlist) {
      removeFromGlobalWishlist(productId);
    }
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Navigation functions
  const navigateToCart = () => {
    setCurrentPage('cart');
    setShowCartModal(false);
  };

  const navigateToWishlist = () => {
    setCurrentPage('wishlist');
  };

  const navigateToCheckout = () => {
    setCurrentPage('checkout');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    setSelectedPetTypeFilter('All Products');
  };

  const navigateToShopAll = (petType = 'All Products') => {
    setCurrentPage('shop-all');
    setSelectedPetTypeFilter(petType);
  };

  const navigateToProductDetail = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const navigateToProductGenerator = () => {
    setCurrentPage('product-generator');
  };

  const handlePetTypeClick = (petType) => {
    navigateToShopAll(petType);
  };

  return (
    <div className="Product">
      <main className="Product-main">
        {currentPage === 'home' && (
          <>
            <HeroSection 
              {...heroConfig}
              onButtonClick={handleShopAll}
              onSecondaryButtonClick={handleViewCategories}
            />
            <ShopByPet pageType="product" />
            <DealOfTheDay
              onAddToCart={handleAddToCart}
              onProductClick={navigateToProductDetail}
              onAddToWishlist={addToWishlist}
            />
            <FeaturedProducts
              onAddToCart={handleAddToCart}
              onProductClick={navigateToProductDetail}
              onAddToWishlist={addToWishlist}
              onViewAllProducts={() => {
                // Scroll to shop all products section
                const shopAllSection = document.querySelector('.shop-all-section');
                if (shopAllSection) {
                  shopAllSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            <div className="shop-all-section">
             
              <ShopAllProducts
                onAddToCart={handleAddToCart}
                onProductClick={navigateToProductDetail}
                initialPetType="All Products"
                onAddToWishlist={addToWishlist}
              />
            </div>
          </>
        )}
        {currentPage === 'shop-all' && (
          <div className="shop-all-section">
              <div className="section-header">
                <h2 className="section-title">Shop All Products</h2>
                <p className="section-subtitle">Discover our complete collection of pet products</p>
              </div>
              <ShopAllProducts
                onAddToCart={handleAddToCart}
                onProductClick={navigateToProductDetail}
                initialPetType="All Products"
                onAddToWishlist={addToWishlist}
              />
            </div>
        )}
        {currentPage === 'product-detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={addToCart}
            onNavigateBack={() => setCurrentPage('home')}
            onAddToWishlist={addToWishlist}
            db={db}
            userId={userId}
            isAuthReady={isAuthReady}
            onProductClick={navigateToProductDetail}
          />
        )}
        {currentPage === 'product-generator' && (
          <ProductIdeaGeneratorPage
            onNavigateBack={() => setCurrentPage('home')}
            isBackendConnected={isBackendConnected}
          />
        )}
        {currentPage === 'cart' && (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
            onNavigateHome={navigateToHome}
            onNavigateToCheckout={navigateToCheckout}
          />
        )}
        {currentPage === 'wishlist' && (
          <Wishlist
            wishlistItems={wishlistItems}
            onRemoveFromWishlist={removeFromWishlist}
            onAddToCart={handleAddToCart}
            onNavigateBack={() => setCurrentPage('home')}
            onProductClick={navigateToProductDetail}
          />
        )}
        {currentPage === 'checkout' && (
          <CheckoutPage
            cartItems={cartItems}
            onNavigateBack={() => setCurrentPage('cart')}
            onOrderComplete={() => {
              setCartItems([]);
              setCurrentPage('home');
            }}
            setCartItems={setCartItems} // Pass setCartItems to CheckoutPage
          />
        )}
      </main>
      <AddToCartModal
        isOpen={showCartModal}
        onClose={handleCloseCartModal}
        product={selectedProduct}
        onNavigateToCart={navigateToCart}
        onProceedToCheckout={navigateToCheckout}
      />
    </div>
  );
};

export default Product;
