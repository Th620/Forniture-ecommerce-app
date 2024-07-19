import { Logo } from "@/constants";
import { footerSections } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { MdDone } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="grid grid-cols-12 gap-y-10 w-full py-10 px-10 md:px-75 lx:px-150 bg-blueBg text-black font-montserrat mt-14">
      <div className="sm:col-span-4 col-span-12 sm:order-last">
        <h6 className="font-semibold">Subscribe To Our Newsletter:</h6>
        <form className="relative flex items-center w-full h-8 my-4">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="rounded-sm w-full h-full text-[12px] outline-none bg-white pl-4 placeholder:text-lightGray text-black pr-10"
          />
          <button
            type="submit"
            className="absolute top-0 right-0 h-full aspect-square bg-navy hover:bg-navyHover transition-colors duration-75 rounded-e-sm flex justify-center items-center text-white"
          >
            <MdDone className="mb-[2px]" />
          </button>
        </form>
        <Link
          href="/"
          className="text-gray text-[12px] underline hidden sm:block"
        >
          Terms & Privacy Policy
        </Link>
      </div>
      <Link href={"/"} className="sm:col-span-2 col-span-6">
        <Image src={Logo} width={65} height={39} alt="logo" />
      </Link>
      {footerSections.map((item) => (
        <ul key={item.id} className="sm:col-span-2 col-span-6">
          <li className="font-semibold pb-2">{item.title}</li>
          <Link href={"/"}>
            <li className="text-sm py-1">{item.links[0]}</li>
          </Link>
          <Link href={"/"}>
            <li className="text-sm py-1">{item.links[1]}</li>
          </Link>
          <Link href={"/"}>
            <li className="text-sm py-1">{item.links[2]}</li>
          </Link>
        </ul>
      ))}

      <Link
        href="/"
        className=" text-slate-600 text-[12px] underline col-span-12 sm:hidden block"
      >
        Terms & Privacy Policy
      </Link>

      {/* <hr className="col-span-12 mb-1 mt-6 text-white opacity-70"/>
      <p className="col-span-12 text-[10px] text-center text-gray">2024 @ All right reserved</p> */}
    </footer>
  );
};

export default Footer;
