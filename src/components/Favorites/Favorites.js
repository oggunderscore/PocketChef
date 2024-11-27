import React, { useState, useEffect } from "react";
import "./Favorites.css";

const Favorites = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");

  useEffect(() => {
    // Fetch folder data from an API or local storage
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
        { id: 2, name: "Keto", recipes: [] },
        { id: 3, name: "Vegan", recipes: [] },
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

  const moveRecipe = (recipeId, sourceFolderId, targetFolderId) => {
    const sourceFolder = folders.find((folder) => folder.id === sourceFolderId);
    const targetFolder = folders.find((folder) => folder.id === targetFolderId);
    if (sourceFolder && targetFolder) {
      const recipeToMove = sourceFolder.recipes.find(
        (recipe) => recipe.id === recipeId
      );
      if (recipeToMove) {
        setFolders(
          folders.map((folder) => {
            if (folder.id === sourceFolderId) {
              return {
                ...folder,
                recipes: folder.recipes.filter(
                  (recipe) => recipe.id !== recipeId
                ),
              };
            }
            if (folder.id === targetFolderId) {
              return { ...folder, recipes: [...folder.recipes, recipeToMove] };
            }
            return folder;
          })
        );
      }
    }
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
              <span>{folder.name}</span>
              <div className="folder-actions">
                <button onClick={() => toggleFolder(folder.id)}>
                  {expandedFolders.includes(folder.id) ? "−" : "+"}
                </button>
                <button
                  onClick={() =>
                    renameFolder(
                      folder.id,
                      prompt("Enter new folder name:", folder.name)
                    )
                  }
                >
                  Rename
                </button>
                <button onClick={() => deleteFolder(folder.id)}>Delete</button>
              </div>
            </div>
            {expandedFolders.includes(folder.id) && (
              <ul className="folder-recipes">
                {folder.recipes.map((recipe) => (
                  <li key={recipe.id}>
                    <span>{recipe.name}</span>
                    <select
                      onChange={(e) =>
                        moveRecipe(
                          recipe.id,
                          folder.id,
                          parseInt(e.target.value)
                        )
                      }
                    >
                      <option value="">Move to...</option>
                      {folders
                        .filter((f) => f.id !== folder.id)
                        .map((targetFolder) => (
                          <option key={targetFolder.id} value={targetFolder.id}>
                            {targetFolder.name}
                          </option>
                        ))}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
