import { apiService } from './apiService';

// Blog service for frontend
export const blogService = {
  // Get all blog posts with filtering
  async getAllBlogs(filters = {}) {
    try {
      const response = await apiService.blogs.getAll(filters);
      return response.data;
    } catch (error) {
      console.warn('API not available, using fallback:', error.message);
      return { 
        success: false, 
        data: [], 
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        message: 'Could not fetch blogs from server'
      };
    }
  },

  // Get single blog post
  async getBlogById(id) {
    try {
      const response = await apiService.blogs.getById(id);
      return response.data;
    } catch (error) {
      console.warn('API not available:', error.message);
      return { success: false, data: null, message: 'Could not fetch blog from server' };
    }
  },

  // Create new blog post
  async createBlog(blogData) {
    try {
      const response = await apiService.blogs.create(blogData);
      return response.data;
    } catch (error) {
      console.error('Failed to create blog:', error.message);
      throw new Error('Failed to create blog post');
    }
  },

  // Update blog post
  async updateBlog(id, blogData) {
    try {
      const response = await apiService.blogs.update(id, blogData);
      return response.data;
    } catch (error) {
      console.error('Failed to update blog:', error.message);
      throw new Error('Failed to update blog post');
    }
  },

  // Delete blog post
  async deleteBlog(id) {
    try {
      const response = await apiService.blogs.delete(id);
      return response.data;
    } catch (error) {
      console.error('Failed to delete blog:', error.message);
      throw new Error('Failed to delete blog post');
    }
  },

  // Get featured blogs
  async getFeaturedBlogs(limit = 5) {
    try {
      const response = await apiService.blogs.getFeatured(limit);
      return response.data;
    } catch (error) {
      console.warn('API not available:', error.message);
      return { success: false, data: [], message: 'Could not fetch featured blogs' };
    }
  },

  // Get recent blogs
  async getRecentBlogs(limit = 5) {
    try {
      const response = await apiService.blogs.getRecent(limit);
      return response.data;
    } catch (error) {
      console.warn('API not available:', error.message);
      return { success: false, data: [], message: 'Could not fetch recent blogs' };
    }
  },

  // Get blogs by category
  async getBlogsByCategory(categoryName) {
    try {
      const response = await apiService.blogs.getByCategory(categoryName);
      return response.data;
    } catch (error) {
      console.warn('API not available:', error.message);
      return { success: false, data: [], message: 'Could not fetch blogs by category' };
    }
  },

  // Test connection to blog API
  async testConnection() {
    try {
      await apiService.blogs.getAll({ limit: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }
};
