import React, { useState } from 'react';
import './PetTaxiService.css';

function PetTaxiService({ serviceTypes }) {
  const [bookingForm, setBookingForm] = useState({
    pickupLocation: '',
    dropLocation: '',
    date: '',
    time: '',
    petType: '',
    petName: '',
    serviceType: 'Vet Visits',
    specialInstructions: '',
    contactNumber: '',
    emergencyContact: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking form submitted:', bookingForm);
    // Here you would typically send the data to your backend
    alert('Booking request submitted! We will contact you shortly.');
  };

  const serviceOptions = [
    { value: 'Vet Visits', label: '🏥 Vet Visits', price: '₹300' },
    { value: 'Airport Transfers', label: '✈️ Airport Transfers', price: '₹800' },
    { value: 'Grooming Salon Trips', label: '✂️ Grooming Trips', price: '₹250' },
    { value: 'Emergency Transport', label: '🚨 Emergency Transport', price: '₹500' }
  ];

  const petTypeOptions = [
    'Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Other'
  ];

  return (
    <section className="pet-taxi-service-section">
      <div className="container">
        <div className="taxi-header">
          <div className="badge-container">
            <span className="new-service-badge">NEW SERVICE</span>
          </div>
          <h2 className="section-title">
            Pet Taxi Service
            <span className="title-accent">🚗</span>
          </h2>
          <p className="section-subtitle">
            Safe and comfortable transportation for your pets
          </p>
        </div>

        <div className="booking-container">
          <div className="service-info">
            <h3>Our Services</h3>
            <div className="service-list">
              {serviceOptions.map((service, index) => (
                <div key={index} className="service-item">
                  <span className="service-label">{service.label}</span>
                  <span className="service-price">Starting {service.price}</span>
                </div>
              ))}
            </div>
            <div className="features-list">
              <h4>Why Choose Our Pet Taxi?</h4>
              <ul>
                <li>✓ Professional pet handlers</li>
                <li>✓ Climate-controlled vehicles</li>
                <li>✓ GPS tracking for safety</li>
                <li>✓ 24/7 emergency service</li>
                <li>✓ Insurance covered</li>
                <li>✓ Real-time updates</li>
              </ul>
            </div>
          </div>

          <div className="booking-form-container">
            <form className="booking-form" onSubmit={handleSubmit}>
              <h3>Book Your Pet Taxi</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pickupLocation">Pickup Location *</label>
                  <input
                    type="text"
                    id="pickupLocation"
                    name="pickupLocation"
                    value={bookingForm.pickupLocation}
                    onChange={handleInputChange}
                    placeholder="Enter pickup address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dropLocation">Drop Location *</label>
                  <input
                    type="text"
                    id="dropLocation"
                    name="dropLocation"
                    value={bookingForm.dropLocation}
                    onChange={handleInputChange}
                    placeholder="Enter destination address"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={bookingForm.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Time *</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={bookingForm.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="petName">Pet Name *</label>
                  <input
                    type="text"
                    id="petName"
                    name="petName"
                    value={bookingForm.petName}
                    onChange={handleInputChange}
                    placeholder="Your pet's name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="petType">Pet Type *</label>
                  <select
                    id="petType"
                    name="petType"
                    value={bookingForm.petType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select pet type</option>
                    {petTypeOptions.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="serviceType">Service Type *</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={bookingForm.serviceType}
                    onChange={handleInputChange}
                    required
                  >
                    {serviceOptions.map((service, index) => (
                      <option key={index} value={service.value}>
                        {service.label} - {service.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="contactNumber">Contact Number *</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    value={bookingForm.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+91 9999999999"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="emergencyContact">Emergency Contact</label>
                <input
                  type="tel"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={bookingForm.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Emergency contact number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="specialInstructions">Special Instructions</label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={bookingForm.specialInstructions}
                  onChange={handleInputChange}
                  placeholder="Any special care instructions for your pet (e.g., anxiety, medication, etc.)"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  <span> 🚕 Book Pet Taxi 🚕 </span>
                </button>
                
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PetTaxiService;