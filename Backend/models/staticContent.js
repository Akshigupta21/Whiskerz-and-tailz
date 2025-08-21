const mongoose = require('mongoose');

const staticContentSchema = new mongoose.Schema({

    key: {
        type: String,
        required: [true, 'Content key is required.'],
        unique: true, 
        trim: true,
        lowercase: true 
    },
    title: {
        type: String,
        required: [true, 'Content title is required.'],
        trim: true
    },
    content: {
        type: String, // The actual text/description, can be HTML or Markdown
        required: [true, 'Content body is required.']
    },
    image: {
        type: String, 
        required: false, 
        default: null 
    },
    icon: {
        type: String, 
        required: false, 
        default: null 
    },
    type: {
        type: String,
        required: [true, 'Content type is required for categorization.'],
        enum: {
            values: [
                'about_us_story',
                'core_value',
                'why_choose_feature',
                'milestone',
                'footer_link',
                'contact_info',
                'social_media',
                'app_download_link',
                'donation_text',
                'other_static_text' 
            ],
            message: 'Invalid static content type.'
        },
        trim: true
    },
    order: {
        type: Number,
        required: false,
        min: [0, 'Order cannot be negative.']
    },
    year: {
        type: Number,
        required: false,
        min: [1900, 'Year must be a valid year.']
    },
    value: {
        type: String,
        required: false, 
        trim: true
    },
    link: {
        type: String, 
        required: false, 
        trim: true
    }
}, {
    timestamps: true 
    
});

const StaticContent = mongoose.model('StaticContent', staticContentSchema);

module.exports = StaticContent;
