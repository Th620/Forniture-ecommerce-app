import React from "react";

const Hero = () => {
  return (
    <section className="w-full h-screen grid grid-cols-12 overflow-hidden bg-hero-bg bg-cover">
      <div className="col-span-5 col-start-8 content-center">
      <h1 className="text-[48px] leading-none text-black font-semibold font-montserrat">Elevate Your Home Modern Furniture</h1>
        <button type="button" className="mt-7 px-8 pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white">Shop Now</button>
      </div>
    </section>
  );
};

export default Hero;
