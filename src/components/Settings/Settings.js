// src/components/Settings/Settings.js

import React from "react";
import "./Settings.css";
import UpdateUsername from "./UpdateUsername";

const Settings = () => {
  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>User Settings</h3>
        <ul className="settings-list">
          <li>
            <UpdateUsername />
          </li>
          <li>Update Email</li>
          <li>Update Password</li>
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
    </div>
  );
};

export default Settings;
