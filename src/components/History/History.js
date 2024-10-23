// src/components/History/History.js

import React, { useState, useEffect } from "react";
import "./History.css";

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    // Fetch history data from an API or local storage
    const fetchHistory = async () => {
      // Example: Replace with real API call or local storage retrieval
      const data = [
        { id: 1, date: "10/22/2024", name: "French Omelette" },
        { id: 2, date: "10/21/2024", name: "Vegan Pancakes" },
        { id: 3, date: "10/20/2024", name: "Grilled Cheese" },
      ];
      setHistoryItems(data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-container">
      <h2>History</h2>
      {historyItems.length > 0 ? (
        <ul className="history-list">
          {historyItems.map((item) => (
            <li key={item.id} className="history-item">
              <span className="history-date">{item.date}</span>
              <span className="history-name">{item.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No history found.</p>
      )}
    </div>
  );
};

export default History;
