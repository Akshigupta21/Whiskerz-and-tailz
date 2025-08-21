import React from 'react'
import { ChevronRight } from 'lucide-react'
import { getFeaturedProducts } from '../Food/data/products'
import ProductCard from '../components/ProductCard'
import './FeaturedProducts.css'

const FeaturedProducts = ({ onAddToCart, onProductClick, onAddToWishlist, onViewAllProducts }) => {
  const products = getFeaturedProducts()

  const handleViewAllProducts = () => {
    if (onViewAllProducts) {
      onViewAllProducts();
    }
  };

  return (
    <section className="featured-products">
      <div className="featured-products__container">
        <div className="featured-products__header">
          <h2 className="featured-products__title">Featured Products</h2>
          <button className="featured-products__link" onClick={handleViewAllProducts}>
            View all <ChevronRight className="featured-products__link-icon" />
          </button>
        </div>
        <div className="featured-products__grid">
          {products.map(product => (
            <div key={product.id} className="featured-products__item">
              <ProductCard
                product={product}
                showNewBadge={true}
                onAddToCart={onAddToCart}
                onProductClick={onProductClick}
                onAddToWishlist={onAddToWishlist}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
