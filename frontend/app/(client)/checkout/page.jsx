"use client";

import PricingBox from "@/components/PricingBox";
import { clearCart } from "@/lib/features/cart/cartSlice";
import { setUserInfo } from "@/lib/features/user/userSlice";
import { getCountries } from "@/services/countries";
import { getCartTotalPrice, newOrder } from "@/services/order";
import { getProfile, updateProfile } from "@/services/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdErrorOutline,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdOutlineErrorOutline,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { isMobilePhone } from "validator";
import isEmail from "validator/lib/isEmail";

export default function Checkout() {
  const [openCountrySelect, setOpenCountrySelect] = useState(false);
  const [openStateSelect, setOpenStateSelect] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [checked, setChecked] = useState(true);
  const [countries, setCountries] = useState([]);
  const [order, setOrder] = useState(null);
  const [phoneExist, setPhoneExist] = useState(false);
  const [totalPrice, setTotalPrice] = useState(null);

  const cart = useSelector((state) => state.cart);

  const router = useRouter();

  const dispatch = useDispatch();

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
        setFirstName(data?.firstName);
        setLastName(data?.lastName);
        setEmail(data?.email);
        data?.city && setCity(data.city);
        data?.country && setCountry(data.country);
        data?.state && setState(data.state);
        data?.address && setAddress(data.address);
        data?.phone && setPhone(data.phone);
        data?.phone && setPhoneExist(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      const err = JSON.parse(error.message);
      if (err.status === 401) {
        setError({ Error: "Unauthorized" });
        setTimeout(() => {
          router.push("/account/sign-in", { scroll: true});
        }, 2000);
      } else {
        setError({ Error: err.message });
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    }
  };

  const handleupdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!firstName) {
      setError({ firstName: true, Error: "First name is required" });
      setTimeout(() => {
        setError(null);
      }, 3000);
      setIsLoading(false);
      return;
    }
    if (!lastName) {
      setError({ lastName: true, Error: "Last name is required" });
      setTimeout(() => {
        setError(null);
      }, 3000);
      setIsLoading(false);
      return;
    }
    if (phone && (typeof +phone !== "number" || parseInt(phone) !== +phone)) {
      setError({ phone: true, Error: "Enter a valid phone number" });
      setTimeout(() => {
        setError(null);
      }, 3000);
      setIsLoading(false);
      return;
    }
    if (!isEmail(email)) {
      setError({ email: true, Error: "Enter a valid email" });
      setTimeout(() => {
        setError(null);
      }, 3000);
      setIsLoading(false);
      return;
    }

    try {
      const data = await updateProfile({
        firstName,
        lastName,
        email,
        phone,
        country,
        state,
        city,
        address,
      });
      if (data) {
        dispatch(setUserInfo(data));
        localStorage.setItem(
          "account",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("account")),
            data: data,
          })
        );
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setEmail(data.email);
        data.city && setCity(data.city);
        data.country && setCountry(data.country);
        data.state && setState(data.state);
        data.address && setAddress(data.address);
        data.phone && setPhone(data.phone);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (!phone) {
        setError({ phone: true, Error: "Enter your phone number" });
        setTimeout(() => {
          setError(null);
        }, 3000);
        setIsLoading(false);
        return;
      }
      if (phone && !isMobilePhone(phone, "ar-DZ")) {
        setError({ phone: true, Error: "Enter a valid phone number" });
        setTimeout(() => {
          setError(null);
        }, 3000);
        setIsLoading(false);
        return;
      }
      if (phone && !phoneExist) {
        const data = await updateProfile({
          phone,
        });
        if (!data)
          throw new Error("Unexpected error occured. Please try again");

        dispatch(setUserInfo(data));
        localStorage.setItem(
          "account",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("account")),
            data: data,
          })
        );
      }

      if (!country || !country._id) {
        setError({ country: true, Error: "Select a country" });
        setTimeout(() => {
          setError(null);
        }, 3000);
        setIsLoading(false);
        return;
      }
      if (!state || !state._id) {
        setError({ state: true, Error: "Select a state" });
        setTimeout(() => {
          setError(null);
        }, 3000);
        setIsLoading(false);
        return;
      }
      if (!city) {
        setError({ city: true, Error: "Enter a city" });
        setTimeout(() => {
          setError(null);
        }, 3000);
        setIsLoading(false);
        return;
      }
      if (!address) {
        setError({ address: true, Error: "Enter the address to deliver to" });
        setTimeout(() => {
          setError(null);
        }, 3000);
        setIsLoading(false);
        return;
      }
      if (!checked) {
        setError({ checked: true, Error: "Select a paymant Method" });
        setTimeout(() => {
          setError(null);
        }, 3000);
        setIsLoading(false);
        return;
      }

      if (!cart || !cart.items || !Array.isArray(cart.items))
        throw new Error("Select items before rdering");

      const order = await newOrder({
        products: cart.items,
        city,
        country: country._id,
        state: state._id,
        address,
      });

      if (order) {
        setOrder(order);
        dispatch(clearCart());
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleGetCountries = async () => {
    try {
      const data = await getCountries();
      if (data) {
        setCountries(data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handlegetCartTotalPrice = async () => {
    try {
      const data = await getCartTotalPrice({ items: cart?.items });
      if (data) {
        setTotalPrice(data.totalPrice);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ Error: error.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  useEffect(() => {
    return async () => {
      await getProfileData();
      await handleGetCountries();
      await handlegetCartTotalPrice();
    };
  }, []);

  return (
    <main className="flex flex-col justify-start px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14 mt-150 min-h-screen">
      {order && (
        <div className="w-full h-full flex justify-center items-center pt-[60px]">
          <div className="w-full md:w-1/3 bg-bg rounded-sm p-5 flex flex-col gap-2">
            <p>
              ID:{" "}
              <span className="text-[black] text-opacity-45">{order?._id}</span>
            </p>
            <p>
              Client:{" "}
              <span className="text-[black] text-opacity-45">
                {order?.client?.firstName} {order?.client?.lastName}
              </span>
            </p>
            <p>
              Email:{" "}
              <span className="text-[black] text-opacity-45">
                {order?.client?.email}
              </span>
            </p>
            <p>
              Phone:{" "}
              <span className="text-[black] text-opacity-45">
                {order?.client?.phone}
              </span>
            </p>
            <p>
              TotalCost:{" "}
              <span className="text-[black] text-opacity-45">
                {order?.totalCost} DZD
              </span>
            </p>
            <p>
              Shipping date:{" "}
              <span className="text-[black] text-opacity-45">
                {order?.shippingDate
                  ? order?.shippingDate
                  : "Shipping date not yet available"}
              </span>
            </p>
            <p>
              Shipping fees:{" "}
              <span className="text-[black] text-opacity-45">
                {order?.shippingFees} DZD
              </span>
            </p>
            <button
              type={"button"}
              onClick={() => {
                if (order._id) {
                  router.push(`/orders/${order._id}`, { scroll: true});
                }
              }}
              className="capitalize pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white w-1/2 mt-4 self-center"
            >
              Show Details
            </button>
          </div>
        </div>
      )}
      {!order && (
        <>
          <h2 className="text-[32px] font-semibold mb-4 capitalize">
            checkout
          </h2>
          <form
            onSubmit={handlePlaceOrder}
            className="flex flex-col justify-center md:flex-row gap-x-4 gap-y-14"
          >
            <div
              onSubmit={handleupdateProfile}
              className="grid grid-cols-4 w-full gap-4 h-fit"
            >
              <div className="col-span-4 h-10">
                {error && (
                  <div className="max-md:w-full error bg-red-200 text-red-500 h-10 rounded-sm px-4 flex items-center text-xs gap-2">
                    <MdErrorOutline className="size-4" />
                    {error?.Error}
                  </div>
                )}
              </div>

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
                className={`${
                  error?.firstName ? "outline-red-400 " : ""
                } h-10 bg-input outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm`}
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
                className={`${
                  error?.lastName ? "outline-red-400 " : ""
                } h-10 bg-input outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm`}
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
                className={`${
                  error?.phone ? "outline-red-400 " : ""
                } h-10 bg-input outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm`}
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
                className={`${
                  error?.email ? "outline-red-400 " : ""
                } h-10 bg-input outline-none col-span-4 md:col-span-2 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm`}
              />
              <div className="md:col-span-2 col-span-4 relative">
                <button
                  type="button"
                  onClick={() => {
                    setOpenCountrySelect((prev) => !prev);
                    setOpenStateSelect(false);
                  }}
                  className="flex justify-between h-10 items-center px-4 bg-input text-sm py-1 capitalize font-medium w-full"
                >
                  {country?.country ? country?.country : "country"}
                  {openCountrySelect ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </button>
                {openCountrySelect && (
                  <ul className="absolute top-full z-10 min-w-28 bg-[#EEEFF1] w-full">
                    {countries.map((country) => (
                      <li key={country?._id}>
                        <button
                          type="button"
                          onClick={() => {
                            setCountry(country);
                            setState("");
                            setOpenCountrySelect(false);
                          }}
                          className="btn px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                        >
                          {country?.country}
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
                  }}
                  className="flex justify-between h-10 items-center px-4 bg-input text-sm py-1 capitalize font-medium w-full"
                >
                  {state?.state ? state?.state : "state"}
                  {openStateSelect ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </button>
                {openStateSelect && (
                  <ul className="absolute top-full z-10 min-w-28 bg-[#EEEFF1] w-full">
                    {country?.states ? (
                      country.states.map((state) => (
                        <li key={state?._id}>
                          <button
                            type="button"
                            onClick={() => {
                              setState(state);
                              setOpenStateSelect(false);
                            }}
                            className="btn px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                          >
                            {state?.state}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenStateSelect(false);
                          }}
                          className="btn px-2 py-1 hover:bg-[#E2E3E5] transition-colors duration-100 text-left capitalize text-[12px] w-full"
                        >
                          Choose a country
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
              <label htmlFor="address" className="sr-only">
                City:
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className={`${
                  error?.city ? "outline-red-400 " : ""
                } h-10 bg-input outline-none col-span-2 md:col-span-1 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm `}
              />
              <label htmlFor="address" className="sr-only">
                Full Address:
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full Address"
                className={`${
                  error?.address ? "outline-red-400 " : ""
                } h-10 bg-input outline-none col-span-4 placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm"`}
              />
            </div>
            <div className="">
              <div className="md:w-[30vw] lg:w-[25vw] w-full">
                <div
                  className={`w-full border-2 border-[#E8E9EB]  dark:bg-darkBg dark:border-[#8C8C8C] dark:border-opacity-40 h-fit capitalize mt-14`}
                >
                  <h4 className="px-5 font-semibold text-lg py-3">
                    Your order
                  </h4>
                  <hr className="border-[1.5px] border-[#E8E9EB] dark:border-[#8C8C8C] dark:border-opacity-40 mx-5" />
                  <div className="flex items-center justify-between px-5 py-3 text-sm font-medium">
                    <p>Subtotal</p>
                    <p className="font-semibold">
                      {totalPrice ? totalPrice : 0} DZD
                    </p>
                  </div>
                  <hr className="border-[1.5px] border-[#E8E9EB] dark:border-[#8C8C8C] dark:border-opacity-40 mx-5" />
                  <div className="flex items-start justify-between gap-4 px-5 py-3 text-sm font-medium">
                    <p>shipping</p>
                    <p className="font-semibold w-fit text-justify">
                      {JSON.stringify(state?.shippingFees)
                        ? `${state?.shippingFees} DZD`
                        : "based on address"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-5 py-3 text-sm font-medium bg-[#E8E9EB] dark:bg-[#8C8C8C]">
                    <p>Total</p>
                    <p className="font-semibold">
                      {state?.shippingFees
                        ? totalPrice
                          ? totalPrice + state.shippingFees
                          : state.shippingFees
                        : totalPrice
                        ? totalPrice
                        : 0}{" "}
                      DZD
                    </p>
                  </div>
                </div>
                <div className="my-2">
                  <h4 className="font-semibold">Paymant method</h4>
                  <label
                    htmlFor="paymantMethod"
                    className="ml-4 flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      name="paymantMethod"
                      id="paymantMethod"
                      value={"cash on delivery"}
                      checked={checked}
                      onChange={() => setChecked((prev) => !prev)}
                    />
                    Cash on delivery
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="uppercase disabled:opacity-55 disabled:cursor-not-allowed pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white w-full mt-4"
                >
                  place order
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </main>
  );
}
