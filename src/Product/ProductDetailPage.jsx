import React, { useState, useEffect } from 'react'
import { Star, Truck, Eye, Share2, MessageSquare, Sparkles } from 'lucide-react'
import { doc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore'
import { getRelatedProducts } from './data/products'
import { getPlaceholderImage } from './utils/helpers'
import ProductCard from '../components/ProductCard'
import './ProductDetailPage.css'

const ProductDetailPage = ({
  product: initialProduct,
  onAddToCart,
  onNavigateHome,
  db,
  userId,
  appId,
  onAddToWishlist,
}) => {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [product, setProduct] = useState(initialProduct)
  const [petCareTips, setPetCareTips] = useState(null)
  const [isGeneratingTips, setIsGeneratingTips] = useState(false)
  const [tipsError, setTipsError] = useState(null)
  const [userQuestion, setUserQuestion] = useState('')
  const [geminiAnswer, setGeminiAnswer] = useState(null)
  const [isAnsweringQuestion, setIsAnsweringQuestion] = useState(false)
  const [questionError, setQuestionError] = useState(null)
  const [liveViewers, setLiveViewers] = useState(0)
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [productBenefits, setProductBenefits] = useState([])
  const [productIngredients, setProductIngredients] = useState([])
  const [productOtherInfo, setProductOtherInfo] = useState('')
  const [isGeneratingDetails, setIsGeneratingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState(null)

  // Generate product details (moved outside useEffect for reusability)
  const generateProductDetails = async () => {
    setIsGeneratingDetails(true)
    setDetailsError(null)
    try {
      const prompt = `Generate detailed product benefits, ingredients, and other information for a pet product named "${product.name}" with the following overview: "${product.overview}".
      Provide the response as a JSON object with three keys: "benefits" (an array of strings), "ingredients" (an array of strings), and "otherInfo" (a single string paragraph).
      
      Example JSON structure:
      {
        "benefits": ["Benefit 1", "Benefit 2"],
        "ingredients": ["Ingredient A", "Ingredient B"],
        "otherInfo": "Additional information about the product."
      }`
      let chatHistory = []
      chatHistory.push({ role: "user", parts: [{ text: prompt }] })
      const payload = {
        contents: chatHistory,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "benefits": { "type": "ARRAY", "items": { "type": "STRING" } },
              "ingredients": { "type": "ARRAY", "items": { "type": "STRING" } },
              "otherInfo": { "type": "STRING" }
            },
            "propertyOrdering": ["benefits", "ingredients", "otherInfo"]
          }
        }
      }
      const apiKey = ""
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const jsonString = result.candidates[0].content.parts[0].text
        try {
          const parsedDetails = JSON.parse(jsonString)
          setProductBenefits(parsedDetails.benefits || [])
          setProductIngredients(parsedDetails.ingredients || [])
          setProductOtherInfo(parsedDetails.otherInfo || '')
        } catch (parseError) {
          setDetailsError('Failed to parse generated details. Invalid JSON from API.')
          console.error('JSON parse error:', parseError, 'Raw JSON:', jsonString)
        }
      } else {
        setDetailsError('Failed to generate product details. Please try again.')
        console.error('Gemini API response structure unexpected:', result)
      }
    } catch (error) {
      setDetailsError('Error connecting to Gemini API. Please check your network or try again later.')
      console.error('Error calling Gemini API:', error)
    } finally {
      setIsGeneratingDetails(false)
    }
  }

  // Reset and fetch details on product change
  useEffect(() => {
    setProduct(initialProduct)
    setPetCareTips(null)
    setTipsError(null)
    setUserQuestion('')
    setGeminiAnswer(null)
    setQuestionError(null)
    setMainImageIndex(0)
    setProductBenefits([])
    setProductIngredients([])
    setProductOtherInfo('')
    setDetailsError(null)
    if (initialProduct) {
      generateProductDetails()
    }

    // Firestore live viewers logic
    let unsubscribe = () => {}
    if (db && userId && product?.id) {
      const productViewRef = doc(db, `artifacts/${appId}/public/data/product_views`, String(product.id))
      const userViewRef = doc(db, `artifacts/${appId}/public/data/product_views/${product.id}/active_users`, userId)

      const incrementView = async () => {
        try {
          await setDoc(userViewRef, { timestamp: Date.now() })
          await updateDoc(productViewRef, { count: increment(1) }, { merge: true })
        } catch (error) {
          console.error("Error incrementing view count:", error)
        }
      }
      const decrementView = async () => {
        try {
          await updateDoc(productViewRef, { count: increment(-1) })
        } catch (error) {
          console.error("Error decrementing view count:", error)
        }
      }
      incrementView()
      unsubscribe = onSnapshot(productViewRef, (docSnap) => {
        if (docSnap.exists()) {
          setLiveViewers(docSnap.data().count || 0)
        } else {
          setLiveViewers(0)
          setDoc(productViewRef, { count: 0 })
        }
      }, (error) => {
        console.error("Error listening to view count:", error)
      })
      return () => {
        decrementView()
        unsubscribe()
      }
    }
  }, [initialProduct, db, userId, appId])

  if (!product) {
    return (
      <div className="product-detail-not-found">
        <p>Product not found. Please go back to the home page.</p>
        <button onClick={onNavigateHome} className="product-detail-not-found__button">
          Go Home
        </button>
      </div>
    )
  }

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, prev + amount))
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className="product-detail__star"
        fill={i < rating ? 'currentColor' : 'none'}
        color={i < rating ? '#f59e0b' : '#e5e7eb'}
        size={20}
      />
    ))
  }

  const dummyRelatedProducts = getRelatedProducts()

  const generatePetCareTips = async () => {
    setIsGeneratingTips(true)
    setTipsError(null)
    try {
      const prompt = `Generate 3-5 concise pet care tips related to "${product.name}" which is a "${product.type}". For example, if it's dog food, provide tips on feeding or nutrition. If it's a cat toy, provide tips on interactive play. Format as a bulleted list.`
      let chatHistory = []
      chatHistory.push({ role: "user", parts: [{ text: prompt }] })
      const payload = { contents: chatHistory }
      const apiKey = ""
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setPetCareTips(result.candidates[0].content.parts[0].text)
      } else {
        setTipsError('Failed to generate tips. Please try again.')
        console.error('Gemini API response structure unexpected:', result)
      }
    } catch (error) {
      setTipsError('Error connecting to Gemini API. Please check your network or try again later.')
      console.error('Error calling Gemini API:', error)
    } finally {
      setIsGeneratingTips(false)
    }
  }

  const askGeminiAboutProduct = async () => {
    if (!userQuestion.trim()) {
      setQuestionError('Please enter a question.')
      return
    }
    setIsAnsweringQuestion(true)
    setQuestionError(null)
    setGeminiAnswer(null)
    try {
      const prompt = `Based on the following product information, answer the user's question.
      Product Name: ${product.name}
      Product Overview: ${product.overview}
      Product Category: ${product.category}
      Product Type: ${product.type}
      User Question: ${userQuestion}
      If you cannot answer based on the provided product information, state that.`
      let chatHistory = []
      chatHistory.push({ role: "user", parts: [{ text: prompt }] })
      const payload = { contents: chatHistory }
      const apiKey = ""
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        setGeminiAnswer(result.candidates[0].content.parts[0].text)
      } else {
        setQuestionError('Failed to get an answer. Please try again.')
        console.error('Gemini API response structure unexpected:', result)
      }
    } catch (error) {
      setQuestionError('Error connecting to Gemini API. Please check your network or try again later.')
      console.error('Error calling Gemini API:', error)
    } finally {
      setIsAnsweringQuestion(false)
    }
  }

  return (
    <div className="product-detail">
      <div className="product-detail__container">
        <div className="product-detail__grid">
          {/* Image Gallery */}
          <div className="product-detail__gallery">
            <div className="product-detail__main-image-container">
              <img
                src={product.images ? product.images[mainImageIndex] : product.image}
                alt={product.name}
                className={`product-detail__main-image ${isZoomed ? 'product-detail__main-image--zoomed' : ''}`}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(400, 300, product.name) }}
              />
            </div>
            <div className="product-detail__thumbnails">
              {product.images && product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`product-detail__thumbnail ${mainImageIndex === index ? 'product-detail__thumbnail--active' : ''}`}
                  onClick={() => setMainImageIndex(index)}
                  onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(80, 80, `Thumb ${index + 1}`) }}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-detail__info">
            <h1 className="product-detail__title">{product.name}</h1>
            <p className="product-detail__overview">
              {product.overview || 'Overview: This product provides essential benefits for your beloved pet.'}
            </p>

            <div className="product-detail__rating">
              {renderStars(product.rating)}
              <span className="product-detail__rating-value">({product.rating.toFixed(1)})</span>
            </div>
            <p className="product-detail__price">Rs. {product.price.toFixed(2)}</p>

            <div className="product-detail__specs">
              <p><strong>Vendor:</strong> Food Bites</p>
              <p><strong>Type:</strong> Food</p>
              <div>
                <strong>Weight:</strong>
                <div className="product-detail__option-buttons">
                  {['1 kg', '2 kg', '3 kg', '4 kg'].map((weight, index) => (
                    <button key={index} className="product-detail__option-button">
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <strong>Special Use:</strong>
                <div className="product-detail__option-buttons">
                  {['Coat', 'Urinary', 'Strong Bone', 'Growth'].map((use, index) => (
                    <button key={index} className="product-detail__option-button">
                      {use}
                    </button>
                  ))}
                </div>
              </div>
              <p><strong>Form:</strong> <span className="product-detail__option-button">Pellet</span></p>
            </div>

            <div className="product-detail__quantity">
              <span>Quantity:</span>
              <div className="product-detail__quantity-controls">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="product-detail__quantity-btn"
                >
                  –
                </button>
                <span className="product-detail__quantity-value">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="product-detail__quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            <p className="product-detail__subtotal">
              <strong>Sub total:</strong> Rs. {(product.price * quantity).toFixed(2)}
            </p>

            <div className="product-detail__action-buttons">
              <button
                onClick={() => onAddToWishlist(product)}
                className="product-detail__action-button product-detail__action-button--wishlist"
              >
                Add To Wishlist
              </button>
              <button
                onClick={() => onAddToCart(product, quantity)}
                className="product-detail__action-button"
              >
                Buy It Now
              </button>
            </div>

            <div className="product-detail__meta">
              <p><Truck className="product-detail__meta-icon product-detail__meta-icon--green" /> Estimated delivery 5-7 days</p>
              <p><Eye className="product-detail__meta-icon product-detail__meta-icon--blue" /> {liveViewers} People are viewing this right now</p>
              <button className="product-detail__share">
                <Share2 className="product-detail__meta-icon" /> Share
              </button>
            </div>

            <p className="product-detail__query-prompt">
              <strong>Let us know about your query!</strong>
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="product-detail__tabs">
          <div className="product-detail__tab-buttons">
            <button
              onClick={() => setActiveTab('description')}
              className={`product-detail__tab-button ${activeTab === 'description' ? 'product-detail__tab-button--active' : ''}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`product-detail__tab-button ${activeTab === 'shipping' ? 'product-detail__tab-button--active' : ''}`}
            >
              Shipping & Returns
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`product-detail__tab-button ${activeTab === 'reviews' ? 'product-detail__tab-button--active' : ''}`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('petCareTips')}
              className={`product-detail__tab-button ${activeTab === 'petCareTips' ? 'product-detail__tab-button--active' : ''}`}
            >
              <Sparkles className="product-detail__tab-icon" /> Pet Care Tips
            </button>
           
          </div>

          {/* Tab Content */}
          <div className="product-detail__tab-content">
            {activeTab === 'description' && (
              <div>
                <h3>Overview</h3>
                <p>{product.overview || 'This dog food contains high-quality proteins as well as antioxidants. Its nutrients are well-balanced, and its digestion is healthier. It aids in the improvement of your digestive system and promotes the growth of your pets.'}</p>
                {detailsError && (
                  <p className="product-detail__error">{detailsError}</p>
                )}
                {isGeneratingDetails ? (
                  <div className="product-detail__loading">
                    <div className="product-detail__spinner"></div>
                    <span>Generating detailed description...</span>
                  </div>
                ) : (
                  <>
                    {productBenefits.length > 0 && (
                      <>
                        <h3>Benefits</h3>
                        <ul className="product-detail__list">
                          {productBenefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {productIngredients.length > 0 && (
                      <>
                        <h3>Ingredients</h3>
                        <ul className="product-detail__list">
                          {productIngredients.map((ingredient, index) => (
                            <li key={index}>{ingredient}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {productOtherInfo && (
                      <>
                        <h3>Other Information</h3>
                        <p>{productOtherInfo}</p>
                      </>
                    )}
                    {!isGeneratingDetails && !detailsError && productBenefits.length === 0 && productIngredients.length === 0 && !productOtherInfo && (
                      <>
                        <h3>Benefits</h3>
                        <ul className="product-detail__list">
                          <li><strong>Immune Support:</strong> It promotes cell growth in your dog. It boosts the immune system and supports your pet's natural defense, which is especially important if you have a puppy.</li>
                          <li><strong>Overall Health:</strong> It promotes your pet's growth and contains high-quality protein, antioxidants, and food that is readily digested.</li>
                          <li><strong>Better Growth:</strong> A rapidly growing puppy is a good applicant for treats with controlled growth cycles.</li>
                          <li><strong>Strong Muscles:</strong> The pet's strong muscles, bones, and teeth are developed because of the protein in the meal.</li>
                          <li><strong>Easy to Chew:</strong> Puppies enjoy eating it because it is easily chewable.</li>
                        </ul>
                        <h3>Ingredients</h3>
                        <ul className="product-detail__list">
                          <li>Crude Protein - 18%</li>
                          <li>Crude Fat - 8%</li>
                          <li>Moisture - 9%</li>
                          <li>Crude Fiber - 3%</li>
                          <li>Vitamin - 5%</li>
                          <li>Sugar - 2%</li>
                          <li>Calcium - 1.2% min</li>
                          <li>Phosphorus - 0.8% min</li>
                          <li>Non-Fiber Carbohydrates - 34% max.</li>
                        </ul>
                        <h3>Other Information</h3>
                        <p>
                          The desire of the animal varies as a result of shifting locations and weather. Some claim that dogs generally eat more during the winter than during the summer. It is beautifully constructed using the proper natural food formula and kept for 90 days from the date of manufacturing. Before administering this food to your pet, it is preferable to speak with a veterinarian.
                        </p>
                      </>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3>Shipping Policy</h3>
                <p>Orders are typically processed within 1-2 business days. Standard shipping usually takes 5-7 business days. Expedited shipping options are available at checkout.</p>
                <h3>Returns Policy</h3>
                <p>We offer a 30-day return policy for most products. Items must be unused and in their original packaging. Please contact our customer service for return authorization.</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3>Customer Reviews</h3>
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            )}

            {activeTab === 'petCareTips' && (
              <div>
                <h3>Pet Care Tips for {product.name}</h3>
                <button
                  onClick={generatePetCareTips}
                  disabled={isGeneratingTips}
                  className="product-detail__tips-button"
                >
                  {isGeneratingTips ? (
                    <>
                      <div className="product-detail__spinner"></div>
                      <span>Generating Tips...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="product-detail__tips-icon" />
                      <span>Generate Pet Care Tips</span>
                    </>
                  )}
                </button>
                {tipsError && <p className="product-detail__error">{tipsError}</p>}
                {petCareTips && (
                  <div className="product-detail__tips-content">
                    {petCareTips.split('\n').map((item, index) => (
                      <React.Fragment key={index}>
                        {item}
                        <br />
                      </React.Fragment>
                    ))}
                  </div>
                )}
                {!petCareTips && !isGeneratingTips && !tipsError && (
                  <p className="product-detail__tips-empty">Click the button above to get personalized pet care tips for this product!</p>
                )}
              </div>
            )}

            {activeTab === 'askGemini' && (
              <div>
                <h3>Ask Gemini about {product.name}</h3>
                <textarea
                  className="product-detail__question-input"
                  rows="3"
                  placeholder="e.g., What are the main benefits of this dog food for puppies?"
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                ></textarea>
                <button
                  onClick={askGeminiAboutProduct}
                  disabled={isAnsweringQuestion || !userQuestion.trim()}
                  className="product-detail__ask-button"
                >
                  {isAnsweringQuestion ? (
                    <>
                      <div className="product-detail__spinner"></div>
                      <span>Getting Answer...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="product-detail__ask-icon" />
                      <span>Ask Question</span>
                    </>
                  )}
                </button>
                {questionError && <p className="product-detail__error">{questionError}</p>}
                {geminiAnswer && (
                  <div className="product-detail__answer">
                    <h4>Gemini's Answer</h4>
                    <p>{geminiAnswer}</p>
                  </div>
                )}
                {!geminiAnswer && !isAnsweringQuestion && !questionError && (
                  <p className="product-detail__ask-empty">Type your question above and click "Ask Question" to get an answer from Gemini!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="product-detail__related">
          <h2 className="product-detail__related-title">You may also like</h2>
          <div className="product-detail__related-items">
            {dummyRelatedProducts.map(product => (
              <div key={product.id} className="product-detail__related-item">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onProductClick={() => {}}
                  onAddToWishlist={onAddToWishlist}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
