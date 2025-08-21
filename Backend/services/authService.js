const User = require('../models/user');
const { ValidationError, AuthenticationError } = require('../middleware/errorHandler');
const { createSendToken } = require('../middleware/auth');

/**
 * Enhanced Authentication Service
 * Handles user registration, login with security features
 */
class AuthService {
    
    /**
     * Register a new user
     */
    static async registerUser(userData) {
        const { email, password, firstName, lastName, phoneNumber, dateOfBirth, userType, address } = userData;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ValidationError('User with this email already exists');
        }

        // Validate required fields
        if (!email || !password || !firstName || !lastName || !userType) {
            throw new ValidationError('Email, password, first name, last name, and user type are required');
        }

        // Create user data object
        const newUserData = {
            email,
            password, // Will be hashed by the pre-save hook
            firstName,
            lastName,
            phoneNumber,
            dateOfBirth,
            userType: userType || 'Customer',
            role: 'user',
            isActive: true,
            isVerified: false
        };

        // Add address if provided
        if (address) {
            newUserData.address = Array.isArray(address) ? address : [address];
        }

        const newUser = await User.create(newUserData);

        // Log successful registration
        console.log(`✅ New user registered: ${newUser.email} (${newUser.userType})`);

        return newUser;
    }

    /**
     * Login user with enhanced security
     */
    static async loginUser(email, password) {
        // Validate input
        if (!email || !password) {
            throw new ValidationError('Please provide email and password');
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password +isActive +loginAttempts +lockUntil');
        
        if (!user) {
            throw new AuthenticationError('Invalid email or password');
        }

        // Check if account is locked
        if (user.isLocked) {
            throw new AuthenticationError('Account temporarily locked due to too many failed login attempts. Please try again later.');
        }

        // Check if user account is active
        if (!user.isActive) {
            throw new AuthenticationError('Your account has been deactivated. Please contact support.');
        }

        // Verify password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            // Increment login attempts
            await user.incLoginAttempts();
            throw new AuthenticationError('Invalid email or password');
        }

        // Reset login attempts on successful login
        if (user.loginAttempts > 0) {
            await user.resetLoginAttempts();
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Log successful login
        console.log(`✅ User logged in: ${user.email} (${user.userType}) at ${new Date().toISOString()}`);

        return user;
    }

    /**
     * Verify user token and get user data
     */
    static async verifyUserToken(userId) {
        const user = await User.findById(userId).select('+isActive');
        
        if (!user) {
            throw new AuthenticationError('The user belonging to this token does no longer exist.');
        }

        if (!user.isActive) {
            throw new AuthenticationError('Your account has been deactivated. Please contact support.');
        }

        return user;
    }

    /**
     * Change user password
     */
    static async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select('+password');
        
        if (!user) {
            throw new ValidationError('User not found');
        }

        // Verify current password
        const isCurrentPasswordCorrect = await user.comparePassword(currentPassword);
        if (!isCurrentPasswordCorrect) {
            throw new ValidationError('Current password is incorrect');
        }

        // Set new password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        console.log(`✅ Password changed for user: ${user.email}`);

        return user;
    }

    /**
     * Update user profile
     */
    static async updateUserProfile(userId, updateData) {
        // Remove sensitive fields that shouldn't be updated via this method
        const { password, role, isActive, loginAttempts, lockUntil, ...safeUpdateData } = updateData;

        const user = await User.findByIdAndUpdate(
            userId,
            safeUpdateData,
            { 
                new: true, 
                runValidators: true 
            }
        );

        if (!user) {
            throw new ValidationError('User not found');
        }

        console.log(`✅ Profile updated for user: ${user.email}`);

        return user;
    }

    /**
     * Deactivate user account
     */
    static async deactivateUser(userId) {
        const user = await User.findByIdAndUpdate(
            userId,
            { isActive: false },
            { new: true }
        );

        if (!user) {
            throw new ValidationError('User not found');
        }

        console.log(`⚠️ User account deactivated: ${user.email}`);

        return user;
    }
}

module.exports = AuthService;
