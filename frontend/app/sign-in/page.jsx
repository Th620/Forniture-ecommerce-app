import Link from "next/link";
import React from "react";

export default function signIn() {
  return (
    <main className="flex justify-center w-full px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white py-14 pt-150 min-h-screen">
      <div className="grid grid-cols-4 w-full h-fit">
        <h2 className="text-[32px] font-semibold capitalize col-span-4 text-center mb-14">
          Sign in
        </h2>
        <form className="col-span-4 md:col-span-2 md:col-start-2 flex flex-col items-center">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="h-10 bg-input w-full placeholder:text-gray placeholder:text-sm px-4 mb-4 rounded-sm"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="h-10 bg-input w-full placeholder:text-gray placeholder:text-sm px-4 mb-4 rounded-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="h-10 bg-input w-full placeholder:text-gray placeholder:text-sm px-4 rounded-sm"
          />
          <Link href={""} className="w-full text-start text-xs mt-1 text-navy">
            Forgot password?
          </Link>
          <button
            type="submit"
            className="bg-navy py-2 px-14 text-white font-lato my-7 font-medium"
          >
            Sign in
          </button>
        </form>
        <p className="col-span-4 text-center text-xs">
          You don't have an account? <Link href={""} className="text-navy font-semibold capitalize">Sign up</Link>
        </p>
      </div>
    </main>
  );
}
