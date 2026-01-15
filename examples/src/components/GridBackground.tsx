import React from "react";

interface GridBackgroundProps {
  isVisible: boolean;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({ isVisible }) => {
  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        backgroundImage:
          "linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
  );
};