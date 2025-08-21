const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Category name is required.'],
        unique: true, // Category names should be unique
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
        required: false, 
        trim: true
    },
    image: {
        type: String, 
        required: false,
    },
    numProducts: {
        type: Number,
        default: 0, 
        min: [0, 'Number of products cannot be negative.']
    }
}, {
    timestamps: true 
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;
