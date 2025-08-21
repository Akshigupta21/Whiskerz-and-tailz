const PaymentMethod = require('../models/creditcard');

// Create a new payment method
const createPaymentMethod = async (paymentMethodData) => {
    try {
        return await PaymentMethod.create(paymentMethodData);
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Payment method with this gateway customer ID already exists.');
        }
        throw new Error('Failed to create payment method: ' + error.message);
    }
};

// Get all payment methods for a user
const getPaymentMethodsByUserId = async (userId) => {
    try {
        return await PaymentMethod.find({ userId }).sort({ isDefault: -1, createdAt: 1 });
    } catch (error) {
        throw new Error('Failed to retrieve payment methods: ' + error.message);
    }
};

// Get a payment method by ID
const getPaymentMethodById = async (paymentMethodId) => {
    try {
        return await PaymentMethod.findById(paymentMethodId);
    } catch (error) {
        throw new Error('Failed to retrieve payment method: ' + error.message);
    }
};

// Update a payment method
const updatePaymentMethod = async (paymentMethodId, updateData) => {
    try {
        return await PaymentMethod.findByIdAndUpdate(
            paymentMethodId,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw new Error('Failed to update payment method: ' + error.message);
    }
};

// Delete a payment method
const deletePaymentMethod = async (paymentMethodId) => {
    try {
        return await PaymentMethod.findByIdAndDelete(paymentMethodId);
    } catch (error) {
        throw new Error('Failed to delete payment method: ' + error.message);
    }
};

module.exports = {
    createPaymentMethod,
    getPaymentMethodsByUserId,
    getPaymentMethodById,
    updatePaymentMethod,
    deletePaymentMethod
};
