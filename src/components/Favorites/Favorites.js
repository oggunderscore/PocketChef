import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import retrieveRecipe from "../Hooks/RetrieveRecipe";
import DeleteIcon from "@mui/icons-material/Delete"; // Importing DeleteIcon
import "./Favorites.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Favorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // List of fetched recipes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("User not logged in.");
        setLoading(false);
        return;
      }

      try {
        // Fetch the user's favorite_recipes array
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const { favorite_recipes } = userSnap.data();
          if (favorite_recipes && favorite_recipes.length > 0) {
            // Fetch each recipe data using the retrieveRecipe function
            const recipesData = await Promise.all(
              favorite_recipes.map((id) => retrieveRecipe(id))
            );
            setFavoriteRecipes(recipesData.filter((recipe) => recipe !== null));
          }
        } else {
          setError("No favorite recipes found.");
        }
      } catch (err) {
        console.error("Error fetching favorite recipes:", err);
        setError("Failed to fetch favorite recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [auth, db]);

  const removeFavorite = async (recipeId) => {
    const user = auth.currentUser;
    if (!user) {
      setError("User not logged in.");
      return;
    }

    try {
      // Update the user's favorite_recipes array in Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const { favorite_recipes } = userSnap.data();
        const updatedFavorites = favorite_recipes.filter(
          (id) => id !== recipeId
        );

        await updateDoc(userRef, { favorite_recipes: updatedFavorites });

        // Update the state to reflect the changes
        setFavoriteRecipes((prevFavorites) =>
          prevFavorites.filter((recipe) => recipe.recipe.recipe_id !== recipeId)
        );
      }
    } catch (err) {
      console.error("Error removing favorite recipe:", err);
      setError("Failed to remove favorite recipe.");
    }
  };

  return (
    <div className="favorites-container">
      <ToastContainer />
      <h2 className="favorites-title">Favorites</h2>
      {loading ? (
        <p>Loading your favorites...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : favoriteRecipes.length > 0 ? (
        <ul className="favorites-list">
          {favoriteRecipes.map((recipe) => (
            <li key={recipe.recipe_id} className="favorite-item">
              <span
                className="recipe-name"
                onClick={() => navigate(`/recipe/${recipe.recipe.recipe_id}`)}
              >
                {recipe.recipe.recipe_name}
              </span>
              <button
                className="remove-favorite-btn"
                onClick={() => removeFavorite(recipe.recipe.recipe_id)}
              >
                <DeleteIcon />{" "}
                {/* Replacing trash icon with Material-UI DeleteIcon */}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorite recipes found.</p>
      )}
    </div>
  );
};

export default Favorites;
