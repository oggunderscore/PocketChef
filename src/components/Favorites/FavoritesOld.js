import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./Favorites.css";
import ArrowForwardIosRounded from "@mui/icons-material/ArrowForwardIosRounded";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
import { Menu, MenuItem } from "@mui/material";
import retrieveRecipe from "../Hooks/RetrieveRecipe";

const Favorites = () => {
  const [folders, setFolders] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      const data = [
        {
          id: "1",
          name: "Vegetarian",
          recipes: [
            { id: "r1", name: "Potato Salad" },
            { id: "r2", name: "Roasted Asparagus" },
          ],
        },
        {
          id: "2",
          name: "Keto",
          recipes: [
            { id: "r3", name: "Keto Pancakes" },
            { id: "r4", name: "Grilled Salmon" },
            { id: "r5", name: "Avocado Salad" },
          ],
        },
        {
          id: "3",
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
        { id: Date.now().toString(), name: newFolderName, recipes: [] },
      ]);
      setNewFolderName("");
    }
  };

  const handleMenuClick = (event, folderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedFolder(folderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFolder(null);
  };

  const renameFolder = () => {
    const newName = prompt(
      "Enter new folder name:",
      folders.find((folder) => folder.id === selectedFolder)?.name
    );
    if (newName) {
      setFolders(
        folders.map((folder) =>
          folder.id === selectedFolder ? { ...folder, name: newName } : folder
        )
      );
    }
    handleMenuClose();
  };

  const deleteFolder = () => {
    setFolders(folders.filter((folder) => folder.id !== selectedFolder));
    handleMenuClose();
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedFolders = Array.from(folders);
    const [removed] = reorderedFolders.splice(result.source.index, 1);
    reorderedFolders.splice(result.destination.index, 0, removed);

    setFolders(reorderedFolders);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="favorites-container">
        <h2 className="favorites-title">Favorites</h2>
        <div
          className="search-container"
          onMouseDown={(e) => {
            if (!e.target.closest(".search-dropdown")) {
              setIsSearchFocused(false);
            }
          }}
        >
          <input
            type="text"
            placeholder="Search Favorites"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {filteredRecipes.length > 0 && isSearchFocused && (
            <ul
              className="search-dropdown"
              onMouseDown={(e) => e.preventDefault()}
            >
              {filteredRecipes.map((recipe) => (
                <li
                  key={recipe.id}
                  className="search-item"
                  onClick={() => retrieveRecipe(recipe.id)}
                >
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
        <Droppable droppableId="droppable-folders">
          {(provided) => (
            <ul
              className="favorites-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {folders.map((folder, index) => (
                <Draggable
                  key={folder.id}
                  draggableId={folder.id}
                  index={index}
                >
                  {(provided) => (
                    <li
                      className="favorites-folder"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => toggleFolder(folder.id)}
                    >
                      <div className="folder-header">
                        <MoreVertTwoToneIcon
                          className="more-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuClick(e, folder.id);
                          }}
                        />
                        <ArrowForwardIosRounded
                          className={`folder-icon ${
                            expandedFolders.includes(folder.id)
                              ? "expanded"
                              : ""
                          }`}
                        />
                        <span className="folder-name">{folder.name}</span>
                      </div>
                      <div
                        className={`folder-recipes ${
                          expandedFolders.includes(folder.id) ? "expanded" : ""
                        }`}
                      >
                        <ul className="favorites-recipe-list">
                          {folder.recipes.map((recipe) => (
                            <li
                              key={recipe.id}
                              className="favorites-recipe-item"
                            >
                              <button
                                className="favorites-recipe-button"
                                onClick={() => retrieveRecipe(recipe.id)}
                              >
                                {recipe.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={renameFolder}>Rename</MenuItem>
          <MenuItem onClick={deleteFolder}>Delete</MenuItem>
        </Menu>
      </div>
    </DragDropContext>
  );
};

export default Favorites;
