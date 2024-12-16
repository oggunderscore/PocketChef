import React, { useState, useRef } from "react";
import AddIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Question from "./Question"; // Assuming Question.js is the component for each slider
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [ingredients, setIngredients] = useState([]);
  const [isAddingIngredient, setIsAddingIngredient] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [customInstructions, setCustomInstructions] = useState("");

  // State for sliders
  const [budget, setBudget] = useState(3);
  const [complexity, setComplexity] = useState(3);
  const [time, setTime] = useState(3);

  const inputRef = useRef(null); // Reference for the ingredient input field
  const navigate = useNavigate();

  const handleAddIngredient = () => {
    if (newIngredient.trim() !== "") {
      setIngredients((prev) => [...prev, newIngredient]);
      setNewIngredient(""); // Clear input field
      setIsAddingIngredient(true); // Keep input active
      inputRef.current.focus(); // Auto-focus on input field
    }
  };

  const handleIngredientKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    } else if (e.key === "Escape") {
      setIsAddingIngredient(false);
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setIngredients((prev) => prev.filter((item) => item !== ingredient));
  };

  const handleClearIngredients = () => {
    setIngredients([]);
  };

  const generateRecipe = (
    ingredients,
    budget,
    complexity,
    time,
    customInstructions
  ) => {
    console.log("Generating recipe with:", {
      ingredients,
      budget,
      complexity,
      time,
      customInstructions,
    });

    navigate("/gpt", {
      state: {
        ingredients,
        budget,
        complexity,
        time,
        customInstructions,
      },
    });
  };

  return (
    <div className="app-container">
      <h2 className="welcome">Welcome!</h2>
      <h3 className="pref">Let's start cooking.</h3>

      <div className="content-container">
        {/* Sliders */}
        <Question
          defaultValue={budget}
          label="What's your budget?"
          tooltipText="Budget determines the price range of the recipe and how much the generation can expect the user to have"
          onChange={setBudget}
        />
        <Question
          defaultValue={complexity}
          label="Cooking Complexity?"
          tooltipText="Complexity determines the difficulty of the recipe and how much prior cooking experience and knowledge the user has"
          onChange={setComplexity}
        />
        <Question
          defaultValue={time}
          label="Time Spent Cooking?"
          tooltipText="Time determines the length of the recipe and how much time the user has to spend cooking"
          onChange={setTime}
        />

        {/* Ingredients Section */}
        <div className="ingredient-container">
          <p className="ingredient-text">Ingredients</p>
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

            {/* Input Field */}
            {isAddingIngredient ? (
              <input
                ref={inputRef} // Focus control
                type="text"
                className="add-input"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={handleIngredientKeyPress}
                onBlur={() => setIsAddingIngredient(false)}
                autoFocus
              />
            ) : (
              <div
                className="add-item"
                onClick={() => {
                  setIsAddingIngredient(true);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              >
                Click to Add <AddIcon fontSize="small" />
              </div>
            )}
          </div>

          {/* Clear Ingredients */}
          <button className="clear-button" onClick={handleClearIngredients}>
            Clear All
          </button>
        </div>

        {/* Special Requests Section */}
        <div className="special-requests-container">
          <label className="special-requests-label" htmlFor="special-requests">
            Special requests
          </label>
          <input
            type="text"
            id="special-requests"
            className="special-requests-input"
            placeholder="Enter any special requests"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <button
          className="generate-button"
          onClick={() =>
            generateRecipe(
              ingredients,
              budget,
              complexity,
              time,
              customInstructions
            )
          }
        >
          Generate
        </button>
      </div>
    </div>
  );
}

export default Home;
