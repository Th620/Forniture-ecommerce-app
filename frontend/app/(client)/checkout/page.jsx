"use client";

import PricingBox from "@/components/PricingBox";
import { getProfile } from "@/services/user";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector } from "react-redux";

export default function Checkout() {
  const [openCountrySelect, setOpenCountrySelect] = useState(false);
  const [openStateSelect, setOpenStateSelect] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [adress, setAdress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn")) {
        setOpenCountrySelect(false);
        setOpenStateSelect(false);
      }
    });
  }, []);
  const getProfileData = async () => {
    try {
      const data = await getProfile();
      if (data) {
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        data.city && setCity(data.city);
        data.country && setCountry(data.country);
        data.state && setState(data.state);
        data.adress && setAdress(data.adress);
        data.phone && setPhone(data.phone);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const err = JSON.parse(error.message);
      if (err.status === 401) {
        setError("Unauthorized");
        setTimeout(() => {
          router.push("/account/sign-in");
        }, 2000);
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    return async () => {
      await getProfileData();
    };
  }, []);

  return (
    <main className="flex flex-col justify-start gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14 mt-150 min-h-screen mb-14">
      <h2 className="text-[32px] font-semibold capitalize">checkout</h2>
      <div className="flex flex-col justify-center md:flex-row gap-x-4 gap-y-14">
        <div className="grid grid-cols-4 w-full gap-4 h-fit">
          <label htmlFor="firstName" className="sr-only">
            First Name:
          </label>
          <input
            type="text"
            name="FirstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-10 bg-input outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm"
          />
          <div className="col-span-2 relative">
            <button
              type="button"
              onClick={() => {
                setOpenCountrySelect((prev) => !prev);
                setOpenStateSelect(false);
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
          <div className="col-span-2 relative">
            <button
              type="button"
              onClick={() => {
                setOpenStateSelect((prev) => !prev);
                setOpenCountrySelect(false);
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

          <label htmlFor="adress" className="sr-only">
            Full Adress:
          </label>
          <input
            type="text"
            name="adress"
            id="adress"
            value={adress}
            onChange={(e) => setAdress(e.target.value)}
            placeholder="Full Adress"
            className="h-10 bg-input outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm"
          />
          <button
            type="button"
            className="capitalize col-span-4 w-full md:w-1/3 lg:w-1/4 xl:w-1/5 pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white"
          >
            Update Profile
          </button>
        </div>
        <div className="">
          <PricingBox btnLabel={"place order"} subtotal={cart?.totalPrice} />
        </div>
      </div>
    </main>
  );
}
