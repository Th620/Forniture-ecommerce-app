"use client";

import { filter } from "@/constants";
import { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Profile() {
  const [openCountrySelect, setOpenCountrySelect] = useState(false);
  const [openStateSelect, setOpenStateSelect] = useState(false);
  const [openCitySelect, setOpenCitySelect] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn")) {
        setOpenCountrySelect(false);
        setOpenStateSelect(false);
        setOpenCitySelect(false);
      }
    });
  }, []);

  return (
    <main className="flex flex-col justify-start gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14 mt-150 min-h-screen mb-14">
      <h2 className="text-[32px] font-semibold capitalize">profile</h2>
      <div className="grid grid-cols-4 w-full gap-4">
        <button
          type="button"
          className="col-span-4 text-end capitalize underline text-sm font-lato font-medium"
        >
          Log out
        </button>
        <label htmlFor="firstName" className="sr-only">
          First Name:
        </label>
        <input
          type="text"
          name="FirstName"
          id="firstName"
          placeholder="First Name"
          className="h-10 bg-input outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm"
        />
        <label htmlFor="lastName" className="sr-only">
          Last Name:
        </label>
        <input
          type="text"
          name="LastName"
          id="lastName"
          placeholder="Last Name"
          className="h-10 bg-input outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm"
        />
        <label htmlFor="phone" className="sr-only">
          Phone:
        </label>
        <input
          type="tel"
          name="Phone"
          id="phone"
          placeholder="Phone"
          className="h-10 bg-input outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm"
        />
        <label htmlFor="email" className="sr-only">
          Email:
        </label>
        <input
          type="email"
          name="Email"
          id="email"
          placeholder="Email"
          className="h-10 bg-input outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm"
        />
        <div className="col-span-4 md:col-span-2 relative">
          <button
            type="button"
            onClick={() => {
              setOpenCountrySelect((prev) => !prev);
              setOpenStateSelect(false);
              setOpenCitySelect(false);
            }}
            className="flex justify-between h-10 items-center px-4 bg-input text-sm py-1 capitalize font-medium w-full"
          >
            {country ? country : "country"}
            <MdKeyboardArrowDown />
          </button>
          {openCountrySelect && (
            <ul className="absolute top-full z-10 min-w-28 bg-[#EEEFF1] w-full">
              {filter.size.map((size) => (
                <li key={size}>
                  <button
                    type="button"
                    onClick={() => {
                      setCountry(size);
                      setOpenCountrySelect(false);
                    }}
                    className="btn px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                  >
                    {size}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-span-2 md:col-span-1 relative">
          <button
            type="button"
            onClick={() => {
              setOpenStateSelect((prev) => !prev);
              setOpenCountrySelect(false);
              setOpenCitySelect(false);
            }}
            className="flex justify-between h-10 items-center px-4 bg-input text-sm py-1 capitalize font-medium w-full"
          >
            {state ? state : "state"}
            <MdKeyboardArrowDown />
          </button>
          {openStateSelect && (
            <ul className="absolute top-full z-10 min-w-28 bg-[#EEEFF1] w-full">
              {filter.color.map((color) => (
                <li key={color}>
                  {" "}
                  <button
                    type="button"
                    onClick={() => {
                      setState(color);
                      setOpenStateSelect(false);
                    }}
                    className="btn px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                  >
                    {color}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-span-2 md:col-span-1 relative">
          <button
            type="button"
            onClick={() => {
              setOpenCitySelect((prev) => !prev);
              setOpenCountrySelect(false);
              setOpenStateSelect(false);
            }}
            className="flex justify-between h-10 items-center px-4 bg-input text-sm py-1 capitalize font-medium w-full"
          >
            {city ? city : "city"}
            <MdKeyboardArrowDown />
          </button>
          {openCitySelect && (
            <ul className="absolute top-full z-10 min-w-28 bg-[#EEEFF1] w-full">
              {filter.sort.map((sort) => (
                <li key={sort}>
                  <button
                    type="button"
                    onClick={() => {
                      setCity(sort);
                      setOpenCitySelect(false);
                    }}
                    className="btn px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                  >
                    {sort}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <label htmlFor="adress" className="sr-only">
          Full Adress:
        </label>
        <input
          type="text"
          name="adress"
          id="adress"
          placeholder="Full Adress"
          className="h-10 bg-input outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm"
        />
      </div>
      <div className="flex flex-wrap items-start gap-4 w-full">
        <button
          type="button"
          className="capitalize w-full md:w-1/3 lg:w-1/4 xl:w-1/5 pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white"
        >
          Update Profile
        </button>
        <button
          type="button"
          className="capitalize flex justify-center items-center gap-2 transition-all hover:gap-3 duration-500 w-full md:w-1/3 lg:w-1/4 xl:w-1/5 pt-[11px] pb-3 font-medium bg-gray hover:bg-grayHover text-sm text-white"
        >
          My Orders
          <GoArrowRight className="text-lg" />
        </button>
      </div>
    </main>
  );
}
