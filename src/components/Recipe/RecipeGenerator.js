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
    if (!ingredients.trim()) {
      setError("Please provide at least one ingredient.");
      return;
    }

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
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Recipe Generator</h1>
      <InputField
        label="Ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
      />
      <InputField
        label="Budget"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        type={{
          options: [
            "Cheap",
            "Somewhat Cheap",
            "Moderate",
            "Slightly Expensive",
            "Expensive",
          ],
        }}
      />
      <InputField
        label="Complexity"
        value={complexity}
        onChange={(e) => setComplexity(e.target.value)}
        type={{ options: ["Easy", "Moderate", "Hard"] }}
      />
      <InputField
        label="Cooking Time"
        value={cookingTime}
        onChange={(e) => setCookingTime(e.target.value)}
        type={{
          options: ["under 30 minutes", "30-60 minutes", "over 60 minutes"],
        }}
      />
      <InputField
        label="Dietary Restrictions"
        value={restrictions}
        onChange={(e) => setRestrictions(e.target.value)}
      />
      <button
        onClick={handleGenerateRecipe}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#ccc" : "#007BFF",
          cursor: loading ? "not-allowed" : "pointer",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>
      {error && (
        <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
          {error}
        </p>
      )}
      {recipe && <RecipeDisplay recipe={recipe} />}
    </div>
  );
};

const InputField = ({ label, value, onChange, type = "text" }) => (
  <div style={{ marginBottom: "10px" }}>
    <label>
      {label}:
      {type === "text" ? (
        <input
          type="text"
          value={value}
          onChange={onChange}
          style={{ marginLeft: "10px" }}
        />
      ) : (
        <select
          value={value}
          onChange={onChange}
          style={{ marginLeft: "10px" }}
        >
          {type.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </label>
  </div>
);

const RecipeDisplay = ({ recipe }) => (
  <div
    style={{
      marginTop: "20px",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "20px",
    }}
  >
    <h2 style={{ textAlign: "center" }}>{recipe.title}</h2>
    <h3>
      <strong>Ingredients</strong>
    </h3>
    <ul>
      {recipe.ingredients.map((ingredient, index) => (
        <li key={index}>{ingredient}</li>
      ))}
    </ul>
    <h3>
      <strong>Instructions</strong>
    </h3>
    <p style={{ fontWeight: "bold" }}>
      {recipe.instructions || "No instructions provided."}
    </p>
    {recipe.tips && (
      <>
        <h3>
          <strong>Tips</strong>
        </h3>
        <ul>
          {recipe.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </>
    )}
  </div>
);

export default RecipeGenerator;
