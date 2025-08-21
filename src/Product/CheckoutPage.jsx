import React, { useState, useEffect } from 'react'
import { ChevronLeft, Info, CreditCard, Wallet } from 'lucide-react'
import ConfirmationModal from './ConfirmationModal'
import { getPlaceholderImage } from './utils/helpers'
import './CheckoutPage.css'

const CheckoutPage = ({ cartItems, onNavigateToCart, onNavigateHome, setCartItems }) => {
  // State declarations first
  const [selectedShipping, setSelectedShipping] = useState('standard')
  const [selectedPayment, setSelectedPayment] = useState('credit')

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (item && item.price && item.quantity) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  }

  // Function to get formatted date range for shipping
  const getShippingDates = (daysMin, daysMax) => {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    
    startDate.setDate(today.getDate() + daysMin);
    endDate.setDate(today.getDate() + daysMax);
    
    const options = { month: 'long', day: 'numeric' };
    const startFormatted = startDate.toLocaleDateString('en-US', options);
    const endFormatted = endDate.toLocaleDateString('en-US', options);
    
    if (daysMin === daysMax) {
      return startFormatted;
    }
    
    return `${startFormatted} – ${endFormatted}`;
  }


  const getShippingCost = () => {
    if (cartItems.length === 0) return 0
    
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

  // State for shipping address fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [apartment, setApartment] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // State for credit card fields
  const [cardName, setCardName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')

  // State for Razorpay instance
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null)
  
  // Validation states
  const [errors, setErrors] = useState({})
  const [isAgreementChecked, setIsAgreementChecked] = useState(false)

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

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  }

  const validateCardNumber = (cardNumber) => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '')
    return cleanCardNumber.length >= 13 && cleanCardNumber.length <= 19 && /^\d+$/.test(cleanCardNumber)
  }

  const validateExpiryDate = (expiryDate) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!expiryRegex.test(expiryDate)) return false
    
    const [month, year] = expiryDate.split('/')
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear() % 100
    const currentMonth = currentDate.getMonth() + 1
    
    const expYear = parseInt(year, 10)
    const expMonth = parseInt(month, 10)
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false
    }
    
    return true
  }

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv)
  }

  const validateZipCode = (zipCode) => {
    return /^\d{5,6}$/.test(zipCode)
  }

  const validateForm = () => {
    const newErrors = {}

    // Cart validation
    if (!cartItems || cartItems.length === 0) {
      newErrors.cart = 'Your cart is empty. Please add items before checkout.'
    }

    // Shipping address validation
    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!streetAddress.trim()) newErrors.streetAddress = 'Street address is required'
    if (!city.trim()) newErrors.city = 'City is required'
    if (!state.trim()) newErrors.state = 'State/Province is required'
    if (!zipCode.trim()) {
      newErrors.zipCode = 'ZIP/Postal code is required'
    } else if (!validateZipCode(zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP/Postal code'
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!validatePhone(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    // Payment validation (only for credit card)
    if (selectedPayment === 'credit') {
      if (!cardName.trim()) newErrors.cardName = 'Name on card is required'
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required'
      } else if (!validateCardNumber(cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid card number'
      }
      if (!expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required'
      } else if (!validateExpiryDate(expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY) that is not expired'
      }
      if (!cvv.trim()) {
        newErrors.cvv = 'CVV is required'
      } else if (!validateCVV(cvv)) {
        newErrors.cvv = 'Please enter a valid CVV (3-4 digits)'
      }
    }

    // Agreement validation
    if (!isAgreementChecked) {
      newErrors.agreement = 'You must agree to the Terms & Conditions and Privacy Policy'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearError = (fieldName) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const handlePlaceOrder = () => {
    // Clear previous messages
    setPaymentMessage('')

    // Validate form
    if (!validateForm()) {
      setPaymentMessage('Please fix the errors below and try again.')
      return
    }

    if (!razorpayLoaded) {
      setPaymentMessage("Payment gateway not loaded yet. Please wait or refresh.")
      return
    }

    if (selectedPayment === 'credit') {
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

        {errors.cart && (
          <div className="checkout__error-banner">
            {errors.cart}
          </div>
        )}

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
                <div className="checkout__input-group">
                  <input
                    type="text"
                    placeholder="First Name*"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value)
                      clearError('firstName')
                    }}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="checkout__error">{errors.firstName}</span>}
                </div>
                <div className="checkout__input-group">
                  <input
                    type="text"
                    placeholder="Last Name*"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value)
                      clearError('lastName')
                    }}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="checkout__error">{errors.lastName}</span>}
                </div>
                <div className="checkout__input-group wide">
                  <input
                    type="text"
                    placeholder="Street Address*"
                    value={streetAddress}
                    onChange={(e) => {
                      setStreetAddress(e.target.value)
                      clearError('streetAddress')
                    }}
                    className={`wide ${errors.streetAddress ? 'error' : ''}`}
                  />
                  {errors.streetAddress && <span className="checkout__error">{errors.streetAddress}</span>}
                </div>
                <div className="checkout__input-group wide">
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="wide"
                  />
                </div>
                <div className="checkout__input-group">
                  <input
                    type="text"
                    placeholder="City*"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value)
                      clearError('city')
                    }}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <span className="checkout__error">{errors.city}</span>}
                </div>
                <div className="checkout__input-group">
                  <input
                    type="text"
                    placeholder="State/Province*"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value)
                      clearError('state')
                    }}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <span className="checkout__error">{errors.state}</span>}
                </div>
                <div className="checkout__input-group">
                  <input
                    type="text"
                    placeholder="ZIP/Postal Code*"
                    value={zipCode}
                    onChange={(e) => {
                      setZipCode(e.target.value)
                      clearError('zipCode')
                    }}
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <span className="checkout__error">{errors.zipCode}</span>}
                </div>
                <div className="checkout__input-group">
                  <input
                    type="email"
                    placeholder="Email Address*"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      clearError('email')
                    }}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="checkout__error">{errors.email}</span>}
                </div>
                <div className="checkout__input-group">
                  <input
                    type="tel"
                    placeholder="Phone Number*"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      clearError('phoneNumber')
                    }}
                    className={errors.phoneNumber ? 'error' : ''}
                  />
                  {errors.phoneNumber && <span className="checkout__error">{errors.phoneNumber}</span>}
                </div>
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
                    <p>Estimated delivery {getShippingDates(5, 10)}</p>
                  </div>
                  <span>Rs. 30.00</span>
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
                    <p>Estimated delivery {getShippingDates(2, 3)}</p>
                  </div>
                  <span>Rs. 50.00</span>
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
                    <p>Estimated delivery {getShippingDates(1, 1)}</p>
                  </div>
                  <span>Rs. 100.00</span>
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
                    <div className="checkout__input-group">
                      <input
                        type="text"
                        placeholder="Name on Card*"
                        value={cardName}
                        onChange={(e) => {
                          setCardName(e.target.value)
                          clearError('cardName')
                        }}
                        className={errors.cardName ? 'error' : ''}
                      />
                      {errors.cardName && <span className="checkout__error">{errors.cardName}</span>}
                    </div>
                    <div className="checkout__input-group">
                      <input
                        type="text"
                        placeholder="Card Number*"
                        value={cardNumber}
                        onChange={(e) => {
                          setCardNumber(e.target.value)
                          clearError('cardNumber')
                        }}
                        className={errors.cardNumber ? 'error' : ''}
                        maxLength="19"
                      />
                      {errors.cardNumber && <span className="checkout__error">{errors.cardNumber}</span>}
                    </div>
                    <div className="checkout__input-group">
                      <input
                        type="text"
                        placeholder="Expiry Date* (MM/YY)"
                        value={expiryDate}
                        onChange={(e) => {
                          setExpiryDate(e.target.value)
                          clearError('expiryDate')
                        }}
                        className={errors.expiryDate ? 'error' : ''}
                        maxLength="5"
                      />
                      {errors.expiryDate && <span className="checkout__error">{errors.expiryDate}</span>}
                    </div>
                    <div className="checkout__input-group">
                      <input
                        type="text"
                        placeholder="CVV*"
                        value={cvv}
                        onChange={(e) => {
                          setCvv(e.target.value)
                          clearError('cvv')
                        }}
                        className={errors.cvv ? 'error' : ''}
                        maxLength="4"
                      />
                      {errors.cvv && <span className="checkout__error">{errors.cvv}</span>}
                    </div>
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
                <span>Rs. {shippingCost.toFixed(2)}</span>
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

            <div className="checkout__agreement-section">
              <label className={`checkout__agreement ${errors.agreement ? 'error' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={isAgreementChecked}
                  onChange={(e) => {
                    setIsAgreementChecked(e.target.checked)
                    clearError('agreement')
                  }}
                />
                <span>I agree to the <a href="#terms">Terms & Conditions</a> and <a href="#privacy">Privacy Policy</a></span>
              </label>
              {errors.agreement && <span className="checkout__error">{errors.agreement}</span>}
            </div>

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
