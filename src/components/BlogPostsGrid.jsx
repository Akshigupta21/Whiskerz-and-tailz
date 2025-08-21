import React from 'react';
import { Eye, Heart, MessageCircle, Clock, User, ArrowRight, Edit3, Trash2, BookOpen, Tag, Calendar } from 'lucide-react';
import './BlogPostsGrid.css';

function BlogPostsGrid({ 
  blogPosts = [], 
  onBlogClick, 
  onViewAllBlogs, 
  title = "Latest from Our Blog",
  subtitle = "Expert advice and tips for your beloved pets",
  showViewAll = true,
  maxPosts = 6,
  variant = "home", // "home" or "blog"
  showActions = false, // For blog page CRUD operations
  onEdit,
  onDelete,
  onView,
  loading = false
}) {
  const postsToDisplay = maxPosts ? blogPosts.slice(0, maxPosts) : blogPosts;

  const handleBlogClick = (blog) => {
    if (onBlogClick && typeof onBlogClick === 'function') {
      onBlogClick(blog);
    } else {
      console.log('Blog clicked:', blog);
    }
  };

  const handleViewAllBlogs = () => {
    if (onViewAllBlogs) {
      onViewAllBlogs('all');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Training': '#667eea',
      'Behavior': '#f093fb',
      'Health': '#4facfe',
      'Care': '#43e97b',
      'Pet Care': '#43e97b',
      'Aquarium': '#38f9d7',
      'Entertainment': '#ffecd2',
      'Nutrition': '#fa709a',
      'Safety': '#ff9a9e',
      'Grooming': '#a8edea',
      'Exercise': '#ffd89b',
      'Adoption Stories': '#fd79a8',
      'General': '#81ecec'
    };
    return colors[category] || '#667eea';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateReadTime = (content) => {
    if (!content) return '5 min';
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min`;
  };

  if (loading) {
    return (
      <section className={`blog-posts-grid-section ${variant}`}>
        <div className="blog-header">
          <div className="blog-title-container">
            <h2 className="blog-section-title">{title}</h2>
            <p className="blog-section-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading amazing content...</p>
        </div>
      </section>
    );
  }

  if (!blogPosts || blogPosts.length === 0) {
    return (
      <section className={`blog-posts-grid-section ${variant}`}>
        <div className="blog-header">
          <div className="blog-title-container">
            <h2 className="blog-section-title">{title}</h2>
            <p className="blog-section-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="no-blog-posts">
          <div className="no-posts-icon">
            {variant === "blog" ? <BookOpen size={64} /> : "📝"}
          </div>
          <h3>{variant === "blog" ? "No Stories Yet" : "No Blog Posts Available"}</h3>
          <p>
            {variant === "blog" 
              ? "Be the first to share your pet care wisdom with the community!" 
              : "Stay tuned for exciting content about pet care and tips!"
            }
          </p>
          {variant === "blog" && onEdit && (
            <button 
              onClick={() => onEdit('create')} 
              className="primary-btn"
            >
              <Edit3 size={16} />
              Write Your First Story
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={`blog-posts-grid-section ${variant}`}>
      <div className="blog-header">
        <div className="blog-title-container">
          <h2 className="blog-section-title">{title}</h2>
          <p className="blog-section-subtitle">{subtitle}</p>
        </div>
        {showViewAll && variant === "home" && (
          <button className="view-all-blogs-btn" onClick={handleViewAllBlogs}>
            View All Blogs
          </button>
        )}
      </div>

      <div className="blog-posts-grid">
        {postsToDisplay.map((blog, index) => (
          <article 
            key={blog._id || blog.id || index} 
            className="blog-post-card"
            onClick={() => !showActions && handleBlogClick(blog)}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              cursor: showActions ? 'default' : 'pointer'
            }}
          >
            <div className="blog-image-container">
              <img 
                src={blog.featuredImage || blog.image || '/api/placeholder/400/200'} 
                alt={blog.title}
                className="blog-image"
                loading="lazy"
              />
              <div 
                className="blog-category-tag"
                style={{ backgroundColor: getCategoryColor(blog.category?.name || blog.category) }}
              >
                {variant === "blog" && <Tag size={12} />}
                {blog.category?.name || blog.category}
              </div>
            </div>

            <div className="blog-content">
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-snippet">{blog.excerpt || blog.snippet || blog.description}</p>

              <div className="blog-meta">
                <div className="blog-author-info">
                  {blog.author?.avatar ? (
                    <img 
                      src={blog.author.avatar} 
                      alt={blog.author?.name || blog.author || 'Author'}
                      className="author-avatar-img"
                    />
                  ) : (
                    <div className="author-avatar">
                      {getInitials(blog.author?.name || blog.author || 'Author')}
                    </div>
                  )}
                  <div className="author-details">
                    <span className="author-name">
                      {variant === "blog" && <User size={14} />}
                      {blog.author?.name || blog.author || 'Anonymous'}
                    </span>
                    <span className="publish-date">
                      {variant === "blog" && <Calendar size={14} />}
                      {formatDate(blog.publishDate || blog.createdAt || blog.date)}
                    </span>
                  </div>
                </div>

                <div className="blog-stats">
                  {(blog.readTime || blog.content) && (
                    <span>
                      <Clock size={14} />
                      {blog.readTime || calculateReadTime(blog.content)}
                    </span>
                  )}
                  {blog.views && (
                    <span>
                      <Eye size={14} />
                      {blog.views}
                    </span>
                  )}
                  {blog.likes && (
                    <span>
                      <Heart size={14} />
                      {blog.likes}
                    </span>
                  )}
                  {blog.comments && (
                    <span>
                      <MessageCircle size={14} />
                      {blog.comments}
                    </span>
                  )}
                </div>
              </div>

              {showActions ? (
                <div className="blog-actions">
                  <button 
                    onClick={() => onView && onView(blog)} 
                    className="action-btn read-btn"
                  >
                    <BookOpen size={16} />
                    Read More
                  </button>
                  <button 
                    onClick={() => onEdit && onEdit(blog)} 
                    className="action-btn edit-btn"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <button 
                    onClick={() => onDelete && onDelete(blog._id || blog.id)} 
                    className="action-btn delete-btn"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              ) : (
                <div 
                  className="blog-read-more"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBlogClick(blog);
                  }}
                >
                  <span>Read More</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {showViewAll && variant === "home" && (
        <div className="blog-footer">
          <button className="explore-more-btn" onClick={handleViewAllBlogs}>
            <span>Explore All Articles</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </section>
  );
}

export default BlogPostsGrid;
