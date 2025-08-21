import React from 'react'
import { Star } from 'lucide-react'
import './FilterSlideBar.css'

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const categories = [
    'All Products', 'Pet Food', 'Toys & Accessories', 
    'Grooming', 'Health & Wellness', 'Beds & Furniture'
  ]

  const handlePriceChange = (e) => {
    onFilterChange({ 
      target: { 
        name: 'priceRange', 
        value: [0, parseInt(e.target.value)] 
      } 
    })
  }

  return (
    <aside className="filter-sidebar">
      <h3 className="filter-sidebar__title">Filters</h3>

      <section className="filter-group">
        <h4 className="filter-group__header">Categories</h4>
        {categories.map((category) => (
          <label key={category} className="filter-option">
            <input
              type="radio"
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={onFilterChange}
              className="filter-option__input"
            />
            <span className="filter-option__label">{category}</span>
          </label>
        ))}
      </section>

      <section className="filter-group">
        <h4 className="filter-group__header">Price Range</h4>
        <div className="filter-price">
          <span className="filter-price__value">Rs. {filters.priceRange[0]}</span>
          <span className="filter-price__value">Rs. {filters.priceRange[1]}</span>
        </div>
        <input
          type="range"
          min="10"
          max="10000"
          value={filters.priceRange[1]}
          onChange={handlePriceChange}
          className="filter-price__slider"
        />
      </section>

      <section className="filter-group">
        <h4 className="filter-group__header">Rating</h4>
        {[5, 4, 3, 2, 1].map((starCount) => (
          <label key={starCount} className="filter-option">
            <input
              type="radio"
              name="rating"
              value={starCount}
              checked={filters.rating === starCount}
              onChange={onFilterChange}
              className="filter-option__input"
            />
            <div className="filter-option__stars">
              {[...Array(starCount)].map((_, i) => (
                <Star key={i} size={16} strokeWidth={2} className="star" />
              ))}
              <span>& Up</span>
            </div>
          </label>
        ))}
      </section>

      <section className="filter-group">
        <h4 className="filter-group__header">Availability</h4>
        <label className="filter-option">
          <input
            type="checkbox"
            name="inStock"
            checked={filters.inStock}
            onChange={onFilterChange}
            className="filter-option__input filter-option__input--checkbox"
          />
          <span className="filter-option__label">In Stock</span>
        </label>
        <label className="filter-option">
          <input
            type="checkbox"
            name="onSale"
            checked={filters.onSale}
            onChange={onFilterChange}
            className="filter-option__input filter-option__input--checkbox"
          />
          <span className="filter-option__label">On Sale</span>
        </label>
      </section>

      <button 
        onClick={onClearFilters} 
        className="filter-sidebar__clear"
      >
        Clear All Filters
      </button>
    </aside>
  )
}

export default FilterSidebar
