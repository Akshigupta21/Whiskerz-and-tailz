const mongoose = require('mongoose');

// Schema for storing tokenized payment methods
const paymentMethodSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for a payment method.']
    },
    // The token provided by the payment gateway (e.g., Stripe's customer ID or payment method ID)
    paymentGatewayCustomerId: {
        type: String,
        required: [true, 'Payment gateway customer ID is required.'],
        trim: true,
        unique: true // A user typically has one customer ID per gateway
    },
    // Optional: Store gateway-specific payment method ID if applicable (e.g., Stripe's pm_XXX)
    paymentMethodId: {
        type: String,
        required: false,
        trim: true
    },
    cardBrand: {
        type: String, // e.g., "Visa", "Mastercard", "Amex"
        required: false,
        trim: true
    },
    last4: {
        type: String, // Last four digits of the card
        required: false,
        trim: true
    },
    expirationMonth: {
        type: Number,
        required: false,
        min: 1,
        max: 12
    },
    expirationYear: {
        type: Number,
        required: false,
        min: [new Date().getFullYear(), 'Expiration year cannot be in the past.']
    },
    cardType: { // e.g., "credit", "debit"
        type: String,
        required: false,
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    billingAddress: { // Optional: billing address associated with the card
        type: Object, // You can embed the addressSchema here or a simpler version
        required: false
    },
    // Do NOT store: full card number, CVV, PIN
}, {
    timestamps: true // createdAt, updatedAt
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

module.exports = PaymentMethod;
