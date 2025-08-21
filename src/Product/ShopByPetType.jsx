import React from 'react';
import { getPlaceholderImage } from './utils/helpers';
import PetTypeCard from './PetTypeCard';

// --- ShopByPetType Section ---
const ShopByPetType = ({ onSelectPetType }) => {
  const petTypes = [
    { type: 'Dogs', products: 124, image: getPlaceholderImage(96, 96, 'Dog', 'f59e0b', 'ffffff') },
    { type: 'Cats', products: 98, image: getPlaceholderImage(96, 96, 'Cat', 'f59e0b', 'ffffff') },
    { type: 'Birds', products: 45, image: getPlaceholderImage(96, 96, 'Bird', 'f59e0b', 'ffffff') },
    { type: 'Fish', products: 58, image: getPlaceholderImage(96, 96, 'Fish', 'f59e0b', 'ffffff') },
    { type: 'Small Pets', products: 28, image: getPlaceholderImage(96, 96, 'Small Pet', 'f59e0b', 'ffffff') },
  ];

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Shop by Pet Type</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {petTypes.map((pet, index) => (
          <PetTypeCard key={index} {...pet} onClick={onSelectPetType} />
        ))}
      </div>
    </section>
  );
};

export default ShopByPetType;