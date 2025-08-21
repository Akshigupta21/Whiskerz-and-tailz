import { useState } from "react";
import "./PersonalizedNutrition.css";

// Define any missing global variables to prevent ESLint errors
/* eslint-disable no-undef */
const __app_id = process.env.REACT_APP_ID || 'default-app-id';
const __firebase_config = process.env.REACT_APP_FIREBASE_CONFIG || {};
const __initial_auth_token = process.env.REACT_APP_AUTH_TOKEN || '';
/* eslint-enable no-undef */

function PersonalizedNutrition() {
  // State for recipe generation
  const [petType, setPetType] = useState("dog");
  const [dietaryNeeds, setDietaryNeeds] = useState("");
  const [generatedRecipe, setGeneratedRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State for modals
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // State for consultation form
  const [consultationPetType, setConsultationPetType] = useState("Dog");
  const [petBreed, setPetBreed] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [petName, setPetName] = useState("");
  const [consultationDate, setConsultationDate] = useState("");
  const [consultationTime, setConsultationTime] = useState("");
  const [consultationPreferences, setConsultationPreferences] = useState("");

  // State for form validation
  const [errors, setErrors] = useState({});
  const [submissionMessage, setSubmissionMessage] = useState("");

  async function handleGenerateRecipe() {
    setIsLoading(true);
    setGeneratedRecipe("");
    try {
      // Simulate API call for demo
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            candidates: [
              {
                content: {
                  parts: [
                    { text: "**Healthy Homemade Dog Food**\n\n**Ingredients**\n- 1 lb ground turkey\n- 1 cup cooked brown rice\n- 1 cup chopped carrots\n- 1/2 cup peas\n- 2 tbsp olive oil\n\n**Instructions**\n1. Brown turkey in a pan.\n2. Add carrots and cook until soft.\n3. Mix in rice and peas.\n4. Drizzle with olive oil. Serve cool." },
                  ],
                },
              },
            ],
          });
        }, 1000)
      );
      if (response.candidates?.[0]?.content?.parts?.[0]?.text) {
        setGeneratedRecipe(response.candidates[0].content.parts[0].text);
        setShowRecipeModal(true);
      } else {
        setGeneratedRecipe("Could not generate a recipe. Please try again.");
        setShowRecipeModal(true);
      }
    } catch (error) {
      console.error(error);
      setGeneratedRecipe("Error generating recipe. Please try again later.");
      setShowRecipeModal(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleBookAppointment(e) {
    e.preventDefault();
    const newErrors = {};
    if (!ownerName.trim()) newErrors.ownerName = "Owner name is required.";
    if (!mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email address is invalid.";
    if (!petName.trim()) newErrors.petName = "Pet name is required.";
    if (!petBreed.trim()) newErrors.petBreed = "Breed is required.";
    if (!consultationDate.trim()) newErrors.consultationDate = "Date is required.";
    if (!consultationTime.trim()) newErrors.consultationTime = "Time is required.";
    if (!consultationPreferences.trim()) newErrors.consultationPreferences = "Preferences are required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSubmissionMessage("Appointment booked successfully!");
      setShowConsultationModal(false);
      setShowSubmissionModal(true);
      // Reset form
      setOwnerName("");
      setMobileNumber("");
      setEmail("");
      setAddress("");
      setPetName("");
      setPetBreed("");
      setConsultationDate("");
      setConsultationTime("");
      setConsultationPreferences("");
      setConsultationPetType("Dog");
    } else {
      setSubmissionMessage("Please fill in all required fields correctly.");
      setShowSubmissionModal(true);
    }
  }

  return (
    <section className="nutrition-section">
      <div className="nutrition-layout">
        <div className="nutrition-content">
          <h2 className="nutrition-heading">Personalized Nutrition Consultation</h2>
          <p className="nutrition-description">
            Not sure which food is right for your pet? Our certified pet nutritionists
            can help create a customized feeding plan based on your pet's age,
            breed, health conditions, and lifestyle.
          </p>
          <ul className="nutrition-benefits">
            <li className="nutrition-benefit-item">
              <span className="icon">✓</span> Personalized diet recommendations
            </li>
            <li className="nutrition-benefit-item">
              <span className="icon">✓</span> Solutions for food sensitivities
            </li>
            <li className="nutrition-benefit-item">
              <span className="icon">✓</span> Weight management strategies
            </li>
            <li className="nutrition-benefit-item">
              <span className="icon">✓</span> Support for medical conditions
            </li>
          </ul>

          <div className="consultation-options">
            <h3 className="subsection-title">Consultation Options:</h3>
            <div className="consultation-option-list">
              <div className="consultation-option">
                <p className="consultation-option-name">Basic</p>
                <p className="consultation-option-price">$45</p>
                <p className="consultation-option-detail">30 minute session</p>
              </div>
              <div className="consultation-option">
                <p className="consultation-option-name">Comprehensive</p>
                <p className="consultation-option-price">$75</p>
                <p className="consultation-option-detail">60 minute session with follow up</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowConsultationModal(true)}
            className="consultation-button"
          >
            Book Consultation
          </button>

          {/* Recipe Generator Card */}
          <div className="recipe-generator-card">
            <h3 className="recipe-card-title">Generate a Custom Recipe Idea</h3>
            <p className="recipe-card-description">
              Let our AI create a unique recipe tailored to your pet's needs!
            </p>
            <div className="form-group">
              <label htmlFor="petType">Pet Type:</label>
              <select
                id="petType"
                value={petType}
                onChange={(e) => setPetType(e.target.value)}
                className="form-select"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="fish">Fish</option>
                <option value="reptile">Reptile</option>
                <option value="small pet">Small Pet</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="dietaryNeeds">
                Dietary Needs (e.g., grain-free, hypoallergenic, senior):
              </label>
              <input
                type="text"
                id="dietaryNeeds"
                value={dietaryNeeds}
                onChange={(e) => setDietaryNeeds(e.target.value)}
                placeholder="e.g., grain-free, sensitive stomach"
                className="form-input"
              />
            </div>
            <button
              onClick={handleGenerateRecipe}
              className={`recipe-button${isLoading ? ' loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Recipe Idea"}
            </button>
          </div>
        </div>
        <div className="nutrition-image-container">
          <img
            src="https://placehold.co/600x400/DDC1FF/8C00FF?text=Veterinarian+Consulting+Pet+Owner"
            alt="Nutrition Consultation"
            className="nutrition-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x400/CCCCCC/333333?text=Image+Not+Found";
            }}
          />
        </div>
      </div>

      {/* Recipe Modal */}
      {showRecipeModal && (
        <div className="modal-overlay">
          <div className="recipe-modal">
            <div className="modal-header">
              <h3 className="modal-title">Your Custom Recipe Idea</h3>
              <button
                onClick={() => setShowRecipeModal(false)}
                className="modal-close"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              {generatedRecipe.split("\n").map((line, index) => (
                <p key={index} className="recipe-line">
                  {line}
                </p>
              ))}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowRecipeModal(false)}
                className="modal-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      {showConsultationModal && (
        <div className="modal-overlay">
          <div className="consultation-modal">
            {/* Modal Header */}
            <div className="modal-header">
              <h3 className="modal-title">Schedule Your Appointment</h3>
              <button
                onClick={() => setShowConsultationModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            {/* Left Section - General Information */}
            <div className="modal-section-left">
              <h3>General Information</h3>
              <form onSubmit={handleBookAppointment}>
                <div className="form-group">
                  <label htmlFor="ownerName">Owner Name*</label>
                  <input
                    type="text"
                    id="ownerName"
                    value={ownerName}
                    onChange={(e) => {
                      setOwnerName(e.target.value);
                      setErrors((prev) => ({ ...prev, ownerName: "" }));
                    }}
                    className={`form-input${errors.ownerName ? ' error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.ownerName && (
                    <div className="form-error-message">{errors.ownerName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="petName">Pet Name*</label>
                  <input
                    type="text"
                    id="petName"
                    value={petName}
                    onChange={(e) => {
                      setPetName(e.target.value);
                      setErrors((prev) => ({ ...prev, petName: "" }));
                    }}
                    className={`form-input${errors.petName ? ' error' : ''}`}
                    placeholder="Enter your pet's name"
                  />
                  {errors.petName && (
                    <div className="form-error-message">{errors.petName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Pet Type</label>
                  <div className="pet-type-options">
                    {["Dog", "Cat", "Birds", "Fish", "Reptile", "Small animals", "Others"].map(
                      (type) => (
                        <label key={type} className={`pet-type-option ${consultationPetType === type ? 'selected' : ''}`}>
                          <input
                            type="radio"
                            name="consultationPetType"
                            value={type}
                            checked={consultationPetType === type}
                            onChange={(e) => {
                              setConsultationPetType(e.target.value);
                              setPetBreed("");
                            }}
                            className="radio-input"
                          />
                          <span>{type}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="petBreed">
                    {consultationPetType === "Others" ? "Type/Breed*" : "Breed Name*"}
                  </label>
                  <input
                    type="text"
                    id="petBreed"
                    value={petBreed}
                    onChange={(e) => {
                      setPetBreed(e.target.value);
                      setErrors((prev) => ({ ...prev, petBreed: "" }));
                    }}
                    className={`form-input${errors.petBreed ? ' error' : ''}`}
                    placeholder={
                      consultationPetType === "Others"
                        ? "e.g., Golden Retriever, Siamese"
                        : "e.g., Golden Retriever, Siamese"
                    }
                  />
                  {errors.petBreed && (
                    <div className="form-error-message">{errors.petBreed}</div>
                  )}
                </div>
              </form>
            </div>

            {/* Right Section - Contact Details */}
            <div className="modal-section-right">
              <h3>Contact Details</h3>
              
                <div className="form-group">
                  <label htmlFor="mobileNumber">Mobile Number*</label>
                  <input
                    type="tel"
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
                    }}
                    className={`form-input${errors.mobileNumber ? ' error' : ''}`}
                    placeholder="e.g., +91 9876543210"
                  />
                  {errors.mobileNumber && (
                    <div className="form-error-message">{errors.mobileNumber}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email*</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={`form-input${errors.email ? ' error' : ''}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <div className="form-error-message">{errors.email}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-textarea"
                    placeholder="Enter your full address"
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label htmlFor="consultationDate">Date*</label>
                  <input
                    type="date"
                    id="consultationDate"
                    value={consultationDate}
                    onChange={(e) => {
                      setConsultationDate(e.target.value);
                      setErrors((prev) => ({ ...prev, consultationDate: "" }));
                    }}
                    className={`form-input${errors.consultationDate ? ' error' : ''}`}
                    placeholder="dd-mm-yyyy"
                  />
                  {errors.consultationDate && (
                    <div className="form-error-message">{errors.consultationDate}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="consultationTime">Time*</label>
                  <input
                    type="time"
                    id="consultationTime"
                    value={consultationTime}
                    onChange={(e) => {
                      setConsultationTime(e.target.value);
                      setErrors((prev) => ({ ...prev, consultationTime: "" }));
                    }}
                    className={`form-input${errors.consultationTime ? ' error' : ''}`}
                    placeholder="--:--"
                  />
                  {errors.consultationTime && (
                    <div className="form-error-message">{errors.consultationTime}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="consultationPreferences">Special Preferences/Notes</label>
                  <textarea
                    id="consultationPreferences"
                    value={consultationPreferences}
                    onChange={(e) => {
                      setConsultationPreferences(e.target.value);
                      setErrors((prev) => ({ ...prev, consultationPreferences: "" }));
                    }}
                    className={`form-textarea${errors.consultationPreferences ? ' error' : ''}`}
                    placeholder="Any specific concerns, dietary restrictions, or questions..."
                    rows="4"
                  ></textarea>
                  {errors.consultationPreferences && (
                    <div className="form-error-message">{errors.consultationPreferences}</div>
                  )}
                </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                onClick={() => setShowConsultationModal(false)}
                type="button"
                className="modal-button"
                style={{ background: '#64748b' }}
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                type="button"
                className="modal-button"
              >
                Schedule Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {showSubmissionModal && (
        <div className="modal-overlay">
          <div className="submission-modal">
            <h3 className="modal-title">
              {submissionMessage.includes("successfully") ? "Success!" : "Error!"}
            </h3>
            <div className="modal-body">
              <p>{submissionMessage}</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="modal-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PersonalizedNutrition;
