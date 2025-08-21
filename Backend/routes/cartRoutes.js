const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {
    createCart,
    getCartByUserIdOrSessionId,
    updateCart,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    deleteCart
} = require('../services/cartServices'); // Adjust the import path as necessary


router.post('/', async (req, res) => {
    try {
        const cart = await createCart(req.body); 
        res.status(201).json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/:identifier', async (req, res) => {
    try {
        let query = {};
        // Determine if identifier is a userId or sessionId based on context/pattern
        // For simplicity, assuming if it's a valid ObjectId, it's a userId, otherwise sessionId
        if (mongoose.Types.ObjectId.isValid(req.params.identifier)) {
            query.userId = req.params.identifier;
        } else {
            query.sessionId = req.params.identifier;
        }

        const cart = await getCartByUserIdOrSessionId(query);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCart = await updateCart(req.params.id, req.body);
        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/:id/items', async (req, res) => {
    try {
        const updatedCart = await addItemToCart(req.params.id, req.body); 
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:cartId/items/:productId', async (req, res) => {
    try {
        const updatedCart = await removeItemFromCart(req.params.cartId, req.params.productId);
        if (!updatedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id/clear', async (req, res) => {
    try {
        const clearedCart = await clearCart(req.params.id);
        if (!clearedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(clearedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedCart = await deleteCart(req.params.id);
        if (!deletedCart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
