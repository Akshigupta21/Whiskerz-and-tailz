import React from "react";
import "./CallToAction.css";

function CallToAction() {
  return (
    <section className="cta-section">
      <h2 className="cta-heading">Ready to Upgrade Your Pet's Nutrition?</h2>
      <p className="cta-subtitle">
        Browse our premium selection of pet foods and supplements, or schedule a consultation with our nutrition experts to create a personalized feeding plan.
      </p>
      <div className="cta-buttons">
        <button className="cta-button-white">Shop Now</button>
        <button className="cta-button-outline">Book Nutrition Consultation</button>
      </div>
    </section>
  );
}

export default CallToAction;
