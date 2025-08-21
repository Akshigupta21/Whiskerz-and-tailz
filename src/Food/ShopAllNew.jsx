import React, { useState, useMemo } from 'react';
import { ShoppingCart, Heart, Star, GitCompare, Eye, Filter, X } from 'lucide-react';
import './ShopAll.css';

function ShopAll({ addToCart, addToWishlist, onProductClick }) {
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [wishlist, setWishlist] = useState([]);
  const [hoveredImages, setHoveredImages] = useState({});
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState(100);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [selectedSpecialDiets, setSelectedSpecialDiets] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Foods');

  // Filter options
  const foodTypes = ["Dry Food", "Wet Food", "Raw Food", "Treats", "Supplements"];
  const specialDiets = ["Grain-Free", "Hypoallergenic", "Weight Management", "Senior Nutrition"];
  const brands = ["Royal Canin", "Hill's Science Diet", "Blue Buffalo", "Purina Pro Plan", "Nutramax"];
  const categories = ["All Foods", "Dog Food", "Cat Food", "Bird Food", "Fish Food", "Small Pet Food"];

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
      name: "Organic Cat Food",
      brand: "Blue Buffalo",
      category: "Pet Food",
      type: "Dry Food",
      price: 52.99,
      originalPrice: 62.99,
      rating: 4.7,
      reviews: 178,
      image: "https://placehold.co/250x200/FFE4E1/FF69B4?text=Organic+Cat+Food",
      images: [
        "https://placehold.co/250x200/FFE4E1/FF69B4?text=Organic+Cat+Food",
        "https://placehold.co/250x200/FFD4D1/FF4984?text=Cat+Food+2"
      ],
      badge: "NEW",
      description: "Premium organic nutrition for cats"
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
    setSelectedCategory('All Foods');
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
      
      // Category filter
      if (selectedCategory !== 'All Foods') {
        // Add logic based on your category structure
        if (selectedCategory === 'Dog Food' && !product.name.toLowerCase().includes('dog')) return false;
        if (selectedCategory === 'Cat Food' && !product.name.toLowerCase().includes('cat')) return false;
      }
      
      // Special diet filter (this would need product data enhancement)
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
  }, [allFoodProducts, sortBy, selectedFoodTypes, selectedBrands, selectedCategory, selectedSpecialDiets, priceRange]);

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
  };

  const handleAddToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
    if (addToWishlist) {
      addToWishlist(product);
    }
  };

  const handleMouseEnter = (productId) => {
    setHoveredImages(prev => ({ ...prev, [productId]: true }));
  };

  const handleMouseLeave = (productId) => {
    setHoveredImages(prev => ({ ...prev, [productId]: false }));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="star half" />);
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
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

            {/* Category Filter */}
            <div className="filter-group">
              <h4 className="filter-group-title">Category</h4>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
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
          <div className="shop-all-main">
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
              {filteredAndSortedProducts.map((product) => {
                const isHovered = hoveredImages[product.id];
                const currentImage = isHovered && product.images && product.images.length > 1 
                  ? product.images[1] 
                  : product.images ? product.images[0] : product.image;

                return (
                  <div 
                    key={product.id}
                    className="product-card"
                    onMouseEnter={() => handleMouseEnter(product.id)}
                    onMouseLeave={() => handleMouseLeave(product.id)}
                  >
                    <div className="product-image-container">
                      <img 
                        src={currentImage} 
                        alt={product.name}
                        className="product-image"
                        onClick={() => onProductClick && onProductClick(product)}
                      />
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}
                      <div className="product-actions">
                        <button 
                          className="action-btn"
                          onClick={() => handleAddToWishlist(product)}
                          aria-label="Add to wishlist"
                        >
                          <Heart 
                            className={`heart-icon ${wishlist.includes(product.id) ? 'filled' : ''}`}
                            size={18}
                          />
                        </button>
                        <button className="action-btn" aria-label="Compare">
                          <GitCompare size={18} />
                        </button>
                        <button 
                          className="action-btn"
                          onClick={() => onProductClick && onProductClick(product)}
                          aria-label="Quick view"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="product-content">
                      <p className="product-brand">{product.brand}</p>
                      <h3 className="product-name">{product.name}</h3>
                      
                      <div className="product-rating">
                        <div className="stars">
                          {renderStars(product.rating)}
                        </div>
                        <span className="rating-text">({product.reviews})</span>
                      </div>
                      
                      <div className="product-price">
                        <span className="current-price">${product.price}</span>
                        {product.originalPrice && (
                          <span className="original-price">${product.originalPrice}</span>
                        )}
                      </div>
                      
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
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
