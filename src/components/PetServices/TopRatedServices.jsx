import React from 'react';
import './TopRatedServices.css';

const TopRatedServices = () => {
  const services = [
    {
      id: 1,
      title: "Pet Coaching",
      description: "Ad litora torquent conubia nostra nascetur inceptos himenaeos.",
      icon: "🦊",
      featured: true,
      link: "LEARN MORE"
    },
    {
      id: 2,
      title: "Active Paws", 
      description: "Luctus nibh finibus facilisis dapibus etiam interdum tortor nam porta.",
      icon: "🐕",
      featured: false,
      link: "LEARN MORE"
    },
    {
      id: 3,
      title: "Comfy Crates",
      description: "Primis vulputate ornare sagittis vehicula praesent accumsan.",
      icon: "🐕‍🦺",
      featured: false,
      link: "LEARN MORE"
    },
    {
      id: 4,
      title: "Bird Practice",
      description: "Bibendum egestas iaculis massa nisl malesuada lacinia integer.",
      icon: "🦜",
      featured: false,
      link: "LEARN MORE"
    },
    {
      id: 5,
      title: "Adoption Journey",
      description: "Class aptent taciti sociosqu ad litora torquent per. Natoque penatibus.",
      icon: "👨‍👩‍👧‍👦",
      featured: true,
      link: "LEARN MORE"
    },
    {
      id: 6,
      title: "Pet Supplies",
      description: "Cras eleifend turpis fames primis vulputate feugiat tristique.",
      icon: "🏺",
      featured: false,
      link: "LEARN MORE"
    },
    {
      id: 7,
      title: "Puppy Kennel",
      description: "Fringilla lacus nec metus bibendum egestas hendrerit semper.",
      icon: "🏠",
      featured: false,
      link: "LEARN MORE"
    },
    {
      id: 8,
      title: "Pet Doctors",
      description: "Nisl sodales consequat magna ante congue condimentum neque at.",
      icon: "🩺",
      featured: false,
      link: "LEARN MORE"
    },
    {
      id: 9,
      title: "Pet Grooming",
      description: "Euismod quam justo lectus commodo augue turpis fames arcu dignissim.",
      icon: "🧼",
      featured: false,
      link: "LEARN MORE"
    }
  ];

  return (
    <section className="top-rated-services">
      <div className="container">
        <div className="services-header">
          <h2 className="services-title">Our Top-Rated Service</h2>
          <p className="services-description">
            Ut iure consequatur et dolores delectus ut deserunt veniam qui quidem neque qui 
            soluta esse et rerum quia et distinctio tempora et maiores corrupti.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => (
            <div 
              key={service.id} 
              className={`service-card ${service.featured ? 'featured' : ''}`}
            >
              <div className="service-icon">
                <span className="icon-emoji">{service.icon}</span>
              </div>
              
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <a href="#" className="service-link">{service.link}</a>
              </div>
            </div>
          ))}
        </div>

        <div className="endorsement">
          <p className="endorsement-text">ENDORSEMENT</p>
        </div>
      </div>
    </section>
  );
};

export default TopRatedServices;
