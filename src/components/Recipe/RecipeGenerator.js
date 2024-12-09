import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { generateRecipe } from "../../services/api"; // Import the API function
import "./RecipeGenerator.css";

const RecipeGenerator = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Retrieve state passed from the previous page
  const location = useLocation();
  const { ingredients, budget, complexity, time, customInstructions } =
    location.state || {};

  const generatePrompt = () => {
    return `
      Create a recipe with the following parameters:
      Ingredients: ${
        ingredients && ingredients.length > 0 ? ingredients.join(", ") : "None"
      }
      Budget: ${budget}/5
      Complexity: ${complexity}/5
      Cooking Time: ${time}/5
      Custom Instructions: ${customInstructions || "None"}
      Please provide a recipe that is easy to follow and includes cooking instructions. Do not include a section with equipment.
    `.trim();
  };

  const submitMessage = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Call the API
      const result = await generateRecipe(
        ingredients,
        budget,
        complexity,
        time,
        customInstructions
      );

      // Update state with the result
      if (result.status === "success") {
        setResponse(result.recipe); // Assuming the recipe is returned in `result.recipe`
      } else {
        setError("Recipe generation failed. Please try again.");
      }
    } catch (err) {
      console.error("Error generating recipe:", err);
      setError("There was an issue generating the recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically generate recipe when the page loads
    submitMessage();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="recipe-container">
      <h1>Recipe Generator</h1>

      <button
        className="generate-button"
        onClick={submitMessage}
        disabled={loading}
      >
        {loading ? "Generating Recipe..." : "Generate Again"}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {response && (
        <div className="recipe-card">
          <h2>Generated Recipe</h2>
          <pre className="recipe-text">{response}</pre>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
