import React, { useState, useEffect } from 'react';
import { Play, Star, Users, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import './HeroSection.css';

const HeroSection = ({
  title = "Welcome to Wiskerz & Tail",
  subtitle = "Your One-Stop Pet Care Solution",
  description = "Discover premium pet products, expert care advice, and personalized nutrition plans for your beloved companions.",
  primaryButtonText = "Shop Now",
  secondaryButtonText = "Learn More",
  showVideoButton = false,
  videoButtonText = "Watch Story",
  backgroundImage = "",
  showStats = true,
  showSocialProof = true,
  customStats = null,
  customFeatures = null,
  theme = "gradient-sunset",
  animationType = "slide-up-fade",
  onButtonClick,
  onSecondaryButtonClick,
  onVideoClick,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [activeFeature, setActiveFeature] = useState(0);

  // Default features for fallback
  const defaultFeatures = [
    { icon: "🐕", title: "Dog Care", description: "Expert veterinary services" },
    { icon: "🐱", title: "Cat Care", description: "Specialized feline treatments" },
    { icon: "🦅", title: "Exotic Pets", description: "Birds & small animals" },
    { icon: "🏠", title: "Home Visits", description: "Convenient care at home" }
  ];

  // Use custom features if provided, otherwise use default
  const features = customFeatures || defaultFeatures;

  useEffect(() => {
    setIsVisible(true);
    
    // Generate random sparkles
    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 15; i++) {
        newSparkles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 2 + Math.random() * 2
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate active feature
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  const socialProofAvatars = [
    { id: 1, alt: "Happy customer 1" },
    { id: 2, alt: "Happy customer 2" },
    { id: 3, alt: "Happy customer 3" },
    { id: 4, alt: "Happy customer 4" },
    { id: 5, alt: "Happy customer 5" }
  ];

  return (
    <section className={`hero-section ${theme} ${animationType} ${className}`}>
      {/* Background Elements */}
      <div className="hero-background">
        {backgroundImage && (
          <div 
            className="hero-bg-image"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        <div className="hero-gradient-overlay" />
        
        {/* Floating Sparkles */}
        <div className="sparkles-container">
          {sparkles.map(sparkle => (
            <div
              key={sparkle.id}
              className="sparkle"
              style={{
                left: `${sparkle.left}%`,
                top: `${sparkle.top}%`,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: `${sparkle.duration}s`
              }}
            />
          ))}
        </div>

        {/* Geometric Shapes */}
        <div className="geometric-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          {/* Main Content */}
          <div className={`hero-text-content ${isVisible ? 'visible' : ''}`}>
            <h1 className="hero-title">
              {title}
              <span className="title-highlight">
                <span className="highlight-text">✨</span>
              </span>
            </h1>
            
            <h2 className="hero-subtitle">{subtitle}</h2>
            
            <p className="hero-description">{description}</p>

            {/* Action Buttons */}
            <div className="hero-actions">
              <button 
                className="btn-primary hero-btn-primary"
                onClick={onButtonClick}
              >
                <ShoppingBag className="btn-icon" />
                {primaryButtonText}
                <ArrowRight className="btn-arrow" />
              </button>

              {secondaryButtonText && (
                <button 
                  className="btn-secondary hero-btn-secondary"
                  onClick={onSecondaryButtonClick}
                >
                  <Heart className="btn-icon" />
                  {secondaryButtonText}
                </button>
              )}

              {showVideoButton && (
                <button 
                  className="btn-video hero-btn-video"
                  onClick={onVideoClick}
                >
                  <Play className="btn-icon" />
                  {videoButtonText}
                </button>
              )}
            </div>

            {/* Social Proof */}
            {showSocialProof && (
              <div className="hero-social-proof">
                <div className="social-proof-avatars">
                  {socialProofAvatars.map(avatar => (
                    <div key={avatar.id} className="avatar">
                      <div className="avatar-placeholder">
                        {String.fromCharCode(65 + avatar.id - 1)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="social-proof-text">
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="star filled" />
                    ))}
                  </div>
                  <p>Join 50,000+ happy pet parents</p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Features Showcase */}
          {showStats && (
            <div className={`hero-features ${isVisible ? 'visible' : ''}`}>
              <div className="feature-showcase">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`feature-item ${index === activeFeature ? 'active' : ''}`}
                    onClick={() => setActiveFeature(index)}
                    onMouseEnter={() => setActiveFeature(index)}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <div className="feature-content">
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="feature-highlight">
                <div className="highlight-badge">
                  <span className="badge-icon">⭐</span>
                  <span>Most Popular: {features[activeFeature].title}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-element element-1">
            <Users className="element-icon" />
          </div>
          <div className="floating-element element-2">
            <Heart className="element-icon" />
          </div>
          <div className="floating-element element-3">
            <Star className="element-icon" />
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="hero-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="shape-fill"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
