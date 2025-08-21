import React from "react";
import "./Testimonial.css";

function Testimonials() {
  const testimonials = [
    {
      text: "The grain-free formula has been amazing for my dog's sensitive stomach. His coat is shinier, and he's more energetic than ever. The auto-delivery ensures we never run out!",
      rating: 5,
      author: "Rebecca T.",
      pet: "Dog Owner",
      avatar: "https://placehold.co/60x60/DDC1FF/8C00FF?text=RT",
    },
    {
      text: "My senior cat was losing weight until we switched to the senior-specific formula recommended during our nutrition consultation. She's back to a healthy weight and more active!",
      rating: 4.5,
      author: "Michael P.",
      pet: "Cat Owner",
      avatar: "https://placehold.co/60x60/C1FFDD/00FF8C?text=MP",
    },
    {
      text: "The hypoallergenic food has been a game-changer for my dog with food allergies. No more itching and digestive issues. Worth every penny for his comfort and health!",
      rating: 5,
      author: "Sophia K.",
      pet: "Dog Owner",
      avatar: "https://placehold.co/60x60/FFC1DD/FF008C?text=SK",
    },
  ];

  function StarRating({ rating }) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="star-rating" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="full-star">
            ★
          </span>
        ))}
        {halfStar && (
          <span className="half-star" key="half">
            ★
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="empty-star">
            ★
          </span>
        ))}
      </div>
    );
  }

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2 className="testimonials-title">What Pet Parents Say</h2>
        <p className="testimonials-subtitle">
          Hear from pet owners who have seen the difference quality nutrition
          makes.
        </p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <div className="testimonial-rating">
              <StarRating rating={testimonial.rating} />
              <span className="rating-label">{testimonial.rating.toFixed(1)}</span>
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-author">
              <img
                src={testimonial.avatar}
                alt={testimonial.author}
                className="author-avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/60x60/CCCCCC/333333?text=User";
                }}
              />
              <div className="author-info">
                <p className="author-name">{testimonial.author}</p>
                <p className="author-pet">{testimonial.pet}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
