"use client";

import { setUserInfo } from "@/lib/features/user/userSlice";
import { useAppDispatch } from "@/lib/hook";
import { login } from "@/services/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import isEmail from "validator/lib/isEmail";

export default function signIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(isEmail(email));

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
      const data = await login({ email, password });

      setEmail("");
      setError({});
      setPassword("");

      if (data) {
        dispatch(setUserInfo(data));
        localStorage.setItem(
          "account",
          JSON.stringify({ data, expiresAt: Date.now() + 10 * 24 * 60 * 60 * 1000 })
        );
      }

      router.push("/");
    } catch (error) {
      setEmail("");
      setPassword("");
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
          Sign in
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
            className={`h-10 bg-input outline-none w-full text-sm font-medium placeholder:text-gray placeholder:text-sm px-4 rounded-sm ${
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
          <Link
            href={"forgot-password "}
            className="w-full text-start text-xs mt-1 text-navy"
          >
            Forgot password?
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-navy disabled:cursor-not-allowed hover:bg-navyHover py-2 px-14 text-white font-lato my-7 font-medium transition-colors duration-150 disabled:opacity-50 self-center"
          >
            Sign in
          </button>
        </form>
        <p className="col-span-4 text-center text-sm">
          You don't have an account?{" "}
          <Link
            href={"/account/sign-up"}
            className="text-navy font-semibold capitalize"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
