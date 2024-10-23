// src/components/Preferences/Preferences.js

import React, { useState } from "react";
import "./Preferences.css";

const Preferences = () => {
  const [restrictions, setRestrictions] = useState([
    "Cheese",
    "Bread",
    "Milk",
    "Eggs",
    "Tomato",
    "Butter",
  ]);
  const [cuisines, setCuisines] = useState([
    "Cheese",
    "Bread",
    "Milk",
    "Eggs",
    "Tomato",
    "Butter",
  ]);

  const handleRemoveItem = (setter) => (item) => {
    setter((prev) => prev.filter((val) => val !== item));
  };

  return (
    <div className="preferences-container">
      <h2>Preferences</h2>

      <section className="section">
        <h3>Restrictions:</h3>
        <div className="preferences-list">
          {restrictions.map((item, index) => (
            <span key={index} className="preference-item">
              {item}{" "}
              <button onClick={() => handleRemoveItem(setRestrictions)(item)}>
                x
              </button>
            </span>
          ))}
          <button className="add-button">Click to Add +</button>
        </div>
        <button className="clear-button">Clear All</button>
      </section>

      <section className="section">
        <h3>Preferred Cuisines:</h3>
        <div className="preferences-list">
          {cuisines.map((item, index) => (
            <span key={index} className="preference-item">
              {item}{" "}
              <button onClick={() => handleRemoveItem(setCuisines)(item)}>
                x
              </button>
            </span>
          ))}
          <button className="add-button">Click to Add +</button>
        </div>
        <button className="clear-button">Clear All</button>
      </section>
    </div>
  );
};

export default Preferences;
