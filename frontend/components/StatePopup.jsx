"use client";

import {
  addCountry,
  addState,
  editCountry,
  editState,
} from "@/services/countries";
import { useEffect, useRef } from "react";
import { MdErrorOutline } from "react-icons/md";

const StatePopUp = ({
  label,
  setOpenStatePopUp,
  state,
  setState,
  shippingFees,
  setShippingFees,
  setIsLoading,
  setError,
  error,
  stateId,
  countryId,
}) => {
  const inputRef = useRef();

  const handelEditState = async ({ id, state, shippingFees }) => {
    try {
      setIsLoading(true);
      if (!state) {
        setError({
          state: true,
          Error: "state is required",
        });
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      if (
        typeof parseFloat(shippingFees) !== "number" ||
        parseFloat(shippingFees) < 0
      ) {
        setError({
          shippingFees: true,
          Error: "shipping fees muse be a number greater or equal to 0",
        });
        setTimeout(() => {
          setError(null);
        }, 3000);
        return;
      }
      await editState({ id, state, shippingFees });
      setIsLoading(false);
      setOpenStatePopUp(false);
    } catch (error) {
      setIsLoading(false);
      setError({ handlers: true, Error: error?.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  const handelAddState = async ({ countryId, state, shippingFees }) => {
    try {
      setIsLoading(true);
      if (!state) {
        setError({
          state: true,
          Error: "state is required",
        }); setTimeout(() => {
            setError(null);
          }, 3000);
        return;
      }
      if (
        typeof parseFloat(shippingFees) !== "number" ||
        parseFloat(shippingFees) < 0
      ) {
        setError({
          shippingFees: true,
          Error: "shipping fees muse be a number greater or equal to 0",
        }); setTimeout(() => {
            setError(null);
          }, 3000);
        return;
      }
      await addState({ countryId, state, shippingFees });
      setIsLoading(false);
      setOpenStatePopUp(false);
    } catch (error) {
      setIsLoading(false);
      setError({ handlers: true, Error: error?.message });
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
          State name:
        </label>

        <input
          type={"text"}
          name={"state"}
          id={"state"}
          ref={inputRef}
          value={state}
          placeholder={"Add state name here..."}
          onChange={(e) => {
            setState(e.target.value);
          }}
          className={`${
            error?.state
              ? "border-red-400"
              : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
          } border mt-2 h-10 bg-white dark:bg-darkBody outline-none text-sm font-medium placeholder:text-gray  placeholder:dark:text-opacity-40 placeholder:text-sm px-4 rounded-sm
        }`}
        />
        {error?.state && (
          <p className="text-red-400 text-[10px] mt-1 pl-1 capitalize col-span-2">
            {error?.Error}
          </p>
        )}
        <label htmlFor={"country"} className="mb-2 mt-4">
          Shipping fees:
        </label>

        <input
          type={"number"}
          name={"shippingFees"}
          id={"shippingFees"}
          value={shippingFees}
          placeholder={"Add shipping fees name here..."}
          onChange={(e) => {
            setShippingFees(e.target.value);
          }}
          className={`${
            error?.shippingFees
              ? "border-red-400"
              : "dark:bg-darkBg placeholder:dark:text-opacity-40 border-gray border-opacity-30 dark:border-opacity-5"
          } border mt-2 h-10 bg-white dark:bg-darkBody outline-none text-sm font-medium placeholder:text-gray  placeholder:dark:text-opacity-40 placeholder:text-sm px-4 rounded-sm
        }`}
        />
        {error?.shippingFees && (
          <p className="text-red-400 text-[10px] mt-1 pl-1 capitalize col-span-2">
            {error?.Error}
          </p>
        )}
        {error?.handlers && (
          <div className="w-full mt-4 bg-red-200 dark:bg-opacity-30 dark:bg-red-900 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
            <MdErrorOutline className="size-4" />
            {error?.Error}
          </div>
        )}
        <div className="flex items-center justify-start gap-4 my-4">
          <button
            type="button"
            onClick={async () => {
              if (label.toLowerCase() === "edit state") {
                await handelEditState({ id: stateId, state, shippingFees });
              } else {
                await handelAddState({ countryId, state, shippingFees });
              }
            }}
            className="flex justify-center items-center gap-2 capitalize text-sm font-medium bg-yellow px-4 h-10 rounded-md text-white cursor-pointer w-fit"
          >
            {label}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenStatePopUp(false);
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

export default StatePopUp;
