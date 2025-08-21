import React from 'react';
import { Heart, ChevronLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { getPlaceholderImage } from './utils/helpers';
import './Wishlist.css';

const Wishlist = ({ wishlistItems, onRemoveFromWishlist, onMoveToCartFromWishlist, onContinueShopping }) => {
  return (
    <div className="wishlist">
      <div className="wishlist__container">
        <h2 className="wishlist__title">Your Wishlist</h2>

        {wishlistItems.length === 0 ? (
          <div className="wishlist__empty">
            <Heart size={80} className="wishlist__empty-icon" />
            <p className="wishlist__empty-text">Your wishlist is empty.</p>
            <button
              onClick={onContinueShopping}
              className="wishlist__empty-button"
            >
              <ChevronLeft size={20} className="wishlist__empty-icon-btn" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="wishlist__count">
              Items in your Wishlist ({wishlistItems.length})
            </div>
            <div className="wishlist__grid">
              {wishlistItems.map(product => (
                <div key={product.id} className="wishlist__item">
                  <div className="wishlist__item-image-container">
                    <img
                      src={product.images ? product.images[0] : product.image}
                      alt={product.name}
                      className="wishlist__item-image"
                      onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(200, 150, product.name); }}
                    />
                  </div>
                  <h3 className="wishlist__item-name">{product.name}</h3>
                  <p className="wishlist__item-brand">{product.brand || 'Premium Brand'}</p>
                  <p className="wishlist__item-price">Rs. {product.price.toFixed(2)}</p>
                  <div className="wishlist__item-actions">
                    <button
                      onClick={() => onMoveToCartFromWishlist(product.id)}
                      className="wishlist__action-btn wishlist__action-btn--primary"
                    >
                      <ShoppingCart className="wishlist__action-icon" size={16} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="wishlist__action-btn wishlist__action-btn--secondary"
                    >
                      <Trash2 className="wishlist__action-icon" size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="wishlist__continue">
              <button onClick={onContinueShopping} className="wishlist__continue-btn">
                <ChevronLeft size={20} className="wishlist__action-icon" />
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;