const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Centralized validation error handler
 * Formats validation errors and returns standardized response
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.path,
            message: error.msg,
            value: error.value
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors
        });
    }
    next();
};

/**
 * Custom validators
 */
const customValidators = {
    // MongoDB ObjectId validator
    isValidObjectId: (value) => {
        return mongoose.Types.ObjectId.isValid(value);
    },
    
    // Strong password validator
    isStrongPassword: (value) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(value);
    },
    
    // Phone number validator (supports multiple formats)
    isValidPhoneNumber: (value) => {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    },
    
    // URL validator
    isValidURL: (value) => {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    },
    
    // Price validator (positive number with max 2 decimal places)
    isValidPrice: (value) => {
        return /^\d+(\.\d{1,2})?$/.test(value) && parseFloat(value) >= 0;
    },
    
    // Date validator (future date)
    isFutureDate: (value) => {
        return new Date(value) > new Date();
    },
    
    // Image file validator
    isValidImageFile: (value) => {
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const extension = value.split('.').pop().toLowerCase();
        return validExtensions.includes(extension);
    }
};

/**
 * User validation rules
 */
const userValidation = {
    register: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .custom(customValidators.isStrongPassword)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        body('firstName')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('First name can only contain letters and spaces'),
        body('lastName')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters')
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage('Last name can only contain letters and spaces'),
        body('phoneNumber')
            .optional()
            .custom(customValidators.isValidPhoneNumber)
            .withMessage('Please provide a valid phone number'),
        body('dateOfBirth')
            .optional()
            .isISO8601()
            .withMessage('Please provide a valid date of birth')
            .custom((value) => {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 13 && age <= 120;
            })
            .withMessage('Age must be between 13 and 120 years'),
        body('userType')
            .optional()
            .isIn(['Customer', 'Business', 'Agency', 'Admin/Staff'])
            .withMessage('User type must be Customer, Business, Agency, or Admin/Staff'),
        handleValidationErrors
    ],
    
    login: [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),
        body('password')
            .notEmpty()
            .withMessage('Password is required'),
        handleValidationErrors
    ],
    
    updateProfile: [
        body('firstName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('First name must be between 2 and 50 characters'),
        body('lastName')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Last name must be between 2 and 50 characters'),
        body('phoneNumber')
            .optional()
            .custom(customValidators.isValidPhoneNumber)
            .withMessage('Please provide a valid phone number'),
        body('dateOfBirth')
            .optional()
            .isISO8601()
            .withMessage('Please provide a valid date of birth'),
        handleValidationErrors
    ],
    
    changePassword: [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 8 })
            .withMessage('New password must be at least 8 characters long')
            .custom(customValidators.isStrongPassword)
            .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        body('confirmPassword')
            .custom((value, { req }) => {
                if (value !== req.body.newPassword) {
                    throw new Error('Password confirmation does not match new password');
                }
                return true;
            }),
        handleValidationErrors
    ]
};

/**
 * Pet validation rules
 */
const petValidation = {
    create: [
        body('name')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Pet name must be between 2 and 50 characters'),
        body('species')
            .trim()
            .isLength({ min: 2, max: 30 })
            .withMessage('Species must be between 2 and 30 characters'),
        body('breed')
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Breed must be between 2 and 50 characters'),
        body('age')
            .isInt({ min: 0, max: 50 })
            .withMessage('Age must be between 0 and 50 years'),
        body('weight')
            .isFloat({ min: 0.1, max: 500 })
            .withMessage('Weight must be between 0.1 and 500 kg'),
        body('gender')
            .isIn(['male', 'female', 'unknown'])
            .withMessage('Gender must be male, female, or unknown'),
        body('description')
            .optional()
            .isLength({ max: 1000 })
            .withMessage('Description cannot exceed 1000 characters'),
        body('adoptionFee')
            .optional()
            .custom(customValidators.isValidPrice)
            .withMessage('Please provide a valid adoption fee'),
        body('isAvailable')
            .optional()
            .isBoolean()
            .withMessage('Availability must be a boolean value'),
        handleValidationErrors
    ],
    
    update: [
        param('id')
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid pet ID'),
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 })
            .withMessage('Pet name must be between 2 and 50 characters'),
        body('age')
            .optional()
            .isInt({ min: 0, max: 50 })
            .withMessage('Age must be between 0 and 50 years'),
        body('weight')
            .optional()
            .isFloat({ min: 0.1, max: 500 })
            .withMessage('Weight must be between 0.1 and 500 kg'),
        handleValidationErrors
    ]
};

/**
 * Product validation rules
 */
