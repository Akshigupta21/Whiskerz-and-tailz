const ServiceBooking = require('../models/serviceBooking');

// Create a new service booking
const createServiceBooking = async (bookingData) => {
    try {
        return await ServiceBooking.create(bookingData);
    } catch (error) {
        throw new Error('Failed to create service booking: ' + error.message);
    }
};

// Get all service bookings (with optional filters)
const getAllServiceBookings = async (filters = {}) => {
    try {
        return await ServiceBooking.find(filters)
            .populate('userId', 'fullName email')
            .populate('serviceId', 'name category');
    } catch (error) {
        throw new Error('Failed to retrieve service bookings: ' + error.message);
    }
};

// Get a single service booking by ID
const getServiceBookingById = async (bookingId) => {
    try {
        return await ServiceBooking.findById(bookingId)
            .populate('userId', 'fullName email')
            .populate('serviceId', 'name category');
    } catch (error) {
        throw new Error('Failed to retrieve service booking: ' + error.message);
    }
};

// Update a service booking by ID
const updateServiceBooking = async (bookingId, updateData) => {
    try {
        return await ServiceBooking.findByIdAndUpdate(
            bookingId,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('userId', 'fullName email')
        .populate('serviceId', 'name category');
    } catch (error) {
        throw new Error('Failed to update service booking: ' + error.message);
    }
};

// Delete a service booking by ID
const deleteServiceBooking = async (bookingId) => {
    try {
        return await ServiceBooking.findByIdAndDelete(bookingId);
    } catch (error) {
        throw new Error('Failed to delete service booking: ' + error.message);
    }
};

module.exports = {
    createServiceBooking,
    getAllServiceBookings,
    getServiceBookingById,
    updateServiceBooking,
    deleteServiceBooking
};
