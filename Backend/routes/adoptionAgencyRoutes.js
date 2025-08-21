const express = require('express');
const router = express.Router();
const {
    createAgency,
    getAllAgencies,
    getAgencyById,
    updateAgency,
    deleteAgency
} = require('../services/adoptionAgencyServices'); 

router.post('/', async (req, res) => {
    try {
        const agency = await createAgency(req.body);
        res.status(201).json(agency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const agencies = await getAllAgencies();
        res.status(200).json(agencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const agency = await getAgencyById(req.params.id);
        if (!agency) {
            return res.status(404).json({ message: 'Adoption agency not found' });
        }
        res.status(200).json(agency);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedAgency = await updateAgency(req.params.id, req.body);
        if (!updatedAgency) {
            return res.status(404).json({ message: 'Adoption agency not found' });
        }
        res.status(200).json(updatedAgency);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedAgency = await deleteAgency(req.params.id);
        if (!deletedAgency) {
            return res.status(404).json({ message: 'Adoption agency not found' });
        }
        res.status(200).json({ message: 'Adoption agency deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
