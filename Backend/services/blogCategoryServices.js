const BlogCategory = require('../models/blogCategory');

// Create a new blog category
const createBlogCategory = async (categoryData) => {
    try {
        const newCategory = await BlogCategory.create(categoryData);
        return newCategory;
    } catch (error) {
        throw new Error('Failed to create category: ' + error.message);
    }
};

// Get all blog categories
const getAllBlogCategories = async () => {
    try {
        return await BlogCategory.find();
    } catch (error) {
        throw new Error('Failed to fetch categories: ' + error.message);
    }
};

// Get a blog category by ID
const getBlogCategoryById = async (categoryId) => {
    try {
        return await BlogCategory.findById(categoryId);
    } catch (error) {
        throw new Error('Failed to fetch category: ' + error.message);
    }
};

// Update a blog category by ID
const updateBlogCategory = async (categoryId, updateData) => {
    try {
        return await BlogCategory.findByIdAndUpdate(categoryId, updateData, { new: true });
    } catch (error) {
        throw new Error('Failed to update category: ' + error.message);
    }
};

// Delete a blog category by ID
const deleteBlogCategory = async (categoryId) => {
    try {
        return await BlogCategory.findByIdAndDelete(categoryId);
    } catch (error) {
        throw new Error('Failed to delete category: ' + error.message);
    }
};

module.exports = {
    createBlogCategory,
    getAllBlogCategories,
    getBlogCategoryById,
    updateBlogCategory,
    deleteBlogCategory,
};
