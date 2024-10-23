import React from "react";
import Home from "./components/Home/Home";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingPage from "./components/shared/LoadingPage.js"; // Import the LoadingPage component
import Navbar from "./components/shared/NavBar.js";
import Auth from "./components/shared/Auth";

function App() {
  return (
    <div>
      {/* Pasted Code */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loadingpage" element={<LoadingPage />} />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </Router>

      {/* <Home /> */}
      {/* <RecipeGenerator /> */}
    </div>
  );
}

export default App;
