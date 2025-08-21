const express = require('express');
const router = express.Router();

// Import controllers
const {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    updateAddresses,
    deleteAccount,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserStats
} = require('../controllers/userController');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');

// Public routes
router.post('/register', userValidation.register, register);
router.post('/login', userValidation.login, login);
router.post('/logout', logout);

// Protected routes (authentication required)
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, userValidation.updateProfile, updateProfile);
router.patch('/change-password', authenticate, userValidation.changePassword, changePassword);
router.patch('/addresses', authenticate, updateAddresses);
router.delete('/account', authenticate, deleteAccount);

// Admin routes (admin access required)
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/stats', authenticate, authorize('admin'), getUserStats);
router.get('/:id', authenticate, authorize('admin'), getUserById);
router.patch('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;
