import React, { useState } from 'react';
import './OurServices.css';

function OurServices({ services }) {
  // Service data matching the design in the image
  const defaultServices = [
    {
      id: 1,
      name: "Pet Coaching",
      description: "Ad litora torquent conubia nostra nascetur inceptos himenaeos.",
      icon: "🦊",
      featured: true,
      size: "large"
    },
    {
      id: 2,
      name: "Active Paws",
      description: "Luctus nibh finibus facilisis dapibus etiam interdum tortor nam porta.",
      icon: "🐕",
      featured: false,
      size: "medium"
    },
    {
      id: 3,
      name: "Comfy Crates",
      description: "Primis vulputate ornare sagittis vehicula praesent accumsan.",
      icon: "🐕‍🦺",
      featured: false,
      size: "medium"
    },
    {
      id: 4,
      name: "Bird Practice",
      description: "Bibendum egestas iaculis massa nisl malesuada lacinia integer.",
      icon: "🦜",
      featured: false,
      size: "medium"
    },
    {
      id: 5,
      name: "Adoption Journey",
      description: "Class aptent taciti sociosqu ad litora torquent per. Natoque penatibus.",
      icon: "👶",
      featured: true,
      size: "large"
    },
    {
      id: 6,
      name: "Pet Supplies",
      description: "Cras eleifend turpis fames primis vulputate feugiat tristique.",
      icon: "🏺",
      featured: false,
      size: "medium"
    },
    {
      id: 7,
      name: "Puppy Kennel",
      description: "Fringilla lacus nec metus bibendum egestas hendrerit semper.",
      icon: "🏠",
      featured: false,
      size: "medium"
    },
    {
      id: 8,
      name: "Pet Doctors",
      description: "Nisl sodales consequat magna ante congue condimentum neque at.",
      icon: "🩺",
      featured: false,
      size: "medium"
    },
    {
      id: 9,
      name: "Pet Grooming",
      description: "Euismod quam justo lectus commodo augue turpis fames arcu dignissim.",
      icon: "💎",
      featured: false,
      size: "medium"
    },
    {
      id: 10,
      name: "Pet Insurance",
      description: "Comprehensive health coverage for your furry family members' medical needs.",
      icon: "🛡️",
      featured: false,
      size: "medium"
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

        <div className="services-grid">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className={`service-card ${service.featured ? 'featured' : ''} ${service.size || 'medium'}`}
            >
              <div className="service-content">
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <button className="learn-more-btn">LEARN MORE</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurServices;
