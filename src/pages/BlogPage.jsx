import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Calendar, 
  User, 
  Eye, 
  Heart, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  Tag,
  Clock,
  TrendingUp,
  BookOpen,
  Globe,
  ArrowLeft,
  Save,
  X,
  Users
} from 'lucide-react';
import { blogService } from '../Product/services/blogService';
import HeroSection from '../components/HeroSection';
import { getHeroConfig } from '../config/heroConfig';
import BlogPostsGrid from '../components/BlogPostsGrid';
import './BlogPageEnhanced.css';
import Header from '../Header_Footer_Content/Header';

const BlogPage = ({ onNavigateHome }) => {
  // State for blogs
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI enhancement states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  
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

  // Blog posts data - Enhanced with better content
  const blogPostsData = [
    { 
      id: 1, 
      title: "The Complete Guide to Puppy Training Success", 
      snippet: "Master the art of puppy training with proven techniques from professional dog trainers. Learn potty training, basic commands, socialization tips, and how to handle common behavioral issues during your puppy's crucial first months...", 
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop",
      author: "Dr. Sarah Wilson",
      publishDate: "2024-07-25",
      readTime: "8 min read",
      category: "Training",
      likes: 247,
      views: 3120
    },
    { 
      id: 2, 
      title: "Decode Your Cat's Secret Language", 
      snippet: "Unlock the mysteries of feline communication! From tail positions to purring patterns, learn to understand what your cat is really trying to tell you. Discover the fascinating world of cat behavior and strengthen your bond...", 
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=250&fit=crop",
      author: "Dr. Michael Chen",
      publishDate: "2024-07-20",
      readTime: "6 min read",
      category: "Behavior",
      likes: 189,
      views: 2480
    },
    { 
      id: 3, 
      title: "Senior Dog Nutrition: A Veterinarian's Guide", 
      snippet: "As your faithful companion ages, their nutritional needs change dramatically. Learn about joint support supplements, digestive health, weight management, and the best foods to keep your senior dog thriving in their golden years...", 
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=250&fit=crop",
      author: "Dr. Emily Rodriguez",
      publishDate: "2024-07-15",
      readTime: "7 min read",
      category: "Health",
      likes: 298,
      views: 2890
    },
    { 
      id: 4, 
      title: "From Cage to Paradise: Bird Care Mastery", 
      snippet: "Transform your home into a bird sanctuary with expert advice on cage setup, proper lighting, temperature control, and nutrition. Learn about different bird species' unique needs and create an environment where your feathered friend can truly flourish...", 
      image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=250&fit=crop",
      author: "Dr. Alex Thompson",
      publishDate: "2024-07-10",
      readTime: "9 min read",
      category: "Care",
      likes: 156,
      views: 1820
    },
    { 
      id: 5, 
      title: "Aquarium Mastery: Building Your Underwater Ecosystem", 
      snippet: "Create a stunning aquatic world in your home with this comprehensive guide. From choosing the right tank size and filtration system to selecting compatible fish species and maintaining perfect water chemistry - everything you need for aquarium success...", 
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c23a?w=400&h=250&fit=crop",
      author: "Marina Fish Expert",
      publishDate: "2024-07-05",
      readTime: "12 min read",
      category: "Aquarium",
      likes: 224,
      views: 2150
    },
    { 
      id: 6, 
      title: "Brain Games for Bored Pets: Mental Enrichment Ideas", 
      snippet: "Combat pet boredom with these creative mental stimulation activities! Discover DIY puzzle toys, scent games, training challenges, and interactive play ideas that will keep your furry friends mentally sharp and emotionally satisfied...", 
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=250&fit=crop",
      author: "Pet Behaviorist Lisa",
      publishDate: "2024-06-30",
      readTime: "6 min read",
      category: "Entertainment",
      likes: 312,
      views: 2670
    }
  ];

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
          // Load local blogs if backend not connected
          const localBlogs = JSON.parse(localStorage.getItem('localBlogs') || '[]');
          setBlogs(localBlogs);
          setError('Backend server is not available. Using local storage for blog management.');
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

  // Scroll progress and floating button effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowFloatingButton(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: 'Current User', // You can replace this with actual user data
        publishDate: new Date().toISOString(),
        id: Date.now(), // Generate a simple ID
        views: 0,
        likes: 0,
        comments: 0
      };

      if (isBackendConnected) {
        // Use backend if connected
        if (currentView === 'edit' && selectedBlog) {
          await blogService.updateBlog(selectedBlog._id, blogData);
        } else {
          await blogService.createBlog(blogData);
        }
        await fetchBlogs();
      } else {
        // Use local storage as fallback
        const savedBlogs = JSON.parse(localStorage.getItem('localBlogs') || '[]');
        
        if (currentView === 'edit' && selectedBlog) {
          const index = savedBlogs.findIndex(blog => blog.id === selectedBlog.id);
          if (index !== -1) {
            savedBlogs[index] = { ...savedBlogs[index], ...blogData };
          }
        } else {
          savedBlogs.unshift(blogData); // Add to beginning
        }
        
        localStorage.setItem('localBlogs', JSON.stringify(savedBlogs));
        setBlogs(savedBlogs);
        
        // Show success message
        alert('Blog saved locally! (Backend not connected)');
      }

      // Reset form and go back to list
      setFormData({
        title: '',
        content: '',
        category: 'Pet Care',
        tags: '',
        featuredImage: '',
        excerpt: ''
      });
      setCurrentView('list');
      
    } catch (err) {
      setError('Failed to save blog: ' + err.message);
    }
  };

  // Handle blog deletion
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        if (isBackendConnected) {
          await blogService.deleteBlog(blogId);
          await fetchBlogs();
        } else {
          // Use local storage
          const savedBlogs = JSON.parse(localStorage.getItem('localBlogs') || '[]');
          const filteredBlogs = savedBlogs.filter(blog => blog.id !== blogId);
          localStorage.setItem('localBlogs', JSON.stringify(filteredBlogs));
          setBlogs(filteredBlogs);
          alert('Blog deleted locally!');
        }
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

  // Hero section configuration
  const heroConfig = getHeroConfig('blog');

  // Hero section handlers
  const handlePrimaryAction = () => {
    // Scroll to blog content
    const blogSection = document.querySelector('.blog-content-section');
    if (blogSection) {
      blogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSecondaryAction = () => {
    // Navigate to create blog
    setCurrentView('create');
  };

  const handleVideoClick = () => {
    // You can implement video functionality here
    console.log('Video clicked');
  };

  // Render loading state
  if (loading && !isBackendConnected) {
    return (
      <div className="blog-page">
        <Header />
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
        <Header />
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
      {/* Header Component */}
      <Header />
      
      {/* Scroll Progress Bar */}
      <div className="scroll-progress">
        <div 
          className="scroll-progress-bar" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      
      {/* Hero Section */}
      <HeroSection 
        {...heroConfig}
        onButtonClick={handlePrimaryAction}
        onSecondaryButtonClick={handleSecondaryAction}
        onVideoClick={handleVideoClick}
        customStats={[
          { number: blogs.length.toString(), label: "Articles" },
          { number: blogs.reduce((total, blog) => total + (blog.views || 0), 0).toLocaleString(), label: "Total Views" },
          { number: (categories.length - 1).toString(), label: "Categories" },
          { number: "Daily", label: "New Content" }
        ]}
      />

      {/* Blog Content Section */}
      <section className="blog-content-section">
        <div className="container">
          {/* Connection Status */}
          <div className={`connection-status ${isBackendConnected ? 'connected' : 'disconnected'}`}>
            {isBackendConnected ? '✅ Connected to server' : '❌ Server offline'}
          </div>

      {/* Blog List View */}
      {currentView === 'list' && (
        <div className="blog-content">
          {/* Action Buttons */}
          <div className="blog-actions">
            <button 
              onClick={() => setCurrentView('create')} 
              className="primary-btn"
            >
              <Edit3 size={16} />
              Write New Blog
            </button>
          </div>

          {/* Blog Grid - Same as Home Page */}
          <BlogPostsGrid 
            blogPosts={blogPostsData}
            title="Latest from Our Blog"
            subtitle="Expert advice and tips for your beloved pets"
            variant="home"
            maxPosts={6}
            showViewAll={true}
            showActions={false}
            loading={false}
            onBlogClick={(blog) => {
              setSelectedBlog(blog);
              setCurrentView('view');
            }}
            onViewAllBlogs={() => {
              console.log('Navigate to all blogs');
              // Add navigate to blog page logic here
            }}
          />

          {/* User Created Blogs Section */}
          {blogs.length > 0 && (
            <div style={{ marginTop: '3rem' }}>
              <BlogPostsGrid 
                blogPosts={blogs}
                title="Your Published Blogs"
                subtitle="Blogs you've created and published"
                variant="home"
                maxPosts={null}
                showViewAll={false}
                showActions={true}
                loading={false}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onBlogClick={(blog) => handleView(blog)}
              />
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Blog Form */}
      {(currentView === 'create' || currentView === 'edit') && (
        <div className="blog-form-container">
          <div className="form-header">
            <button 
              onClick={() => setCurrentView('list')} 
              className="secondary-btn back-btn"
            >
              ← Back to Blogs
            </button>
            <h2>
              <Edit3 size={24} />
              {currentView === 'create' ? 'Write New Blog' : 'Edit Blog'}
            </h2>
            <p className="form-subtitle">
              Share your pet care knowledge and connect with the community
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="blog-form">
            <div className="form-group">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder=""
                id="title"
              />
              <label htmlFor="title">
                <BookOpen size={16} />
                Title
              </label>
            </div>

            <div className="form-group">
              <label>
                <MessageCircle size={16} />
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                required
                placeholder="Write a compelling brief description that will attract readers..."
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <Filter size={16} />
                  Category
                </label>
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
                <label>
                  <Tag size={16} />
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  placeholder="pet care, tips, health, nutrition..."
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <Globe size={16} />
                Featured Image URL (optional)
              </label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData({...formData, featuredImage: e.target.value})}
                placeholder="https://example.com/your-pet-image.jpg"
              />
            </div>

            <div className="form-group">
              <label>
                <Edit3 size={16} />
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                placeholder="Share your pet care knowledge, tips, experiences, or stories here. Use **text** for bold headings and *text* for emphasis."
                rows="15"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={() => setCurrentView('list')} className="secondary-btn">
                <X size={16} />
                Cancel
              </button>
              <button type="submit" className="primary-btn">
                <Save size={16} />
                {currentView === 'create' ? 'Publish Blog' : 'Update Blog'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Single Blog */}
      {currentView === 'view' && selectedBlog && (
        <div className="blog-view-container">
          <button 
            onClick={() => setCurrentView('list')} 
            className="secondary-btn back-btn"
          >
            ← Back to Blogs
          </button>
          <article className="blog-article">
            {(selectedBlog.featuredImage || selectedBlog.image) && (
              <div className="article-image">
                <img src={selectedBlog.featuredImage || selectedBlog.image} alt={selectedBlog.title} />
              </div>
            )}
            
            <div className="article-header">
              <div className="article-meta">
                <span className="article-category">{selectedBlog.category?.name || selectedBlog.category}</span>
                <span className="article-date">{formatDate(selectedBlog.publishDate || selectedBlog.createdAt)}</span>
                <span className="article-author">By {selectedBlog.author?.name || selectedBlog.author}</span>
                {selectedBlog.views && <span className="article-views">👁 {selectedBlog.views} views</span>}
                {selectedBlog.readTime && <span className="article-read-time">⏱ {selectedBlog.readTime}</span>}
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
              {selectedBlog.content ? (
                // User-created blog with full content
                selectedBlog.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <h2 key={index}>{paragraph.slice(2, -2)}</h2>;
                  } else if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                    return <h3 key={index}>{paragraph.slice(1, -1)}</h3>;
                  } else if (paragraph.trim()) {
                    return <p key={index}>{paragraph}</p>;
                  } else {
                    return <br key={index} />;
                  }
                })
              ) : (
                // Static blog from blogPostsData - show expanded snippet
                <div>
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                    {selectedBlog.snippet || selectedBlog.excerpt}
                  </p>
                  
                  <div className="static-blog-notice">
                    <h3>📚 This is a featured article from our expert team</h3>
                    <p>
                      This article is part of our curated collection of pet care expertise. 
                      Our team of veterinarians and pet care specialists have carefully crafted 
                      this content to provide you with the most reliable and helpful information 
                      for your beloved pets.
                    </p>
                    
                    <div className="article-highlights">
                      <h4>Key Takeaways:</h4>
                      <ul>
                        <li>Expert-reviewed content from certified professionals</li>
                        <li>Based on the latest veterinary research and best practices</li>
                        <li>Practical tips you can implement immediately</li>
                        <li>Safe and proven methods for pet care</li>
                      </ul>
                    </div>
                    
                    <div className="related-topics">
                      <h4>Related Topics:</h4>
                      <div className="topic-tags">
                        <span className="topic-tag">{selectedBlog.category}</span>
                        <span className="topic-tag">Pet Health</span>
                        <span className="topic-tag">Expert Advice</span>
                        <span className="topic-tag">Pet Care Tips</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Show edit/delete actions only for user-created blogs */}
            {selectedBlog.content && (
              <div className="article-actions">
                <button onClick={() => handleEdit(selectedBlog)} className="edit-btn">
                  Edit Blog
                </button>
                <button onClick={() => handleDelete(selectedBlog._id || selectedBlog.id)} className="delete-btn">
                  Delete Blog
                </button>
              </div>
            )}
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
      </section>

      {/* Floating Action Button */}
      {showFloatingButton && (
        <button 
          className="floating-action-btn" 
          onClick={scrollToTop}
          title="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default BlogPage;
