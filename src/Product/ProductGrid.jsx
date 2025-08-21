import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import './ProductGrid.css'

const ProductGrid = ({ products, onAddToCart, onProductClick, onAddToWishlist }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 8

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)

  const totalPages = Math.ceil(products.length / productsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="product-grid">
      <div className="product-grid__header">
        <span className="product-grid__count">Showing {products.length} products</span>
        <div className="product-grid__sort">
          <span>Sort by:</span>
          <select className="product-grid__sort-select">
            <option>Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </div>

      <div className="product-grid__items">
        {currentProducts.map(product => (
          <div key={product.id} className="product-grid__item">
            <ProductCard
              product={product}
              showNewBadge={true}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
              onAddToWishlist={onAddToWishlist}
            />
          </div>
        ))}
      </div>

      <div className="product-grid__pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="product-grid__page-button product-grid__page-button--prev"
        >
          <ChevronLeft />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`product-grid__page-button ${currentPage === index + 1 ? 'product-grid__page-button--active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="product-grid__page-button product-grid__page-button--next"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

export default ProductGrid
