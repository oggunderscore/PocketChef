import React from "react";
import { Slider } from "@mui/material";
import "./Home.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";

function Home() {
  const handleAddIngredient = () => {
    console.log("Adding ingredient...");
  };

  return (
    <div className="app-container">
      <div className="app-bar">
        <h1 className="app-title">PocketChef</h1>
      </div>

      <h2 className="welcome">Welcome to PocketChef!</h2>
      <h3 className="pref">Let's set your preferences.</h3>

      <p className="question">What's your budget?</p>
      <div className="slider-container">
        <Slider
          aria-label="Small steps"
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
        />
      </div>

      <p className="question">Cooking complexity?</p>
      <div className="slider-container">
        <Slider
          aria-label="Small steps"
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
        />
      </div>

      <p className="question">Time spent cooking?</p>
      <div className="slider-container">
        <Slider
          aria-label="Small steps"
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
        />
      </div>

      <div className="ingredient-container">
        <p className="ingredient-text">Ingredients:</p>
        <div className="add-ingredient" onClick={handleAddIngredient}>
          <div className="blue-box">
            <div className="add-button">
              Click to Add <AddCircleIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
