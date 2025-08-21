const mongoose = require('mongoose');

// Define the Pet Schema
const petSchema = new mongoose.Schema({

    ownerId: {
        type: mongoose.Schema.Types.ObjectId, // References the 'users' collection
        ref: 'User', // The model name that this ObjectId refers to
        required: [true, 'Pet owner is required.']
    },
    name: {
        type: String,
        required: [true, 'Pet name is required.'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Pet type is required.'],
        enum: {
            values: ['Dog', 'Cat', 'Bird', 'Fish', 'Rabbit', 'Hamster', 'Reptile'], // Allowed pet types
            message: 'Invalid pet type. Must be Dog, Cat, Bird, Fish, Rabbit, Reptiles or Hamster.'
        },
        trim: true
    },
    breed: {
        type: String,
        required: false, // Breed can be optional
        trim: true
    },
    age: {
        type: Number,
        required: true, // Age can be optional
        min: [0, 'Age cannot be negative.']
    },
    
    gender: {
        type: String,
        required: false, // Gender can be optional
        enum: {
            values: ['Male', 'Female'],
            message: 'Invalid gender. Must be Male, Female.'
        }
    },
    medicalNotes: {
        type: String,
        required: false, // Medical notes are optional
        trim: true
    },
    profilePicture: {
        type: String, // URL to the pet's profile image
        default: 'https://placehold.co/150x150/cccccc/000000?text=Pet', // Placeholder image
        required: false
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the Pet Model from the schema
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
