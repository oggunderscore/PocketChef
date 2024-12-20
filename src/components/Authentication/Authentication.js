import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Toastify styles
import app from "../../configuration"; // Firebase configuration
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";

const auth = getAuth(app);

const validatePasswordRequirements = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
  };
  return requirements;
};

const Auth = () => {
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [user, setUser] = useState(null);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        toast.success(`Welcome back, ${currentUser.email}!`, {
          position: "top-right",
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const updatedRequirements = validatePasswordRequirements(signUpPassword);
    setPasswordRequirements(updatedRequirements);
  }, [signUpPassword]);

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      .then(() => {
        toast.success("Account created successfully!", {
          position: "top-right",
        });
        navigate("/");
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`, { position: "top-right" });
      });
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, signInEmail, signInPassword)
      .then((userCredential) => {
        toast.success(`Welcome, ${userCredential.user.email}!`, {
          position: "top-right",
        });
        navigate("/");
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`, { position: "top-right" });
      });
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      {user ? (
        <div className="auth-content">
          <h1>Welcome, {user.email}</h1>
        </div>
      ) : (
        <div className="auth-content">
          <div className="auth-card">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUpSubmit} className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                className="auth-input"
              />
              <div className="password-requirements">
                <ul>
                  <li
                    style={{
                      color: passwordRequirements.minLength ? "green" : "gray",
                    }}
                  >
                    Minimum 8 characters
                  </li>
                  <li
                    style={{
                      color: passwordRequirements.hasUppercase
                        ? "green"
                        : "gray",
                    }}
                  >
                    At least one uppercase letter
                  </li>
                  <li
                    style={{
                      color: passwordRequirements.hasLowercase
                        ? "green"
                        : "gray",
                    }}
                  >
                    At least one lowercase letter
                  </li>
                  <li
                    style={{
                      color: passwordRequirements.hasNumber ? "green" : "gray",
                    }}
                  >
                    At least one number
                  </li>
                  <li
                    style={{
                      color: passwordRequirements.hasSpecialChar
                        ? "green"
                        : "gray",
                    }}
                  >
                    At least one special character
                  </li>
                </ul>
              </div>
              <button type="submit" className="auth-button">
                Sign Up
              </button>
            </form>
          </div>

          <div className="auth-card">
            <h2>Sign In</h2>
            <form onSubmit={handleSignInSubmit} className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="auth-input"
              />
              <button type="submit" className="auth-button">
                Sign In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
