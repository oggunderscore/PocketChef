import React, { useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";

const RecipeGenerator = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    Ingredients: ${userIngredients.join(", ")}
    Budget: ${userBudget}
    Complexity: ${userComplexity}
    Cooking Time: ${userCookingTime}
    Dietary Restrictions: ${userRestrictions}
    Please provide a recipe that is easy to follow and includes cooking instructions. Do not include a section with equipment.
  `;

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
