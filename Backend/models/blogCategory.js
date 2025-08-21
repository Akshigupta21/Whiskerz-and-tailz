const mongoose = require('mongoose');

const blogCategorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Category name is required.'],
        unique: true, 
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'Category slug is required.'],
        unique: true, 
        lowercase: true, 
        trim: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters.']
    },
    numPosts: {
        type: Number,
        default: 0, 
        min: [0, 'Number of posts cannot be negative.']
    }
}, {
    timestamps: true 
});

const BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);

module.exports = BlogCategory;
