const express = require('express');
const router = express.Router();
const {
    createServiceBooking,
    getAllServiceBookings,
    getServiceBookingById,
    updateServiceBooking,
    deleteServiceBooking
} = require('../services/bookingServices'); // Adjust the import path as necessary

router.post('/', async (req, res) => {
    try {
        const booking = await createServiceBooking(req.body);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const bookings = await getAllServiceBookings(req.query); 
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const booking = await getServiceBookingById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Service booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBooking = await updateServiceBooking(req.params.id, req.body);
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Service booking not found' });
        }
        res.status(200).json(updatedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedBooking = await deleteServiceBooking(req.params.id);
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Service booking not found' });
        }
        res.status(200).json({ message: 'Service booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
