import React, { useState, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  getFirestore,
  doc,
  updateDoc,
  setDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useLocation, useNavigate } from "react-router-dom";

import "./RecipeGenerator.css";

const RecipeGenerator = () => {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Destructure state from navigation
  const { ingredients, budget, complexity, time, customInstructions } =
    location.state || {};

  const functions = getFunctions();
  const db = getFirestore();
  const auth = getAuth();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Submit Message when state params exist
  useEffect(() => {
    if (ingredients && budget && complexity && time) {
      const submitMessage = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        const generateText = httpsCallable(functions, "generateText");

        try {
          // Generate the prompt
          const prompt = `
            Create a recipe with the following parameters:
            Ingredients: ${ingredients}/5
            Budget: ${budget}/5
            Complexity: ${complexity}/5
            Cooking Time: ${time}/5
            Special requests: ${customInstructions}
            Please provide a recipe that is easy to follow and includes cooking instructions.
            Response Formatting:
            Output your response in JSON format where recipe_id is a combination of the recipe name in combination with timestamp generated.
            recipe_id, recipe_name, ingredients, instructions, and tips are required sections in the response. 

            {
            "recipe_id": "steak_and_eggs_12-11-24_13_44_03",
            "recipe_name": "Steak and Eggs",
            "ingredients": ["1lb Steak Ribeye", "3 Eggs"],
            "instructions": [{"section": "Preparing the Steak", "steps": ["1. Season the steak generously with salt and pepper", "2. Trim off excess fat"]}],
            "tips": ["Cook with caution", "Use a cast iron pan"]
            }
          `.trim();

          const result = await generateText({ prompt });
          console.log("Response: " + result.data.response);
          let jsonResponse = result.data.response;

          if (jsonResponse.startsWith("```json")) {
            jsonResponse = jsonResponse.replace(/```json|```/g, "").trim();
          }

          const parsedResponse = JSON.parse(jsonResponse);

          // Construct the recipe document
          const recipeData = {
            recipe_id: parsedResponse.recipe_id,
            date_generated: serverTimestamp(),
            generated_by_user_id: user ? user.uid : "anonymous",
            last_accessed: serverTimestamp(),
            recipe: parsedResponse,
          };

          // Save to Firestore with recipe_id as document key
          const recipeRef = doc(db, "recipes", parsedResponse.recipe_id);
          await setDoc(recipeRef, recipeData);

          setResponse(parsedResponse);
          console.log("Recipe saved successfully:", parsedResponse.recipe_id);
        } catch (err) {
          console.error("Error generating recipe:", err);
          setError(
            "There was an issue generating the recipe. Please try again."
          );
        } finally {
          setLoading(false);
        }
      };

      submitMessage(); // Call the function only once
    } else {
      console.log("No state passed, redirecting to Home.");
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures it only runs on mount

  const handleFavorite = async () => {
    if (!user || !response) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        favorite_recipes: arrayUnion(response.recipe_id),
      });
      setIsFavorite(true);
      console.log("Recipe added to favorites:", response.recipe_id);
    } catch (err) {
      console.error("Error adding recipe to favorites:", err);
    }
  };

  return (
    <div className="recipe-generator-container">
      <div className="recipe-content">
        <div className="recipe-header">
          <h2 className="recipe-title">
            {loading ? "Generating Recipe..." : response?.recipe_name}
          </h2>
          {user && response && (
            <button
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={handleFavorite}
              title="Add to Favorites"
            >
              {isFavorite ? (
                <FavoriteIcon fontSize="large" />
              ) : (
                <FavoriteBorderIcon fontSize="large" />
              )}
            </button>
          )}
        </div>
        {error && <p className="error-message">{error}</p>}
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
                    <li key={stepIndex}>{step.replace(/^\d+\.\s/, "")}</li>
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
            <button className="generate-btn" onClick={() => {}}>
              Generate Recipe
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator;
