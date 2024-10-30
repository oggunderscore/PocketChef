// src/components/Home/Home.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";

describe("Home Component", () => {
  test("renders Home heading", () => {
    render(<Home />);
    const headingElement = screen.getByText(/Let’s set your preferences/i);
    expect(headingElement).toBeInTheDocument();
  });

  test("renders slider labels", () => {
    render(<Home />);
    const budgetLabel = screen.getByText(/What’s your budget/i);
    const complexityLabel = screen.getByText(/Cooking Complexity/i);
    const timeLabel = screen.getByText(/Time Spent Cooking/i);

    expect(budgetLabel).toBeInTheDocument();
    expect(complexityLabel).toBeInTheDocument();
    expect(timeLabel).toBeInTheDocument();
  });

  test("renders ingredients", () => {
    render(<Home />);
    const ingredient = screen.getByText(/Cheese/i);
    expect(ingredient).toBeInTheDocument();
  });

  test("removes ingredient on click", () => {
    render(<Home />);
    const removeButton = screen.getAllByText("x")[0];
    fireEvent.click(removeButton);
    const removedIngredient = screen.queryByText(/Cheese/i);
    expect(removedIngredient).not.toBeInTheDocument();
  });

  test("displays the Generate button", () => {
    render(<Home />);
    const generateButton = screen.getByText(/Generate/i);
    expect(generateButton).toBeInTheDocument();
  });
});
