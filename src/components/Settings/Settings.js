// src/components/Settings/Settings.js

import React, { useState } from "react";
import "./Settings.css";
import Modal from "./Modal";

const Settings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  const openModal = (field) => {
    setIsModalOpen(true);
    setModalTitle(`Update ${field}`);
    setPlaceholder(`Enter new ${field.toLowerCase()}`);
  };

  const handleSave = (newValue) => {
    // Logic to update the username, email, or password with newValue
    console.log(`${modalTitle} updated to:`, newValue);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>User Settings</h3>
        <ul className="settings-list">
          <li onClick={() => openModal("Username")}>Username</li>
          <li onClick={() => openModal("Email")}>Update Email</li>
          <li onClick={() => openModal("Password")}>Update Password</li>
          <li>Delete Data</li>
        </ul>
      </div>

      <div className="settings-section">
        <h3>App Settings</h3>
        <ul className="settings-list">
          <li>Dark Mode</li>
          <li>App Language</li>
          <li>Notifications</li>
        </ul>
      </div>

      <div className="settings-section">
        <h3>Resources</h3>
        <ul className="settings-list">
          <li>Contact Us</li>
          <li>Send Feedback</li>
        </ul>
      </div>
      {isModalOpen && (
        <Modal
          title={modalTitle}
          placeholder={placeholder}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Settings;
