import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/AddCircle";
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
    "Chinese",
    "Vietnamese",
    "Indian",
    "Korean",
    "American",
    "Japanese",
  ]);

  const [isAddingRestriction, setIsAddingRestriction] = useState(false);
  const [isAddingCuisine, setIsAddingCuisine] = useState(false);
  const [newItem, setNewItem] = useState("");

  const handleRemoveItem = (setter) => (item) => {
    setter((prev) => prev.filter((val) => val !== item));
  };

  const handleAddItem = (setter) => {
    if (newItem.trim() !== "") {
      setter((prev) => [...prev, newItem]);
      setNewItem("");
    }
  };

  const handleKeyPress = (e, setter, setIsAdding) => {
    if (e.key === "Enter") {
      handleAddItem(setter);
      setIsAdding(false);
    } else if (e.key === "Escape") {
      setIsAdding(false);
    }
  };

  const handleInputChange = (e) => {
    setNewItem(e.target.value);
    e.target.style.width = `${e.target.value.length + 1}ch`; // Adjust width based on content
  };

  return (
    <div className="preferences-container">
      <h2>Preferences</h2>

      <section className="section">
        <h3>Restrictions</h3>
        <p>e.g. Vegetarian, Keto, etc.</p>
        <div className="preferences-list">
          {restrictions.map((item, index) => (
            <span key={index} className="preference-item">
              {item}{" "}
              <button
                onClick={() => handleRemoveItem(setRestrictions)(item)}
                className="close-button"
              >
                <CancelIcon fontSize="small" />
              </button>
            </span>
          ))}
          {isAddingRestriction ? (
            <input
              type="text"
              className="add-input"
              value={newItem}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                handleKeyPress(e, setRestrictions, setIsAddingRestriction)
              }
              onBlur={() => setIsAddingRestriction(false)}
              autoFocus
            />
          ) : (
            <span className="add-item">
              <button
                onClick={() => setIsAddingRestriction(true)}
                className="add-button"
              >
                {"Click to Add"}
                <AddIcon fontSize="small" />
              </button>
            </span>
          )}
        </div>
        <button className="clear-button">Clear All</button>
      </section>

      <section className="section">
        <h3>Preferred Cuisines</h3>
        <p>e.g. Chinese, Indian, American, etc.</p>
        <div className="preferences-list">
          {cuisines.map((item, index) => (
            <span key={index} className="preference-item">
              {item}{" "}
              <button
                onClick={() => handleRemoveItem(setCuisines)(item)}
                className="close-button"
              >
                <CancelIcon fontSize="small" />
              </button>
            </span>
          ))}
          {isAddingCuisine ? (
            <input
              type="text"
              className="add-input"
              value={newItem}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                handleKeyPress(e, setCuisines, setIsAddingCuisine)
              }
              onBlur={() => setIsAddingCuisine(false)} // Close input on blur
              autoFocus
            />
          ) : (
            <span className="add-item">
              <button
                onClick={() => setIsAddingCuisine(true)}
                className="add-button"
              >
                {"Click to Add"}
                <AddIcon fontSize="small" />
              </button>
            </span>
          )}
        </div>
        <button className="clear-button">Clear All</button>
      </section>
    </div>
  );
};

export default Preferences;
