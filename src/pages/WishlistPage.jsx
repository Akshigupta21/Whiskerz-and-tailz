import React from 'react';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import './WishlistPage.css';

const WishlistPage = ({ 
  wishlistItems = [], 
  onRemoveItem, 
  onMoveToCart,
  onNavigateHome 
}) => {
  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__container">
          <div className="wishlist-page__empty">
            <Heart size={64} className="wishlist-page__empty-icon" />
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite products for later!</p>
            <button 
              onClick={onNavigateHome}
              className="wishlist-page__continue-btn"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__container">
        <div className="wishlist-page__header">
          <h1>My Wishlist</h1>
          <p>{wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist</p>
        </div>

        <div className="wishlist-page__grid">
          {wishlistItems.filter(item => item && item.id).map(item => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-card__image">
                <img src={item.image || '/placeholder.jpg'} alt={item.name || 'Product'} />
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="wishlist-card__remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="wishlist-card__content">
                <h3 className="wishlist-card__name">{item.name || 'Unknown Product'}</h3>
                <p className="wishlist-card__price">Rs. {(item.price || 0).toFixed(2)}</p>
                <div className="wishlist-card__actions">
                  <button
                    onClick={() => onMoveToCart(item)}
                    className="wishlist-card__cart-btn"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="wishlist-page__actions">
          <button 
            onClick={onNavigateHome}
            className="wishlist-page__continue-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
