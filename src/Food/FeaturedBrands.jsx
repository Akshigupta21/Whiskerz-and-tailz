import React from "react";
import "./FeaturedBrands.css";

function FeaturedBrands() {
  const brands = [
    { name: 'Royal Canin', description: 'Breed-Specific Nutrition', icon: '👑' },
    { name: 'Hill\'s Science Diet', description: 'Veterinarian recommended', icon: '🔬' },
    { name: 'Blue Buffalo', description: 'Natural ingredients', icon: '🐾' },
    { name: 'Purina Pro Plan', description: 'Advanced nutrition', icon: '🏅' },
  ];

  return (
    <section className="featured-brands">
      <h2 className="featured-brands-heading">Featured Brands</h2>
      <div className="featured-brands-grid">
        {brands.map((brand, index) => (
          <div key={index} className="brand-card">
            <div className="brand-icon">
              {brand.icon}
            </div>
            <h3 className="brand-name">{brand.name}</h3>
            <p className="brand-description">{brand.description}</p>
            <button className="view-products-button">
              View Products
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturedBrands;
