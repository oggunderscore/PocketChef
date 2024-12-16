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
      let jsonResponse = result.data.response;

      // Remove backticks and parse JSON
      if (jsonResponse.startsWith("```json")) {
        jsonResponse = jsonResponse.replace(/```json|```/g, "").trim();
      }

      const parsedResponse = JSON.parse(jsonResponse); // Parse the cleaned JSON string
      setResponse(parsedResponse);
    } catch (err) {
      console.error("Error parsing or fetching JSON:", err);
      setError("There was an issue generating the recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-generator-container">
      <div className="recipe-content">
        <h2>
          {loading
            ? "Generating Recipe..."
            : response
            ? response.recipe_name
            : "Recipe"}
        </h2>

        {response ? (
          <div className="recipe-card">
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
                <ul>
                  {section.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step.replace(/^\d+\.\s/, "")}</li> // Remove step numbers
                  ))}
                </ul>
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
            <p className="recipe-id">
              <em>{response.recipe_id}</em>
            </p>
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
