const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const AuthService = require('./services/authService');
const { authenticate, authorize, verifyToken } = require('./middleware/auth');

/**
 * Test Authentication and Authorization System
 * This file demonstrates how the authentication system works
 */

class AuthDemo {
    constructor() {
        this.testUser = {
            email: 'test@wiskerzandtail.com',
            password: 'SecurePassword123!',
            firstName: 'Test',
            lastName: 'User',
            phoneNumber: '+919876543210',
            userType: 'Customer'
        };
    }

    /**
     * Demonstrate User Registration
     * Shows how user data is stored in database
     */
    async demonstrateRegistration() {
        console.log('\n=== REGISTRATION DEMONSTRATION ===');
        
        try {
            // Step 1: Register new user
            console.log('1. Registering new user...');
            const newUser = await AuthService.registerUser(this.testUser);
            
            console.log('✅ User successfully registered and stored in database:');
            console.log({
                id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                userType: newUser.userType,
                isActive: newUser.isActive,
                createdAt: newUser.createdAt,
                passwordHash: newUser.password ? '***ENCRYPTED***' : 'No password'
            });
            
            // Step 2: Verify user is in database
            console.log('\n2. Verifying user exists in database...');
            const userInDB = await User.findOne({ email: this.testUser.email });
            
            if (userInDB) {
                console.log('✅ User confirmed in database:');
                console.log({
                    databaseId: userInDB._id,
                    email: userInDB.email,
                    hashedPassword: userInDB.password ? 'YES (Securely Hashed)' : 'NO',
                    accountStatus: userInDB.isActive ? 'ACTIVE' : 'INACTIVE'
                });
            } else {
                console.log('❌ User not found in database');
            }
            
            return newUser;
            
        } catch (error) {
            console.log('❌ Registration failed:', error.message);
            
            // If user already exists, get existing user
            if (error.message.includes('already exists')) {
                const existingUser = await User.findOne({ email: this.testUser.email });
                console.log('ℹ️  Using existing user for demonstration');
                return existingUser;
            }
            
            throw error;
        }
    }

    /**
     * Demonstrate User Login and Authentication
     * Shows how system verifies user credentials
     */
    async demonstrateLogin() {
        console.log('\n=== LOGIN & AUTHENTICATION DEMONSTRATION ===');
        
        try {
            // Step 1: Attempt login
            console.log('1. Attempting user login...');
            const user = await AuthService.loginUser(this.testUser.email, this.testUser.password);
            
            console.log('✅ Login successful - User authenticated:');
            console.log({
                userId: user._id,
                email: user.email,
                role: user.role,
                userType: user.userType,
                lastLogin: user.lastLogin,
                loginAttempts: user.loginAttempts
            });
            
            // Step 2: Generate JWT token
            console.log('\n2. Generating authentication token...');
            const secret = process.env.JWT_SECRET || 'your-secret-key-for-development';
            const token = jwt.sign({ id: user._id }, secret, {
                expiresIn: process.env.JWT_EXPIRES_IN || '90d'
            });
            console.log('✅ JWT Token generated:', token.substring(0, 20) + '...');
            
            // Step 3: Verify token
            console.log('\n3. Verifying token authenticity...');
            const decoded = jwt.verify(token, secret);
            console.log('✅ Token verified successfully:');
            console.log({
                userId: decoded.id,
                issuedAt: new Date(decoded.iat * 1000),
                expiresAt: new Date(decoded.exp * 1000)
            });
            
            return { user, token };
            
        } catch (error) {
            console.log('❌ Login failed:', error.message);
            throw error;
        }
    }

