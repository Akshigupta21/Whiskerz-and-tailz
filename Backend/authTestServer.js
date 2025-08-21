const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the main app
const app = require('./app');

/**
 * Simple test server to demonstrate authentication endpoints
 */

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wiskerzandtail';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('✅ Connected to MongoDB');
        
        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📖 API Documentation: http://localhost:${PORT}/api/docs`);
            
            console.log('\n=== AUTHENTICATION ENDPOINTS ===');
            console.log(`🔐 Registration: POST http://localhost:${PORT}/api/auth/register`);
            console.log(`🔑 Login: POST http://localhost:${PORT}/api/auth/login`);
            console.log(`👤 Profile: GET http://localhost:${PORT}/api/auth/profile`);
            console.log(`🔒 Check Auth: GET http://localhost:${PORT}/api/auth/check`);
            console.log(`📊 Session Info: GET http://localhost:${PORT}/api/auth/session`);
            
            console.log('\n=== SAMPLE REQUESTS ===');
            console.log('Registration:');
            console.log(`curl -X POST http://localhost:${PORT}/api/auth/register \\`);
            console.log(`  -H "Content-Type: application/json" \\`);
            console.log(`  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+919876543210",
    "userType": "Customer"
  }'`);
            
            console.log('\nLogin:');
            console.log(`curl -X POST http://localhost:${PORT}/api/auth/login \\`);
            console.log(`  -H "Content-Type: application/json" \\`);
            console.log(`  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'`);
            
            console.log('\n🎯 Use Postman, Insomnia, or curl to test these endpoints!');
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    });

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    mongoose.connection.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    mongoose.connection.close();
    process.exit(0);
});
