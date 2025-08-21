import React, { useState, useEffect } from 'react';
import { blogService } from '../Product/services/blogService';
import './BlogPage.css';

const BlogPage = ({ onNavigateHome }) => {
  // State for blogs
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [currentView, setCurrentView] = useState('list'); // 'list', 'create', 'edit', 'view'
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('publishDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Form state for creating/editing blogs
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Pet Care',
    tags: '',
    featuredImage: '',
    excerpt: ''
  });

  // Available categories
  const categories = ['All', 'Pet Care', 'Health', 'Nutrition', 'Training', 'Grooming', 'Adoption Stories', 'General'];

  // Check backend connection and fetch blogs
  useEffect(() => {
    const initializeBlogPage = async () => {
      setLoading(true);
      try {
        // Test backend connection
        const connected = await blogService.testConnection();
        setIsBackendConnected(connected);

        if (connected) {
          await fetchBlogs();
        } else {
          setError('Backend server is not available. Please make sure the server is running on http://localhost:3001');
        }
      } catch (err) {
        setError('Failed to initialize blog page: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeBlogPage();
  }, []);

  // Fetch blogs from backend
  const fetchBlogs = async (filters = {}) => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        sortBy,
        sortOrder,
        limit: 20,
        ...filters
      };

      const result = await blogService.getAllBlogs(params);
      if (result.success) {
        setBlogs(result.data || []);
      } else {
        setError(result.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      setError('Failed to fetch blogs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Refetch blogs when filters change
  useEffect(() => {
    if (isBackendConnected) {
      const timeoutId = setTimeout(() => {
        fetchBlogs();
      }, 300); // Debounce search
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, selectedCategory, sortBy, sortOrder, isBackendConnected]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: 'Current User', // You can replace this with actual user data
        publishDate: new Date().toISOString()
      };

      if (currentView === 'edit' && selectedBlog) {
        await blogService.updateBlog(selectedBlog._id, blogData);
      } else {
        await blogService.createBlog(blogData);
      }

      // Reset form and refresh blogs
      setFormData({
        title: '',
        content: '',
        category: 'Pet Care',
        tags: '',
        featuredImage: '',
        excerpt: ''
      });
      setCurrentView('list');
      await fetchBlogs();
    } catch (err) {
      setError('Failed to save blog: ' + err.message);
    }
  };

  // Handle blog deletion
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await blogService.deleteBlog(blogId);
        await fetchBlogs();
      } catch (err) {
        setError('Failed to delete blog: ' + err.message);
      }
    }
  };

  // Handle edit blog
  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      content: blog.content,
      category: blog.category?.name || blog.category || 'Pet Care',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      featuredImage: blog.featuredImage || '',
      excerpt: blog.excerpt
    });
    setSelectedBlog(blog);
    setCurrentView('edit');
  };

  // Handle view blog
  const handleView = (blog) => {
    setSelectedBlog(blog);
    setCurrentView('view');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Render loading state
  if (loading && !isBackendConnected) {
    return (
      <div className="blog-page">
        <div className="blog-header">
          <h1>Pet Care Blog</h1>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Connecting to server...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error && !isBackendConnected) {
    return (
      <div className="blog-page">
        <div className="blog-header">
          <h1>Pet Care Blog</h1>
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Header */}
      <div className="blog-header">
        <div className="header-content">
          <h1>Pet Care Blog</h1>
          <p>Share your pet care knowledge and connect with fellow pet lovers</p>
          <div className="header-actions">
            {currentView !== 'list' && (
              <button 
                onClick={() => setCurrentView('list')} 
                className="secondary-btn"
              >
                ← Back to Blogs
              </button>
            )}
            {currentView === 'list' && (
              <button 
                onClick={() => setCurrentView('create')} 
                className="primary-btn"
              >
                Write New Blog
              </button>
            )}
          </div>
        </div>
        
        {/* Connection Status */}
        <div className={`connection-status ${isBackendConnected ? 'connected' : 'disconnected'}`}>
          {isBackendConnected ? '✅ Connected to server' : '❌ Server offline'}
        </div>
      </div>

      {/* Blog List View */}
      {currentView === 'list' && (
        <div className="blog-content">
          {/* Filters */}
          <div className="blog-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-controls">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <select 
                value={`${sortBy}-${sortOrder}`} 
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="filter-select"
              >
                <option value="publishDate-desc">Latest First</option>
                <option value="publishDate-asc">Oldest First</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="views-desc">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="no-blogs">
              <h3>No blogs found</h3>
              <p>Be the first to write a blog post!</p>
              <button 
                onClick={() => setCurrentView('create')} 
                className="primary-btn"
              >
                Write First Blog
              </button>
            </div>
          ) : (
            <div className="blog-grid">
              {blogs.map(blog => (
                <div key={blog._id} className="blog-card">
                  {blog.featuredImage && (
                    <div className="blog-image">
                      <img src={blog.featuredImage} alt={blog.title} />
                    </div>
                  )}
                  
                  <div className="blog-card-content">
                    <div className="blog-meta">
                      <span className="blog-category">{blog.category?.name || blog.category}</span>
                      <span className="blog-date">{formatDate(blog.publishDate || blog.createdAt)}</span>
                    </div>
                    
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    
                    <div className="blog-stats">
                      <span>👁 {blog.views || 0} views</span>
                      <span>👤 {blog.author}</span>
                    </div>
                    
                    <div className="blog-actions">
                      <button 
                        onClick={() => handleView(blog)} 
                        className="read-btn"
                      >
                        Read More
                      </button>
                      <button 
                        onClick={() => handleEdit(blog)} 
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(blog._id)} 
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Blog Form */}
      {(currentView === 'create' || currentView === 'edit') && (
        <div className="blog-form-container">
          <h2>{currentView === 'create' ? 'Write New Blog' : 'Edit Blog'}</h2>
          
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Enter blog title..."
              />
            </div>

            <div className="form-group">
              <label>Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                required
                placeholder="Brief description of your blog..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {categories.filter(cat => cat !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="pet care, tips, health..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>Featured Image URL (optional)</label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                placeholder="Write your blog content here... Use **text** for bold headings and *text* for subheadings."
                rows="15"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setCurrentView('list')} className="secondary-btn">
                Cancel
              </button>
              <button type="submit" className="primary-btn">
                {currentView === 'create' ? 'Publish Blog' : 'Update Blog'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Single Blog */}
      {currentView === 'view' && selectedBlog && (
        <div className="blog-view-container">
          <article className="blog-article">
            {selectedBlog.featuredImage && (
              <div className="article-image">
                <img src={selectedBlog.featuredImage} alt={selectedBlog.title} />
              </div>
            )}
            
            <div className="article-header">
              <div className="article-meta">
                <span className="article-category">{selectedBlog.category?.name || selectedBlog.category}</span>
                <span className="article-date">{formatDate(selectedBlog.publishDate || selectedBlog.createdAt)}</span>
                <span className="article-author">By {selectedBlog.author}</span>
                <span className="article-views">👁 {selectedBlog.views || 0} views</span>
              </div>
              
              <h1 className="article-title">{selectedBlog.title}</h1>
              
              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="article-tags">
                  {selectedBlog.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="article-content">
              {selectedBlog.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  return <h2 key={index}>{paragraph.slice(2, -2)}</h2>;
                } else if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                  return <h3 key={index}>{paragraph.slice(1, -1)}</h3>;
                } else if (paragraph.trim()) {
                  return <p key={index}>{paragraph}</p>;
                } else {
                  return <br key={index} />;
                }
              })}
            </div>
            
            <div className="article-actions">
              <button onClick={() => handleEdit(selectedBlog)} className="edit-btn">
                Edit Blog
              </button>
              <button onClick={() => handleDelete(selectedBlog._id)} className="delete-btn">
                Delete Blog
              </button>
            </div>
          </article>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
