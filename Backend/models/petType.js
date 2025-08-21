const mongoose = require('mongoose');

// Define the PetType Schema
const petTypeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Pet type name is required.'],
        unique: true, 
        trim: true,
        enum: {
            values: ['Dogs', 'Cats', 'Birds', 'Fish', 'Small Pets', 'Reptiles'], // Allowed pet types
            message: 'Invalid pet type. Must be Dogs, Cats, Birds, Fish, Small Pets, or Reptiles.'
        }
    },
    slug: {
        type: String,
        required: [true, 'Pet type slug is required.'],
        unique: true, 
        lowercase: true, 
        trim: true
    },
    icon: {
        type: String, 
        required: false, 
        trim: true,
        default: 'https://placehold.co/50x50/cccccc/000000?text=🐾'
    },
    numProducts: {
        type: Number,
        default: 0,
        min: [0, 'Number of products cannot be negative.']
    }
}, {
    timestamps: true 
});

const PetType = mongoose.model('PetType', petTypeSchema);

module.exports = PetType;
