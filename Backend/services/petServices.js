const Pet = require('../models/pet');

// Create a new pet
const createPet = async (petData) => {
    try {
        return await Pet.create(petData);
    } catch (error) {
        throw new Error('Failed to create pet: ' + error.message);
    }
};

// Get all pets, optionally filtered by ownerId
const getAllPets = async (ownerId = null) => {
    try {
        const query = ownerId ? { ownerId } : {};
        return await Pet.find(query).populate('ownerId', 'fullName email');
    } catch (error) {
        throw new Error('Failed to retrieve pets: ' + error.message);
    }
};

// Get a pet by ID
const getPetById = async (petId) => {
    try {
        return await Pet.findById(petId).populate('ownerId', 'fullName email');
    } catch (error) {
        throw new Error('Failed to retrieve pet: ' + error.message);
    }
};

// Update a pet
const updatePet = async (petId, updateData) => {
    try {
        return await Pet.findByIdAndUpdate(
            petId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('ownerId', 'fullName email');
    } catch (error) {
        throw new Error('Failed to update pet: ' + error.message);
    }
};

// Delete a pet
const deletePet = async (petId) => {
    try {
        return await Pet.findByIdAndDelete(petId);
    } catch (error) {
        throw new Error('Failed to delete pet: ' + error.message);
    }
};

module.exports = {
    createPet,
    getAllPets,
    getPetById,
    updatePet,
    deletePet
};
