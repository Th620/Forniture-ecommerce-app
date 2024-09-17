import React from "react";

const SimpleInput = ({
  label,
  type,
  value,
  placeholder,
  className,
  handleChange,
  errorMessage,
  error,
}) => {

  return (
    <>
      <label htmlFor={label} className="sr-only">
        {label}:
      </label>
      <input
        type={type}
        name={label}
        id={label}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        className={`${className} h-10 bg-white dark:bg-darkBg outline-none text-sm font-medium placeholder:text-gray  placeholder:dark:text-opacity-40 placeholder:text-sm px-4 rounded-sm
        }`}
      />
    </>
  );
};

export default SimpleInput;
