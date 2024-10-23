// src/components/Favorites/Favorites.js

import React, { useState, useEffect } from "react";
import "./Favorites.css";

const Favorites = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);

  useEffect(() => {
    // Fetch favorite data from an API or local storage
    const fetchFavorites = async () => {
      // Example: Replace with real API call or local storage retrieval
      const data = [
        { id: 1, name: "French Omelette" },
        { id: 2, name: "Vegan Pancakes" },
        { id: 3, name: "Grilled Cheese" },
      ];
      setFavoriteItems(data);
    };

    fetchFavorites();
  }, []);

  return (
    <div className="favorites-container">
      <h2>Favorites</h2>
      {favoriteItems.length > 0 ? (
        <ul className="favorites-list">
          {favoriteItems.map((item) => (
            <li key={item.id} className="favorites-item">
              <span className="favorites-name">{item.name}</span>
              {/* Add additional features like a delete button or details if needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No favorites added yet.</p>
      )}
    </div>
  );
};

export default Favorites;
