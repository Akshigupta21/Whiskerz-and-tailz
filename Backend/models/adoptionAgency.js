const mongoose = require('mongoose');

const adoptionAgencySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Agency name is required.'],
        unique: true, 
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Agency address is required.'],
        trim: true
    },
    contactInfo: {
        type: String, 
        required: [true, 'Contact information is required.'],
        trim: true
    },
    availablePetTypes: {
        type: [String], 
        default: [], 
        enum: {
            values: ['Dogs', 'Cats', 'Rabbits', 'Birds', 'Fish', 'Small Pets', 'Reptiles', 'Other'], // Extended list of pet types
            message: 'Invalid pet type in available pets.'
        }
    },
    image: {
        type: String,
        required: false, 
        default: 'https://placehold.co/800x400/cccccc/000000?text=Adoption+Agency' 
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
    description: {
        type: String,
        required: false,
        trim: true
    }
}, {
    timestamps: true 
});

const AdoptionAgency = mongoose.model('AdoptionAgency', adoptionAgencySchema);

module.exports = AdoptionAgency;
