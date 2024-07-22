import React from "react";
import { GoArrowRight } from "react-icons/go";

const CardSection = () => {
  return (
    <section className="w-full flex flex-col justify-center sm:grid grid-cols-2 grid-rows-2 gap-4 px-10 md:px-75 lg:px-150 py-14 font-montserrat text-black bg-white">
      <div className="sm:col-span-1 sm:row-span-1 h-28 sm:h-full w-full bg-bg bg-lamp bg-left-top bg-contain bg-no-repeat flex justify-end items-center px-14 order-1">
        <h3 className="md:text-2xl h font-semibold">
          LAMP <br /> COLLECTION
        </h3>
      </div>
      <div className="aspect-square sm:col-span-1 sm:row-span-2 bg-sofa bg-contain bg-no-repeat bg-bg bg-left-bottom px-9 md:px-14 py-8 md:py-10">
        <h3 className="text-lg font-semibold">Sofa Collection</h3>
        <button
          type="button"
          className="flex justify-center items-center gap-x-1 hover:gap-x-2 transition-all duration-150 text-sm text-gray"
        >
          Shop Now <GoArrowRight />
        </button>
      </div>
      <div className="sm:col-span-1 sm:row-span-1 h-28 sm:h-full bg-bg px-9 md:px-12 flex items-center bg-cups bg-contain bg-no-repeat bg-right-top">
        <h3 className=" md:text-2xl">
          Shop Now <br />
          <span className="font-semibold">
            <span className="text-yellow"> Up to 50% Off </span>
            <br /> Accessories
          </span>
        </h3>
      </div>
    </section>
  );
};

export default CardSection;