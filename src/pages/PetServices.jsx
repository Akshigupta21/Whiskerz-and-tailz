import React from 'react';
import { getHeroConfig } from '../config/heroConfig';
import HeroSection from '../components/HeroSection';
import PetServiceHeader from '../components/PetServices/PetServiceHeader';
import PetServiceHero from '../components/PetServices/PetServiceHero';
import PricingMenu from '../components/PetServices/PricingMenu';
import TopRatedServices from '../components/PetServices/TopRatedServices';
import Testimonials from '../components/PetServices/Testimonials';
import BrandLogos from '../components/PetServices/BrandLogos';
import Newsletter from '../components/PetServices/Newsletter';
import PhotoGallery from '../components/PetServices/PhotoGallery';
import './PetServices.css';

const PetServices = () => {
  const heroConfig = getHeroConfig('services');

  return (
    <div className="pet-services-page">
     
      
      {/* Use the enhanced hero section with services theme */}
      <HeroSection 
        {...heroConfig}
        onButtonClick={() => console.log('Book Service clicked')}
        onSecondaryButtonClick={() => console.log('View Services clicked')}
        onVideoClick={() => console.log('See Facilities clicked')}
      />
      
      {/* Alternative custom hero section (comment out HeroSection above to use this) */}
      {/* <PetServiceHero /> */}
      
      {/* Pricing Menu Section */}
      <PricingMenu />
      
      {/* Top Rated Services Section */}
      <TopRatedServices />
      
      {/* Services Section with "Explore Our Pet Services" */}
      <section className="explore-services">
        <div className="container">
          <div className="section-header">
            <p className="section-subtitle">SERVING PET NEEDS</p>
            <h2 className="section-title">Explore Our Pet Services</h2>
            <p className="section-description">
              Fringilla lacus nec metus bibendum egestas iaculis massa. Ut hendrerit semper vel class 
              aptent taciti sociosqu ad litora torquent himenaeos orci varius natoque.
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Brand Logos Section */}
      <BrandLogos />
      
      {/* Newsletter Section */}
      <Newsletter />
      
      {/* Photo Gallery Section */}
      <PhotoGallery />
      
      
    </div>
  );
};

export default PetServices;