const productValidation = {
    create: [
        body('name')
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('Product name must be between 3 and 100 characters'),
        body('description')
            .trim()
            .isLength({ min: 10, max: 2000 })
            .withMessage('Description must be between 10 and 2000 characters'),
        body('price')
            .custom(customValidators.isValidPrice)
            .withMessage('Please provide a valid price'),
        body('category')
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid category ID'),
        body('brand')
            .optional()
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid brand ID'),
        body('stockQuantity')
            .isInt({ min: 0 })
            .withMessage('Stock quantity must be a non-negative integer'),
        body('weight')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Weight must be a positive number'),
        body('dimensions.length')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Length must be a positive number'),
        body('dimensions.width')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Width must be a positive number'),
        body('dimensions.height')
            .optional()
            .isFloat({ min: 0 })
            .withMessage('Height must be a positive number'),
        handleValidationErrors
    ],
    
    update: [
        param('id')
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid product ID'),
        body('name')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('Product name must be between 3 and 100 characters'),
        body('price')
            .optional()
            .custom(customValidators.isValidPrice)
            .withMessage('Please provide a valid price'),
        handleValidationErrors
    ]
};

/**
 * Order validation rules
 */
const orderValidation = {
    create: [
        body('items')
            .isArray({ min: 1 })
            .withMessage('Order must contain at least one item'),
        body('items.*.productId')
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid product ID'),
        body('items.*.quantity')
            .isInt({ min: 1 })
            .withMessage('Quantity must be at least 1'),
        body('shippingAddress.street')
            .trim()
            .notEmpty()
            .withMessage('Street address is required'),
        body('shippingAddress.city')
            .trim()
            .notEmpty()
            .withMessage('City is required'),
        body('shippingAddress.state')
            .trim()
            .notEmpty()
            .withMessage('State is required'),
        body('shippingAddress.zipCode')
            .trim()
            .matches(/^\d{5}(-\d{4})?$/)
            .withMessage('Please provide a valid ZIP code'),
        body('paymentMethod')
            .isIn(['credit_card', 'debit_card', 'paypal', 'stripe'])
            .withMessage('Invalid payment method'),
        handleValidationErrors
    ]
};

/**
 * Service booking validation rules
 */
const bookingValidation = {
    create: [
        body('serviceId')
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid service ID'),
        body('petId')
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid pet ID'),
        body('appointmentDate')
            .isISO8601()
            .withMessage('Please provide a valid appointment date')
            .custom(customValidators.isFutureDate)
            .withMessage('Appointment date must be in the future'),
        body('timeSlot')
            .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
            .withMessage('Please provide a valid time slot (HH:MM format)'),
        body('notes')
            .optional()
            .isLength({ max: 500 })
            .withMessage('Notes cannot exceed 500 characters'),
        handleValidationErrors
    ]
};

/**
 * Blog validation rules
 */
const blogValidation = {
    create: [
        body('title')
            .trim()
            .isLength({ min: 5, max: 200 })
            .withMessage('Title must be between 5 and 200 characters'),
        body('content')
            .trim()
            .isLength({ min: 50, max: 10000 })
            .withMessage('Content must be between 50 and 10000 characters'),
        body('excerpt')
            .optional()
            .trim()
            .isLength({ max: 300 })
            .withMessage('Excerpt cannot exceed 300 characters'),
        body('categoryId')
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid category ID'),
        body('tags')
            .optional()
            .isArray()
            .withMessage('Tags must be an array'),
        body('tags.*')
            .optional()
            .trim()
            .isLength({ min: 2, max: 30 })
            .withMessage('Each tag must be between 2 and 30 characters'),
        handleValidationErrors
    ]
};

/**
 * Common parameter validations
 */
const paramValidation = {
    objectId: [
        param('id')
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid ID format'),
        handleValidationErrors
    ]
};

/**
 * Query parameter validations
 */
const queryValidation = {
    pagination: [
        query('page')
            .optional()
            .isInt({ min: 1 })
            .withMessage('Page must be a positive integer'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Limit must be between 1 and 100'),
        query('sort')
            .optional()
            .isIn(['createdAt', '-createdAt', 'name', '-name', 'price', '-price'])
            .withMessage('Invalid sort parameter'),
        handleValidationErrors
    ],
    
    search: [
        query('q')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Search query must be between 2 and 100 characters'),
        query('category')
            .optional()
            .custom(customValidators.isValidObjectId)
            .withMessage('Invalid category ID'),
        handleValidationErrors
    ]
};

/**
 * File upload validation
 */
const fileValidation = {
    image: (req, res, next) => {
        if (!req.file && !req.files) {
            return next();
        }
        
        const files = req.files || [req.file];
        const errors = [];
        
        files.forEach((file, index) => {
            // Check file type
            if (!file.mimetype.startsWith('image/')) {
                errors.push(`File ${index + 1}: Only image files are allowed`);
            }
            
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                errors.push(`File ${index + 1}: File size cannot exceed 5MB`);
            }
            
            // Check file extension
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                errors.push(`File ${index + 1}: Invalid file extension. Allowed: ${allowedExtensions.join(', ')}`);
            }
        });
        
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'File validation failed',
                errors: errors
            });
        }
        
        next();
    }
};

module.exports = {
    handleValidationErrors,
    customValidators,
    userValidation,
    petValidation,
    productValidation,
    orderValidation,
    bookingValidation,
    blogValidation,
    paramValidation,
    queryValidation,
    fileValidation
};
