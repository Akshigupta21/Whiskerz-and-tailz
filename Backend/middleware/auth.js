const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user');
const AuthService = require('../services/authService');
const { AppError, AuthenticationError, AuthorizationError } = require('./errorHandler');
const { catchAsync } = require('./errorHandler');

/**
 * JWT Token Generation
 */
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
        issuer: 'pet-lover-backend',
        audience: 'pet-lover-frontend'
    });
};

/**
 * Generate and send JWT token with cookie
 */
const createSendToken = (user, statusCode, res, message = 'Success') => {
    const token = signToken(user._id);
    
    const cookieOptions = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        message,
        token,
        data: {
            user
        }
    });
};

/**
 * Verify JWT Token
 */
const verifyToken = async (token) => {
    try {
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            throw new AuthenticationError('Invalid token. Please log in again.');
        }
        if (error.name === 'TokenExpiredError') {
            throw new AuthenticationError('Your token has expired. Please log in again.');
        }
        throw new AuthenticationError('Token verification failed.');
    }
};

/**
 * Extract token from request
 */
const extractToken = (req) => {
    let token;
    
    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies
    else if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // Check query parameter (for specific use cases)
    else if (req.query && req.query.token) {
        token = req.query.token;
    }
    
    return token;
};

/**
 * Authentication Middleware
 * Verifies if user is logged in
 */
const authenticate = catchAsync(async (req, res, next) => {
    // 1) Get token from request
    const token = extractToken(req);
    
    if (!token) {
        return next(new AuthenticationError('You are not logged in! Please log in to get access.'));
    }

    // 2) Verify token
    const decoded = await verifyToken(token);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id).select('+isActive');
    if (!currentUser) {
        return next(new AuthenticationError('The user belonging to this token does no longer exist.'));
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
        return next(new AuthenticationError('Your account has been deactivated. Please contact support.'));
    }

    // 5) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AuthenticationError('User recently changed password! Please log in again.'));
    }

    // 6) Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});

/**
 * Optional Authentication Middleware
 * Sets user if token is valid, but doesn't require login
 */
const optionalAuth = catchAsync(async (req, res, next) => {
    const token = extractToken(req);
    
    if (token) {
        try {
            const decoded = await verifyToken(token);
            const currentUser = await User.findById(decoded.id).select('+isActive');
            
            if (currentUser && currentUser.isActive) {
                req.user = currentUser;
                res.locals.user = currentUser;
            }
        } catch (error) {
            // Token is invalid, but that's okay for optional auth
            console.log('Optional auth failed:', error.message);
        }
    }
    
    next();
});

/**
 * Authorization Middleware
 * Restricts access to specific roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AuthenticationError('You must be logged in to access this resource.'));
        }
        
        if (!roles.includes(req.user.role)) {
            return next(new AuthorizationError('You do not have permission to perform this action.'));
        }
        
        next();
    };
};

/**
 * Resource Owner Authorization
 * Allows access only to resource owner or admin
 */
const authorizeOwnerOrAdmin = (resourceUserField = 'user') => {
    return catchAsync(async (req, res, next) => {
        if (!req.user) {
            return next(new AuthenticationError('You must be logged in to access this resource.'));
        }
        
        // Admin can access everything
        if (req.user.role === 'admin') {
            return next();
        }
        
        // Check if user owns the resource
        const resourceId = req.params.id;
        if (!resourceId) {
            return next(new AppError('Resource ID is required', 400));
        }
        
        // This is a generic check - you might need to customize based on your models
        const Model = getModelFromRoute(req.route.path);
        if (!Model) {
            return next(new AppError('Unable to determine resource model', 500));
        }
        
        const resource = await Model.findById(resourceId);
        if (!resource) {
            return next(new AppError('Resource not found', 404));
        }
        
        if (resource[resourceUserField].toString() !== req.user._id.toString()) {
            return next(new AuthorizationError('You can only access your own resources.'));
        }
        
        next();
    });
};

/**
 * API Key Authentication (for external services)
 */
const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKeys = process.env.VALID_API_KEYS ? process.env.VALID_API_KEYS.split(',') : [];
    
    if (!apiKey) {
        return next(new AuthenticationError('API key is required'));
    }
    
    if (!validApiKeys.includes(apiKey)) {
        return next(new AuthenticationError('Invalid API key'));
    }
    
    // Set a special user object for API access
    req.user = {
        _id: 'api-access',
        role: 'api',
        email: 'api@wiskerzandtail.com'
    };
    
    next();
};

/**
 * Session-based authentication check
 */
const checkSession = catchAsync(async (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return next(new AuthenticationError('No active session found'));
    }
    
    const user = await User.findById(req.session.userId);
    if (!user || !user.isActive) {
        req.session.destroy();
        return next(new AuthenticationError('Invalid session'));
    }
    
    req.user = user;
    next();
});

/**
 * Two-Factor Authentication Check
 */
const requireTwoFactor = (req, res, next) => {
    if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
    }
    
    if (req.user.twoFactorEnabled && !req.user.twoFactorVerified) {
        return next(new AuthenticationError('Two-factor authentication required'));
    }
    
    next();
};

/**
 * Account Verification Check
 */
const requireVerification = (req, res, next) => {
    if (!req.user) {
        return next(new AuthenticationError('Authentication required'));
    }
    
    if (!req.user.isEmailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Please verify your email address to access this resource',
            code: 'EMAIL_VERIFICATION_REQUIRED'
        });
    }
    
    next();
};

/**
 * Rate limiting by user
 */
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    const userRequests = new Map();
    
    return (req, res, next) => {
        if (!req.user) {
            return next();
        }
        
        const userId = req.user._id.toString();
        const now = Date.now();
        const userRecord = userRequests.get(userId) || { count: 0, resetTime: now + windowMs };
        
        if (now > userRecord.resetTime) {
            userRecord.count = 1;
            userRecord.resetTime = now + windowMs;
        } else {
            userRecord.count++;
        }
        
        userRequests.set(userId, userRecord);
        
        if (userRecord.count > maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Rate limit exceeded for this user',
                retryAfter: Math.round((userRecord.resetTime - now) / 1000)
            });
        }
        
        next();
    };
};

/**
 * Helper function to get model from route (customize as needed)
 */
const getModelFromRoute = (routePath) => {
    // This is a simple mapping - you might need to customize this
    const routeModelMap = {
        '/pets': require('../models/pet'),
        '/products': require('../models/product'),
        '/orders': require('../models/orders'),
        '/bookings': require('../models/serviceBooking'),
        '/blog': require('../models/blogPost')
    };
    
    for (const [route, model] of Object.entries(routeModelMap)) {
        if (routePath.includes(route)) {
            return model;
        }
    }
    
    return null;
};

module.exports = {
    signToken,
    createSendToken,
    verifyToken,
    extractToken,
    authenticate,
    optionalAuth,
    authorize,
    authorizeOwnerOrAdmin,
    authenticateApiKey,
    checkSession,
    requireTwoFactor,
    requireVerification,
    userRateLimit
};
