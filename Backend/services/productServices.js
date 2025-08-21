const Product = require("../models/product");

// Create a new product
const createProduct = async (prodData) => {
    try {
        const newProd = new Product(prodData);
        await newProd.save();
        return newProd;
    } catch (error) {
        throw new Error("Failed to create new product: " + error.message);
    }
};

// Get all products with optional filters
const getAllProducts = async (filters = {}) => {
    try {
        return await Product.find(filters)
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('petType', 'name');
    } catch (error) {
        throw new Error('Failed to retrieve products: ' + error.message);
    }
};

// Get a product by ID
const getProductById = async (prodId) => {
    try {
        return await Product.findById(prodId)
            .populate('category', 'name')
            .populate('brand', 'name')
            .populate('petType', 'name');
    } catch (error) {
        throw new Error('Failed to retrieve product: ' + error.message);
    }
};

// Update a product
const updateProduct = async (prodId, updateData) => {
    try {
        return await Product.findByIdAndUpdate(
            prodId,
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .populate('category', 'name')
        .populate('brand', 'name')
        .populate('petType', 'name');
    } catch (error) {
        throw new Error('Failed to update product: ' + error.message);
    }
};

// Delete a product
const deleteProduct = async (prodId) => {
    try {
        return await Product.findByIdAndDelete(prodId);
    } catch (error) {
        throw new Error('Failed to delete product: ' + error.message);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
