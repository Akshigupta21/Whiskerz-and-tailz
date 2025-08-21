import React, { useState, useCallback } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Product from '../Product/Product';
import Food from '../Food/Food';
import CartPage from '../pages/CartPage';
import WishlistPage from '../pages/WishlistPage';
import CheckoutPage from '../Product/CheckoutPage';
import BlogPage from '../pages/BlogPage'; // Database-powered blog page
import ProfilePage from '../pages/ProfilePage';
import HomePage from '../Home/HomePage'; // Updated to use Home folder
import Toast from '../components/Toast';
import Header from './Header';
import Footer from './Footer';
import About from '../AboutUs/About';
import PetServices from '../pages/PetServices';

const Content = () => {
  const navigate = useNavigate();
  
  // Global cart and wishlist state
  const [globalCartItems, setGlobalCartItems] = useState([]);
  const [globalWishlistItems, setGlobalWishlistItems] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  
  // Toast notification state
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Global cart functions
  const addToGlobalCart = useCallback((product, quantity = 1) => {
    if (!product || !product.id) {
      console.error('Invalid product passed to addToGlobalCart:', product);
      return;
    }
    
    setGlobalCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        const updatedItems = prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        showToast(`${product.name || 'Product'} quantity updated in cart!`, 'cart');
        return updatedItems;
      } else {
        showToast(`${product.name || 'Product'} added to cart!`, 'cart');
        return [...prev, { 
          ...product, 
          quantity: quantity,
          price: product.price || 0,
          name: product.name || 'Unknown Product',
          image: product.image || '/placeholder.jpg'
        }];
      }
    });
  }, [showToast]);

  const removeFromGlobalCart = useCallback((productId) => {
    setGlobalCartItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  // Global wishlist functions
  const addToGlobalWishlist = useCallback((product) => {
    if (!product || !product.id) {
      console.error('Invalid product passed to addToGlobalWishlist:', product);
      return;
    }
    
    setGlobalWishlistItems(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (!exists) {
        showToast(`${product.name || 'Product'} added to wishlist!`, 'wishlist');
        return [...prev, { 
          ...product, 
          quantity: 1,
          price: product.price || 0,
          name: product.name || 'Unknown Product',
          image: product.image || '/placeholder.jpg'
        }];
      } else {
        showToast(`${product.name || 'Product'} is already in your wishlist!`, 'wishlist');
        return prev;
      }
    });
  }, [showToast]);

  const removeFromGlobalWishlist = useCallback((productId) => {
    setGlobalWishlistItems(prev => {
      const item = prev.find(item => item.id === productId);
      if (item) {
        showToast(`${item.name} removed from wishlist!`, 'wishlist');
      }
      return prev.filter(item => item.id !== productId);
    });
  }, [showToast]);

  // Cart quantity update function
  const updateCartQuantity = useCallback((productId, newQuantity) => {
    setGlobalCartItems(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  }, []);

  // Move from wishlist to cart
  const moveToCartFromWishlist = useCallback((product) => {
    addToGlobalCart(product);
    removeFromGlobalWishlist(product.id);
  }, [addToGlobalCart, removeFromGlobalWishlist]);

  // Navigation functions
  const handleNavigateHome = useCallback(() => {
    setCurrentPage('home');
    navigate('/');
  }, [navigate]);

  const handleNavigateCart = useCallback(() => {
    setCurrentPage('cart');
    navigate('/cart');
  }, [navigate]);

  const handleNavigateWishlist = useCallback(() => {
    setCurrentPage('wishlist');
    navigate('/wishlist');
  }, [navigate]);

  const handleNavigateFood = useCallback(() => {
    setCurrentPage('food');
    navigate('/food');
  }, [navigate]);

   const handleNavigateService = useCallback(() => {
    setCurrentPage('services');
    navigate('/services');
  }, [navigate]);

  const handleNavigateProduct = useCallback(() => {
    setCurrentPage('product');
    navigate('/product');
  }, [navigate]);

  const handleNavigateAbout = useCallback(() => {
    setCurrentPage('about');
    navigate('/about');
  }, [navigate]);

  const handleNavigateContact = useCallback(() => {
    setCurrentPage('contact');
    navigate('/contact');
  }, [navigate]);

  const handleNavigateBlog = useCallback(() => {
    setCurrentPage('blog');
    navigate('/blog');
  }, [navigate]);

  const handleNavigateProfile = useCallback(() => {
    setCurrentPage('profile');
    navigate('/profile');
  }, [navigate]);

  const handleNavigateCheckout = useCallback(() => {
    setCurrentPage('checkout');
    navigate('/checkout');
  }, [navigate]);

  const cartItemsCount = globalCartItems.reduce((count, item) => count + item.quantity, 0);
  const wishlistItemsCount = globalWishlistItems.length;

  return (
    <>
      <Header 
        onNavigateHome={handleNavigateHome}
        onNavigateCart={handleNavigateCart}
        onNavigateWishlist={handleNavigateWishlist}
        onNavigateFood={handleNavigateFood}
        onNavigateProduct={handleNavigateProduct}
        onNavigateService={handleNavigateService}
        onNavigateAbout={handleNavigateAbout}
        onNavigateContact={handleNavigateContact}
        onNavigateBlog={handleNavigateBlog}
        onNavigateProfile={handleNavigateProfile}
        cartItemsCount={cartItemsCount}
        wishlistItemsCount={wishlistItemsCount} />
      <Routes>
        {/* Define your routes here */}
        <Route 
          path="/" 
          element={
            <HomePage 
              globalCartItems={globalCartItems}
              globalWishlistItems={globalWishlistItems}
              addToGlobalCart={addToGlobalCart}
              addToGlobalWishlist={addToGlobalWishlist}
              removeFromGlobalCart={removeFromGlobalCart}
              removeFromGlobalWishlist={removeFromGlobalWishlist}
              onNavigateFood={handleNavigateFood}
              onNavigateProduct={handleNavigateProduct}
              onNavigateService={handleNavigateService}
              onNavigateAbout={handleNavigateAbout}
            />
          } 
        />
        <Route 
          path="/home" 
          element={
            <HomePage 
              globalCartItems={globalCartItems}
              globalWishlistItems={globalWishlistItems}
              addToGlobalCart={addToGlobalCart}
              addToGlobalWishlist={addToGlobalWishlist}
              removeFromGlobalCart={removeFromGlobalCart}
              removeFromGlobalWishlist={removeFromGlobalWishlist}
              onNavigateFood={handleNavigateFood}
              onNavigateProduct={handleNavigateProduct}
              onNavigateService={handleNavigateService}
              onNavigateAbout={handleNavigateAbout}
            />
          } 
        />
        <Route 
          path="/product" 
          element={
            <Product 
              globalCartItems={globalCartItems}
              globalWishlistItems={globalWishlistItems}
              addToGlobalCart={addToGlobalCart}
              addToGlobalWishlist={addToGlobalWishlist}
              removeFromGlobalCart={removeFromGlobalCart}
              removeFromGlobalWishlist={removeFromGlobalWishlist}
            />
          } 
        />
        <Route 
          path="/food" 
          element={
            <Food 
              globalCartItems={globalCartItems}
              globalWishlistItems={globalWishlistItems}
              addToGlobalCart={addToGlobalCart}
              addToGlobalWishlist={addToGlobalWishlist}
              removeFromGlobalCart={removeFromGlobalCart}
              removeFromGlobalWishlist={removeFromGlobalWishlist}
            />
          } 
        />
         <Route 
          path="/services" 
          element={
            <PetServices
              globalCartItems={globalCartItems}
              globalWishlistItems={globalWishlistItems}
              addToGlobalCart={addToGlobalCart}
              addToGlobalWishlist={addToGlobalWishlist}
              removeFromGlobalCart={removeFromGlobalCart}
              removeFromGlobalWishlist={removeFromGlobalWishlist}
            />
          } 
        />

        <Route 
          path="/about" 
          element={
            <About
              globalCartItems={globalCartItems}
              globalWishlistItems={globalWishlistItems}
              addToGlobalCart={addToGlobalCart}
              addToGlobalWishlist={addToGlobalWishlist}
              removeFromGlobalCart={removeFromGlobalCart}
              removeFromGlobalWishlist={removeFromGlobalWishlist}
            />
          } 
        />
        <Route path="/contact" element={<div>Contact Page Coming Soon</div>} />
        <Route 
          path="/blog" 
          element={
            <BlogPage
              onNavigateHome={handleNavigateHome}
            />
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProfilePage
              onNavigateHome={handleNavigateHome}
            />
          } 
        />
        <Route 
          path="/cart" 
          element={
            <CartPage 
              cartItems={globalCartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromGlobalCart}
              onNavigateHome={handleNavigateHome}
              onNavigateToCheckout={handleNavigateCheckout}
            />
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <CheckoutPage 
              cartItems={globalCartItems}
              onNavigateBack={handleNavigateCart}
              onOrderComplete={() => {
                setGlobalCartItems([]);
                handleNavigateHome();
              }}
              setCartItems={setGlobalCartItems}
            />
          } 
        />
        <Route 
          path="/wishlist" 
          element={
            <WishlistPage 
              wishlistItems={globalWishlistItems}
              onRemoveItem={removeFromGlobalWishlist}
              onMoveToCart={moveToCartFromWishlist}
              onNavigateHome={handleNavigateHome}
            />
          } 
        />
      </Routes>
      <Footer />
      
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}
export default Content;