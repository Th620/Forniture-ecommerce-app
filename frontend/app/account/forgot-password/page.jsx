import React from "react";

export default function ForgotPassword() {
  return (
    <main className="flex justify-center items-center w-full px-10 md:px-75 lg:px-150 font-montserrat text-black bg-white min-h-screen">
      <div className="grid grid-cols-4 w-full h-fit">
        <h2 className="text-[32px] font-semibold capitalize col-span-4 text-center mb-14">
          Forgot Password
        </h2>
        <form className="col-span-4 md:col-span-2 md:col-start-2 flex flex-col items-center">
          <label htmlFor="email" className="sr-only">
            Email:
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            className="h-12 bg-input w-full font-medium placeholder:text-gray placeholder:text-base px-4 mb-4 rounded-sm outline-none"
          />
          <div className="flex flex-col mt-7">
            <button
              type="submit"
              className="bg-navy py-2 px-14 text-white font-lato font-medium"
            >
              Reset Password
            </button>
            <button
              type="submit"
              className=" py-2 px-14 text-navy font-lato font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
