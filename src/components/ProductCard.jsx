import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Heart, Star, Eye, Badge, Zap, Gift } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({
  product,
  showNewBadge = false,
  showSaleBadge = false,
  showBestSellerBadge = false,
  variant = 'default', // 'default', 'compact', 'featured', 'large'
  onAddToCart,
  onProductClick,
  onAddToWishlist,
  className = '',
  isInWishlist = false,
  isInCart = false,
  showQuickActions = true,
  showRating = true,
  showCategory = true,
  showDescription = false,
  maxDescriptionLength = 80
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const intervalRef = useRef(null);

  // Get product images
  const productImages = product.images && product.images.length > 0
    ? product.images
    : [product.image || getPlaceholderImage()];

  // Get placeholder image
  function getPlaceholderImage() {
    return `https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&auto=format&q=80`;
  }

  // Reset states on product change
  useEffect(() => {
    setCurrentImageIndex(0);
    setImageLoaded(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [product.id]);

  // Handle hover effects
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (productImages.length > 1 && showQuickActions) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % productImages.length);
      }, 800);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setCurrentImageIndex(0);
    }
  };

  // Handle add to cart with loading state
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    try {
      await onAddToCart(product);
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500);
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = (e) => {
    e.stopPropagation();
    onAddToWishlist(product);
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`product-card__star ${i < fullStars ? 'filled' : ''} ${i === fullStars && hasHalfStar ? 'half' : ''}`}
          size={14}
        />
      );
    }
    return stars;
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (product.originalPrice && product.price < product.originalPrice) {
      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    }
    return 0;
  };

  // Handle image error
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = getPlaceholderImage();
  };

  // Truncate description
  const truncateDescription = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const discountPercentage = getDiscountPercentage();

  return (
    <article
      className={`product-card product-card--${variant} ${isHovered ? 'is-hovered' : ''} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onProductClick(product)}
    >
      {/* Badges */}
      <div className="product-card__badges">
        {showNewBadge && (
          <span className="product-card__badge product-card__badge--new">
            <Zap size={12} />
            NEW
          </span>
        )}
        {showSaleBadge && discountPercentage > 0 && (
          <span className="product-card__badge product-card__badge--sale">
            -{discountPercentage}%
          </span>
        )}
        {showBestSellerBadge && (
          <span className="product-card__badge product-card__badge--bestseller">
            <Gift size={12} />
            BESTSELLER
          </span>
        )}
      </div>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="product-card__quick-actions">
          <button
            onClick={handleAddToWishlist}
            className={`product-card__action-btn ${isInWishlist ? 'active' : ''}`}
            aria-label="Add to wishlist"
            title="Add to wishlist"
          >
            <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product);
            }}
            className="product-card__action-btn"
            aria-label="Quick view"
            title="Quick view"
          >
            <Eye size={18} />
          </button>
        </div>
      )}

      {/* Image Container */}
      <div className="product-card__image-container">
        <div className="product-card__image-wrapper">
          <img
            src={productImages[currentImageIndex]}
            alt={product.name}
            className={`product-card__image ${imageLoaded ? 'loaded' : ''}`}
            onError={handleImageError}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          {!imageLoaded && (
            <div className="product-card__image-skeleton" />
          )}
        </div>
        
        {/* Image Indicators */}
        {productImages.length > 1 && (
          <div className="product-card__image-indicators">
            {productImages.map((_, index) => (
              <span
                key={index}
                className={`product-card__indicator ${index === currentImageIndex ? 'active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="product-card__content">
        {/* Category */}
        {showCategory && product.category && (
          <span className="product-card__category">
            {product.category}
            {product.type && ` • ${product.type}`}
          </span>
        )}

        {/* Title */}
        <h3 className="product-card__title">
          {product.name}
        </h3>

        {/* Description */}
        {showDescription && product.description && (
          <p className="product-card__description">
            {truncateDescription(product.description, maxDescriptionLength)}
          </p>
        )}

        {/* Rating */}
        {showRating && product.rating && (
          <div className="product-card__rating">
            <div className="product-card__stars">
              {renderStars(product.rating)}
            </div>
            <span className="product-card__rating-text">
              {product.rating.toFixed(1)}
              {product.reviewCount && (
                <span className="product-card__review-count">
                  ({product.reviewCount})
                </span>
              )}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="product-card__price-container">
          <div className="product-card__price-wrapper">
            <span className="product-card__price">
              ₹{typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-card__original-price">
                ₹{typeof product.originalPrice === 'number' ? product.originalPrice.toLocaleString() : product.originalPrice}
              </span>
            )}
          </div>
          {discountPercentage > 0 && (
            <span className="product-card__savings">
              Save ₹{(product.originalPrice - product.price).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="product-card__footer">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`product-card__cart-btn ${isInCart ? 'in-cart' : ''} ${isAddingToCart ? 'loading' : ''}`}
        >
          <ShoppingCart 
            size={16} 
            className="product-card__cart-icon" 
          />
          <span className="product-card__cart-text">
            {isAddingToCart ? 'Adding...' : isInCart ? 'Added to Cart' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
