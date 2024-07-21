import React from "react";

const ColorCircle = ({ color, available, selected }) => {
  return (
    <button
      className="relative h-8 w-8 rounded-full"
      style={{ backgroundColor: color }}
    >
      {selected && (
        <div className="absolute w-9 h-9 ring-[#DEE1EC] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ring-2" />
      )}
      {available && (
        <div className="absolute w-10 h-[2px]  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#CA5656] -rotate-45" />
      )}
    </button>
  );
};

export default ColorCircle;
