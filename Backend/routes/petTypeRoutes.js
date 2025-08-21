const express = require('express');
const router = express.Router();
const {
    createPetType,
    getAllPetTypes,
    getPetTypeById,
    updatePetType,
    deletePetType
} = require('../services/petTypeServices'); // Adjust the import path as necessary


router.post('/', async (req, res) => {
    try {
        const petType = await createPetType(req.body);
        res.status(201).json(petType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const petTypes = await getAllPetTypes();
        res.status(200).json(petTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const petType = await getPetTypeById(req.params.id);
        if (!petType) {
            return res.status(404).json({ message: 'Pet type not found' });
        }
        res.status(200).json(petType);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedPetType = await updatePetType(req.params.id, req.body);
        if (!updatedPetType) {
            return res.status(404).json({ message: 'Pet type not found' });
        }
        res.status(200).json(updatedPetType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const deletedPetType = await deletePetType(req.params.id);
        if (!deletedPetType) {
            return res.status(404).json({ message: 'Pet type not found' });
        }
        res.status(200).json({ message: 'Pet type deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
