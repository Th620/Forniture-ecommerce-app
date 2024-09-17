"use client";

import { addCountry, editCountry } from "@/services/countries";
import { useEffect, useRef } from "react";
import { MdErrorOutline } from "react-icons/md";

const CountryPopUp = ({
  label,
  setOpenCountryPopUp,
  country,
  setCountry,
  setIsLoading,
  setError,
  error,
  countryId,
}) => {
  const inputRef = useRef();

  const handelEditCountries = async ({ id, country }) => {
    try {
      setIsLoading(true);
      const data = await editCountry({ id, country });
      setIsLoading(false);
      setOpenCountryPopUp(false);
    } catch (error) {
      setIsLoading(false);
      setError({ handlers: true, Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  const handelAddCountry = async ({ country }) => {
    try {
      setIsLoading(true);
      await addCountry({ country });
      setIsLoading(false);
      setOpenCountryPopUp(false);
    } catch (error) {
      setIsLoading(false);
      setError({ handlers: true, Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div
      className={`fixed z-20 bg-[#282828b1] top-0 left-0 flex items-center justify-center font-montserrat w-full h-screen pt-[60px] md:pl-[20%]`}
    >
      <div
        className={`dark:bg-darkBg  w-3/4 md:w-1/3 rounded-sm bg-white flex flex-col justify-center px-8 py-6`}
      >
        <label htmlFor={"country"} className="mb-2">
          Country name:
        </label>
        {error?.handlers && (
          <div className="w-full bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
            <MdErrorOutline className="size-4" />
            {error?.Error}
          </div>
        )}
        <input
          type={"text"}
          name={"country"}
          id={"country"}
          ref={inputRef}
          value={country}
          placeholder={"Add country name here..."}
          onChange={(e) => {
            setCountry(e.target.value);
          }}
          className={`mt-2 h-10 bg-white dark:bg-darkBody outline-none text-sm font-medium placeholder:text-gray  placeholder:dark:text-opacity-40 placeholder:text-sm px-4 rounded-sm
        }`}
        />
        <div className="flex items-center justify-start gap-4 my-4">
          <button
            type="button"
            onClick={async () => {
              if (label.toLowerCase() === "edit country") {
                await handelEditCountries({ id: countryId, country });
              } else {
                await handelAddCountry({ country });
              }
            }}
            className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-yellow px-4 h-10 rounded-md text-white cursor-pointer w-fit"
          >
            {label}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenCountryPopUp(false);
            }}
            className="flex justify-center items-center gap-2 capitalize text-sm font-medium px-4 h-10 rounded-md dark:text-white text-black cursor-pointer w-fit"
          >
            cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryPopUp;