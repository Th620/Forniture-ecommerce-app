import React from "react";

const SizeButton = ({ label, selected = false, unavailable = false }) => {
  return (
    <button
      type="button"
      className={`py-2 px-6 border-2 border-navy rounded-sm font-semibold text-sm capitalize ${
        selected && !unavailable && "bg-navy text-white"
      } ${unavailable && "text-white cursor-not-allowed bg-navy opacity-60"}`}
    >
      {label}
    </button>
  );
};

export default SizeButton;
