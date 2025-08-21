import React from "react";
import "./DealOfTheDayBanner.css";

function DealOfTheDayBanner() {
  return (
    <section className="deal-banner">
      <div className="deal-banner-content">
        <div className="deal-banner-info">
          <h2 className="deal-banner-title">🐾 Deal of the Day! 🐾</h2>
          <p className="deal-banner-description">
            Get 25% off all premium dry dog food today!
          </p>
        </div>
        <button className="deal-banner-button">
          Shop Now
        </button>
      </div>
    </section>
  );
}

export default DealOfTheDayBanner;
