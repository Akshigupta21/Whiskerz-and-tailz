import React, { useState, useMemo } from 'react';
import { Filter, X } from 'lucide-react';
import ProductCard from '../components/ProductCard'; // Use enhanced common ProductCard
import './ShopAll.css';

function ShopAll({ addToCart, addToWishlist, onProductClick }) {
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(100);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [selectedSpecialDiets, setSelectedSpecialDiets] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Filter options
  const foodTypes = ["Dry Food", "Wet Food", "Raw Food", "Treats", "Supplements"];
  const specialDiets = ["Grain-Free", "Hypoallergenic", "Weight Management", "Senior Nutrition"];
  const brands = ["Royal Canin", "Hill's Science Diet", "Blue Buffalo", "Purina Pro Plan", "Nutramax"];

  const allFoodProducts = [
    {
      id: "food-001",
      name: "Premium Dry Dog Food",
      brand: "Royal Canin",
      category: "Pet Food",
      type: "Dry Food",
      price: 45.99,
      originalPrice: 59.99,
      rating: 4.8,
      reviews: 156,
      image: "https://placehold.co/250x200/DDC1FF/8C00FF?text=Premium+Dog+Food",
      images: [
        "https://placehold.co/250x200/DDC1FF/8C00FF?text=Premium+Dog+Food",
        "https://placehold.co/250x200/C1C1FF/7C7CFF?text=Dog+Food+2"
      ],
      badge: "NEW",
      description: "Complete nutrition for adult dogs"
    },
    {
      id: "food-002",
      name: "Grain-Free Wet Food",
      brand: "Hill's Science Diet",
      category: "Pet Food",
      type: "Wet Food",
      price: 28.99,
      originalPrice: 35.99,
      rating: 4.6,
      reviews: 89,
      image: "https://placehold.co/250x200/C1FFDD/00FF8C?text=Wet+Food+Cans",
      images: [
        "https://placehold.co/250x200/C1FFDD/00FF8C?text=Wet+Food+Cans",
        "https://placehold.co/250x200/A1FFB1/00CC5C?text=Wet+Food+2"
      ],
      badge: "NEW",
      description: "Savory wet food for sensitive stomachs"
    },
    {
      id: "food-003",
      name: "Raw Freeze-Dried Food",
      brand: "Blue Buffalo",
      category: "Pet Food",
      type: "Raw Food",
      price: 65.99,
      originalPrice: 75.99,
      rating: 4.9,
      reviews: 203,
      image: "https://placehold.co/250x200/FFC1DD/FF008C?text=Raw+Food+Pack",
      images: [
        "https://placehold.co/250x200/FFC1DD/FF008C?text=Raw+Food+Pack",
        "https://placehold.co/250x200/FFA1B1/CC005C?text=Raw+Food+2"
      ],
      badge: "NEW",
      description: "Natural raw nutrition made easy"
    },
    {
      id: "food-004",
      name: "Training Treats Mix",
      brand: "Purina Pro Plan",
      category: "Pet Food",
      type: "Treats",
      price: 19.99,
      originalPrice: 24.99,
      rating: 4.7,
      reviews: 134,
      image: "https://placehold.co/250x200/DDEEFF/008CFF?text=Training+Treats",
      images: [
        "https://placehold.co/250x200/DDEEFF/008CFF?text=Training+Treats",
        "https://placehold.co/250x200/BBCCFF/0066CC?text=Treats+2"
      ],
      badge: "NEW",
      description: "Perfect for training and rewards"
    },
    {
      id: "food-005",
      name: "Joint Health Supplements",
      brand: "Nutramax",
      category: "Pet Food",
      type: "Supplements",
      price: 39.99,
      originalPrice: 49.99,
      rating: 4.5,
      reviews: 92,
      image: "https://placehold.co/250x200/FFF0DD/FFA500?text=Joint+Supplements",
      images: [
        "https://placehold.co/250x200/FFF0DD/FFA500?text=Joint+Supplements",
        "https://placehold.co/250x200/FFD0BB/CC8500?text=Supplements+2"
      ],
      badge: "NEW",
      description: "Support joint health and mobility"
    },
    {
      id: "food-006",
      name: "Senior Dog Formula",
      brand: "Royal Canin",
      category: "Pet Food",
      type: "Special Diet",
      price: 52.99,
      originalPrice: 62.99,
      rating: 4.8,
      reviews: 178,
      image: "https://placehold.co/250x200/E6E6FA/9370DB?text=Senior+Formula",
      images: [
        "https://placehold.co/250x200/E6E6FA/9370DB?text=Senior+Formula",
        "https://placehold.co/250x200/C6C6DA/7350BB?text=Senior+2"
      ],
      badge: "NEW",
      description: "Specially formulated for senior dogs"
    },
    {
      id: "food-007",
      name: "Kitten Growth Formula",
      brand: "Hill's Science Diet",
      category: "Pet Food",
      type: "Dry Food",
      price: 34.99,
      originalPrice: 42.99,
      rating: 4.7,
      reviews: 145,
      image: "https://placehold.co/250x200/FFE4E1/FF69B4?text=Kitten+Food",
      images: [
        "https://placehold.co/250x200/FFE4E1/FF69B4?text=Kitten+Food",
        "https://placehold.co/250x200/FFC4C1/FF4994?text=Kitten+2"
      ],
      badge: "NEW",
      description: "Complete nutrition for growing kittens"
    },
    {
      id: "food-008",
      name: "Dental Care Chews",
      brand: "Greenies",
      category: "Pet Food",
      type: "Treats",
      price: 23.99,
      originalPrice: 29.99,
      rating: 4.6,
      reviews: 198,
      image: "https://placehold.co/250x200/98FB98/228B22?text=Dental+Chews",
      images: [
        "https://placehold.co/250x200/98FB98/228B22?text=Dental+Chews",
        "https://placehold.co/250x200/78DB78/186B02?text=Dental+2"
      ],
      badge: "NEW",
      description: "Promotes healthy teeth and gums"
    },
    {
      id: "food-009",
      name: "Omega-3 Fish Oil",
      brand: "Nordic Naturals",
      category: "Pet Food",
      type: "Supplements",
      price: 29.99,
      originalPrice: 35.99,
      rating: 4.9,
      reviews: 167,
      image: "https://placehold.co/250x200/87CEEB/4682B4?text=Fish+Oil",
      images: [
        "https://placehold.co/250x200/87CEEB/4682B4?text=Fish+Oil",
        "https://placehold.co/250x200/67AECB/266294?text=Oil+2"
      ],
      badge: "NEW",
      description: "Supports skin and coat health"
    },
    {
      id: "food-010",
      name: "Weight Management Food",
      brand: "Blue Buffalo",
      category: "Pet Food",
      type: "Special Diet",
      price: 48.99,
      originalPrice: 56.99,
      rating: 4.4,
      reviews: 112,
      image: "https://placehold.co/250x200/F0E68C/DAA520?text=Weight+Management",
      images: [
        "https://placehold.co/250x200/F0E68C/DAA520?text=Weight+Management",
        "https://placehold.co/250x200/D0C66C/BA8500?text=Weight+2"
      ],
      badge: "NEW",
      description: "Helps maintain healthy weight"
    },
    {
      id: "food-011",
      name: "Puppy Training Treats",
      brand: "Zuke's",
      category: "Pet Food",
      type: "Treats",
      price: 16.99,
      originalPrice: 21.99,
      rating: 4.8,
      reviews: 156,
      image: "https://placehold.co/250x200/DDA0DD/BA55D3?text=Puppy+Treats",
      images: [
        "https://placehold.co/250x200/DDA0DD/BA55D3?text=Puppy+Treats",
        "https://placehold.co/250x200/BD80BD/9A35B3?text=Puppy+2"
      ],
      badge: "NEW",
      description: "Small treats perfect for puppy training"
    },
    {
      id: "food-012",
      name: "Hypoallergenic Formula",
      brand: "Hill's Prescription Diet",
      category: "Pet Food",
      type: "Special Diet",
      price: 58.99,
      originalPrice: 68.99,
      rating: 4.7,
      reviews: 89,
      image: "https://placehold.co/250x200/F5DEB3/CD853F?text=Hypoallergenic",
      images: [
        "https://placehold.co/250x200/F5DEB3/CD853F?text=Hypoallergenic",
        "https://placehold.co/250x200/D5BE93/AD651F?text=Hypo+2"
      ],
      badge: "NEW",
      description: "For dogs with food sensitivities"
    }
  ];

  // Filter handling functions
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

  const resetFilters = () => {
    setSelectedFoodTypes([]);
    setSelectedSpecialDiets([]);
    setSelectedBrands([]);
    setPriceRange(100);
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allFoodProducts.filter((product) => {
      // Price filter
      if (product.price > priceRange) return false;
      
      // Food type filter
      if (selectedFoodTypes.length > 0 && !selectedFoodTypes.includes(product.type)) return false;
      
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) return false;
      
      // Special diet filter
      if (selectedSpecialDiets.length > 0) {
        const hasSpecialDiet = selectedSpecialDiets.some(diet => 
          product.description.toLowerCase().includes(diet.toLowerCase()) ||
          product.name.toLowerCase().includes(diet.toLowerCase())
        );
        if (!hasSpecialDiet) return false;
      }
      
      return true;
    });

    // Sort products
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
        default:
          return b.reviews - a.reviews;
      }
    });
  }, [allFoodProducts, sortBy, selectedFoodTypes, selectedBrands, selectedSpecialDiets, priceRange]);

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
  };

  const handleAddToWishlist = (product) => {
    if (addToWishlist) {
      addToWishlist(product);
    }
  };

  return (
    <section className="shop-all-section">
      <div className="shop-all-container">
        {/* Header */}
        <div className="shop-all-header">
          <div className="header-content">
            <h1 className="shop-all-title">All Food Products</h1>
            <p className="shop-all-subtitle">
              Discover our complete collection of premium pet food and nutrition
            </p>
          </div>
          
          {/* Mobile Filter Toggle */}
          <button 
            className="mobile-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        <div className="shop-all-layout">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3 className="filters-title">Filters</h3>
              <button 
                className="close-filters"
                onClick={() => setShowFilters(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Food Type Filter */}
            <div className="filter-group">
              <h4 className="filter-group-title">Food Type</h4>
              {foodTypes.map((type) => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedFoodTypes.includes(type)}
                    onChange={() => handleFoodTypeChange(type)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">{type}</span>
                </label>
              ))}
            </div>

            {/* Special Diets Filter */}
            <div className="filter-group">
              <h4 className="filter-group-title">Special Diets</h4>
              {specialDiets.map((diet) => (
                <label key={diet} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedSpecialDiets.includes(diet)}
                    onChange={() => handleSpecialDietChange(diet)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">{diet}</span>
                </label>
              ))}
            </div>

            {/* Price Range Filter */}
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

            {/* Brands Filter */}
            <div className="filter-group">
              <h4 className="filter-group-title">Brands</h4>
              {brands.map((brand) => (
                <label key={brand} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">{brand}</span>
                </label>
              ))}
            </div>

            {/* Filter Actions */}
            <div className="filters-actions">
              <button className="reset-button" onClick={resetFilters}>
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="products-content">
            {/* Controls Section */}
            <div className="controls-section">
              <div className="products-count">
                <span>{filteredAndSortedProducts.length} products found</span>
              </div>
              
              <div className="sort-and-view">
                <div className="sort-section">
                  <label htmlFor="sort-select">Sort by:</label>
                  <select 
                    id="sort-select"
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
                
                <div className="view-buttons">
                  <button 
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    Grid
                  </button>
                  <button 
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`products-grid ${viewMode}`}>
              {filteredAndSortedProducts.map((product) => (
                <div key={product.id} className="shop-all-product-item">
                  <ProductCard
                    product={product}
                    showNewBadge={!!product.badge}
                    onAddToCart={handleAddToCart}
                    onProductClick={onProductClick}
                    onAddToWishlist={handleAddToWishlist}
                  />
                </div>
              ))}
            </div>
            
            {filteredAndSortedProducts.length === 0 && (
              <div className="no-products">
                <p>No products match your current filters.</p>
                <button onClick={resetFilters} className="reset-filters-btn">
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShopAll;
