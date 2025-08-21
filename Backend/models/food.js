const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Food name is required'],
        trim: true,
        maxlength: [100, 'Food name cannot exceed 100 characters']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Dry Food', 'Wet Food', 'Raw Food', 'Treats', 'Supplements', 'Special Diet'],
        default: 'Dry Food'
    },
    petType: {
        type: String,
        required: [true, 'Pet type is required'],
        enum: ['Dog', 'Cat', 'Bird', 'Fish', 'Small Animals', 'All Pets'],
        default: 'All Pets'
    },
    ageGroup: {
        type: String,
        enum: ['Puppy/Kitten', 'Adult', 'Senior', 'All Ages'],
        default: 'All Ages'
    },
    breedSize: {
        type: String,
        enum: ['Small', 'Medium', 'Large', 'All Sizes'],
        default: 'All Sizes'
    },
    ingredients: [{
        type: String,
        trim: true
    }],
    nutritionalInfo: {
        protein: {
            type: Number,
            min: [0, 'Protein percentage cannot be negative'],
            max: [100, 'Protein percentage cannot exceed 100']
        },
        fat: {
            type: Number,
            min: [0, 'Fat percentage cannot be negative'],
            max: [100, 'Fat percentage cannot exceed 100']
        },
        fiber: {
            type: Number,
            min: [0, 'Fiber percentage cannot be negative'],
            max: [100, 'Fiber percentage cannot exceed 100']
        },
        moisture: {
            type: Number,
            min: [0, 'Moisture percentage cannot be negative'],
            max: [100, 'Moisture percentage cannot exceed 100']
        },
        calories: {
            type: Number,
            min: [0, 'Calories cannot be negative']
        }
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0, 'Weight cannot be negative']
    },
    weightUnit: {
        type: String,
        enum: ['grams', 'kg', 'lbs'],
        default: 'kg'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
        default: 0
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock quantity cannot be negative'],
        default: 0
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            default: ''
        },
        isPrimary: {
            type: Boolean,
            default: false
        }
    }],
    rating: {
        average: {
            type: Number,
            min: [0, 'Rating cannot be negative'],
            max: [5, 'Rating cannot exceed 5'],
            default: 0
        },
        count: {
            type: Number,
            min: [0, 'Rating count cannot be negative'],
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5']
        },
        comment: {
            type: String,
            maxlength: [500, 'Review comment cannot exceed 500 characters']
        },
        date: {
            type: Date,
            default: Date.now
        },
        verified: {
            type: Boolean,
            default: false
        }
    }],
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    specialFeatures: [{
        type: String,
        enum: [
            'Grain Free', 
            'Organic', 
            'Natural', 
            'Gluten Free', 
            'Limited Ingredients', 
            'Hypoallergenic',
            'Veterinary Recommended',
            'Made in USA',
            'No Artificial Colors',
            'No Preservatives'
        ]
    }],
    manufacturer: {
        name: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'Unknown'
        },
        contact: {
            type: String
        }
    },
    expiryDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isDealOfTheDay: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    salesCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for discounted price
foodSchema.virtual('discountedPrice').get(function() {
    if (this.discount > 0) {
        return this.price - (this.price * this.discount / 100);
    }
    return this.price;
});

// Virtual for savings amount
foodSchema.virtual('savings').get(function() {
    if (this.originalPrice && this.originalPrice > this.price) {
        return this.originalPrice - this.price;
    }
    if (this.discount > 0) {
        return this.price * this.discount / 100;
    }
    return 0;
});

// Virtual for primary image
foodSchema.virtual('primaryImage').get(function() {
    const primary = this.images.find(img => img.isPrimary);
    return primary ? primary.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Index for search optimization
foodSchema.index({ name: 'text', description: 'text', brand: 'text' });
foodSchema.index({ category: 1, petType: 1 });
foodSchema.index({ price: 1 });
foodSchema.index({ 'rating.average': -1 });
foodSchema.index({ createdAt: -1 });
foodSchema.index({ isFeatured: 1 });
foodSchema.index({ isDealOfTheDay: 1 });

// Pre-save middleware to set original price if not provided
foodSchema.pre('save', function(next) {
    if (!this.originalPrice) {
        this.originalPrice = this.price;
    }
    
    // Set inStock based on stockQuantity
    this.inStock = this.stockQuantity > 0;
    
    next();
});

// Method to add review
foodSchema.methods.addReview = function(userId, rating, comment) {
    this.reviews.push({
        user: userId,
        rating: rating,
        comment: comment,
        date: new Date(),
        verified: false
    });
    
    // Recalculate average rating
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
    
    return this.save();
};

// Method to increment views
foodSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

// Method to increment sales count
foodSchema.methods.incrementSales = function(quantity = 1) {
    this.salesCount += quantity;
    this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
    this.inStock = this.stockQuantity > 0;
    return this.save();
};

// Static method to get featured foods
foodSchema.statics.getFeatured = function() {
    return this.find({ isFeatured: true, isActive: true }).sort({ createdAt: -1 });
};

// Static method to get deal of the day
foodSchema.statics.getDealOfTheDay = function() {
    return this.find({ isDealOfTheDay: true, isActive: true }).sort({ discount: -1 }).limit(10);
};

// Static method to search foods
foodSchema.statics.searchFoods = function(searchTerm, filters = {}) {
    const query = { isActive: true };
    
    if (searchTerm) {
        query.$text = { $search: searchTerm };
    }
    
    if (filters.category) query.category = filters.category;
    if (filters.petType) query.petType = filters.petType;
    if (filters.ageGroup) query.ageGroup = filters.ageGroup;
    if (filters.breedSize) query.breedSize = filters.breedSize;
    if (filters.minPrice) query.price = { ...query.price, $gte: filters.minPrice };
    if (filters.maxPrice) query.price = { ...query.price, $lte: filters.maxPrice };
    if (filters.inStock !== undefined) query.inStock = filters.inStock;
    if (filters.specialFeatures) query.specialFeatures = { $in: filters.specialFeatures };
    
    return this.find(query);
};

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
