import React, { useState, useEffect } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import retrieveRecipe from "../Hooks/RetrieveRecipe";
import "./Favorites.css";

const Favorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // List of fetched recipes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

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

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Favorites</h2>
      {loading ? (
        <p>Loading your favorites...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : favoriteRecipes.length > 0 ? (
        <ul className="favorites-list">
          {favoriteRecipes.map((recipe) => (
            <li
              key={recipe.recipe_id}
              className="favorite-item"
              onClick={() => console.log("Recipe Details:", recipe)}
            >
              {recipe.recipe.recipe_name}
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
