const express = require('express');
const router = express.Router();
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getFeaturedPosts,
    getRecentPosts,
    getPostsByCategory
} = require('../services/blogServices');

// Create a new blog post
router.post('/', async (req, res) => {
    try {
        const post = await createPost(req.body);
        res.status(201).json({
            success: true,
            data: post,
            message: 'Blog post created successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Get all blog posts with filtering and pagination
router.get('/', async (req, res) => {
    try {
        const result = await getAllPosts(req.query);
        res.status(200).json({
            success: true,
            data: result.posts,
            pagination: result.pagination,
            message: 'Blog posts fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get featured posts
router.get('/featured', async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        const posts = await getFeaturedPosts(limit);
        res.status(200).json({
            success: true,
            data: posts,
            message: 'Featured posts fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get recent posts
router.get('/recent', async (req, res) => {
    try {
        const limit = req.query.limit || 5;
        const posts = await getRecentPosts(limit);
        res.status(200).json({
            success: true,
            data: posts,
            message: 'Recent posts fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get posts by category
router.get('/category/:categoryName', async (req, res) => {
    try {
        const posts = await getPostsByCategory(req.params.categoryName);
        res.status(200).json({
            success: true,
            data: posts,
            message: 'Posts by category fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get single blog post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }
        res.status(200).json({
            success: true,
            data: post,
            message: 'Blog post fetched successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update blog post
router.put('/:id', async (req, res) => {
    try {
        const updatedPost = await updatePost(req.params.id, req.body);
        if (!updatedPost) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }
        res.status(200).json({
            success: true,
            data: updatedPost,
            message: 'Blog post updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete blog post
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await deletePost(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
