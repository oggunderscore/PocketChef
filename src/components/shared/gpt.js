import React, { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { generatePath } from "react-router-dom";
import { useParams } from "react-router-dom";
//import {  } from 'react-router-dom';

const RecipeGenerator = ({ route }) => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const { ingredients, budget, complexity, time, customInstructions } = useParams();
console.log({ ingredients, budget, complexity, time, customInstructions });

  // Initialize Firebase Functions
  const functions = getFunctions();

  // User input states for flexibility
  const [userIngredients] = useState([
    "ribeye steak",
    "potatoes",
    "corn",
    "salt",
    "pepper",
    "butter",
  ]);
  const [userBudget] = useState("Cheap");
  const [userComplexity] = useState("Easy");
  const [userCookingTime] = useState("under 30 minutes");
  const [userRestrictions] = useState("none");

  const generatePrompt = () => {
  const prompt = `
    Create a recipe with the following parameters:
    Ingredients: ${ingredients.join(", ")}
    Budget: ${budget}
    Complexity: ${complexity}
    Cooking Time: ${time}
    Custom Instrucitons: ${customInstructions}
    Please provide a recipe that is easy to follow and includes cooking instructions. Do not include a section with equipment.
  `;
  submitMessage();

  // Return the prompt, trimmed of any extra whitespace
  return prompt.trim();
};


  const submitMessage = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    const generateText = httpsCallable(functions, "generateText");

    try {
      console.log({prompt:generatePrompt()});
      const result = await generateText({ prompt: generatePrompt() });
      setResponse(result.data.response); // Firebase returns result.data.response
    } catch (err) {
      console.error("Error generating recipe:", err);
      setError("There was an issue generating the recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Recipe Generator (GPT-4 Turbo)</h1>
      <button onClick={submitMessage} disabled={loading}>
        {loading ? "Generating Recipe..." : "Generate Recipe"}
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && (
        <div>
          <h2>Generated Recipe</h2>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
