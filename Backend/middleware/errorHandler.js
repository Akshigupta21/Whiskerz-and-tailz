const mongoose = require('mongoose');

/**
 * Custom Error Classes
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.statusType = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // Changed from 'status' to 'statusType'
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401);
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Insufficient permissions') {
        super(message, 403);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409);
    }
}

/**
 * Handle Mongoose Cast Errors (Invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ValidationError(message);
};

/**
 * Handle Mongoose Duplicate Field Errors
 */
const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' already exists. Please use another value.`;
    return new ConflictError(message);
};

/**
 * Handle Mongoose Validation Errors
 */
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new ValidationError(message);
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => {
    return new AuthenticationError('Invalid token. Please log in again.');
};

const handleJWTExpiredError = () => {
    return new AuthenticationError('Your token has expired. Please log in again.');
};

/**
 * Handle Multer Errors (File Upload)
 */
const handleMulterError = (err) => {
    let message = 'File upload error';
    
    switch (err.code) {
        case 'LIMIT_FILE_SIZE':
            message = 'File too large. Maximum size is 5MB';
            break;
        case 'LIMIT_FILE_COUNT':
            message = 'Too many files. Maximum is 10 files';
            break;
        case 'LIMIT_UNEXPECTED_FILE':
            message = 'Unexpected file field';
            break;
        default:
            message = err.message;
    }
    
    return new ValidationError(message);
};

/**
 * Send Error Response for Development
 */
const sendErrorDev = (err, req, res) => {
    // Log error for debugging
    console.error('ERROR 💥', err);
    
    return res.status(err.statusCode).json({
        success: false,
        error: err,
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
};

/**
 * Send Error Response for Production
 */
const sendErrorProd = (err, req, res) => {
    // Log error (you might want to use a proper logging service)
    console.error('ERROR 💥', {
        message: err.message,
        statusCode: err.statusCode,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        timestamp: new Date().toISOString()
    });

    // Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Programming or other unknown error: don't leak error details
    return res.status(500).json({
        success: false,
        message: 'Something went wrong! Please try again later.'
    });
};

/**
 * Handle Async Errors (Wrapper for async functions)
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

/**
 * Global Error Handler Middleware
 */
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Handle specific error types
        if (error.name === 'CastError') error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
        if (error.name === 'MulterError') error = handleMulterError(error);

        sendErrorProd(error, req, res);
    }
};

/**
 * Handle 404 Errors
 */
const notFound = (req, res, next) => {
    const error = new NotFoundError(`Route ${req.originalUrl} not found`);
    next(error);
};

/**
 * Rate Limiting Error Handler
 */
const rateLimitHandler = (req, res) => {
    res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: req.rateLimit.resetTime
    });
};

/**
 * CORS Error Handler
 */
const corsErrorHandler = (err, req, res, next) => {
    if (err.message.includes('CORS')) {
        return res.status(403).json({
            success: false,
            message: 'CORS policy violation: Origin not allowed'
        });
    }
    next(err);
};

/**
 * Request Size Limit Error Handler
 */
const requestSizeLimitHandler = (err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Request entity too large. Maximum size is 50MB'
        });
    }
    next(err);
};

module.exports = {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    catchAsync,
    globalErrorHandler,
    notFound,
    rateLimitHandler,
    corsErrorHandler,
    requestSizeLimitHandler
};
