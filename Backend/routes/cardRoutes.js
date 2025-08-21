const express = require('express');
const router = express.Router();
const {
    createPaymentMethod,
    getPaymentMethodsByUserId,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod
} = require('../services/cardServices'); // Adjust the import path as necessary

router.post('/', async (req, res) => {
    try {
        const paymentMethod = await createPaymentMethod(req.body);
        res.status(201).json(paymentMethod);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        // In a real app, ensure req.params.userId matches the authenticated user's ID
        const paymentMethods = await getPaymentMethodsByUserId(req.params.userId);
        res.status(200).json(paymentMethods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const paymentMethod = await getPaymentMethodById(req.params.id);
        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        res.status(200).json(paymentMethod);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedPaymentMethod = await updatePaymentMethod(req.params.id, req.body);
        if (!updatedPaymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        res.status(200).json(updatedPaymentMethod);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedPaymentMethod = await deletePaymentMethod(req.params.id);
        if (!deletedPaymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }
        res.status(200).json({ message: 'Payment method deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
