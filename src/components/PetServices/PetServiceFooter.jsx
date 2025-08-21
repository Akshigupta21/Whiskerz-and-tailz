import React from 'react';
import './PetServiceFooter.css';

const PetServiceFooter = () => {
  return (
    <footer className="pet-service-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand-logo">
              <h2 className="brand-name">SweetHeart</h2>
              <div className="brand-icon">🐾</div>
            </div>
            <p className="brand-description">
              Ut dignissimos voluptatem qui molestiae consequatur sit delectus 
              voluptatem non nihil quia est quibusdam ipsum. Est suscipit natus a 
              dignissimos facilis qui voluptate.
            </p>
            
            <div className="app-download">
              <h4 className="download-title">Download App :</h4>
              <div className="download-buttons">
                <a href="#" className="download-btn apple">
                  <img src="/api/placeholder/150/50" alt="Download on App Store" />
                </a>
                <a href="#" className="download-btn google">
                  <img src="/api/placeholder/150/50" alt="Get it on Google Play" />
                </a>
              </div>
            </div>
          </div>

          <div className="footer-contact">
            <h3 className="footer-section-title">Contact Info</h3>
            
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <span className="contact-text">
                No: 58 A, East Madison Street, Baltimore, MD, USA 4508
              </span>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <span className="contact-text">+1234 567 890</span>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <span className="contact-text">sweetheart@example.com</span>
            </div>

            <div className="social-links">
              <a href="#" className="social-link instagram">📷</a>
              <a href="#" className="social-link facebook">📘</a>
              <a href="#" className="social-link twitter">🐦</a>
              <a href="#" className="social-link pinterest">📌</a>
              <a href="#" className="social-link youtube">📺</a>
            </div>
          </div>

          <div className="footer-links">
            <h3 className="footer-section-title">Find Out About Us</h3>
            <ul className="footer-link-list">
              <li><a href="#" className="footer-link">Your Orders</a></li>
              <li><a href="#" className="footer-link">Returns & Replacements</a></li>
              <li><a href="#" className="footer-link">Shipping Rates & Policies</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © 2025 SweetHeart Pet Services. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PetServiceFooter;
