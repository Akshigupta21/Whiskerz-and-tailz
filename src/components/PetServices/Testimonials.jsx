import React, { useState } from 'react';
import './Testimonials.css';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Robbin",
      location: "Bazil", 
      rating: 2,
      text: "Hic dignissimos quidem ex autem aut omnis nisl commodi perspiciatis sed consectetur. Sit nisi error et voluptas placeat vel voluptas dicusci quibus dam. Rem dolorem culpa et neque voluptatibusie maxime.",
      avatar: "/api/placeholder/50/50"
    },
    {
      id: 2,
      name: "Lillian E",
      location: "UK",
      rating: 4,
      text: "Ut soluta numquam ut sunt enim eos reprehendae nemo cum consectetur ipsum aut laboriosam aut harum fugit. Qui quis provident et sunt eventiet qui quia repellat ab aperiam quibusdam at explicabo ullam dis.",
      avatar: "/api/placeholder/50/50"
    },
    {
      id: 3,
      name: "Nancy L",
      location: "Delhi", 
      rating: 3,
      text: "Sit illum sequi et doloremque consequatur qui non fuga inventore a enim quis qui libero obcaecati sit eveniet galisum. Non nesciunt deserunt et facilis iste sed consequuntur totam eos autem minus et quaerat eaque.",
      avatar: "/api/placeholder/50/50"
    },
    {
      id: 4,
      name: "Sarah M",
      location: "New York",
      rating: 5,
      text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      avatar: "/api/placeholder/50/50"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ⭐
      </span>
    ));
  };

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2 className="testimonials-title">Care Above Your Expectations</h2>
        </div>

        <div className="testimonials-slider">
          <div 
            className="testimonials-track"
            style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-content">
                  <p className="testimonial-text">"{testimonial.text}"</p>
                  
                  <div className="testimonial-rating">
                    {renderStars(testimonial.rating)}
                  </div>
                  
                  <div className="testimonial-author">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <h4 className="author-name">{testimonial.name}</h4>
                      <p className="author-location">– {testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-controls">
          <button className="slider-btn prev" onClick={prevSlide}>
            ‹
          </button>
          <div className="slider-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          <button className="slider-btn next" onClick={nextSlide}>
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
