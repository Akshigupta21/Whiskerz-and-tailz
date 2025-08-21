const mongoose = require('mongoose');

// Define the schema for individual sections within a service
const serviceSectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Section title is required.'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Section type is required.'],
        enum: {
            values: ['list', 'table', 'paragraph', 'image', 'video'], // Extend as needed
            message: 'Invalid section type. Must be list, table, paragraph, image, or video.'
        },
        trim: true
    },

    content: {
        type: mongoose.Schema.Types.Mixed, 
        required: [true, 'Section content is required.']
    }
}, { _id: false }); 

const serviceSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Service name is required.'],
        unique: true, // Service names should be unique
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Service slug is required.'],
        unique: true, // Slugs must be unique for friendly URLs
        lowercase: true, 
        trim: true
    },
    tagline: {
        type: String,
        required: [true, 'Service tagline is required for display.'],
        trim: true,
        maxlength: [200, 'Tagline cannot exceed 200 characters.']
    },
    description: {
        type: String,
        required: [true, 'Service description is required.'],
        trim: true
    },
    icon: {
        type: String, // URL or class name for an icon (e.g., Font Awesome class)
        required: false,
        trim: true
    },
    image: {
        type: String, // URL for the hero image of the service
        default: 'https://placehold.co/800x400/cccccc/000000?text=Service',
        required: false
    },
    startingPrice: {
        type: Number,
        required: false, 
        min: [0, 'Starting price cannot be negative.']
    },
    category: {
        type: String,
        required: [true, 'Service category is required.'],
        enum: {
            values: ['Health', 'Grooming', 'Training', 'Boarding', 'Nutrition', 'Pet Taxi', 'Consultation', 'Other'],
            message: 'Invalid service category.'
        },
        trim: true
    },
    sections: {
        type: [serviceSectionSchema],
        default: [] 
    },
    isBookable: {
        type: Boolean,
        default: true 
    }
}, {
    timestamps: true,
    createdAt: Date,
    updatedAt: Date
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
