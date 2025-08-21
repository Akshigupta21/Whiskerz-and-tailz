import React from 'react'
import { getPlaceholderImage } from './utils/helpers'
import './PetTypeCard.css'

const PetTypeCard = ({ type, products, image, onClick }) => {
  return (
    <article
      className="pet-type-card"
      onClick={() => onClick(type)}
    >
      <img
        src={image}
        alt={type}
        className="pet-type-card__image"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = getPlaceholderImage(96, 96, type)
        }}
      />
      <h3 className="pet-type-card__title">{type}</h3>
      <p className="pet-type-card__count">{products} products</p>
    </article>
  )
}

export default PetTypeCard
