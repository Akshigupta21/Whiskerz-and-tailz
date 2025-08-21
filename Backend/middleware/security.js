const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');

/**
 * Security Middleware Configuration
 */

// Rate Limiting
const createRateLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: message || 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                message: message || 'Too many requests from this IP, please try again later.',
                retryAfter: Math.round(windowMs / 1000)
            });
        }
    });
};

// General rate limiter
const generalLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again after 15 minutes.'
);

// Strict rate limiter for auth routes
const authLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 requests per windowMs
    'Too many authentication attempts, please try again after 15 minutes.'
);

// API rate limiter
const apiLimiter = createRateLimiter(
    1 * 60 * 1000, // 1 minute
    20, // limit each IP to 20 requests per minute
    'API rate limit exceeded, please try again in a minute.'
);

// File upload rate limiter
const uploadLimiter = createRateLimiter(
    60 * 60 * 1000, // 1 hour
    10, // limit each IP to 10 uploads per hour
    'Too many file uploads, please try again after an hour.'
);

/**
 * Security Headers using Helmet
 */
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            manifestSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
});

/**
 * Data Sanitization Middleware
 */
const dataSanitization = [
    // Prevent NoSQL injection attacks
    mongoSanitize(),
    
    // Prevent XSS attacks
    xss(),
    
    // Prevent parameter pollution
    hpp({
        whitelist: ['sort', 'fields', 'page', 'limit', 'category', 'tags', 'status']
    })
];

/**
 * Compression Middleware
 */
const compressionMiddleware = compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
});

/**
 * Request Logging Middleware
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    
    // Log request
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    
    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
        console.log(`[${new Date().toISOString()}] ${logLevel} ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - IP: ${req.ip}`);
    });
    
    next();
};

/**
 * Request ID Middleware
 */
const requestId = (req, res, next) => {
    req.id = Math.random().toString(36).substr(2, 9);
    res.setHeader('X-Request-ID', req.id);
    next();
};

/**
 * API Response Time Middleware
 */
const responseTime = (req, res, next) => {
    const start = process.hrtime();
    
    res.on('finish', () => {
        const diff = process.hrtime(start);
        const time = diff[0] * 1e3 + diff[1] * 1e-6;
        res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
    });
    
    next();
};

/**
 * Body Size Limit Middleware
 */
const bodySizeLimit = (limit = '10mb') => {
    return (req, res, next) => {
        if (req.headers['content-length'] && parseInt(req.headers['content-length']) > parseFloat(limit) * 1024 * 1024) {
            return res.status(413).json({
                success: false,
                message: `Request entity too large. Maximum size is ${limit}`
            });
        }
        next();
    };
};

/**
 * IP Whitelist Middleware (for admin routes)
 */
const ipWhitelist = (allowedIPs = []) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress;
        
        if (allowedIPs.length > 0 && !allowedIPs.includes(clientIP)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied from this IP address'
            });
        }
        
        next();
    };
};

/**
 * User Agent Validation Middleware
 */
const validateUserAgent = (req, res, next) => {
    const userAgent = req.get('User-Agent');
    
    if (!userAgent) {
        return res.status(400).json({
            success: false,
            message: 'User-Agent header is required'
        });
    }
    
    // Block known malicious user agents
    const blockedUserAgents = [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i
    ];
    
    const isBlocked = blockedUserAgents.some(pattern => pattern.test(userAgent));
    
    if (isBlocked && !userAgent.includes('Googlebot') && !userAgent.includes('Bingbot')) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }
    
    next();
};

/**
 * API Key Validation Middleware (for external API access)
 */
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKeys = process.env.VALID_API_KEYS ? process.env.VALID_API_KEYS.split(',') : [];
    
    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key is required'
        });
    }
    
    if (!validApiKeys.includes(apiKey)) {
        return res.status(401).json({
            success: false,
            message: 'Invalid API key'
        });
    }
    
    next();
};

/**
 * Content Type Validation Middleware
 */
const validateContentType = (allowedTypes = ['application/json']) => {
    return (req, res, next) => {
        if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
            const contentType = req.get('Content-Type');
            
            if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
                return res.status(400).json({
                    success: false,
                    message: `Content-Type must be one of: ${allowedTypes.join(', ')}`
                });
            }
        }
        
        next();
    };
};

module.exports = {
    // Rate limiters
    generalLimiter,
    authLimiter,
    apiLimiter,
    uploadLimiter,
    
    // Security middleware
    securityHeaders,
    dataSanitization,
    compressionMiddleware,
    
    // Logging and monitoring
    requestLogger,
    requestId,
    responseTime,
    
    // Validation middleware
    bodySizeLimit,
    ipWhitelist,
    validateUserAgent,
    validateApiKey,
    validateContentType
};
