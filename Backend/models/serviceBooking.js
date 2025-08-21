const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
    // MongoDB's default _id is automatically added.

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for a service booking.']
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service', 
        required: [true, 'Service ID is required for a service booking.']
    },
    serviceName: {
        type: String,
        required: [true, 'Service name is required.'],
        trim: true
    
    },
    date: {
        type: Date,
        required: [true, 'Booking date is required.']
    },
    time: {
        type: String, // Storing time as a string (e.g., "10:00 AM", "14:30")
        required: [true, 'Booking time is required.'],
        trim: true
    },
    petType: {
        type: String,
        required: [true, 'Pet type is required for booking.'],
        enum: {
            values: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Reptile', 'Other'],
            message: 'Invalid pet type for booking.'
        },
        trim: true
    },
    petName: {
        type: String,
        required: [true, 'Pet name is required for booking.'],
        trim: true
    },
    specialRequirements: {
        type: String,
        required: false, 
        trim: true
    },
    bookingStatus: {
        type: String,
        required: [true, 'Booking status is required.'],
        enum: {
            values: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'],
            message: 'Invalid booking status.'
        },
        default: 'Pending'
    }
}, {
    timestamps: true
   
});

// Create the ServiceBooking Model from the schema
const ServiceBooking = mongoose.model('ServiceBooking', serviceBookingSchema);

module.exports = ServiceBooking;
