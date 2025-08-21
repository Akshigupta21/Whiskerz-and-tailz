import React from 'react';
import './BrandLogos.css';

const BrandLogos = () => {
  const brands = [
    {
      name: "Petshome",
      logo: "/api/placeholder/120/60"
    },
    {
      name: "Cat&Dog Pet Care",
      logo: "/api/placeholder/120/60"
    },
    {
      name: "PETLOVE",
      logo: "/api/placeholder/120/60"
    },
    {
      name: "Cat&Dog",
      logo: "/api/placeholder/120/60"
    },
    {
      name: "felix",
      logo: "/api/placeholder/120/60"
    },
    {
      name: "PET LOGO",
      logo: "/api/placeholder/120/60"
    }
  ];

  return (
    <section className="brand-logos">
      <div className="container">
        <div className="brands-scroll">
          <div className="brands-track">
            {brands.map((brand, index) => (
              <div key={index} className="brand-item">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="brand-logo"
                />
              </div>
            ))}
            {/* Duplicate for smooth infinite scroll */}
            {brands.map((brand, index) => (
              <div key={`duplicate-${index}`} className="brand-item">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="brand-logo"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;
