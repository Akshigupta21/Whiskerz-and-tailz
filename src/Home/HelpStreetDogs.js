import React, { useState } from 'react';
import DonationPayment from '../components/DonationPayment';
import './HelpStreetDogs.css';
import street_dog from '../images/street_dog.jpg'; // Corrected import statement

function HelpStreetDogs() {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const currentRaised = 50000;
  const target = 100000;
  const progress = (currentRaised / target) * 100;

  // Mock campaign data for the donation component
  const campaignData = {
    _id: 'street-dogs-delhi-campaign',
    campaignName: 'Help Street Dogs in Delhi',
    description: 'Your donation can make a difference in the lives of street dogs. We provide food, shelter, medical care, and love to abandoned pets.',
    currentAmount: currentRaised,
    goalAmount: target,
    status: 'Active'
  };

  const handleDonateClick = () => {
    setShowDonationForm(true);
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Donation successful:', paymentData);
    // You can update the UI here, show success message, etc.
    alert(`Thank you for your donation of ₹${paymentData.donation.amount}!`);
    setShowDonationForm(false);
  };

  const handlePaymentError = (error) => {
    console.error('Donation failed:', error);
    alert(`Donation failed: ${error}`);
  };

  const handleCloseDonation = () => {
    setShowDonationForm(false);
  };

  if (showDonationForm) {
    return (
      <section className="help-street-dogs-section">
        <div className="container">
          <div className="donation-form-container">
            <div className="close-button-container">
              <button 
                className="close-button" 
                onClick={handleCloseDonation}
                aria-label="Close donation form"
              >
                ✕
              </button>
            </div>
            <DonationPayment 
              campaign={campaignData}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="help-street-dogs-section">
      <div className="container">
        <div className="donation-content">
          <h2>Help Street Dogs in Delhi</h2>
          <p>
            Your donation can make a difference in the lives of street dogs. We provide food, shelter,
            medical care, and love to abandoned pets.
          </p>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">₹{currentRaised.toLocaleString()} / ₹{target.toLocaleString()}</p>
          <button className="btn-primary" onClick={handleDonateClick}>
            Donate Now
          </button>
        </div>
        <div className="donation-image">
          <img 
            src={street_dog} 
            alt="Street dogs in need of help"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

export default HelpStreetDogs;