// src/components/Favorites/Favorites.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import Favorites from "./Favorites";

describe("Favorites Component", () => {
  test("renders Favorites heading", () => {
    render(<Favorites />);
    const headingElement = screen.getByText(/Favorites/i);
    expect(headingElement).toBeInTheDocument();
  });

  test("renders a list of favorite items", () => {
    const mockData = [
      { id: 1, name: "French Omelette" },
      { id: 2, name: "Vegan Pancakes" },
    ];

    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(() => [mockData, jest.fn()]);

    render(<Favorites />);
    const firstItem = screen.getByText(/French Omelette/i);
    const secondItem = screen.getByText(/Vegan Pancakes/i);

    expect(firstItem).toBeInTheDocument();
    expect(secondItem).toBeInTheDocument();
  });

  test("renders a message when no favorites are added", () => {
    jest.spyOn(React, "useState").mockImplementationOnce(() => [[], jest.fn()]);

    render(<Favorites />);
    const noFavoritesMessage = screen.getByText(/No favorites added yet/i);
    expect(noFavoritesMessage).toBeInTheDocument();
  });
});
