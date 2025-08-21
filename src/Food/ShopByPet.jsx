import React, { useState } from "react";
import "./ShopByPet.css";

function ShopByPet({ onPetCategoryClick = () => {} }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  const petCategories = [
    { 
      name: "Dogs", 
      icon: "�", 
      productCount: 145,
      description: "Premium dog food & treats",
      color: "#f97316"
    },
    { 
      name: "Cats", 
      icon: "�", 
      productCount: 128,
      description: "Nutritious cat food & snacks",
      color: "#8b5cf6"
    },
    { 
      name: "Birds", 
      icon: "🦜", 
      productCount: 89,
      description: "Seeds, pellets & treats",
      color: "#06b6d4"
    },
    { 
      name: "Fish", 
      icon: "🐠", 
      productCount: 76,
      description: "Aquatic nutrition & care",
      color: "#10b981"
    },
    { 
      name: "Small Pets", 
      icon: "🐹", 
      productCount: 92,
      description: "Food for rabbits, hamsters & more",
      color: "#f59e0b"
    },
    { 
      name: "Reptiles", 
      icon: "🦎", 
      productCount: 54,
      description: "Specialized reptile nutrition",
      color: "#84cc16"
    },
  ];

  const handleCategoryClick = (category) => {
    onPetCategoryClick(category);
  };

  return (
    <section className="shopbypet-section">
      <div className="shopbypet-header">
        <div className="shopbypet-title-container">
          <h2 className="shopbypet-title">Shop by Pet</h2>
          <p className="shopbypet-subtitle">Find the perfect food for your beloved companion</p>
        </div>
      </div>
      
      <div className="shopbypet-grid">
        {petCategories.map((category, index) => (
          <div 
            key={index} 
            className="shopbypet-card"
            onClick={() => handleCategoryClick(category)}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              '--category-color': category.color
            }}
          >
            <div className="shopbypet-icon">
              {category.icon}
            </div>
            <div className="shopbypet-content">
              <h3 className="shopbypet-name">{category.name}</h3>
              <p className="shopbypet-description">{category.description}</p>
              <div className="shopbypet-count">
                <span>{category.productCount} products</span>
              </div>
            </div>
            <div className="shopbypet-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 5l7 7-7 7" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      <div className="shopbypet-footer">
        <button className="shopbypet-view-all">
          View All Products
        </button>
      </div>
    </section>
  );
}

export default ShopByPet;
