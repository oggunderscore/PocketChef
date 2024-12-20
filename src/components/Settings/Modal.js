import React, { useEffect, useState } from "react";
import { auth, db} from "../../configuration.js";
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink} from "firebase/auth";
import {doc, setDoc, updateDoc } from "firebase/firestore";
import "./Modal.css"; // Style this to look like a pop-up

const Modal = ({ title, placeholder, onClose, onSave, currentField }) => {
const [value, setValue] = useState("");
const [error, setError] = useState("");

const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [inputValue, setInputValue] = useState("");

const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
//validation functions for email and password
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password) => {
    const errors = [];
    const minLength = 8;
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    const hasUppercase = /[A-Z]/;
    const hasLowercase = /[a-z]/;
    if (password.length < minLength) {
        errors.push(`at least ${minLength} characters long.`);
    }
    if (!hasNumber.test(password)) {
        errors.push("include at least one number.");
    }
    if (!hasSpecialChar.test(password)) {
        errors.push("include at least one special character.");
    }
    if (!hasUppercase.test(password)) {
        errors.push("include at least one uppercase letter.");
    }
    if (!hasLowercase.test(password)) {
        errors.push("include at least one lowercase letter.");
    }
    return errors;
};
const validateUsername = (username) => {
    return username.trim().length >= 3;
}
const handleKeyPress = (event) => {
    if(event.key === "Enter") {
        onSave(inputValue);
        onclose();
    }
}
const handleSave = async () => {
    try {
        //resets error before validation
        setError("");
        const auth = getAuth();
        const user = auth.currentUser;

        //email validation
        if(currentField === "email") {
            if (!validateEmail(value)) {
                setError("Please enter a valid email address.");
                return;
            }
            
            const actionCodeSettings = {
                url: authDomain,
                handleCodeInApp: true,
            };

            //send email verification
            await sendSignInLinkToEmail(auth, value, actionCodeSettings);
            window.localStorage.setItem("emailForUpdate", value);
            
            const userDoc = doc(db, "users", auth.currentUser.uid);
            //update firestore
            await setDoc(userDoc, { email: value }, { merge: true });

            //onSave("A verification email has been sent to your email address. Please verify it in your inbox.");
            onClose();
        } else if (currentField === "password") {
            if(newPassword !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            //new password strength validation
            const passwordErrors = validatePassword(newPassword);
            if (passwordErrors.length > 0) {
                const formattedErrors = "Password must be:\n" + passwordErrors.join("\n");
                setError(formattedErrors);
                return;
                
            }
            try {
                const credential = EmailAuthProvider.credential(user.email, oldPassword);
                await reauthenticateWithCredential(user, credential);
            } catch (err) {
                if (err.code === "auth/wrong-password") {
                    setError("The old password is incorrect.");
                } else if (err.code === "auth/invalid-credential") {
                    setError("The credentials provided are invalid. Please check your old password.");
                } else {
                    setError("An error occurred during reauthentication.");
                }
                return; // Stop execution if reauthentication fails
            }
            //update password
            await updatePassword(user, newPassword);
            //await updatePassword(auth.currentUser, value);
            onSave("Password updated successfully");
            onClose();
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
            //if(err.code ==="auth/operation-not-allowed") {
            //    setError("The new email must be verified before updating.");
            //} else {
                setError(err.message);
            //}
            
        }
};
useEffect(() => {
    const auth = getAuth();
    const storedEmail = window.localStorage.getItem("emailForUpdate");

    if (isSignInWithEmailLink(auth, window.location.href) && storedEmail) {
        signInWithEmailLink(auth, storedEmail, window.location.href)
            .then(() => {
                const user = auth.currentUser;
                return updateEmail(user.currentUser, storedEmail); // Update the email after verification
            })
            .then(() => {
                alert("Email updated successfully.");
                window.localStorage.removeItem("emailForUpdate");
            })
            .catch((error) => {
                console.log("Error updating email:", error.message);
                setError("Failed to update email. Please try again.");
            });
    } else if (!storedEmail) {
        console.error("Email not found in local storage.");
        setError("Failed to update email. Please try again.");
    }
}, []);

return (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3>{title}</h3>
            {currentField === "password" ? (
                <>
            <input 
                type="password" 
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            </>
            ) : (
                <input
                    type={currentField === "email" ? "email" : "text"}
                    placeholder={currentField === "email" ? "Enter new email" : "Enter new username"}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
            )}
            {error && <p style={{ color: "red", whiteSpace: "pre-line" }}>{error}</p>}
            <div className="button-group">
            <button onClick={handleSave}>Save</button>
            <button onClick={onClose}>Cancel</button>
            </div>
            
        </div>
    </div>
    );
};

export default Modal;
