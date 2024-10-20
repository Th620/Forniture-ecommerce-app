"use client";

import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="w-full h-screen md:grid md:grid-cols-12 flex justify-center items-center overflow-hidden px-10 lg:px-75 xl:px-150 bg-left-bottom max-md:bg-blend-soft-light bg-blueBg bg-small-hero md:bg-hero-bg bg-cover">
      <div className="md:col-span-5 md:col-start-8 md:content-center flex flex-col justify-center items-center xl:items-start">
        <h1 className="text-[40px] leading-tight text-black font-semibold font-montserrat max-xl:text-center">
          Elevate Your Home <br /> Modern Furniture
        </h1>
        <button
          type="button"
          onClick={() => router.push("/products", { scroll: true})}
          className="mt-7 px-8 pt-2 pb-[11px] bg-navy hover:bg-navyHover transition-colors duration-75 text-white"
        >
          Shop Now
        </button>
      </div>
    </section>
  );
};

export default Hero;
