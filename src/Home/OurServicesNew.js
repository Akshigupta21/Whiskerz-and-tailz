import React, { useState } from 'react';
import './OurServices.css';

function OurServices({ services }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Service data with images
  const defaultServices = [
    {
      id: 1,
      name: "Dog Walking",
      description: "Professional dog walking services tailored to your pet's exercise needs and schedule. Our experienced walkers ensure your furry friend gets the perfect amount of exercise and socialization.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop",
      price: "Starting ₹200/walk",
      features: ["30-60 min walks", "GPS tracking", "Photo updates", "Flexible scheduling"]
    },
    {
      id: 2,
      name: "Pet Sitting",
      description: "Reliable in-home pet sitting services with love and care while you're away. Your pets stay comfortable in their familiar environment with professional care.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
      price: "Starting ₹500/day",
      features: ["24/7 care", "Home security", "Daily updates", "Emergency support"]
    },
    {
      id: 3,
      name: "Grooming",
      description: "Full-service professional grooming for all breeds with premium products. From basic baths to full styling, we keep your pets looking and feeling their best.",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop",
      price: "Starting ₹800/session",
      features: ["Bath & brush", "Nail trimming", "Ear cleaning", "Professional styling"]
    },
    {
      id: 4,
      name: "Training",
      description: "Positive reinforcement training classes for behavioral development. Expert trainers help build a strong bond between you and your pet through effective training methods.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
      price: "Starting ₹1200/session",
      features: ["Basic obedience", "Behavior modification", "Socialization", "Custom programs"]
    }
  ];

  const displayServices = services && services.length > 0 ? services : defaultServices;

  return (
    <section className="our-services-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle-badge">🐾 PREMIUM SERVICES</span>
          <h2 className="section-title">Our Professional Pet Services</h2>
          <p className="section-description">
            Comprehensive care solutions designed to keep your beloved pets happy, healthy, and well-cared for
          </p>
        </div>

        <div className="services-row">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="service-box"
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="service-content">
                {/* Default state - Image and Title */}
                <div className={`service-default ${hoveredCard === service.id ? 'hidden' : 'visible'}`}>
                  <div className="service-image">
                    <img src={service.image} alt={service.name} />
                  </div>
                  <h3 className="service-title">{service.name}</h3>
                </div>

                {/* Hover state - Content */}
                <div className={`service-hover ${hoveredCard === service.id ? 'visible' : 'hidden'}`}>
                  <h3 className="service-title-hover">{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-price">{service.price}</div>
                  <ul className="service-features">
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <button className="service-button">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurServices;
