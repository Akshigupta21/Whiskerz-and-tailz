// BlogPostsGrid Usage Examples

// 1. Home Page Usage
import BlogPostsGrid from '../components/BlogPostsGrid';

// In HomePage.js
<BlogPostsGrid 
  blogPosts={blogPostsData}
  title="Latest from Our Blog"
  subtitle="Expert advice and tips for your beloved pets"
  variant="home"
  maxPosts={6}
  showViewAll={true}
  onBlogClick={(blog) => {
    console.log('Navigate to blog:', blog);
    // Add blog navigation logic here
  }}
  onViewAllBlogs={() => {
    console.log('Navigate to all blogs');
    // Add navigate to blog page logic here
  }}
/>

// 2. Blog Page Usage
// In BlogPage.jsx
<BlogPostsGrid
  blogPosts={blogs}
  title="Pet Care Stories & Tips"
  subtitle="Discover expert advice and heartwarming stories from our community"
  variant="blog"
  showViewAll={false}
  maxPosts={null}
  showActions={true}
  loading={loading}
  onView={handleView}
  onEdit={(blog) => {
    if (blog === 'create') {
      setCurrentView('create');
    } else {
      handleEdit(blog);
    }
  }}
  onDelete={handleDelete}
  onBlogClick={(blog) => handleView(blog)}
/>

// 3. Props Documentation
/*
BlogPostsGrid Props:
- blogPosts: Array of blog post objects
- title: Section title (default: "Latest from Our Blog")
- subtitle: Section subtitle (default: "Expert advice and tips for your beloved pets")
- variant: "home" or "blog" (affects styling and layout)
- maxPosts: Number of posts to display (null for all)
- showViewAll: Show "View All Blogs" button
- showActions: Show CRUD action buttons (edit, delete, read)
- loading: Show loading state
- onBlogClick: Function called when blog card is clicked
- onViewAllBlogs: Function called when "View All" is clicked
- onView: Function for viewing a blog
- onEdit: Function for editing a blog
- onDelete: Function for deleting a blog
*/

export default BlogPostsGrid;
