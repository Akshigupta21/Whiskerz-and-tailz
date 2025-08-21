import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection'; // Dynamic HeroSection component
import { getHeroConfig } from '../config/heroConfig';
import ShopByPet from '../components/ShopByPet';
import PopularProducts from './PopularProducts';
import Testimonials from './Testimonials';
import DownloadApp from './DownloadApp';
import HelpStreetDogs from './HelpStreetDogs';
import NearbyPetShops from './NearbyPetShops';
import OurServices from './OurServices';
import PetAdoptionAgencies from './PetAdoptionAgencies';
import BlogPostsGrid from '../components/BlogPostsGrid';
import PetTaxiService from './PetTaxiService';
import PetTypeSection from './PetTypeSection';
import petShopsData from '../data/petShops.json'; // Import pet shops data
import adoptionAgenciesData from '../data/adoptionAgencies.json'; // Import adoption agencies data
import './HomePage.css'; // Enhanced CSS styles

const HomePage = ({ 
  globalCartItems = [], 
  globalWishlistItems = [], 
  addToGlobalCart, 
  addToGlobalWishlist, 
  removeFromGlobalCart, 
  removeFromGlobalWishlist,
  onNavigateFood,
  onNavigateProduct,
  onNavigateService,
  onNavigateAbout
}) => {
  // Get hero configuration for Home page
  const heroConfig = getHeroConfig('home');

  // State for scroll-to-top button
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Hero action handlers
  const handleShopNow = () => {
    // Scroll to popular products section
    const productsSection = document.querySelector('.popular-products, .shop-by-category');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMore = () => {
    // Navigate to about page or scroll to services
    if (onNavigateAbout) {
      onNavigateAbout();
    } else {
      const servicesSection = document.querySelector('.our-services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleWatchStory = () => {
    // You can implement video modal functionality here
    console.log('Watch story video');
  };
  // --- Data for Testimonials ---
  const myTestimonials = [
    { 
      id: 1, 
      customer: "Priya Sharma", 
      review: "Our Golden Retriever absolutely loves the dog walking service! The walker sends photos and updates throughout the walk, which gives us peace of mind while we're at work. Highly recommend!", 
      service: "Dog Walking",
      rating: 5,
      location: "Mumbai"
    },
    { 
      id: 2, 
      customer: "Rajesh Kumar", 
      review: "The pet sitting service was excellent and very reliable. Our cats were well cared for during our vacation, and we received daily updates with photos. It felt like we never left home!", 
      service: "Pet Sitting",
      rating: 5,
      location: "Delhi"
    },
    { 
      id: 3, 
      customer: "Ananya Gupta", 
      review: "Found a wonderful new family member through the adoption agency. The staff was incredibly helpful and patient throughout the entire process. Our rescue dog has brought so much joy to our family!", 
      service: "Pet Adoption",
      rating: 5,
      location: "Bangalore"
    },
    { 
      id: 4, 
      customer: "Vikram Patel", 
      review: "The pet taxi service was a lifesaver for our vet visit. The driver was professional, the vehicle was clean and pet-friendly, and our anxious cat arrived stress-free. Amazing service!", 
      service: "Pet Taxi",
      rating: 5,
      location: "Pune"
    },
    {
      id: 5,
      customer: "Kavya Reddy",
      review: "The grooming service transformed our fluffy Persian cat! Professional, gentle, and the results were amazing. Our cat looked and felt like royalty afterwards.",
      service: "Pet Grooming",
      rating: 5,
      location: "Chennai"
    },
    {
      id: 6,
      customer: "Arjun Singh",
      review: "Excellent training program for our puppy! The trainer was patient and knowledgeable, and we saw remarkable improvements in just a few sessions.",
      service: "Pet Training",
      rating: 5,
      location: "Hyderabad"
    }
  ];

  // --- Data for NearbyPetShops - Now using JSON data ---
  const nearbyPetShopsData = petShopsData.petShops;

  // --- Data for PopularProducts ---
  const popularProductsData = [
    { 
      id: 1, 
      name: "Orthopedic Dog Bed", 
      price: "₹2500", 
      originalPrice: "₹3200",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 234
    },
    { 
      id: 2, 
      name: "Interactive Cat Toy", 
      price: "₹800", 
      originalPrice: "₹1100",
      image: "https://images.unsplash.com/photo-1545225597-3a9672dee2d8?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 156
    },
    { 
      id: 3, 
      name: "Premium Bird Seed (5kg)", 
      price: "₹750", 
      originalPrice: "₹950",
      image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 89
    },
    { 
      id: 4, 
      name: "Fish Tank Filter", 
      price: "₹1200", 
      originalPrice: "₹1500",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 123
    },
  ];

  // --- Data for OurServices ---
  const ourServicesData = [
    { 
      id: 1, 
      name: "Dog Walking", 
      description: "Professional dog walking services tailored to your pet's needs.",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop",
      icon: "🐕‍🦺",
      price: "Starting ₹200/walk",
      features: ["30-60 min walks", "GPS tracking", "Photo updates", "Flexible scheduling"]
    },
    { 
      id: 2, 
      name: "Pet Sitting", 
      description: "Reliable in-home pet sitting while you're away.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
      icon: "🏠",
      price: "Starting ₹500/day",
      features: ["24/7 care", "Home security", "Daily updates", "Emergency support"]
    },
    { 
      id: 3, 
      name: "Grooming", 
      description: "Full-service grooming for all breeds.",
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop",
      icon: "✂️",
      price: "Starting ₹800/session",
      features: ["Bath & brush", "Nail trimming", "Ear cleaning", "Professional styling"]
    },
    { 
      id: 4, 
      name: "Training", 
      description: "Positive reinforcement training classes.",
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
      icon: "🎓",
      price: "Starting ₹1200/session",
      features: ["Basic obedience", "Behavior modification", "Socialization", "Custom programs"]
    },
    { 
      id: 5, 
      name: "Veterinary Care", 
      description: "24/7 emergency and routine veterinary services.",
      image: "https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=300&h=300&fit=crop",
      icon: "🏥",
      price: "Starting ₹500/visit",
      features: ["Health checkups", "Vaccinations", "Emergency care", "Surgery services"]
    },
    { 
      id: 6, 
      name: "Pet Boarding", 
      description: "Safe and comfortable boarding facilities.",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&h=300&fit=crop",
      icon: "🏨",
      price: "Starting ₹1000/day",
      features: ["24/7 supervision", "Play activities", "Regular feeding", "Daily updates"]
    },
    { 
      id: 7, 
      name: "Pet Taxi", 
      description: "Safe transportation for your pets.",
      image: "https://images.unsplash.com/photo-1544525977-0b62f514c4e9?w=300&h=300&fit=crop",
      icon: "🚗",
      price: "Starting ₹300/trip",
      features: ["Climate controlled", "Pet-safe vehicles", "GPS tracking", "Professional drivers"]
    },
    { 
      id: 8, 
      name: "Pet Photography", 
      description: "Capture beautiful memories with your pets.",
      image: "https://images.unsplash.com/photo-1422565096762-bdb997a56a84?w=300&h=300&fit=crop",
      icon: "📸",
      price: "Starting ₹2000/session",
      features: ["Professional photos", "Multiple poses", "Digital copies", "Print options"]
    },
  ];

  // --- Data for PetAdoptionAgencies - Now using JSON data ---
  const adoptionAgenciesDataList = adoptionAgenciesData.adoptionAgencies;

  // --- Data for PetCareBlog - Enhanced content ---
  const blogPostsData = [
    { 
      id: 1, 
      title: "The Complete Guide to Puppy Training Success", 
      snippet: "Master the art of puppy training with proven techniques from professional dog trainers. Learn potty training, basic commands, socialization tips, and how to handle common behavioral issues during your puppy's crucial first months...", 
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop",
      author: "Dr. Sarah Wilson",
      publishDate: "2024-07-25",
      readTime: "8 min read",
      category: "Training",
      likes: 247,
      views: 3120
    },
    { 
      id: 2, 
      title: "Decode Your Cat's Secret Language", 
      snippet: "Unlock the mysteries of feline communication! From tail positions to purring patterns, learn to understand what your cat is really trying to tell you. Discover the fascinating world of cat behavior and strengthen your bond...", 
      image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=250&fit=crop",
      author: "Dr. Michael Chen",
      publishDate: "2024-07-20",
      readTime: "6 min read",
      category: "Behavior",
      likes: 189,
      views: 2480
    },
    { 
      id: 3, 
      title: "Senior Dog Nutrition: A Veterinarian's Guide", 
      snippet: "As your faithful companion ages, their nutritional needs change dramatically. Learn about joint support supplements, digestive health, weight management, and the best foods to keep your senior dog thriving in their golden years...", 
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=250&fit=crop",
      author: "Dr. Emily Rodriguez",
      publishDate: "2024-07-15",
      readTime: "7 min read",
      category: "Health",
      likes: 298,
      views: 2890
    },
    { 
      id: 4, 
      title: "From Cage to Paradise: Bird Care Mastery", 
      snippet: "Transform your home into a bird sanctuary with expert advice on cage setup, proper lighting, temperature control, and nutrition. Learn about different bird species' unique needs and create an environment where your feathered friend can truly flourish...", 
      image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=250&fit=crop",
      author: "Dr. Alex Thompson",
      publishDate: "2024-07-10",
      readTime: "9 min read",
      category: "Care",
      likes: 156,
      views: 1820
    },
    { 
      id: 5, 
      title: "Aquarium Mastery: Building Your Underwater Ecosystem", 
      snippet: "Create a stunning aquatic world in your home with this comprehensive guide. From choosing the right tank size and filtration system to selecting compatible fish species and maintaining perfect water chemistry - everything you need for aquarium success...", 
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c23a?w=400&h=250&fit=crop",
      author: "Marina Fish Expert",
      publishDate: "2024-07-05",
      readTime: "12 min read",
      category: "Aquarium",
      likes: 224,
      views: 2150
    },
    { 
      id: 6, 
      title: "Brain Games for Bored Pets: Mental Enrichment Ideas", 
      snippet: "Combat pet boredom with these creative mental stimulation activities! Discover DIY puzzle toys, scent games, training challenges, and interactive play ideas that will keep your furry friends mentally sharp and emotionally satisfied...", 
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=250&fit=crop",
      author: "Pet Behaviorist Lisa",
      publishDate: "2024-06-30",
      readTime: "6 min read",
      category: "Entertainment",
      likes: 312,
      views: 2670
    }
  ];

  // --- Data for PetTaxiService ---
  const petTaxiServiceTypes = [
    { id: 1, name: "Vet Visits", description: "Safe transport to and from vet appointments." },
    { id: 2, name: "Airport Transfers", description: "Comfortable travel for pets flying with you." },
    { id: 3, name: "Grooming Salon Trips", description: "Convenient rides to grooming appointments." },
  ];

  // --- Data for PetTypeSection ---
  const petTypesData = [
    { id: 1, name: "Dogs", icon: "https://via.placeholder.com/80?text=DogIcon" },
    { id: 2, name: "Cats", icon: "https://via.placeholder.com/80?text=CatIcon" },
    { id: 3, name: "Birds", icon: "https://via.placeholder.com/80?text=BirdIcon" },
    { id: 4, name: "Fish", icon: "https://via.placeholder.com/80?text=FishIcon" },
    { id: 5, name: "Rabbits", icon: "https://via.placeholder.com/80?text=RabbitIcon" },
  ];

  return (
    <div className="homepage-container">
      {/* Dynamic Hero Section */}
      <HeroSection 
        {...heroConfig}
        onButtonClick={handleShopNow}
        onSecondaryButtonClick={handleLearnMore}
        onVideoClick={handleWatchStory}
      />

      {/* Shop By Pet Section */}
      <ShopByPet 
        pageType="homepage" 
        onNavigateProduct={onNavigateProduct}
        onNavigateFood={onNavigateFood}
        onNavigateService={onNavigateService}
      />

      {/* Popular Products Section */}
      <section className="homepage-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Popular Products</h2>
            <p className="section-subtitle">Best-selling items loved by pets and their parents</p>
          </div>
          <PopularProducts 
            products={popularProductsData}
            addToCart={addToGlobalCart}
            addToWishlist={addToGlobalWishlist}
            onProductClick={onNavigateProduct}
          />
        </div>
      </section>

      {/* Professional Pet Services */}
      <OurServices services={ourServicesData} />

      {/* Testimonials Section */}
      <section className="homepage-section testimonials-wrapper">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What Pet Parents Say</h2>
            <p className="section-subtitle">Real experiences from our happy community</p>
          </div>
          <Testimonials testimonials={myTestimonials} />
        </div>
      </section>

      {/* Download App Section */}
      <section className="homepage-section">
        <div className="section-container">
          <DownloadApp />
        </div>
      </section>

      {/* Help Street Animals Section */}
      <section className="homepage-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Help Street Animals</h2>
            <p className="section-subtitle">Join our mission to care for animals in need</p>
          </div>
          <HelpStreetDogs />
        </div>
      </section>

      {/* Nearby Pet Shops Section */}
      <section className="homepage-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Nearby Pet Shops</h2>
            <p className="section-subtitle">Find trusted pet stores in your area</p>
          </div>
          <NearbyPetShops shops={nearbyPetShopsData} />
        </div>
      </section>

      {/* Pet Adoption Centers Section */}
      <section className="homepage-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Pet Adoption Centers</h2>
            <p className="section-subtitle">Find your next furry family member</p>
          </div>
          <PetAdoptionAgencies agencies={adoptionAgenciesDataList} />
        </div>
      </section>

      {/* Pet Care Blog Section */}
      <BlogPostsGrid 
        blogPosts={blogPostsData}
        title="Latest from Our Blog"
        subtitle="Expert advice and tips for your beloved pets"
        variant="home"
        maxPosts={6}
        showViewAll={true}
        onBlogClick={(blog) => {
          console.log('Navigate to blog:', blog);
          // Add blog navigation logic here
        }}
        onViewAllBlogs={() => {
          console.log('Navigate to all blogs');
          // Add navigate to blog page logic here
        }}
      />

      {/* Pet Taxi Service Section */}
      <section className="homepage-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Pet Taxi Service</h2>
            <p className="section-subtitle">Safe and comfortable transportation for your pets</p>
          </div>
          <PetTaxiService serviceTypes={petTaxiServiceTypes} />
        </div>
      </section>

      {/* Browse by Pet Type Section */}
     

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="scroll-to-top"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default HomePage;