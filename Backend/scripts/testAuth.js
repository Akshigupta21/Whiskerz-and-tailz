const mongoose = require('mongoose');
require('dotenv').config();

// Import models and services
const User = require('../models/user');
const AuthService = require('../services/authService');

// Connect to MongoDB
async function connectDB() {
    try {
        const mongoURI = process.env.DATABASE_URI || 'mongodb://localhost:27017/wiskerzandtail';
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Test user registration and login
async function testAuthentication() {
    console.log('🧪 Testing Authentication System...\n');

    try {
        // Test data
        const testUser = {
            email: 'test.user@example.com',
            password: 'SecurePassword123!',
            firstName: 'Test',
            lastName: 'User',
            phoneNumber: '9876543210',
            userType: 'Customer'
        };

        // Clean up any existing test user
        await User.deleteOne({ email: testUser.email });
        console.log('🧹 Cleaned up existing test user');

        // Test 1: User Registration
        console.log('\n📝 Test 1: User Registration');
        try {
            const newUser = await AuthService.registerUser(testUser);
            console.log(`✅ Registration successful: ${newUser.email}`);
            console.log(`   - User ID: ${newUser._id}`);
            console.log(`   - User Type: ${newUser.userType}`);
            console.log(`   - Full Name: ${newUser.fullName}`);
            console.log(`   - Is Active: ${newUser.isActive}`);
        } catch (error) {
            console.log(`❌ Registration failed: ${error.message}`);
        }

        // Test 2: Duplicate Registration (should fail)
        console.log('\n📝 Test 2: Duplicate Registration (should fail)');
        try {
            await AuthService.registerUser(testUser);
            console.log('❌ Duplicate registration should have failed');
        } catch (error) {
            console.log(`✅ Duplicate registration correctly rejected: ${error.message}`);
        }

        // Test 3: Valid Login
        console.log('\n📝 Test 3: Valid Login');
        try {
            const loggedInUser = await AuthService.loginUser(testUser.email, testUser.password);
            console.log(`✅ Login successful: ${loggedInUser.email}`);
            console.log(`   - Last Login: ${loggedInUser.lastLogin}`);
        } catch (error) {
            console.log(`❌ Login failed: ${error.message}`);
        }

        // Test 4: Invalid Password (should fail)
        console.log('\n📝 Test 4: Invalid Password (should fail)');
        try {
            await AuthService.loginUser(testUser.email, 'wrongpassword');
            console.log('❌ Login with wrong password should have failed');
        } catch (error) {
            console.log(`✅ Invalid password correctly rejected: ${error.message}`);
        }

        // Test 5: Non-existent User (should fail)
        console.log('\n📝 Test 5: Non-existent User (should fail)');
        try {
            await AuthService.loginUser('nonexistent@example.com', 'password');
            console.log('❌ Login with non-existent user should have failed');
        } catch (error) {
            console.log(`✅ Non-existent user correctly rejected: ${error.message}`);
        }

        // Test 6: Password Change
        console.log('\n📝 Test 6: Password Change');
        try {
            const user = await User.findOne({ email: testUser.email });
            const newPassword = 'NewSecurePassword456!';
            await AuthService.changePassword(user._id, testUser.password, newPassword);
            console.log('✅ Password change successful');
            
            // Verify new password works
            const loginWithNewPassword = await AuthService.loginUser(testUser.email, newPassword);
            console.log(`✅ Login with new password successful: ${loginWithNewPassword.email}`);
        } catch (error) {
            console.log(`❌ Password change failed: ${error.message}`);
        }

        // Test 7: Account Lockout (multiple failed attempts)
        console.log('\n📝 Test 7: Account Lockout (multiple failed attempts)');
        try {
            // Clear any existing login attempts
            await User.updateOne(
                { email: testUser.email },
                { $unset: { loginAttempts: 1, lockUntil: 1 } }
            );

            // Try to login with wrong password multiple times
            for (let i = 1; i <= 6; i++) {
                try {
                    await AuthService.loginUser(testUser.email, 'wrongpassword');
                } catch (error) {
                    console.log(`   Attempt ${i}: ${error.message}`);
                }
            }
            
            // Check if account is locked
            const lockedUser = await User.findOne({ email: testUser.email });
            if (lockedUser.isLocked) {
                console.log('✅ Account correctly locked after failed attempts');
            } else {
                console.log('⚠️ Account should be locked but is not');
            }
        } catch (error) {
            console.log(`❌ Account lockout test failed: ${error.message}`);
        }

        console.log('\n🎉 Authentication tests completed!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        // Clean up test data
        await User.deleteOne({ email: 'test.user@example.com' });
        console.log('\n🧹 Test cleanup completed');
        
        await mongoose.connection.close();
        console.log('🔌 Database connection closed');
    }
}

// Run the tests
async function main() {
    await connectDB();
    await testAuthentication();
}

main().catch(console.error);
