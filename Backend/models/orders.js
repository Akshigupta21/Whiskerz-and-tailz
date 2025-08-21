const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required for an order item.']
    },
    name: {
        type: String,
        required: [true, 'Product name is required for an order item.'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price at time of purchase is required.'],
        min: [0, 'Price cannot be negative.']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required for an order item.'],
        min: [1, 'Quantity must be at least 1.']
    },
    image: {
        type: String,
        required: false 
    }
}, { _id: false }); 

const addressSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required for address.'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required for address.'],
        trim: true
    },
    streetAddress: {
        type: String,
        required: [true, 'Street address is required.'],
        trim: true
    },
    apartment: {
        type: String,
        required: false, // Optional
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required.'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required.'],
        trim: true
    },
    zipCode: {
        type: String,
        required: [true, 'Zip code is required.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required for address.'],
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required for address.'],
        trim: true
    }
}, { _id: false }); 

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: false, 
        default: null
    },
    guestInfo: {
        type: {
            email: { type: String, trim: true, lowercase: true },
            phoneNumber: { type: String, trim: true }
        },
        required: function() {
            return !this.userId; 
        },
        _id: false 
    },
    items: {
        type: [orderItemSchema], 
        required: [true, 'Order must contain at least one item.'],
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Order items array cannot be empty.'
        }
    },
    shippingAddress: {
        type: addressSchema, 
        required: [true, 'Shipping address is required.']
    },
    billingAddress: {
        type: addressSchema, 
        required: false
    },
    subtotal: {
        type: Number,
        required: [true, 'Subtotal is required.'],
        min: [0, 'Subtotal cannot be negative.']
    },
    shippingCost: {
        type: Number,
        required: [true, 'Shipping cost is required.'],
        min: [0, 'Shipping cost cannot be negative.'],
        default: 0
    },
    tax: {
        type: Number,
        required: [true, 'Tax amount is required.'],
        min: [0, 'Tax cannot be negative.'],
        default: 0
    },
    discount: {
        type: Number,
        required: false, // Optional
        min: [0, 'Discount cannot be negative.'],
        default: 0
    },
    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required.'],
        min: [0, 'Total amount cannot be negative.']
    },
    couponCode: {
        type: String,
        required: false, // Optional
        trim: true
    },
    orderStatus: {
        type: String,
        required: [true, 'Order status is required.'],
        enum: {
            values: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'], // Extended statuses for clarity
            message: 'Invalid order status.'
        },
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        required: [true, 'Payment status is required.'],
        enum: {
            values: ['Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'], // Extended statuses
            message: 'Invalid payment status.'
        },
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required.'],
        trim: true
    },
    estimatedDeliveryDate: {
        type: Date, 
        required: false 
    }
}, {
    timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
