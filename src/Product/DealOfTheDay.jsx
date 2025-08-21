import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { getDealOfTheDayProducts } from '../Food/data/products'
import './DealOfTheDay.css'
import DealOfTheDayBanner from './DealOfTheDayBanner'

const DealOfTheDay = ({ onAddToCart, onProductClick, onAddToWishlist }) => {
  const products = getDealOfTheDayProducts()

  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 19 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime
        if (seconds > 0) {
          seconds--
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes--
          } else {
            minutes = 59
            if (hours > 0) {
              hours--
            } else {
              clearInterval(timer)
              return { hours: 0, minutes: 0, seconds: 0 }
            }
          }
        }
        return { hours, minutes, seconds }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const padZero = num => String(num).padStart(2, '0')

  return (
    <section className="deal-of-the-day">
      <div className="deal-of-the-day__container">
                  <DealOfTheDayBanner></DealOfTheDayBanner>
        <div className="deal-of-the-day__header">
          <div className="deal-of-the-day__timer">
            <span className="deal-of-the-day__timer-label">Ends in:</span>
            <div className="deal-of-the-day__timer-digits">
              <span className="deal-of-the-day__timer-digit">{padZero(timeLeft.hours)}</span>
              <span className="deal-of-the-day__timer-separator">:</span>
              <span className="deal-of-the-day__timer-digit">{padZero(timeLeft.minutes)}</span>
              <span className="deal-of-the-day__timer-separator">:</span>
              <span className="deal-of-the-day__timer-digit">{padZero(timeLeft.seconds)}</span>
            </div>
          </div>
        </div>
        <div className="deal-of-the-day__products">
          {products.map(product => (
            <div key={product.id} className="deal-of-the-day__product">
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
      </div>
    </section>
  )
}

export default DealOfTheDay
