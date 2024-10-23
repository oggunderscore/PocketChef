// src/components/Home/Home.js

import React, { useState } from "react";
import "./Home.css";

const Home = () => {
  const [budget, setBudget] = useState(50);
  const [complexity, setComplexity] = useState(50);
  const [time, setTime] = useState(50);
  const [ingredients, setIngredients] = useState([
    "Cheese",
    "Bread",
    "Milk",
    "Eggs",
    "Tomato",
    "Butter",
  ]);

  const handleSliderChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleIngredientRemove = (ingredient) => {
    setIngredients((prev) => prev.filter((item) => item !== ingredient));
  };

  return (
    <div className="home-container">
      <h2>Welcome, Kevin! Let’s set your preferences.</h2>

      <div className="slider-container">
        <label>What’s your budget?</label>
        <input
          type="range"
          min="1"
          max="100"
          value={budget}
          onChange={handleSliderChange(setBudget)}
        />
      </div>

      <div className="slider-container">
        <label>Cooking Complexity?</label>
        <input
          type="range"
          min="1"
          max="100"
          value={complexity}
          onChange={handleSliderChange(setComplexity)}
        />
      </div>

      <div className="slider-container">
        <label>Time Spent Cooking?</label>
        <input
          type="range"
          min="1"
          max="100"
          value={time}
          onChange={handleSliderChange(setTime)}
        />
      </div>

      <div className="ingredients-container">
        <h3>Ingredients:</h3>
        <div className="ingredients-list">
          {ingredients.map((ingredient, index) => (
            <span key={index} className="ingredient-item">
              {ingredient}{" "}
              <button onClick={() => handleIngredientRemove(ingredient)}>
                x
              </button>
            </span>
          ))}
          <button className="add-button">Click to Add +</button>
        </div>
      </div>

      <button className="generate-button">Generate</button>
    </div>
  );
};

export default Home;
