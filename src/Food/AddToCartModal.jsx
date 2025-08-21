import React, { useState } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import './AddToCartModal.css'
import { getSimplePlaceholderImage } from './utils/helpers'

const AddToCartModal = ({ isOpen, onClose, product, onNavigateToCart }) => {
  const [quantity, setQuantity] = useState(1)

  if (!isOpen || !product) return null

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleViewCart = () => {
    onClose()
    onNavigateToCart()
  }

  const totalPrice = (product.price * quantity).toFixed(2)

  return (
    <div className="addtocart-modal__overlay">
      <div className="addtocart-modal">
        <div className="addtocart-modal__header">
          <h2 className="addtocart-modal__title">Added to Cart</h2>
          <button onClick={onClose} className="addtocart-modal__close-btn">
            <X />
          </button>
        </div>

        <div className="addtocart-modal__product">
          <img
            src={product.image || getSimplePlaceholderImage(product.name)}
            alt={product.name}
            className="addtocart-modal__product-img"
          />
          <div className="addtocart-modal__product-info">
            <h3 className="addtocart-modal__product-name">{product.name}</h3>
            <p className="addtocart-modal__product-price">
              Rs. {product.price.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="addtocart-modal__quantity">
          <span className="addtocart-modal__quantity-label">Quantity:</span>
          <div className="addtocart-modal__quantity-controls">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="addtocart-modal__quantity-btn"
            >
              –
            </button>
            <span className="addtocart-modal__quantity-value">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="addtocart-modal__quantity-btn"
            >
              +
            </button>
          </div>
        </div>

        <div className="addtocart-modal__footer">
          <button
            onClick={onClose}
            className="addtocart-modal__continue-btn"
          >
            Continue Shopping
          </button>
          <button 
            onClick={handleViewCart} 
            className="addtocart-modal__viewcart-btn"
          >
            <ShoppingCart className="addtocart-modal__cart-icon" />
            <span>View Cart</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddToCartModal
