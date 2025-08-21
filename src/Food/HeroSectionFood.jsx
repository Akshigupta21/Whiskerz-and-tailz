import React from "react";
import "./HeroSectionFood.css";

function HeroSectionFood() {
  return (
    <section className="hero-section">
      <div className="hero-text-container">
        <h1 className="hero-title">Premium Pet Food & Nutrition</h1>
        <p className="hero-subtitle">
          Discover top-quality food and supplements tailored to your pet's unique
          needs. From everyday nutrition to specialized diets, we provide the best
          for your furry family members.
        </p>
        <div className="hero-search-container">
          <input
            type="text"
            placeholder="Search for pet food, brands, or ingredients..."
            className="hero-search-input"
          />
          <button className="hero-search-button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="hero-image-container">
        <img
          src="https://placehold.co/600x400/FFDDC1/FF8C00?text=Assortment+of+Pet+Food+Bags+and+Cans"
          alt="Premium Pet Food Products"
          className="hero-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/600x400/FFDDC1/FF8C00?text=Image+Not+Found";
          }}
        />
      </div>
    </section>
  );
}

export default HeroSectionFood;
