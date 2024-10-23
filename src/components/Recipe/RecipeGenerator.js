import React, { useState } from "react";
import { generateRecipe } from "../../services/api";

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState("");
  const [budget, setBudget] = useState("Cheap");
  const [complexity, setComplexity] = useState("Easy");
  const [cookingTime, setCookingTime] = useState("under 30 minutes");
  const [restrictions, setRestrictions] = useState("none");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateRecipe = async () => {
    setLoading(true);
    setError(null);
    setRecipe(null);

    const ingredientList = ingredients.split(",").map((ing) => ing.trim());

    try {
      const recipeData = await generateRecipe(
        ingredientList,
        budget,
        complexity,
        cookingTime,
        restrictions
      );
      if (recipeData.status === "timeout") {
        setError("The request timed out. Please try again.");
      } else {
        setRecipe(recipeData);
      }
    } catch (err) {
      setError(
        "An error occurred while generating the recipe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Recipe Generator</h1>
      <div>
        <label>
          Ingredients:
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Budget:
          <select value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="Cheap">Cheap</option>
            <option value="Somewhat Cheap">Somewhat Cheap</option>
            <option value="Moderate">Moderate</option>
            <option value="Slightly Expensive">Slightly Expensive</option>
            <option value="Expensive">Expensive</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Complexity:
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          >
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Cooking Time:
          <select
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          >
            <option value="under 30 minutes">Under 30 minutes</option>
            <option value="30-60 minutes">30-60 minutes</option>
            <option value="over 60 minutes">Over 60 minutes</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Dietary Restrictions:
          <input
            type="text"
            value={restrictions}
            onChange={(e) => setRestrictions(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleGenerateRecipe} disabled={loading}>
        {loading ? "Generating..." : "Generate Recipe"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {recipe && (
        <div>
          <h2>{recipe.title}</h2>
          <h3>Ingredients</h3>
          {recipe.ingredients && recipe.ingredients.length > 0 ? (
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          ) : (
            <p>No ingredients available.</p>
          )}
          <h3>Instructions</h3>
          <p>{recipe.instructions || "No instructions provided."}</p>
          {recipe.tips && recipe.tips.length > 0 && (
            <>
              <h3>Tips</h3>
              <ul>
                {recipe.tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
