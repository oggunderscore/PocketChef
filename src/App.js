import React, { useEffect, useState } from "react";
import app from "./configuration"; // Firebase configuration
import { getDatabase, ref, onValue } from "firebase/database";
import RecipeGenerator from "./components/Recipe/RecipeGenerator.js";
import Home from "./components/Home/Home";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingPage from "./components/Loading/LoadingPage.js"; // Import the LoadingPage component
import Navbar from "./components/NavBar.js";

// Firebase Authentication instance
const auth = getAuth(app);

// Function to handle user sign-up
const handleSignUp = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);
    })
    .catch((error) => console.error("Error signing up:", error));
};

// Function to handle user sign-in
const handleSignIn = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed in:", userCredential.user);
    })
    .catch((error) => console.error("Error signing in:", error));
};

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
    handleSignUp(email, password);
  };

  const handleSignInSubmit = (e) => {
    e.preventDefault();
    handleSignIn(email, password);
  };

  return (
    <div>
      {/* Pasted Code */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loadingpage" element={<LoadingPage />} />
          <Route path="/recipegenerator" element={<RecipeGenerator />} />
        </Routes>
      </Router>

      <Home />
      <RecipeGenerator />
      {user ? (
        <div>
          <h1>Welcome, {user.email}</h1>
          <h2>Data from database:</h2>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUpSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email} // Email uses email state
              onChange={(e) => setEmail(e.target.value)} // Updates email state
            />
            <input
              type="password"
              placeholder="Password"
              value={password} // Password uses password state
              onChange={(e) => setPassword(e.target.value)} // Updates password state
            />
            <button type="submit">Sign Up</button>
          </form>

          <h2>Sign In</h2>
          <form onSubmit={handleSignInSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
