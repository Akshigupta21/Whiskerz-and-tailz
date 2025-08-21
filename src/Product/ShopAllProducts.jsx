import React, { useState, useEffect } from 'react';
import { getShopAllProducts } from '../Food/data/products';
import FilterSlideBar from './FilterSlideBar';
import ProductGrid from './ProductGrid';
import './ShopAllProducts.css';

// --- ShopAllProducts Section ---
const ShopAllProducts = ({ 
  onAddToCart, 
  onProductClick, 
  initialPetType = 'All Products', 
  onAddToWishlist,
  filters: parentFilters,
  showFilters = false
}) => {
  // Use parent filters if provided, otherwise use internal filters
  const [internalFilters, setInternalFilters] = useState({
    category: initialPetType === 'All Products' ? 'All Products' : `${initialPetType} Supplies`,
    priceRange: [0, 100],
    rating: 0,
    inStock: false,
    onSale: false,
  });

  const filters = parentFilters || internalFilters;
  const setFilters = parentFilters ? () => {} : setInternalFilters;

  useEffect(() => {
    if (!parentFilters) {
      setInternalFilters(prevFilters => ({
        ...prevFilters,
        category: initialPetType === 'All Products' ? 'All Products' : `${initialPetType} Supplies`,
      }));
    }
  }, [initialPetType, parentFilters]);

  const allProducts = getShopAllProducts();

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : (name === 'priceRange' ? value : value),
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'All Products',
      priceRange: [0, 100],
      rating: 0,
      inStock: false,
      onSale: false,
    });
  };

  const filteredProducts = allProducts.filter(product => {
    if (filters.category !== 'All Products' && product.category !== filters.category) {
      return false;
    }

    if (initialPetType !== 'All Products' && product.type !== initialPetType) {
        return false;
    }

    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    if (filters.rating > 0 && product.rating < filters.rating) {
      return false;
    }
    if (filters.inStock && false) {
      return false;
    }
    if (filters.onSale && false) {
      return false;
    }
    return true;
  });

  return (
    <section className="shop-all-products">
      {!parentFilters && <h2 className="shop-all-products__title">Shop All Products</h2>}
      <div className={`shop-all-products__container ${parentFilters ? 'no-sidebar' : ''}`}>
        {!parentFilters && (
          <div className="shop-all-products__sidebar">
            <FilterSlideBar filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
          </div>
        )}
        <div className="shop-all-products__content">
          <ProductGrid products={filteredProducts} onAddToCart={onAddToCart} onProductClick={onProductClick} onAddToWishlist={onAddToWishlist} />
        </div>
      </div>
    </section>
  );
};

export default ShopAllProducts;