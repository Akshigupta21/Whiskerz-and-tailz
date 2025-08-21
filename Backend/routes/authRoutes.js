const express = require('express');
const router = express.Router();

// Import controllers
const {
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/userController');

// Import middleware
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { userValidation } = require('../middleware/validation');
const { authLimiter, generalLimiter } = require('../middleware/security');

// Use the pre-configured auth limiter from security middleware
// authLimiter is already configured for 5 requests per 15 minutes

// Create a stricter limiter for sensitive operations like password reset
const rateLimit = require('express-rate-limit');
const strictAuthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // limit each IP to 3 requests per windowMs for sensitive operations
    message: {
        success: false,
        message: 'Too many attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many attempts, please try again later.',
            retryAfter: Math.round(15 * 60) // 15 minutes in seconds
        });
    }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { email, password, firstName, lastName, phoneNumber, userType }
 */
router.post('/register', 
    authLimiter,
    userValidation.register,
    register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', 
    authLimiter,
    userValidation.login,
    login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PATCH /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 * @body    { firstName, lastName, phoneNumber, dateOfBirth }
 */
router.patch('/profile', 
    authenticate,
    userValidation.updateProfile,
    updateProfile
);

/**
 * @route   PATCH /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 * @body    { currentPassword, newPassword }
 */
router.patch('/change-password', 
    authenticate,
    strictAuthLimiter,
    userValidation.changePassword,
    changePassword
);

// TODO: Implement these routes in userController
/*
/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 * @body    { email }
 *//*
router.post('/forgot-password', 
    strictAuthLimiter,
    forgotPassword
);

/**
 * @route   PATCH /api/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 * @body    { password }
 *//*
router.patch('/reset-password/:token', 
    strictAuthLimiter,
    resetPassword
);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 *//*
router.get('/verify-email/:token', verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 *//*
router.post('/resend-verification', 
    authenticate,
    authLimiter,
    resendVerification
);
*/

/**
 * @route   GET /api/auth/check
 * @desc    Check if user is authenticated
 * @access  Public (but requires token)
 */
router.get('/check', optionalAuth, (req, res) => {
    if (req.user) {
        res.status(200).json({
            success: true,
            isAuthenticated: true,
            user: {
                id: req.user._id,
                email: req.user.email,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                fullName: req.user.fullName,
                userType: req.user.userType,
                role: req.user.role,
                isActive: req.user.isActive,
                isVerified: req.user.isVerified
            }
        });
    } else {
        res.status(401).json({
            success: false,
            isAuthenticated: false,
            message: 'Not authenticated'
        });
    }
});

/**
 * @route   GET /api/auth/session
 * @desc    Get current session info
 * @access  Private
 */
router.get('/session', authenticate, (req, res) => {
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            fullName: req.user.fullName,
            userType: req.user.userType,
            role: req.user.role,
            isActive: req.user.isActive,
            isVerified: req.user.isVerified,
            lastLogin: req.user.lastLogin,
            createdAt: req.user.createdAt
        },
        sessionInfo: {
            loginTime: req.user.lastLogin,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip
        }
    });
});

module.exports = router;
