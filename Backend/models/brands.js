const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Brand name is required.'],
        unique: true,
        trim: true
    },
    logo: {
        type: String,
        required: false 
    },
    description: {
        type: String,
        required: false, 
        trim: true
    }
}, {
    timestamps: true 
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
