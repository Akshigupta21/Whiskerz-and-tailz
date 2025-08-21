import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-col about-us">
            <div className="logo">
              <div className="logo-icon">
                <i className="fas fa-paw"></i>
              </div>
              <span>Wiskerz & Tails</span>
            </div>
            <p className="about-text"> 
              Your trusted companion for all pet needs across India. We provide premium quality products, 
              expert services, and loving care for your beloved furry friends.
            </p>
            <div className="social-icons">
              <a href="#" className="social-link facebook" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link twitter" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link instagram" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link youtube" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="social-link whatsapp" aria-label="WhatsApp">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
            <div className="newsletter-section">
              <h4>Stay Updated</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" className="newsletter-input" />
                <button className="newsletter-btn">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="footer-col quick-links">
            <h3><i className="fas fa-link"></i> Quick Links</h3>
            <ul>
              <li><a href="/home"><i className="fas fa-home"></i> Home</a></li>
              <li><a href="/about"><i className="fas fa-info-circle"></i> About Us</a></li>
              <li><a href="/services"><i className="fas fa-cogs"></i> Services</a></li>
              <li><a href="/shop"><i className="fas fa-shopping-bag"></i> Shop</a></li>
              <li><a href="/blog"><i className="fas fa-blog"></i> Blog</a></li>
              <li><a href="/pet-adoption"><i className="fas fa-heart"></i> Pet Adoption</a></li>
              <li><a href="/contact"><i className="fas fa-envelope"></i> Contact</a></li>
            </ul>
          </div>

          <div className="footer-col services-links">
            <h3><i className="fas fa-star"></i> Our Services</h3>
            <ul>
              <li><a href="/services/grooming"><i className="fas fa-cut"></i> Pet Grooming</a></li>
              <li><a href="/services/veterinary"><i className="fas fa-stethoscope"></i> Veterinary Care</a></li>
              <li><a href="/services/training"><i className="fas fa-graduation-cap"></i> Pet Training</a></li>
              <li><a href="/services/boarding"><i className="fas fa-bed"></i> Pet Boarding</a></li>
              <li><a href="/services/adoption"><i className="fas fa-hands-helping"></i> Pet Adoption</a></li>
              <li><a href="/services/taxi"><i className="fas fa-car"></i> Pet Taxi</a></li>
              <li><a href="/services/emergency"><i className="fas fa-ambulance"></i> Emergency Care</a></li>
            </ul>
          </div>

          <div className="footer-col contact-us">
            <h3><i className="fas fa-phone"></i> Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <strong>Visit Us</strong>
                  <p>123 Pet Street, Connaught Place<br />New Delhi, India 110001</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-phone-alt"></i>
                <div>
                  <strong>Call Us</strong>
                  <p>+91 98765 43210<br />+91 11 4567 8900</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <div>
                  <strong>Email Us</strong>
                  <p>info@wiskerzandtail.com<br />support@wiskerzandtail.com</p>
                </div>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <div>
                  <strong>Working Hours</strong>
                  <p>Mon - Sat: 9:00 AM - 8:00 PM<br />Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            
            <div className="payment-section">
              <h4><i className="fas fa-credit-card"></i> We Accept</h4>
              <div className="payment-icons">
                <div className="payment-item" title="Visa">
                  <i className="fab fa-cc-visa"></i>
                </div>
                <div className="payment-item" title="MasterCard">
                  <i className="fab fa-cc-mastercard"></i>
                </div>
                <div className="payment-item" title="PayPal">
                  <i className="fab fa-cc-paypal"></i>
                </div>
                <div className="payment-item" title="UPI">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <div className="payment-item" title="Paytm">
                  <i className="fas fa-wallet"></i>
                </div>
                <div className="payment-item" title="Cash on Delivery">
                  <i className="fas fa-money-bill-wave"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; 2025 PET LOVER. All rights reserved.</p>
              <p>Made with <i className="fas fa-heart"></i> for pet lovers in India</p>
            </div>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/sitemap">Sitemap</a>
            </div>
            <div className="certifications">
              <div className="cert-item" title="Trusted by 10,000+ pet parents">
                <i className="fas fa-shield-alt"></i>
                <span>Trusted</span>
              </div>
              <div className="cert-item" title="24/7 Customer Support">
                <i className="fas fa-headset"></i>
                <span>24/7 Support</span>
              </div>
              <div className="cert-item" title="100% Secure Payments">
                <i className="fas fa-lock"></i>
                <span>Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="back-to-top" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        <i className="fas fa-chevron-up"></i>
      </div>
    </footer>
  );
}

export default Footer;