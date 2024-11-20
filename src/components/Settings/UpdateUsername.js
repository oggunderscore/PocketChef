import React, { useState } from "react";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";

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

const UpdatePassword = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setIsLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPassword);

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setError("");
      onClose(); // Close the modal on success
    } catch (err) {
      setError("Failed to update password. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div onClick={() => onClose()}>Change Password</div>

      <div style={modalStyle}>
        <div style={modalContentStyle}>
          <h3>Update Password</h3>
          <input
            type="password"
            value={oldPassword}
            onChange={handleOldPasswordChange}
            placeholder="Old Password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            placeholder="New Password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm New Password"
          />
          {error && <p style={errorTextStyle}>{error}</p>}
          <div style={modalButtonsStyle}>
            <button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Updating..." : "OK"}
            </button>
            <button onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
