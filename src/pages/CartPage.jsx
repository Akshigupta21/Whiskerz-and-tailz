import React from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './CartPage.css';

const CartPage = ({ 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onNavigateHome,
  onNavigateToCheckout
}) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item && item.quantity) {
        const productData = item.product || item;
        const price = productData.price || 0;
        return total + (price * item.quantity);
      }
      return total;
    }, 0);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      onRemoveItem(itemId);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__container">
          <div className="cart-page__empty">
            <ShoppingBag size={64} className="cart-page__empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <button 
              onClick={onNavigateHome}
              className="cart-page__continue-btn"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <div className="cart-page__header">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="cart-page__content">
          <div className="cart-page__items">
            {cartItems.filter(item => item && (item.id || (item.product && item.product.id))).map(item => {
              // Handle both data structures: direct item properties vs nested product properties
              const productData = item.product || item;
              const itemId = item.id || item.product?.id;
              
              return (
                <div key={itemId} className="cart-item">
                  <div className="cart-item__image">
                    <img 
                      src={productData.image || productData.images?.[0] || '/placeholder.jpg'} 
                      alt={productData.name || 'Product'} 
                    />
                  </div>
                  <div className="cart-item__details">
                    <h3 className="cart-item__name">{productData.name || 'Unknown Product'}</h3>
                    <p className="cart-item__price">Rs. {(productData.price || 0).toFixed(2)}</p>
                  </div>
                <div className="cart-item__quantity">
                  <button
                    onClick={() => handleQuantityChange(itemId, (item.quantity || 1) - 1)}
                    className="cart-item__quantity-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="cart-item__quantity-value">{item.quantity || 1}</span>
                  <button
                    onClick={() => handleQuantityChange(itemId, (item.quantity || 1) + 1)}
                    className="cart-item__quantity-btn"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <div className="cart-item__subtotal">
                  Rs. {((productData.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
                <button
                  onClick={() => onRemoveItem(itemId)}
                  className="cart-item__remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )})}
          </div>

          <div className="cart-page__summary">
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="cart-summary__line">
                <span>Subtotal:</span>
                <span>Rs. {calculateTotal().toFixed(2)}</span>
              </div>
              <div className="cart-summary__line">
                <span>Shipping:</span>
                <span>Rs. 50.00</span>
              </div>
              <div className="cart-summary__line cart-summary__total">
                <span>Total:</span>
                <span>Rs. {(calculateTotal() + 50).toFixed(2)}</span>
              </div>
              <button 
                onClick={onNavigateToCheckout}
                className="cart-summary__checkout-btn"
              >
                Proceed to Checkout
              </button>
              <button 
                onClick={onNavigateHome}
                className="cart-summary__continue-btn"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
