import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import retrieveRecipe from "../Hooks/RetrieveRecipe";
import "./Recipe.css";

const RecipePage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await retrieveRecipe(recipeId);
        if (data) {
          setRecipe(data.recipe);
        } else {
          setError("Invalid URL or Recipe not found.");
        }
      } catch (err) {
        setError("Invalid URL or Recipe not found.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h1 className="error-title">Oops!</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="recipe-generator-container">
      <div className="recipe-content">
        <div className="recipe-header">
          <h1>{recipe.recipe_name}</h1>
        </div>
        <div className="recipe-card">
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h2>Instructions</h2>
          {recipe.instructions.map((section, index) => (
            <div key={index}>
              <h4>{section.section}</h4>
              <ul>
                {section.steps.map((step, stepIndex) => (
                  <li key={stepIndex}>{step.replace(/^\d+\.\s/, "")}</li>
                ))}
              </ul>
            </div>
          ))}
          <h2>Tips</h2>
          <ul>
            {recipe.tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
