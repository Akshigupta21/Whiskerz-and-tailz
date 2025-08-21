import React from 'react'
import { X } from 'lucide-react'
import './ConfirmationModal.css'

const ConfirmationModal = ({
  show,
  onClose,
  orderDetails,
  onContinueShopping,
  onNavigateHome,
}) => {
  if (!show || !orderDetails) return null

  return (
    <div className="confirmation-modal">
      <div className="confirmation-modal__dialog">
        <button onClick={onClose} className="confirmation-modal__close">
          <X className="confirmation-modal__close-icon" />
        </button>
        <div className="confirmation-modal__body">
          <svg
            className="confirmation-modal__icon"
            viewBox="0 0 24 24"
            width="64"
            height="64"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </svg>
          <h3 className="confirmation-modal__title">Order Placed!</h3>
          <p className="confirmation-modal__subtitle">Your order has been successfully placed.</p>
          
          <div className="confirmation-modal__details">
            <p>
              <strong>Order ID:</strong> #{orderDetails.orderId}
            </p>
            <p>
              <strong>Total Amount:</strong> Rs. {orderDetails.totalCost.toFixed(2)}
            </p>
            <p>
              <strong>Estimated Delivery:</strong> {orderDetails.estimatedDelivery}
            </p>
          </div>
        </div>
        <div className="confirmation-modal__actions">
          <button
            onClick={onContinueShopping}
            className="confirmation-modal__btn confirmation-modal__btn--secondary"
          >
            Continue Shopping
          </button>
          <button
            onClick={onNavigateHome}
            className="confirmation-modal__btn confirmation-modal__btn--primary"
          >
            View Order Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
