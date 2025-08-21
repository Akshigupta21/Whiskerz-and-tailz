const mongoose = require('mongoose');

// Define the schema for the embedded 'dealInfo' object
const dealInfoSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'Deal type is required.'],
        enum: {
            values: ['percentage', 'buyXgetY', 'bundle', 'fixed_amount'], // Added 'fixed_amount' as a common type
            message: 'Invalid deal type. Must be percentage, buyXgetY, bundle, or fixed_amount.'
        }
    },
    value: {
        type: Number,
        required: [true, 'Deal value is required.'],
        min: [0, 'Deal value cannot be negative.']
    },
    endsAt: {
        type: Date,
        required: [true, 'Deal end date is required.']
    }
}, { _id: false }); // Do not create a default _id for this subdocument

// Define the main Product Schema
const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Product name is required.'],
        trim: true,
        unique: true 
    },
    slug: {
        type: String,
        required: [true, 'Product slug is required.'],
        unique: true, 
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required.'],
        trim: true
    },
    images: {
        type: [String], 
        default: ['https://placehold.co/400x400/cccccc/000000?text=Product'], // Default placeholder image
        required: [true, 'At least one product image URL is required.']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required.'],
        min: [0, 'Price cannot be negative.']
    },
    originalPrice: {
        type: Number,
        required: false, 
        min: [0, 'Original price cannot be negative.']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ProductCategory', 
        required: [true, 'Product category is required.']
    },
    subCategory: {
        type: String, // e.g., "Dry Food", "Wet Food"
        required: false, 
        trim: true
    },
    petType: {
        type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds referencing 'petTypes'
        ref: 'PetType', // The model name this array of ObjectIds refers to
        default: [], 
        required: [true, 'At least one pet type is required for the product.']
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Brand', 
        required: [true, 'Product brand is required.']
    },
    rating: {
        type: Number,
        min: [0, 'Rating cannot be less than 0.'],
        max: [5, 'Rating cannot be greater than 5.'],
        default: 0 
    },
    numReviews: {
        type: Number,
        default: 0, 
        min: [0, 'Number of reviews cannot be negative.']
    },
    inStock: {
        type: Boolean,
        default: true 
    },
    isOnSale: {
        type: Boolean,
        default: false 
    },
    isNewProduct: {
        type: Boolean,
        default: false 
    },
    isFeatured: {
        type: Boolean,
        default: false 
    },
    isBestseller: {
        type: Boolean,
        default: false 
    },
    specialDietaryNeeds: {
        type: [String], 
        default: [], 
        enum: {
            values: ['Grain-Free', 'Hypoallergenic', 'Weight Management', 'Senior Nutrition', 'Sensitive Stomach', 'Allergy Friendly', 'Low Fat', 'High Protein'], 
            message: 'Invalid special dietary need.'
        }
    },
    dealInfo: {
        type: dealInfoSchema, // Embedded subdocument using the defined schema
        required: false 
    }
}, {
    timestamps: true 
});

// Create the Product Model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
