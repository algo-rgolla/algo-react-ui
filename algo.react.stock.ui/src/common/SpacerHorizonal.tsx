import React from "react";

interface SpacerProps {
  count?: number; // number of spaces, optional with default
  unit?: number; // pixels per space unit, optional with default
}

const SpacerHorizonal: React.FC<SpacerProps> = ({ count = 1, unit = 8 }) => {
  const width = count * unit;
  return <div style={{ width, display: "inline-block" }} />;
};

export default SpacerHorizonal;
