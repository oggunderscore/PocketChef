import React, { useState } from "react";
import AddIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Question from "./Question";
import "./Home.css";

function Home() {
  const [ingredients, setIngredients] = useState([
    "Cheese",
    "Bread",
    "Milk",
    "Eggs",
    "Tomato",
    "Butter",
  ]);

  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "") {
      setIngredients((prev) => [...prev, newIngredient]);
      setNewIngredient("");
    }
  };

  const handleIngredientKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddIngredient();
      setIsAddingIngredient(false);
    } else if (e.key === "Escape") {
      setIsAddingIngredient(false);
    }
  };

  const handleIngredientChange = (e) => {
    setNewIngredient(e.target.value);
    e.target.style.width = `${e.target.value.length + 1}ch`; // Adjust width based on content
  };

  const handleRemoveIngredient = (ingredient) => {
    setIngredients((prev) => prev.filter((item) => item !== ingredient));
  };

  const handleClearIngredients = () => {
    setIngredients([]);
  };

  return (
    <div className="app-container">
      <h2 className="welcome">Welcome!</h2>
      <h3 className="pref">Let's start cooking.</h3>
      <Question
        defaultValue={3}
        label="What's your budget?"
        tooltipText="Budget Question Tooltip"
      />
      <Question
        defaultValue={3}
        label="Cooking complexity?"
        tooltipText="Complexity Question Tooltip"
      />
      <Question
        defaultValue={3}
        label="Time spent cooking?"
        tooltipText="Time Question Tooltip"
      />

      <div className="ingredient-container">
        <p className="ingredient-text">Ingredients:</p>
        <div className="ingredients-list">
          {ingredients.map((ingredient, index) => (
            <span key={index} className="ingredient-item">
              {ingredient}
              <button
                className="close-button"
                onClick={() => handleRemoveIngredient(ingredient)}
              >
                <CancelIcon fontSize="small" />
              </button>
            </span>
          ))}

          {isAddingIngredient ? (
            <input
              type="text"
              className="add-input"
              value={newIngredient}
              onChange={handleIngredientChange}
              onKeyDown={handleIngredientKeyPress}
              onBlur={() => setIsAddingIngredient(false)}
              autoFocus
            />
          ) : (
            <div
              className="add-item"
              onClick={() => setIsAddingIngredient(true)}
            >
              Click to Add <AddIcon fontSize="small" />
            </div>
          )}
        </div>
        <button className="clear-button" onClick={handleClearIngredients}>
          Clear All
        </button>
      </div>
    </div>
  );
}

export default Home;
