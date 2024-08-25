import React from "react";

const SizeButton = ({ label, selected, unavailable, onclick }) => {
  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={onclick}
      className={`py-2 px-6 border-2 border-navy rounded-sm font-semibold text-sm capitalize ${
        selected
          ? "bg-navy text-white disabled:text-white disabled:cursor-not-allowed disabled:bg-navy disabled:opacity-50"
          : "bg-white text-navy disabled:text-white disabled:cursor-not-allowed disabled:bg-navy disabled:opacity-50"
      }
      `}
    >
      {label}
    </button>
  );
};

export default SizeButton;
