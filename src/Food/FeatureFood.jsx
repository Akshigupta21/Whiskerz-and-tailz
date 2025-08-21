import React, { useState } from "react";
import ProductCard from '../components/ProductCard'; // Use enhanced common ProductCard
import { allProducts, getProductsByCategory } from './data/products';
import "./FeaturedFood.css";

function FeaturedFood({ addToCart, addToWishlist, onProductClick, onViewAllFood }) {
  // Get only food products from the data
  const foodProducts = getProductsByCategory('Food').concat(getProductsByCategory('Pet Food'));
  
  // Take the first 6 food products for featured display
  const products = foodProducts.slice(0, 6).map(product => ({
    id: product.id,
    name: product.name,
    brand: "Premium Pet Co", // Default brand for consistency
    category: product.category,
    rating: product.rating,
    reviews: Math.floor(Math.random() * 200) + 50, // Random review count
    price: product.price,
    originalPrice: product.oldPrice || (product.price * 1.2), // Calculate original price if not available
    image: product.images ? product.images[0] : `https://placehold.co/200x200/DDC1FF/8C00FF?text=${encodeURIComponent(product.name)}`,
    badge: "NEW"
  }));

  const handleAddToWishlist = (product) => {
    if (addToWishlist) {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
  };

  const handleViewAllFood = () => {
    if (onViewAllFood) {
      onViewAllFood();
    }
  };

  return (
    <section className="featured-food">
      <div className="featured-food-header">
        <h2>Featured Food</h2>
        <button className="view-all-link" onClick={handleViewAllFood}>
          View all →
        </button>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="featured-products__item">
            <ProductCard
              product={product}
              showNewBadge={true}
              onAddToCart={handleAddToCart}
              onProductClick={onProductClick}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 != 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="full-star">☆</span>
      ))}
      {halfStar && <span key="half" className="half-star">☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="empty-star">☆</span>
      ))}
    </div>
  );
}

export default FeaturedFood;
