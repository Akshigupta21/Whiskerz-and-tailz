const express = require('express');
const router = express.Router();
const {
    createProductCategory,
    getAllProductCategories,
    getProductCategoryById,
    updateProductCategory,
    deleteProductCategory
} = require('../services/productCategoryServices'); // Adjust the import path as necessary

router.post('/', async (req, res) => {
    try {
        const category = await createProductCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await getAllProductCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await getProductCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Product category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await updateProductCategory(req.params.id, req.body);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Product category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await deleteProductCategory(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Product category not found' });
        }
        res.status(200).json({ message: 'Product category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
