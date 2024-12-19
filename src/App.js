import React from "react";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingPage from "./components/shared/LoadingPage.js";
import Favorites from "./components/Favorites/Favorites.js";
import History from "./components/History/History.js";
import Settings from "./components/Settings/Settings.js";
import Gpt from "./components/RecipeGenerator/RecipeGenerator.js";
import Auth from "./components/Authentication/Authentication.js";
import RecipePage from "./components/Recipe/Recipe.js";
import SideMenu from "./components/shared/Header.js";

function App() {
  return (
    <div>
      <Router>
        <SideMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loadingpage" element={<LoadingPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/gpt" element={<Gpt />} />
          <Route path="/recipe/:recipeId" element={<RecipePage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