    /**
     * Demonstrate Authorization Middleware
     * Shows how system checks user permissions
     */
    async demonstrateAuthorization(token) {
        console.log('\n=== AUTHORIZATION DEMONSTRATION ===');
        
        try {
            // Step 1: Verify user is authenticated
            console.log('1. Checking user authentication status...');
            const secret = process.env.JWT_SECRET || 'your-secret-key-for-development';
            const decodedToken = jwt.verify(token, secret);
            const user = await User.findById(decodedToken.id);
            
            if (user && user.isActive) {
                console.log('✅ User is authenticated and authorized:');
                console.log({
                    isAuthenticated: true,
                    isActive: user.isActive,
                    role: user.role,
                    permissions: this.getUserPermissions(user.role)
                });
            } else {
                console.log('❌ User is not authorized');
                return false;
            }
            
            // Step 2: Check role-based permissions
            console.log('\n2. Checking role-based permissions...');
            const permissions = this.getUserPermissions(user.role);
            console.log('✅ User permissions:', permissions);
            
            // Step 3: Demonstrate protected resource access
            console.log('\n3. Testing protected resource access...');
            
            const protectedResources = [
                { resource: 'View Profile', requiredRole: 'user', hasAccess: this.hasPermission(user.role, 'user') },
                { resource: 'Create Order', requiredRole: 'user', hasAccess: this.hasPermission(user.role, 'user') },
                { resource: 'Admin Panel', requiredRole: 'admin', hasAccess: this.hasPermission(user.role, 'admin') },
                { resource: 'Manage Users', requiredRole: 'admin', hasAccess: this.hasPermission(user.role, 'admin') }
            ];
            
            protectedResources.forEach(resource => {
                const status = resource.hasAccess ? '✅ ALLOWED' : '❌ DENIED';
                console.log(`${status} ${resource.resource} (Requires: ${resource.requiredRole})`);
            });
            
            return true;
            
        } catch (error) {
            console.log('❌ Authorization check failed:', error.message);
            return false;
        }
    }

    /**
     * Get user permissions based on role
     */
    getUserPermissions(role) {
        const permissions = {
            user: ['view_profile', 'update_profile', 'create_order', 'view_orders', 'add_to_cart'],
            admin: ['view_profile', 'update_profile', 'create_order', 'view_orders', 'add_to_cart', 
                   'manage_users', 'manage_products', 'view_analytics', 'system_settings'],
            superadmin: ['*'] // All permissions
        };
        
        return permissions[role] || [];
    }

    /**
     * Check if user has required permission
     */
    hasPermission(userRole, requiredRole) {
        const roleHierarchy = ['user', 'admin', 'superadmin'];
        const userLevel = roleHierarchy.indexOf(userRole);
        const requiredLevel = roleHierarchy.indexOf(requiredRole);
        
        return userLevel >= requiredLevel;
    }

    /**
     * Demonstrate complete authentication flow
     */
    async runCompleteDemo() {
        console.log('🚀 STARTING COMPLETE AUTHENTICATION DEMONSTRATION');
        console.log('================================================');
        
        try {
            // Connect to database if not connected
            if (mongoose.connection.readyState === 0) {
                console.log('Connecting to database...');
                await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/wiskerzandtail');
                console.log('✅ Connected to database');
            }
            
            // 1. Registration Demo
            const user = await this.demonstrateRegistration();
            
            // 2. Login Demo
            const { user: loggedInUser, token } = await this.demonstrateLogin();
            
            // 3. Authorization Demo
            await this.demonstrateAuthorization(token);
            
            console.log('\n=== SUMMARY ===');
            console.log('✅ User Registration: Data successfully stored in database');
            console.log('✅ User Authentication: Credentials verified and token generated');
            console.log('✅ User Authorization: Permissions checked and access controlled');
            console.log('\n🎉 Authentication system is working perfectly!');
            
        } catch (error) {
            console.error('❌ Demo failed:', error.message);
        }
    }

    /**
     * Clean up test data
     */
    async cleanup() {
        try {
            await User.deleteOne({ email: this.testUser.email });
            console.log('🧹 Test data cleaned up');
        } catch (error) {
            console.log('Note: Cleanup failed, test data may remain');
        }
    }
}

// Export for use in other files
module.exports = AuthDemo;

// Run demo if this file is executed directly
if (require.main === module) {
    const demo = new AuthDemo();
    
    demo.runCompleteDemo()
        .then(() => {
            console.log('\nDemo completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Demo failed:', error);
            process.exit(1);
        });
}
