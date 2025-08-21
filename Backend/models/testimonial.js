const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({

    quote: {
        type: String,
        required: [true, 'Testimonial quote is required.'],
        trim: true,
        maxlength: [1000, 'Testimonial quote cannot exceed 1000 characters.'] // Optional: limit length
    },
    authorName: {
        type: String,
        required: [true, 'Author name is required.'],
        trim: true
    },
    authorTitle: {
        type: String, 
        required: false, 
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required.'],
        min: [1, 'Rating must be at least 1.'],
        max: [5, 'Rating cannot be greater than 5.']
    },
    serviceUsed: {
        type: String,
        required: false, 
        trim: true
    },
    authorImage: {
        type: String, 
        required: false,
        default: 'https://placehold.co/80x80/cccccc/000000?text=👤'
    },
    isApproved: {
        type: Boolean,
        default: false 
    }
}, {
    timestamps: true 
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

module.exports = Testimonial;
