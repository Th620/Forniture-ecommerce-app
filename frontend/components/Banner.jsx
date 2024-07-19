import React from "react";
import { GoArrowRight } from "react-icons/go";

const Banner = () => {
  return (
    <section className="flex flex-col justify-start gap-y-3 md:justify-center items-center md:items-start bg-beige bg-banner bg-contain md:bg-right-top bg-bottom bg-no-repeat h-[400px] sm:h-[500px] md:h-fit px-10 md:px-75 lg:px-150 text-black py-14">
      <h2 className="text-[32px] font-semibold leading-tight">
        Customizable Designs From <br />
        <span className="text-yellow">Sustainable</span> Materials
      </h2>
      <button
        type="button"
        className="flex justify-center items-center gap-x-1 hover:gap-x-2 transition-all duration-150 text-sm text-gray"
      >
        Order Now <GoArrowRight />
      </button>
    </section>
  );
};

export default Banner;
