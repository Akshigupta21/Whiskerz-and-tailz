import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Heart, Clock, Star, Users, PawPrint } from 'lucide-react';
import './PetAdoptionAgencies.css';

function PetAdoptionAgencies({ agencies }) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const agenciesToDisplay = agencies || [];

  const handleContactClick = (agency, contactType) => {
    if (contactType === 'phone') {
      window.open(`tel:${agency.phone}`, '_self');
    } else if (contactType === 'email') {
      window.open(`mailto:${agency.email}`, '_self');
    } else if (contactType === 'website') {
      window.open(agency.website, '_blank');
    }
  };

  return (
    <section className="pet-adoption-agencies-section">
      <div className="agencies-container">
        <div className="agencies-header">
          <div className="header-icon">
            <Heart className="heart-icon" />
            <PawPrint className="paw-icon" />
          </div>
          <h2>Find Your Perfect Companion</h2>
          <p>Connect with trusted adoption centers and give a loving home to pets in need</p>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Pets Adopted</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Partner Agencies</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>

        <div className="agencies-grid">
          {agenciesToDisplay.length > 0 ? (
            agenciesToDisplay.map((agency, index) => (
              <div 
                className={`agency-card ${hoveredCard === agency.id ? 'hovered' : ''}`}
                key={agency.id}
                onMouseEnter={() => setHoveredCard(agency.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="agency-image">
                  <img 
                    src={agency.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=200&fit=crop'} 
                    alt={agency.name}
                  />
                  <div className="agency-badge">
                    <Star className="star-icon" />
                    <span>{agency.rating || '4.8'}</span>
                  </div>
                  {agency.isVerified && (
                    <div className="verified-badge">
                      <div className="verified-checkmark">✓</div>
                    </div>
                  )}
                </div>

                <div className="agency-content">
                  <div className="agency-header">
                    <h3 className="agency-name">{agency.name}</h3>
                    <div className="agency-type">
                      {agency.type || 'Adoption Center'}
                    </div>
                  </div>

                  <div className="agency-info">
                    <div className="info-item">
                      <MapPin size={16} />
                      <span>{agency.location}</span>
                    </div>
                    
                    {agency.hours && (
                      <div className="info-item">
                        <Clock size={16} />
                        <span>{agency.hours}</span>
                      </div>
                    )}

                    {agency.specialties && (
                      <div className="info-item">
                        <PawPrint size={16} />
                        <span>{agency.specialties.join(', ')}</span>
                      </div>
                    )}

                    {agency.petsAvailable && (
                      <div className="info-item">
                        <Users size={16} />
                        <span>{agency.petsAvailable} pets available</span>
                      </div>
                    )}
                  </div>

                  {agency.description && (
                    <p className="agency-description">{agency.description}</p>
                  )}

                  <div className="agency-actions">
                    <button 
                      className="primary-btn"
                      onClick={() => handleContactClick(agency, 'website')}
                    >
                      <Heart size={16} />
                      View Pets
                    </button>
                    
                    <div className="contact-buttons">
                      {agency.phone && (
                        <button 
                          className="contact-btn phone-btn"
                          onClick={() => handleContactClick(agency, 'phone')}
                          title="Call"
                        >
                          <Phone size={16} />
                        </button>
                      )}
                      
                      {agency.email && (
                        <button 
                          className="contact-btn email-btn"
                          onClick={() => handleContactClick(agency, 'email')}
                          title="Email"
                        >
                          <Mail size={16} />
                        </button>
                      )}
                      
                      <button 
                        className="contact-btn website-btn"
                        onClick={() => handleContactClick(agency, 'website')}
                        title="Website"
                      >
                        <Globe size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-agencies">
              <div className="no-agencies-icon">
                <Heart size={64} />
              </div>
              <h3>No adoption agencies found</h3>
              <p>We're working to partner with more adoption centers in your area.</p>
              <button className="suggest-btn">
                Suggest an Agency
              </button>
            </div>
          )}
        </div>

        <div className="agencies-footer">
          <div className="footer-content">
            <h3>Want to Help More?</h3>
            <p>Consider volunteering or donating to support these amazing organizations</p>
            <div className="footer-actions">
              <button className="secondary-btn">
                <Heart size={16} />
                Volunteer
              </button>
              <button className="secondary-btn">
                <PawPrint size={16} />
                Donate
              </button>
              <button className="secondary-btn">
                <Users size={16} />
                Foster
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PetAdoptionAgencies;