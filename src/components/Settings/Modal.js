import React, { useState } from "react";
import { auth, db } from "../../configuration.js";
import {updateEmail, updatePassword} from "firebase/auth";
import {doc, setDoc, updateDoc } from "firebase/firestore";
import "./Modal.css"; // Style this to look like a pop-up

const Modal = ({ title, placeholder, onClose, onSave, currentField }) => {
const [value, setValue] = useState("");
const [error, setError] = useState("");


//validation functions for email and password
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password) => {
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;

    return (
        password.length >= minLength &&
        hasNumber.test(password) &&
        hasSpecialChar.test(password) &&
        hasUppercase.test(password) &&
        hasLowercase.test(password)
    );
};
const validateUsername = (username) => {
    return username.trim().length >= 3;
}
const handleSave = async () => {
    try {
        //resets error before validation
        setError("");
        if(currentField === "email") {
            if (!validateEmail(value)) {
                setError("Please enter a valid email address.");
                return;
            }

            //update firebase authentication
            await updateEmail(auth.currentUser, value);
            const userDoc = doc(db, "users", auth.currentUser.uid);
            //update firestore
            await setDoc(userDoc, { email: value }, { merge: true });

        } else if (currentField === "password") {
            if (!validatePassword(value)) {
                setError("Password must be at least 8 characters long, includewith at least one uppercase letter, one lowercase letter, contain at least one number, and one special character.");
                return;
            }

            await updatePassword(auth.currentUser, value);
        } else if (currentField === "username") {
            if(!validateUsername(value)) {
                setError("Username must be at least 3 characters long.");
                return;
            }

            const userDoc = doc(db, "users", auth.currentUser.uid);
            //updating firestore
            await updateDoc(userDoc, { username: value });
        }
        onSave(value);
        onClose();
        } catch (err) {
            //handle firebase errors
            setError(err.message);
        }
};

return (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3>{title}</h3>
            <input 
                type={currentField === "password" ? "password" : "text"}
                placeholder={placeholder} 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
    </div>
    </div>
    );
};

export default Modal;
