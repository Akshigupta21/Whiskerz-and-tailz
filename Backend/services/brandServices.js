const Brand = require('../models/brands');

// Create a new brand
const createBrand = async (brandData) => {
    try {
        const newBrand = await Brand.create(brandData);
        return newBrand;
    } catch (error) {
        throw new Error('Failed to create brand: ' + error.message);
    }
};

// Get all brands
const getAllBrands = async () => {
    try {
        return await Brand.find();
    } catch (error) {
        throw new Error('Failed to fetch brands: ' + error.message);
    }
};

// Get a brand by ID
const getBrandById = async (brandId) => {
    try {
        return await Brand.findById(brandId);
    } catch (error) {
        throw new Error('Failed to fetch brand: ' + error.message);
    }
};

// Update a brand by ID
const updateBrand = async (brandId, updateData) => {
    try {
        return await Brand.findByIdAndUpdate(brandId, updateData, { new: true });
    } catch (error) {
        throw new Error('Failed to update brand: ' + error.message);
    }
};

// Delete a brand by ID
const deleteBrand = async (brandId) => {
    try {
        return await Brand.findByIdAndDelete(brandId);
    } catch (error) {
        throw new Error('Failed to delete brand: ' + error.message);
    }
};

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};