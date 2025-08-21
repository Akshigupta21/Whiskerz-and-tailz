const Cart = require('../models/cart');

// Create a new cart
const createCart = async (cartData) => {
    try {
        return await Cart.create(cartData);
    } catch (err) {
        if (err.code === 11000) throw new Error('Cart already exists.');
        throw new Error('Create failed: ' + err.message);
    }
};

// Get cart by userId or sessionId
const getCartByUserIdOrSessionId = async (query) => {
    try {
        return await Cart.findOne(query)
            .populate('userId', 'fullName email')
            .populate('items.productId', 'name price images');
    } catch (err) {
        throw new Error('Fetch failed: ' + err.message);
    }
};

// Update cart (fields or items)
const updateCart = async (cartId, updateData) => {
    try {
        updateData.lastAccessed = new Date();
        return await Cart.findByIdAndUpdate(
            cartId,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate('userId', 'fullName email')
            .populate('items.productId', 'name price images');
    } catch (err) {
        throw new Error('Update failed: ' + err.message);
    }
};

// Add or update item in cart
const addItemToCart = async (cartId, itemData) => {
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Cart not found.');

        const idx = cart.items.findIndex(
            item => item.productId.toString() === itemData.productId.toString()
        );
        if (idx > -1) {
            cart.items[idx].quantity += itemData.quantity;
        } else {
            cart.items.push({ ...itemData, addedAt: new Date() });
        }
        cart.lastAccessed = new Date();
        await cart.save();
        return cart.populate('items.productId', 'name price images');
    } catch (err) {
        throw new Error('Add item failed: ' + err.message);
    }
};

// Remove item from cart
const removeItemFromCart = async (cartId, productId) => {
    try {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Cart not found.');

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId.toString()
        );
        cart.lastAccessed = new Date();
        await cart.save();
        return cart.populate('items.productId', 'name price images');
    } catch (err) {
        throw new Error('Remove item failed: ' + err.message);
    }
};

// Clear all items from cart
const clearCart = async (cartId) => {
    try {
        return await Cart.findByIdAndUpdate(
            cartId,
            { $set: { items: [], lastAccessed: new Date() } },
            { new: true }
        ).populate('items.productId', 'name price images');
    } catch (err) {
        throw new Error('Clear cart failed: ' + err.message);
    }
};

// Delete cart
const deleteCart = async (cartId) => {
    try {
        return await Cart.findByIdAndDelete(cartId);
    } catch (err) {
        throw new Error('Delete failed: ' + err.message);
    }
};

module.exports = {
    createCart,
    getCartByUserIdOrSessionId,
    updateCart,
    addItemToCart,
    removeItemFromCart,
    clearCart,
    deleteCart
};
