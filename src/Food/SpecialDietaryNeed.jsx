import React from "react";
import "./SpecialDietaryNeed.css";

function SpecialDietaryNeeds() {
  const dietaryNeeds = [
    { name: "Grain-Free", description: "Formulated without wheat, corn or soy", icon: "🌾" },
    { name: "Hypoallergenic", description: "For pets with food sensitivities", icon: "🛡️" },
    { name: "Weight Management", description: "Balanced nutrition for healthy weight", icon: "⚖️" },
    { name: "Senior Nutrition", description: "Support for aging pets", icon: "👵" },
  ];

  return (
    <section className="dietary-needs-section">
      <h2 className="dietary-needs-title">Special Dietary Needs</h2>
      <div className="dietary-needs-grid">
        {dietaryNeeds.map((need, index) => (
          <div key={index} className="dietary-need-card">
            <div className="dietary-need-icon">{need.icon}</div>
            <h3 className="dietary-need-name">{need.name}</h3>
            <p className="dietary-need-description">{need.description}</p>
            <button className="dietary-need-button">Learn More</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SpecialDietaryNeeds;
