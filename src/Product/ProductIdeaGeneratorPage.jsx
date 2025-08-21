import React, { useState } from "react"
import { X, Sparkles, ShoppingCart, ChevronLeft, Trash2, ChevronRight } from "lucide-react"
import ProductCard from "../components/ProductCard"
import { getPlaceholderImage } from "./utils/helpers"
import "./ProductIdeaGeneratorPage.css"

const ProductIdeaGeneratorPage = ({
  onNavigateHome,
  onAddToCart,
  onProductClick,
  onAddToWishlist,
}) => {
  const [productName, setProductName] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productInStock, setProductInStock] = useState(true)
  const [brandName, setBrandName] = useState("")
  const [uploadedMediaPreviews, setUploadedMediaPreviews] = useState([])

  const [generatedProduct, setGeneratedProduct] = useState(null)
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false)
  const [ideaError, setIdeaError] = useState(null)

  const handleMediaUpload = (event) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setUploadedMediaPreviews(prev => [
            ...prev,
            { src: reader.result, type: file.type.startsWith("image/") ? "image" : "video", name: file.name }
          ])
        }
        reader.readAsDataURL(file)
      } else {
        console.warn("Unsupported file type:", file.type)
      }
    })
    event.target.value = null
  }

  const handleRemoveMedia = (indexToRemove) => {
    setUploadedMediaPreviews(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleAddToWishlist = onAddToWishlist || (() => console.log("Add to wishlist clicked"))

  const handleGenerateIdea = async () => {
    if (!productName.trim() || !productCategory.trim() || productPrice === "" || !brandName.trim()) {
      setIdeaError("Please enter product name, category, price, and brand name.")
      return
    }

    setIsGeneratingIdea(true)
    setIdeaError(null)
    setGeneratedProduct(null)

    // API call code here with your prompt and Gemini API logic
    // For this example, we’ll use a placeholder generatedProduct
    setTimeout(() => {
      setGeneratedProduct({
        id: Date.now(),
        name: productName,
        category: productCategory,
        type: "Generated Product",
        price: parseFloat(productPrice) || 29.99,
        rating: (Math.random() * 4 + 1).toFixed(1),
        overview: `A ${productCategory} called ${productName} by ${brandName}, designed for pet lovers. Perfect for enhancing your pet’s daily routine.`,
        images: [
          getPlaceholderImage(200, 150, productName, "fcd34d", "ffffff"),
          getPlaceholderImage(200, 150, `${productName} 2`, "e0e0e0", "666666"),
          getPlaceholderImage(200, 150, `${productName} 3`, "cccccc", "333333"),
        ],
        inStock: productInStock,
      })
      setIsGeneratingIdea(false)
    }, 1500)
  }

  return (
    <div className="idea-generator">
      <div className="idea-generator__container">
        <h2 className="idea-generator__title">Product Idea Generator</h2>
        <p className="idea-generator__subtitle">Enter details, and let Gemini generate a new product idea!</p>

        <div className="idea-generator__field">
          <label htmlFor="productName" className="idea-generator__label">Product Name:</label>
          <input
            type="text"
            id="productName"
            className="idea-generator__input"
            placeholder="e.g., Super Chew Toy"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div className="idea-generator__field">
          <label htmlFor="productCategory" className="idea-generator__label">Category:</label>
          <input
            type="text"
            id="productCategory"
            className="idea-generator__input"
            placeholder="e.g., Toys & Accessories (or Food, Grooming, etc.)"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          />
        </div>

        <div className="idea-generator__field">
          <label htmlFor="productPrice" className="idea-generator__label">Price (Rs.):</label>
          <input
            type="number"
            id="productPrice"
            className="idea-generator__input"
            placeholder="e.g., 29.99"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="idea-generator__field">
          <label htmlFor="brandName" className="idea-generator__label">Brand Name:</label>
          <input
            type="text"
            id="brandName"
            className="idea-generator__input"
            placeholder="e.g., PetCo"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </div>

        <div className="idea-generator__field">
          <label htmlFor="mediaUpload" className="idea-generator__label">Upload Images/Videos (local preview):</label>
          <input
            type="file"
            id="mediaUpload"
            accept="image/*,video/*"
            multiple
            className="idea-generator__file"
            onChange={handleMediaUpload}
          />
          {uploadedMediaPreviews.length > 0 && (
            <div className="idea-generator__media-previews">
              {uploadedMediaPreviews.map((media, index) => (
                <div key={index} className="idea-generator__media-preview">
                  {media.type === "image" ? (
                    <img
                      src={media.src}
                      alt={`Uploaded ${media.name}`}
                      className="idea-generator__media-image"
                    />
                  ) : (
                    <video
                      src={media.src}
                      controls
                      className="idea-generator__media-video"
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <button
                    onClick={() => handleRemoveMedia(index)}
                    className="idea-generator__media-remove"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="idea-generator__media-note">
            Note: Uploaded media is for local preview only and will not be used by the AI.
          </p>
        </div>

        <div className="idea-generator__stock-field">
          <input
            type="checkbox"
            id="productInStock"
            className="idea-generator__checkbox"
            checked={productInStock}
            onChange={(e) => setProductInStock(e.target.checked)}
          />
          <label htmlFor="productInStock" className="idea-generator__stock-label">In Stock</label>
        </div>

        <button
          onClick={handleGenerateIdea}
          disabled={
            isGeneratingIdea ||
            !productName.trim() ||
            !productCategory.trim() ||
            productPrice === "" ||
            !brandName.trim()
          }
          className="idea-generator__generate-button"
        >
          {isGeneratingIdea ? (
            <>
              <div className="idea-generator__spinner"></div>
              Generating Idea...
            </>
          ) : (
            <>
              <Sparkles className="idea-generator__button-icon" />
              Generate Product Idea
            </>
          )}
        </button>
        {ideaError && <p className="idea-generator__error">{ideaError}</p>}

        {generatedProduct && (
          <div className="idea-generator__result">
            <h3 className="idea-generator__result-title">Your New Product Idea:</h3>
            <ProductCard
              product={generatedProduct}
              onAddToCart={onAddToCart}
              onProductClick={onProductClick}
              showNewBadge={true}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductIdeaGeneratorPage
