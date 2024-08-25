"use client";

import { setUserInfo } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hook";
import { register } from "@/services/user";
import Link from "next/link";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function signUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!firstName) {
      setError({ firstName: true, Error: "first name is required" });
      setIsLoading(false);
      return;
    }

    if (!lastName) {
      setError({ lastName: true, Error: "last name is required" });
      setIsLoading(false);
      return;
    }

    if (!isEmail(email)) {
      setError({ email: true, Error: "please enter a valid email" });
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError({ password: true, Error: "password is required" });
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError({
        password: true,
        Error: "password must be 8 caracters or less",
      });
      setIsLoading(false);
      return;
    }

    setError({});

    try {
      const data = await register({ email, password, firstName, lastName });

      setFirstName("");
      setLastName("");
      setEmail("");
      setError({});
      setPassword("");

      if (data) {
        dispatch(setUserInfo(data));
        localStorage.setItem(
          "account",
          JSON.stringify({
            data,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
          })
        );
      }

      router.push("/");
    } catch (error) {
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setIsLoading(false);
      setError({ form: true, Error: error.message });
      setTimeout(() => setError({}), 3000);
      return;
    }
  };
  return (
    <main className="flex justify-center w-full px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white pt-150 min-h-screen">
      <div className="grid grid-cols-4 w-full h-fit">
        <h2 className="text-[32px] font-semibold capitalize col-span-4 text-center mb-14">
          Sign up
        </h2>

        <form
          onSubmit={handelSubmit}
          className="col-span-4 md:col-span-2 md:col-start-2 flex flex-col"
        >
          {error.form && (
            <div className="w-full bg-red-200 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2 mb-4">
              <MdErrorOutline className="size-4" />
              {error.Error}
            </div>
          )}
          <label htmlFor="firstName" className="sr-only">
            First Name:
          </label>
          <input
            type="text"
            name="FirstName"
            id="firstName"
            value={firstName}
            placeholder="First Name"
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            className={`h-10 bg-input outline-none w-full text-sm font-medium placeholder:text-gray placeholder:text-sm px-4 rounded-sm ${
              error.firstName ? "outline-red-400 " : ""
            }`}
          />
          {error.firstName && (
            <p className="text-red-400 text-[10px] mt-1">{error.Error}</p>
          )}

          <label htmlFor="lastName" className="sr-only">
            Last Name:
          </label>
          <input
            type="text"
            name="LastName"
            id="lastName"
            value={lastName}
            placeholder="Last Name"
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            className={`h-10 bg-input outline-none w-full text-sm font-medium placeholder:text-gray placeholder:text-sm px-4 mt-4 rounded-sm ${
              error.lastName ? "outline-red-400 " : ""
            }`}
          />
          {error.lastName && (
            <p className="text-red-400 text-[10px] mt-1">{error.Error}</p>
          )}

          <label htmlFor="email" className="sr-only">
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className={`h-10 bg-input outline-none w-full text-sm font-medium placeholder:text-gray placeholder:text-sm px-4 mt-4 rounded-sm ${
              error.email ? "outline-red-400 " : ""
            }`}
          />
          {error.email && (
            <p className="text-red-400 text-[10px] mt-1">{error.Error}</p>
          )}

          <label htmlFor="password" className="sr-only">
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className={`h-10 bg-input outline-none w-full text-sm font-medium placeholder:text-gray placeholder:text-sm px-4 mt-4 rounded-sm ${
              error.password ? "outline-red-400 " : ""
            }`}
          />
          {error.password && (
            <p className="text-red-400 text-[10px] mt-1">{error.Error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="bg-navy transition-colors duration-150 disabled:cursor-not-allowed hover:bg-navyHover py-2 px-14 text-white font-lato my-7 font-medium self-center disabled:opacity-50"
          >
            Sign up
          </button>
        </form>
        <p className="col-span-4 text-center text-sm">
          You already have an account?{" "}
          <Link
            href={"/account/sign-in"}
            className="text-navy font-semibold capitalize"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
