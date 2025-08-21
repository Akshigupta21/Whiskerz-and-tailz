const express = require('express');
const router = express.Router();
const {
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
} = require('../services/foodServices');

// Import middleware
const { authenticate, authorize } = require('../middleware/auth');
const { catchAsync } = require('../middleware/errorHandler');

/**
 * @route   GET /api/foods
 * @desc    Get all foods with filtering and pagination
 * @access  Public
 * @query   category, petType, ageGroup, breedSize, brand, minPrice, maxPrice, inStock, isFeatured, isDealOfTheDay, specialFeatures, search, page, limit, sortBy, sortOrder
 */
router.get('/', catchAsync(async (req, res) => {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', ...filters } = req.query;
    
    const result = await getAllFoods(filters, page, limit, sortBy, sortOrder);
    
    res.status(200).json(result);
}));

/**
 * @route   GET /api/foods/featured
 * @desc    Get featured foods
 * @access  Public
 */
router.get('/featured', catchAsync(async (req, res) => {
    const { limit = 10 } = req.query;
    
    const result = await getFeaturedFoods(limit);
    
    res.status(200).json(result);
}));

/**
 * @route   GET /api/foods/deal-of-the-day
 * @desc    Get deal of the day foods
 * @access  Public
 */
router.get('/deal-of-the-day', catchAsync(async (req, res) => {
    const { limit = 5 } = req.query;
    
    const result = await getDealOfTheDay(limit);
    
    res.status(200).json(result);
}));

/**
 * @route   GET /api/foods/categories
 * @desc    Get all food categories
 * @access  Public
 */
router.get('/categories', catchAsync(async (req, res) => {
    const result = await getFoodCategories();
    
    res.status(200).json(result);
}));

/**
 * @route   GET /api/foods/brands
 * @desc    Get all food brands
 * @access  Public
 */
router.get('/brands', catchAsync(async (req, res) => {
    const result = await getFoodBrands();
    
    res.status(200).json(result);
}));

/**
 * @route   GET /api/foods/search
 * @desc    Search foods
 * @access  Public
 * @query   q (search term), category, petType, ageGroup, breedSize, minPrice, maxPrice, inStock, specialFeatures, page, limit
 */
router.get('/search', catchAsync(async (req, res) => {
    const { q: searchTerm, page = 1, limit = 20, ...filters } = req.query;
    
    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            message: 'Search term is required'
        });
    }
    
    const result = await searchFoods(searchTerm, filters, page, limit);
    
    res.status(200).json(result);
}));

/**
 * @route   GET /api/foods/:id
 * @desc    Get single food by ID
 * @access  Public
 */
router.get('/:id', catchAsync(async (req, res) => {
    const result = await getFoodById(req.params.id);
    
    res.status(200).json(result);
}));

/**
 * @route   POST /api/foods
 * @desc    Create new food item
 * @access  Private (Admin/Business)
 */
router.post('/', authenticate, authorize('admin', 'business'), catchAsync(async (req, res) => {
    const result = await createFood(req.body);
    
    res.status(201).json(result);
}));

/**
 * @route   PUT /api/foods/:id
 * @desc    Update food item
 * @access  Private (Admin/Business)
 */
router.put('/:id', authenticate, authorize('admin', 'business'), catchAsync(async (req, res) => {
    const result = await updateFood(req.params.id, req.body);
    
    res.status(200).json(result);
}));

/**
 * @route   DELETE /api/foods/:id
 * @desc    Delete food item (soft delete)
 * @access  Private (Admin/Business)
 */
router.delete('/:id', authenticate, authorize('admin', 'business'), catchAsync(async (req, res) => {
    const result = await deleteFood(req.params.id);
    
    res.status(200).json(result);
}));

/**
 * @route   POST /api/foods/:id/review
 * @desc    Add review to food item
 * @access  Private (Authenticated users)
 */
router.post('/:id/review', authenticate, catchAsync(async (req, res) => {
    const { rating, comment } = req.body;
    
    if (!rating) {
        return res.status(400).json({
            success: false,
            message: 'Rating is required'
        });
    }
    
    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: 'Rating must be between 1 and 5'
        });
    }
    
    const result = await addReview(req.params.id, req.user.id, rating, comment);
    
    res.status(201).json(result);
}));

/**
 * @route   PATCH /api/foods/:id/stock
 * @desc    Update stock quantity
 * @access  Private (Admin/Business)
 */
router.patch('/:id/stock', authenticate, authorize('admin', 'business'), catchAsync(async (req, res) => {
    const { quantity, operation = 'set' } = req.body;
    
    if (quantity === undefined || quantity < 0) {
        return res.status(400).json({
            success: false,
            message: 'Valid quantity is required'
        });
    }
    
    if (!['set', 'add', 'subtract'].includes(operation)) {
        return res.status(400).json({
            success: false,
            message: 'Operation must be one of: set, add, subtract'
        });
    }
    
    const result = await updateStock(req.params.id, quantity, operation);
    
    res.status(200).json(result);
}));

/**
 * @route   POST /api/foods/bulk-update
 * @desc    Bulk update multiple foods
 * @access  Private (Admin only)
 */
router.post('/bulk-update', authenticate, authorize('admin'), catchAsync(async (req, res) => {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Updates array is required'
        });
    }
    
    const result = await bulkUpdateFoods(updates);
    
    res.status(200).json(result);
}));

/**
 * Error handling for invalid routes
 */
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Food route ${req.originalUrl} not found`
    });
});

module.exports = router;
