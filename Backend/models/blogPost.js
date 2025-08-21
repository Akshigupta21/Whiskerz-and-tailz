const mongoose = require('mongoose');

// Define the BlogPost Schema
const blogPostSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Blog post title is required.'],
        trim: true,
        unique: true 
    },
    slug: {
        type: String,
        required: [true, 'Blog post slug is required.'],
        unique: true, 
        lowercase: true,
        trim: true
    },
    author: {
        type: String, 
        required: [true, 'Author is required.'],
        trim: true
    },
    publishDate: {
        type: Date,
        required: [true, 'Publish date is required.'],
        default: Date.now 
    },
    content: {
        type: String, // Full HTML or Markdown content of the blog post
        required: [true, 'Blog post content is required.']
    },
    excerpt: {
        type: String, 
        required: [true, 'Blog post excerpt is required.'],
        trim: true,
        maxlength: [500, 'Excerpt cannot exceed 500 characters.'] 
    },
    featuredImage: {
        type: String, 
        required: false, 
        default: 'https://placehold.co/800x400/cccccc/000000?text=Blog+Image'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlogCategory', 
        required: [true, 'Blog post category is required.']
    },
    tags: {
        type: [String],
        default: [],
        trim: true
    },
    views: {
        type: Number,
        default: 0, 
        min: [0, 'Views cannot be negative.']
    },
    isFeatured: {
        type: Boolean,
        default: false 
    }
}, {
    timestamps: true 
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
