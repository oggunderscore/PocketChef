import React, { useState } from "react";
import { Slider } from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InformationTooltip from "./Information_Tooltip";
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

  const sliderStyles = {
    height: 8,
    "& .MuiSlider-thumb": {
      width: 20,
      height: 20,
      backgroundColor: "#12263E", // Dark blue for the thumb
    },
    "& .MuiSlider-track": {
      backgroundColor: "#12263E", // Dark blue for the track
      border: 0,
    },
    "& .MuiSlider-rail": {
      backgroundColor: "#C3DBDB", // Light blue for the rail
    },
    "& .MuiSlider-mark": {
      display: "none", // Hides the mark dots
    },
  };

  return (
    <div className="app-container">
      <h2 className="welcome">Welcome!</h2>
      <h3 className="pref">Let's set your preferences.</h3>

      <p className="question">What's your budget?</p>
      <div className="slider-container">
        <Slider
          aria-label="Budget Factor"
          defaultValue={0.5}
          step={0.1}
          marks={[
            { value: 0, label: "Low" },
            { value: 0.5 },
            { value: 1, label: "High" },
          ]}
          min={0}
          max={1}
          valueLabelDisplay="auto"
          sx={sliderStyles}
        />
        <InformationTooltip tooltipText="Budget slider tool test " />
      </div>

      <p className="question">Cooking complexity?</p>
      <div className="slider-container">
        <Slider
          aria-label="Cooking Complexity Factor"
          defaultValue={0.5}
          step={0.1}
          marks={[
            { value: 0, label: "Low" },
            { value: 0.5 },
            { value: 1, label: "High" },
          ]}
          min={0}
          max={1}
          valueLabelDisplay="auto"
          sx={sliderStyles}
        />
        <InformationTooltip tooltipText="Complexity slider tool test " />
      </div>

      <p className="question">Time spent cooking?</p>
      <div className="slider-container">
        <Slider
          aria-label="Cooking Time"
          defaultValue={0.5}
          step={0.1}
          marks={[
            { value: 0, label: "Low" },
            { value: 0.5 },
            { value: 1, label: "High" },
          ]}
          min={0}
          max={1}
          valueLabelDisplay="auto"
          sx={sliderStyles}
        />
        <InformationTooltip tooltipText="Time slider tool test " />
      </div>

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
