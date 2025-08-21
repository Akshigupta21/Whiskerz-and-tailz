import React from 'react';
import './PetCareBlog.css';

function PetCareBlog({ blogPosts, onNavigateBlog }) {
  const postsToDisplay = blogPosts ? blogPosts.slice(0, 6) : []; // Show only first 6 posts

  const handleBlogClick = (blog) => {
    if (onNavigateBlog && typeof onNavigateBlog === 'function') {
      onNavigateBlog(blog);
    } else {
      console.log('Blog clicked:', blog);
    }
  };

  const handleViewAllBlogs = () => {
    // Navigate to blog page
    if (onNavigateBlog) {
      onNavigateBlog('all');
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
      'Aquarium': '#38f9d7',
      'Entertainment': '#ffecd2'
    };
    return colors[category] || '#667eea';
  };

  return (
    <section className="pet-care-blog-section">
      <div className="blog-header">
        <div className="blog-title-container">
          <h2 className="blog-section-title">Latest from Our Blog</h2>
          <p className="blog-section-subtitle">Expert advice and tips for your beloved pets</p>
        </div>
        <button className="view-all-blogs-btn" onClick={handleViewAllBlogs}>
          View All Articles →
        </button>
      </div>
      
      <div className="blog-posts-grid">
        {postsToDisplay.length > 0 ? (
          postsToDisplay.map(post => (
            <article 
              className="blog-post-card" 
              key={post.id}
              onClick={() => handleBlogClick(post)}
            >
              <div className="blog-image-container">
                <img src={post.image} alt={post.title} className="blog-image" />
                <div 
                  className="blog-category-tag"
                  style={{ backgroundColor: getCategoryColor(post.category) }}
                >
                  {post.category}
                </div>
              </div>
              
              <div className="blog-content">
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-snippet">{post.snippet}</p>
                
                <div className="blog-meta">
                  <div className="blog-author-info">
                    <div className="author-avatar">
                      <span>{post.author?.charAt(0) || 'A'}</span>
                    </div>
                    <div className="author-details">
                      <span className="author-name">{post.author}</span>
                      <span className="publish-date">{formatDate(post.publishDate)}</span>
                    </div>
                  </div>
                  
                  <div className="blog-stats">
                    <span className="read-time">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                      </svg>
                      {post.readTime}
                    </span>
                    <span className="blog-views">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      {post.views}
                    </span>
                    <span className="blog-likes">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      {post.likes}
                    </span>
                  </div>
                </div>
                
                <div className="blog-read-more">
                  <span className="read-more-text">Read Full Article</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="no-blog-posts">
            <div className="no-posts-icon">📝</div>
            <h3>No blog posts available</h3>
            <p>Check back soon for expert pet care advice and tips!</p>
          </div>
        )}
      </div>
      
      {postsToDisplay.length > 0 && (
        <div className="blog-footer">
          <button className="explore-more-btn" onClick={handleViewAllBlogs}>
            <span>Explore More Articles</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

export default PetCareBlog;