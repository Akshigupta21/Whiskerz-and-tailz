import React, { useState, useEffect, useRef } from 'react'
import { ShoppingCart, Heart, Star, GitCompare, Eye } from 'lucide-react'
import { getPlaceholderImage } from './utils/helpers'
import './ProductCard.css'

const ProductCard = ({
  product,
  showNewBadge = false,
  onAddToCart,
  onProductClick,
  onAddToWishlist,
  productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image || getPlaceholderImage(200, 150, product.name)],
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef(null)

  // Reset image index on product change
  useEffect(() => {
    setCurrentImageIndex(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }, [product])

  // Start/stop image cycle on hover
  const handleMouseEnter = () => {
    setIsHovered(true)
    if (productImages.length > 1) {
      clearInterval(intervalRef.current)
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % productImages.length)
      }, 500)
    }
  }
  const handleMouseLeave = () => {
    setIsHovered(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      setCurrentImageIndex(0)
    }
  }

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className="product-card__star"
        fill={i < rating ? 'currentColor' : 'none'}
        color={i < rating ? '#f59e0b' : '#e5e7eb'}
        size={16}
      />
    ))
  }

  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null
    e.target.src = getPlaceholderImage(200, 150, product.name)
  }

  return (
    <article
      className={`product-card ${isHovered ? 'is-hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* New Badge */}
      {showNewBadge && (
        <div className="product-card__badge">NEW</div>
      )}

      {/* Hover Actions Overlay */}
      <div className="product-card__actions">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddToWishlist(product)
          }}
          className="product-card__action-btn"
          aria-label="Add to wishlist"
        >
          <Heart size={20} />
        </button>
        <button
          className="product-card__action-btn"
          aria-label="Compare"
        >
          <GitCompare size={20} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onProductClick(product)
          }}
          className="product-card__action-btn"
          aria-label="Quick view"
        >
          <Eye size={20} />
        </button>
      </div>

      {/* Product Image */}
      <div
        className="product-card__image-container"
        onClick={() => onProductClick(product)}
      >
        <img
          src={productImages[currentImageIndex]}
          alt={product.name}
          className="product-card__image"
          onError={handleImageError}
        />
      </div>

      {/* Product Content */}
      <div className="product-card__content">
        <p className="product-card__category">{product.category} – {product.type}</p>
        <h3
          onClick={() => onProductClick(product)}
          className="product-card__title"
        >
          {product.name}
        </h3>
        <div className="product-card__rating">
          {renderStars(product.rating)}
          <span className="product-card__rating-value">{product.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Footer (Price & Add to Cart) */}
      <div className="product-card__footer">
        <span className="product-card__price">Rs. {product.price.toFixed(2)}</span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart(product, 1)
          }}
          className="product-card__cart-btn"
        >
          <ShoppingCart className="product-card__cart-icon" />
          Add to Cart
        </button>
      </div>
    </article>
  )
}

export default ProductCard
