import React, { useState } from "react";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";

const UpdatePassword = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdatePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    if (user && oldPassword) {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      try {
        // Re-authenticate the user
        await reauthenticateWithCredential(user, credential);

        // Update the password
        await updatePassword(user, newPassword);
        setSuccessMessage("Password updated successfully.");
        setErrorMessage("");
        onClose(); // Close the modal on success
      } catch (error) {
        setErrorMessage(error.message);
        setSuccessMessage("");
      }
    } else {
      setErrorMessage("Please provide your current password.");
    }
  };

  // Inline styles for modal based on your updated design
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const modalContentStyle = {
    backgroundColor: "white",
    padding: "30px 20px",
    borderRadius: "10px",
    textAlign: "center",
    width: "300px",
    boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const buttonContainerStyle = {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  };

  const buttonStyle = {
    padding: "8px 20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "white",
    cursor: "pointer",
  };

  const errorMessageStyle = {
    color: "red",
    fontSize: "0.9em",
  };

  const successMessageStyle = {
    color: "green",
    fontSize: "0.9em",
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>Update Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
        {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
        {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
        <div style={buttonContainerStyle}>
          <button onClick={handleUpdatePassword} style={buttonStyle}>
            OK
          </button>
          <button onClick={onClose} style={buttonStyle}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
