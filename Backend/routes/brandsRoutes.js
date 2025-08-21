const express = require('express');
const router = express.Router();
const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand
} = require('../services/brandServices'); // Adjust the import path as necessary

router.post('/', async (req, res) => {
    try {
        const brand = await createBrand(req.body);
        res.status(201).json(brand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const brands = await getAllBrands();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const brand = await getBrandById(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBrand = await updateBrand(req.params.id, req.body);
        if (!updatedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json(updatedBrand);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedBrand = await deleteBrand(req.params.id);
        if (!deletedBrand) {
            return res.status(404).json({ message: 'Brand not found' });
        }
        res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
