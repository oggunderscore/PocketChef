import React from "react";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingPage from "./components/shared/LoadingPage.js"; // Import the LoadingPage component
import Favorites from "./components/Favorites/Favorites.js";
import History from "./components/History/History.js";
import Preferences from "./components/Preferences/Preferences.js";
import Settings from "./components/Settings/Settings.js";
<<<<<<< HEAD
import Auth from "./components/shared/Auth";
import Gpt from "./components/shared/gpt";
=======
import Auth from "./components/Authentication/Authentication.js";
>>>>>>> d626badcbd63f02b520946d61e78a2b78cd62cd0
import SideMenu from "./components/shared/Header.js"; // Import the SideMenu component

function App() {
  return (
    <div>
      <Router>
        {/* <Navbar /> */}
        <SideMenu /> {/* Include the SideMenu component here */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loadingpage" element={<LoadingPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/history" element={<History />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/gpt" element={<Gpt />} />
          {/* Add more routes here if needed */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
