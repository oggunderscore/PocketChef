import React, { useState, useEffect } from "react";
import "./History.css";
import SearchIcon from "@mui/icons-material/Search";
import retrieveRecipe from "../Hooks/RetrieveRecipe";

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [expandedDates, setExpandedDates] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  useEffect(() => {
    // Fetch history data from an API or local storage
    const fetchHistory = async () => {
      // Example data to demonstrate expanded details
      const data = [
        {
          id: 1,
          date: "11/13/2024",
          recipes: [
            { id: "r1", name: "Potato Salad" },
            { id: "r2", name: "Roasted Asparagus" },
            { id: "r3", name: "Squash Soup" },
            { id: "r4", name: "Egg Salad" },
          ],
        },
        {
          id: 2,
          date: "11/12/2024",
          recipes: [
            { id: "r5", name: "French Omelette" },
            { id: "r6", name: "Breakfast Burrito" },
            { id: "r7", name: "Vegetable Stir Fry" },
          ],
        },
        {
          id: 3,
          date: "11/11/2024",
          recipes: [
            { id: "r8", name: "Pasta Carbonara" },
            { id: "r9", name: "Chicken Curry" },
            { id: "r10", name: "Beef Stroganoff" },
          ],
        },
      ];
      setHistoryItems(data);
    };

    fetchHistory();
  }, []);

  useEffect(() => {
    // Filter recipes based on the search query
    if (searchQuery) {
      const allRecipes = historyItems.flatMap((item) => item.recipes);
      const filtered = allRecipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRecipes(filtered);
    } else {
      setFilteredRecipes([]);
    }
  }, [searchQuery, historyItems]);

  const toggleExpanded = (date) => {
    if (expandedDates.includes(date)) {
      setExpandedDates(expandedDates.filter((d) => d !== date));
    } else {
      setExpandedDates([...expandedDates, date]);
    }
  };

  return (
    <div className="history-container">
      <h2 className="history-title">History</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search History"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="search-icon" />
        {filteredRecipes.length > 0 && (
          <ul className="search-dropdown">
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

      <ul className="history-list">
        {historyItems.length > 0 ? (
          historyItems.map((item) => (
            <li key={item.id} className="history-item">
              <div
                className="history-header"
                onClick={() => toggleExpanded(item.date)}
              >
                <span className="history-date">{item.date}</span>
                <button
                  className={`expand-button ${
                    expandedDates.includes(item.date) ? "expanded" : ""
                  }`}
                >
                  {expandedDates.includes(item.date) ? "−" : "+"}
                </button>
              </div>
              <div
                className={`recipe-container ${
                  expandedDates.includes(item.date) ? "expanded" : ""
                }`}
              >
                <ul className="recipe-list">
                  {item.recipes.map((recipe) => (
                    <li key={recipe.id} className="recipe-item">
                      <button
                        className="recipe-button"
                        onClick={() => retrieveRecipe(recipe.id)}
                      >
                        {recipe.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))
        ) : (
          <p>No history found.</p>
        )}
      </ul>
    </div>
  );
};

export default History;
