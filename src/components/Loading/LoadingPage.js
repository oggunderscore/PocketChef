import React from "react";
import LinearDeterminate from "./LoadingBar";

export const LoadingPage = () => {
  const loadingStyle = {
    backgroundColor: "#fef7e8",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  };

  const loadingDivStyle = {
    backgroundColor: "#fef7e8",
    height: "1090px",
    position: "relative",
    width: "800px",
  };

  const screenStyle = {
    height: "1px",
    left: "0",
    position: "absolute",
    top: "0",
    width: "1px",
  };

  const textWrapperStyle = {
    color: "#00161e",
    fontFamily: '"Inter-ExtraBold", Helvetica',
    fontSize: "48px",
    fontWeight: 800,
    left: "76px",
    letterSpacing: "0",
    lineHeight: "normal",
    position: "absolute",
    textAlign: "center",
    top: "445px",
  };

  const loadingBarInstanceStyle = {
    left: "58px",
    position: "absolute",
    top: "541px",
  };

  return (
    <div style={loadingStyle}>
      <div style={loadingDivStyle}>
        <div style={screenStyle}></div>
        <div style={textWrapperStyle}>
          Generating Recipe...
          <LinearDeterminate />
        </div>
        <div style={loadingBarInstanceStyle}></div>
      </div>
    </div>
  );
};
export default LoadingPage;
