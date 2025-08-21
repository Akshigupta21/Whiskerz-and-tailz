const mongoose = require('mongoose');

// Define the Subscription Schema
const subscriptionSchema = new mongoose.Schema({
    // MongoDB's default _id is automatically added.

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'users' collection
        required: [true, 'User ID is required for a subscription.']
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // References the 'products' collection
        required: [true, 'Product ID is required for a subscription.']
    },
    frequency: {
        type: String,
        required: [true, 'Subscription frequency is required.'],
        enum: {
            values: ['Every 2 weeks', 'Every month', 'Every 2 months', 'Custom'],
            message: 'Invalid frequency. Must be "Every 2 weeks", "Every month", "Every 2 months", or "Custom".'
        },
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'Subscription start date is required.'],
        default: Date.now // Defaults to current date if not provided
    },
    nextDeliveryDate: {
        type: Date,
        required: [true, 'Next delivery date is required.']
        // This date should be calculated based on startDate and frequency
    },
    status: {
        type: String,
        required: [true, 'Subscription status is required.'],
        enum: {
            values: ['Active', 'Paused', 'Cancelled', 'Completed'], // 'Completed' for subscriptions that have run their course
            message: 'Invalid subscription status. Must be Active, Paused, Cancelled, or Completed.'
        },
        default: 'Active'
    },
    discountApplied: {
        type: Number, // e.g., 10 for 10% discount
        required: false, // Optional
        min: [0, 'Discount cannot be negative.'],
        default: 0
    },
    shippingFree: {
        type: Boolean,
        required: [true, 'Shipping free status is required.'],
        default: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
    // createdAt: Date
    // updatedAt: Date
});

// Create the Subscription Model from the schema
const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
