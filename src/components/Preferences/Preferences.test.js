// src/components/Preferences/Preferences.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Preferences from "./Preferences";

describe("Preferences Component", () => {
  test("renders Preferences heading", () => {
    render(<Preferences />);
    const headingElement = screen.getByText(/Preferences/i);
    expect(headingElement).toBeInTheDocument();
  });

  test("renders Restrictions section", () => {
    render(<Preferences />);
    const restrictionsHeading = screen.getByText(/Restrictions:/i);
    expect(restrictionsHeading).toBeInTheDocument();
  });

  test("renders Preferred Cuisines section", () => {
    render(<Preferences />);
    const cuisinesHeading = screen.getByText(/Preferred Cuisines:/i);
    expect(cuisinesHeading).toBeInTheDocument();
  });

  test("removes an item from restrictions on click", () => {
    render(<Preferences />);
    const removeButton = screen.getAllByText("x")[0];
    fireEvent.click(removeButton);
    const removedItem = screen.queryByText(/Cheese/i);
    expect(removedItem).not.toBeInTheDocument();
  });

  test("renders Clear All button", () => {
    render(<Preferences />);
    const clearButton = screen.getAllByText(/Clear All/i)[0];
    expect(clearButton).toBeInTheDocument();
  });
});
