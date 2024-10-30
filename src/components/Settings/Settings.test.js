// src/components/Settings/Settings.test.js

import React from "react";
import { render, screen } from "@testing-library/react";
import Settings from "./Settings";

describe("Settings Component", () => {
  test("renders Settings heading", () => {
    render(<Settings />);
    const headingElement = screen.getByText(/Settings/i);
    expect(headingElement).toBeInTheDocument();
  });

  test("renders User Settings section", () => {
    render(<Settings />);
    const userSettingsHeading = screen.getByText(/User Settings/i);
    expect(userSettingsHeading).toBeInTheDocument();
  });

  test("renders App Settings section", () => {
    render(<Settings />);
    const appSettingsHeading = screen.getByText(/App Settings/i);
    expect(appSettingsHeading).toBeInTheDocument();
  });

  test("renders Resources section", () => {
    render(<Settings />);
    const resourcesHeading = screen.getByText(/Resources/i);
    expect(resourcesHeading).toBeInTheDocument();
  });

  test("renders all list items", () => {
    render(<Settings />);
    const username = screen.getByText(/Username/i);
    const updateEmail = screen.getByText(/Update Email/i);
    const darkMode = screen.getByText(/Dark Mode/i);
    const contactUs = screen.getByText(/Contact Us/i);

    expect(username).toBeInTheDocument();
    expect(updateEmail).toBeInTheDocument();
    expect(darkMode).toBeInTheDocument();
    expect(contactUs).toBeInTheDocument();
  });
});
