import React, { useState } from "react";
import "./PetCareAssistant.css";

function PetCareAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async () => {
    setIsLoading(true);
    setAnswer(""); // Clear previous answer
    try {
      // Simulate API response for the example
      setAnswer(
        "For most dogs, bathing every 2-4 weeks is sufficient, but this can vary by breed and lifestyle. " +
        "Cats generally do not need baths unless they get very dirty or have a specific skin condition. " +
        "If you notice signs of illness (e.g., coughing, sneezing, lethargy), contact your veterinarian. " +
        "This is for informational purposes only and not a substitute for professional veterinary care."
      );
    } catch (error) {
      console.error("Error calling API:", error);
      setAnswer("An error occurred while fetching the answer. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="petcare-assistant">
      <div className="petcare-card">
        <h2 className="petcare-heading">
          <span className="emoji" role="img" aria-label="sparkles">
            ✨
          </span>{" "}
          Pet Care Assistant
        </h2>
        <p className="petcare-subtitle">
          Have a question about your pet's health, behavior, or general care?
          Ask our AI assistant!
        </p>
        <div className="petcare-form-group">
          <label htmlFor="petcare-question" className="petcare-label">
            Your Question:
          </label>
          <textarea
            id="petcare-question"
            rows="4"
            className="petcare-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., How often should I bathe my dog? What are common signs of a cat flu?"
          />
        </div>
        <button
          onClick={handleAskQuestion}
          className={`petcare-button${isLoading ? " loading" : ""}`}
          disabled={isLoading || question.trim() === ""}
        >
          {isLoading ? "Getting Advice..." : "Get Advice ✨"}
        </button>
        {answer && (
          <div className="petcare-answer">
            <h3 className="answer-heading">Answer:</h3>
            <p className="answer-content">{answer}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default PetCareAssistant;
