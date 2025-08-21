import React, { useState, useEffect } from 'react'
import { ChevronLeft, Info, CreditCard, Wallet } from 'lucide-react'
import ConfirmationModal from './ConfirmationModal'
import { getPlaceholderImage } from './utils/helpers'
import './CheckoutPage.css'

const CheckoutPage = ({ cartItems, onNavigateToCart, onNavigateHome, setCartItems }) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  // Calculate shipping cost based on selected method
  const getShippingCost = () => {
    if (cartItems.length >= 0) return 0
    
    switch (selectedShipping) {
      case 'standard':
        return 30.00
      case 'express':
        return 50.00
      case 'nextDay':
        return 100.00
      default:
        return 30.00
    }
  }

  const shippingCost = getShippingCost()
  const tax = calculateSubtotal() * 0.08
  const discount = 0
  const totalCost = calculateSubtotal() + shippingCost + tax - discount

  const [selectedShipping, setSelectedShipping] = useState('standard')
  const [selectedPayment, setSelectedPayment] = useState('credit')

  // State for shipping address fields
  const [firstName, setFirstName] = useState('Michael')
  const [lastName, setLastName] = useState('Anderson')
  const [streetAddress, setStreetAddress] = useState('123 Main St')
  const [apartment, setApartment] = useState('Apt 4B')
  const [city, setCity] = useState('Dallas')
  const [state, setState] = useState('Texas')
  const [zipCode, setZipCode] = useState('75001')
  const [email, setEmail] = useState('michael.anderson@example.com')
  const [phoneNumber, setPhoneNumber] = useState('(214) 555-7890')

  // State for credit card fields
  const [cardName, setCardName] = useState('Michael Anderson')
  const [cardNumber, setCardNumber] = useState('1234 5678 9012 3456')
  const [expiryDate, setExpiryDate] = useState('MM/YY')
  const [cvv, setCvv] = useState('123')

  // State for Razorpay instance
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null)

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => {
      setRazorpayLoaded(true)
    }
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK.")
      setPaymentMessage("Failed to load payment gateway. Please try again later.")
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePlaceOrder = () => {
    if (!razorpayLoaded) {
      setPaymentMessage("Payment gateway not loaded yet. Please wait or refresh.")
      return
    }

    if (selectedPayment === 'credit') {
      if (!cardName || !cardNumber || !expiryDate || !cvv) {
        setPaymentMessage("Please fill in all credit card details.")
        return
      }
      if (!firstName || !lastName || !streetAddress || !city || !state || !zipCode || !email || !phoneNumber) {
        setPaymentMessage("Please fill in all shipping address details.")
        return
      }

      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID',
        amount: Math.round(totalCost * 100),
        currency: 'INR',
        name: 'Pet Lover',
        description: 'Order Payment',
        image: getPlaceholderImage(100, 100, 'Pet Lover Logo'),
        handler: (response) => {
          setPaymentMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`)
          const orderId = `PET-${Date.now()}`
          setCurrentOrderDetails({
            orderId: orderId,
            totalCost: totalCost,
            estimatedDelivery: '5-7 business days'
          })
          setShowConfirmationModal(true)
          setCartItems([])
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: phoneNumber
        },
        notes: {
          address: `${streetAddress}, ${city}, ${state} - ${zipCode}`
        },
        theme: {
          color: '#f97316'
        }
      }

      const rzp1 = new window.Razorpay(options)
      rzp1.on('payment.failed', (response) => {
        setPaymentMessage(`Payment failed: ${response.error.description}`)
        console.error('Razorpay Error:', response.error)
      })
      rzp1.open()
    } else {
      setPaymentMessage(`Payment via ${selectedPayment} initiated. This is a demo.`)
      const orderId = `DEMO-${Date.now()}`
      setCurrentOrderDetails({
        orderId: orderId,
        totalCost: totalCost,
        estimatedDelivery: '5-7 business days'
      })
      setShowConfirmationModal(true)
      setCartItems([])
    }
  }

  return (
    <div className="checkout">
      <div className="checkout__content">
        <h2 className="checkout__title">Checkout</h2>

        <div className="checkout__steps">
          <div className="checkout__step checkout__step--active">
            <span className="checkout__step-circle">1</span>
            <span className="checkout__step-label">Cart</span>
          </div>
          <div className="checkout__step-line checkout__step-line--active"></div>
          <div className="checkout__step checkout__step--active">
            <span className="checkout__step-circle">2</span>
            <span className="checkout__step-label">Checkout</span>
          </div>
          <div className="checkout__step-line"></div>
          <div className="checkout__step">
            <span className="checkout__step-circle">3</span>
            <span className="checkout__step-label">Confirmation</span>
          </div>
        </div>

        <div className="checkout__layout">
          <div className="checkout__form">
            <section className="checkout__section">
              <header className="checkout__section-header">
                <h3>Shipping Address</h3>
                <button className="checkout__section-action">Add New Address</button>
              </header>
              <div className="checkout__form-grid">
                <input
                  type="text"
                  placeholder="First Name*"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name*"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Street Address*"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="wide"
                />
                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="wide"
                />
                <input
                  type="text"
                  placeholder="City*"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="State/Province*"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="ZIP/Postal Code*"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Email Address*"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Phone Number*"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <label className="checkout__checkbox">
                <input type="checkbox" />
                <span>Save this address for future orders</span>
              </label>
              <label className="checkout__checkbox">
                <input type="checkbox" />
                <span>Billing address same as shipping address</span>
              </label>
            </section>

            <section className="checkout__section">
              <h3>Shipping Method</h3>
              <div className="checkout__radio-group">
                <label className={`checkout__radio ${selectedShipping === 'standard' ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={selectedShipping === 'standard'}
                    onChange={() => setSelectedShipping('standard')}
                  />
                  <div>
                    <h4>Standard Shipping</h4>
                    <p>Estimated delivery July 3 – July 5, 2025</p>
                  </div>
                  <span>Rs. 30</span>
                </label>
                <label className={`checkout__radio ${selectedShipping === 'express' ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={selectedShipping === 'express'}
                    onChange={() => setSelectedShipping('express')}
                  />
                  <div>
                    <h4>Express Shipping</h4>
                    <p>Estimated delivery July 1 – July 2, 2025</p>
                  </div>
                  <span>Rs. 50</span>
                </label>
                <label className={`checkout__radio ${selectedShipping === 'nextDay' ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="nextDay"
                    checked={selectedShipping === 'nextDay'}
                    onChange={() => setSelectedShipping('nextDay')}
                  />
                  <div>
                    <h4>Next Day Delivery</h4>
                    <p>Estimated delivery June 30, 2025</p>
                  </div>
                  <span>Rs. 100</span>
                </label>
              </div>
            </section>

            <section className="checkout__section">
              <h3>Payment Method</h3>
              <p className="checkout__info-text">
                <Info size={16} /> Your payment information is secure and encrypted.
              </p>
              <div className="checkout__radio-group">
                <label className={`checkout__radio checkout__radio--card ${selectedPayment === 'credit' ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit"
                    checked={selectedPayment === 'credit'}
                    onChange={() => setSelectedPayment('credit')}
                  />
                  <CreditCard size={24} />
                  <span>Credit / Debit Card</span>
                  <div className="checkout__card-placeholder">•••</div>
                </label>
                {selectedPayment === 'credit' && (
                  <div className="checkout__card-form">
                    <input
                      type="text"
                      placeholder="Name on Card*"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Card Number*"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Expiry Date* (MM/YY)"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="CVV*"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                    <label className="checkout__checkbox">
                      <input type="checkbox" />
                      <span>Save this card for future purchases</span>
                    </label>
                  </div>
                )}

                <label className={`checkout__radio ${selectedPayment === 'paypal' ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={selectedPayment === 'paypal'}
                    onChange={() => setSelectedPayment('paypal')}
                  />
                  <Wallet size={24} />
                  <span>PayPal</span>
                </label>
                <label className={`checkout__radio ${selectedPayment === 'applepay' ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="applepay"
                    checked={selectedPayment === 'applepay'}
                    onChange={() => setSelectedPayment('applepay')}
                  />
                  <CreditCard size={24} />
                  <span>Apple Pay</span>
                </label>
                <label className={`checkout__radio ${selectedPayment === 'googlepay' ? 'is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="googlepay"
                    checked={selectedPayment === 'googlepay'}
                    onChange={() => setSelectedPayment('googlepay')}
                  />
                  <CreditCard size={24} />
                  <span>Google Pay</span>
                </label>
              </div>
              {paymentMessage && (
                <div className={`checkout__message ${paymentMessage.includes('successful') ? 'success' : 'error'}`}>
                  {paymentMessage}
                </div>
              )}
            </section>
          </div>

          <aside className="checkout__summary">
            <h3>Order Summary</h3>
            <ul className="checkout__summary-list">
              <li>
                <span>Subtotal ({cartItems.length} items):</span>
                <span>Rs. {calculateSubtotal().toFixed(2)}</span>
              </li>
              <li>
                <span>Shipping:</span>
                <span>Rs. {shippingCost.toFixed(3)}</span>
              </li>
              <li>
                <span>Tax:</span>
                <span>Rs. {tax.toFixed(2)}</span>
              </li>
              <li className="checkout__summary-discount">
                <span>Discount:</span>
                <span>-Rs. {discount.toFixed(2)}</span>
              </li>
              <li className="checkout__summary-total">
                <span>Total:</span>
                <span>Rs. {totalCost.toFixed(2)}</span>
              </li>
            </ul>

            <div className="checkout__promo">
              <input type="text" placeholder="Promo code" />
              <button>Apply</button>
            </div>

            <label className="checkout__agreement">
              <input type="checkbox" />
              <span>I agree to the <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a></span>
            </label>

            <button onClick={handlePlaceOrder} className="checkout__primary-button">
              Place Order
            </button>
            <button onClick={onNavigateToCart} className="checkout__secondary-button">
              <ChevronLeft size={20} />
              Back to Cart
            </button>

            <div className="checkout__security">
              <p>
                <Info size={16} /> Secure Checkout
              </p>
              <div>
                <CreditCard size={24} />
                <Wallet size={24} />
                <CreditCard size={24} />
                <CreditCard size={24} />
              </div>
            </div>
          </aside>
        </div>
      </div>
      <ConfirmationModal
        show={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        orderDetails={currentOrderDetails}
        onContinueShopping={onNavigateHome}
        onNavigateHome={onNavigateHome}
      />
    </div>
  )
}

export default CheckoutPage
