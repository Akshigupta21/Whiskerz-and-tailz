import React, { useState } from "react";
import "./PersonalizedRecommendations.css";

function PersonalizedRecommendations() {
  const [petType, setPetType] = useState("dog");
  const [petAge, setPetAge] = useState("adult");
  const [breed, setBreed] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [concerns, setConcerns] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations("");
    try {
      // Simulate a successful Gemini API response for the example
      const mockRecommendations = [
        "Interactive puzzle toy – Helps stimulate your pet’s mind, especially beneficial for ${petAge} ${petType}s with ${activityLevel} activity levels.",
        "High-protein, grain-free kibble – Suited for ${petType}s needing a balanced diet for ${activityLevel} activity and general health.",
        "Durable chew bone – Supports dental health and provides a safe outlet for chewing instincts.",
        "Comfortable orthopedic bed – Ideal for ${petType}s that need extra support, especially as they age.",
        "Quick-release safety collar – Ensures safety during outdoor adventures and fits all breed sizes."
      ];
      setRecommendations(mockRecommendations.map((line) => line.replace(/\$\{petType\}/g, petType).replace(/\$\{petAge\}/g, petAge).replace(/\$\{activityLevel\}/g, activityLevel)).join("\n"));
    } catch (error) {
      console.error("Error calling API:", error);
      setRecommendations(
        "An error occurred while fetching recommendations. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="recommendations-section">
      <div className="recommendations-card">
        <h2 className="recommendations-heading">
          <span className="emoji" role="img" aria-label="sparkles">
            ✨
          </span>{" "}
          Personalized Product Recommendations
        </h2>
        <p className="recommendations-subtitle">
          Tell us about your pet, and our AI will suggest products tailored just
          for them!
        </p>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="recPetType" className="form-label">
              Pet Type:
            </label>
            <select
              id="recPetType"
              className="form-select"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
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
            <label htmlFor="recPetAge" className="form-label">
              Pet Age:
            </label>
            <select
              id="recPetAge"
              className="form-select"
              value={petAge}
              onChange={(e) => setPetAge(e.target.value)}
            >
              <option value="puppy/kitten">Puppy/Kitten</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="recBreed" className="form-label">
            Breed (Optional):
          </label>
          <input
            type="text"
            id="recBreed"
            className="form-input"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="e.g., Golden Retriever, Siamese"
          />
        </div>

        <div className="form-group">
          <label htmlFor="recActivityLevel" className="form-label">
            Activity Level:
          </label>
          <select
            id="recActivityLevel"
            className="form-select"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="recConcerns" className="form-label">
            Specific Concerns/Preferences (Optional):
          </label>
          <textarea
            id="recConcerns"
            rows="3"
            className="form-textarea"
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            placeholder="e.g., sensitive stomach, loves squeaky toys, needs dental chews"
          />
        </div>

        <button
          onClick={handleGetRecommendations}
          className={`recommendations-button${isLoading ? " loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Getting Recommendations..." : "Get Recommendations ✨"}
        </button>

        {recommendations && (
          <div className="recommendations-result">
            <h3 className="result-heading">Our Recommendations:</h3>
            <ul className="recommendations-list">
              {recommendations.split("\n").map((line, index) => (
                <li key={index} className="recommendations-item">
                  {line.trim().replace(/^-|\*/, "").trim()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export default PersonalizedRecommendations;
