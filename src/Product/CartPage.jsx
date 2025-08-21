import React from 'react'
import { ChevronLeft, ChevronRight, ShoppingCart, Trash2 } from 'lucide-react'
import { getPlaceholderImage } from './utils/helpers'
import './CartPage.css'

const CartPage = ({
  cartItems,
  onUpdateItemQuantity,
  onRemoveItem,
  onNavigateHome,
  onNavigateToCheckout
}) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const shippingCost = cartItems.length > 0 ? 5.0 : 0 // Example shipping cost
  const tax = calculateSubtotal() * 0.08 // Example tax
  const discount = 0 // Example discount
  const totalCost = calculateSubtotal() + shippingCost + tax - discount

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <h2 className="cart-page__title">Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <div className="cart-page__empty">
            <ShoppingCart className="cart-page__empty-icon" />
            <p className="cart-page__empty-text">Your cart is empty.</p>
            <button onClick={onNavigateHome} className="cart-page__empty-button">
              <ChevronLeft className="cart-page__back-icon" />
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="cart-page__content">
            <div className="cart-page__items">
              {cartItems.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <img
                    src={item.product.images ? item.product.images[0] : item.product.image}
                    alt={item.product.name}
                    className="cart-item__image"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = getPlaceholderImage(96, 96, item.product.name)
                    }}
                  />
                  <div className="cart-item__details">
                    <h3 className="cart-item__name">{item.product.name}</h3>
                    <p className="cart-item__price">Rs. {item.product.price.toFixed(2)}</p>
                    <div className="cart-item__actions">
                      <div className="cart-quantity">
                        <button
                          onClick={() => onUpdateItemQuantity(item.product.id, item.quantity - 1)}
                          className="cart-quantity__btn"
                        >
                          –
                        </button>
                        <span className="cart-quantity__value">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateItemQuantity(item.product.id, item.quantity + 1)}
                          className="cart-quantity__btn"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="cart-item__remove"
                      >
                        <Trash2 className="cart-item__remove-icon" />
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="cart-item__total">
                    Rs. {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="cart-page__coupon">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="cart-page__coupon-input"
                />
                <div className="cart-page__buttons">
                  <button className="cart-page__coupon-btn">Apply Coupon</button>
                  <button className="cart-page__clear-btn">Clear Cart</button>
                </div>
              </div>
            </div>
            <div className="cart-page__summary">
              <h3 className="cart-page__summary-title">Order Summary</h3>
              <div className="summary-item">
                <span>Subtotal ({cartItems.length} items):</span>
                <span>Rs. {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Shipping:</span>
                <span>Rs. {shippingCost.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Tax:</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </div>
              <div className="summary-item summary-item--discount">
                <span>Discount:</span>
                <span>-Rs. {discount.toFixed(2)}</span>
              </div>
              <div className="summary-item summary-item--total">
                <span>Total:</span>
                <span>Rs. {totalCost.toFixed(2)}</span>
              </div>
              <button onClick={onNavigateToCheckout} className="cart-page__checkout-btn">
                Proceed to Checkout
                <ChevronRight className="cart-page__checkout-icon" />
              </button>
              <button onClick={onNavigateHome} className="cart-page__continue-btn">
                <ChevronLeft className="cart-page__continue-icon" />
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
