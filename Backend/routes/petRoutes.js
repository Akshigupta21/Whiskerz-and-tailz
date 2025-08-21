const express = require('express');
const router = express.Router();
const {
    createPet,
    getAllPets,
    getPetById,
    updatePet,
    deletePet
} = require('../services/petServices'); // Adjust path as needed


router.post('/', async (req, res) => {
    try {
        const pet = await createPet(req.body);
        res.status(201).json(pet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.get('/', async (req, res) => {
    try {
        // You might pass req.query.ownerId here if you want to filter by owner from the URL
        const pets = await getAllPets(req.query.ownerId);
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const pet = await getPetById(req.params.id);
        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const updatedPet = await updatePet(req.params.id, req.body);
        if (!updatedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json(updatedPet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedPet = await deletePet(req.params.id);
        if (!deletedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }
        res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
