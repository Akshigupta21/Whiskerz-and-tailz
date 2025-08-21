const ProductCategory = require('../models/productCategory');

// Create a new product category
const createProductCategory = async (categoryData) => {
    try {
        return await ProductCategory.create(categoryData);
    } catch (error) {
        throw new Error('Failed to create product category: ' + error.message);
    }
};

// Get all product categories (with optional filters)
const getAllProductCategories = async (filters = {}) => {
    try {
        return await ProductCategory.find(filters);
    } catch (error) {
        throw new Error('Failed to retrieve product categories: ' + error.message);
    }
};

// Get a product category by ID
const getProductCategoryById = async (categoryId) => {
    try {
        return await ProductCategory.findById(categoryId);
    } catch (error) {
        throw new Error('Failed to retrieve product category: ' + error.message);
    }
};

// Update a product category
const updateProductCategory = async (categoryId, updateData) => {
    try {
        return await ProductCategory.findByIdAndUpdate(
            categoryId,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw new Error('Failed to update product category: ' + error.message);
    }
};

// Delete a product category
const deleteProductCategory = async (categoryId) => {
    try {
        return await ProductCategory.findByIdAndDelete(categoryId);
    } catch (error) {
        throw new Error('Failed to delete product category: ' + error.message);
    }
};

module.exports = {
    createProductCategory,
    getAllProductCategories,
    getProductCategoryById,
    updateProductCategory,
    deleteProductCategory
};
