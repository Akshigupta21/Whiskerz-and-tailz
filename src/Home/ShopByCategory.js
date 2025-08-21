// ShopByCategory.js (Assumed structure)
import React from 'react';
import './ShopByCategory.css';

// Assuming it receives a 'categories' prop which is an array
function ShopByCategory({ categories }) {
  // If categories might be undefined, provide a default empty array
  // This is crucial to prevent the .map() error
  const categoriesToMap = categories || [];

  return (
    <section className="shop-by-category-section">
      <h2>Shop By Category</h2>
      <div className="category-grid">
        {categoriesToMap.map((category) => ( // The error occurs here if categoriesToMap is undefined
          <div className="category-card" key={category.id}>
            <img src={category.image} alt={category.name} />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShopByCategory;