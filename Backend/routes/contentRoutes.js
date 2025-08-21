const express = require('express');
const router = express.Router();
const {
    createStaticContent,
    getAllStaticContent,
    getStaticContentByIdOrKey,
    updateStaticContent,
    deleteStaticContent
} = require('../services/contentServices'); // Adjust the import path as necessary

router.post('/', async (req, res) => {
    try {
        const content = await createStaticContent(req.body);
        res.status(201).json(content);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const content = await getAllStaticContent(req.query); 
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:identifier', async (req, res) => {
    try {
        const content = await getStaticContentByIdOrKey(req.params.identifier);
        if (!content) {
            return res.status(404).json({ message: 'Static content not found' });
        }
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:identifier', async (req, res) => {
    try {
        const updatedContent = await updateStaticContent(req.params.identifier, req.body);
        if (!updatedContent) {
            return res.status(404).json({ message: 'Static content not found' });
        }
        res.status(200).json(updatedContent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:identifier', async (req, res) => {
    try {
        const deletedContent = await deleteStaticContent(req.params.identifier);
        if (!deletedContent) {
            return res.status(404).json({ message: 'Static content not found' });
        }
        res.status(200).json({ message: 'Static content deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
