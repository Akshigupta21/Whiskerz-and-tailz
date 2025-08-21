const Feature = require("../models/service");

// Create a new feature
const createFeature = async (featureData) => {
    try {
        const newFeature = new Feature(featureData);
        await newFeature.save();
        return newFeature;
    } catch (error) {
        throw new Error("Failed to create new feature: " + error.message);
    }
};

// Get all features with optional filters
const getAllFeatures = async (filters = {}) => {
    try {
        return await Feature.find(filters);
    } catch (error) {
        throw new Error("Failed to retrieve features: " + error.message);
    }
};

// Get a feature by ID
const getFeatureById = async (featureId) => {
    try {
        return await Feature.findById(featureId);
    } catch (error) {
        throw new Error("Failed to retrieve feature: " + error.message);
    }
};

// Update a feature
const updateFeature = async (featureId, updateData) => {
    try {
        return await Feature.findByIdAndUpdate(
            featureId,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw new Error("Failed to update feature: " + error.message);
    }
};

// Delete a feature
const deleteFeature = async (featureId) => {
    try {
        return await Feature.findByIdAndDelete(featureId);
    } catch (error) {
        throw new Error("Failed to delete feature: " + error.message);
    }
};

module.exports = {
    createFeature,
    getAllFeatures,
    getFeatureById,
    updateFeature,
    deleteFeature
};
