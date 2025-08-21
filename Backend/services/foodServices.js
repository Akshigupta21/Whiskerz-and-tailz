const Food = require('../models/food');
const { AppError, NotFoundError, ValidationError } = require('../middleware/errorHandler');

/**
 * Food Services - Business logic for food operations
 */

// Create a new food item
const createFood = async (foodData) => {
    try {
        // Validate required fields
        if (!foodData.name || !foodData.brand || !foodData.price) {
            throw new ValidationError('Name, brand, and price are required fields');
        }

        // Create new food item
        const food = new Food(foodData);
        const savedFood = await food.save();
        
        return {
            success: true,
            message: 'Food item created successfully',
            data: savedFood
        };
    } catch (error) {
        if (error.name === 'ValidationError') {
            throw new ValidationError(error.message);
        }
        throw new AppError('Failed to create food item: ' + error.message, 400);
    }
};

// Get all food items with filtering and pagination
const getAllFoods = async (filters = {}, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc') => {
    try {
        const skip = (page - 1) * limit;
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        // Build query based on filters
        const query = { isActive: true };
        
        if (filters.category) query.category = filters.category;
        if (filters.petType) query.petType = filters.petType;
        if (filters.ageGroup) query.ageGroup = filters.ageGroup;
        if (filters.breedSize) query.breedSize = filters.breedSize;
        if (filters.brand) query.brand = new RegExp(filters.brand, 'i');
        if (filters.minPrice) query.price = { ...query.price, $gte: parseFloat(filters.minPrice) };
        if (filters.maxPrice) query.price = { ...query.price, $lte: parseFloat(filters.maxPrice) };
        if (filters.inStock !== undefined) query.inStock = filters.inStock;
        if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
        if (filters.isDealOfTheDay !== undefined) query.isDealOfTheDay = filters.isDealOfTheDay;
        if (filters.specialFeatures) {
            query.specialFeatures = { $in: Array.isArray(filters.specialFeatures) ? filters.specialFeatures : [filters.specialFeatures] };
        }
        if (filters.search) {
            query.$or = [
                { name: new RegExp(filters.search, 'i') },
                { description: new RegExp(filters.search, 'i') },
                { brand: new RegExp(filters.search, 'i') },
                { tags: new RegExp(filters.search, 'i') }
            ];
        }

        // Execute query with pagination
        const foods = await Food.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('reviews.user', 'firstName lastName');

        // Get total count for pagination
        const total = await Food.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            message: 'Foods retrieved successfully',
            data: foods,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit),
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        };
    } catch (error) {
        throw new AppError('Failed to retrieve foods: ' + error.message, 500);
    }
};

// Get a single food item by ID
const getFoodById = async (foodId) => {
    try {
        const food = await Food.findById(foodId)
            .populate('reviews.user', 'firstName lastName')
            .populate('reviews.user', 'firstName lastName');

        if (!food) {
            throw new NotFoundError('Food item not found');
        }

        // Increment view count
        await food.incrementViews();

        return {
            success: true,
            message: 'Food item retrieved successfully',
            data: food
        };
    } catch (error) {
        if (error.name === 'CastError') {
            throw new NotFoundError('Food item not found');
        }
        throw error;
    }
};

