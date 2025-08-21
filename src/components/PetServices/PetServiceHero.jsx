import React from 'react';
import './PetServiceHero.css';

const PetServiceHero = () => {
  return (
    <section className="pet-service-hero">
      <div className="hero-background">
        <div className="hero-image-left">
          <img src="/api/placeholder/300/400" alt="Golden Retriever and Cat" />
        </div>
        <div className="hero-image-right">
          <img src="/api/placeholder/400/500" alt="Woman with Golden Retriever" />
        </div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-subtitle">HEARTFELT PET CONNECTIONS</p>
            <h1 className="hero-title">
              The Beginning Of Every Pet's Journey With The Love.
            </h1>
            <p className="hero-description">
              Cras eleifend turpis fames primis vulputate ornare sagittis. Purus 
              libero feugiat tristique accumsan maurris potenti aliquam.
            </p>
            
            <div className="hero-actions">
              <button className="hero-btn primary">Learn More</button>
              <div className="satisfied-clients">
                <div className="client-avatars">
                  <img src="/api/placeholder/40/40" alt="Client 1" />
                  <img src="/api/placeholder/40/40" alt="Client 2" />
                  <img src="/api/placeholder/40/40" alt="Client 3" />
                  <span className="more-clients">30+</span>
                </div>
                <span className="satisfied-text">
                  Satisfied Clients
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="floating-elements">
        <div className="floating-paw floating-paw-1">🐾</div>
        <div className="floating-paw floating-paw-2">🐾</div>
        <div className="floating-paw floating-paw-3">🐾</div>
      </div>
    </section>
  );
};

export default PetServiceHero;
