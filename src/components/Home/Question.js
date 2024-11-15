import React, { useState } from "react";
import { Slider } from "@mui/material";
import InformationTooltip from "./Information_Tooltip";

const sliderStyles = {
  height: 8,
  "& .MuiSlider-thumb": {
    width: 20,
    height: 20,
    backgroundColor: "#12263E", // Dark blue for the thumb
  },
  "& .MuiSlider-track": {
    backgroundColor: "#12263E", // Dark blue for the track
    border: 0,
  },
  "& .MuiSlider-rail": {
    backgroundColor: "#C3DBDB", // Light blue for the rail
  },
  "& .MuiSlider-mark": {
    display: "none", // Hides the mark dots
  },
};

// Inline styles in JSX
const questionStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "0px",
};

const questionTextStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px", // Space between text and icon
  fontWeight: "bold",
  color: "#1a1c16",
};

const sliderContainerStyle = {
  paddingTop: "10px",
  minWidth: "250px",
  maxWidth: "500px",
  margin: "auto",
};
function Question({ defaultValue, label, tooltipText, onChange }) {
  const [sliderValue, setSliderValue] = useState(defaultValue);

  const handleSliderChange = (event, value) => {
    setSliderValue(value);
    onChange(Math.round(value)); // Update parent with rounded value
  };

  return (
    <div style={sliderContainerStyle}>
      <p style={questionStyle}>
        <span style={questionTextStyle}>
          {label}
          <InformationTooltip tooltipText={tooltipText} />
        </span>
      </p>
      <Slider
        aria-label={label}
        value={sliderValue}
        min={1}
        max={5}
        step={0.05} // Smaller step for smooth dragging
        marks={[
          { value: 1, label: "Low" },
          { value: 3 },
          { value: 5, label: "High" },
        ]}
        valueLabelDisplay="off"
        sx={sliderStyles}
        onChange={handleSliderChange}
      />
    </div>
  );
}

export default Question;
