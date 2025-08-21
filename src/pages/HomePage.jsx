import React from 'react';
import HeroSection from '../Home/HeroSection';
import PopularProducts from '../Home/PopularProducts';
import ShopByCategory from '../Home/ShopByCategory';
import PetTypeSection from '../Home/PetTypeSection';
import OurServices from '../Home/OurServices';
import Testimonials from '../Home/Testimonials';
import PetCareBlog from '../Home/PetCareBlog';
import NearbyPetShops from '../Home/NearbyPetShops';
import PetAdoptionAgencies from '../Home/PetAdoptionAgencies';
import PetTaxiService from '../Home/PetTaxiService';
import HelpStreetDogs from '../Home/HelpStreetDogs';
import DownloadApp from '../Home/DownloadApp';
import './HomePage.css';

const HomePage = ({
  globalCartItems,
  globalWishlistItems,
  addToGlobalCart,
  addToGlobalWishlist,
  removeFromGlobalCart,
  removeFromGlobalWishlist,
  onNavigateFood,
  onNavigateProduct,
  onNavigateService,
  onNavigateAbout
}) => {
  // Sample data for all components
  const sampleProducts = [
    { 
      id: 1, 
      name: "Premium Dog Food", 
      price: 899, 
      image: "https://via.placeholder.com/250x200?text=Dog+Food", 
      category: "Food",
      rating: 4.8,
      brand: "Pedigree"
    },
    { 
      id: 2, 
      name: "Cat Litter Box", 
      price: 3999, 
      image: "https://via.placeholder.com/250x200?text=Litter+Box", 
      category: "Hygiene",
      rating: 4.5,
      brand: "Whiskas"
    },
    { 
      id: 3, 
      name: "Dog Collar", 
      price: 599, 
      image: "https://via.placeholder.com/250x200?text=Dog+Collar", 
      category: "Accessories",
      rating: 4.3,
      brand: "PetSafe"
    },
    { 
      id: 4, 
      name: "Pet Toy", 
      price: 299, 
      image: "https://via.placeholder.com/250x200?text=Pet+Toy", 
      category: "Toys",
      rating: 4.6,
      brand: "Kong"
    },
    { 
      id: 5, 
      name: "Bird Cage", 
      price: 2499, 
      image: "https://via.placeholder.com/250x200?text=Bird+Cage", 
      category: "Housing",
      rating: 4.4,
      brand: "Prevue"
    }
  ];

  const sampleCategories = [
    { id: 1, name: "Dogs", image: "https://via.placeholder.com/300x200?text=Dogs" },
    { id: 2, name: "Cats", image: "https://via.placeholder.com/300x200?text=Cats" },
    { id: 3, name: "Birds", image: "https://via.placeholder.com/300x200?text=Birds" },
    { id: 4, name: "Fish", image: "https://via.placeholder.com/300x200?text=Fish" },
    { id: 5, name: "Small Animals", image: "https://via.placeholder.com/300x200?text=Small+Animals" }
  ];

  const samplePetTypes = [
    { id: 1, name: "Dogs", icon: "https://via.placeholder.com/60x60?text=�" },
    { id: 2, name: "Cats", icon: "https://via.placeholder.com/60x60?text=🐱" },
    { id: 3, name: "Birds", icon: "https://via.placeholder.com/60x60?text=�" },
    { id: 4, name: "Fish", icon: "https://via.placeholder.com/60x60?text=🐠" },
    { id: 5, name: "Rabbits", icon: "https://via.placeholder.com/60x60?text=🐰" }
  ];

  const sampleServices = [
    { id: 1, name: "Pet Grooming", description: "Professional grooming services for all pets" },
    { id: 2, name: "Veterinary Care", description: "24/7 emergency and routine veterinary services" },
    { id: 3, name: "Pet Training", description: "Behavior training and obedience classes" },
    { id: 4, name: "Pet Sitting", description: "Reliable pet sitting and boarding services" }
  ];

  const sampleTestimonials = [
    { id: 1, customer: "Alice Johnson", review: "Our dog had a fantastic time with the dog walker!", service: "Dog Walking" },
    { id: 2, customer: "Bob Smith", review: "The pet sitting service was excellent, very reliable.", service: "Pet Sitting" },
    { id: 3, customer: "Charlie Brown", review: "Found a wonderful new family member through the adoption agency.", service: "Pet Adoption" },
    { id: 4, customer: "Diana Prince", review: "The pet taxi service was a lifesaver for our vet visit.", service: "Pet Taxi" }
  ];

  const sampleBlogPosts = [
    { id: 1, title: "10 Tips for a Healthy Pet Diet", snippet: "Learn how to keep your pet healthy with proper nutrition...", image: "https://via.placeholder.com/300x200?text=Pet+Diet" },
    { id: 2, title: "Pet Safety During Winter", snippet: "Essential tips to keep your pets safe during cold weather...", image: "https://via.placeholder.com/300x200?text=Winter+Safety" },
    { id: 3, title: "Understanding Pet Behavior", snippet: "Decode your pet's behavior and strengthen your bond...", image: "https://via.placeholder.com/300x200?text=Pet+Behavior" }
  ];

  const samplePetShops = [
    { id: 1, name: "Paw Paradise", address: "123 Pet Lane, Delhi", phone: "9876543210", image: "https://via.placeholder.com/200x150?text=Shop1" },
    { id: 2, name: "Furry Friends Store", address: "456 Bark St, Delhi", phone: "9876543211", image: "https://via.placeholder.com/200x150?text=Shop2" },
    { id: 3, name: "The Pet Hub", address: "789 Meow Ave, Delhi", phone: "9876543212", image: "https://via.placeholder.com/200x150?text=Shop3" }
  ];

  const sampleAgencies = [
    { id: 1, name: "Delhi Animal Rescue", location: "Central Delhi", website: "https://example.com" },
    { id: 2, name: "Paws & Hearts", location: "South Delhi", website: "https://example.com" },
    { id: 3, name: "Furry Friends Foundation", location: "North Delhi", website: "https://example.com" }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <HeroSection />

      {/* Shop by Category */}
      <ShopByCategory categories={sampleCategories} />

      {/* Pet Types Section */}
      <PetTypeSection petTypes={samplePetTypes} />

      {/* Popular Products */}
      <PopularProducts 
        products={sampleProducts}
        addToCart={addToGlobalCart}
        addToWishlist={addToGlobalWishlist}
        onProductClick={onNavigateProduct}
      />

      {/* Our Services */}
      <OurServices services={sampleServices} />

      {/* Pet Taxi Service */}
      <PetTaxiService />

      {/* Help Street Dogs */}
      <HelpStreetDogs />

      {/* Testimonials */}
      <Testimonials testimonials={sampleTestimonials} />

      {/* Pet Care Blog */}
      <PetCareBlog blogPosts={sampleBlogPosts} />

      {/* Nearby Pet Shops */}
      <NearbyPetShops petShops={samplePetShops} />

      {/* Pet Adoption Agencies */}
      <PetAdoptionAgencies agencies={sampleAgencies} />

      {/* Download App */}
      <DownloadApp />
    </div>
  );
};

export default HomePage;
