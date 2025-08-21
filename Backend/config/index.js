const path = require('path');

/**
 * Application Configuration
 */
const config = {
    // Environment
    env: process.env.NODE_ENV || 'development',
    
    // Server
    server: {
        port: parseInt(process.env.PORT) || 3001,
        host: process.env.HOST || 'localhost'
    },
    
    // Database
    database: {
        uri: process.env.DATABASE_URI || 'mongodb://localhost:27017/wiskerzandtail',
        name: process.env.DATABASE_NAME || 'wiskerzandtail',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferMaxEntries: 0
        }
    },
    
    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
        cookieExpiresIn: parseInt(process.env.JWT_COOKIE_EXPIRES_IN) || 90
    },
    
    // Session
    session: {
        secret: process.env.SESSION_SECRET || 'fallback-session-secret',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    
    // Email
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        from: process.env.EMAIL_FROM || 'noreply@wiskerzandtail.com'
    },
    
    // File Upload
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        uploadPath: process.env.UPLOAD_PATH || 'uploads/',
        tempPath: path.join(__dirname, '../temp/')
    },
    
    // Security
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
        maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
        lockoutTime: parseInt(process.env.LOCKOUT_TIME) || 30 * 60 * 1000, // 30 minutes
        apiKeys: process.env.VALID_API_KEYS ? process.env.VALID_API_KEYS.split(',') : []
    },
    
    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [
            'http://localhost:3000',
            'http://127.0.0.1:3000'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'X-API-Key',
            'X-Request-ID'
        ]
    },
    
    // Rate Limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
        authMaxRequests: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 5
    },
    
    // Logging
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || 'logs/app.log',
        enableConsole: process.env.NODE_ENV === 'development'
    },
    
    // Cache
    cache: {
        redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
        ttl: parseInt(process.env.CACHE_TTL) || 3600 // 1 hour
    },
    
    // External APIs
    apis: {
        stripe: {
            secretKey: process.env.STRIPE_SECRET_KEY,
            webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
        },
        weather: {
            apiKey: process.env.WEATHER_API_KEY
        },
        maps: {
            apiKey: process.env.MAPS_API_KEY
        }
    },
    
    // Feature Flags
    features: {
        emailVerification: process.env.ENABLE_EMAIL_VERIFICATION === 'true',
        twoFactorAuth: process.env.ENABLE_TWO_FACTOR_AUTH === 'true',
        fileUploads: process.env.ENABLE_FILE_UPLOADS !== 'false',
        analytics: process.env.ENABLE_ANALYTICS === 'true'
    },
    
    // Admin
    admin: {
        email: process.env.ADMIN_EMAIL || 'admin@wiskerzandtail.com',
        password: process.env.ADMIN_PASSWORD || 'admin123456'
    },
    
    // Health Check
    healthCheck: {
        interval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000 // 30 seconds
    },
    
    // Pagination
    pagination: {
        defaultLimit: 10,
        maxLimit: 100
    },
    
    // Business Logic
    business: {
        maxPetsPerUser: 10,
        maxOrderItems: 50,
        defaultCurrency: 'USD',
        taxRate: 0.08, // 8%
        shippingCost: 9.99
    }
};

/**
 * Validate required configuration
 */
const validateConfig = () => {
    const required = [
        'JWT_SECRET',
        'DATABASE_URI'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0 && config.env === 'production') {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        process.exit(1);
    }
    
    if (missing.length > 0) {
        console.warn('⚠️  Missing environment variables (using defaults):', missing.join(', '));
    }
};

// Validate configuration on startup
validateConfig();

module.exports = config;
