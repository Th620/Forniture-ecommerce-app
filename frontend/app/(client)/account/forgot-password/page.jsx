"use client";

import { forgotPassword } from "@/services/user";
import React, { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import { isEmail } from "validator";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  let user = useSelector((state) => state.user);

  const handleForgotPassword = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (user.userInfo) {
        throw new Error("You're already logged in");
      }

      if (!isEmail(email)) {
        setError({ email: true, Error: "please enter a valid email" });
        setIsLoading(false);
        return;
      }

      await forgotPassword({ email });
      setEmail("");
      setDone(true);
      setIsLoading(false);
    } catch (error) {
      setEmail("");
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError({}), 3000);
      return;
    }
  };
  return (
    <main className="flex justify-center items-center w-full px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white min-h-screen">
      {done ? (
        <div>Reset Password Email sent</div>
      ) : (
        <div className="grid grid-cols-4 w-full h-fit">
          <h2 className="text-[32px] font-semibold capitalize col-span-4 text-center mb-14">
            Forgot Password
          </h2>
          <form
            onSubmit={handleForgotPassword}
            className="col-span-4 md:col-span-2 md:col-start-2 flex flex-col items-center"
          >
            {error && !error.email && (
              <div className="w-full bg-red-200 text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2 mb-4">
                <MdErrorOutline className="size-4" />
                {error}
              </div>
            )}
            <label htmlFor="email" className="sr-only">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`h-10 bg-input outline-none w-full text-sm font-medium placeholder:text-gray placeholder:text-sm px-4 rounded-sm ${
                error.email ? "outline-red-400 " : ""
              }`}
            />
            {error.email && (
              <p className="text-red-400 text-[10px] mt-1 w-full text-start">
                {error.Error}
              </p>
            )}
            <div className="flex flex-col mt-7">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-navy transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-navyHover py-2 px-14 text-white font-lato font-medium"
              >
                Reset Password
              </button>
              <button
                type="button"
                className=" py-2 px-14 text-navy font-lato font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
