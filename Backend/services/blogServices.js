const mongoose = require('mongoose');
const BlogPost = require('../models/blogPost');
const BlogCategory = require('../models/blogCategory');

// Create a new blog post
const createPost = async (postData) => {
    try {
        // Generate slug from title if not provided
        if (!postData.slug) {
            postData.slug = postData.title
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim('-');
        }

        // Find or create category
        let category;
        if (mongoose.Types.ObjectId.isValid(postData.category)) {
            category = await BlogCategory.findById(postData.category);
        } else {
            category = await BlogCategory.findOne({ name: postData.category });
            if (!category) {
                // Create new category if it doesn't exist
                const categorySlug = postData.category
                    .toLowerCase()
                    .replace(/[^a-z0-9 -]/g, '')
                    .replace(/\s+/g, '-');
                category = await BlogCategory.create({
                    name: postData.category,
                    slug: categorySlug
                });
            }
        }

        postData.category = category._id;
        const newPost = await BlogPost.create(postData);
        
        // Increment category post count
        await BlogCategory.findByIdAndUpdate(category._id, {
            $inc: { numPosts: 1 }
        });

        return await BlogPost.findById(newPost._id).populate('category');
    } catch (error) {
        throw new Error('Failed to create post: ' + error.message);
    }
};

// Get all blog posts with filtering and sorting
const getAllPosts = async (query = {}) => {
    try {
        const {
            category,
            author,
            search,
            sortBy = 'publishDate',
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = query;

        // Build filter object
        const filter = {};
        
        if (category && category !== 'All') {
            const categoryDoc = await BlogCategory.findOne({ name: category });
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            }
        }
        
        if (author) {
            filter.author = new RegExp(author, 'i');
        }
        
        if (search) {
            filter.$or = [
                { title: new RegExp(search, 'i') },
                { content: new RegExp(search, 'i') },
                { excerpt: new RegExp(search, 'i') }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (page - 1) * limit;
        
        const posts = await BlogPost.find(filter)
            .populate('category')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await BlogPost.countDocuments(filter);

        return {
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw new Error('Failed to fetch posts: ' + error.message);
    }
};

// Get a blog post by ID
const getPostById = async (postId) => {
    try {
        const post = await BlogPost.findById(postId).populate('category');
        if (post) {
            // Increment view count
            await BlogPost.findByIdAndUpdate(postId, { $inc: { views: 1 } });
            post.views += 1;
        }
        return post;
    } catch (error) {
        throw new Error('Failed to fetch post: ' + error.message);
    }
};

// Update a blog post by ID
const updatePost = async (postId, updateData) => {
    try {
        // Handle category update
        if (updateData.category && !mongoose.Types.ObjectId.isValid(updateData.category)) {
            const category = await BlogCategory.findOne({ name: updateData.category });
            if (category) {
                updateData.category = category._id;
            }
        }

        return await BlogPost.findByIdAndUpdate(postId, updateData, { new: true }).populate('category');
    } catch (error) {
        throw new Error('Failed to update post: ' + error.message);
    }
};

// Delete a blog post by ID
const deletePost = async (postId) => {
    try {
        const post = await BlogPost.findById(postId);
        if (post) {
            // Decrement category post count
            await BlogCategory.findByIdAndUpdate(post.category, {
                $inc: { numPosts: -1 }
            });
        }
        return await BlogPost.findByIdAndDelete(postId);
    } catch (error) {
        throw new Error('Failed to delete post: ' + error.message);
    }
};

// Get featured posts
const getFeaturedPosts = async (limit = 5) => {
    try {
        return await BlogPost.find({ isFeatured: true })
            .populate('category')
            .sort({ publishDate: -1 })
            .limit(limit);
    } catch (error) {
        throw new Error('Failed to fetch featured posts: ' + error.message);
    }
};

// Get recent posts
const getRecentPosts = async (limit = 5) => {
    try {
        return await BlogPost.find()
            .populate('category')
            .sort({ publishDate: -1 })
            .limit(limit);
    } catch (error) {
        throw new Error('Failed to fetch recent posts: ' + error.message);
    }
};

// Get posts by category
const getPostsByCategory = async (categoryName) => {
    try {
        const category = await BlogCategory.findOne({ name: categoryName });
        if (!category) {
            throw new Error('Category not found');
        }
        
        return await BlogPost.find({ category: category._id })
            .populate('category')
            .sort({ publishDate: -1 });
    } catch (error) {
        throw new Error('Failed to fetch posts by category: ' + error.message);
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getFeaturedPosts,
    getRecentPosts,
    getPostsByCategory
};