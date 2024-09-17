"use client";

import React, { useEffect, useState } from "react";
import SimpleInput from "./simpleInput";
import { MdOutlineAdd } from "react-icons/md";

const removeItem = (value, group, setGroup) => {
  const array = group.filter((item) => {
    return item !== value;
  });
  setGroup(array);
};

const AddItemInput = ({
  className,
  label,
  errorItem,
  type,
  value,
  handleChange,
  placeholder,
  inputClassName,
  group,
  error,
  setGroup,
  setValue,
  setError,
  ulClassName,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className={`${className} flex rounded-sm w-full `}>
        <SimpleInput
          type={type}
          label={label}
          value={value}
          error={error}
          handleChange={handleChange}
          className={`w-full ${
            error[label]
              ? "border-red-400"
              : "dark:bg-darkBg border-gray border-opacity-30 dark:border-opacity-5"
          } border  placeholder:dark:text-opacity-40`}
          placeholder={placeholder}
          errorMessage={false}
        />

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (!group.includes(value.toLowerCase())) {
              if (value !== "") {
                setGroup([...group, value.trim().toLowerCase()]);
                setValue("");
                return;
              }
              setValue("");
              var err = {};
              err[label] = true;
              err.Error = `You can't add an empty ${errorItem}`;
              setError(err);
              setTimeout(() => setError({}), 4000);
              return;
            }
            setValue("");
            err = {};
            err[label] = true;
            err.Error = `You already add this ${errorItem}`;
            setError(err);

            setTimeout(() => setError({}), 4000);
          }}
          className="bg-yellow h-10 aspect-square flex justify-center items-center rounded-sm text-white text-lg"
        >
          <MdOutlineAdd />
        </button>
      </div>

      {error && error[label] && (
        <p className="text-red-400 text-[10px] mt-[2px] col-span-2">
          {error.Error}
        </p>
      )}

      {group && (
        <ul
          className={`${ulClassName} text-sm font-medium px-6 list-disc capitalize`}
        >
          {group.map((item) => (
            <li className="">
              {item}{" "}
              <button
                className="inline ml-1"
                type="button"
                onClick={() => removeItem(item, group, setGroup)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddItemInput;
