const express = require("express");
const connectDB = require("./database/connect");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adoptionAgencyRoutes = require("./routes/adoptionAgencyRoutes");
const brandsRoutes = require("./routes/brandsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const blogRoutes = require("./routes/blogRoutes");
const blogcategoryRoutes = require("./routes/blogCategoryRoutes");
const cardRoutes = require("./routes/cardRoutes");
const donationRoutes = require("./routes/donationRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const petRoutes = require("./routes/petRoutes");
const petTypeRoutes = require("./routes/petTypeRoutes");
const productRoutes = require("./routes/productRoutes");
const productCategoryRoutes = require("./routes/productCategoryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const serviceBookingRoutes = require("./routes/serviceBookingRoutes");
const contentRoutes = require("./routes/contentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Basic security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for now
    crossOriginEmbedderPolicy: false
}));
app.use(compression());

// CORS configuration (should be early)
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3002',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3002',
            'https://your-production-domain.com'
        ];
        
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'X-Requested-With',
        'X-API-Key',
        'X-Request-ID'
    ],
    exposedHeaders: ['X-Request-ID', 'X-Response-Time']
}));

// Basic middleware first
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Session configuration (commented out for testing without MongoDB)
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key',
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//         mongoUrl: process.env.DATABASE_URI || 'mongodb://localhost:27017/wiskerzandtail'
//     }),
//     cookie: {
//         secure: process.env.NODE_ENV === 'production',
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24 // 24 hours
//     }
// }));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true,
        status: 'OK', 
        message: 'Wiskerz & Tail Backend API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: require('./package.json').version
    });
});

// API Documentation route
app.get('/api/docs', (req, res) => {
    res.json({
        success: true,
        message: 'Pet Lover API Documentation',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            users: '/api/users',
            pets: '/api/pets',
            products: '/api/products',
            foods: '/api/foods',
            orders: '/api/orders',
            services: '/api/services',
            blog: '/api/blog-posts'
        },
        documentation: 'https://documenter.getpostman.com/view/your-docs'
    });
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/adoption-agencies", adoptionAgencyRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/blog-posts", blogRoutes);
app.use("/api/blog-categories", blogcategoryRoutes);
app.use("/api/credit-cards", cardRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/pet-types", petTypeRoutes);
app.use("/api/products", productRoutes);
app.use("/api/product-categories", productCategoryRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-bookings", serviceBookingRoutes);
app.use("/api/static-content", contentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/payments", paymentRoutes);

// 404 handler for unmatched routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: `Route ${req.originalUrl} not found` 
    });
});

// Global error handling middleware (must be last)
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    
    // Get status code from error
    const statusCode = err.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

async function run() {
    try {
        // Try to connect to MongoDB, but don't fail if it's not available
        try {
            await connectDB();
            console.log("✅ Connected to MongoDB");
        } catch (dbError) {
            console.log("⚠️  MongoDB not available, starting without database connection");
            console.log("   Make sure MongoDB is running on mongodb://localhost:27017");
        }

        const PORT = process.env.PORT || 3001;
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📊 API Health check: http://localhost:${PORT}/api/health`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        // Graceful shutdown
        const gracefulShutdown = (signal) => {
            console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
            server.close(() => {
                console.log('💤 HTTP server closed.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

// Only run the server if this file is executed directly
if (require.main === module) {
    run();
}
module.exports = app;