import React, { useState } from "react";
import "./AutoDelivery.css";

const AutoDelivery = () => {
  const [deliveryFrequency, setDeliveryFrequency] = useState("every2weeks");

  return (
    <section className="auto-delivery-section">
      <h2 className="auto-delivery-heading">
        Never Run Out with Auto-Delivery
      </h2>
      <div className="auto-delivery-content">
        <div className="auto-delivery-offers">
          <h3 className="auto-delivery-subheading">Subscribe & Save</h3>
          <p className="auto-delivery-description">
            Set up regular deliveries of your pet's favorite food and never worry
            about running out. Plus, enjoy exclusive savings on every order!
          </p>
          <ul className="auto-delivery-list">
            <li className="auto-delivery-list-item">
              <span className="auto-delivery-icon">✓</span>
              Save 10% on every auto-delivery order
            </li>
            <li className="auto-delivery-list-item">
              <span className="auto-delivery-icon">✓</span>
              Free shipping on orders over $49
            </li>
            <li className="auto-delivery-list-item">
              <span className="auto-delivery-icon">✓</span>
              Easily change or cancel anytime
            </li>
            <li className="auto-delivery-list-item">
              <span className="auto-delivery-icon">✓</span>
              Adjust delivery frequency to suit your needs
            </li>
          </ul>
          <button className="auto-delivery-button">Start Subscription</button>
        </div>
        <div className="auto-delivery-frequency">
          <h3 className="auto-delivery-subheading">Delivery Frequency</h3>
          <div className="auto-delivery-options">
            <label className="auto-delivery-option">
              <input
                type="radio"
                name="delivery"
                value="every2weeks"
                checked={deliveryFrequency === "every2weeks"}
                onChange={(e) => setDeliveryFrequency(e.target.value)}
              />
              <span className="auto-delivery-option-label">Every 2 weeks</span>
            </label>
            <label className="auto-delivery-option">
              <input
                type="radio"
                name="delivery"
                value="everymonth"
                checked={deliveryFrequency === "everymonth"}
                onChange={(e) => setDeliveryFrequency(e.target.value)}
              />
              <span className="auto-delivery-option-label">Every month</span>
            </label>
            <label className="auto-delivery-option">
              <input
                type="radio"
                name="delivery"
                value="every2months"
                checked={deliveryFrequency === "every2months"}
                onChange={(e) => setDeliveryFrequency(e.target.value)}
              />
              <span className="auto-delivery-option-label">Every 2 months</span>
            </label>
            <label className="auto-delivery-option">
              <input
                type="radio"
                name="delivery"
                value="custom"
                checked={deliveryFrequency === "custom"}
                onChange={(e) => setDeliveryFrequency(e.target.value)}
              />
              <span className="auto-delivery-option-label">Custom schedule</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoDelivery;
