// src/components/History/History.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import History from "./History";

describe("History Component", () => {
  test("renders History heading", () => {
    render(<History />);
    const headingElement = screen.getByText(/History/i);
    expect(headingElement).toBeInTheDocument();
  });

  test("renders a list of history items", () => {
    const mockData = [
      { id: 1, date: "10/22/2024", name: "French Omelette" },
      { id: 2, date: "10/21/2024", name: "Vegan Pancakes" },
    ];

    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [mockData, jest.fn()]);

    render(<History />);
    const firstItem = screen.getByText(/French Omelette/i);
    const secondItem = screen.getByText(/Vegan Pancakes/i);

    expect(firstItem).toBeInTheDocument();
    expect(secondItem).toBeInTheDocument();
  });

  test("renders a message when no history is found", () => {
    jest.spyOn(React, "useState").mockImplementationOnce(() => [[], jest.fn()]);

    render(<History />);
    const noHistoryMessage = screen.getByText(/No history found/i);
    expect(noHistoryMessage).toBeInTheDocument();
  });
});
