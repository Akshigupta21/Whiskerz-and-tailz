const AdoptionAgency = require('../models/adoptionAgency');

// Create a new adoption agency
const createAgency = async (agencyData) => {
    try {
        const newAgency = await AdoptionAgency.create(agencyData);
        return newAgency;
    } catch (error) {
        throw new Error('Failed to create agency: ' + error.message);
    }
};

// Get all adoption agencies
const getAllAgencies = async () => {
    try {
        return await AdoptionAgency.find();
    } catch (error) {
        throw new Error('Failed to fetch agencies: ' + error.message);
    }
};

// Get an adoption agency by ID
const getAgencyById = async (agencyId) => {
    try {
        return await AdoptionAgency.findById(agencyId);
    } catch (error) {
        throw new Error('Failed to fetch agency: ' + error.message);
    }
};

// Update an adoption agency by ID
const updateAgency = async (agencyId, updateData) => {
    try {
        return await AdoptionAgency.findByIdAndUpdate(agencyId, updateData, { new: true });
    } catch (error) {
        throw new Error('Failed to update agency: ' + error.message);
    }
};

// Delete an adoption agency by ID
const deleteAgency = async (agencyId) => {
    try {
        return await AdoptionAgency.findByIdAndDelete(agencyId);
    } catch (error) {
        throw new Error('Failed to delete agency: ' + error.message);
    }
};

module.exports = {
    createAgency,
    getAllAgencies,
    getAgencyById,
    updateAgency,
    deleteAgency,
};