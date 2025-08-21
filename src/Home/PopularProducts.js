import React from 'react';
import ProductCard from '../components/ProductCard'; // Import common ProductCard
import './PopularProducts.css'; // Assuming a CSS file for styling

function PopularProducts({ products, addToCart, addToWishlist, onProductClick }) {
  // Use a fallback to an empty array to prevent .map() error if 'products' is undefined
  const productsToDisplay = products || [];

  // Transform product data to match ProductCard expectations
  const transformedProducts = productsToDisplay.map(product => ({
    id: product.id,
    name: product.name,
    brand: product.brand || "Premium Pet Co",
    category: product.category || "Pet Products",
    rating: product.rating || 4.5,
    reviews: product.reviews || Math.floor(Math.random() * 100) + 20,
    price: typeof product.price === 'string' ? parseFloat(product.price.replace('₹', '')) : product.price,
    originalPrice: product.originalPrice || (typeof product.price === 'string' ? parseFloat(product.price.replace('₹', '')) * 1.2 : product.price * 1.2),
    image: product.image,
    badge: product.badge || "POPULAR"
  }));

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
  };

  const handleAddToWishlist = (product) => {
    if (addToWishlist) {
      addToWishlist(product);
    }
  };

  const handleProductClick = (product) => {
    if (onProductClick && typeof onProductClick === 'function') {
      onProductClick(product);
    } else {
      console.log('Product clicked:', product);
    }
  };

  return (
    <section className="popular-products-section">
      <h2>Popular Products</h2>
      <div className="products-grid">
        {transformedProducts.length > 0 ? (
          transformedProducts.map(product => (
            <div key={product.id} className="popular-products__item">
              <ProductCard
                product={product}
                variant="featured"
                showNewBadge={true}
                onAddToCart={handleAddToCart}
                onProductClick={handleProductClick}
                onAddToWishlist={handleAddToWishlist}
              />
            </div>
          ))
        ) : (
          <p>No popular products available at the moment.</p>
        )}
      </div>
    </section>
  );
}

export default PopularProducts;