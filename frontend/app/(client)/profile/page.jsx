"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { filter } from "@/constants";
import AuthProvider from "@/context/AuthContext";
import { clearCart } from "@/lib/features/cart/cartSlice";
import { resetUserInfo, setUserInfo } from "@/lib/features/user/userSlice";
import { getCountries } from "@/services/countries";
import { getProfile, logout, updateProfile } from "@/services/user";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { MdErrorOutline, MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { isEmail, isMobilePhone } from "validator";

export default function Profile() {
  const [openCountrySelect, setOpenCountrySelect] = useState(false);
  const [openStateSelect, setOpenStateSelect] = useState(false);
  const [openCitySelect, setOpenCitySelect] = useState(false);
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
  const [countries, setCountries] = useState([]);
  const [done, setDone] = useState("");

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    document.body.addEventListener("click", (e) => {
      if (!e.target.classList.contains("btn")) {
        setOpenCountrySelect(false);
        setOpenStateSelect(false);
        setOpenCitySelect(false);
      }
    });
  }, []);

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

  const handleupdateProfile = async (e) => {
    e.preventDefault();
    if (!firstName) {
      setError({ firstName: true, Error: "First name is required" });
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    if (!lastName) {
      setError({ lastName: true, Error: "Last name is required" });
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    if (phone && !isMobilePhone(phone, "ar-DZ")) {
      setError({ phone: true, Error: "Enter a valid phone number" });
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    if (!isEmail(email)) {
      setError({ email: true, Error: "Enter a valid email" });
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }

    try {
      const data = await updateProfile({
        firstName,
        lastName,
        email,
        phone,
        country: country?._id,
        state: state?._id,
        city,
        address,
      });
      if (data) {
        setDone("Profile updated seccessfully");
        setTimeout(() => {
          setDone("");
        }, 3000);
        dispatch(setUserInfo(data));
        localStorage.setItem(
          "account",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("account")),
            data: data,
          })
        );
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError({ handlers: true, Error: error?.message });
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const getProfileData = async () => {
    try {
      setIsLoading(true);
      const data = await getProfile();
      if (data) {
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
      const err = JSON.parse(error?.message);
      if (err.status === 401) {
        setError("Unauthorized");
        setTimeout(() => {
          router.push("/account/sign-in", { scroll: true});
        }, 2000);
      } else {
        setError({ handlers: true, Error: err?.message });
      }
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      setFirstName("");
      setLastName("");
      setEmail("");
      setAddress("");
      setCity("");
      setState("");
      setCountry("");
      setPhone("");
      dispatch(resetUserInfo());
      dispatch(clearCart());
      localStorage.removeItem("cart");
      router.push("/account/sign-in", { scroll: true});
    } catch (error) {
      setIsLoading(false);
      setError({ handlers: true, Error: error?.message });
    }
  };

  useEffect(() => {
    return async () => {
      await getProfileData();
      await handleGetCountries();
    };
  }, []);

  return (
    <AuthProvider>
      <ProtectedRoute>
        <main className="flex flex-col justify-start gap-y-14 px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pb-14 mt-150 min-h-screen mb-14">
          <h2 className="text-[32px] font-semibold capitalize">profile</h2>
          <form
            onSubmit={handleupdateProfile}
            className="flex justify-center items-center gap-4 flex-col"
          >
            <div className=" grid grid-cols-4 w-full gap-x-4">
              {error?.handlers ? (
                <div className="col-span-4">
                  <div className="max-md:w-full error bg-red-200 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                    <MdErrorOutline className="size-4" />
                    {error?.Error}
                  </div>
                </div>
              ) : (
                done && (
                  <div className="col-span-4">
                    <div className="max-md:w-full error bg-blue-100 text-blue-900 py-3 rounded-sm px-4 flex items-center text-xs gap-2">
                      <MdErrorOutline className="size-4" />
                      {done}
                    </div>
                  </div>
                )
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="col-span-4 text-end capitalize underline text-sm font-lato font-medium mb-3"
              >
                Log out
              </button>
              <div className="col-span-4 md:col-span-2">
                <label htmlFor="firstName" className="sr-only">
                  First Name:
                </label>
                <input
                  type="text"
                  name="FirstName"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  className={`${
                    error?.firstName ? "outline-red-400 " : ""
                  } h-10 w-full bg-input outline-none placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm`}
                />

                <p className="text-red-400 h-[10px] text-[10px] mt-1">
                  {error?.firstName ? error?.Error : ""}
                </p>
              </div>
              <div className="col-span-4 md:col-span-2">
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
                  } h-10 bg-input outline-none w-full placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm`}
                />
                <p className="text-red-400 h-[10px] text-[10px] mt-1">
                  {error?.lastName ? error?.Error : ""}
                </p>
              </div>
              <div className="col-span-4 md:col-span-2 mt-[6px]">
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
                  } h-10 bg-input outline-none w-full placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm`}
                />
                <p className="text-red-400 h-[10px] text-[10px] mt-1">
                  {error?.phone ? error?.Error : ""}
                </p>
              </div>
              <div className="col-span-4 md:col-span-2 mt-[6px]">
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
                  } h-10 bg-input outline-none w-full placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm`}
                />
                <p className="text-red-400 h-[10px] text-[10px] mt-1">
                  {error?.email ? error?.Error : ""}
                </p>
              </div>
              <div className="col-span-4 md:col-span-2 relative mt-[6px]">
                <button
                  type="button"
                  onClick={() => {
                    setOpenCountrySelect((prev) => !prev);
                    setOpenStateSelect(false);
                    setOpenCitySelect(false);
                  }}
                  className="flex justify-between h-10 items-center px-4 bg-input text-sm py-1 capitalize font-medium w-full"
                >
                  {country?.country ? country.country : "country"}
                  <MdKeyboardArrowDown />
                </button>
                {openCountrySelect && (
                  <ul className="absolute top-10/12 z-10 min-w-28 bg-[#EEEFF1] w-full">
                    {countries?.map((country) => (
                      <li key={country?._id}>
                        <button
                          type="button"
                          onClick={() => {
                            setCountry(country);
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
              <div className="col-span-2 md:col-span-1 relative mt-[6px]">
                <button
                  type="button"
                  onClick={() => {
                    setOpenStateSelect((prev) => !prev);
                    setOpenCountrySelect(false);
                    setOpenCitySelect(false);
                  }}
                  className="flex justify-between h-10 items-center px-4 bg-input text-sm py-1 capitalize font-medium w-full"
                >
                  {state?.state ? state.state : "state"}
                  <MdKeyboardArrowDown />
                </button>
                {openStateSelect && (
                  <ul className="absolute top-10/12 z-10 min-w-28 bg-[#EEEFF1] w-full">
                    {country?.states?.map((state) => (
                      <li key={state?._id}>
                        {" "}
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
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-span-2 md:col-span-1 mt-[6px]">
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
                  } h-10 bg-input outline-none w-full placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm `}
                />
                <p className="text-red-400 h-[10px] text-[10px] mt-1">
                  {error?.city ? error?.Error : ""}
                </p>
              </div>
              <div className="col-span-4 mt-[6px]">
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
                  className={` h-10 w-full bg-input outline-none placeholder:text-gray placeholder:text-sm text-sm font-medium px-4 rounded-sm`}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-4 w-full">
              <button
                type="submit"
                className="capitalize w-full md:w-1/4 xl:w-1/5 pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white"
              >
                Update Profile
              </button>
              {/* <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="capitalize w-full md:w-1/4 xl:w-1/5 pt-2 pb-[11px] bg-yellow text-white"
              >
                Dashboard
              </button> */}
              <button
                type="button"
                onClick={() => router.push("/orders", { scroll: true})}
                className="capitalize flex justify-center items-center gap-2 transition-all hover:gap-3 duration-500 w-full md:w-1/3 lg:w-1/4 xl:w-1/5 pt-[11px] pb-3 font-medium bg-gray hover:bg-grayHover text-sm text-white"
              >
                My Orders
                <GoArrowRight className="text-lg" />
              </button>
            </div>
          </form>
        </main>
      </ProtectedRoute>
    </AuthProvider>
  );
}
