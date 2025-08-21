import React, { useState } from 'react';
import './ShopByPet.css';
import { shopByPetUtils } from '../config/shopByPetConfig';

const ShopByPet = ({
  pageType = 'homepage',
  config = null,
  customOverrides = {},
  className = "",
  onNavigateFood,
  onNavigateProduct,
  onNavigateService
}) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Get configuration based on pageType or use custom config
  const shopConfig = config || shopByPetUtils.getCustomConfig(pageType, customOverrides);
  
  const {
    title,
    subtitle,
    layout = "grid",
    categories,
    showProductCount = true,
    showDescription = true,
    showViewAll = true,
    viewAllText = "View All",
    theme = "home-theme",
    maxDisplay = 6,
    onCategoryClick,
    onViewAllClick
  } = shopConfig;

  // Handle category click events
  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  // Handle view all click events
  const handleViewAllClick = () => {
    // Based on the page type, navigate to the appropriate page
    if (pageType === 'homepage') {
      if (onNavigateProduct) {
        onNavigateProduct();
      }
    } else if (pageType === 'food') {
      if (onNavigateFood) {
        onNavigateFood();
      }
    } else if (pageType === 'product') {
      if (onNavigateProduct) {
        onNavigateProduct();
      }
    } else if (pageType === 'services') {
      if (onNavigateService) {
        onNavigateService();
      }
    }
    
    // Fallback to original config handler
    if (onViewAllClick) {
      onViewAllClick();
    }
  };

  // Get the categories to display (limited by maxDisplay)
  const displayCategories = categories ? categories.slice(0, maxDisplay) : [];

  return (
    <section className={`shopbypet-section ${layout} ${theme} ${className}`}>
      <div className="shopbypet-header">
        <div className="shopbypet-title-container">
          <h2 className="shopbypet-title">{title}</h2>
          {subtitle && <p className="shopbypet-subtitle">{subtitle}</p>}
        </div>
      </div>
      
      <div className={`shopbypet-grid ${layout === 'cards' ? 'cards-layout' : 'grid-layout'}`}>
        {displayCategories.map((category, index) => (
          <div 
            key={category.id || index} 
            className={`shopbypet-card ${layout === 'cards' ? 'card-style' : 'grid-style'} ${hoveredCard === index ? 'hovered' : ''}`}
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
              {showDescription && category.description && (
                <p className="shopbypet-description">{category.description}</p>
              )}
              {showProductCount && category.productCount && (
                <div className="shopbypet-count">
                  <span>{category.productCount}</span>
                </div>
              )}
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
      
      {showViewAll && (
        <div className="shopbypet-footer">
          <button className="shopbypet-view-all" onClick={handleViewAllClick}>
            {viewAllText}
          </button>
        </div>
      )}
    </section>
  );
};

export default ShopByPet;
