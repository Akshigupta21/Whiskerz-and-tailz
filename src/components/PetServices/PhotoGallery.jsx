import React, { useState } from 'react';
import './PhotoGallery.css';

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState({});

  const galleryImages = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop&crop=center",
      alt: "Pet grooming service",
      title: "Professional Grooming",
      category: "Grooming",
      description: "Complete grooming services for all breeds"
    },
    {
      id: 2, 
      src: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&h=400&fit=crop&crop=center",
      alt: "Veterinary checkup",
      title: "Health Checkups",
      category: "Medical",
      description: "Regular health examinations and consultations"
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=400&fit=crop&crop=center", 
      alt: "Dog training session",
      title: "Training Programs",
      category: "Training",
      description: "Behavioral training and obedience classes"
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop&crop=center",
      alt: "Pet daycare",
      title: "Daycare Services",
      category: "Care",
      description: "Safe and fun daycare for your pets"
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=400&fit=crop&crop=center",
      alt: "Cat care service",
      title: "Feline Specialists",
      category: "Specialized",
      description: "Expert care tailored for cats"
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&crop=center",
      alt: "Pet boarding facility",
      title: "Boarding Facility",
      category: "Boarding",
      description: "Comfortable overnight stays for pets"
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&h=400&fit=crop&crop=center",
      alt: "Happy pet family",
      title: "Family Care",
      category: "Care",
      description: "Comprehensive care for pet families"
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1544525977-0b62f514c4e9?w=600&h=400&fit=crop&crop=center",
      alt: "Professional pet care",
      title: "Professional Care",
      category: "Professional",
      description: "Expert veterinary and care services"
    }
  ];

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleImageLoad = (imageId) => {
    setImageLoading(prev => ({ ...prev, [imageId]: false }));
  };

  const handleImageLoadStart = (imageId) => {
    setImageLoading(prev => ({ ...prev, [imageId]: true }));
  };

  return (
    <section className="photo-gallery">
      <div className="gallery-container">
        {/* Enhanced Header Section */}
        <div className="gallery-header">
          <div className="header-content">
            <span className="gallery-badge">📸 GALLERY</span>
            <h2 className="gallery-title">Our Pet Care in Action</h2>
            <p className="gallery-description">
              Discover the loving care and professional services we provide to keep your pets happy, healthy, and safe. 
              Every moment captured tells a story of trust, care, and the special bond between pets and their caregivers.
            </p>
          </div>
        </div>

        {/* Enhanced Gallery Grid */}
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div 
              key={image.id} 
              className={`gallery-item gallery-item-${index + 1}`}
              onClick={() => handleImageClick(image)}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              {/* Loading Placeholder */}
              {imageLoading[image.id] && (
                <div className="image-loader">
                  <div className="loader-spinner"></div>
                </div>
              )}
              
              <img 
                src={image.src} 
                alt={image.alt}
                className="gallery-image"
                onLoadStart={() => handleImageLoadStart(image.id)}
                onLoad={() => handleImageLoad(image.id)}
                onError={(e) => {
                  e.target.src = `https://placehold.co/600x400/e1f5fe/01579b?text=${encodeURIComponent(image.title)}`;
                  handleImageLoad(image.id);
                }}
              />
              
              {/* Enhanced Overlay */}
              <div className="gallery-overlay">
                <div className="overlay-content">
                  <div className="overlay-icons">
                    <span className="zoom-icon">🔍</span>
                    <span className="heart-icon">❤️</span>
                  </div>
                  <div className="overlay-info">
                    <span className="image-category">{image.category}</span>
                    <h3 className="image-title">{image.title}</h3>
                    <p className="image-description">{image.description}</p>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="category-badge">
                {image.category}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="gallery-footer">
          <button className="view-all-btn">
            <span className="btn-icon">📷</span>
            View All Photos
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>

      {/* Enhanced Modal for Full Size Image */}
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <div className="modal-image-container">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.alt}
                className="modal-image"
              />
            </div>
            <div className="modal-info">
              <span className="modal-category">{selectedImage.category}</span>
              <h3 className="modal-title">{selectedImage.title}</h3>
              <p className="modal-description">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotoGallery;
