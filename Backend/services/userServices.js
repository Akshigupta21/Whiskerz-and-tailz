/**  Summary: 
  This module provides CRUD (Create, Read, Update, Delete) operations for User objects using Mongoose. 
- createUser(userData): Creates and saves a new user to the database.
- getAllUsers(userType): Retrieves all users, optionally filtering by userType.
- getUserById(userId): Fetches a single user by their ID.
- updateUser(userId, updateData): Updates user details; handles password updates separately for security.
- deleteUser(userId): Deletes a user by their ID.
 All functions handle errors gracefully and log relevant information for debugging. */

const User = require('../models/user'); 

const createUser = async (userData) => {
    try {
        const newUser = new User(userData);
        await newUser.save(); 
        console.log('User created successfully:', newUser);
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error.message);
        throw new Error('Failed to create user: ' + error.message);
    }
};

const getAllUsers = async (userType = null) => {
    try {
        let query = {};
        if (userType) {
            query.userType = userType; 
        }
        const users = await User.find(query);
        console.log('Fetched all users (filtered by type if provided).');
        return users;
    } catch (error) {
        console.error('Error fetching all users:', error.message);
        throw new Error('Failed to retrieve users: ' + error.message);
    }
};

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.log(`User with ID ${userId} not found.`);
            return null;
        }
        console.log(`Fetched user with ID: ${userId}`);
        return user;
    } catch (error) {
        console.error(`Error fetching user by ID ${userId}:`, error.message);
        throw new Error(`Failed to retrieve user: ${error.message}`);
    }
};

const updateUser = async (userId, updateData) => {
    try {

        if (updateData.password) {
            const user = await User.findById(userId);
            if (!user) return null;
            user.password = updateData.password;
            await user.save(); 
            console.log(`User password updated for ID: ${userId}`);
            return user;
        }

        // For non-password updates
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            console.log(`User with ID ${userId} not found for update.`);
            return null;
        }
        console.log(`User with ID ${userId} updated successfully.`);
        return updatedUser;
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error.message);
        throw new Error(`Failed to update user: ${error.message}`);
    }
};

const deleteUser = async (userId) => {
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            console.log(`User with ID ${userId} not found for deletion.`);
            return null;
        }
        console.log(`User with ID ${userId} deleted successfully.`);
        return deletedUser;
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error.message);
        throw new Error(`Failed to delete user: ${error.message}`);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};