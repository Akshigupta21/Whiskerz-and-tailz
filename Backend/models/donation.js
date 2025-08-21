const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // References the 'users' collection (optional, for logged-in donors)
        required: false // Optional, as donations can be anonymous or from guests
    },
    amount: {
        type: Number,
        required: [true, 'Donation amount is required.'],
        min: [0.01, 'Donation amount must be positive.'] // Minimum positive amount
    },
    isAnonymous: {
        type: Boolean,
        required: [true, 'Is anonymous status is required.'],
        default: false
    },
    donorName: {
        type: String,
        required: false,
        trim: true,
        default: 'Anonymous'
    },
    donorEmail: {
        type: String,
        required: false,
        trim: true,
        lowercase: true
    },
    paymentId: {
        type: String,
        required: false, // Razorpay payment ID
        sparse: true // Allows multiple null values
    },
    orderId: {
        type: String,
        required: false, // Razorpay order ID
        sparse: true // Allows multiple null values
    },
    paymentIntentId: {
        type: String,
        required: false, // Stripe payment intent ID (for backward compatibility)
        sparse: true // Allows multiple null values
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['stripe', 'razorpay', 'paypal', 'bank_transfer', 'cash'],
        default: 'razorpay'
    },
    transactionId: {
        type: String,
        required: false // External transaction ID
    },
    timestamp: {
        type: Date,
        required: [true, 'Donation timestamp is required.'],
        default: Date.now 
    }
}, { _id: false }); 

const donationSchema = new mongoose.Schema({

    campaignName: {
        type: String,
        required: [true, 'Campaign name is required.'],
        unique: true, // Ensures campaign names are unique
        trim: true
    },
    goalAmount: {
        type: Number,
        required: [true, 'Goal amount is required for the campaign.'],
        min: [0, 'Goal amount cannot be negative.']
    },
    currentAmount: {
        type: Number,
        required: [true, 'Current amount is required.'],
        default: 0, // Starts at 0
        min: [0, 'Current amount cannot be negative.']
    },
    description: {
        type: String,
        required: [true, 'Campaign description is required.'],
        trim: true
    },
    image: {
        type: String, // URL of the campaign image
        required: false, // Image is optional
        default: 'https://placehold.co/800x400/cccccc/000000?text=Donation+Campaign' // Placeholder image
    },
    startDate: {
        type: Date,
        required: [true, 'Campaign start date is required.'],
        default: Date.now // Defaults to current date if not provided
    },
    endDate: {
        type: Date,
        required: false // Optional, if the campaign has a specific deadline
    },
    status: {
        type: String,
        required: [true, 'Campaign status is required.'],
        enum: {
            values: ['Active', 'Completed', 'Paused', 'Archived'], // Common campaign statuses
            message: 'Invalid campaign status. Must be Active, Completed, Paused, or Archived.'
        },
        default: 'Active'
    },
    donors: {
        type: [donorSchema], // Array of embedded donor documents
        default: [] // Default to an empty array
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
    // createdAt: Date
    // updatedAt: Date
});

// Create the Donation Model from the schema
const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
