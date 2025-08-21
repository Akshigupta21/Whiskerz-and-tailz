import React, { useState, useEffect } from 'react';
import './Testimonials.css';

function Testimonials({ testimonials }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-slide functionality
  useEffect(() => {
    if (isAutoPlaying && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Generate random avatar colors
  const getAvatarColor = (name) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Generate rating stars
  const generateStars = (rating = 5) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <span className="section-badge">💝 TESTIMONIALS</span>
        <h2>What Pet Parents Say</h2>
        <p className="section-description">
          Don't just take our word for it - hear from our amazing community of pet parents
          who trust us with their beloved companions every day.
        </p>
      </div>

      <div className="testimonials-container">
        {/* Featured testimonial slider */}
        <div className="featured-testimonial">
          <div className="testimonial-slider">
            <div 
              className="testimonial-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div className="featured-testimonial-card" key={testimonial.id}>
                  <div className="quote-icon">"</div>
                  <p className="featured-review">{testimonial.review}</p>
                  <div className="featured-customer-info">
                    <div 
                      className="customer-avatar"
                      style={{ backgroundColor: getAvatarColor(testimonial.customer) }}
                    >
                      {testimonial.customer.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-details">
                      <h4 className="customer-name">{testimonial.customer}</h4>
                      <div className="rating">{generateStars(5)}</div>
                      <p className="service-badge">{testimonial.service}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation controls */}
          <div className="testimonial-controls">
            <button className="nav-btn prev-btn" onClick={prevSlide}>
              <span>‹</span>
            </button>
            <button className="nav-btn next-btn" onClick={nextSlide}>
              <span>›</span>
            </button>
          </div>

          {/* Dots indicator */}
          <div className="dots-indicator">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div className="testimonials-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.9</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1000+</div>
            <div className="stat-label">Services Completed</div>
          </div>
        </div>

        {/* All testimonials grid */}
        <div className="all-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div 
              className={`testimonial-card ${index === currentSlide ? 'highlighted' : ''}`} 
              key={`grid-${testimonial.id}`}
              onClick={() => goToSlide(index)}
            >
              <div className="card-header">
                <div 
                  className="customer-avatar small"
                  style={{ backgroundColor: getAvatarColor(testimonial.customer) }}
                >
                  {testimonial.customer.charAt(0).toUpperCase()}
                </div>
                <div className="customer-info">
                  <h5 className="customer-name">{testimonial.customer}</h5>
                  <div className="rating small">{generateStars(5)}</div>
                </div>
              </div>
              <p className="review-text">{testimonial.review}</p>
              <div className="service-tag">{testimonial.service}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;