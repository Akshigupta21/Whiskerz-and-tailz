import React from 'react';
import './PetTypeSection.css'; // Assuming a CSS file for styling

function PetTypeSection({ petTypes }) {
  const typesToDisplay = petTypes || [];

  return (
    <section className="pet-type-section">
      <h2>Find Services By Pet Type</h2>
      <div className="pet-types-grid">
        {typesToDisplay.length > 0 ? (
          typesToDisplay.map(type => (
            <div className="pet-type-card" key={type.id}>
              <img src={type.icon} alt={type.name} />
              <h3>{type.name}</h3>
            </div>
          ))
        ) : (
          <p>No pet types listed.</p>
        )}
      </div>
    </section>
  );
}

export default PetTypeSection;