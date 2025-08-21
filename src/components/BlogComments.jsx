import React, { useState } from 'react';
import { MessageCircle, Send, Heart, Trash2, Reply } from 'lucide-react';
import './BlogComments.css';

const BlogComments = ({ blogId, comments = [], onAddComment, onDeleteComment, onLikeComment }) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      text: newComment,
      author: 'You', // In a real app, this would be the logged-in user
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      isLiked: false,
      replies: []
    };

    onAddComment(blogId, comment);
    setNewComment('');
  };

  const handleSubmitReply = (e, commentId) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const reply = {
      id: Date.now(),
      text: replyText,
      author: 'You',
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      isLiked: false
    };

    // In a real app, you'd have a separate function for adding replies
    // For now, we'll just clear the reply form
    setReplyText('');
    setReplyTo(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-comments">
      <div className="blog-comments__header">
        <MessageCircle size={20} />
        <h3>Comments ({comments.length})</h3>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="blog-comments__form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts about this post..."
          rows="3"
          className="blog-comments__textarea"
        />
        <button type="submit" className="blog-comments__submit" disabled={!newComment.trim()}>
          <Send size={16} />
          Post Comment
        </button>
      </form>

      {/* Comments List */}
      <div className="blog-comments__list">
        {comments.length === 0 ? (
          <div className="blog-comments__empty">
            <MessageCircle size={32} />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="blog-comment">
              <div className="blog-comment__header">
                <div className="blog-comment__author">
                  <div className="blog-comment__avatar">
                    {comment.author.charAt(0).toUpperCase()}
                  </div>
                  <div className="blog-comment__info">
                    <span className="blog-comment__name">{comment.author}</span>
                    <span className="blog-comment__date">{formatDate(comment.date)}</span>
                  </div>
                </div>
                
                {comment.author === 'You' && (
                  <button 
                    className="blog-comment__delete"
                    onClick={() => onDeleteComment(blogId, comment.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="blog-comment__content">
                <p>{comment.text}</p>
              </div>

              <div className="blog-comment__actions">
                <button 
                  className={`blog-comment__action ${comment.isLiked ? 'blog-comment__action--liked' : ''}`}
                  onClick={() => onLikeComment(blogId, comment.id)}
                >
                  <Heart size={14} />
                  {comment.likes}
                </button>
                
                <button 
                  className="blog-comment__action"
                  onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                >
                  <Reply size={14} />
                  Reply
                </button>
              </div>

              {/* Reply Form */}
              {replyTo === comment.id && (
                <form 
                  onSubmit={(e) => handleSubmitReply(e, comment.id)}
                  className="blog-comment__reply-form"
                >
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.author}...`}
                    rows="2"
                    className="blog-comment__reply-textarea"
                  />
                  <div className="blog-comment__reply-actions">
                    <button type="submit" className="btn btn--primary btn--small" disabled={!replyText.trim()}>
                      Reply
                    </button>
                    <button 
                      type="button" 
                      className="btn btn--secondary btn--small"
                      onClick={() => {
                        setReplyTo(null);
                        setReplyText('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="blog-comment__replies">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="blog-comment blog-comment--reply">
                      <div className="blog-comment__header">
                        <div className="blog-comment__author">
                          <div className="blog-comment__avatar blog-comment__avatar--small">
                            {reply.author.charAt(0).toUpperCase()}
                          </div>
                          <div className="blog-comment__info">
                            <span className="blog-comment__name">{reply.author}</span>
                            <span className="blog-comment__date">{formatDate(reply.date)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="blog-comment__content">
                        <p>{reply.text}</p>
                      </div>

                      <div className="blog-comment__actions">
                        <button 
                          className={`blog-comment__action ${reply.isLiked ? 'blog-comment__action--liked' : ''}`}
                        >
                          <Heart size={14} />
                          {reply.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogComments;
