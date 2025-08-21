const express = require('express');
const router = express.Router();
const {
    createBlogCategory,
    getAllBlogCategories,
    getBlogCategoryById,
    updateBlogCategory,
    deleteBlogCategory
} = require('../services/blogCategoryServices'); 

router.post('/', async (req, res) => {
    try {
        const category = await createBlogCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await getAllBlogCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await getBlogCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Blog category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await updateBlogCategory(req.params.id, req.body);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Blog category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await deleteBlogCategory(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Blog category not found' });
        }
        res.status(200).json({ message: 'Blog category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
