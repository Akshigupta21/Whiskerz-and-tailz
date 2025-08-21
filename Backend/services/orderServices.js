const Order = require('../models/orders');

// Create a new order
const createOrder = async (orderData) => {
    try {
        const newOrder = await Order.create(orderData);
        return newOrder;
    } catch (error) {
        throw new Error('Failed to create order: ' + error.message);
    }
};

// Get all orders
const getAllOrders = async () => {
    try {
        return await Order.find();
    } catch (error) {
        throw new Error('Failed to fetch orders: ' + error.message);
    }
};

// Get an order by ID
const getOrderById = async (orderId) => {
    try {
        return await Order.findById(orderId);
    } catch (error) {
        throw new Error('Failed to fetch order: ' + error.message);
    }
};

// Update an order by ID
const updateOrder = async (orderId, updateData) => {
    try {
        return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
    } catch (error) {
        throw new Error('Failed to update order: ' + error.message);
    }
};

// Delete an order by ID
const deleteOrder = async (orderId) => {
    try {
        return await Order.findByIdAndDelete(orderId);
    } catch (error) {
        throw new Error('Failed to delete order: ' + error.message);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
};