// Update a food item
const updateFood = async (foodId, updateData) => {
    try {
        // Remove fields that shouldn't be updated directly
        delete updateData.views;
        delete updateData.salesCount;
        delete updateData.rating;
        delete updateData.reviews;

        const updatedFood = await Food.findByIdAndUpdate(
            foodId,
            updateData,
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('reviews.user', 'firstName lastName');

        if (!updatedFood) {
            throw new NotFoundError('Food item not found');
        }

        return {
            success: true,
            message: 'Food item updated successfully',
            data: updatedFood
        };
    } catch (error) {
        if (error.name === 'CastError') {
            throw new NotFoundError('Food item not found');
        }
        if (error.name === 'ValidationError') {
            throw new ValidationError(error.message);
        }
        throw new AppError('Failed to update food item: ' + error.message, 400);
    }
};

// Delete a food item (soft delete)
const deleteFood = async (foodId) => {
    try {
        const deletedFood = await Food.findByIdAndUpdate(
            foodId,
            { isActive: false },
            { new: true }
        );

        if (!deletedFood) {
            throw new NotFoundError('Food item not found');
        }

        return {
            success: true,
            message: 'Food item deleted successfully',
            data: deletedFood
        };
    } catch (error) {
        if (error.name === 'CastError') {
            throw new NotFoundError('Food item not found');
        }
        throw new AppError('Failed to delete food item: ' + error.message, 500);
    }
};

// Get featured foods
const getFeaturedFoods = async (limit = 10) => {
    try {
        const foods = await Food.getFeatured().limit(parseInt(limit));

        return {
            success: true,
            message: 'Featured foods retrieved successfully',
            data: foods
        };
    } catch (error) {
        throw new AppError('Failed to retrieve featured foods: ' + error.message, 500);
    }
};

// Get deal of the day foods
const getDealOfTheDay = async (limit = 5) => {
    try {
        const foods = await Food.getDealOfTheDay().limit(parseInt(limit));

        return {
            success: true,
            message: 'Deal of the day foods retrieved successfully',
            data: foods
        };
    } catch (error) {
        throw new AppError('Failed to retrieve deal of the day foods: ' + error.message, 500);
    }
};

// Search foods
const searchFoods = async (searchTerm, filters = {}, page = 1, limit = 20) => {
    try {
        const skip = (page - 1) * limit;
        
        const foods = await Food.searchFoods(searchTerm, filters)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('reviews.user', 'firstName lastName')
            .sort({ 'rating.average': -1, salesCount: -1 });

        const total = await Food.searchFoods(searchTerm, filters).countDocuments();
        const totalPages = Math.ceil(total / limit);

        return {
            success: true,
            message: 'Search completed successfully',
            data: foods,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit)
            },
            searchTerm
        };
    } catch (error) {
        throw new AppError('Failed to search foods: ' + error.message, 500);
    }
};

// Add review to food
const addReview = async (foodId, userId, rating, comment) => {
    try {
        const food = await Food.findById(foodId);
        
        if (!food) {
            throw new NotFoundError('Food item not found');
        }

        // Check if user already reviewed this food
        const existingReview = food.reviews.find(review => review.user.toString() === userId);
        if (existingReview) {
            throw new ValidationError('You have already reviewed this food item');
        }

        await food.addReview(userId, rating, comment);

        return {
            success: true,
            message: 'Review added successfully',
            data: food
        };
    } catch (error) {
        if (error.name === 'CastError') {
            throw new NotFoundError('Food item not found');
        }
        throw error;
    }
};

// Get food categories
const getFoodCategories = async () => {
    try {
        const categories = await Food.distinct('category', { isActive: true });
        
        return {
            success: true,
            message: 'Food categories retrieved successfully',
            data: categories
        };
    } catch (error) {
        throw new AppError('Failed to retrieve food categories: ' + error.message, 500);
    }
};

// Get food brands
const getFoodBrands = async () => {
    try {
        const brands = await Food.distinct('brand', { isActive: true });
        
        return {
            success: true,
            message: 'Food brands retrieved successfully',
            data: brands.sort()
        };
    } catch (error) {
        throw new AppError('Failed to retrieve food brands: ' + error.message, 500);
    }
};

// Update stock quantity
const updateStock = async (foodId, quantity, operation = 'set') => {
    try {
        const food = await Food.findById(foodId);
        
        if (!food) {
            throw new NotFoundError('Food item not found');
        }

        switch (operation) {
            case 'add':
                food.stockQuantity += quantity;
                break;
            case 'subtract':
                food.stockQuantity = Math.max(0, food.stockQuantity - quantity);
                break;
            case 'set':
            default:
                food.stockQuantity = quantity;
                break;
        }

        food.inStock = food.stockQuantity > 0;
        await food.save();

        return {
            success: true,
            message: 'Stock updated successfully',
            data: { stockQuantity: food.stockQuantity, inStock: food.inStock }
        };
    } catch (error) {
        if (error.name === 'CastError') {
            throw new NotFoundError('Food item not found');
        }
        throw new AppError('Failed to update stock: ' + error.message, 500);
    }
};

// Bulk operations
const bulkUpdateFoods = async (updates) => {
    try {
        const bulkOps = updates.map(update => ({
            updateOne: {
                filter: { _id: update.id },
                update: { $set: update.data },
                upsert: false
            }
        }));

        const result = await Food.bulkWrite(bulkOps);

        return {
            success: true,
            message: 'Bulk update completed successfully',
            data: {
                modifiedCount: result.modifiedCount,
                matchedCount: result.matchedCount
            }
        };
    } catch (error) {
        throw new AppError('Failed to perform bulk update: ' + error.message, 500);
    }
};

module.exports = {
    createFood,
    getAllFoods,
    getFoodById,
    updateFood,
    deleteFood,
    getFeaturedFoods,
    getDealOfTheDay,
    searchFoods,
    addReview,
    getFoodCategories,
    getFoodBrands,
    updateStock,
    bulkUpdateFoods
};
