import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/AddCircle";
import "./Preferences.css";
// Import Firebase functions as needed (e.g., setDoc, doc)
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Preferences = () => {
  const [restrictions, setRestrictions] = useState([]);
  const [cuisines, setCuisines] = useState([]);

  const [isAddingRestriction, setIsAddingRestriction] = useState(false);
  const [isAddingCuisine, setIsAddingCuisine] = useState(false);
  const [newItem, setNewItem] = useState("");

  const db = getFirestore(); // Initialize Firestore instance
  const user = getAuth().currentUser; // Get current authenticated user

  const handleRemoveItem = (setter) => (item) => {
    setter((prev) => prev.filter((val) => val !== item));
  };

  const handleAddItem = (setter, type) => {
    if (newItem.trim() !== "") {
      setter((prev) => [...prev, newItem]);

      // Uncomment and configure this section to save new item to Firebase
      /*
      if (user) {
        const userRef = doc(db, "users", user.uid); // Path to user's document in Firestore
        setDoc(
          userRef,
          {
            [type]: [...prev, newItem], // Append new item to the existing list
          },
          { merge: true }
        )
          .then(() => {
            console.log(`${newItem} added to ${type} in Firestore.`);
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      }
      */

      setNewItem("");
    }
  };

  const handleKeyPress = (e, setter, setIsAdding, type) => {
    if (e.key === "Enter") {
      handleAddItem(setter, type);
      setIsAdding(false);
    } else if (e.key === "Escape") {
      setIsAdding(false);
    }
  };

  const handleInputChange = (e) => {
    setNewItem(e.target.value);
    e.target.style.width = `${e.target.value.length + 1}ch`; // Adjust width based on content
  };

  const handleClearRestrictions = () => {
    setRestrictions([]);

    // Uncomment and configure this section to clear restrictions in Firebase
    /*
    if (user) {
      const userRef = doc(db, "users", user.uid); // Path to user's document in Firestore
      setDoc(
        userRef,
        { restrictions: [] }, // Set restrictions to an empty array
        { merge: true }
      )
        .then(() => {
          console.log("Restrictions cleared in Firestore.");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
    */
  };

  const handleClearCuisines = () => {
    setCuisines([]);

    // Uncomment and configure this section to clear cuisines in Firebase
    /*
    if (user) {
      const userRef = doc(db, "users", user.uid); // Path to user's document in Firestore
      setDoc(
        userRef,
        { cuisines: [] }, // Set cuisines to an empty array
        { merge: true }
      )
        .then(() => {
          console.log("Cuisines cleared in Firestore.");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
    */
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
                handleKeyPress(
                  e,
                  setRestrictions,
                  setIsAddingRestriction,
                  "restrictions"
                )
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
        <button className="clear-button" onClick={handleClearRestrictions}>
          Clear All
        </button>
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
                handleKeyPress(e, setCuisines, setIsAddingCuisine, "cuisines")
              }
              onBlur={() => setIsAddingCuisine(false)}
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
        <button className="clear-button" onClick={handleClearCuisines}>
          Clear All
        </button>
      </section>
    </div>
  );
};

export default Preferences;
