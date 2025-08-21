import React, { useState } from "react";
import "./FilterAndCategories.css";

function FiltersAndCategories() {
  const allFoodCategories = [
    {
      name: "Dry Food",
      description: "Premium kibble for daily nutrition",
      image: "https://placehold.co/300x200/DDC1FF/8C00FF?text=Dry+Kibble",
      type: "Dry Food"
    },
    {
      name: "Wet Food",
      description: "Savory canned options for hydration",
      image: "https://placehold.co/300x200/C1FFDD/00FF8C?text=Wet+Food+Bowl",
      type: "Wet Food"
    },
    {
      name: "Raw Food",
      description: "Natural unprocessed diet options",
      image: "https://placehold.co/300x200/FFC1DD/FF008C?text=Raw+Meat+for+Pets",
      type: "Raw Food"
    },
    {
      name: "Treats & Chews",
      description: "Delicious rewards and dental care",
      image: "https://placehold.co/300x200/DDEEFF/008CFF?text=Pet+Treats",
      type: "Treats"
    },
    {
      name: "Supplements",
      description: "Support optimal health and wellness",
      image: "https://placehold.co/300x200/FFF0DD/FFA500?text=Pet+Supplements",
      type: "Supplements"
    },
    {
      name: "Special Products",
      description: "Solutions for specific health needs",
      image: "https://placehold.co/300x200/FFDDFF/FF00FF?text=Special+Diet+Food",
      type: "Special Products"
    }
  ];

  const foodTypes = ["Dry Food", "Wet Food", "Raw Food", "Treats", "Supplements"];
  const specialDiets = ["Grain-Free", "Hypoallergenic", "Weight Management", "Senior Nutrition"];
  const brands = ["Royal Canin", "Hill's Science Diet", "Blue Buffalo", "Purina Pro Plan"];

  const [priceRange, setPriceRange] = useState(100);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [selectedSpecialDiets, setSelectedSpecialDiets] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const handleFoodTypeChange = (type) => {
    setSelectedFoodTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSpecialDietChange = (diet) => {
    setSelectedSpecialDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const applyFilters = () => {
    // Filtering happens automatically, but you can add logic here if needed
  };

  const resetFilters = () => {
    setSelectedFoodTypes([]);
    setSelectedSpecialDiets([]);
    setSelectedBrands([]);
    setPriceRange(100);
  };

  const filteredFoodCategories = allFoodCategories.filter((category) => {
    const matchesFoodType =
      selectedFoodTypes.length === 0 || selectedFoodTypes.includes(category.type);
    // For special diets and brands, expand your category data if you want filtering
    return matchesFoodType;
  });

  return (
    <section className="filters-categories-section">
      <div className="filters-categories-layout">
        {/* Filters Panel */}
        <div className="filters-panel">
          <h3 className="filters-heading">Filters</h3>

          <div className="filter-group">
            <h4 className="filter-group-title">Food Type</h4>
            {foodTypes.map((type, index) => (
              <label key={index} className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={selectedFoodTypes.includes(type)}
                  onChange={() => handleFoodTypeChange(type)}
                />
                <span className="checkbox-text">{type}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Special Diets</h4>
            {specialDiets.map((diet, index) => (
              <label key={index} className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={selectedSpecialDiets.includes(diet)}
                  onChange={() => handleSpecialDietChange(diet)}
                />
                <span className="checkbox-text">{diet}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Price Range</h4>
            <div className="price-range-group">
              <input
                type="range"
                min="0"
                max="100"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="price-range-slider"
              />
              <div className="price-display">
                <span className="price-value">$0</span>
                <span className="price-value">${priceRange}</span>
              </div>
            </div>
          </div>

          <div className="filter-group">
            <h4 className="filter-group-title">Brands</h4>
            {brands.map((brand, index) => (
              <label key={index} className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
                <span className="checkbox-text">{brand}</span>
              </label>
            ))}
            <button className="view-more-brands">View all brands</button>
          </div>

          <div className="filters-actions">
            <button className="apply-button" onClick={applyFilters}>
              Apply Filters
            </button>
            <button className="reset-button" onClick={resetFilters}>
              Reset
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          <h3 className="categories-heading">Food Categories</h3>
          {filteredFoodCategories.length > 0 ? (
            <div className="food-category-cards">
              {filteredFoodCategories.map((category, index) => (
                <div key={index} className="food-category-card">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="food-category-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/300x200/CCCCCC/333333?text=${category.name.replace(/\s/g, "+")}`;
                    }}
                  />
                  <h4 className="food-category-name">{category.name}</h4>
                  <p className="food-category-description">{category.description}</p>
                  <button className="food-category-button">Shop Now</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-categories-message">
              No food categories match your selected filters.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default FiltersAndCategories;
