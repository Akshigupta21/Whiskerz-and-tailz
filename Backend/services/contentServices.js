const mongoose = require('mongoose');
const StaticContent = require('../models/staticContent');

// Create new static content
const createStaticContent = async (data) => {
    try {
        return await StaticContent.create(data);
    } catch (err) {
        if (err.code === 11000) throw new Error('Duplicate key.');
        throw new Error('Create failed: ' + err.message);
    }
};

// Get all static content (with optional filters)
const getAllStaticContent = async (filters = {}) => {
    try {
        return await StaticContent.find(filters).sort({ order: 1, createdAt: 1 });
    } catch (err) {
        throw new Error('Fetch failed: ' + err.message);
    }
};

// Get static content by ID or key
const getStaticContentByIdOrKey = async (idOrKey) => {
    try {
        const query = mongoose.Types.ObjectId.isValid(idOrKey)
            ? { _id: idOrKey }
            : { key: idOrKey.toLowerCase() };
        return await StaticContent.findOne(query);
    } catch (err) {
        throw new Error('Fetch failed: ' + err.message);
    }
};

// Update static content by ID or key
const updateStaticContent = async (idOrKey, updateData) => {
    try {
        const query = mongoose.Types.ObjectId.isValid(idOrKey)
            ? { _id: idOrKey }
            : { key: idOrKey.toLowerCase() };
        return await StaticContent.findOneAndUpdate(query, { $set: updateData }, { new: true, runValidators: true });
    } catch (err) {
        if (err.code === 11000) throw new Error('Duplicate key.');
        throw new Error('Update failed: ' + err.message);
    }
};

// Delete static content by ID or key
const deleteStaticContent = async (idOrKey) => {
    try {
        const query = mongoose.Types.ObjectId.isValid(idOrKey)
            ? { _id: idOrKey }
            : { key: idOrKey.toLowerCase() };
        return await StaticContent.findOneAndDelete(query);
    } catch (err) {
        throw new Error('Delete failed: ' + err.message);
    }
};

module.exports = {
    createStaticContent,
    getAllStaticContent,
    getStaticContentByIdOrKey,
    updateStaticContent,
    deleteStaticContent
};
