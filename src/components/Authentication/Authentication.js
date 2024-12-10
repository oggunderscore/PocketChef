import React, { useEffect, useState } from "react";
import app from "../../configuration"; // Firebase configuration
import { getDatabase, ref, onValue } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Authentication.css"; // Add new styles for minimalistic design

// Firebase Authentication instance
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
// Function to handle user sign-up
const handleSignUp = (email, password, navigate) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);
      navigate("/");
    })
    .catch((error) => console.error("Error signing up:", error));
};

// Function to handle user sign-in
const handleSignIn = (email, password, navigate) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed in:", userCredential.user);
      navigate("/");
    })
    .catch((error) => console.error("Error signing in:", error));
};

// Function to handle user sign-out
const handleSignOut = (navigate) => {
  signOut(auth)
    .then(() => {
      console.log("User signed out");
      
    })
    .catch((error) => console.error("Error signing out:", error));
};

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const navigate = useNavigate();

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch data from Firebase Realtime Database
  useEffect(() => {
    if (user) {
      const database = getDatabase(app);
      const collectionRef = ref(database, "your_collection");

      const fetchData = () => {
        onValue(collectionRef, (snapshot) => {
          const dataItem = snapshot.val();
          if (dataItem) {
            const displayItem = Object.values(dataItem);
            setData(displayItem);
          }
        });
      };

      fetchData();
    }
  }, [user]);

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    handleSignUp(email, password, navigate);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    handleSignIn(email, password, navigate);
  };

  useEffect(() => {
    const updatedRequirements = validatePasswordRequirements(password);
    setPasswordRequirements(updatedRequirements);
  }, [password]);

  return (
    <div className="auth-container">
      {user ? (
        <div className="auth-content">
          <h1>Welcome, {user.email}</h1>
          <button className="auth-button" onClick={() => handleSignOut(navigate)}>
            Sign Out
          </button>
          <h2>Data from database:</h2>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="auth-content">
          <div className="auth-card">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUpSubmit} className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
              <div className="password-requirements">
                <ul>
                  <li style={{ color: passwordRequirements.minLength ? "green" : "gray" }}>
                    Minimum 8 characters
                  </li>
                  <li style={{ color: passwordRequirements.hasUppercase ? "green" : "gray" }}>
                    At least one uppercase letter
                  </li>
                  <li style={{ color: passwordRequirements.hasLowercase ? "green" : "gray" }}>
                    At least one lowercase letter
                  </li>
                  <li style={{ color: passwordRequirements.hasNumber ? "green" : "gray" }}>
                    At least one number
                  </li>
                  <li style={{ color: passwordRequirements.hasSpecialChar ? "green" : "gray" }}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
