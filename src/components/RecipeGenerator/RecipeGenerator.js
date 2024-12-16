import React, { useState, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useLocation } from "react-router-dom";
import "./RecipeGenerator.css";

const RecipeGenerator = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const { ingredients, budget, complexity, time, customInstructions } =
    location.state || {};

  const functions = getFunctions();

  useEffect(() => {
    submitMessage();
  }, []);

  const generatePrompt = () => {
    return `
      Create a recipe with the following parameters:
      Ingredients: ${ingredients}/5
      Budget: ${budget}/5
      Complexity: ${complexity}/5
      Cooking Time: ${time}/5
      Custom Instructions: ${customInstructions}
      Please provide a recipe that is easy to follow and includes cooking instructions.
      Format the response as JSON with fields: recipe_id, recipe_name, ingredients, instructions, and tips.
    `.trim();
  };

  const submitMessage = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const generateText = httpsCallable(functions, "generateText");

    try {
      const result = await generateText({ prompt: generatePrompt() });
      const jsonResponse = JSON.parse(result.data.response);
      setResponse(jsonResponse);
    } catch (err) {
      setError("There was an issue generating the recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-generator-container">
      <div className="recipe-content">
        <h2>{loading ? "Generating Recipe..." : "Recipe"}</h2>
        {response ? (
          <div className="recipe-card">
            <h3>{response.recipe_name}</h3>
            <p className="recipe-id">
              <em>{response.recipe_id}</em>
            </p>
            <h4>Ingredients</h4>
            <ul>
              {response.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h4>Instructions</h4>
            {response.instructions.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h5>{section.section}</h5>
                <ol>
                  {section.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
            {response.tips && (
              <>
                <h4>Tips</h4>
                <ul>
                  {response.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          !loading && (
            <button className="generate-btn" onClick={submitMessage}>
              Generate Recipe
            </button>
          )
        )}
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default RecipeGenerator;
