import React from 'react';
import './HeroSection.css';

function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1>We Care Of Your Beloved Paws</h1>
          <p>
            Emphasis compassionate, high quality pet services tailored to
            ensure your furry companions receive the love, attention and
            professional care they need to thrive.
          </p>
          <div className="call-support">
            <span>24H</span> Call support
          </div>
          <div className="hero-buttons">
            <button className="btn-primary">Our Service</button>
            <button
  onClick={() => window.location.href = '/food'}
  className="btn-secondary"
>
  Shop Food
</button>
          </div>
        </div>
        <div className="hero-image">
          {/* Changed local path to a placeholder image URL */}
          <img src="https://via.placeholder.com/600x400?text=Happy+Dog" alt="Happy dog" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;