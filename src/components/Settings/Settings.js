// src/components/Settings/Settings.js

import React, { useEffect, useState } from "react";
import "./Settings.css";
import Modal from "./Modal";
import UpdatePassword from "./UpdatePassword";
import { auth, db } from "../../configuration";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Settings = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [currentField, setCurrentField] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("********");

  //load current username and email from firestore
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const userData = await getDoc(userDoc);

        if (userData.exists()) {
          setUsername(userData.data().username || "DefaultUsername");
          setEmail(userData.data().email || "user@example.com");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
      
      

  }, []);

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  

  const openModal = (field) => {
    setModalTitle(`Update ${field}`);
    setPlaceholder(`Enter new ${field.toLowerCase()}`);
    setCurrentField(field.toLowerCase());
    setIsModalOpen(true);
  };

  const handleSave = (newValue) => {
    if (currentField === "username") setUsername(newValue);
    if (currentField === "email") setEmail(newValue);
    //if (currentField === "password") setPassword(newValue);

    // Logic to update the username, email, or password with newValue
    console.log(`${modalTitle} updated to:`, newValue);
  };

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      {isPasswordModalOpen && <UpdatePassword onClose={closePasswordModal} />}
      <div className="settings-section">
        <h3>User Settings</h3>
        <ul className="settings-list">
          <li onClick={() => openModal("Username")}>Username: {username}
          </li>
          <li onClick={() => openModal("Email")}>Email:{email}
          </li>
          <li onClick={openPasswordModal}>Update Password</li>
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
          currentField={currentField}
        />
      )}
    </div>
  );
};

export default Settings;
