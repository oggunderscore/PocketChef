import React, { useState, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useLocation } from "react-router-dom";
import "./gpt.css"; // CSS file for styling

const RecipeGenerator = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("Generating Recipe..."); // Dynamically update title

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
      Format the response with separate sections for "Ingredients" and "Instructions".
    `.trim();
  };

  const submitMessage = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const generateText = httpsCallable(functions, "generateText");

    try {
      const result = await generateText({ prompt: generatePrompt() });
      const formattedResponse = parseRecipe(result.data.response);
      console.log(result.data.response);

      // Extract and set the title
      const firstLine = result.data.response.split("\n")[0].trim();
      setTitle(firstLine || "Generated Recipe");

      setResponse(formattedResponse);
    } catch (err) {
      setError("There was an issue generating the recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parseRecipe = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const ingredientsIndex = lines.findIndex((line) =>
      line.toLowerCase().includes("ingredients")
    );
    const instructionsIndex = lines.findIndex((line) =>
      line.toLowerCase().includes("instructions")
    );

    const ingredients = lines
      .slice(ingredientsIndex + 1, instructionsIndex)
      .map((line) => `${line.trim()}`)
      .join("<br />");

    const instructions = lines
      .slice(instructionsIndex + 1)
      .map((line, index) => `${line.trim()}`)
      .join("<br />");

    return { ingredients, instructions };
  };

  return (
    <div className="recipe-generator-container">
      <div className="recipe-content">
        <h2>{title}</h2>
        {response ? (
          <div className="recipe-card">
            <h3>Ingredients</h3>
            <p dangerouslySetInnerHTML={{ __html: response.ingredients }} />
            <h3>Instructions</h3>
            <p dangerouslySetInnerHTML={{ __html: response.instructions }} />
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
