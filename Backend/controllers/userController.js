const bcrypt = require('bcryptjs');
const User = require('../models/user');
const AuthService = require('../services/authService');
const { catchAsync } = require('../middleware/errorHandler');
const { AppError, NotFoundError, ConflictError, ValidationError } = require('../middleware/errorHandler');
const { createSendToken } = require('../middleware/auth');

/**
 * User Registration
 */
const register = catchAsync(async (req, res, next) => {
    const newUser = await AuthService.registerUser(req.body);
    
    // Send token
    createSendToken(newUser, 201, res, 'User registered successfully');
});

/**
 * User Login
 */
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    
    const user = await AuthService.loginUser(email, password);
    
    // Send token
    createSendToken(user, 200, res, 'Login successful');
});

/**
 * User Logout
 */
const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    
    res.status(200).json({ 
        success: true, 
        message: 'Logged out successfully' 
    });
};

/**
 * Get Current User Profile
 */
const getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('addresses');
    
    if (!user) {
        return next(new NotFoundError('User not found'));
    }

    res.status(200).json({
        success: true,
        data: {
            user
        }
    });
});

/**
 * Update User Profile
 */
const updateProfile = catchAsync(async (req, res, next) => {
    const { firstName, lastName, phoneNumber, dateOfBirth } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedUser) {
        return next(new NotFoundError('User not found'));
    }

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
            user: updatedUser
        }
    });
});

/**
 * Change Password
 */
const changePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    await AuthService.changePassword(req.user._id, currentPassword, newPassword);

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    });
});

/**
 * Update User Addresses
 */
const updateAddresses = catchAsync(async (req, res, next) => {
    const { addresses } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { addresses },
        {
            new: true,
            runValidators: true
        }
    );

    if (!updatedUser) {
        return next(new NotFoundError('User not found'));
    }

    res.status(200).json({
        success: true,
        message: 'Addresses updated successfully',
        data: {
            user: updatedUser
        }
    });
});

/**
 * Delete User Account (Soft Delete)
 */
const deleteAccount = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { 
            isActive: false,
            deactivatedAt: new Date()
        },
        { new: true }
    );

    if (!user) {
        return next(new NotFoundError('User not found'));
    }

    res.status(200).json({
        success: true,
        message: 'Account deactivated successfully'
    });
});

/**
 * Get All Users (Admin Only)
 */
const getAllUsers = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    // Build filter
    const filter = { isActive: true };
    if (req.query.role) {
        filter.role = req.query.role;
    }
    if (req.query.search) {
        filter.$or = [
            { firstName: { $regex: req.query.search, $options: 'i' } },
            { lastName: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ];
    }

    const users = await User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-password');

    const total = await User.countDocuments(filter);

    res.status(200).json({
        success: true,
        data: {
            users,
            pagination: {
                current: page,
                pages: Math.ceil(total / limit),
                total,
                limit
            }
        }
    });
});

/**
 * Get User by ID (Admin Only)
 */
const getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
        return next(new NotFoundError('User not found'));
    }

    res.status(200).json({
        success: true,
        data: {
            user
        }
    });
});

/**
 * Update User (Admin Only)
 */
const updateUser = catchAsync(async (req, res, next) => {
    const { role, isActive, isEmailVerified } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            role,
            isActive,
            isEmailVerified
        },
        {
            new: true,
            runValidators: true
        }
    ).select('-password');

    if (!updatedUser) {
        return next(new NotFoundError('User not found'));
    }

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
            user: updatedUser
        }
    });
});

/**
 * Delete User (Admin Only - Hard Delete)
 */
const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
        return next(new NotFoundError('User not found'));
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    });
});

/**
 * User Statistics (Admin Only)
 */
const getUserStats = catchAsync(async (req, res, next) => {
    const stats = await User.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: {
                    $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                },
                verifiedUsers: {
                    $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] }
                },
                adminUsers: {
                    $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
                },
                regularUsers: {
                    $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] }
                }
            }
        }
    ]);

    const monthlyStats = await User.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
                }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ]);

    res.status(200).json({
        success: true,
        data: {
            overview: stats[0] || {
                totalUsers: 0,
                activeUsers: 0,
                verifiedUsers: 0,
                adminUsers: 0,
                regularUsers: 0
            },
            monthlyRegistrations: monthlyStats
        }
    });
});

module.exports = {
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
};
