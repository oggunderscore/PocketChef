import React, { useState, useEffect } from "react";
import "./Favorites.css";
import ArrowForwardIosRounded from "@mui/icons-material/ArrowForwardIosRounded"; // Import Material UI ArrowForward icon

const Favorites = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    const fetchFolders = async () => {
      const data = [
        {
          id: 1,
          name: "Vegetarian",
          recipes: [
            { id: "r1", name: "Potato Salad" },
            { id: "r2", name: "Roasted Asparagus" },
          ],
        },
        {
          id: 2,
          name: "Keto",
          recipes: [
            { id: "r3", name: "Keto Pancakes" },
            { id: "r4", name: "Grilled Salmon" },
            { id: "r5", name: "Avocado Salad" },
          ],
        },
        {
          id: 3,
          name: "Vegan",
          recipes: [
            { id: "r6", name: "Vegan Burger" },
            { id: "r7", name: "Quinoa Salad" },
            { id: "r8", name: "Vegan Brownies" },
          ],
        },
      ];
      setFolders(data);
    };

    fetchFolders();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const allRecipes = folders.flatMap((folder) => folder.recipes);
      const filtered = allRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes([]);
    }
  }, [searchQuery, folders]);

  const toggleFolder = (folderId) => {
    if (expandedFolders.includes(folderId)) {
      setExpandedFolders(expandedFolders.filter((id) => id !== folderId));
    } else {
      setExpandedFolders([...expandedFolders, folderId]);
    }
  };

  const createFolder = () => {
    if (newFolderName.trim()) {
      setFolders([
        ...folders,
        { id: Date.now(), name: newFolderName, recipes: [] },
      ]);
      setNewFolderName("");
    }
  };

  const renameFolder = (folderId, newName) => {
    setFolders(
      folders.map((folder) =>
        folder.id === folderId ? { ...folder, name: newName } : folder
      )
    );
  };

  const deleteFolder = (folderId) => {
    setFolders(folders.filter((folder) => folder.id !== folderId));
  };

  return (
    <div className="favorites-container">
      <h2 className="favorites-title">Favorites</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Favorites"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {filteredRecipes.length > 0 && (
          <ul className="search-dropdown">
            {filteredRecipes.map((recipe) => (
              <li key={recipe.id} className="search-item">
                {recipe.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="create-folder-container">
        <input
          type="text"
          placeholder="New Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button onClick={createFolder}>Create Folder</button>
      </div>
      <ul className="favorites-list">
        {folders.map((folder) => (
          <li key={folder.id} className="favorites-folder">
            <div className="folder-header">
              <div
                className="folder-left"
                onClick={() => toggleFolder(folder.id)}
              >
                <ArrowForwardIosRounded
                  className={`folder-icon ${
                    expandedFolders.includes(folder.id) ? "expanded" : ""
                  }`}
                />
                <span className="folder-name">{folder.name}</span>
              </div>
              <div className="folder-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent toggle on button click
                    const newName = prompt(
                      "Enter new folder name:",
                      folder.name
                    );
                    if (newName) renameFolder(folder.id, newName);
                  }}
                >
                  Rename
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent toggle on button click
                    deleteFolder(folder.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
            <div
              className={`folder-recipes ${
                expandedFolders.includes(folder.id) ? "expanded" : ""
              }`}
            >
              <ul className="recipe-list">
                {folder.recipes.map((recipe) => (
                  <li key={recipe.id} className="recipe-item">
                    {recipe.name}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
