"use client";

import { useState } from "react";
import { resetPassword } from "@/services/user";
import { useParams } from "next/navigation";
import { MdErrorOutline } from "react-icons/md";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { id, token } = useParams();

  const handelResetPassword = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      if (!password) {
        setError({ password: true, Error: "password is required" });
        return;
      }
      await resetPassword({ password, id, token });
      setPassword("");
      setDone(true);
      setIsLoading(false);
    } catch (error) {
      setPassword("");
      setIsLoading(false);
      setError(error.message);
      setTimeout(() => setError({}), 3000);
      return;
    }
  };

  return (
    <main className="flex justify-center items-center w-full px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white min-h-screen">
      {done ? (
        <div>Password Reset Successfully</div>
      ) : (
        <div className="grid grid-cols-4 w-full h-fit">
          <h2 className="text-[32px] font-semibold capitalize col-span-4 text-center mb-14">
            Reset Password
          </h2>
          <form
            onSubmit={handelResetPassword}
            className="col-span-4 md:col-span-2 md:col-start-2 flex flex-col items-center"
          >
            {error && !error.password && (
              <div className="w-full bg-red-200 capitalize text-red-500 py-3 rounded-sm px-4 flex items-center text-xs gap-2 mb-4">
                <MdErrorOutline className="size-4" />
                {error === "jwt expired"
                  ? "link expired"
                  : error === "invalid token"
                  ? "wrong link"
                  : error}
              </div>
            )}
            <label htmlFor="email" className="sr-only">
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className={`h-10 bg-input outline-none w-full text-sm font-medium placeholder:text-gray placeholder:text-sm px-4 rounded-sm ${
                error.password ? "outline-red-400 " : ""
              }`}
            />
            {error.password && (
              <p className="text-red-400 text-[10px] mt-1 w-full text-start">
                {error.Error}
              </p>
            )}
            <div className="flex flex-col mt-7">
              <button
                type="submit"
                className="bg-navy py-2  transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-navyHover px-14 text-white font-lato font-medium"
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
