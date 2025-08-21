import React, { useState } from "react";
import "./PetTrainingAdvice.css";

function PetTrainingAdvice() {
  const [trainingQuestion, setTrainingQuestion] = useState("");
  const [trainingAnswer, setTrainingAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGetTrainingAdvice = async () => {
    setIsLoading(true);
    setTrainingAnswer("");
    try {
      // Simulate an API response for demo (replace with actual API call)
      const mockResponse = [
        "**To teach your puppy to sit:**",
        "1. Hold a treat close to your puppy’s nose.",
        "2. Move your hand up, allowing their head to follow the treat and causing their back end to lower.",
        "3. Once they’re in a sitting position, say “Sit,” give them the treat, and offer verbal praise.",
        "4. Repeat several times daily until your puppy learns.",
        "5. Gradually reduce the use of treats as your puppy progresses.",
        "",
        "**For scratching furniture:**",
        "1. Provide multiple scratching posts near your cat’s favorite spots.",
        "2. Encourage use of the posts with catnip or treats.",
        "3. Gently redirect your cat to the post each time they scratch furniture.",
        "4. Use positive reinforcement – praise and treats when they scratch the post.",
        "5. Cover furniture with double-sided tape or a scratcher as a deterrent.",
        "",
        "Remember, patience and consistency are key. Always use positive reinforcement for best results."
      ].join("\n");
      setTimeout(() => setTrainingAnswer(mockResponse), 800);
    } catch (error) {
      console.error("Error calling API:", error);
      setTrainingAnswer(
        "An error occurred while fetching training advice. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="training-section">
      <div className="training-card">
        <h2 className="training-heading">
          <span className="emoji" role="img" aria-label="sparkles">
            ✨
          </span>{" "}
          Pet Training Advice
        </h2>
        <p className="training-subtitle">
          Struggling with pet behavior? Ask our AI for training tips!
        </p>
        <div className="training-form-group">
          <label htmlFor="training-question" className="training-label">
            Your Training Question:
          </label>
          <textarea
            id="training-question"
            rows="4"
            className="training-textarea"
            value={trainingQuestion}
            onChange={(e) => setTrainingQuestion(e.target.value)}
            placeholder="e.g., How do I teach my puppy to sit? My cat scratches furniture, what can I do?"
          ></textarea>
        </div>
        <button
          onClick={handleGetTrainingAdvice}
          className={`training-button${isLoading ? " loading" : ""}`}
          disabled={isLoading || trainingQuestion.trim() === ""}
        >
          {isLoading ? "Getting Advice..." : "Get Training Advice ✨"}
        </button>
        {trainingAnswer && (
          <div className="training-answer">
            <h3 className="answer-heading">Training Advice:</h3>
            <p className="answer-content">{trainingAnswer}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default PetTrainingAdvice;
