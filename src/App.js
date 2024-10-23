import React from "react";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingPage from "./components/shared/LoadingPage.js"; // Import the LoadingPage component
import Navbar from "./components/shared/NavBar.js";
import Auth from "./components/shared/Auth";
import SideMenu from "./components/shared/Header.js"; // Import the SideMenu component

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <SideMenu /> {/* Include the SideMenu component here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loadingpage" element={<LoadingPage />} />
          <Route path="/login" element={<Auth />} />
          {/* Add more routes here if needed */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
