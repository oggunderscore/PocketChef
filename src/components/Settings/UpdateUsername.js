// src/components/Settings/UpdateUsername.js

import React, { useState } from "react";
// import { db } from "../../firebase"; // Commented out since Firebase isn't set up yet

const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
  zIndex: 1000,
};

const modalContentStyle = {
  textAlign: "center",
};

const modalButtonsStyle = {
  display: "flex",
  justifyContent: "space-around",
  marginTop: "15px",
};

const errorTextStyle = {
  color: "red",
  fontSize: "0.875rem",
};

const UpdateUsername = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewUsername("");
    setError("");
  };

  const handleUsernameChange = (event) => {
    setNewUsername(event.target.value);
  };

  const handleSubmit = async () => {
    if (!newUsername) {
      setError("Username cannot be empty");
      return;
    }
    setIsLoading(true);
    // Simulate the check for now
    setTimeout(() => {
      // Commented out Firebase checks
      /*
      try {
        const usernameExists = await db
          .collection("users")
          .where("username", "==", newUsername)
          .get();
        if (!usernameExists.empty) {
          setError("Username already exists");
        } else {
          // Handle the actual username update in your Firebase authentication
          // Example: await user.updateProfile({ displayName: newUsername });
          setError("");
          // Close the modal and reset the input
          closeModal();
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      }
      */
      // For now, assume no conflicts and close the modal after a short delay
      setError("");
      closeModal();
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="update-username">
      <div onClick={openModal}>Username</div>

      {isModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Update Username</h3>
            <input
              type="text"
              value={newUsername}
              onChange={handleUsernameChange}
              placeholder="Enter new username"
            />
            {error && <p style={errorTextStyle}>{error}</p>}
            <div style={modalButtonsStyle}>
              <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Checking..." : "OK"}
              </button>
              <button onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUsername;
