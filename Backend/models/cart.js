const mongoose = require('mongoose');

// Define schema for individual items within the cart
const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // References the 'products' collection
        required: [true, 'Product ID is required for a cart item.']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required for a cart item.'],
        min: [1, 'Quantity must be at least 1.']
    },
    addedAt: {
        type: Date,
        required: [true, 'Added date is required for a cart item.'],
        default: Date.now // Timestamp when the item was added to the cart
    }
}, { _id: false }); // No separate _id for each cart item subdocument

// Define the main Cart Schema
const cartSchema = new mongoose.Schema({
    // MongoDB's default _id is automatically added.

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'users' collection
        required: false, // Optional, if the cart belongs to a guest
        default: null
    },
    sessionId: {
        type: String,
        required: function() {
            // sessionId is required if userId is not provided (for guest carts)
            return !this.userId;
        },
        unique: true, // Ensures unique sessions for guest carts
        sparse: true, // Allows multiple documents to have null sessionId if userId is present
        trim: true
    },
    items: {
        type: [cartItemSchema], // Array of embedded cart item documents
        default: [] // Default to an empty array
    },
    lastAccessed: {
        type: Date,
        required: [true, 'Last accessed date is required.'],
        default: Date.now // Updates whenever the cart is accessed or modified
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields for the cart itself
});

// Create the Cart Model from the schema
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
