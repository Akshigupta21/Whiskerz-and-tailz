import React, { useState } from 'react';
import { MapPin, Phone, Clock, Star, Navigation, ExternalLink, Store, Users, Shield, Award } from 'lucide-react';
import './NearbyPetShops.css';

function NearbyPetShops({ shops }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const shopsToDisplay = shops || [];

  const handleCallShop = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleGetDirections = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleVisitWebsite = (website) => {
    if (website && website !== '#') {
      window.open(website, '_blank');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} fill="#ffc107" color="#ffc107" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" size={14} fill="none" color="#ffc107" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} fill="none" color="#e0e0e0" />);
    }

    return stars;
  };

  return (
    <section className="nearby-pet-shops-section">
      <div className="shops-container">
        <div className="shops-header">
          <div className="header-icon">
            <Store className="store-icon" />
            <Navigation className="nav-icon" />
          </div>
          <h2>Discover Local Pet Stores</h2>
          <p>Find trusted pet shops near you with quality products and expert advice</p>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Partner Stores</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Emergency Support</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5★</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>

        <div className="shops-grid">
          {shopsToDisplay.length > 0 ? (
            shopsToDisplay.map((shop, index) => (
              <div 
                className={`shop-card ${hoveredCard === shop.id ? 'hovered' : ''}`}
                key={shop.id}
                onMouseEnter={() => setHoveredCard(shop.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="shop-image">
                  <img 
                    src={shop.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop'} 
                    alt={shop.name}
                  />
                  <div className="shop-badge">
                    <div className="rating-badge">
                      <Star className="star-icon" fill="#ffc107" color="#ffc107" />
                      <span>{shop.rating || '4.5'}</span>
                    </div>
                  </div>
                  {shop.isVerified && (
                    <div className="verified-badge">
                      <Shield size={16} />
                      <span>Verified</span>
                    </div>
                  )}
                  {shop.isTopRated && (
                    <div className="top-rated-badge">
                      <Award size={16} />
                      <span>Top Rated</span>
                    </div>
                  )}
                </div>

                <div className="shop-content">
                  <div className="shop-header">
                    <h3 className="shop-name">{shop.name}</h3>
                    <div className="shop-type">
                      {shop.type || 'Pet Store'}
                    </div>
                  </div>

                  <div className="shop-rating">
                    <div className="stars">
                      {renderStars(shop.rating || 4.5)}
                    </div>
                    <span className="rating-text">
                      {shop.rating || '4.5'} ({shop.reviews || '125'} reviews)
                    </span>
                  </div>

                  <div className="shop-info">
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>{shop.address}</span>
                    </div>
                    
                    <div className="info-item">
                      <Phone size={16} />
                      <span>{shop.phone}</span>
                    </div>

                    {shop.hours && (
                      <div className="info-item">
                        <Clock size={16} />
                        <span>{shop.hours}</span>
                      </div>
                    )}

                    {shop.specialties && (
                      <div className="info-item">
                        <Store size={16} />
                        <span>{shop.specialties.join(', ')}</span>
                      </div>
                    )}

                    {shop.customerCount && (
                      <div className="info-item">
                        <Users size={16} />
                        <span>{shop.customerCount}+ Happy Customers</span>
                      </div>
                    )}
                  </div>

                  {shop.description && (
                    <p className="shop-description">{shop.description}</p>
                  )}

                  <div className="shop-features">
                    {shop.features && shop.features.map((feature, idx) => (
                      <span key={idx} className="feature-tag">
                        ✓ {feature}
                      </span>
                    ))}
                  </div>

                  <div className="shop-actions">
                    <button 
                      className="primary-btn"
                      onClick={() => handleGetDirections(shop.address)}
                    >
                      <Navigation size={16} />
                      Get Directions
                    </button>
                    
                    <div className="contact-buttons">
                      <button 
                        className="contact-btn phone-btn"
                        onClick={() => handleCallShop(shop.phone)}
                        title="Call Shop"
                      >
                        <Phone size={16} />
                      </button>
                      
                      {shop.website && shop.website !== '#' && (
                        <button 
                          className="contact-btn website-btn"
                          onClick={() => handleVisitWebsite(shop.website)}
                          title="Visit Website"
                        >
                          <ExternalLink size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-shops">
              <div className="no-shops-icon">
                <Store size={64} />
              </div>
              <h3>No Pet Shops Found</h3>
              <p>We're working to partner with more pet stores in your area.</p>
              <button className="suggest-btn">
                Suggest a Store
              </button>
            </div>
          )}
        </div>

        <div className="shops-footer">
          <div className="footer-content">
            <h3>Can't Find What You're Looking For?</h3>
            <p>Let us know what products or services you need, and we'll help you find the right pet store</p>
            <div className="footer-actions">
              <button className="secondary-btn">
                <Store size={16} />
                Find Specialty Store
              </button>
              <button className="secondary-btn">
                <Phone size={16} />
                Call Support
              </button>
              <button className="secondary-btn">
                <MapPin size={16} />
                Expand Search Area
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NearbyPetShops;