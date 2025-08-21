/**
 * This module provides CRUD (Create, Read, Update, Delete) operations for managing testimonials in a Node.js application.
 * 
 * - Imports the Testimonial model for database interactions.
 * - Exports functions to:
 *   - Create a new testimonial (createTestimonial)
 *   - Retrieve all testimonials with optional filters (getAllTestimonials)
 *   - Retrieve a single testimonial by its ID (getTestimonialById)
 *   - Update an existing testimonial by ID (updateTestimonial)
 *   - Delete a testimonial by ID (deleteTestimonial)
 * - Each function handles errors and throws descriptive messages on failure.
 */

const Testimonial = require('../models/testimonial');

// Create a new testimonial
const createTestimonial = async (testimonialData) => {
    try {
        const newTestimonial = await Testimonial.create(testimonialData);
        return newTestimonial;
    } catch (error) {
        throw new Error('Failed to create testimonial: ' + error.message);
    }
};

// Get all testimonials, with optional filters
const getAllTestimonials = async (filters = {}) => {
    try {
        return await Testimonial.find(filters).sort({ createdAt: -1 });
    } catch (error) {
        throw new Error('Failed to retrieve testimonials: ' + error.message);
    }
};

// Get a single testimonial by ID
const getTestimonialById = async (testimonialId) => {
    try {
        return await Testimonial.findById(testimonialId);
    } catch (error) {
        throw new Error('Failed to retrieve testimonial: ' + error.message);
    }
};

// Update a testimonial
const updateTestimonial = async (testimonialId, updateData) => {
    try {
        return await Testimonial.findByIdAndUpdate(
            testimonialId,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw new Error('Failed to update testimonial: ' + error.message);
    }
};

// Delete a testimonial
const deleteTestimonial = async (testimonialId) => {
    try {
        return await Testimonial.findByIdAndDelete(testimonialId);
    } catch (error) {
        throw new Error('Failed to delete testimonial: ' + error.message);
    }
};

module.exports = {
    createTestimonial,
    getAllTestimonials,
    getTestimonialById,
    updateTestimonial,
    deleteTestimonial
};
