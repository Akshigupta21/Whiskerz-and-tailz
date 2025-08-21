import React from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription submitted');
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2 className="newsletter-title">
              Subscribe our Newsletter for the Latest Updates & Offers
            </h2>
          </div>
          
          <div className="newsletter-form-container">
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Your mail id here"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-submit">
                  Submit
                </button>
              </div>
            </form>
            
            <p className="newsletter-disclaimer">
              *Some exclusions apply. See <a href="#" className="terms-link">Terms & Conditions</a> for details
            </p>
          </div>
          
          <div className="newsletter-decoration">
            <div className="decoration-dots"></div>
            <div className="decoration-pattern"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
