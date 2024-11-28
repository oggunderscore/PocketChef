import React, { useState } from "react";
import "./UpdatePassword.css";
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

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long.`;
    }
    if (!hasUpperCase) {
      return "Password must include at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must include at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must include at least one number.";
    }
    if (!hasSpecialChar) {
      return "Password must include at least one special character.";
    }
    return null;
  };

  const handleUpdatePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    try {
      if (user) {
        const credential = EmailAuthProvider.credential(
          user.email,
          oldPassword
        );

        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);

        setSuccessMessage("Password updated successfully.");
        setErrorMessage("");
        onClose();
      } else {
        setErrorMessage("User not authenticated. Please log in again.");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setErrorMessage("The old password is incorrect.");
      } else if (error.code === "auth/user-not-found") {
        setErrorMessage("User not found. Please log in again.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage(
          "Too many failed attempts. Please try again later or reset your password."
        );
      } else {
        setErrorMessage("An unknown error occurred. Please try again.");
      }
      setSuccessMessage("");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Password</h2>
        <input
          type="password"
          className="modal-input"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          className="modal-input"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          className="modal-input"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="button-container">
          <button className="modal-button" onClick={handleUpdatePassword}>
            OK
          </button>
          <button className="modal-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
