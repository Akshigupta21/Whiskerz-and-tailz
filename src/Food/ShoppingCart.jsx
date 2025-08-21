import React, { useState } from "react";
import "./ShoppingCart.css";

function ShoppingCart({
  cartItems,
  wishlistItems,
  onQuantityChange,
  onRemoveFromCart,
  onMoveToWishlist,
  onMoveToCartFromWishlist,
  onRemoveFromWishlist,
  onClearCart,
  orderSummary,
  onProceedToCheckout,
  onContinueShopping,
}) {
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = () => {
    console.log("Applying coupon:", couponCode);
    // Replace with real coupon logic
  };

  // Mocked "Saved for Later" items (these would be real in a full app)
  const savedForLaterItems = [
    {
      id: "saved-001",
      name: "Pet GPS Tracker",
      brand: "Health • Dogs",
      price: 45.99,
      image: "https://placehold.co/80x80/DDEEFF/008CFF?text=GPS+Tracker",
    },
  ];

  // Mocked "Recently Viewed" items (these would be real in a full app)
  const recentlyViewedItems = [
    { id: "rv-001", name: "Bird Play Stand", price: 34.99, image: "https://placehold.co/150x150/FFDDC1/FF8C00?text=Bird+Stand" },
    { id: "rv-002", name: "Premium Dog Treats Pack", price: 29.99, image: "https://placehold.co/150x150/DDEEFF/008CFF?text=Dog+Treats" },
    { id: "rv-003", name: "Cat Grooming Kit", price: 49.99, image: "https://placehold.co/150x150/FFC1DD/FF008C?text=Grooming+Kit" },
    { id: "rv-004", name: "Pet GPS Tracker", price: 45.99, image: "https://placehold.co/150x150/C1FFDD/00FF8C?text=GPS+Tracker" },
  ];

  return (
    <section className="shoppingcart-section">
      <div className="shoppingcart-container">
        <h2 className="shoppingcart-title">Your Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty. Start shopping now!</p>
            <button className="continue-shopping" onClick={onContinueShopping}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Cart Items & Actions */}
            <div className="cart-items-column">
              {/* Cart Items List */}
              <div className="cart-items-box">
                <h3 className="cart-items-title">
                  Items in your Cart ({orderSummary.itemCount})
                </h3>
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-image-wrapper">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/80x80/CCCCCC/333333?text=${item.name.replace(/\s/g, "+")}`;
                        }}
                      />
                    </div>
                    <div className="cart-item-details">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-brand">{item.brand}</p>
                      <p className="cart-item-price">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-item-quantity">
                        <button
                          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                          className="quantity-button"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          onChange={(e) =>
                            onQuantityChange(item.id, parseInt(e.target.value, 10) || 1)
                          }
                          className="quantity-input"
                        />
                        <button
                          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                          className="quantity-button"
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item-subtotal">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => onMoveToWishlist(item.id)}
                        className="cart-item-wishlist"
                        title="Move to Wishlist"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        className="cart-item-remove"
                        title="Remove from Cart"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="cart-actions">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                />
                <button onClick={handleApplyCoupon} className="coupon-button">
                  Apply Coupon
                </button>
                <button onClick={onClearCart} className="clear-cart">
                  Clear Cart
                </button>
              </div>

              {/* Saved for Later Section */}
              {savedForLaterItems.length > 0 && (
                <div className="saved-for-later-box">
                  <h3 className="saved-for-later-title">
                    Saved for Later ({savedForLaterItems.length} items)
                  </h3>
                  {savedForLaterItems.map((item) => (
                    <div key={item.id} className="saved-item">
                      <div className="saved-item-image-wrapper">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="saved-item-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/80x80/CCCCCC/333333?text=${item.name.replace(/\s/g, "+")}`;
                          }}
                        />
                      </div>
                      <div className="saved-item-details">
                        <p className="saved-item-name">{item.name}</p>
                        <p className="saved-item-brand">{item.brand}</p>
                        <p className="saved-item-price">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="saved-item-actions">
                        <button
                          onClick={() => onMoveToCartFromWishlist(item.id)}
                          className="move-to-cart-button"
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() =>
                            console.log("Remove from Saved:", item.id)
                          } // Replace with real function
                          className="saved-item-remove"
                          title="Remove from Saved"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="order-summary-box">
              <h3 className="order-summary-title">Order Summary</h3>
              <div className="order-summary-details">
                <div className="order-summary-row">
                  <span>
                    Subtotal ({orderSummary.itemCount} items)
                  </span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="order-summary-row">
                  <span>Shipping</span>
                  <span>${orderSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="order-summary-row">
                  <span>Tax</span>
                  <span>${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="order-summary-row discount">
                  <span>Discount</span>
                  <span>-${orderSummary.discount.toFixed(2)}</span>
                </div>
              </div>
              <div className="order-total">
                <span>Order Total</span>
                <span>${orderSummary.total.toFixed(2)}</span>
              </div>
              <button
                onClick={onProceedToCheckout}
                className="proceed-to-checkout"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={onContinueShopping}
                className="continue-shopping-outline"
              >
                ← Continue Shopping
              </button>
              <div className="estimated-delivery-box">
                <h4 className="estimated-delivery-title">Estimated Delivery</h4>
                <p>June 30 - July 3, 2025</p>
              </div>
              <div className="payment-methods-box">
                <h4 className="payment-methods-title">We Accept</h4>
                <div className="payment-icons">
                  <img
                    src="https://img.icons8.com/color/48/000000/visa.png"
                    alt="Visa"
                  />
                  <img
                    src="https://img.icons8.com/color/48/000000/mastercard.png"
                    alt="Mastercard"
                  />
                  <img
                    src="https://img.icons8.com/color/48/000000/paypal.png"
                    alt="PayPal"
                  />
                  <img
                    src="https://img.icons8.com/fluency/48/apple-pay.png"
                    alt="Apple Pay"
                  />
                  <img
                    src="https://img.icons8.com/color/48/000000/google-pay.png"
                    alt="Google Pay"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        <div className="recently-viewed-box">
          <h3 className="recently-viewed-title">Recently Viewed</h3>
          <div className="recently-viewed-grid">
            {recentlyViewedItems.map((product) => (
              <div key={product.id} className="recently-viewed-item">
                <div className="recently-viewed-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="recently-viewed-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/150x150/CCCCCC/333333?text=${product.name.replace(/\s/g, "+")}`;
                    }}
                  />
                </div>
                <p className="recently-viewed-name">{product.name}</p>
                <p className="recently-viewed-price">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShoppingCart;
