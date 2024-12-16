// src/components/Settings/Settings.js

import React, { useEffect, useState } from "react";
import "./Settings.css";
import Modal from "./Modal";
import UpdatePassword from "./UpdatePassword";
import { auth, db } from "../../configuration";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ContactUsButton from "../shared/ContactUsButton/ContactUsButton.js";

const Settings = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [currentField, setCurrentField] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");


  //load current username and email from firestore
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          setEmail(user.email);
          const userDoc = doc(db, "users", user.uid);
          const userData = await getDoc(userDoc);
          if (userData.exists()) {
            setUsername(userData.data().username || "DefaultUsername");
          }
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

  const handleSave = async (newValue) => {
    const user = auth.currentUser;
    if (!user) {
      console.error("User is not authenticated.");
      return;
    }
    if (currentField === "username") {
      setUsername(newValue);
      const userDoc = doc(db, "users", user.uid);
      await updateDoc(userDoc, { username: newValue });
      console.log("Username updated in ${newValue}.");
    }
    if(currentField === "email") {
      if (newValue !== user.email) {
        try {
          await user.updateEmail(newValue);
          setEmail(newValue);
          console.log("Email updated to ${newValue}.");
        } catch (error) {
          console.error("Error updating email:", error);
        }
      } else {
        console.log("Email is already set to ${user.email}.");
      }
    }
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
          <li onClick={() => openModal("Username")}>Update Username: <strong>{username}</strong>
          </li>
          <li onClick={() => openModal("Email")}>Update Email: <strong>{email}</strong>
          </li>
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
          <li>
            <ContactUsButton /> {/* Render the Contact Us / Feedback Button */}
          </li>
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
