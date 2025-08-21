import React, { useState } from 'react';
import './PricingMenu.css';

const PricingMenu = () => {
  const [activeTab, setActiveTab] = useState('cats');

  const pricingData = {
    dogs: {
      basicPackages: [
        {
          title: "Veterinary Care",
          price: "$20 - $25",
          description: "Neque convallis a cras semper auctor neque vitae tempus quamet volutpat lacus laoreet"
        },
        {
          title: "Grooming Service", 
          price: "$25 - $30",
          description: "Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt donec massa sapien"
        },
        {
          title: "Dog Sitting Service",
          price: "$20 - $35", 
          description: "Eget mi proin sed libero. Aenean et tortor at risus viverra adipiscing augiat sed lectus vestib"
        }
      ],
      addOns: [
        {
          title: "Behavior Consultation",
          price: "$20 - $45"
        },
        {
          title: "Nutritional Counseling", 
          price: "$15 - $25"
        },
        {
          title: "Dog Daycare",
          price: "$25 - $30"
        },
        {
          title: "Transport Service",
          price: "$10 - $15"
        },
        {
          title: "Dog Photography",
          price: "$30 - $55"
        },
        {
          title: "Boarding Service",
          price: "$20 - $30"
        }
      ]
    },
    cats: {
      basicPackages: [
        {
          title: "Veterinary Care",
          price: "$20 - $25",
          description: "Neque convallis a cras semper auctor neque vitae tempus quamet volutpat lacus laoreet"
        },
        {
          title: "Grooming Service",
          price: "$25 - $30", 
          description: "Vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt donec massa sapien"
        },
        {
          title: "Cat Sitting Service",
          price: "$20 - $35",
          description: "Eget mi proin sed libero. Aenean et tortor at risus viverra adipiscing augiat sed lectus vestib"
        }
      ],
      addOns: [
        {
          title: "Behavior Consultation",
          price: "$20 - $45"
        },
        {
          title: "Nutritional Counseling",
          price: "$15 - $25"
        },
        {
          title: "Cat Daycare", 
          price: "$25 - $30"
        },
        {
          title: "Transport Service",
          price: "$10 - $15"
        },
        {
          title: "Cat Photography",
          price: "$30 - $55"
        },
        {
          title: "Boarding Service",
          price: "$20 - $30"
        }
      ]
    },
    birds: {
      basicPackages: [
        {
          title: "Bird Adoption",
          price: "$25 - $30",
          description: "Nec nam aliquam sem et tortor. Purus in massa tempor nec feugiat nisl pretium fusce id"
        },
        {
          title: "Aviary Design",
          price: "$30 - $80",
          description: "Aliquam faucibus purus in massa tempor nec feugiat nisl sit amet mattis vulputate enim nulla"
        },
        {
          title: "Bird Boarding",
          price: "$25 - $35",
          description: "Faucibus a pellentesque sit amet porttitor eget dolor morbi non dipscing enim eu turpis egestas"
        }
      ],
      addOns: [
        {
          title: "Avian Veterinary",
          price: "$40 - $50"
        },
        {
          title: "Grooming Service",
          price: "$25 - $40"
        },
        {
          title: "Boarding Facilities",
          price: "$30 - $60"
        },
        {
          title: "Bird Sitting",
          price: "$20 - $30"
        },
        {
          title: "Behavior Consulting",
          price: "$30 - $60"
        },
        {
          title: "Nutritional Counseling",
          price: "$35 - $45"
        }
      ]
    }
  };

  return (
    <section className="pricing-menu">
      <div className="container">
        <div className="pricing-header">
          <div className="paw-icon">🐾</div>
          <p className="section-subtitle">OUR CATEGORIES TO PURCHASE</p>
          <h2 className="section-title">Recent New Menu Price List</h2>
        </div>

        <div className="pet-tabs">
          <button 
            className={`tab-button ${activeTab === 'dogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('dogs')}
          >
            DOGS
          </button>
          <button 
            className={`tab-button ${activeTab === 'cats' ? 'active' : ''}`}
            onClick={() => setActiveTab('cats')}
          >
            CATS
          </button>
          <button 
            className={`tab-button ${activeTab === 'birds' ? 'active' : ''}`}
            onClick={() => setActiveTab('birds')}
          >
            BIRDS
          </button>
        </div>

        <div className="pricing-content">
          <div className="pricing-sections">
            <div className="basic-packages">
              <div className="section-header">
                <div className="icon">📋</div>
                <h3>Basic Packages</h3>
              </div>
              
              {pricingData[activeTab].basicPackages.map((service, index) => (
                <div key={index} className="service-item">
                  <div className="service-info">
                    <h4 className="service-title">{service.title}</h4>
                    <p className="service-description">{service.description}</p>
                  </div>
                  <div className="service-price">{service.price}</div>
                </div>
              ))}
            </div>

            <div className="pet-image-container">
              {activeTab === 'cats' && (
                <img 
                  src="/api/placeholder/300/400" 
                  alt="Cat" 
                  className="pet-image"
                />
              )}
              {activeTab === 'birds' && (
                <img 
                  src="/api/placeholder/300/400" 
                  alt="Bird" 
                  className="pet-image"
                />
              )}
              {activeTab === 'dogs' && (
                <img 
                  src="/api/placeholder/300/400" 
                  alt="Dog" 
                  className="pet-image"
                />
              )}
            </div>

            <div className="add-ons">
              <div className="section-header">
                <div className="icon">😊</div>
                <h3>Add-Ons</h3>
              </div>
              
              {pricingData[activeTab].addOns.map((addon, index) => (
                <div key={index} className="addon-item">
                  <span className="addon-title">{addon.title}</span>
                  <span className="addon-price">{addon.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingMenu;
