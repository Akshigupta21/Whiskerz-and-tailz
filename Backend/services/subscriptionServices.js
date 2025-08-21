/**
 * This module provides CRUD (Create, Read, Update, Delete) operations for managing Subscription in a Node.js application.
 * 
 * - Imports the Subscription model for database interactions.
 * - Exports functions to:
 *   - Create a new Subscription (createSubscription)
 *   - Retrieve all Subscription with optional filters (getAllSubscription)
 *   - Retrieve a single Subscription by its ID (getSubscriptionById)
 *   - Update an existing Subscription by ID (updateSubscription)
 *   - Delete a Subscription by ID (deleteSubscriptionl)
 * - Each function handles errors and throws descriptive messages on failure.
 */

const Subscription = require('../models/Subscription');

const createSubscription = async (data) => {
  try {
    return await Subscription.create(data);
  } catch {
    throw new Error('Failed to create subscription');
  }
};

const getAllSubscriptions = async (filters = {}) => {
  try {
    return await Subscription.find(filters)
      .populate('userId', 'fullName email')
      .populate('productId', 'name price images');
  } catch {
    throw new Error('Failed to fetch subscriptions');
  }
};

const getSubscriptionById = async (id) => {
  try {
    return await Subscription.findById(id)
      .populate('userId', 'fullName email')
      .populate('productId', 'name price images');
  } catch {
    throw new Error('Failed to fetch subscription');
  }
};

const updateSubscription = async (id, updates) => {
  try {
    return await Subscription.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('userId', 'fullName email')
      .populate('productId', 'name price images');
  } catch {
    throw new Error('Failed to update subscription');
  }
};

const deleteSubscription = async (id) => {
  try {
    return await Subscription.findByIdAndDelete(id);
  } catch {
    throw new Error('Failed to delete subscription');
  }
};

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
};
