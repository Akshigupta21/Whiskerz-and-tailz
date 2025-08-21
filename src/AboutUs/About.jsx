import React, { useState, useEffect } from 'react';
import { Heart, Star, Shield, Clock, Users, MapPin, Phone, Mail, PawPrint, Stethoscope, Home, Scissors, Camera, Award, CheckCircle, Play, ArrowRight, Quote, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import { getHeroConfig } from '../config/heroConfig';
import './About.css';

const About = () => {
  const [activeService, setActiveService] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const services = [
    {
      id: 0,
      icon: <Stethoscope className="icon" />,
      title: "Veterinary Care",
      description: "Complete medical care for your pets",
      image: "https://images.pexels.com/photos/6235663/pexels-photo-6235663.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      details: "Our certified veterinarians provide comprehensive health checkups, vaccinations, and emergency care. We use state-of-the-art equipment to ensure your pet receives the best medical attention.",
      features: ["24/7 Emergency Care", "Preventive Medicine", "Surgery Services", "Dental Care"]
    },
    {
      id: 1,
      icon: <Scissors className="icon" />,
      title: "Pet Grooming",
      description: "Professional grooming services",
      image: "https://images.pexels.com/photos/6568968/pexels-photo-6568968.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      details: "Transform your pet's appearance with our professional grooming services. From basic baths to full styling, we make your pets look and feel their best.",
      features: ["Full Service Grooming", "Nail Trimming", "Ear Cleaning", "De-shedding Treatment"]
    },
    {
      id: 2,
      icon: <Home className="icon" />,
      title: "Pet Boarding",
      description: "Safe and comfortable boarding",
      image: "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      details: "When you're away, we provide a home away from home. Our boarding facilities are clean, safe, and staffed with caring professionals who treat your pet like family.",
      features: ["24/7 Supervision", "Spacious Accommodations", "Play Time", "Medication Administration"]
    },
    {
      id: 3,
      icon: <Heart className="icon" />,
      title: "Pet Training",
      description: "Behavioral training and obedience",
      image: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      details: "Our experienced trainers help your pet develop good behavior and social skills. We use positive reinforcement techniques to ensure effective and stress-free learning.",
      features: ["Puppy Training", "Obedience Classes", "Behavioral Correction", "Socialization"]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Dog Owner",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      text: "Pettie has been amazing with my Golden Retriever. The staff is so caring and professional. I wouldn't trust anyone else with my furry family member!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Cat Owner",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      text: "The grooming service is exceptional. My cat looks and feels amazing after every visit. The team really knows how to handle pets with care.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Pet Parent",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      text: "I've been bringing both my dog and cat here for years. The veterinary care is top-notch and the boarding facility gives me peace of mind when traveling.",
      rating: 5
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Amanda Wilson",
      role: "Chief Veterinarian",
      image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
      experience: "15+ years",
      specialty: "Emergency Care & Surgery"
    },
    {
      name: "Jake Thompson",
      role: "Senior Groomer",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
      experience: "8+ years",
      specialty: "Show Dog Grooming"
    },
    {
      name: "Lisa Martinez",
      role: "Pet Trainer",
      image: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
      experience: "10+ years",
      specialty: "Behavioral Training"
    }
  ];

  const partners = [
    "https://images.pexels.com/photos/7210754/pexels-photo-7210754.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
    "https://images.pexels.com/photos/6568956/pexels-photo-6568956.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
    "https://images.pexels.com/photos/4498185/pexels-photo-4498185.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
    "https://images.pexels.com/photos/6235663/pexels-photo-6235663.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
    "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop",
    "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=200&h=100&fit=crop"
  ];

  const petGallery = [
    "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to handle smooth scrolling
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false); // Close mobile menu after clicking a link
    }
  };

  // Get hero configuration for About page
  const heroConfig = getHeroConfig('about');

  const handlePrimaryAction = () => {
    // Scroll to about section
    scrollToSection('about');
  };

  const handleSecondaryAction = () => {
    // Scroll to team section
    const teamSection = document.querySelector('.team-section');
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVideoClick = () => {
    // Open video modal or navigate to video
    console.log('Play about video');
  };

  return (
    <>
      <div className="app-background">
        {/* Dynamic Hero Section */}
        <HeroSection 
          {...heroConfig}
          onButtonClick={handlePrimaryAction}
          onSecondaryButtonClick={handleSecondaryAction}
          onVideoClick={handleVideoClick}
        />

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="container">
            <div className="about-content">
              <div className="about-text-content">
                <div>
                  <h2 className="about-title">
                    About Pettie
                  </h2>
                  <p className="about-description">
                    Founded in 2024, Wisker & Tails has been dedicated to providing exceptional pet care services
                    to families across the community. Our mission is simple: to treat every pet as if
                    they were our own.
                  </p>
                  <p className="about-description">
                    With a team of certified veterinarians, experienced groomers, and passionate pet lovers,
                    we offer comprehensive care that goes beyond just medical treatment. We believe in
                    building lasting relationships with both pets and their families.
                  </p>
                </div>
                <div className="about-stats">
                  <div className="about-stat-card">
                    <div className="about-stat-number">1.5K+</div>
                    <div className="about-stat-label">Happy Pets</div>
                  </div>
                  <div className="about-stat-card blue">
                    <div className="about-stat-number">5+</div>
                    <div className="about-stat-label"> Years Experienced Staff</div>
                  </div>
                </div>
              </div>
              <div className="about-image-container">
                <img
                  src="https://images.pexels.com/photos/6568956/pexels-photo-6568956.jpeg?auto=compress&cs=tinysrgb&w=600&h=500&fit=crop"
                  alt="Pet care facility"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x500/E0E0E0/333333?text=Image+Not+Found"; }}
                />
                <div className="about-floating-card">
                  <div className="about-floating-card-content">
                    <div className="about-floating-card-icon-wrapper">
                      <Award className="about-floating-card-icon" />
                    </div>
                    <div>
                      <div className="about-floating-card-title">Heart Winning</div>
                      <div className="about-floating-card-subtitle">Pet Care Excellence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Partners */}
        <section className="partners-section">
          <div className="container">
            <h2 className="partners-title">
              Pet Gallery
            </h2>
            <div className="partners-carousel">
              <div className="animate-scroll-right-to-left">
                {[...partners, ...partners].map((partner, index) => (
                  <div key={index} className="partner-item">
                    <div className="partner-card">
                      <img
                        src={partner}
                        alt={`Partner ${index + 1}`}
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x100/E0E0E0/333333?text=Partner"; }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services-section">
          <div className="container">
            <div className="services-header">
              <h2 className="services-title">
                Complete Pet Care Solutions
              </h2>
              <p className="services-description">
                From routine checkups to emergency care, we provide comprehensive services
                to keep your pets healthy and happy.
              </p>
            </div>

            <div className="services-grid">
              <div className="service-list">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className={`service-item ${activeService === index ? 'active' : ''}`}
                    onMouseEnter={() => setActiveService(index)}
                  >
                    <div className="service-item-content">
                      <div className="service-icon-wrapper">
                        {service.icon}
                      </div>
                      <div className="service-text-area">
                        <h3 className="service-heading">
                          {service.title}
                        </h3>
                        <p className="service-sub-description">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="service-details-card">
                <div className="service-details-image-wrapper">
                  <img
                    src={services[activeService].image}
                    alt={services[activeService].title}
                    className="service-details-image"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E0E0/333333?text=Service+Image"; }}
                  />
                </div>
                <h3 className="service-details-title">
                  {services[activeService].title}
                </h3>
                <p className="service-details-description">
                  {services[activeService].details}
                </p>
                <div className="service-features-list">
                  {services[activeService].features.map((feature, index) => (
                    <div key={index} className="service-feature-item">
                      <CheckCircle className="icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="team-header">
              <h2 className="team-title">
                Meet Our Expert Team
              </h2>
              <p className="team-description">
                Our passionate team of professionals is dedicated to providing the best care
                for your beloved pets.
              </p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div key={index} className="team-member-card">
                  <div className="team-member-card-content">
                    <div className="team-member-image-wrapper">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="team-member-image"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x400/E0E0E0/333333?text=Team+Member"; }}
                      />
                      <div className="team-member-badge">
                        <CheckCircle className="icon" />
                      </div>
                    </div>
                    <h3 className="team-member-name">{member.name}</h3>
                    <p className="team-member-role">{member.role}</p>
                    <p className="team-member-experience">{member.experience}</p>
                    <p className="team-member-specialty">{member.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pet Gallery */}
        <section id="gallery" className="gallery-section">
          <div className="container">
            <div className="gallery-header">
              <h2 className="gallery-title">
                Our Happy Pet Family
              </h2>
              <p className="gallery-description">
                Meet some of our adorable clients who trust us with their care.
                Every pet has a unique story and we're honored to be part of their journey.
              </p>
            </div>

            <div className="gallery-grid">
              {petGallery.map((pet, index) => (
                <div key={index} className="gallery-item">
                  <img
                    src={pet}
                    alt={`Pet ${index + 1}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/E0E0E0/333333?text=Pet+Image"; }}
                  />
                  <div className="gallery-overlay">
                    <Camera className="icon" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="testimonials-section">
          <div className="container" style={{ maxWidth: '64rem' }}> {/* max-w-4xl */}
            <div className="testimonials-header">
              <h2 className="testimonials-title">
                What Pet Parents Say
              </h2>
              <p className="testimonials-description">
                Don't just take our word for it - hear from our happy customers
              </p>
            </div>

            <div className="testimonial-card-wrapper">
              <div className="testimonial-card">
                <div className="testimonial-card-content">
                  <Quote className="testimonial-quote-icon" />
                  <p className="testimonial-text">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="testimonial-author">
                    <img
                      src={testimonials[currentTestimonial].image}
                      alt={testimonials[currentTestimonial].name}
                      className="testimonial-author-image"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/E0E0E0/333333?text=User"; }}
                    />
                    <div className="testimonial-author-details">
                      <div className="testimonial-author-name">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="testimonial-author-role">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-rating">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="icon" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="testimonial-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`testimonial-dot ${
                      index === currentTestimonial ? 'active' : ''
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Contact Section */}
        <section id="contact" className="contact-section">
          <div className="container">
            <div className="contact-header">
              <h2 className="contact-title">
                Get in Touch
              </h2>
              <p className="contact-description">
                We'd love to hear from you! Reach out to us for any inquiries or to schedule a service.
              </p>
            </div>

            <div className="contact-info-grid">
              {/* Address */}
              <div className="contact-info-card location">
                <MapPin className="icon" />
                <h3 className="contact-info-heading">Our Location</h3>
                <p className="contact-info-text">123 Pet Care Lane, Animal City, PC 12345</p>
              </div>
              {/* Phone */}
              <div className="contact-info-card phone">
                <Phone className="icon" />
                <h3 className="contact-info-heading">Call Us</h3>
                <p className="contact-info-text">+1 (555) 123-4567</p>
              </div>
              {/* Email */}
              <div className="contact-info-card email">
                <Mail className="icon" />
                <h3 className="contact-info-heading">Email Us</h3>
                <p className="contact-info-text">info@pettiecare.com</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h3 className="contact-form-title">Send Us a Message</h3>
              <form className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@example.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Your message..."
                  ></textarea>
                </div>
                <button type="submit" className="contact-submit-button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

      </div>
    </>
  );
  
};

export default About;
